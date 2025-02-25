const CACHE_NAME = 'archkit-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg'
];

// Data caches
const DATA_CACHE_NAME = 'archkit-data-v1';
const API_URLS = ['/api/terms', '/api/formulas'];

// Helper function to get full URL including Replit's environment
function getFullUrl(path) {
  const port = self.location.port ? `:${self.location.port}` : '';
  return `${self.location.protocol}//${self.location.hostname}${port}${path}`;
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache assets with full URLs
      return cache.addAll(ASSETS_TO_CACHE.map(getFullUrl));
    })
  );
  // Activate new service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients immediately
      clients.claim()
    ])
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Special handling for API requests
  if (API_URLS.some(apiUrl => url.pathname.includes(apiUrl))) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => {
            return cache.match(event.request);
          });
      })
    );
    return;
  }

  // For assessment questions generation - always try network first
  if (url.pathname.includes('/api/questions/generate')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response(
            JSON.stringify({ error: 'Offline: Cannot generate new questions' }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // For all other requests - cache first, network fallback
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Return cached response immediately
        return response;
      }

      // Not in cache, try network
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});