// ─── Dữ liệu mẫu: CTĐT ngành Logistics và Quản lý chuỗi cung ứng ────────────
// Chạy:  docker exec kdcl-app node mock-logistics.js
//
// Khác sample-data.js ở một điểm quan trọng: script này CHỈ đụng tới workspace
// của chính nó. sample-data.js xoá sạch minh chứng của cả workspace CSGD lẫn
// CTĐT đầu tiên rồi nạp lại, chạy nhầm trên bản thật là mất dữ liệu người dùng
// đã nhập. Ở đây mọi lệnh xoá đều kèm workspace_id của Logistics, nên chạy lại
// bao nhiêu lần cũng chỉ dựng lại đúng workspace này.
const { q, one, pool } = require('./db');
const fs = require('fs');
const path = require('path');

const WS_NAME = 'Logistics 2026';
const DATA_DIR = process.env.DATA_DIR || __dirname;
const UP = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(UP, { recursive: true });

const insId = async (sql, p) => (await one(sql, p)).id;

let seq = 0;
function makeFile(code, tc, desc) {
  seq++;
  const stored = `logi_${code}_${seq}.txt`;
  const content =
`MINH CHỨNG MẪU · Hệ thống KĐCLGD
Chương trình đào tạo Logistics và Quản lý chuỗi cung ứng
Trường Đại học Kiến trúc Đà Nẵng
========================================
Mã minh chứng : ${code}
Tiêu chí       : ${tc}
Tên tài liệu   : ${desc}
----------------------------------------
Đây là tệp minh chứng MẪU dùng để minh hoạ quy trình nộp và duyệt.
Khi triển khai thật, đơn vị thay bằng văn bản chính thức có chữ ký và dấu.
`;
  fs.writeFileSync(path.join(UP, stored), content, 'utf8');
  return { file_name: `${desc}.txt`, file_stored: stored, file_size: Buffer.byteLength(content, 'utf8'), mime: 'text/plain' };
}

