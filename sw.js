const CACHE = 'shopvity-v1'
const SHELL = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  // Não interceptar Firebase/Google — deixar ir direto para rede
  if (url.hostname.includes('firebase') || url.hostname.includes('google') || url.hostname.includes('googleapis')) return
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request).catch(() => caches.match('/index.html')))
  )
})
