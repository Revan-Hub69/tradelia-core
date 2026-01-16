/**
 * Tradelia Subscription Types
 *
 * Per ora Tradelia è gratuita. Questo file è placeholder
 * per future funzionalità premium.
 */

export const SUBSCRIPTION_STATUS = {
  FREE: 'free',
  PREMIUM: 'premium',
} as const;

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];
