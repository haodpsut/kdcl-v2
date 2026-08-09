// ─── Dựng lại dữ liệu mẫu của các đợt CTĐT theo đúng khung TT04/2025 ────────
// Chạy:  docker exec kdcl-app node mock-ctdt-tt04.js
//        docker exec kdcl-app node mock-ctdt-tt04.js --thu   (chỉ xem, không ghi)
//
// Vì sao cần: ba đợt kiểm định chương trình đào tạo trước đây gắn minh chứng,
// phân công và phiếu đánh giá theo bộ 15 tiêu chuẩn 60 tiêu chí của TT26, tức
// khung dành cho CƠ SỞ GIÁO DỤC. Nhiều mã trong đó là địa chỉ KHÔNG TỒN TẠI
// trong khung TT04, ví dụ 9.1, 11.1, 13.2. Có mã tồn tại ở cả hai khung nhưng
// mang nghĩa khác hẳn, ví dụ 6.6.
//
// Không thể ánh xạ tự động từ khung này sang khung kia, vì "9.1 Cơ cấu và
// chính sách bảo đảm chất lượng bên trong" của TT26 không có tiêu chí tương
// đương nào trong TT04; gán bừa là bịa. Toàn bộ dữ liệu CTĐT hiện tại là dữ
// liệu MẪU do các script trong kho này sinh ra, nên cách đúng là dựng lại theo
// khung chuẩn thay vì cố ánh xạ.
//
// Script CHỈ đụng ba bảng gắn với khung tiêu chuẩn: evidence, unit_criteria,
// assessments, và CHỈ trong các workspace loại CTDT. Dữ liệu chuẩn đầu ra
// (PEO, PLO, học phần, CLO, rubric, kế hoạch đo, điểm) không liên quan tới bộ
// tiêu chuẩn nên giữ nguyên.
const { q, one, pool } = require('./db');
const { STANDARDS_TT04 } = require('./standards-tt04.js');
const { STANDARDS_DETAIL_TT04: CHI_TIET } = require('./standards-detail-tt04.js');
const fs = require('fs');
const path = require('path');

const THU = process.argv.includes('--thu');
const DATA_DIR = process.env.DATA_DIR || __dirname;
const UP = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(UP, { recursive: true });

const MA_HOP_LE = new Set(STANDARDS_TT04.flatMap((s) => s.criteria.map((c) => c.code)));
const DIEU_KIEN = new Set(STANDARDS_TT04.flatMap((s) => s.criteria).filter((c) => c.dieu_kien).map((c) => c.code));
const TEN = {};
for (const s of STANDARDS_TT04) for (const c of s.criteria) TEN[c.code] = c.short;

// Minh chứng mẫu, mã tiêu chí lấy đúng theo TT04 và nội dung bám nghĩa của
// từng tiêu chí. Cột cuối là đơn vị chủ quản theo mã đơn vị trong bảng units.
const MC_CHUNG = (nganh, khoa) => ([
  ['1.1', 'PDT',  `Quyết định ban hành mục tiêu chương trình đào tạo ngành ${nganh}`, 'da_xac_nhan', 'file'],
  ['1.2', khoa,   `Bản chuẩn đầu ra ngành ${nganh} và biên bản phổ biến tới các bên liên quan`, 'da_xac_nhan', 'file'],
  ['1.3', 'PDT',  `Bảng đối sánh chuẩn đầu ra với Khung trình độ quốc gia Việt Nam`, 'da_xac_nhan', 'file'],
  ['1.5', khoa,   `Biên bản lấy ý kiến các bên liên quan về mục tiêu và chuẩn đầu ra`, 'cho_duyet', 'link'],
  ['2.1', 'PDT',  `Chương trình đào tạo ngành ${nganh} khóa 2026 (bản ban hành)`, 'da_xac_nhan', 'file'],
  ['2.2', 'PDT',  `Ma trận đóng góp của học phần vào chuẩn đầu ra (curriculum map)`, 'da_xac_nhan', 'file'],
  ['2.5', khoa,   `Đề cương chi tiết các học phần chuyên ngành`, 'da_xac_nhan', 'file'],
  ['3.2', khoa,   `Kế hoạch dạy học thể hiện tương thích giữa hoạt động dạy học và chuẩn đầu ra`, 'cho_duyet', 'file'],
  ['4.5', khoa,   `Báo cáo kết quả đo lường mức đạt chuẩn đầu ra học phần và chương trình`, 'tra_lai', 'file',
    'Thiếu bảng điểm gốc và mô tả cách quy đổi sang mức đạt.'],
  ['5.2', 'PTCHC', `Danh sách đội ngũ giảng viên cơ hữu kèm trình độ và lĩnh vực chuyên môn`, 'da_xac_nhan', 'file'],
  ['5.6', 'PKHCN', `Danh mục công bố khoa học của giảng viên tham gia chương trình`, 'cho_duyet', 'link'],
  ['6.1', 'PCTSV', `Quy định về cố vấn học tập và các dịch vụ hỗ trợ người học`, 'da_xac_nhan', 'link'],
  ['7.3', 'PKHTC', `Danh mục nguồn học liệu và thư viện số phục vụ chương trình`, 'da_xac_nhan', 'file'],
  ['8.2', 'PKHCN', `Khảo sát tình trạng việc làm của người tốt nghiệp sau 12 tháng`, 'cho_duyet', 'file'],
]);

