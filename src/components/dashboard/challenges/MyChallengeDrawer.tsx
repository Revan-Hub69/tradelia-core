'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { useNavigationContext } from '@/components/navigation/useNavigationContext';
import { cn } from '@/utils/Helpers';

import type { EnrollmentStatus } from './EnrollmentStatusCard';
import { ExternalLinkIcon } from './PremiumIcons';

type Enrollment = {
  id: string;
  status: EnrollmentStatus;
  program: {
    id: string;
    name: string;
    organizerName?: string;
    officialUrl?: string;
  };
  offer: {
    id: string;
    name?: string;
    accountSize?: number | string | null;
    accountCurrency?: string | null;
    durationDays?: number;
  };
  createdAt?: string;
};

type MyChallengeDrawerProps = {
  enrollment: Enrollment | null;
  isOpen: boolean;
  onClose: () => void;
  onActivate?: (enrollmentId: string) => Promise<void>;
  onRemove?: (enrollmentId: string) => Promise<void>;
};

const CloseIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className || 'size-5'}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const buildJourneySteps = (status: EnrollmentStatus, t: any) => {
  const isActive = status === 'active';
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed' || status === 'abandoned';

  return [
    {
      id: 'setup',
      title: t('journey.setup_title'),
      description: t('journey.setup_description'),
      state: isActive || isCompleted || isFailed ? 'done' : 'current',
    },
    {
      id: 'execute',
      title: t('journey.execute_title'),
      description: t('journey.execute_description'),
      state: isCompleted ? 'done' : isActive ? 'current' : 'upcoming',
    },
    {
      id: 'review',
      title: t('journey.review_title'),
      description: t('journey.review_description'),
      state: isCompleted ? 'done' : isFailed ? 'blocked' : 'upcoming',
    },
  ] as const;
};

const parseAccountSize = (value: Enrollment['offer']['accountSize']) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const buildChecklist = (status: EnrollmentStatus, t: any) => {
  const enrolled = status !== 'interested';
  const rulesReviewed = ['pending_confirmation', 'active', 'completed', 'failed', 'abandoned'].includes(status);
  const platformReady = ['active', 'completed', 'failed', 'abandoned'].includes(status);
  const firstSession = ['active', 'completed', 'failed', 'abandoned'].includes(status);

  return [
    {
      id: 'enrolled',
      title: t('checklist.enrolled_title'),
      description: t('checklist.enrolled_description'),
      done: enrolled,
    },
    {
      id: 'rules',
      title: t('checklist.rules_title'),
      description: t('checklist.rules_description'),
      done: rulesReviewed,
    },
    {
      id: 'platform',
      title: t('checklist.platform_title'),
      description: t('checklist.platform_description'),
      done: platformReady,
    },
    {
      id: 'session',
      title: t('checklist.session_title'),
      description: t('checklist.session_description'),
      done: firstSession,
    },
  ] as const;
};

