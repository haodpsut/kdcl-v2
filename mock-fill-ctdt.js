// ─── Bù dữ liệu cho hai đợt CTĐT còn mỏng + nối rubric vào CLO ──────────────
// Chạy:  docker exec kdcl-app node mock-fill-ctdt.js
//
// Chỉ THÊM phần còn thiếu, không xoá gì. Chạy lại nhiều lần cho cùng kết quả
// vì mỗi thứ đều kiểm tra tồn tại trước khi thêm. Khác mock-logistics.js ở chỗ
// script kia dựng lại nguyên một workspace, còn script này vá vào chỗ hổng của
// workspace đang có dữ liệu người dùng.
//
// Hai chỗ hổng:
//  1. CNTT 2026 và KTr 2026 mới có 3 học phần, 9 CLO, 2 kế hoạch đo, trong khi
//     Logistics đã có 6, 18, 3. Chuẩn đầu ra PLO4 và PLO6 của hai đợt này chưa
//     học phần nào nhận đo, nên tuyên bố ra rồi mà không nơi nào kiểm chứng.
//  2. Cả ba đợt đều có rubric nhưng chưa CLO nào dùng, nên Thư viện rubric
//     luôn hiện 0 CLO dùng và rubric nằm ngoài chuỗi đo.
const { q, one, pool } = require('./db');

const insId = async (sql, p) => (await one(sql, p)).id;

