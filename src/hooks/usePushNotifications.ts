'use client';

import { useEffect, useState } from 'react';

import { getPushManager, type PushSubscriptionData } from '@/lib/push-notifications/push-manager';

/**
 * Push Notifications Hook - Tradelia PWA 2026
 * 
 * React hook for managing push notifications:
 * - Subscription state management
 * - Permission handling
 * - Auto-initialization
 * - Event tracking
 */

interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  subscription: PushSubscriptionData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  enableNotifications: () => Promise<boolean>;
  disableNotifications: () => Promise<boolean>;
  sendTestNotification: () => Promise<boolean>;
  requestPermission: () => Promise<NotificationPermission>;
  
  // Utils
  clearError: () => void;
  refresh: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pushManager = getPushManager();

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check support
      const supported = pushManager.getSupport();
      setIsSupported(supported);

      if (!supported) {
        console.log('[usePushNotifications] Not supported');
        return;
      }

      // Get current permission
      const currentPermission = pushManager.getPermission();
      setPermission(currentPermission);

      // Check existing subscription
      const existingSubscription = await pushManager.getSubscription();
      setIsSubscribed(!!existingSubscription);

      if (existingSubscription) {
        const subscriptionData: PushSubscriptionData = {
          endpoint: existingSubscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(existingSubscription.getKey('p256dh')!),
            auth: arrayBufferToBase64(existingSubscription.getKey('auth')!),
          },
        };
        setSubscription(subscriptionData);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Initialization failed';
      setError(errorMessage);
      console.error('[usePushNotifications] Initialize error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const enableNotifications = async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Push notifications not supported');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Subscribe to push notifications
      const subscriptionData = await pushManager.subscribe();
      
      if (!subscriptionData) {
        throw new Error('Failed to create subscription');
      }

      // Save subscription to server
      const saved = await pushManager.saveSubscription(subscriptionData);
      
      if (!saved) {
        throw new Error('Failed to save subscription to server');
      }

      // Update state
      setIsSubscribed(true);
      setSubscription(subscriptionData);
      setPermission('granted');

      console.log('[usePushNotifications] Notifications enabled');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enable notifications';
      setError(errorMessage);
      console.error('[usePushNotifications] Enable error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disableNotifications = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await pushManager.unsubscribe();
      
      if (success) {
        setIsSubscribed(false);
        setSubscription(null);
        console.log('[usePushNotifications] Notifications disabled');
        return true;
      } else {
        throw new Error('Failed to unsubscribe');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disable notifications';
      setError(errorMessage);
      console.error('[usePushNotifications] Disable error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async (): Promise<boolean> => {
    if (!isSubscribed) {
      setError('Not subscribed to notifications');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await pushManager.sendTestNotification();
      
      if (!success) {
        throw new Error('Failed to send test notification');
      }

      console.log('[usePushNotifications] Test notification sent');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send test notification';
      setError(errorMessage);
      console.error('[usePushNotifications] Test error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      setError('Push notifications not supported');
      return 'denied';
    }

    setIsLoading(true);
    setError(null);

    try {
      const newPermission = await pushManager.requestPermission();
      setPermission(newPermission);
      
      console.log('[usePushNotifications] Permission requested:', newPermission);
      return newPermission;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request permission';
      setError(errorMessage);
      console.error('[usePushNotifications] Permission error:', err);
      return 'denied';
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const refresh = async () => {
    await initialize();
  };

  // Utility function
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return {
    isSupported,
    permission,
    isSubscribed,
    subscription,
    isLoading,
    error,
    
    enableNotifications,
    disableNotifications,
    sendTestNotification,
    requestPermission,
    
    clearError,
    refresh,
  };
}

/**
 * Hook for dashboard-specific push notifications
 */
export function useDashboardNotifications() {
  const pushNotifications = usePushNotifications();

  const sendDashboardNotification = async (
    title: string,
    body: string,
    url: string = '/dashboard'
  ): Promise<boolean> => {
    if (!pushNotifications.isSubscribed) {
      return false;
    }

    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: {
            title,
            body,
            icon: '/icon-192x192.png',
            badge: '/favicon-32x32.png',
            tag: 'dashboard-notification',
            url,
            actions: [
              {
                action: 'open-dashboard',
                title: 'Open Dashboard',
                icon: '/favicon-32x32.png'
              }
            ],
            data: {
              type: 'dashboard',
              url,
              timestamp: Date.now(),
            },
          },
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('[useDashboardNotifications] Send error:', error);
      return false;
    }
  };

  return {
    ...pushNotifications,
    sendDashboardNotification,
  };
}