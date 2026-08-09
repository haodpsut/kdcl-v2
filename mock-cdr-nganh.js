// ─── Nạp dữ liệu chuẩn đầu ra mẫu cho các ngành đào tạo ─────────────────────
// Chạy:  docker exec kdcl-app node mock-cdr-nganh.js
//        docker exec kdcl-app node mock-cdr-nganh.js --thu   (chỉ kiểm, không ghi)
//
// Vì sao cần: mock-ctdt-tt04.js dựng đủ 18 đợt nhưng CỐ Ý không đụng tới dữ
// liệu chuẩn đầu ra, nên 15 ngành mới mở trang Khung chuẩn đầu ra ra là trắng:
// không PEO, không PLO, không học phần, không CLO. Ba ngành cũ có sẵn dữ liệu
// viết tay nên script này không đụng vào, trừ khi có tệp mẫu cho chúng.
//
// Nguồn nội dung: các tệp ctdt-mau/<slug>.json. Đây là dữ liệu MẪU để Phòng
// Đảm bảo chất lượng làm quen thao tác, KHÔNG phải chương trình đào tạo thật.
//
// Script chỉ đụng các bảng chuẩn đầu ra và đo lường, và CHỈ trong workspace của
// ngành có tệp mẫu: peos, plos, courses, clos, course_plo_map, clo_plo_map,
// rubrics, assessment_plans, assessment_items, plan_students, scores.
// Minh chứng, phân công và phiếu tự đánh giá không bị đụng tới.
const { q, one, pool } = require('./db');
const { NGANH, NAM } = require('./danh-muc-nganh.js');
const fs = require('fs');
const path = require('path');

const THU = process.argv.includes('--thu');
const THU_MUC = path.join(__dirname, 'ctdt-mau');
const insId = async (sql, p) => (await one(sql, p)).id;

const BLOOM = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
const LOAI = ['knowledge', 'skill', 'attitude'];

// Động từ mở đầu CLO phải khớp mức Bloom đã khai. Bảng này chỉ dùng để CẢNH
// BÁO chứ không chặn, vì tiếng Việt có nhiều cách diễn đạt cùng một mức.
// Bảng này từng quá hẹp nên báo nhầm 32 chỗ trên 270 CLO, toàn động từ đúng mà
// tôi chưa liệt kê: mô phỏng, định khoản, điều hành, nghe hiểu, định giá. Một
// phép kiểm hay kêu oan thì người ta bỏ qua cả những lần nó kêu đúng, nên bảng
// phải đủ rộng. Vẫn chỉ CẢNH BÁO, không chặn.
const DONG_TU = {
  remember: ['trình bày', 'liệt kê', 'nêu', 'nhắc lại', 'nhận biết', 'nhận diện', 'kể', 'định nghĩa', 'mô tả'],
  understand: ['giải thích', 'diễn giải', 'phân biệt', 'tóm tắt', 'so sánh', 'hiểu', 'minh hoạ', 'minh họa',
    'mô tả', 'phân loại', 'nghe hiểu', 'đọc hiểu', 'nhận ra'],
  apply: ['vận dụng', 'áp dụng', 'sử dụng', 'thực hiện', 'thực hành', 'tính', 'lập', 'viết', 'cài đặt',
    'triển khai', 'cấu hình', 'giải', 'mô phỏng', 'định khoản', 'định giá', 'xử lý', 'điều hành',
    'vận hành', 'đọc', 'nghe', 'nói', 'vẽ', 'ghi', 'trao đổi', 'giao tiếp', 'dịch', 'thuyết trình',
    'tổ chức', 'đo', 'rút gọn', 'tuân thủ', 'chuẩn bị', 'bố trí', 'phối hợp', 'hướng dẫn'],
  analyze: ['phân tích', 'khảo sát', 'chẩn đoán', 'kiểm tra', 'đối chiếu', 'xác định nguyên nhân',
    'bóc tách', 'kiểm thử', 'rà soát', 'truy tìm'],
  evaluate: ['đánh giá', 'thẩm định', 'phản biện', 'bảo vệ', 'lựa chọn', 'nhận xét', 'kết luận',
    'phê phán', 'kiểm toán', 'nghiệm thu', 'xếp loại'],
  create: ['thiết kế', 'xây dựng', 'đề xuất', 'phát triển', 'sáng tác', 'lập', 'tạo', 'soạn',
    'biên tập', 'quy hoạch', 'viết', 'dựng', 'lên phương án', 'dịch'],
};

