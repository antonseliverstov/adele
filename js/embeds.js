(function () {
  'use strict';

  var embeds = document.querySelectorAll('[data-embed] iframe[data-src]');

  if (!embeds.length) {
    return;
  }

  function load(iframe) {
    var src = iframe.getAttribute('data-src');
    if (src) {
      iframe.src = src;
    }
    iframe.removeAttribute('data-src');
  }

  if (!('IntersectionObserver' in window)) {
    embeds.forEach(load);
    return;
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        load(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });

  embeds.forEach(function (iframe) {
    observer.observe(iframe);
  });
})();
