const CACHE = 'shopvity-v1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

// Fetch handler — necessário para o Chrome disparar beforeinstallprompt
self.addEventListener('fetch', e => {
  // Deixa Firebase, fontes externas e APIs passarem direto
  const url = new URL(e.request.url)
  if (url.origin !== self.location.origin) return

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached
      return fetch(e.request).then(resp => {
        // Cache apenas GET de assets estáticos do próprio domínio
        if (e.request.method === 'GET' && resp.ok && !url.pathname.startsWith('/api')) {
          const clone = resp.clone()
          caches.open(CACHE).then(c => c.put(e.request, clone))
        }
        return resp
      }).catch(() => cached)
    })
  )
})
