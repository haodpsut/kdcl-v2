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
  const MENUS = {
    CSGD: [
      { href: '/',             icon: '📂', label: 'Minh chứng' },
      { href: '/module2.html', icon: '📋', label: 'Đánh giá TC' },
      { href: '/module3.html', icon: '📊', label: 'KPI – Biểu 16' },
      { href: '/module4.html', icon: '📅', label: 'Tiến độ TĐG' },
      { href: '/module5.html', icon: '📝', label: 'Khảo sát' },
      { href: '/module6.html', icon: '📄', label: 'Báo cáo TĐG' },
      { href: '/module7.html', icon: '🏛', label: 'Dashboard' },
      { href: '/donvi.html',   icon: '🗂', label: 'Nộp & Duyệt MC' },
    ],
    CTDT: [
      { href: '/ctdt.html',     icon: '🎓', label: 'Tổng quan CTĐT' },
      { href: '/ctdt-m8.html',         icon: '🧭', label: 'Khung CĐR' },
      { href: '/ctdt-m8-mapping.html', icon: '🗺', label: 'Ma trận ánh xạ' },
      { href: '/ctdt-m9.html',  icon: '📐', label: 'Rubric Library' },
      { href: '/ctdt-m10.html', icon: '🧪', label: 'Đo CLO' },
      { href: '/ctdt-m11.html', icon: '📊', label: 'Tổng hợp PLO' },
      { href: '/',              icon: '📂', label: 'Minh chứng' },
      { href: '/module5.html',  icon: '📝', label: 'Khảo sát' },
      { href: '/module6.html',  icon: '📄', label: 'Báo cáo' },
      { href: '/donvi.html',    icon: '🗂', label: 'Nộp & Duyệt MC' },
    ],
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

  function rebuildNav(nav, type) {
    // Remove existing nav-link anchors (keep .brand and #ws-switcher)
    nav.querySelectorAll('a.nav-link').forEach(el => el.remove());
    const switcher = nav.querySelector('#ws-switcher');
    const items = MENUS[type] || MENUS.CSGD;
    const here = location.pathname.replace(/\/$/, '') || '/';
    const frag = document.createDocumentFragment();
    for (const it of items) {
      const a = document.createElement('a');
      a.className = 'nav-link';
      const isActive = (here === it.href) || (here === '' && it.href === '/');
      if (isActive) a.classList.add('active');
      if (it.soon)  a.classList.add('ws-soon');
      a.href = it.soon ? '#' : it.href;
      a.innerHTML = `${it.icon} ${it.label}`;
      if (it.soon) a.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Module này sắp có. Đang được triển khai trong các Increment kế tiếp.');
      });
      frag.appendChild(a);
    }
    if (switcher) nav.insertBefore(frag, switcher);
    else nav.appendChild(frag);
  }

  function showMismatchBannerIfNeeded(type) {
    const here = location.pathname.replace(/\/$/, '') || '/';
    const allowed = (MENUS[type] || []).map(m => m.href);
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

    // User info + đăng xuất
    const me = window.__me;
    if (me) {
      const uEl = document.createElement('div');
      uEl.className = 'ws-user';
      const roleLabel = { admin: 'P.ĐBCL', unit: (me.unit?.name || 'Đơn vị'), viewer: 'Xem' }[me.role] || me.role;
      uEl.innerHTML = `<span class="ws-user-name" title="${me.display_name || me.username} · ${roleLabel}">👤 ${roleLabel}</span>
        <button id="ws-logout" title="Đăng xuất (${me.display_name || me.username})">⎋</button>`;
      host.appendChild(uEl);
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

  async function init() {
    injectStyles();
    injectFavicon();
    injectDemoBannerIfVercel();
    if (!(await requireLogin())) return;
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
