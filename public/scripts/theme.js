(() => {
  const root = document.documentElement;
  const btn = () => document.getElementById('theme-toggle');

  const applyTheme = (theme) => {
    const t = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', t);
    try { root.style.colorScheme = t; } catch {}
    try { localStorage.setItem('theme', t); } catch {}
    const el = btn();
    if (el) {
      const next = t === 'dark' ? 'light' : 'dark';
      el.setAttribute('aria-pressed', String(t === 'dark'));
      el.title = `Switch to ${next} mode`;
      el.setAttribute('aria-label', el.title);
      el.textContent = t === 'dark' ? '🌙 Dark' : '☀️ Light';
    }
  };

  const currentTheme = () => {
    const attr = root.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {}
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {}
    return 'light';
  };

  const init = () => {
    applyTheme(currentTheme());
    const el = btn();
    if (el && !el._bound) {
      el.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
      el._bound = true;
    }
  };

  // Init ASAP
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else { init(); }

  // Sync across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
      applyTheme(e.newValue);
    }
  });
})();

