/* Sir Fazil Maniya · V5 · site behaviour (no libraries) */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
const D = window.MFM || {};
const WA = '923332488819';
const waLink = (m = 'Assalam o Alaikum Sir Fazil! I want to know more about your Islamiyat classes.') => `https://wa.me/${WA}?text=${encodeURIComponent(m)}`;
const go = sel => { const el = typeof sel === 'string' ? $(sel) : sel; if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); };

$('#yr').textContent = new Date().getFullYear();

/* ---------- segmented controls ---------- */
function seg(el, cb) {
  if (!el) return;
  el.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', el).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    cb && cb(b.dataset.v, b);
  });
}
const segVal = el => { const b = $('button[aria-pressed="true"]', el); return b ? b.dataset.v : ''; };

/* ---------- theme (paper / ink, circular reveal) ---------- */
(() => {
  const root = document.documentElement, btn = $('#themeBtn');
  const cur = () => root.dataset.theme === 'dark' ? 'dark' : 'light';
  const metaC = $$('meta[name="theme-color"]');
  const sync = () => { const d = cur() === 'dark'; btn.setAttribute('aria-checked', String(d)); metaC.forEach(m => m.setAttribute('content', d ? '#0b1914' : '#f3ecdc')); };
  sync();
  btn.addEventListener('click', () => {
    const next = cur() === 'dark' ? 'light' : 'dark';
    const apply = () => { root.dataset.theme = next; ls.set('mfmTheme5', next); sync(); document.dispatchEvent(new CustomEvent('hma:theme')); };
    btn.classList.remove('spin'); void btn.offsetWidth; btn.classList.add('spin');
    if (reduced || !document.startViewTransition) return apply();
    const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = document.startViewTransition(apply);
    t.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] }, { duration: 750, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
  });
})();

/* ---------- contents menu ---------- */
(() => {
  const body = document.body, btn = $('#menuBtn'), menu = $('#menu'), scrim = $('#menuScrim'), more = $('#moreBtn');
  let last = null;
  const isOpen = () => body.classList.contains('menu-open');
  function open() {
    last = document.activeElement; body.classList.add('menu-open'); menu.setAttribute('aria-hidden', 'false');
    [btn, more].forEach(b => b && b.setAttribute('aria-expanded', 'true'));
    const here = ($('#dock a[aria-current="true"]') || {}).hash;
    $$('.mi', menu).forEach(a => a.classList.toggle('here', a.hash === here));
    setTimeout(() => { const f = $('.mi', menu); f && f.focus({ preventScroll: true }); }, 380);
  }
  function close(focus = true) {
    if (!isOpen()) return; body.classList.remove('menu-open'); menu.setAttribute('aria-hidden', 'true');
    [btn, more].forEach(b => b && b.setAttribute('aria-expanded', 'false'));
    if (focus && last && last.focus) last.focus({ preventScroll: true });
  }
  btn.addEventListener('click', () => isOpen() ? close() : open());
  more && more.addEventListener('click', () => isOpen() ? close() : open());
  scrim.addEventListener('click', () => close());
  menu.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (a) { e.preventDefault(); close(false); setTimeout(() => go(a.getAttribute('href')), 260); } });
  addEventListener('keydown', e => {
    if (!isOpen()) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { const f = [btn, ...$$('a,button', menu)].filter(x => x.offsetParent !== null); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
  });
})();

/* ---------- top bar + dock state ---------- */
(() => {
  const top = $('#top'); let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    top.classList.toggle('solid', y > 30);
    top.classList.toggle('hide', y > 400 && y > lastY + 4);
    if (y < lastY - 4) top.classList.remove('hide');
    lastY = y;
  }, { passive: true });
  const links = $$('#dock a[href^="#"]');
  const map = { folio: 'home', about: 'home', timeline: 'courses', pack: 'courses', checker: 'lab', where: 'portal', notes: 'portal', life: 'portal', faq: 'contact' };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const id = map[e.target.id] || e.target.id;
    links.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + id)));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['home', 'courses', 'lab', 'portal', 'contact', ...Object.keys(map)].forEach(i => { const el = document.getElementById(i); el && io.observe(el); });
})();

