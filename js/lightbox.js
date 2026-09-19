(function () {
  'use strict';

  var lightbox = document.querySelector('[data-lightbox]');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox-item]'));

  if (!lightbox || !items.length) {
    return;
  }

  var image = lightbox.querySelector('[data-lightbox-image]');
  var caption = lightbox.querySelector('[data-lightbox-caption]');
  var counter = lightbox.querySelector('[data-lightbox-counter]');
  var closeBtn = lightbox.querySelector('[data-lightbox-close]');
  var prevBtn = lightbox.querySelector('[data-lightbox-prev]');
  var nextBtn = lightbox.querySelector('[data-lightbox-next]');

  var currentIndex = 0;
  var lastFocused = null;
  var touchStartX = null;

  function render() {
    var item = items[currentIndex];
    var img = item.querySelector('img');
    var src = item.getAttribute('data-full') || (img && img.getAttribute('src'));
    var alt = img ? img.getAttribute('alt') : item.getAttribute('data-caption');

    image.classList.toggle('lightbox__image--placeholder', !src);
    if (src) {
      image.src = src;
    } else {
      image.removeAttribute('src');
    }
    image.alt = alt;
    caption.textContent = alt;
    counter.textContent = (currentIndex + 1) + ' / ' + items.length;
  }

  function open(index) {
    currentIndex = index;
    lastFocused = document.activeElement;
    render();
    lightbox.classList.add('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocused) {
      lastFocused.focus();
    }
  }

  function show(delta) {
    currentIndex = (currentIndex + delta + items.length) % items.length;
    render();
  }

  items.forEach(function (item, index) {
    item.addEventListener('click', function () {
      open(index);
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(-1); });
  nextBtn.addEventListener('click', function () { show(1); });

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {
      close();
    }
  });

  lightbox.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      close();
    } else if (event.key === 'ArrowLeft') {
      show(-1);
    } else if (event.key === 'ArrowRight') {
      show(1);
    } else if (event.key === 'Tab') {
      var focusable = [closeBtn, prevBtn, nextBtn];
      var idx = focusable.indexOf(document.activeElement);
      event.preventDefault();
      var nextIdx = event.shiftKey
        ? (idx <= 0 ? focusable.length - 1 : idx - 1)
        : (idx === focusable.length - 1 ? 0 : idx + 1);
      focusable[nextIdx].focus();
    }
  });

  lightbox.addEventListener('touchstart', function (event) {
    touchStartX = event.changedTouches[0].clientX;
  });

  lightbox.addEventListener('touchend', function (event) {
    if (touchStartX === null) {
      return;
    }
    var delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      show(delta > 0 ? -1 : 1);
    }
    touchStartX = null;
  });
})();
