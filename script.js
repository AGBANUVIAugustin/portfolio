(function () {
  const docEl = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');

  function setTheme(theme) {
    docEl.setAttribute('data-theme', theme);
    if (themeToggle) {
      const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      themeToggle.setAttribute('aria-label', label);
      themeToggle.title = label;
    }
    try { localStorage.setItem('theme', theme); } catch (_) {}
  }

  function initTheme() {
    let theme = 'light';
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') theme = stored;
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'dark';
    } catch (_) {}
    setTheme(theme);
  }

  function initObservers() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  function initEvents() {
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const isDark = docEl.getAttribute('data-theme') === 'dark';
        setTheme(isDark ? 'light' : 'dark');
      });
    }

    if (menuToggle && nav) {
      menuToggle.addEventListener('click', () => {
        const open = !nav.classList.contains('open');
        nav.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
      });

      nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }));
    }

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  // Initialize
  initTheme();
  initObservers();
  initEvents();
})();
