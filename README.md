# KĐCLGD v2 — Hệ thống quản lý minh chứng kiểm định chất lượng

Phần mềm quản lý **kiểm định chất lượng giáo dục (KĐCLGD)** cho Trường Đại học Kiến trúc Đà Nẵng.
Hỗ trợ song song **kiểm định cơ sở giáo dục (CSGD — TT26)** và **chương trình đào tạo (CTĐT — TT04)**,
với quy trình **nộp – duyệt minh chứng theo đơn vị** để chuẩn bị đón đoàn đánh giá.

> Bản v2: port từ bản v1 (lưu file JSON) sang **Express + PostgreSQL**, thêm **đăng nhập theo vai**,
> **quy trình nộp/duyệt theo đơn vị** và đóng gói **Docker** để triển khai lên VPS.

## Tính năng

**Nhánh CSGD (kiểm định cơ sở — 15 tiêu chuẩn / 60 tiêu chí):**
- 📂 Quản lý **minh chứng** (mã hoá `Hn.ab.cd.ef`, tải file hoặc dán link Drive/SharePoint)
- 📋 **Đánh giá tiêu chí** (Biểu 04: hiện trạng / điểm mạnh / tồn tại / kế hoạch, Đạt–Không đạt)
- 📊 **KPI** (Biểu 16, theo năm học)
- 📅 **Tiến độ tự đánh giá** (kế hoạch 24 tuần)
- 📝 **Khảo sát** (Biểu 08–11, thang Likert, link công khai theo token)
- 📄 **Báo cáo tự đánh giá** (Biểu 05)
- 🏛 **Dashboard** tổng hợp

**Nhánh CTĐT (chuẩn đầu ra / AUN-QA):**
- Khung CĐR **PEO → PLO → CLO**, ma trận ánh xạ (I/R/M, trọng số)
- Thư viện **Rubric**, kế hoạch **đo lường CLO**, tổng hợp **PLO** (4 mức AUN-QA)

**Quy trình nộp – duyệt theo đơn vị (mới ở v2):**
- 🗂 **Cổng đơn vị**: phòng/khoa tải minh chứng cho các tiêu chí được phân công
- ✅ **Bàn duyệt (P.ĐBCL)**: xác nhận hoặc trả lại kèm lý do
- 🔍 **Đối soát theo tiêu chí** cho đoàn kiểm tra
- 📊 **Dashboard nộp/duyệt** (tiến độ theo đơn vị + độ phủ theo tiêu chí)

**Đăng nhập theo vai:** `admin` (P.ĐBCL) · `unit` (đơn vị) · `viewer` (lãnh đạo / đoàn).

## Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Backend | Node.js + Express |
| CSDL | PostgreSQL 16 |
| Xác thực | scrypt (băm mật khẩu) + session cookie (bảng `sessions`) |
| Frontend | HTML/CSS/JS thuần (không framework), Chart.js |
| Triển khai | Docker + Docker Compose |

## Khởi chạy nhanh (Docker)

```bash
docker compose up -d --build
# → http://localhost:8091   (Postgres ở 127.0.0.1:5435)
```

Đăng nhập lần đầu: **admin / admin123** — *đổi mật khẩu ngay sau khi đăng nhập.*
Có thể đặt tài khoản admin khi seed lần đầu:
```bash
ADMIN_USER=admin ADMIN_PASS='<mat-khau-manh>' docker compose up -d --build
```

### Chạy local (không Docker)
```bash
docker compose up -d db          # chỉ Postgres
npm install
DATABASE_URL="postgres://kdcl:kdcl@localhost:5435/kdcl" DATA_DIR="." node server.js
```

## Dữ liệu mẫu

Tạo bộ dữ liệu mẫu đầy đủ (2 workspace CSGD + CTĐT, phủ mọi module) để xem tổng quan:
```bash
DATA_DIR="./.docker-data/app" node sample-data.js
```
Script idempotent (xoá mẫu cũ, nạp lại). File minh chứng mẫu được ghi vào `./.docker-data/app/uploads`.

## Nơi lưu dữ liệu

- **Metadata** (minh chứng, tài khoản, đánh giá, KPI, CĐR…) → PostgreSQL.
- **File vật lý** → `./.docker-data/app/uploads` (CSDL chỉ lưu tên/đường dẫn).
- Toàn bộ dữ liệu gói trong thư mục **`.docker-data`** → sao lưu = nén thư mục này.

## Triển khai VPS & sao lưu

- Hướng dẫn đầy đủ (Ubuntu + Docker + Caddy/nginx + HTTPS): xem [`DEPLOY.md`](DEPLOY.md).
- Sao lưu một lệnh: `bash backup.sh` (nén `.docker-data`, giữ 14 bản gần nhất).

## Cấu trúc thư mục

```
kdcl-v2/
├── server.js            # Express: định tuyến API + phục vụ frontend
├── db.js                # kết nối PostgreSQL (pool)
├── auth.js              # đăng nhập theo vai + session
├── schema.sql           # DDL (idempotent)
├── seed.js              # seed workspace + admin + đơn vị mẫu
├── sample-data.js       # dữ liệu mẫu đầy đủ (tuỳ chọn)
├── routes-ctdt.js       # nhánh CTĐT (M8–M11) + engine đo CLO→PLO
├── survey-templates.js  # mẫu khảo sát Biểu 08–11
├── standards-detail.js  # 60 tiêu chí + minh chứng gợi ý
├── public/              # frontend (các trang HTML + theme + logo)
├── Dockerfile · docker-compose.yml · DEPLOY.md · backup.sh
```

## Ghi chú bảo mật

- Đổi mật khẩu `admin` và mật khẩu Postgres (mặc định `kdcl/kdcl` trong `docker-compose.yml`) khi chạy thật.
- Cổng Postgres (5435) và app (8091) bind `127.0.0.1` — không lộ ra Internet; chỉ reverse proxy (443) mở ra ngoài.
- File minh chứng là văn bản nhạy cảm: giữ trên VPS của trường, sao lưu định kỳ, không public thư mục `uploads`.

---

*Trường Đại học Kiến trúc Đà Nẵng · Phòng Đảm bảo chất lượng.*
