const CACHE = 'shopvity-v5'
const STATIC = ['/manifest.json', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()))
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

  // Firebase/Google — sempre rede
  if (url.hostname.includes('firebase') || url.hostname.includes('google') || url.hostname.includes('googleapis') || url.hostname.includes('gstatic')) return

  // Navegação de página (HTML) — sempre rede, nunca cache
  // Isso cobre /, /tptp, /vitrine/slug, /qualquer-rota
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(fetch(e.request).catch(() => caches.match('/index.html')))
    return
  }

  // Estáticos (manifest, ícones, etc.) — cache primeiro
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  )
})
