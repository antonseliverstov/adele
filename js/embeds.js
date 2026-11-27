(function () {
  'use strict';

  // Click-to-load players: nothing from YouTube or SoundCloud loads (and no
  // third-party cookies are set) until the visitor presses play.
  document.querySelectorAll('[data-embed-src]').forEach(function (button) {
    button.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = button.getAttribute('data-embed-src');
      iframe.title = button.getAttribute('data-embed-title') || '';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;

      var holder = document.createElement('div');
      holder.className = button.className.replace('embed--facade', 'embed--loaded');
      holder.appendChild(iframe);
      button.replaceWith(holder);
      iframe.focus();
    });
  });
})();
