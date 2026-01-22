'use client';

/**
 * Push Notifications Manager - Tradelia PWA 2026
 *
 * Modern push notifications implementation with:
 * - VAPID authentication
 * - Subscription management
 * - Permission handling
 * - Notification display
 * - Analytics tracking
 */

export type PushSubscriptionData = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export type NotificationPayload = {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  url?: string;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  data?: any;
};

export class PushNotificationManager {
  private vapidPublicKey: string;
  private subscription: PushSubscription | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
    this.checkSupport();
  }

  /**
   * Check if push notifications are supported
   */
  private checkSupport(): void {
    this.isSupported
      = typeof window !== 'undefined'
        && 'serviceWorker' in navigator
        && 'PushManager' in window
        && 'Notification' in window;
  }

  /**
   * Get current support status
   */
  public getSupport(): boolean {
    return this.isSupported;
  }

  /**
   * Request notification permission
   */
  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      throw new Error('Push notifications not supported');
    }

    const permission = await Notification.requestPermission();

    // Track permission result
    this.trackEvent('permission_requested', { result: permission });

    return permission;
  }

  /**
   * Get current notification permission
   */
  public getPermission(): NotificationPermission {
    if (!this.isSupported) {
      return 'denied';
    }

    return Notification.permission;
  }

  /**
   * Register service worker and get push subscription
   */
  public async subscribe(): Promise<PushSubscriptionData | null> {
    if (!this.isSupported) {
      throw new Error('Push notifications not supported');
    }

    if (this.getPermission() !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw-2026.js');
      await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey) as BufferSource,
      });

      this.subscription = subscription;

      // Convert to serializable format
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!),
        },
      };

      // Track subscription
      this.trackEvent('push_subscribed', { endpoint: subscription.endpoint });

      return subscriptionData;
    } catch (error) {
      console.error('[Push] Subscription failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.trackEvent('push_subscription_failed', { error: errorMessage });
      throw error;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  public async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    try {
      const success = await this.subscription.unsubscribe();
      if (success) {
        this.subscription = null;
        this.trackEvent('push_unsubscribed');
      }
      return success;
    } catch (error) {
      console.error('[Push] Unsubscribe failed:', error);
      return false;
    }
  }

  /**
   * Get current subscription
   */
  public async getSubscription(): Promise<PushSubscription | null> {
    if (!this.isSupported) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        return null;
      }

      const subscription = await registration.pushManager.getSubscription();
      this.subscription = subscription;
      return subscription;
    } catch (error) {
      console.error('[Push] Get subscription failed:', error);
      return null;
    }
  }

  /**
   * Send subscription to server
   */
  public async saveSubscription(subscriptionData: PushSubscriptionData): Promise<boolean> {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription: subscriptionData }),
      });

      if (response.ok) {
        this.trackEvent('subscription_saved');
        return true;
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('[Push] Save subscription failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.trackEvent('subscription_save_failed', { error: errorMessage });
      return false;
    }
  }

  /**
   * Test push notification
   */
  public async sendTestNotification(): Promise<boolean> {
    try {
      const response = await fetch('/api/push/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        this.trackEvent('test_notification_sent');
        return true;
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('[Push] Test notification failed:', error);
      return false;
    }
  }

  /**
   * Show local notification (for testing)
   */
  public async showLocalNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isSupported || this.getPermission() !== 'granted') {
      throw new Error('Notifications not permitted');
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      throw new Error('Service worker not registered');
    }

    await registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/icon-192x192.png',
      badge: payload.badge || '/favicon-32x32.png',
      tag: payload.tag || 'tradelia-notification',
      requireInteraction: false,
      data: payload.data,
    });

    this.trackEvent('local_notification_shown', { title: payload.title });
  }

  /**
   * Utility: Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Utility: Convert ArrayBuffer to Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]!);
    }
    return window.btoa(binary);
  }

  /**
   * Track analytics events
   */
  private trackEvent(event: string, data?: any): void {
    // In a real app, send to analytics service
    console.log(`[Push Analytics] ${event}`, data);

    // Example: Send to Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        event_category: 'push_notifications',
        ...data,
      });
    }
  }
}

// Singleton instance
let pushManager: PushNotificationManager | null = null;

export function getPushManager(): PushNotificationManager {
  if (!pushManager) {
    pushManager = new PushNotificationManager();
  }
  return pushManager;
}