const SV = ['Trần Minh An', 'Lê Thu Hà', 'Nguyễn Quốc Bảo', 'Phạm Diệu Linh', 'Võ Đình Nam',
  'Đặng Khánh Vy', 'Hoàng Thị Mai', 'Bùi Tiến Dũng'];

// ─── Cổng kiểm nội dung do sub agent soạn ───────────────────────────────────
// Kiểm TRƯỚC khi ghi, vì sai lược đồ thì Postgres báo lỗi giữa chừng và để lại
// workspace nạp dở. Sai ngữ nghĩa (PLO không CLO nào đo) thì Postgres không hề
// báo gì, mà đó mới là lỗi làm hỏng ý nghĩa của cả màn tổng hợp PLO.
function kiem(d, ten) {
  const loi = [];
  const canh = [];
  const dem = (a) => (Array.isArray(a) ? a.length : -1);

  if (dem(d.peos) !== 3) loi.push(`PEO phải 3, đang ${dem(d.peos)}`);
  if (dem(d.plos) !== 6) loi.push(`PLO phải 6, đang ${dem(d.plos)}`);
  if (dem(d.courses) !== 6) loi.push(`học phần phải 6, đang ${dem(d.courses)}`);
  if (dem(d.clos) !== 18) loi.push(`CLO phải 18, đang ${dem(d.clos)}`);

  const maPlo = new Set((d.plos || []).map((p) => p.code));
  const maHp = new Set((d.courses || []).map((c) => c.code));

  for (const p of d.plos || []) {
    if (!BLOOM.includes(p.bloom_level)) loi.push(`${p.code} bloom lạ: ${p.bloom_level}`);
    if (!LOAI.includes(p.type)) loi.push(`${p.code} type lạ: ${p.type}`);
  }
  const loaiPlo = (d.plos || []).map((p) => p.type);
  if (!loaiPlo.includes('knowledge')) canh.push('không PLO nào loại knowledge');
  if (loaiPlo.filter((x) => x === 'skill').length < 2) canh.push('dưới 2 PLO loại skill');
  if (!loaiPlo.includes('attitude')) canh.push('không PLO nào loại attitude');

  for (const c of d.courses || []) {
    if (!(c.credits >= 1 && c.credits <= 6)) loi.push(`${c.code} tín chỉ lạ: ${c.credits}`);
    if (!(c.semester >= 1 && c.semester <= 8)) loi.push(`${c.code} học kỳ lạ: ${c.semester}`);
  }

  const phu = new Set();
  const cloTheoHp = {};
  for (const cl of d.clos || []) {
    if (!maHp.has(cl.course)) loi.push(`CLO ${cl.course}.${cl.code} trỏ tới học phần không có`);
    if (!BLOOM.includes(cl.bloom_level)) loi.push(`${cl.course}.${cl.code} bloom lạ: ${cl.bloom_level}`);
    if (!LOAI.includes(cl.type)) loi.push(`${cl.course}.${cl.code} type lạ: ${cl.type}`);
    for (const p of cl.plos || []) {
      if (!maPlo.has(p)) loi.push(`${cl.course}.${cl.code} ánh xạ tới ${p} không có trong PLO`);
      phu.add(p);
    }
    if (!(cl.plos || []).length) loi.push(`${cl.course}.${cl.code} không ánh xạ PLO nào`);
    cloTheoHp[cl.course] = (cloTheoHp[cl.course] || 0) + 1;
    // cảnh báo động từ lệch mức Bloom
    const dau = (cl.content || '').trim().toLowerCase();
    const hop = (DONG_TU[cl.bloom_level] || []).some((v) => dau.startsWith(v));
    if (!hop) canh.push(`${cl.course}.${cl.code} mở đầu "${(cl.content || '').split(' ').slice(0, 2).join(' ')}" `
      + `không khớp mức ${cl.bloom_level}`);
  }
  for (const m of maHp) if (cloTheoHp[m] !== 3) loi.push(`học phần ${m} có ${cloTheoHp[m] || 0} CLO, phải 3`);
  for (const m of maPlo) if (!phu.has(m)) loi.push(`${m} không CLO nào ánh xạ tới, tuyên bố mà không đo được`);

  // dấu gạch ngang dài dùng làm dấu câu
  const chu = JSON.stringify(d);
  const gach = (chu.match(/[–—]/g) || []).length;
  if (gach) canh.push(`còn ${gach} dấu gạch ngang dài trong văn bản`);

  return { ten, loi, canh };
}

