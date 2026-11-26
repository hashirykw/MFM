/* The prayer corner: a velvet janamaz floating and turning in 3D, with a rehal and open
   Qur'an at its head, a tasbih, a glowing lantern above and gold eight-point stars orbiting.
   Drag to turn it. Built in code with Three.js r187 (local file); starts only when near. */
import * as THREE from '/assets/folio/js/three.module.min.js';

const stage = document.getElementById('salahStage');
const canvas = document.getElementById('salahCanvas');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (stage && canvas) {
  const io = new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); try { init(); } catch (e) { console.warn(e); } } }, { rootMargin: '300px' });
  io.observe(stage);
}

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 100);

  /* a soft studio environment so the gold actually shines */
  {
    const env = new THREE.Scene();
    const box = (c, x, y, z, s) => { const m = new THREE.Mesh(new THREE.BoxGeometry(s[0], s[1], s[2]), new THREE.MeshBasicMaterial({ color: c, side: THREE.BackSide })); m.position.set(x, y, z); env.add(m); };
    box(0x5b5240, 0, 0, 0, [30, 30, 30]);
    const lamp = (c, x, y, z, w, h) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
    lamp(0xfff1d6, 0, 12, 4, 14, 6); lamp(0xffc97a, -12, 4, 6, 6, 8); lamp(0xbfe8d6, 12, 3, -6, 6, 8); lamp(0xffffff, 4, 6, 13, 8, 4);
    const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(env, .04).texture; pm.dispose(); scene.environmentIntensity = .55;
  }
  const hemi = new THREE.HemisphereLight(0xfff4de, 0x2f5a4c, .9); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe6bd, 2.2); sun.position.set(4, 9, 6); scene.add(sun);
  const rim = new THREE.DirectionalLight(0x9fe0c4, .9); rim.position.set(-6, 3, -6); scene.add(rim);

  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const GOLD = '#e6b552';

  /* ---------- the mat's woven face ---------- */
  const rugT = tex(1024, 1800, (x, w, h) => {
    x.fillStyle = '#7f2621'; x.fillRect(0, 0, w, h);
    // outer guard border: running diamonds
    x.fillStyle = '#a73a30'; x.fillRect(22, 22, w - 44, h - 44);
    x.fillStyle = GOLD;
    for (let y = 60; y < h - 60; y += 58) for (const cx of [48, w - 48]) { x.beginPath(); x.moveTo(cx, y); x.lineTo(cx + 16, y + 22); x.lineTo(cx, y + 44); x.lineTo(cx - 16, y + 22); x.fill(); }
    for (let xx = 90; xx < w - 60; xx += 58) for (const cy of [48, h - 48]) { x.beginPath(); x.moveTo(xx, cy); x.lineTo(xx + 22, cy - 16); x.lineTo(xx + 44, cy); x.lineTo(xx + 22, cy + 16); x.fill(); }
    // field
    x.fillStyle = '#0d5a41'; x.fillRect(84, 84, w - 168, h - 168);
    const g = x.createRadialGradient(w / 2, h * .55, 40, w / 2, h * .55, h * .6); g.addColorStop(0, 'rgba(40,140,100,.35)'); g.addColorStop(1, 'rgba(0,0,0,.25)'); x.fillStyle = g; x.fillRect(84, 84, w - 168, h - 168);
    x.strokeStyle = GOLD; x.lineWidth = 10; x.strokeRect(100, 100, w - 200, h - 200); x.lineWidth = 3; x.strokeRect(122, 122, w - 244, h - 244);
    // mihrab arch with columns
    const ax = w / 2, top = 190, ah = 900, aw = 600;
    const arch = (pad) => { x.beginPath(); x.moveTo(ax - aw / 2 + pad, top + ah); x.lineTo(ax - aw / 2 + pad, top + 330); x.bezierCurveTo(ax - aw / 2 + pad, top + 120 + pad, ax - 60, top + 40 + pad, ax, top + pad); x.bezierCurveTo(ax + 60, top + 40 + pad, ax + aw / 2 - pad, top + 120 + pad, ax + aw / 2 - pad, top + 330); x.lineTo(ax + aw / 2 - pad, top + ah); x.closePath(); };
    arch(0); x.fillStyle = '#083b2c'; x.fill(); x.strokeStyle = GOLD; x.lineWidth = 10; x.stroke();
    arch(28); x.lineWidth = 3; x.stroke();
    x.fillStyle = GOLD; for (const s of [-1, 1]) { x.fillRect(ax + s * (aw / 2 - 46) - 12, top + 360, 24, ah - 380); x.fillRect(ax + s * (aw / 2 - 46) - 22, top + 340, 44, 22); }
    // hanging lamp
    x.strokeStyle = GOLD; x.lineWidth = 4; x.beginPath(); x.moveTo(ax, top + 50); x.lineTo(ax, top + 250); x.stroke();
    x.fillStyle = GOLD; x.beginPath(); x.moveTo(ax - 40, top + 250); x.lineTo(ax + 40, top + 250); x.lineTo(ax + 22, top + 320); x.lineTo(ax - 22, top + 320); x.closePath(); x.fill();
    x.fillStyle = 'rgba(255,226,150,.55)'; x.beginPath(); x.arc(ax, top + 300, 46, 0, Math.PI * 2); x.fill();
    // small domed skyline inside the arch
    x.fillStyle = 'rgba(230,181,82,.6)';
    x.beginPath(); x.moveTo(ax - 120, top + 760); x.quadraticCurveTo(ax - 120, top + 610, ax, top + 570); x.quadraticCurveTo(ax + 120, top + 610, ax + 120, top + 760); x.fill();
    x.fillRect(ax - 170, top + 760, 340, 120);
    for (const s of [-1, 1]) { x.fillRect(ax + s * 210 - 12, top + 560, 24, 320); x.beginPath(); x.moveTo(ax + s * 210 - 14, top + 560); x.lineTo(ax + s * 210, top + 520); x.lineTo(ax + s * 210 + 14, top + 560); x.fill(); }
    // eight-point stars across the lower field
    const star = (cx, cy, r) => { x.beginPath(); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, rr = i % 2 ? r * .52 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fill(); };
    x.fillStyle = 'rgba(230,181,82,.85)';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) star(270 + c * 242 + (r % 2 ? 0 : 0), 1240 + r * 150, r % 2 ? 30 : 38);
    x.strokeStyle = 'rgba(230,181,82,.35)'; x.lineWidth = 2;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) { const cx = 391 + c * 242, cy = 1315 + r * 150; if (cy < h - 160) { x.beginPath(); x.arc(cx, cy, 22, 0, Math.PI * 2); x.stroke(); } }
  });
  rugT.wrapS = rugT.wrapT = THREE.ClampToEdgeWrapping;

  /* ---------- the mat: velvet cloth that ripples as it floats ---------- */
  const W = 2.6, L = 4.6, SX = 26, SZ = 52;
  const geo = new THREE.PlaneGeometry(W, L, SX, SZ); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position, base = Float32Array.from(pos.array);
  const velvet = new THREE.MeshPhysicalMaterial({ map: rugT, roughness: .86, sheen: .35, sheenRoughness: .6, sheenColor: new THREE.Color(0x8a5a2a), envMapIntensity: .25, side: THREE.FrontSide });
  const back = new THREE.MeshStandardMaterial({ color: 0x5a1c18, roughness: 1, side: THREE.BackSide });
  const root = new THREE.Group(); scene.add(root);
  const mat = new THREE.Group(); root.add(mat);
  const face = new THREE.Mesh(geo, velvet); mat.add(face);
  const under = new THREE.Mesh(geo, back); mat.add(under);
  const ripple = t => {
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3], z = base[i * 3 + 2];
      const curl = z < -L / 2 + .55 ? Math.pow((-L / 2 + .55 - z) / .55, 2) * .22 : 0; // the head end lifts a little
      pos.setY(i, Math.sin(z * 1.4 + t * 1.6) * .07 + Math.sin(x * 2.2 + t * 1.1) * .03 + curl);
    }
    pos.needsUpdate = true; geo.computeVertexNormals();
  };
  ripple(0);
  const yAt = (x, z, t) => Math.sin(z * 1.4 + t * 1.6) * .07 + Math.sin(x * 2.2 + t * 1.1) * .03;

  /* tassels at both ends */
  const fringeM = new THREE.MeshStandardMaterial({ color: 0xf3e6c8, roughness: .85 });
  const fringes = [];
  for (const s of [-1, 1]) for (let i = 0; i < 20; i++) {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(.012, .006, .26, 5), fringeM); f.rotation.x = Math.PI / 2;
    const x = -W / 2 + .08 + i * (W - .16) / 19; f.userData = { x, z: s * (L / 2 + .12), s, ph: Math.random() * 6 }; mat.add(f); fringes.push(f);
  }

  /* ---------- rehal with an open Qur'an at the head of the mat ---------- */
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a4a26, roughness: .55, metalness: .05 });
  const goldM = new THREE.MeshStandardMaterial({ color: 0xe8b24a, metalness: .85, roughness: .28, emissive: 0x3a2400, emissiveIntensity: .35 });
  const rehal = new THREE.Group(); rehal.position.set(0, .02, -L / 2 + 1.0); mat.add(rehal);
  const pageT = tex(256, 320, (x, w, h) => {
    x.fillStyle = '#fbf3df'; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#c99a3c'; x.lineWidth = 5; x.strokeRect(12, 12, w - 24, h - 24); x.lineWidth = 2; x.strokeRect(20, 20, w - 40, h - 40);
    x.fillStyle = 'rgba(35,35,35,.6)';
    for (let r = 0; r < 12; r++) { const y = 58 + r * 20; for (let xx = 34; xx < w - 40; xx += 9 + Math.random() * 16) x.fillRect(xx, y, 5 + Math.random() * 11, 3); }
    x.fillStyle = '#c99a3c'; x.beginPath(); x.ellipse(w / 2, 38, 52, 9, 0, 0, Math.PI * 2); x.fill();
  });
  const pageM = new THREE.MeshStandardMaterial({ map: pageT, roughness: .9, side: THREE.DoubleSide });
  const coverM = new THREE.MeshStandardMaterial({ color: 0x0d4a36, roughness: .45, metalness: .1 });
  const A = .62;
  for (const s of [1, -1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(.72, .035, .78), wood); arm.position.set(0, .28, 0); arm.rotation.x = s * A; rehal.add(arm);
    // the upper half of each arm holds one half of the open book
    const half = new THREE.Group(); half.position.set(0, .28, 0); half.rotation.x = s * A; rehal.add(half);
    const zc = -s * .2;
    const cover = new THREE.Mesh(new THREE.BoxGeometry(.6, .022, .42), coverM); cover.position.set(0, .03, zc); half.add(cover);
    const block = new THREE.Mesh(new THREE.BoxGeometry(.56, .04, .4), new THREE.MeshStandardMaterial({ color: 0xf3e8cc, roughness: .9 })); block.position.set(0, .06, zc); half.add(block);
    const pg = new THREE.Mesh(new THREE.PlaneGeometry(.55, .39), pageM); pg.rotation.x = -Math.PI / 2; pg.rotation.z = Math.PI / 2; pg.position.set(0, .082, zc); half.add(pg);
  }
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .76, 10), goldM); knob.rotation.z = Math.PI / 2; knob.position.y = .28; rehal.add(knob);

  /* ---------- tasbih: 33 beads, a marker bead and a tassel ---------- */
  const tasbih = new THREE.Group(); tasbih.position.set(.68, .08, 1.15); mat.add(tasbih);
  const beadM = new THREE.MeshPhysicalMaterial({ color: 0x0f6b4e, roughness: .15, metalness: .1, clearcoat: 1, clearcoatRoughness: .1 });
  for (let i = 0; i < 33; i++) { const a = i / 33 * Math.PI * 2; const b = new THREE.Mesh(new THREE.SphereGeometry(.042, 14, 10), beadM); b.position.set(Math.cos(a) * .34, 0, Math.sin(a) * .23); tasbih.add(b); }
  const imam = new THREE.Mesh(new THREE.CylinderGeometry(.03, .05, .14, 12), goldM); imam.rotation.z = Math.PI / 2; imam.position.set(.42, 0, 0); tasbih.add(imam);
  for (let k = 0; k < 7; k++) { const tq = new THREE.Mesh(new THREE.CylinderGeometry(.006, .004, .2, 4), goldM); tq.rotation.z = Math.PI / 2 + (k - 3) * .08; tq.position.set(.58, 0, (k - 3) * .012); tasbih.add(tq); }

  /* ---------- lantern (fanous) floating above, with real light ---------- */
  const lantern = new THREE.Group(); root.add(lantern);
  const bodyPts = [[0, 0], [.2, 0], [.24, .06], [.16, .12], [.22, .2], [.26, .48], [.2, .62], [.12, .68], [.24, .72], [.2, .78], [.08, .96], [.03, 1.1], [.001, 1.12]].map(([a, b]) => new THREE.Vector2(a, b));
  const cage = new THREE.Mesh(new THREE.LatheGeometry(bodyPts, 8), new THREE.MeshStandardMaterial({ color: 0xd9a642, metalness: 1, roughness: .28, wireframe: true }));
  lantern.add(cage);
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .36, 8), new THREE.MeshStandardMaterial({ color: 0xffd58a, emissive: 0xffb347, emissiveIntensity: 1.6, transparent: true, opacity: .85, roughness: .2 }));
  glass.position.y = .36; lantern.add(glass);
  const capT = new THREE.Mesh(new THREE.ConeGeometry(.24, .26, 8), goldM); capT.position.y = .86; lantern.add(capT);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.06, .015, 8, 20), goldM); ring.position.y = 1.16; lantern.add(ring);
  const baseC = new THREE.Mesh(new THREE.CylinderGeometry(.22, .14, .08, 8), goldM); baseC.position.y = .04; lantern.add(baseC);
  const glow = new THREE.PointLight(0xffb85c, 6, 7, 1.6); glow.position.y = .36; lantern.add(glow);
  const haloT = tex(128, 128, (x, w) => { const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(255,214,140,.9)'); g.addColorStop(.35, 'rgba(255,190,90,.35)'); g.addColorStop(1, 'rgba(255,190,90,0)'); x.fillStyle = g; x.fillRect(0, 0, w, w); });
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); halo.scale.set(1.5, 1.5, 1); halo.position.y = .36; lantern.add(halo);
  lantern.position.set(1.2, 2.35, -1.0); lantern.scale.setScalar(.95);

  /* ---------- gold khatam stars orbiting ---------- */
  const starShape = (r) => { const s = new THREE.Shape(); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 + Math.PI / 16, rr = i % 2 ? r * .58 : r; const px = Math.cos(a) * rr, py = Math.sin(a) * rr; i ? s.lineTo(px, py) : s.moveTo(px, py); } s.closePath(); return s; };
  const starGeo = new THREE.ExtrudeGeometry(starShape(.17), { depth: .045, bevelEnabled: true, bevelThickness: .018, bevelSize: .014, bevelSegments: 2 }); starGeo.center();
  const stars = [];
  for (let i = 0; i < 7; i++) {
    const m = new THREE.Mesh(starGeo, goldM); const s = .55 + (i % 3) * .28; m.scale.setScalar(s);
    m.userData = { a: i / 7 * Math.PI * 2, r: 2.95 + (i % 2) * .3, y: .95 + (i % 3) * .5, sp: .22 + (i % 3) * .05, spin: .6 + i * .13 };
    root.add(m); stars.push(m);
  }
  /* a crescent among them */
  const cres = new THREE.Shape(); cres.absarc(0, 0, .26, Math.PI * .25, Math.PI * 1.75, false); cres.absarc(.1, 0, .21, Math.PI * 1.7, Math.PI * .3, true);
  const crescent = new THREE.Mesh(new THREE.ExtrudeGeometry(cres, { depth: .05, bevelEnabled: true, bevelThickness: .015, bevelSize: .012, bevelSegments: 2 }), goldM);
  crescent.geometry.center(); root.add(crescent);

  /* ---------- drifting light motes ---------- */
  const N = 70, mp = new Float32Array(N * 3), seeds = [];
  for (let i = 0; i < N; i++) { seeds.push([Math.random() * 6.28, 1.2 + Math.random() * 2.6, -1 + Math.random() * 3.6, .1 + Math.random() * .3]); }
  const motesG = new THREE.BufferGeometry(); motesG.setAttribute('position', new THREE.BufferAttribute(mp, 3));
  const motes = new THREE.Points(motesG, new THREE.PointsMaterial({ map: haloT, size: .14, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffe0a0 }));
  scene.add(motes);

  /* soft shadow on the "floor" */
  const sh = tex(256, 256, (x, w) => { const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(5,31,32,.38)'); g.addColorStop(1, 'rgba(5,31,32,0)'); x.fillStyle = g; x.fillRect(0, 0, w, w); });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 5.4), new THREE.MeshBasicMaterial({ map: sh, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.05; scene.add(shadow);

  /* ---------- interaction ---------- */
  mat.rotation.x = .12;
  let target = -.6, cur = -.6, drag = false, lastX = 0, idle = 9, tiltT = 0, tilt = 0;
  canvas.style.touchAction = 'pan-y'; canvas.style.cursor = 'grab';
  canvas.addEventListener('pointerdown', e => { drag = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect(); tiltT = ((e.clientY - r.top) / r.height - .5) * .3;
    if (!drag) return; target += (e.clientX - lastX) * .012; lastX = e.clientX; idle = 0;
  });
  const up = () => { drag = false; canvas.style.cursor = 'grab'; };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('pointerleave', () => { tiltT = 0; });

  function size() {
    const r = stage.getBoundingClientRect(), w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false); camera.aspect = w / h;
    const k = (w / h < .95 ? 1.15 : 1) * (w < 480 ? .86 : 1);
    camera.position.set(0, 5.1 * k, 9.7 * k); camera.lookAt(0, w < 480 ? 1.05 : .8, 0); camera.updateProjectionMatrix();
  }
  size(); new ResizeObserver(size).observe(stage);
  const theme = () => {
    const d = document.documentElement.dataset.theme === 'dark';
    hemi.intensity = d ? .45 : .9; sun.intensity = d ? 1 : 2.2; rim.intensity = d ? 1.3 : .9;
    glow.intensity = d ? 14 : 6; glass.material.emissiveIntensity = d ? 2.6 : 1.6; halo.material.opacity = d ? 1 : .7;
    motes.material.opacity = d ? 1 : .55; renderer.toneMappingExposure = d ? 1.2 : 1.1;
  };
  theme(); document.addEventListener('hma:theme', theme);
  let vis = true; new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(stage);
  const t0 = performance.now(); let last = t0;

  (function frame(now) {
    requestAnimationFrame(frame); if (!vis || document.hidden) return;
    now = now || performance.now(); const dt = Math.min(.05, (now - last) / 1000); last = now;
    const t = reduced ? 0 : (now - t0) / 1000; idle += dt;
    if (!drag && !reduced && idle > 1.2) target += dt * .42;       // a steady, visible turn
    cur += (target - cur) * .08; root.rotation.y = cur;
    tilt += (tiltT - tilt) * .06; root.rotation.x = tilt;
    if (!reduced) {
      ripple(t);
      root.position.y = Math.sin(t * 1.1) * .12;
      mat.rotation.z = Math.sin(t * .7) * .04;
      fringes.forEach(f => { const u = f.userData; f.position.set(u.x, yAt(u.x, u.z, t) + Math.sin(t * 3 + u.ph) * .015, u.z); f.rotation.z = Math.sin(t * 2 + u.ph) * .2; });
      lantern.position.y = 2.35 + Math.sin(t * 1.4 + 1) * .14; lantern.rotation.y = t * .5;
      halo.material.rotation = t * .2;
      stars.forEach(m => { const u = m.userData; const a = u.a - t * u.sp; m.position.set(Math.cos(a) * u.r, u.y + Math.sin(t * 1.3 + u.a) * .18, Math.sin(a) * u.r); m.rotation.y = t * u.spin; m.rotation.x = Math.sin(t + u.a) * .4; });
      const ca = .9 - t * .18; crescent.position.set(Math.cos(ca) * 2.9, 2.1 + Math.sin(t * .9) * .12, Math.sin(ca) * 2.9); crescent.rotation.y = -ca + Math.PI / 2 + Math.sin(t) * .3;
      for (let i = 0; i < N; i++) { const [a, r, y0, sp] = seeds[i]; const aa = a + t * sp * .4; mp[i * 3] = Math.cos(aa) * r; mp[i * 3 + 1] = y0 + ((t * sp * .5 + i * .37) % 3.2) - 1; mp[i * 3 + 2] = Math.sin(aa) * r; }
      motesG.attributes.position.needsUpdate = true;
    } else {
      fringes.forEach(f => { const u = f.userData; f.position.set(u.x, yAt(u.x, u.z, 0), u.z); });
      stars.forEach(m => { const u = m.userData; m.position.set(Math.cos(u.a) * u.r, u.y, Math.sin(u.a) * u.r); });
      crescent.position.set(Math.cos(.9) * 2.9, 2.1, Math.sin(.9) * 2.9); lantern.position.y = 2;
    }
    shadow.scale.setScalar(1 - root.position.y * .3);
    renderer.render(scene, camera);
  })();
  stage.classList.add('ready');
}
