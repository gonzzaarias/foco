(() => {
  const THEMES = {
    natural: { accent: '#2D4F3E', bg: '#F6F5F0' },
    cielo:   { accent: '#2C4A6E', bg: '#DCE6F2' },
    oscuro:  { accent: '#7FB095', bg: '#121714' },
    calido:  { accent: '#9E4F33', bg: '#F5EFEA' },
    oceano:  { accent: '#1F5B78', bg: '#EEF3F6' }
  };

  // 1. Sincronización de aspecto visual + Favicon SVG dinámico
  const applyTheme = (themeName) => {
    const key = THEMES[themeName] ? themeName : 'natural';
    document.body.setAttribute('data-theme', key);
    localStorage.setItem('tramo-theme', key);

    document.querySelectorAll('[data-set-theme]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-set-theme') === key);
    });

    const { accent, bg } = THEMES[key];
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect width='64' height='64' rx='16' fill='${encodeURIComponent(accent)}'/><rect x='10' y='12' width='44' height='14' rx='4' fill='${encodeURIComponent(bg)}'/><rect x='21' y='30' width='14' height='22' rx='4' fill='${encodeURIComponent(bg)}'/><rect x='41' y='39' width='13' height='13' rx='3.5' fill='${encodeURIComponent(bg)}'/></svg>`;
    const favicon = document.getElementById('dynamic-favicon');
    if (favicon) favicon.href = `data:image/svg+xml,${svg}`;
  };

  const savedTheme = localStorage.getItem('tramo-theme') || 'natural';
  applyTheme(savedTheme);

  document.querySelectorAll('[data-set-theme]').forEach((btn) => {
    btn.addEventListener('click', () => applyTheme(btn.getAttribute('data-set-theme')));
  });

  // 2. Año actual en el footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 3. Borde sutil en navbar al hacer scroll
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 4. Desplegable y copia de huella SHA-256
  const hashToggle = document.querySelector('[data-dl="hash-app"]');
  const hashBox = document.querySelector('.hash-box');
  const hashCode = document.querySelector('[data-dl="app-hash"]');
  const copyHashBtn = document.getElementById('copy-hash-btn');

  if (hashToggle && hashBox) {
    hashToggle.addEventListener('click', () => {
      const isHidden = hashBox.hidden;
      hashBox.hidden = !isHidden;
      hashToggle.setAttribute('aria-expanded', String(isHidden));
      hashToggle.textContent = isHidden ? 'Ocultar huella SHA-256' : 'Ver huella SHA-256';
    });
  }

  if (copyHashBtn && hashCode) {
    copyHashBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(hashCode.textContent.trim());
        copyHashBtn.textContent = 'Copiado ✓';
        setTimeout(() => { copyHashBtn.textContent = 'Copiar'; }, 2000);
      } catch {
        copyHashBtn.textContent = 'Error';
      }
    });
  }

  // 5. Aviso discreto al iniciar descarga + detección opcional de plataforma
  const dlBtn = document.querySelector('[data-dl="app"]');
  const toast = document.getElementById('dl-toast');
  let toastTimer;

  if (dlBtn && toast) {
    dlBtn.addEventListener('click', () => {
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.hidden = true; }, 4500);
    });
  }

  const platformAlert = document.querySelector('[data-dl="platform"]');
  if (platformAlert && navigator.platform && !/Win/i.test(navigator.platform)) {
    platformAlert.hidden = false;
  }

  // 6. Animación de entrada de bloques
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  }
})();
