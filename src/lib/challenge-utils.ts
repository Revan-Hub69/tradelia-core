/**
 * CHALLENGE UTILITIES - Adaptive KPI Logic
 * Best Practice 2026: Adapt UI to data category
 */

type Category = 'free_competition' | 'paid_evaluation' | 'ranking_based';

export type AdaptiveKPI = {
  label: string;
  value: string | number;
  color?: string;
  icon?: string;
};

type Offer = {
  account_size?: number;
  account_currency?: string;
  entry_fee?: number | null;
  fee_currency?: string | null;
  prize_pool?: number | null;
  first_prize?: number | null;
  max_participants?: number | null;
  current_participants?: number;
  refundable?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  registration_deadline?: string | null;
  frequency?: string;
};

type KPIs = {
  profit_split_max?: number | null;
};

/**
 * Get adaptive KPIs based on challenge category
 * Returns 3 decision-critical KPIs
 */
export function getAdaptiveKPIs(
  category: Category,
  offer: Offer,
  kpis?: KPIs,
): [AdaptiveKPI, AdaptiveKPI, AdaptiveKPI] {
  switch (category) {
    case 'free_competition':
      return [
        {
          label: 'prizePool',
          value: offer.prize_pool
            ? `$${offer.prize_pool.toLocaleString()}`
            : 'TBD',
          color: 'text-green-600 dark:text-green-400',
          icon: '🏆',
        },
        {
          label: 'entryFee',
          value: 'FREE',
          color: 'text-green-600 dark:text-green-400',
          icon: '✓',
        },
        {
          label: 'participants',
          value: offer.max_participants
            ? `vs ${offer.max_participants.toLocaleString()}`
            : 'vs ∞',
          color: 'text-blue-600 dark:text-blue-400',
          icon: '👥',
        },
      ];

    case 'ranking_based':
      return [
        {
          label: 'prizePool',
          value: offer.prize_pool
            ? `$${offer.prize_pool.toLocaleString()}`
            : 'TBD',
          color: 'text-purple-600 dark:text-purple-400',
          icon: '🏆',
        },
        {
          label: 'firstPrize',
          value: offer.first_prize
            ? `$${offer.first_prize.toLocaleString()}`
            : 'TBD',
          color: 'text-amber-600 dark:text-amber-400',
          icon: '🥇',
        },
        {
          label: 'entryFee',
          value: offer.entry_fee ? `$${offer.entry_fee}` : 'FREE',
          color: offer.entry_fee
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-green-600 dark:text-green-400',
          icon: offer.entry_fee ? '💰' : '✓',
        },
      ];

    case 'paid_evaluation':
    default:
      return [
        {
          label: 'accountSize',
          value: offer.account_size
            ? `${offer.account_currency || '$'}${
                offer.account_size >= 1000
                  ? `${offer.account_size / 1000}K`
                  : offer.account_size
              }`
            : 'N/A',
          color: 'text-foreground',
          icon: '💼',
        },
        {
          label: 'profitSplit',
          value: kpis?.profit_split_max ? `${kpis.profit_split_max}%` : 'N/A',
          color: 'text-green-600 dark:text-green-400',
          icon: '📈',
        },
        {
          label: 'entryFee',
          value: offer.entry_fee
            ? `${offer.fee_currency || '$'}${offer.entry_fee}`
            : 'FREE',
          color: offer.entry_fee
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-green-600 dark:text-green-400',
          icon: offer.entry_fee ? '💰' : '✓',
        },
      ];
  }
}

/**
 * Availability Status Types
 */
export type AvailabilityStatus = {
  label: string;
  color: 'green' | 'blue' | 'yellow' | 'orange' | 'red' | 'gray';
  icon: string;
  urgency: 'low' | 'medium' | 'high';
};

/**
 * Get availability status badge
 * Returns status indicator for time-sensitive challenges
 */
export function getAvailabilityStatus(offer: Offer): AvailabilityStatus | null {
  const now = new Date();

  // Always Open (recurring, no dates)
  if (offer.frequency === 'always_open') {
    return {
      label: 'alwaysOpen',
      color: 'green',
      icon: '🟢',
      urgency: 'low',
    };
  }

  // Ended
  if (offer.end_date && new Date(offer.end_date) < now) {
    return {
      label: 'ended',
      color: 'gray',
      icon: '⚫',
      urgency: 'low',
    };
  }

  // Upcoming
  if (offer.start_date && new Date(offer.start_date) > now) {
    return {
      label: 'upcoming',
      color: 'blue',
      icon: '🔵',
      urgency: 'low',
    };
  }

  // Live (active)
  if (offer.start_date && offer.end_date) {
    const endDate = new Date(offer.end_date);
    const daysLeft = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Closing Soon (< 7 days)
    if (daysLeft <= 7 && daysLeft > 0) {
      return {
        label: 'closingSoon',
        color: daysLeft <= 3 ? 'red' : 'yellow',
        icon: daysLeft <= 3 ? '🔴' : '🟡',
        urgency: daysLeft <= 3 ? 'high' : 'medium',
      };
    }

    // Live
    return {
      label: 'live',
      color: 'green',
      icon: '🟢',
      urgency: 'low',
    };
  }

  // Registration Deadline
  if (offer.registration_deadline) {
    const deadline = new Date(offer.registration_deadline);
    const _daysUntil = Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (_daysUntil <= 7 && _daysUntil > 0) {
      return {
        label: 'registerBy',
        color: 'orange',
        icon: '🟠',
        urgency: 'medium',
      };
    }
  }

  // Limited Spots
  if (
    offer.max_participants &&
    offer.current_participants !== undefined
  ) {
    const spotsLeft = offer.max_participants - offer.current_participants;

    if (spotsLeft <= 10 && spotsLeft > 0) {
      return {
        label: 'spotsLeft',
        color: 'red',
        icon: '🔴',
        urgency: 'high',
      };
    }
  }

  return null;
}

/**
 * Format date for display
 */
export function formatChallengeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Calculate days between dates
 */
export function getDaysBetween(date1: Date, date2: Date): number {
  return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
}
