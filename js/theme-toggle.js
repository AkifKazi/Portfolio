(function () {
  const storageKey = 'libellus-theme';
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const themeMeta = document.querySelector('meta[name="theme-color"][data-theme-color]');
  const themeColors = {
    light: '#FFFCF0',
    dark: '#100F0F'
  };

  const setMetaTheme = (mode) => {
    if (!themeMeta) return;
    themeMeta.setAttribute('content', themeColors[mode] || themeColors.light);
  };

  const readStoredTheme = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (err) {
      return null;
    }
    return null;
  };

  const storeTheme = (value) => {
    try {
      if (value === null) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, value);
      }
    } catch (err) { }
  };

  const getCurrentTheme = () => (root.dataset.theme === 'dark' ? 'dark' : 'light');

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    root.classList.toggle('theme-dark', theme === 'dark');
    if (document.body) {
      document.body.classList.toggle('theme-dark', theme === 'dark');
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.toggle('theme-dark', theme === 'dark');
      }, { once: true });
    }
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'dark');
    }
    setMetaTheme(theme);
  };

  const storedTheme = readStoredTheme();
  let initialTheme = null;
  if (storedTheme === 'light' || storedTheme === 'dark') {
    initialTheme = storedTheme;
  } else if (mediaQuery && typeof mediaQuery.matches === 'boolean') {
    initialTheme = mediaQuery.matches ? 'dark' : 'light';
  } else {
    initialTheme = getCurrentTheme();
  }
  applyTheme(initialTheme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      storeTheme(next);
    });
  }

  const handleSystemChange = (event) => {
    if (readStoredTheme()) return;
    applyTheme(event.matches ? 'dark' : 'light');
  };

  if (mediaQuery) {
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleSystemChange);
    }
  }
})();
