/* Sir Fazil Maniya · the prayer corner: today's salah times, the Hijri date and the
   countdown to Ramadan, from the AlAdhan API (free, no key). Cached per day on the device.
   To use another API, set window.MFM_PRAYER_API before this file loads and keep the same shape. */
(() => {
'use strict';
const box = document.getElementById('salah'); if (!box) return;
const $ = s => box.querySelector(s);
const API = window.MFM_PRAYER_API || 'https://api.aladhan.com/v1';
const CITIES = [
  { id: 'khi', n: 'Karachi', c: 'Pakistan', m: 1 },
  { id: 'lhr', n: 'Lahore', c: 'Pakistan', m: 1 },
  { id: 'isb', n: 'Islamabad', c: 'Pakistan', m: 1 },
  { id: 'dxb', n: 'Dubai', c: 'United Arab Emirates', m: 16 },
  { id: 'ruh', n: 'Riyadh', c: 'Saudi Arabia', m: 4 },
  { id: 'doh', n: 'Doha', c: 'Qatar', m: 10 },
  { id: 'lon', n: 'London', c: 'United Kingdom', m: 15 },
  { id: 'tor', n: 'Toronto', c: 'Canada', m: 2 }
];
const NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const AR = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
const ls = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
const pad = n => String(n).padStart(2, '0');
const fmtD = d => pad(d.getDate()) + '-' + pad(d.getMonth() + 1) + '-' + d.getFullYear();
const clean = t => String(t || '').slice(0, 5);
const to12 = t => { const [h, m] = clean(t).split(':').map(Number); if (isNaN(h)) return '—'; return ((h + 11) % 12 + 1) + ':' + pad(m) + (h < 12 ? ' am' : ' pm'); };

let city = CITIES.find(c => c.id === ls.get('mfm-salah-city')) || CITIES[0];
const S = window.MFM_PRAYER = { city, today: null, tomorrow: null, tz: 'Asia/Karachi', ramadan: null, next: null, now: null };

/* the time in the city's own zone, as minutes after midnight plus seconds */
function cityNow(tz) {
  try {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(x => [x.type, x.value]));
    return { h: +p.hour % 24, m: +p.minute, s: +p.second, date: p.day + '-' + p.month + '-' + p.year };
  } catch (e) { const d = new Date(); return { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds(), date: fmtD(d) }; }
}
async function get(url, key) {
  const hit = ls.get(key); if (hit) return hit;
  const r = await fetch(url, { cache: 'no-store' }); if (!r.ok) throw new Error(r.status);
  const j = await r.json(); if (j.code !== 200) throw new Error(j.status);
  ls.set(key, j.data); return j.data;
}
const timings = (c, d) => get(`${API}/timingsByCity/${d}?city=${encodeURIComponent(c.n)}&country=${encodeURIComponent(c.c)}&method=${c.m}&school=1`, `mfm-salah:${c.id}:${d}`);

async function load() {
  box.classList.add('loading');
  try {
    const t = new Date(), tm = new Date(Date.now() + 864e5);
    const [a, b] = await Promise.all([timings(city, fmtD(t)), timings(city, fmtD(tm))]);
    S.city = city; S.today = a; S.tomorrow = b; S.tz = (a.meta && a.meta.timezone) || 'Asia/Karachi';
    const local = cityNow(S.tz).date;
    if (local !== fmtD(t)) { // the city is already a day ahead or behind
      const [x, y] = local === fmtD(tm) ? [b, await timings(city, fmtD(new Date(Date.now() + 2 * 864e5)))] : [await timings(city, local), a];
      S.today = x; S.tomorrow = y;
    }
    await ramadan();
    box.classList.remove('loading', 'offline');
  } catch (e) {
    box.classList.remove('loading'); box.classList.add('offline');
    $('#spNextName').textContent = 'Offline';
    $('#spNextAt').textContent = 'Times will show once you are back online.';
  }
  paint(); document.dispatchEvent(new CustomEvent('mfm:salah'));
}

async function ramadan() {
  const h = S.today.date.hijri, y = +h.year, m = +h.month.number;
  if (m === 9) {
    const g = await get(`${API}/hToG/01-10-${y}`, `mfm-eid:${y}`);
    S.ramadan = { now: true, day: +h.day, y, eid: g.gregorian.date };
  } else {
    const yy = m < 9 ? y : y + 1;
    const g = await get(`${API}/hToG/01-09-${yy}`, `mfm-ram:${yy}`);
    S.ramadan = { now: false, y: yy, start: g.gregorian.date };
  }
}
const parseDMY = s => { const [d, m, y] = s.split('-').map(Number); return new Date(y, m - 1, d); };

function paint() {
  const T = S.today; if (!T) return;
  const h = T.date.hijri, g = T.date.gregorian;
  $('#spHijri').textContent = `${+h.day} ${h.month.en} ${h.year} AH`;
  $('#spHijriAr').textContent = `${h.day} ${h.month.ar} ${h.year}`;
  $('#spGreg').textContent = `${g.weekday.en}, ${+g.day} ${g.month.en} ${g.year} · ${city.n}`;
  $('#spList').innerHTML = NAMES.map(n => `<li data-n="${n}"><span class="sp-n">${n}<small lang="ar">${AR[n]}</small></span><b>${to12(T.timings[n])}</b></li>`).join('');
  const R = S.ramadan;
  if (R) {
    if (R.now) {
      $('#spRamL').textContent = `Ramadan ${R.y} · day ${R.day}`;
      const d = Math.max(0, Math.ceil((parseDMY(R.eid) - new Date()) / 864e5));
      $('#spRamD').textContent = d; $('#spRamU').textContent = d === 1 ? 'day to Eid' : 'days to Eid al-Fitr';
      $('#spRamT').textContent = `Eid al-Fitr expected on ${parseDMY(R.eid).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}, subject to moon sighting.`;
    } else {
      $('#spRamL').textContent = `Ramadan ${R.y} AH`;
      const st = parseDMY(R.start), d = Math.max(0, Math.ceil((st - new Date()) / 864e5));
      $('#spRamD').textContent = d; $('#spRamU').textContent = d === 1 ? 'day to go' : 'days to go';
      $('#spRamT').textContent = `Expected to begin around ${st.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}, subject to moon sighting.`;
      const bar = $('#spRamBar'); if (bar) bar.style.setProperty('--p', Math.max(.03, 1 - d / 354).toFixed(3));
    }
  }
  tick();
}

function tick() {
  const T = S.today; if (!T) return;
  const n = cityNow(S.tz), nowS = n.h * 3600 + n.m * 60 + n.s;
  const sec = t => { const [hh, mm] = clean(t).split(':').map(Number); return hh * 3600 + mm * 60; };
  const list = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  let next = list.find(k => sec(T.timings[k]) > nowS), at, left;
  if (next) { at = T.timings[next]; left = sec(at) - nowS; }
  else { next = 'Fajr'; at = (S.tomorrow || T).timings.Fajr; left = 86400 - nowS + sec(at); }
  const cur = [...list].reverse().find(k => sec(T.timings[k]) <= nowS) || 'Isha';
  S.next = next; S.current = cur; S.now = n; S.left = left;
  $('#spNextName').textContent = next;
  $('#spNextAr').textContent = AR[next];
  $('#spNextAt').textContent = 'at ' + to12(at) + (next === 'Fajr' && !list.find(k => sec(T.timings[k]) > nowS) ? ' tomorrow' : '');
  $('#spCount').textContent = `${pad(Math.floor(left / 3600))}:${pad(Math.floor(left % 3600 / 60))}:${pad(left % 60)}`;
  box.querySelectorAll('#spList li').forEach(li => { li.classList.toggle('next', li.dataset.n === next); li.classList.toggle('now', li.dataset.n === cur); });
  $('#spClock').textContent = `${pad(n.h)}:${pad(n.m)}`;
}

/* city picker */
const sel = $('#spCity');
sel.innerHTML = CITIES.map(c => `<option value="${c.id}"${c.id === city.id ? ' selected' : ''}>${c.n}</option>`).join('');
sel.addEventListener('change', () => { city = CITIES.find(c => c.id === sel.value) || CITIES[0]; ls.set('mfm-salah-city', city.id); load(); });

let started = false;
const go = () => { if (started) return; started = true; load(); setInterval(() => { tick(); const n = cityNow(S.tz); if (S.today && n.date !== S.today.date.gregorian.date) load(); }, 1000); };
if ('IntersectionObserver' in window) new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { go(); o.disconnect(); } }, { rootMargin: '600px' }).observe(box); else go();
})();
