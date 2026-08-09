// ═══════════════════════════════════════════════════════════════════════════
// KĐCLGD v2 — Express + Postgres
// Port từ v1 (JSON-file). Giữ nguyên route + response shape để frontend cũ chạy.
// Thêm: login theo vai, đơn vị/phân công, quy trình nộp–duyệt minh chứng.
// ═══════════════════════════════════════════════════════════════════════════
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { q, one, tx, pool, waitForDb, initSchema } = require('./db');
const auth = require('./auth');
const { STANDARDS_DETAIL, EVIDENCE_TYPES } = require('./standards-detail.js');
const { STANDARDS_TT04 } = require('./standards-tt04.js');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = process.env.DATA_DIR || __dirname;
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ─── Bọc mọi handler async ──────────────────────────────────────────────────
// Express 4 KHÔNG bắt lỗi từ promise bị từ chối trong handler async, mà Node 20
// mặc định cho tiến trình chết khi có promise bị từ chối không ai bắt. Hệ quả
// đã tái hiện được: mở /api/reports/abc thì parseInt cho NaN, Postgres báo lỗi
// kiểu dữ liệu, và CẢ MÁY CHỦ TẮT, mọi người đang dùng mất kết nối cho tới khi
// Docker khởi động lại. Một địa chỉ gõ sai không được phép hạ cả hệ thống.
// Bọc ở đây, trước khi khai báo tuyến, nên áp cho toàn bộ tuyến kể cả tuyến
// thêm về sau.
for (const m of ['get', 'post', 'put', 'delete', 'patch', 'use']) {
  const goc = app[m].bind(app);
  app[m] = (...args) => goc(...args.map((a) => {
    if (typeof a !== 'function' || a.length > 3) return a;   // giữ nguyên middleware bắt lỗi 4 tham số
    return function (req, res, next) {
      try {
        const kq = a.call(this, req, res, next);
        if (kq && typeof kq.catch === 'function') kq.catch(next);
        return kq;
      } catch (e) { next(e); }
    };
  }));
}

// Id không phải số thì trả 400 thay vì để câu truy vấn nổ ở tầng CSDL.
app.use('/api', (req, res, next) => {
  const doan = req.path.split('/').filter(Boolean);
  for (let i = 1; i < doan.length; i++) {
    const truoc = doan[i - 1];
    if (['evidence', 'reports', 'kpi', 'tdg', 'surveys', 'users', 'units', 'unit-criteria',
         'workspaces', 'assessments', 'peos', 'plos', 'courses', 'clos', 'rubrics',
         'assessment-plans', 'assessment-items', 'plan-students', 'scores'].includes(truoc)
        && !/^\d+$/.test(doan[i]) && !['by-token', 'by-criteria', 'current', 'bulk'].includes(doan[i])) {
      return res.status(400).json({ error: 'Mã không hợp lệ' });
    }
  }
  next();
});

app.use(express.json({ limit: '2mb' }));
app.use(auth.attachUser());

// ─── Cổng API: mặc định ĐÓNG ───────────────────────────────────────────────
// Các tuyến ghi đã gắn requireAuth từng cái, nhưng tuyến ĐỌC thì không, nên
// khách vãng lai đọc được cả danh mục minh chứng và tải file về. Chặn tập
// trung ở đây để tuyến thêm sau này mặc định đóng thay vì phải nhớ gắn guard.
// Chỉ mở tường minh những gì buộc phải công khai: màn đăng nhập và link khảo
// sát gửi cho người trả lời (họ không có tài khoản).
const PUBLIC_API = [
  /^\/login$/,
  /^\/logout$/,
  /^\/me$/,
  /^\/surveys\/by-token\/[^/]+$/,
  /^\/surveys\/by-token\/[^/]+\/respond$/,
];

// Vai `unit` (khoa, phòng) chỉ được GHI vào đúng phần việc của mình là nộp
// minh chứng. Vai `viewer` (lãnh đạo, đoàn đánh giá) KHÔNG được ghi gì.
// Trước đây phần lớn tuyến ghi chỉ gắn requireAuth, còn toàn bộ tuyến CTĐT
// không gắn gì, nên một tài khoản khoa hay một tài khoản đoàn đánh giá đều
// xoá được PLO, sửa được KPI và báo cáo tự đánh giá. Tên vai nói một đằng,
// quyền thật một nẻo.
const UNIT_WRITABLE = [
  /^\/evidence$/,                       // nộp minh chứng
  /^\/evidence\/\d+$/,                  // xoá minh chứng của mình (route tự kiểm đơn vị)
  /^\/evidence\/\d+\/suggestions$/,     // khai mục gợi ý cho minh chứng của mình
];
app.use('/api', (req, res, next) => {
  if (PUBLIC_API.some((rx) => rx.test(req.path))) return next();
  if (!req.user) return res.status(401).json({ error: 'Chưa đăng nhập' });
  if (req.method === 'GET') return next();
  if (req.user.role === 'admin') return next();
  if (req.user.role === 'unit' && UNIT_WRITABLE.some((rx) => rx.test(req.path))) return next();
  return res.status(403).json({
    error: req.user.role === 'viewer'
      ? 'Tài khoản chỉ xem, không sửa được dữ liệu'
      : 'Đơn vị chỉ được nộp và quản lý minh chứng của đơn vị mình',
  });
});

// ─── Standards / Criteria (hard-code, như v1) ───────────────────────────────
const STANDARDS = [
  { id: 1,  name: 'Tầm nhìn, sứ mạng, văn hoá và quản trị', criteria: ['Tầm nhìn & sứ mạng','Hệ thống quản trị','Giá trị văn hóa','Truyền đạt tầm nhìn','Trách nhiệm xã hội','Cải tiến quản trị'] },
  { id: 2,  name: 'Lãnh đạo và chiến lược', criteria: ['Cơ cấu tổ chức','Rà soát cơ cấu','Kế hoạch chiến lược','Triển khai chiến lược','Cải tiến lãnh đạo'] },
  { id: 3,  name: 'Nguồn nhân lực', criteria: ['Quy hoạch & tuyển dụng','Đánh giá hiệu quả','Phát triển chuyên môn','Chế độ đãi ngộ','Cải tiến nhân lực'] },
  { id: 4,  name: 'Nguồn lực tài chính và vật chất', criteria: ['Quản lý tài chính','Cơ sở vật chất','Thư viện & học liệu','CNTT & hạ tầng số','Cải tiến CSVC'] },
  { id: 5,  name: 'Mạng lưới và quan hệ đối ngoại', criteria: ['Hợp tác trong/ngoài nước','Cải tiến hợp tác'] },
  { id: 6,  name: 'Chính sách về đào tạo', criteria: ['Tuyển sinh','Chương trình ĐT','Giảng dạy & học tập','Kiểm tra đánh giá','Hỗ trợ người học','Quản lý thông tin người học','Cải tiến đào tạo'] },
  { id: 7,  name: 'Chính sách về nghiên cứu khoa học', criteria: ['Chiến lược NCKH','Môi trường NCKH','SHTT & đạo đức','Phát triển NL nghiên cứu','Cải tiến NCKH'] },
  { id: 8,  name: 'Chính sách kết nối và phục vụ cộng đồng', criteria: ['Chính sách kết nối','Triển khai kết nối','Cải tiến kết nối'] },
  { id: 9,  name: 'Hệ thống bảo đảm chất lượng', criteria: ['Cơ cấu & chính sách IQA','Quy trình BĐCL','Giám sát & đánh giá','Cải tiến BĐCL'] },
  { id: 10, name: 'Hệ thống thông tin BĐCL bên trong', criteria: ['Thu thập & quản lý dữ liệu','Báo cáo & công bố'] },
  { id: 11, name: 'Nâng cao chất lượng', criteria: ['Chu trình PDCA','Đổi mới sáng tạo'] },
  { id: 12, name: 'Kết quả về đào tạo', criteria: ['Tỉ lệ tốt nghiệp','Chất lượng tốt nghiệp','Việc làm sau TN','Mức độ hài lòng người học'] },
  { id: 13, name: 'Kết quả về nghiên cứu khoa học', criteria: ['Đề tài NCKH','Bài báo khoa học','Sáng chế & chuyển giao','NCKH người học'] },
  { id: 14, name: 'Kết quả kết nối và phục vụ cộng đồng', criteria: ['Hợp tác với DN','Chuyển giao & tư vấn','Phục vụ cộng đồng','Tác động kết nối'] },
  { id: 15, name: 'Kết quả về tài chính và thị trường', criteria: ['Hiệu quả tài chính','Uy tín & thương hiệu'] },
];

