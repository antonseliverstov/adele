(function () {
  'use strict';

  var tablist = document.querySelector('[data-tabs]');

  if (!tablist) {
    return;
  }

  var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));

  function activate(tab) {
    tabs.forEach(function (item) {
      var isActive = item === tab;
      item.classList.toggle('tabs__tab--active', isActive);
      item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      item.setAttribute('tabindex', isActive ? '0' : '-1');

      var panel = document.getElementById(item.getAttribute('aria-controls'));
      if (panel) {
        panel.classList.toggle('tabs__panel--active', isActive);
        panel.hidden = !isActive;
      }
    });
    tab.focus();
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      activate(tab);
    });

    tab.addEventListener('keydown', function (event) {
      var nextIndex = null;
      if (event.key === 'ArrowRight') {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      }
      if (nextIndex !== null) {
        event.preventDefault();
        activate(tabs[nextIndex]);
      }
    });
  });
})();
