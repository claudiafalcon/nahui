/* ============================================================================
   Nahui — language switch.

   THIS FILE CONTAINS NO COPY, IN EITHER LANGUAGE, BY DESIGN.

   Every string on the page lives exactly once, in index.html, as a pair of
   adjacent elements marked data-l="es" / data-l="en". Switching languages is
   one attribute write on <html>; CSS does the rest. Nothing is injected,
   nothing is replaced, and the Spanish can never drift from a second copy of
   itself, because there is no second copy.

   The few values that are not text nodes — <title>, the meta descriptions,
   the aria-labels, the screenshot's alt — follow the same rule: the Spanish
   is the attribute already in the HTML, and only the English alternate is
   carried, once, in a data-* attribute beside it. The script reads both from
   the document; it never holds either.

   Run ?i18ncheck=1 to have the console list any translatable element missing
   its counterpart. That is the one divergence this design still allows — a
   string added in one language and forgotten in the other — so it is the one
   thing worth an automated check.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var KEY = 'nahui-lang';

  /* Attribute pairs: [selector, live attribute, attribute holding the English].
     The Spanish is whatever the live attribute already contains on load. */
  var ATTRS = [
    ['meta[name="description"]',          'content',    'data-en'],
    ['meta[property="og:description"]',   'content',    'data-en'],
    ['meta[name="twitter:description"]',  'content',    'data-en'],
    ['[data-aria-en]',                    'aria-label', 'data-aria-en'],
    ['[data-alt-en]',                     'alt',        'data-alt-en']
  ];

  /* The Spanish originals, captured once from the document itself. */
  var original = new Map();
  var originalTitle = document.title;                     /* the Spanish, as written */
  var titleEn = root.getAttribute('data-title-en');       /* the English, written once */

  ATTRS.forEach(function (spec) {
    Array.prototype.forEach.call(document.querySelectorAll(spec[0]), function (el) {
      if (!original.has(el)) original.set(el, {});
      original.get(el)[spec[1]] = el.getAttribute(spec[1]);
    });
  });

  function apply(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);

    document.title = (lang === 'en' && titleEn) ? titleEn : originalTitle;

    ATTRS.forEach(function (spec) {
      Array.prototype.forEach.call(document.querySelectorAll(spec[0]), function (el) {
        var en = el.getAttribute(spec[2]);
        var es = (original.get(el) || {})[spec[1]];
        var value = (lang === 'en' && en) ? en : es;
        if (value !== null && value !== undefined) el.setAttribute(spec[1], value);
      });
    });

    try { localStorage.setItem(KEY, lang); } catch (e) { /* private mode: fine */ }
  }

  apply(root.getAttribute('data-lang') === 'en' ? 'en' : 'es');

  Array.prototype.forEach.call(document.querySelectorAll('[data-lang-toggle]'), function (btn) {
    btn.addEventListener('click', function () {
      apply(root.getAttribute('data-lang') === 'en' ? 'es' : 'en');
    });
  });

  /* ---- parity check, on demand ------------------------------------------ */
  if (location.search.indexOf('i18ncheck=1') !== -1) {
    var problems = [];
    Array.prototype.forEach.call(document.querySelectorAll('.t'), function (el) {
      var l = el.getAttribute('data-l');
      var other = l === 'es' ? el.nextElementSibling : el.previousElementSibling;
      var want = l === 'es' ? 'en' : 'es';
      if (!other || !other.classList.contains('t') || other.getAttribute('data-l') !== want) {
        problems.push({ lang: l, node: el, text: (el.textContent || '').trim().slice(0, 60) });
      }
    });
    var es = document.querySelectorAll('.t[data-l="es"]').length;
    var en = document.querySelectorAll('.t[data-l="en"]').length;
    /* eslint-disable no-console */
    console.log('[i18n] translatable units — es:', es, 'en:', en);
    if (es !== en) console.error('[i18n] COUNT MISMATCH: every claim must exist in both languages.');
    if (problems.length) { console.error('[i18n] unpaired elements:', problems); }
    else { console.log('[i18n] every translatable element has its counterpart.'); }
    /* eslint-enable no-console */
  }
})();
