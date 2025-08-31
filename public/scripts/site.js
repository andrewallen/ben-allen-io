(() => {
  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  };

  onReady(() => {
    // Reveal on scroll
    try {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        }
      }, { threshold: 0.12 });
      document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

      const iost = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); iost.unobserve(e.target); } });
      }, { threshold: 0.12 });
      document.querySelectorAll('.stagger').forEach(el => iost.observe(el));
    } catch {}

    // Count up numbers
    try {
      function animateCount(el){
        const target = Number(el.getAttribute('data-count') || el.textContent || 0);
        const dur = 900; const start = performance.now();
        const fmt = new Intl.NumberFormat();
        function tick(now){
          const p = Math.min(1, (now - start) / dur);
          el.textContent = fmt.format(Math.floor(target * (0.1 + 0.9 * p)));
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
      document.querySelectorAll('[data-count]').forEach(animateCount);
    } catch {}

    // Scroll progress
    try {
      const bar = document.getElementById('progress');
      if (bar) {
        const onScroll = () => {
          const h = document.documentElement;
          const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight || 1);
          bar.style.width = (Math.max(0, Math.min(1, scrolled)) * 100).toFixed(2) + '%';
        };
        document.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      }
    } catch {}

    // View Transitions for same-origin navigation (progressive)
    try {
      if ('startViewTransition' in document) {
        const sameOrigin = (url) => {
          try { const u = new URL(url, location.href); return u.origin === location.origin; } catch { return false; }
        };
        addEventListener('click', (e) => {
          const a = e.target && e.target.closest ? e.target.closest('a') : null;
          if (!a) return; if (a.target === '_blank' || a.hasAttribute('download')) return;
          if (!sameOrigin(a.href)) return; // external link
          const url = new URL(a.href);
          if (url.pathname === location.pathname && url.hash) return; // in-page anchors
          e.preventDefault();
          document.startViewTransition(async () => { location.href = a.href; });
        });
      }
    } catch {}

    // Flip cards (data-flip)
    try {
      document.querySelectorAll('[data-flip]').forEach((el) => {
        const toggle = () => {
          el.classList.toggle('is-flipped');
          const pressed = el.classList.contains('is-flipped');
          el.setAttribute('aria-pressed', pressed ? 'true' : 'false');
        };
        el.addEventListener('click', () => { toggle(); });
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
      });
    } catch {}

    // Hero carousel
    try {
      const container = document.querySelector('.hero-media-carousel');
      if (container) {
        const slides = Array.from(container.querySelectorAll('img'));
        let i = 0;
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const interval = reduced ? 8000 : 5000;
        if (slides.length > 1) {
          setInterval(() => {
            slides[i] && slides[i].classList.remove('active');
            i = (i + 1) % slides.length;
            slides[i] && slides[i].classList.add('active');
          }, interval);
        }
      }
    } catch {}

    // CV layout: build Table of Contents
    try {
      const toc = document.getElementById('cv-toc');
      if (toc) {
        const headings = Array.from(document.querySelectorAll('.cv-content h2'));
        const slug = (s) => String(s || '').toLowerCase().trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        const ul = document.createElement('ul');
        headings.forEach(h => {
          if (!h.id) h.id = slug(h.textContent || 'section');
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `#${h.id}`; a.textContent = h.textContent || '';
          li.appendChild(a); ul.appendChild(li);
        });
        if (headings.length) toc.appendChild(ul);
      }
    } catch {}

    // Shift story scroller
    try {
      document.querySelectorAll('[data-story]').forEach((root) => {
        const img = root.querySelector('[data-media-img]');
        const steps = Array.from(root.querySelectorAll('[data-step]'));
        const fill = root.querySelector('[data-progress]');
        if (!steps.length) return;
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              const el = e.target; const idx = steps.indexOf(el);
              if (idx !== -1) {
                steps.forEach(s => s.classList.remove('active'));
                steps[idx].classList.add('active');
                const nextSrc = steps[idx].getAttribute('data-image');
                if (img && nextSrc) { img.setAttribute('src', nextSrc); img.setAttribute('aria-live', 'polite'); }
                if (fill) { const pc = ((idx + 1) / steps.length) * 100; fill.style.height = pc + '%'; }
              }
            }
          });
        }, { root: null, rootMargin: '-30% 0px -55% 0px', threshold: 0.01 });
        steps.forEach(s => io.observe(s));
      });
    } catch {}
  });
})();
