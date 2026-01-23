// SERVICE WORKER UNREGISTRATION SCRIPT
// This script completely removes all service workers to fix PWA-related issues

(function() {
  'use strict';
  
  console.log('🧹 Starting service worker cleanup...');
  
  if ('serviceWorker' in navigator) {
    // Get all registrations
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      console.log(`Found ${registrations.length} service worker registrations`);
      
      // Unregister all service workers
      registrations.forEach(function(registration) {
        console.log('Unregistering service worker:', registration.scope);
        registration.unregister().then(function(success) {
          if (success) {
            console.log('✅ Service worker unregistered successfully');
          } else {
            console.log('❌ Service worker unregistration failed');
          }
        });
      });
      
      // Clear all caches
      if ('caches' in window) {
        caches.keys().then(function(cacheNames) {
          console.log(`Found ${cacheNames.length} caches to delete`);
          return Promise.all(
            cacheNames.map(function(cacheName) {
              console.log('Deleting cache:', cacheName);
              return caches.delete(cacheName);
            })
          );
        }).then(function() {
          console.log('✅ All caches cleared');
        });
      }
      
      // Force reload after cleanup
      setTimeout(function() {
        console.log('🔄 Reloading page to complete cleanup...');
        window.location.reload();
      }, 1000);
      
    }).catch(function(error) {
      console.error('Error during service worker cleanup:', error);
    });
  } else {
    console.log('Service workers not supported');
  }
})();