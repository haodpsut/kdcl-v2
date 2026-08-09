// ─── Chi tiết 8 tiêu chuẩn / 52 tiêu chí của Thông tư 04/2025/TT-BGDĐT ──────
// TỆP NÀY SINH TỰ ĐỘNG. Đừng sửa tay: sửa bộ bóc rồi sinh lại.
//   nguồn cột "Yêu cầu của tiêu chí" và "Minh chứng gợi ý": Phụ lục II của
//   thông tư, trang 72 tới 115 của bản scan.
//   nguồn tên và toàn văn tiêu chí: Chương II, Điều 4 tới Điều 11 (điều khoản
//   quy phạm), lấy qua standards-tt04.js.
//
// Cùng hình dạng với STANDARDS_DETAIL của TT26 nên mọi màn hình dùng lại được:
//   short_name · full_name · requirements[] · suggested_evidence[{name,type,category}]
//   · self_check_questions[] · placeholders{}
//
// Vì sao có tệp này: trước đây phần mềm dựng chi tiết tiêu chí TT04 với ba mảng
// RỖNG, nên ba đợt chương trình đào tạo mở tiêu chí ra chỉ thấy tên, không có
// yêu cầu, không có minh chứng gợi ý để tích, và ô "đã khai" luôn là 0/0.
//
// Có 144 mục yêu cầu và 287 mục minh chứng gợi ý trên 52 tiêu chí.
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

