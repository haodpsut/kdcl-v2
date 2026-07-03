# ─── KĐCLGD v2 — image ứng dụng ─────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Cài dependency trước (tận dụng cache layer)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Mã nguồn
COPY . .

# Dữ liệu bền (db.json không dùng nữa; uploads ghi vào /data qua DATA_DIR)
ENV DATA_DIR=/data
ENV PORT=3001
EXPOSE 3001

CMD ["node", "server.js"]
