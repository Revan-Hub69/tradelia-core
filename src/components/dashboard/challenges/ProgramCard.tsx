'use client';

/**
 * PROGRAM CARD - Challenge Library 2026 (Clean & Professional)
 *
 * Design Principles 2026:
 * - Clarity: Information scannable at a glance
 * - Professional: Sophisticated, minimal design
 * - Mobile-first: Responsive at all sizes
 * - Accessibility: WCAG AAA compliant
 * - Performance: Smooth 60fps animations
 *
 * Structure:
 * 1. Header: Category badge + Trust signals
 * 2. Title: Program name (prominent)
 * 3. Organizer: Company name (secondary)
 * 4. KPI Grid: 3 key metrics (clear hierarchy)
 * 5. Quick Facts: Icons only (tertiary info)
 */

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';

import { FRESHNESS_BADGES, FRESHNESS_STALE, FRESHNESS_THRESHOLDS } from '@/lib/challenge-constants';
import { getAdaptiveKPIs, getAvailabilityStatus } from '@/lib/challenge-utils';
import { cn } from '@/utils/Helpers';

import { AvailabilityBadge } from './AvailabilityBadge';
import {
  CheckCircleIcon,
  FreshnessIcon,
  StarIcon,
  TrendingUpIcon,
} from './PremiumIcons';

type Offer = {
  id: string;
  offer_name: string;
  account_size: number;
  account_currency: string;
  entry_fee: number | null;
  fee_currency: string | null;
  refundable: boolean;
  is_featured?: boolean;
  display_order: number;
  prize_pool?: number | null;
  first_prize?: number | null;
  max_participants?: number | null;
  current_participants?: number;
  start_date?: string | null;
  end_date?: string | null;
  registration_deadline?: string | null;
  frequency?: string;
};

type Program = {
  id: string;
  name: string;
  organizer_name: string;
  category: 'free_competition' | 'paid_evaluation';
  subtype: string;
  has_free_trial: boolean;
  ruleset_mode?: 'target_based' | 'ranking_based';
};

type KPIs = {
  profit_split_max: number | null;
  max_drawdown_pct: number | null;
  max_daily_loss_pct: number | null;
  time_limit_common: number | null;
  freshness_days: number;
  sources_count: number;
};

type ProgramCardProps = {
  program: Program;
  offers: Offer[];
  kpis: KPIs;
  platforms?: string[];
  onViewDetails: (programId: string, offerId: string) => void;
};

const EMPTY_PLATFORMS: string[] = [];

