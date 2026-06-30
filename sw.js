// Service Worker — satisfaz requisito Chrome para PWA (beforeinstallprompt)
// Sem cache: sempre serve conteúdo fresco do servidor
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request))
})
