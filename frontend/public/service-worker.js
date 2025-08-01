// Import necessary Workbox modules
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache the app shell files from build process
self.__WB_MANIFEST;

// Network first for API calls
registerRoute(
  ({ url }) => url.origin === 'https://api-inference.huggingface.co' || url.origin === 'https://api.paystack.co',
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60, // Cache for 1 hour
        maxEntries: 50
      })
    ]
  })
);

// Cache first for static assets
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
      })
    ]
  })
);

// Offline page support
registerRoute(
  ({ url }) => url.pathname === '/offline.html',
  new CacheFirst({
    cacheName: 'offline-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
      })
    ],
  })
);

// Background sync backup
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/jobs')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});

