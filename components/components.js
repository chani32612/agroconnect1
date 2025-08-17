// Components loader for injecting shared header/nav/footer
// Usage: add elements with data-include="/components/<file>.html"

async function includeComponents() {
  const includeEls = document.querySelectorAll('[data-include]');
  const fetches = Array.from(includeEls).map(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url);
      const html = await res.text();
      el.innerHTML = html;
    } catch (e) {
      console.error('Failed to load component:', url, e);
      el.innerHTML = '<!-- component failed to load -->';
    }
  });
  await Promise.all(fetches);

  // Post-insert initialization
  initHeaderUser();
  initConsumerNavActive();
  initLogoutButtons();
}

function initHeaderUser() {
  try {
    const nameEl = document.getElementById('header-user-name');
    if (!nameEl) return;
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const displayName = (user?.details?.full_name) || (user?.details?.company_name) || user?.username || 'User';
    nameEl.textContent = displayName;
  } catch (e) { console.warn('initHeaderUser failed', e); }
}

function initConsumerNavActive() {
  const nav = document.getElementById('consumer-nav');
  if (!nav) return;
  const current = window.location.pathname;
  const links = nav.querySelectorAll('a');
  links.forEach((a) => {
    if (!a || !a.getAttribute) return;
    const href = a.getAttribute('href');
    if (!href) return;
    // Consider both exact and folder index matches
    if (current === href || (current.endsWith('/') && current.slice(0, -1) === href)) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

function initLogoutButtons() {
  // Attach to any element with id="logout-btn" or [data-action="logout"]
  const btns = document.querySelectorAll('#logout-btn, [data-action="logout"]');
  btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof logout === 'function') {
        logout();
      } else if (typeof handleLogout === 'function') {
        // Fallback to consumer-products.js handler
        handleLogout();
      } else {
        // Fallback: clear and go home
        localStorage.removeItem('currentUser');
        window.location.href = '/login.html';
      }
    });
  });
}

// Auto-run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', includeComponents);
} else {
  includeComponents();
}