// Mười bốn minh chứng trên đây là bản viết tay, tên tài liệu theo lối đơn vị
// hay đặt. Chúng KHÔNG khai mục gợi ý nào, nên nằm ở nhóm "chưa khai báo" của
// panel tiêu chí, đúng như hồ sơ thật lúc mới nộp.
//
// Phần dưới phủ đều cả 52 tiêu chí. Tên tài liệu lấy nguyên văn từ danh mục
// MINH CHỨNG GỢI Ý của Phụ lục II, và khai đúng mục đó, nên con số bao phủ là
// khai báo thật chứ không phải đoán chữ. Không phủ 100%: hồ sơ tự đánh giá
// thật không bao giờ đủ hết, và màn này sinh ra để chỉ ra chỗ còn thiếu.
//
// Đơn vị chủ quản gán theo tiêu chuẩn, bám phân công thường gặp ở trường.
const DON_VI_THEO_TC = { 1: 'PDT', 2: 'PDT', 3: null, 4: null, 5: 'PTCHC', 6: 'PCTSV', 7: 'PKHTC', 8: 'PKHCN' };

function minhChungTheoGoiY(nganh, khoa) {
  const ds = [];
  for (const s of STANDARDS_TT04) {
    for (const c of s.criteria) {
      const goiY = (CHI_TIET[c.code] || {}).suggested_evidence || [];
      // Tiêu chí ĐIỀU KIỆN phủ dày hơn vì chỉ cần nó trượt là cả tiêu chuẩn
      // trượt; các tiêu chí khác lấy cách quãng để còn chừa chỗ trống thật.
      const chon = goiY.filter((_, i) => (c.dieu_kien ? i % 3 !== 2 : i % 2 === 0));
      const dv = DON_VI_THEO_TC[s.id] || khoa;
      chon.forEach((g, k) => {
        // Ba trạng thái xen kẽ để cổng duyệt của Phòng ĐBCL có việc thật để làm.
        const tt = k % 4 === 1 ? 'cho_duyet' : k % 7 === 3 ? 'tra_lai' : 'da_xac_nhan';
        ds.push([c.code, dv, g.name, tt, k % 3 === 1 ? 'link' : 'file',
          tt === 'tra_lai' ? 'Tài liệu chưa có số hiệu và ngày ban hành, đề nghị nộp lại bản chính thức.' : '',
          g.name]);   // cột cuối: khai đúng mục gợi ý này
      });
    }
  }
  return ds;
}