// Học phần bổ sung cho từng đợt. Nội dung theo đúng ngành, không dùng chung.
const THEM = {
  'CNTT 2026': {
    sv: ['Ngô Bảo Long', 'Trần Khánh Chi', 'Lê Hữu Phước', 'Phạm Thuỳ Dương',
         'Vũ Anh Khoa', 'Đỗ Minh Thư', 'Bùi Gia Hân', 'Hoàng Nhật Minh'],
    courses: [
      ['IT202', 'Mạng máy tính và truyền thông', 3, 3, [
        ['CLO1', 'Giải thích mô hình phân tầng và giao thức mạng cơ bản', 'understand', 'knowledge'],
        ['CLO2', 'Cấu hình và kiểm thử một mạng cục bộ', 'apply', 'skill'],
        ['CLO3', 'Sử dụng công cụ phân tích gói tin để chẩn đoán sự cố', 'apply', 'skill'],
      ]],
      ['IT401', 'Đồ án chuyên ngành công nghệ thông tin', 4, 7, [
        ['CLO1', 'Xây dựng phần mềm hoàn chỉnh cho một bài toán thực tế', 'create', 'skill'],
        ['CLO2', 'Bảo vệ giải pháp trước hội đồng bằng lập luận kỹ thuật', 'evaluate', 'skill'],
        ['CLO3', 'Tuân thủ đạo đức nghề nghiệp và tự học công nghệ mới', 'understand', 'attitude'],
      ]],
    ],
    // Học phần nhận đo cho hai PLO đang bỏ trống
    coursePlo: [['IT202', 'PLO4', 'M'], ['IT202', 'PLO1', 'R'],
                ['IT401', 'PLO2', 'M'], ['IT401', 'PLO5', 'M'], ['IT401', 'PLO6', 'M']],
    cloPlo: [['IT202.CLO1', 'PLO1', 1], ['IT202.CLO2', 'PLO4', 1], ['IT202.CLO3', 'PLO4', 1],
             ['IT401.CLO1', 'PLO2', 1], ['IT401.CLO2', 'PLO5', 1], ['IT401.CLO3', 'PLO6', 1]],
    // Cố ý để IT202 dưới ngưỡng 75%, giữ nguyên tắc bảng không toàn xanh
    plans: [
      ['IT202', 'IT202 · HK1 2025-2026', 1, ['IT202.CLO1', 'IT202.CLO2', 'IT202.CLO3'],
        [[5, 4.5], [6, 5], [4.5, 5.5], [7, 6], [5, 4], [6.5, 6], [4, 5], [5.5, 5]]],
      ['IT401', 'IT401 · Đồ án khóa 2026', 2, ['IT401.CLO1', 'IT401.CLO2', 'IT401.CLO3'],
        [[8, 8.5], [7.5, 8], [9, 8.5], [7, 7.5], [8.5, 8], [6.5, 7], [9, 9], [8, 7.5]]],
    ],
    phieu: [
      ['6.5', 'DAT', 'approved', 'Có cố vấn học tập và câu lạc bộ chuyên môn cho sinh viên CNTT',
        'Sinh viên tham gia câu lạc bộ lập trình đông', 'Chưa tổng hợp phản hồi định kỳ', 'Lập kênh ghi nhận phản hồi hằng kỳ'],
      ['7.4', 'CHUA', 'draft', 'Đang tập hợp danh mục nghiên cứu khoa học của sinh viên', '', '', ''],
    ],
  },
  'KTr 2026': {
    sv: ['Nguyễn Hoàng Duy', 'Lê Bảo Trâm', 'Trần Quang Huy', 'Phan Mỹ Linh',
         'Đặng Trọng Nghĩa', 'Võ Hà My', 'Huỳnh Tuấn Kiệt', 'Nguyễn Diệu Anh'],
    courses: [
      ['AR202', 'Kết cấu và vật liệu trong kiến trúc', 3, 3, [
        ['CLO1', 'Giải thích ứng xử của các hệ kết cấu thông dụng', 'understand', 'knowledge'],
        ['CLO2', 'Lựa chọn vật liệu phù hợp với ý đồ kiến trúc và điều kiện khí hậu', 'apply', 'skill'],
        ['CLO3', 'Phối hợp giải pháp kết cấu với giải pháp không gian', 'analyze', 'skill'],
      ]],
      ['AR401', 'Đồ án kiến trúc tổng hợp', 4, 7, [
        ['CLO1', 'Thiết kế công trình đáp ứng công năng, thẩm mỹ và kỹ thuật', 'create', 'skill'],
        ['CLO2', 'Thuyết trình và bảo vệ phương án trước hội đồng', 'evaluate', 'skill'],
        ['CLO3', 'Thể hiện trách nhiệm nghề nghiệp với cộng đồng và môi trường', 'understand', 'attitude'],
      ]],
    ],
    coursePlo: [['AR202', 'PLO4', 'M'], ['AR202', 'PLO1', 'R'],
                ['AR401', 'PLO2', 'M'], ['AR401', 'PLO5', 'M'], ['AR401', 'PLO6', 'M']],
    cloPlo: [['AR202.CLO1', 'PLO1', 1], ['AR202.CLO2', 'PLO4', 1], ['AR202.CLO3', 'PLO4', 1],
             ['AR401.CLO1', 'PLO2', 1], ['AR401.CLO2', 'PLO5', 1], ['AR401.CLO3', 'PLO6', 1]],
    plans: [
      ['AR202', 'AR202 · HK1 2025-2026', 1, ['AR202.CLO1', 'AR202.CLO2', 'AR202.CLO3'],
        [[6, 6.5], [7, 6], [5, 5.5], [8, 7], [4.5, 5], [6, 6], [7.5, 7], [5, 6]]],
      ['AR401', 'AR401 · Đồ án khóa 2026', 2, ['AR401.CLO1', 'AR401.CLO2', 'AR401.CLO3'],
        [[8.5, 8], [8, 8.5], [7.5, 8], [9, 8], [7, 7.5], [8, 8], [6.5, 7], [9, 8.5]]],
    ],
    phieu: [
      ['6.5', 'DAT', 'approved', 'Có xưởng thiết kế và cố vấn đồ án cho từng nhóm sinh viên',
        'Tỷ lệ sinh viên bảo vệ đồ án đúng hạn cao', 'Diện tích xưởng chưa đủ cho các lớp đông', 'Bố trí thêm phòng xưởng vào năm học tới'],
      ['4.3', 'CHUA', 'draft', 'Đang rà soát học liệu và thư viện mẫu vật ngành kiến trúc', '', '', ''],
    ],
  },
};