export function ProgramCard({
  program,
  offers,
  kpis,
  platforms = EMPTY_PLATFORMS,
  onViewDetails,
}: ProgramCardProps) {
  const t = useTranslations('Challenges') as any;

  // Default offer selection
  const defaultOffer = useMemo(
    () =>
      offers.find(o => o.is_featured) ||
      [...offers].sort((a, b) => (a.entry_fee || 0) - (b.entry_fee || 0))[0] ||
      offers[0],
    [offers],
  );

  const selectedOffer = defaultOffer;
  const isFree = program.category === 'free_competition';
  const isRanking = program.ruleset_mode === 'ranking_based';

  const category = useMemo(
    () => (isRanking ? 'ranking_based' : program.category),
    [isRanking, program.category],
  );

  const adaptiveKPIs = useMemo(
    () => (selectedOffer ? getAdaptiveKPIs(category, selectedOffer, kpis) : []),
    [category, selectedOffer, kpis],
  );

  const availabilityStatus = useMemo(
    () => (selectedOffer ? getAvailabilityStatus(selectedOffer) : null),
    [selectedOffer],
  );

  const freshnessBadge = useMemo(() => {
    if (kpis.freshness_days === FRESHNESS_THRESHOLDS.EXCELLENT) {
      return FRESHNESS_BADGES[FRESHNESS_THRESHOLDS.EXCELLENT];
    }
    if (kpis.freshness_days <= FRESHNESS_THRESHOLDS.GOOD) {
      return FRESHNESS_BADGES[FRESHNESS_THRESHOLDS.GOOD];
    }
    if (kpis.freshness_days <= FRESHNESS_THRESHOLDS.FAIR) {
      return FRESHNESS_BADGES[FRESHNESS_THRESHOLDS.FAIR];
    }
    return FRESHNESS_STALE;
  }, [kpis.freshness_days]);

  const trustSignals = useMemo(
    () => ({
      rating: 4.8,
      successRate: 68,
      traderCount: 2341,
    }),
    [],
  );

  const handleCardClick = useCallback(() => {
    if (defaultOffer) {
      onViewDetails(program.id, defaultOffer.id);
    }
  }, [onViewDetails, program.id, defaultOffer]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{
        scale: 1.02,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.15 },
      }}
      onClick={handleCardClick}
      className={cn(
        'relative flex min-h-[380px] flex-col gap-4 rounded-2xl border border-border/50',
        'bg-background/50 backdrop-blur-sm transition-all duration-300',
        'hover:border-border hover:shadow-lg hover:shadow-primary/5',
        'cursor-pointer p-5 sm:p-6',
        isFree && 'border-green-500/20 bg-gradient-to-br from-green-50/30 to-background dark:from-green-950/10',
      )}
      aria-label={t('a11y.cardLabel', { name: program.name })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* 1. HEADER - Category Badge + Freshness */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isFree ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700 dark:bg-green-950/30 dark:text-green-400">
              <span className="size-1.5 animate-pulse rounded-full bg-green-600 dark:bg-green-400" />
              {t('badges.free')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
              {t('badges.paid')}
            </span>
          )}
        </div>

        {/* Freshness Indicator - Right side */}
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium',
            freshnessBadge.bg,
            freshnessBadge.color,
          )}
        >
          <FreshnessIcon size={12} />
          <span>{freshnessBadge.label}</span>
        </div>
      </div>

      {/* 2. TITLE - Program Name (Hero) */}
      <div className="min-h-[56px] flex-1">
        <h3 className="line-clamp-2 text-xl font-bold leading-tight sm:text-2xl">
          {program.name}
        </h3>
      </div>

      {/* 3. ORGANIZER + TRUST SIGNALS */}
      <div className="flex items-center justify-between gap-3 border-t border-border/30 pt-3">
        <p className="text-sm font-medium text-muted-foreground">
          {program.organizer_name}
        </p>

        {/* Trust Signals - Compact */}
        <div className="flex items-center gap-2.5">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <StarIcon size={14} className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {trustSignals.rating}
            </span>
          </div>

          {/* Success Rate */}
          <div className="flex items-center gap-1">
            <TrendingUpIcon size={14} className="text-green-600 dark:text-green-400" />
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
              {trustSignals.successRate}
              %
            </span>
          </div>
        </div>
      </div>

      {/* 4. AVAILABILITY STATUS */}
      {availabilityStatus && selectedOffer && (
        <div className="border-t border-border/30 pt-3">
          <AvailabilityBadge
            status={availabilityStatus}
            daysLeft={
              selectedOffer.end_date
                ? Math.ceil(
                  (new Date(selectedOffer.end_date).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24),
                )
                : undefined
            }
            date={
              selectedOffer.start_date || selectedOffer.registration_deadline
                ? new Date(
                  selectedOffer.start_date || selectedOffer.registration_deadline!,
                ).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : undefined
            }
            spotsLeft={
              selectedOffer.max_participants && selectedOffer.current_participants
                ? selectedOffer.max_participants - selectedOffer.current_participants
                : undefined
            }
          />
        </div>
      )}

      {/* 5. KPI GRID - 3 Key Metrics */}
      <div className="grid grid-cols-3 gap-2 border-t border-border/30 pt-3">
        {adaptiveKPIs.map((kpi) => {
          return (
            <div
              key={kpi.label}
              className="flex flex-col items-center rounded-lg border border-border/30 bg-muted/20 p-2.5 text-center"
            >
              <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {t(`card.${kpi.label}` as any)}
              </div>
              <div className={cn('text-lg font-bold', kpi.color)}>
                {kpi.value}
              </div>

              {/* More sizes hint */}
              {kpi.label === 'accountSize' && offers.length > 1 && (
                <div className="mt-1 flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <span className="size-0.5 rounded-full bg-primary" />
                  +
{offers.length - 1}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 6. QUICK FACTS - Icons + Text (Minimal) */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-border/30 pt-3 text-xs text-muted-foreground">
        {kpis.max_daily_loss_pct && (
          <div className="flex items-center gap-1" title={`${kpis.max_daily_loss_pct}% Daily Loss`}>
            <CheckCircleIcon size={12} className="text-green-600 dark:text-green-400" />
            <span>
              {kpis.max_daily_loss_pct}
              % Daily
            </span>
          </div>
        )}

        {kpis.max_drawdown_pct && (
          <div className="flex items-center gap-1" title={`${kpis.max_drawdown_pct}% Max DD`}>
            <CheckCircleIcon size={12} className="text-green-600 dark:text-green-400" />
            <span>
              {kpis.max_drawdown_pct}
              % DD
            </span>
          </div>
        )}

        {platforms.length > 0 && (
          <div className="flex items-center gap-1" title={platforms.join(', ')}>
            <CheckCircleIcon size={12} className="text-green-600 dark:text-green-400" />
            <span>
              {platforms[0]}
              {platforms.length > 1 && `+${platforms.length - 1}`}
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
}
