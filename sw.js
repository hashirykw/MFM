/* Sir Fazil Maniya app: offline copies of the pages a student has opened.
   Bump VERSION to clear every installed copy's cache after a release. */
const VERSION = 'mfm-v52';
const CORE = ['/', '/portal', '/ai-checker', '/past-papers', '/syllabus', '/lab', '/config.js?v=2', '/favicon.png', '/mfm-logo.webp', '/mfm-arch.svg', '/icons/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE).catch(() => {})).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/')) return;
  if (r.mode === 'navigate') {
    /* pages: fresh from the network, the saved copy when offline */
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(VERSION).then(x => x.put(r, c)); return res; }).catch(() => caches.match(r).then(m => m || caches.match('/'))));
    return;
  }
  /* config.js holds the editable details (logo, numbers, links): always fresh, saved copy only offline */
  if (u.pathname === '/config.js') {
    e.respondWith(fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(VERSION).then(x => x.put(r, c)); } return res; }).catch(() => caches.match(r, { ignoreSearch: true })));
    return;
  }
  /* files: saved copy first, refreshed in the background */
  e.respondWith(caches.match(r).then(m => { const net = fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(VERSION).then(x => x.put(r, c)); } return res; }).catch(() => m); return m || net; }));
});
