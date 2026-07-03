// ═══════════════════════════════════════════════════════════════════════════
// M8–M11 (CTĐT / CĐR) — port từ v1 server.js sang Postgres.
// Engine tính CLO% → PLO% + phân loại AUN-QA giữ NGUYÊN toán tử của v1
// (fetch rows ra mảng rồi chạy y hệt JS cũ).
// ═══════════════════════════════════════════════════════════════════════════
const BLOOM_LEVELS = ['remember','understand','apply','analyze','evaluate','create'];
const PLO_TYPES    = ['knowledge','skill','attitude'];
const COURSE_TYPES = ['core','elective','general'];
const MAP_LEVELS   = ['I','R','M'];
const ITEM_TYPES   = ['test','rubric','project','observation'];
const PLAN_STATUSES= ['draft','active','closed'];
const CLO_INFLATION_LIMIT = 6;

const RUBRIC_PRESETS = {
  A_D:     { name: 'A-D (Yếu/TB/Khá/Giỏi)', levels: ['Yếu','Trung bình','Khá','Giỏi'] },
  NOVICE:  { name: 'Novice → Mastery',       levels: ['Cần phát triển','Đang phát triển','Hài lòng','Vượt trội'] },
  NUMERIC: { name: 'Mức 1–4',                levels: ['Mức 1','Mức 2','Mức 3','Mức 4'] },
};
function defaultRubricLevels(presetKey = 'A_D') {
  const preset = RUBRIC_PRESETS[presetKey] || RUBRIC_PRESETS.A_D;
  const n = preset.levels.length;
  const w = Math.round(10000 / n) / 100;
  return preset.levels.map((nm, i) => ({ name: nm, is_pass: i >= Math.floor(n/2), weight: w, description: '' }));
}
function sanitizeLevels(levels) {
  if (!Array.isArray(levels)) return [];
  return levels.map(l => ({
    name: String(l.name || '').trim() || '—',
    is_pass: !!l.is_pass,
    weight: Math.max(0, Number(l.weight) || 0),
    description: String(l.description || '').trim(),
  }));
}
function sanitizeCloTargets(arr, allowedCloIds) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  for (const t of arr) {
    const cid = parseInt(t.clo_id);
    if (!cid || !allowedCloIds.has(cid)) continue;
    const w = Math.max(0, Number(t.weight) || 0);
    if (w === 0) continue;
    out.push({ clo_id: cid, weight: w });
  }
  const seen = new Map();
  for (const t of out) seen.set(t.clo_id, t);
  return [...seen.values()];
}
function classifyAunQa(pct) {
  if (pct >= 75) return 'fully_achieved';
  if (pct >= 50) return 'achieved';
  if (pct >= 25) return 'not_achieved';
  return 'fully_not_achieved';
}

