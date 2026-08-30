/* Service worker — Comprobación de viáticos M Dreieck (app 2)
   Guarda la app en el equipo para que abra sin internet.
   OJO: generar el Excel/PDF y guardar en Drive SÍ necesitan internet
   (usan librerías externas y el Apps Script). Esto solo hace que la
   pantalla abra offline; el armado final requiere conexión. */
const CACHE = 'mdcomp2-v1';
const ASSETS = [
  'comprobacion2.html',
  'manifest-comp.webmanifest',
  'c2-icon-192.png',
  'c2-icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;              // POST al Apps Script pasa directo
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // librerías externas (CDN) pasan directo
  e.respondWith(
    caches.match(req).then(function (r) {
      return r || fetch(req).then(function (resp) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
        return resp;
      }).catch(function () { return caches.match('comprobacion2.html'); });
    })
  );
});
