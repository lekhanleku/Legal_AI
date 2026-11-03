/**
 * LegalAI — Global Theme Manager (Dark / Light Theme Engine)
 * Automatically detects, applies, and persists the user's preferred theme.
 * Dispatches 'legalai-theme-change' custom event on toggle.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'legalai_theme';

  // Retrieve stored theme or default to 'dark'
  function getTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch (_) {}
    return 'dark'; // Default LegalAI luxury dark theme
  }

  // Update UI indicators on all theme toggle buttons across the page
  function updateToggleButtons(theme) {
    const isLight = theme === 'light';
    const buttons = document.querySelectorAll('.theme-toggle-btn');

    buttons.forEach((btn) => {
      btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      btn.setAttribute('title', isLight ? 'Switch to Dark Theme (🌙)' : 'Switch to Light Theme (☀️)');
      
      const textSpan = btn.querySelector('.theme-toggle-text');
      if (textSpan) {
        textSpan.textContent = isLight ? 'Light' : 'Dark';
      }

      const iconMoon = btn.querySelector('.theme-icon-moon');
      const iconSun = btn.querySelector('.theme-icon-sun');
      if (iconMoon && iconSun) {
        if (isLight) {
          iconMoon.classList.add('hidden');
          iconSun.classList.remove('hidden');
        } else {
          iconMoon.classList.remove('hidden');
          iconSun.classList.add('hidden');
        }
      }

      if (isLight) {
        btn.classList.add('theme-light-active');
      } else {
        btn.classList.remove('theme-light-active');
      }
    });
  }

  // Apply theme to document element and body
  function setTheme(theme, showToastNotification) {
    const targetTheme = (theme === 'light') ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    if (document.body) {
      document.body.setAttribute('data-theme', targetTheme);
    }

    try {
      localStorage.setItem(STORAGE_KEY, targetTheme);
    } catch (_) {}

    updateToggleButtons(targetTheme);

    // Notify other components or charts
    window.dispatchEvent(new CustomEvent('legalai-theme-change', {
      detail: { theme: targetTheme }
    }));

    if (showToastNotification && typeof window.showToast === 'function') {
      const msg = (targetTheme === 'light') 
        ? '☀️ Switched to Light Theme' 
        : '🌙 Switched to Dark Theme';
      window.showToast(msg, 'info');
    }
  }

  // Toggle between dark and light
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getTheme();
    const next = (current === 'light') ? 'dark' : 'light';
    setTheme(next, true);
  }

  // Immediately apply theme before full render
  const initial = getTheme();
  document.documentElement.setAttribute('data-theme', initial);

  // When DOM loads, synchronize controls and listeners
  document.addEventListener('DOMContentLoaded', () => {
    setTheme(getTheme(), false);

    // Global event delegation for theme toggle buttons
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.theme-toggle-btn');
      if (toggleBtn) {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      }
    });
  });

  // Listen for storage changes from other browser tabs
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
      setTheme(e.newValue, false);
    }
  });

  // Public API
  window.LegalAITheme = {
    get: getTheme,
    set: setTheme,
    toggle: toggleTheme
  };
})();

