// Service worker : le jeu s'installe comme une app et se relance instantanément (même hors ligne).
// La page est toujours rechargée depuis le réseau si possible (pour recevoir les mises à jour),
// les modèles 3D, scripts et polices viennent du cache.
const CACHE = 'vdp-v54';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = req.mode === 'navigate' || /\.(js|json)$/.test(url.pathname) && url.origin === location.origin;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (isPage){
      try { const r = await fetch(req); if (r.ok) cache.put(req, r.clone()); return r; }
      catch (err) { return (await cache.match(req)) || Response.error(); }
    }
    const hit = await cache.match(req);
    if (hit) return hit;
    const r = await fetch(req);
    if (r.ok || r.type === 'opaque') cache.put(req, r.clone());
    return r;
  })());
});
// toucher un rappel ramène au jeu (ou l'ouvre)
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
    if (all.length) return all[0].focus();
    return self.clients.openWindow('./');
  })());
});
