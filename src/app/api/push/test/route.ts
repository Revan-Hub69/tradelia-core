import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

/**
 * Push Test API - Tradelia PWA 2026
 *
 * Sends test push notifications for development and testing
 */

export async function POST() {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Get user's subscriptions
    const { data: subscriptions, error: dbError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user.id);

    if (dbError) {
      console.error('[Push Test] Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to get subscriptions' },
        { status: 500 },
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No push subscriptions found. Please enable notifications first.' },
        { status: 404 },
      );
    }

    // Test notification payload
    const testPayload = {
      title: '🚀 Tradelia Dashboard',
      body: 'Test notification sent successfully! Your PWA is working perfectly.',
      icon: '/icon-192x192.png',
      badge: '/favicon-32x32.png',
      tag: 'tradelia-test',
      url: '/dashboard',
      actions: [
        {
          action: 'open-dashboard',
          title: 'Open Dashboard',
          icon: '/favicon-32x32.png',
        },
        {
          action: 'view-stats',
          title: 'View Stats',
          icon: '/favicon-32x32.png',
        },
      ],
      data: {
        type: 'test',
        timestamp: Date.now(),
        userId: user.id,
      },
    };

    // Send test notifications
    const webpush = await import('web-push');

    // Configure VAPID
    webpush.default.setVapidDetails(
      'mailto:admin@tradelia.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );

    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh_key,
            auth: subscription.auth_key,
          },
        };

        await webpush.default.sendNotification(
          pushSubscription,
          JSON.stringify(testPayload),
        );

        return subscription.endpoint;
      }),
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`[Push Test] Sent ${successful} test notifications, ${failed} failed`);

    // Log failed attempts
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`[Push Test] Failed to send to subscription ${index}:`, result.reason);
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Test notification sent successfully!',
      sent: successful,
      failed,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error('[Push Test] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send test notification' },
      { status: 500 },
    );
  }
}
