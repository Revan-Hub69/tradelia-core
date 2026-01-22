'use client';

import { Bell, BellOff, Send, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

import { UiButton } from '@/components/ui/UiButton';
import { getPushManager, type PushSubscriptionData } from '@/lib/push-notifications/push-manager';

/**
 * Push Notification Manager Component - Tradelia PWA 2026
 *
 * Complete push notification management UI:
 * - Enable/disable notifications
 * - Test notifications
 * - Subscription status
 * - Permission management
 */

type PushNotificationManagerProps = {
  className?: string;
};

export function PushNotificationManager({ className = '' }: PushNotificationManagerProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscriptionData | null>(null);
  const [testStatus, setTestStatus] = useState<string>('');

  const pushManager = getPushManager();

  useEffect(() => {
    initializePushNotifications();
  }, []);

  const initializePushNotifications = async () => {
    try {
      // Check support
      const supported = pushManager.getSupport();
      setIsSupported(supported);

      if (!supported) {
        console.log('[Push UI] Push notifications not supported');
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

      console.log('[Push UI] Initialized:', {
        supported,
        permission: currentPermission,
        subscribed: !!existingSubscription,
      });
    } catch (error) {
      console.error('[Push UI] Initialization failed:', error);
    }
  };

  const handleEnableNotifications = async () => {
    if (!isSupported) {
      alert('Push notifications are not supported in this browser');
      return;
    }

    setIsLoading(true);
    setTestStatus('');

    try {
      // Subscribe to push notifications
      const subscriptionData = await pushManager.subscribe();

      if (subscriptionData) {
        // Save subscription to server
        const saved = await pushManager.saveSubscription(subscriptionData);

        if (saved) {
          setIsSubscribed(true);
          setSubscription(subscriptionData);
          setPermission('granted');
          setTestStatus('✅ Notifications enabled successfully!');
        } else {
          setTestStatus('⚠️ Subscription created but failed to save to server');
        }
      }
    } catch (error) {
      console.error('[Push UI] Enable failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTestStatus(`❌ Failed to enable notifications: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);
    setTestStatus('');

    try {
      const success = await pushManager.unsubscribe();

      if (success) {
        setIsSubscribed(false);
        setSubscription(null);
        setTestStatus('✅ Notifications disabled successfully');
      } else {
        setTestStatus('⚠️ Failed to disable notifications');
      }
    } catch (error) {
      console.error('[Push UI] Disable failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTestStatus(`❌ Failed to disable notifications: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async () => {
    if (!isSubscribed) {
      setTestStatus('⚠️ Please enable notifications first');
      return;
    }

    setIsLoading(true);
    setTestStatus('Sending test notification...');

    try {
      const success = await pushManager.sendTestNotification();

      if (success) {
        setTestStatus('✅ Test notification sent! Check your device.');
      } else {
        setTestStatus('❌ Failed to send test notification');
      }
    } catch (error) {
      console.error('[Push UI] Test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTestStatus(`❌ Test failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalTest = async () => {
    try {
      await pushManager.showLocalNotification({
        title: '🧪 Local Test Notification',
        body: 'This is a local test notification from Tradelia Dashboard',
        icon: '/icon-192x192.png',
        tag: 'local-test',
        url: '/dashboard',
        actions: [
          {
            action: 'open',
            title: 'Open Dashboard',
          },
        ],
      });

      setTestStatus('✅ Local notification shown');
    } catch (error) {
      console.error('[Push UI] Local test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTestStatus(`❌ Local test failed: ${errorMessage}`);
    }
  };

  // Utility function
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]!);
    }
    return window.btoa(binary);
  };

  if (!isSupported) {
    return (
      <div className={`rounded-lg border border-yellow-200 bg-yellow-50 p-4 ${className}`}>
        <div className="flex items-center gap-2 text-yellow-800">
          <BellOff className="size-5" />
          <span className="font-medium">Push notifications not supported</span>
        </div>
        <p className="mt-2 text-sm text-yellow-700">
          Your browser doesn't support push notifications. Try using Chrome, Firefox, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Status Card */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSubscribed
              ? (
                  <Bell className="size-5 text-green-600" />
                )
              : (
                  <BellOff className="size-5 text-gray-400" />
                )}
            <div>
              <h3 className="font-medium">Push Notifications</h3>
              <p className="text-sm text-muted-foreground">
                {isSubscribed
                  ? 'Enabled - You\'ll receive dashboard updates'
                  : 'Disabled - Enable to receive important updates'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {isSubscribed
              ? (
                  <UiButton
                    variant="ghost"
                    size="sm"
                    onClick={handleDisableNotifications}
                    disabled={isLoading}
                  >
                    <BellOff className="size-4" />
                    Disable
                  </UiButton>
                )
              : (
                  <UiButton
                    variant="primary"
                    size="sm"
                    onClick={handleEnableNotifications}
                    disabled={isLoading}
                  >
                    <Bell className="size-4" />
                    Enable
                  </UiButton>
                )}
          </div>
        </div>
      </div>

      {/* Test Controls */}
      {isSubscribed && (
        <div className="rounded-lg border bg-card p-4">
          <h4 className="mb-3 font-medium">Test Notifications</h4>
          <div className="flex flex-wrap gap-2">
            <UiButton
              variant="ghost"
              size="sm"
              onClick={handleTestNotification}
              disabled={isLoading}
            >
              <Send className="size-4" />
              Send Test Push
            </UiButton>

            <UiButton
              variant="ghost"
              size="sm"
              onClick={handleLocalTest}
              disabled={isLoading}
            >
              <Settings className="size-4" />
              Local Test
            </UiButton>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {testStatus && (
        <div className="rounded-lg border bg-muted/50 p-3">
          <p className="text-sm">{testStatus}</p>
        </div>
      )}

      {/* Debug Info (Development) */}
      {process.env.NODE_ENV === 'development' && subscription && (
        <details className="rounded-lg border bg-muted/30 p-3">
          <summary className="cursor-pointer text-sm font-medium">Debug Info</summary>
          <div className="mt-2 space-y-2 text-xs">
            <div>
              <strong>Permission:</strong>
              {' '}
              {permission}
            </div>
            <div>
              <strong>Endpoint:</strong>
              {' '}
              {subscription.endpoint.substring(0, 50)}
              ...
            </div>
            <div>
              <strong>P256DH:</strong>
              {' '}
              {subscription.keys.p256dh.substring(0, 20)}
              ...
            </div>
            <div>
              <strong>Auth:</strong>
              {' '}
              {subscription.keys.auth.substring(0, 20)}
              ...
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
