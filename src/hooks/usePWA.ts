/**
 * PWA Hook - Native Next.js 15 Implementation
 * 
 * Manages service worker registration, install prompt, and PWA functionality
 * without external dependencies
 */

'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isSupported: boolean;
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  swRegistration: ServiceWorkerRegistration | null;
  installPrompt: BeforeInstallPromptEvent | null;
}

interface PWAActions {
  installApp: () => Promise<boolean>;
  updateServiceWorker: () => Promise<void>;
  unregisterServiceWorker: () => Promise<boolean>;
}

export function usePWA(): PWAState & PWAActions {
  const [state, setState] = useState<PWAState>({
    isSupported: false,
    isInstalled: false,
    isInstallable: false,
    isOnline: true,
    swRegistration: null,
    installPrompt: null,
  });

  // Check PWA support
  useEffect(() => {
    const isSupported = 
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window;
    
    setState(prev => ({ ...prev, isSupported }));
  }, []);

  // Register service worker
  useEffect(() => {
    if (!state.isSupported) return;

    const registerSW = async () => {
      try {
        console.log('[PWA] Registering service worker...');
        
        const registration = await navigator.serviceWorker.register('/sw-2026.js', {
          scope: '/',
          updateViaCache: 'none', // Always check for updates
        });

        console.log('[PWA] Service worker registered:', registration.scope);

        // Check if there's a waiting service worker
        if (registration.waiting) {
          console.log('[PWA] New service worker is waiting');
        }

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('[PWA] New service worker found');
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New service worker installed, ready to activate');
                // Optionally show update notification to user
              }
            });
          }
        });

        setState(prev => ({ ...prev, swRegistration: registration }));

      } catch (error) {
        console.error('[PWA] Service worker registration failed:', error);
      }
    };

    registerSW();
  }, [state.isSupported]);

  // Listen for install prompt
  useEffect(() => {
    if (!state.isSupported) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[PWA] Install prompt available');
      e.preventDefault(); // Prevent automatic prompt
      
      const installEvent = e as BeforeInstallPromptEvent;
      setState(prev => ({ 
        ...prev, 
        installPrompt: installEvent,
        isInstallable: true 
      }));
    };

    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      setState(prev => ({ 
        ...prev, 
        isInstalled: true,
        isInstallable: false,
        installPrompt: null 
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [state.isSupported]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setState(prev => ({ ...prev, isOnline: navigator.onLine }));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check if app is already installed
  useEffect(() => {
    if (!state.isSupported) return;

    const checkInstallStatus = () => {
      // Check if running in standalone mode (installed PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      
      setState(prev => ({ 
        ...prev, 
        isInstalled: isStandalone || isIOSStandalone 
      }));
    };

    checkInstallStatus();
  }, [state.isSupported]);

  // Install app function
  const installApp = async (): Promise<boolean> => {
    if (!state.installPrompt) {
      console.warn('[PWA] No install prompt available');
      return false;
    }

    try {
      console.log('[PWA] Showing install prompt...');
      await state.installPrompt.prompt();
      
      const choiceResult = await state.installPrompt.userChoice;
      console.log('[PWA] User choice:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        setState(prev => ({ 
          ...prev, 
          installPrompt: null,
          isInstallable: false 
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[PWA] Install failed:', error);
      return false;
    }
  };

  // Update service worker
  const updateServiceWorker = async (): Promise<void> => {
    if (!state.swRegistration) {
      console.warn('[PWA] No service worker registration found');
      return;
    }

    try {
      console.log('[PWA] Checking for service worker updates...');
      await state.swRegistration.update();
      
      if (state.swRegistration.waiting) {
        // Tell the waiting service worker to skip waiting
        state.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Reload the page to activate the new service worker
        window.location.reload();
      }
    } catch (error) {
      console.error('[PWA] Service worker update failed:', error);
    }
  };

  // Unregister service worker
  const unregisterServiceWorker = async (): Promise<boolean> => {
    if (!state.swRegistration) {
      console.warn('[PWA] No service worker registration found');
      return false;
    }

    try {
      console.log('[PWA] Unregistering service worker...');
      const result = await state.swRegistration.unregister();
      
      if (result) {
        setState(prev => ({ ...prev, swRegistration: null }));
        console.log('[PWA] Service worker unregistered successfully');
      }
      
      return result;
    } catch (error) {
      console.error('[PWA] Service worker unregistration failed:', error);
      return false;
    }
  };

  return {
    ...state,
    installApp,
    updateServiceWorker,
    unregisterServiceWorker,
  };
}