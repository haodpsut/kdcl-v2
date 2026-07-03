-- ═══════════════════════════════════════════════════════════════════════════
-- KĐCLGD v2 — Postgres schema
-- Port từ app JSON-file (kiem-dinh-chat-luong/app) sang quan hệ thật.
-- Giữ nguyên hành vi 11 module + thêm: users (login theo vai), units (đơn vị),
-- unit_criteria (phân công), evidence status/link (quy trình nộp–duyệt).
-- Idempotent: chạy nhiều lần an toàn (IF NOT EXISTS).
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Workspaces: mỗi đợt kiểm định (CSGD/CTDT) ───────────────────────────────
CREATE TABLE IF NOT EXISTS workspaces (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('CSGD','CTDT')),
  law         TEXT DEFAULT '',
  description TEXT DEFAULT '',
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Đơn vị / phòng ban (GLOBAL — dùng chung mọi đợt) ────────────────────────
CREATE TABLE IF NOT EXISTS units (
  id         SERIAL PRIMARY KEY,
  code       TEXT UNIQUE,
  name       TEXT NOT NULL,
  type       TEXT DEFAULT 'phong',          -- phong | khoa | trung_tam | khac
  head_name  TEXT DEFAULT '',
  active     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Người dùng: login theo vai ─────────────────────────────────────────────
-- role: admin (P.ĐBCL) | unit (phòng ban, gắn unit_id) | viewer (lãnh đạo/đoàn)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,             -- scrypt: salt:hash (hex)
  role          TEXT NOT NULL DEFAULT 'unit' CHECK (role IN ('admin','unit','viewer')),
  unit_id       INTEGER REFERENCES units(id) ON DELETE SET NULL,
  display_name  TEXT DEFAULT '',
  active        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

-- ─── Phân công: đơn vị X phụ trách tiêu chí "n.m" trong đợt này ──────────────
CREATE TABLE IF NOT EXISTS unit_criteria (
  id           SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  unit_id      INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  tieu_chi     TEXT NOT NULL,             -- "6.3"
  UNIQUE (workspace_id, unit_id, tieu_chi)
);

-- ─── School info: 1 dòng / workspace, dữ liệu mềm dạng JSONB ─────────────────
CREATE TABLE IF NOT EXISTS school_info (
  workspace_id INTEGER PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
  data         JSONB DEFAULT '{}'::jsonb
);

-- ─── Minh chứng (evidence) — MỞ RỘNG so với v1 ──────────────────────────────
CREATE TABLE IF NOT EXISTS evidence (
  id           SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  code         TEXT,
  tieu_chuan   INTEGER NOT NULL,
  tieu_chi     TEXT NOT NULL,
  tieu_chi_so  INTEGER,
  thu_tu       INTEGER,
  mo_ta        TEXT DEFAULT '',
  nguon        TEXT DEFAULT '',
  ghi_chu      TEXT DEFAULT '',
  -- Lưu file LAI: source_type='file' → dùng file_*, ='link' → dùng link_url
  source_type  TEXT NOT NULL DEFAULT 'file' CHECK (source_type IN ('file','link')),
  file_name    TEXT,
  file_stored  TEXT,
  file_size    BIGINT,
  mime_type    TEXT,
  link_url     TEXT,
  -- Quy trình nộp–duyệt
  unit_id      INTEGER REFERENCES units(id) ON DELETE SET NULL,
  uploaded_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status       TEXT NOT NULL DEFAULT 'cho_duyet' CHECK (status IN ('cho_duyet','da_xac_nhan','tra_lai')),
  reviewed_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at  TIMESTAMPTZ,
  review_note  TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_evidence_ws        ON evidence(workspace_id);
CREATE INDEX IF NOT EXISTS idx_evidence_ws_tc     ON evidence(workspace_id, tieu_chi);
CREATE INDEX IF NOT EXISTS idx_evidence_ws_status ON evidence(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_evidence_ws_unit   ON evidence(workspace_id, unit_id);

-- ─── Đánh giá tiêu chí (Biểu 04) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessments (
  id              SERIAL PRIMARY KEY,
  workspace_id    INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  tieu_chuan      INTEGER NOT NULL,
  tieu_chi        TEXT NOT NULL,
  hien_trang      TEXT DEFAULT '',
  diem_manh       TEXT DEFAULT '',
  ton_tai         TEXT DEFAULT '',
  ke_hoach        TEXT DEFAULT '',
  ket_qua         TEXT DEFAULT 'CHUA',
  trang_thai      TEXT DEFAULT 'draft',
  nguoi_thuc_hien TEXT DEFAULT '',
  mc_bo_sung      TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (workspace_id, tieu_chi)
);

-- ─── KPI (Biểu 16): cột nam_hoc + phần còn lại linh hoạt trong JSONB ─────────
CREATE TABLE IF NOT EXISTS kpi_data (
  id           SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  nam_hoc      TEXT NOT NULL,
  data         JSONB DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (workspace_id, nam_hoc)
);

-- ─── Kế hoạch TĐG + công việc ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tdg_plans (
  id           SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  ngay_bat_dau TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tdg_tasks (
  id         SERIAL PRIMARY KEY,
  plan_id    INTEGER NOT NULL REFERENCES tdg_plans(id) ON DELETE CASCADE,
  phase      INTEGER,
  week_start INTEGER,
  week_end   INTEGER,
  title      TEXT NOT NULL,
  assignee   TEXT DEFAULT '',
  status     TEXT DEFAULT 'todo',
  priority   TEXT DEFAULT 'normal',
  notes      TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

-- ─── Khảo sát (Biểu 08–11) + phản hồi ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS surveys (
  id           SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT DEFAULT '',
  token        TEXT UNIQUE NOT NULL,
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS survey_responses (
  id           SERIAL PRIMARY KEY,
  survey_id    INTEGER NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  answers      JSONB DEFAULT '{}'::jsonb
);

-- ─── Báo cáo TĐG (Biểu 05) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id             SERIAL PRIMARY KEY,
  workspace_id   INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  period         TEXT DEFAULT '',
  author         TEXT DEFAULT '',
  co_so_phap_ly   TEXT DEFAULT '',
  mo_ta_qua_trinh TEXT DEFAULT '',
  mo_ta_csdt      TEXT DEFAULT '',
  tom_tat_ket_qua TEXT DEFAULT '',
  ke_hoach_cai_tien TEXT DEFAULT '',
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- ═══ Nhánh CTĐT / CĐR (M8–M11) ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS peos (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  code TEXT NOT NULL, content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (workspace_id, code)
);
CREATE TABLE IF NOT EXISTS plos (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  code TEXT NOT NULL, content TEXT NOT NULL,
  bloom_level TEXT DEFAULT 'apply', type TEXT DEFAULT 'knowledge',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (workspace_id, code)
);
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  code TEXT NOT NULL, name TEXT NOT NULL,
  credits INTEGER DEFAULT 0, semester INTEGER DEFAULT 0, type TEXT DEFAULT 'core',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (workspace_id, code)
);
CREATE TABLE IF NOT EXISTS clos (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  code TEXT NOT NULL, content TEXT NOT NULL,
  bloom_level TEXT DEFAULT 'apply', type TEXT DEFAULT 'knowledge',
  rubric_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (workspace_id, course_id, code)
);
CREATE TABLE IF NOT EXISTS course_plo_map (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  plo_id INTEGER NOT NULL REFERENCES plos(id) ON DELETE CASCADE,
  level TEXT CHECK (level IN ('I','R','M')),
  UNIQUE (workspace_id, course_id, plo_id)
);
CREATE TABLE IF NOT EXISTS clo_plo_map (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  clo_id INTEGER NOT NULL REFERENCES clos(id) ON DELETE CASCADE,
  plo_id INTEGER NOT NULL REFERENCES plos(id) ON DELETE CASCADE,
  weight NUMERIC DEFAULT 1,
  UNIQUE (workspace_id, clo_id, plo_id)
);
CREATE TABLE IF NOT EXISTS rubrics (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL, description TEXT DEFAULT '',
  scale_type TEXT DEFAULT 'A_D', levels JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS assessment_plans (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL, semester INTEGER DEFAULT 1, school_year TEXT NOT NULL,
  threshold_pct NUMERIC DEFAULT 75, pass_score_pct NUMERIC DEFAULT 50,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS assessment_items (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES assessment_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL, type TEXT DEFAULT 'test', max_score NUMERIC DEFAULT 10,
  description TEXT DEFAULT '', clo_targets JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS plan_students (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES assessment_plans(id) ON DELETE CASCADE,
  code TEXT NOT NULL, full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (workspace_id, plan_id, code)
);
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES assessment_items(id) ON DELETE CASCADE,
  plan_student_id INTEGER NOT NULL REFERENCES plan_students(id) ON DELETE CASCADE,
  score NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (item_id, plan_student_id)
);

-- ─── Sessions (login) ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);
