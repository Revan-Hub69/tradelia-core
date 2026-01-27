'use client';

/**
 * PROGRAM CARD - Challenge Library 2026 (Tier-1 Compliant)
 *
 * Research-based design:
 * - 300px height target
 * - 3 KPI only (Account Size, Profit Split, Entry Fee)
 * - Trust signals (rating, success rate)
 * - Quick facts line (1 line, icons)
 * - Progressive disclosure (details in drawer)
 *
 * Sources:
 * - Nielsen Norman Group: "One Card = One Idea"
 * - Material Design 3: Visual hierarchy
 * - Eleken: Card UI best practices 2024
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

  // Default selection: featured > lowest fee > first (memoized)
  const defaultOffer = useMemo(
    () =>
      offers.find(o => o.is_featured) ||
      [...offers].sort((a, b) => (a.entry_fee || 0) - (b.entry_fee || 0))[0] ||
      offers[0],
    [offers],
  );

  // Use default offer (no state needed in card)
  const selectedOffer = defaultOffer;

  const isFree = program.category === 'free_competition';
  const isRanking = program.ruleset_mode === 'ranking_based';

  // Determine category for adaptive KPIs (memoized)
  const category = useMemo(
    () => (isRanking ? 'ranking_based' : program.category),
    [isRanking, program.category],
  );

  // Get adaptive KPIs based on category (memoized)
  const adaptiveKPIs = useMemo(
    () => (selectedOffer ? getAdaptiveKPIs(category, selectedOffer, kpis) : []),
    [category, selectedOffer, kpis],
  );

  // Get availability status (memoized)
  const availabilityStatus = useMemo(
    () => (selectedOffer ? getAvailabilityStatus(selectedOffer) : null),
    [selectedOffer],
  );

  // Freshness badge (memoized)
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

  // Mock trust signals (TODO: Get from database) - memoized
  const trustSignals = useMemo(
    () => ({
      rating: 4.8,
      successRate: 68,
      traderCount: 2341,
    }),
    [],
  );

  // Callbacks (prevent re-creation)
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
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.15 }
      }}
      onClick={handleCardClick}
      className={cn(
        'card-ios-26 card-ios-26-interactive group relative flex min-h-[320px] flex-col',
        isFree && 'border-green-500/20 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20',
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
      {/* Header - Badges & Trust Signals */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Badge */}
          {isFree ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-green-500/30">
              <span className="size-1.5 animate-pulse rounded-full bg-white" />
              {t('badges.free')}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-blue-600 backdrop-blur-sm dark:text-blue-400">
              {t('badges.paid')}
            </span>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1">
            <StarIcon size={12} className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {trustSignals.rating}
            </span>
          </div>

          {/* Success Rate */}
          <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1">
            <TrendingUpIcon size={12} className="text-green-600 dark:text-green-400" />
            <span className="text-xs font-bold text-green-600 dark:text-green-400">
              {trustSignals.successRate}
              %
            </span>
          </div>
        </div>

        {/* Freshness Indicator */}
        <div className={cn('flex shrink-0 items-center gap-1 rounded-full px-2 py-1 backdrop-blur-sm', freshnessBadge.bg)}>
          <FreshnessIcon size={10} className={freshnessBadge.color} />
          <span className={cn('text-xs font-bold', freshnessBadge.color)}>{freshnessBadge.label}</span>
        </div>
      </div>

      {/* Availability Status Badge */}
      {availabilityStatus && selectedOffer && (
        <div className="mb-3">
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

      {/* Program Name & Organizer */}
      <div className="mb-3">
        <h3 className="mb-0.5 line-clamp-1 text-lg font-bold leading-tight tracking-tight">
          {program.name}
        </h3>
        <p className="text-xs text-muted-foreground">{program.organizer_name}</p>
      </div>

      {/* 3 KPI Grid - ADAPTIVE based on category */}
      <div className="mb-4 grid flex-1 grid-cols-3 gap-2">
        {adaptiveKPIs.map((kpi) => {
          const colorParts = kpi.color?.split(' ');
          const colorClass = colorParts?.[0]?.replace('text-', '') || 'primary';
          const isAccountSize = kpi.label === 'accountSize';
          const hasMultipleOffers = offers.length > 1;
          
          return (
            <div
              key={kpi.label}
              className={cn(
                'flex flex-col items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3 transition-all',
                `hover:border-${colorClass}-500/30`,
              )}
            >
              <div className="mb-1 text-xs font-medium text-muted-foreground">
                {t(`card.${kpi.label}` as any)}
              </div>
              <div className={cn('text-xl font-bold tracking-tight', kpi.color)}>
                {kpi.value}
              </div>
              
              {/* Hint: More sizes available (only for accountSize) */}
              {isAccountSize && hasMultipleOffers && (
                <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="size-1 rounded-full bg-primary animate-pulse" />
                  +{offers.length - 1} {t('card.moreSizes')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Facts Line - Icons Only */}
      <div className="mb-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
        {kpis.max_daily_loss_pct && (
          <div
            className="flex items-center gap-1"
            title={`${kpis.max_daily_loss_pct}% Daily Loss`}
          >
            <CheckCircleIcon size={12} className="text-green-600 dark:text-green-400" />
            <span>
              {kpis.max_daily_loss_pct}
              % Daily
            </span>
          </div>
        )}
        {kpis.max_drawdown_pct && (
          <div
            className="flex items-center gap-1"
            title={`${kpis.max_drawdown_pct}% Max DD`}
          >
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
              {platforms.length > 1 && (
                <>
                  +
                  {platforms.length - 1}
                </>
              )}
            </span>
          </div>
        )}
        {kpis.time_limit_common !== null && (
          <div className="flex items-center gap-1" title={`${kpis.time_limit_common} days limit`}>
            <CheckCircleIcon size={12} className="text-green-600 dark:text-green-400" />
            <span>{kpis.time_limit_common === 0 ? '∞' : `${kpis.time_limit_common}d`}</span>
          </div>
        )}
      </div>
    </motion.article>
  );
}