/* ---------- reveals + counters ---------- */
const revIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revIO.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.rv-img').forEach(el => revIO.observe(el));
const cntIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting || reduced) return; cntIO.unobserve(e.target);
  const el = e.target, to = +el.dataset.count, t0 = performance.now();
  const tick = now => { const p = clamp((now - t0) / 1500, 0, 1), v = Math.round(to * (1 - Math.pow(1 - p, 4))); el.textContent = v.toLocaleString('en-US'); if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}), { threshold: .6 });
$$('[data-count]').forEach(el => cntIO.observe(el));

/* ---------- Seerah date marquee (scroll-linked speed) ---------- */
(() => {
  const m = $('#marquee'); if (!m) return;
  const items = [['570', 'The Year of the Elephant'], ['610', 'Revelation at Hira'], ['622', 'The Hijra'], ['624', 'Badr'], ['625', 'Uhud'], ['627', 'The Trench'], ['628', 'Hudaybiyya'], ['630', 'Makka opened'], ['632', 'The Farewell Sermon'], ['644', 'Uthman'], ['661', 'The four caliphs']];
  const one = items.map(([y, t]) => `<span><em>${y}</em>${esc(t)}<svg viewBox="0 0 24 24"><use href="#i-star"/></svg></span>`).join('');
  m.innerHTML = one + one;
  if (reduced) return;
  let x = 0, w = 0, boost = 0, last = scrollY, vis = true;
  const measure = () => { w = m.scrollWidth / 2; }; measure(); addEventListener('resize', measure);
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(m);
  addEventListener('scroll', () => { boost = Math.min(8, Math.abs(scrollY - last) * .25); last = scrollY; }, { passive: true });
  const loop = () => { if (vis) { x -= .6 + boost; boost *= .92; if (-x >= w) x += w; m.style.transform = `translate3d(${x}px,0,0)`; } requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
})();

/* ---------- lightbox ---------- */
const Lbx = (() => {
  const el = $('#lbx'), img = $('#lbxImg'), cap = $('#lbxC'); let list = [], i = 0, last = null;
  const show = () => { img.src = list[i].src; img.alt = list[i].alt; cap.textContent = `${list[i].alt} · ${i + 1} / ${list.length}`; };
  const open = (l, k) => { list = l; i = k; last = document.activeElement; show(); el.classList.add('open'); $('#lbxX').focus({ preventScroll: true }); };
  const close = () => { el.classList.remove('open'); last && last.focus && last.focus({ preventScroll: true }); };
  const step = d => { i = (i + d + list.length) % list.length; show(); };
  $('#lbxX').onclick = close; $('#lbxP').onclick = () => step(-1); $('#lbxN').onclick = () => step(1);
  el.addEventListener('click', e => { if (e.target === el) close(); });
  addEventListener('keydown', e => { if (!el.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
  let sx = 0; el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) step(d < 0 ? 1 : -1); });
  return { open };
})();

/* ---------- folio ---------- */
(() => {
  const plates = $$('#folio-grid .plate');
  const list = plates.map(p => { const im = $('img', p); return { src: im.getAttribute('src'), alt: $('figcaption b', p).textContent }; });
  plates.forEach((p, k) => p.addEventListener('click', () => Lbx.open(list, k)));
})();

/* ---------- life gallery ---------- */
(() => {
  const g = $('#lifeGrid'); if (!g) return;
  const items = $$('button[data-src]', g).map(b => ({ src: b.dataset.src, alt: $('img', b).alt }));
  g.addEventListener('click', e => { const b = e.target.closest('button[data-src]'); if (b) Lbx.open(items, $$('button[data-src]', g).indexOf(b)); });
})();

/* ---------- Islamiyat Lab ---------- */
const tabs = $$('.lab-tab'), inited = {}, INIT = {};
function openTab(t) {
  tabs.forEach(x => x.setAttribute('aria-selected', String(x === t)));
  $$('.panel').forEach(p => p.classList.toggle('active', p.id === t.getAttribute('aria-controls')));
  const id = t.getAttribute('aria-controls'); if (!inited[id]) { inited[id] = true; INIT[id] && INIT[id](); }
}
tabs.forEach(t => t.addEventListener('click', () => openTab(t)));
$('.lab-tabs').addEventListener('keydown', e => {
  if (!/Arrow(Left|Right)/.test(e.key)) return;
  const i = tabs.indexOf(document.activeElement); if (i < 0) return;
  const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); openTab(n);
});
$$('[data-tab]').forEach(a => a.addEventListener('click', () => { const t = $('#t-' + a.dataset.tab); t && openTab(t); }));

