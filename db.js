// ─── Tầng truy cập Postgres ──────────────────────────────────────────────────
// Thay cho loadDB()/saveDB() của v1. Dùng node-postgres (pg) Pool.
const { Pool, types } = require('pg');
const fs = require('fs');
const path = require('path');

// NUMERIC (OID 1700) → số thực (mặc định pg trả chuỗi) để khớp v1
types.setTypeParser(1700, (v) => (v === null ? null : parseFloat(v)));
// TIMESTAMPTZ (1184) & TIMESTAMP (1114) → chuỗi vi-VN như v1 hiển thị
const toVi = (v) => (v === null ? null : new Date(v).toLocaleString('vi-VN'));
types.setTypeParser(1184, toVi);
types.setTypeParser(1114, toVi);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    'postgres://kdcl:kdcl@localhost:5435/kdcl',
  max: 10,
});

pool.on('error', (err) => console.error('[pg] pool error:', err.message));

// Query ngắn gọn: q('SELECT ...', [params]) → rows
async function q(text, params) {
  const res = await pool.query(text, params);
  return res.rows;
}
// Lấy 1 dòng (hoặc null)
async function one(text, params) {
  const rows = await q(text, params);
  return rows[0] || null;
}
// Chạy trong transaction: tx(async (c) => { await c.query(...) })
async function tx(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const out = await fn(client);
    await client.query('COMMIT');
    return out;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// Chờ Postgres sẵn sàng (container có thể lên chậm hơn app)
async function waitForDb(retries = 30, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try { await pool.query('SELECT 1'); return; }
    catch (e) {
      console.log(`[pg] chờ database... (${i + 1}/${retries})`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('Không kết nối được Postgres sau nhiều lần thử');
}

// Áp schema (idempotent) khi khởi động
async function initSchema() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('[pg] schema đã sẵn sàng');
}

module.exports = { pool, q, one, tx, waitForDb, initSchema };
