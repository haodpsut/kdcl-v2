#!/usr/bin/env bash
# ─── Sao lưu trên VPS ───────────────────────────────────────────────────────
# Khác backup.sh (dành cho máy cá nhân) ở hai điểm quan trọng:
#
#  1. Dùng pg_dump thay vì nén thẳng .docker-data/postgres. Nén một thư mục
#     PGDATA trong lúc Postgres đang ghi cho ra ảnh chụp không nhất quán, và
#     thư mục đó còn đòi đúng uid + mode 0700 nên bung sang máy khác là
#     Postgres từ chối chạy. pg_dump thì phục hồi được ở bất kỳ đâu.
#  2. Nén phần uploads BÊN TRONG một container chạy bằng root, nên không cần
#     sudo. Thư mục .docker-data thuộc root vì Docker tạo ra; đặt sudo vào
#     crontab là thêm một chỗ hỏng thầm lặng khi sudo đòi mật khẩu.
#
# Dùng:  bash backup-vps.sh
set -euo pipefail
cd "$(dirname "$0")"

TS=$(date +%Y%m%d-%H%M)
DIR=backups
mkdir -p "$DIR"

docker exec kdcl-db pg_dump -U kdcl -Fc kdcl > "$DIR/db-$TS.dump"
docker run --rm -v "$PWD/.docker-data/app:/data:ro" -v "$PWD/$DIR:/out" alpine:3 \
  tar czf "/out/uploads-$TS.tgz" -C /data uploads

# Cổng kiểm: lệnh hỏng giữa chừng vẫn để lại tệp 0 byte, và một thư mục đầy
# tệp rỗng trông y hệt một thư mục sao lưu lành lặn cho tới ngày cần phục hồi.
for f in "$DIR/db-$TS.dump" "$DIR/uploads-$TS.tgz"; do
  sz=$(stat -c%s "$f")
  if [ "$sz" -lt 1024 ]; then
    echo "LỖI: $f chỉ có $sz byte, bản sao lưu này không dùng được." >&2
    exit 1
  fi
done

echo "OK $TS · db $(stat -c%s "$DIR/db-$TS.dump") B · uploads $(stat -c%s "$DIR/uploads-$TS.tgz") B"

# Giữ 14 bản gần nhất
ls -1t "$DIR"/db-*.dump      2>/dev/null | tail -n +15 | xargs -r rm -f
ls -1t "$DIR"/uploads-*.tgz  2>/dev/null | tail -n +15 | xargs -r rm -f
