// ─── Toàn văn 60 tiêu chí của bộ TT20 (kiểm định cơ sở giáo dục) ────────────
// Văn bản gốc: Thông tư số 20/2026/TT-BGDĐT ngày 31/3/2026 của Bộ trưởng Bộ
// Giáo dục và Đào tạo, "Quy định về kiểm định chất lượng cơ sở giáo dục đại
// học". Hiệu lực 15/5/2026, ký bởi Q. Bộ trưởng Hoàng Minh Sơn. Điều 52 thay
// thế Thông tư 12/2017/TT-BGDĐT. Bộ tiêu chuẩn nằm ở Chương II, từ Điều 4.
// Bản ký scan 122 trang: `kiem-dinh-chat-luong/thong tu.pdf`.
//
// ⚠️ Đừng nhầm với Thông tư 26/2026/TT-BGDĐT ngày 09/4/2026 "Quy định chuẩn
// nghề nghiệp giảng viên đại học" (`kiem-dinh-chat-luong/26-bgddt.pdf`), một
// văn bản khác hẳn. Hai bản được quét cùng mẻ ngày 09/4/2026 nên phần mềm
// từng ghi nhầm nhãn là "TT26/2026" cho tới 14/8/2026.
//
// Bảng này trước nằm trong public/module2.html và chỉ trang đó dùng. Nay đưa về
// phía máy chủ để bản in, phiếu Biểu 04 và báo cáo cùng lấy một nguồn.
//
// CẢNH BÁO cho người sửa sau: thứ tự tiêu chí ở đây khớp mảng STANDARDS trong
// server.js, KHÔNG khớp standards-detail.js. Đối chiếu 60 tiêu chí thì 54 chỗ
// có tên ngắn khác nhau giữa hai tệp đó, tức hai tệp đang đánh số tiêu chí TT20
// theo hai thứ tự khác nhau. Đây là lỗi CÓ SẴN, CHƯA SỬA. Hệ quả: bảng chi
// tiết tiêu chí của đợt cơ sở giáo dục có thể đang hiện yêu cầu và minh chứng
// gợi ý của một tiêu chí khác. Đừng lấy standards-detail.js làm nguồn toàn văn
// cho tới khi đối chiếu xong. Nguồn để đối chiếu nay đã có: Chương II của bản
// ký nói trên, chứ không phải bản phụ lục Word rời.
const TOAN_VAN_TT20 = {
  '1.1': 'Lãnh đạo CSĐT công bố tầm nhìn, sứ mạng đáp ứng nhu cầu các bên liên quan',
  '1.2': 'CSĐT có hệ thống quản trị theo Luật GDĐH đảm bảo trách nhiệm giải trình và minh bạch',
  '1.3': 'Lãnh đạo CSĐT thúc đẩy giá trị văn hóa, liêm chính học thuật và hành vi chuẩn mực',
  '1.4': 'Tầm nhìn, sứ mạng và giá trị văn hóa được truyền đạt đến nhân sự tất cả các cấp',
  '1.5': 'Quyết định quản trị được cụ thể hóa thành kế hoạch, thể hiện trách nhiệm xã hội',
  '1.6': 'Hệ thống quản trị được cải tiến để nâng cao hiệu quả và quản lý rủi ro',
  '2.1': 'CSĐT có cơ cấu tổ chức quản lý rõ ràng, thông tin trao đổi thông suốt đa chiều',
  '2.2': 'Cơ cấu tổ chức được rà soát định kỳ nhằm nâng cao hiệu quả vận hành',
  '2.3': 'Kế hoạch chiến lược ngắn/trung/dài hạn được triển khai đáp ứng nhu cầu đào tạo và NCKH',
  '2.4': 'Kế hoạch chiến lược được giám sát, đánh giá và cải tiến liên tục',
  '2.5': 'Lãnh đạo và quản lý được cải tiến để nâng cao hiệu quả CSĐT',
  '3.1': 'CSĐT có chiến lược quy hoạch và tuyển dụng nhân sự phù hợp',
  '3.2': 'CSĐT có hệ thống đánh giá hiệu quả công việc của nhân sự',
  '3.3': 'CSĐT có chính sách phát triển chuyên môn và nghiệp vụ cho nhân sự',
  '3.4': 'CSĐT có chế độ đãi ngộ, phúc lợi và môi trường làm việc phù hợp',
  '3.5': 'Công tác quản lý nguồn nhân lực được cải tiến liên tục',
  '4.1': 'CSĐT có hệ thống lập kế hoạch và quản lý tài chính hiệu quả',
  '4.2': 'CSĐT có cơ sở vật chất đủ điều kiện đáp ứng yêu cầu đào tạo',
  '4.3': 'CSĐT có thư viện và tài nguyên học liệu số đáp ứng nhu cầu người dạy và người học',
  '4.4': 'CSĐT có hạ tầng CNTT và hệ thống thông tin phục vụ đào tạo và quản lý',
  '4.5': 'Công tác quản lý tài chính và cơ sở vật chất được cải tiến',
  '5.1': 'CSĐT có mạng lưới hợp tác trong nước và quốc tế phục vụ đào tạo và NCKH',
  '5.2': 'Hoạt động hợp tác và kết nối được cải tiến để nâng cao chất lượng',
  '6.1': 'Tiêu chí và quy trình tuyển chọn người học được công bố công khai và thực hiện đúng quy định',
  '6.2': 'CTĐT được thiết kế theo hướng OBE, rà soát định kỳ và cải tiến',
  '6.3': 'Phương pháp giảng dạy và học tập đa dạng, lấy người học làm trung tâm',
  '6.4': 'Kiểm tra đánh giá người học đa dạng, minh bạch và phù hợp chuẩn đầu ra',
  '6.5': 'CSĐT có hệ thống hỗ trợ người học toàn diện',
  '6.6': 'Thông tin người học được quản lý đầy đủ, chính xác và bảo mật',
  '6.7': 'Chính sách và hoạt động đào tạo được cải tiến liên tục',
  '7.1': 'CSĐT có chiến lược và định hướng NCKH rõ ràng',
  '7.2': 'CSĐT tạo môi trường thuận lợi và cung cấp nguồn lực cho NCKH',
  '7.3': 'CSĐT có chính sách về sở hữu trí tuệ và đạo đức nghiên cứu',
  '7.4': 'CSĐT có chương trình phát triển năng lực nghiên cứu cho GV và NCS',
  '7.5': 'Chính sách NCKH được cải tiến để nâng cao hiệu quả',
  '8.1': 'CSĐT có chính sách và kế hoạch kết nối với cộng đồng',
  '8.2': 'CSĐT triển khai hiệu quả các hoạt động kết nối và phục vụ cộng đồng',
  '8.3': 'Hoạt động kết nối cộng đồng được đánh giá và cải tiến',
  '9.1': 'CSĐT có hệ thống IQA với cơ cấu tổ chức và chính sách BĐCL rõ ràng',
  '9.2': 'CSĐT có quy trình và công cụ BĐCL cho tất cả hoạt động cốt lõi',
  '9.3': 'CSĐT giám sát và đánh giá định kỳ chất lượng các hoạt động',
  '9.4': 'Hệ thống BĐCL được cải tiến liên tục',
  '10.1': 'CSĐT có hệ thống thu thập, quản lý và sử dụng dữ liệu chất lượng',
  '10.2': 'CSĐT báo cáo và công bố thông tin chất lượng đầy đủ, minh bạch',
  '11.1': 'CSĐT áp dụng chu trình cải tiến liên tục (PDCA) trong tất cả hoạt động',
  '11.2': 'CSĐT khuyến khích và triển khai đổi mới sáng tạo',
  '12.1': 'Tỉ lệ tốt nghiệp đúng hạn và tỉ lệ thôi học đạt mức theo yêu cầu',
  '12.2': 'Chất lượng sinh viên tốt nghiệp đáp ứng chuẩn đầu ra CTĐT',
  '12.3': 'Tỉ lệ có việc làm sau tốt nghiệp và mức thu nhập đạt yêu cầu',
  '12.4': 'Người học hài lòng với chương trình đào tạo và dịch vụ của CSĐT',
  '13.1': 'CSĐT có kết quả tốt về số lượng và chất lượng đề tài NCKH',
  '13.2': 'GV và NCS có các công bố khoa học trên tạp chí trong nước và quốc tế',
  '13.3': 'CSĐT có sáng chế, giải pháp hữu ích và hoạt động chuyển giao công nghệ',
  '13.4': 'Người học tích cực tham gia NCKH và có các công bố khoa học',
  '14.1': 'CSĐT có nhiều hợp tác hiệu quả với doanh nghiệp và địa phương',
  '14.2': 'CSĐT có hoạt động chuyển giao công nghệ và tư vấn KH-CN',
  '14.3': 'CSĐT có các hoạt động phục vụ cộng đồng thiết thực',
  '14.4': 'Hoạt động kết nối có tác động tích cực đến cộng đồng và xã hội',
  '15.1': 'CSĐT có kết quả tài chính lành mạnh, thu chi cân đối và tăng trưởng',
  '15.2': 'CSĐT có uy tín và vị thế tốt trên thị trường giáo dục',
};

module.exports = { TOAN_VAN_TT20 };
