# KĐCLGD v2 — Postgres + login + nộp/duyệt theo đơn vị + Docker

App v2: port từ v1 (`../app`, JSON-file) sang **Express + Postgres**, thêm **login theo vai** +
**quy trình nộp–duyệt minh chứng theo đơn vị** + **Docker** cho VPS. **ĐÃ CHẠY ĐƯỢC.**

## Cách chạy

### Docker (khuyến nghị — giống VPS)
```bash
cd kiem-dinh-chat-luong/kdcl-v2
docker compose up -d --build     # Postgres (5435) + app (8091)
# → http://localhost:8091   (đăng nhập: admin / admin123)
docker compose logs -f app
docker compose down              # dừng, dữ liệu vẫn còn trong ./.docker-data
```

### Local dev (node + Postgres của compose)
```bash
docker compose up -d db
npm install
DATABASE_URL="postgres://kdcl:kdcl@localhost:5435/kdcl" DATA_DIR="." node server.js
# → http://localhost:3001
```

## Quyết định đã chốt
- **Login theo vai**: admin (P.ĐBCL) / unit (mỗi phòng 1 tk) / viewer (lãnh đạo+đoàn).
- **Lưu file lai**: evidence `source_type` = `file` (upload) hoặc `link` (Drive/SharePoint).
- **Hạ tầng**: VPS Ubuntu + tên miền, Docker. Postgres cổng **5435**, app **127.0.0.1:8091**. Volume `./.docker-data` bền. Backup = ZIP thư mục đó.
- Reviewer = P.ĐBCL tập trung. Đơn vị GLOBAL, phân công theo workspace.

## Kiến trúc file
- `db.js` — pg Pool, q/one/tx/waitForDb/initSchema. Type parser numeric→số, timestamptz→chuỗi vi-VN.
- `auth.js` — scrypt hash + session cookie (bảng sessions), requireAuth/requireRole.
- `schema.sql` — mọi bảng (idempotent). Đơn vị GLOBAL, users, unit_criteria/workspace, evidence +status/unit/source_type/link/reviewed.
- `server.js` — core API + auth + evidence(/review) + units + unit_criteria + users + submission dashboard/coverage.
- `routes-ctdt.js` — M8–M11 (PEO/PLO/Course/CLO/maps/rubric/plans/items/students/scores + engine M10/M11 giữ nguyên toán tử v1).
- `survey-templates.js` — Biểu 08–11.
- `seed.js` — workspace "CSGD 2026" + 8 đơn vị mẫu + admin/admin123 (đổi mật khẩu ngay).
- `public/login.html` — đăng nhập (theme maroon/gold).
- `public/donvi.html` — 4 màn CHẠY THẬT: Cổng đơn vị / Bàn duyệt / Đối soát tiêu chí / Dashboard.
- `public/workspace-switcher.js` — thêm gate đăng nhập + link "Nộp & Duyệt MC" + nút đăng xuất.
- `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.env.example`.

## Đã smoke-test PASS
- login admin/unit, /api/me, guard 401 (guest ghi) + 403 (unit tạo user / unit duyệt).
- upload MC link + file; admin nộp → tự xác nhận; unit nộp → cho_duyet.
- bàn duyệt confirm; trả lại thiếu note → 400; trả lại kèm note → tra_lai + review_note về đúng đơn vị.
- submission dashboard/coverage đúng (TC 6.3 = "du" sau khi xác nhận).
- M8 tạo PEO/PLO, M11 plo-rollup, report/data không lỗi.
- Container 8091 phục vụ login.html + /api/standards OK.

## VIỆC CÒN LẠI (tùy chọn, chưa làm)
1. **Verify UI tận tay** trên trình duyệt (login → tạo đơn vị/phân công → nộp → duyệt → dashboard). Backend đã test qua curl, UI chưa click thủ công.
2. **Trang cũ (index/module2–7)** vẫn theme tối cũ; login.html + donvi.html đã theme trường. Đổi đồng bộ maroon/gold = việc tách riêng, chưa làm.
3. **Form upload ở index.html** chưa có tùy chọn source_type/link (donvi.html thì có đủ). Nộp qua index vẫn chạy dạng file.
4. **Reverse proxy VPS**: chưa chốt nginx/Caddy/Traefik → chưa viết vhost + HTTPS. Compose hiện map 127.0.0.1:8091, chỉ cần proxy trỏ vào.
5. **Backup tự động** (cron ZIP ./.docker-data) + nút "Xuất hồ sơ" trong app — chưa làm.
6. **Đổi mật khẩu admin** + tạo tài khoản các phòng ban thật.
7. `git` init/commit cho kdcl-v2 (chưa commit).

## Lưu ý
- Bug v1 đã sửa: `thu_tu` = MAX+1 (không trùng mã sau xoá).
- Container app rebuild khi đổi code: `docker compose up -d --build app`. Frontend (public/*) đổi thì chỉ cần refresh nếu chạy local; với container cần rebuild (COPY . .) — hoặc mount public/ làm volume khi dev.
