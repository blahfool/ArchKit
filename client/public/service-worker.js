const CACHE_NAME = 'archkit-cache-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './assets/*',
  './calculator',
  './terms',
  './exam',
  './ebook',
  './portfolio',
  './codes',
  './professional',
  './about',
  './not-found'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return clients.claim();
    })
  );
});

// Fetch event - handle all routes offline-first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // For navigation requests (HTML routes), return index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }

        // For other requests, try network then cache
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // If both cache and network fail, return index.html for navigation
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            return new Response('Offline content not available');
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(
      // Update cached content
      fetch('./').then(response => {
        if (response.ok) {
          const cache = caches.open(CACHE_NAME);
          return cache.then(cache => cache.put('./', response));
        }
      })
    );
  }
});