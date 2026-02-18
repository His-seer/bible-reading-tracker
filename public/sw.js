// Bible Reading Tracker — Service Worker
// Handles push events so notifications work when the tab is in the background

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
    const data = event.data?.json() ?? {};
    const title = data.title || '📖 Time to Read Your Bible!';
    const options = {
        body: data.body || "Don't break your streak — open the app and log today's reading.",
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'bible-reminder',
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clients) => {
            if (clients.length > 0) {
                clients[0].focus();
            } else {
                self.clients.openWindow('/');
            }
        })
    );
});