INIT['p-time'] = () => {
  const E = D.EVENTS || [], pair = $('#tlPair'), msg = $('#tlMsg');
  let era = 'all', streak = 0, best = +(ls.get('mfmBest') || 0), ok = 0, n = 0, cur = null, done = false;
  $('#tlBest').textContent = best;
  const pool = () => E.filter(([y]) => era === 'all' || (era === 'mak' ? y < 622 : y >= 622));
  function next() {
    const P = pool(); let a, b;
    do { a = P[Math.floor(Math.random() * P.length)]; b = P[Math.floor(Math.random() * P.length)]; } while (!a || !b || a[0] === b[0]);
    cur = [a, b]; done = false; msg.textContent = '';
    pair.innerHTML = `<button class="ev" type="button" data-i="0">${esc(a[1])}<span class="yr">${a[0]} CE</span></button><span class="tl-or">or</span><button class="ev" type="button" data-i="1">${esc(b[1])}<span class="yr">${b[0]} CE</span></button>`;
  }
  pair.addEventListener('click', e => {
    const b = e.target.closest('.ev'); if (!b || done) return; done = true; n++;
    const i = +b.dataset.i, first = cur[0][0] < cur[1][0] ? 0 : 1, right = i === first;
    $$('.ev', pair).forEach((x, k) => { x.classList.add('shown'); x.disabled = true; if (k === first) x.classList.add('right'); else if (k === i) x.classList.add('wrong'); });
    if (right) { ok++; streak++; if (streak > best) { best = streak; ls.set('mfmBest', best); } msg.textContent = `Correct. ${cur[first][1]} came first, in ${cur[first][0]}.`; }
    else { streak = 0; msg.textContent = `Not quite: ${cur[first][1]} (${cur[first][0]}) came before ${cur[1 - first][1]} (${cur[1 - first][0]}).`; }
    $('#tlStreak').textContent = streak; $('#tlBest').textContent = best; $('#tlScore').textContent = `${ok} / ${n}`;
  });
  seg($('#tlEra'), v => { era = v; next(); });
  $('#tlNext').addEventListener('click', next);
  next();
};
INIT['p-figs'] = () => {
  const deck = shuffle(D.FIGS || []); let known = 0, i = 0;
  const fc = $('#fc'), F = $('#fcF'), B = $('#fcB');
  $('#fcCount').textContent = deck.length;
  function draw() {
    const [n, sub, pts] = deck[i % deck.length]; fc.classList.remove('flip');
    F.innerHTML = `<small>who was…</small><b>${esc(n)}</b><span class="lbl">tap to flip</span>`;
    B.innerHTML = `<b>${esc(n)}</b><span class="lbl">${esc(sub)}</span><ul>${pts.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`;
  }
  fc.addEventListener('click', () => fc.classList.toggle('flip'));
  $('#fcYes').onclick = () => { known = Math.min(deck.length, known + 1); $('#fcKnown').textContent = known; i++; draw(); };
  $('#fcNo').onclick = () => { const k = i % deck.length, c = deck.splice(k, 1)[0]; deck.splice(Math.min(deck.length, k + 2), 0, c); draw(); };
  draw();
};
INIT['p-ab'] = () => {
  const Q = D.ABQ || {}, a = $('#abA'), g = $('#abGuide'); let t = '10';
  const words = s => s.trim() ? s.trim().split(/\s+/).length : 0;
  const tests = {
    date: s => /\b(\d{1,2}(st|nd|rd|th)?\s+ramadan|\d\s*AH|62\d)\b/i.test(s), nums: s => /\b(313|1,?000|950)\b/.test(s),
    ref: s => /\b\d{1,3}\s*[:.]\s*\d{1,3}\b|\b(surah?|sura|ayah?|verse|qur'?an says)\b/i.test(s), names: s => /\b(Abu Jahl|Hamza|Ali|Abu Sufyan|Ubayda|Utba|Shayba|Bilal|Abu Bakr|Umar|Jibril)\b/.test(s),
    facts: s => s.split(/[.;\n]/).filter(x => x.trim().length > 20).length >= 6, order: s => /\b(then|after|later|as a result|finally|before|when)\b/i.test(s),
    opinion: s => /\b(i (think|believe|agree|disagree)|in my (view|opinion)|yes,|no,|the most important)\b/i.test(s), because: s => /\b(because|since|therefore|this shows|this meant)\b/i.test(s),
    example: s => /\b(for example|for instance|such as|e\.g\.)\b/i.test(s), other: s => /\b(however|on the other hand|whereas|although|but)\b/i.test(s),
    short: s => { const w = words(s); return w >= 40 && w <= 220; },
  };
  function render() {
    const q = Q[t]; if (!q) return;
    $('#abQ').textContent = q.q; g.innerHTML = q.guide + `<ul class="checks" id="abChecks">${(q.checks || []).map(([k, l]) => `<li data-k="${k}">${esc(l)}</li>`).join('')}</ul>`; check();
  }
  function check() {
    const s = a.value; $('#abWords').textContent = `${words(s)} words`;
    const L = $$('#abChecks li'); let ok = 0;
    L.forEach(li => { const f = tests[li.dataset.k], y = !!(f && f(s)); li.classList.toggle('ok', y); ok += y; });
    $('#abMeter').style.setProperty('--v', L.length ? ok / L.length : 0); $('#abOk').textContent = `${ok} / ${L.length}`;
  }
  a.addEventListener('input', check);
  seg($('#abType'), v => { t = v; render(); });
  $('#abSend').addEventListener('click', async () => {
    const txt = `${Q[t].q}\n\n${a.value}`;
    try { await navigator.clipboard.writeText(txt); $('#abCopied').textContent = 'Copied. Paste it into the checker.'; } catch (e) { $('#abCopied').textContent = ''; }
    window.open('/ai-checker', '_blank', 'noopener');
  });
  render();
};
INIT['p-quiz'] = () => {
  let Qs = shuffle(D.QUIZ || []), i = 0, sc = 0, locked = false;
  function draw() {
    const [q, opts, x] = Qs[i % Qs.length]; locked = false;
    $('#gqN').textContent = `${(i % Qs.length) + 1} / ${Qs.length}`; $('#gqQ').textContent = q; $('#gqX').textContent = '';
    $('#gqO').innerHTML = shuffle(opts.map((o, k) => [o, k === 0])).map(([o, r]) => `<button type="button" data-r="${r ? 1 : 0}">${esc(o)}</button>`).join('');
    $('#gqO')._x = x;
  }
  $('#gqO').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || locked) return; locked = true;
    $$('#gqO button').forEach(x => { if (x.dataset.r === '1') x.classList.add('right'); });
    if (b.dataset.r === '1') { sc++; $('#gqX').textContent = 'Correct. ' + $('#gqO')._x; } else { b.classList.add('wrong'); $('#gqX').textContent = $('#gqO')._x; }
    $('#gqS').textContent = sc;
  });
  $('#gqNext').onclick = () => { i++; if (i % Qs.length === 0) { Qs = shuffle(Qs); sc = 0; $('#gqS').textContent = 0; } draw(); };
  draw();
};
INIT['p-cmd'] = () => {
  const box = $('#cw');
  box.innerHTML = (D.CW || []).map(([w, m, d, x], k) => `<button class="cw-i${k === 0 ? ' on' : ''}" type="button"><small>${esc(m)}</small><b>${esc(w)}</b><span>${esc(d.split(/[,:.]/)[0])}.</span><p>${esc(d)}<i>${esc(x)}</i></p></button>`).join('');
  box.addEventListener('click', e => { const b = e.target.closest('.cw-i'); if (b) $$('.cw-i', box).forEach(x => x.classList.toggle('on', x === b)); });
};
inited['p-time'] = true;
new IntersectionObserver(([e], o) => { if (e.isIntersecting) { INIT['p-time'](); o.disconnect(); } }, { rootMargin: '300px' }).observe($('#lab'));