export function MyChallengeDrawer({
  enrollment,
  isOpen,
  onClose,
  onActivate,
  onRemove,
}: MyChallengeDrawerProps) {
  const t = useTranslations('MyChallenges') as any;
  const { setOverlayOpen } = useNavigationContext();
  const [isWorking, setIsWorking] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  useEffect(() => {
    setOverlayOpen(isOpen);
    return () => {
      setOverlayOpen(false);
    };
  }, [isOpen, setOverlayOpen]);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
      document.body.style.removeProperty('--scrollbar-width');
    }

    return () => {
      document.body.classList.remove('scroll-locked');
      document.body.style.removeProperty('--scrollbar-width');
    };
  }, [isOpen]);

  const journeySteps = useMemo(() => {
    if (!enrollment) {
      return [];
    }
    return buildJourneySteps(enrollment.status, t);
  }, [enrollment, t]);

  const checklistItems = useMemo(() => {
    if (!enrollment) {
      return [];
    }
    return buildChecklist(enrollment.status, t);
  }, [enrollment, t]);

  if (!enrollment) {
    return null;
  }

  const accountSize = parseAccountSize(enrollment.offer.accountSize);
  const accountCurrency = enrollment.offer.accountCurrency ?? 'USD';
  const formatMoney = (value: number) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: accountCurrency,
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return `${accountCurrency} ${Math.round(value).toLocaleString()}`.trim();
    }
  };
  const riskPerTrade = accountSize ? accountSize * 0.005 : null;
  const maxDailyRisk = accountSize ? accountSize * 0.02 : null;

  const canActivate = enrollment.status === 'pending_confirmation';
  const canRemove = ['interested', 'pending_redirect', 'pending_confirmation', 'abandoned'].includes(enrollment.status);

  const handleActivate = async () => {
    if (!onActivate) {
      return;
    }
    setIsWorking(true);
    await onActivate(enrollment.id);
    setIsWorking(false);
  };

  const handleRemove = async () => {
    if (!onRemove) {
      return;
    }
    setIsWorking(true);
    await onRemove(enrollment.id);
    setIsWorking(false);
    setShowRemoveConfirm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex size-full flex-col overflow-hidden sm:w-[520px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="my-challenge-drawer-title"
          >
            <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl dark:bg-slate-950/95" />

            <div className="relative flex items-center justify-between border-b border-border/60 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('drawer.subtitle')}
                </p>
                <h2 id="my-challenge-drawer-title" className="text-lg font-semibold">
                  {enrollment.program.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {enrollment.program.organizerName || '--'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full border border-border/60 bg-white/60 p-2 text-muted-foreground transition hover:text-foreground"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="relative flex-1 space-y-6 overflow-y-auto px-5 py-6">
              <section className="space-y-3 rounded-2xl border border-border/60 bg-white/70 p-4 shadow-sm">
                <h3 className="text-sm font-semibold">{t('drawer.journey_title')}</h3>
                <div className="space-y-3">
                  {journeySteps.map(step => (
                    <div key={step.id} className="flex gap-3">
                      <div className={cn(
                        'mt-1 size-2 rounded-full',
                        step.state === 'done' && 'bg-green-500',
                        step.state === 'current' && 'bg-primary',
                        step.state === 'blocked' && 'bg-red-500',
                        step.state === 'upcoming' && 'bg-muted-foreground/40',
                      )}
                      />
                      <div>
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-3 rounded-2xl border border-border/60 bg-white/70 p-4 shadow-sm">
                <h3 className="text-sm font-semibold">{t('drawer.risk_template_title')}</h3>
                <p className="text-xs text-muted-foreground">{t('drawer.risk_template_description')}</p>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">{t('drawer.risk_per_trade_label')}</p>
                      <p className="text-sm font-medium">
                        {riskPerTrade ? formatMoney(riskPerTrade) : t('drawer.risk_template_missing')}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      0.5%
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">{t('drawer.max_daily_risk_label')}</p>
                      <p className="text-sm font-medium">
                        {maxDailyRisk ? formatMoney(maxDailyRisk) : t('drawer.risk_template_missing')}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      2%
                    </span>
                  </div>
                </div>
              </section>

              <section className="space-y-3 rounded-2xl border border-border/60 bg-white/70 p-4 shadow-sm">
                <h3 className="text-sm font-semibold">{t('drawer.checklist_title')}</h3>
                <p className="text-xs text-muted-foreground">{t('drawer.checklist_description')}</p>
                <div className="grid gap-2">
                  {checklistItems.map(item => (
                    <div key={item.id} className="flex items-start gap-3 rounded-xl border border-border/60 bg-white/70 px-3 py-2">
                      <span
                        className={cn(
                          'mt-1 size-2 rounded-full',
                          item.done ? 'bg-emerald-500' : 'bg-muted-foreground/40',
                        )}
                      />
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="relative flex flex-col gap-2 border-t border-border/60 bg-white/80 px-5 py-4">
              {enrollment.program.officialUrl && (
                <a
                  href={enrollment.program.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  <ExternalLinkIcon size={16} />
                  {t('drawer.official_link')}
                </a>
              )}

              {canActivate && (
                <button
                  type="button"
                  onClick={handleActivate}
                  disabled={isWorking}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t('drawer.confirm_start')}
                </button>
              )}

              {canRemove && (
                <button
                  type="button"
                  onClick={() => setShowRemoveConfirm(true)}
                  disabled={isWorking}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  {t('drawer.remove')}
                </button>
              )}
            </div>
          </motion.aside>

          <AnimatePresence>
            {showRemoveConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-labelledby="remove-confirm-title"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="glass-panel w-full max-w-sm rounded-2xl border border-border/50 p-6 shadow-2xl"
                >
                  <h3 id="remove-confirm-title" className="text-lg font-semibold">
                    {t('drawer.remove_confirm_title')}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t('drawer.remove_confirm_description')}
                  </p>
                  <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRemoveConfirm(false)}
                      className="rounded-lg border border-border/60 px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                    >
                      {t('drawer.remove_confirm_cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemove}
                      disabled={isWorking}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t('drawer.remove_confirm_action')}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
