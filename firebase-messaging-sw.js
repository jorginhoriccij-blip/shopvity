// Firebase Messaging Service Worker
// Gerenicia notificações push em background (app fechado/minimizado)
// Ativado automaticamente pelo Firebase SDK quando VAPID_KEY estiver configurada

importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey:        'AIzaSyAPRe8ZR7UZxpF80pq44CSc6ViFl3_baH8',
  authDomain:    'imobconnect-eecb2.firebaseapp.com',
  projectId:     'imobconnect-eecb2',
  storageBucket: 'imobconnect-eecb2.firebasestorage.app',
  messagingSenderId: '91533892074',
  appId:         '1:91533892074:web:e05dff8140742a43b47a93'
})

const messaging = firebase.messaging()

// Notificação recebida com app em background
messaging.onBackgroundMessage(payload => {
  const { title = 'Shopvity', body = 'Você tem um novo pedido!' } = payload.notification || {}
  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data || {},
    actions: [{ action: 'abrir', title: 'Ver pedido' }]
  })
})

// Clique na notificação → abre o app
self.addEventListener('notificationclick', e => {
  e.notification.close()
  const url = e.notification.data?.url || '/'
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url.includes(self.location.origin) && 'focus' in c) return c.focus() }
    return clients.openWindow(url)
  }))
})
