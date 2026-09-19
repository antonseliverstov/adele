(function () {
  'use strict';

  var STORAGE_KEY = 'adel-lang';
  var dictionaries = window.ADEL_I18N = window.ADEL_I18N || {};
  var switcher = document.querySelector('[data-lang-switch]');
  var toggle = document.querySelector('[data-lang-toggle]');
  var list = document.querySelector('[data-lang-list]');
  var LANGS = Array.prototype.map.call(document.querySelectorAll('[data-lang]'), function (btn) {
    return btn.getAttribute('data-lang');
  });

  function normalize(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  var records = [];
  document.querySelectorAll('[data-i18n], [data-i18n-attr]').forEach(function (el) {
    var record = { el: el, text: null, attrs: {} };
    if (el.hasAttribute('data-i18n')) {
      record.text = el.textContent;
    }
    (el.getAttribute('data-i18n-attr') || '').split(',').forEach(function (name) {
      name = name.trim();
      if (name && el.hasAttribute(name)) {
        record.attrs[name] = el.getAttribute(name);
      }
    });
    records.push(record);
  });

  function translate(source, lang) {
    var dict = dictionaries[lang];
    var key = normalize(source);
    return dict && Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : source;
  }

  function readStored() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function store(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {

    }
  }

  function detect() {
    var stored = readStored();
    return LANGS.indexOf(stored) !== -1 ? stored : 'en';
  }

  function load(lang, done) {
    if (lang === 'en' || dictionaries[lang]) {
      done();
      return;
    }
    var script = document.createElement('script');
    script.src = 'js/i18n/' + lang + '.js';
    script.onload = done;
    script.onerror = done;
    document.head.appendChild(script);
  }

  function setOpen(open) {
    if (!toggle || !list) {
      return;
    }
    list.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function apply(lang) {
    records.forEach(function (record) {
      if (record.text !== null) {
        record.el.textContent = translate(record.text, lang);
      }
      Object.keys(record.attrs).forEach(function (name) {
        record.el.setAttribute(name, translate(record.attrs[name], lang));
      });
    });

    document.documentElement.setAttribute('lang', lang);

    if (switcher) {
      switcher.querySelectorAll('[data-lang]').forEach(function (btn) {
        var active = btn.getAttribute('data-lang') === lang;
        btn.classList.toggle('lang-switch__option--active', active);
        if (active) {
          btn.setAttribute('aria-current', 'true');
          toggle.querySelector('[data-lang-flag]').src = btn.querySelector('img').src;
          toggle.querySelector('[data-lang-code]').textContent = lang.toUpperCase();
        } else {
          btn.removeAttribute('aria-current');
        }
      });
    }
  }

  if (switcher) {
    toggle.addEventListener('click', function () {
      setOpen(list.hidden);
    });

    switcher.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-lang]');
      if (!btn) {
        return;
      }
      var lang = btn.getAttribute('data-lang');
      store(lang);
      load(lang, function () {
        apply(lang);
      });
      setOpen(false);
      toggle.focus();
    });

    document.addEventListener('click', function (event) {
      if (!switcher.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !list.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  var initial = detect();
  load(initial, function () {
    apply(initial);
  });
})();
