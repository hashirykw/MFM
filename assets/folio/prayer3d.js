/* The prayer corner, built in code (Three.js r187, local file): a janamaz laid towards a
   mihrab, a masjid-style salah times board and a wall clock that keep the live times from
   prayer.js, a rehal with an open Qur'an, a tasbih and a lantern. Drag to look around. */
import * as THREE from '/assets/folio/js/three.module.min.js';

const stage = document.getElementById('salahStage');
const canvas = document.getElementById('salahCanvas');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (stage && canvas) {
  const io = new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); try { init(); } catch (e) { console.warn(e); } } }, { rootMargin: '300px' });
  io.observe(stage);
}

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 200);
  const hemi = new THREE.HemisphereLight(0xfff4de, 0x2f5a4c, 1.15); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe6bd, 2.3);
  sun.position.set(7, 13, 9); sun.castShadow = true; sun.shadow.mapSize.set(1536, 1536);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 40 }); sun.shadow.bias = -.0006;
  scene.add(sun);
  const glow = new THREE.PointLight(0xffb45a, 0, 9, 1.6); scene.add(glow);

  const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .8, metalness: 0, flatShading: true, ...o });
  const mat = {
    marble: M(0xf4ede0), marble2: M(0xe8dcc6), sand: M(0xd7b98a), sandDk: M(0xb98f5e), wood: M(0x6f4a2c), woodDk: M(0x4a3020),
    emerald: M(0x0f6a4c, { roughness: .45, metalness: .12 }), emeraldDk: M(0x0b3d2e), gold: M(0xe2b04a, { metalness: .55, roughness: .35 }),
    page: M(0xfbf6ea), bead: M(0x1c5a46, { roughness: .3, metalness: .2 }), lamp: M(0xffe3a0, { emissive: 0xffc35a, emissiveIntensity: 0 }),
    glass: M(0xfff1c4, { emissive: 0xffb44a, emissiveIntensity: .15, transparent: true, opacity: .85 })
  };
  const root = new THREE.Group(); scene.add(root);
  const add = (geo, m, x = 0, y = 0, z = 0, p = root) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; p.add(o); return o; };
  const box = (w, h, d, m, x, y, z, p) => add(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
  const cyl = (rt, rb, h, m, x, y, z, seg = 16, p) => add(new THREE.CylinderGeometry(rt, rb, h, seg), m, x, y, z, p);
  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.userData.c = c; return t; };
  function archShape(w, h) {
    const s = new THREE.Shape(), r = w / 2, sh = h - w * .78;
    s.moveTo(-r, 0); s.lineTo(-r, sh); s.quadraticCurveTo(-r, sh + w * .55, 0, h); s.quadraticCurveTo(r, sh + w * .55, r, sh); s.lineTo(r, 0); s.lineTo(-r, 0);
    return s;
  }
  const archGeo = (w, h, d = .12) => new THREE.ExtrudeGeometry(archShape(w, h), { depth: d, bevelEnabled: false, curveSegments: 12 });

  /* ---------- floor: a round marble platform on a sandstone base ---------- */
  const floorT = tex(512, 512, (x, w) => {
    x.fillStyle = '#f2eadb'; x.fillRect(0, 0, w, w); x.strokeStyle = 'rgba(150,120,80,.32)'; x.lineWidth = 2;
    for (let i = 0; i <= w; i += 64) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, w); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); }
    x.fillStyle = 'rgba(15,106,76,.16)';
    for (let a = 32; a < w; a += 64) for (let b = 32; b < w; b += 64) { x.save(); x.translate(a, b); x.rotate(Math.PI / 4); x.fillRect(-9, -9, 18, 18); x.restore(); }
  });
  floorT.wrapS = floorT.wrapT = THREE.RepeatWrapping; floorT.repeat.set(3, 3);
  add(new THREE.CylinderGeometry(7.4, 7.4, .5, 64), new THREE.MeshStandardMaterial({ map: floorT, roughness: .65 }), 0, -.25, 0).castShadow = false;
  add(new THREE.CylinderGeometry(7.5, 6.9, 1.3, 64), mat.sandDk, 0, -1.15, 0);
  add(new THREE.TorusGeometry(7.42, .06, 6, 80), mat.gold, 0, 0, 0).rotation.x = Math.PI / 2;

  /* ---------- the qibla wall with its mihrab ---------- */
  const wz = -3.4;
  box(11.2, 6.6, .7, mat.marble, 0, 3.3, wz);
  box(11.4, .3, .9, mat.sand, 0, 6.72, wz);
  box(11.2, 1.1, .74, mat.emeraldDk, 0, .55, wz);                       // dado
  const dadoT = tex(1024, 96, (x, w, h) => { x.fillStyle = '#0b3d2e'; x.fillRect(0, 0, w, h); x.strokeStyle = '#e2b04a'; x.lineWidth = 3;
    for (let i = 0; i < w; i += 64) { x.beginPath(); x.moveTo(i + 32, 12); x.lineTo(i + 56, 48); x.lineTo(i + 32, 84); x.lineTo(i + 8, 48); x.closePath(); x.stroke(); }
    x.fillStyle = '#e2b04a'; x.fillRect(0, 2, w, 4); x.fillRect(0, h - 6, w, 4); });
  add(new THREE.PlaneGeometry(11.2, 1.1), new THREE.MeshStandardMaterial({ map: dadoT, roughness: .6 }), 0, .55, wz + .38).receiveShadow = true;
  // mihrab: gold frame, deep emerald niche, a lamp inside
  add(archGeo(3.1, 4.9, .14), mat.gold, 0, 1.1, wz + .35);
  add(archGeo(2.7, 4.6, .16), mat.emeraldDk, 0, 1.1, wz + .36);
  add(archGeo(2.1, 4.0, .18), mat.emerald, 0, 1.1, wz + .37);
  const nicheT = tex(256, 512, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0f6a4c'); g.addColorStop(1, '#0b3d2e'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(226,176,74,.45)'; x.lineWidth = 2; for (let i = -h; i < w + h; i += 28) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + h, h); x.stroke(); x.beginPath(); x.moveTo(i + h, 0); x.lineTo(i, h); x.stroke(); } });
  const niche = add(new THREE.ShapeGeometry(archShape(1.7, 3.6), 12), new THREE.MeshStandardMaterial({ map: nicheT, roughness: .7 }), 0, 1.1, wz + .56);
  niche.geometry.computeBoundingBox(); { const bb = niche.geometry.boundingBox, uv = niche.geometry.attributes.uv, p = niche.geometry.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, (p.getX(i) - bb.min.x) / (bb.max.x - bb.min.x), (p.getY(i) - bb.min.y) / (bb.max.y - bb.min.y)); }
  const lampG = new THREE.Group(); lampG.position.set(0, 3.55, wz + .9); root.add(lampG);
  add(new THREE.CylinderGeometry(.005, .005, .9, 4), mat.gold, 0, .45, 0, lampG).castShadow = false;
  add(new THREE.SphereGeometry(.2, 12, 10), mat.glass, 0, 0, 0, lampG);
  add(new THREE.ConeGeometry(.16, .22, 8), mat.gold, 0, .24, 0, lampG);

  /* ---------- wall clock (analog, live) ---------- */
  const clock = new THREE.Group(); clock.position.set(-3.75, 4.35, wz + .4); root.add(clock);
  const faceT = tex(512, 512, (x, w) => {
    x.fillStyle = '#fbf6ea'; x.beginPath(); x.arc(w / 2, w / 2, w / 2, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#0b3d2e'; x.lineWidth = 6; x.beginPath(); x.arc(w / 2, w / 2, w / 2 - 30, 0, Math.PI * 2); x.stroke();
    x.fillStyle = '#0b3d2e'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 52px "Archivo Wide","Arial Black",sans-serif';
    for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2; x.fillText(String(i), w / 2 + Math.sin(a) * 176, w / 2 - Math.cos(a) * 176); }
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, r1 = w / 2 - 40, r2 = r1 - (i % 5 ? 10 : 22); x.lineWidth = i % 5 ? 3 : 6; x.strokeStyle = i % 5 ? '#6b8f80' : '#0b3d2e'; x.beginPath(); x.moveTo(w / 2 + Math.sin(a) * r1, w / 2 - Math.cos(a) * r1); x.lineTo(w / 2 + Math.sin(a) * r2, w / 2 - Math.cos(a) * r2); x.stroke(); }
    x.fillStyle = '#b55'; x.font = '700 30px "Archivo",sans-serif'; x.fillStyle = '#0f6a4c'; x.fillText('MFM', w / 2, w / 2 + 92);
  });
  const face = add(new THREE.CircleGeometry(1.05, 48), new THREE.MeshStandardMaterial({ map: faceT, roughness: .5 }), 0, 0, .09, clock); face.castShadow = false;
  add(new THREE.CylinderGeometry(1.18, 1.18, .16, 48), mat.woodDk, 0, 0, 0, clock).rotation.x = Math.PI / 2;
  add(new THREE.TorusGeometry(1.12, .06, 8, 48), mat.gold, 0, 0, .1, clock);
  const hand = (len, wd, m, z) => { const g = new THREE.Group(); g.position.z = z; clock.add(g); const b = new THREE.Mesh(new THREE.BoxGeometry(wd, len, .03), m); b.position.y = len / 2 - .1; b.castShadow = true; g.add(b); return g; };
  const hH = hand(.6, .07, mat.emeraldDk, .13), hM = hand(.86, .05, mat.emeraldDk, .15), hS = hand(.92, .018, M(0xc0392b), .17);
  add(new THREE.SphereGeometry(.06, 10, 8), mat.gold, 0, 0, .18, clock);

  /* ---------- salah times board (masjid style) ---------- */
  const board = new THREE.Group(); board.position.set(3.55, 3.55, wz + .42); root.add(board);
  box(2.9, 4.0, .16, mat.woodDk, 0, 0, 0, board);
  box(3.08, 4.18, .1, mat.gold, 0, 0, -.06, board);
  const bT = tex(560, 780, () => {}); const boardFace = add(new THREE.PlaneGeometry(2.66, 3.76), new THREE.MeshStandardMaterial({ map: bT, roughness: .55 }), 0, 0, .09, board); boardFace.castShadow = false;
  const AR = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
  function drawBoard() {
    const c = bT.userData.c, x = c.getContext('2d'), w = c.width, h = c.height, P = window.MFM_PRAYER || {}, T = P.today;
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0f3b2e'); g.addColorStop(1, '#082419'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(226,176,74,.6)'; x.lineWidth = 3; x.strokeRect(14, 14, w - 28, h - 28);
    x.textAlign = 'center'; x.fillStyle = '#e2b04a'; x.font = '900 34px "Archivo Wide","Arial Black",sans-serif'; x.fillText('SALAH TIMES', w / 2, 74);
    x.fillStyle = 'rgba(243,236,220,.75)'; x.font = '600 24px "Archivo",sans-serif';
    x.fillText(T ? `${(P.city || {}).n || ''} · ${+T.date.hijri.day} ${T.date.hijri.month.en} ${T.date.hijri.year}` : 'Loading today’s times…', w / 2, 114);
    const rows = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    rows.forEach((n, i) => {
      const y = 170 + i * 98, on = P.next === n;
      if (on) { x.fillStyle = '#e2b04a'; x.fillRect(30, y - 10, w - 60, 84); }
      x.textAlign = 'left'; x.fillStyle = on ? '#0b2a1f' : '#f3ecdc'; x.font = '900 32px "Archivo Wide","Arial Black",sans-serif'; x.fillText(n.toUpperCase(), 52, y + 32);
      x.font = '500 24px serif'; x.fillStyle = on ? 'rgba(11,42,31,.8)' : 'rgba(243,236,220,.6)'; x.fillText(AR[n], 52, y + 62);
      x.textAlign = 'right'; x.fillStyle = on ? '#0b2a1f' : '#f3ecdc'; x.font = '700 44px "Archivo",sans-serif';
      const t = T ? String(T.timings[n]).slice(0, 5) : '--:--'; const [hh, mm] = t.split(':').map(Number);
      x.fillText(isNaN(hh) ? '--:--' : `${(hh + 11) % 12 + 1}:${String(mm).padStart(2, '0')}`, w - 52, y + 46);
      if (!on && i < rows.length - 1) { x.fillStyle = 'rgba(243,236,220,.12)'; x.fillRect(46, y + 82, w - 92, 2); }
    });
    bT.needsUpdate = true;
  }
  drawBoard();
  document.addEventListener('mfm:salah', drawBoard);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawBoard);

  /* ---------- the janamaz, laid towards the mihrab ---------- */
  const rugT = tex(512, 900, (x, w, h) => {
    x.fillStyle = '#8e2f2a'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#0f5a42'; x.fillRect(26, 26, w - 52, h - 52);
    x.strokeStyle = '#e2b04a'; x.lineWidth = 6; x.strokeRect(40, 40, w - 80, h - 80); x.lineWidth = 2; x.strokeRect(54, 54, w - 108, h - 108);
    // border chevrons
    x.fillStyle = '#e2b04a'; for (let y = 70; y < h - 70; y += 34) { x.beginPath(); x.moveTo(12, y); x.lineTo(22, y + 10); x.lineTo(12, y + 20); x.fill(); x.beginPath(); x.moveTo(w - 12, y); x.lineTo(w - 22, y + 10); x.lineTo(w - 12, y + 20); x.fill(); }
    // the mihrab arch at the head of the mat
    const ax = w / 2, top = 96, ah = 460, aw = 300; x.fillStyle = '#0b3d2e'; x.beginPath(); x.moveTo(ax - aw / 2, top + ah); x.lineTo(ax - aw / 2, top + 170); x.quadraticCurveTo(ax - aw / 2, top + 30, ax, top); x.quadraticCurveTo(ax + aw / 2, top + 30, ax + aw / 2, top + 170); x.lineTo(ax + aw / 2, top + ah); x.closePath(); x.fill();
    x.strokeStyle = '#e2b04a'; x.lineWidth = 5; x.stroke();
    // hanging lamp and a small dome inside the arch
    x.strokeStyle = '#e2b04a'; x.lineWidth = 2; x.beginPath(); x.moveTo(ax, top + 30); x.lineTo(ax, top + 140); x.stroke(); x.fillStyle = '#e2b04a'; x.beginPath(); x.arc(ax, top + 156, 16, 0, Math.PI * 2); x.fill();
    x.fillStyle = 'rgba(226,176,74,.55)'; x.beginPath(); x.arc(ax, top + 380, 62, Math.PI, 0); x.fill(); x.fillRect(ax - 70, top + 380, 140, 70);
    // eight-point stars over the field
    const star = (cx, cy, r) => { x.beginPath(); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, rr = i % 2 ? r * .55 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fill(); };
    x.fillStyle = 'rgba(226,176,74,.75)'; [[150, 640], [362, 640], [256, 740], [150, 820], [362, 820]].forEach(([a, b]) => star(a, b, 26));
  });
  const rug = add(new THREE.BoxGeometry(2.3, .05, 4.05), [mat.emeraldDk, mat.emeraldDk, new THREE.MeshStandardMaterial({ map: rugT, roughness: .95 }), mat.emeraldDk, mat.emeraldDk, mat.emeraldDk], 0, .03, -.2);
  rug.castShadow = false;
  for (const zEnd of [-2.24, 1.84]) for (let i = 0; i < 12; i++) { const f = box(.035, .02, .2, mat.marble2, -1.05 + i * .19, .02, zEnd); f.castShadow = false; }
  rug.rotation.y = 0;

  /* ---------- rehal with an open Qur'an ---------- */
  const rehal = new THREE.Group(); rehal.position.set(2.2, 0, .35); rehal.rotation.y = -.5; root.add(rehal);
  for (const s of [-1, 1]) { const p = box(1.1, .06, 1.5, mat.wood, 0, .55, 0, rehal); p.rotation.x = s * .62; p.position.z = s * .32; }
  const bookT = tex(512, 340, (x, w, h) => { x.fillStyle = '#fbf6ea'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(15,106,76,.55)'; for (let s = 0; s < 2; s++) for (let r = 0; r < 9; r++) x.fillRect(s * w / 2 + 34 + (r % 3) * 6, 46 + r * 28, w / 2 - 80 - (r % 2) * 22, 7); x.strokeStyle = '#e2b04a'; x.lineWidth = 6; x.strokeRect(14, 14, w / 2 - 22, h - 28); x.strokeRect(w / 2 + 8, 14, w / 2 - 22, h - 28); });
  for (const s of [-1, 1]) { const pg = box(.98, .04, .7, new THREE.MeshStandardMaterial({ map: bookT, roughness: .8 }), 0, .9, s * .27, rehal); pg.rotation.x = -s * .6 + s * .02; }
  box(1.02, .07, .2, mat.emerald, 0, .74, 0, rehal);

  /* ---------- tasbih on the mat ---------- */
  const tas = new THREE.Group(); tas.position.set(-.55, .07, 1.25); root.add(tas);
  for (let i = 0; i < 33; i++) { const a = i / 33 * Math.PI * 2; add(new THREE.SphereGeometry(.045, 8, 6), mat.bead, Math.cos(a) * .42, 0, Math.sin(a) * .28, tas); }
  add(new THREE.ConeGeometry(.06, .22, 8), mat.gold, .5, 0, .32, tas).rotation.z = Math.PI / 2.4;

  /* ---------- a brass lantern (fanous) ---------- */
  const lan = new THREE.Group(); lan.position.set(-2.8, 0, .9); root.add(lan);
  cyl(.32, .4, .12, mat.gold, 0, .06, 0, 8, lan);
  add(new THREE.CylinderGeometry(.3, .3, .8, 8, 1, true), mat.glass, 0, .52, 0, lan);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; box(.03, .82, .03, mat.gold, Math.cos(a) * .3, .52, Math.sin(a) * .3, lan); }
  add(new THREE.ConeGeometry(.38, .44, 8), mat.gold, 0, 1.14, 0, lan);
  add(new THREE.SphereGeometry(.07, 8, 6), mat.gold, 0, 1.42, 0, lan);
  const flame = add(new THREE.SphereGeometry(.1, 10, 8), mat.lamp, 0, .5, 0, lan); flame.scale.set(.8, 1.5, .8);
  glow.position.set(-2.8, .9, .9);

  /* a low cushion for reading */
  const cush = add(new THREE.BoxGeometry(1.3, .26, .9, 2, 1, 2), M(0x8e2f2a, { roughness: .95 }), 3.4, .13, 2.2); cush.rotation.y = -.35;
  box(1.32, .04, .92, mat.gold, 3.4, .27, 2.2).rotation.y = -.35;

  root.position.y = -1.4;

  /* ---------- interaction: drag to look around, within limits ---------- */
  let target = 0, cur = 0, drag = false, lastX = 0, idle = 0;
  canvas.style.touchAction = 'pan-y'; canvas.style.cursor = 'grab';
  canvas.addEventListener('pointerdown', e => { drag = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
  canvas.addEventListener('pointermove', e => { if (!drag) return; target = Math.max(-.7, Math.min(.7, target + (e.clientX - lastX) * .006)); lastX = e.clientX; idle = 0; });
  const up = () => { drag = false; canvas.style.cursor = 'grab'; };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);

  function size() {
    const r = stage.getBoundingClientRect(), w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false); camera.aspect = w / h;
    const a = w / h, k = (a < .8 ? 1.72 : a < 1.05 ? 1.55 : 1.32) * (w < 560 ? 1.28 : 1);
    camera.position.set(6.2 * k, 6.4 * k, 13.6 * k); camera.lookAt(.35, .55, -.6); camera.updateProjectionMatrix();
  }
  size(); new ResizeObserver(size).observe(stage);

  const theme = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    hemi.intensity = dark ? .5 : 1.15; hemi.color.set(dark ? 0x9fb7d8 : 0xfff4de);
    sun.intensity = dark ? .9 : 2.3; sun.color.set(dark ? 0xb8c8ff : 0xffe6bd);
    mat.lamp.emissiveIntensity = dark ? 2.4 : .5; mat.glass.emissiveIntensity = dark ? 1.1 : .15; glow.intensity = dark ? 9 : 0;
  };
  theme(); document.addEventListener('hma:theme', theme);

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
  let lastNext = null;
  const t0 = performance.now();
  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = (performance.now() - t0) / 1000;
    idle += 1 / 60;
    if (!drag && !reduced && idle > 2.5) target = Math.sin(t * .18) * .32;
    cur += (target - cur) * .06; root.rotation.y = cur;
    // the clock keeps the city's own time
    const P = window.MFM_PRAYER || {}, n = P.now, d = new Date();
    const hh = n ? n.h : d.getHours(), mm = n ? n.m : d.getMinutes(), ss = (n ? n.s : d.getSeconds()) + (d.getMilliseconds() / 1000);
    hS.rotation.z = -ss / 60 * Math.PI * 2; hM.rotation.z = -(mm + ss / 60) / 60 * Math.PI * 2; hH.rotation.z = -((hh % 12) + mm / 60) / 12 * Math.PI * 2;
    if (P.next !== lastNext) { lastNext = P.next; drawBoard(); }
    if (!reduced) { flame.scale.y = 1.5 + Math.sin(t * 9) * .12; lampG.rotation.z = Math.sin(t * .8) * .03; }
    renderer.render(scene, camera);
  }
  frame();
  stage.classList.add('ready');
}
