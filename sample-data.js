// ─── Tạo dữ liệu MẪU (idempotent: xóa mẫu cũ rồi nạp lại) ────────────────────
// Metadata lưu vào Postgres (bảng evidence...); file vật lý ghi vào <DATA_DIR>/uploads
// (chính là volume ./.docker-data/app/uploads của container) để đưa lên VPS sau này.
// CSGD: phủ CẢ 15 tiêu chuẩn, đủ trạng thái chờ/xác nhận/trả lại, file + link.
// CTĐT: minh chứng + bộ CĐR (PEO/PLO/HP/CLO/ma trận/rubric/kế hoạch đo + điểm).
const { q, one, pool } = require('./db');
const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || __dirname;
const UP = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(UP, { recursive: true });

async function insId(sql, params) { return (await one(sql, params)).id; }

let seq = 0;
function makeFile(code, tc, desc) {
  seq++;
  const stored = `sample_${code}_${seq}.txt`;
  const content =
`MINH CHỨNG MẪU — Hệ thống KĐCLGD
Trường Đại học Kiến trúc Đà Nẵng
========================================
Mã minh chứng : ${code}
Tiêu chí       : ${tc}
Tên tài liệu   : ${desc}
----------------------------------------
Đây là tệp minh chứng MẪU (placeholder) dùng để minh hoạ quy trình nộp - duyệt.
Khi triển khai thật, đơn vị thay bằng văn bản chính thức (PDF/DOCX có chữ ký, dấu).
`;
  fs.writeFileSync(path.join(UP, stored), content, 'utf8');
  return { file_name: `${desc}.txt`, file_stored: stored, file_size: Buffer.byteLength(content, 'utf8'), mime: 'text/plain' };
}

