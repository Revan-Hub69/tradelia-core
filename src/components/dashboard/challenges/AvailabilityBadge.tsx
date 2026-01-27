/**
 * AVAILABILITY BADGE - Challenge Status Indicator
 * Best Practice 2026: Clear status communication
 */

import { useTranslations } from 'next-intl';

import type { AvailabilityStatus } from '@/lib/challenge-utils';
import { cn } from '@/utils/Helpers';

type AvailabilityBadgeProps = {
  status: AvailabilityStatus;
  daysLeft?: number;
  date?: string;
  spotsLeft?: number;
};

const colorClasses = {
  green: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  gray: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
};

export function AvailabilityBadge({
  status,
  daysLeft,
  date,
  spotsLeft,
}: AvailabilityBadgeProps) {
  const t = useTranslations('Challenges.availability') as any;

  // Get translated label with interpolation
  const getLabel = () => {
    switch (status.label) {
      case 'alwaysOpen':
        return t('alwaysOpen');
      case 'live':
        return daysLeft ? t('liveWithDays', { days: daysLeft }) : t('live');
      case 'upcoming':
        return date ? t('startsOn', { date }) : t('upcoming');
      case 'closingSoon':
        return daysLeft ? t('endsIn', { days: daysLeft }) : t('closingSoon');
      case 'registerBy':
        return date ? t('registerBy', { date }) : t('registerBy');
      case 'spotsLeft':
        return spotsLeft ? t('spotsLeft', { count: spotsLeft }) : t('limitedSpots');
      case 'ended':
        return t('ended');
      default:
        return status.label;
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold backdrop-blur-sm',
        colorClasses[status.color],
        status.urgency === 'high' && 'animate-pulse',
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      <span>{getLabel()}</span>
    </div>
  );
}
