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


/* ---------- on-device fallback (Nov 2026): if the times service can't be reached, work the times
   out here with the same method (standard solar formulas; Karachi/MWL-style angles, Hanafi Asr) and
   take the Hijri date from the browser's Umm al-Qura calendar, so the corner never shows a dead end. */
const GEO = { khi: [24.8607, 67.0011, 'Asia/Karachi', 18, 18], lhr: [31.5204, 74.3587, 'Asia/Karachi', 18, 18], isb: [33.6844, 73.0479, 'Asia/Karachi', 18, 18],
  dxb: [25.2048, 55.2708, 'Asia/Dubai', 18.2, 18.2], ruh: [24.7136, 46.6753, 'Asia/Riyadh', 18.5, '90'], doh: [25.2854, 51.531, 'Asia/Qatar', 18, '90'],
  lon: [51.5074, -0.1278, 'Europe/London', 18, 17], tor: [43.6532, -79.3832, 'America/Toronto', 15, 15] };
const HM_EN = ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah'];
const HM_AR = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
const DR = Math.PI / 180, fix = (a, b) => ((a % b) + b) % b;
function tzOffset(tz, d) { try { const p = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(d).find(x => x.type === 'timeZoneName').value; const m = p.match(/GMT([+-]\d+)(?::(\d+))?/); return m ? +m[1] + (m[2] ? Math.sign(+m[1]) * m[2] / 60 : 0) : 0; } catch (e) { return 5; } }
function hijri(d) { try { const p = Object.fromEntries(new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' }).formatToParts(d).map(x => [x.type, x.value])); return { day: +p.day, month: +p.month, year: parseInt(p.year) }; } catch (e) { return null; } }
function solar(y, m, d, lat, lng, tz, fa, ia) {
  const A = Math.floor((14 - m) / 12), Y = y + 4800 - A, Mo = m + 12 * A - 3;
  const jd = d + Math.floor((153 * Mo + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045 - .5 - lng / 360;
  const D = jd - 2451545, g = fix(357.529 + .98560028 * D, 360), q = fix(280.459 + .98564736 * D, 360);
  const L = fix(q + 1.915 * Math.sin(g * DR) + .02 * Math.sin(2 * g * DR), 360), e = 23.439 - .00000036 * D;
  const ra = fix(Math.atan2(Math.cos(e * DR) * Math.sin(L * DR), Math.cos(L * DR)) / DR / 15, 24), dec = Math.asin(Math.sin(e * DR) * Math.sin(L * DR)) / DR;
  const eqt = q / 15 - ra, noon = fix(12 - eqt - lng / 15 + tz, 24);
  const T = a => Math.acos((-Math.sin(a * DR) - Math.sin(dec * DR) * Math.sin(lat * DR)) / (Math.cos(dec * DR) * Math.cos(lat * DR))) / DR / 15;
  const asrA = -Math.atan(1 / (2 + Math.tan(Math.abs(lat - dec) * DR))) / DR;   // Hanafi: shadow twice the height
  const rise = noon - T(.833), set = noon + T(.833), night = 24 - (set - rise);
  let fajr = noon - T(fa); if (isNaN(fajr)) fajr = rise - night / 7;
  let isha = typeof ia === 'string' ? set + (+ia) / 60 : noon + T(ia); if (isNaN(isha)) isha = set + night / 7;
  const f = h => { h = fix(h + .5 / 60, 24); return pad(Math.floor(h)) + ':' + pad(Math.floor(h % 1 * 60)); };
  return { Fajr: f(fajr), Sunrise: f(rise), Dhuhr: f(noon + 1 / 60), Asr: f(noon + T(asrA)), Maghrib: f(set + 1 / 60), Isha: f(isha) };
}
function localDay(c, offsetDays) {
  const [lat, lng, tz, fa, ia] = GEO[c.id] || GEO.khi;
  const n = cityNow(tz).date.split('-').map(Number), base = new Date(Date.UTC(n[2], n[1] - 1, n[0] + offsetDays, 12));
  const y = base.getUTCFullYear(), m = base.getUTCMonth() + 1, d = base.getUTCDate(), hj = hijri(base) || { day: 1, month: 1, year: 1448 };
  return { timings: solar(y, m, d, lat, lng, tzOffset(tz, base), fa, ia), meta: { timezone: tz },
    date: { hijri: { day: String(hj.day), month: { en: HM_EN[hj.month - 1], ar: HM_AR[hj.month - 1], number: hj.month }, year: String(hj.year) },
            gregorian: { date: pad(d) + '-' + pad(m) + '-' + y, day: String(d), weekday: { en: base.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' }) }, month: { en: base.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' }) }, year: String(y) } } };
}
function localRamadan(today) {
  const h = today.date.hijri, now = +h.month.number === 9, want = now ? [10, 1] : [9, 1];
  const t0 = new Date(); for (let i = 1; i < 400; i++) { const d = new Date(Date.UTC(t0.getUTCFullYear(), t0.getUTCMonth(), t0.getUTCDate() + i, 12)), hj = hijri(d); if (hj && hj.month === want[0] && hj.day === want[1]) { const s = pad(d.getUTCDate()) + '-' + pad(d.getUTCMonth() + 1) + '-' + d.getUTCFullYear(); return now ? { now: true, day: +h.day, y: +h.year, eid: s } : { now: false, y: hj.year, start: s }; } }
  return null;
}

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
    try {
      S.city = city; S.today = localDay(city, 0); S.tomorrow = localDay(city, 1); S.tz = S.today.meta.timezone; S.ramadan = localRamadan(S.today);
      box.classList.remove('loading', 'offline'); box.classList.add('local');
      const src = box.querySelector('.sp-src'); if (src) src.textContent = 'Worked out on this device (the times service could not be reached): Karachi-method angles, Hanafi Asr. Confirm with your local masjid.';
    } catch (e2) {
      box.classList.remove('loading'); box.classList.add('offline');
      $('#spNextName').textContent = '—'; $('#spNextAt').textContent = 'Times will show once you are back online.';
    }
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
