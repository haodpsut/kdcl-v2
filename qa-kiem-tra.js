// ─── Bộ kiểm toàn hệ, đọc thẳng CSDL ────────────────────────────────────────
// Chạy:  docker exec kdcl-app node qa-kiem-tra.js
//
// Kiểm những thứ mà giao diện KHÔNG tự báo: mã tiêu chí nằm ngoài khung của
// đợt, khai báo bao phủ trỏ vào mục gợi ý không tồn tại, chuẩn đầu ra tuyên bố
// mà không học phần nào đo, đơn vị chưa có tài khoản, đợt thiếu dữ liệu.
//
// Mỗi mục in ĐẠT hoặc HỎNG kèm số liệu. Không có mục nào im lặng: một phép
// kiểm không tìm thấy gì vẫn phải in ra nó đã soi bao nhiêu bản ghi, vì phép
// kiểm trỏ nhầm chỗ cũng cho ra "sạch".
const { q, one, pool } = require('./db');
const { STANDARDS_TT04 } = require('./standards-tt04.js');
const { STANDARDS_DETAIL_TT04 } = require('./standards-detail-tt04.js');
const { STANDARDS_DETAIL } = require('./standards-detail.js');
const { KHOA, NGANH } = require('./danh-muc-nganh.js');

let hong = 0;
const bao = (ten, dat, chiTiet) => {
  if (!dat) hong++;
  console.log(`${dat ? '  ĐẠT ' : '  HỎNG'} ${ten.padEnd(46)} ${chiTiet}`);
};

const MA04 = STANDARDS_TT04.flatMap((s) => s.criteria.map((c) => c.code));

// Quét mã nguồn tìm chuỗi "TT26" sót lại. Bốn tệp dưới đây được phép chứa nó
// vì chúng đang GIẢI THÍCH cú nhầm số hiệu, không phải dùng nó làm nhãn.
const MIEN_TRU = ['qa-kiem-tra.js', 'README.md', 'standards-full-tt20.js', 'standards-detail.js'];
function quetNguon(goc = __dirname) {
  const fs = require('fs'), path = require('path');
  const hit = []; let soFile = 0;
  const di = (thuMuc) => {
    for (const e of fs.readdirSync(thuMuc, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'uploads'
        || e.name === '.docker-data' || e.name === 'sql') continue;
      const p = path.join(thuMuc, e.name);
      if (e.isDirectory()) { di(p); continue; }
      if (!/\.(js|html|md|sql|tex)$/.test(e.name)) continue;
      if (MIEN_TRU.includes(e.name)) continue;
      soFile++;
      if (fs.readFileSync(p, 'utf8').includes('TT26')) hit.push(path.relative(goc, p));
    }
  };
  di(goc);
  return { hit, soFile };
}

