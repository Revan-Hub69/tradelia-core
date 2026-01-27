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
import { useState } from 'react';

import { cn } from '@/utils/Helpers';

import { OfferSelector } from './OfferSelector';
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
  onCompareToggle: (offerId: string) => void;
  isComparing: boolean;
};

const EMPTY_PLATFORMS: string[] = [];

export function ProgramCard({
  program,
  offers,
  kpis,
  platforms = EMPTY_PLATFORMS,
  onViewDetails,
  onCompareToggle,
  isComparing,
}: ProgramCardProps) {
  const t = useTranslations('Challenges');

  // Default selection: featured > lowest fee > first
  const defaultOffer =
    offers.find(o => o.is_featured) ||
    [...offers].sort((a, b) => (a.entry_fee || 0) - (b.entry_fee || 0))[0] ||
    offers[0];

  const [selectedOfferId, setSelectedOfferId] = useState(defaultOffer?.id || '');
  const selectedOffer = offers.find(o => o.id === selectedOfferId) || defaultOffer;

  const isFree = program.category === 'free_competition';

  // Freshness badge
  const getFreshnessBadge = () => {
    if (kpis.freshness_days === 0) {
      return { label: 'T-0', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10' };
    }
    if (kpis.freshness_days <= 7) {
      return { label: 'T-7', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' };
    }
    if (kpis.freshness_days <= 30) {
      return { label: 'T-30', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' };
    }
    return { label: 'T-90+', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' };
  };

  const freshness = getFreshnessBadge();

  // Mock trust signals (TODO: Get from database)
  const trustSignals = {
    rating: 4.8,
    successRate: 68,
    traderCount: 2341,
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className={cn(
        'card-ios-26 card-ios-26-interactive group relative flex h-[320px] flex-col overflow-hidden',
        isFree && 'border-green-500/20 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20',
        isComparing && 'card-ios-26-selected',
      )}
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
        <div className={cn('flex shrink-0 items-center gap-1 rounded-full px-2 py-1 backdrop-blur-sm', freshness.bg)}>
          <FreshnessIcon size={10} className={freshness.color} />
          <span className={cn('text-xs font-bold', freshness.color)}>{freshness.label}</span>
        </div>
      </div>

      {/* Program Name & Organizer */}
      <div className="mb-3">
        <h3 className="mb-0.5 line-clamp-1 text-lg font-bold leading-tight tracking-tight">
          {program.name}
        </h3>
        <p className="text-xs text-muted-foreground">{program.organizer_name}</p>
      </div>

      {/* Offer Selector */}
      <div className="mb-4">
        <OfferSelector
          offers={offers}
          selectedOfferId={selectedOfferId}
          onSelect={setSelectedOfferId}
        />
      </div>

      {/* 3 KPI Grid - DECISION CRITICAL ONLY */}
      <div className="mb-4 grid flex-1 grid-cols-3 gap-2">
        {/* Account Size */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3 transition-all hover:border-primary/30">
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            {t('card.accountSize')}
          </div>
          <div className="text-xl font-bold tracking-tight">
            {selectedOffer?.account_currency}
            {(selectedOffer?.account_size || 0) >= 1000
              ? `${(selectedOffer?.account_size || 0) / 1000}K`
              : selectedOffer?.account_size}
          </div>
        </div>

        {/* Profit Split */}
        {kpis.profit_split_max && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3 transition-all hover:border-green-500/30">
            <div className="mb-1 text-xs font-medium text-muted-foreground">
              {t('card.profitSplit')}
            </div>
            <div className="text-xl font-bold tracking-tight text-green-600 dark:text-green-400">
              {kpis.profit_split_max}
              %
            </div>
          </div>
        )}

        {/* Entry Fee */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3 transition-all hover:border-blue-500/30">
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            {t('card.entryFee')}
          </div>
          <div className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            {selectedOffer?.entry_fee ? (
              <>
                {selectedOffer.fee_currency}
                {selectedOffer.entry_fee}
              </>
            ) : (
              <span className="text-green-600 dark:text-green-400">{t('card.free')}</span>
            )}
          </div>
        </div>
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

      {/* Actions */}
      <div className="flex gap-2 border-t border-border/50 pt-3">
        {/* Compare Checkbox */}
        <button
          onClick={() => onCompareToggle(selectedOfferId)}
          className={cn(
            'group/compare flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-semibold transition-all',
            isComparing
              ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'border-border bg-background/50 hover:border-primary/50 hover:bg-muted/50',
          )}
          type="button"
          aria-label={isComparing ? 'Remove from comparison' : 'Add to comparison'}
        >
          <div
            className={cn(
              'flex size-3.5 items-center justify-center rounded border-2 transition-all',
              isComparing
                ? 'border-primary-foreground bg-primary-foreground'
                : 'border-current group-hover/compare:border-primary',
            )}
          >
            {isComparing && (
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="hidden sm:inline">{t('actions.compare')}</span>
        </button>

        {/* View Details - PRIMARY ACTION */}
        <button
          onClick={() => onViewDetails(program.id, selectedOfferId)}
          className="group/cta flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-3 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          type="button"
        >
          <span>{t('actions.details')}</span>
          <svg
            className="size-3.5 transition-transform group-hover/cta:translate-x-0.5"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Hover Glow */}
      <div className="pointer-events-none absolute inset-0 rounded-[32px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      </div>
    </motion.article>
  );
}