// ─── Multer ─────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const MAX_FILE_MB = 50;
const upload = multer({ storage, limits: { fileSize: MAX_FILE_MB * 1024 * 1024 } });

// ─── Workspace helper ───────────────────────────────────────────────────────
// Đơn vị chỉ được vào những đợt kiểm định mà mình ĐƯỢC PHÂN CÔNG tiêu chí.
// Trả null nghĩa là không giới hạn (admin, viewer). Trả mảng rỗng nghĩa là
// đơn vị chưa được giao gì, khi đó không mở được đợt nào.
async function allowedWs(user) {
  if (!user || user.role !== 'unit' || !user.unit_id) return null;
  const rows = await q('SELECT DISTINCT workspace_id FROM unit_criteria WHERE unit_id=$1', [user.unit_id]);
  return rows.map((r) => r.workspace_id);
}

async function getWs(req) {
  const raw = (req.query && req.query.ws_id) || req.headers['x-workspace-id'] ||
              auth.parseCookies(req).ws_id;
  const id = parseInt(raw);
  const allow = await allowedWs(req.user);
  if (id) {
    const w = await one('SELECT id FROM workspaces WHERE id=$1', [id]);
    // Đặt cookie ws_id bằng tay cũng không mở được đợt ngoài phạm vi
    if (w && (!allow || allow.includes(w.id))) return w.id;
  }
  if (allow) {
    if (!allow.length) return null;
    const f = await one('SELECT id FROM workspaces WHERE id = ANY($1) ORDER BY id LIMIT 1', [allow]);
    return f ? f.id : null;
  }
  const first = await one('SELECT id FROM workspaces ORDER BY id LIMIT 1');
  return first ? first.id : null;
}

// Đơn vị chỉ đọc được minh chứng của chính mình. Dùng cho mọi tuyến trả về
// minh chứng, không chỉ danh sách chính.
function unitScope(req) {
  return req.user && req.user.role === 'unit' ? req.user.unit_id : null;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Thiếu tài khoản/mật khẩu' });
  const u = await one('SELECT * FROM users WHERE username=$1 AND active=TRUE', [username.trim()]);
  if (!u || !auth.verifyPassword(password, u.password_hash))
    return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
  const token = await auth.createSession(u.id);
  await q('UPDATE users SET last_login_at=now() WHERE id=$1', [u.id]);
  auth.setSessionCookie(res, token);
  res.json({ id: u.id, username: u.username, role: u.role, unit_id: u.unit_id, display_name: u.display_name });
});

app.post('/api/logout', async (req, res) => {
  const token = auth.parseCookies(req)[auth.COOKIE];
  await auth.destroySession(token);
  auth.clearSessionCookie(res);
  res.json({ message: 'Đã đăng xuất' });
});

app.get('/api/me', async (req, res) => {
  if (!req.user) return res.json(null);
  let unit = null;
  if (req.user.unit_id) unit = await one('SELECT id, code, name FROM units WHERE id=$1', [req.user.unit_id]);
  res.json({ ...req.user, unit });
});

// ═══════════════════════════════════════════════════════════════════════════
// STANDARDS
// ═══════════════════════════════════════════════════════════════════════════
// Bộ tiêu chuẩn phải theo LOẠI đợt kiểm định. Trước đây mọi đợt đều nhận bộ 15
// tiêu chuẩn 60 tiêu chí của TT26, tức khung dành cho cơ sở giáo dục, nên ba
// đợt chương trình đào tạo gắn minh chứng vào những địa chỉ không tồn tại
// trong khung của mình như 9.1 hay 11.1, và trang Tổng quan của chính đợt đó
// lại ghi 8 tiêu chuẩn 52 tiêu chí, tức phần mềm tự mâu thuẫn.
async function boTieuChuan(req) {
  const wsId = await getWs(req);
  if (!wsId) return STANDARDS;
  const w = await one('SELECT type FROM workspaces WHERE id=$1', [wsId]);
  return w && w.type === 'CTDT' ? BO_TT04 : STANDARDS;
}
// Bộ TT04 quy về cùng hình dạng với bộ TT26 để mọi màn dùng lại được, không
// phải sửa từng trang: { id, name, criteria: [tên ngắn...] }.
const BO_TT04 = STANDARDS_TT04.map((s) => ({
  id: s.id, name: s.name, criteria: s.criteria.map((c) => c.short),
  // Gửi kèm mã tiêu chí ĐIỀU KIỆN để giao diện khỏi gõ cứng. Trang Tổng quan
  // trước đây gõ tay và ghi sai ở tiêu chuẩn 2 (ghi 2.1 trong khi thông tư
  // chốt 2.2), sai số tiêu chí của tiêu chuẩn 6, 7, 8, và rút gọn sai tên
  // tiêu chuẩn 7 thành "Cơ sở vật chất".
  dieu_kien: s.criteria.filter((c) => c.dieu_kien).map((c) => c.code),
}));
// Chi tiết từng tiêu chí TT04, tra theo mã, cùng hình dạng với STANDARDS_DETAIL.
const CHI_TIET_TT04 = {};
for (const s of STANDARDS_TT04) {
  for (const c of s.criteria) {
    CHI_TIET_TT04[c.code] = {
      short_name: c.short, full_name: c.full,
      dieu_kien: c.dieu_kien,
      requirements: [], suggested_evidence: [], self_check_questions: [],
    };
  }
}

app.get('/api/standards', async (req, res) => res.json(await boTieuChuan(req)));
app.get('/api/evidence-types', (req, res) => res.json(EVIDENCE_TYPES));
// Giao diện hỏi giới hạn thay vì gõ cứng, để đổi một chỗ là cả hệ đổi theo.
app.get('/api/gioi-han', (req, res) => res.json({ max_file_mb: MAX_FILE_MB }));
app.get('/api/criteria/:code', async (req, res) => {
  const bo = await boTieuChuan(req);
  const chiTiet = bo === STANDARDS ? STANDARDS_DETAIL : CHI_TIET_TT04;
  res.json(chiTiet[req.params.code] || null);
});
app.get('/api/criteria', async (req, res) => {
  const bo = await boTieuChuan(req);
  res.json(bo === STANDARDS ? STANDARDS_DETAIL : CHI_TIET_TT04);
});