async function main() {
  const ws = await q('SELECT id, name, type FROM workspaces ORDER BY id');
  console.log(`\n━━ 1. ĐỢT KIỂM ĐỊNH ━━ ${ws.length} đợt`);
  const ctdt = ws.filter((w) => w.type === 'CTDT');
  const csgd = ws.filter((w) => w.type === 'CSGD');
  bao('số đợt CTĐT bằng số ngành trong danh mục', ctdt.length === NGANH.length,
    `${ctdt.length} đợt / ${NGANH.length} ngành`);
  bao('có đợt cơ sở giáo dục', csgd.length >= 1, `${csgd.length} đợt CSGD`);
  const thieuTen = NGANH.filter(([n]) => !ctdt.some((w) => w.name.startsWith(n)));
  bao('mọi ngành trong danh mục đều có đợt', !thieuTen.length,
    thieuTen.length ? 'thiếu: ' + thieuTen.map((x) => x[0]).join(', ') : 'đủ');

  console.log('\n━━ 2. BỘ TIÊU CHUẨN ━━');
  bao('TT04 đủ 8 tiêu chuẩn 52 tiêu chí', STANDARDS_TT04.length === 8 && MA04.length === 52,
    `${STANDARDS_TT04.length} tiêu chuẩn · ${MA04.length} tiêu chí`);
  const thieuND = MA04.filter((c) => {
    const d = STANDARDS_DETAIL_TT04[c];
    return !d || !d.requirements.length || !d.suggested_evidence.length || !d.self_check_questions.length;
  });
  bao('mọi tiêu chí TT04 có đủ nội dung', !thieuND.length,
    thieuND.length ? 'trống: ' + thieuND.join(' ')
      : `${MA04.reduce((a, c) => a + STANDARDS_DETAIL_TT04[c].requirements.length, 0)} yêu cầu · `
        + `${MA04.reduce((a, c) => a + STANDARDS_DETAIL_TT04[c].suggested_evidence.length, 0)} minh chứng gợi ý`);
  const DK = MA04.filter((c) => STANDARDS_DETAIL_TT04[c].dieu_kien);
  bao('đúng 10 tiêu chí điều kiện theo Điều 13', DK.length === 10, DK.join(' '));
  bao('TT20 vẫn đủ 60 tiêu chí', Object.keys(STANDARDS_DETAIL).length === 60,
    `${Object.keys(STANDARDS_DETAIL).length} tiêu chí`);
  // Nhãn số hiệu: bộ tiêu chuẩn CSGD là Thông tư 20/2026, KHÔNG phải 26/2026
  // (26/2026 là chuẩn nghề nghiệp giảng viên). Kiểm cả CSDL lẫn mã nguồn vì
  // chuỗi hiện trên màn hình lấy từ cột law trong CSDL, sửa mã nguồn không đủ.
  const nhanSai = await q("SELECT id, name, law FROM workspaces WHERE law LIKE '%TT26%'");
  bao('nhãn thông tư trong CSDL không còn TT26', !nhanSai.length,
    nhanSai.length ? nhanSai.map((w) => `${w.name}="${w.law}"`).join(', ')
      : `${ws.length} đợt, nhãn: ${[...new Set(ws.map((w) => w.law))].join(' · ')}`);
  const cs = await q("SELECT count(*)::int n FROM workspaces WHERE type='CSGD' AND law LIKE '%TT20%'");
  bao('đợt CSGD gắn đúng TT20/2026', csgd.length === 0 || cs[0].n === csgd.length,
    `${cs[0].n}/${csgd.length} đợt CSGD ghi TT20`);
  const daQuet = quetNguon();
  bao('mã nguồn không còn chuỗi TT26', !daQuet.hit.length,
    daQuet.hit.length ? daQuet.hit.join(', ') : `đã soi ${daQuet.soFile} tệp`);

  console.log('\n━━ 3. MINH CHỨNG ━━');
  let ngoaiKhung = 0, saiKhai = 0, tongMC = 0, tongKhai = 0;
  const thieuMC = [];
  for (const w of ctdt) {
    const ma = (await q('SELECT DISTINCT tieu_chi FROM evidence WHERE workspace_id=$1', [w.id])).map((r) => r.tieu_chi);
    ngoaiKhung += ma.filter((c) => !MA04.includes(c)).length;
    if (ma.length < 52) thieuMC.push(`${w.name} ${ma.length}/52`);
    const rows = await q(
      'SELECT tieu_chi, sug_names FROM evidence WHERE workspace_id=$1 AND array_length(sug_names,1) > 0', [w.id]);
    for (const r of rows) {
      const hopLe = new Set((STANDARDS_DETAIL_TT04[r.tieu_chi] || { suggested_evidence: [] })
        .suggested_evidence.map((g) => g.name));
      for (const n of r.sug_names) { tongKhai++; if (!hopLe.has(n)) saiKhai++; }
    }
    tongMC += (await one('SELECT count(*)::int n FROM evidence WHERE workspace_id=$1', [w.id])).n;
  }
  bao('không mã tiêu chí nào ngoài khung TT04', ngoaiKhung === 0, `soi ${ctdt.length} đợt`);
  bao('mọi đợt CTĐT phủ đủ 52 tiêu chí', !thieuMC.length, thieuMC.length ? thieuMC.join(' · ') : `${tongMC} minh chứng`);
  bao('khai báo bao phủ khớp Phụ lục II', saiKhai === 0, `soi ${tongKhai} khai báo, lệch ${saiKhai}`);

  console.log('\n━━ 4. CHUẨN ĐẦU RA ━━');
  const bang = ['peos', 'plos', 'courses', 'clos', 'clo_plo_map', 'course_plo_map', 'assessment_plans', 'scores'];
  const trong = [];
  for (const w of ctdt) {
    for (const t of bang) {
      const n = (await one(`SELECT count(*)::int n FROM ${t} WHERE workspace_id=$1`, [w.id])).n;
      if (!n) trong.push(`${w.name}/${t}`);
    }
  }
  bao('mọi đợt CTĐT có đủ 8 bảng chuẩn đầu ra', !trong.length,
    trong.length ? trong.slice(0, 5).join(' · ') : `soi ${ctdt.length} đợt × ${bang.length} bảng`);

  const thieuM = await q(
    `SELECT w.name, p.code FROM plos p JOIN workspaces w ON w.id=p.workspace_id
      WHERE w.type='CTDT' AND NOT EXISTS (SELECT 1 FROM course_plo_map m WHERE m.plo_id=p.id AND m.level='M')`);
  const tongPlo = (await one("SELECT count(*)::int n FROM plos p JOIN workspaces w ON w.id=p.workspace_id WHERE w.type='CTDT'")).n;
  bao('mọi PLO có học phần đo ở mức M', !thieuM.length,
    thieuM.length ? thieuM.map((r) => r.name + '/' + r.code).join(', ') : `soi ${tongPlo} PLO`);

  const cloLac = await one(
    `SELECT count(*)::int n FROM clo_plo_map m
      JOIN clos c ON c.id=m.clo_id JOIN plos p ON p.id=m.plo_id
      WHERE c.workspace_id <> m.workspace_id OR p.workspace_id <> m.workspace_id`);
  bao('không ánh xạ nào bắc qua hai đợt khác nhau', cloLac.n === 0, `lệch ${cloLac.n}`);

  const ploTrong = await q(
    `SELECT w.name, p.code FROM plos p JOIN workspaces w ON w.id=p.workspace_id
      WHERE w.type='CTDT' AND NOT EXISTS (SELECT 1 FROM clo_plo_map m WHERE m.plo_id=p.id)`);
  bao('mọi PLO có ít nhất một CLO ánh xạ tới', !ploTrong.length,
    ploTrong.length ? ploTrong.map((r) => r.name + '/' + r.code).join(', ') : `soi ${tongPlo} PLO`);

  console.log('\n━━ 5. ĐƠN VỊ VÀ TÀI KHOẢN ━━');
  const dv = await q('SELECT id, code, name FROM units ORDER BY code');
  const thieuKhoa = KHOA.filter(([c]) => !dv.some((u) => u.code === c));
  bao('đủ các khoa trong danh mục', !thieuKhoa.length,
    thieuKhoa.length ? thieuKhoa.map((x) => x[0]).join(' ') : `${dv.length} đơn vị`);
  const khongTk = [];
  for (const u of dv) {
    const tk = await one('SELECT id FROM users WHERE unit_id=$1 AND active', [u.id]);
    if (!tk) khongTk.push(u.code);
  }
  bao('mọi đơn vị đều có tài khoản đang hoạt động', !khongTk.length,
    khongTk.length ? 'thiếu: ' + khongTk.join(' ') : `soi ${dv.length} đơn vị`);

  const vaiLa = await q("SELECT DISTINCT role FROM users WHERE role NOT IN ('admin','unit','viewer')");
  bao('không tài khoản nào mang vai lạ', !vaiLa.length, vaiLa.map((r) => r.role).join(' ') || 'admin · unit · viewer');

  // Đơn vị nào không được phân công tiêu chí ở đợt nào thì đăng nhập vào sẽ
  // không thấy đợt nào, người dùng tưởng hệ hỏng.
  const khongViec = [];
  for (const u of dv) {
    const n = (await one('SELECT count(*)::int n FROM unit_criteria WHERE unit_id=$1', [u.id])).n;
    if (!n) khongViec.push(u.code);
  }
  bao('mọi đơn vị đều được phân công ở ít nhất một đợt', !khongViec.length,
    khongViec.length ? 'chưa có việc: ' + khongViec.join(' ') : `soi ${dv.length} đơn vị`);

  console.log('\n━━ 6. PHIẾU TỰ ĐÁNH GIÁ ━━');
  const phieuLac = await q(
    `SELECT DISTINCT w.name, a.tieu_chi FROM assessments a JOIN workspaces w ON w.id=a.workspace_id
      WHERE w.type='CTDT' AND a.tieu_chi <> ALL($1)`, [MA04]);
  bao('phiếu của đợt CTĐT đều dùng mã TT04', !phieuLac.length,
    phieuLac.length ? phieuLac.map((r) => r.name + '/' + r.tieu_chi).join(', ') : 'soi toàn bộ phiếu');

  // Điều 13: tiêu chí điều kiện không đạt thì cả tiêu chuẩn không đạt. Phần mềm
  // CHƯA tự áp luật này, nên ở đây chỉ LIỆT KÊ để người dùng biết đợt nào vướng.
  const truot = await q(
    `SELECT w.name, a.tieu_chi FROM assessments a JOIN workspaces w ON w.id=a.workspace_id
      WHERE w.type='CTDT' AND a.ket_qua='KHONG_DAT' AND a.tieu_chi = ANY($1) ORDER BY w.id`, [DK]);
  console.log(`  GHI CHÚ tiêu chí ĐIỀU KIỆN không đạt: ${truot.length ? truot.length + ' chỗ' : 'không có'}`);
  for (const r of truot) {
    console.log(`         ${r.name} · ${r.tieu_chi} → theo Điều 13 cả tiêu chuẩn ${r.tieu_chi.split('.')[0]} không đạt`);
  }
  console.log('         Phần mềm chưa tự áp luật này, người dùng phải tự kết luận.');

  console.log(`\n━━ KẾT ━━ ${hong ? hong + ' mục HỎNG' : 'toàn bộ ĐẠT'}`);
  if (hong) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => pool.end());
