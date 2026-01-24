'use client';

import { useEffect } from 'react';

/**
 * SERVICE WORKER CLEANUP COMPONENT
 *
 * Removes all registered service workers and caches on mount.
 * This is a temporary component to clean up after PWA removal.
 *
 * REMOVE THIS COMPONENT after all users have cleaned their browsers.
 */
export function ServiceWorkerCleanup() {
  useEffect(() => {
    async function cleanupServiceWorkers() {
      if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return;
      }

      try {
        // Get all registered service workers
        const registrations = await navigator.serviceWorker.getRegistrations();

        if (registrations.length === 0) {
          // eslint-disable-next-line no-console
          console.log('[SW Cleanup] ✅ No service workers found');
          return;
        }

        // eslint-disable-next-line no-console
        console.log(`[SW Cleanup] Found ${registrations.length} service worker(s)`);

        // Unregister all service workers
        for (const registration of registrations) {
          const success = await registration.unregister();
          // eslint-disable-next-line no-console
          console.log(`[SW Cleanup] Unregistered: ${registration.scope} - Success: ${success}`);
        }

        // Clear all caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();

          if (cacheNames.length > 0) {
            // eslint-disable-next-line no-console
            console.log(`[SW Cleanup] Found ${cacheNames.length} cache(s)`);

            for (const cacheName of cacheNames) {
              await caches.delete(cacheName);
              // eslint-disable-next-line no-console
              console.log(`[SW Cleanup] Deleted cache: ${cacheName}`);
            }
          }
        }

        // eslint-disable-next-line no-console
        console.log('[SW Cleanup] ✅ All service workers and caches removed');
        // eslint-disable-next-line no-console
        console.log('[SW Cleanup] Cleanup complete - you can now remove this component');
      } catch (error) {
        console.error('[SW Cleanup] ❌ Error during cleanup:', error);
      }
    }

    cleanupServiceWorkers();
  }, []);

  // This component renders nothing
  return null;
}

