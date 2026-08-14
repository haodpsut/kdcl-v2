-- ─── Sửa số hiệu thông tư của nhánh kiểm định CƠ SỞ GIÁO DỤC ────────────────
-- Phần mềm trước đây ghi bộ tiêu chuẩn 15 tiêu chuẩn / 60 tiêu chí là
-- "TT26/2026". Sai. Số hiệu đúng của văn bản đó là:
--
--   Thông tư số 20/2026/TT-BGDĐT ngày 31/3/2026 của Bộ trưởng Bộ GDĐT
--   "Quy định về kiểm định chất lượng cơ sở giáo dục đại học"
--   Hiệu lực 15/5/2026 · người ký: Q. Bộ trưởng Hoàng Minh Sơn
--   Điều 52: thay thế Thông tư 12/2017/TT-BGDĐT
--
-- Thông tư 26/2026/TT-BGDĐT ngày 09/4/2026 là "Quy định chuẩn nghề nghiệp
-- giảng viên đại học", một văn bản khác hẳn. Hai bản được quét cùng một mẻ
-- nên số hiệu bị bốc nhầm.
--
-- Nhánh CHƯƠNG TRÌNH ĐÀO TẠO giữ nguyên TT04/2025: Thông tư 20 chỉ điều chỉnh
-- kiểm định cơ sở giáo dục, không đụng tới TT04.
--
-- Chạy: docker exec -i kdcl-db psql -U kdcl -d kdcl < sql/2026-08-14-sua-so-hieu-tt20.sql
-- Idempotent: chạy lại nhiều lần không sao.

BEGIN;

UPDATE workspaces
   SET law = replace(law, 'TT26', 'TT20')
 WHERE law LIKE '%TT26%';

UPDATE workspaces
   SET description = replace(replace(description, 'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20')
 WHERE description LIKE '%TT26%' OR description LIKE '%Thông tư 26%';

UPDATE reports
   SET co_so_phap_ly     = replace(replace(co_so_phap_ly,     'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20'),
       mo_ta_qua_trinh   = replace(replace(mo_ta_qua_trinh,   'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20'),
       mo_ta_csdt        = replace(replace(mo_ta_csdt,        'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20'),
       tom_tat_ket_qua   = replace(replace(tom_tat_ket_qua,   'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20'),
       ke_hoach_cai_tien = replace(replace(ke_hoach_cai_tien, 'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20')
 WHERE co_so_phap_ly     LIKE '%26%'
    OR mo_ta_qua_trinh   LIKE '%26%'
    OR mo_ta_csdt        LIKE '%26%'
    OR tom_tat_ket_qua   LIKE '%26%'
    OR ke_hoach_cai_tien LIKE '%26%';

UPDATE evidence
   SET ten     = replace(replace(ten,     'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20'),
       mo_ta   = replace(replace(mo_ta,   'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20'),
       nguon   = replace(replace(nguon,   'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20'),
       ghi_chu = replace(replace(ghi_chu, 'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20')
 WHERE ten     LIKE '%TT26%' OR ten     LIKE '%Thông tư 26%'
    OR mo_ta   LIKE '%TT26%' OR mo_ta   LIKE '%Thông tư 26%'
    OR nguon   LIKE '%TT26%' OR nguon   LIKE '%Thông tư 26%'
    OR ghi_chu LIKE '%TT26%' OR ghi_chu LIKE '%Thông tư 26%';

UPDATE assessments
   SET hien_trang = replace(replace(hien_trang, 'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20'),
       diem_manh  = replace(replace(diem_manh,  'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20'),
       ton_tai    = replace(replace(ton_tai,    'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20'),
       ke_hoach   = replace(replace(ke_hoach,   'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20'),
       mc_bo_sung = replace(replace(mc_bo_sung, 'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20')
 WHERE hien_trang LIKE '%TT26%' OR hien_trang LIKE '%Thông tư 26%'
    OR diem_manh  LIKE '%TT26%' OR diem_manh  LIKE '%Thông tư 26%'
    OR ton_tai    LIKE '%TT26%' OR ton_tai    LIKE '%Thông tư 26%'
    OR ke_hoach   LIKE '%TT26%' OR ke_hoach   LIKE '%Thông tư 26%'
    OR mc_bo_sung LIKE '%TT26%' OR mc_bo_sung LIKE '%Thông tư 26%';

UPDATE surveys
   SET title       = replace(replace(title,       'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20'),
       description = replace(replace(description, 'Thông tư 26', 'Thông tư 20'), 'TT26', 'TT20')
 WHERE title       LIKE '%TT26%' OR title       LIKE '%Thông tư 26%'
    OR description LIKE '%TT26%' OR description LIKE '%Thông tư 26%';

COMMIT;

-- ─── Cổng kiểm: phải trả về 0 dòng ──────────────────────────────────────────
SELECT 'workspaces.law'      AS cho, count(*) AS con_sot FROM workspaces  WHERE law         LIKE '%TT26%'
UNION ALL SELECT 'workspaces.description', count(*) FROM workspaces WHERE description LIKE '%TT26%' OR description LIKE '%Thông tư 26%'
UNION ALL SELECT 'reports',    count(*) FROM reports    WHERE co_so_phap_ly LIKE '%TT26%' OR co_so_phap_ly LIKE '%Thông tư 26%'
UNION ALL SELECT 'evidence',   count(*) FROM evidence   WHERE ten LIKE '%TT26%' OR mo_ta LIKE '%TT26%' OR ghi_chu LIKE '%TT26%' OR nguon LIKE '%TT26%'
UNION ALL SELECT 'assessments',count(*) FROM assessments WHERE hien_trang LIKE '%TT26%' OR diem_manh LIKE '%TT26%' OR ton_tai LIKE '%TT26%' OR ke_hoach LIKE '%TT26%'
UNION ALL SELECT 'surveys',    count(*) FROM surveys    WHERE title LIKE '%TT26%' OR description LIKE '%TT26%';

-- Xem lại nhãn sau khi sửa
SELECT id, name, type, law FROM workspaces ORDER BY id;