module.exports = function (app, { q, one, tx, getWs, auth }) {
  const wA = auth.requireAuth;

  // ─── PEO ───────────────────────────────────────────────────────────────────
  app.get('/api/peos', async (req, res) => {
    const wsId = await getWs(req);
    res.json(await q('SELECT * FROM peos WHERE workspace_id=$1 ORDER BY code', [wsId]));
  });
  app.post('/api/peos', wA, async (req, res) => {
    const wsId = await getWs(req);
    const { code, content } = req.body;
    if (!code || !content) return res.status(400).json({ error: 'Thiếu mã hoặc nội dung PEO' });
    if (await one('SELECT id FROM peos WHERE workspace_id=$1 AND code=$2', [wsId, code.trim()]))
      return res.status(400).json({ error: `Đã có PEO "${code}"` });
    const r = await one('INSERT INTO peos(workspace_id,code,content) VALUES ($1,$2,$3) RETURNING id',
      [wsId, code.trim(), content.trim()]);
    res.json({ id: r.id, message: 'Đã tạo PEO' });
  });
  app.put('/api/peos/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const peo = await one('SELECT * FROM peos WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
    if (!peo) return res.status(404).json({ error: 'Không tìm thấy' });
    const { code, content } = req.body;
    if (code !== undefined && code.trim() !== peo.code &&
        await one('SELECT id FROM peos WHERE workspace_id=$1 AND code=$2 AND id<>$3', [wsId, code.trim(), peo.id]))
      return res.status(400).json({ error: `Đã có PEO "${code.trim()}"` });
    await q('UPDATE peos SET code=COALESCE($2,code), content=COALESCE($3,content) WHERE id=$1',
      [peo.id, code?.trim() ?? null, content?.trim() ?? null]);
    res.json({ message: 'Đã cập nhật' });
  });
  app.delete('/api/peos/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const r = await one('DELETE FROM peos WHERE id=$1 AND workspace_id=$2 RETURNING id', [parseInt(req.params.id), wsId]);
    if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json({ message: 'Đã xóa' });
  });

  // ─── PLO ───────────────────────────────────────────────────────────────────
  app.get('/api/plos', async (req, res) => {
    const wsId = await getWs(req);
    res.json(await q('SELECT * FROM plos WHERE workspace_id=$1 ORDER BY code', [wsId]));
  });
  app.post('/api/plos', wA, async (req, res) => {
    const wsId = await getWs(req);
    const { code, content, bloom_level, type } = req.body;
    if (!code || !content) return res.status(400).json({ error: 'Thiếu mã hoặc nội dung PLO' });
    if (await one('SELECT id FROM plos WHERE workspace_id=$1 AND code=$2', [wsId, code.trim()]))
      return res.status(400).json({ error: `Đã có PLO "${code}"` });
    const r = await one('INSERT INTO plos(workspace_id,code,content,bloom_level,type) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [wsId, code.trim(), content.trim(),
       BLOOM_LEVELS.includes(bloom_level)?bloom_level:'apply', PLO_TYPES.includes(type)?type:'knowledge']);
    res.json({ id: r.id, message: 'Đã tạo PLO' });
  });
  app.put('/api/plos/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const plo = await one('SELECT * FROM plos WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
    if (!plo) return res.status(404).json({ error: 'Không tìm thấy' });
    const { code, content, bloom_level, type } = req.body;
    if (code !== undefined && code.trim() !== plo.code &&
        await one('SELECT id FROM plos WHERE workspace_id=$1 AND code=$2 AND id<>$3', [wsId, code.trim(), plo.id]))
      return res.status(400).json({ error: `Đã có PLO "${code.trim()}"` });
    await q(`UPDATE plos SET code=COALESCE($2,code), content=COALESCE($3,content),
             bloom_level=$4, type=$5 WHERE id=$1`,
      [plo.id, code?.trim() ?? null, content?.trim() ?? null,
       (bloom_level!==undefined && BLOOM_LEVELS.includes(bloom_level))?bloom_level:plo.bloom_level,
       (type!==undefined && PLO_TYPES.includes(type))?type:plo.type]);
    res.json({ message: 'Đã cập nhật' });
  });
  app.delete('/api/plos/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const r = await one('DELETE FROM plos WHERE id=$1 AND workspace_id=$2 RETURNING id', [parseInt(req.params.id), wsId]);
    if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json({ message: 'Đã xóa' }); // clo_plo_map/course_plo_map cascade qua FK
  });

  // ─── Courses ───────────────────────────────────────────────────────────────
  app.get('/api/courses', async (req, res) => {
    const wsId = await getWs(req);
    res.json(await q(
      `SELECT c.*, (SELECT count(*)::int FROM clos cl WHERE cl.workspace_id=$1 AND cl.course_id=c.id) AS clo_count
         FROM courses c WHERE c.workspace_id=$1 ORDER BY c.semester, c.code`, [wsId]));
  });
  app.post('/api/courses', wA, async (req, res) => {
    const wsId = await getWs(req);
    const { code, name, credits, semester, type } = req.body;
    if (!code || !name) return res.status(400).json({ error: 'Thiếu mã hoặc tên học phần' });
    if (await one('SELECT id FROM courses WHERE workspace_id=$1 AND code=$2', [wsId, code.trim()]))
      return res.status(400).json({ error: `Đã có học phần "${code}"` });
    const r = await one('INSERT INTO courses(workspace_id,code,name,credits,semester,type) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [wsId, code.trim(), name.trim(), Number(credits)||0, Number(semester)||0, COURSE_TYPES.includes(type)?type:'core']);
    res.json({ id: r.id, message: 'Đã tạo học phần' });
  });
  app.put('/api/courses/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const c = await one('SELECT * FROM courses WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
    if (!c) return res.status(404).json({ error: 'Không tìm thấy' });
    const { code, name, credits, semester, type } = req.body;
    if (code !== undefined && code.trim() !== c.code &&
        await one('SELECT id FROM courses WHERE workspace_id=$1 AND code=$2 AND id<>$3', [wsId, code.trim(), c.id]))
      return res.status(400).json({ error: `Đã có học phần "${code.trim()}"` });
    await q(`UPDATE courses SET code=COALESCE($2,code), name=COALESCE($3,name),
             credits=COALESCE($4,credits), semester=COALESCE($5,semester), type=$6 WHERE id=$1`,
      [c.id, code?.trim() ?? null, name?.trim() ?? null,
       credits!==undefined?Number(credits)||0:null, semester!==undefined?Number(semester)||0:null,
       (type!==undefined && COURSE_TYPES.includes(type))?type:c.type]);
    res.json({ message: 'Đã cập nhật' });
  });
  app.delete('/api/courses/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const cid = parseInt(req.params.id);
    const cnt = await one(`SELECT
        (SELECT count(*)::int FROM clos WHERE workspace_id=$1 AND course_id=$2) AS clos,
        (SELECT count(*)::int FROM assessment_plans WHERE workspace_id=$1 AND course_id=$2) AS plans`,
      [wsId, cid]);
    const r = await one('DELETE FROM courses WHERE id=$1 AND workspace_id=$2 RETURNING id', [cid, wsId]);
    if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json({ message: 'Đã xóa', clos_removed: cnt.clos, plans_removed: cnt.plans }); // cascade qua FK
  });

  // ─── CLO ───────────────────────────────────────────────────────────────────
  app.get('/api/clos', async (req, res) => {
    const wsId = await getWs(req);
    const cond = ['workspace_id=$1']; const p = [wsId];
    if (req.query.course_id) { p.push(parseInt(req.query.course_id)); cond.push(`course_id=$${p.length}`); }
    res.json(await q(`SELECT * FROM clos WHERE ${cond.join(' AND ')} ORDER BY code`, p));
  });
  app.post('/api/clos', wA, async (req, res) => {
    const wsId = await getWs(req);
    const { course_id, code, content, bloom_level, type, rubric_id } = req.body;
    if (!course_id || !code || !content) return res.status(400).json({ error: 'Thiếu course_id, mã hoặc nội dung CLO' });
    const cid = parseInt(course_id);
    if (!await one('SELECT id FROM courses WHERE id=$1 AND workspace_id=$2', [cid, wsId]))
      return res.status(400).json({ error: 'Học phần không tồn tại' });
    if (await one('SELECT id FROM clos WHERE workspace_id=$1 AND course_id=$2 AND code=$3', [wsId, cid, code.trim()]))
      return res.status(400).json({ error: `Đã có CLO "${code}" trong học phần này` });
    let rid = null;
    if (rubric_id !== undefined && rubric_id !== null && rubric_id !== '') {
      rid = parseInt(rubric_id);
      if (!await one('SELECT id FROM rubrics WHERE id=$1 AND workspace_id=$2', [rid, wsId]))
        return res.status(400).json({ error: 'Rubric không tồn tại' });
    }
    const r = await one(`INSERT INTO clos(workspace_id,course_id,code,content,bloom_level,type,rubric_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [wsId, cid, code.trim(), content.trim(),
       BLOOM_LEVELS.includes(bloom_level)?bloom_level:'apply', PLO_TYPES.includes(type)?type:'knowledge', rid]);
    const total = (await one('SELECT count(*)::int n FROM clos WHERE workspace_id=$1 AND course_id=$2', [wsId, cid])).n;
    const warning = total > CLO_INFLATION_LIMIT
      ? `⚠ Học phần này hiện có ${total} CLO (> ${CLO_INFLATION_LIMIT}). Khuyến nghị 4–6 CLO/HP.` : null;
    res.json({ id: r.id, message: 'Đã tạo CLO', warning });
  });
  app.put('/api/clos/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const cl = await one('SELECT * FROM clos WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
    if (!cl) return res.status(404).json({ error: 'Không tìm thấy' });
    const { code, content, bloom_level, type, rubric_id } = req.body;
    if (code !== undefined && code.trim() !== cl.code &&
        await one('SELECT id FROM clos WHERE workspace_id=$1 AND course_id=$2 AND code=$3 AND id<>$4', [wsId, cl.course_id, code.trim(), cl.id]))
      return res.status(400).json({ error: `Đã có CLO "${code.trim()}" trong học phần này` });
    let rid = cl.rubric_id;
    if (rubric_id !== undefined) {
      if (rubric_id === null || rubric_id === '') rid = null;
      else {
        rid = parseInt(rubric_id);
        if (!await one('SELECT id FROM rubrics WHERE id=$1 AND workspace_id=$2', [rid, wsId]))
          return res.status(400).json({ error: 'Rubric không tồn tại' });
      }
    }
    await q(`UPDATE clos SET code=COALESCE($2,code), content=COALESCE($3,content),
             bloom_level=$4, type=$5, rubric_id=$6 WHERE id=$1`,
      [cl.id, code?.trim() ?? null, content?.trim() ?? null,
       (bloom_level!==undefined && BLOOM_LEVELS.includes(bloom_level))?bloom_level:cl.bloom_level,
       (type!==undefined && PLO_TYPES.includes(type))?type:cl.type, rid]);
    res.json({ message: 'Đã cập nhật' });
  });
  app.delete('/api/clos/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const r = await one('DELETE FROM clos WHERE id=$1 AND workspace_id=$2 RETURNING id', [parseInt(req.params.id), wsId]);
    if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json({ message: 'Đã xóa' });
  });

  // ─── Course × PLO map (I/R/M) — upsert, level null = xoá ────────────────────
  app.get('/api/course-plo-map', async (req, res) => {
    const wsId = await getWs(req);
    res.json(await q('SELECT * FROM course_plo_map WHERE workspace_id=$1', [wsId]));
  });
  app.post('/api/course-plo-map', wA, async (req, res) => {
    const wsId = await getWs(req);
    const cid = parseInt(req.body.course_id), pid = parseInt(req.body.plo_id), level = req.body.level;
    if (!cid || !pid) return res.status(400).json({ error: 'Thiếu course_id hoặc plo_id' });
    if (!await one('SELECT id FROM courses WHERE id=$1 AND workspace_id=$2', [cid, wsId]) ||
        !await one('SELECT id FROM plos WHERE id=$1 AND workspace_id=$2', [pid, wsId]))
      return res.status(400).json({ error: 'Course hoặc PLO không tồn tại' });
    if (level === null || level === '' || level === undefined) {
      const d = await one('DELETE FROM course_plo_map WHERE workspace_id=$1 AND course_id=$2 AND plo_id=$3 RETURNING id', [wsId, cid, pid]);
      return res.json({ deleted: !!d });
    }
    if (!MAP_LEVELS.includes(level)) return res.status(400).json({ error: 'level phải là I, R hoặc M' });
    await q(`INSERT INTO course_plo_map(workspace_id,course_id,plo_id,level) VALUES ($1,$2,$3,$4)
             ON CONFLICT (workspace_id,course_id,plo_id) DO UPDATE SET level=EXCLUDED.level`, [wsId, cid, pid, level]);
    res.json({ ok: true, level });
  });

  // ─── CLO × PLO map (weight) — upsert, weight null = xoá ─────────────────────
  app.get('/api/clo-plo-map', async (req, res) => {
    const wsId = await getWs(req);
    if (req.query.course_id) {
      const cid = parseInt(req.query.course_id);
      return res.json(await q(
        `SELECT m.* FROM clo_plo_map m JOIN clos cl ON cl.id=m.clo_id
           WHERE m.workspace_id=$1 AND cl.course_id=$2`, [wsId, cid]));
    }
    res.json(await q('SELECT * FROM clo_plo_map WHERE workspace_id=$1', [wsId]));
  });
  app.post('/api/clo-plo-map', wA, async (req, res) => {
    const wsId = await getWs(req);
    const cid = parseInt(req.body.clo_id), pid = parseInt(req.body.plo_id), weight = req.body.weight;
    if (!cid || !pid) return res.status(400).json({ error: 'Thiếu clo_id hoặc plo_id' });
    if (!await one('SELECT id FROM clos WHERE id=$1 AND workspace_id=$2', [cid, wsId]) ||
        !await one('SELECT id FROM plos WHERE id=$1 AND workspace_id=$2', [pid, wsId]))
      return res.status(400).json({ error: 'CLO hoặc PLO không tồn tại' });
    if (weight === null || weight === '' || weight === undefined) {
      const d = await one('DELETE FROM clo_plo_map WHERE workspace_id=$1 AND clo_id=$2 AND plo_id=$3 RETURNING id', [wsId, cid, pid]);
      return res.json({ deleted: !!d });
    }
    const w = Number(weight);
    if (!Number.isFinite(w) || w < 0) return res.status(400).json({ error: 'weight phải là số ≥ 0' });
    await q(`INSERT INTO clo_plo_map(workspace_id,clo_id,plo_id,weight) VALUES ($1,$2,$3,$4)
             ON CONFLICT (workspace_id,clo_id,plo_id) DO UPDATE SET weight=EXCLUDED.weight`, [wsId, cid, pid, w]);
    res.json({ ok: true, weight: w });
  });

  // ─── Rubrics ───────────────────────────────────────────────────────────────
  app.get('/api/rubric-presets', (req, res) => res.json(RUBRIC_PRESETS));
  app.get('/api/rubrics', async (req, res) => {
    const wsId = await getWs(req);
    const rubrics = await q('SELECT * FROM rubrics WHERE workspace_id=$1 ORDER BY name', [wsId]);
    const counts = await q('SELECT rubric_id, count(*)::int n FROM clos WHERE workspace_id=$1 AND rubric_id IS NOT NULL GROUP BY rubric_id', [wsId]);
    const cloCount = {}; for (const c of counts) cloCount[c.rubric_id] = c.n;
    res.json(rubrics.map(r => {
      const levels = r.levels || [];
      const sumW = levels.reduce((s,l)=>s+(Number(l.weight)||0),0);
      return { id: r.id, name: r.name, description: r.description, scale_type: r.scale_type,
        level_count: levels.length, weight_sum: Math.round(sumW*100)/100,
        pass_count: levels.filter(l=>l.is_pass).length, clo_count: cloCount[r.id]||0,
        created_at: r.created_at, updated_at: r.updated_at };
    }));
  });
  app.get('/api/rubrics/:id', async (req, res) => {
    const wsId = await getWs(req);
    const r = await one('SELECT * FROM rubrics WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
    if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json(r);
  });
  app.post('/api/rubrics', wA, async (req, res) => {
    const wsId = await getWs(req);
    const { name, description, scale_type, levels, preset } = req.body;
    if (!name) return res.status(400).json({ error: 'Thiếu tên rubric' });
    const lvls = (Array.isArray(levels) && levels.length > 0) ? sanitizeLevels(levels)
      : defaultRubricLevels(preset || scale_type || 'A_D');
    const r = await one(`INSERT INTO rubrics(workspace_id,name,description,scale_type,levels)
      VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [wsId, name.trim(), (description||'').trim(), scale_type||preset||'A_D', JSON.stringify(lvls)]);
    res.json({ id: r.id, message: 'Đã tạo rubric' });
  });
  app.put('/api/rubrics/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const r = await one('SELECT * FROM rubrics WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
    if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
    const { name, description, scale_type, levels } = req.body;
    await q(`UPDATE rubrics SET name=COALESCE($2,name), description=COALESCE($3,description),
             scale_type=COALESCE($4,scale_type), levels=COALESCE($5,levels), updated_at=now() WHERE id=$1`,
      [r.id, name?.trim() ?? null, description?.trim() ?? null, scale_type ?? null,
       levels!==undefined ? JSON.stringify(sanitizeLevels(levels)) : null]);
    res.json({ message: 'Đã cập nhật rubric' });
  });
  app.delete('/api/rubrics/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const rid = parseInt(req.params.id);
    const detach = await one('SELECT count(*)::int n FROM clos WHERE workspace_id=$1 AND rubric_id=$2', [wsId, rid]);
    const r = await one('DELETE FROM rubrics WHERE id=$1 AND workspace_id=$2 RETURNING id', [rid, wsId]);
    if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
    await q('UPDATE clos SET rubric_id=NULL WHERE workspace_id=$1 AND rubric_id=$2', [wsId, rid]);
    res.json({ message: 'Đã xóa rubric', clos_detached: detach.n });
  });

  // ─── Assessment Plans ──────────────────────────────────────────────────────
  app.get('/api/assessment-plans', async (req, res) => {
    const wsId = await getWs(req);
    const cond = ['p.workspace_id=$1']; const pr = [wsId];
    if (req.query.course_id) { pr.push(parseInt(req.query.course_id)); cond.push(`p.course_id=$${pr.length}`); }
    res.json(await q(
      `SELECT p.*, c.code AS course_code, c.name AS course_name,
         (SELECT count(*)::int FROM assessment_items it WHERE it.plan_id=p.id) AS item_count,
         (SELECT count(*)::int FROM plan_students s WHERE s.plan_id=p.id) AS student_count
       FROM assessment_plans p LEFT JOIN courses c ON c.id=p.course_id
       WHERE ${cond.join(' AND ')} ORDER BY p.school_year DESC, p.semester`, pr));
  });
  app.get('/api/assessment-plans/:id', async (req, res) => {
    const wsId = await getWs(req);
    const p = await one(`SELECT p.*, c.code AS course_code, c.name AS course_name
      FROM assessment_plans p LEFT JOIN courses c ON c.id=p.course_id
      WHERE p.id=$1 AND p.workspace_id=$2`, [parseInt(req.params.id), wsId]);
    if (!p) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json(p);
  });
  app.post('/api/assessment-plans', wA, async (req, res) => {
    const wsId = await getWs(req);
    const { course_id, name, semester, school_year, threshold_pct, pass_score_pct } = req.body;
    if (!course_id || !school_year) return res.status(400).json({ error: 'Thiếu course_id hoặc năm học' });
    const cid = parseInt(course_id);
    const course = await one('SELECT * FROM courses WHERE id=$1 AND workspace_id=$2', [cid, wsId]);
    if (!course) return res.status(400).json({ error: 'Học phần không tồn tại' });
    const sem = parseInt(semester) || 1;
    if (await one('SELECT id FROM assessment_plans WHERE workspace_id=$1 AND course_id=$2 AND semester=$3 AND school_year=$4',
        [wsId, cid, sem, school_year.trim()]))
      return res.status(400).json({ error: `Đã có kế hoạch cho ${course.code} HK${sem} năm ${school_year}` });
    const r = await one(`INSERT INTO assessment_plans(workspace_id,course_id,name,semester,school_year,threshold_pct,pass_score_pct,status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'draft') RETURNING id`,
      [wsId, cid, (name||`${course.code} — HK${sem} ${school_year}`).trim(), sem, school_year.trim(),
       Math.max(0,Math.min(100,Number(threshold_pct)||75)), Math.max(0,Math.min(100,Number(pass_score_pct)||50))]);
    res.json({ id: r.id, message: 'Đã tạo kế hoạch đo CLO' });
  });
  app.put('/api/assessment-plans/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const p = await one('SELECT * FROM assessment_plans WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
    if (!p) return res.status(404).json({ error: 'Không tìm thấy' });
    const { name, semester, school_year, threshold_pct, pass_score_pct, status } = req.body;
    await q(`UPDATE assessment_plans SET name=COALESCE($2,name), semester=COALESCE($3,semester),
             school_year=COALESCE($4,school_year), threshold_pct=COALESCE($5,threshold_pct),
             pass_score_pct=COALESCE($6,pass_score_pct), status=$7, updated_at=now() WHERE id=$1`,
      [p.id, name?.trim() ?? null, semester!==undefined?parseInt(semester)||1:null, school_year?.trim() ?? null,
       threshold_pct!==undefined?Math.max(0,Math.min(100,Number(threshold_pct)||0)):null,
       pass_score_pct!==undefined?Math.max(0,Math.min(100,Number(pass_score_pct)||0)):null,
       (status!==undefined && PLAN_STATUSES.includes(status))?status:p.status]);
    res.json({ message: 'Đã cập nhật' });
  });
  app.delete('/api/assessment-plans/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const r = await one('DELETE FROM assessment_plans WHERE id=$1 AND workspace_id=$2 RETURNING id', [parseInt(req.params.id), wsId]);
    if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json({ message: 'Đã xóa' });
  });

  // ─── Assessment Items ──────────────────────────────────────────────────────
  app.get('/api/assessment-items', async (req, res) => {
    const wsId = await getWs(req);
    const cond = ['workspace_id=$1']; const p = [wsId];
    if (req.query.plan_id) { p.push(parseInt(req.query.plan_id)); cond.push(`plan_id=$${p.length}`); }
    res.json(await q(`SELECT * FROM assessment_items WHERE ${cond.join(' AND ')} ORDER BY created_at`, p));
  });
  app.get('/api/assessment-items/:id', async (req, res) => {
    const wsId = await getWs(req);
    const it = await one('SELECT * FROM assessment_items WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
    if (!it) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json(it);
  });
  async function allowedClos(wsId, planId) {
    const plan = await one('SELECT course_id FROM assessment_plans WHERE id=$1 AND workspace_id=$2', [planId, wsId]);
    if (!plan) return null;
    const clos = await q('SELECT id FROM clos WHERE workspace_id=$1 AND course_id=$2', [wsId, plan.course_id]);
    return new Set(clos.map(c => c.id));
  }
  app.post('/api/assessment-items', wA, async (req, res) => {
    const wsId = await getWs(req);
    const { plan_id, name, type, max_score, description, clo_targets } = req.body;
    if (!plan_id || !name) return res.status(400).json({ error: 'Thiếu plan_id hoặc tên bài đánh giá' });
    const pid = parseInt(plan_id);
    const allowed = await allowedClos(wsId, pid);
    if (!allowed) return res.status(400).json({ error: 'Plan không tồn tại' });
    const targets = sanitizeCloTargets(clo_targets, allowed);
    const r = await one(`INSERT INTO assessment_items(workspace_id,plan_id,name,type,max_score,description,clo_targets)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [wsId, pid, name.trim(), ITEM_TYPES.includes(type)?type:'test', Math.max(0.01,Number(max_score)||10),
       (description||'').trim(), JSON.stringify(targets)]);
    const sum = targets.reduce((s,t)=>s+t.weight,0);
    res.json({ id: r.id, message: 'Đã tạo bài đánh giá', warning: sum>100?`Tổng weight CLO targets = ${sum}% (>100%).`:null });
  });
  app.put('/api/assessment-items/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const it = await one('SELECT * FROM assessment_items WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
    if (!it) return res.status(404).json({ error: 'Không tìm thấy' });
    const { name, type, max_score, description, clo_targets } = req.body;
    let targets = it.clo_targets;
    if (clo_targets !== undefined) {
      const allowed = await allowedClos(wsId, it.plan_id);
      targets = sanitizeCloTargets(clo_targets, allowed || new Set());
    }
    await q(`UPDATE assessment_items SET name=COALESCE($2,name), type=$3, max_score=COALESCE($4,max_score),
             description=COALESCE($5,description), clo_targets=$6, updated_at=now() WHERE id=$1`,
      [it.id, name?.trim() ?? null, (type!==undefined && ITEM_TYPES.includes(type))?type:it.type,
       max_score!==undefined?Math.max(0.01,Number(max_score)||10):null, description?.trim() ?? null,
       JSON.stringify(targets)]);
    res.json({ message: 'Đã cập nhật' });
  });
  app.delete('/api/assessment-items/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const r = await one('DELETE FROM assessment_items WHERE id=$1 AND workspace_id=$2 RETURNING id', [parseInt(req.params.id), wsId]);
    if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json({ message: 'Đã xóa' });
  });

  // ─── Plan Students ─────────────────────────────────────────────────────────
  app.get('/api/plan-students', async (req, res) => {
    const wsId = await getWs(req);
    const cond = ['workspace_id=$1']; const p = [wsId];
    if (req.query.plan_id) { p.push(parseInt(req.query.plan_id)); cond.push(`plan_id=$${p.length}`); }
    res.json(await q(`SELECT * FROM plan_students WHERE ${cond.join(' AND ')} ORDER BY code`, p));
  });
  app.post('/api/plan-students', wA, async (req, res) => {
    const wsId = await getWs(req);
    const { plan_id, code, full_name } = req.body;
    if (!plan_id || !code || !full_name) return res.status(400).json({ error: 'Thiếu plan_id, mã SV hoặc họ tên' });
    const pid = parseInt(plan_id);
    if (!await one('SELECT id FROM assessment_plans WHERE id=$1 AND workspace_id=$2', [pid, wsId]))
      return res.status(400).json({ error: 'Plan không tồn tại' });
    if (await one('SELECT id FROM plan_students WHERE workspace_id=$1 AND plan_id=$2 AND code=$3', [wsId, pid, code.trim()]))
      return res.status(400).json({ error: `Đã có SV mã "${code}"` });
    const r = await one('INSERT INTO plan_students(workspace_id,plan_id,code,full_name) VALUES ($1,$2,$3,$4) RETURNING id',
      [wsId, pid, code.trim(), full_name.trim()]);
    res.json({ id: r.id, message: 'Đã thêm SV' });
  });
  app.post('/api/plan-students/bulk', wA, async (req, res) => {
    const wsId = await getWs(req);
    const { plan_id, raw } = req.body;
    if (!plan_id || !raw) return res.status(400).json({ error: 'Thiếu plan_id hoặc dữ liệu' });
    const pid = parseInt(plan_id);
    if (!await one('SELECT id FROM assessment_plans WHERE id=$1 AND workspace_id=$2', [pid, wsId]))
      return res.status(400).json({ error: 'Plan không tồn tại' });
    const existRows = await q('SELECT code FROM plan_students WHERE workspace_id=$1 AND plan_id=$2', [wsId, pid]);
    const existing = new Set(existRows.map(r => r.code));
    let added = 0, skipped = 0, invalid = 0;
    await tx(async (c) => {
      for (const line of String(raw).split(/\r?\n/)) {
        const t = line.trim(); if (!t) continue;
        const parts = t.split(/\t|,|\s{2,}/).map(x => x.trim()).filter(Boolean);
        if (parts.length < 2) { invalid++; continue; }
        const code = parts[0], name = parts.slice(1).join(' ');
        if (existing.has(code)) { skipped++; continue; }
        await c.query('INSERT INTO plan_students(workspace_id,plan_id,code,full_name) VALUES ($1,$2,$3,$4)', [wsId, pid, code, name]);
        existing.add(code); added++;
      }
    });
    res.json({ message: `Đã thêm ${added} SV`, added, skipped, invalid });
  });
  app.put('/api/plan-students/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const s = await one('SELECT * FROM plan_students WHERE id=$1 AND workspace_id=$2', [parseInt(req.params.id), wsId]);
    if (!s) return res.status(404).json({ error: 'Không tìm thấy' });
    const { code, full_name } = req.body;
    if (code !== undefined && code.trim() !== s.code &&
        await one('SELECT id FROM plan_students WHERE workspace_id=$1 AND plan_id=$2 AND code=$3 AND id<>$4', [wsId, s.plan_id, code.trim(), s.id]))
      return res.status(400).json({ error: `Đã có SV mã "${code.trim()}"` });
    await q('UPDATE plan_students SET code=COALESCE($2,code), full_name=COALESCE($3,full_name) WHERE id=$1',
      [s.id, code?.trim() ?? null, full_name?.trim() ?? null]);
    res.json({ message: 'Đã cập nhật' });
  });
  app.delete('/api/plan-students/:id', wA, async (req, res) => {
    const wsId = await getWs(req);
    const r = await one('DELETE FROM plan_students WHERE id=$1 AND workspace_id=$2 RETURNING id', [parseInt(req.params.id), wsId]);
    if (!r) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json({ message: 'Đã xóa' });
  });

  // ─── Scores — upsert, score null = xoá ──────────────────────────────────────
  app.get('/api/scores', async (req, res) => {
    const wsId = await getWs(req);
    if (req.query.plan_id) {
      const pid = parseInt(req.query.plan_id);
      return res.json(await q(
        `SELECT s.* FROM scores s JOIN assessment_items it ON it.id=s.item_id
           WHERE s.workspace_id=$1 AND it.plan_id=$2`, [wsId, pid]));
    }
    const cond = ['workspace_id=$1']; const p = [wsId];
    if (req.query.item_id) { p.push(parseInt(req.query.item_id)); cond.push(`item_id=$${p.length}`); }
    res.json(await q(`SELECT * FROM scores WHERE ${cond.join(' AND ')}`, p));
  });
  app.post('/api/scores', wA, async (req, res) => {
    const wsId = await getWs(req);
    const iid = parseInt(req.body.item_id), sid = parseInt(req.body.plan_student_id), score = req.body.score;
    if (!iid || !sid) return res.status(400).json({ error: 'Thiếu item_id hoặc plan_student_id' });
    const item = await one('SELECT * FROM assessment_items WHERE id=$1 AND workspace_id=$2', [iid, wsId]);
    const stu  = await one('SELECT * FROM plan_students WHERE id=$1 AND workspace_id=$2', [sid, wsId]);
    if (!item || !stu) return res.status(400).json({ error: 'Item hoặc SV không tồn tại' });
    if (item.plan_id !== stu.plan_id) return res.status(400).json({ error: 'Item và SV không cùng plan' });
    if (score === null || score === '' || score === undefined) {
      const d = await one('DELETE FROM scores WHERE workspace_id=$1 AND item_id=$2 AND plan_student_id=$3 RETURNING id', [wsId, iid, sid]);
      return res.json({ deleted: !!d });
    }
    const sc = Number(score);
    if (!Number.isFinite(sc) || sc < 0) return res.status(400).json({ error: 'score phải là số ≥ 0' });
    if (sc > item.max_score) return res.status(400).json({ error: `score vượt max_score (${item.max_score})` });
    await q(`INSERT INTO scores(workspace_id,item_id,plan_student_id,score,updated_at) VALUES ($1,$2,$3,$4,now())
             ON CONFLICT (item_id,plan_student_id) DO UPDATE SET score=EXCLUDED.score, updated_at=now()`,
      [wsId, iid, sid, sc]);
    res.json({ ok: true, score: sc });
  });

  // ─── M10: kết quả 1 plan (giữ NGUYÊN toán tử v1) ────────────────────────────
  app.get('/api/assessment-plans/:id/results', async (req, res) => {
    const wsId = await getWs(req);
    const pid = parseInt(req.params.id);
    const plan = await one('SELECT * FROM assessment_plans WHERE id=$1 AND workspace_id=$2', [pid, wsId]);
    if (!plan) return res.status(404).json({ error: 'Không tìm thấy' });

    const items    = await q('SELECT * FROM assessment_items WHERE workspace_id=$1 AND plan_id=$2', [wsId, pid]);
    const students = await q('SELECT * FROM plan_students WHERE workspace_id=$1 AND plan_id=$2', [wsId, pid]);
    const clos     = await q('SELECT * FROM clos WHERE workspace_id=$1 AND course_id=$2', [wsId, plan.course_id]);
    const itemIds  = new Set(items.map(it => it.id));
    const scoresAll = (await q('SELECT * FROM scores WHERE workspace_id=$1', [wsId])).filter(s => itemIds.has(s.item_id));

    const scoreIdx = {};
    for (const s of scoresAll) scoreIdx[`${s.item_id}-${s.plan_student_id}`] = s.score;
    const cloItems = {};
    for (const cl of clos) cloItems[cl.id] = [];
    for (const it of items) for (const t of (it.clo_targets || [])) {
      if (cloItems[t.clo_id]) cloItems[t.clo_id].push({ item_id: it.id, weight: Number(t.weight)||0, max_score: it.max_score });
    }
    const passPct = plan.pass_score_pct || 50;
    const thrPct  = plan.threshold_pct  || 75;
    const psc = {};
    for (const s of students) for (const cl of clos) {
      const targets = cloItems[cl.id] || [];
      if (targets.length === 0) { psc[`${s.id}-${cl.id}`] = { score_pct: null, items_count: 0, items_with_data: 0, passed: null }; continue; }
      let wSum = 0, wxSum = 0, withData = 0;
      for (const t of targets) {
        const v = scoreIdx[`${t.item_id}-${s.id}`];
        if (v === undefined) continue;
        const ratio = (t.max_score > 0) ? (v / t.max_score) : 0;
        wSum += t.weight; wxSum += t.weight * ratio; withData++;
      }
      if (withData === 0) psc[`${s.id}-${cl.id}`] = { score_pct: null, items_count: targets.length, items_with_data: 0, passed: null };
      else {
        const pct = (wSum > 0) ? (wxSum / wSum * 100) : 0;
        psc[`${s.id}-${cl.id}`] = { score_pct: Math.round(pct*10)/10, items_count: targets.length, items_with_data: withData, passed: pct >= passPct };
      }
    }
    const summary = clos.map(cl => {
      const targets = cloItems[cl.id] || [];
      let withData = 0, passed = 0;
      for (const s of students) { const r = psc[`${s.id}-${cl.id}`]; if (r && r.score_pct !== null) { withData++; if (r.passed) passed++; } }
      const pctPass = withData > 0 ? Math.round(passed/withData*1000)/10 : null;
      return { clo_id: cl.id, code: cl.code, content: cl.content, type: cl.type,
        items_count: targets.length, students_total: students.length, students_with_data: withData,
        students_passed: passed, pct_pass: pctPass,
        level: pctPass===null?null:classifyAunQa(pctPass),
        binary: pctPass===null?null:(pctPass>=thrPct?'DAT':'KHONG_DAT') };
    });
    res.json({
      plan: { id: plan.id, name: plan.name, course_id: plan.course_id, status: plan.status, pass_score_pct: passPct, threshold_pct: thrPct },
      counts: { items: items.length, students: students.length, clos: clos.length, scores: scoresAll.length },
      items, students, clos, per_student_clo: psc, per_clo_summary: summary,
    });
  });

  // ─── M11: PLO rollup (giữ NGUYÊN toán tử v1) ────────────────────────────────
  app.get('/api/plo-rollup', async (req, res) => {
    const wsId = await getWs(req);
    const filter = { school_year: req.query.school_year || null, include_draft: req.query.include_draft === '1' };
    const plos    = await q('SELECT * FROM plos WHERE workspace_id=$1', [wsId]);
    const clos    = await q('SELECT * FROM clos WHERE workspace_id=$1', [wsId]);
    const courses = await q('SELECT * FROM courses WHERE workspace_id=$1', [wsId]);
    const cloPloMap = await q('SELECT * FROM clo_plo_map WHERE workspace_id=$1', [wsId]);
    const coursePloMap = await q('SELECT * FROM course_plo_map WHERE workspace_id=$1', [wsId]);

    let plans = await q('SELECT * FROM assessment_plans WHERE workspace_id=$1', [wsId]);
    if (!filter.include_draft) plans = plans.filter(p => p.status !== 'draft');
    if (filter.school_year)    plans = plans.filter(p => p.school_year === filter.school_year);
    const planIds = new Set(plans.map(p => p.id));
    const items = (await q('SELECT * FROM assessment_items WHERE workspace_id=$1', [wsId])).filter(it => planIds.has(it.plan_id));
    const itemIds = new Set(items.map(it => it.id));
    const students = (await q('SELECT * FROM plan_students WHERE workspace_id=$1', [wsId])).filter(s => planIds.has(s.plan_id));
    const scoresAll = (await q('SELECT * FROM scores WHERE workspace_id=$1', [wsId])).filter(s => itemIds.has(s.item_id));
    const scoreIdx = {};
    for (const s of scoresAll) scoreIdx[`${s.item_id}-${s.plan_student_id}`] = s.score;

    const cloPassByPlan = {};
    for (const plan of plans) {
      const passPct = plan.pass_score_pct || 50;
      const planItems = items.filter(it => it.plan_id === plan.id);
      const planStudents = students.filter(s => s.plan_id === plan.id);
      const courseClos = clos.filter(cl => cl.course_id === plan.course_id);
      const cloItems = {};
      for (const cl of courseClos) cloItems[cl.id] = [];
      for (const it of planItems) for (const t of (it.clo_targets || [])) {
        if (cloItems[t.clo_id]) cloItems[t.clo_id].push({ item_id: it.id, weight: Number(t.weight)||0, max_score: it.max_score });
      }
      for (const cl of courseClos) {
        const targets = cloItems[cl.id] || [];
        let withData = 0, passed = 0;
        for (const s of planStudents) {
          let wSum = 0, wxSum = 0, got = 0;
          for (const t of targets) {
            const v = scoreIdx[`${t.item_id}-${s.id}`]; if (v === undefined) continue;
            const ratio = (t.max_score > 0) ? (v / t.max_score) : 0;
            wSum += t.weight; wxSum += t.weight * ratio; got++;
          }
          if (got > 0 && wSum > 0) { withData++; if ((wxSum/wSum*100) >= passPct) passed++; }
        }
        cloPassByPlan[`${plan.id}-${cl.id}`] = { pct_pass: withData>0?(passed/withData*100):null, students_with_data: withData, students_passed: passed };
      }
    }
    const cloAgg = {};
    for (const cl of clos) {
      let totalStu = 0, totalPass = 0, plansCount = 0;
      for (const p of plans) {
        if (p.course_id !== cl.course_id) continue;
        const r = cloPassByPlan[`${p.id}-${cl.id}`];
        if (!r || r.pct_pass === null) continue;
        totalStu += r.students_with_data; totalPass += r.students_passed; plansCount++;
      }
      cloAgg[cl.id] = { pct_pass: totalStu>0?Math.round(totalPass/totalStu*1000)/10:null, total_students: totalStu, total_passed: totalPass, plans_count: plansCount };
    }
    const ploResult = plos.map(plo => {
      const contributing = cloPloMap.filter(m => m.plo_id === plo.id);
      const cloDetails = contributing.map(m => {
        const cl = clos.find(c => c.id === m.clo_id);
        const course = cl ? courses.find(c => c.id === cl.course_id) : null;
        const agg = cloAgg[m.clo_id];
        return { clo_id: m.clo_id, clo_code: cl?.code, course_id: course?.id, course_code: course?.code,
          weight: m.weight, avg_pct_pass: agg?.pct_pass ?? null, plans_count: agg?.plans_count || 0 };
      });
      let wSum = 0, wxSum = 0, withDataCount = 0;
      for (const d of cloDetails) { if (d.avg_pct_pass === null) continue; wSum += d.weight; wxSum += d.weight * d.avg_pct_pass; withDataCount++; }
      const pct = wSum > 0 ? Math.round(wxSum/wSum*10)/10 : null;
      return { plo_id: plo.id, code: plo.code, content: plo.content, bloom_level: plo.bloom_level, type: plo.type,
        contributing_clos: cloDetails, clo_with_data: withDataCount, clo_total: cloDetails.length,
        pct, level: pct===null?null:classifyAunQa(pct) };
    });
    const heatmap = [];
    for (const course of courses) for (const plo of plos) {
      const mapLevel = coursePloMap.find(m => m.course_id===course.id && m.plo_id===plo.id)?.level || null;
      const courseClos = clos.filter(cl => cl.course_id === course.id);
      const cloContribs = cloPloMap.filter(m => m.plo_id===plo.id && courseClos.some(cl => cl.id===m.clo_id));
      let wSum = 0, wxSum = 0, hasData = false;
      for (const m of cloContribs) { const agg = cloAgg[m.clo_id]; if (!agg || agg.pct_pass === null) continue; wSum += m.weight; wxSum += m.weight * agg.pct_pass; hasData = true; }
      const pct = hasData && wSum > 0 ? Math.round(wxSum/wSum*10)/10 : null;
      heatmap.push({ course_id: course.id, course_code: course.code, course_name: course.name,
        plo_id: plo.id, plo_code: plo.code, map_level: mapLevel, pct });
    }
    res.json({ filter, counts: { plos: plos.length, clos: clos.length, courses: courses.length, plans_considered: plans.length, mappings_clo_plo: cloPloMap.length }, plos: ploResult, heatmap });
  });
};
