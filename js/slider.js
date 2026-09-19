(function () {
  'use strict';

  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var track = slider.querySelector('[data-slider-track]');
    var prev = slider.querySelector('[data-slider-prev]');
    var next = slider.querySelector('[data-slider-next]');
    var first = track && track.firstElementChild;

    if (!first || !prev || !next) {
      return;
    }

    function step() {
      var gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
      return first.offsetWidth + gap;
    }

    function update() {
      prev.disabled = track.scrollLeft < 1;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    }

    prev.addEventListener('click', function () {
      track.scrollBy({ left: -step() });
    });
    next.addEventListener('click', function () {
      track.scrollBy({ left: step() });
    });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
