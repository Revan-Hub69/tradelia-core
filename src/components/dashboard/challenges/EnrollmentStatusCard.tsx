'use client';

/**
 * ENROLLMENT STATUS CARD - Challenge Enrollment Flow 2026
 *
 * Displays enrollment status with appropriate actions
 * Follows Tradelia Design System
 */

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  PendingIcon,
  HelpCircleIcon,
  PlayIcon,
  TrophyIcon,
  XCircleIcon,
  ArchiveIcon,
  CheckCircleIcon,
} from './PremiumIcons';

export type EnrollmentStatus =
  | 'interested'
  | 'pending_redirect'
  | 'pending_confirmation'
  | 'active'
  | 'completed'
  | 'failed'
  | 'abandoned'
  | 'archived';

interface EnrollmentStatusCardProps {
  status: EnrollmentStatus;
  programName: string;
  offerName: string;
  organizerName: string;
  onConfirm?: () => void;
  onRemove?: () => void;
  onViewDetails?: () => void;
}

const statusConfig = {
  interested: {
    icon: PendingIcon,
    color: 'amber',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-500/20',
  },
  pending_redirect: {
    icon: PendingIcon,
    color: 'blue',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-500/20',
  },
  pending_confirmation: {
    icon: HelpCircleIcon,
    color: 'orange',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-500/20',
  },
  active: {
    icon: PlayIcon,
    color: 'green',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-600',
    borderColor: 'border-green-500/20',
  },
  completed: {
    icon: TrophyIcon,
    color: 'emerald',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-500/20',
  },
  failed: {
    icon: XCircleIcon,
    color: 'red',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-600',
    borderColor: 'border-red-500/20',
  },
  abandoned: {
    icon: ArchiveIcon,
    color: 'gray',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-600',
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
  onConfirm,
  onRemove,
  onViewDetails,
}: EnrollmentStatusCardProps) {
  const t = useTranslations('Challenges') as any;
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        glass-panel rounded-2xl border p-4 sm:p-6
        ${config.borderColor}
        transition-all hover:shadow-lg
      `}
    >
      {/* Header */}
      <div className="mb-4 flex items-start gap-4">
        <div className={`
          flex size-12 shrink-0 items-center justify-center rounded-xl
          ${config.bgColor}
        `}>
          <Icon size={24} className={config.textColor} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold">{programName}</h3>
          <p className="text-sm text-muted-foreground">{offerName}</p>
          <p className="text-xs text-muted-foreground">{organizerName}</p>
        </div>

        {/* Status Badge */}
        <span className={`
          shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold
          ${config.bgColor} ${config.textColor}
        `}>
          {t(`enrollment.status.${status}`)}
        </span>
      </div>

      {/* Actions per Status */}
      {status === 'pending_confirmation' && (
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-green-600"
            type="button"
          >
            <CheckCircleIcon size={16} />
            {t('enrollment.confirmStarted')}
          </button>
          <button
            onClick={onRemove}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold transition-all hover:bg-muted"
            type="button"
          >
            <XCircleIcon size={16} />
            {t('enrollment.remove')}
          </button>
        </div>
      )}

      {status === 'active' && (
        <button
          onClick={onViewDetails}
          className="w-full rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          type="button"
        >
          {t('enrollment.viewDetails')}
        </button>
      )}
    </motion.div>
  );
}