async function main() {
  const admin = (await one("SELECT id FROM users WHERE role='admin' ORDER BY id LIMIT 1")).id;

  // ── Đơn vị chủ quản ───────────────────────────────────────────────────────
  // Đơn vị là bảng GLOBAL, dùng chung mọi workspace, nên chỉ thêm nếu chưa có.
  let khoa = await one("SELECT id FROM units WHERE code='KLOG'");
  if (!khoa) khoa = await one(
    "INSERT INTO units(code,name,type) VALUES ('KLOG','Khoa Logistics và Quản lý chuỗi cung ứng','khoa') RETURNING id");
  const U = {}; for (const u of await q("SELECT id, code FROM units")) U[u.code] = u.id;

  // ── Workspace ─────────────────────────────────────────────────────────────
  let ws = await one("SELECT id FROM workspaces WHERE name=$1", [WS_NAME]);
  if (!ws) ws = await one(
    `INSERT INTO workspaces(name,type,law,description,active)
     VALUES ($1,'CTDT','TT04/2025 BGDĐT','Kiểm định CTĐT ngành Logistics và Quản lý chuỗi cung ứng, khóa 2026',true)
     RETURNING id`, [WS_NAME]);
  const W = ws.id;

  // ── Dọn dữ liệu cũ CỦA RIÊNG workspace này ────────────────────────────────
  for (const f of await q("SELECT file_stored FROM evidence WHERE workspace_id=$1 AND file_stored LIKE 'logi_%'", [W]))
    { try { fs.unlinkSync(path.join(UP, f.file_stored)); } catch (e) {} }
  for (const t of ['evidence','unit_criteria','scores','plan_students','assessment_items','assessment_plans',
                   'clo_plo_map','course_plo_map','clos','courses','rubrics','plos','peos',
                   'assessments','kpi_data','tdg_plans','surveys','reports','school_info'])
    await q(`DELETE FROM ${t} WHERE workspace_id=$1`, [W]);

  await q("INSERT INTO school_info(workspace_id,data) VALUES ($1,$2)", [W, JSON.stringify({
    ten_truong: 'Trường Đại học Kiến trúc Đà Nẵng', ma_truong: 'KTD',
    ten_tieng_anh: 'Da Nang Architecture University', loai_hinh: 'Đại học tư thục',
    dia_chi: '566 Núi Thành, quận Hải Châu, TP. Đà Nẵng', dien_thoai: '0236 3624399',
    email: 'info@dau.edu.vn', website: 'https://dau.edu.vn', nam_thanh_lap: '2006',
    hieu_truong: 'Hiệu trưởng Nhà trường',
    nganh: 'Logistics và Quản lý chuỗi cung ứng', khoa: 'Khóa 2026',
  })]);

  // ── PEO ───────────────────────────────────────────────────────────────────
  for (const [c, ct] of [
    ['PEO1','Đảm nhiệm được công việc chuyên môn về logistics, vận tải và chuỗi cung ứng tại doanh nghiệp trong và ngoài nước'],
    ['PEO2','Phân tích dữ liệu vận hành và đề xuất giải pháp tối ưu chi phí, thời gian giao hàng'],
    ['PEO3','Làm việc nhóm, giao tiếp đa văn hoá và tuân thủ đạo đức nghề nghiệp trong môi trường quốc tế'],
  ]) await q("INSERT INTO peos(workspace_id,code,content) VALUES ($1,$2,$3)", [W, c, ct]);

  // ── PLO ───────────────────────────────────────────────────────────────────
  const P = {};
  for (const [c, ct, bl, ty] of [
    ['PLO1','Vận dụng kiến thức kinh tế, quản trị và toán ứng dụng vào bài toán logistics','apply','knowledge'],
    ['PLO2','Thiết kế và vận hành quy trình kho bãi, vận tải và phân phối','apply','skill'],
    ['PLO3','Phân tích dữ liệu chuỗi cung ứng để dự báo nhu cầu và tồn kho','analyze','skill'],
    ['PLO4','Đánh giá và lựa chọn phương án vận tải đa phương thức theo chi phí và rủi ro','evaluate','skill'],
    ['PLO5','Áp dụng quy định pháp luật, tập quán thương mại quốc tế và thủ tục hải quan','apply','knowledge'],
    ['PLO6','Sử dụng phần mềm quản trị chuỗi cung ứng và công cụ số trong nghiệp vụ','apply','skill'],
    ['PLO7','Làm việc nhóm, giao tiếp chuyên nghiệp và thể hiện trách nhiệm nghề nghiệp','apply','attitude'],
  ]) P[c] = await insId("INSERT INTO plos(workspace_id,code,content,bloom_level,type) VALUES ($1,$2,$3,$4,$5) RETURNING id", [W, c, ct, bl, ty]);

  // ── Học phần và CLO ───────────────────────────────────────────────────────
  const C = {}, CL = {};
  for (const [code, name, cr, sem, clos] of [
    ['LOG101','Nhập môn logistics và chuỗi cung ứng',3,1,[
      ['CLO1','Trình bày các thành phần và dòng chảy trong chuỗi cung ứng','remember','knowledge'],
      ['CLO2','Giải thích vai trò của logistics trong hoạt động doanh nghiệp','understand','knowledge'],
      ['CLO3','Nhận diện các chỉ số vận hành cơ bản của chuỗi cung ứng','understand','skill']]],
    ['LOG201','Quản trị kho hàng và tồn kho',3,2,[
      ['CLO1','Áp dụng mô hình đặt hàng kinh tế để tính lượng đặt hàng tối ưu','apply','skill'],
      ['CLO2','Thiết kế sơ đồ mặt bằng kho theo đặc thù hàng hoá','apply','skill'],
      ['CLO3','Phân tích chi phí lưu kho và mức tồn kho an toàn','analyze','skill']]],
    ['LOG202','Vận tải đa phương thức',3,3,[
      ['CLO1','So sánh ưu nhược điểm của các phương thức vận tải','understand','knowledge'],
      ['CLO2','Lập phương án vận tải kết hợp cho một lô hàng cụ thể','apply','skill'],
      ['CLO3','Đánh giá phương án theo chi phí, thời gian và rủi ro','evaluate','skill']]],
    ['LOG301','Nghiệp vụ hải quan và thương mại quốc tế',3,4,[
      ['CLO1','Trình bày quy trình thủ tục hải quan xuất nhập khẩu','remember','knowledge'],
      ['CLO2','Vận dụng điều kiện Incoterms vào tình huống mua bán quốc tế','apply','knowledge'],
      ['CLO3','Lập bộ chứng từ cho một lô hàng xuất khẩu','apply','skill']]],
    ['LOG302','Phân tích dữ liệu chuỗi cung ứng',3,5,[
      ['CLO1','Sử dụng phần mềm bảng tính và công cụ số để xử lý dữ liệu vận hành','apply','skill'],
      ['CLO2','Phân tích dữ liệu để dự báo nhu cầu theo mùa vụ','analyze','skill'],
      ['CLO3','Đề xuất giải pháp tối ưu tồn kho dựa trên kết quả phân tích','create','skill']]],
    ['LOG401','Đồ án chuyên ngành logistics',4,7,[
      ['CLO1','Xây dựng phương án cải tiến cho một chuỗi cung ứng thực tế','create','skill'],
      ['CLO2','Bảo vệ phương án trước hội đồng bằng lập luận có dữ liệu','evaluate','skill'],
      ['CLO3','Làm việc nhóm và phân công trách nhiệm rõ ràng','apply','attitude']]],
  ]) {
    C[code] = await insId("INSERT INTO courses(workspace_id,code,name,credits,semester,type) VALUES ($1,$2,$3,$4,$5,'core') RETURNING id", [W, code, name, cr, sem]);
    for (const [cc, cct, bl, ty] of clos)
      CL[code + '.' + cc] = await insId("INSERT INTO clos(workspace_id,course_id,code,content,bloom_level,type) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id", [W, C[code], cc, cct, bl, ty]);
  }

  await insId(`INSERT INTO rubrics(workspace_id,name,description,scale_type,levels)
    VALUES ($1,'Rubric đồ án logistics','Thang 4 mức chấm đồ án chuyên ngành','A_D',$2) RETURNING id`,
    [W, JSON.stringify([
      { name: 'Yếu', is_pass: false, weight: 25, description: 'Chưa mô tả được chuỗi cung ứng, không có dữ liệu' },
      { name: 'Trung bình', is_pass: false, weight: 25, description: 'Mô tả được hiện trạng nhưng chưa đề xuất cải tiến' },
      { name: 'Khá', is_pass: true, weight: 25, description: 'Đề xuất cải tiến có căn cứ dữ liệu' },
      { name: 'Giỏi', is_pass: true, weight: 25, description: 'Cải tiến có định lượng chi phí và rủi ro, bảo vệ thuyết phục' }])]);

  // ── Ma trận học phần với PLO ──────────────────────────────────────────────
  // I giới thiệu, R củng cố, M đo. Mỗi PLO phải có ít nhất một chỗ M, nếu không
  // thì tuyên bố chuẩn đầu ra mà không nơi nào đo được.
  for (const [c, p, lv] of [
    ['LOG101','PLO1','I'], ['LOG101','PLO2','I'], ['LOG101','PLO7','I'],
    ['LOG201','PLO1','R'], ['LOG201','PLO2','R'], ['LOG201','PLO3','I'],
    ['LOG202','PLO2','M'], ['LOG202','PLO4','R'], ['LOG202','PLO5','I'],
    ['LOG301','PLO5','M'], ['LOG301','PLO1','M'],
    ['LOG302','PLO3','M'], ['LOG302','PLO6','M'],
    ['LOG401','PLO4','M'], ['LOG401','PLO6','R'], ['LOG401','PLO7','M'],
  ]) await q("INSERT INTO course_plo_map(workspace_id,course_id,plo_id,level) VALUES ($1,$2,$3,$4)", [W, C[c], P[p], lv]);

  for (const [cl, p, w] of [
    ['LOG101.CLO1','PLO1',1], ['LOG101.CLO2','PLO1',1], ['LOG101.CLO3','PLO3',0.5],
    ['LOG201.CLO1','PLO1',1], ['LOG201.CLO2','PLO2',1], ['LOG201.CLO3','PLO3',1],
    ['LOG202.CLO1','PLO2',1], ['LOG202.CLO2','PLO2',1], ['LOG202.CLO3','PLO4',1],
    ['LOG301.CLO1','PLO5',1], ['LOG301.CLO2','PLO5',1], ['LOG301.CLO3','PLO5',1],
    ['LOG302.CLO1','PLO6',1], ['LOG302.CLO2','PLO3',1], ['LOG302.CLO3','PLO3',1],
    ['LOG401.CLO1','PLO4',1], ['LOG401.CLO2','PLO4',1], ['LOG401.CLO3','PLO7',1],
  ]) await q("INSERT INTO clo_plo_map(workspace_id,clo_id,plo_id,weight) VALUES ($1,$2,$3,$4)", [W, CL[cl], P[p], w]);

  // ── Kế hoạch đo ───────────────────────────────────────────────────────────
  // Điểm cố ý để một học phần KHÔNG đạt ngưỡng: bảng toàn xanh thì cột hành
  // động cải tiến không bao giờ hiện, mà đó mới là chỗ vòng cải tiến xảy ra.
  const SV = ['Trần Minh An','Lê Thu Hà','Nguyễn Quốc Bảo','Phạm Diệu Linh','Võ Đình Nam','Đặng Khánh Vy',
              'Hoàng Thị Mai','Bùi Tiến Dũng'];
  async function measure(courseCode, name, sem, targets, diem) {
    const plan = await insId(`INSERT INTO assessment_plans(workspace_id,course_id,name,semester,school_year,threshold_pct,pass_score_pct,status)
      VALUES ($1,$2,$3,$4,'2025-2026',75,50,'active') RETURNING id`, [W, C[courseCode], name, sem]);
    const it1 = await insId(`INSERT INTO assessment_items(workspace_id,plan_id,name,type,max_score,clo_targets)
      VALUES ($1,$2,'Bài tập lớn giữa kỳ','project',10,$3) RETURNING id`,
      [W, plan, JSON.stringify([{ clo_id: CL[targets[0]], weight: 60 }, { clo_id: CL[targets[1]], weight: 40 }])]);
    const it2 = await insId(`INSERT INTO assessment_items(workspace_id,plan_id,name,type,max_score,clo_targets)
      VALUES ($1,$2,'Thi cuối kỳ','test',10,$3) RETURNING id`,
      [W, plan, JSON.stringify([{ clo_id: CL[targets[1]], weight: 50 }, { clo_id: CL[targets[2]], weight: 50 }])]);
    for (let n = 0; n < diem.length; n++) {
      const sid = await insId("INSERT INTO plan_students(workspace_id,plan_id,code,full_name) VALUES ($1,$2,$3,$4) RETURNING id",
        [W, plan, 'LOG26' + String(n + 1).padStart(3, '0'), SV[n % SV.length]]);
      await q("INSERT INTO scores(workspace_id,item_id,plan_student_id,score) VALUES ($1,$2,$3,$4)", [W, it1, sid, diem[n][0]]);
      await q("INSERT INTO scores(workspace_id,item_id,plan_student_id,score) VALUES ($1,$2,$3,$4)", [W, it2, sid, diem[n][1]]);
    }
  }
  await measure('LOG201', 'LOG201 · HK2 2025-2026', 2,
    ['LOG201.CLO1','LOG201.CLO2','LOG201.CLO3'],
    [[8,7.5],[7,8],[6.5,7],[9,8.5],[5.5,6],[7.5,7],[8,9],[6,6.5]]);
  await measure('LOG302', 'LOG302 · HK1 2025-2026', 1,
    ['LOG302.CLO1','LOG302.CLO2','LOG302.CLO3'],
    [[4.5,5],[6,5.5],[5,4],[7,6.5],[4,4.5],[5.5,5],[6.5,6],[3.5,5]]);   // cố ý dưới ngưỡng
  await measure('LOG401', 'LOG401 · Đồ án khóa 2026', 2,
    ['LOG401.CLO1','LOG401.CLO2','LOG401.CLO3'],
    [[8.5,8],[7.5,8.5],[9,8],[7,7.5],[8,8],[6.5,7],[9.5,9],[7.5,8]]);

  // ── Minh chứng ────────────────────────────────────────────────────────────
  // Cột sug_names là KHAI BÁO minh chứng phục vụ mục gợi ý nào. Cố ý để một
  // phần chưa khai, đúng như hiện trạng dữ liệu thật, để màn chi tiết tiêu chí
  // hiện cả hai trạng thái chứ không phải hàng nào cũng xanh.
  const cnt = {};
  async function ev(tc, unitCode, desc, status, src, sugNames, note) {
    const std = parseInt(tc.split('.')[0]), tcso = parseInt(tc.split('.')[1]);
    const k = tc; cnt[k] = (cnt[k] || 0) + 1;
    const code = `H${std}.${String(std).padStart(2,'0')}.${String(tcso).padStart(2,'0')}.${String(cnt[k]).padStart(2,'0')}`;
    const reviewed = status === 'da_xac_nhan' || status === 'tra_lai';
    let f = { source_type: 'link', file_name: null, file_stored: null, file_size: null, mime: null,
              link_url: 'https://drive.google.com/file/d/LOGI-' + code + '/view' };
    if (src === 'file') { const m = makeFile(code, tc, desc); f = { source_type: 'file', ...m, link_url: null }; }
    await q(`INSERT INTO evidence(workspace_id,code,tieu_chuan,tieu_chi,tieu_chi_so,thu_tu,mo_ta,nguon,
        source_type,file_name,file_stored,file_size,mime_type,link_url,unit_id,uploaded_by,status,reviewed_by,reviewed_at,review_note,sug_names)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,${reviewed ? 'now()' : 'NULL'},$19,$20)`,
      [W, code, std, tc, tcso, cnt[k], desc, unitCode ? ('Đơn vị: ' + unitCode) : '',
       f.source_type, f.file_name, f.file_stored, f.file_size, f.mime, f.link_url,
       unitCode ? U[unitCode] : null, admin, status, reviewed ? admin : null, note || '', sugNames || []]);
  }

  const EV = [
    ['6.1','PDT','Đề án tuyển sinh ngành Logistics và Quản lý chuỗi cung ứng năm 2026','da_xac_nhan','file',
      ['Đề án tuyển sinh và kế hoạch tuyển sinh hằng năm']],
    ['6.1','PDT','Thống kê kết quả tuyển sinh ngành Logistics ba năm gần nhất','da_xac_nhan','file',
      ['Cơ sở dữ liệu, thống kê kết quả tuyển sinh hằng năm, phân tích đầu vào']],
    ['6.1','KLOG','Biên bản họp Khoa phân tích dữ liệu tuyển sinh và phản hồi doanh nghiệp','cho_duyet','link', []],
    ['6.2','PDT','Chương trình đào tạo ngành Logistics khóa 2026 (bản ban hành)','da_xac_nhan','file', []],
    ['6.2','PDT','Ma trận chuẩn đầu ra với học phần (curriculum map)','da_xac_nhan','file', []],
    ['6.3','KLOG','Đề cương chi tiết 6 học phần chuyên ngành logistics','da_xac_nhan','file', []],
    ['6.3','KLOG','Kế hoạch thực tập doanh nghiệp tại cảng và trung tâm phân phối','cho_duyet','link', []],
    ['6.4','KLOG','Bộ rubric chấm đồ án chuyên ngành và kết quả đo CLO','cho_duyet','file', []],
    ['6.4','KLOG','Báo cáo đo lường chuẩn đầu ra học phần LOG302 học kỳ 1','tra_lai','file', [],
      'Thiếu bảng điểm gốc và mô tả cách quy đổi sang mức đạt.'],
    ['6.5','PCTSV','Kế hoạch hỗ trợ người học và cố vấn học tập ngành Logistics','da_xac_nhan','link', []],
    ['4.2','PKHTC','Danh mục phòng mô phỏng chuỗi cung ứng và phần mềm quản trị kho','da_xac_nhan','file', []],
    ['3.3','PTCHC','Kế hoạch bồi dưỡng giảng viên ngành Logistics giai đoạn 2026-2028','cho_duyet','link', []],
    ['8.2','PKHCN','Biên bản hợp tác với doanh nghiệp logistics tại Đà Nẵng','da_xac_nhan','file', []],
    ['11.1','PDBCL','Kế hoạch cải tiến chương trình theo phản hồi cựu sinh viên và nhà tuyển dụng','cho_duyet','file', []],
  ];
  const assigned = new Set();
  for (const [tc, u] of EV) if (u) assigned.add(u + '|' + tc);
  assigned.add('KLOG|6.6');   // tiêu chí đã giao nhưng CHƯA nộp, để cổng đơn vị có việc đang chờ
  for (const key of assigned) {
    const [u, tc] = key.split('|');
    await q("INSERT INTO unit_criteria(workspace_id,unit_id,tieu_chi) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING", [W, U[u], tc]);
  }
  for (const [tc, u, d, s, src, sug, note] of EV) await ev(tc, u, d, s, src, sug, note);

  // ── Đánh giá tiêu chí (Biểu 04) ───────────────────────────────────────────
  // Có đủ ba trạng thái: phiếu đã duyệt, phiếu còn nháp, và tiêu chí chưa kết
  // luận. Không cho tất cả cùng ĐẠT vì như vậy màn đánh giá mất hết ý nghĩa.
  const DG = [
    ['6.1','DAT','approved','Đề án tuyển sinh ban hành đúng hạn, chỉ tiêu đạt 96%','Có phân tích dữ liệu đầu vào theo khu vực','Chưa khảo sát lý do chọn ngành của tân sinh viên','Bổ sung khảo sát tân sinh viên từ kỳ tới'],
    ['6.2','DAT','approved','Chương trình rà soát năm 2026, có ma trận CĐR và học phần','Ma trận I/R/M phủ 7/7 chuẩn đầu ra','Hai chuẩn đầu ra mới chỉ có một học phần đo','Bổ sung học phần đo cho PLO4 và PLO5'],
    ['6.3','DAT','draft','Đề cương 6 học phần chuyên ngành đã ban hành','Có kế hoạch thực tập tại cảng và trung tâm phân phối','Chưa có minh chứng phản hồi doanh nghiệp sau thực tập','Thu thập phiếu đánh giá của đơn vị tiếp nhận'],
    ['6.4','KHONG_DAT','approved','Đo chuẩn đầu ra mới thực hiện ở 3 trên 6 học phần','Có rubric chấm đồ án chuyên ngành','Học phần LOG302 đạt 62,5%, dưới ngưỡng 75%','Điều chỉnh đề bài và tăng giờ thực hành cho LOG302'],
    ['6.5','DAT','draft','Có cố vấn học tập cho từng lớp','Sinh viên tiếp cận được dịch vụ hỗ trợ','Chưa tổng hợp phản hồi định kỳ','Lập kênh ghi nhận phản hồi hằng kỳ'],
    ['6.6','CHUA','draft','Đang thu thập quy định quản lý hồ sơ người học','','',''],
    ['3.3','DAT','approved','Kế hoạch bồi dưỡng giảng viên giai đoạn 2026-2028 đã duyệt','Ba giảng viên đang học nghiên cứu sinh','Tỷ lệ giảng viên có bằng tiến sĩ còn thấp','Tuyển thêm giảng viên trình độ tiến sĩ'],
    ['4.2','DAT','approved','Có phòng mô phỏng chuỗi cung ứng và phần mềm quản trị kho','Trang thiết bị đáp ứng quy mô lớp','Bản quyền phần mềm hết hạn trong năm tới','Bố trí kinh phí gia hạn bản quyền'],
    ['8.2','DAT','draft','Đã ký hợp tác với ba doanh nghiệp logistics tại Đà Nẵng','Sinh viên có chỗ thực tập ổn định','Chưa có hoạt động nghiên cứu chung','Đề xuất đề tài phối hợp với doanh nghiệp'],
    ['11.1','CHUA','draft','Đang xây dựng kế hoạch cải tiến theo phản hồi các bên',' ','',''],
  ];
  for (const [tc, kq, tt, ht, dm, tn, kh] of DG) {
    const std = parseInt(tc.split('.')[0]);
    await q(`INSERT INTO assessments(workspace_id,tieu_chuan,tieu_chi,hien_trang,diem_manh,ton_tai,ke_hoach,ket_qua,trang_thai,nguoi_thuc_hien)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [W, std, tc, ht, dm, tn, kh, kq, tt, 'Khoa Logistics']);
  }

  // ── KPI Biểu 16, ba năm để thấy xu hướng ──────────────────────────────────
  const KPI = {
    '2023-2024': { so_gv_co_huu: 14, so_gv_tien_si: 3, so_gv_thac_si: 10, pct_gv_ts: 21, so_cbql_nv: 4,
      so_nguoi_hoc_dh: 210, so_ctdt_dh: 1, so_ctdt_kiem_dinh: 0, pct_tuyen_sinh: 88, pct_nhap_hoc: 82, pct_thoi_hoc: 6,
      pct_tot_nghiep: 86, pct_viec_lam_6t: 72, pct_viec_lam_12t: 85, pct_hai_long_sv: 81,
      so_bao_isi_scopus: 2, so_bao_sv: 1, so_dt_sv: 2, so_giai_thuong_sv: 1 },
    '2024-2025': { so_gv_co_huu: 17, so_gv_tien_si: 4, so_gv_thac_si: 12, pct_gv_ts: 24, so_cbql_nv: 5,
      so_nguoi_hoc_dh: 268, so_ctdt_dh: 1, so_ctdt_kiem_dinh: 0, pct_tuyen_sinh: 93, pct_nhap_hoc: 86, pct_thoi_hoc: 5,
      pct_tot_nghiep: 88, pct_viec_lam_6t: 76, pct_viec_lam_12t: 88, pct_hai_long_sv: 84,
      so_bao_isi_scopus: 3, so_bao_sv: 2, so_dt_sv: 3, so_giai_thuong_sv: 2 },
    '2025-2026': { so_gv_co_huu: 21, so_gv_tien_si: 6, so_gv_thac_si: 14, pct_gv_ts: 29, so_cbql_nv: 5,
      so_nguoi_hoc_dh: 324, so_ctdt_dh: 1, so_ctdt_kiem_dinh: 1, pct_tuyen_sinh: 96, pct_nhap_hoc: 90, pct_thoi_hoc: 4,
      pct_tot_nghiep: 90, pct_viec_lam_6t: 79, pct_viec_lam_12t: 91, pct_hai_long_sv: 86,
      so_bao_isi_scopus: 5, so_bao_sv: 4, so_dt_sv: 5, so_giai_thuong_sv: 3 },
  };
  for (const [ny, data] of Object.entries(KPI))
    await q('INSERT INTO kpi_data(workspace_id,nam_hoc,data) VALUES ($1,$2,$3)', [W, ny, JSON.stringify(data)]);

  // ── Kế hoạch tự đánh giá ──────────────────────────────────────────────────
  // Ngày bắt đầu ghi theo ngày/tháng/năm như phần còn lại của hệ.
  const planTdg = await insId(
    `INSERT INTO tdg_plans(workspace_id,name,ngay_bat_dau)
     VALUES ($1,'Kế hoạch tự đánh giá CTĐT Logistics chu kỳ 2026','15/01/2026') RETURNING id`, [W]);
  const TASKS = [
    [1, 1, 2, 'Thành lập hội đồng tự đánh giá chương trình', 'done'],
    [1, 2, 3, 'Tập huấn bộ tiêu chuẩn TT04 cho giảng viên', 'done'],
    [1, 3, 4, 'Phân công tiêu chí cho các đơn vị', 'done'],
    [2, 4, 7, 'Thu thập minh chứng nhóm tiêu chuẩn đào tạo', 'done'],
    [2, 6, 9, 'Thu thập minh chứng nhân lực và cơ sở vật chất', 'in_progress'],
    [2, 8, 10, 'Thu thập minh chứng kết nối doanh nghiệp', 'in_progress'],
    [3, 10, 13, 'Viết phiếu đánh giá tiêu chí nhóm đào tạo', 'in_progress'],
    [3, 12, 15, 'Đo chuẩn đầu ra học kỳ 1 và tổng hợp kết quả', 'late'],
    [3, 14, 16, 'Rà soát chéo giữa các đơn vị', 'todo'],
    [4, 16, 19, 'Viết dự thảo báo cáo tự đánh giá', 'todo'],
    [4, 18, 20, 'Lấy ý kiến các bên liên quan', 'todo'],
    [5, 20, 22, 'Hoàn thiện báo cáo và hồ sơ minh chứng', 'todo'],
    [5, 22, 24, 'Trình hội đồng thông qua', 'todo'],
  ];
  let ord = 0;
  for (const [ph, a, b2, title, st] of TASKS)
    await q(`INSERT INTO tdg_tasks(plan_id,phase,week_start,week_end,title,status,priority,sort_order)
             VALUES ($1,$2,$3,$4,$5,$6,'normal',$7)`, [planTdg, ph, a, b2, title, st, ord++]);

  // ── Khảo sát các bên liên quan ────────────────────────────────────────────
  // Điểm phát sinh theo phân phối lệch về phía hài lòng, nhưng vẫn có ý kiến
  // thấp, để biểu đồ phân bố không phải một khối đặc.
  const diem = (i, qn) => { const x = (i * 7 + qn * 3) % 20; return x < 1 ? 2 : x < 4 ? 3 : x < 13 ? 4 : 5; };
  for (const [type, title, n] of [
    ['bieu08', 'Khảo sát cán bộ, giảng viên về CTĐT Logistics', 18],
    ['bieu09', 'Khảo sát người học về CTĐT Logistics', 27],
    ['bieu10', 'Khảo sát nhà tuyển dụng ngành Logistics', 14],
  ]) {
    const token = ('LOGI' + type.slice(-2) + W).toUpperCase();
    const sv = await insId(
      'INSERT INTO surveys(workspace_id,type,title,token,active) VALUES ($1,$2,$3,$4,true) RETURNING id',
      [W, type, title, token]);
    for (let i = 0; i < n; i++) {
      const ans = {};
      for (let qn = 1; qn <= 10; qn++) ans['q' + qn] = diem(i, qn);
      await q('INSERT INTO survey_responses(survey_id,answers) VALUES ($1,$2)', [sv, JSON.stringify(ans)]);
    }
  }

  // ── Báo cáo tự đánh giá ───────────────────────────────────────────────────
  await q(`INSERT INTO reports(workspace_id,title,period,author,tom_tat_ket_qua)
    VALUES ($1,'Báo cáo tự đánh giá chương trình đào tạo Logistics','2025-2026','Phòng Đảm bảo chất lượng',
    'Chương trình đã ban hành đủ chuẩn đầu ra và ma trận học phần. Kết quả đo học phần LOG302 chưa đạt ngưỡng 75%, Khoa đang xây dựng phương án cải tiến.')`, [W]);

  // ── Đối chiếu ─────────────────────────────────────────────────────────────
  const n = async (t) => (await one(`SELECT count(*)::int c FROM ${t} WHERE workspace_id=$1`, [W])).c;
  console.log(`Workspace "${WS_NAME}" (id=${W}) đã dựng xong:`);
  for (const t of ['peos','plos','courses','clos','course_plo_map','clo_plo_map','rubrics',
                   'assessment_plans','assessment_items','plan_students','scores','evidence','unit_criteria',
                   'assessments','kpi_data','tdg_plans','surveys','reports'])
    console.log(`   ${t.padEnd(18)} ${await n(t)}`);
  const khai = (await one("SELECT count(*)::int c FROM evidence WHERE workspace_id=$1 AND array_length(sug_names,1) IS NOT NULL", [W])).c;
  console.log(`   evidence đã khai   ${khai}`);
}

main()
  .then(() => pool.end())
  .catch((e) => { console.error(e); pool.end(); process.exit(1); });
