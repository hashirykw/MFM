/* MFM · classical sound, the sound switch and the cookie bar (Nov 2026).
   Sounds are made in the browser (no audio files): plucked harp strings (Karplus-Strong) in
   D major pentatonic, soft bells for the theme switch, all through a small hall reverb.
   One switch in the top bar turns them off and the choice is remembered ('ra-sound').
   Loaded before the page engine so the inner pages' own sound calls come here too. */
(function () {
  'use strict';
  const doc = document, root = doc.documentElement;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ sound engine */
  const S = (function () {
    let ctx = null, bus = null, dry = null, wet = null, on = store.get('ra-sound', true) !== false;
    const cache = new Map();
    function ensure() {
      if (!on) return null;
      if (!ctx) {
        try {
          ctx = new (window.AudioContext || window.webkitAudioContext)();
          bus = ctx.createGain(); bus.gain.value = .32;
          const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6800; lp.Q.value = .2;
          const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3; comp.attack.value = .004; comp.release.value = .2;
          dry = ctx.createGain(); dry.gain.value = .82; wet = ctx.createGain(); wet.gain.value = .34;
          const verb = ctx.createConvolver(); verb.buffer = hall(2.4);
          bus.connect(lp); lp.connect(dry); lp.connect(verb); verb.connect(wet); dry.connect(comp); wet.connect(comp); comp.connect(ctx.destination);
        } catch (e) { ctx = null; return null; }
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function hall(sec) {           // a soft stereo hall: decaying noise, darker as it fades
      const rate = ctx.sampleRate, len = Math.floor(rate * sec), b = ctx.createBuffer(2, len, rate);
      for (let ch = 0; ch < 2; ch++) {
        const d = b.getChannelData(ch); let lp = 0;
        for (let i = 0; i < len; i++) { const t = i / len, k = .55 - .45 * t; lp = lp + k * ((Math.random() * 2 - 1) - lp); d[i] = lp * Math.pow(1 - t, 2.6) * (i < rate * .012 ? i / (rate * .012) : 1); }
      }
      return b;
    }
    function string(freq, bright) {   // Karplus-Strong pluck, cached per pitch
      const key = freq.toFixed(1) + (bright ? 'b' : '');
      if (cache.has(key)) return cache.get(key);
      const rate = ctx.sampleRate, len = Math.floor(rate * 2.2), b = ctx.createBuffer(1, len, rate), d = b.getChannelData(0);
      const N = Math.max(2, Math.round(rate / freq)), ring = new Float32Array(N);
      for (let i = 0; i < N; i++) ring[i] = (Math.random() * 2 - 1) * (bright ? 1 : .8);
      let p = 0, prev = 0; const damp = bright ? .996 : .9935;
      for (let i = 0; i < len; i++) {
        const cur = ring[p], next = ring[(p + 1) % N], v = damp * .5 * (cur + next);
        ring[p] = v; d[i] = cur * .9 + prev * .1; prev = cur; p = (p + 1) % N;
      }
      // body: a gentle attack so it reads as a harp, not a click
      for (let i = 0; i < 64; i++) d[i] *= i / 64;
      cache.set(key, b); return b;
    }
    function pluck(freq, vol, when, pan, bright) {
      const c = ensure(); if (!c) return;
      const t = c.currentTime + (when || 0), s = c.createBufferSource(), g = c.createGain();
      s.buffer = string(freq, bright); g.gain.value = vol == null ? .5 : vol;
      let out = g;
      if (c.createStereoPanner) { const pn = c.createStereoPanner(); pn.pan.value = pan || 0; g.connect(pn); out = pn; }
      s.connect(g); out.connect(bus); s.start(t);
    }
    function bell(freq, vol, when, len) {     // a soft tuned bell (fundamental + inharmonic partials)
      const c = ensure(); if (!c) return;
      const t = c.currentTime + (when || 0), g = c.createGain(), L = len || 1.6;
      [[1, 1], [2.76, .34], [5.4, .12], [.5, .2]].forEach(([m, a]) => {
        const o = c.createOscillator(), og = c.createGain(); o.type = 'sine'; o.frequency.value = freq * m;
        og.gain.setValueAtTime(a, t); og.gain.exponentialRampToValueAtTime(.0001, t + L / (m > 1 ? m * .7 : 1));
        o.connect(og); og.connect(g); o.start(t); o.stop(t + L + .05);
      });
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol || .12, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + L);
      g.connect(bus);
    }
    function swish(vol, when) {               // a page turning
      const c = ensure(); if (!c) return;
      const t = c.currentTime + (when || 0), len = Math.floor(c.sampleRate * .32), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) { const x = i / len; d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * x) * (1 - x * .5); }
      const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = b; f.type = 'bandpass'; f.Q.value = .7; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(3200, t + .3);
      g.gain.value = vol || .1; s.connect(f); f.connect(g); g.connect(bus); s.start(t);
    }
    // D major pentatonic over two octaves
    const P = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25, 739.99, 880, 987.77, 1174.66];
    let step = 0, lastAt = 0;
    const api = {
      get on() { return on; },
      set(v) { on = !!v; store.set('ra-sound', on); if (on) { ensure(); api.chime(); } paint(); },
      unlock() { if (on) ensure(); },
      tap(el) {
        const now = performance.now(); if (now - lastAt < 45) return; lastAt = now;
        const big = el && el.matches && el.matches('.btn,.btn-x,.top-cta,[class*="btn"]');
        step = (step + 1 + (Math.random() * 2 | 0)) % 6;
        const f = P[(big ? 3 : 4) + step % 5];
        pluck(f, big ? .5 : .32, 0, (Math.random() - .5) * .4, big);
        if (big) pluck(f * 1.5, .14, .03, .15);
      },
      tick() {},
      click() { api.tap({ matches: () => true }); },
      soft() { pluck(P[2], .3); },
      open() { [0, 2, 4, 7].forEach((n, i) => pluck(P[n], .34 - i * .04, i * .055, -.3 + i * .2, true)); swish(.05, 0); },
      close() { [7, 4, 2].forEach((n, i) => pluck(P[n], .3 - i * .05, i * .05, .3 - i * .2)); },
      chime() { bell(P[5], .1, 0, 1.8); bell(P[8], .07, .09, 1.6); },
      light() { bell(P[8], .09, 0, 1.6); bell(P[10], .06, .1, 1.4); pluck(P[5], .22, .02); },
      dark() { bell(P[0] * 2, .1, 0, 2.2); bell(P[3], .06, .12, 2); pluck(P[0], .26, .02); },
      coin() { [5, 7, 9].forEach((n, i) => pluck(P[n], .3, i * .07, 0, true)); },
      ok() { [0, 2, 4, 5].forEach((n, i) => pluck(P[n + 3], .3, i * .08, 0, true)); bell(P[8], .05, .32, 1.6); },
      err() { pluck(220, .4, 0); pluck(207.65, .32, .1); },
      stamp() { pluck(146.83, .5, 0, 0, true); swish(.06, 0); },
      whoosh() { swish(.1, 0); },
      alarm() { [0, .3, .6].forEach(w => bell(P[8], .1, w, .9)); },
      page() { swish(.08, 0); }
    };
    return api;
  })();
  window.MFMSound = S;

  /* ------------------------------------------------------------ where sounds happen */
  addEventListener('pointerdown', () => S.unlock(), { once: true, capture: true });
  doc.addEventListener('click', e => {
    const t = e.target.closest('a,button,summary,[role="button"],[role="tab"],label.seg,.mi,.chip-btn');
    if (!t || t.closest('[data-nosnd]') || t.id === 'menuBtn' || t.id === 'themeBtn' || t.classList.contains('snd-btn')) return;
    if (t.matches('summary') || t.closest('details')) { S.soft(); return; }
    S.tap(t);
  }, true);
  // menu open / close: a harp run up, a run down
  let menuOpen = doc.body && doc.body.classList.contains('menu-open');
  const watch = () => new MutationObserver(() => {
    const o = doc.body.classList.contains('menu-open'); if (o === menuOpen) return; menuOpen = o; o ? S.open() : S.close();
  }).observe(doc.body, { attributes: true, attributeFilter: ['class'] });
  // theme: a bright bell into Paper, a low one into Ink
  let theme = root.dataset.theme;
  new MutationObserver(() => { const t = root.dataset.theme; if (t === theme) return; theme = t; t === 'dark' ? S.dark() : S.light(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  /* ------------------------------------------------------------ the sound switch (top bar) */
  const ICON_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.4L12.2 5.6v12.8L7.4 14.5H4z" class="sp"/><path class="w1" d="M15.4 9.4a3.6 3.6 0 0 1 0 5.2"/><path class="w2" d="M17.9 6.9a7.2 7.2 0 0 1 0 10.2"/><path class="x" d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';
  let btn = null;
  function paint() {
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(S.on)); btn.classList.toggle('off', !S.on);
    btn.setAttribute('aria-label', S.on ? 'Sound effects on. Turn them off' : 'Sound effects off. Turn them on');
    btn.title = S.on ? 'Sound on' : 'Sound off';
  }
  function mountSwitch() {
    const bar = doc.querySelector('.top .top-r'); if (!bar || bar.querySelector('.snd-btn')) return;
    btn = doc.createElement('button'); btn.type = 'button'; btn.className = 'snd-btn'; btn.innerHTML = ICON_ON;
    const anchor = bar.querySelector('#themeBtn') || bar.querySelector('#menuBtn');
    bar.insertBefore(btn, anchor); paint();
    btn.addEventListener('click', () => { S.set(!S.on); toast(S.on ? 'Sound effects on' : 'Sound effects off'); });
  }

  /* ------------------------------------------------------------ toast (themed, shared) */
  function toast(msg) {
    let box = doc.querySelector('.lx-toasts');
    if (!box) { box = doc.createElement('div'); box.className = 'lx-toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); doc.body.appendChild(box); }
    const t = doc.createElement('div'); t.className = 'lx-toast'; t.textContent = msg; box.appendChild(t);
    requestAnimationFrame(() => t.classList.add('in'));
    setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 450); }, 1700);
  }

  /* ------------------------------------------------------------ cookie bar */
  function cookieBar() {
    if (store.get('mfm-cookies', null)) return;
    const bar = doc.createElement('section');
    bar.className = 'lx-cookie'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Cookies and storage');
    bar.innerHTML =
      '<span class="lx-cookie-seal" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M20 3l4.2 6.8 7.8-1.9-1.9 7.8L37 20l-6.8 4.2 1.9 7.8-7.8-1.9L20 37l-4.2-6.8-7.8 1.9 1.9-7.8L3 20l6.8-4.2-1.9-7.8 7.8 1.9z"/><circle cx="20" cy="20" r="6.2"/></svg></span>' +
      '<div class="lx-cookie-t"><b>No tracking, no ad cookies.</b><p>This site only remembers your theme, the sound setting and your notes cart on this device, so the next visit opens the way you left it.</p></div>' +
      '<div class="lx-cookie-a"><button type="button" class="btn btn--sm btn--gold" data-ck="ok">Okay</button><button type="button" class="btn btn--sm btn--line" data-ck="min">Sound off</button></div>';
    doc.body.appendChild(bar);
    setTimeout(() => bar.classList.add('in'), 900);
    bar.addEventListener('click', e => {
      const b = e.target.closest('[data-ck]'); if (!b) return;
      if (b.dataset.ck === 'min' && S.on) S.set(false);
      store.set('mfm-cookies', { at: Date.now() });
      bar.classList.remove('in'); setTimeout(() => bar.remove(), 600);
    });
  }

  /* ------------------------------------------------------------ pop-ups (themed): notes, longer text and every card */
  const Pop = window.MFMPop = (() => {
    let el = null, last = null, from = null;
    const card = () => el.querySelector('.lx-pop-card');
    const build = () => {
      el = doc.createElement('div'); el.className = 'lx-pop'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.hidden = true;
      el.innerHTML = '<div class="lx-pop-card"><button type="button" class="lx-pop-x" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><span class="lx-pop-k" aria-hidden="true"></span><span class="lx-pop-kk"></span><b class="lx-pop-t"></b><div class="lx-pop-b"></div><div class="lx-pop-a"></div></div>';
      doc.body.appendChild(el);
      el.addEventListener('click', e => { if (e.target === el || e.target.closest('.lx-pop-x')) close(); });
      addEventListener('keydown', e => {
        if (!el || el.hidden) return;
        if (e.key === 'Escape') close();
        if (e.key === 'Tab') { const f = [...el.querySelectorAll('a[href],button')]; const k = f.indexOf(doc.activeElement); if (e.shiftKey && k <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && k === f.length - 1) { e.preventDefault(); f[0].focus(); } }
      });
    };
    // grows out of the card that was tapped, and folds back into it on close
    const fromRect = (r, c) => { const b = c.getBoundingClientRect(); return `translate(${(r.left + r.width / 2) - (b.left + b.width / 2)}px,${(r.top + r.height / 2) - (b.top + b.height / 2)}px) scale(${Math.max(.2, Math.min(r.width / b.width, 1))},${Math.max(.15, Math.min(r.height / b.height, 1))})`; };
    function open(title, html, opt = {}) {
      if (!el) build(); last = doc.activeElement; from = opt.from || null;
      el.querySelector('.lx-pop-t').textContent = title || '';
      el.querySelector('.lx-pop-kk').textContent = opt.kicker || ''; el.querySelector('.lx-pop-kk').hidden = !opt.kicker;
      el.querySelector('.lx-pop-b').innerHTML = html || '';
      const a = el.querySelector('.lx-pop-a'); a.innerHTML = ''; (opt.actions || []).forEach(x => a.appendChild(x)); a.hidden = !a.children.length;
      el.classList.toggle('lx-pop--wide', !!opt.wide);
      el.setAttribute('aria-label', title || 'Details'); el.hidden = false; doc.documentElement.classList.add('lx-pop-lock');
      const c = card(); c.scrollTop = 0;
      if (from && !reduced && c.animate) {
        el.classList.add('in');
        c.animate([{ transform: fromRect(from.getBoundingClientRect(), c), opacity: .2, borderRadius: '28px' }, { transform: 'none', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.2,.9,.25,1.12)' });
        [...el.querySelectorAll('.lx-pop-kk,.lx-pop-t,.lx-pop-b > *,.lx-pop-a > *')].forEach((x, k) => x.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 140 + k * 45, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }));
      } else requestAnimationFrame(() => el.classList.add('in'));
      el.querySelector('.lx-pop-x').focus({ preventScroll: true }); S.soft();
    }
    function close() {
      if (!el || el.hidden) return;
      const c = card(), done = () => { el.hidden = true; doc.documentElement.classList.remove('lx-pop-lock'); };
      el.classList.remove('in');
      if (from && !reduced && c.animate && from.isConnected) { const r = from.getBoundingClientRect(); c.animate([{ transform: 'none', opacity: 1 }, { transform: fromRect(r, c), opacity: 0 }], { duration: 340, easing: 'cubic-bezier(.5,0,.75,0)' }).onfinish = done; }
      else setTimeout(done, 320);
      last && last.focus && last.focus({ preventScroll: true });
    }
    return { open, close };
  })();
  doc.addEventListener('click', e => {
    const b = e.target.closest('[data-pop-from],[data-pop-text]'); if (!b) return;
    const src = b.dataset.popFrom ? doc.querySelector(b.dataset.popFrom) : null;
    Pop.open(b.dataset.popTitle, src ? '<p>' + src.innerHTML + '</p>' : '<p>' + (b.dataset.popText || '') + '</p>', { from: b });
  });

  /* ------------------------------------------------------------ every card opens a fuller view */
  const CARDS = ['.course', '.method .step', '.era:not(.era--end)', '.notes .note', '.pack-list > div', '.ck-steps li', '.where > div',
    'main article.card', 'main li.card', 'main .jr-card'].join(',');
  const NOT_ON = /^(portal|parent|past-papers|lab)$/;
  const WA = '923332488819';
  const ESC = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const key = t => (t || '').toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  // a little more than the card has room for
  const MORE = {
    "the qur'an the prophet the first community": '<h4>What Paper 1 asks</h4><ul><li><b>Question 1:</b> two of three set passages. Give the main themes, then their importance for Muslims (4 + 4).</li><li><b>Question 2:</b> the history and importance of the Qur\'an (10 + 4).</li><li><b>Questions 3–5:</b> answer two, on the life of the Prophet and the first community.</li></ul><p>Sir Fazil teaches the passages by theme and the Seerah in date order, so every part (a) has its names, dates and references.</p>',
    'the hadiths the caliphs faith the pillars': '<h4>What Paper 2 asks</h4><ul><li><b>Question 1:</b> two of four set Hadiths: their teaching and how Muslims act on it.</li><li><b>Question 2:</b> the history and importance of the Hadiths (10 + 4).</li><li><b>Questions 3–5:</b> answer two, on the Rightly Guided Caliphs and the Articles of Faith and Pillars.</li></ul><p>Each Caliph is taught as one story: how he came to lead, what he did, and why it matters.</p>',
    'igcse islamiyat the recorded course': '<h4>Same syllabus, more ways to study</h4><ul><li>IGCSE 0493 has the same two papers and content as O Level 2058, graded A* to G.</li><li>Live batches in Karachi and online for students in other cities and abroad.</li><li>The recorded course: about 54 hours of topical lectures in Urdu, at your own pace.</li></ul>',
    'know it in order': '<p>Every topic is learnt in sequence: the passages by theme, the Seerah from Makka to Madina, then the Caliphs and the Pillars. Order is what lets a part (a) answer flow from cause to event to result.</p>',
    'back it with evidence': '<p>Each point carries the verse or Hadith that proves it, quoted briefly and accurately. A short, correct reference is worth more than a long paraphrase.</p>',
    'say why it matters': '<p>Part (b) is four marks for understanding, not more history. Give your view, a reason with <i>because</i>, and a real example from life today.</p>',
    'passages weekly': '<p>A few passages and Hadiths every week, revised in short bursts, so all 35 are secure well before May instead of crammed in the last month.</p>',
    'marked then fixed': '<p>Topical past-paper answers are marked against the Cambridge levels, then rewritten. Most students climb a level in a few rounds.</p>',
  };
  function eraEvents(c) {
    const y = (c.querySelector('.era-y') || {}).textContent || '', m = y.match(/(\d{3})\D+(\d{3})/), E = (window.MFM && window.MFM.EVENTS) || [];
    if (!m) return '';
    const ev = E.filter(([v]) => v >= +m[1] && v <= +m[2]);
    return ev.length ? '<h4>Key dates</h4><ol class="lx-pop-dates">' + ev.map(([v, t]) => `<li><b>${v}</b><span>${ESC(t)}</span></li>`).join('') + '</ol>' : '';
  }
  function cardParts(c) {
    const x = c.cloneNode(true);
    x.querySelectorAll('.lx-more,svg.corner,script,style,img,canvas,video,.era-d').forEach(n => n.remove());
    const t = x.querySelector('h2,h3,h4,.h3') || x.querySelector('dd b,b,strong');
    const title = t ? t.textContent.trim() : (c.textContent || '').trim().slice(0, 60);
    let kicker = '';
    const cand = [...x.querySelectorAll('.n,.era-n,.era-y,.code b,.code .lbl,.lbl,small,i,dt,span')].filter(n => !n.querySelector('.n,.era-n,.era-y,.lbl,small,i,dt,span,b'));
    for (const n of cand) {
      if (!n.parentNode || (t && (n === t || n.contains(t) || t.contains(n)))) continue;
      if (t && !(n.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
      const s = n.textContent.trim(); if (s && s.length <= 28) { kicker = (kicker ? kicker + ' · ' : '') + s; n.remove(); if (kicker.length > 18) break; }
    }
    if (t) t.remove();
    const acts = [];
    x.querySelectorAll('a[href]').forEach(a => { const b = a.cloneNode(true); b.classList.add('btn', 'btn--sm'); acts.push(b); a.remove(); });
    x.querySelectorAll('button,input,select,textarea,form').forEach(n => n.remove());
    // little stat groups ("1h 30m" + "duration") read as one line: 1h 30m duration · 50 marks
    [...x.querySelectorAll('*')].reverse().forEach(n => {
      const kids = [...n.children]; if (kids.length < 2 || n.querySelector('p,ul,ol,h4') || n === x) return;
      if (!kids.every(k => k.textContent.trim().length && k.textContent.trim().length <= 26)) return;
      const leaf = kids.every(k => !k.children.length || k.dataset.f);
      const p = doc.createElement('p'); p.dataset.f = '1';
      p.textContent = kids.map(k => k.textContent.trim().replace(/\s+/g, ' ')).join(leaf ? ' ' : ' · ');
      n.replaceWith(p);
    });
    x.querySelectorAll('*').forEach(n => { if (!n.children.length && /^\d{1,2}$/.test(n.textContent.trim())) n.remove(); });   // a big card numeral is not content
    x.querySelectorAll('[style]').forEach(n => n.removeAttribute('style'));
    x.querySelectorAll('[class]').forEach(n => n.removeAttribute('class'));
    x.querySelectorAll('[data-f]').forEach(n => { n.removeAttribute('data-f'); n.className = 'lx-pop-facts'; });
    const body = x.innerHTML.replace(/<(div|span)>\s*<\/\1>/g, '').trim();
    return { title, kicker, body, acts };
  }
  function openCard(c) {
    const { title, kicker, body, acts } = cardParts(c);
    if (c.tagName === 'A' && c.getAttribute('href')) { const a = doc.createElement('a'); a.href = c.getAttribute('href'); a.className = 'btn btn--sm'; a.innerHTML = 'Open ' + ESC(title) + ' <svg class="arr" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; acts.unshift(a); }
    acts.forEach(a => { if (a.dataset.course) a.addEventListener('click', () => { const f = doc.getElementById('fCourse'); if (f) f.value = a.dataset.course; Pop.close(); }); else if ((a.getAttribute('href') || '').startsWith('#')) a.addEventListener('click', () => Pop.close()); });
    const w = doc.createElement('a'); w.className = 'btn btn--sm btn--line lx-pop-wa'; w.target = '_blank'; w.rel = 'noopener';
    w.href = `https://wa.me/${WA}?text=${encodeURIComponent('Assalam o Alaikum Sir Fazil! A question about: ' + title)}`; w.textContent = 'Ask Sir Fazil';
    acts.push(w);
    const more = (MORE[key(title)] || '') + (c.classList.contains('era') ? eraEvents(c) : '');
    Pop.open(title, (body ? '<div class="lx-pop-lead">' + body + '</div>' : '') + more, { kicker, actions: acts, from: c });
  }
  function wireCards() {
    if (NOT_ON.test(doc.body.dataset.page || '')) return;
    doc.querySelectorAll(CARDS).forEach(c => {
      if (c.classList.contains('lx-card') || c.querySelector('input,select,textarea,canvas,form') || c.closest('.lx-pop,.app,.menu,.modal,form,[data-no-pop]')) return;
      if ((c.textContent || '').trim().length < 12) return;
      c.classList.add('lx-card');
      if (c.tagName !== 'A' && c.tagName !== 'BUTTON') { c.tabIndex = 0; c.setAttribute('role', 'button'); }
      c.setAttribute('aria-haspopup', 'dialog');
      const m = doc.createElement('span'); m.className = 'lx-more'; m.setAttribute('aria-hidden', 'true');
      m.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'; c.appendChild(m);
    });
  }
  doc.addEventListener('click', e => {
    const c = e.target.closest('.lx-card'); if (!c) return;
    const hit = e.target.closest('a,button,input,select,textarea,summary,label');
    if (hit && hit !== c) return;                  // the card's own links and buttons keep working
    if (e.defaultPrevented) return;                // a drag on the era track is not a tap
    e.preventDefault(); openCard(c);
  });
  doc.addEventListener('keydown', e => { const c = e.target.closest && e.target.closest('.lx-card'); if (c && e.target === c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openCard(c); } });

  /* ------------------------------------------------------------ a soft ink ripple on every button press */
  doc.addEventListener('pointerdown', e => {
    if (reduced) return;
    const b = e.target.closest('.btn,.lab-tab,.seg button,.iconbtn'); if (!b) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2, s = doc.createElement('span');
    s.className = 'lx-rip'; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
    b.appendChild(s); setTimeout(() => s.remove(), 700);
  }, { passive: true });

  function start() { watch(); mountSwitch(); cookieBar(); wireCards(); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start();
})();
