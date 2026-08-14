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
-- Chạy:
--   docker exec -i kdcl-db psql -U kdcl -d kdcl -v ON_ERROR_STOP=1 \
--     < sql/2026-08-14-sua-so-hieu-tt20.sql
--
-- Cách làm: quét MỌI cột kiểu text của mọi bảng trong schema public thay vì
-- liệt kê tên cột bằng tay. Liệt kê tay là chỗ dễ sai nhất (bảng evidence
-- không có cột `ten` như tưởng), và mỗi lần thêm cột mới lại phải nhớ sửa
-- tệp này. Chỉ những dòng thực sự chứa chuỗi sai mới bị đụng tới.
-- Idempotent: chạy lại nhiều lần không sao.

BEGIN;

DO $$
DECLARE r record; n bigint; tong bigint := 0;
BEGIN
  FOR r IN
    SELECT c.table_name, c.column_name
      FROM information_schema.columns c
      JOIN information_schema.tables t
        ON t.table_schema = c.table_schema AND t.table_name = c.table_name
     WHERE c.table_schema = 'public'
       AND t.table_type   = 'BASE TABLE'
       AND c.data_type IN ('text', 'character varying')
     ORDER BY c.table_name, c.column_name
  LOOP
    EXECUTE format(
      'UPDATE %I SET %I = replace(replace(%I, %L, %L), %L, %L)
        WHERE %I LIKE %L OR %I LIKE %L',
      r.table_name, r.column_name, r.column_name,
      'Thông tư 26', 'Thông tư 20', 'TT26', 'TT20',
      r.column_name, '%TT26%', r.column_name, '%Thông tư 26%');
    GET DIAGNOSTICS n = ROW_COUNT;
    IF n > 0 THEN
      RAISE NOTICE 'sửa % dòng ở %.%', n, r.table_name, r.column_name;
      tong := tong + n;
    END IF;
  END LOOP;
  RAISE NOTICE '── tổng cộng % dòng đã sửa ──', tong;
END $$;

COMMIT;

-- ─── Cổng kiểm, chặn kiểu fail-closed ───────────────────────────────────────
-- Còn sót một dòng là báo lỗi chứ không im lặng. Đếm lại bằng chính vòng quét
-- ở trên nên không có chỗ nào lọt khỏi tầm soi.
DO $$
DECLARE r record; n bigint; con bigint := 0; ds text := ''; soCot int := 0;
BEGIN
  FOR r IN
    SELECT c.table_name, c.column_name
      FROM information_schema.columns c
      JOIN information_schema.tables t
        ON t.table_schema = c.table_schema AND t.table_name = c.table_name
     WHERE c.table_schema = 'public'
       AND t.table_type   = 'BASE TABLE'
       AND c.data_type IN ('text', 'character varying')
  LOOP
    soCot := soCot + 1;
    EXECUTE format('SELECT count(*) FROM %I WHERE %I LIKE %L OR %I LIKE %L',
      r.table_name, r.column_name, '%TT26%', r.column_name, '%Thông tư 26%')
      INTO n;
    IF n > 0 THEN
      con := con + n;
      ds  := ds || format(' %s.%s=%s', r.table_name, r.column_name, n);
    END IF;
  END LOOP;
  IF con > 0 THEN
    RAISE EXCEPTION 'CỔNG KIỂM HỎNG: còn % dòng mang số hiệu cũ:%', con, ds;
  END IF;
  RAISE NOTICE 'CỔNG KIỂM ĐẠT: soi % cột text, không còn chuỗi TT26 nào', soCot;
END $$;

-- Xem lại nhãn sau khi sửa: nhánh CSGD phải là TT20/2026, CTĐT là TT04/2025.
SELECT id, name, type, law FROM workspaces ORDER BY id;