/* ---------- era track: drag, buttons, progress ---------- */
(() => {
  const tr = $('#eraTrack'); if (!tr) return;
  const fill = $('#eraFill'), step = () => ($('.era', tr) || { offsetWidth: 320 }).offsetWidth + 16;
  const upd = () => { const m = tr.scrollWidth - tr.clientWidth; fill.style.transform = `scaleX(${m > 0 ? .12 + .88 * tr.scrollLeft / m : 1})`; };
  tr.addEventListener('scroll', upd, { passive: true }); upd();
  $('#eraPrev').onclick = () => tr.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' });
  $('#eraNext').onclick = () => tr.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' });
  tr.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); $('#eraNext').click(); } if (e.key === 'ArrowLeft') { e.preventDefault(); $('#eraPrev').click(); } });
  let down = false, sx = 0, sl = 0, moved = 0;
  tr.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = tr.scrollLeft; tr.classList.add('drag'); });
  addEventListener('pointermove', e => { if (!down) return; const d = e.clientX - sx; moved = Math.abs(d); tr.scrollLeft = sl - d; });
  addEventListener('pointerup', () => { if (!down) return; down = false; tr.classList.remove('drag'); });
  tr.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
})();

/* ---------- checker sample: tap a marked line ---------- */
(() => {
  const L = $('#ckLines'); if (!L) return;
  L.addEventListener('click', e => {
    const li = e.target.closest('li'); if (!li) return;
    $$('#ckLines li').forEach(x => x.classList.toggle('on', x === li));
    const c = $('#ckCmt'); c.innerHTML = li.dataset.c; c.classList.toggle('bad', li.classList.contains('err'));
  });
})();

