(function () {
  'use strict';
  var d = document;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* header: solid after scroll */
  var hdr = $('.hdr');
  function onScroll() { hdr.classList.toggle('is-solid', window.scrollY > 24); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* mobile nav */
  var burger = $('#burger'), nav = $('#nav');
  function setNav(open) {
    nav.classList.toggle('open', open);
    hdr.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  /* reveal on scroll */
  var items = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el, i) {
      var sib = el.parentElement ? $$(':scope > .reveal', el.parentElement) : [];
      var idx = sib.indexOf(el);
      if (idx > 0 && idx < 5) el.style.transitionDelay = (idx * 70) + 'ms';
      io.observe(el);
    });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  /* menu tabs */
  var tabs = $$('[role="tab"]');
  function selectTab(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on);
      x.tabIndex = on ? 0 : -1;
      var p = d.getElementById(x.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') n = tabs[0];
      if (e.key === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  /* dish preview */
  $$('.menu__panel').forEach(function (panel) {
    var btns = $$('.dish__name', panel);
    function show(b) {
      var key = b.getAttribute('data-show');
      btns.forEach(function (x) {
        var on = x === b;
        x.setAttribute('aria-pressed', on);
        x.parentNode.classList.toggle('is-on', on);
      });
      $$('.menu__img', panel).forEach(function (f) {
        f.classList.toggle('is-on', f.getAttribute('data-img') === key);
      });
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () { show(b); });
      b.addEventListener('mouseenter', function () { if (window.matchMedia('(hover:hover)').matches) show(b); });
      b.addEventListener('focus', function () { show(b); });
    });
  });

  /* lightbox */
  var lb = $('#lb'), lbImg = $('#lb-img'), lbCap = $('#lb-cap');
  var thumbs = $$('.gal__item'), cur = 0, opener = null;
  function load(i) {
    cur = (i + thumbs.length) % thumbs.length;
    var t = thumbs[cur];
    lbImg.src = t.getAttribute('data-full');
    lbImg.alt = t.getAttribute('data-alt');
    lbCap.textContent = t.getAttribute('data-alt');
  }
  if (lb && typeof lb.showModal === 'function') {
    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () { opener = t; load(i); lb.showModal(); });
    });
    $('.lb__x').addEventListener('click', function () { lb.close(); });
    $('.lb__prev').addEventListener('click', function () { load(cur - 1); });
    $('.lb__next').addEventListener('click', function () { load(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', function () { if (opener) opener.focus(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') load(cur + 1);
      if (e.key === 'ArrowLeft') load(cur - 1);
    });
  } else {
    thumbs.forEach(function (t) { t.style.cursor = 'default'; });
  }
})();
