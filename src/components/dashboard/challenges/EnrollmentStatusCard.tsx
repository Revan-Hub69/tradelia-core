'use client';

/**
 * ENROLLMENT STATUS CARD - My Challenges 2026
 *
 * Redesigned card with:
 * - Basic info: duration, account size, status
 * - Action buttons: Start (with confirmation), Delete (with confirmation)
 * - Click to open drawer with more details
 * Follows Tradelia Design System
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  ArchiveIcon,
  CheckCircleIcon,
  ClockIcon,
  DeleteIcon,
  ExternalLinkIcon,
  HelpCircleIcon,
  PendingIcon,
  PlayIcon,
  TrophyIcon,
  XCircleIcon,
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

type EnrollmentStatusCardProps = {
  status: EnrollmentStatus;
  programName: string;
  offerName: string;
  organizerName: string;
  accountSize: string;
  duration?: string;
  startDate?: string;
  officialUrl?: string;
  onConfirm?: () => void;
  onRemove?: () => void;
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

// Confirmation Dialog Component
function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor = 'red',
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor?: 'red' | 'green' | 'blue';
}) {
  const colorClasses = {
    red: 'bg-red-500 hover:bg-red-600',
    green: 'bg-green-500 hover:bg-green-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel w-full max-w-sm rounded-2xl border border-border/50 p-6 text-center shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-bold">{title}</h3>
            <p className="mb-6 text-sm text-muted-foreground">{message}</p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold transition-all hover:bg-muted"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all ${colorClasses[confirmColor]}`}
                type="button"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function EnrollmentStatusCard({
  status,
  programName,
  offerName,
  organizerName,
  accountSize,
  duration,
  startDate,
  officialUrl,
  onConfirm,
  onRemove,
  onOpenDrawer,
}: EnrollmentStatusCardProps) {
  const t = useTranslations('Challenges') as any;
  const config = statusConfig[status];
  const Icon = config.icon;

  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Card is clickable to open drawer
  const handleCardClick = () => {
    onOpenDrawer?.();
  };

  return (
    <>
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
                <ClockIcon size={12} />
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

        {/* Actions */}
        <div className="flex gap-2">
          {/* Start Button - only for pending_confirmation */}
          {status === 'pending_confirmation' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowStartConfirm(true);
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-green-600"
              type="button"
            >
              <PlayIcon size={14} />
              Start
            </button>
          )}

          {/* Open Link Button - for pending_redirect */}
          {status === 'pending_redirect' && officialUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(officialUrl, '_blank', 'noopener,noreferrer');
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-600"
              type="button"
            >
              <ExternalLinkIcon size={14} />
              Open Site
            </button>
          )}

          {/* Delete Button - available for most statuses */}
          {['interested', 'pending_redirect', 'pending_confirmation', 'abandoned'].includes(status) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/30"
              type="button"
            >
              <DeleteIcon size={14} />
              Delete
            </button>
          )}

          {/* View Details for active/completed */}
          {['active', 'completed', 'failed'].includes(status) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDrawer?.();
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              type="button"
            >
              <CheckCircleIcon size={14} />
              Details
            </button>
          )}
        </div>
      </motion.div>

      {/* Start Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showStartConfirm}
        onClose={() => setShowStartConfirm(false)}
        onConfirm={() => onConfirm?.()}
        title="Confirm Challenge Start"
        message={`Are you sure you want to start "${programName}"? This will mark the challenge as active.`}
        confirmText="Yes, Start"
        confirmColor="green"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => onRemove?.()}
        title="Delete Challenge"
        message={`Are you sure you want to remove "${programName}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />
    </>
  );
}