// Phiếu đánh giá tiêu chí, cố ý có đủ ba trạng thái và có một tiêu chí ĐIỀU
// KIỆN không đạt, để thấy luật "một tiêu chí điều kiện không đạt thì cả tiêu
// chuẩn không đạt" có chỗ để kiểm chứng.
const PHIEU_CHUNG = (nganh) => ([
  ['1.1', 'DAT', 'approved',
    `Mục tiêu chương trình ${nganh} được ban hành, gắn với sứ mạng và chiến lược của Trường`,
    'Có quyết định ban hành và được rà soát theo chu kỳ',
    'Chưa đối sánh với chương trình cùng ngành ở nước ngoài',
    'Bổ sung đối sánh quốc tế trong kỳ rà soát tới'],
  ['1.3', 'DAT', 'approved',
    'Chuẩn đầu ra đã đối sánh với Khung trình độ quốc gia và chuẩn chương trình nhóm ngành',
    'Có bảng đối sánh đầy đủ theo từng bậc', 'Chuẩn đầu ra chuyên biệt còn chung chung',
    'Viết lại chuẩn đầu ra chuyên biệt theo hướng đo được'],
  ['2.2', 'DAT', 'draft',
    'Ma trận học phần và chuẩn đầu ra đã lập cho toàn chương trình',
    'Mỗi chuẩn đầu ra đều có học phần nhận đo', 'Hai chuẩn đầu ra chỉ có một học phần đo',
    'Bổ sung học phần đo cho các chuẩn đầu ra còn mỏng'],
  ['3.2', 'DAT', 'approved',
    'Hoạt động dạy và học được thiết kế bám theo chuẩn đầu ra của từng học phần',
    'Đề cương nêu rõ phương pháp dạy học tương ứng', 'Chưa có minh chứng dự giờ định kỳ',
    'Lập kế hoạch dự giờ và ghi nhận kết quả'],
  ['4.5', 'KHONG_DAT', 'approved',
    'Đo lường mức đạt chuẩn đầu ra mới thực hiện ở một phần học phần',
    'Đã có rubric cho học phần đồ án',
    'Một học phần đạt dưới ngưỡng, và hồ sơ đo còn thiếu bảng điểm gốc',
    'Điều chỉnh đề bài, tăng giờ thực hành và bổ sung hồ sơ đo'],
  ['5.2', 'DAT', 'approved',
    'Đội ngũ giảng viên cơ hữu đáp ứng quy mô đào tạo của chương trình',
    'Có kế hoạch bồi dưỡng giai đoạn 2026-2028', 'Tỷ lệ giảng viên có trình độ tiến sĩ còn thấp',
    'Tuyển thêm giảng viên trình độ tiến sĩ'],
  ['6.1', 'DAT', 'draft',
    'Có hệ thống cố vấn học tập và các dịch vụ hỗ trợ người học',
    'Người học tiếp cận được dịch vụ hỗ trợ', 'Chưa tổng hợp phản hồi định kỳ',
    'Lập kênh ghi nhận phản hồi hằng kỳ'],
  ['7.3', 'DAT', 'approved',
    'Thư viện và nguồn học liệu số đáp ứng nhu cầu của chương trình',
    'Có cơ sở dữ liệu điện tử dùng chung', 'Bản quyền một phần mềm chuyên ngành sắp hết hạn',
    'Bố trí kinh phí gia hạn bản quyền'],
  ['8.1', 'CHUA', 'draft', 'Đang tổng hợp số liệu tốt nghiệp và thôi học theo khóa', '', '', ''],
  ['8.2', 'CHUA', 'draft', 'Đang khảo sát tình trạng việc làm của người tốt nghiệp', '', '', ''],
]);

let seq = 0;
function taoTep(code, tc, mota) {
  seq++;
  const stored = `tt04_${code}_${seq}.txt`;
  const noi = `MINH CHỨNG MẪU · Kiểm định chương trình đào tạo
Căn cứ: Thông tư 04/2025/TT-BGDĐT
========================================
Mã minh chứng : ${code}
Tiêu chí       : ${tc} · ${TEN[tc] || ''}
Tên tài liệu   : ${mota}
----------------------------------------
Đây là tệp minh chứng MẪU dùng để minh hoạ quy trình nộp và duyệt.
Khi triển khai thật, đơn vị thay bằng văn bản chính thức có chữ ký và dấu.
`;
  fs.writeFileSync(path.join(UP, stored), noi, 'utf8');
  return { file_name: `${mota}.txt`, file_stored: stored, file_size: Buffer.byteLength(noi, 'utf8'), mime: 'text/plain' };
}

