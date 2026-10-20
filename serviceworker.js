// Service worker de autodestrucción: borra la copia guardada y se da de baja
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url));
  })());
});

// Mientras tanto, no sirve nada desde caché
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
