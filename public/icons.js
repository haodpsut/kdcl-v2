// ─── Bộ biểu tượng dùng chung cho toàn hệ ───────────────────────────────────
// Vì sao không dùng emoji: emoji do hệ điều hành vẽ nên mỗi máy một kiểu, luôn
// nhiều màu và không đổi được màu theo ngữ cảnh, đứng cạnh bảng màu maroon với
// vàng của trường thì lạc hẳn. Bộ này là SVG nét, ăn theo màu chữ hiện hành
// (currentColor) nên tự đổi màu cùng nút hay nhãn chứa nó.
//
// Nạp tệp này KHÔNG kèm defer và đặt trước script của trang, vì các hàm dựng
// giao diện gọi KIcon ngay khi vẽ.
//
// Hai cách dùng:
//   HTML tĩnh:  <span data-ic="folder"></span>          (tự thay khi tải trang)
//   Trong JS:   `${KIcon('folder')}`  hoặc  KIcon('folder', 'k-ic lg')
(function () {
  const P = {
    // điều hướng, nhóm việc
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.6.8l1 1.2H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    inbox: '<path d="M3 13h4l1.5 3h7L17 13h4"/><path d="M4.5 5.5 3 13v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4l-1.5-7.5A2 2 0 0 0 17.6 4H6.4a2 2 0 0 0-1.9 1.5z"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="m9 13 2 2 4-4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 15h3"/>',
    report: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    trend: '<path d="M3 17l6-6 4 4 7-7"/><path d="M14 8h6v6"/>',
    survey: '<path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z"/><path d="M8.5 11h7M8.5 15h4"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    map: '<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/>',
    ruler: '<rect x="2.5" y="8" width="19" height="8" rx="1.5" transform="rotate(-20 12 12)"/><path d="M7.6 8.9l1 2.2M11.1 7.6l.7 1.6M14.6 6.3l1 2.2M18 5l.7 1.6"/>',
    flask: '<path d="M10 3h4M11 3v6.2L5.6 18a2 2 0 0 0 1.7 3h9.4a2 2 0 0 0 1.7-3L13 9.2V3"/><path d="M8 15h8"/>',
    cap: '<path d="M12 4 2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/><path d="M10 21v-3h4v3"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16.5 5.5a3.2 3.2 0 0 1 0 6"/><path d="M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M8 7h7M8 11h7"/>',
    // trạng thái
    check: '<path d="m5 13 4.5 4.5L19 7"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16 9.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    xCircle: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    warning: '<path d="M12 4.5 2.6 20h18.8z"/><path d="M12 10v4.5M12 17.2v.1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.1"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>',
    hourglass: '<path d="M7 3h10M7 21h10"/><path d="M8 3v3.5c0 2 4 3.4 4 5.5s-4 3.5-4 5.5V21M16 3v3.5c0 2-4 3.4-4 5.5s4 3.5 4 5.5V21"/>',
    // hành động
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M6.5 7 7.4 20a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5L17.5 7"/><path d="M10.5 11v6M13.5 11v6"/>',
    edit: '<path d="M4 20h4.3L19 9.3a2.1 2.1 0 0 0-3-3L5.3 17z"/><path d="M14.5 6.8 17.2 9.5"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/>',
    download: '<path d="M12 3v12"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4 20h16"/>',
    upload: '<path d="M12 20V8"/><path d="m7.5 12.5 4.5-4.5 4.5 4.5"/><path d="M4 4h16"/>',
    link: '<path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.3 1.3"/><path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.3-1.3"/>',
    print: '<path d="M7 8V3h10v5"/><rect x="4" y="8" width="16" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-13.7-5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 13.7 5L20 16"/><path d="M20 20v-4h-4"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    arrowRight: '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
    arrowLeftRight: '<path d="M7 8H3l4-4M3 8h18"/><path d="M17 16h4l-4 4M21 16H3"/>',
    back: '<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/>',
    logout: '<path d="M15 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8"/><path d="M18 12H10"/><path d="m15 9 3 3-3 3"/>',
    // bổ sung theo yêu cầu khi thay biểu tượng trong nội dung trang
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    save: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4"/><rect x="8" y="13" width="8" height="7"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5.5H5.5A2.5 2.5 0 0 0 8 10M16 5.5h2.5A2.5 2.5 0 0 1 16 10"/><path d="M12 13v4M9 20h6"/>',
    externalLink: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
    radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 3v18M3 12h18"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7"/>',
    // bổ sung đợt hai, theo đề nghị của người thay biểu tượng trong nội dung
    circle: '<circle cx="12" cy="12" r="8"/>',
    paperclip: '<path d="M20 11.5 12.3 19.2a5 5 0 0 1-7-7l8-8a3.4 3.4 0 0 1 4.8 4.8l-8 8a1.8 1.8 0 0 1-2.5-2.5l7.3-7.3"/>',
    bulb: '<path d="M9.2 17h5.6"/><path d="M10 20.5h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.8 1 .8 1.6h5.6c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 3.8"/><path d="M12 17.2v.1"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"/>',
    image: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 17 5-5 4.5 4.5L17 13l3 3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"/>',
    star: '<path d="m12 4 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8z"/>',
    scale: '<path d="M12 4v16M7 20h10"/><path d="M4 8h16"/><path d="M4 8 1.5 14h5zM20 8l-2.5 6h5z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5.5-5.5 2 2-5.5z"/>',
    pin: '<path d="M12 21s6.5-6.2 6.5-11a6.5 6.5 0 0 0-13 0C5.5 14.8 12 21 12 21z"/><circle cx="12" cy="10" r="2.4"/>',
    scroll: '<path d="M6 4h11a2 2 0 0 1 2 2v11a3 3 0 0 0 3 3H8a3 3 0 0 1-3-3V6a2 2 0 0 1 1-1.7z"/><path d="M9 8h7M9 12h7"/>',
  };

  function KIcon(name, cls) {
    const d = P[name];
    if (!d) return '';
    return '<svg class="' + (cls || 'k-ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
      + ' stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'
      + d + '</svg>';
  }

  // Thay mọi <span data-ic="ten"> trong HTML tĩnh. Chạy được nhiều lần, dùng
  // lại được sau khi vẽ lại một vùng: gọi KIcon.upgrade(phanTuCha).
  function upgrade(root) {
    (root || document).querySelectorAll('[data-ic]').forEach((el) => {
      const html = KIcon(el.getAttribute('data-ic'), el.getAttribute('data-ic-class') || 'k-ic');
      if (!html) return;
      el.outerHTML = html;
    });
  }
  KIcon.upgrade = upgrade;
  KIcon.has = (n) => !!P[n];
  KIcon.names = () => Object.keys(P);
  window.KIcon = KIcon;

  // Kích thước và canh dòng mặc định, để trang nào cũng giống nhau.
  const css = `
.k-ic { width: 16px; height: 16px; flex: 0 0 auto; vertical-align: -3px; }
.k-ic.sm { width: 13px; height: 13px; vertical-align: -2px; }
.k-ic.lg { width: 20px; height: 20px; vertical-align: -4px; }
.k-ic.xl { width: 26px; height: 26px; vertical-align: -5px; }
h1 .k-ic, h2 .k-ic, h3 .k-ic { margin-right: 7px; }
button .k-ic, .btn .k-ic { margin-right: 5px; }
`;
  const st = document.createElement('style');
  st.id = 'k-icons-style';
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => upgrade());
  else upgrade();
})();
