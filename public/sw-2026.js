/**
 * Tradelia PWA Service Worker - 2026 Edition
 *
 * Modern PWA implementation with:
 * - Dashboard-focused caching strategy
 * - Offline-first for critical dashboard routes
 * - Network-first for real-time data
 * - Background sync for user actions
 * - Push notifications support
 */

const CACHE_NAME = 'tradelia-dashboard-v2026.1';
const DASHBOARD_CACHE = 'tradelia-dashboard-data-v1';
const STATIC_CACHE = 'tradelia-static-v1';

// Critical dashboard routes for offline access
const DASHBOARD_ROUTES = [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/learn',
  '/dashboard/settings',
];

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json',
];

// API routes that need offline fallback
const API_ROUTES = [
  '/api/user/profile',
  '/api/user/progress',
];

console.log('[SW] Tradelia Service Worker loaded successfully');

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache dashboard routes
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Precaching dashboard routes');
        return cache.addAll(DASHBOARD_ROUTES);
      }),
    ]).then(() => {
      console.log('[SW] Service worker installed successfully');
      // Skip waiting to activate immediately
      return self.skipWaiting();
    }),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME
            && cacheName !== DASHBOARD_CACHE
            && cacheName !== STATIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }).then(() => {
      console.log('[SW] Service worker activated');
      // Take control of all clients immediately
      return self.clients.claim();
    }),
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Dashboard routes - Cache First (offline-first)
  if (DASHBOARD_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  // API routes - Network First with offline fallback
  if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(networkFirstStrategy(request, DASHBOARD_CACHE));
    return;
  }

  // Static assets - Cache First
  if (STATIC_ASSETS.includes(url.pathname)
    || url.pathname.startsWith('/_next/static/')
    || url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Everything else - Network First
  event.respondWith(networkFirstStrategy(request, CACHE_NAME));
});

// Cache First Strategy - for static content and dashboard shell
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Update cache in background
      fetch(request).then((response) => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Ignore network errors in background update
      });

      return cachedResponse;
    }

    // Not in cache, fetch from network
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache first strategy failed:', error);
    // Return offline fallback if available
    return getOfflineFallback(request);
  }
}

// Network First Strategy - for dynamic content and API calls
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);

    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback
    return getOfflineFallback(request);
  }
}

// Offline fallback for when both network and cache fail
async function getOfflineFallback(request) {
  const url = new URL(request.url);

  // For dashboard routes, return cached dashboard
  if (url.pathname.startsWith('/dashboard')) {
    const cache = await caches.open(CACHE_NAME);
    const fallback = await cache.match('/dashboard');
    if (fallback) {
      return fallback;
    }
  }

  // For API routes, return empty response
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This feature requires an internet connection',
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Default offline response
  return new Response('Offline - Please check your internet connection', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' },
  });
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'dashboard-sync') {
    event.waitUntil(syncDashboardData());
  }
});

// Sync dashboard data when back online
async function syncDashboardData() {
  try {
    console.log('[SW] Syncing dashboard data...');

    // Get pending actions from IndexedDB or localStorage
    // This would sync user actions performed while offline

    // For now, just refresh the dashboard cache
    const cache = await caches.open(DASHBOARD_CACHE);
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response);
        }
      } catch (error) {
        console.log('[SW] Failed to sync:', request.url);
      }
    }

    console.log('[SW] Dashboard sync completed');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  const options = {
    body: 'You have new updates in your dashboard',
    icon: '/icon-192x192.png',
    badge: '/favicon-32x32.png',
    tag: 'dashboard-update',
    requireInteraction: false,
    actions: [
      {
        action: 'open-dashboard',
        title: 'Open Dashboard',
        icon: '/favicon-32x32.png',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/favicon-32x32.png',
      },
    ],
  };

  if (event.data) {
    try {
      const data = event.data.json();
      options.body = data.body || options.body;
      options.title = data.title || 'Tradelia Dashboard';
    } catch (error) {
      console.error('[SW] Failed to parse push data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification('Tradelia Dashboard', options),
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'open-dashboard') {
    event.waitUntil(
      clients.openWindow('/dashboard'),
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification

  } else {
    // Default action - open dashboard
    event.waitUntil(
      clients.openWindow('/dashboard'),
    );
  }
});

console.log('[SW] Service worker setup complete');
