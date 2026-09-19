(function () {
  'use strict';

  var burger = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');

  if (!burger || !menu) {
    return;
  }

  function openMenu() {
    menu.classList.add('mobile-menu--open');
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    menu.classList.remove('mobile-menu--open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    burger.focus();
  }

  burger.addEventListener('click', function () {
    if (menu.classList.contains('mobile-menu--open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('mobile-menu--open')) {
      closeMenu();
    }
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();
