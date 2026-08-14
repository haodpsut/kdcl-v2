// Sinh standards-detail-tt04.js từ phuluc2.json (Phụ lục II) + standards-tt04.js (Chương II).
// Chạy trong thư mục kdcl-v2.
const fs = require('fs');
const { STANDARDS_TT04 } = require('./standards-tt04.js');
const PL2 = JSON.parse(fs.readFileSync('./tt04-phuluc2.json', 'utf8'));

// ─── Phân loại minh chứng: luật khớp từ khoá, xét từ cụ thể tới chung ────────
// type phải nằm trong EVIDENCE_TYPES của standards-detail.js, nếu không giao
// diện sẽ không có nhãn và màu để hiển thị.
const LUAT = [
  [/văn bản tuyên bố|tuyên bố (mục tiêu|sứ mạng|tầm nhìn)/i, 'official_statement', 'Văn bản chính sách'],
  [/sơ đồ|bản vẽ|bản thiết kế/i, 'visual', 'Sơ đồ - bản vẽ'],
  [/tài liệu tập huấn|bồi dưỡng|hội thảo|hội nghị|toạ đàm|tọa đàm/i, 'training', 'Tập huấn - hội thảo'],
  [/quyết định|nghị quyết|phê duyệt/i, 'decision', 'Văn bản chính sách'],
  [/quy chế|quy định|nội quy/i, 'regulation', 'Văn bản chính sách'],
  [/quy trình/i, 'procedure', 'Văn bản chính sách'],
  [/hướng dẫn|công cụ về|biểu mẫu/i, 'guideline', 'Văn bản chính sách'],
  [/chính sách/i, 'policy', 'Văn bản chính sách'],
  [/chiến lược/i, 'strategic_plan', 'Chiến lược'],
  [/kế hoạch|lộ trình/i, 'plan', 'Kế hoạch triển khai'],
  [/biên bản/i, 'meeting_minutes', 'Biên bản - hội họp'],
  [/ý kiến|phản hồi|khảo sát|lấy ý kiến|phiếu|góp ý|mức độ hài lòng/i, 'survey', 'Khảo sát - góp ý'],
  [/kiểm tra|thanh tra|giám sát|đối sánh/i, 'audit', 'Kiểm tra - giám sát'],
  [/đánh giá|nhận xét|xếp loại/i, 'evaluation', 'Đánh giá - nhận xét'],
  [/báo cáo|thống kê|số liệu|dữ liệu|csdl|bảng tổng hợp|bản tổng hợp/i, 'report', 'Báo cáo - số liệu'],
  [/website|đường dẫn|trang thông tin|công bố|truyền thông|pano|áp phích|sổ tay|hình ảnh/i, 'website', 'Truyền thông'],
  [/hợp đồng|kinh phí|chứng từ|quyết toán|ngân sách|tài chính/i, 'official_doc', 'Tài chính - hợp đồng'],
  [/ma trận|đề cương|bản mô tả|rubric|thang điểm|đáp án|đề thi|ngân hàng câu hỏi|chuẩn đầu ra/i,
    'document_history', 'Hồ sơ chuyên môn'],
  [/danh mục|danh sách|lý lịch|hồ sơ|sổ theo dõi|nhật ký|minh chứng/i, 'official_doc', 'Hồ sơ - danh mục'],
  [/luật|thông tư|nghị định|khung trình độ/i, 'external_doc', 'Căn cứ pháp lý'],
];

function phanLoai(ten) {
  for (const [re, type, category] of LUAT) if (re.test(ten)) return { type, category };
  return { type: 'official_doc', category: 'Tài liệu khác' };
}

// ─── Câu hỏi tự đánh giá ────────────────────────────────────────────────────
// Không có trong thông tư. Sinh từ chính các YÊU CẦU của tiêu chí, mỗi yêu cầu
// một câu, để người viết báo cáo tự đánh giá đối chiếu được từng ý một.
function cauHoi(yeuCau, dieuKien) {
  const ds = yeuCau.map((r) => {
    let s = r.split(/(?<=\.)\s+/)[0].trim().replace(/\.$/, '');
    if (s.length > 165) s = s.slice(0, 162).replace(/\s+\S*$/, '') + '…';
    return s + ' — đơn vị đã làm tới đâu, minh chứng nào chứng minh?';
  });
  ds.push('Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?');
  ds.push('Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?');
  if (dieuKien) {
    ds.push('Đây là TIÊU CHÍ ĐIỀU KIỆN: nếu tiêu chí này không đạt thì cả tiêu chuẩn '
      + 'không đạt. Hồ sơ đã đủ chắc để kết luận đạt chưa?');
  }
  return ds;
}

