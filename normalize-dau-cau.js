// ─── Chuẩn hoá dấu ngăn trong DỮ LIỆU đã nhập ───────────────────────────────
// Chạy:  docker exec kdcl-app node normalize-dau-cau.js
//        docker exec kdcl-app node normalize-dau-cau.js --thu    (chỉ xem, không ghi)
//
// Các script sinh dữ liệu đã được sửa nên bản mới sinh ra đã sạch, nhưng những
// hàng nhập từ trước vẫn mang dấu gạch dài hoặc gạch vừa làm dấu ngăn, ví dụ
// "LOG201 — HK2 2025-2026". Script này đổi chúng sang chấm giữa.
//
// CHỈ đổi dấu gạch CÓ KHOẢNG TRẮNG HAI BÊN, tức đang đóng vai dấu ngăn. Giữ
// nguyên gạch nối trong khoảng số như "Tiêu chuẩn 10–15" hay "TC 1–7", vì đó
// là cách viết đúng và đổi sang chấm giữa sẽ thành vô nghĩa.
const { q, pool } = require('./db');

const THU = process.argv.includes('--thu');

// Bảng và cột có thể chứa chữ do người dùng hoặc script sinh ra.
const CHO = [
  ['tdg_tasks', 'title'],
  ['tdg_plans', 'name'],
  ['assessment_plans', 'name'],
  ['assessment_items', 'name'],
  ['evidence', 'mo_ta'],
  ['evidence', 'ghi_chu'],
  ['reports', 'title'],
  ['surveys', 'title'],
  ['courses', 'name'],
  ['workspaces', 'name'],
  ['workspaces', 'description'],
];

const DIEU_KIEN = (c) => `${c} LIKE '% — %' OR ${c} LIKE '% – %'`;
const DOI = (c) => `replace(replace(${c}, ' — ', ' · '), ' – ', ' · ')`;

async function main() {
  let tong = 0;
  for (const [bang, cot] of CHO) {
    const dem = await q(`SELECT count(*)::int n FROM ${bang} WHERE ${DIEU_KIEN(cot)}`);
    const n = dem[0].n;
    if (!n) continue;
    tong += n;
    if (THU) {
      const vd = await q(`SELECT left(${cot}, 70) AS v FROM ${bang} WHERE ${DIEU_KIEN(cot)} LIMIT 2`);
      console.log(`   ${bang}.${cot}: ${n} hàng   ví dụ: ${vd.map((x) => x.v).join(' | ')}`);
    } else {
      await q(`UPDATE ${bang} SET ${cot} = ${DOI(cot)} WHERE ${DIEU_KIEN(cot)}`);
      console.log(`   ${bang}.${cot}: đã đổi ${n} hàng`);
    }
  }
  if (!tong) { console.log('   không còn hàng nào mang dấu gạch làm dấu ngăn'); return; }

  if (!THU) {
    // Đối chứng sau khi ghi: đếm lại phải về 0, nếu không thì phép đổi hụt.
    let con = 0;
    for (const [bang, cot] of CHO) {
      const d = await q(`SELECT count(*)::int n FROM ${bang} WHERE ${DIEU_KIEN(cot)}`);
      con += d[0].n;
    }
    console.log(`\n   Tổng đã đổi: ${tong} hàng. Còn sót: ${con} (phải bằng 0).`);
    if (con) process.exitCode = 1;
  } else {
    console.log(`\n   Chạy thử: sẽ đổi ${tong} hàng. Bỏ --thu để ghi thật.`);
  }
}

main().then(() => pool.end()).catch((e) => { console.error(e); pool.end(); process.exit(1); });
