'use client';

import { Download, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';

import { UiButton } from '@/components/ui/UiButton';

/**
 * PWA Install Button - 2026 Edition
 * 
 * Modern PWA installation component with:
 * - BeforeInstallPrompt API support
 * - iOS Safari detection and instructions
 * - Desktop and mobile optimized UI
 * - Analytics tracking for install events
 */

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onInstallStart?: () => void;
  onInstallComplete?: () => void;
  onInstallDismissed?: () => void;
}

export function PWAInstallButton2026({
  variant = 'primary',
  size = 'md',
  className = '',
  onInstallStart,
  onInstallComplete,
  onInstallDismissed,
}: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // Check if running as PWA
      const isPWA = window.navigator.standalone === true;
      
      setIsInstalled(isStandalone || isPWA);
    };

    // Detect iOS
    const detectIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                         !(window as any).MSStream;
      setIsIOS(isIOSDevice);
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      
      console.log('[PWA] Install prompt available');
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      onInstallComplete?.();
    };

    checkIfInstalled();
    detectIOS();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onInstallComplete]);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return;
    }

    try {
      onInstallStart?.();
      
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('[PWA] Install prompt result:', outcome);
      
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted install');
        onInstallComplete?.();
      } else {
        console.log('[PWA] User dismissed install');
        onInstallDismissed?.();
      }
      
      // Clear the prompt
      setDeferredPrompt(null);
      setIsInstallable(false);
      
    } catch (error) {
      console.error('[PWA] Install failed:', error);
      onInstallDismissed?.();
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show if not installable (except iOS)
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      <UiButton
        variant={variant}
        size={size}
        onClick={handleInstallClick}
        className={`gap-2 ${className}`}
        aria-label="Install Tradelia Dashboard as an app"
      >
        <Download className="size-4" />
        Install App
      </UiButton>

      {/* iOS Installation Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <Smartphone className="size-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Install Tradelia</h3>
            </div>
            
            <div className="mb-6 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <p>To install this app on your iPhone or iPad:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Tap the Share button in Safari</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </div>
            
            <div className="flex gap-3">
              <UiButton
                variant="primary"
                size="sm"
                onClick={() => setShowIOSInstructions(false)}
                className="flex-1"
              >
                Got it
              </UiButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * PWA Install Banner - For dashboard header
 */
export function PWAInstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = () => {
      setIsInstallable(true);
      
      // Show banner after a delay if user hasn't installed
      setTimeout(() => {
        const hasSeenBanner = localStorage.getItem('pwa-install-banner-seen');
        if (!hasSeenBanner) {
          setIsVisible(true);
        }
      }, 5000); // Show after 5 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-install-banner-seen', 'true');
  };

  const handleInstallComplete = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-install-banner-seen', 'true');
  };

  if (!isVisible || !isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-sm rounded-lg border bg-white p-4 shadow-lg dark:bg-gray-800 md:left-auto md:right-4 md:max-w-xs">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="font-medium">Install Tradelia</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Get the full app experience with offline access
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Dismiss install banner"
        >
          ×
        </button>
      </div>
      
      <div className="mt-3 flex gap-2">
        <PWAInstallButton2026
          variant="primary"
          size="sm"
          className="flex-1"
          onInstallComplete={handleInstallComplete}
        />
        <UiButton
          variant="outline"
          size="sm"
          onClick={handleDismiss}
        >
          Later
        </UiButton>
      </div>
    </div>
  );
}