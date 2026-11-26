/* A small low-poly mosque built in code for Sir Fazil's site (Three.js r187, local file).
   Green dome, two minarets, a courtyard with a fountain and an arcade, date palms,
   and a rehal holding an open Qur'an. Drag to turn; lamps glow in the ink theme. */
import * as THREE from '/assets/folio/js/three.module.min.js';

const stage = document.getElementById('stage');
const canvas = document.getElementById('mosque');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (stage && canvas) { try { init(); } catch (e) { console.warn(e); } }

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 200);

  const hemi = new THREE.HemisphereLight(0xfff4de, 0x2f5a4c, 1.2);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe6bd, 2.5);
  sun.position.set(11, 19, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1536, 1536);
  Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 60 });
  sun.shadow.bias = -.0006;
  scene.add(sun);

  const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .82, metalness: 0, flatShading: true, ...o });
  const mat = {
    marble: M(0xf4ede0), marble2: M(0xe8dcc6), sand: M(0xd7b98a), sandDk: M(0xb98f5e),
    emerald: M(0x0f6a4c, { roughness: .42, metalness: .15 }), emeraldDk: M(0x0b3d2e),
    gold: M(0xe2b04a, { metalness: .55, roughness: .35 }), arch: M(0x163a31, { emissive: 0x000000 }),
    lamp: M(0xffe3a0, { emissive: 0xffc35a, emissiveIntensity: 0 }), water: M(0x7fc6c2, { roughness: .2, metalness: .1 }),
    grass: M(0x88a96c), leaf: M(0x4b7d47), leaf2: M(0x63924f), trunk: M(0x8a6340), rug: M(0x8e2f2a), rug2: M(0x1c5a46), wood: M(0x6f4a2c), page: M(0xfbf6ea)
  };
  const root = new THREE.Group(); scene.add(root);
  const add = (geo, m, x = 0, y = 0, z = 0, p = root) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; p.add(o); return o; };
  const box = (w, h, d, m, x, y, z, p) => add(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
  const cyl = (rt, rb, h, m, x, y, z, seg = 12, p) => add(new THREE.CylinderGeometry(rt, rb, h, seg), m, x, y, z, p);

  /* pointed (Islamic) arch outline: width w, total height h */
  function archShape(w, h) {
    const s = new THREE.Shape(), r = w / 2, sh = h - w * .78;
    s.moveTo(-r, 0); s.lineTo(-r, sh);
    s.quadraticCurveTo(-r, sh + w * .55, 0, h);
    s.quadraticCurveTo(r, sh + w * .55, r, sh);
    s.lineTo(r, 0); s.lineTo(-r, 0);
    return s;
  }
  const archGeo = (w, h, d = .12) => new THREE.ExtrudeGeometry(archShape(w, h), { depth: d, bevelEnabled: false, curveSegments: 10 });
  /* onion dome by lathe */
  function domeGeo(r, h, seg = 20) {
    const prof = [[1, 0], [1.1, .14], [1.16, .3], [1.08, .46], [.86, .62], [.55, .77], [.27, .89], [.09, .97], [.02, 1]];
    const curve = new THREE.SplineCurve(prof.map(([x, y]) => new THREE.Vector2(x * r, y * h)));
    const pts = curve.getPoints(28); pts.push(new THREE.Vector2(.001, h));
    return new THREE.LatheGeometry(pts, seg);
  }
  function finial(x, y, z, s = 1, p = root) {
    cyl(.05 * s, .09 * s, .7 * s, mat.gold, x, y + .35 * s, z, 8, p);
    add(new THREE.SphereGeometry(.14 * s, 10, 8), mat.gold, x, y + .55 * s, z, p);
    add(new THREE.SphereGeometry(.1 * s, 10, 8), mat.gold, x, y + .78 * s, z, p);
    const c = add(new THREE.TorusGeometry(.2 * s, .045 * s, 6, 18, Math.PI * 1.35), mat.gold, x, y + 1.08 * s, z, p);
    c.rotation.z = Math.PI * .82;
    return c;
  }

  /* ---------- ground ---------- */
  add(new THREE.CylinderGeometry(12.4, 12.8, .7, 56), mat.grass, 0, -.35, 0).receiveShadow = true;
  add(new THREE.CylinderGeometry(12.8, 11.8, 1.5, 56), mat.sandDk, 0, -1.45, 0);
  box(18.4, .5, 14.2, mat.sand, 0, .25, .2);                 // plinth
  box(18.8, .12, 14.6, mat.sandDk, 0, .06, .2);
  // marble courtyard with a tile pattern
  const tc = document.createElement('canvas'); tc.width = tc.height = 256; const tx = tc.getContext('2d');
  tx.fillStyle = '#f4ede0'; tx.fillRect(0, 0, 256, 256); tx.strokeStyle = 'rgba(150,120,80,.35)'; tx.lineWidth = 2;
  for (let i = 0; i <= 256; i += 32) { tx.beginPath(); tx.moveTo(i, 0); tx.lineTo(i, 256); tx.stroke(); tx.beginPath(); tx.moveTo(0, i); tx.lineTo(256, i); tx.stroke(); }
  tx.fillStyle = 'rgba(15,106,76,.18)'; for (let x = 16; x < 256; x += 64) for (let y = 16; y < 256; y += 64) { tx.save(); tx.translate(x + 16, y + 16); tx.rotate(Math.PI / 4); tx.fillRect(-7, -7, 14, 14); tx.restore(); }
  const tile = new THREE.CanvasTexture(tc); tile.colorSpace = THREE.SRGBColorSpace; tile.wrapS = tile.wrapT = THREE.RepeatWrapping; tile.repeat.set(4, 2.4);
  const court = box(13.6, .08, 8.4, new THREE.MeshStandardMaterial({ map: tile, roughness: .7 }), 0, .54, 2.9);
  court.castShadow = false;
  box(3, .06, 4.5, mat.marble2, 0, .52, 9.1);                // path in

  /* ---------- prayer hall ---------- */
  const hallZ = -3.6;
  box(15, 4.2, 5.6, mat.marble, 0, 2.6, hallZ);
  box(15.4, .32, 6, mat.sand, 0, 4.86, hallZ);                // cornice
  box(15, .5, 5.6, mat.marble, 0, 5.27, hallZ);               // parapet
  for (let x = -7.2; x <= 7.25; x += .6) box(.28, .32, .14, mat.marble2, x, 5.68, hallZ + 2.8);   // merlons
  box(15.02, .16, 5.62, mat.emerald, 0, 1.06, hallZ);         // green band
  // arcade of arches on the facade (skipping the portal in the middle)
  const archFront = [];
  for (let x = -6.25; x <= 6.3; x += 1.25) {
    if (Math.abs(x) < 2.6) continue;
    const a = add(archGeo(.86, 2.5), mat.arch, x, 1.25, hallZ + 2.78); archFront.push(a);
    const lamp = add(new THREE.SphereGeometry(.09, 8, 6), mat.lamp, x, 2.9, hallZ + 2.95);
  }
  // side windows
  for (const s of [-1, 1]) for (const z of [-1.4, 0, 1.4]) { const a = add(archGeo(.7, 1.8, .1), mat.arch, s * 7.52, 1.7, hallZ + z); a.rotation.y = s * Math.PI / 2; }

  // drum + main green dome
  cyl(2.35, 2.45, 1.2, mat.marble, 0, 6.1, hallZ, 24);
  cyl(2.5, 2.5, .18, mat.gold, 0, 6.76, hallZ, 24);
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; const w = add(archGeo(.34, .7, .06), mat.arch, Math.sin(a) * 2.4, 5.65, hallZ + Math.cos(a) * 2.4); w.rotation.y = a; }
  const dome = add(domeGeo(2.15, 4.1, 32), mat.emerald, 0, 6.82, hallZ);
  const crescentMain = finial(0, 10.85, hallZ, 1.5);
  // small side domes
  for (const s of [-1, 1]) {
    cyl(1.05, 1.1, .6, mat.marble, s * 5, 5.82, hallZ, 16);
    add(domeGeo(.95, 1.8, 18), mat.marble2, s * 5, 6.1, hallZ);
    finial(s * 5, 7.85, hallZ, .8);
  }

  /* ---------- entrance portal (iwan) ---------- */
  const pz = hallZ + 2.9;
  box(5, 6.6, 1.2, mat.marble, 0, 3.8, pz);
  box(5.3, .3, 1.4, mat.sand, 0, 7.2, pz);
  for (let x = -2.3; x <= 2.35; x += .46) box(.24, .3, .16, mat.marble2, x, 7.5, pz + .62);
  add(archGeo(2.6, 4.9, .14), mat.arch, 0, .5, pz + .55);
  // gold frame around the arch
  box(3.3, .12, .1, mat.gold, 0, 5.8, pz + .64); for (const s of [-1, 1]) box(.12, 5.4, .1, mat.gold, s * 1.62, 3.1, pz + .64);
  box(2.4, .12, .1, mat.gold, 0, 6.35, pz + .64);
  const door = box(1.2, 2.2, .1, mat.wood, 0, 1.6, pz + .52);
  for (const s of [-1, 1]) { cyl(.24, .24, .9, mat.marble, s * 2.25, 7.75, pz, 8); add(domeGeo(.26, .45, 10), mat.gold, s * 2.25, 8.2, pz); }

  /* ---------- minarets ---------- */
  const minaret = (x, z, h) => {
    const g = new THREE.Group(); g.position.set(x, .5, z); root.add(g);
    cyl(.95, 1, .6, mat.sand, 0, .3, 0, 8, g);
    cyl(.55, .7, h, mat.marble, 0, .6 + h / 2, 0, 8, g);
    for (const f of [.45, .78]) {
      const y = .6 + h * f;
      cyl(.92, .7, .3, mat.marble2, 0, y, 0, 8, g);
      cyl(.95, .95, .08, mat.gold, 0, y + .18, 0, 8, g);
      cyl(.5, .55, .5, mat.marble, 0, y + .45, 0, 8, g);
      const ring = add(new THREE.TorusGeometry(.9, .03, 4, 24), mat.gold, 0, y + .45, 0, g); ring.rotation.x = Math.PI / 2;
    }
    cyl(.5, .5, .9, mat.marble, 0, .6 + h + .45, 0, 8, g);
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; const w = add(archGeo(.18, .5, .04), mat.arch, Math.sin(a) * .5, .6 + h + .15, Math.cos(a) * .5, g); w.rotation.y = a; }
    add(domeGeo(.52, 1.25, 14), mat.emerald, 0, .6 + h + .9, 0, g);
    finial(0, .6 + h + 2.1, 0, .7, g);
    return g;
  };
  const m1 = minaret(-8.1, 6.6, 9.2), m2 = minaret(8.1, 6.6, 9.2);
  minaret(-6.9, hallZ - 1.2, 6.6); minaret(6.9, hallZ - 1.2, 6.6);

  /* ---------- side arcades (riwaq) ---------- */
  for (const s of [-1, 1]) {
    box(1.6, .16, 7.4, mat.marble2, s * 6.4, 3.1, 3.4);
    box(1.7, .22, 7.5, mat.sand, s * 6.4, 3.28, 3.4);
    for (let z = -.1; z <= 7.05; z += 1.18) {
      cyl(.13, .15, 2.5, mat.marble, s * 5.75, 1.8, z, 8);
      cyl(.13, .15, 2.5, mat.marble, s * 7.05, 1.8, z, 8);
    }
    for (let z = .5; z <= 6.5; z += 1.18) { const a = add(archGeo(.9, .7, .06), mat.marble2, s * 5.75, 2.45, z); a.rotation.y = s * Math.PI / 2; }
  }

  /* ---------- fountain ---------- */
  cyl(1.35, 1.45, .42, mat.marble2, 0, .78, 3.4, 8);
  const water = cyl(1.18, 1.18, .06, mat.water, 0, .97, 3.4, 8);
  cyl(.18, .25, .8, mat.marble, 0, 1.2, 3.4, 8);
  cyl(.42, .3, .14, mat.gold, 0, 1.62, 3.4, 8);
  const spray = add(new THREE.SphereGeometry(.16, 10, 8), mat.water, 0, 1.78, 3.4);

  /* ---------- rehal with an open Qur'an on a rug ---------- */
  const rehal = new THREE.Group(); rehal.position.set(-3.3, .6, 6.3); rehal.rotation.y = .5; root.add(rehal);
  box(2.2, .03, 1.4, mat.rug, 0, 0, 0, rehal); box(1.9, .035, 1.1, mat.rug2, 0, .005, 0, rehal);
  for (const s of [-1, 1]) { const b = box(.08, .9, .62, mat.wood, s * .18, .42, 0, rehal); b.rotation.x = s * .55; }
  for (const s of [-1, 1]) { const p = box(.46, .02, .62, mat.page, s * .25, .78, 0, rehal); p.rotation.z = -s * .32; }
  box(.04, .03, .64, mat.emerald, 0, .74, 0, rehal);

  /* ---------- date palms ---------- */
  const palm = (x, z, s = 1) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); root.add(g);
    for (let i = 0; i < 6; i++) { const t = cyl(.16 - i * .012, .18 - i * .012, .55, mat.trunk, Math.sin(i * .5) * .08, .28 + i * .52, 0, 6, g); t.rotation.z = .04 * i; }
    for (let k = 0; k < 7; k++) {
      const f = add(new THREE.ConeGeometry(.22, 2.1, 4), k % 2 ? mat.leaf : mat.leaf2, 0, 3.25, 0, g);
      f.geometry.translate(0, 1.05, 0); f.scale.set(1, 1, .25);
      f.rotation.set(1.95, k / 7 * Math.PI * 2, 0, 'YXZ');
    }
    for (let k = 0; k < 4; k++) add(new THREE.SphereGeometry(.09, 6, 5), mat.sandDk, Math.sin(k) * .18, 3.05, Math.cos(k) * .18, g);
    return g;
  };
  [[-10.2, 4.4, 1.1], [-9.1, 8.6, .9], [10.3, 3.6, 1.05], [9.2, 8.8, .85], [-10.4, -4.8, 1.1], [10.4, -5.2, .95], [-5.6, 10.1, .8], [5.8, 10.2, .75]].forEach(p => palm(...p));
  // low hedges along the path
  for (const s of [-1, 1]) for (let z = 8; z <= 10.6; z += .9) add(new THREE.IcosahedronGeometry(.42, 0), mat.leaf2, s * 2.1, .7, z);

  /* ---------- a small gold star floating over the courtyard ---------- */
  const starShape = new THREE.Shape(); for (let i = 0; i < 16; i++) { const a = Math.PI / 2 + i * Math.PI / 8, r = i % 2 ? .38 : .6; i ? starShape.lineTo(Math.cos(a) * r, Math.sin(a) * r) : starShape.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  const star = add(new THREE.ExtrudeGeometry(starShape, { depth: .12, bevelEnabled: true, bevelThickness: .04, bevelSize: .03, bevelSegments: 2 }), mat.gold, 4.6, 9.4, 3);

  root.rotation.y = -.42;
  root.position.y = -1.6;

  /* ---------- interaction ---------- */
  let target = -.42, cur = -.42, drag = false, lastX = 0, idle = 0;
  canvas.style.touchAction = 'pan-y'; canvas.style.cursor = 'grab'; canvas.style.pointerEvents = 'auto';
  canvas.addEventListener('pointerdown', e => { drag = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
  canvas.addEventListener('pointermove', e => { if (!drag) return; target += (e.clientX - lastX) * .008; lastX = e.clientX; idle = 0; });
  const up = () => { drag = false; canvas.style.cursor = 'grab'; };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);

  function size() {
    const r = stage.getBoundingClientRect(); const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.position.set(18, 13, 22).multiplyScalar((w / h > 1.05 ? 1.6 : 1.82) * (w < 520 ? .98 : 1));
    w < 520 ? camera.lookAt(-1.6, 1.6, 1.3) : camera.lookAt(-.9, 1.9, .7); camera.updateProjectionMatrix();
  }
  size(); new ResizeObserver(size).observe(stage);

  const theme = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    hemi.intensity = dark ? .55 : 1.2; hemi.color.set(dark ? 0x9fb7d8 : 0xfff4de);
    sun.intensity = dark ? 1.1 : 2.5; sun.color.set(dark ? 0xb8c8ff : 0xffe6bd);
    mat.arch.emissive.set(dark ? 0xffb54a : 0x000000); mat.arch.emissiveIntensity = dark ? .55 : 0;
    mat.lamp.emissiveIntensity = dark ? 2.2 : 0;
  };
  theme(); document.addEventListener('hma:theme', theme);

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
  const t0 = performance.now();
  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = (performance.now() - t0) / 1000;
    idle += 1 / 60;
    if (!drag && !reduced && idle > 2) target += .0016;
    cur += (target - cur) * .08;
    root.rotation.y = cur;
    if (!reduced) {
      star.rotation.y = t * .8; star.position.y = 9.4 + Math.sin(t * 1.2) * .25;
      spray.scale.setScalar(1 + Math.sin(t * 6) * .12); water.rotation.y = t * .2;
    }
    renderer.render(scene, camera);
  }
  frame();
  stage.classList.add('ready');
}