function goiY(code, ten, yeuCau) {
  const y1 = (yeuCau[0] || '').replace(/"/g, "'");
  return {
    hien_trang: `VD: Đối với tiêu chí ${code}, đơn vị đã ban hành … (số, ngày ban hành); `
      + `triển khai … Kết quả trong chu kỳ đánh giá: …`,
    diem_manh: `VD: ${y1.slice(0, 110)}… được thực hiện đầy đủ, có minh chứng …`,
    ton_tai: 'VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …',
    ke_hoach: 'VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …',
  };
}

const OUT = {};
let soMC = 0, soYC = 0;
for (const s of STANDARDS_TT04) {
  for (const c of s.criteria) {
    const p = PL2[c.code];
    if (!p) throw new Error('Phụ lục II thiếu tiêu chí ' + c.code);
    const sug = p.minh_chung.map((n) => ({ name: n, ...phanLoai(n) }));
    soMC += sug.length; soYC += p.yeu_cau.length;
    OUT[c.code] = {
      short_name: c.short,
      full_name: c.full,
      dieu_kien: c.dieu_kien,
      requirements: p.yeu_cau,
      suggested_evidence: sug,
      self_check_questions: cauHoi(p.yeu_cau, c.dieu_kien),
      placeholders: goiY(c.code, c.short, p.yeu_cau),
    };
  }
}

const dau = `// ─── Chi tiết 8 tiêu chuẩn / 52 tiêu chí của Thông tư 04/2025/TT-BGDĐT ──────
// TỆP NÀY SINH TỰ ĐỘNG. Đừng sửa tay: sửa bộ bóc rồi sinh lại.
//   nguồn cột "Yêu cầu của tiêu chí" và "Minh chứng gợi ý": Phụ lục II của
//   thông tư, trang 72 tới 115 của bản scan.
//   nguồn tên và toàn văn tiêu chí: Chương II, Điều 4 tới Điều 11 (điều khoản
//   quy phạm), lấy qua standards-tt04.js.
//
// Cùng hình dạng với STANDARDS_DETAIL của TT20 nên mọi màn hình dùng lại được:
//   short_name · full_name · requirements[] · suggested_evidence[{name,type,category}]
//   · self_check_questions[] · placeholders{}
//
// Vì sao có tệp này: trước đây phần mềm dựng chi tiết tiêu chí TT04 với ba mảng
// RỖNG, nên ba đợt chương trình đào tạo mở tiêu chí ra chỉ thấy tên, không có
// yêu cầu, không có minh chứng gợi ý để tích, và ô "đã khai" luôn là 0/0.
//
// Có ${soYC} mục yêu cầu và ${soMC} mục minh chứng gợi ý trên 52 tiêu chí.
//
// LƯU Ý cho người dùng nghiệp vụ:
//  · self_check_questions KHÔNG có trong thông tư. Chúng sinh ra từ chính các
//    yêu cầu của tiêu chí, dùng làm bảng tự kiểm khi viết báo cáo tự đánh giá.
//  · type và category của minh chứng do phần mềm phân loại theo từ khoá, chỉ
//    để lọc và tô màu; thông tư không phân loại minh chứng.
//  · Chín tiêu chí có câu chữ khác nhau chút ít giữa Chương II và Phụ lục II
//    (1.5 · 2.7 · 5.3 · 6.2 · 7.1 · 8.1 · 8.2 · 8.4 · 8.5). Tệp này lấy theo
//    Chương II vì đó là điều khoản quy phạm.
//  · Yêu cầu số 2 của tiêu chí 4.7 kết thúc bằng dấu phẩy: bản scan phần đó bị
//    cụt, chưa có nguồn để bổ sung.

const STANDARDS_DETAIL_TT04 = `;

fs.writeFileSync('standards-detail-tt04.js',
  dau + JSON.stringify(OUT, null, 2) + ';\n\nmodule.exports = { STANDARDS_DETAIL_TT04 };\n');
console.log('Da sinh standards-detail-tt04.js: %d tieu chi, %d yeu cau, %d minh chung goi y',
  Object.keys(OUT).length, soYC, soMC);
