/**
 * Service Worker Tests - Tradelia Dashboard
 * 
 * Test per verificare il corretto funzionamento del Service Worker hardened
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read the service worker file for analysis
const swContent = readFileSync(join(process.cwd(), 'public/sw.js'), 'utf-8');

describe('Service Worker - Dashboard Only Routing', () => {
  it('should define DASHBOARD_PATTERNS for routing', () => {
    expect(swContent).toContain('DASHBOARD_PATTERNS');
    expect(swContent).toContain('/it/dashboard');
    expect(swContent).toContain('/en/dashboard');
    expect(swContent).toContain('/api/');
  });

  it('should define MARKETING_PATTERNS to skip', () => {
    expect(swContent).toContain('MARKETING_PATTERNS');
    expect(swContent).toContain('/about');
    expect(swContent).toContain('/pricing');
  });

  it('should have isDashboardRoute function', () => {
    expect(swContent).toContain('function isDashboardRoute');
  });

  it('should have isMarketingRoute function', () => {
    expect(swContent).toContain('function isMarketingRoute');
  });

  it('should skip marketing routes in fetch handler', () => {
    expect(swContent).toContain('isMarketingRoute(url.pathname)');
    expect(swContent).toContain('return;'); // Early return for marketing
  });
});

describe('Service Worker - Cache Versioning', () => {
  it('should define CACHE_VERSION', () => {
    expect(swContent).toContain('CACHE_VERSION');
    expect(swContent).toMatch(/CACHE_VERSION\s*=\s*['"][\d.]+['"]/);
  });

  it('should include version in CACHE_NAME', () => {
    expect(swContent).toContain('CACHE_NAME');
    expect(swContent).toContain('tradelia-dashboard-v');
  });

  it('should clean old caches on activate', () => {
    expect(swContent).toContain("addEventListener('activate'");
    expect(swContent).toContain('caches.keys()');
    expect(swContent).toContain('caches.delete');
  });

  it('should filter old tradelia caches', () => {
    expect(swContent).toContain("startsWith('tradelia-')");
    expect(swContent).toContain('!== CACHE_NAME');
  });
});

describe('Service Worker - Data Freshness Categories', () => {
  it('should define TTL constants', () => {
    expect(swContent).toContain('const TTL');
    expect(swContent).toContain('FRESHNESS_CRITICAL');
    expect(swContent).toContain('STALE_ALLOWED');
    expect(swContent).toContain('STATIC_SNAPSHOT');
  });

  it('should have getDataCategory function', () => {
    expect(swContent).toContain('function getDataCategory');
  });

  it('should categorize health endpoints as freshness-critical', () => {
    expect(swContent).toContain("pathname.includes('/health')");
    expect(swContent).toContain("'freshness-critical'");
  });

  it('should categorize preferences as stale-allowed', () => {
    expect(swContent).toContain("pathname.includes('/preferences')");
    expect(swContent).toContain("'stale-allowed'");
  });

  it('should categorize reports as static-snapshot', () => {
    expect(swContent).toContain("pathname.includes('/reports')");
    expect(swContent).toContain("'static-snapshot'");
  });
});

describe('Service Worker - Caching Strategies', () => {
  it('should have networkFirstWithFreshnessIndicator strategy', () => {
    expect(swContent).toContain('async function networkFirstWithFreshnessIndicator');
  });

  it('should have staleWhileRevalidateStrategy', () => {
    expect(swContent).toContain('async function staleWhileRevalidateStrategy');
  });

  it('should have cacheFirstWithValidation strategy', () => {
    expect(swContent).toContain('async function cacheFirstWithValidation');
  });

  it('should have cacheFirstStrategy for static assets', () => {
    expect(swContent).toContain('async function cacheFirstStrategy');
  });

  it('should add X-Data-Freshness header', () => {
    expect(swContent).toContain("'X-Data-Freshness'");
    expect(swContent).toContain("'fresh'");
    expect(swContent).toContain("'stale'");
  });

  it('should add X-Cache-Status header', () => {
    expect(swContent).toContain("'X-Cache-Status'");
    expect(swContent).toContain("'network'");
    expect(swContent).toContain("'cache-fresh'");
    expect(swContent).toContain("'cache-stale'");
  });
});

describe('Service Worker - Cache Key Generation', () => {
  it('should have getCacheKey function', () => {
    expect(swContent).toContain('function getCacheKey');
  });

  it('should include auth context in cache key', () => {
    expect(swContent).toContain('authHeader');
    expect(swContent).toContain('authorization');
  });

  it('should include locale context in cache key', () => {
    expect(swContent).toContain('locale');
    expect(swContent).toContain('accept-language');
  });

  it('should have hashString helper', () => {
    expect(swContent).toContain('function hashString');
  });
});

describe('Service Worker - Single Fetch Handler', () => {
  it('should have only one fetch event listener', () => {
    const fetchListeners = swContent.match(/addEventListener\s*\(\s*['"]fetch['"]/g);
    expect(fetchListeners).toHaveLength(1);
  });

  it('should skip non-GET requests', () => {
    expect(swContent).toContain("request.method !== 'GET'");
  });

  it('should skip external requests', () => {
    expect(swContent).toContain('self.location.origin');
  });

  it('should route to handleRequest function', () => {
    expect(swContent).toContain('handleRequest(request, url)');
  });
});

describe('Service Worker - Offline Support', () => {
  it('should return 503 for freshness-critical data when offline', () => {
    expect(swContent).toContain('status: 503');
    expect(swContent).toContain('Service Unavailable');
  });

  it('should serve stale data for stale-allowed when offline', () => {
    expect(swContent).toContain("'cache-offline'");
  });

  it('should have offline fallback', () => {
    expect(swContent).toContain("'Offline'");
  });
});

describe('Service Worker - Message Handler', () => {
  it('should handle SKIP_WAITING message', () => {
    expect(swContent).toContain("'SKIP_WAITING'");
    expect(swContent).toContain('self.skipWaiting()');
  });

  it('should handle CLEAR_CACHE message', () => {
    expect(swContent).toContain("'CLEAR_CACHE'");
    expect(swContent).toContain('caches.delete(CACHE_NAME)');
  });

  it('should handle GET_VERSION message', () => {
    expect(swContent).toContain("'GET_VERSION'");
    expect(swContent).toContain('CACHE_VERSION');
  });
});

describe('Service Worker - Push Notifications', () => {
  it('should handle push events', () => {
    expect(swContent).toContain("addEventListener('push'");
  });

  it('should handle notification clicks', () => {
    expect(swContent).toContain("addEventListener('notificationclick'");
  });

  it('should redirect to dashboard on notification click', () => {
    expect(swContent).toContain('/it/dashboard');
  });
});
