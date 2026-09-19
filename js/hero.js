(function () {
  'use strict';

  var video = document.querySelector('[data-hero-video]');

  if (!video) {
    return;
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function syncPlayback() {
    if (reduceMotion.matches) {
      video.pause();
    } else {
      video.play().catch(function () {});
    }
  }

  syncPlayback();
  reduceMotion.addEventListener('change', syncPlayback);

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (reduceMotion.matches) {
          return;
        }
        if (entry.isIntersecting) {
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      });
    });
    observer.observe(video);
  }
})();