async function main() {
  const csgd  = (await one("SELECT id FROM workspaces WHERE type='CSGD' ORDER BY id LIMIT 1")).id;
  const ctdt  = (await one("SELECT id FROM workspaces WHERE type='CTDT' ORDER BY id LIMIT 1")).id;
  const admin = (await one("SELECT id FROM users WHERE role='admin' ORDER BY id LIMIT 1")).id;
  const U = {}; for (const u of await q("SELECT id, code FROM units")) U[u.code] = u.id;

  // ── Xóa dữ liệu mẫu cũ + file mẫu cũ ──────────────────────────────────────
  const both = [csgd, ctdt];
  const oldFiles = await q("SELECT file_stored FROM evidence WHERE workspace_id = ANY($1) AND file_stored LIKE 'sample_%'", [both]);
  for (const f of oldFiles) { try { fs.unlinkSync(path.join(UP, f.file_stored)); } catch (e) {} }
  await q("DELETE FROM evidence WHERE workspace_id = ANY($1)", [both]);
  await q("DELETE FROM unit_criteria WHERE workspace_id = ANY($1)", [both]);
  for (const t of ['scores','plan_students','assessment_items','assessment_plans',
                   'clo_plo_map','course_plo_map','clos','courses','rubrics','plos','peos'])
    await q(`DELETE FROM ${t} WHERE workspace_id=$1`, [ctdt]);
  for (const t of ['assessments','kpi_data','tdg_plans','surveys','reports','school_info'])
    await q(`DELETE FROM ${t} WHERE workspace_id = ANY($1)`, [both]);   // tdg_plans/surveys cascade con

  const cnt = {};
  async function ev(ws, tc, unitCode, desc, status, src, note) {
    const std = parseInt(tc.split('.')[0]), tcso = parseInt(tc.split('.')[1]);
    const k = ws + '|' + tc; cnt[k] = (cnt[k] || 0) + 1;
    const code = `H${std}.${String(std).padStart(2,'0')}.${String(tcso).padStart(2,'0')}.${String(cnt[k]).padStart(2,'0')}`;
    const reviewed = status === 'da_xac_nhan' || status === 'tra_lai';
    let f = { source_type: 'link', file_name: null, file_stored: null, file_size: null, mime: null,
              link_url: 'https://drive.google.com/file/d/SAMPLE-' + code + '/view' };
    if (src === 'file') { const m = makeFile(code, tc, desc); f = { source_type: 'file', ...m, link_url: null }; }
    await q(`INSERT INTO evidence(workspace_id,code,tieu_chuan,tieu_chi,tieu_chi_so,thu_tu,mo_ta,nguon,
        source_type,file_name,file_stored,file_size,mime_type,link_url,unit_id,uploaded_by,status,reviewed_by,reviewed_at,review_note)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,${reviewed?'now()':'NULL'},$19)`,
      [ws, code, std, tc, tcso, cnt[k], desc, unitCode ? ('Đơn vị: ' + unitCode) : '',
       f.source_type, f.file_name, f.file_stored, f.file_size, f.mime, f.link_url,
       unitCode ? U[unitCode] : null, admin, status, reviewed ? admin : null, note || '']);
  }
  // Phân công: gộp (đơn vị, tiêu chí) từ danh sách minh chứng + phần bổ sung "chưa nộp"
  async function assignFrom(ws, evList, extra) {
    const seen = new Set();
    for (const [tc, u] of evList) if (u) seen.add(u + '|' + tc);
    for (const [u, tc] of (extra || [])) seen.add(u + '|' + tc);
    for (const key of seen) {
      const [u, tc] = key.split('|');
      await q("INSERT INTO unit_criteria(workspace_id,unit_id,tieu_chi) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING", [ws, U[u], tc]);
    }
  }

  // ═══ CSGD — phủ cả 15 tiêu chuẩn ════════════════════════════════════════
  const EV_CSGD = [
    ['1.1','PTCHC','Nghị quyết ban hành tầm nhìn, sứ mạng của Nhà trường','da_xac_nhan','file'],
    ['1.2','PTCHC','Quy chế tổ chức và hoạt động của Trường','da_xac_nhan','file'],
    ['1.4','PTCHC','Kế hoạch truyền thông tầm nhìn, sứ mạng đến các bên liên quan','cho_duyet','link'],
    ['2.1','PTCHC','Sơ đồ cơ cấu tổ chức và quy định chức năng, nhiệm vụ','da_xac_nhan','file'],
    ['2.3','PTCHC','Kế hoạch chiến lược phát triển Trường giai đoạn 2025-2030','da_xac_nhan','file'],
    ['3.1','PTCHC','Kế hoạch tuyển dụng và quy hoạch đội ngũ nhân sự','da_xac_nhan','file'],
    ['3.2','PTCHC','Quy trình đánh giá, xếp loại viên chức hằng năm','tra_lai','file','Cần bổ sung minh chứng của năm gần nhất.'],
    ['3.3','PTCHC','Kế hoạch đào tạo, bồi dưỡng phát triển giảng viên','cho_duyet','link'],
    ['4.1','PKHTC','Báo cáo tài chính năm 2024','da_xac_nhan','file'],
    ['4.2','PKHTC','Danh mục cơ sở vật chất và phòng thực hành','da_xac_nhan','file'],
    ['4.4','PKHTC','Báo cáo hạ tầng công nghệ thông tin và chuyển đổi số','cho_duyet','file'],
    ['5.1','PKHCN','Biên bản ghi nhớ hợp tác với doanh nghiệp và đối tác','da_xac_nhan','file'],
    ['6.1','PDT','Quy định tuyển sinh trình độ đại học năm 2025','da_xac_nhan','file'],
    ['6.1','PDT','Thông báo tuyển sinh và chỉ tiêu các ngành','da_xac_nhan','link'],
    ['6.2','PDT','Chương trình đào tạo các ngành (bản ban hành)','da_xac_nhan','file'],
    ['6.2','PDT','Biên bản họp Hội đồng thẩm định chương trình đào tạo','cho_duyet','file'],
    ['6.3','KCNTT','Đề cương chi tiết học phần năm học 2024-2025','da_xac_nhan','file'],
    ['6.3','KCNTT','Kế hoạch giảng dạy của Khoa Công nghệ thông tin','da_xac_nhan','file'],
    ['6.3','KCNTT','Báo cáo dự giờ và đánh giá hoạt động giảng dạy','cho_duyet','link'],
    ['6.4','PDT','Quy định kiểm tra, đánh giá kết quả học tập','da_xac_nhan','file'],
    ['6.4','PDT','Ma trận đề thi và ngân hàng câu hỏi mẫu','tra_lai','file','File thiếu chữ ký và dấu; bổ sung bản có phê duyệt của lãnh đạo.'],
    ['6.5','PCTSV','Quy chế công tác sinh viên','da_xac_nhan','file'],
    ['6.5','PCTSV','Báo cáo hoạt động hỗ trợ và tư vấn người học','cho_duyet','link'],
    ['6.6','PDT','Quy định quản lý hồ sơ và thông tin người học','da_xac_nhan','file'],
    ['7.1','PKHCN','Chiến lược phát triển khoa học công nghệ','da_xac_nhan','file'],
    ['7.2','PKHCN','Quy định quản lý hoạt động đề tài nghiên cứu khoa học','da_xac_nhan','file'],
    ['7.4','KCNTT','Danh mục bài báo và sản phẩm NCKH của giảng viên','cho_duyet','file'],
    ['8.1','PKHCN','Chính sách kết nối và phục vụ cộng đồng','da_xac_nhan','file'],
    ['8.2','PKHCN','Báo cáo hoạt động phục vụ cộng đồng','cho_duyet','link'],
    ['9.1','PDBCL','Quy định hệ thống bảo đảm chất lượng bên trong','da_xac_nhan','file'],
    ['9.2','PDBCL','Quy trình bảo đảm chất lượng theo chu trình PDCA','da_xac_nhan','file'],
    ['9.3','PDBCL','Báo cáo giám sát và đánh giá chất lượng định kỳ','cho_duyet','file'],
    ['10.1','PDBCL','Quy định thu thập và quản lý dữ liệu bảo đảm chất lượng','da_xac_nhan','file'],
    ['10.2','PDBCL','Báo cáo công bố thông tin và cơ sở dữ liệu','cho_duyet','link'],
    ['11.1','PDBCL','Kế hoạch cải tiến chất lượng theo chu trình PDCA','da_xac_nhan','file'],
    ['11.2','PDBCL','Báo cáo đổi mới sáng tạo trong hoạt động đào tạo','cho_duyet','link'],
    ['12.1','PDT','Thống kê tỉ lệ tốt nghiệp theo khóa học','da_xac_nhan','file'],
    ['12.3','PDT','Báo cáo khảo sát việc làm sinh viên sau tốt nghiệp','da_xac_nhan','file'],
    ['13.1','PKHCN','Thống kê đề tài nghiên cứu khoa học các cấp','da_xac_nhan','file'],
    ['13.2','KCNTT','Danh mục công bố khoa học của giảng viên và sinh viên','cho_duyet','link'],
    ['14.1','PKHCN','Báo cáo hợp tác với doanh nghiệp','da_xac_nhan','file'],
    ['14.3','PKHCN','Báo cáo hoạt động phục vụ cộng đồng của Trường','cho_duyet','link'],
    ['15.1','PKHTC','Báo cáo hiệu quả sử dụng nguồn lực tài chính','da_xac_nhan','file'],
    ['15.2','PKHTC','Báo cáo uy tín và thương hiệu của Nhà trường','cho_duyet','link'],
  ];
  await assignFrom(csgd, EV_CSGD, [['PDT','12.2'],['PKHCN','5.2'],['PKHTC','4.3'],['PDBCL','9.4']]);
  for (const [tc, u, d, s, src, n] of EV_CSGD) await ev(csgd, tc, u, d, s, src, n);

  // ═══ CTĐT — minh chứng ══════════════════════════════════════════════════
  const EV_CTDT = [
    ['6.2','PDT','Chương trình đào tạo ngành CNTT khóa 2026 (bản ban hành)','da_xac_nhan','file'],
    ['6.2','PDT','Ma trận chuẩn đầu ra và học phần (curriculum map)','da_xac_nhan','file'],
    ['6.3','KCNTT','Đề cương chi tiết các học phần chuyên ngành','da_xac_nhan','file'],
    ['6.3','KCNTT','Bộ rubric đánh giá chuẩn đầu ra học phần (CLO)','cho_duyet','file'],
    ['6.4','KCNTT','Kế hoạch và kết quả đo lường CLO','cho_duyet','link'],
    ['7.4','KCNTT','Danh mục nghiên cứu khoa học của sinh viên','cho_duyet','link'],
    ['6.1','PDT','Đề án tuyển sinh ngành Công nghệ thông tin','tra_lai','file','Cập nhật số liệu chỉ tiêu mới nhất.'],
    ['9.1','PDBCL','Quy trình bảo đảm chất lượng chương trình đào tạo','da_xac_nhan','file'],
  ];
  await assignFrom(ctdt, EV_CTDT, [['KCNTT','6.5']]);
  for (const [tc, u, d, s, src, n] of EV_CTDT) await ev(ctdt, tc, u, d, s, src, n);

  // ═══ CTĐT — bộ CĐR (PEO/PLO/HP/CLO) ═════════════════════════════════════
  for (const [c, ct] of [
    ['PEO1','Có năng lực chuyên môn công nghệ thông tin, giải quyết được các vấn đề thực tiễn'],
    ['PEO2','Làm việc nhóm và giao tiếp hiệu quả, tuân thủ đạo đức nghề nghiệp'],
    ['PEO3','Học tập suốt đời và thích ứng với công nghệ mới']])
    await q("INSERT INTO peos(workspace_id,code,content) VALUES ($1,$2,$3)", [ctdt, c, ct]);

  const P = {};
  for (const [c, ct, bl, ty] of [
    ['PLO1','Vận dụng kiến thức toán, khoa học và cơ sở ngành để giải quyết bài toán CNTT','apply','knowledge'],
    ['PLO2','Thiết kế và xây dựng giải pháp phần mềm đáp ứng yêu cầu','apply','skill'],
    ['PLO3','Phân tích, đánh giá và lựa chọn giải pháp công nghệ phù hợp','analyze','skill'],
    ['PLO4','Sử dụng công cụ, nền tảng và công nghệ hiện đại trong phát triển hệ thống','apply','skill'],
    ['PLO5','Làm việc nhóm và giao tiếp chuyên nghiệp trong môi trường CNTT','apply','attitude'],
    ['PLO6','Thể hiện đạo đức nghề nghiệp và năng lực tự học suốt đời','understand','attitude']])
    P[c] = await insId("INSERT INTO plos(workspace_id,code,content,bloom_level,type) VALUES ($1,$2,$3,$4,$5) RETURNING id", [ctdt, c, ct, bl, ty]);

  const C = {}, CL = {};
  for (const [code, name, cr, sem, clos] of [
    ['IT101','Nhập môn lập trình',3,1,[
      ['CLO1','Trình bày cú pháp và cấu trúc cơ bản của ngôn ngữ lập trình','remember','knowledge'],
      ['CLO2','Viết chương trình giải quyết bài toán cơ bản','apply','skill'],
      ['CLO3','Gỡ lỗi và kiểm thử chương trình đơn giản','apply','skill']]],
    ['IT201','Cấu trúc dữ liệu và giải thuật',3,2,[
      ['CLO1','Giải thích các cấu trúc dữ liệu cơ bản','understand','knowledge'],
      ['CLO2','Cài đặt thuật toán trên cấu trúc dữ liệu phù hợp','apply','skill'],
      ['CLO3','Phân tích độ phức tạp của thuật toán','analyze','skill']]],
    ['IT301','Công nghệ phần mềm',3,4,[
      ['CLO1','Áp dụng quy trình phát triển phần mềm','apply','skill'],
      ['CLO2','Phân tích và đặc tả yêu cầu phần mềm','analyze','skill'],
      ['CLO3','Thiết kế kiến trúc phần mềm cho bài toán thực tế','create','skill']]]]) {
    C[code] = await insId("INSERT INTO courses(workspace_id,code,name,credits,semester,type) VALUES ($1,$2,$3,$4,$5,'core') RETURNING id", [ctdt, code, name, cr, sem]);
    for (const [cc, cct, bl, ty] of clos)
      CL[code + '.' + cc] = await insId("INSERT INTO clos(workspace_id,course_id,code,content,bloom_level,type) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id", [ctdt, C[code], cc, cct, bl, ty]);
  }

  await insId(`INSERT INTO rubrics(workspace_id,name,description,scale_type,levels)
    VALUES ($1,'Rubric A-D','Thang đánh giá 4 mức Yếu/Trung bình/Khá/Giỏi','A_D',$2) RETURNING id`,
    [ctdt, JSON.stringify([
      {name:'Yếu',is_pass:false,weight:25,description:'Chưa đạt yêu cầu tối thiểu'},
      {name:'Trung bình',is_pass:false,weight:25,description:'Đạt một phần yêu cầu'},
      {name:'Khá',is_pass:true,weight:25,description:'Đạt yêu cầu'},
      {name:'Giỏi',is_pass:true,weight:25,description:'Vượt yêu cầu'}])]);

  for (const [c, p, lv] of [['IT101','PLO1','I'],['IT101','PLO2','I'],['IT201','PLO1','R'],['IT201','PLO3','I'],
                            ['IT301','PLO2','R'],['IT301','PLO3','R'],['IT301','PLO5','I']])
    await q("INSERT INTO course_plo_map(workspace_id,course_id,plo_id,level) VALUES ($1,$2,$3,$4)", [ctdt, C[c], P[p], lv]);

  for (const [cl, p, w] of [['IT101.CLO1','PLO1',1],['IT101.CLO2','PLO2',1],['IT101.CLO3','PLO2',1],
                            ['IT201.CLO1','PLO1',1],['IT201.CLO2','PLO1',1],['IT201.CLO3','PLO3',1],
                            ['IT301.CLO1','PLO2',1],['IT301.CLO2','PLO3',1],['IT301.CLO3','PLO2',0.5],['IT301.CLO3','PLO5',1]])
    await q("INSERT INTO clo_plo_map(workspace_id,clo_id,plo_id,weight) VALUES ($1,$2,$3,$4)", [ctdt, CL[cl], P[p], w]);

  const plan = await insId(`INSERT INTO assessment_plans(workspace_id,course_id,name,semester,school_year,threshold_pct,pass_score_pct,status)
    VALUES ($1,$2,'IT101 — HK1 2025-2026',1,'2025-2026',75,50,'active') RETURNING id`, [ctdt, C['IT101']]);
  const it1 = await insId(`INSERT INTO assessment_items(workspace_id,plan_id,name,type,max_score,clo_targets)
    VALUES ($1,$2,'Bài kiểm tra giữa kỳ','test',10,$3) RETURNING id`,
    [ctdt, plan, JSON.stringify([{clo_id:CL['IT101.CLO1'],weight:40},{clo_id:CL['IT101.CLO2'],weight:60}])]);
  const it2 = await insId(`INSERT INTO assessment_items(workspace_id,plan_id,name,type,max_score,clo_targets)
    VALUES ($1,$2,'Thi cuối kỳ','test',10,$3) RETURNING id`,
    [ctdt, plan, JSON.stringify([{clo_id:CL['IT101.CLO2'],weight:50},{clo_id:CL['IT101.CLO3'],weight:50}])]);

  const sid = [];
  for (const [code, name] of [['SV2601','Nguyễn Văn An'],['SV2602','Trần Thị Bình'],['SV2603','Lê Hoàng Cường'],
                              ['SV2604','Phạm Thị Dung'],['SV2605','Võ Minh Đức'],['SV2606','Đặng Thu Hà']])
    sid.push(await insId("INSERT INTO plan_students(workspace_id,plan_id,code,full_name) VALUES ($1,$2,$3,$4) RETURNING id", [ctdt, plan, code, name]));
  const SC = [[8,9],[7,8],[5,6],[9,7],[4,5],[6,7]];
  for (let i = 0; i < sid.length; i++) {
    await q("INSERT INTO scores(workspace_id,item_id,plan_student_id,score) VALUES ($1,$2,$3,$4)", [ctdt, it1, sid[i], SC[i][0]]);
    await q("INSERT INTO scores(workspace_id,item_id,plan_student_id,score) VALUES ($1,$2,$3,$4)", [ctdt, it2, sid[i], SC[i][1]]);
  }

  // ═══ Thông tin trường (school_info) ═════════════════════════════════════
  const SCHOOL = {
    ten_truong: 'Trường Đại học Kiến trúc Đà Nẵng', ten_tieng_anh: 'Da Nang Architecture University',
    ma_truong: 'KTD', dia_chi: '566 Núi Thành, quận Hải Châu, TP. Đà Nẵng',
    website: 'https://dau.edu.vn', email: 'info@dau.edu.vn', dien_thoai: '0236 3624399',
    nam_thanh_lap: '2006', loai_hinh: 'Đại học tư thục', hieu_truong: 'Hiệu trưởng Nhà trường',
  };
  await q("INSERT INTO school_info(workspace_id,data) VALUES ($1,$2)", [csgd, JSON.stringify(SCHOOL)]);
  await q("INSERT INTO school_info(workspace_id,data) VALUES ($1,$2)", [ctdt, JSON.stringify({ ...SCHOOL, nganh: 'Công nghệ thông tin', khoa: 'Khóa 2026' })]);

  // ═══ Đánh giá tiêu chí (Biểu 04) ════════════════════════════════════════
  async function assess(ws, tc, kq, tt, nguoi) {
    const std = parseInt(tc.split('.')[0]);
    await q(`INSERT INTO assessments(workspace_id,tieu_chuan,tieu_chi,hien_trang,diem_manh,ton_tai,ke_hoach,ket_qua,trang_thai,nguoi_thuc_hien)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [ws, std, tc,
       `Nhà trường đã triển khai đầy đủ các hoạt động thuộc tiêu chí ${tc}, có hệ thống văn bản và minh chứng kèm theo.`,
       'Hệ thống văn bản, quy trình rõ ràng; được rà soát, cập nhật định kỳ; có sự tham gia của các bên liên quan.',
       kq === 'KHONG_DAT' ? 'Còn thiếu một số minh chứng và số liệu cập nhật của năm gần nhất.' : 'Một số minh chứng cần cập nhật số liệu mới nhất.',
       'Tiếp tục hoàn thiện minh chứng và cải tiến quy trình theo chu trình PDCA trong năm học tới.',
       kq, tt, nguoi || 'Nhóm chuyên trách tự đánh giá']);
  }
  const ASSESS_CSGD = [
    ['1.1','DAT','approved'],['1.2','DAT','approved'],['1.4','CHUA','draft'],
    ['2.1','DAT','approved'],['2.3','DAT','draft'],
    ['3.1','DAT','approved'],['3.2','KHONG_DAT','draft'],['3.3','CHUA','draft'],
    ['4.1','DAT','approved'],['4.2','DAT','approved'],['4.4','DAT','draft'],['5.1','DAT','draft'],
    ['6.1','DAT','approved'],['6.2','DAT','approved'],['6.3','DAT','approved'],
    ['6.4','KHONG_DAT','draft'],['6.5','DAT','draft'],['6.6','DAT','approved'],
    ['7.1','DAT','approved'],['7.2','DAT','approved'],['7.4','CHUA','draft'],
    ['8.1','DAT','draft'],['9.1','DAT','approved'],['9.2','DAT','approved'],['9.3','DAT','draft'],
    ['10.1','DAT','approved'],['11.1','DAT','draft'],
    ['12.1','DAT','approved'],['12.3','DAT','draft'],['13.1','DAT','draft'],['14.1','DAT','draft'],['15.1','DAT','approved'],
  ];
  for (const [tc, kq, tt] of ASSESS_CSGD) await assess(csgd, tc, kq, tt);
  for (const [tc, kq, tt] of [['6.2','DAT','approved'],['6.3','DAT','approved'],['7.4','CHUA','draft'],['9.1','DAT','draft']])
    await assess(ctdt, tc, kq, tt);

  // ═══ KPI (Biểu 16) — 3 năm học ══════════════════════════════════════════
  const KPI = {
    '2022-2023': { so_gv_co_huu:180, so_gv_tien_si:40, so_gv_thac_si:120, so_gv_gs_pgs:5, pct_gv_ts:22, so_cbql_nv:90,
      so_nguoi_hoc_dh:4500, so_nguoi_hoc_ths:120, so_nguoi_hoc_ts:8, so_ctdt_dh:15, so_ctdt_ths:3, so_ctdt_ts:1, so_ctdt_kiem_dinh:3,
      pct_tuyen_sinh:85, pct_nhap_hoc:80, pct_thoi_hoc:5, pct_tot_nghiep:88, pct_viec_lam_6t:70, pct_viec_lam_12t:85, pct_hai_long_sv:80,
      so_bao_isi_scopus:25, so_bao_trong_nuoc:60, so_bao_sv:10, so_dt_cap_nn:1, so_dt_cap_bo_tinh:4, so_dt_cap_co_so:20, so_dt_sv:15,
      so_sang_che:1, so_hoi_thao:3, so_giai_thuong_sv:5, so_may_tinh:400, so_dau_sach_in:8000, so_csdl_dien_tu:5 },
    '2023-2024': { so_gv_co_huu:195, so_gv_tien_si:48, so_gv_thac_si:128, so_gv_gs_pgs:6, pct_gv_ts:25, so_cbql_nv:95,
      so_nguoi_hoc_dh:4800, so_nguoi_hoc_ths:150, so_nguoi_hoc_ts:10, so_ctdt_dh:16, so_ctdt_ths:4, so_ctdt_ts:1, so_ctdt_kiem_dinh:5,
      pct_tuyen_sinh:90, pct_nhap_hoc:83, pct_thoi_hoc:4, pct_tot_nghiep:90, pct_viec_lam_6t:74, pct_viec_lam_12t:88, pct_hai_long_sv:83,
      so_bao_isi_scopus:35, so_bao_trong_nuoc:70, so_bao_sv:14, so_dt_cap_nn:2, so_dt_cap_bo_tinh:6, so_dt_cap_co_so:25, so_dt_sv:20,
      so_sang_che:2, so_hoi_thao:4, so_giai_thuong_sv:7, so_may_tinh:450, so_dau_sach_in:8500, so_csdl_dien_tu:6 },
    '2024-2025': { so_gv_co_huu:210, so_gv_tien_si:55, so_gv_thac_si:135, so_gv_gs_pgs:7, pct_gv_ts:26, so_cbql_nv:98,
      so_nguoi_hoc_dh:5100, so_nguoi_hoc_ths:180, so_nguoi_hoc_ts:12, so_ctdt_dh:18, so_ctdt_ths:5, so_ctdt_ts:2, so_ctdt_kiem_dinh:7,
      pct_tuyen_sinh:95, pct_nhap_hoc:86, pct_thoi_hoc:3, pct_tot_nghiep:92, pct_viec_lam_6t:78, pct_viec_lam_12t:91, pct_hai_long_sv:86,
      so_bao_isi_scopus:48, so_bao_trong_nuoc:85, so_bao_sv:20, so_dt_cap_nn:3, so_dt_cap_bo_tinh:8, so_dt_cap_co_so:30, so_dt_sv:28,
      so_sang_che:3, so_hoi_thao:5, so_giai_thuong_sv:10, so_may_tinh:500, so_dau_sach_in:9200, so_csdl_dien_tu:8 },
  };
  for (const [ny, data] of Object.entries(KPI))
    await q("INSERT INTO kpi_data(workspace_id,nam_hoc,data) VALUES ($1,$2,$3)", [csgd, ny, JSON.stringify(data)]);
  // CTĐT — KPI cấp chương trình đào tạo (quy mô nhỏ hơn)
  const KPI_CTDT = {
    '2023-2024': { so_gv_co_huu:28, so_gv_tien_si:9, so_gv_thac_si:17, pct_gv_ts:32, so_cbql_nv:6,
      so_nguoi_hoc_dh:520, so_ctdt_dh:1, so_ctdt_kiem_dinh:1, pct_tuyen_sinh:92, pct_nhap_hoc:85, pct_thoi_hoc:4,
      pct_tot_nghiep:89, pct_viec_lam_6t:75, pct_viec_lam_12t:87, pct_hai_long_sv:84,
      so_bao_isi_scopus:8, so_bao_sv:6, so_dt_sv:6, so_giai_thuong_sv:4 },
    '2024-2025': { so_gv_co_huu:32, so_gv_tien_si:11, so_gv_thac_si:19, pct_gv_ts:34, so_cbql_nv:7,
      so_nguoi_hoc_dh:560, so_ctdt_dh:1, so_ctdt_kiem_dinh:1, pct_tuyen_sinh:96, pct_nhap_hoc:88, pct_thoi_hoc:3,
      pct_tot_nghiep:91, pct_viec_lam_6t:80, pct_viec_lam_12t:90, pct_hai_long_sv:87,
      so_bao_isi_scopus:12, so_bao_sv:9, so_dt_sv:9, so_giai_thuong_sv:6 },
  };
  for (const [ny, data] of Object.entries(KPI_CTDT))
    await q("INSERT INTO kpi_data(workspace_id,nam_hoc,data) VALUES ($1,$2,$3)", [ctdt, ny, JSON.stringify(data)]);

  // ═══ Kế hoạch TĐG (24 tuần) ═════════════════════════════════════════════
  const plan2 = await insId("INSERT INTO tdg_plans(workspace_id,name,ngay_bat_dau) VALUES ($1,'Kế hoạch tự đánh giá chu kỳ 2026','06/01/2026') RETURNING id", [csgd]);
  const T = (p, a, b, t, s) => ({ p, a, b, t, s });
  const TASKS = [
    T(1,1,1,'Ra quyết định thành lập Hội đồng TĐG (Biểu 01)','done'),
    T(1,1,2,'Phân công nhiệm vụ cho các nhóm TĐG','done'),
    T(1,2,2,'Xây dựng Kế hoạch TĐG chi tiết (Biểu 02)','done'),
    T(1,3,4,'Tập huấn Hội đồng TĐG về quy trình và biểu mẫu','done'),
    T(2,5,6,'Thu thập minh chứng — Tiêu chuẩn 1, 2, 3','done'),
    T(2,7,8,'Thu thập minh chứng — Tiêu chuẩn 4, 5, 6','done'),
    T(2,9,10,'Thu thập minh chứng — Tiêu chuẩn 7, 8, 9','in_progress'),
    T(2,11,12,'Thu thập minh chứng — Tiêu chuẩn 10–15','in_progress'),
    T(2,10,12,'Mã hóa và phân loại minh chứng (Hn.ab.cd.ef)','in_progress'),
    T(2,12,12,'Nhập dữ liệu KPI vào Biểu 16','done'),
    T(3,13,14,'Đánh giá Tiêu chuẩn 1–4 (Biểu 04)','in_progress'),
    T(3,15,16,'Đánh giá Tiêu chuẩn 5–9 (Biểu 04)','late'),
    T(3,17,18,'Đánh giá Tiêu chuẩn 10–15 (Biểu 04)','todo'),
    T(3,18,18,'Họp Hội đồng TĐG — xem xét kết quả đánh giá','todo'),
    T(4,19,20,'Viết Báo cáo TĐG — Phần mở đầu và TC 1–7','todo'),
    T(4,21,22,'Viết Báo cáo TĐG — TC 8–15 và kết luận','todo'),
    T(4,22,22,'Rà soát, chỉnh sửa Báo cáo TĐG lần 1','todo'),
    T(5,23,23,'Thẩm định nội bộ, chỉnh sửa lần cuối','todo'),
    T(5,23,24,'Hoàn thiện và đóng gói hồ sơ minh chứng','todo'),
    T(5,24,24,'Nộp hồ sơ TĐG cho cơ quan kiểm định','todo'),
  ];
  let ord = 0;
  for (const t of TASKS)
    await q(`INSERT INTO tdg_tasks(plan_id,phase,week_start,week_end,title,status,priority,sort_order)
      VALUES ($1,$2,$3,$4,$5,$6,'normal',$7)`, [plan2, t.p, t.a, t.b, t.t, t.s, ord++]);
  // CTĐT — kế hoạch tự đánh giá chương trình
  const planC = await insId("INSERT INTO tdg_plans(workspace_id,name,ngay_bat_dau) VALUES ($1,'Kế hoạch tự đánh giá chương trình đào tạo CNTT','06/01/2026') RETURNING id", [ctdt]);
  let ordC = 0;
  for (const t of TASKS)
    await q(`INSERT INTO tdg_tasks(plan_id,phase,week_start,week_end,title,status,priority,sort_order)
      VALUES ($1,$2,$3,$4,$5,$6,'normal',$7)`, [planC, t.p, t.a, t.b, t.t, t.s, ordC++]);

  // ═══ Khảo sát (Biểu 08–10) + phản hồi ══════════════════════════════════
  const rnd = () => { const b = Math.random(); return b < 0.05 ? 2 : b < 0.2 ? 3 : b < 0.6 ? 4 : 5; };
  async function makeSurveys(ws, list) {
    for (const [type, title] of list) {
      const token = ('S' + Math.random().toString(36).slice(2, 9)).toUpperCase();
      const sv = await insId("INSERT INTO surveys(workspace_id,type,title,token,active) VALUES ($1,$2,$3,$4,true) RETURNING id", [ws, type, title, token]);
      const n = 15 + Math.floor(Math.random() * 12);
      for (let r = 0; r < n; r++) {
        const ans = {}; for (let qn = 1; qn <= 10; qn++) ans['q' + qn] = rnd();
        await q("INSERT INTO survey_responses(survey_id,answers) VALUES ($1,$2)", [sv, JSON.stringify(ans)]);
      }
    }
  }
  await makeSurveys(csgd, [
    ['bieu08','Khảo sát ý kiến cán bộ, giảng viên năm 2025'],
    ['bieu09','Khảo sát ý kiến người học năm 2025'],
    ['bieu10','Khảo sát ý kiến nhà tuyển dụng năm 2025']]);
  await makeSurveys(ctdt, [
    ['bieu09','Khảo sát người học chương trình CNTT năm 2025'],
    ['bieu10','Khảo sát nhà tuyển dụng về sinh viên CNTT năm 2025'],
    ['bieu11','Khảo sát cựu sinh viên ngành CNTT năm 2025']]);

  // ═══ Báo cáo TĐG (Biểu 05) ═════════════════════════════════════════════
  await q(`INSERT INTO reports(workspace_id,title,period,author,co_so_phap_ly,mo_ta_qua_trinh,mo_ta_csdt,tom_tat_ket_qua,ke_hoach_cai_tien)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [csgd, 'Báo cáo tự đánh giá cơ sở giáo dục chu kỳ 2026', '2021-2025', 'Hội đồng Tự đánh giá',
     'Thông tư 26/2026/TT-BGDĐT; Quyết định thành lập Hội đồng Tự đánh giá của Nhà trường.',
     'Nhà trường thành lập Hội đồng TĐG, xây dựng kế hoạch 24 tuần, thu thập và mã hóa minh chứng, đánh giá đầy đủ 15 tiêu chuẩn.',
     'Trường Đại học Kiến trúc Đà Nẵng là cơ sở đào tạo đa ngành khối kỹ thuật, kiến trúc và công nghệ thông tin.',
     'Phần lớn tiêu chí đạt yêu cầu; hệ thống bảo đảm chất lượng bên trong vận hành hiệu quả; một số tiêu chí cần bổ sung minh chứng.',
     'Bổ sung minh chứng còn thiếu, cải tiến quy trình theo chu trình PDCA, chuẩn bị đón đoàn đánh giá ngoài.']);
  await q(`INSERT INTO reports(workspace_id,title,period,author,tom_tat_ket_qua)
    VALUES ($1,'Báo cáo tự đánh giá chương trình đào tạo CNTT','2021-2025','Nhóm chuyên trách CTĐT CNTT',
    'Chương trình đào tạo CNTT đáp ứng chuẩn đầu ra; kết quả đo lường CLO/PLO cho thấy đa số PLO đạt mức cao.')`, [ctdt]);

  const eC = (await one("SELECT count(*)::int n FROM evidence WHERE workspace_id=$1", [csgd])).n;
  const eD = (await one("SELECT count(*)::int n FROM evidence WHERE workspace_id=$1", [ctdt])).n;
  const files = (await one("SELECT count(*)::int n FROM evidence WHERE source_type='file' AND workspace_id = ANY($1)", [both])).n;
  console.log(`✅ CSGD: ${eC} minh chứng (15/15 tiêu chuẩn) + phân công đơn vị + ${ASSESS_CSGD.length} đánh giá TC + 3 năm KPI + kế hoạch TĐG 24 tuần + 3 khảo sát + báo cáo`);
  console.log(`✅ CTĐT: ${eD} minh chứng + 3 PEO / 6 PLO / 3 HP / 9 CLO / rubric / kế hoạch đo (2 bài, 6 SV) + đánh giá + báo cáo`);
  console.log(`📁 Đã ghi ${files} tệp .txt mẫu vào: ${UP}`);
  await pool.end();
}

main().catch(e => { console.error('Lỗi seed mẫu:', e); process.exit(1); });
