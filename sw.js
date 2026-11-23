// Forge offline cache. Optional: the app runs without this file, but then it needs signal to open.
const CACHE = 'forge-v5-1';
const SHELL = ['./', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL).catch(() => c.add('./')))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const font = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !font) return;

  // The page itself: network first so updates arrive, cached copy when the gym has no signal.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 3500);
        const res = await fetch(req, { signal: ctl.signal });
        clearTimeout(t);
        if (res && res.ok) cache.put('./', res.clone());
        return res;
      } catch (err) {
        return (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Icons, manifest, fonts: cached copy first, refreshed in the background.
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    const refresh = fetch(req).then(r => {
      if (r && (r.ok || r.type === 'opaque')) cache.put(req, r.clone());
      return r;
    });
    if (hit) { refresh.catch(() => {}); return hit; }
    try { return await refresh; } catch (err) { return Response.error(); }
  })());
});
