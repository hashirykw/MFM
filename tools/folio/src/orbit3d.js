/* Turning, shared by every 3D model on the site: one axis only, like a turntable.
   Drag sideways and the model spins round its upright axis, a full 360° and as many turns as you
   like; it never tips over or turns upside down. Up-down drags are left to the page (they scroll).
   Arrow keys turn it when it has focus; scrolling the page gives it a little spin; let go and it
   keeps a touch of momentum, then turns slowly on its own. */
export function orbit(el, { yaw = 0, auto = .0016, scroll = true, key = true } = {}) {
  const o = { yaw, pitch: 0, ty: yaw, drag: false, idle: 9, moved: 0, auto };
  let lx = 0, vx = 0;
  el.style.touchAction = 'pan-y';
  el.style.cursor = 'grab';
  el.classList.add('o360');
  el.addEventListener('pointerdown', e => {
    if (e.button) return;
    o.drag = true; o.moved = 0; lx = e.clientX; vx = 0;
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
    el.style.cursor = 'grabbing';
  });
  el.addEventListener('pointermove', e => {
    if (!o.drag) return;
    const dx = e.clientX - lx; lx = e.clientX;
    const k = 7 / Math.max(260, Math.min(el.clientWidth, 900)); // a drag across the model ≈ one full turn
    vx = dx * k; o.ty += vx;          // sideways only: the model stays upright
    o.moved += Math.abs(dx); o.idle = 0;
  });
  const up = () => { if (!o.drag) return; o.drag = false; el.style.cursor = 'grab'; };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up);
  // a drag is not a click (the folio plates open a closer view on a tap)
  (el.closest('button,a') || el).addEventListener('click', e => { if (o.moved > 6) { e.preventDefault(); e.stopPropagation(); o.moved = 0; } }, true);
  if (key && !el.closest('button,a')) {
    if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
    el.addEventListener('keydown', e => {
      const m = { ArrowLeft: [-.5, 0], ArrowRight: [.5, 0] }[e.key];
      if (!m) return; e.preventDefault(); o.ty += m[0]; o.idle = 0;
    });
  }
  if (scroll) {
    let last = scrollY;
    addEventListener('scroll', () => { const d = scrollY - last; last = scrollY; if (!o.drag) o.ty += Math.max(-.08, Math.min(.08, d * .0016)); }, { passive: true });
  }
  o.step = (dt = 1 / 60) => {
    const f = dt * 60;
    o.idle += dt;
    if (!o.drag) {
      o.ty += vx * f; vx *= Math.pow(.93, f);
      if (o.auto && o.idle > 1.6) o.ty += o.auto * f;
    }
    const s = 1 - Math.pow(1 - .14, f);
    o.yaw += (o.ty - o.yaw) * s;
    return o;
  };
  return o;
}

/* Puts the camera on a sphere round `center`: `dir` is the unit direction from the centre to the
   camera when upright; `pitch` swings it over the top (positive) or underneath, all the way round. */
export function aim(THREE, cam, center, dir, dist, pitch) {
  const c = aim._c || (aim._c = { up: new THREE.Vector3(0, 1, 0), ax: new THREE.Vector3(), q: new THREE.Quaternion(), p: new THREE.Vector3() });
  c.ax.crossVectors(dir, c.up); if (c.ax.lengthSq() < 1e-6) c.ax.set(1, 0, 0); c.ax.normalize();
  c.q.setFromAxisAngle(c.ax, pitch);
  c.p.copy(dir).applyQuaternion(c.q).multiplyScalar(dist);
  cam.position.copy(center).add(c.p);
  cam.up.set(0, 1, 0).applyQuaternion(c.q);
  cam.lookAt(center);
  cam.updateProjectionMatrix();
}
