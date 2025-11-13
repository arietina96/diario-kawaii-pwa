// **IMPORTANTE: Aggiornato a v3 per forzare l'eliminazione della cache precedente**
const CACHE_NAME = 'diario-kawaii-cache-v3';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', evt => {
  console.log('[Service Worker] Installazione: Messa in cache degli asset');
  // Aggiunge tutti i file critici alla cache
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // Forza il Service Worker ad attivarsi subito
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  console.log('[Service Worker] Attivazione: Pulizia vecchie cache');
  // Elimina tutte le cache precedenti che non corrispondono a CACHE_NAME (v3)
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => { 
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Eliminazione vecchia cache:', key);
          return caches.delete(key); 
        } 
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  // Intercetta le richieste e prova a servirle dalla cache
  evt.respondWith(
    caches.match(evt.request).then(resp => {
      return resp || fetch(evt.request); // Se non è in cache, va in rete
    })
  );
});
