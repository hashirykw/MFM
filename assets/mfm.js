/* MFM v2 · small additions that run before the engine boots.
   The deck: groups of cards are set one over the next in 3D on laptops (see .v2-deck in mfm.css);
   on phones they stay a swipe rail. */
(function () {
  'use strict';
  var DECKS = ['.acc-grid', '.cw-track'];
  DECKS.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (g) {
      var cards = Array.prototype.filter.call(g.children, function (c) { return c.classList.contains('card'); });
      if (cards.length < 2 || cards.length > 6) return;
      g.classList.add('v2-deck', 'v2-deck-' + cards.length);
      cards.forEach(function (c, i) { c.style.setProperty('--i', i); });
    });
  });
})();
(function () {
  'use strict';
  var fit = function () {
    document.querySelectorAll('.v2-deck').forEach(function (g) {
      var n = g.classList.contains('v2-deck-6') ? 1100 : 700;
      var on = innerWidth >= n;
      g.classList.toggle('v2-on', on);
      /* the swipe-rail rules live in a cascade layer with !important, so the deck steps out of them by dropping the attribute */
      if (on && g.hasAttribute('data-rail')) { g.dataset.railWas = g.getAttribute('data-rail'); g.removeAttribute('data-rail'); }
      if (!on && g.dataset.railWas != null && !g.hasAttribute('data-rail')) g.setAttribute('data-rail', g.dataset.railWas);
    });
  };
  fit(); addEventListener('resize', fit, { passive: true });
})();
/* deck: click (or Enter) opens a card flat and dims the rest; outside click or Escape closes */
(function () {
  'use strict';
  document.querySelectorAll('.v2-deck').forEach(function (g) {
    var hint = document.createElement('p'); hint.className = 'v2-deck-hint';
    hint.textContent = g.classList.contains('acc-grid') ? 'Hover a card to lift it · click to open it' : 'Hover a card to lift it · click to read it flat';
    (g.nextElementSibling && g.nextElementSibling.classList.contains('rail-ctl') ? g.nextElementSibling : g).after(hint);
    var close = function () { g.classList.remove('picked'); g.querySelectorAll('.card.on').forEach(function (c) { c.classList.remove('on'); }); };
    g.addEventListener('click', function (e) {
      if (!g.classList.contains('v2-on')) return;
      var c = e.target.closest('.card'); if (!c || c.parentElement !== g) return;
      if (e.target.closest('a,button') && c.classList.contains('on')) return; /* links work once the card is open */
      if (e.target.closest('a') && !c.classList.contains('on')) e.preventDefault();
      var was = c.classList.contains('on'); close();
      if (!was) { c.classList.add('on'); g.classList.add('picked'); }
    });
    g.querySelectorAll(':scope > .card').forEach(function (c) {
      if (!c.hasAttribute('tabindex')) c.setAttribute('tabindex', '0');
      c.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === c && g.classList.contains('v2-on')) { e.preventDefault(); c.click(); } });
    });
    document.addEventListener('click', function (e) { if (!g.contains(e.target)) close(); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    /* once the spread has landed, hovers answer at once instead of waiting their stagger */
    if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { setTimeout(function () { g.classList.add('set'); }, 1600); io.disconnect(); } }); io.observe(g); } else g.classList.add('set');
  });
})();
/* themed dropdowns: every native <select> gets a glass list in the site's style (the select stays underneath for forms and scripts) */
(function () {
  'use strict';
  var CHEV = '<svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 1l5 5 5-5"/></svg>';
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function closeAll(except) { document.querySelectorAll('.xsel.open').forEach(function (x) { if (x !== except) x._close(); }); }
  function enhance(sel) {
    if (sel._x || sel.multiple || sel.size > 1) return;
    var wrap = document.createElement('div'); wrap.className = 'xsel';
    sel.parentNode.insertBefore(wrap, sel); wrap.appendChild(sel);
    sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'xsel-btn';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    var lb = sel.id && document.querySelector('label[for="' + sel.id + '"]');
    if (lb) { lb.id = lb.id || sel.id + '-lb'; btn.setAttribute('aria-labelledby', lb.id); lb.addEventListener('click', function (e) { e.preventDefault(); btn.focus(); }); }
    var list = document.createElement('ul'); list.className = 'xsel-list'; list.setAttribute('role', 'listbox'); list.tabIndex = -1;
    wrap.appendChild(btn); wrap.appendChild(list);
    var act = -1;
    function sync() {
      var o = sel.options[sel.selectedIndex];
      btn.innerHTML = '<span class="' + (!o || o.value === '' ? 'ph' : '') + '">' + esc(o ? o.textContent : '') + '</span>' + CHEV;
      btn.disabled = sel.disabled;
    }
    function build() {
      list.innerHTML = Array.prototype.map.call(sel.options, function (o, i) {
        return '<li role="option" data-i="' + i + '" aria-selected="' + (i === sel.selectedIndex ? 'true' : 'false') + '"' + (o.disabled ? ' aria-disabled="true"' : '') + '><span>' + esc(o.textContent) + '</span></li>';
      }).join('');
    }
    function mark() { Array.prototype.forEach.call(list.children, function (li, i) { li.classList.toggle('act', i === act); }); var c = list.children[act]; if (c) c.scrollIntoView({ block: 'nearest' }); }
    function open() {
      closeAll(wrap); build();
      var r = btn.getBoundingClientRect(); wrap.classList.toggle('up', innerHeight - r.bottom < 260 && r.top > 300);
      wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); act = Math.max(0, sel.selectedIndex); mark();
    }
    function close(focus) { if (!wrap.classList.contains('open')) return; wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); if (focus) btn.focus({ preventScroll: true }); }
    wrap._close = close;
    function pick(i) { var o = sel.options[i]; if (!o || o.disabled) return; sel.selectedIndex = i; sync(); sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(true); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); wrap.classList.contains('open') ? close() : open(); });
    list.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) { e.stopPropagation(); pick(+li.dataset.i); } });
    btn.addEventListener('keydown', function (e) {
      var isOpen = wrap.classList.contains('open');
      if (!isOpen && ['ArrowDown', 'ArrowUp', 'Enter', ' '].indexOf(e.key) > -1) { e.preventDefault(); open(); return; }
      if (!isOpen) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); act = Math.min(act + 1, sel.options.length - 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); act = Math.max(act - 1, 0); mark(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(act); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
      else if (e.key === 'Tab') close();
    });
    sel.addEventListener('change', sync);
    new MutationObserver(function () { sync(); if (wrap.classList.contains('open')) build(); }).observe(sel, { childList: true, subtree: true, attributes: true });
    /* scripts that set .value directly do not fire change: keep the label honest */
    var d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    if (d && d.set) Object.defineProperty(sel, 'value', { get: function () { return d.get.call(sel); }, set: function (v) { d.set.call(sel, v); sync(); }, configurable: true });
    sel._x = { sync: sync };
    sync();
  }
  function all(root) { (root || document).querySelectorAll('select').forEach(enhance); }
  document.addEventListener('click', function () { closeAll(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  var run = function () { all(); new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType !== 1) return; if (n.tagName === 'SELECT') enhance(n); else if (n.querySelectorAll) all(n); }); }); }).observe(document.body, { childList: true, subtree: true }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
