/**
 * PWA Install Prompt Component
 *
 * Modern install prompt with Tradelia branding
 * Shows when PWA is installable but not yet installed
 */

'use client';

import React, { useState } from 'react';

import { CloseIcon, PlusIcon } from '@/components/icons/unified/UnifiedIconSystem';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/utils/Helpers';

type PWAInstallPromptProps = {
  className?: string;
  variant?: 'banner' | 'card' | 'floating';
  showIcon?: boolean;
  autoHide?: boolean;
};

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  className,
  variant = 'banner',
  showIcon = true,
  autoHide = true,
}) => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Don't show if not installable, already installed, or dismissed
  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);

    try {
      const success = await installApp();

      if (success && autoHide) {
        setIsDismissed(true);
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Store dismissal in localStorage to persist across sessions
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if user previously dismissed (within last 7 days)
  React.useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = Number.parseInt(dismissed);
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

      if (dismissedTime > weekAgo) {
        setIsDismissed(true);
      }
    }
  }, []);

  const renderBanner = () => (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-50',
      'bg-gradient-to-r from-blue-600 to-indigo-600',
      'text-white shadow-lg',
      'transform transition-transform duration-300',
      className,
    )}
    >
      <div className="mx-auto max-w-screen-xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showIcon && (
              <div className="shrink-0">
                <PlusIcon size={24} />
              </div>
            )}
            <div>
              <p className="font-medium">
                Install Tradelia App
              </p>
              <p className="text-sm opacity-90">
                Get the full experience with offline access and notifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleInstall}
              disabled={isInstalling}
              className="border-white/30 bg-white/20 text-white hover:bg-white/30"
            >
              {isInstalling ? 'Installing...' : 'Install'}
            </Button>

            <button
              onClick={handleDismiss}
              className="rounded-md p-1 transition-colors hover:bg-white/20"
              aria-label="Dismiss"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCard = () => (
    <Card className={cn(
      'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50',
      'dark:from-blue-950/50 dark:to-indigo-950/50 dark:border-blue-800',
      className,
    )}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {showIcon && (
            <div className="shrink-0 rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
              <PlusIcon size={24} />
            </div>
          )}

          <div className="flex-1">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              Install Tradelia App
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Install our app for a better experience with offline access,
              push notifications, and faster loading times.
            </p>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleInstall}
                disabled={isInstalling}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isInstalling ? 'Installing...' : 'Install App'}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-gray-500 hover:text-gray-700"
              >
                Maybe later
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFloating = () => (
    <div className={cn(
      'fixed bottom-4 right-4 z-50',
      'bg-white dark:bg-gray-900 rounded-lg shadow-lg border',
      'max-w-sm p-4',
      'transform transition-transform duration-300',
      className,
    )}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="shrink-0 rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
            <PlusIcon size={20} />
          </div>
        )}

        <div className="flex-1">
          <h4 className="mb-1 font-medium text-gray-900 dark:text-gray-100">
            Install Tradelia
          </h4>
          <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
            Get the app for better performance and offline access
          </p>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              size="sm"
              className="h-7 px-3 py-1 text-xs"
            >
              {isInstalling ? 'Installing...' : 'Install'}
            </Button>

            <button
              onClick={handleDismiss}
              className="px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="shrink-0 rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close"
        >
          <CloseIcon size={16} />
        </button>
      </div>
    </div>
  );

  switch (variant) {
    case 'banner':
      return renderBanner();
    case 'card':
      return renderCard();
    case 'floating':
      return renderFloating();
    default:
      return renderBanner();
  }
};

export default PWAInstallPrompt;
