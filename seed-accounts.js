// ─── Tạo tài khoản cho từng đơn vị + tài khoản chỉ xem ──────────────────────
// Chạy:  docker exec kdcl-app node seed-accounts.js
//        docker exec kdcl-app node seed-accounts.js --reset   (đặt lại mật khẩu)
//
// Mỗi khoa/phòng một tài khoản chung, gắn đúng đơn vị đó, vai `unit`. Thêm hai
// tài khoản vai `viewer` cho lãnh đạo và đoàn đánh giá.
//
// Mật khẩu chỉ in ra MỘT LẦN ở đây rồi băm bằng scrypt, không đọc lại được.
// Chép ngay khi chạy xong; quên thì đặt lại trong trang /users.html.
const { q, one, pool } = require('./db');
const auth = require('./auth');
const crypto = require('crypto');

const RESET = process.argv.includes('--reset');

// Bỏ các ký tự dễ đọc nhầm (l/1/I, O/0) vì mật khẩu này sẽ được đọc qua điện
// thoại hoặc chép tay sang giấy bàn giao.
function genPass() {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ', a = 'abcdefghijkmnpqrstuvwxyz', n = '23456789', s = '@#$%';
  const pick = (set, k) => Array.from({ length: k }, () => set[crypto.randomInt(set.length)]).join('');
  return pick(A, 1) + pick(a, 5) + pick(n, 3) + pick(s, 1);
}

const VIEWERS = [
  ['lanhdao', 'Ban Giám hiệu (chỉ xem)'],
  ['doandanhgia', 'Đoàn đánh giá ngoài (chỉ xem)'],
];

async function main() {
  const units = await q('SELECT id, code, name FROM units ORDER BY code');
  const out = [];

  for (const u of units) {
    const username = u.code.toLowerCase();
    const existing = await one('SELECT id FROM users WHERE username=$1', [username]);
    if (existing && !RESET) { out.push([username, u.name, 'unit', '(đã có, giữ nguyên)']); continue; }
    const pass = genPass();
    if (existing) {
      await q('UPDATE users SET password_hash=$2, role=$3, unit_id=$4, display_name=$5, active=TRUE WHERE id=$1',
        [existing.id, auth.hashPassword(pass), 'unit', u.id, u.name]);
      out.push([username, u.name, 'unit', pass + '  (đặt lại)']);
    } else {
      await q('INSERT INTO users(username,password_hash,role,unit_id,display_name) VALUES ($1,$2,$3,$4,$5)',
        [username, auth.hashPassword(pass), 'unit', u.id, u.name]);
      out.push([username, u.name, 'unit', pass]);
    }
  }

  for (const [username, ten] of VIEWERS) {
    const existing = await one('SELECT id FROM users WHERE username=$1', [username]);
    if (existing && !RESET) { out.push([username, ten, 'viewer', '(đã có, giữ nguyên)']); continue; }
    const pass = genPass();
    if (existing) {
      await q('UPDATE users SET password_hash=$2, role=$3, unit_id=NULL, display_name=$4, active=TRUE WHERE id=$1',
        [existing.id, auth.hashPassword(pass), 'viewer', ten]);
      out.push([username, ten, 'viewer', pass + '  (đặt lại)']);
    } else {
      await q('INSERT INTO users(username,password_hash,role,unit_id,display_name) VALUES ($1,$2,$3,NULL,$4)',
        [username, auth.hashPassword(pass), 'viewer', ten]);
      out.push([username, ten, 'viewer', pass]);
    }
  }

  const w = (s, n) => String(s).padEnd(n);
  console.log('\n' + w('TÀI KHOẢN', 16) + w('VAI', 8) + w('MẬT KHẨU', 14) + 'THUỘC VỀ');
  console.log('─'.repeat(92));
  for (const [user, ten, role, pass] of out) console.log(w(user, 16) + w(role, 8) + w(pass, 14) + ten);
  console.log('─'.repeat(92));
  console.log('Mật khẩu chỉ hiện MỘT LẦN. Chép ngay, sau đó đổi trong trang /users.html khi bàn giao.');
  console.log('Tài khoản admin (Phòng ĐBCL) không đụng tới ở đây.\n');
}

main().then(() => pool.end()).catch((e) => { console.error(e); pool.end(); process.exit(1); });
