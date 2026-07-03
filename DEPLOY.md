# Triển khai KĐCLGD v2 lên VPS (Ubuntu + Docker + tên miền)

Tài liệu này mô tả cách đưa hệ thống lên VPS riêng và cơ chế sao lưu.

## 1. Kiến trúc & nơi lưu dữ liệu

```
Internet ──HTTPS──▶ Reverse proxy (Caddy/nginx) ──▶ container kdcl-app (Node, cổng 3001)
                          │ tự cấp Let's Encrypt         │
                    kdcl.tenmien.cua-thay          container kdcl-db (Postgres 16)
                                                          │
                                     ┌────────────────────┴────────────────────┐
                              ./.docker-data/postgres            ./.docker-data/app/uploads
                              (metadata: minh chứng, tài khoản,   (file minh chứng thật:
                               đánh giá, KPI, CĐR, khảo sát...)     .pdf/.docx/.txt...)
```

- **Metadata → Postgres** (bảng `evidence`, `assessments`, `kpi_data`, `users`, `plos/clos/scores`...).
- **File vật lý → `./.docker-data/app/uploads`** (DB chỉ lưu tên/đường dẫn file).
- **Minh chứng dạng link** → chỉ lưu URL (file nằm trên Google Drive/SharePoint).
- **Toàn bộ dữ liệu = thư mục `./.docker-data`** → sao lưu = nén thư mục này.

## 2. Chuẩn bị VPS (một lần)

```bash
# Cài Docker + Compose plugin trên Ubuntu
sudo apt update && sudo apt install -y ca-certificates curl
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER    # đăng nhập lại để dùng docker không cần sudo
```

## 3. Đưa mã nguồn + dữ liệu lên

```bash
# Cách A — chỉ mã nguồn (dữ liệu tạo mới trên VPS):
scp -r kdcl-v2 user@vps:/home/user/kdcl-v2   # (bỏ .docker-data, node_modules)

# Cách B — kèm dữ liệu hiện có (mang cả minh chứng đã nhập):
#   1) Trên máy local: nén thư mục dữ liệu
bash backup.sh                                 # tạo kdcl-backup-YYYYMMDD.tgz
#   2) Copy mã nguồn + file backup lên VPS, rồi giải nén .docker-data cạnh docker-compose.yml
scp kdcl-backup-*.tgz user@vps:/home/user/kdcl-v2/
ssh user@vps 'cd ~/kdcl-v2 && tar xzf kdcl-backup-*.tgz'
```

## 4. Cấu hình & chạy

Sửa `docker-compose.yml` nếu cần (mật khẩu Postgres, cổng). Đổi mật khẩu admin lần đầu:
```bash
# đặt tài khoản admin seed lần đầu qua biến môi trường (chỉ dùng khi bảng users rỗng)
ADMIN_USER=admin ADMIN_PASS='<mat-khau-manh>' docker compose up -d --build
```
- App chạy ở `127.0.0.1:8091` (chỉ localhost — an toàn, reverse proxy trỏ vào).
- Postgres ở `127.0.0.1:5435`.

## 5. Reverse proxy + HTTPS (chọn 1)

### Caddy (khuyến nghị — tự động HTTPS)
Tạo `/etc/caddy/Caddyfile`:
```
kdcl.tenmien.cua-thay {
    reverse_proxy 127.0.0.1:8091
}
```
```bash
sudo apt install -y caddy && sudo systemctl reload caddy
```

### nginx (nếu VPS đã có nginx)
```nginx
server {
    server_name kdcl.tenmien.cua-thay;
    location / { proxy_pass http://127.0.0.1:8091; proxy_set_header Host $host; }
}
```
```bash
sudo certbot --nginx -d kdcl.tenmien.cua-thay   # cấp HTTPS
```

> Trỏ bản ghi DNS **A** của `kdcl.tenmien.cua-thay` về IP VPS trước khi cấp chứng chỉ.

## 6. Sao lưu & phục hồi

```bash
# Sao lưu (nén cả Postgres + uploads):
bash backup.sh                 # → kdcl-backup-YYYYMMDD-HHMM.tgz

# Nên đặt cron chạy hằng ngày:
#   crontab -e
#   0 2 * * * cd /home/user/kdcl-v2 && bash backup.sh >> backup.log 2>&1

# Phục hồi trên máy/VPS mới:
docker compose down
tar xzf kdcl-backup-XXXX.tgz    # giải nén ra ./.docker-data
docker compose up -d
```

Muốn tách riêng CSDL (an toàn hơn khi Postgres đang chạy):
```bash
docker exec kdcl-db pg_dump -U kdcl kdcl > db-YYYYMMDD.sql   # dump CSDL
tar czf uploads-YYYYMMDD.tgz .docker-data/app/uploads        # kèm file
```

## 7. Lưu ý bảo mật

- Đổi mật khẩu `admin` ngay sau lần đăng nhập đầu.
- Đổi mật khẩu Postgres trong `docker-compose.yml` (mặc định `kdcl/kdcl`) khi chạy thật.
- Cổng Postgres (5435) và app (8091) đã bind `127.0.0.1` → không lộ ra Internet; chỉ reverse proxy (443) mở ra ngoài.
- File minh chứng là văn bản nhạy cảm → giữ VPS của trường, sao lưu định kỳ, không public thư mục uploads.
