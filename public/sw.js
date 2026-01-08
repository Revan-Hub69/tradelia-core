/**
 * Tradelia Service Worker - Dashboard Only (Hardened)
 * 
 * Implements Data Freshness Contract policies for dashboard routes only.
 * Marketing pages remain cacheable by browser/CDN only.
 * 
 * @version 2.0.0
 * @see docs/data-freshness-contract.md
 */

const CACHE_VERSION = '2.0.0';
const CACHE_NAME = `tradelia-dashboard-v${CACHE_VERSION}`;
const OFFLINE_URL = '/offline';

// Dashboard route patterns (only these are handled by SW)
const DASHBOARD_PATTERNS = [
  /^\/it\/dashboard/,
  /^\/en\/dashboard/,
  /^\/dashboard/,
  /^\/api\//,
];

// Marketing routes to skip (let browser/CDN handle)
const MARKETING_PATTERNS = [
  /^\/$/,           // Homepage
  /^\/about/,
  /^\/pricing/,
  /^\/contact/,
  /^\/blog/,
];

// Assets to precache (immutable-asset category)
const PRECACHE_ASSETS = [
  '/it/dashboard',
  '/en/dashboard',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// TTL constants (in milliseconds)
const TTL = {
  FRESHNESS_CRITICAL: 0,        // Always network
  STALE_ALLOWED: 30 * 60 * 1000, // 30 minutes
  STATIC_SNAPSHOT: 24 * 60 * 60 * 1000, // 24 hours
  IMMUTABLE: 365 * 24 * 60 * 60 * 1000, // 1 year
};

/**
 * Install: precache critical dashboard assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate: clean old versioned caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Delete old tradelia caches
              return name.startsWith('tradelia-') && name !== CACHE_NAME;
            })
            .map((name) => {
              console.log(`[SW] Deleting old cache: ${name}`);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

/**
 * Fetch: Single unified handler with proper guards
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests
  if (!url.origin.includes(self.location.origin)) return;
  
  // Skip marketing routes - let browser/CDN handle
  if (isMarketingRoute(url.pathname)) return;
  
  // Only handle dashboard routes
  if (!isDashboardRoute(url.pathname)) return;
  
  // Route by destination and URL pattern
  event.respondWith(handleRequest(request, url));
});

/**
 * Check if route is a marketing page
 */
function isMarketingRoute(pathname) {
  return MARKETING_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * Check if route is a dashboard page or API
 */
function isDashboardRoute(pathname) {
  return DASHBOARD_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * Main request handler - routes to appropriate strategy
 */
async function handleRequest(request, url) {
  // Static assets (scripts, styles, images)
  if (isStaticAsset(request)) {
    return cacheFirstStrategy(request);
  }
  
  // API requests
  if (url.pathname.startsWith('/api/')) {
    return handleApiRequest(request, url);
  }
  
  // Dashboard pages
  return networkFirstStrategy(request);
}

/**
 * Check if request is for a static asset
 */
function isStaticAsset(request) {
  const destination = request.destination;
  return ['script', 'style', 'image', 'font'].includes(destination);
}

/**
 * Handle API requests based on data category
 */
async function handleApiRequest(request, url) {
  const category = getDataCategory(url.pathname);
  
  switch (category) {
    case 'freshness-critical':
      return networkFirstWithFreshnessIndicator(request);
    case 'stale-allowed':
      return staleWhileRevalidateStrategy(request, TTL.STALE_ALLOWED);
    case 'static-snapshot':
      return cacheFirstWithValidation(request, TTL.STATIC_SNAPSHOT);
    default:
      return networkFirstStrategy(request);
  }
}

/**
 * Determine data category from URL pattern
 */
function getDataCategory(pathname) {
  // Freshness-critical: real-time data
  if (pathname.includes('/health') || 
      pathname.includes('/alerts') ||
      pathname.includes('/realtime') ||
      pathname.includes('/monitoring')) {
    return 'freshness-critical';
  }
  
  // Stale-allowed: user preferences, layout
  if (pathname.includes('/preferences') || 
      pathname.includes('/layout') ||
      pathname.includes('/settings')) {
    return 'stale-allowed';
  }
  
  // Static-snapshot: historical data, reports
  if (pathname.includes('/reports') || 
      pathname.includes('/history') ||
      pathname.includes('/snapshot')) {
    return 'static-snapshot';
  }
  
  // Default to freshness-critical for safety
  return 'freshness-critical';
}

/**
 * Generate cache key with auth/locale awareness
 */
function getCacheKey(request) {
  const url = new URL(request.url);
  const authHeader = request.headers.get('authorization');
  const locale = request.headers.get('accept-language')?.split(',')[0] || 'it';
  
  // Create context-aware cache key
  const authContext = authHeader ? `auth:${hashString(authHeader).slice(0, 8)}` : 'public';
  const localeContext = `locale:${locale.slice(0, 2)}`;
  
  return `${url.pathname}${url.search}?${authContext}&${localeContext}`;
}

/**
 * Simple string hash for cache key generation
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Network-first strategy with freshness indicator
 */
async function networkFirstWithFreshnessIndicator(request) {
  try {
    const response = await fetch(request);
    
    // Add freshness indicator
    const headers = new Headers(response.headers);
    headers.set('X-Data-Freshness', 'fresh');
    headers.set('X-Cache-Status', 'network');
    headers.set('X-SW-Version', CACHE_VERSION);
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    // For freshness-critical data, return error (don't serve stale)
    return new Response(
      JSON.stringify({
        error: 'Network unavailable',
        category: 'freshness-critical',
        message: 'Real-time data unavailable. Please check connection.',
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Network-first strategy (for dashboard pages)
 */
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful responses
      const responseClone = response.clone();
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached-date', new Date().toISOString());
      
      const responseWithDate = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers,
      });
      
      cache.put(request, responseWithDate);
    }
    
    return response;
  } catch (error) {
    // Fallback to cache
    const cached = await cache.match(request);
    if (cached) {
      const headers = new Headers(cached.headers);
      headers.set('X-Data-Freshness', 'stale');
      headers.set('X-Cache-Status', 'cache-offline');
      
      return new Response(cached.body, {
        status: cached.status,
        statusText: cached.statusText,
        headers,
      });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Stale-while-revalidate strategy (for stale-allowed data)
 */
async function staleWhileRevalidateStrategy(request, ttl) {
  const cache = await caches.open(CACHE_NAME);
  const cacheKey = getCacheKey(request);
  const cached = await cache.match(cacheKey);
  
  // Check TTL
  if (cached) {
    const cachedDate = cached.headers.get('sw-cached-date');
    if (cachedDate) {
      const age = Date.now() - new Date(cachedDate).getTime();
      if (age < ttl) {
        // Fresh cached data - return immediately
        const headers = new Headers(cached.headers);
        headers.set('X-Data-Freshness', 'fresh');
        headers.set('X-Cache-Status', 'cache-fresh');
        headers.set('X-Data-Age', Math.floor(age / 1000).toString());
        
        return new Response(cached.body, {
          status: cached.status,
          statusText: cached.statusText,
          headers,
        });
      }
    }
  }
  
  // Fetch fresh data
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const responseClone = response.clone();
        const headers = new Headers(responseClone.headers);
        headers.set('sw-cached-date', new Date().toISOString());
        headers.set('X-Data-Freshness', 'fresh');
        headers.set('X-Cache-Status', 'network-updated');
        
        const responseWithDate = new Response(responseClone.body, {
          status: responseClone.status,
          statusText: responseClone.statusText,
          headers,
        });
        
        cache.put(cacheKey, responseWithDate.clone());
        return responseWithDate;
      }
      return response;
    })
    .catch(() => cached);
  
  // Return stale data immediately if available
  if (cached) {
    const headers = new Headers(cached.headers);
    headers.set('X-Data-Freshness', 'stale');
    headers.set('X-Cache-Status', 'cache-stale');
    
    // Trigger background revalidation
    networkPromise.catch(() => {});
    
    return new Response(cached.body, {
      status: cached.status,
      statusText: cached.statusText,
      headers,
    });
  }
  
  return networkPromise;
}

/**
 * Cache-first with validation (for static-snapshot data)
 */
async function cacheFirstWithValidation(request, ttl) {
  const cache = await caches.open(CACHE_NAME);
  const cacheKey = getCacheKey(request);
  const cached = await cache.match(cacheKey);
  
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
          headers,
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
        headers,
      });
      
      cache.put(cacheKey, responseWithDate.clone());
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
        headers,
      });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Cache-first strategy (for immutable static assets)
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Only cache if response has cache-control allowing it
      const cacheControl = response.headers.get('cache-control');
      if (!cacheControl || !cacheControl.includes('no-store')) {
        cache.put(request, response.clone());
      }
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Push notifications handler
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || '',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      vibrate: [100, 50, 100],
      data: { url: data.url || '/it/dashboard' },
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Tradelia', options)
    );
  } catch (error) {
    console.error('[SW] Push notification error:', error);
  }
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/it/dashboard';
  
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
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

/**
 * Message handler for cache management
 */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data?.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[SW] Cache cleared');
      })
    );
  }
  
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: CACHE_VERSION });
  }
});
