/**
 * Tradelia Service Worker - Data Freshness Compliant
 * Implements Data Freshness Contract policies for different data categories
 */

const CACHE_NAME = 'tradelia-v2';
const OFFLINE_URL = '/offline';

// Assets to precache (immutable-asset category)
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install: precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('tradelia-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Data Freshness Contract compliant strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  const url = new URL(event.request.url);
  
  // Route by data category and URL pattern
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
  } else if (url.pathname.startsWith('/auth/')) {
    // Auth routes: always network-first (freshness-critical)
    event.respondWith(networkFirstStrategy(event.request));
  } else {
    // Static assets and pages: cache-first for performance
    event.respondWith(cacheFirstStrategy(event.request));
  }
});

// Handle API requests based on data category
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Determine data category from URL patterns
  let category = 'freshness-critical'; // Default to most restrictive
  
  if (url.pathname.includes('/health') || url.pathname.includes('/alerts')) {
    category = 'freshness-critical';
  } else if (url.pathname.includes('/preferences') || url.pathname.includes('/layout')) {
    category = 'stale-allowed';
  } else if (url.pathname.includes('/reports') || url.pathname.includes('/history')) {
    category = 'static-snapshot';
  }
  
  // Apply strategy based on category
  switch (category) {
    case 'freshness-critical':
      return networkFirstStrategy(request);
    case 'stale-allowed':
      return staleWhileRevalidateStrategy(request, 1800000); // 30min TTL
    case 'static-snapshot':
      return cacheFirstWithValidation(request, 86400000); // 24h TTL
    default:
      return networkFirstStrategy(request);
  }
}

// Network-first strategy (for freshness-critical data)
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    
    // Add freshness indicator to response
    const headers = new Headers(response.headers);
    headers.set('X-Data-Freshness', 'fresh');
    headers.set('X-Cache-Status', 'network');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch (error) {
    // For freshness-critical data, don't serve stale - return error
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable', 
        category: 'freshness-critical',
        message: 'Real-time data unavailable. Please check connection.' 
      }), 
      { 
        status: 503, 
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Stale-while-revalidate strategy (for stale-allowed data)
async function staleWhileRevalidateStrategy(request, ttl) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  // Check TTL
  if (cached) {
    const cachedDate = cached.headers.get('sw-cached-date');
    if (cachedDate) {
      const isStale = Date.now() - new Date(cachedDate).getTime() > ttl;
      if (!isStale) {
        // Fresh cached data
        const headers = new Headers(cached.headers);
        headers.set('X-Data-Freshness', 'fresh');
        headers.set('X-Cache-Status', 'cache-fresh');
        
        return new Response(cached.body, {
          status: cached.status,
          statusText: cached.statusText,
          headers
        });
      }
    }
  }
  
  // Fetch fresh data in background
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      const responseClone = response.clone();
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached-date', new Date().toISOString());
      headers.set('X-Data-Freshness', 'fresh');
      headers.set('X-Cache-Status', 'network-updated');
      
      const responseWithDate = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers
      });
      
      cache.put(request, responseWithDate.clone());
      return responseWithDate;
    }
    return response;
  }).catch(() => cached);
  
  // Return stale data immediately if available, fresh data when ready
  if (cached) {
    const headers = new Headers(cached.headers);
    headers.set('X-Data-Freshness', 'stale');
    headers.set('X-Cache-Status', 'cache-stale');
    
    return new Response(cached.body, {
      status: cached.status,
      statusText: cached.statusText,
      headers
    });
  }
  
  return networkPromise;
}

// Cache-first with validation (for static-snapshot data)
async function cacheFirstWithValidation(request, ttl) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    const cachedDate = cached.headers.get('sw-cached-date');
    if (cachedDate) {
      const age = Date.now() - new Date(cachedDate).getTime();
      if (age < ttl) {
        // Valid cached data
        const headers = new Headers(cached.headers);
        headers.set('X-Data-Freshness', 'snapshot');
        headers.set('X-Cache-Status', 'cache-valid');
        headers.set('X-Data-Age', Math.floor(age / 1000).toString());
        
        return new Response(cached.body, {
          status: cached.status,
          statusText: cached.statusText,
          headers
        });
      }
    }
  }
  
  // Fetch fresh data
  try {
    const response = await fetch(request);
    if (response.ok) {
      const responseClone = response.clone();
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached-date', new Date().toISOString());
      headers.set('X-Data-Freshness', 'snapshot');
      headers.set('X-Cache-Status', 'network-fresh');
      
      const responseWithDate = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers
      });
      
      cache.put(request, responseWithDate.clone());
      return responseWithDate;
    }
    return response;
  } catch (error) {
    // Serve stale data with warning
    if (cached) {
      const headers = new Headers(cached.headers);
      headers.set('X-Data-Freshness', 'stale');
      headers.set('X-Cache-Status', 'cache-offline');
      
      return new Response(cached.body, {
        status: cached.status,
        statusText: cached.statusText,
        headers
      });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Cache-first strategy (for immutable assets and pages)
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // For navigation requests, return cached home page
    if (request.mode === 'navigate') {
      const cachedHome = await cache.match('/');
      if (cachedHome) return cachedHome;
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Push notifications handler
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Tradelia', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
  );
});