const STANDARDS_DETAIL_TT04 = {
  "1.1": {
    "short_name": "Mục tiêu của chương trình đào tạo được xác định rõ ràng",
    "full_name": "Mục tiêu của chương trình đào tạo được xác định rõ ràng, phù hợp và gắn kết với sứ mạng, tầm nhìn, chiến lược phát triển của cơ sở đào tạo; phù hợp với mục tiêu của giáo dục đại học theo quy định tại Luật Giáo dục đại học.",
    "dieu_kien": false,
    "requirements": [
      "Mục tiêu của chương trình đào tạo (CTĐT) được phát biểu rõ ràng, nêu rõ kỳ vọng của cơ sở đào tạo (CSĐT) về năng lực người học (NH) sẽ đạt được một vài năm sau khi tốt nghiệp (CTĐT trình độ đại học thời gian từ 1-3 năm sau tốt nghiệp; CTĐT ngành đặc thù có thể điều chỉnh thời gian theo quy định riêng của ngành), phù hợp với định hướng đào tạo của CTĐT.",
      "Mục tiêu của CTĐT được xây dựng, rà soát và điều chỉnh có sự tham gia ý kiến của các bên liên quan (BLQ), trên cơ sở phân tích sự phù hợp với tầm nhìn, sứ mạng, chiến lược phát triển của CSĐT, mục tiêu đào tạo của Luật giáo dục đại học."
    ],
    "suggested_evidence": [
      {
        "name": "Quy định/quy trình/hướng dẫn/công cụ về xây dựng, phát triển mục tiêu của CTĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Văn bản tuyên bố mục tiêu chung và mục tiêu cụ thể của CTĐT; thể hiện rõ định hướng đào tạo (nghiên cứu/ứng dụng/ nghề nghiệp).",
        "type": "official_statement",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Minh chứng thể hiện tuyên bố sứ mạng, tầm nhìn của CSĐT.",
        "type": "official_statement",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Văn bản chính thức về chiến lược phát triển của CSĐT.",
        "type": "strategic_plan",
        "category": "Chiến lược"
      },
      {
        "name": "Bảng đối sánh, phân tích mức độ phù hợp, gắn kết giữa mục tiêu của CTĐT với sứ mạng/sứ mệnh, tầm nhìn, chiến lược phát triển của CSĐT, với mục tiêu của giáo dục đại học tại Luật Giáo dục đại học.",
        "type": "strategic_plan",
        "category": "Chiến lược"
      }
    ],
    "self_check_questions": [
      "Mục tiêu của chương trình đào tạo (CTĐT) được phát biểu rõ ràng, nêu rõ kỳ vọng của cơ sở đào tạo (CSĐT) về năng lực người học (NH) sẽ đạt được một vài năm sau… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Mục tiêu của CTĐT được xây dựng, rà soát và điều chỉnh có sự tham gia ý kiến của các bên liên quan (BLQ), trên cơ sở phân tích sự phù hợp với tầm nhìn, sứ mạng,… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 1.1, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Mục tiêu của chương trình đào tạo (CTĐT) được phát biểu rõ ràng, nêu rõ kỳ vọng của cơ sở đào tạo (CSĐT) về nă… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "1.2": {
    "short_name": "Chuẩn đầu ra của chương trình đào tạo được xây dựng rõ ràng",
    "full_name": "Chuẩn đầu ra của chương trình đào tạo được xây dựng rõ ràng; phù hợp với sứ mạng, tầm nhìn và mục tiêu chiến lược của cơ sở đào tạo và được phổ biến đến các bên liên quan.",
    "dieu_kien": false,
    "requirements": [
      "Chuẩn đầu ra (CĐR) của CTĐT được xây dựng, rà soát và điều chỉnh theo quy trình định trước, trong đó có sự tham gia của các BLQ.",
      "CĐR của CTĐT được phát biểu rõ ràng, phù hợp với mục tiêu của CTĐT, sứ mạng, tầm nhìn và chiến lược của CSĐT.",
      "CĐR của CTĐT được phổ biến đến các BLQ; giảng viên (GV) và NH hiểu rõ về CĐR của CTĐT."
    ],
    "suggested_evidence": [
      {
        "name": "Quy định/quy trình/hướng dẫn/công cụ về xây dựng, phát triển CĐR của CTĐT; xác định nguyên tắc xây dựng CĐR (SMART, WISER…).",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Văn bản công bố CĐR của CTĐT.",
        "type": "website",
        "category": "Truyền thông"
      },
      {
        "name": "Bản mô tả CTĐT.",
        "type": "document_history",
        "category": "Hồ sơ chuyên môn"
      },
      {
        "name": "Bản đối sánh CĐR của CTĐT với mục tiêu của CTĐT, sứ mạng, tầm nhìn, chiến lược phát triển của CSĐT, với mục tiêu của giáo dục đại học tại Luật Giáo dục đại học.",
        "type": "strategic_plan",
        "category": "Chiến lược"
      },
      {
        "name": "Website, các kênh truyền thông, tài liệu hội nghị, hội thảo, seminar có nội dung giới thiệu về CTĐT và CĐR của CTĐT.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      }
    ],
    "self_check_questions": [
      "Chuẩn đầu ra (CĐR) của CTĐT được xây dựng, rà soát và điều chỉnh theo quy trình định trước, trong đó có sự tham gia của các BLQ — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "CĐR của CTĐT được phát biểu rõ ràng, phù hợp với mục tiêu của CTĐT, sứ mạng, tầm nhìn và chiến lược của CSĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "CĐR của CTĐT được phổ biến đến các BLQ; giảng viên (GV) và NH hiểu rõ về CĐR của CTĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 1.2, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Chuẩn đầu ra (CĐR) của CTĐT được xây dựng, rà soát và điều chỉnh theo quy trình định trước, trong đó có sự tha… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "1.3": {
    "short_name": "Chuẩn đầu ra của chương trình đào tạo phù hợp với Khung trình độ…",
    "full_name": "Chuẩn đầu ra của chương trình đào tạo phù hợp với Khung trình độ quốc gia Việt Nam và chuẩn chương trình đào tạo nhóm ngành, bao gồm chuẩn đầu ra chung và chuẩn đầu ra chuyên biệt.",
    "dieu_kien": true,
    "requirements": [
      "Trong quá trình xây dựng, rà soát CĐR, CTĐT có thực hiện việc phân tích sự phù hợp của CĐR với yêu cầu về năng lực của NH tốt nghiệp quy định trong Khung trình độ quốc gia Việt Nam, chuẩn CTĐT nhóm ngành đào tạo và quy định hiện hành.",
      "CĐR của CTĐT bao gồm các CĐR chung liên quan đến kiến thức, kỹ năng phát triển năng lực học tập suốt đời và CĐR chuyên biệt liên quan đến kiến thức và kỹ năng theo yêu cầu của ngành, chuyên ngành."
    ],
    "suggested_evidence": [
      {
        "name": "Các quy định, hướng dẫn liên quan được tham chiếu khi xây dựng, vận hành và phát triển CĐR của CTĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Quy định/ quy trình/ hướng dẫn/ công cụ về xây dựng, phát triển chuẩn đầu ra (CĐR) của CTĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Văn bản công bố CĐR của CTĐT.",
        "type": "website",
        "category": "Truyền thông"
      },
      {
        "name": "Bảng phân loại các CĐR và CĐR chuyên biệt của CTĐT.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Quy trình xây dựng, phát triển CĐR của CTĐT có thể hiện các bước đối sánh với Khung trình độ quốc gia Việt Nam và chuẩn CTĐT nhóm ngành.",
        "type": "procedure",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Phân tích, đối sánh mức độ phù hợp, gắn kết giữa CĐR của CTĐT với Khung trình độ quốc gia Việt Nam ở trình độ đào tạo cụ thể của CTĐT.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      },
      {
        "name": "Báo cáo phân tích từng CĐR chung và chuyên biệt đáp ứng các yêu cầu của các BLQ bên trong, các BLQ bên ngoài.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      }
    ],
    "self_check_questions": [
      "Trong quá trình xây dựng, rà soát CĐR, CTĐT có thực hiện việc phân tích sự phù hợp của CĐR với yêu cầu về năng lực của NH tốt nghiệp quy định trong Khung trình… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "CĐR của CTĐT bao gồm các CĐR chung liên quan đến kiến thức, kỹ năng phát triển năng lực học tập suốt đời và CĐR chuyên biệt liên quan đến kiến thức và kỹ năng… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?",
      "Đây là TIÊU CHÍ ĐIỀU KIỆN: nếu tiêu chí này không đạt thì cả tiêu chuẩn không đạt. Hồ sơ đã đủ chắc để kết luận đạt chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 1.3, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Trong quá trình xây dựng, rà soát CĐR, CTĐT có thực hiện việc phân tích sự phù hợp của CĐR với yêu cầu về năng… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "1.4": {
    "short_name": "Chuẩn đầu ra của tất cả các học phần được xây dựng phải phù hợp…",
    "full_name": "Chuẩn đầu ra của tất cả các học phần được xây dựng phải phù hợp và tương thích với chuẩn đầu ra của chương trình đào tạo đã công bố.",
    "dieu_kien": false,
    "requirements": [
      "CSĐT có văn bản hướng dẫn xây dựng CĐR của học phần (HP); bảo đảm việc GV có năng lực và tham gia xây dựng CĐR của HP.",
      "GV của CTĐT tham gia vào quá trình xây dựng và điều chỉnh CTĐT, CĐR của HP.",
      "CĐR của từng HP được phát biểu rõ ràng và đo lường được; thể hiện sự tương thích với CĐR của CTĐT."
    ],
    "suggested_evidence": [
      {
        "name": "Quy định/quy trình/hướng dẫn/công cụ về xây dựng, phát triển CĐR của HP.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Bản mô tả chương trình đào tạo có ma trận liên kết giữa CĐR của HP và CĐR của CTĐT có thể hiện mức độ đóng góp của từng CĐR của HP đến các CĐR của CTĐT.",
        "type": "document_history",
        "category": "Hồ sơ chuyên môn"
      },
      {
        "name": "Đề cương chi tiết học phần có ma trận liên kết giữa CĐR của HP và CĐR của CTĐT.",
        "type": "document_history",
        "category": "Hồ sơ chuyên môn"
      },
      {
        "name": "Văn bản trình bày sự tương thích/mối liên hệ giữa CĐR của bài học và CĐR của HP.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      }
    ],
    "self_check_questions": [
      "CSĐT có văn bản hướng dẫn xây dựng CĐR của học phần (HP); bảo đảm việc GV có năng lực và tham gia xây dựng CĐR của HP — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "GV của CTĐT tham gia vào quá trình xây dựng và điều chỉnh CTĐT, CĐR của HP — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "CĐR của từng HP được phát biểu rõ ràng và đo lường được; thể hiện sự tương thích với CĐR của CTĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 1.4, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: CSĐT có văn bản hướng dẫn xây dựng CĐR của học phần (HP); bảo đảm việc GV có năng lực và tham gia xây dựng CĐR… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "1.5": {
    "short_name": "Chuẩn đầu ra của chương trình đào tạo phản ánh rõ yêu cầu của cá…",
    "full_name": "Chuẩn đầu ra của chương trình đào tạo phản ánh rõ yêu cầu của các bên liên quan, đặc biệt là các bên liên quan bên ngoài.",
    "dieu_kien": false,
    "requirements": [
      "Quá trình xây dựng CĐR của CTĐT có thu thập và sử dụng ý kiến của các BLQ bên trong và BLQ bên ngoài.",
      "Việc xác định, phân tích và sử dụng ý kiến của các BLQ trong quá trình xây dựng và điều chỉnh CĐR được thực hiện có hệ thống."
    ],
    "suggested_evidence": [
      {
        "name": "Quy định/quy trình/hướng dẫn/công cụ về xây dựng, phát triển CĐR của CTĐT và CĐR của HP.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Cơ sở dữ liệu (CSDL) về vị trí việc làm của ngành đào tạo và của NH tốt nghiệp từ CTĐT.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Cách thức tiếp thu, tổng hợp nhu cầu các BLQ, đặc biệt từ các BLQ bên ngoài: nhà sử dụng lao động, tổ chức nghề nghiệp.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      }
    ],
    "self_check_questions": [
      "Quá trình xây dựng CĐR của CTĐT có thu thập và sử dụng ý kiến của các BLQ bên trong và BLQ bên ngoài — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Việc xác định, phân tích và sử dụng ý kiến của các BLQ trong quá trình xây dựng và điều chỉnh CĐR được thực hiện có hệ thống — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 1.5, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Quá trình xây dựng CĐR của CTĐT có thu thập và sử dụng ý kiến của các BLQ bên trong và BLQ bên ngoài.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "1.6": {
    "short_name": "Chuẩn đầu ra của chương trình đào tạo được đo lường đánh giá tại…",
    "full_name": "Chuẩn đầu ra của chương trình đào tạo được đo lường đánh giá tại thời điểm người học tốt nghiệp.",
    "dieu_kien": true,
    "requirements": [
      "CSĐT/CTĐT xác lập và triển khai một cách nhất quán quy trình/phương pháp đo lường mức độ đạt được CĐR của CTĐT. Phương pháp và dữ liệu thu thập phản ánh mức độ đạt CĐR của NH tại thời điểm tốt nghiệp.",
      "Phương pháp thu thập dữ liệu đo lường mức độ đạt được CĐR đa dạng; GV dạy CTĐT tham gia vào hoạt động đo lường mức độ đạt CĐR.",
      "CTĐT thiết lập kế hoạch hành động, các hoạt động để cải tiến mức độ đạt CĐR của HP và CĐR của CTĐT, giám sát kế hoạch cải tiến."
    ],
    "suggested_evidence": [
      {
        "name": "Quy định/ quy trình/ hướng dẫn/ công cụ về hoạt động NH đánh giá mức độ đạt CĐR của HP và CTĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Kế hoạch triển khai đo lường mức độ đạt CĐR của NH; có phân công nhiệm vụ của đơn vị, cá nhân tham gia; phương thức triển khai.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Cách thức giám sát, đo lường mức độ NH đạt được các CĐR ở cấp học phần và cấp CTĐT cho đến thời điểm tốt nghiệp.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      },
      {
        "name": "Kết quả đo lường, đánh giá CĐR học phần, CĐR CTĐT.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Minh chứng cho thấy hoạt động đánh giá đạt CĐR được thực hiện định kỳ (theo quy định/ theo khóa NH tốt nghiệp), được đối sánh và sử dụng làm cơ sở cho giải pháp/hoạt động cải tiến chất lượng (CTCL) đối với CĐR của CTĐT/CSĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      }
    ],
    "self_check_questions": [
      "CSĐT/CTĐT xác lập và triển khai một cách nhất quán quy trình/phương pháp đo lường mức độ đạt được CĐR của CTĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Phương pháp thu thập dữ liệu đo lường mức độ đạt được CĐR đa dạng; GV dạy CTĐT tham gia vào hoạt động đo lường mức độ đạt CĐR — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "CTĐT thiết lập kế hoạch hành động, các hoạt động để cải tiến mức độ đạt CĐR của HP và CĐR của CTĐT, giám sát kế hoạch cải tiến — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?",
      "Đây là TIÊU CHÍ ĐIỀU KIỆN: nếu tiêu chí này không đạt thì cả tiêu chuẩn không đạt. Hồ sơ đã đủ chắc để kết luận đạt chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 1.6, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: CSĐT/CTĐT xác lập và triển khai một cách nhất quán quy trình/phương pháp đo lường mức độ đạt được CĐR của CTĐT… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "2.1": {
    "short_name": "Bản mô tả chương trình đào tạo và đề cương các học phần có đủ th…",
    "full_name": "Bản mô tả chương trình đào tạo và đề cương các học phần có đủ thông tin, được cập nhật, được phê duyệt và được công bố công khai để các bên liên quan dễ dàng tiếp cận.",
    "dieu_kien": false,
    "requirements": [
      "Bản mô tả CTĐT và các đề cương chi tiết học phần (ĐCCTHP) có đủ thông tin; thể hiện các phương thức đào tạo của CTĐT; đáp ứng các quy định có liên quan tới các phương thức đào tạo của CTĐT.",
      "Bản mô tả CTĐT và các ĐCCTHP được cập nhật.",
      "Bản mô tả CTĐT và các ĐCCTHP được phê duyệt, được công bố công khai để các BLQ dễ dàng tiếp cận."
    ],
    "suggested_evidence": [
      {
        "name": "Các bản mô tả CTĐT (gồm phiên bản đầy đủ, phiên bản tóm tắt phù hợp cho các BLQ khác nhau) trong giai đoạn đánh giá.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Văn bản hướng dẫn thiết kế/phát triển CTĐT/ ĐCCTHP kèm theo biểu mẫu cụ thể.",
        "type": "guideline",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Kế hoạch rà soát, đánh giá, cập nhật CTĐT.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Các quyết định ban hành/phê duyệt bản mô tả CTĐT và ĐCCTHP.",
        "type": "decision",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Đường dẫn website và các hình thức công bố khác mà CSĐT/đơn vị đào tạo đã sử dụng để công bố bản mô tả CTĐT và ĐCCTHP đến các BLQ phù hợp theo quy định pháp luật.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      }
    ],
    "self_check_questions": [
      "Bản mô tả CTĐT và các đề cương chi tiết học phần (ĐCCTHP) có đủ thông tin; thể hiện các phương thức đào tạo của CTĐT; đáp ứng các quy định có liên quan tới các… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Bản mô tả CTĐT và các ĐCCTHP được cập nhật — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Bản mô tả CTĐT và các ĐCCTHP được phê duyệt, được công bố công khai để các BLQ dễ dàng tiếp cận — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 2.1, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Bản mô tả CTĐT và các đề cương chi tiết học phần (ĐCCTHP) có đủ thông tin; thể hiện các phương thức đào tạo củ… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "2.2": {
    "short_name": "Cấu trúc và nội dung của chương trình đào tạo được thiết kế và p…",
    "full_name": "Cấu trúc và nội dung của chương trình đào tạo được thiết kế và phát triển để bảo đảm người học đạt được chuẩn đầu ra và có khối lượng học tập phù hợp với quy định.",
    "dieu_kien": true,
    "requirements": [
      "CTĐT được thiết kế và phát triển bảo đảm có lộ trình giúp NH đạt được CĐR.",
      "CTĐT có khối lượng học tập phù hợp với quy định.",
      "GV tham gia giảng dạy HP hiểu và áp dụng được ma trận các môn học hoặc HP với CĐR của CTĐT."
    ],
    "suggested_evidence": [
      {
        "name": "Bản mô tả CTĐT và các ĐCCTHP được phê duyệt.",
        "type": "decision",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Ma trận phân nhiệm các CĐR của CTĐT cho tất cả các HP thuộc CTĐT thể hiện sự thiết kế, phát triển bảo đảm NH đạt được các CĐR.",
        "type": "document_history",
        "category": "Hồ sơ chuyên môn"
      },
      {
        "name": "Bảng trình bày mối liên hệ giữa CĐR của CTĐT với phương pháp giảng dạy, kiểm tra, đánh giá.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      },
      {
        "name": "Kế hoạch giảng dạy toàn khóa học.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Bản đối sánh khối lượng học tập của CTĐT với quy định tại quy chế đào tạo và Khung trình độ quốc gia Việt Nam.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Phương pháp xác định khối lượng học tập các HP và của CTĐT bảo đảm NH hình thành, tích lũy năng lực theo CĐR của CTĐT.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      }
    ],
    "self_check_questions": [
      "CTĐT được thiết kế và phát triển bảo đảm có lộ trình giúp NH đạt được CĐR — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "CTĐT có khối lượng học tập phù hợp với quy định — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "GV tham gia giảng dạy HP hiểu và áp dụng được ma trận các môn học hoặc HP với CĐR của CTĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?",
      "Đây là TIÊU CHÍ ĐIỀU KIỆN: nếu tiêu chí này không đạt thì cả tiêu chuẩn không đạt. Hồ sơ đã đủ chắc để kết luận đạt chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 2.2, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: CTĐT được thiết kế và phát triển bảo đảm có lộ trình giúp NH đạt được CĐR.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "2.3": {
    "short_name": "Cấu trúc và nội dung của chương trình đào tạo được thiết kế và p…",
    "full_name": "Cấu trúc và nội dung của chương trình đào tạo được thiết kế và phát triển dựa trên phản hồi và nhu cầu của các bên liên quan, đặc biệt là các bên liên quan bên ngoài.",
    "dieu_kien": false,
    "requirements": [
      "Cấu trúc và nội dung của CTĐT được thiết kế và phát triển dựa trên thông tin phản hồi của các BLQ, đặc biệt là BLQ bên ngoài",
      "Thông tin phản hồi của các BLQ, đặc biệt là BLQ bên ngoài, kết quả đối sánh với các CTĐT khác được sử dụng để thiết kế và phát triển cấu trúc và nội dung của CTĐT",
      "Cấu trúc và nội dung của CTĐT phản ánh mục tiêu và định hướng đào tạo của CTĐT."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản của CSĐT hướng dẫn, quy định, quy trình và kế hoạch thiết kế và phát triển CTĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Quy định và quy trình của CSĐT về việc thu thập thông tin phản hồi và nhu cầu của các BLQ trong việc thiết kế và phát triển CTĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Bản tổng hợp và tiếp thu các ý kiến đánh giá nhận xét, nhu cầu của các BLQ về CĐR, cấu trúc và nội dung của CTĐT.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      },
      {
        "name": "Phiếu/dữ liệu/báo cáo khảo sát; kế hoạch triển khai, biên bản họp/báo cáo phân tích kết quả thu thập thông tin phản hồi và nhu cầu của các BLQ.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Bản tổng hợp và tiếp thu các ý kiến chuyên môn về đào tạo trực tuyến đối với cấu trúc và nội dung đào tạo trực tuyến trong CTĐT; biên bản kiểm tra, thí điểm về cấu trúc và nội dung đào tạo trực tuyến trong CTĐT.",
        "type": "meeting_minutes",
        "category": "Biên bản - hội họp"
      }
    ],
    "self_check_questions": [
      "Cấu trúc và nội dung của CTĐT được thiết kế và phát triển dựa trên thông tin phản hồi của các BLQ, đặc biệt là BLQ bên ngoài — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Thông tin phản hồi của các BLQ, đặc biệt là BLQ bên ngoài, kết quả đối sánh với các CTĐT khác được sử dụng để thiết kế và phát triển cấu trúc và nội dung của CTĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Cấu trúc và nội dung của CTĐT phản ánh mục tiêu và định hướng đào tạo của CTĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 2.3, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Cấu trúc và nội dung của CTĐT được thiết kế và phát triển dựa trên thông tin phản hồi của các BLQ, đặc biệt là… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "2.4": {
    "short_name": "Đóng góp của từng học phần trong việc đạt được chuẩn đầu ra của…",
    "full_name": "Đóng góp của từng học phần trong việc đạt được chuẩn đầu ra của chương trình đào tạo là rõ ràng.",
    "dieu_kien": true,
    "requirements": [
      "Đóng góp của từng HP để đạt được CĐR của CTĐT là phù hợp và rõ ràng.",
      "CTĐT có sử dụng ý kiến phản hồi của các BLQ về sự phù hợp và đóng góp của từng HP để đạt được CĐR của CTĐT trong quá trình xây dựng/rà soát/cập nhật."
    ],
    "suggested_evidence": [
      {
        "name": "Bản mô tả CTĐT được phê duyệt.",
        "type": "decision",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Ma trận các môn học/HP với CĐR, bảo đảm CĐR của của CTĐT được phân bổ và truyền tải đầy đủ thành CĐR của các môn học/HP.",
        "type": "document_history",
        "category": "Hồ sơ chuyên môn"
      },
      {
        "name": "ĐCCTHP của tất cả các HP thuộc CTĐT.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Lộ trình đạt được CĐR của CTĐT.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Bản tổng hợp ý kiến đánh giá nhận xét của các BLQ về sự phù hợp và rõ ràng trong đóng góp của từng HP để đạt được CĐR CTĐT.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Đóng góp của từng HP để đạt được CĐR của CTĐT là phù hợp và rõ ràng — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "CTĐT có sử dụng ý kiến phản hồi của các BLQ về sự phù hợp và đóng góp của từng HP để đạt được CĐR của CTĐT trong quá trình xây dựng/rà soát/cập nhật — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?",
      "Đây là TIÊU CHÍ ĐIỀU KIỆN: nếu tiêu chí này không đạt thì cả tiêu chuẩn không đạt. Hồ sơ đã đủ chắc để kết luận đạt chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 2.4, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Đóng góp của từng HP để đạt được CĐR của CTĐT là phù hợp và rõ ràng.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "2.5": {
    "short_name": "Chương trình đào tạo có cấu trúc logic",
    "full_name": "Chương trình đào tạo có cấu trúc logic, trình tự hợp lý, có tính linh hoạt và tích hợp.",
    "dieu_kien": false,
    "requirements": [
      "Cấu trúc và nội dung của CTĐT phải thể hiện sự liên kết logic và bổ trợ lẫn nhau giữa các thành phần, HP và có trình tự hợp lý (các HP có sự tiến triển từ đại cương đến chuyên sâu).",
      "Cấu trúc và nội dung của CTĐT phải có tính linh hoạt và tích hợp.",
      "Cấu trúc và nội dung của CTĐT được rà soát, đối sánh, phân tích qua các lần cập nhật của CTĐT."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản hướng dẫn, quy định việc thiết kế và phát triển CTĐT trong đó có yêu cầu về bố cục, cấu trúc, tính linh hoạt và tích hợp của chương trình dạy học.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Kế hoạch học tập toàn khóa.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Các phiên bản của Bản mô tả CTĐT có phê duyệt trong giai đoạn đánh giá.",
        "type": "decision",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Báo cáo phân tích, đối sánh về cấu trúc và tính linh hoạt của CTĐT qua các lần rà soát, cập nhật.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      }
    ],
    "self_check_questions": [
      "Cấu trúc và nội dung của CTĐT phải thể hiện sự liên kết logic và bổ trợ lẫn nhau giữa các thành phần, HP và có trình tự hợp lý (các HP có sự tiến triển từ đại… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Cấu trúc và nội dung của CTĐT phải có tính linh hoạt và tích hợp — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Cấu trúc và nội dung của CTĐT được rà soát, đối sánh, phân tích qua các lần cập nhật của CTĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 2.5, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Cấu trúc và nội dung của CTĐT phải thể hiện sự liên kết logic và bổ trợ lẫn nhau giữa các thành phần, HP và có… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "2.6": {
    "short_name": "Cấu trúc và nội dung của chương trình đào tạo thể hiện rõ các họ…",
    "full_name": "Cấu trúc và nội dung của chương trình đào tạo thể hiện rõ các học phần bắt buộc, tự chọn, lý thuyết, thực hành, trải nghiệm, nghiên cứu khoa học, các thành phần chính yếu và bổ trợ; cho phép người học lựa chọn theo định hướng nghề nghiệp của bản thân.",
    "dieu_kien": false,
    "requirements": [
      "Cấu trúc và nội dung của CTĐT thể hiện rõ các HP bắt buộc, tự chọn, lý thuyết, thực hành, trực tuyến, trải nghiệm, nghiên cứu khoa học (NCKH), các thành phần chính yếu và bổ trợ.",
      "Cấu trúc và nội dung của CTĐT cho phép NH có các lựa chọn ngành chính và/hoặc ngành phụ theo định hướng nghề nghiệp của bản thân (nếu có)."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản hướng dẫn, quy định việc thiết kế và phát triển CTĐT trong đó có yêu cầu về việc xác định rõ các HP bắt buộc, tự chọn, lý thuyết, thực hành, trực tuyến, trải nghiệm, NCKH, các thành phần chính yếu và bổ trợ.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Các phiên bản của bản mô tả CTĐT có phê duyệt trong đó thể hiện rõ định hướng nghề nghiệp.",
        "type": "decision",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Phân tích cho thấy CTĐT có định hướng nghề nghiệp rõ ràng, số lượng các HP của mỗi định hướng nghề nghiệp có tính chuyên ngành.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      }
    ],
    "self_check_questions": [
      "Cấu trúc và nội dung của CTĐT thể hiện rõ các HP bắt buộc, tự chọn, lý thuyết, thực hành, trực tuyến, trải nghiệm, nghiên cứu khoa học (NCKH), các thành phần… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Cấu trúc và nội dung của CTĐT cho phép NH có các lựa chọn ngành chính và/hoặc ngành phụ theo định hướng nghề nghiệp của bản thân (nếu có) — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 2.6, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Cấu trúc và nội dung của CTĐT thể hiện rõ các HP bắt buộc, tự chọn, lý thuyết, thực hành, trực tuyến, trải ngh… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "2.7": {
    "short_name": "Cấu trúc và nội dung của chương trình đào tạo được rà soát",
    "full_name": "Cấu trúc và nội dung của chương trình đào tạo được rà soát, đánh giá và cải tiến chất lượng theo quy trình, quy định; bảo đảm tính cập nhật, đáp ứng yêu cầu của thị trường lao động.",
    "dieu_kien": false,
    "requirements": [
      "CSĐT có quy định, quy trình về rà soát, đánh giá và CTCL CTĐT phù hợp, đáp ứng các quy định về đào tạo.",
      "CTĐT được định kỳ rà soát, bảo đảm tính cập nhật, phân tích sự đáp ứng yêu cầu của thị trường lao động và có sử dụng kết quả đánh giá trong các lần rà soát, cập nhật CTĐT."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản hướng dẫn, quy định, quy trình và kế hoạch của CSĐT về rà soát, đánh giá và CTCL CTĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Hồ sơ rà soát các văn bản hướng dẫn, quy định và quy trình và kế hoạch của CSĐT về rà soát, đánh giá và CTCL CTĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Văn bản quy định và quy trình về việc thu thập thông tin phản hồi từ BLQ trong việc rà soát, đánh giá và CTCL CTĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Báo cáo phân tích, đối sánh các quy định, quy trình rà soát, đánh giá, CTCL CTĐT theo định kỳ.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Báo cáo phân tích, đối sánh nhu cầu của thị trường lao động và báo cáo đánh giá sự đáp ứng của CTĐT đối với yêu cầu của thị trường lao động.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      }
    ],
    "self_check_questions": [
      "CSĐT có quy định, quy trình về rà soát, đánh giá và CTCL CTĐT phù hợp, đáp ứng các quy định về đào tạo — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "CTĐT được định kỳ rà soát, bảo đảm tính cập nhật, phân tích sự đáp ứng yêu cầu của thị trường lao động và có sử dụng kết quả đánh giá trong các lần rà soát, cập… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 2.7, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: CSĐT có quy định, quy trình về rà soát, đánh giá và CTCL CTĐT phù hợp, đáp ứng các quy định về đào tạo.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "3.1": {
    "short_name": "Triết lý giáo dục của cơ sở đào tạo được tuyên bố rõ ràng",
    "full_name": "Triết lý giáo dục của cơ sở đào tạo được tuyên bố rõ ràng, được phổ biến đến các bên liên quan và được truyền tải vào các hoạt động dạy và học.",
    "dieu_kien": false,
    "requirements": [
      "Triết lý giáo dục của CSĐT được tuyên bố rõ ràng.",
      "Triết lý giáo dục của CSĐT được phổ biến đến các BLQ, đặc biệt là BLQ bên trong.",
      "Triết lý giáo dục của CSĐT được chuyển tải vào hoạt động dạy và học."
    ],
    "suggested_evidence": [
      {
        "name": "Minh chứng cho thấy CSĐT và CTĐT có tuyên bố rõ về triết lý giáo dục.",
        "type": "official_doc",
        "category": "Hồ sơ - danh mục"
      },
      {
        "name": "Văn bản, hình ảnh thể hiện việc triết lý giáo dục của CSĐT được phổ biến đến các BLQ.",
        "type": "website",
        "category": "Truyền thông"
      },
      {
        "name": "Chính sách/quy định/ hướng dẫn/hoạt động nhằm thúc đẩy việc triển khai triết lý giáo dục vào hoạt động dạy và học, trong đó chỉ rõ vai trò của CSĐT, các đơn vị quản lý, GV, NH.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Văn bản hướng dẫn, ĐCCTHP, bài giảng có thể hiện được việc triết lý giáo dục được chuyển tải vào hoạt động dạy và học.",
        "type": "guideline",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Báo cáo thể hiện việc triết lý giáo dục được chuyển tải vào hoạt động ngoại khoá.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      }
    ],
    "self_check_questions": [
      "Triết lý giáo dục của CSĐT được tuyên bố rõ ràng — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Triết lý giáo dục của CSĐT được phổ biến đến các BLQ, đặc biệt là BLQ bên trong — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Triết lý giáo dục của CSĐT được chuyển tải vào hoạt động dạy và học — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 3.1, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Triết lý giáo dục của CSĐT được tuyên bố rõ ràng.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "3.2": {
    "short_name": "Hoạt động dạy và học được thiết kế tương thích với chuẩn đầu ra…",
    "full_name": "Hoạt động dạy và học được thiết kế tương thích với chuẩn đầu ra của chương trình đào tạo.",
    "dieu_kien": true,
    "requirements": [
      "Có hướng dẫn thiết kế hoạt động dạy và học tương thích với CĐR của CTĐT, CĐR của các HP. GV tham gia CTĐT có khả năng lựa chọn và triển khai hoạt động dạy và học tương thích với CĐR của CTĐT.",
      "Hoạt động dạy và học được thiết kế nhằm giúp NH đạt CĐR của CTĐT.",
      "Hoạt động dạy và học của các HP được thiết kế và triển khai tương thích với CĐR của HP.",
      "Hoạt động dạy và học trực tuyến trong CTĐT được thiết kế và triển khai phù hợp, bảo đảm tương thích với CĐR như trường hợp tổ chức dạy và học trực tiếp. CTĐT bảo đảm GV có đầy đủ năng lực cần thiết để triển khai hoạt động dạy và học trực tuyến."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản hướng dẫn thiết kế hoạt động dạy và học tương thích với CĐR.",
        "type": "guideline",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Tài liệu tập huấn, bồi dưỡng thiết kế hoạt động dạy và học tương thích với CĐR.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "Tài liệu hội thảo, hội nghị, toạ đàm chia sẻ kinh nghiệm về việc thiết kế và triển khai hoạt động dạy và học tương thích với CĐR của CTĐT, CĐR học phần.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "Bảng ma trận thể hiện quan hệ giữa học phần và CĐR CTĐT.",
        "type": "document_history",
        "category": "Hồ sơ chuyên môn"
      },
      {
        "name": "Bản thiết kế/phân tích hoạt động dạy và học với CĐR CTĐT.",
        "type": "visual",
        "category": "Sơ đồ - bản vẽ"
      },
      {
        "name": "Báo cáo, biên bản cho thấy các BLQ đánh giá, góp ý về việc hoạt động dạy và học tương thích với CĐR.",
        "type": "meeting_minutes",
        "category": "Biên bản - hội họp"
      }
    ],
    "self_check_questions": [
      "Có hướng dẫn thiết kế hoạt động dạy và học tương thích với CĐR của CTĐT, CĐR của các HP — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Hoạt động dạy và học được thiết kế nhằm giúp NH đạt CĐR của CTĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Hoạt động dạy và học của các HP được thiết kế và triển khai tương thích với CĐR của HP — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Hoạt động dạy và học trực tuyến trong CTĐT được thiết kế và triển khai phù hợp, bảo đảm tương thích với CĐR như trường hợp tổ chức dạy và học trực tiếp — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?",
      "Đây là TIÊU CHÍ ĐIỀU KIỆN: nếu tiêu chí này không đạt thì cả tiêu chuẩn không đạt. Hồ sơ đã đủ chắc để kết luận đạt chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 3.2, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có hướng dẫn thiết kế hoạt động dạy và học tương thích với CĐR của CTĐT, CĐR của các HP. GV tham gia CTĐT có k… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "3.3": {
    "short_name": "Hoạt động dạy và học thể hiện việc học tập chủ động",
    "full_name": "Hoạt động dạy và học thể hiện việc học tập chủ động, thúc đẩy việc học tập, hình thành và phát triển phương pháp học tập và khả năng học tập suốt đời của người học.",
    "dieu_kien": false,
    "requirements": [
      "Hoạt động dạy và học thể hiện việc học tập chủ động.",
      "Hoạt động dạy và học thúc đẩy việc học tập, hình thành và phát triển phương pháp học tập và khả năng học tập suốt đời của NH.",
      "Hoạt động dạy và học trực tuyến được triển khai trên nền tảng ứng dụng công nghệ thông tin (CNTT) bảo đảm sự tương tác hiệu quả giữa NH với NH, giữa NH và GV."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản/kế hoạch/tài liệu/tư liệu liên quan đến việc hướng dẫn NH cách học tập chủ động, tích cực nhằm đáp ứng CĐR.",
        "type": "guideline",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Văn bản/kế hoạch/tài liệu/tư liệu liên quan đến việc hướng dẫn NH tương tác, học tập trực tuyến.",
        "type": "guideline",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Minh chứng cho thấy có các hoạt động thể hiện việc học tập chủ động.",
        "type": "official_doc",
        "category": "Hồ sơ - danh mục"
      },
      {
        "name": "Minh chứng cho thấy có các hoạt động dạy và học thúc đẩy việc học tập, hình thành và phát triển phương pháp học tập và khả năng học tập suốt đời của NH.",
        "type": "official_doc",
        "category": "Hồ sơ - danh mục"
      },
      {
        "name": "Báo cáo, biên bản cho thấy các BLQ đánh giá, góp ý về việc hoạt động dạy và học thúc đẩy việc học tập, hình thành và phát triển phương pháp học tập và khả năng học tập suốt đời của NH.",
        "type": "meeting_minutes",
        "category": "Biên bản - hội họp"
      },
      {
        "name": "Báo cáo cải tiến các hoạt động dạy và học nhằm giúp NH học tập chủ động và giúp NH hình thành và phát triển phương pháp học tập và khả năng học tập suốt đời.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      }
    ],
    "self_check_questions": [
      "Hoạt động dạy và học thể hiện việc học tập chủ động — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Hoạt động dạy và học thúc đẩy việc học tập, hình thành và phát triển phương pháp học tập và khả năng học tập suốt đời của NH — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Hoạt động dạy và học trực tuyến được triển khai trên nền tảng ứng dụng công nghệ thông tin (CNTT) bảo đảm sự tương tác hiệu quả giữa NH với NH, giữa NH và GV — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 3.3, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Hoạt động dạy và học thể hiện việc học tập chủ động.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "3.4": {
    "short_name": "Hoạt động dạy và học thúc đẩy người học đưa ra ý tưởng mới",
    "full_name": "Hoạt động dạy và học thúc đẩy người học đưa ra ý tưởng mới, sáng kiến, đổi mới sáng tạo và tinh thần khởi nghiệp.",
    "dieu_kien": false,
    "requirements": [
      "Các hoạt động dạy và học thúc đẩy NH đưa ra ý tưởng mới, sáng kiến và đổi mới sáng tạo.",
      "Các hoạt động dạy và học thúc đẩy NH có tinh thần khởi nghiệp."
    ],
    "suggested_evidence": [
      {
        "name": "Báo cáo thống kê về ý tưởng mới, sáng kiến, đổi mới sáng tạo và khởi nghiệp của NH.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Báo cáo, biên bản cho thấy các BLQ đánh giá, góp ý về việc hoạt động dạy và học thúc đẩy NH đưa ra ý tưởng mới, sáng kiến, đổi mới sáng tạo và tinh thần khởi nghiệp.",
        "type": "meeting_minutes",
        "category": "Biên bản - hội họp"
      }
    ],
    "self_check_questions": [
      "Các hoạt động dạy và học thúc đẩy NH đưa ra ý tưởng mới, sáng kiến và đổi mới sáng tạo — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các hoạt động dạy và học thúc đẩy NH có tinh thần khởi nghiệp — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 3.4, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Các hoạt động dạy và học thúc đẩy NH đưa ra ý tưởng mới, sáng kiến và đổi mới sáng tạo.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "3.5": {
    "short_name": "Quá trình dạy và học được cải tiến thường xuyên để đáp ứng yêu c…",
    "full_name": "Quá trình dạy và học được cải tiến thường xuyên để đáp ứng yêu cầu của thị trường lao động và thúc đẩy việc học tập, đáp ứng chuẩn đầu ra của chương trình đào tạo.",
    "dieu_kien": false,
    "requirements": [
      "Có quy định/kế hoạch rà soát, đánh giá, cải tiến quá trình dạy và học, trong đó có đánh giá các hoạt động dạy và học thúc đẩy việc học tập, hình thành và phát triển phương pháp học tập và khả năng học tập suốt đời cho NH, thúc đẩy NH đưa ra ý tưởng mới, đổi mới sáng tạo và tinh thần khởi nghiệp; phân tích, đối sánh sự tương thích giữa các hoạt động dạy và học với CĐR của HP và của CTĐT.",
      "CTĐT triển khai rà soát, đánh giá định kỳ hoạt động dạy và học.",
      "CTĐT thể hiện việc sử dụng kết quả rà soát, đánh giá định kỳ để cải tiến hoạt động dạy và học, đáp ứng yêu cầu của thị trường lao động, tiến bộ khoa học kỹ thuật trong đào tạo trực tuyến và thúc đẩy việc học tập, đáp ứng CĐR của CTĐT."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định/kế hoạch rà soát, đánh giá, cải tiến quá trình dạy và học.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Kết quả khảo sát cho thấy các BLQ bên trong hiểu rõ các nội dung trong văn bản quy định/kế hoạch rà soát, đánh giá, cải tiến quá trình dạy và học",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Văn bản cho thấy quá trình dạy và học được rà soát, cải tiến theo kế hoạch.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Văn bản/hướng dẫn/báo cáo về phần mềm sử dụng trong đào tạo trực tuyến, đáp ứng quy định của pháp luật hiện hành.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Văn bản/báo cáo/tài liệu phân tích về việc quá trình dạy và học được cải tiến thường xuyên để đáp ứng yêu cầu của thị trường lao động và thúc đẩy việc học tập, đáp ứng CĐR của CTĐT.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      }
    ],
    "self_check_questions": [
      "Có quy định/kế hoạch rà soát, đánh giá, cải tiến quá trình dạy và học, trong đó có đánh giá các hoạt động dạy và học thúc đẩy việc học tập, hình thành và phát… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "CTĐT triển khai rà soát, đánh giá định kỳ hoạt động dạy và học — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "CTĐT thể hiện việc sử dụng kết quả rà soát, đánh giá định kỳ để cải tiến hoạt động dạy và học, đáp ứng yêu cầu của thị trường lao động, tiến bộ khoa học kỹ thuật… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 3.5, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có quy định/kế hoạch rà soát, đánh giá, cải tiến quá trình dạy và học, trong đó có đánh giá các hoạt động dạy … được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "4.1": {
    "short_name": "Các phương pháp đánh giá kết quả học tập của người học đa dạng",
    "full_name": "Các phương pháp đánh giá kết quả học tập của người học đa dạng, tương thích với chuẩn đầu ra của chương trình đào tạo.",
    "dieu_kien": false,
    "requirements": [
      "Có quy định/quy trình hướng dẫn việc thiết kế các phương pháp đánh giá kết quả học tập của NH tương thích với CĐR của CTĐT. GV có năng lực lựa chọn, triển khai các phương pháp đánh giá kết quả học tập tương thích với CĐR.",
      "Các phương pháp đánh giá kết quả học tập của NH thể hiện sự đa dạng, phù hợp với phương thức đào tạo trong CTĐT.",
      "Các phương pháp đánh giá kết quả học tập của NH được phổ biến đến các BLQ, đặc biệt là NH."
    ],
    "suggested_evidence": [
      {
        "name": "Quy định/quy trình/hướng dẫn/công cụ/kế hoạch về các phương pháp đánh giá kết quả học tập của NH, gồm đánh giá đầu vào (tuyển sinh), đánh giá quá trình (thời điểm NH hoàn thành các HP), đánh giá đầu ra (thời điểm NH tốt nghiệp).",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Quy trình/tài liệu hướng dẫn việc thiết kế các phương pháp đánh giá, xây dựng đề thi phù hợp với phương thức đào tạo và tương thích với CĐR.",
        "type": "procedure",
        "category": "Văn bản chính sách"
      },
      {
        "name": "ĐCCTHP có thông tin thể hiện sự đa dạng, phù hợp, và tương thích của các phương pháp đánh giá với CĐR của HP.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      }
    ],
    "self_check_questions": [
      "Có quy định/quy trình hướng dẫn việc thiết kế các phương pháp đánh giá kết quả học tập của NH tương thích với CĐR của CTĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các phương pháp đánh giá kết quả học tập của NH thể hiện sự đa dạng, phù hợp với phương thức đào tạo trong CTĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các phương pháp đánh giá kết quả học tập của NH được phổ biến đến các BLQ, đặc biệt là NH — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 4.1, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có quy định/quy trình hướng dẫn việc thiết kế các phương pháp đánh giá kết quả học tập của NH tương thích với … được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "4.2": {
    "short_name": "Có các quy định rõ ràng về đánh giá kết quả học tập",
    "full_name": "Có các quy định rõ ràng về đánh giá kết quả học tập, quy trình phúc khảo, được phổ biến đến người học và được triển khai thực hiện một cách nhất quán.",
    "dieu_kien": false,
    "requirements": [
      "Có các chính sách/quy định về đánh giá kết quả học tập, liêm chính học thuật và phúc khảo được xây dựng rõ ràng cho tất cả các phương thức đào tạo.",
      "Các chính sách/ quy định về đánh giá kết quả học tập và phúc khảo được phổ biến đến NH.",
      "Các chính sách/ quy định về đánh giá kết quả học tập và phúc khảo được triển khai thực hiện một cách nhất quán cho tất cả các phương thức đào tạo."
    ],
    "suggested_evidence": [
      {
        "name": "Chính sách/quy định/quy trình/hướng dẫn về đánh giá kết quả học tập và phúc khảo kết quả học tập của NH cho tất cả các phương thức đào tạo.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Các hình thức công khai chính sách/quy định/quy trình/hướng dẫn về đánh giá kết quả học tập và phúc khảo đến NH (trang thông tin điện tử; bản mô tả CTĐT/ĐCCTHP, sổ tay NH, …)",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Sổ tay NH/Sổ tay GV.",
        "type": "website",
        "category": "Truyền thông"
      },
      {
        "name": "Ý kiến phản hồi của GV, NH, NH đã tốt nghiệp và cán bộ quản lý CTĐT về việc triển khai các chính sách/quy định/quy trình đánh giá kết quả học tập và phúc khảo kết quả học tập của NH.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      }
    ],
    "self_check_questions": [
      "Có các chính sách/quy định về đánh giá kết quả học tập, liêm chính học thuật và phúc khảo được xây dựng rõ ràng cho tất cả các phương thức đào tạo — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các chính sách/ quy định về đánh giá kết quả học tập và phúc khảo được phổ biến đến NH — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các chính sách/ quy định về đánh giá kết quả học tập và phúc khảo được triển khai thực hiện một cách nhất quán cho tất cả các phương thức đào tạo — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 4.2, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có các chính sách/quy định về đánh giá kết quả học tập, liêm chính học thuật và phúc khảo được xây dựng rõ ràn… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "4.3": {
    "short_name": "Các tiêu chuẩn và quy trình đánh giá kết quả học tập",
    "full_name": "Các tiêu chuẩn và quy trình đánh giá kết quả học tập, xét công nhận kết quả học tập, xét tốt nghiệp được phổ biến đến người học và được triển khai thực hiện một cách nhất quán.",
    "dieu_kien": false,
    "requirements": [
      "Các tiêu chuẩn và quy trình đánh giá kết quả học tập, xét công nhận kết quả học tập, xét tốt nghiệp được phổ biến đến NH.",
      "Các tiêu chuẩn và quy trình đánh giá kết quả học tập, xét công nhận kết quả học tập, xét tốt nghiệp được triển khai thực hiện một cách nhất quán."
    ],
    "suggested_evidence": [
      {
        "name": "Quy định/quy trình/hướng dẫn/công cụ về các tiêu chuẩn và thủ tục đánh giá kết quả học tập, xét công nhận kết quả học tập, xét tốt nghiệp",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Kế hoạch triển khai các tiêu chuẩn và thủ tục về đánh giá kết quả học tập theo học kỳ, năm học, xét công nhận kết quả học tập, xét tốt nghiệp; có phân công nhiệm vụ của đơn vị, cá nhân tham gia; phương thức triển khai.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Các hình thức công khai các tiêu chuẩn và thủ tục đánh giá kết quả học tập, xét công nhận kết quả học tập, xét tốt nghiệp (trang thông tin điện tử; bản mô tả CTĐT/ĐCCCTHP, sổ tay NH, …)",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Báo cáo đánh giá kết quả học tập, xét công nhận kết quả học tập, xét tốt nghiệp.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Ý kiến phản hồi của GV, NH, NH đã tốt nghiệp và cán bộ quản lý chương trình về việc triển khai các tiêu chuẩn và thủ tục đánh giá kết quả học tập, xét công nhận kết quả học tập, xét tốt nghiệp.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Các tiêu chuẩn và quy trình đánh giá kết quả học tập, xét công nhận kết quả học tập, xét tốt nghiệp được phổ biến đến NH — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các tiêu chuẩn và quy trình đánh giá kết quả học tập, xét công nhận kết quả học tập, xét tốt nghiệp được triển khai thực hiện một cách nhất quán — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 4.3, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Các tiêu chuẩn và quy trình đánh giá kết quả học tập, xét công nhận kết quả học tập, xét tốt nghiệp được phổ b… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "4.4": {
    "short_name": "Các phương pháp đánh giá kết quả học tập được thể hiện qua ma tr…",
    "full_name": "Các phương pháp đánh giá kết quả học tập được thể hiện qua ma trận, tiêu chí và mức độ đánh giá, đáp án, thang điểm chi tiết, kế hoạch đánh giá và các quy định cụ thể để bảo đảm độ giá trị, độ tin cậy và sự công bằng.",
    "dieu_kien": false,
    "requirements": [
      "Các phương pháp và tiêu chí đánh giá kết quả học tập được thể hiện qua kế hoạch đánh giá HP, bảo đảm độ giá trị, độ tin cậy và sự công bằng.",
      "Các tiêu chí đánh giá kết quả học tập được thể hiện qua bảng tiêu chí đánh giá (rubrics), thang điểm chi tiết, để bảo đảm độ giá trị, độ tin cậy. Bảng tiêu chí đánh giá (rubrics), thang điểm chi tiết được công bố đến NH.",
      "GV có năng lực tham gia thiết kế bảng tiêu chí đánh giá (rubrics), thang điểm chi tiết.",
      "Các phương pháp đánh giá kết quả học tập trực tuyến bảo đảm yêu cầu về bảo mật đề thi trực tuyến và chống gian lận trong thi cử."
    ],
    "suggested_evidence": [
      {
        "name": "Quy định/quy trình/hướng dẫn/công cụ về các phương pháp đánh giá kết quả học tập của NH cho tất cả các hình thức đào tạo.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Mẫu phiếu/bảng tiêu chí đánh giá (rubrics) đánh giá bài thi cuối kỳ/cuối khóa của học phần/đề tài/đồ án tốt nghiệp/khóa luận tốt nghiệp/luận văn/luận án.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      },
      {
        "name": "Kế hoạch đánh giá học phần trực tuyến.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Kế hoạch đánh giá học phần, đồ án tốt nghiệp/luận văn tốt nghiệp/ luận án; có phân công nhiệm vụ của đơn vị, cá nhân tham gia; phương thức triển khai,…",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Dữ liệu về kết quả chấm thi, phúc khảo, phúc tra bài thi/kiểm tra.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      }
    ],
    "self_check_questions": [
      "Các phương pháp và tiêu chí đánh giá kết quả học tập được thể hiện qua kế hoạch đánh giá HP, bảo đảm độ giá trị, độ tin cậy và sự công bằng — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các tiêu chí đánh giá kết quả học tập được thể hiện qua bảng tiêu chí đánh giá (rubrics), thang điểm chi tiết, để bảo đảm độ giá trị, độ tin cậy — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "GV có năng lực tham gia thiết kế bảng tiêu chí đánh giá (rubrics), thang điểm chi tiết — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các phương pháp đánh giá kết quả học tập trực tuyến bảo đảm yêu cầu về bảo mật đề thi trực tuyến và chống gian lận trong thi cử — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 4.4, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Các phương pháp và tiêu chí đánh giá kết quả học tập được thể hiện qua kế hoạch đánh giá HP, bảo đảm độ giá tr… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "4.5": {
    "short_name": "Các phương pháp đánh giá kết quả học tập bảo đảm đo lường được m…",
    "full_name": "Các phương pháp đánh giá kết quả học tập bảo đảm đo lường được mức độ đạt chuẩn đầu ra của từng học phần và chuẩn đầu ra của chương trình đào tạo.",
    "dieu_kien": true,
    "requirements": [
      "Các phương pháp đánh giá kết quả học tập bảo đảm đo lường được mức độ đạt CĐR của từng HP cho tất cả các phương thức đào tạo.",
      "Các phương pháp đánh giá kết quả học tập bảo đảm đo lường được mức độ đạt CĐR của CTĐT cho tất cả các phương thức đào tạo."
    ],
    "suggested_evidence": [
      {
        "name": "Quy định/quy trình/hướng dẫn/công cụ về các phương pháp đánh giá kết quả học tập bảo đảm đo lường được mức độ đạt CĐR của CTĐT và CĐR học phần.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Kế hoạch triển khai đánh giá kết quả học tập bảo đảm đo lường được mức độ đạt CĐR của CTĐT và CĐR học phần của NH; có phân công nhiệm vụ của đơn vị, cá nhân tham gia; phương thức triển khai, …",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Báo cáo phân tích các phương pháp đánh giá kết quả học tập của NH thể hiện sự tương thích với CĐR cuả CTĐT.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Báo cáo phân tích đánh giá mức độ tương thích của đề thi với CĐR của CTĐT.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Báo cáo phân tích phổ điểm, mức độ phân hóa của đề thi các HP.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      }
    ],
    "self_check_questions": [
      "Các phương pháp đánh giá kết quả học tập bảo đảm đo lường được mức độ đạt CĐR của từng HP cho tất cả các phương thức đào tạo — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các phương pháp đánh giá kết quả học tập bảo đảm đo lường được mức độ đạt CĐR của CTĐT cho tất cả các phương thức đào tạo — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?",
      "Đây là TIÊU CHÍ ĐIỀU KIỆN: nếu tiêu chí này không đạt thì cả tiêu chuẩn không đạt. Hồ sơ đã đủ chắc để kết luận đạt chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 4.5, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Các phương pháp đánh giá kết quả học tập bảo đảm đo lường được mức độ đạt CĐR của từng HP cho tất cả các phươn… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "4.6": {
    "short_name": "Kết quả đánh giá được phản hồi kịp thời cho người học để người h…",
    "full_name": "Kết quả đánh giá được phản hồi kịp thời cho người học để người học cải thiện việc học tập, phương pháp học tập và kết quả học tập.",
    "dieu_kien": false,
    "requirements": [
      "Kết quả đánh giá được phản hồi kịp thời cho NH.",
      "NH cải thiện việc học tập, phương pháp học tập và kết quả học tập nhờ các phản hồi kịp thời về kết quả đánh giá."
    ],
    "suggested_evidence": [
      {
        "name": "Quy định/quy trình/hướng dẫn về thi, kiểm tra và đánh giá, trong đó có quy định về thời điểm phản hồi kết quả đánh giá kết quả học tập của NH.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Ý kiến phản hồi của NH, NH đã tốt nghiệp thông qua nhiều hình thức khác nhau về phản hồi về kết quả đánh giá, tính kịp thời của phản hồi này.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      },
      {
        "name": "Phản hồi của GV về kết quả học tập của NH.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      },
      {
        "name": "Hình thức thông báo kết quả đánh giá tới NH (thông báo, bảng điểm, tài khoản).",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      }
    ],
    "self_check_questions": [
      "Kết quả đánh giá được phản hồi kịp thời cho NH — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "NH cải thiện việc học tập, phương pháp học tập và kết quả học tập nhờ các phản hồi kịp thời về kết quả đánh giá — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 4.6, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Kết quả đánh giá được phản hồi kịp thời cho NH.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "4.7": {
    "short_name": "Việc đánh giá kết quả học tập và các quy định về đánh giá kết qu…",
    "full_name": "Việc đánh giá kết quả học tập và các quy định về đánh giá kết quả học tập được định kỳ rà soát và cải tiến để bảo đảm đo lường được chuẩn đầu ra của chương trình đào tạo, đáp ứng nhu cầu của các bên liên quan.",
    "dieu_kien": false,
    "requirements": [
      "Có quy định/quy trình định kỳ rà soát hoạt động đánh giá kết quả học tập. Hoạt động đánh giá gồm: sự tương thích của phương pháp đánh giá với CĐR; độ giá trị, độ tin cậy của phương pháp đánh giá; bảng tiêu chí đánh giá (rubrics); khả năng đo lường được mức độ đạt CĐR… Hoạt động rà soát, đánh giá có sự tham gia của các BLQ.",
      "Việc đánh giá kết quả học tập và các quy định về đánh giá kết quả học tập được định kỳ rà soát và cải tiến để đáp ứng nhu cầu của các BLQ,"
    ],
    "suggested_evidence": [
      {
        "name": "Các quy định/ quy trình/hướng dẫn/công cụ về đánh giá kết quả học tập của NH đã được ban hành.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Quy định và kết quả việc định kỳ lấy ý kiến các BLQ về việc đánh giá kết quả học tập và các quy định của CSĐT về đánh giá kết quả học tập.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Kế hoạch triển khai rà soát và cải tiến các quy định về đánh giá kết quả học tập; có phân công nhiệm vụ của đơn vị, cá nhân tham gia; phương thức triển khai,…",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Báo cáo phân tích việc đánh giá kết quả học tập và các quy định về đánh giá kết quả học tập của NH thể hiện sự đo lường được CĐR của CTĐT, đáp ứng nhu cầu của các BLQ.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Trang thông tin điện tử của CSĐT có thông tin về cập nhật các quy định về đánh giá kết quả học tập.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      }
    ],
    "self_check_questions": [
      "Có quy định/quy trình định kỳ rà soát hoạt động đánh giá kết quả học tập — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Việc đánh giá kết quả học tập và các quy định về đánh giá kết quả học tập được định kỳ rà soát và cải tiến để đáp ứng nhu cầu của các BLQ, — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 4.7, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có quy định/quy trình định kỳ rà soát hoạt động đánh giá kết quả học tập. Hoạt động đánh giá gồm: sự tương thí… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "5.1": {
    "short_name": "Kế hoạch phát triển đội ngũ giảng viên",
    "full_name": "Kế hoạch phát triển đội ngũ giảng viên, nghiên cứu viên tham gia chương trình đào tạo được thực hiện nhằm bảo đảm về số lượng và chất lượng đáp ứng các yêu cầu về đào tạo, nghiên cứu khoa học và kết nối phục vụ cộng đồng.",
    "dieu_kien": false,
    "requirements": [
      "Có kế hoạch phát triển đội ngũ GV, NCV cho CTĐT cụ thể, khả thi theo lộ trình với chính sách và các biện pháp phù hợp để đạt được chỉ tiêu theo kế hoạch.",
      "Kế hoạch phát triển đội ngũ GV, NCV cho CTĐT được thực hiện bảo đảm về số lượng và chất lượng, đáp ứng các yêu cầu của các phương thức đào tạo, yêu cầu về NCKH và kết nối phục vụ cộng đồng (PVCĐ)."
    ],
    "suggested_evidence": [
      {
        "name": "Hướng dẫn xây dựng và các kế hoạch ngắn hạn và dài hạn phát triển đội ngũ GV, NCV cho CTĐT (kế hoạch bao gồm: số lượng GV, NCV cần có; học hàm/học vị; nội dung, thời gian, nguồn lực) đáp ứng yêu cầu về đào tạo, NCKH và PVCĐ.",
        "type": "guideline",
        "category": "Văn bản chính sách"
      },
      {
        "name": "CSDL về GV, NCV của CTĐT từng năm trong chu kỳ KĐCLGD (danh sách bao gồm các thông tin về: cơ cấu độ tuổi, giới tính, trình độ chuyên môn, vị trí công tác của GV, NCV).",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Thống kê số NH/GV quy đổi hằng năm theo đề án tuyển sinh.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Thống kê kinh phí được đầu tư cho việc phát triển đội ngũ GV, NCV.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Báo cáo tổng kết, đánh giá kết quả thực hiện kế hoạch phát triển đội ngũ GV, NCV cho CTĐT.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      }
    ],
    "self_check_questions": [
      "Có kế hoạch phát triển đội ngũ GV, NCV cho CTĐT cụ thể, khả thi theo lộ trình với chính sách và các biện pháp phù hợp để đạt được chỉ tiêu theo kế hoạch — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Kế hoạch phát triển đội ngũ GV, NCV cho CTĐT được thực hiện bảo đảm về số lượng và chất lượng, đáp ứng các yêu cầu của các phương thức đào tạo, yêu cầu về NCKH… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 5.1, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có kế hoạch phát triển đội ngũ GV, NCV cho CTĐT cụ thể, khả thi theo lộ trình với chính sách và các biện pháp … được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "5.2": {
    "short_name": "Số lượng và chất lượng đội ngũ giảng viên",
    "full_name": "Số lượng và chất lượng đội ngũ giảng viên, nghiên cứu viên đáp ứng yêu cầu thực hiện chương trình đào tạo theo quy định; khối lượng công việc của đội ngũ giảng viên, nghiên cứu viên được đo lường, giám sát để cải tiến chất lượng đào tạo, nghiên cứu khoa học và kết nối phục vụ cộng đồng.",
    "dieu_kien": true,
    "requirements": [
      "Số lượng đội ngũ GV, NCV tham gia CTĐT đáp ứng yêu cầu theo các phương thức tổ chức CTĐT theo quy định.",
      "Chất lượng đội ngũ GV, NCV đáp ứng yêu cầu thực hiện CTĐT theo quy định.",
      "Thực hiện việc đo lường, giám sát khối lượng công việc của GV, NCV để CTCL đào tạo, NCKH và PVCĐ.",
      "Sử dụng kết quả đo lường, giám sát khối lượng, số lượng và chất lượng công việc của GV, NCV để CTCL đào tạo, NCKH và PVCĐ."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định về chế độ làm việc, định mức công việc của GV, NCV.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Bảng trích ngang thông tin về GV, NCV của CTĐT (danh sách bao gồm các thông tin về: thâm niên công tác, cơ cấu độ tuổi, giới tính, trình độ chuyên môn, học vị, học hàm, các chứng chỉ, vị trí công tác của GV, NCV).",
        "type": "official_doc",
        "category": "Hồ sơ - danh mục"
      },
      {
        "name": "Bảng thống kê số lượng thừa giờ/thiếu giờ giảng dạy, NCKH, PVCĐ của GV, NCV (bao gồm cả giờ quy đổi, nếu có).",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Bản mô tả vị trí việc làm của GV, NCV.",
        "type": "document_history",
        "category": "Hồ sơ chuyên môn"
      },
      {
        "name": "Hồ sơ cán bộ của GV, NCV.",
        "type": "official_doc",
        "category": "Hồ sơ - danh mục"
      },
      {
        "name": "Báo cáo CTCL đào tạo, NCKH và PVCĐ dựa trên kết quả đo lường, giám sát khối lượng, số lượng và chất lượng công việc của GV, NCV.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      }
    ],
    "self_check_questions": [
      "Số lượng đội ngũ GV, NCV tham gia CTĐT đáp ứng yêu cầu theo các phương thức tổ chức CTĐT theo quy định — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Chất lượng đội ngũ GV, NCV đáp ứng yêu cầu thực hiện CTĐT theo quy định — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Thực hiện việc đo lường, giám sát khối lượng công việc của GV, NCV để CTCL đào tạo, NCKH và PVCĐ — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Sử dụng kết quả đo lường, giám sát khối lượng, số lượng và chất lượng công việc của GV, NCV để CTCL đào tạo, NCKH và PVCĐ — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?",
      "Đây là TIÊU CHÍ ĐIỀU KIỆN: nếu tiêu chí này không đạt thì cả tiêu chuẩn không đạt. Hồ sơ đã đủ chắc để kết luận đạt chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 5.2, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Số lượng đội ngũ GV, NCV tham gia CTĐT đáp ứng yêu cầu theo các phương thức tổ chức CTĐT theo quy định.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "5.3": {
    "short_name": "Năng lực của đội ngũ giảng viên",
    "full_name": "Năng lực của đội ngũ giảng viên, nghiên cứu viên được xác định, được đánh giá và thông tin tới các bên có liên quan trực tiếp.",
    "dieu_kien": false,
    "requirements": [
      "Có văn bản xác định rõ năng lực của đội ngũ GV, NCV phù hợp với các quy định hiện hành",
      "Thực hiện đánh giá năng lực của đội ngũ GV, NCV.",
      "Thông tin kết quả đánh giá năng lực của đội ngũ GV, NCV tới các BLQ trực tiếp."
    ],
    "suggested_evidence": [
      {
        "name": "Bản mô tả vị trí việc làm của GV, NCV.",
        "type": "document_history",
        "category": "Hồ sơ chuyên môn"
      },
      {
        "name": "Văn bản quy định và hướng dẫn, kế hoạch đánh giá năng lực của đội ngũ GV, NCV (bao gồm bộ chỉ số đánh giá năng lực GV, NCV).",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "CSDL, kết quả đánh giá năng lực của đội ngũ GV, NCV của CTĐT được đánh giá.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Báo cáo/công văn/thông báo kết quả đánh giá năng lực của GV, NCV.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Hoạt động CTCL (đào tạo, bồi dưỡng nâng cao năng lực đội ngũ GV, NCV; đầu tư nguồn lực,…) từ kết quả đánh giá năng lực của đội ngũ GV, NCV.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      }
    ],
    "self_check_questions": [
      "Có văn bản xác định rõ năng lực của đội ngũ GV, NCV phù hợp với các quy định hiện hành — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Thực hiện đánh giá năng lực của đội ngũ GV, NCV — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Thông tin kết quả đánh giá năng lực của đội ngũ GV, NCV tới các BLQ trực tiếp — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 5.3, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có văn bản xác định rõ năng lực của đội ngũ GV, NCV phù hợp với các quy định hiện hành… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "5.4": {
    "short_name": "Giảng viên, nghiên cứu viên được phân công nhiệm vụ phù hợp với…",
    "full_name": "Giảng viên, nghiên cứu viên được phân công nhiệm vụ phù hợp với trình độ, năng lực và kinh nghiệm.",
    "dieu_kien": false,
    "requirements": [
      "GV, NCV được phân công nhiệm vụ phù hợp với trình độ, năng lực và kinh nghiệm.",
      "GV, NCV được tham khảo ý kiến khi phân công nhiệm vụ.",
      "Nhiệm vụ của GV, NCV được thông báo đến các BLQ."
    ],
    "suggested_evidence": [
      {
        "name": "Bảng mô tả công việc của GV, NCV tham gia thực hiện CTĐT.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Bảng lý lịch trích ngang đội ngũ GV, NCV tham gia thực hiện CTĐT.",
        "type": "official_doc",
        "category": "Hồ sơ - danh mục"
      },
      {
        "name": "Ý kiến phản hồi của GV, NCV về việc phân công nhiệm vụ giảng dạy, NCKH, PVCĐ.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      },
      {
        "name": "Kết quả lấy ý kiến phản hồi của GV, NCV về mức độ hài lòng với việc phân công nhiệm vụ giảng dạy, NCKH, PVCĐ.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      },
      {
        "name": "Kết quả đánh giá của NH/ bộ môn về kết quả thực hiện nhiệm vụ giảng dạy, NCKH, PVCĐ của GV, NCV.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      }
    ],
    "self_check_questions": [
      "GV, NCV được phân công nhiệm vụ phù hợp với trình độ, năng lực và kinh nghiệm — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "GV, NCV được tham khảo ý kiến khi phân công nhiệm vụ — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Nhiệm vụ của GV, NCV được thông báo đến các BLQ — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 5.4, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: GV, NCV được phân công nhiệm vụ phù hợp với trình độ, năng lực và kinh nghiệm.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "5.5": {
    "short_name": "Việc bổ nhiệm/thăng tiến của giảng viên",
    "full_name": "Việc bổ nhiệm/thăng tiến của giảng viên, nghiên cứu viên dựa trên hệ thống đánh giá năng lực, kết quả giảng dạy, thực hiện nhiệm vụ nghiên cứu khoa học và kết nối phục vụ cộng đồng",
    "dieu_kien": false,
    "requirements": [
      "Có hệ thống đánh giá năng lực để thực hiện việc bổ nhiệm/thăng tiến của GV, NCV bao gồm các quy định, điều kiện và trình tự thực hiện.",
      "Việc bổ nhiệm/thăng tiến của GV, NCV dựa trên kết quả đánh giá về năng lực, kết quả trong thực hiện các hoạt động giảng dạy, NCKH và PVCĐ."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định về việc bổ nhiệm/thăng tiến của GV, NCV.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Các hồ sơ bổ nhiệm/thăng hạng GV, NCV.",
        "type": "official_doc",
        "category": "Hồ sơ - danh mục"
      },
      {
        "name": "Văn bản quy hoạch đội ngũ GV, NCV.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Kết quả lấy ý kiến phản hồi của GV, NCV về mức độ hài lòng với việc bổ nhiệm/thăng tiến.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Có hệ thống đánh giá năng lực để thực hiện việc bổ nhiệm/thăng tiến của GV, NCV bao gồm các quy định, điều kiện và trình tự thực hiện — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Việc bổ nhiệm/thăng tiến của GV, NCV dựa trên kết quả đánh giá về năng lực, kết quả trong thực hiện các hoạt động giảng dạy, NCKH và PVCĐ — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 5.5, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có hệ thống đánh giá năng lực để thực hiện việc bổ nhiệm/thăng tiến của GV, NCV bao gồm các quy định, điều kiệ… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "5.6": {
    "short_name": "Trách nhiệm, quyền hạn và nghĩa vụ của giảng viên",
    "full_name": "Trách nhiệm, quyền hạn và nghĩa vụ của giảng viên, nghiên cứu viên được xác định rõ ràng theo quy định và được phổ biến để tất cả giảng viên, nghiên cứu viên hiểu rõ và thực hiện.",
    "dieu_kien": false,
    "requirements": [
      "Quy định về trách nhiệm, quyền và nghĩa vụ của GV, NCV phù hợp với các quy định của cơ quan quản lý cấp trên và quy định hiện hành.",
      "Thực hiện phổ biến, tuyên truyền hiệu quả về trách nhiệm, quyền và nghĩa vụ của GV, NCV để GV, NCV hiểu rõ và thực hiện."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định về trách nhiệm, quyền hạn và nghĩa vụ của GV, NCV.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Các phương thức truyền thông: Văn bản/ Sổ tay/ thông báo/ hội nghị quán triệt phổ biến; hình ảnh/pano/áp phích tuyên truyền về trách nhiệm, quyền hạn và nghĩa vụ của GV, NCV.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "Báo cáo đánh giá viên chức/người lao động trong việc thực hiện chức trách, nhiệm vụ hằng năm của GV, NCV.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Ý kiến phản hồi của GV, NCV về trách nhiệm, quyền hạn và nghĩa vụ bản thân.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Quy định về trách nhiệm, quyền và nghĩa vụ của GV, NCV phù hợp với các quy định của cơ quan quản lý cấp trên và quy định hiện hành — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Thực hiện phổ biến, tuyên truyền hiệu quả về trách nhiệm, quyền và nghĩa vụ của GV, NCV để GV, NCV hiểu rõ và thực hiện — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 5.6, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Quy định về trách nhiệm, quyền và nghĩa vụ của GV, NCV phù hợp với các quy định của cơ quan quản lý cấp trên v… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "5.7": {
    "short_name": "Nhu cầu về đào tạo, bồi dưỡng và phát triển chuyên môn của giảng…",
    "full_name": "Nhu cầu về đào tạo, bồi dưỡng và phát triển chuyên môn của giảng viên, nghiên cứu viên được xác định có tính hệ thống; các hoạt động đào tạo, bồi dưỡng được triển khai để đáp ứng nhu cầu.",
    "dieu_kien": false,
    "requirements": [
      "Nhu cầu đào tạo, bồi dưỡng và phát triển chuyên môn của GV, NCV được xác định.",
      "Xây dựng và triển khai thực hiện kế hoạch về đào tạo, bồi dưỡng và phát triển chuyên môn, nghiệp vụ của đội ngũ GV, NCV dựa trên nhu cầu của đội ngũ GV, NCV và của đơn vị đào tạo; bảo đảm GV, NCV đều được tham gia đào tạo, bồi dưỡng và phát triển chuyên môn.",
      "Đánh giá kết quả thực hiện kế hoạch đào tạo, bồi dưỡng và phát triển chuyên môn, nghiệp vụ của GV, NCV định kỳ hằng năm. Kết quả đánh giá được sử dụng để CTCL công tác đào tạo, bồi dưỡng phát triển chuyên môn."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định về quy trình và các BLQ tham gia xác định nhu cầu đào tạo, bồi dưỡng và phát triển chuyên môn của đội ngũ GV, NCV của CSĐT.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "Kế hoạch dài hạn và/ hoặc kế hoạch hằng năm về khảo sát/lấy ý kiến xác định nhu cầu đào tạo, bồi dưỡng và phát triển chuyên môn của đội ngũ GV, NCV của CSĐT /đơn vị đào tạo có CTĐT được đánh giá.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "CSDL, kết quả khảo sát CSĐT /đơn vị đào tạo có CTĐT được đánh giá; báo cáo phân tích nhu cầu đào tạo/bồi dưỡng chuyên môn, nghiệp vụ của đội ngũ GV, NCV.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "Quyết định cử GV, NCV đi đào tạo, bồi dưỡng; các văn bằng/chứng chỉ/chứng nhận của GV, NCV được đào tạo, bồi dưỡng.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "Bảng thống kê danh sách đội ngũ GV, NCV tham gia thực hiện CTĐT được đào tạo, bồi dưỡng chuyên môn nghiệp vụ hằng năm.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "Bảng thống kê kinh phí hằng năm cho đào tạo, bồi dưỡng đội ngũ GV, NCV tham gia thực hiện CTĐT.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "Báo cáo tổng kết, đánh giá công tác đào tạo, bồi dưỡng chuyên môn nghiệp vụ hằng năm cho đội ngũ GV, NCV/ đội ngũ GV, NCV tham gia thực hiện CTĐT.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      }
    ],
    "self_check_questions": [
      "Nhu cầu đào tạo, bồi dưỡng và phát triển chuyên môn của GV, NCV được xác định — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Xây dựng và triển khai thực hiện kế hoạch về đào tạo, bồi dưỡng và phát triển chuyên môn, nghiệp vụ của đội ngũ GV, NCV dựa trên nhu cầu của đội ngũ GV, NCV và… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Đánh giá kết quả thực hiện kế hoạch đào tạo, bồi dưỡng và phát triển chuyên môn, nghiệp vụ của GV, NCV định kỳ hằng năm — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 5.7, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Nhu cầu đào tạo, bồi dưỡng và phát triển chuyên môn của GV, NCV được xác định.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "5.8": {
    "short_name": "Công tác quản lý để đánh giá chất lượng giảng dạy",
    "full_name": "Công tác quản lý để đánh giá chất lượng giảng dạy, nghiên cứu khoa học và phục vụ cộng đồng của giảng viên, nghiên cứu viên bao gồm cả việc khen thưởng và công nhận được triển khai theo quy định, quy trình cụ thể.",
    "dieu_kien": false,
    "requirements": [
      "Có quy định, quy trình, tiêu chí đánh giá chất lượng công việc của GV, NCV dựa trên kết quả giảng dạy, NCKH và PVCĐ.",
      "Thực hiện việc đánh giá chất lượng giảng dạy, NCKH và PVCĐ của GV, NCV.",
      "Kết quả đánh giá chất lượng giảng dạy, NCKH và PVCĐ của GV, NCV được sử dụng để khen thưởng và công nhận.",
      "GV, NCV được thông tin về kết quả đánh giá công việc; được tham gia vào quá trình xây dựng rà soát quy trình quy định và các chính sách nhân sự liên quan của CSĐT."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định về đánh giá chất lượng giảng dạy, NCKH và PVCĐ của GV, NCV.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Kế hoạch triển khai đánh giá chất lượng giảng dạy, NCKH và PVCĐ của GV, NCV.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Báo cáo kết quả đánh giá chất lượng giảng dạy, NCKH và PVCĐ của GV, NCV (đánh giá chất lượng giảng dạy của NCV nếu NCV có giảng dạy).",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Quy định về thi đua khen thưởng của CSĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Các quyết định thi đua, khen thưởng, kỷ luật của GV, NCV tham gia thực hiện CTĐT trong chu kỳ KĐCLGD.",
        "type": "decision",
        "category": "Văn bản chính sách"
      }
    ],
    "self_check_questions": [
      "Có quy định, quy trình, tiêu chí đánh giá chất lượng công việc của GV, NCV dựa trên kết quả giảng dạy, NCKH và PVCĐ — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Thực hiện việc đánh giá chất lượng giảng dạy, NCKH và PVCĐ của GV, NCV — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Kết quả đánh giá chất lượng giảng dạy, NCKH và PVCĐ của GV, NCV được sử dụng để khen thưởng và công nhận — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "GV, NCV được thông tin về kết quả đánh giá công việc; được tham gia vào quá trình xây dựng rà soát quy trình quy định và các chính sách nhân sự liên quan của CSĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 5.8, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có quy định, quy trình, tiêu chí đánh giá chất lượng công việc của GV, NCV dựa trên kết quả giảng dạy, NCKH và… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "6.1": {
    "short_name": "Chính sách, tiêu chí và quy trình tuyển sinh được xác định rõ rà…",
    "full_name": "Chính sách, tiêu chí và quy trình tuyển sinh được xác định rõ ràng theo yêu cầu của chương trình đào tạo; được công bố công khai và được cập nhật.",
    "dieu_kien": true,
    "requirements": [
      "Chính sách, tiêu chí và quy trình tuyển sinh rõ ràng, đáp ứng các quy định hiện hành và theo yêu cầu của chương trình đào tạo, bao gồm yêu cầu về các kỹ năng cần thiết để NH được tiếp nhận vào khóa học trực tuyến (nếu có).",
      "Chính sách, tiêu chí và quy trình tuyển sinh của CTĐT được đánh giá và cập nhật và có sự tham gia của các BLQ.",
      "Chính sách, tiêu chí và quy trình tuyển sinh được công bố công khai theo quy định để các BLQ dễ dàng tiếp cận."
    ],
    "suggested_evidence": [
      {
        "name": "Đề án/chính sách tuyển sinh hằng năm (bao gồm chính sách ưu tiên, tổ chức tuyển sinh, nhiệm vụ quyền hạn của CSĐT trong tuyển sinh và các quy định liên quan).",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Thông tin về các yêu cầu về các kỹ năng cần thiết để NH được tiếp nhận vào khóa học có đào tạo trực tuyến.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Quy chế/kế hoạch/phương thức tuyển sinh hằng năm của CSĐT liên quan CTĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Quyết định mở ngành/CTĐT được đánh giá đã ban hành.",
        "type": "decision",
        "category": "Văn bản chính sách"
      },
      {
        "name": "CSDL, thống kê kết quả tuyển sinh liên quan đến CTĐT.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Báo cáo phân tích và dự báo nhu cầu nhân lực hằng năm liên quan đến CTĐT (do cơ CSĐT /CTĐT, đối tác hay một đơn vị độc lập thực hiện).",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Các thông báo/kế hoạch tuyển sinh, tờ rơi, trang thông tin điện tử của CSĐT/đơn vị đào tạo có CTĐT được đánh giá.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Báo cáo tổng kết kết quả tuyển sinh hằng năm liên quan đến CTĐT.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      }
    ],
    "self_check_questions": [
      "Chính sách, tiêu chí và quy trình tuyển sinh rõ ràng, đáp ứng các quy định hiện hành và theo yêu cầu của chương trình đào tạo, bao gồm yêu cầu về các kỹ năng cần… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Chính sách, tiêu chí và quy trình tuyển sinh của CTĐT được đánh giá và cập nhật và có sự tham gia của các BLQ — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Chính sách, tiêu chí và quy trình tuyển sinh được công bố công khai theo quy định để các BLQ dễ dàng tiếp cận — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?",
      "Đây là TIÊU CHÍ ĐIỀU KIỆN: nếu tiêu chí này không đạt thì cả tiêu chuẩn không đạt. Hồ sơ đã đủ chắc để kết luận đạt chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 6.1, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Chính sách, tiêu chí và quy trình tuyển sinh rõ ràng, đáp ứng các quy định hiện hành và theo yêu cầu của chươn… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "6.2": {
    "short_name": "Năng lực của đội ngũ cung cấp dịch vụ hỗ trợ được xác định rõ rà…",
    "full_name": "Năng lực của đội ngũ cung cấp dịch vụ hỗ trợ được xác định rõ ràng trong tiêu chuẩn của vị trí việc làm, tiêu chí tuyển dụng, trong phân công nhiệm vụ và được đánh giá để bảo đảm phù hợp với nhu cầu của các bên liên quan.",
    "dieu_kien": false,
    "requirements": [
      "Năng lực của đội ngũ cung cấp dịch vụ hỗ trợ, trong đó có đội ngũ cung cấp dịch vụ hỗ trợ đào tạo trực tuyến, bao gồm nhân viên, chuyên viên, kỹ thuật viên được xác định rõ ràng trong các tiêu chí tuyển dụng. Đội ngũ cung cấp dịch vụ hỗ trợ hiểu rõ năng lực cần có của vị trí việc làm.",
      "Việc phân công nhiệm vụ cho đội ngũ cung cấp dịch vụ hỗ trợ bảo đảm theo năng lực.",
      "Năng lực của đội ngũ cung cấp dịch vụ hỗ trợ được đánh giá để bảo đảm phù hợp với yêu cầu của vị trí việc làm và nhu cầu của các BLQ."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định/ hướng dẫn/tiêu chí tuyển dụng đánh giá năng lực của đội ngũ nhân viên, chuyên viên, kỹ thuật viên cung cấp dịch vụ hỗ trợ đào tạo trực tiếp và đào tạo trực tuyến.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Bản mô tả công việc của đội ngũ nhân viên, chuyên viên, kỹ thuật viên cung cấp dịch vụ hỗ trợ.",
        "type": "document_history",
        "category": "Hồ sơ chuyên môn"
      },
      {
        "name": "Trang thông tin điện tử, văn bản công khai tiêu chí tuyển dụng, phân công nhiệm vụ đội ngũ nhân viên, chuyên viên, kỹ thuật viên cung cấp dịch vụ hỗ trợ.",
        "type": "website",
        "category": "Truyền thông"
      },
      {
        "name": "Kết quả đánh giá hằng năm về thực hiện nhiệm vụ của đội ngũ nhân viên, chuyên viên, kỹ thuật viên cung cấp dịch vụ hỗ trợ.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Ý kiến phản hồi của các BLQ bên trong về đội ngũ nhân viên, chuyên viên, kỹ thuật viên cung cấp dịch vụ hỗ trợ.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Năng lực của đội ngũ cung cấp dịch vụ hỗ trợ, trong đó có đội ngũ cung cấp dịch vụ hỗ trợ đào tạo trực tuyến, bao gồm nhân viên, chuyên viên, kỹ thuật viên được… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Việc phân công nhiệm vụ cho đội ngũ cung cấp dịch vụ hỗ trợ bảo đảm theo năng lực — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Năng lực của đội ngũ cung cấp dịch vụ hỗ trợ được đánh giá để bảo đảm phù hợp với yêu cầu của vị trí việc làm và nhu cầu của các BLQ — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 6.2, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Năng lực của đội ngũ cung cấp dịch vụ hỗ trợ, trong đó có đội ngũ cung cấp dịch vụ hỗ trợ đào tạo trực tuyến, … được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "6.3": {
    "short_name": "Kế hoạch ngắn hạn và dài hạn đối với dịch vụ hỗ trợ người học (h…",
    "full_name": "Kế hoạch ngắn hạn và dài hạn đối với dịch vụ hỗ trợ người học (học thuật và phi học thuật) được xây dựng, triển khai thực hiện để bảo đảm đáp ứng đầy đủ và có chất lượng các dịch vụ hỗ trợ đào tạo, nghiên cứu khoa học và kết nối phục vụ cộng đồng.",
    "dieu_kien": false,
    "requirements": [
      "Kế hoạch ngắn hạn và dài hạn đối với các dịch vụ hỗ trợ NH về học thuật và phi học thuật xác định rõ theo từng loại dịch vụ hỗ trợ; quy định cụ thể đơn vị/bộ phận, cá nhân phụ trách các nội dung liên quan; tiến độ thực hiện và các chỉ tiêu cần đạt.",
      "Các dịch vụ hỗ trợ NH về học thuật và phi học thuật được triển khai thực hiện để bảo đảm đáp ứng đầy đủ và có chất lượng các dịch vụ đào tạo, NCKH và PVCĐ.",
      "Đội ngũ cung cấp dịch vụ hỗ trợ NH được đào tạo, bồi dưỡng để bảo đảm chất lượng dịch vụ này."
    ],
    "suggested_evidence": [
      {
        "name": "Các kế hoạch dài hạn, ngắn hạn về các dịch vụ hỗ trợ NH.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Văn bản thành lập/phân công đơn vị/tổ chức phụ trách các hoạt động dịch vụ hỗ trợ NH (học thuật và phi học thuật).",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "CSDL về các hoạt động dịch vụ hỗ trợ NH trong chu kỳ KĐCLGD.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Thống kê kinh phí chi cho các hoạt động dịch vụ hỗ trợ NH trong chu kỳ KĐCLGD.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Báo cáo tổng kết hằng năm về các hoạt động dịch vụ hỗ trợ NH (học thuật và phi học thuật).",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Ý kiến phản hồi của NH về các hoạt động dịch vụ hỗ trợ NH (học thuật và phi học thuật).",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Kế hoạch ngắn hạn và dài hạn đối với các dịch vụ hỗ trợ NH về học thuật và phi học thuật xác định rõ theo từng loại dịch vụ hỗ trợ; quy định cụ thể đơn vị/bộ… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các dịch vụ hỗ trợ NH về học thuật và phi học thuật được triển khai thực hiện để bảo đảm đáp ứng đầy đủ và có chất lượng các dịch vụ đào tạo, NCKH và PVCĐ — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Đội ngũ cung cấp dịch vụ hỗ trợ NH được đào tạo, bồi dưỡng để bảo đảm chất lượng dịch vụ này — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 6.3, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Kế hoạch ngắn hạn và dài hạn đối với các dịch vụ hỗ trợ NH về học thuật và phi học thuật xác định rõ theo từng… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "6.4": {
    "short_name": "Có hệ thống quản lý đào tạo phù hợp để giám sát",
    "full_name": "Có hệ thống quản lý đào tạo phù hợp để giám sát, ghi nhận được tiến độ, kết quả học tập và khối lượng học tập của người học; việc phản hồi cho người học và hoạt động khắc phục bất cập được triển khai kịp thời và giúp người học cải thiện việc học tập.",
    "dieu_kien": false,
    "requirements": [
      "CTĐT có hệ thống quản lý đào tạo phù hợp để giám sát, ghi nhận được tiến độ, kết quả học tập và khối lượng học tập của NH trong tiến trình học tập.",
      "Các đơn vị/bộ phận phụ trách giám sát, theo dõi tiến độ học tập của NH phối hợp hiệu quả.",
      "Các phản hồi và thông tin được thực hiện kịp thời dựa trên CSDL về tiến độ học tập của NH, giúp NH cải thiện việc học tập và kết quả học tập."
    ],
    "suggested_evidence": [
      {
        "name": "Quyết định thành lập/phân công đơn vị/bộ phận phụ trách giám sát, theo dõi tiến độ học tập của NH.",
        "type": "decision",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Quy chế/quy định về hoạt động đào tạo, kiểm tra đánh giá của CSĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Quy chế/quy định về công tác cố vấn học tập của CSĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "CSDL về tiến độ học tập của NH (học lại, ngừng học, thôi học,…) trong chu kỳ KĐCLGD.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Ý kiến phản hồi của NH về hệ thống giám sát, ghi nhận tiến độ, kết quả học tập, khối lượng học tập và việc phản hồi.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "CTĐT có hệ thống quản lý đào tạo phù hợp để giám sát, ghi nhận được tiến độ, kết quả học tập và khối lượng học tập của NH trong tiến trình học tập — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các đơn vị/bộ phận phụ trách giám sát, theo dõi tiến độ học tập của NH phối hợp hiệu quả — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các phản hồi và thông tin được thực hiện kịp thời dựa trên CSDL về tiến độ học tập của NH, giúp NH cải thiện việc học tập và kết quả học tập — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 6.4, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: CTĐT có hệ thống quản lý đào tạo phù hợp để giám sát, ghi nhận được tiến độ, kết quả học tập và khối lượng học… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "6.5": {
    "short_name": "Có các hoạt động tư vấn học tập",
    "full_name": "Có các hoạt động tư vấn học tập, hoạt động ngoại khóa, các cuộc thi và các dịch vụ hỗ trợ khác để giúp cải thiện việc học tập và tăng khả năng có việc làm của người học.",
    "dieu_kien": false,
    "requirements": [
      "CTĐT triển khai các hoạt động tư vấn học tập, hoạt động ngoại khóa, các cuộc thi và các dịch vụ hỗ trợ khác có liên quan giúp cải thiện việc học tập của NH và khả năng có việc làm của NH tốt nghiệp.",
      "Kế hoạch thực hiện các hoạt động tư vấn học tập, hoạt động ngoại khóa, các cuộc thi và các dịch vụ hỗ trợ xác định rõ từng loại hoạt động cần thực hiện, và quy định cụ thể đơn vị, bộ phận, cá nhân phụ trách các nội dung, xác định tiến độ thực hiện, và các chỉ tiêu cần đạt.",
      "CTĐT sử dụng các nền tảng kỹ thuật số hỗ trợ tư vấn học tập và trải nghiệm của NH trong phương thức và hoạt động đào tạo trực tuyến.",
      "Thông tin đầy đủ, cập nhật về các hoạt động tư vấn học tập, hoạt động ngoại khóa, các cuộc thi và các dịch vụ hỗ trợ khác, tạo điều kiện để NH dễ dàng tiếp cận để giúp cải thiện việc học tập và khả năng có việc làm của bản thân."
    ],
    "suggested_evidence": [
      {
        "name": "Quy định về việc triển khai các hoạt động tư vấn học tập, hoạt động ngoại khóa, các cuộc thi và các dịch vụ hỗ trợ của CSĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Các kế hoạch về hoạt động tư vấn học tập, hoạt động ngoại khóa, các cuộc thi và các dịch vụ hỗ trợ.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Các nền tảng kỹ thuật số hỗ trợ tư vấn học tập và trải nghiệm của NH trong đào tạo trực tuyến.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "CSDL về các hoạt động tư vấn học tập, hoạt động ngoại khóa, các cuộc thi và các dịch vụ hỗ trợ, tình trạng việc làm của NH tốt nghiệp.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Ý kiến phản hồi của NH về các hoạt động tư vấn học tập, hoạt động ngoại khóa, các cuộc thi và các dịch vụ hỗ trợ.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "CTĐT triển khai các hoạt động tư vấn học tập, hoạt động ngoại khóa, các cuộc thi và các dịch vụ hỗ trợ khác có liên quan giúp cải thiện việc học tập của NH và… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Kế hoạch thực hiện các hoạt động tư vấn học tập, hoạt động ngoại khóa, các cuộc thi và các dịch vụ hỗ trợ xác định rõ từng loại hoạt động cần thực hiện, và quy… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "CTĐT sử dụng các nền tảng kỹ thuật số hỗ trợ tư vấn học tập và trải nghiệm của NH trong phương thức và hoạt động đào tạo trực tuyến — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Thông tin đầy đủ, cập nhật về các hoạt động tư vấn học tập, hoạt động ngoại khóa, các cuộc thi và các dịch vụ hỗ trợ khác, tạo điều kiện để NH dễ dàng tiếp cận… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 6.5, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: CTĐT triển khai các hoạt động tư vấn học tập, hoạt động ngoại khóa, các cuộc thi và các dịch vụ hỗ trợ khác có… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "6.6": {
    "short_name": "Các dịch vụ hỗ trợ người học được định kỳ đánh giá",
    "full_name": "Các dịch vụ hỗ trợ người học được định kỳ đánh giá, đối sánh và cải tiến chất lượng.",
    "dieu_kien": false,
    "requirements": [
      "Có các quy định, tiêu chí định kỳ đánh giá, đối sánh và CTCL các dịch vụ hỗ trợ NH.",
      "Thực hiện kế hoạch đánh giá, đối sánh định kỳ các dịch vụ hỗ trợ NH.",
      "Kết quả đánh giá được thông tin đến các BLQ và sử dụng trong việc định kỳ CTCL và giám sát việc thực hiện kế hoạch."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định về đánh giá chất lượng các dịch vụ hỗ trợ NH.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "CSDL về đánh giá/phân tích/đối sánh các dịch vụ hỗ trợ NH.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      },
      {
        "name": "Báo cáo có nội dung, thông tin về kết quả CTCL các dịch vụ hỗ trợ NH.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Ý kiến phản hồi của các BLQ bên trong về các hoạt động dịch vụ hỗ trợ NH.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Có các quy định, tiêu chí định kỳ đánh giá, đối sánh và CTCL các dịch vụ hỗ trợ NH — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Thực hiện kế hoạch đánh giá, đối sánh định kỳ các dịch vụ hỗ trợ NH — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Kết quả đánh giá được thông tin đến các BLQ và sử dụng trong việc định kỳ CTCL và giám sát việc thực hiện kế hoạch — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 6.6, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có các quy định, tiêu chí định kỳ đánh giá, đối sánh và CTCL các dịch vụ hỗ trợ NH.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "7.1": {
    "short_name": "Có hệ thống phòng làm việc, phòng học và các phòng chức năng với…",
    "full_name": "Có hệ thống phòng làm việc, phòng học và các phòng chức năng với các trang thiết bị phù hợp để triển khai chương trình đào tạo, hỗ trợ triển khai hoạt động đào tạo, nghiên cứu khoa học và kết nối phục vụ cộng đồng.",
    "dieu_kien": false,
    "requirements": [
      "Có chính sách để bảo đảm chất lượng cơ sở vật chất, có đủ hệ thống phòng làm việc, phòng học, phòng học trực tuyến, phòng đa phương tiện và các phòng chức năng phù hợp và bảo đảm tỷ lệ diện tích/NH theo quy định để triển khai CTĐT, để hỗ trợ triển khai hoạt động đào tạo, NCKH và PVCĐ.",
      "Hệ thống phòng làm việc, phòng học, phòng học trực tuyến, phòng đa phương tiện và các phòng chức năng có đầy đủ trang thiết bị phù hợp đáp ứng yêu cầu triển khai chương trình đào tạo và để hỗ trợ triển khai hiệu quả hoạt động đào tạo, NCKH và PVCĐ."
    ],
    "suggested_evidence": [
      {
        "name": "Thống kê diện tích phòng làm việc, phòng học và các phòng chức năng, … làm căn cứ xác định tỷ lệ diện tích/ NH của CSĐT.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Sơ đồ hệ thống phòng làm việc, phòng học và các phòng chức năng.",
        "type": "visual",
        "category": "Sơ đồ - bản vẽ"
      },
      {
        "name": "Sổ theo dõi/nhật ký sử dụng phòng học, phòng chức năng.",
        "type": "official_doc",
        "category": "Hồ sơ - danh mục"
      },
      {
        "name": "Danh mục cơ sở vật chất, trang thiết bị của các phòng làm việc, phòng học và các phòng chức năng.",
        "type": "official_doc",
        "category": "Hồ sơ - danh mục"
      },
      {
        "name": "Kế hoạch mua mới và nâng cấp cơ sở vật chất, trang thiết bị hằng năm.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Kinh phí đầu tư cơ sở vật chất và trang thiết bị hằng năm (chứng từ và hồ sơ quyết toán theo quy định).",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Ý kiến của NH và GV về phòng làm việc, phòng học và các phòng chức năng và cơ sở vật chất, trang thiết bị đi kèm.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Có chính sách để bảo đảm chất lượng cơ sở vật chất, có đủ hệ thống phòng làm việc, phòng học, phòng học trực tuyến, phòng đa phương tiện và các phòng chức năng… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Hệ thống phòng làm việc, phòng học, phòng học trực tuyến, phòng đa phương tiện và các phòng chức năng có đầy đủ trang thiết bị phù hợp đáp ứng yêu cầu triển khai… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 7.1, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có chính sách để bảo đảm chất lượng cơ sở vật chất, có đủ hệ thống phòng làm việc, phòng học, phòng học trực t… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "7.2": {
    "short_name": "Các phòng thí nghiệm, phòng thực hành và trang thiết bị đầy đủ t…",
    "full_name": "Các phòng thí nghiệm, phòng thực hành và trang thiết bị đầy đủ theo yêu cầu của chương trình đào tạo, được cập nhật, được sử dụng hiệu quả đáp ứng yêu cầu của người học, giảng viên và nghiên cứu viên.",
    "dieu_kien": false,
    "requirements": [
      "Phòng thí nghiệm, phòng thực hành có đầy đủ các trang thiết bị phù hợp đáp ứng yêu cầu của CTĐT.",
      "Phòng thí nghiệm, thực hành và các trang thiết bị đáp ứng tiêu chuẩn về môi trường, sức khoẻ, an toàn; được duy tu/bảo dưỡng và cập nhật/nâng cấp để sử dụng có hiệu quả đáp ứng yêu cầu của NH và GV của CTĐT.",
      "Phần mềm dùng cho thí nghiệm, thực hành trong đào tạo trực tuyến phải đáp ứng các yêu cầu về bản quyền."
    ],
    "suggested_evidence": [
      {
        "name": "Sơ đồ phòng thí nghiệm, phòng thực hành (hoặc các khu vực được bố trí dành cho thí nghiệm, thực hành với tên gọi khác, như trại thực nghiệm, trạm quan trắc, …).",
        "type": "visual",
        "category": "Sơ đồ - bản vẽ"
      },
      {
        "name": "Sổ theo dõi/nhật ký sử dụng phòng thí nghiệm, phòng thực hành và trang thiết bị.",
        "type": "official_doc",
        "category": "Hồ sơ - danh mục"
      },
      {
        "name": "Thống kê danh mục trang thiết bị của phòng thí nghiệm, phòng thực hành phục vụ đào tạo và NCKH của CTĐT.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Tài liệu hướng dẫn, quy định của phòng thí nghiệm, phòng thực hành.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Bảng tổng hợp kinh phí đã đầu tư mua sắm, sửa chữa, bảo dưỡng trang thiết bị.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Bản tổng hợp về việc sử dụng trang thiết bị (tần suất sử dụng, thời gian hoạt động, số giờ vận hành…).",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Thông tin về các phần mềm dùng cho thí nghiệm, thực hành trong đào tạo trực tuyến.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Ý kiến của NH và GV về phòng thí nghiệm, phòng thực hành và các trang thiết bị.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Phòng thí nghiệm, phòng thực hành có đầy đủ các trang thiết bị phù hợp đáp ứng yêu cầu của CTĐT — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Phòng thí nghiệm, thực hành và các trang thiết bị đáp ứng tiêu chuẩn về môi trường, sức khoẻ, an toàn; được duy tu/bảo dưỡng và cập nhật/nâng cấp để sử dụng có… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Phần mềm dùng cho thí nghiệm, thực hành trong đào tạo trực tuyến phải đáp ứng các yêu cầu về bản quyền — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 7.2, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Phòng thí nghiệm, phòng thực hành có đầy đủ các trang thiết bị phù hợp đáp ứng yêu cầu của CTĐT.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "7.3": {
    "short_name": "Có thư viện, thư viện số và nguồn học liệu được cập nhật đáp ứng…",
    "full_name": "Có thư viện, thư viện số và nguồn học liệu được cập nhật đáp ứng nhu cầu đào tạo, nghiên cứu khoa học, có cập nhật tiến bộ về công nghệ thông tin - truyền thông.",
    "dieu_kien": true,
    "requirements": [
      "Có chính sách/hệ thống bảo đảm chất lượng của thư viện với phòng đọc và các nguồn học liệu được cập nhật đáp ứng nhu cầu đào tạo, NCKH và PVCĐ.",
      "Các nguồn học liệu, học liệu số đáp ứng nhu cầu đào tạo, NCKH và PVCĐ và có cập nhật tiến bộ về công nghệ thông tin - truyền thông và tuân thủ quy định về bản quyền."
    ],
    "suggested_evidence": [
      {
        "name": "Sơ đồ bố trí thư viện và các phòng đọc.",
        "type": "visual",
        "category": "Sơ đồ - bản vẽ"
      },
      {
        "name": "Thống kê danh mục sách, giáo trình, tài liệu, học liệu phục vụ CTĐT; số lượng giáo trình, tài liệu, sách tham khảo được cập nhật hàng năm.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Quy định, hướng dẫn sử dụng thư viện và thư viện số của CSĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Hệ thống theo dõi việc sử dụng tài liệu của thư viện và thư viện số.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Chứng từ thanh quyết toán các khoản đầu tư cho thư viện (sách, báo, tạp chí, tài liệu, …).",
        "type": "official_doc",
        "category": "Tài chính - hợp đồng"
      },
      {
        "name": "Ý kiến của NH, GV về mức độ phù hợp của thư viện, thư viện số và các nguồn học liệu trong việc hỗ trợ các hoạt động đào tạo, NCKH và PVCĐ hàng năm.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      },
      {
        "name": "Dữ liệu theo dõi hoạt động của thư viện, thư viện số để hỗ trợ các hoạt động đào tạo, NCKH và PVCĐ.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      }
    ],
    "self_check_questions": [
      "Có chính sách/hệ thống bảo đảm chất lượng của thư viện với phòng đọc và các nguồn học liệu được cập nhật đáp ứng nhu cầu đào tạo, NCKH và PVCĐ — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các nguồn học liệu, học liệu số đáp ứng nhu cầu đào tạo, NCKH và PVCĐ và có cập nhật tiến bộ về công nghệ thông tin - truyền thông và tuân thủ quy định về bản quyền — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?",
      "Đây là TIÊU CHÍ ĐIỀU KIỆN: nếu tiêu chí này không đạt thì cả tiêu chuẩn không đạt. Hồ sơ đã đủ chắc để kết luận đạt chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 7.3, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có chính sách/hệ thống bảo đảm chất lượng của thư viện với phòng đọc và các nguồn học liệu được cập nhật đáp ứ… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "7.4": {
    "short_name": "Có hệ thống công nghệ thông tin",
    "full_name": "Có hệ thống công nghệ thông tin, hạ tầng mạng và máy tính dễ dàng tiếp cận và sử dụng, đáp ứng nhu cầu của người học, giảng viên, nghiên cứu viên, đội ngũ quản lý và nhân viên trong các hoạt động giảng dạy, nghiên cứu khoa học, kết nối phục vụ cộng đồng và quản lý hành chính.",
    "dieu_kien": false,
    "requirements": [
      "Hệ thống CNTT với hệ thống máy tính và các phần mềm chuyên dụng theo yêu cầu của chương trình đào tạo, hệ thống mạng internet, hệ thống học trực tuyến, trang thông tin điện tử đáp ứng nhu cầu khai thác CNTT phục vụ các hoạt động giảng dạy, học tập và NCKH của NH, GV, NCV.",
      "Hệ thống CNTT với hệ thống máy tính, phần cứng, các phần mềm quản lý, phần mềm chuyên dụng, hệ thống mạng internet, trang thông tin điện tử đáp ứng nhu cầu phục vụ quản lý hành chính của đội ngũ quản lý, nhân viên.",
      "Hệ thống hạ tầng mạng và máy tính với các phần mềm đáp ứng nhu cầu của người sử dụng để khai thác CNTT phục vụ các hoạt động PVCĐ.",
      "Có các hướng dẫn giúp lựa chọn công nghệ phù hợp nhu cầu học tập và điều kiện học tập của NH trong học tập trực tuyến."
    ],
    "suggested_evidence": [
      {
        "name": "Thống kê hệ thống máy tính, phần cứng, phần mềm, các thông số hệ thống CNTT (bao gồm cả hạ tầng CNTT) và các thiết bị CNTT.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Trang thông tin điện tử của CSĐT /đơn vị đào tạo có CTĐT được đánh giá.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Sơ đồ, bố trí hệ thống phòng họp trực tuyến.",
        "type": "visual",
        "category": "Sơ đồ - bản vẽ"
      },
      {
        "name": "Phân tích mức độ đáp ứng hệ thống CNTT, hạ tầng mạng và máy tính đối với nhu cầu của NH, GV, NCV, đội ngũ quản lý và NV trong các hoạt động giảng dạy, NCKH, PVCĐ và quản lý.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Ý kiến của NH, GV, NCV, cán bộ quản lý, nhân viên về mức độ đáp ứng của hệ thống CNTT trong việc hỗ trợ các hoạt động đào tạo và NCKH.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      },
      {
        "name": "Hướng dẫn/Cẩm nang/Sổ tay công nghệ và học tập trực tuyến.",
        "type": "guideline",
        "category": "Văn bản chính sách"
      }
    ],
    "self_check_questions": [
      "Hệ thống CNTT với hệ thống máy tính và các phần mềm chuyên dụng theo yêu cầu của chương trình đào tạo, hệ thống mạng internet, hệ thống học trực tuyến, trang… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Hệ thống CNTT với hệ thống máy tính, phần cứng, các phần mềm quản lý, phần mềm chuyên dụng, hệ thống mạng internet, trang thông tin điện tử đáp ứng nhu cầu phục… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Hệ thống hạ tầng mạng và máy tính với các phần mềm đáp ứng nhu cầu của người sử dụng để khai thác CNTT phục vụ các hoạt động PVCĐ — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Có các hướng dẫn giúp lựa chọn công nghệ phù hợp nhu cầu học tập và điều kiện học tập của NH trong học tập trực tuyến — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 7.4, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Hệ thống CNTT với hệ thống máy tính và các phần mềm chuyên dụng theo yêu cầu của chương trình đào tạo, hệ thốn… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "7.5": {
    "short_name": "Môi trường tâm lý, xã hội và cảnh quan thiên nhiên tạo thuận lợi…",
    "full_name": "Môi trường tâm lý, xã hội và cảnh quan thiên nhiên tạo thuận lợi cho hoạt động đào tạo, nghiên cứu khoa học và sự thoải mái cho người học.",
    "dieu_kien": false,
    "requirements": [
      "Môi trường tâm lý, giao tiếp thân thiện, tạo không khí thoải mái để thực hiện hoạt động giảng dạy, học tập và NCKH.",
      "Môi trường tương tác ảo (trực tuyến) được bảo đảm để tạo không khí thoải mái, đáp ứng nhu cầu của NH và GV để thực hiện hiệu quả hoạt động giảng dạy, học tập trực tuyến.",
      "Cảnh quan thiên nhiên tạo thuận lợi cho hoạt động đào tạo, NCKH và sự thoải mái cho NH."
    ],
    "suggested_evidence": [
      {
        "name": "Sơ đồ bố trí khu làm việc, giảng đường, các phòng/khoa, hội trường, thư viện, khu thực hành, thực tập, ký túc xá.",
        "type": "visual",
        "category": "Sơ đồ - bản vẽ"
      },
      {
        "name": "Khu vực công cộng, vườn hoa, cây cảnh, pano áp phích, bảng hiệu, đường đi lại trong khuôn viên của CSĐT.",
        "type": "website",
        "category": "Truyền thông"
      },
      {
        "name": "Nội quy/quy tắc ứng xử/giao tiếp của NH, viên chức, người lao động của CSĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Phương tiện, phương thức giao tiếp trực tuyến: email, fanpage, phần mềm tác vụ,…",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Các câu lạc bộ hoạt động ngoại khóa dành cho NH.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Các hoạt động của công đoàn, đoàn thanh niên, hội SV, các câu lạc bộ chuyên đề.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Ngân sách được phân bổ cho việc thực hiện các tiêu chuẩn về môi trường tâm lý, xã hội và cảnh quan thiên nhiên.",
        "type": "official_doc",
        "category": "Tài chính - hợp đồng"
      },
      {
        "name": "Ý kiến phản hồi của NH, GV về môi trường tương tác ảo (trực tuyến).",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      },
      {
        "name": "Ý kiến phản hồi của NH, GV, cán bộ quản lý, nhân viên về môi trường tâm lý, xã hội và cảnh quan trong CSĐT.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Môi trường tâm lý, giao tiếp thân thiện, tạo không khí thoải mái để thực hiện hoạt động giảng dạy, học tập và NCKH — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Môi trường tương tác ảo (trực tuyến) được bảo đảm để tạo không khí thoải mái, đáp ứng nhu cầu của NH và GV để thực hiện hiệu quả hoạt động giảng dạy, học tập… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Cảnh quan thiên nhiên tạo thuận lợi cho hoạt động đào tạo, NCKH và sự thoải mái cho NH — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 7.5, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Môi trường tâm lý, giao tiếp thân thiện, tạo không khí thoải mái để thực hiện hoạt động giảng dạy, học tập và … được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "7.6": {
    "short_name": "Các tiêu chuẩn về môi trường",
    "full_name": "Các tiêu chuẩn về môi trường, sức khỏe, an toàn được xác định và triển khai có lưu ý đến các nhu cầu của các nhóm người học đặc thù, chuyên biệt (nếu có).",
    "dieu_kien": false,
    "requirements": [
      "Có quy định và tiêu chuẩn về môi trường, sức khoẻ và an toàn; có kế hoạch triển khai tiêu chuẩn về môi trường, sức khoẻ, trong đó có lưu ý đến nhu cầu của nhóm NH chuyên biệt, đặc thù.",
      "Xác định và triển khai tiêu chuẩn về sức khỏe và an toàn, gồm tiêu chuẩn về sức khỏe và an toàn trong đào tạo trực tuyến, trong đó có lưu ý đến nhu cầu của nhóm NH chuyên biệt, đặc thù."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định liên quan đến các tiêu chuẩn về môi trường, sức khỏe/y tế và an toàn theo quy định hiện hành có lưu ý đến nhu cầu của NH trực tuyến và nhóm NH đặc thù.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Các hoạt động theo tiêu chuẩn về môi trường, sức khỏe và an toàn trong CSĐT (bao gồm xử lý chất thải, rác thải sinh hoạt; chất thải, rác thải y tế; chất thải phòng thí nghiệm, chất thải độc hại,...).",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Hệ thống phòng cháy chữa cháy, phòng chống thiên tai, việc bảo đảm an ninh và an toàn trong khuôn viên CSĐT, ký túc xá.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Hoạt động chăm sóc sức khỏe thể chất, tâm lý, sinh lý cho NH và viên chức, người lao động (khám sức khỏe định kỳ cho viên chức, người lao động, bảo hiểm y tế của NH, hoạt động của phòng y tế …).",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Các cơ sở vật chất và trang thiết bị đáp ứng nhu cầu của các nhóm NH đặc thù.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Ý kiến của NH (gồm nhóm NH trực tuyến và NH đặc thù, khuyết tật) và các BLQ về môi trường, sức khỏe và an toàn.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Có quy định và tiêu chuẩn về môi trường, sức khoẻ và an toàn; có kế hoạch triển khai tiêu chuẩn về môi trường, sức khoẻ, trong đó có lưu ý đến nhu cầu của nhóm… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Xác định và triển khai tiêu chuẩn về sức khỏe và an toàn, gồm tiêu chuẩn về sức khỏe và an toàn trong đào tạo trực tuyến, trong đó có lưu ý đến nhu cầu của nhóm… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 7.6, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có quy định và tiêu chuẩn về môi trường, sức khoẻ và an toàn; có kế hoạch triển khai tiêu chuẩn về môi trường,… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "7.7": {
    "short_name": "Năng lực đội ngũ hỗ trợ về cơ sở vật chất và trang thiết bị được…",
    "full_name": "Năng lực đội ngũ hỗ trợ về cơ sở vật chất và trang thiết bị được xác định và được đánh giá đáp ứng nhu cầu các bên liên quan.",
    "dieu_kien": false,
    "requirements": [
      "Xác định năng lực và tiêu chí đánh giá năng lực của đội ngũ hỗ trợ về CSVC và trang thiết bị (nhân viên, chuyên viên, kỹ thuật viên) của tất cả các phương thức đào tạo phù hợp với yêu cầu của vị trí việc làm.",
      "Đánh giá năng lực của đội ngũ hỗ trợ về CSVC và trang thiết bị (nhân viên, chuyên viên, kỹ thuật viên) để đáp ứng các phương thức đào tạo và đáp ứng nhu cầu của các BLQ."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định năng lực đội ngũ nhân viên, chuyên viên, kỹ thuật viên hỗ trợ về CSVC và trang thiết bị của CSĐT.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Bản mô tả công việc của đội ngũ nhân viên, chuyên viên, kỹ thuật viên hỗ trợ về CSVC và trang thiết bị.",
        "type": "document_history",
        "category": "Hồ sơ chuyên môn"
      },
      {
        "name": "Kế hoạch đánh giá định kỳ năng lực đội ngũ nhân viên, chuyên viên, kỹ thuật viên hỗ trợ về CSVC và trang thiết bị của CSĐT.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Kết quả đánh giá định kỳ đội ngũ nhân viên, chuyên viên, kỹ thuật viên hỗ trợ về CSVC và trang thiết bị.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Hồ sơ, lý lịch của đội ngũ nhân viên, chuyên viên, kỹ thuật viên hỗ trợ về CSVC và trang thiết bị.",
        "type": "official_doc",
        "category": "Hồ sơ - danh mục"
      },
      {
        "name": "Ý kiến phản hồi của các BLQ bên trong về đội ngũ nhân viên, chuyên viên, kỹ thuật viên hỗ trợ về CSVC và trang thiết bị.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Xác định năng lực và tiêu chí đánh giá năng lực của đội ngũ hỗ trợ về CSVC và trang thiết bị (nhân viên, chuyên viên, kỹ thuật viên) của tất cả các phương thức… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Đánh giá năng lực của đội ngũ hỗ trợ về CSVC và trang thiết bị (nhân viên, chuyên viên, kỹ thuật viên) để đáp ứng các phương thức đào tạo và đáp ứng nhu cầu của… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 7.7, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Xác định năng lực và tiêu chí đánh giá năng lực của đội ngũ hỗ trợ về CSVC và trang thiết bị (nhân viên, chuyê… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "7.8": {
    "short_name": "Chất lượng cơ sở vật chất phục vụ chương trình đào tạo được định…",
    "full_name": "Chất lượng cơ sở vật chất phục vụ chương trình đào tạo được định kỳ đánh giá và cải tiến.",
    "dieu_kien": false,
    "requirements": [
      "Có quy định, tiêu chí và thực hiện đánh giá chất lượng CSVC (thư viện, phòng học trực tuyến, phòng đa phương tiện, phòng thực hành, phòng thí nghiệm, hệ thống CNTT, ký túc xá, sân bãi thể thao, và các dịch vụ hỗ trợ khác) phục vụ cho CTĐT.",
      "Định kỳ nâng cấp/cải tiến CSVC (thư viện, phòng học trực tuyến, phòng đa phương tiện, phòng thực hành, phòng thí nghiệm, hệ thống CNTT, ký túc xá, sân bãi thể thao, và các dịch vụ hỗ trợ khác) phục vụ cho CTĐT.",
      "Nghiên cứu lựa chọn, áp dụng, tích hợp công nghệ mới trong đào tạo trực tuyến."
    ],
    "suggested_evidence": [
      {
        "name": "Kế hoạch và các hoạt động đánh giá chất lượng cơ sở vật chất của CSĐT (thư viện, phòng học trực tuyến, phòng đa phương tiện, phòng thực hành, phòng thí nghiệm, hệ thống CNTT, ký túc xá, sân bãi thể thao, và các dịch vụ hỗ trợ khác) phục vụ CTĐT.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Ý kiến của NH, GV và cán bộ quản lý về chất lượng CSVC phục vụ CTĐT.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      },
      {
        "name": "Thống kê những thay đổi về CSVC phục vụ CTĐT.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Các chỉ số về chất lượng CSVC.",
        "type": "official_doc",
        "category": "Tài liệu khác"
      },
      {
        "name": "Báo cáo phân tích, nghiên cứu lựa chọn, áp dụng, tích hợp công nghệ mới trong đào tạo trực tuyến.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Kinh phí đầu tư để nâng cấp, sửa chữa, cải tiến CSVC phục vụ CTĐT.",
        "type": "official_doc",
        "category": "Tài chính - hợp đồng"
      }
    ],
    "self_check_questions": [
      "Có quy định, tiêu chí và thực hiện đánh giá chất lượng CSVC (thư viện, phòng học trực tuyến, phòng đa phương tiện, phòng thực hành, phòng thí nghiệm, hệ thống… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Định kỳ nâng cấp/cải tiến CSVC (thư viện, phòng học trực tuyến, phòng đa phương tiện, phòng thực hành, phòng thí nghiệm, hệ thống CNTT, ký túc xá, sân bãi thể… — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Nghiên cứu lựa chọn, áp dụng, tích hợp công nghệ mới trong đào tạo trực tuyến — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 7.8, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Có quy định, tiêu chí và thực hiện đánh giá chất lượng CSVC (thư viện, phòng học trực tuyến, phòng đa phương t… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "8.1": {
    "short_name": "Tỉ lệ tốt nghiệp, thôi học và thời gian tốt nghiệp trung bình củ…",
    "full_name": "Tỉ lệ tốt nghiệp, thôi học và thời gian tốt nghiệp trung bình của người học được xác lập, giám sát, đối sánh để cải tiến chất lượng.",
    "dieu_kien": false,
    "requirements": [
      "Tỷ lệ tốt nghiệp được xác lập, giám sát, đối sánh trong và ngoài CSĐT qua từng năm để CTCL.",
      "Tỷ lệ thôi học được xác lập, giám sát, đối sánh trong và ngoài CSĐT qua từng năm để CTCL.",
      "Tỷ lệ tốt nghiệp trung bình được xác lập, giám sát, đối sánh trong và ngoài CSĐT qua từng năm để CTCL.",
      "Các hoạt động xác lập, giám sát, đối sánh để CTCL được triển khai hằng năm theo quy trình quy định và có sự tham gia của đơn vị/các nhân được phân công."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định/giao nhiệm vụ cho đơn vị/cá nhân thực hiện lập CSDL và tham mưu giải pháp cải thiện về tỷ lệ tốt nghiệp, tỷ lệ thôi học, thời gian tốt nghiệp trung bình (VD: chức năng, nhiệm vụ quyền hạn của đơn vị, văn bản phân công, điều hành có nội dung này...).",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Bản Kế hoạch hoặc nội dung cụ thể trong bản kế hoạch của đơn vị được giao nhiệm vụ về lập CSDL quản lý tỷ lệ tốt nghiệp, tỷ lệ thôi học và thời gian tốt nghiệp trung bình của CTĐT.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Các quyết định trúng tuyển, cho thôi học (nếu có), quyết định tốt nghiệp; Biên bản họp Hội đồng xét tốt nghiệp...",
        "type": "decision",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Có hệ thống quản lý CSDL về tỷ lệ tốt nghiệp, thôi học và thời gian tốt nghiệp trung bình được cập nhật; bảo đảm thuận tiện trong việc trích xuất CSDL về tỷ lệ tốt nghiệp, tỷ lệ thôi học, thời gian tốt nghiệp trung bình của các năm trong chu kỳ đánh giá.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Văn bản thể hiện tiêu chí để chọn CSDL đối sánh.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      },
      {
        "name": "CSDL để đối sánh giữa các năm, các khoá, các CTĐT trong CSĐT và với CTĐT của một số CSĐT khác.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      },
      {
        "name": "Báo cáo tổng kết khoá học/báo cáo hội nghị/hội thảo chuyên đề liên quan đến tỷ lệ tốt nghiệp, tỷ lệ thôi học và thời gian tốt nghiệp trung bình trong chu kỳ đánh giá (trong đó có phân tích thực trạng, nguyên nhân của tồn tại và đề xuất giải pháp khắc phục, cải tiến). Tỷ lệ tốt nghiệp, thôi học và thời gian tốt nghiệp trung bình được ghi nhận, thống kê, phân tích, đối sánh giữa các năm, khoá, giữa các CTĐT trong CSĐT, với một số CSĐT khác.",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "Quy định/văn bản chỉ đạo, điều hành/biên bản cuộc họp cấp Trường/khoa... về thực hiện giải pháp nâng cao tỷ lệ TN đúng hạn, giảm tỷ lệ thôi học và thời gian TN trung bình.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      }
    ],
    "self_check_questions": [
      "Tỷ lệ tốt nghiệp được xác lập, giám sát, đối sánh trong và ngoài CSĐT qua từng năm để CTCL — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Tỷ lệ thôi học được xác lập, giám sát, đối sánh trong và ngoài CSĐT qua từng năm để CTCL — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Tỷ lệ tốt nghiệp trung bình được xác lập, giám sát, đối sánh trong và ngoài CSĐT qua từng năm để CTCL — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Các hoạt động xác lập, giám sát, đối sánh để CTCL được triển khai hằng năm theo quy trình quy định và có sự tham gia của đơn vị/các nhân được phân công — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 8.1, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Tỷ lệ tốt nghiệp được xác lập, giám sát, đối sánh trong và ngoài CSĐT qua từng năm để CTCL.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "8.2": {
    "short_name": "Tỉ lệ việc làm bao gồm cả tự tạo việc làm",
    "full_name": "Tỉ lệ việc làm bao gồm cả tự tạo việc làm, khởi nghiệp và học tập nâng cao trình độ của người học tốt nghiệp được xác lập, giám sát và đối sánh để cải tiến chất lượng.",
    "dieu_kien": true,
    "requirements": [
      "Tỷ lệ việc làm bao gồm cả tự tạo việc làm, khởi nghiệp và học nâng cao trình độ của NH tốt nghiệp được xác lập.",
      "Tỷ lệ việc làm bao gồm cả tự tạo việc làm, khởi nghiệp và học nâng cao trình độ của NH tốt nghiệp được giám sát.",
      "Tỷ lệ việc làm bao gồm cả tự tạo việc làm, khởi nghiệp và học nâng cao trình độ của NH tốt nghiệp được đối sánh trong và ngoài CSĐT qua từng năm để CTCL."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định/giao nhiệm vụ cho đơn vị/cá nhân thực hiện lập CSDL và tham mưu giải pháp cải thiện về tình hình việc làm của NH sau khi tốt nghiệp (VD: chức năng, nhiệm vụ quyền hạn của đơn vị, văn bản phân công, điều hành có nội dung này,...).",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Bản Kế hoạch hoặc nội dung cụ thể trong Bản Kế hoạch của đơn vị được giao nhiệm vụ về lập CSDL quản lý tình hình việc làm (bao gồm cả tự tạo việc làm, khởi nghiệp và học nâng cao trình độ của NH) của đơn vị được giao nhiệm vụ.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Trích xuất CSDL về tình hình việc làm các năm trong chu kỳ đánh giá.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Văn bản thể hiện tiêu chí để chọn CSDL đối sánh.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      },
      {
        "name": "CSDL để đối sánh giữa các năm, các khoá, các CTĐT trong CSĐT và với CTĐT của một số CSĐT khác.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      },
      {
        "name": "Báo cáo tổng kết năm học/báo cáo hội nghị/hội thảo chuyên đề liên quan đến tình hình việc làm (trong đó có phân tích thực trạng, nguyên nhân của tồn tại và đề xuất giải pháp khắc phục).",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "Quy định/văn bản chỉ đạo, điều hành/biên bản cuộc họp cấp Trường/khoa... về thực hiện các giải pháp/kế hoạch cải tiến tình hình việc làm của NH sau khi tốt nghiệp.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Phiếu khảo sát/biên bản khảo sát/biên bản họp/hội thảo...",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "Báo cáo khảo sát sự hài lòng của các BLQ về NH tốt nghiệp.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      }
    ],
    "self_check_questions": [
      "Tỷ lệ việc làm bao gồm cả tự tạo việc làm, khởi nghiệp và học nâng cao trình độ của NH tốt nghiệp được xác lập — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Tỷ lệ việc làm bao gồm cả tự tạo việc làm, khởi nghiệp và học nâng cao trình độ của NH tốt nghiệp được giám sát — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Tỷ lệ việc làm bao gồm cả tự tạo việc làm, khởi nghiệp và học nâng cao trình độ của NH tốt nghiệp được đối sánh trong và ngoài CSĐT qua từng năm để CTCL — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?",
      "Đây là TIÊU CHÍ ĐIỀU KIỆN: nếu tiêu chí này không đạt thì cả tiêu chuẩn không đạt. Hồ sơ đã đủ chắc để kết luận đạt chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 8.2, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Tỷ lệ việc làm bao gồm cả tự tạo việc làm, khởi nghiệp và học nâng cao trình độ của NH tốt nghiệp được xác lập… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "8.3": {
    "short_name": "Hoạt động nghiên cứu khoa học và sản phẩm sáng tạo",
    "full_name": "Hoạt động nghiên cứu khoa học và sản phẩm sáng tạo, sáng chế của người học, giảng viên và nghiên cứu viên được xác lập, giám sát và đối sánh để cải tiến chất lượng.",
    "dieu_kien": false,
    "requirements": [
      "Hoạt động NCKH và sản phẩm sáng tạo, sáng chế của NH được xác lập, giám sát và đối sánh trong và ngoài CSĐT để CTCL.",
      "Hoạt NCKH và sản phẩm sáng tạo, sáng chế của GV và NCV được xác lập, giám sát và đối sánh trong và ngoài CSĐT qua từng năm so với mục tiêu đã xác lập để CTCL."
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định hoạt động nghiên cứu khoa học và sản phẩm sáng tạo, sáng chế của NH, GV và NCV.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Văn bản quy định/giao nhiệm vụ cho đơn vị/cá nhân thực hiện lập CSDL và tham mưu giải pháp cải thiện về hoạt động NCKH (VD: chức năng, nhiệm vụ quyền hạn của đơn vị, văn bản phân công, điều hành có nội dung này...).",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Chiến lược/kế hoạch khoa học công nghệ cấp trường/khoa.",
        "type": "strategic_plan",
        "category": "Chiến lược"
      },
      {
        "name": "Bản Kế hoạch hoặc nội dung cụ thể trong Bản Kế hoạch của đơn vị được giao nhiệm vụ về lập CSDL và quản lý, phát triển hoạt động NCKH sản phẩm sáng tạo, sáng chế của NH, GV và NCV.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Trích xuất CSDL về kết quả hoạt động NCKH, sản phẩm sáng tạo, sáng chế của NH, GV và NCV.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Tiêu chí để chọn CSDL đối sánh.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      },
      {
        "name": "CSDL để đối sánh giữa các năm, các khoá, các CTĐT trong CSĐT và với CTĐT của một số CSĐT khác.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      },
      {
        "name": "Báo cáo tổng kết năm học/khoá học; báo cáo hội nghị toàn trường hàng năm hoặc hội nghị/hội thảo chuyên đề; biên bản họp cấp trường/cấp khoa liên quan đến tình hoạt động NCKH, sản phẩm sáng tạo, sáng chế của NH, GV và NCV (trong đó có phân tích thực trạng, nguyên nhân của tồn tại và đề xuất giải pháp khắc phục).",
        "type": "training",
        "category": "Tập huấn - hội thảo"
      },
      {
        "name": "Quy định/văn bản chỉ đạo, điều hành/biên bản cuộc họp cấp trường/khoa... về thực hiện các giải pháp/kế hoạch CTCL hoạt động khoa học công nghệ và sản phẩm sáng tạo, sáng chế của NH, GV và NCV.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      }
    ],
    "self_check_questions": [
      "Hoạt động NCKH và sản phẩm sáng tạo, sáng chế của NH được xác lập, giám sát và đối sánh trong và ngoài CSĐT để CTCL — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Hoạt NCKH và sản phẩm sáng tạo, sáng chế của GV và NCV được xác lập, giám sát và đối sánh trong và ngoài CSĐT qua từng năm so với mục tiêu đã xác lập để CTCL — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 8.3, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Hoạt động NCKH và sản phẩm sáng tạo, sáng chế của NH được xác lập, giám sát và đối sánh trong và ngoài CSĐT để… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "8.4": {
    "short_name": "Dữ liệu về mức độ người học đạt chuẩn đầu ra của chương trình đà…",
    "full_name": "Dữ liệu về mức độ người học đạt chuẩn đầu ra của chương trình đào tạo được xác lập và giám sát để cải tiến chất lượng.",
    "dieu_kien": false,
    "requirements": [
      "Dữ liệu về mức độ NH đạt CĐR của CTĐT được xác lập.",
      "Dữ liệu về mức độ NH đạt CĐR của CTĐT được giám sát.",
      "Dữ liệu về mức độ NH đạt CĐR của CTĐT được đối sánh qua từng năm, so với các mục tiêu đã được xác lập để CTCL"
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định/giao nhiệm vụ cho đơn vị/cá nhân thực hiện lập CSDL và tham mưu giải pháp cải thiện về mức độ đạt CĐR của chương trình đào tạo (VD: chức năng, nhiệm vụ quyền hạn của đơn vị, văn bản phân công, điều hành có nội dung này...).",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Văn bản công bố CĐR của chương trình đào tạo.",
        "type": "website",
        "category": "Truyền thông"
      },
      {
        "name": "Thống kê các điều chỉnh/cập nhật CĐR của chương trình đào tạo trong 5 năm thuộc chu kỳ đánh giá.",
        "type": "evaluation",
        "category": "Đánh giá - nhận xét"
      },
      {
        "name": "Bản Kế hoạch hoặc nội dung cụ thể trong bản kế hoạch của đơn vị được giao nhiệm vụ triển khai việc xác lập dữ liệu, giám sát, đo lường việc đạt CĐR chương trình đào tạo.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Trích xuất CSDL về mức độ đạt CĐR của chương trình đào tạo.",
        "type": "report",
        "category": "Báo cáo - số liệu"
      },
      {
        "name": "Biên bản họp cấp CSĐT/cấp khoa/Báo cáo kết quả đo lường, giám sát, đối sánh việc đạt CĐR của chương trình đào tạo, cho thấy sự bảo đảm việc đạt CĐR là như nhau giữa các phương thức đào tạo.",
        "type": "meeting_minutes",
        "category": "Biên bản - hội họp"
      },
      {
        "name": "Biên bản họp cấp CSĐT/cấp khoa có liên quan đến cải tiến mức độ đạt CĐR của CTĐT.",
        "type": "meeting_minutes",
        "category": "Biên bản - hội họp"
      }
    ],
    "self_check_questions": [
      "Dữ liệu về mức độ NH đạt CĐR của CTĐT được xác lập — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Dữ liệu về mức độ NH đạt CĐR của CTĐT được giám sát — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Dữ liệu về mức độ NH đạt CĐR của CTĐT được đối sánh qua từng năm, so với các mục tiêu đã được xác lập để CTCL — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 8.4, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Dữ liệu về mức độ NH đạt CĐR của CTĐT được xác lập.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  },
  "8.5": {
    "short_name": "Mức độ hài lòng của các bên liên quan được xác lập",
    "full_name": "Mức độ hài lòng của các bên liên quan được xác lập, giám sát, đối sánh để cải tiến chất lượng.",
    "dieu_kien": false,
    "requirements": [
      "Mức độ hài lòng của các BLQ được xác lập.",
      "Mức độ hài lòng của các BLQ được giám sát.",
      "Mức độ hài lòng của các BLQ được đối sánh trong và ngoài CSĐT để CTCL"
    ],
    "suggested_evidence": [
      {
        "name": "Văn bản quy định/giao nhiệm vụ cho đơn vị/cá nhân thực hiện lập CSDL và tham mưu giải pháp cải thiện về mức độ hài lòng của các BLQ (VD: chức năng, nhiệm vụ quyền hạn của đơn vị, văn bản phân công, điều hành có nội dung này...).",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Quy trình/quy định của đơn vị về hoạt động lấy ý kiến các BLQ.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      },
      {
        "name": "Bản Kế hoạch hoặc nội dung cụ thể trong bản kế hoạch của đơn vị được giao nhiệm vụ về: lấy ý kiến về mức độ hài lòng của các BLQ; xác lập CSDL, giám sát và đối sánh mức độ hài lòng của các BLQ để CTCL.",
        "type": "plan",
        "category": "Kế hoạch triển khai"
      },
      {
        "name": "Trích xuất CSDL về mức độ hài lòng của các BLQ.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      },
      {
        "name": "Văn bản thể hiện tiêu chí để chọn CSDL đối sánh.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      },
      {
        "name": "CSDL để đối sánh giữa các năm, các khoá, các CTĐT trong CSĐT.",
        "type": "audit",
        "category": "Kiểm tra - giám sát"
      },
      {
        "name": "Báo cáo tổng kết khảo sát ý kiến các BLQ hằng năm; trong đó có phân tích tình hình, kết quả đối sánh, nguyên nhân mức độ hài lòng/ không hài lòng của các BLQ và đề xuất giải pháp CTCL.",
        "type": "survey",
        "category": "Khảo sát - góp ý"
      },
      {
        "name": "Quy định/văn bản chỉ đạo, điều hành/biên bản cuộc họp cấp CSĐT/khoa... về thực hiện các giải pháp/kế hoạch CTCL đáp ứng yêu cầu của các BLQ.",
        "type": "regulation",
        "category": "Văn bản chính sách"
      }
    ],
    "self_check_questions": [
      "Mức độ hài lòng của các BLQ được xác lập — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Mức độ hài lòng của các BLQ được giám sát — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Mức độ hài lòng của các BLQ được đối sánh trong và ngoài CSĐT để CTCL — đơn vị đã làm tới đâu, minh chứng nào chứng minh?",
      "Minh chứng cho tiêu chí này thuộc chu kỳ đánh giá nào và còn hiệu lực không?",
      "Sau khi rà soát tiêu chí này, đơn vị đã có hoạt động cải tiến nào chưa?"
    ],
    "placeholders": {
      "hien_trang": "VD: Đối với tiêu chí 8.5, đơn vị đã ban hành … (số, ngày ban hành); triển khai … Kết quả trong chu kỳ đánh giá: …",
      "diem_manh": "VD: Mức độ hài lòng của các BLQ được xác lập.… được thực hiện đầy đủ, có minh chứng …",
      "ton_tai": "VD: Một số minh chứng chưa cập nhật theo chu kỳ; chưa lấy đủ ý kiến các bên liên quan; …",
      "ke_hoach": "VD: Bổ sung minh chứng … trước tháng …; giao … chủ trì; rà soát lại vào …"
    }
  }
};

module.exports = { STANDARDS_DETAIL_TT04 };
