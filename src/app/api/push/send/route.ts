import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

/**
 * Push Send API - Tradelia PWA 2026
 * 
 * Sends push notifications to users:
 * - Individual user notifications
 * - Broadcast to all users
 * - Dashboard-specific notifications
 */

interface NotificationPayload {
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
}

interface SendNotificationRequest {
  userId?: string; // Send to specific user
  broadcast?: boolean; // Send to all users
  payload: NotificationPayload;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, broadcast, payload }: SendNotificationRequest = await request.json();

    if (!payload || !payload.title || !payload.body) {
      return NextResponse.json(
        { error: 'Invalid notification payload' },
        { status: 400 }
      );
    }

    // Get authenticated user (admin check could be added here)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get subscriptions to send to
    let query = supabase.from('push_subscriptions').select('*');
    
    if (userId && !broadcast) {
      query = query.eq('user_id', userId);
    } else if (!broadcast) {
      // Default: send to current user only
      query = query.eq('user_id', user.id);
    }
    // If broadcast is true, send to all subscriptions

    const { data: subscriptions, error: dbError } = await query;

    if (dbError) {
      console.error('[Push Send] Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to get subscriptions' },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No subscriptions found' },
        { status: 404 }
      );
    }

    // Send notifications
    const results = await Promise.allSettled(
      subscriptions.map(subscription => 
        sendPushNotification(subscription, payload)
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`[Push Send] Sent ${successful} notifications, ${failed} failed`);

    return NextResponse.json({
      success: true,
      sent: successful,
      failed: failed,
      total: subscriptions.length,
    });

  } catch (error) {
    console.error('[Push Send] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendPushNotification(subscription: any, payload: NotificationPayload) {
  const webpush = await import('web-push');
  
  // Configure VAPID
  webpush.default.setVapidDetails(
    'mailto:admin@tradelia.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  // Reconstruct subscription object
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh_key,
      auth: subscription.auth_key,
    },
  };

  // Enhanced payload for dashboard notifications
  const enhancedPayload = {
    ...payload,
    icon: payload.icon || '/icon-192x192.png',
    badge: payload.badge || '/favicon-32x32.png',
    tag: payload.tag || 'tradelia-dashboard',
    actions: payload.actions || [
      {
        action: 'open-dashboard',
        title: 'Open Dashboard',
        icon: '/favicon-32x32.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/favicon-32x32.png'
      }
    ],
    data: {
      ...payload.data,
      url: payload.url || '/dashboard',
      timestamp: Date.now(),
    },
  };

  try {
    await webpush.default.sendNotification(
      pushSubscription,
      JSON.stringify(enhancedPayload)
    );
    
    console.log(`[Push Send] Notification sent to ${subscription.endpoint.substring(0, 50)}...`);
    return true;
  } catch (error) {
    console.error(`[Push Send] Failed to send to ${subscription.endpoint.substring(0, 50)}...`, error);
    
    // If subscription is invalid, remove it from database
    if ((error as any).statusCode === 410 || (error as any).statusCode === 404) {
      const supabase = await createClient();
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', subscription.endpoint);
      
      console.log(`[Push Send] Removed invalid subscription: ${subscription.endpoint.substring(0, 50)}...`);
    }
    
    throw error;
  }
}