/* ---------- portal preview ---------- */
(() => {
  const att = $('#ptAtt'); if (!att) return;
  const pattern = 'pppplpppppapppplppppppplpppp';
  att.innerHTML = [...pattern].map(c => `<i class="${c === 'a' ? 'a' : c === 'l' ? 'l' : ''}" title="${c === 'a' ? 'Absent' : c === 'l' ? 'Late' : 'Present'}"></i>`).join('');
  $('#ptDate').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  seg($('#ptRole'), v => {
    $$('#portal [data-role]').forEach(el => { el.hidden = el.dataset.role !== v; });
    $('#ptName').textContent = v === 'parent' ? 'Parent view' : 'Student dashboard';
  });
})();

/* ---------- contact form → WhatsApp ---------- */
(() => {
  const f = $('#joinForm'), out = $('#fMsgOut');
  const F = { name: $('#fName'), phone: $('#fPhone'), mode: $('#fMode'), course: $('#fCourse'), session: $('#fSession'), city: $('#fCity'), msg: $('#fMsg'), consent: $('#fConsent'), hp: $('#fWebsite') };
  seg($('#fRole'));
  $$('[data-course]').forEach(a => a.addEventListener('click', () => { F.course.value = a.dataset.course; }));
  const bad = (el, t) => { el.setAttribute('aria-invalid', 'true'); out.textContent = t; el.focus(); return false; };
  Object.values(F).forEach(el => el.addEventListener('input', () => el.removeAttribute('aria-invalid')));
  f.addEventListener('submit', e => {
    e.preventDefault(); out.textContent = ''; if (F.hp.value) return;
    if (F.name.value.trim().length < 3) return bad(F.name, 'Add the student\'s full name.');
    const ph = F.phone.value.replace(/[^\d+]/g, ''); if (!/^(\+?92|0)?3\d{9}$/.test(ph) && ph.replace(/\D/g, '').length < 10) return bad(F.phone, 'Add a WhatsApp number, e.g. 0333 2488819.');
    if (!F.mode.value) return bad(F.mode, 'Choose how you want to study.');
    if (!F.course.value) return bad(F.course, 'Choose a course.');
    if (!F.session.value) return bad(F.session, 'Choose your exam session.');
    if (!F.consent.checked) { out.textContent = 'Tick the box so Sir Fazil\'s team can reply on WhatsApp.'; F.consent.focus(); return; }
    const txt = `Assalam o Alaikum Sir Fazil! I'd like to join your Islamiyat classes.\n\nName: ${F.name.value.trim()}\nI am the: ${segVal($('#fRole'))}\nWhatsApp: ${F.phone.value.trim()}\nHow: ${F.mode.value}\nCourse: ${F.course.value}\nExam: ${F.session.value}${F.city.value.trim() ? `\nArea & school: ${F.city.value.trim()}` : ''}${F.msg.value.trim() ? `\nNote: ${F.msg.value.trim()}` : ''}`;
    const url = waLink(txt); $('#fOpen').href = url; window.open(url, '_blank', 'noopener');
    f.hidden = true; $('#fDone').hidden = false;
  });
  $('#fAgain').onclick = () => { f.reset(); f.hidden = false; $('#fDone').hidden = true; };
})();
})();
