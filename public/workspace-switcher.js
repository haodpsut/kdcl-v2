// ─── Workspace switcher ─────────────────────────────────────────────────────
// Inserts a small dropdown into .topnav. Persists choice via cookie `ws_id`,
// so the backend can read the active workspace without changing existing fetch calls.
(function () {
  const COOKIE = 'ws_id';

  function getCookie(name) {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  function setCookie(name, value) {
    // 1 year, site-wide
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }

  // Menu definitions per workspace type. The current page is highlighted via location.pathname.
  // ── Bộ biểu tượng vẽ nét ──────────────────────────────────────────────────
  // Trước đây menu dùng emoji. Emoji do hệ điều hành vẽ nên mỗi máy một kiểu,
  // luôn nhiều màu, và đứng cạnh bảng màu maroon với vàng của trường thì lạc
  // hẳn. Bộ này là SVG nét, ăn theo màu chữ hiện hành nên đổi màu cùng menu,
  // sắc nét ở mọi độ phân giải và nhẹ hơn một phông biểu tượng ngoài.
  const IC = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    folder:    '<path d="M3 7a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.6.8l1 1.2H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    inbox:     '<path d="M3 13h4l1.5 3h7L17 13h4"/><path d="M4.5 5.5 3 13v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4l-1.5-7.5A2 2 0 0 0 17.6 4H6.4a2 2 0 0 0-1.9 1.5z"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="m9 13 2 2 4-4"/>',
    calendar:  '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 15h3"/>',
    report:    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    chart:     '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    survey:    '<path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z"/><path d="M8.5 11h7M8.5 15h4"/>',
    target:    '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    map:       '<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/>',
    ruler:     '<rect x="2.5" y="8" width="19" height="8" rx="1.5" transform="rotate(-20 12 12)"/><path d="M7.6 8.9l1 2.2M11.1 7.6l.7 1.6M14.6 6.3l1 2.2M18 5l.7 1.6"/>',
    flask:     '<path d="M10 3h4M11 3v6.2L5.6 18a2 2 0 0 0 1.7 3h9.4a2 2 0 0 0 1.7-3L13 9.2V3"/><path d="M8 15h8"/>',
    cap:       '<path d="M12 4 2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/>',
  };
  function svgIcon(name, cls) {
    const d = IC[name];
    if (!d) return '';
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
  }

  // Thanh menu gom theo NHÓM VIỆC. Trước đây CSGD bày phẳng 8 mục còn CTĐT 10
  // mục, chiếm hết bề ngang và đẩy nút đăng xuất ra khỏi màn hình ở laptop.
  // Gom lại còn 5 mục cấp một, nhóm nào có nhiều màn thì mở ra danh sách con.
  // Mỗi nhóm ứng với một bước trong quy trình kiểm định, không gom cho vừa chỗ.
  const MENUS = {
    CSGD: [
      { href: '/module7.html', icon: 'dashboard', label: 'Dashboard' },
      { icon: 'folder', label: 'Minh chứng', children: [
        { href: '/',           icon: 'folder', label: 'Danh mục minh chứng' },
        { href: '/donvi.html', icon: 'inbox', label: 'Nộp & duyệt theo đơn vị' },
      ] },
      { icon: 'clipboard', label: 'Tự đánh giá', children: [
        { href: '/module2.html', icon: 'clipboard', label: 'Đánh giá tiêu chí (Biểu 04)' },
        { href: '/module4.html', icon: 'calendar', label: 'Tiến độ 24 tuần' },
        { href: '/module6.html', icon: 'report', label: 'Báo cáo TĐG (Biểu 05)' },
      ] },
      { icon: 'chart', label: 'Số liệu', children: [
        { href: '/module3.html', icon: 'chart', label: 'KPI (Biểu 16)' },
        { href: '/module5.html', icon: 'survey', label: 'Khảo sát các bên (Biểu 08-11)' },
      ] },
    ],
    CTDT: [
      { href: '/ctdt.html', icon: 'cap', label: 'Tổng quan' },
      { icon: 'target', label: 'Chuẩn đầu ra', children: [
        { href: '/ctdt-m8.html',         icon: 'target', label: 'Khung CĐR (PEO, PLO, CLO)' },
        { href: '/ctdt-m8-mapping.html', icon: 'map', label: 'Ma trận ánh xạ' },
        { href: '/ctdt-m9.html',         icon: 'ruler', label: 'Thư viện rubric' },
      ] },
      { icon: 'flask', label: 'Đo lường', children: [
        { href: '/ctdt-m10.html', icon: 'flask', label: 'Kế hoạch đo CLO' },
        { href: '/ctdt-m11.html', icon: 'chart', label: 'Tổng hợp PLO' },
      ] },
      { icon: 'folder', label: 'Minh chứng', children: [
        { href: '/',           icon: 'folder', label: 'Danh mục minh chứng' },
        { href: '/donvi.html', icon: 'inbox', label: 'Nộp & duyệt theo đơn vị' },
      ] },
      // Tiến độ 24 tuần là màn dùng chung cho cả hai loại đợt: cả ba workspace
      // CTĐT đều đã có kế hoạch trong CSDL nhưng menu cũ không có lối vào, nên
      // dữ liệu nằm đó mà không ai tới được.
      // Cố ý KHÔNG đưa vào đây: Đánh giá tiêu chí và Dashboard, vì cả hai dựng
      // theo bộ 15 tiêu chuẩn 60 tiêu chí của TT26, không phải bộ của TT04.
      { icon: 'clipboard', label: 'Tự đánh giá', children: [
        { href: '/module4.html', icon: 'calendar', label: 'Tiến độ 24 tuần' },
        { href: '/module5.html', icon: 'survey', label: 'Khảo sát các bên' },
        { href: '/module6.html', icon: 'report', label: 'Báo cáo' },
      ] },
    ],
  };

  // Trang khoan sâu thuộc về nhóm nào, để nhóm đó vẫn sáng khi đang xem trang
  // con. Thiếu bảng này thì mở chi tiết một kế hoạch đo là cả thanh menu tắt
  // hết, người dùng không còn biết mình đang ở đâu.
  const THUOC_NHOM = {
    '/ctdt-m10-detail.html': '/ctdt-m10.html',
    '/report-view.html': '/module6.html',
  };

  function injectStyles() {
    if (document.getElementById('ws-switcher-style')) return;
    const css = `
/* Logo thương hiệu ở đầu nav — click để về trang chủ */
.topnav .brand { display: inline-flex; align-items: center; gap: 8px; }
.brand-logo {
  width: 34px; height: 34px; border-radius: 50%; background: #fff;
  padding: 3px; object-fit: contain; flex-shrink: 0;
  box-shadow: 0 0 0 1.5px rgba(251,174,64,.6);
}
.topnav .brand:hover .brand-logo { box-shadow: 0 0 0 2.5px #fbae40; }
.ws-switcher { margin-left: auto; display: flex; align-items: center; gap: 8px; padding-right: 4px; }
.ws-switcher select {
  background: #eef1f4; color: #1c1e21; border: 1px solid #d9dce1;
  border-radius: 6px; padding: 4px 8px; font-size: 12px; font-weight: 600;
  cursor: pointer; outline: none;
  max-width: 150px; text-overflow: ellipsis; white-space: nowrap;
}
.ws-switcher select:hover { border-color: #990000; }
.ws-switcher .ws-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: .5px; }
.ws-switcher .ws-badge {
  font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;
  background: #1a7f4b; color: #fff;
}
.ws-switcher .ws-badge.ctdt { background: #5c0000; }
.ws-switcher button {
  background: transparent; color: #64748b; border: 1px solid #d9dce1;
  border-radius: 6px; padding: 4px 8px; font-size: 12px; cursor: pointer;
}
.ws-switcher button:hover { color: #990000; border-color: #990000; }
.ws-user { display: flex; align-items: center; gap: 8px; margin-left: 8px; padding-left: 8px; border-left: 1px solid #d9dce1; }
.ws-user-name { font-size: 12px; font-weight: 600; color: #1c1e21; max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ws-user-role { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #990000; color: #fff; flex-shrink: 0; }
.ws-user button { background: transparent; color: #64748b; border: 1px solid #d9dce1; border-radius: 6px; padding: 3px 7px; font-size: 14px; line-height: 1; cursor: pointer; flex-shrink: 0; }
.ws-user button:hover { color: #c0392b; border-color: #c0392b; }
.ws-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex;
  align-items: center; justify-content: center; z-index: 9999;
}
.ws-modal {
  background: #ffffff; border: 1px solid #d9dce1; border-radius: 8px;
  padding: 20px; min-width: 380px; color: #1c1e21;
}
.ws-modal h3 { margin-bottom: 12px; font-size: 14px; color: #990000; }
.ws-modal label { display: block; font-size: 11px; color: #64748b; text-transform: uppercase; margin: 10px 0 4px; }
.ws-modal input, .ws-modal select, .ws-modal textarea {
  width: 100%; background: #eef1f4; color: #1c1e21; border: 1px solid #d9dce1;
  border-radius: 4px; padding: 6px 8px; font-size: 13px; font-family: inherit;
}
.ws-modal textarea { resize: vertical; min-height: 60px; }
.ws-modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
.ws-modal-actions button { padding: 6px 14px; font-size: 13px; border-radius: 4px; cursor: pointer; border: none; }
.ws-modal-actions .primary { background: #990000; color: #fff; }
.ws-modal-actions .ghost { background: #eef1f4; color: #1c1e21; border: 1px solid #d9dce1; }

/* Nav links rendered dynamically by workspace-switcher */
.nav-link.ws-soon { opacity: .55; cursor: not-allowed; }
.nav-link.ws-soon::after {
  content: 'sắp có';
  font-size: 9px; font-weight: 700; letter-spacing: .5px;
  background: #b26a00; color: #eef1f4; padding: 1px 5px; border-radius: 3px;
  margin-left: 6px; text-transform: uppercase;
}

/* Mismatch banner: visible when current page does not belong to current workspace type */
.ws-mismatch-banner {
  background: #fdf3e0; border-bottom: 2px solid #fbae40; color: #7a4a00;
  padding: 8px 16px; font-size: 12px; display: flex; align-items: center; gap: 10px;
}
.ws-mismatch-banner strong { color: #5c0000; }
.ws-mismatch-banner a { color: #990000; text-decoration: underline; cursor: pointer; }
`;
    const s = document.createElement('style');
    s.id = 'ws-switcher-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  async function loadWorkspaces() {
    const r = await fetch('/api/workspaces');
    return r.json();
  }

  function closeAllNavGroups() {
    document.querySelectorAll('.nav-group.open').forEach((g) => {
      g.classList.remove('open');
      const b = g.querySelector('.nav-group-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  // Bấm ra ngoài hoặc nhấn Esc thì đóng, để menu không dính lại che nội dung.
  document.addEventListener('click', closeAllNavGroups);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllNavGroups(); });

  function rebuildNav(nav, type) {
    // Remove existing nav-link anchors (keep .brand and #ws-switcher)
    nav.querySelectorAll('a.nav-link').forEach(el => el.remove());
    const switcher = nav.querySelector('#ws-switcher');
    const items = MENUS[type] || MENUS.CSGD;
    const here = normPath();
    const hereEff = THUOC_NHOM[here] || here;   // trang con tính như trang cha
    const frag = document.createDocumentFragment();
    for (const it of items) {
      if (it.children) {
        const con = it.children.some((c) => c.href === hereEff);
        const wrap = document.createElement('div');
        wrap.className = 'nav-group' + (con ? ' active' : '');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-link nav-group-btn';
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = `${svgIcon(it.icon, 'nav-ic')}<span>${it.label}</span><svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
        const drop = document.createElement('div');
        drop.className = 'nav-drop';
        for (const c of it.children) {
          const a = document.createElement('a');
          a.className = 'nav-drop-item' + (c.href === hereEff ? ' active' : '');
          a.href = c.href;
          a.innerHTML = `${svgIcon(c.icon, 'drop-ic')}<span>${c.label}</span>`;
          drop.appendChild(a);
        }
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const dangMo = wrap.classList.contains('open');
          closeAllNavGroups();
          if (dangMo) return;
          wrap.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          // Khung thả xuống phải định vị theo cửa sổ chứ không theo nhóm cha.
          // Dải menu có overflow-x:auto để cuộn ngang, mà overflow cắt luôn mọi
          // thứ tràn ra ngoài, nên nếu để khung nằm trong dải thì nó mở ra rồi
          // bị cắt sạch: DOM báo đang hiện nhưng người dùng không thấy gì.
          const r = btn.getBoundingClientRect();
          drop.style.top = Math.round(r.bottom) + 'px';
          const rong = drop.offsetWidth || 260;
          drop.style.left = Math.round(Math.min(r.left, window.innerWidth - rong - 8)) + 'px';
        });
        wrap.appendChild(btn); wrap.appendChild(drop);
        frag.appendChild(wrap);
        continue;
      }
      const a = document.createElement('a');
      a.className = 'nav-link';
      const isActive = (hereEff === it.href) || (hereEff === '' && it.href === '/');
      if (isActive) a.classList.add('active');
      if (it.soon)  a.classList.add('ws-soon');
      a.href = it.soon ? '#' : it.href;
      a.innerHTML = `${svgIcon(it.icon, 'nav-ic')}<span>${it.label}</span>`;
      if (it.soon) a.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Module này sắp có. Đang được triển khai trong các Increment kế tiếp.');
      });
      frag.appendChild(a);
    }
    // Thanh menu phải rộng 1522px mới đủ chỗ, nên ở màn 1440 nút đăng xuất đã
    // nằm ngoài khung, còn ở 1366 hay cửa sổ chia đôi thì mất cả bộ đổi đợt
    // kiểm định. Không có thanh cuộn nào hiện ra nên người dùng không biết
    // đường lấy lại. Nay bọc riêng phần menu vào một dải cuộn được, còn bộ đổi
    // đợt và nút đăng xuất neo cố định bên phải, luôn nhìn thấy.
    let scroll = nav.querySelector('.nav-scroll');
    if (!scroll) {
      scroll = document.createElement('div');
      scroll.className = 'nav-scroll';
      if (switcher) nav.insertBefore(scroll, switcher);
      else nav.appendChild(scroll);
    }
    scroll.innerHTML = '';
    scroll.appendChild(frag);
  }

  // Trang dùng chung cho mọi đợt kiểm định, không thuộc menu của workspace nào.
  // Không loại trừ thì trang tài khoản luôn bị gắn nhãn "không thuộc workspace
  // hiện tại", một cảnh báo sai làm người dùng tưởng mình vào nhầm chỗ.
  // Menu khai trang chủ là '/', nhưng ai gõ thẳng hoặc bookmark '/index.html'
  // thì đường dẫn không khớp: trang bị gắn nhãn sai "không thuộc workspace
  // hiện tại" rồi mời chuyển sang chính workspace đang mở, và không mục nào
  // trên thanh menu được tô sáng. Quy về một dạng trước khi so.
  function normPath() {
    let p = location.pathname.replace(/\/$/, '') || '/';
    if (p === '/index.html') p = '/';
    return p;
  }

  const WS_NEUTRAL = ['/users.html', '/report-view.html', '/survey-fill.html'];

  // Trang khoan sâu: có thuộc workspace, nhưng cố ý không nằm trên thanh menu
  // vì chỉ vào được từ một dòng cụ thể. Thiếu danh sách này thì mở chi tiết
  // một kế hoạch đo lại bị mời "chuyển sang workspace CSGD", thao tác đó làm
  // người dùng mất luôn ngữ cảnh đang xem.
  const WS_DRILLDOWN = {
    CTDT: ['/ctdt-m10-detail.html', '/ctdt-m8-mapping.html'],
    CSGD: [],
  };

  function showMismatchBannerIfNeeded(type) {
    const here = normPath();
    if (WS_NEUTRAL.includes(here)) return;
    if ((WS_DRILLDOWN[type] || []).includes(here)) return;
    // Phải trải phẳng cả mục con. Sau khi gom nhóm, mục cấp một là NHÓM và
    // không có href, nên nếu chỉ lấy href cấp một thì mọi trang nằm trong
    // nhóm đều bị coi là lạc workspace và trang nào cũng mọc banner.
    const allowed = [];
    for (const m of MENUS[type] || []) {
      if (m.href) allowed.push(m.href);
      for (const c of m.children || []) if (c.href) allowed.push(c.href);
    }
    if (allowed.includes(here)) return;
    // Pages that exist but are not in current workspace's menu = mismatch
    const banner = document.createElement('div');
    banner.className = 'ws-mismatch-banner';
    banner.innerHTML = `
      ⚠️ <strong>Trang này không thuộc workspace hiện tại</strong> (${type}).
      <a id="ws-go-home">Về trang chủ workspace</a>
      <a id="ws-go-csgd">hoặc chuyển sang workspace CSGD</a>
    `;
    const body = document.body;
    body.insertBefore(banner, body.firstChild);
    document.getElementById('ws-go-home').onclick = () => {
      const home = (MENUS[type] || [])[0];
      if (home) location.href = home.href;
    };
    document.getElementById('ws-go-csgd').onclick = async () => {
      const r = await fetch('/api/workspaces');
      const data = await r.json();
      const csgd = data.items.find(w => w.type === 'CSGD');
      if (csgd) { setCookie(COOKIE, String(csgd.id)); location.reload(); }
    };
  }

  function render(data) {
    const nav = document.querySelector('.topnav');
    if (!nav) return;
    let host = document.getElementById('ws-switcher');
    if (!host) {
      host = document.createElement('div');
      host.id = 'ws-switcher';
      host.className = 'ws-switcher';
      nav.appendChild(host);
    }
    const current = data.items.find(w => w.current) || data.items[0];
    const badge = current.type === 'CSGD'
      ? '<span class="ws-badge">CSGD</span>'
      : '<span class="ws-badge ctdt">CTĐT</span>';
    host.innerHTML = `
      ${badge}
      <select id="ws-select" title="${current.name} · ${current.law} — bấm để chuyển đợt kiểm định">
        ${data.items.map(w => `<option value="${w.id}" ${w.id === current.id ? 'selected' : ''} title="${w.name} · ${w.law}">${w.name}</option>`).join('')}
      </select>
      <button id="ws-new" title="Tạo workspace mới">+ Mới</button>
    `;
    document.getElementById('ws-select').addEventListener('change', (e) => {
      setCookie(COOKIE, e.target.value);
      location.reload();
    });
    document.getElementById('ws-new').addEventListener('click', openCreateModal);

    // Căn cứ pháp lý hiển thị trên trang lấy từ chính workspace đang mở.
    // Trước đây ba chỗ gõ cứng "Thông tư /2026/TT-BGDĐT" (thiếu số hiệu, chép
    // từ bản dự thảo) và không đổi theo đợt kiểm định, nên trang CSGD với trang
    // CTĐT cùng dẫn một căn cứ sai. WS_CURRENT để bản in dùng lại.
    window.WS_CURRENT = current;
    document.querySelectorAll('[data-ws-law]').forEach((el) => {
      if (current.law) el.textContent = current.law;
    });

    // User info + đăng xuất
    const me = window.__me;
    if (me) {
      const uEl = document.createElement('div');
      uEl.className = 'ws-user';
      const roleLabel = { admin: 'P.ĐBCL', unit: (me.unit?.name || 'Đơn vị'), viewer: 'Xem' }[me.role] || me.role;
      // Lối vào trang tài khoản chỉ hiện với admin; vai khác mở thẳng URL cũng
      // bị trang từ chối, đây chỉ là bớt một chỗ bấm nhầm.
      const adminLink = me.role === 'admin'
        ? '<button id="ws-users" title="Tài khoản &amp; phân quyền">👤+</button>' : '';
      uEl.innerHTML = `<span class="ws-user-name" title="${me.display_name || me.username} · ${roleLabel}">👤 ${roleLabel}</span>
        ${adminLink}
        <button id="ws-logout" title="Đăng xuất (${me.display_name || me.username})">⎋</button>`;
      host.appendChild(uEl);
      const uBtn = document.getElementById('ws-users');
      if (uBtn) uBtn.onclick = () => { location.href = '/users.html'; };
      document.getElementById('ws-logout').onclick = async () => {
        await fetch('/api/logout', { method: 'POST' });
        location.href = '/login.html';
      };
    }

    // Inc3: rebuild nav menu based on workspace type, then warn if page mismatch.
    rebuildNav(nav, current.type);
    enhanceBrand(nav, (MENUS[current.type] || MENUS.CSGD)[0].href);
    showMismatchBannerIfNeeded(current.type);
  }

  // Biến .brand thành logo + tên ngắn, click để về trang chủ của workspace hiện tại
  function enhanceBrand(nav, homeHref) {
    const brand = nav.querySelector('.brand');
    if (!brand || brand.dataset.enhanced) return;
    brand.dataset.enhanced = '1';
    const full = brand.textContent.trim() || 'KĐCLGD · ĐH Kiến trúc Đà Nẵng';
    brand.style.cursor = 'pointer';
    brand.title = full + ' — Về trang chủ';
    brand.addEventListener('click', () => { location.href = homeHref || '/'; });
    brand.innerHTML = '<img src="/dau-logo.png" class="brand-logo" alt="ĐH Kiến trúc Đà Nẵng"><span class="brand-txt">KĐCLGD</span>';
  }

  function openCreateModal() {
    const overlay = document.createElement('div');
    overlay.className = 'ws-modal-overlay';
    overlay.innerHTML = `
      <div class="ws-modal">
        <h3>Tạo Workspace mới</h3>
        <label>Loại workspace</label>
        <select id="m-type">
          <option value="CSGD">CSGD — Kiểm định Cơ sở Giáo dục (TT26/2026)</option>
          <option value="CTDT">CTĐT — Kiểm định Chương trình Đào tạo (TT04/2025)</option>
        </select>
        <label>Tên workspace</label>
        <input id="m-name" placeholder="Ví dụ: CTĐT CNTT 2026">
        <label>Mô tả (tuỳ chọn)</label>
        <textarea id="m-desc" placeholder="Ghi chú về kỳ kiểm định, ngành, khóa..."></textarea>
        <div class="ws-modal-actions">
          <button class="ghost" id="m-cancel">Hủy</button>
          <button class="primary" id="m-save">Tạo</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('#m-cancel').onclick = () => overlay.remove();
    overlay.querySelector('#m-save').onclick = async () => {
      const name = overlay.querySelector('#m-name').value.trim();
      const type = overlay.querySelector('#m-type').value;
      const description = overlay.querySelector('#m-desc').value.trim();
      if (!name) { alert('Vui lòng nhập tên workspace'); return; }
      const r = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, description }),
      });
      const data = await r.json();
      if (!r.ok) { alert(data.error || 'Lỗi'); return; }
      setCookie(COOKIE, String(data.id));
      location.reload();
    };
  }

  function injectDemoBannerIfVercel() {
    if (!location.hostname.endsWith('.vercel.app')) return;
    if (document.getElementById('vercel-demo-banner')) return;
    const b = document.createElement('div');
    b.id = 'vercel-demo-banner';
    b.style.cssText = 'background:#3b2f1a;border-bottom:1px solid #b26a00;color:#f0d97a;padding:6px 16px;font-size:11px;text-align:center;';
    b.innerHTML = '⚠️ <b>Chế độ demo trên Vercel</b> — dữ liệu mới thêm có thể reset sau ~15 phút không hoạt động (serverless <code>/tmp</code> là ephemeral). Dữ liệu mẫu sẽ được khôi phục tự động. Production cần DB ngoài (Supabase/Neon/MongoDB).';
    document.body.insertBefore(b, document.body.firstChild);
  }

  // ─── Gate: bắt đăng nhập ─────────────────────────────────────────────────
  const PUBLIC_PAGES = ['/login.html', '/survey-fill.html'];
  async function requireLogin() {
    const here = location.pathname;
    if (PUBLIC_PAGES.some(p => here.endsWith(p))) return true;
    try {
      const me = await (await fetch('/api/me')).json();
      if (!me) { location.href = '/login.html'; return false; }
      window.__me = me;
      return true;
    } catch (e) { return true; } // lỗi mạng: không chặn cứng
  }

  function injectFavicon() {
    if (document.querySelector('link[rel="icon"]')) return;
    const l = document.createElement('link');
    l.rel = 'icon'; l.type = 'image/png'; l.href = '/dau-logo.png';
    document.head.appendChild(l);
  }

  // ── Footer dùng chung ─────────────────────────────────────────────────────
  // Đặt ở đây chứ không chép vào 15 tệp HTML: chép tay thì sớm muộn có trang
  // quên sửa, và đúng trang đó là trang người ta in ra nộp. Tên trường lấy từ
  // school_info trong CSDL nên sửa một chỗ là cả hệ đổi theo.
  async function injectFooter() {
    if (document.querySelector('.kdcl-footer')) return;
    let info = {};
    try { info = await fetch('/api/school-info').then((r) => (r.ok ? r.json() : {})); } catch { info = {}; }
    const ten = info.ten_truong || 'Trường Đại học Kiến trúc Đà Nẵng';
    const f = document.createElement('footer');
    f.className = 'kdcl-footer';
    f.innerHTML =
      '<span class="kf-left">Hệ thống quản lý minh chứng kiểm định chất lượng giáo dục' +
      ' &nbsp;·&nbsp; ' + esc(ten) + '</span>' +
      '<span class="kf-right">' +
      (info.dia_chi ? esc(info.dia_chi) + ' &nbsp;·&nbsp; ' : '') +
      (info.website ? '<a href="' + esc(info.website) + '" target="_blank" rel="noopener">' + esc(info.website.replace(/^https?:\/\//, '')) + '</a>' : '') +
      '</span>';
    document.body.appendChild(f);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  async function init() {
    injectStyles();
    injectFavicon();
    injectDemoBannerIfVercel();
    if (!(await requireLogin())) return;
    injectFooter();
    try {
      const data = await loadWorkspaces();
      if (!data.items || data.items.length === 0) return;
      render(data);
    } catch (e) {
      console.warn('workspace-switcher: load failed', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
