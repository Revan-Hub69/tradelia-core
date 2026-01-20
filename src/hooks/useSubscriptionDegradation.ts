'use client';

import { useEffect, useState } from 'react';

type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'grace_period';
type UserTier = 'free' | 'premium';

type SubscriptionState = {
  tier: UserTier;
  status: SubscriptionStatus;
  expiresAt?: Date;
  gracePeriodEnds?: Date;
  isInGracePeriod: boolean;
  daysUntilExpiry: number;
};

type DegradationOptions = {
  gracePeriodDays?: number;
  warningDays?: number;
  onTierChange?: (newTier: UserTier) => void;
  onStatusChange?: (status: SubscriptionStatus) => void;
};

/**
 * Hook for handling subscription degradation gracefully
 *
 * Features:
 * - Grace period management
 * - Gradual feature restriction
 * - User notifications
 * - Data preservation during transition
 * - Automatic tier adjustment
 */
export const useSubscriptionDegradation = (
  initialSubscription: {
    tier: UserTier;
    status: SubscriptionStatus;
    expiresAt?: string;
  },
  options: DegradationOptions = {},
) => {
  const {
    gracePeriodDays = 7,
    warningDays = 3,
    onTierChange,
    onStatusChange,
  } = options;

  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>(() => {
    const expiresAt = initialSubscription.expiresAt ? new Date(initialSubscription.expiresAt) : undefined;
    const now = new Date();
    const gracePeriodEnds = expiresAt ? new Date(expiresAt.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000) : undefined;

    const isInGracePeriod = expiresAt
      ? now > expiresAt && gracePeriodEnds ? now < gracePeriodEnds : false
      : false;

    const daysUntilExpiry = expiresAt
      ? Math.ceil((expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
      : 0;

    return {
      tier: initialSubscription.tier,
      status: initialSubscription.status,
      expiresAt,
      gracePeriodEnds,
      isInGracePeriod,
      daysUntilExpiry,
    };
  });

  // Check subscription status periodically
  useEffect(() => {
    const checkSubscriptionStatus = () => {
      const now = new Date();
      const { expiresAt, gracePeriodEnds, tier, status } = subscriptionState;

      let newStatus = status;
      let newTier = tier;

      if (expiresAt && tier === 'premium') {
        if (now > expiresAt) {
          if (gracePeriodEnds && now < gracePeriodEnds) {
            // In grace period
            newStatus = 'grace_period';
            newTier = 'premium'; // Keep premium features during grace period
          } else {
            // Grace period ended, degrade to free
            newStatus = 'expired';
            newTier = 'free';
          }
        } else {
          // Still active
          newStatus = 'active';
          newTier = 'premium';
        }
      }

      // Update state if changed
      if (newStatus !== status || newTier !== tier) {
        setSubscriptionState(prev => ({
          ...prev,
          status: newStatus,
          tier: newTier,
          isInGracePeriod: newStatus === 'grace_period',
          daysUntilExpiry: expiresAt
            ? Math.ceil((expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
            : 0,
        }));

        // Notify callbacks
        if (newTier !== tier && onTierChange) {
          onTierChange(newTier);
        }
        if (newStatus !== status && onStatusChange) {
          onStatusChange(newStatus);
        }
      }
    };

    // Check immediately
    checkSubscriptionStatus();

    // Check every hour
    const interval = setInterval(checkSubscriptionStatus, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [subscriptionState, onTierChange, onStatusChange, gracePeriodDays]);

  // Get available features based on current tier and status
  const getAvailableFeatures = () => {
    const baseFeatures = {
      basicLessons: true,
      progress: true,
      streaks: true,
      basicStats: true,
    };

    const premiumFeatures = {
      ...baseFeatures,
      advancedAnalytics: true,
      offlineContent: true,
      prioritySupport: true,
      customGoals: true,
      exportData: true,
    };

    if (subscriptionState.tier === 'premium') {
      return premiumFeatures;
    }

    return baseFeatures;
  };

  // Get degradation warnings
  const getDegradationWarnings = () => {
    const warnings: Array<{
      type: 'warning' | 'error' | 'info';
      title: string;
      message: string;
      action?: string;
    }> = [];

    const { status, daysUntilExpiry, isInGracePeriod } = subscriptionState;

    if (status === 'active' && daysUntilExpiry <= warningDays && daysUntilExpiry > 0) {
      warnings.push({
        type: 'warning',
        title: 'Abbonamento in Scadenza',
        message: `Il tuo abbonamento Premium scade tra ${daysUntilExpiry} giorni.`,
        action: 'Rinnova Ora',
      });
    }

    if (isInGracePeriod) {
      const graceDaysLeft = subscriptionState.gracePeriodEnds
        ? Math.ceil((subscriptionState.gracePeriodEnds.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))
        : 0;

      warnings.push({
        type: 'error',
        title: 'Periodo di Grazia Attivo',
        message: `Il tuo abbonamento è scaduto. Hai ancora ${graceDaysLeft} giorni per rinnovare senza perdere i dati.`,
        action: 'Rinnova Subito',
      });
    }

    if (status === 'expired' && !isInGracePeriod) {
      warnings.push({
        type: 'info',
        title: 'Account Degradato',
        message: 'Il tuo account è stato convertito al piano gratuito. I tuoi progressi sono stati preservati.',
        action: 'Riattiva Premium',
      });
    }

    return warnings;
  };

  // Handle graceful feature restriction
  const getFeatureRestrictionMessage = (feature: string) => {
    if (subscriptionState.tier === 'premium') {
      return null;
    }

    const messages: Record<string, string> = {
      advancedAnalytics: 'Le statistiche avanzate sono disponibili solo con Premium.',
      offlineContent: 'Il download offline richiede un abbonamento Premium.',
      prioritySupport: 'Il supporto prioritario è riservato agli utenti Premium.',
      customGoals: 'Gli obiettivi personalizzati sono una funzionalità Premium.',
      exportData: 'L\'esportazione dati è disponibile solo per gli utenti Premium.',
    };

    return messages[feature] || 'Questa funzionalità richiede un abbonamento Premium.';
  };

  return {
    subscriptionState,
    availableFeatures: getAvailableFeatures(),
    degradationWarnings: getDegradationWarnings(),
    getFeatureRestrictionMessage,
    isFeatureAvailable: (feature: string) => {
      const features = getAvailableFeatures();
      return features[feature as keyof typeof features] || false;
    },
  };
};