// ═══════════════════════════════════════════════════════════════════════════
// WORKSPACES
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/workspaces', async (req, res) => {
  const currentId = await getWs(req);
  const allow = await allowedWs(req.user);
  const items = allow
    ? await q('SELECT * FROM workspaces WHERE id = ANY($1) ORDER BY id', [allow])
    : await q('SELECT * FROM workspaces ORDER BY id');
  res.json({ items: items.map(w => ({ ...w, current: w.id === currentId })), current_id: currentId });
});
app.get('/api/workspaces/current', async (req, res) => {
  const id = await getWs(req);
  const ws = await one('SELECT * FROM workspaces WHERE id=$1', [id]);
  if (!ws) return res.status(404).json({ error: 'Chưa có workspace' });
  res.json(ws);
});
app.post('/api/workspaces', auth.requireRole('admin'), async (req, res) => {
  const { name, type, law, description } = req.body;
  if (!name || !type) return res.status(400).json({ error: 'Thiếu tên hoặc loại workspace' });
  if (!['CSGD','CTDT'].includes(type)) return res.status(400).json({ error: 'Loại không hợp lệ' });
  const ws = await one(
    `INSERT INTO workspaces(name,type,law,description) VALUES ($1,$2,$3,$4) RETURNING id`,
    [name, type, law || (type==='CSGD'?'TT26/2026 BGDĐT':'TT04/2025 BGDĐT'), description || '']);
  res.json({ id: ws.id, message: 'Đã tạo workspace' });
});
app.put('/api/workspaces/:id', auth.requireRole('admin'), async (req, res) => {
  const { name, description, active, law } = req.body;
  const r = await one(
    `UPDATE workspaces SET
       name=COALESCE($2,name), description=COALESCE($3,description),
       active=COALESCE($4,active), law=COALESCE($5,law)
     WHERE id=$1 RETURNING id`,
    [parseInt(req.params.id), name ?? null, description ?? null, active ?? null, law ?? null]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã cập nhật' });
});
app.delete('/api/workspaces/:id', auth.requireRole('admin'), async (req, res) => {
  const cnt = await one('SELECT count(*)::int AS n FROM workspaces');
  if (cnt.n <= 1) return res.status(400).json({ error: 'Phải còn ít nhất 1 workspace' });
  const r = await one('DELETE FROM workspaces WHERE id=$1 RETURNING id', [parseInt(req.params.id)]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã xóa workspace' });
});

// ═══════════════════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/stats', async (req, res) => {
  const wsId = await getWs(req);
  // Cùng phạm vi với danh sách minh chứng. Trước đây ô "Tổng minh chứng" đếm
  // TOÀN TRƯỜNG còn bảng ngay bên dưới chỉ hiện minh chứng của đơn vị, nên
  // tài khoản khoa thấy ô ghi 64 mà bảng có 10 dòng.
  const mine = unitScope(req);
  const rows = await q(
    `SELECT tieu_chuan, count(*)::int AS n FROM evidence
      WHERE workspace_id=$1 AND ($2::int IS NULL OR unit_id=$2) GROUP BY tieu_chuan`, [wsId, mine]);
  const byStandard = {};
  // Số tiêu chuẩn lấy theo bộ của đợt đang mở, không gán cứng 15.
  const bo = await boTieuChuan(req);
  for (const std of bo) byStandard[std.id] = 0;
  let total = 0;
  for (const r of rows) { byStandard[r.tieu_chuan] = r.n; total += r.n; }
  res.json({ total, byStandard });
});

// ═══════════════════════════════════════════════════════════════════════════
// EVIDENCE — có unit_id, status, source_type (file|link)
// ═══════════════════════════════════════════════════════════════════════════
const EV_SELECT = `
  SELECT e.*, un.name AS unit_name, un.code AS unit_code,
         ub.display_name AS uploaded_by_name, rb.display_name AS reviewed_by_name
    FROM evidence e
    LEFT JOIN units un ON un.id = e.unit_id
    LEFT JOIN users ub ON ub.id = e.uploaded_by
    LEFT JOIN users rb ON rb.id = e.reviewed_by`;

app.get('/api/evidence', async (req, res) => {
  const wsId = await getWs(req);
  const { tieu_chuan, tieu_chi, search, status, unit_id } = req.query;
  const cond = ['e.workspace_id=$1']; const p = [wsId];
  // Vai unit chỉ thấy minh chứng của chính đơn vị mình, kể cả khi tự truyền
  // unit_id của đơn vị khác trên URL.
  const mine = unitScope(req);
  if (mine) { p.push(mine); cond.push(`e.unit_id=$${p.length}`); }
  if (tieu_chuan) { p.push(parseInt(tieu_chuan)); cond.push(`e.tieu_chuan=$${p.length}`); }
  if (tieu_chi)   { p.push(tieu_chi);             cond.push(`e.tieu_chi=$${p.length}`); }
  if (status)     { p.push(status);               cond.push(`e.status=$${p.length}`); }
  if (unit_id)    { p.push(parseInt(unit_id));    cond.push(`e.unit_id=$${p.length}`); }
  if (search) { p.push('%' + search.toLowerCase() + '%');
    cond.push(`(lower(e.mo_ta) LIKE $${p.length} OR lower(coalesce(e.file_name,'')) LIKE $${p.length} OR lower(coalesce(e.code,'')) LIKE $${p.length} OR lower(e.nguon) LIKE $${p.length})`); }
  const rows = await q(`${EV_SELECT} WHERE ${cond.join(' AND ')}
    ORDER BY e.tieu_chuan, e.tieu_chi_so, e.thu_tu`, p);
  res.json(rows);
});

// Người nộp khai minh chứng phục vụ mục gợi ý nào. Gửi lên dạng chuỗi JSON vì
// đây là multipart. Sai định dạng thì coi như chưa khai, không chặn việc nộp:
// nộp được minh chứng quan trọng hơn khai đủ, và khai bổ sung sau vẫn được.
function parseSugNames(raw) {
  if (!raw) return [];
  try {
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(v) ? v.filter((s) => typeof s === 'string' && s.trim()).slice(0, 20) : [];
  } catch { return []; }
}

app.post('/api/evidence', auth.requireAuth, upload.single('file'), async (req, res) => {
  const { tieu_chuan, tieu_chi, mo_ta, nguon, ghi_chu, source_type, link_url, unit_id } = req.body;
  const sugNames = parseSugNames(req.body.sug_names);
  const st = source_type === 'link' ? 'link' : 'file';
  if (!tieu_chuan || !tieu_chi) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: 'Thiếu thông tin tiêu chí' });
  }
  if (st === 'file' && !req.file) return res.status(400).json({ error: 'Chưa chọn file' });
  if (st === 'link' && !link_url)  return res.status(400).json({ error: 'Chưa nhập link' });

  const wsId = await getWs(req);
  const tc = parseInt(tieu_chuan);
  const tieu_chi_so = parseInt(tieu_chi.split('.')[1]);

  // Đơn vị chỉ được nộp vào tiêu chí ĐƯỢC PHÂN CÔNG. Trước đây nộp được vào
  // bất kỳ tiêu chí nào: bản ghi đó không hiện trong Cổng đơn vị nên chính
  // đơn vị nộp cũng không thấy để quản lý, trong khi bảng Đối soát TOÀN
  // TRƯỜNG đổi trạng thái tiêu chí của đơn vị khác từ Thiếu sang Đang duyệt.
  if (req.user.role === 'unit') {
    const duocGiao = await one(
      'SELECT id FROM unit_criteria WHERE workspace_id=$1 AND unit_id=$2 AND tieu_chi=$3',
      [wsId, req.user.unit_id, tieu_chi]);
    if (!duocGiao) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(403).json({
        error: `Tiêu chí ${tieu_chi} chưa được phân công cho đơn vị bạn. Đề nghị Phòng Đảm bảo chất lượng phân công trước khi nộp.`,
      });
    }
  }

  // Đơn vị: vai unit → chính đơn vị mình; admin có thể chỉ định unit_id
  let uId = req.user.role === 'unit' ? req.user.unit_id : (unit_id ? parseInt(unit_id) : null);
  // Admin nộp coi như đã xác nhận; đơn vị nộp thì chờ duyệt
  const status = req.user.role === 'admin' ? 'da_xac_nhan' : 'cho_duyet';

  const record = await tx(async (c) => {
    const mx = await c.query(
      'SELECT COALESCE(MAX(thu_tu),0)+1 AS n FROM evidence WHERE workspace_id=$1 AND tieu_chi=$2',
      [wsId, tieu_chi]);
    const thu_tu = mx.rows[0].n;
    const code = `H${tc}.${String(tc).padStart(2,'0')}.${String(tieu_chi_so).padStart(2,'0')}.${String(thu_tu).padStart(2,'0')}`;
    const ins = await c.query(
      `INSERT INTO evidence(workspace_id,code,tieu_chuan,tieu_chi,tieu_chi_so,thu_tu,mo_ta,nguon,ghi_chu,
         source_type,file_name,file_stored,file_size,mime_type,link_url,unit_id,uploaded_by,status,reviewed_by,reviewed_at,sug_names)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) RETURNING id, code`,
      [wsId, code, tc, tieu_chi, tieu_chi_so, thu_tu, mo_ta||'', nguon||'', ghi_chu||'',
       st, req.file?.originalname||null, req.file?.filename||null, req.file?.size||null,
       req.file?.mimetype||null, st==='link'?link_url:null, uId, req.user.id, status,
       status==='da_xac_nhan'?req.user.id:null, status==='da_xac_nhan'?new Date():null, sugNames]);
    return ins.rows[0];
  });
  res.json({ id: record.id, code: record.code, message: 'Thêm minh chứng thành công' });
});

