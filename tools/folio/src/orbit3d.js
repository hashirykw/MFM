/* 360° turning, shared by every 3D model on the site.
   Drag sideways: the model spins all the way round, as many turns as you like.
   Drag up or down: it tumbles over the top and underneath, a full 360° too.
   On a phone, start the drag sideways and you can then move in any direction (an up-down
   start still scrolls the page). Arrow keys turn it when it has focus. Scrolling the page
   gives it a little spin. Let go and it keeps a touch of momentum, then turns slowly on its
   own and, after a few seconds, eases back upright by the shortest way. */
const TAU = Math.PI * 2;
const nearest = (a, ref) => a + Math.round((ref - a) / TAU) * TAU;

export function orbit(el, { yaw = 0, pitch = 0, auto = .0016, scroll = true, upright = 5, key = true } = {}) {
  const o = { yaw, pitch, ty: yaw, tp: pitch, drag: false, idle: 9, moved: 0, rest: pitch, auto };
  let lx = 0, ly = 0, vx = 0, vy = 0;
  el.style.touchAction = 'pan-y';
  el.style.cursor = 'grab';
  el.classList.add('o360');
  el.addEventListener('pointerdown', e => {
    if (e.button) return;
    o.drag = true; o.moved = 0; lx = e.clientX; ly = e.clientY; vx = vy = 0;
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
    el.style.cursor = 'grabbing';
  });
  el.addEventListener('pointermove', e => {
    if (!o.drag) return;
    const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
    const k = 7 / Math.max(260, Math.min(el.clientWidth, 900)); // a drag across the model ≈ one full turn
    vx = dx * k; vy = dy * k; o.ty += vx; o.tp += vy;
    o.moved += Math.abs(dx) + Math.abs(dy); o.idle = 0;
  });
  const up = () => { if (!o.drag) return; o.drag = false; el.style.cursor = 'grab'; };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up);
  // a drag is not a click (the folio plates open a closer view on a tap)
  (el.closest('button,a') || el).addEventListener('click', e => { if (o.moved > 6) { e.preventDefault(); e.stopPropagation(); o.moved = 0; } }, true);
  if (key && !el.closest('button,a')) {
    if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
    el.addEventListener('keydown', e => {
      const m = { ArrowLeft: [-.5, 0], ArrowRight: [.5, 0], ArrowUp: [0, -.5], ArrowDown: [0, .5] }[e.key];
      if (!m) return; e.preventDefault(); o.ty += m[0]; o.tp += m[1]; o.idle = 0;
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
      o.ty += vx * f; o.tp += vy * f; vx *= Math.pow(.93, f); vy *= Math.pow(.93, f);
      if (o.auto && o.idle > 1.6) o.ty += o.auto * f;
      if (upright && o.idle > upright) o.tp += (nearest(o.rest, o.tp) - o.tp) * .035 * f;
    }
    const s = 1 - Math.pow(1 - .14, f);
    o.yaw += (o.ty - o.yaw) * s; o.pitch += (o.tp - o.pitch) * s;
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
