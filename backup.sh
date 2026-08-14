#!/usr/bin/env bash
# Sao lưu toàn bộ dữ liệu KĐCLGD v2 = Postgres + file minh chứng (thư mục .docker-data).
# Dùng: bash backup.sh    → tạo kdcl-backup-YYYYMMDD-HHMM.tgz cạnh script.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d ".docker-data" ]; then
  echo "Không thấy ./.docker-data — chạy 'docker compose up -d' trước, hoặc chưa có dữ liệu."
  exit 1
fi

TS=$(date +%Y%m%d-%H%M)
OUT="kdcl-backup-${TS}.tgz"

# Nén cả CSDL (postgres) + file (app/uploads). Loại file tạm nếu có.
tar czf "$OUT" .docker-data

SIZE=$(du -h "$OUT" | cut -f1)
echo "✅ Đã sao lưu: $OUT ($SIZE)"
echo "   Gồm: CSDL Postgres + toàn bộ file minh chứng."
echo "   Phục hồi:  docker compose down && tar xzf $OUT && docker compose up -d"

# Tùy chọn: chỉ giữ 14 bản backup gần nhất
ls -1t kdcl-backup-*.tgz 2>/dev/null | tail -n +15 | xargs -r rm -f