app.delete('/api/evidence/:id', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const ev = await one('SELECT * FROM evidence WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
  if (!ev) return res.status(404).json({ error: 'Không tìm thấy' });
  // unit chỉ xoá được MC của mình và chưa xác nhận
  if (req.user.role === 'unit') {
    if (ev.unit_id !== req.user.unit_id) return res.status(403).json({ error: 'Không phải minh chứng của đơn vị bạn' });
    if (ev.status === 'da_xac_nhan') return res.status(403).json({ error: 'MC đã xác nhận, không thể xoá' });
  }
  await q('DELETE FROM evidence WHERE id=$1', [ev.id]);
  if (ev.file_stored) fs.unlink(path.join(UPLOADS_DIR, ev.file_stored), () => {});
  res.json({ message: 'Đã xóa' });
});

app.get('/api/evidence/:id/download', async (req, res) => {
  const wsId = await getWs(req);
  const ev = await one('SELECT * FROM evidence WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
  if (!ev) return res.status(404).json({ error: 'Không tìm thấy' });
  // Chặn tải tệp của đơn vị khác; nếu không, giấu ở danh sách nhưng vẫn tải
  // được bằng cách đoán id thì coi như không cách ly gì.
  const mine = unitScope(req);
  if (mine && ev.unit_id !== mine) return res.status(403).json({ error: 'Không phải minh chứng của đơn vị bạn' });
  if (ev.source_type === 'link') return res.redirect(ev.link_url);
  res.download(path.join(UPLOADS_DIR, ev.file_stored), ev.file_name);
});

// ─── Khai minh chứng phục vụ mục gợi ý nào ──────────────────────────────────
// Dùng cho cả dữ liệu cũ: 57 minh chứng nhập trước khi có cột này đều đang để
// trống, P.ĐBCL gắn dần từ màn chi tiết tiêu chí.
app.put('/api/evidence/:id/suggestions', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const names = parseSugNames(req.body.sug_names);
  // Đơn vị chỉ khai được cho minh chứng của chính đơn vị mình
  if (req.user.role === 'unit') {
    const ev = await one('SELECT unit_id FROM evidence WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
    if (!ev) return res.status(404).json({ error: 'Không tìm thấy' });
    if (ev.unit_id !== req.user.unit_id) return res.status(403).json({ error: 'Không phải minh chứng của đơn vị bạn' });
  }
  const r = await one(
    'UPDATE evidence SET sug_names=$3 WHERE id=$1 AND workspace_id=$2 RETURNING id, sug_names',
    [parseInt(req.params.id), wsId, names]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ id: r.id, sug_names: r.sug_names, message: 'Đã cập nhật khai báo' });
});

// ─── Duyệt / trả lại (admin) ────────────────────────────────────────────────
app.post('/api/evidence/:id/review', auth.requireRole('admin'), async (req, res) => {
  const wsId = await getWs(req);
  const { action, note } = req.body; // action: 'confirm' | 'return'
  const status = action === 'confirm' ? 'da_xac_nhan' : action === 'return' ? 'tra_lai' : null;
  if (!status) return res.status(400).json({ error: 'action phải là confirm hoặc return' });
  if (status === 'tra_lai' && !(note && note.trim())) return res.status(400).json({ error: 'Trả lại phải kèm lý do' });
  const r = await one(
    `UPDATE evidence SET status=$3, reviewed_by=$4, reviewed_at=now(), review_note=$5
       WHERE id=$1 AND workspace_id=$2 RETURNING id`,
    [parseInt(req.params.id), wsId, status, req.user.id, note || '']);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: status === 'da_xac_nhan' ? 'Đã xác nhận' : 'Đã trả lại' });
});

