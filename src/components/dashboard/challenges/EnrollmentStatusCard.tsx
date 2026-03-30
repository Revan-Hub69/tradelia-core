'use client';

/**
 * ENROLLMENT STATUS CARD - My Challenges 2026
 *
 * Redesigned card with:
 * - Basic info: duration, account size, status
 * - Click to open drawer with more details
 * Follows Tradelia Design System
 */

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import {
  ArchiveIcon,
  ClockIcon,
  HelpCircleIcon,
  PendingIcon,
  PlayIcon,
  TrophyIcon,
  XCircleIcon,
} from '@/components/icons/unified';

export type EnrollmentStatus =
  | 'interested'
  | 'pending_redirect'
  | 'pending_confirmation'
  | 'active'
  | 'completed'
  | 'failed'
  | 'abandoned'
  | 'archived';

type EnrollmentStatusCardProps = {
  status: EnrollmentStatus;
  programName: string;
  offerName: string;
  organizerName: string;
  accountSize: string;
  duration?: string;
  startDate?: string;
  onOpenDrawer?: () => void;
};

const statusConfig = {
  interested: {
    icon: PendingIcon,
    color: 'amber',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500/20',
  },
  pending_redirect: {
    icon: PendingIcon,
    color: 'blue',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500/20',
  },
  pending_confirmation: {
    icon: HelpCircleIcon,
    color: 'orange',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-500/20',
  },
  active: {
    icon: PlayIcon,
    color: 'green',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-500/20',
  },
  completed: {
    icon: TrophyIcon,
    color: 'emerald',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500/20',
  },
  failed: {
    icon: XCircleIcon,
    color: 'red',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-500/20',
  },
  abandoned: {
    icon: ArchiveIcon,
    color: 'gray',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-600 dark:text-gray-400',
    borderColor: 'border-gray-500/20',
  },
  archived: {
    icon: ArchiveIcon,
    color: 'muted',
    bgColor: 'bg-muted',
    textColor: 'text-muted-foreground',
    borderColor: 'border-border',
  },
};

export function EnrollmentStatusCard({
  status,
  programName,
  offerName,
  organizerName,
  accountSize,
  duration,
  startDate,
  onOpenDrawer,
}: EnrollmentStatusCardProps) {
  const t = useTranslations('MyChallenges') as any;
  const config = statusConfig[status];
  const Icon = config.icon;

  // Card is clickable to open drawer
  const handleCardClick = () => {
    onOpenDrawer?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
      className={`
          glass-panel cursor-pointer rounded-2xl border p-4 sm:p-5
          ${config.borderColor}
          transition-all hover:scale-[1.02] hover:shadow-lg
        `}
    >
        {/* Header */}
        <div className="mb-4 flex items-start gap-3">
          <div className={`
            flex size-10 shrink-0 items-center justify-center rounded-xl
            ${config.bgColor}
          `}
          >
            <Icon size={20} className={config.textColor} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold">{programName}</h3>
            <p className="truncate text-xs text-muted-foreground">{offerName}</p>
            <p className="text-[10px] text-muted-foreground/70">{organizerName}</p>
          </div>

          {/* Status Badge */}
          <span className={`
            shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide
            ${config.bgColor} ${config.textColor}
          `}
          >
            {t(`enrollment.status.${status}`)}
          </span>
        </div>

        {/* Basic Info Grid */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-muted/50 p-2">
            <span className="block text-muted-foreground">Account</span>
            <span className="font-semibold">{accountSize}</span>
          </div>
          {duration && (
            <div className="rounded-lg bg-muted/50 p-2">
              <span className="block text-muted-foreground">Duration</span>
              <span className="flex items-center gap-1 font-semibold">
                <ClockIcon size={16} />
                {duration}
              </span>
            </div>
          )}
          {startDate && (
            <div className="col-span-2 rounded-lg bg-muted/50 p-2">
              <span className="block text-muted-foreground">Started</span>
              <span className="font-semibold">{startDate}</span>
            </div>
          )}
        </div>

    </motion.div>
  );
}
