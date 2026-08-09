// ─── Danh mục khoa và ngành đào tạo đại học ─────────────────────────────────
// Một nguồn duy nhất cho mọi script dựng dữ liệu, để tên đợt, khoa chủ quản và
// tên tệp mẫu không lệch nhau giữa các script.
//
// Danh mục ngành lấy theo kho chương trình đào tạo do chính trường phát hành
// (DAU-chuong-trinh-dao-tao/CHƯƠNG TRÌNH ĐÀO TẠO/, mỗi ngành một thư mục kèm
// chuẩn đầu ra, bản mô tả, chương trình dạy học và đề cương chi tiết).
//
// Mã ngành đối chiếu từ dữ liệu tuyển sinh của trường. Riêng 7480201 của Công
// nghệ thông tin xác thực được thẳng trong bản chuẩn đầu ra của trường. Hai
// ngành Kỹ thuật cơ sở hạ tầng và Quy hoạch vùng và đô thị chưa đối chiếu được
// mã nên để trống, KHÔNG đoán.
//
// Ánh xạ ngành sang khoa là do người dùng chốt khi dựng dữ liệu này, không phải
// trích từ văn bản của trường: kho tài liệu chỉ nêu rời rạc bốn tên khoa. Sửa
// tên khoa hay đổi khoa chủ quản trong trang Đơn vị lúc nào cũng được.
const KHOA = [
  ['KCNTT', 'Khoa Công nghệ thông tin'],
  ['KKT', 'Khoa Kiến trúc'],
  ['KLOG', 'Khoa Logistics và Quản lý chuỗi cung ứng'],
  ['KXD', 'Khoa Xây dựng'],
  ['KKTQT', 'Khoa Kinh tế và Quản trị'],
  ['KNN', 'Khoa Ngoại ngữ'],
  ['KMT', 'Khoa Mỹ thuật ứng dụng'],
];

// [nhãn đợt, tên ngành đầy đủ, mã ngành, mã khoa, slug tệp mẫu]
const NGANH = [
  ['Kiến trúc', 'Kiến trúc', '7580101', 'KKT', 'kien-truc'],
  ['Quy hoạch đô thị', 'Quy hoạch vùng và đô thị', '', 'KKT', 'quy-hoach-do-thi'],
  ['Nội thất', 'Thiết kế nội thất', '7580108', 'KMT', 'noi-that'],
  ['Đồ họa', 'Thiết kế đồ họa', '7210403', 'KMT', 'do-hoa'],
  ['Xây dựng', 'Kỹ thuật xây dựng', '7580201', 'KXD', 'xay-dung'],
  ['XD giao thông', 'Kỹ thuật xây dựng công trình giao thông', '7580205', 'KXD', 'xd-giao-thong'],
  ['Hạ tầng', 'Kỹ thuật cơ sở hạ tầng', '', 'KXD', 'ha-tang'],
  ['QL xây dựng', 'Quản lý xây dựng', '7580302', 'KXD', 'ql-xay-dung'],
  ['CNTT', 'Công nghệ thông tin', '7480201', 'KCNTT', 'cntt'],
  ['Điện - điện tử', 'Công nghệ kỹ thuật điện, điện tử', '7510301', 'KCNTT', 'dien-dien-tu'],
  ['Logistics', 'Logistics và Quản lý chuỗi cung ứng', '7510605', 'KLOG', 'logistics'],
  ['QTKD', 'Quản trị kinh doanh', '7340101', 'KKTQT', 'qtkd'],
  ['Tài chính - NH', 'Tài chính - Ngân hàng', '7340201', 'KKTQT', 'tai-chinh-nh'],
  ['Kế toán', 'Kế toán', '7340301', 'KKTQT', 'ke-toan'],
  ['Du lịch - lữ hành', 'Quản trị dịch vụ du lịch và lữ hành', '7810103', 'KKTQT', 'du-lich-lu-hanh'],
  ['Khách sạn', 'Quản trị khách sạn', '7810201', 'KKTQT', 'khach-san'],
  ['Ngôn ngữ Anh', 'Ngôn ngữ Anh', '7220201', 'KNN', 'ngon-ngu-anh'],
  ['Ngôn ngữ Trung', 'Ngôn ngữ Trung Quốc', '7220204', 'KNN', 'ngon-ngu-trung'],
];

const NAM = 2026;

// Ba đợt dựng từ trước mang tên viết tắt khác, nối vào đúng ngành của chúng để
// script không tạo đợt trùng rồi nhân đôi dữ liệu.
const TEN_CU = { 'CNTT 2026': 'CNTT', 'KTr 2026': 'Kiến trúc', 'Logistics 2026': 'Logistics' };

module.exports = { KHOA, NGANH, NAM, TEN_CU };
