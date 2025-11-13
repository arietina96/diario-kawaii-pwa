// **IMPORTANTE: Aggiornato a v6 per forzare l'eliminazione della cache precedente**
const CACHE_NAME = 'diario-kawaii-cache-v6'; 
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/icon-192.png', // Assicurati che questi file icona esistano
  '/icon-512.png'  // Assicurati che questi file icona esistano
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
  // Elimina tutte le cache precedenti che non corrispondono a CACHE_NAME (v6)
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => { 
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Eliminazione cache obsoleta:', key);
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim();
});

// Strategia di cache: Cache-First
self.addEventListener('fetch', evt => {
  // Ignora le chiamate API JSONBin
  if (evt.request.url.includes('jsonbin.io')) {
    return;
  }
  
  // Per tutti gli altri asset, prova a servire dalla cache e poi dal network
  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request);
    })
  );
});
