/* XD Property Rental Ltd - mobile menu, smooth scrolling and legal dialogs */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    var openIcon = toggle.querySelector('[data-icon="open"]');
    var closeIcon = toggle.querySelector('[data-icon="close"]');
    if (openIcon) openIcon.classList.toggle('hidden', open);
    if (closeIcon) closeIcon.classList.toggle('hidden', !open);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768 && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
      }
    });
  }

  /* ---------- Smooth scrolling for in-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var hash = link.getAttribute('href');
      if (!hash || hash.length < 2) return;
      var target = document.getElementById(hash.slice(1));
      if (!target) return;

      event.preventDefault();
      setMenu(false);
      target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });

      if (history.pushState) {
        history.pushState(null, '', hash);
      }
      // Re-trigger :target styling and move keyboard focus to the destination.
      if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
      if (hash === '#registered-office') {
        target.classList.remove('is-highlighted');
        void target.offsetWidth;
        target.classList.add('is-highlighted');
      }
    });
  });

  /* ---------- Legal dialogs ---------- */
  var lastTrigger = null;

  document.querySelectorAll('[data-open-dialog]').forEach(function (button) {
    button.addEventListener('click', function () {
      var dialog = document.getElementById(button.getAttribute('data-open-dialog'));
      if (!dialog || typeof dialog.showModal !== 'function') return;
      lastTrigger = button;
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('dialog-open');
      var closeButton = dialog.querySelector('[data-close-dialog]');
      if (closeButton) closeButton.focus();
    });
  });

  document.querySelectorAll('dialog').forEach(function (dialog) {
    dialog.querySelectorAll('[data-close-dialog]').forEach(function (button) {
      button.addEventListener('click', function () {
        dialog.close();
      });
    });

    // Close when clicking the dimmed backdrop outside the dialog box.
    dialog.addEventListener('click', function (event) {
      if (event.target !== dialog) return;
      var rect = dialog.getBoundingClientRect();
      var inside = event.clientX >= rect.left && event.clientX <= rect.right &&
        event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) dialog.close();
    });

    // Esc closes a modal <dialog> natively; tidy up afterwards.
    dialog.addEventListener('close', function () {
      document.body.classList.remove('dialog-open');
      if (lastTrigger) {
        lastTrigger.focus();
        lastTrigger = null;
      }
    });
  });

  /* ---------- Current year in the footer ---------- */
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = year;
  });
})();