async function main() {
  const admin = (await one("SELECT id FROM users WHERE role='admin' ORDER BY id LIMIT 1")).id;
  const U = {}; for (const u of await q('SELECT id, code FROM units')) U[u.code] = u.id;
  const dsWs = await q("SELECT id, name FROM workspaces WHERE type='CTDT' ORDER BY id");

  // Khảo sát trước: mã nào đang nằm ngoài khung TT04
  console.log('TRƯỚC KHI SỬA, mã tiêu chí đang dùng ở các đợt CTĐT:');
  for (const ws of dsWs) {
    const ev = await q('SELECT DISTINCT tieu_chi FROM evidence WHERE workspace_id=$1 ORDER BY tieu_chi', [ws.id]);
    const ngoai = ev.map((x) => x.tieu_chi).filter((c) => !MA_HOP_LE.has(c));
    console.log(`   ${ws.name.padEnd(16)} ${ev.length} mã, ngoài khung TT04: ${ngoai.length ? ngoai.join(', ') : 'không'}`);
  }
  if (THU) { console.log('\nChạy thử, chưa ghi gì. Bỏ --thu để dựng lại theo khung TT04.'); return; }

  for (const ws of dsWs) {
    const W = ws.id;
    const nganh = ws.name.replace(/\s*20\d\d$/, '').trim();
    const khoa = nganh.includes('Logistics') ? 'KLOG' : nganh.includes('KTr') || nganh.includes('Kiến') ? 'KKT' : 'KCNTT';

    // Dọn đúng ba bảng gắn với khung tiêu chuẩn, chỉ trong workspace này
    for (const f of await q("SELECT file_stored FROM evidence WHERE workspace_id=$1 AND file_stored IS NOT NULL", [W]))
      { try { fs.unlinkSync(path.join(UP, f.file_stored)); } catch (e) {} }
    await q('DELETE FROM evidence WHERE workspace_id=$1', [W]);
    await q('DELETE FROM unit_criteria WHERE workspace_id=$1', [W]);
    await q('DELETE FROM assessments WHERE workspace_id=$1', [W]);

    // Phân công tiêu chí theo đúng đơn vị chủ quản trong danh sách minh chứng
    const ds = [...MC_CHUNG(nganh, khoa), ...minhChungTheoGoiY(nganh, khoa)];
    const giao = new Set(ds.filter(([, u]) => u).map(([tc, u]) => u + '|' + tc));
    giao.add(khoa + '|8.1');      // tiêu chí đã giao mà chưa nộp, để cổng đơn vị có việc đang chờ
    for (const key of giao) {
      const [u, tc] = key.split('|');
      if (!U[u]) continue;
      await q('INSERT INTO unit_criteria(workspace_id,unit_id,tieu_chi) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING', [W, U[u], tc]);
    }

    // Minh chứng
    const dem = {};
    for (const [tc, u, mota, tt, loai, note, khaiMuc] of ds) {
      if (!MA_HOP_LE.has(tc)) throw new Error(`Mã ${tc} không có trong khung TT04`);
      const chuan = parseInt(tc.split('.')[0]), so = parseInt(tc.split('.')[1]);
      dem[tc] = (dem[tc] || 0) + 1;
      const code = `H${chuan}.${String(chuan).padStart(2, '0')}.${String(so).padStart(2, '0')}.${String(dem[tc]).padStart(2, '0')}`;
      const daDuyet = tt === 'da_xac_nhan' || tt === 'tra_lai';
      let f = { source_type: 'link', file_name: null, file_stored: null, file_size: null, mime: null,
                link_url: 'https://drive.google.com/file/d/TT04-' + code + '/view' };
      if (loai === 'file') { const m = taoTep(code, tc, mota); f = { source_type: 'file', ...m, link_url: null }; }
      await q(`INSERT INTO evidence(workspace_id,code,tieu_chuan,tieu_chi,tieu_chi_so,thu_tu,mo_ta,nguon,
          source_type,file_name,file_stored,file_size,mime_type,link_url,unit_id,uploaded_by,status,
          reviewed_by,reviewed_at,review_note,sug_names)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,${daDuyet ? 'now()' : 'NULL'},$19,$20)`,
        [W, code, chuan, tc, so, dem[tc], mota, u ? 'Đơn vị: ' + u : '',
         f.source_type, f.file_name, f.file_stored, f.file_size, f.mime, f.link_url,
         U[u] || null, admin, tt, daDuyet ? admin : null, note || '',
         khaiMuc ? [khaiMuc] : []]);   // cột TEXT[] NOT NULL, không nhận null
    }

    // Phiếu đánh giá tiêu chí
    for (const [tc, kq, tt, ht, dm, tn, kh] of PHIEU_CHUNG(nganh)) {
      if (!MA_HOP_LE.has(tc)) throw new Error(`Mã phiếu ${tc} không có trong khung TT04`);
      await q(`INSERT INTO assessments(workspace_id,tieu_chuan,tieu_chi,hien_trang,diem_manh,ton_tai,ke_hoach,
          ket_qua,trang_thai,nguoi_thuc_hien)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [W, parseInt(tc.split('.')[0]), tc, ht, dm, tn, kh, kq, tt, 'Đơn vị chủ quản CTĐT']);
    }
    console.log(`   ${ws.name}: ${ds.length} minh chứng · ${giao.size} phân công · ${PHIEU_CHUNG(nganh).length} phiếu`);
  }

  // Đối chứng sau khi ghi: không còn mã nào ngoài khung
  console.log('\nSAU KHI SỬA:');
  let loi = 0;
  for (const ws of dsWs) {
    for (const bang of ['evidence', 'unit_criteria', 'assessments']) {
      const rows = await q(`SELECT DISTINCT tieu_chi FROM ${bang} WHERE workspace_id=$1`, [ws.id]);
      const ngoai = rows.map((x) => x.tieu_chi).filter((c) => !MA_HOP_LE.has(c));
      if (ngoai.length) { loi += ngoai.length; console.log(`   ${ws.name} · ${bang}: CÒN NGOÀI KHUNG ${ngoai.join(', ')}`); }
    }
  }
  console.log(loi ? `   CÒN ${loi} mã ngoài khung TT04` : '   Mọi mã tiêu chí của các đợt CTĐT đều nằm trong khung TT04.');

  // Đối soát khai báo bao phủ: mọi tên trong sug_names phải trùng KHÍT một mục
  // gợi ý của đúng tiêu chí đó. Lệch một chữ là panel đếm 0 mà không báo lỗi,
  // nên phải kiểm ở đây chứ không tin vào lúc sinh.
  let sai = 0;
  for (const ws of dsWs) {
    const rows = await q(
      'SELECT tieu_chi, sug_names FROM evidence WHERE workspace_id=$1 AND array_length(sug_names,1) > 0', [ws.id]);
    for (const r of rows) {
      const hopLe = new Set(((CHI_TIET[r.tieu_chi] || {}).suggested_evidence || []).map((g) => g.name));
      for (const n of r.sug_names) {
        if (!hopLe.has(n)) { sai++; console.log(`   ${ws.name} · ${r.tieu_chi}: khai tên lạ "${n.slice(0, 60)}"`); }
      }
    }
  }
  console.log(sai ? `   CÓ ${sai} khai báo không khớp danh mục gợi ý` : '   Mọi khai báo bao phủ đều khớp danh mục gợi ý của Phụ lục II.');

  // Bao phủ theo từng đợt: đếm tiêu chí đã có ít nhất một khai báo
  for (const ws of dsWs) {
    const r = await one(
      `SELECT count(DISTINCT tieu_chi)::int AS co_mc,
              count(DISTINCT tieu_chi) FILTER (WHERE array_length(sug_names,1) > 0)::int AS co_khai,
              count(*)::int AS tong
         FROM evidence WHERE workspace_id=$1`, [ws.id]);
    const khai = await one(
      `SELECT count(*)::int AS n FROM (
         SELECT DISTINCT tieu_chi, unnest(sug_names) AS ten FROM evidence WHERE workspace_id=$1) t`, [ws.id]);
    const tongGoiY = STANDARDS_TT04.reduce((a, s) => a + s.criteria.reduce(
      (b, c) => b + ((CHI_TIET[c.code] || {}).suggested_evidence || []).length, 0), 0);
    console.log(`   ${ws.name}: ${r.tong} minh chứng · ${r.co_mc}/52 tiêu chí có minh chứng · `
      + `${khai.n}/${tongGoiY} mục gợi ý đã được khai (${Math.round(khai.n / tongGoiY * 100)}%)`);
  }
  const dk = await q(
    `SELECT w.name, a.tieu_chi FROM assessments a JOIN workspaces w ON w.id=a.workspace_id
      WHERE w.type='CTDT' AND a.ket_qua='KHONG_DAT' ORDER BY w.id`);
  for (const r of dk) {
    console.log(`   ${r.name}: tiêu chí ${r.tieu_chi} không đạt` +
      (DIEU_KIEN.has(r.tieu_chi) ? ' · đây là TIÊU CHÍ ĐIỀU KIỆN nên cả tiêu chuẩn ' + r.tieu_chi.split('.')[0] + ' không đạt' : ''));
  }
  if (loi) process.exitCode = 1;
}

main().then(() => pool.end()).catch((e) => { console.error(e); pool.end(); process.exit(1); });