// ─── Nạp một ngành ──────────────────────────────────────────────────────────
async function nap(W, d, nhan) {
  for (const t of ['scores', 'plan_students', 'assessment_items', 'assessment_plans',
    'clo_plo_map', 'course_plo_map', 'clos', 'courses', 'rubrics', 'plos', 'peos']) {
    await q(`DELETE FROM ${t} WHERE workspace_id=$1`, [W]);
  }

  const P = {};
  for (const p of d.peos) {
    await q('INSERT INTO peos(workspace_id,code,content) VALUES ($1,$2,$3)', [W, p.code, p.content]);
  }
  for (const p of d.plos) {
    P[p.code] = await insId(
      'INSERT INTO plos(workspace_id,code,content,bloom_level,type) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [W, p.code, p.content, p.bloom_level, p.type]);
  }

  const rub = await insId(
    `INSERT INTO rubrics(workspace_id,name,description,scale_type,levels)
     VALUES ($1,$2,$3,'A_D',$4) RETURNING id`,
    [W, `Rubric đồ án ngành ${d.nganh}`, 'Thang 4 mức dùng chấm đồ án và bài tập lớn',
      JSON.stringify([
        { name: 'Yếu', is_pass: false, weight: 25, description: 'Chưa đạt yêu cầu tối thiểu' },
        { name: 'Trung bình', is_pass: false, weight: 25, description: 'Đạt một phần yêu cầu' },
        { name: 'Khá', is_pass: true, weight: 25, description: 'Đạt yêu cầu, có căn cứ rõ ràng' },
        { name: 'Giỏi', is_pass: true, weight: 25, description: 'Vượt yêu cầu, lập luận thuyết phục' }])]);

  const C = {}, CL = {};
  for (const c of d.courses) {
    C[c.code] = await insId(
      "INSERT INTO courses(workspace_id,code,name,credits,semester,type) VALUES ($1,$2,$3,$4,$5,'core') RETURNING id",
      [W, c.code, c.name, c.credits, c.semester]);
  }
  for (const cl of d.clos) {
    // Gắn rubric cho CLO mức cao, vì đó là chỗ chấm bằng rubric chứ không phải
    // chấm đúng sai. CLO mức thấp để trống để màn CLO còn hiện cảnh báo
    // "chưa có rubric", đúng như hồ sơ thật lúc mới dựng.
    const caoTay = ['evaluate', 'create', 'analyze'].includes(cl.bloom_level);
    CL[cl.course + '.' + cl.code] = await insId(
      `INSERT INTO clos(workspace_id,course_id,code,content,bloom_level,type,rubric_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [W, C[cl.course], cl.code, cl.content, cl.bloom_level, cl.type, caoTay ? rub : null]);
    for (const p of cl.plos) {
      await q('INSERT INTO clo_plo_map(workspace_id,clo_id,plo_id,weight) VALUES ($1,$2,$3,1) ON CONFLICT DO NOTHING',
        [W, CL[cl.course + '.' + cl.code], P[p]]);
    }
  }

  // Ma trận học phần với PLO: I giới thiệu, R củng cố, M đo. Suy ra từ ánh xạ
  // CLO đã có, mức lấy theo học kỳ để học phần càng muộn càng nặng về đo.
  const capDo = {};
  for (const cl of d.clos) {
    const hk = d.courses.find((c) => c.code === cl.course).semester;
    const muc = hk <= 2 ? 'I' : hk <= 5 ? 'R' : 'M';
    for (const p of cl.plos) {
      const k = cl.course + '|' + p;
      const uu = { I: 1, R: 2, M: 3 };
      if (!capDo[k] || uu[muc] > uu[capDo[k]]) capDo[k] = muc;
    }
  }
  // Mỗi PLO phải có ít nhất một chỗ M, nếu không thì tuyên bố chuẩn đầu ra mà
  // không nơi nào đo. Nâng chỗ muộn nhất của PLO đó lên M.
  for (const p of Object.keys(P)) {
    const cua = Object.keys(capDo).filter((k) => k.endsWith('|' + p));
    if (cua.some((k) => capDo[k] === 'M')) continue;
    const muon = cua.sort((a, b) =>
      d.courses.find((c) => c.code === b.split('|')[0]).semester
      - d.courses.find((c) => c.code === a.split('|')[0]).semester)[0];
    if (muon) capDo[muon] = 'M';
  }
  for (const [k, muc] of Object.entries(capDo)) {
    const [hp, plo] = k.split('|');
    await q('INSERT INTO course_plo_map(workspace_id,course_id,plo_id,level) VALUES ($1,$2,$3,$4)',
      [W, C[hp], P[plo], muc]);
  }

  // ── Kế hoạch đo ───────────────────────────────────────────────────────────
  // Ba học phần muộn nhất được đo. Một trong ba cố ý để KHÔNG đạt ngưỡng: bảng
  // toàn xanh thì cột hành động cải tiến không bao giờ hiện, mà đó mới là chỗ
  // vòng cải tiến xảy ra.
  const doHp = [...d.courses].sort((a, b) => b.semester - a.semester).slice(0, 3).reverse();
  let soKh = 0, soDiem = 0;
  for (let i = 0; i < doHp.length; i++) {
    const c = doHp[i];
    const cloCua = d.clos.filter((x) => x.course === c.code);
    const plan = await insId(
      `INSERT INTO assessment_plans(workspace_id,course_id,name,semester,school_year,threshold_pct,pass_score_pct,status)
       VALUES ($1,$2,$3,$4,'2025-2026',75,50,'active') RETURNING id`,
      [W, C[c.code], `${c.code} · HK${c.semester % 2 === 0 ? 2 : 1} 2025-2026`, c.semester % 2 === 0 ? 2 : 1]);
    const id = (n) => CL[c.code + '.' + cloCua[n].code];
    const it1 = await insId(
      `INSERT INTO assessment_items(workspace_id,plan_id,name,type,max_score,clo_targets)
       VALUES ($1,$2,'Bài tập lớn giữa kỳ','project',10,$3) RETURNING id`,
      [W, plan, JSON.stringify([{ clo_id: id(0), weight: 60 }, { clo_id: id(1), weight: 40 }])]);
    const it2 = await insId(
      `INSERT INTO assessment_items(workspace_id,plan_id,name,type,max_score,clo_targets)
       VALUES ($1,$2,'Thi cuối kỳ','test',10,$3) RETURNING id`,
      [W, plan, JSON.stringify([{ clo_id: id(1), weight: 50 }, { clo_id: id(2), weight: 50 }])]);
    // Học phần giữa danh sách để điểm thấp cho rớt ngưỡng 75%.
    const yeu = i === 1;
    const diem = yeu
      ? [[4.5, 5], [5, 4], [6, 5.5], [4, 4.5], [5.5, 5], [3.5, 4], [6, 5], [4.5, 5.5]]
      : [[8, 7.5], [7, 8], [6.5, 7], [9, 8.5], [5.5, 6], [7.5, 7], [8, 9], [6, 6.5]];
    for (let n = 0; n < diem.length; n++) {
      const sid = await insId(
        'INSERT INTO plan_students(workspace_id,plan_id,code,full_name) VALUES ($1,$2,$3,$4) RETURNING id',
        [W, plan, nhanMa(nhan) + '26' + String(n + 1).padStart(3, '0'), SV[n % SV.length]]);
      await q('INSERT INTO scores(workspace_id,item_id,plan_student_id,score) VALUES ($1,$2,$3,$4)', [W, it1, sid, diem[n][0]]);
      await q('INSERT INTO scores(workspace_id,item_id,plan_student_id,score) VALUES ($1,$2,$3,$4)', [W, it2, sid, diem[n][1]]);
      soDiem += 2;
    }
    soKh++;
  }
  return { soKh, soDiem, soCapDo: Object.keys(capDo).length };
}

function nhanMa(nhan) {
  return nhan.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd')
    .replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
}

async function main() {
  const tep = fs.existsSync(THU_MUC) ? fs.readdirSync(THU_MUC).filter((f) => f.endsWith('.json')) : [];
  console.log(`Tệp mẫu tìm thấy trong ctdt-mau/: ${tep.length}`);
  if (!tep.length) { console.log('Không có tệp nào, dừng.'); return; }

  const dsWs = await q("SELECT id, name FROM workspaces WHERE type='CTDT'");
  const wsTheoNhan = {};
  for (const w of dsWs) wsTheoNhan[w.name.replace(new RegExp(`\\s*${NAM}$`), '')] = w;

  const viec = [];
  let hong = 0;
  for (const f of tep.sort()) {
    const d = JSON.parse(fs.readFileSync(path.join(THU_MUC, f), 'utf8'));
    const muc = NGANH.find(([, , , , slug]) => slug === d.slug);
    if (!muc) { console.log(`   ${f}: slug "${d.slug}" không có trong danh mục ngành`); hong++; continue; }
    const ws = wsTheoNhan[muc[0]];
    if (!ws) { console.log(`   ${f}: chưa có đợt kiểm định cho ngành ${muc[0]}`); hong++; continue; }
    const kq = kiem(d, muc[0]);
    if (kq.loi.length) {
      hong++;
      console.log(`   ${muc[0].padEnd(18)} HỎNG · ${kq.loi.length} lỗi`);
      for (const l of kq.loi.slice(0, 6)) console.log(`        · ${l}`);
    } else {
      console.log(`   ${muc[0].padEnd(18)} đạt · ${kq.canh.length ? kq.canh.length + ' cảnh báo' : 'sạch'}`);
      for (const c of kq.canh.slice(0, 3)) console.log(`        ~ ${c}`);
    }
    if (!kq.loi.length) viec.push({ ws, d, nhan: muc[0] });
  }

  console.log(`\nQua cổng: ${viec.length}/${tep.length} ngành` + (hong ? `, ${hong} ngành bị loại` : ''));
  if (THU) { console.log('Chạy thử, chưa ghi gì. Bỏ --thu để nạp.'); return; }
  if (hong) { console.log('CÓ NGÀNH KHÔNG QUA CỔNG, dừng để khỏi nạp nửa vời.'); process.exitCode = 1; return; }

  console.log('\nNẠP:');
  for (const v of viec) {
    const r = await nap(v.ws.id, v.d, v.nhan);
    console.log(`   ${v.nhan.padEnd(18)} 3 PEO · 6 PLO · 6 học phần · 18 CLO · `
      + `${r.soCapDo} ô ma trận · ${r.soKh} kế hoạch đo · ${r.soDiem} điểm`);
  }

  // ── Đối soát sau khi ghi, đọc lại từ CSDL chứ không tin biến trong bộ nhớ ──
  console.log('\nĐỐI SOÁT:');
  const bang = ['peos', 'plos', 'courses', 'clos', 'clo_plo_map', 'course_plo_map', 'assessment_plans', 'scores'];
  let sai = 0;
  for (const w of await q("SELECT id, name FROM workspaces WHERE type='CTDT' ORDER BY id")) {
    const so = {};
    for (const t of bang) so[t] = (await one(`SELECT count(*)::int n FROM ${t} WHERE workspace_id=$1`, [w.id])).n;
    const trong = bang.filter((t) => so[t] === 0);
    if (trong.length) { sai++; console.log(`   ${w.name.padEnd(22)} CÒN TRỐNG: ${trong.join(' ')}`); }
    else console.log(`   ${w.name.padEnd(22)} ${so.peos} PEO · ${so.plos} PLO · ${so.courses} HP · ${so.clos} CLO · `
      + `${so.clo_plo_map} ánh xạ CLO · ${so.course_plo_map} ô ma trận · ${so.assessment_plans} kế hoạch · ${so.scores} điểm`);
  }

  // ── Vá chỗ PLO không được đo ──────────────────────────────────────────────
  // Tuyên bố một chuẩn đầu ra mà không học phần nào đo ở mức M thì màn tổng hợp
  // PLO trống đúng chỗ đó, và hồ sơ tự đánh giá không trả lời được câu "đo ở
  // đâu". Lỗi này có sẵn ở hai đợt viết tay từ trước, nên vá cho CẢ 18 đợt.
  // Chỉ NÂNG một ô đã có sẵn lên M, không tạo ô mới: gán một học phần vào PLO
  // mà nó không dạy thì là bịa ma trận.
  let va = 0;
  for (const w of await q("SELECT id, name FROM workspaces WHERE type='CTDT' ORDER BY id")) {
    const chua = await q(
      `SELECT p.id, p.code FROM plos p WHERE p.workspace_id=$1
        AND NOT EXISTS (SELECT 1 FROM course_plo_map m WHERE m.plo_id=p.id AND m.level='M')`, [w.id]);
    for (const p of chua) {
      const muon = await one(
        `SELECT m.id, c.code FROM course_plo_map m JOIN courses c ON c.id=m.course_id
          WHERE m.plo_id=$1 ORDER BY c.semester DESC LIMIT 1`, [p.id]);
      if (!muon) { console.log(`   ${w.name} · ${p.code}: không có ô nào để nâng, cần người gán học phần`); continue; }
      await q("UPDATE course_plo_map SET level='M' WHERE id=$1", [muon.id]);
      va++;
      console.log(`   vá ${w.name} · ${p.code}: nâng ô ${muon.code} lên M`);
    }
  }
  if (!va) console.log('   Không đợt nào cần vá ô đo.');

  // PLO nào không có học phần nào đo ở mức M thì màn tổng hợp PLO sẽ trống chỗ đó
  const thieuM = await q(
    `SELECT w.name, p.code FROM plos p JOIN workspaces w ON w.id=p.workspace_id
      WHERE w.type='CTDT' AND NOT EXISTS (
        SELECT 1 FROM course_plo_map m WHERE m.plo_id=p.id AND m.level='M')
      ORDER BY w.id, p.code`);
  console.log(thieuM.length
    ? `   CÓ ${thieuM.length} PLO không được đo ở mức M: ` + thieuM.map((r) => r.name + '/' + r.code).join(', ')
    : '   Mọi PLO của mọi đợt đều có ít nhất một học phần đo ở mức M.');
  if (sai) console.log(`   CÒN ${sai} đợt thiếu dữ liệu chuẩn đầu ra.`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => pool.end());
