// ─── Seed dữ liệu khởi tạo (idempotent) ─────────────────────────────────────
// Chạy mỗi lần boot: chỉ tạo khi bảng còn rỗng, không ghi đè dữ liệu có sẵn.
const auth = require('./auth');

const DEFAULT_UNITS = [
  { code: 'PDT',   name: 'Phòng Đào tạo',                 type: 'phong' },
  { code: 'PTCHC', name: 'Phòng Tổ chức - Hành chính',    type: 'phong' },
  { code: 'PKHTC', name: 'Phòng Kế hoạch - Tài chính',    type: 'phong' },
  { code: 'PCTSV', name: 'Phòng Công tác sinh viên',      type: 'phong' },
  { code: 'PDBCL', name: 'Phòng Đảm bảo chất lượng',      type: 'phong' },
  { code: 'PKHCN', name: 'Phòng Khoa học - Công nghệ',    type: 'phong' },
  { code: 'KCNTT', name: 'Khoa Công nghệ thông tin',      type: 'khoa'  },
  { code: 'KKT',   name: 'Khoa Kiến trúc',                type: 'khoa'  },
];

async function ensureSeed({ q, one }) {
  // 1) Workspace mặc định
  const wsCount = (await one('SELECT count(*)::int n FROM workspaces')).n;
  if (wsCount === 0) {
    await q(`INSERT INTO workspaces(name,type,law,description)
             VALUES ('CSGD 2026','CSGD','TT26/2026 BGDĐT','Kiểm định Cơ sở Giáo dục — 15 tiêu chuẩn / 60 tiêu chí')`);
    console.log('[seed] đã tạo workspace "CSGD 2026"');
  }

  // 2) Đơn vị mẫu
  const unitCount = (await one('SELECT count(*)::int n FROM units')).n;
  if (unitCount === 0) {
    for (const u of DEFAULT_UNITS)
      await q('INSERT INTO units(code,name,type) VALUES ($1,$2,$3)', [u.code, u.name, u.type]);
    console.log(`[seed] đã tạo ${DEFAULT_UNITS.length} đơn vị mẫu`);
  }

  // 3) Tài khoản admin mặc định (nếu chưa có user nào)
  const userCount = (await one('SELECT count(*)::int n FROM users')).n;
  if (userCount === 0) {
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'admin123';
    await q(`INSERT INTO users(username,password_hash,role,display_name) VALUES ($1,$2,'admin',$3)`,
      [adminUser, auth.hashPassword(adminPass), 'Quản trị P.ĐBCL']);
    console.log('\n  ┌───────────────────────────────────────────────┐');
    console.log(`  │  Tài khoản admin mặc định: ${adminUser} / ${adminPass}`);
    console.log('  │  ⚠  ĐỔI MẬT KHẨU NGAY sau lần đăng nhập đầu!  │');
    console.log('  └───────────────────────────────────────────────┘\n');
  }
}

module.exports = { ensureSeed };