async function main() {
  const tomTat = [];

  // ── 1. Nối rubric vào CLO cho MỌI đợt CTĐT ────────────────────────────────
  // Quy tắc: CLO thuộc nhóm kỹ năng và ở bậc vận dụng trở lên thì chấm bằng
  // rubric; CLO nhóm kiến thức bậc nhớ hoặc hiểu thì chấm bằng bài kiểm tra,
  // không gán rubric. Gán tràn lan sẽ làm thư viện rubric trông đầy mà sai.
  for (const ws of await q("SELECT id, name FROM workspaces WHERE type='CTDT' ORDER BY id")) {
    const rb = await one('SELECT id FROM rubrics WHERE workspace_id=$1 ORDER BY id LIMIT 1', [ws.id]);
    if (!rb) { tomTat.push([ws.name, 'không có rubric nào, bỏ qua']); continue; }
    const r = await q(
      `UPDATE clos SET rubric_id=$2
        WHERE workspace_id=$1 AND rubric_id IS NULL
          AND type='skill' AND bloom_level IN ('apply','analyze','evaluate','create')
        RETURNING id`, [ws.id, rb.id]);
    tomTat.push([ws.name, `gán rubric cho ${r.length} CLO`]);
  }

  // ── 2. Bù học phần, ma trận, kế hoạch đo, phiếu đánh giá ──────────────────
  for (const [tenWs, cfg] of Object.entries(THEM)) {
    const ws = await one('SELECT id FROM workspaces WHERE name=$1', [tenWs]);
    if (!ws) { tomTat.push([tenWs, 'KHÔNG TÌM THẤY workspace, bỏ qua']); continue; }
    const W = ws.id;
    const admin = (await one("SELECT id FROM users WHERE role='admin' ORDER BY id LIMIT 1")).id;

    const P = {}; for (const x of await q('SELECT id, code FROM plos WHERE workspace_id=$1', [W])) P[x.code] = x.id;
    const C = {}; for (const x of await q('SELECT id, code FROM courses WHERE workspace_id=$1', [W])) C[x.code] = x.id;
    const CL = {};
    for (const x of await q(
      `SELECT cl.id, cl.code, c.code AS ccode FROM clos cl JOIN courses c ON c.id=cl.course_id
        WHERE cl.workspace_id=$1`, [W])) CL[x.ccode + '.' + x.code] = x.id;

    const rb = await one('SELECT id FROM rubrics WHERE workspace_id=$1 ORDER BY id LIMIT 1', [W]);
    let themHp = 0, themClo = 0;
    for (const [code, ten, tc, ky, clos] of cfg.courses) {
      if (C[code]) continue;                       // đã có thì thôi
      C[code] = await insId(
        `INSERT INTO courses(workspace_id,code,name,credits,semester,type)
         VALUES ($1,$2,$3,$4,$5,'core') RETURNING id`, [W, code, ten, tc, ky]);
      themHp++;
      for (const [cc, nd, bloom, loai] of clos) {
        const dungRubric = loai === 'skill' && ['apply', 'analyze', 'evaluate', 'create'].includes(bloom);
        CL[code + '.' + cc] = await insId(
          `INSERT INTO clos(workspace_id,course_id,code,content,bloom_level,type,rubric_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
          [W, C[code], cc, nd, bloom, loai, dungRubric && rb ? rb.id : null]);
        themClo++;
      }
    }

    let themMap = 0;
    for (const [c, p, lv] of cfg.coursePlo) {
      if (!C[c] || !P[p]) continue;
      const co = await one('SELECT id FROM course_plo_map WHERE workspace_id=$1 AND course_id=$2 AND plo_id=$3', [W, C[c], P[p]]);
      if (co) continue;
      await q('INSERT INTO course_plo_map(workspace_id,course_id,plo_id,level) VALUES ($1,$2,$3,$4)', [W, C[c], P[p], lv]);
      themMap++;
    }
    for (const [cl, p, w] of cfg.cloPlo) {
      if (!CL[cl] || !P[p]) continue;
      const co = await one('SELECT id FROM clo_plo_map WHERE workspace_id=$1 AND clo_id=$2 AND plo_id=$3', [W, CL[cl], P[p]]);
      if (co) continue;
      await q('INSERT INTO clo_plo_map(workspace_id,clo_id,plo_id,weight) VALUES ($1,$2,$3,$4)', [W, CL[cl], P[p], w]);
      themMap++;
    }

    let themPlan = 0;
    for (const [courseCode, ten, ky, targets, diem] of cfg.plans) {
      if (!C[courseCode]) continue;
      const co = await one('SELECT id FROM assessment_plans WHERE workspace_id=$1 AND name=$2', [W, ten]);
      if (co) continue;
      const plan = await insId(
        `INSERT INTO assessment_plans(workspace_id,course_id,name,semester,school_year,threshold_pct,pass_score_pct,status)
         VALUES ($1,$2,$3,$4,'2025-2026',75,50,'active') RETURNING id`, [W, C[courseCode], ten, ky]);
      const it1 = await insId(
        `INSERT INTO assessment_items(workspace_id,plan_id,name,type,max_score,clo_targets)
         VALUES ($1,$2,'Bài tập lớn giữa kỳ','project',10,$3) RETURNING id`,
        [W, plan, JSON.stringify([{ clo_id: CL[targets[0]], weight: 60 }, { clo_id: CL[targets[1]], weight: 40 }])]);
      const it2 = await insId(
        `INSERT INTO assessment_items(workspace_id,plan_id,name,type,max_score,clo_targets)
         VALUES ($1,$2,'Thi cuối kỳ','test',10,$3) RETURNING id`,
        [W, plan, JSON.stringify([{ clo_id: CL[targets[1]], weight: 50 }, { clo_id: CL[targets[2]], weight: 50 }])]);
      for (let n = 0; n < diem.length; n++) {
        const sid = await insId(
          'INSERT INTO plan_students(workspace_id,plan_id,code,full_name) VALUES ($1,$2,$3,$4) RETURNING id',
          [W, plan, courseCode + String(n + 1).padStart(3, '0'), cfg.sv[n % cfg.sv.length]]);
        await q('INSERT INTO scores(workspace_id,item_id,plan_student_id,score) VALUES ($1,$2,$3,$4)', [W, it1, sid, diem[n][0]]);
        await q('INSERT INTO scores(workspace_id,item_id,plan_student_id,score) VALUES ($1,$2,$3,$4)', [W, it2, sid, diem[n][1]]);
      }
      themPlan++;
    }

    let themPhieu = 0;
    for (const [tc, kq, tt, ht, dm, tn, kh] of cfg.phieu) {
      const co = await one('SELECT id FROM assessments WHERE workspace_id=$1 AND tieu_chi=$2', [W, tc]);
      if (co) continue;
      await q(
        `INSERT INTO assessments(workspace_id,tieu_chuan,tieu_chi,hien_trang,diem_manh,ton_tai,ke_hoach,ket_qua,trang_thai,nguoi_thuc_hien)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [W, parseInt(tc.split('.')[0]), tc, ht, dm, tn, kh, kq, tt, 'Đơn vị chủ quản CTĐT']);
      themPhieu++;
    }
    tomTat.push([tenWs, `+${themHp} học phần, +${themClo} CLO, +${themMap} ô ma trận, +${themPlan} kế hoạch đo, +${themPhieu} phiếu đánh giá`]);
  }

  // ── Đối chiếu sau khi bù ──────────────────────────────────────────────────
  console.log('\nĐÃ BÙ:');
  for (const [a, b] of tomTat) console.log(`   ${String(a).padEnd(18)} ${b}`);
  console.log('\nHIỆN TRẠNG CÁC ĐỢT CTĐT:');
  const rows = await q(`
    SELECT w.name,
      (SELECT count(*)::int FROM courses c WHERE c.workspace_id=w.id) hp,
      (SELECT count(*)::int FROM clos cl WHERE cl.workspace_id=w.id) clo,
      (SELECT count(*)::int FROM clos cl WHERE cl.workspace_id=w.id AND cl.rubric_id IS NOT NULL) clo_rubric,
      (SELECT count(*)::int FROM assessment_plans a WHERE a.workspace_id=w.id) plan,
      (SELECT count(*)::int FROM scores s WHERE s.workspace_id=w.id) diem,
      (SELECT count(*)::int FROM assessments a WHERE a.workspace_id=w.id) phieu
    FROM workspaces w WHERE w.type='CTDT' ORDER BY w.id`);
  for (const r of rows)
    console.log(`   ${r.name.padEnd(16)} ${r.hp} học phần · ${r.clo} CLO (${r.clo_rubric} dùng rubric) · ${r.plan} kế hoạch đo · ${r.diem} đầu điểm · ${r.phieu} phiếu`);
}

main().then(() => pool.end()).catch((e) => { console.error(e); pool.end(); process.exit(1); });
