/* MFM v2 · additions that run before the engine boots.
   The flow: card groups sit on a curve, the middle card facing you and the others turning
   inward and stepping back (the glass-carousel reference). Prev / next, dots, swipe, arrow keys;
   a side card clicked slides to the centre. */
(function () {
  'use strict';
  var CH = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (d < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>'; };
  document.querySelectorAll('.acc-grid,.cw-track').forEach(function (g) {
    var cards = Array.prototype.filter.call(g.children, function (c) { return c.classList.contains('card'); });
    if (cards.length < 2) return;
    if (g.hasAttribute('data-rail')) { g.dataset.railWas = g.getAttribute('data-rail'); g.removeAttribute('data-rail'); }
    g.classList.add('v2-flow', g.classList.contains('cw-track') ? 'v2-flow-words' : 'v2-flow-courses');
    g.setAttribute('role', 'region'); g.setAttribute('aria-roledescription', 'carousel');
    var n = cards.length, act = g.classList.contains('cw-track') ? 2 : 0;
    var title = function (c) { var h = c.querySelector('h3,b'); return h ? h.textContent.trim() : ''; };
    var ctl = document.createElement('div'); ctl.className = 'v2-flow-ctl';
    ctl.innerHTML = '<button type="button" class="v2-flow-b" data-d="-1" aria-label="Previous">' + CH(-1) + '</button>' +
      '<span class="v2-flow-now" aria-live="polite"><b></b><i></i></span>' +
      '<button type="button" class="v2-flow-b" data-d="1" aria-label="Next">' + CH(1) + '</button>';
    var dots = document.createElement('div'); dots.className = 'v2-flow-dots';
    dots.innerHTML = cards.map(function (c, i) { return '<button type="button" aria-label="' + title(c).replace(/"/g, '') + '"></button>'; }).join('');
    g.after(ctl); ctl.after(dots);
    function set(k) {
      act = (k + n) % n;
      cards.forEach(function (c, i) {
        var d = i - act;
        /* wrap so the curve stays balanced on both sides */
        if (d > n / 2) d -= n; if (d < -n / 2) d += n;
        c.style.setProperty('--d', d); c.style.setProperty('--ad', Math.abs(d));
        c.classList.toggle('is-c', d === 0); c.classList.toggle('is-far', Math.abs(d) > 2);
        c.setAttribute('aria-hidden', Math.abs(d) > 2 ? 'true' : 'false');
        c.tabIndex = d === 0 ? 0 : -1;
      });
      ctl.querySelector('b').textContent = title(cards[act]);
      ctl.querySelector('i').textContent = (act + 1) + ' / ' + n;
      Array.prototype.forEach.call(dots.children, function (b, i) { b.classList.toggle('on', i === act); });
    }
    cards.forEach(function (c, i) {
      c.addEventListener('click', function (e) { if (!c.classList.contains('is-c')) { e.preventDefault(); e.stopImmediatePropagation(); set(i); } }, true);
    });
    ctl.addEventListener('click', function (e) { var b = e.target.closest('[data-d]'); if (b) set(act + +b.dataset.d); });
    dots.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) set(Array.prototype.indexOf.call(dots.children, b)); });
    g.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { set(act + 1); cards[act].focus({ preventScroll: true }); } if (e.key === 'ArrowLeft') { set(act - 1); cards[act].focus({ preventScroll: true }); } });
    /* swipe / drag */
    var x0 = null, moved = false;
    g.addEventListener('pointerdown', function (e) { x0 = e.clientX; moved = false; });
    g.addEventListener('pointermove', function (e) { if (x0 != null && Math.abs(e.clientX - x0) > 8) moved = true; });
    addEventListener('pointerup', function (e) { if (x0 == null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) set(act + (dx < 0 ? 1 : -1)); });
    g.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    set(act);
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

/* course cards: the card shows the syllabus; the details open in the site's pop-up */
(function () {
  'use strict';
  document.querySelectorAll('.acc.card').forEach(function (c) {
    var open = function (e) {
      if (e && e.target.closest('a')) return;
      if (c.closest('.v2-flow') && !c.classList.contains('is-c')) return; /* side cards first slide to the centre */
      if (!window.RA || !RA.modal) return;
      var img = c.querySelector('.acc-ph img'), ok = img && img.complete && img.naturalWidth;
      var tag = c.querySelector('.acc-h .tag'), h = c.querySelector('.acc-h h3'), sub = c.querySelector('.acc-sub'), code = c.querySelector('.code');
      var body = c.querySelector('.acc-t'), link = c.querySelector('.acc-f a.link');
      RA.modal('<div class="acc-pop">' + (ok ? '<figure class="acc-pop-ph"><img src="' + img.getAttribute('src') + '" alt=""></figure>' : '') +
        '<div class="acc-pop-h"><div>' + (tag ? '<span class="tag">' + tag.textContent + '</span>' : '') + '<h2 id="mTitle">' + (h ? h.textContent : '') + '</h2>' + (sub ? '<p class="acc-sub">' + sub.innerHTML + '</p>' : '') + '</div>' + (code ? '<b class="acc-pop-code">' + code.textContent + '</b>' : '') + '</div>' +
        (body ? '<div class="acc-t">' + body.innerHTML + '</div>' : '') +
        (link ? '<a class="btn btn-pri" href="' + link.getAttribute('href') + '">Full course page</a>' : '') + '</div>');
    };
    c.setAttribute('tabindex', '0'); c.setAttribute('role', 'button');
    c.setAttribute('aria-label', ((c.querySelector('.acc-sub') || c).textContent || '').trim() + ': view details');
    c.addEventListener('click', open);
    c.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === c) { e.preventDefault(); open(); } });
  });
})();
/* forms: smoked glass panels floating over matte silver shapes (the reference login forms) */
(function () {
  'use strict';
  document.querySelectorAll('#regForm,#eForm,#paForm,#loginForm,#verifyForm,#rvForm').forEach(function (f, n) {
    if (f.closest('.v2-stage')) return;
    var st = document.createElement('div'); st.className = 'v2-stage v2-stage-' + (n % 3);
    f.parentNode.insertBefore(st, f);
    st.innerHTML = '<span class="v2-orb v2-orb-a" aria-hidden="true"></span><span class="v2-orb v2-orb-b" aria-hidden="true"></span><span class="v2-orb v2-orb-c" aria-hidden="true"></span>';
    st.appendChild(f); f.classList.add('v2-form');
    /* keep the form's own reveal on the stage */
    if (f.hasAttribute('data-rv')) { st.setAttribute('data-rv', f.getAttribute('data-rv')); f.removeAttribute('data-rv'); f.classList.add('in'); }
  });
})();
