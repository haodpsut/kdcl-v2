// ─── Xác thực: login theo vai, không dùng thư viện nặng ──────────────────────
// Băm mật khẩu = scrypt (crypto builtin). Phiên = token ngẫu nhiên lưu bảng sessions,
// gửi client qua cookie httpOnly. Middleware gắn req.user.
const crypto = require('crypto');
const { q, one } = require('./db');

const COOKIE = 'kdcl_sid';
const SESSION_DAYS = 7;

// ─── Password hashing (scrypt) ──────────────────────────────────────────────
function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(plain, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const test = crypto.scryptSync(plain, salt, 64).toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(test, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ─── Cookie ─────────────────────────────────────────────────────────────────
function parseCookies(req) {
  const header = req.headers.cookie || '';
  return header.split(';').reduce((acc, pair) => {
    const [k, ...v] = pair.trim().split('=');
    if (k) acc[k] = decodeURIComponent(v.join('=') || '');
    return acc;
  }, {});
}
function setSessionCookie(res, token) {
  const maxAge = SESSION_DAYS * 24 * 3600;
  res.setHeader('Set-Cookie',
    `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}`);
}
function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
}

// ─── Sessions ───────────────────────────────────────────────────────────────
async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000);
  await q('INSERT INTO sessions(token, user_id, expires_at) VALUES ($1,$2,$3)',
    [token, userId, expires]);
  return token;
}
async function destroySession(token) {
  if (token) await q('DELETE FROM sessions WHERE token = $1', [token]);
}
async function userFromRequest(req) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return null;
  const row = await one(
    `SELECT u.id, u.username, u.role, u.unit_id, u.display_name, u.active
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token = $1 AND s.expires_at > now() AND u.active = TRUE`,
    [token]);
  return row;
}

// ─── Middleware ─────────────────────────────────────────────────────────────
// Gắn req.user (hoặc null). Không chặn — để route tự quyết.
function attachUser() {
  return async (req, res, next) => {
    try { req.user = await userFromRequest(req); }
    catch (e) { req.user = null; }
    next();
  };
}
// Bắt buộc đăng nhập
function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Chưa đăng nhập' });
  next();
}
// Bắt buộc vai cụ thể
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Chưa đăng nhập' });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: 'Không đủ quyền' });
    next();
  };
}

module.exports = {
  COOKIE, hashPassword, verifyPassword, parseCookies,
  setSessionCookie, clearSessionCookie,
  createSession, destroySession, userFromRequest,
  attachUser, requireAuth, requireRole,
};
