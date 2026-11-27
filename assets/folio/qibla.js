/* MFM · Qibla. Works out the direction of the Ka'ba from the chosen prayer-corner city or the
   visitor's own location (great-circle initial bearing, degrees clockwise from true north) and the
   distance to it, and on phones can follow the device compass. Shares it as window.MFMQibla and the
   'mfm:qibla' event; the janamaz in 3D (prayer3d.js) turns to face it. */
(() => {
  'use strict';
  const KAABA = { lat: 21.422487, lon: 39.826206 };
  const CITY = { khi: [24.8607, 67.0011, 'Karachi'], lhr: [31.5204, 74.3587, 'Lahore'], isb: [33.6844, 73.0479, 'Islamabad'], dxb: [25.2048, 55.2708, 'Dubai'],
    ruh: [24.7136, 46.6753, 'Riyadh'], doh: [25.2854, 51.531, 'Doha'], lon: [51.5074, -0.1278, 'London'], tor: [43.6532, -79.3832, 'Toronto'] };
  const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
  function bearing(lat, lon) {
    const p1 = rad(lat), p2 = rad(KAABA.lat), dl = rad(KAABA.lon - lon);
    const y = Math.sin(dl) * Math.cos(p2), x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
    return (deg(Math.atan2(y, x)) + 360) % 360;
  }
  function distance(lat, lon) {
    const p1 = rad(lat), p2 = rad(KAABA.lat), dp = p2 - p1, dl = rad(KAABA.lon - lon);
    const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
    return 6371.0088 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  const POINTS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const point = b => POINTS[Math.round(b / 22.5) % 16];
  const ls = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } } };

  const Q = window.MFMQibla = { bearing: 0, dist: 0, label: 'Karachi', heading: null, mine: false };
  function set(lat, lon, label, mine) {
    Q.bearing = bearing(lat, lon); Q.dist = distance(lat, lon); Q.label = label; Q.mine = !!mine; paint();
    document.dispatchEvent(new CustomEvent('mfm:qibla', { detail: Q }));
  }
  function fromCity() { const id = (document.getElementById('spCity') || {}).value || ls.get('mfm-salah-city') || 'khi'; const c = CITY[id] || CITY.khi; set(c[0], c[1], c[2], false); }

  let bar = null;
  function paint() {
    if (!bar) return;
    bar.querySelector('.qb-deg').textContent = Q.bearing.toFixed(1) + '°';
    bar.querySelector('.qb-pt').textContent = point(Q.bearing);
    bar.querySelector('.qb-from').textContent = (Q.mine ? 'from where you are' : 'from ' + Q.label) + ' · ' + Math.round(Q.dist).toLocaleString('en') + ' km to the Ka\'ba';
    bar.querySelector('.qb-needle').style.transform = 'rotate(' + (Q.bearing - (Q.heading || 0)) + 'deg)';
  }
  function mount() {
    const stage = document.getElementById('salahStage'); if (!stage) return;
    bar = document.createElement('div'); bar.className = 'qibla-bar'; bar.setAttribute('aria-live', 'polite');
    bar.innerHTML = '<span class="qb-dial" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21"/><path class="qb-n" d="M24 4.5v5"/><g class="qb-needle"><path d="M24 9 28 24 24 21.5 20 24Z"/><rect x="21.6" y="5.2" width="4.8" height="4.8" rx=".6"/></g></svg></span>'
      + '<div class="qb-t"><span class="lbl">Qibla</span><b><span class="qb-deg">—</span> <span class="qb-pt"></span></b><small class="qb-from"></small></div>'
      + '<div class="qb-act"><button type="button" class="btn btn--sm btn--line" data-q="loc">Use my location</button>'
      + ('DeviceOrientationEvent' in window && matchMedia('(pointer: coarse)').matches ? '<button type="button" class="btn btn--sm btn--line" data-q="live">Live compass</button>' : '') + '</div>'
      + '<button type="button" class="lx-info qb-info" data-pop-title="How the qibla is measured" data-pop-from=".qb-note"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.5v.01"/></svg>How it\'s measured</button>'
      + '<p class="qb-note" hidden>The direction is the great-circle bearing from your city, or from where you are if you share your location, to the Ka\'ba (21.4225° N, 39.8262° E), in degrees clockwise from true north. The janamaz turns to it after you let go. On a phone, Live compass turns the ring with your device. Phone compasses can be a few degrees out near metal or electronics, and they point to magnetic north, which differs slightly from true north in most places; your local masjid\'s qibla is the one to follow.</p>';
    stage.after(bar);
    bar.addEventListener('click', e => {
      const b = e.target.closest('[data-q]'); if (!b) return;
      if (b.dataset.q === 'loc') {
        if (!navigator.geolocation) { b.textContent = 'Location not available'; return; }
        b.textContent = 'Finding you…';
        navigator.geolocation.getCurrentPosition(p => { set(p.coords.latitude, p.coords.longitude, 'your location', true); b.textContent = 'Using your location'; },
          () => { b.textContent = 'Location blocked'; setTimeout(() => { b.textContent = 'Use my location'; }, 2200); }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 600000 });
      } else live(b);
    });
    const sel = document.getElementById('spCity'); if (sel) sel.addEventListener('change', () => { if (!Q.mine) setTimeout(fromCity, 0); });
  }
  function live(b) {
    const start = () => {
      const on = e => {
        let h = null;
        if (typeof e.webkitCompassHeading === 'number') h = e.webkitCompassHeading;
        else if (e.absolute && typeof e.alpha === 'number') h = (360 - e.alpha) % 360;
        if (h == null) return;
        const so = (screen.orientation && screen.orientation.angle) || 0;
        Q.heading = (h + so) % 360; paint(); document.dispatchEvent(new CustomEvent('mfm:qibla', { detail: Q }));
      };
      addEventListener('deviceorientationabsolute', on); addEventListener('deviceorientation', on);
      b.textContent = 'Compass on';
    };
    if (typeof DeviceOrientationEvent.requestPermission === 'function') DeviceOrientationEvent.requestPermission().then(r => r === 'granted' ? start() : (b.textContent = 'Compass blocked')).catch(() => { b.textContent = 'Compass blocked'; });
    else start();
  }
  function init() { mount(); fromCity(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
