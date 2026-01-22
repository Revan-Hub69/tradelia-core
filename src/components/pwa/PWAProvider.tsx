/**
 * PWA Provider Component
 * 
 * Initializes PWA functionality and provides context
 * Should be added to the root layout
 */

'use client';

import React, { useEffect } from 'react';

import { usePWA } from '@/hooks/usePWA';

import PWAInstallPrompt from './PWAInstallPrompt';

interface PWAProviderProps {
  children: React.ReactNode;
  showInstallPrompt?: boolean;
  installPromptVariant?: 'banner' | 'card' | 'floating';
}

export const PWAProvider: React.FC<PWAProviderProps> = ({
  children,
  showInstallPrompt = true,
  installPromptVariant = 'floating',
}) => {
  const { isSupported, isOnline, swRegistration } = usePWA();

  // Log PWA status for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[PWA] Status:', {
        isSupported,
        isOnline,
        hasServiceWorker: !!swRegistration,
      });
    }
  }, [isSupported, isOnline, swRegistration]);

  // Handle service worker updates
  useEffect(() => {
    if (!swRegistration) return;

    const handleControllerChange = () => {
      console.log('[PWA] New service worker activated');
      // Optionally show a notification to the user
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, [swRegistration]);

  return (
    <>
      {children}
      
      {/* Show install prompt if PWA is supported and user hasn't installed */}
      {showInstallPrompt && isSupported && (
        <PWAInstallPrompt variant={installPromptVariant} />
      )}
      
      {/* Development PWA status indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-2 left-2 z-50 text-xs bg-black/80 text-white px-2 py-1 rounded">
          PWA: {isSupported ? '✅' : '❌'} | SW: {swRegistration ? '✅' : '❌'} | Online: {isOnline ? '✅' : '❌'}
        </div>
      )}
    </>
  );
};

export default PWAProvider;