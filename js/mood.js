(function () {
  'use strict';

  // Afro (espresso) / House (night blue) mood switch.
  // The saved choice is applied in <head> before paint; this script wires the buttons.
  var KEY = 'adel-mood';
  var root = document.documentElement;
  var buttons = document.querySelectorAll('[data-mood]');
  var heroPhoto = document.querySelector('[data-hero-photo]');
  var themeColor = document.querySelector('meta[name="theme-color"]');
  var COLORS = { afro: '#291915', house: '#0b1a36' };

  function current() {
    return root.getAttribute('data-theme') === 'house' ? 'house' : 'afro';
  }

  function apply(mood, animate) {
    if (animate) {
      root.classList.add('mood-anim');
      window.setTimeout(function () { root.classList.remove('mood-anim'); }, 600);
    }
    if (mood === 'house') {
      root.setAttribute('data-theme', 'house');
    } else {
      root.removeAttribute('data-theme');
    }
    buttons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-mood') === mood ? 'true' : 'false');
    });
    if (heroPhoto) {
      var src = heroPhoto.getAttribute('data-' + mood + '-src');
      if (src && heroPhoto.getAttribute('src') !== src) {
        heroPhoto.setAttribute('src', src);
      }
    }
    if (themeColor) {
      themeColor.setAttribute('content', COLORS[mood]);
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mood = btn.getAttribute('data-mood');
      try { window.localStorage.setItem(KEY, mood); } catch (e) {}
      apply(mood, true);
    });
  });

  apply(current(), false);
})();