// ═══════════════════════════════════════════════════════════════════════════
// ĐƠN VỊ (units) + PHÂN CÔNG (unit_criteria)
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/units', async (req, res) => {
  res.json(await q('SELECT * FROM units ORDER BY name'));
});
app.post('/api/units', auth.requireRole('admin'), async (req, res) => {
  const { code, name, type, head_name } = req.body;
  if (!name) return res.status(400).json({ error: 'Thiếu tên đơn vị' });
  try {
    const u = await one(`INSERT INTO units(code,name,type,head_name) VALUES ($1,$2,$3,$4) RETURNING id`,
      [code||null, name.trim(), type||'phong', head_name||'']);
    res.json({ id: u.id, message: 'Đã tạo đơn vị' });
  } catch (e) { res.status(400).json({ error: 'Mã đơn vị đã tồn tại' }); }
});
app.put('/api/units/:id', auth.requireRole('admin'), async (req, res) => {
  const { code, name, type, head_name, active } = req.body;
  const r = await one(
    `UPDATE units SET code=COALESCE($2,code), name=COALESCE($3,name), type=COALESCE($4,type),
       head_name=COALESCE($5,head_name), active=COALESCE($6,active) WHERE id=$1 RETURNING id`,
    [parseInt(req.params.id), code ?? null, name ?? null, type ?? null, head_name ?? null, active ?? null]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã cập nhật' });
});
app.delete('/api/units/:id', auth.requireRole('admin'), async (req, res) => {
  const r = await one('DELETE FROM units WHERE id=$1 RETURNING id', [parseInt(req.params.id)]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã xóa đơn vị' });
});

// Phân công tiêu chí cho đơn vị (theo workspace)
app.get('/api/unit-criteria', async (req, res) => {
  const wsId = await getWs(req);
  const cond = ['uc.workspace_id=$1']; const p = [wsId];
  const mine = unitScope(req);
  if (mine) { p.push(mine); cond.push(`uc.unit_id=$${p.length}`); }
  else if (req.query.unit_id) { p.push(parseInt(req.query.unit_id)); cond.push(`uc.unit_id=$${p.length}`); }
  const rows = await q(
    `SELECT uc.*, u.name AS unit_name FROM unit_criteria uc
       JOIN units u ON u.id=uc.unit_id WHERE ${cond.join(' AND ')} ORDER BY uc.tieu_chi`, p);
  res.json(rows);
});
app.post('/api/unit-criteria', auth.requireRole('admin'), async (req, res) => {
  const wsId = await getWs(req);
  const { unit_id, tieu_chi } = req.body;
  if (!unit_id || !tieu_chi) return res.status(400).json({ error: 'Thiếu unit_id hoặc tiêu chí' });
  await q(`INSERT INTO unit_criteria(workspace_id,unit_id,tieu_chi) VALUES ($1,$2,$3)
           ON CONFLICT (workspace_id,unit_id,tieu_chi) DO NOTHING`,
    [wsId, parseInt(unit_id), tieu_chi]);
  res.json({ message: 'Đã phân công' });
});
app.delete('/api/unit-criteria/:id', auth.requireRole('admin'), async (req, res) => {
  const wsId = await getWs(req);
  await q('DELETE FROM unit_criteria WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
  res.json({ message: 'Đã bỏ phân công' });
});

// ═══════════════════════════════════════════════════════════════════════════
// USERS (admin quản lý)
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/users', auth.requireRole('admin'), async (req, res) => {
  res.json(await q(`SELECT u.id,u.username,u.role,u.unit_id,u.display_name,u.active,u.created_at,u.last_login_at,
                    un.name AS unit_name FROM users u LEFT JOIN units un ON un.id=u.unit_id ORDER BY u.username`));
});
app.post('/api/users', auth.requireRole('admin'), async (req, res) => {
  const { username, password, role, unit_id, display_name } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Thiếu tài khoản/mật khẩu' });
  if (!['admin','unit','viewer'].includes(role)) return res.status(400).json({ error: 'Vai không hợp lệ' });
  try {
    const u = await one(`INSERT INTO users(username,password_hash,role,unit_id,display_name)
      VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [username.trim(), auth.hashPassword(password), role, unit_id?parseInt(unit_id):null, display_name||'']);
    res.json({ id: u.id, message: 'Đã tạo tài khoản' });
  } catch (e) { res.status(400).json({ error: 'Tài khoản đã tồn tại' }); }
});
app.put('/api/users/:id', auth.requireRole('admin'), async (req, res) => {
  const { role, unit_id, display_name, active, password } = req.body;
  const sets = []; const p = [parseInt(req.params.id)];
  if (role !== undefined)         { p.push(role);                    sets.push(`role=$${p.length}`); }
  if (unit_id !== undefined)      { p.push(unit_id?parseInt(unit_id):null); sets.push(`unit_id=$${p.length}`); }
  if (display_name !== undefined) { p.push(display_name);            sets.push(`display_name=$${p.length}`); }
  if (active !== undefined)       { p.push(active);                  sets.push(`active=$${p.length}`); }
  if (password)                   { p.push(auth.hashPassword(password)); sets.push(`password_hash=$${p.length}`); }
  if (!sets.length) return res.json({ message: 'Không có thay đổi' });
  const r = await one(`UPDATE users SET ${sets.join(',')} WHERE id=$1 RETURNING id`, p);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã cập nhật' });
});
app.delete('/api/users/:id', auth.requireRole('admin'), async (req, res) => {
  if (parseInt(req.params.id) === req.user.id) return res.status(400).json({ error: 'Không thể tự xoá' });
  const r = await one('DELETE FROM users WHERE id=$1 RETURNING id', [parseInt(req.params.id)]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã xóa tài khoản' });
});

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD nộp/duyệt + đối soát theo tiêu chí
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/submission/dashboard', async (req, res) => {
  const wsId = await getWs(req);
  // Vai unit chỉ thấy số của đơn vị mình, không thấy tiến độ đơn vị khác.
  const mine = unitScope(req);
  const st = await q(
    `SELECT status, count(*)::int AS n FROM evidence
      WHERE workspace_id=$1 AND ($2::int IS NULL OR unit_id=$2) GROUP BY status`, [wsId, mine]);
  const totals = { cho_duyet: 0, da_xac_nhan: 0, tra_lai: 0, total: 0 };
  for (const r of st) { totals[r.status] = r.n; totals.total += r.n; }
  const byUnit = await q(
    `SELECT u.id AS unit_id, u.name AS unit_name,
       (SELECT count(*)::int FROM unit_criteria uc WHERE uc.workspace_id=$1 AND uc.unit_id=u.id) AS assigned,
       count(e.id)::int AS submitted,
       count(e.id) FILTER (WHERE e.status='da_xac_nhan')::int AS confirmed,
       count(e.id) FILTER (WHERE e.status='cho_duyet')::int AS pending,
       count(e.id) FILTER (WHERE e.status='tra_lai')::int AS returned
     FROM units u
     LEFT JOIN evidence e ON e.unit_id=u.id AND e.workspace_id=$1
     WHERE ($2::int IS NULL OR u.id=$2)
     GROUP BY u.id, u.name ORDER BY u.name`, [wsId, mine]);
  res.json({ totals, by_unit: byUnit });
});

app.get('/api/submission/coverage', async (req, res) => {
  const wsId = await getWs(req);
  const mine = unitScope(req);
  const evAll = await q(
    `SELECT tieu_chi,
       count(*) FILTER (WHERE status='da_xac_nhan')::int AS confirmed,
       count(*) FILTER (WHERE status='cho_duyet')::int AS pending,
       count(*)::int AS total
     FROM evidence WHERE workspace_id=$1 AND ($2::int IS NULL OR unit_id=$2)
     GROUP BY tieu_chi`, [wsId, mine]);
  const byTc = {}; for (const r of evAll) byTc[r.tieu_chi] = r;
  const assign = await q(
    `SELECT uc.tieu_chi, u.name AS unit_name FROM unit_criteria uc
       JOIN units u ON u.id=uc.unit_id WHERE uc.workspace_id=$1`, [wsId]);
  const assignBy = {};
  for (const a of assign) (assignBy[a.tieu_chi] ||= []).push(a.unit_name);

  const standards = (await boTieuChuan(req)).map(std => {
    const criteria = std.criteria.map((name, idx) => {
      const key = `${std.id}.${idx + 1}`;
      const e = byTc[key] || { confirmed: 0, pending: 0, total: 0 };
      const status = e.confirmed > 0 ? 'du' : e.pending > 0 ? 'dang_duyet' : 'thieu';
      return { key, name, idx: idx + 1, confirmed: e.confirmed, pending: e.pending, total: e.total,
               units: assignBy[key] || [], status };
    });
    return { id: std.id, name: std.name, criteria };
  });
  res.json({ standards });
});

app.get('/api/submission/criteria/:code/evidence', async (req, res) => {
  const wsId = await getWs(req);
  const mine = unitScope(req);
  const rows = await q(`${EV_SELECT} WHERE e.workspace_id=$1 AND e.tieu_chi=$2 AND e.status='da_xac_nhan'
                          AND ($3::int IS NULL OR e.unit_id=$3)
                        ORDER BY e.thu_tu`, [wsId, req.params.code, mine]);
  res.json(rows);
});

// ═══════════════════════════════════════════════════════════════════════════
// ASSESSMENTS (Biểu 04)
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/assess-stats', async (req, res) => {
  const wsId = await getWs(req);
  const list = await q('SELECT tieu_chi, ket_qua, trang_thai FROM assessments WHERE workspace_id=$1', [wsId]);
  const total = list.length;
  const dat = list.filter(a => a.ket_qua === 'DAT').length;
  const khongDat = list.filter(a => a.ket_qua === 'KHONG_DAT').length;
  const draft = list.filter(a => a.trang_thai === 'draft').length;
  const approved = list.filter(a => a.trang_thai === 'approved').length;
  const statusMap = {};
  for (const a of list) statusMap[a.tieu_chi] = { ket_qua: a.ket_qua, trang_thai: a.trang_thai };
  res.json({ total, dat, khongDat, draft, approved, statusMap });
});
app.get('/api/assessments', async (req, res) => {
  const wsId = await getWs(req);
  res.json(await q('SELECT * FROM assessments WHERE workspace_id=$1', [wsId]));
});
app.get('/api/assessments/by-criteria/:tieu_chi', async (req, res) => {
  const wsId = await getWs(req);
  const code = decodeURIComponent(req.params.tieu_chi);
  const assessment = await one('SELECT * FROM assessments WHERE workspace_id=$1 AND tieu_chi=$2', [wsId, code]);
  const evidence = await q('SELECT * FROM evidence WHERE workspace_id=$1 AND tieu_chi=$2 ORDER BY thu_tu', [wsId, code]);
  res.json({ assessment: assessment || null, evidence });
});
app.post('/api/assessments', auth.requireAuth, async (req, res) => {
  const { tieu_chuan, tieu_chi, hien_trang, diem_manh, ton_tai, ke_hoach, ket_qua, trang_thai, nguoi_thuc_hien, mc_bo_sung } = req.body;
  if (!tieu_chuan || !tieu_chi) return res.status(400).json({ error: 'Thiếu thông tin tiêu chí' });
  const wsId = await getWs(req);
  const r = await one(
    `INSERT INTO assessments(workspace_id,tieu_chuan,tieu_chi,hien_trang,diem_manh,ton_tai,ke_hoach,ket_qua,trang_thai,nguoi_thuc_hien,mc_bo_sung)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT (workspace_id,tieu_chi) DO UPDATE SET
       tieu_chuan=EXCLUDED.tieu_chuan, hien_trang=EXCLUDED.hien_trang, diem_manh=EXCLUDED.diem_manh,
       ton_tai=EXCLUDED.ton_tai, ke_hoach=EXCLUDED.ke_hoach, ket_qua=EXCLUDED.ket_qua,
       trang_thai=EXCLUDED.trang_thai, nguoi_thuc_hien=EXCLUDED.nguoi_thuc_hien,
       mc_bo_sung=EXCLUDED.mc_bo_sung, updated_at=now()
     RETURNING id, (xmax=0) AS inserted`,
    [wsId, parseInt(tieu_chuan), tieu_chi, hien_trang||'', diem_manh||'', ton_tai||'', ke_hoach||'',
     ket_qua||'CHUA', trang_thai||'draft', nguoi_thuc_hien||'', mc_bo_sung||'']);
  res.json({ id: r.id, message: r.inserted ? 'Đã tạo đánh giá' : 'Đã cập nhật đánh giá', updated: !r.inserted });
});
app.delete('/api/assessments/:id', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const r = await one('DELETE FROM assessments WHERE id=$1 AND workspace_id=$2 RETURNING id', [parseInt(req.params.id), wsId]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã xóa' });
});

// ═══════════════════════════════════════════════════════════════════════════
// SCHOOL INFO
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/school-info', async (req, res) => {
  const wsId = await getWs(req);
  const row = await one('SELECT data FROM school_info WHERE workspace_id=$1', [wsId]);
  res.json(row ? row.data : {});
});
app.put('/api/school-info', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  await q(`INSERT INTO school_info(workspace_id,data) VALUES ($1,$2)
           ON CONFLICT (workspace_id) DO UPDATE SET data = school_info.data || EXCLUDED.data`,
    [wsId, JSON.stringify(req.body || {})]);
  res.json({ message: 'Đã lưu thông tin trường' });
});

// ═══════════════════════════════════════════════════════════════════════════
// KPI (Biểu 16) — nam_hoc + data(jsonb)
// ═══════════════════════════════════════════════════════════════════════════
const flatKpi = (r) => ({ id: r.id, workspace_id: r.workspace_id, nam_hoc: r.nam_hoc,
  created_at: r.created_at, updated_at: r.updated_at, ...(r.data || {}) });
app.get('/api/kpi', async (req, res) => {
  const wsId = await getWs(req);
  const rows = await q('SELECT * FROM kpi_data WHERE workspace_id=$1 ORDER BY nam_hoc DESC', [wsId]);
  res.json(rows.map(r => {
    const f = flatKpi(r);
    return { id: f.id, nam_hoc: f.nam_hoc, created_at: f.created_at, updated_at: f.updated_at,
      so_gv_co_huu: f.so_gv_co_huu, pct_gv_ts: f.pct_gv_ts, pct_tot_nghiep: f.pct_tot_nghiep,
      pct_viec_lam_12t: f.pct_viec_lam_12t, so_bao_isi_scopus: f.so_bao_isi_scopus, so_nguoi_hoc_dh: f.so_nguoi_hoc_dh };
  }));
});
app.get('/api/kpi/:id', async (req, res) => {
  const wsId = await getWs(req);
  const r = await one('SELECT * FROM kpi_data WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json(flatKpi(r));
});
app.post('/api/kpi', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const { nam_hoc, ...rest } = req.body;
  if (!nam_hoc) return res.status(400).json({ error: 'Thiếu năm học' });
  const dup = await one('SELECT id FROM kpi_data WHERE workspace_id=$1 AND nam_hoc=$2', [wsId, nam_hoc]);
  if (dup) return res.status(400).json({ error: `Đã có dữ liệu năm học ${nam_hoc}` });
  const r = await one('INSERT INTO kpi_data(workspace_id,nam_hoc,data) VALUES ($1,$2,$3) RETURNING id',
    [wsId, nam_hoc, JSON.stringify(rest)]);
  res.json({ id: r.id, message: 'Đã tạo dữ liệu năm học' });
});
app.put('/api/kpi/:id', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const { workspace_id, id, nam_hoc, created_at, updated_at, ...rest } = req.body;
  const cur = await one('SELECT data FROM kpi_data WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
  if (!cur) return res.status(404).json({ error: 'Không tìm thấy' });
  const merged = { ...(cur.data || {}), ...rest };
  await q('UPDATE kpi_data SET data=$3, nam_hoc=COALESCE($4,nam_hoc), updated_at=now() WHERE id=$1 AND workspace_id=$2',
    [parseInt(req.params.id), wsId, JSON.stringify(merged), nam_hoc ?? null]);
  res.json({ message: 'Đã cập nhật' });
});
app.delete('/api/kpi/:id', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const r = await one('DELETE FROM kpi_data WHERE id=$1 AND workspace_id=$2 RETURNING id', [parseInt(req.params.id), wsId]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã xóa' });
});

// ═══════════════════════════════════════════════════════════════════════════
// TĐG plans + tasks
// ═══════════════════════════════════════════════════════════════════════════
function defaultTasks() {
  const t = (phase, ws, we, title, priority='normal') => ({ phase, week_start: ws, week_end: we, title, assignee:'', status:'todo', priority, notes:'' });
  return [
    t(1,1,1,'Ra quyết định thành lập Hội đồng TĐG (Biểu 01)','high'),
    t(1,1,2,'Phân công nhiệm vụ cho các nhóm TĐG'),
    t(1,2,2,'Xây dựng Kế hoạch TĐG chi tiết (Biểu 02)','high'),
    t(1,3,4,'Tập huấn Hội đồng TĐG về quy trình & biểu mẫu'),
    t(2,5,6,'Thu thập minh chứng — Tiêu chuẩn 1, 2, 3'),
    t(2,7,8,'Thu thập minh chứng — Tiêu chuẩn 4, 5, 6'),
    t(2,9,10,'Thu thập minh chứng — Tiêu chuẩn 7, 8, 9'),
    t(2,11,12,'Thu thập minh chứng — Tiêu chuẩn 10–15'),
    t(2,10,12,'Mã hóa và phân loại minh chứng (Hn.ab.cd.ef)'),
    t(2,12,12,'Nhập dữ liệu KPI vào Biểu 16','high'),
    t(3,13,14,'Đánh giá Tiêu chuẩn 1–4 (Biểu 04)','high'),
    t(3,15,16,'Đánh giá Tiêu chuẩn 5–9 (Biểu 04)','high'),
    t(3,17,18,'Đánh giá Tiêu chuẩn 10–15 (Biểu 04)','high'),
    t(3,18,18,'Họp Hội đồng TĐG — xem xét kết quả đánh giá'),
    t(4,19,20,'Viết Báo cáo TĐG — Phần mở đầu & TC 1–7 (Biểu 05)','high'),
    t(4,21,22,'Viết Báo cáo TĐG — TC 8–15 & kết luận','high'),
    t(4,22,22,'Rà soát, chỉnh sửa Báo cáo TĐG lần 1'),
    t(5,23,23,'Thẩm định nội bộ, chỉnh sửa lần cuối','high'),
    t(5,23,24,'Hoàn thiện và đóng gói hồ sơ minh chứng'),
    t(5,24,24,'Nộp hồ sơ TĐG cho cơ quan kiểm định','high'),
  ];
}
async function planWithTasks(planId) {
  const plan = await one('SELECT * FROM tdg_plans WHERE id=$1', [planId]);
  if (!plan) return null;
  plan.tasks = await q('SELECT * FROM tdg_tasks WHERE plan_id=$1 ORDER BY sort_order, id', [planId]);
  return plan;
}
app.get('/api/tdg', async (req, res) => {
  const wsId = await getWs(req);
  const plans = await q('SELECT * FROM tdg_plans WHERE workspace_id=$1 ORDER BY id', [wsId]);
  const out = [];
  for (const p of plans) {
    const c = await one(`SELECT count(*)::int total,
      count(*) FILTER (WHERE status='done')::int done,
      count(*) FILTER (WHERE status='late')::int late,
      count(*) FILTER (WHERE status='in_progress')::int in_progress
      FROM tdg_tasks WHERE plan_id=$1`, [p.id]);
    out.push({ id: p.id, name: p.name, ngay_bat_dau: p.ngay_bat_dau, ...c });
  }
  res.json(out);
});
app.get('/api/tdg/:id', async (req, res) => {
  const wsId = await getWs(req);
  const plan = await one('SELECT * FROM tdg_plans WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
  if (!plan) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json(await planWithTasks(plan.id));
});
app.post('/api/tdg', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const { name, ngay_bat_dau, use_defaults } = req.body;
  if (!name) return res.status(400).json({ error: 'Thiếu tên kế hoạch' });
  const plan = await tx(async (c) => {
    const p = (await c.query('INSERT INTO tdg_plans(workspace_id,name,ngay_bat_dau) VALUES ($1,$2,$3) RETURNING id',
      [wsId, name, ngay_bat_dau || ''])).rows[0];
    if (use_defaults !== false) {
      const tasks = defaultTasks(); let i = 0;
      for (const t of tasks) {
        await c.query(`INSERT INTO tdg_tasks(plan_id,phase,week_start,week_end,title,assignee,status,priority,notes,sort_order)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [p.id, t.phase, t.week_start, t.week_end, t.title, t.assignee, t.status, t.priority, t.notes, i++]);
      }
    }
    return p;
  });
  res.json({ id: plan.id, message: 'Đã tạo kế hoạch TĐG' });
});
app.put('/api/tdg/:id', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const { name, ngay_bat_dau } = req.body;
  const r = await one('UPDATE tdg_plans SET name=COALESCE($3,name), ngay_bat_dau=COALESCE($4,ngay_bat_dau) WHERE id=$1 AND workspace_id=$2 RETURNING id',
    [parseInt(req.params.id), wsId, name ?? null, ngay_bat_dau ?? null]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã cập nhật' });
});
app.delete('/api/tdg/:id', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const r = await one('DELETE FROM tdg_plans WHERE id=$1 AND workspace_id=$2 RETURNING id', [parseInt(req.params.id), wsId]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã xóa' });
});
async function ownedPlan(req) {
  const wsId = await getWs(req);
  return one('SELECT id FROM tdg_plans WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
}
app.post('/api/tdg/:id/tasks', auth.requireAuth, async (req, res) => {
  if (!await ownedPlan(req)) return res.status(404).json({ error: 'Không tìm thấy kế hoạch' });
  const b = req.body;
  const r = await one(`INSERT INTO tdg_tasks(plan_id,phase,week_start,week_end,title,assignee,status,priority,notes)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    [parseInt(req.params.id), b.phase||null, b.week_start||null, b.week_end||null, b.title||'', b.assignee||'', b.status||'todo', b.priority||'normal', b.notes||'']);
  res.json({ id: r.id });
});
app.put('/api/tdg/:id/tasks/:taskId', auth.requireAuth, async (req, res) => {
  if (!await ownedPlan(req)) return res.status(404).json({ error: 'Không tìm thấy kế hoạch' });
  const allow = ['phase','week_start','week_end','title','assignee','status','priority','notes'];
  const sets = []; const p = [parseInt(req.params.taskId), parseInt(req.params.id)];
  for (const k of allow) if (req.body[k] !== undefined) { p.push(req.body[k]); sets.push(`${k}=$${p.length}`); }
  if (!sets.length) return res.json({ message: 'Không có thay đổi' });
  await q(`UPDATE tdg_tasks SET ${sets.join(',')} WHERE id=$1 AND plan_id=$2`, p);
  res.json({ message: 'Đã cập nhật task' });
});
app.delete('/api/tdg/:id/tasks/:taskId', auth.requireAuth, async (req, res) => {
  if (!await ownedPlan(req)) return res.status(404).json({ error: 'Không tìm thấy kế hoạch' });
  await q('DELETE FROM tdg_tasks WHERE id=$1 AND plan_id=$2', [parseInt(req.params.taskId), parseInt(req.params.id)]);
  res.json({ message: 'Đã xóa task' });
});

// ═══════════════════════════════════════════════════════════════════════════
// SURVEYS (Biểu 08–11)
// ═══════════════════════════════════════════════════════════════════════════
const SURVEY_TEMPLATES = require('./survey-templates.js');
app.get('/api/surveys', async (req, res) => {
  const wsId = await getWs(req);
  const rows = await q(`SELECT s.*, (SELECT count(*)::int FROM survey_responses r WHERE r.survey_id=s.id) AS response_count
    FROM surveys s WHERE workspace_id=$1 ORDER BY id`, [wsId]);
  // Token là CHÌA KHOÁ mở đường gửi phản hồi công khai, ai cầm được thì bơm
  // được số liệu vào Biểu 08-11 và vào chỉ số hài lòng trên Dashboard. Trước
  // đây mọi vai đăng nhập đều đọc được token qua đây, kể cả tài khoản chỉ xem
  // cấp cho đoàn đánh giá ngoài. Nay chỉ quản trị mới thấy.
  const laAdmin = req.user && req.user.role === 'admin';
  res.json(rows.map(s => ({ id: s.id, type: s.type, title: s.title, description: s.description,
    token: laAdmin ? s.token : undefined, active: s.active, created_at: s.created_at, response_count: s.response_count })));
});
app.get('/api/surveys/by-token/:token', async (req, res) => {
  const s = await one('SELECT * FROM surveys WHERE token=$1', [req.params.token]);
  if (!s) return res.status(404).json({ error: 'Khảo sát không tồn tại' });
  if (!s.active) return res.status(403).json({ error: 'Khảo sát đã đóng' });
  const rc = await one('SELECT count(*)::int n FROM survey_responses WHERE survey_id=$1', [s.id]);
  res.json({ id: s.id, type: s.type, title: s.title, description: s.description, token: s.token,
    created_at: s.created_at, response_count: rc.n, template: SURVEY_TEMPLATES[s.type] || {} });
});
// Tuyến này BẮT BUỘC để mở cho người trả lời không có tài khoản, nên không thể
// đặt sau cổng đăng nhập. Bù lại phải chặn lạm dụng: một máy không được bơm
// hàng loạt, và không được gửi đi gửi lại cùng một nội dung. Đếm trong bộ nhớ
// tiến trình là đủ cho quy mô một trường; khởi động lại thì bộ đếm về 0, đây là
// đánh đổi có ý thức để khỏi thêm bảng và thêm phụ thuộc.
const NHIP_GUI = new Map();          // khoá: ip|token  →  { moc: [thời điểm], vanCu: Set }
const TRAN_GIO = 30;                 // tối đa 30 phiếu mỗi giờ từ một máy cho một khảo sát
setInterval(() => {
  const nguong = Date.now() - 3600e3;
  for (const [k, v] of NHIP_GUI) {
    v.moc = v.moc.filter((t) => t > nguong);
    if (!v.moc.length) NHIP_GUI.delete(k);
  }
}, 600e3).unref();

app.post('/api/surveys/by-token/:token/respond', async (req, res) => {
  const s = await one('SELECT * FROM surveys WHERE token=$1', [req.params.token]);
  if (!s) return res.status(404).json({ error: 'Không tìm thấy' });
  if (!s.active) return res.status(403).json({ error: 'Khảo sát đã đóng' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'khong-ro';
  const khoa = ip + '|' + s.id;
  const nay = Date.now();
  const muc = NHIP_GUI.get(khoa) || { moc: [], vanCu: new Set() };
  muc.moc = muc.moc.filter((t) => t > nay - 3600e3);
  if (muc.moc.length >= TRAN_GIO) {
    return res.status(429).json({ error: 'Gửi quá nhiều lần trong một giờ, vui lòng thử lại sau' });
  }
  const vanTay = JSON.stringify(req.body.answers || {});
  if (muc.vanCu.has(vanTay)) {
    return res.status(409).json({ error: 'Phiếu này đã được gửi, không cần gửi lại' });
  }

  await q('INSERT INTO survey_responses(survey_id,answers) VALUES ($1,$2)', [s.id, vanTay]);
  muc.moc.push(nay);
  muc.vanCu.add(vanTay);
  if (muc.vanCu.size > 200) muc.vanCu.clear();
  NHIP_GUI.set(khoa, muc);
  res.json({ message: 'Đã gửi khảo sát thành công' });
});

// Phải có đường XOÁ phản hồi. Trước đây toàn hệ không có tuyến nào xoá
// survey_responses, kể cả cho quản trị, nên một phiếu rác lọt vào là nằm vĩnh
// viễn, chỉ gỡ được bằng cách vào thẳng Postgres.
app.delete('/api/surveys/:id/responses/:rid', auth.requireRole('admin'), async (req, res) => {
  const wsId = await getWs(req);
  const s = await one('SELECT id FROM surveys WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
  if (!s) return res.status(404).json({ error: 'Không tìm thấy khảo sát' });
  const r = await one('DELETE FROM survey_responses WHERE id=$1 AND survey_id=$2 RETURNING id',
    [parseInt(req.params.rid), s.id]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy phiếu trả lời' });
  res.json({ message: 'Đã xoá phiếu trả lời' });
});
app.get('/api/surveys/:id', async (req, res) => {
  const wsId = await getWs(req);
  const s = await one('SELECT * FROM surveys WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
  if (!s) return res.status(404).json({ error: 'Không tìm thấy' });
  s.responses = await q('SELECT * FROM survey_responses WHERE survey_id=$1', [s.id]);
  res.json({ ...s, template: SURVEY_TEMPLATES[s.type] || {} });
});
app.post('/api/surveys', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const { type, title, description } = req.body;
  if (!type || !title) return res.status(400).json({ error: 'Thiếu loại hoặc tiêu đề' });
  if (!SURVEY_TEMPLATES[type]) return res.status(400).json({ error: 'Loại khảo sát không hợp lệ' });
  const token = Math.random().toString(36).substring(2, 10).toUpperCase();
  const r = await one('INSERT INTO surveys(workspace_id,type,title,description,token) VALUES ($1,$2,$3,$4,$5) RETURNING id',
    [wsId, type, title, description || '', token]);
  res.json({ id: r.id, token, message: 'Đã tạo khảo sát' });
});
app.put('/api/surveys/:id', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const { title, description, active } = req.body;
  const r = await one('UPDATE surveys SET title=COALESCE($3,title), description=COALESCE($4,description), active=COALESCE($5,active) WHERE id=$1 AND workspace_id=$2 RETURNING id',
    [parseInt(req.params.id), wsId, title ?? null, description ?? null, active ?? null]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã cập nhật' });
});
app.delete('/api/surveys/:id', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const r = await one('DELETE FROM surveys WHERE id=$1 AND workspace_id=$2 RETURNING id', [parseInt(req.params.id), wsId]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã xóa' });
});
app.get('/api/surveys/:id/stats', async (req, res) => {
  const wsId = await getWs(req);
  const s = await one('SELECT * FROM surveys WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
  if (!s) return res.status(404).json({ error: 'Không tìm thấy' });
  const responses = await q('SELECT answers FROM survey_responses WHERE survey_id=$1', [s.id]);
  const n = responses.length;
  if (n === 0) return res.json({ count: 0, averages: [], overall: 0, distribution: [], comments: [] });
  const tpl = SURVEY_TEMPLATES[s.type] || {};
  const nQ = (tpl.questions || []).length;
  const sums = new Array(nQ).fill(0), counts = new Array(nQ).fill(0);
  const dist = Array.from({ length: nQ }, () => [0,0,0,0,0]); const comments = [];
  for (const r of responses) {
    const a = r.answers || {};
    for (let i = 0; i < nQ; i++) { const v = a[`q${i+1}`];
      if (typeof v === 'number' && v >= 1 && v <= 5) { sums[i]+=v; counts[i]++; dist[i][v-1]++; } }
    if (a.comment && a.comment.trim()) comments.push(a.comment.trim());
  }
  const averages = sums.map((s2,i) => counts[i] ? Math.round(s2/counts[i]*10)/10 : 0);
  const overall = averages.length ? Math.round(averages.reduce((a,b)=>a+b,0)/averages.length*10)/10 : 0;
  res.json({ count: n, averages, overall, distribution: dist, comments: comments.slice(-30) });
});

// ═══════════════════════════════════════════════════════════════════════════
// REPORTS + report/data (Biểu 05)
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/report/data', async (req, res) => {
  const wsId = await getWs(req);
  const wsAssessments = await q('SELECT * FROM assessments WHERE workspace_id=$1', [wsId]);
  // Bản in báo cáo liệt kê mã minh chứng theo tiêu chí; với vai unit thì chỉ
  // liệt kê phần của đơn vị mình, nếu không thì cách ly ở màn danh sách vô nghĩa.
  const mine = unitScope(req);
  const wsEvidence = await q(
    'SELECT * FROM evidence WHERE workspace_id=$1 AND ($2::int IS NULL OR unit_id=$2)', [wsId, mine]);
  const wsKpi = (await q('SELECT * FROM kpi_data WHERE workspace_id=$1', [wsId])).map(flatKpi);
  const si = await one('SELECT data FROM school_info WHERE workspace_id=$1', [wsId]);
  const assessMap = {}; for (const a of wsAssessments) assessMap[a.tieu_chi] = a;
  const standards = (await boTieuChuan(req)).map(std => {
    const criteriaData = std.criteria.map((name, idx) => {
      const key = `${std.id}.${idx+1}`;
      return { key, name, idx: idx+1, assess: assessMap[key] || null,
               evidence: wsEvidence.filter(e => e.tieu_chi === key) };
    });
    return { ...std, criteriaData,
      assessed: criteriaData.filter(c=>c.assess).length,
      dat: criteriaData.filter(c=>c.assess?.ket_qua==='DAT').length,
      khong_dat: criteriaData.filter(c=>c.assess?.ket_qua==='KHONG_DAT').length };
  });
  const latestKpi = [...wsKpi].sort((a,b)=>(b.nam_hoc||'').localeCompare(a.nam_hoc||''))[0] || null;
  res.json({ school_info: si ? si.data : {}, standards, evidence: wsEvidence, kpi_data: wsKpi, latest_kpi: latestKpi,
    stats: { total_criteria: 60, assessed: wsAssessments.length,
      dat: wsAssessments.filter(a=>a.ket_qua==='DAT').length,
      khong_dat: wsAssessments.filter(a=>a.ket_qua==='KHONG_DAT').length, total_evidence: wsEvidence.length } });
});
app.get('/api/reports', async (req, res) => {
  const wsId = await getWs(req);
  res.json(await q('SELECT id,title,period,author,created_at,updated_at FROM reports WHERE workspace_id=$1 ORDER BY id', [wsId]));
});
app.get('/api/reports/:id', async (req, res) => {
  const wsId = await getWs(req);
  const r = await one('SELECT * FROM reports WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json(r);
});
app.post('/api/reports', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const { title, period, author } = req.body;
  if (!title) return res.status(400).json({ error: 'Thiếu tiêu đề' });
  const r = await one('INSERT INTO reports(workspace_id,title,period,author) VALUES ($1,$2,$3,$4) RETURNING id',
    [wsId, title, period||'', author||'']);
  res.json({ id: r.id, message: 'Đã tạo báo cáo' });
});
app.put('/api/reports/:id', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const allow = ['title','period','author','co_so_phap_ly','mo_ta_qua_trinh','mo_ta_csdt','tom_tat_ket_qua','ke_hoach_cai_tien'];
  const sets = []; const p = [parseInt(req.params.id), wsId];
  for (const k of allow) if (req.body[k] !== undefined) { p.push(req.body[k]); sets.push(`${k}=$${p.length}`); }
  sets.push('updated_at=now()');
  const r = await one(`UPDATE reports SET ${sets.join(',')} WHERE id=$1 AND workspace_id=$2 RETURNING id`, p);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã lưu' });
});
app.delete('/api/reports/:id', auth.requireAuth, async (req, res) => {
  const wsId = await getWs(req);
  const r = await one('DELETE FROM reports WHERE id=$1 AND workspace_id=$2 RETURNING id', [parseInt(req.params.id), wsId]);
  if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ message: 'Đã xóa' });
});

// ═══════════════════════════════════════════════════════════════════════════
// M8–M11 (CTĐT/CĐR) — nạp module riêng để giữ server.js gọn
// ═══════════════════════════════════════════════════════════════════════════
require('./routes-ctdt.js')(app, { q, one, tx, getWs, auth });

// ─── Static ─────────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// Error handler
app.use((err, req, res, next) => {
  // Tệp vượt giới hạn là lỗi của người gửi, không phải lỗi máy chủ. Trước đây
  // trả 500 kèm câu tiếng Anh "File too large", còn giao diện thì đứng im
  // không báo gì, người nộp bấm đi bấm lại mà không hiểu vì sao.
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: `Tệp vượt quá giới hạn ${MAX_FILE_MB} MB. Hãy nén lại hoặc tách nhỏ rồi nộp lại.` });
  }
  if (err && err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Sai định dạng biểu mẫu tải lên' });
  }
  console.error('[err]', err.message);
  res.status(500).json({ error: err.message });
});

// ═══════════════════════════════════════════════════════════════════════════
async function start() {
  await waitForDb();
  await initSchema();
  await require('./seed.js').ensureSeed({ q, one });
  app.listen(PORT, () => {
    console.log(`\n✅  KĐCLGD v2 (Postgres)`);
    console.log(`   http://localhost:${PORT}\n`);
  });
}
start().catch(e => { console.error('Khởi động thất bại:', e); process.exit(1); });

module.exports = app;

// Chốt chặn cuối cùng: nếu vẫn còn lỗi nào lọt ra ngoài mọi lớp trên thì GHI
// LOG rồi chạy tiếp, không để tiến trình chết và kéo theo cả hệ thống.
process.on('unhandledRejection', (e) => console.error('[promise bị từ chối không ai bắt]', e));
process.on('uncaughtException', (e) => console.error('[ngoại lệ không ai bắt]', e));
