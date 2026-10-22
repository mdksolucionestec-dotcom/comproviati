/* Service worker "apagado" (kill switch).
   Reemplaza al sw-comp.js normal: borra la caché, se da de baja a sí mismo y
   recarga las pestañas, para que los equipos con la app instalada vean el
   mantenimiento y dejen de usar la versión cacheada. */
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil((async function(){
    try{ const keys = await caches.keys(); await Promise.all(keys.map(function(k){ return caches.delete(k); })); }catch(err){}
    try{ await self.registration.unregister(); }catch(err){}
    try{ const cs = await self.clients.matchAll({ type:'window' }); cs.forEach(function(c){ try{ c.navigate(c.url); }catch(err){} }); }catch(err){}
  })());
});
