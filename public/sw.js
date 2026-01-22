/**
 * TRADELIA SERVICE WORKER - Native Next.js 15 Implementation
 *
 * Modern PWA service worker without external dependencies
 * Optimized for Tradelia dashboard and learning platform
 */

const CACHE_NAME = 'tradelia-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.ico',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Service worker installed successfully');
        // Force activation of new service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        // Take control of all pages immediately
        return self.clients.claim();
      }),
  );
});

// Fetch event - network-first strategy with offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // CRITICAL: Skip Next.js static assets (/_next/static/)
  if (url.pathname.startsWith('/_next/')) {
    return;
  }

  // Skip API routes (let them fail naturally)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Skip auth routes (need fresh data)
  if (url.pathname.startsWith('/auth/')) {
    return;
  }

  // Skip webpack HMR and development assets
  if (url.pathname.includes('webpack') || url.pathname.includes('__nextjs')) {
    return;
  }

  // Only intercept navigation requests and specific static assets
  if (request.mode === 'navigate' || isStaticAssetThatShouldBeCached(request.url)) {
    event.respondWith(
      networkFirstWithFallback(request),
    );
  }
});

/**
 * Network-first strategy with cache fallback
 * Perfect for dynamic content that should be fresh when possible
 */
async function networkFirstWithFallback(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    // Try network first
    const networkResponse = await fetch(request);

    // If successful, cache the response for future use
    if (networkResponse.ok) {
      // Clone the response before caching (response can only be consumed once)
      const responseClone = networkResponse.clone();

      // Cache navigation requests and specific static assets only
      if (request.mode === 'navigate' || isStaticAssetThatShouldBeCached(request.url)) {
        cache.put(request, responseClone);
      }
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);

    // Network failed, try cache
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // If it's a navigation request and we have no cache, show offline page
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match(OFFLINE_URL);
      if (offlineResponse) {
        return offlineResponse;
      }
    }

    // Last resort: return the error
    throw error;
  }
}

/**
 * Check if URL is a static asset that should be cached
 * IMPORTANT: Only cache specific assets, NOT Next.js chunks
 */
function isStaticAssetThatShouldBeCached(url) {
  // Only cache these specific static assets
  const cacheableAssets = ['/manifest.json', '/favicon.ico', '/offline.html'];
  const cacheableExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2'];

  // Check if it's a specific cacheable asset
  if (cacheableAssets.some(asset => url.endsWith(asset))) {
    return true;
  }

  // Check if it's a cacheable extension BUT not a Next.js asset
  if (cacheableExtensions.some(ext => url.includes(ext)) && !url.includes('/_next/')) {
    return true;
  }

  return false;
}

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id || '1',
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icon-192x192.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Tradelia', options),
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/dashboard'),
    );
  }
  // 'close' action or no action - just close the notification
});

// Background sync (future feature)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic here
  console.log('[SW] Background sync triggered');
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('[SW] Tradelia Service Worker loaded successfully');
