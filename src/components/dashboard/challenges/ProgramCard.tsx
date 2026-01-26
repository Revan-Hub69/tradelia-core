'use client';

/**
 * PROGRAM CARD - Challenge Library 2026
 *
 * Pattern: 1 card = 1 program con offer selector
 *
 * Features:
 * - Offer selector integrato (desktop/mobile)
 * - KPI grid stabile (non cambia con offer)
 * - Freshness indicator
 * - Platform icons
 * - Comparison checkbox
 * - Liquid glass design (iOS 26)
 *
 * Design System:
 * - 32px border radius
 * - Soft cream palette
 * - Premium SVG icons (no emoji)
 * - Spring physics animations
 */

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { cn } from '@/utils/Helpers';

import { OfferSelector } from './OfferSelector';
import {
  BotIcon,
  CalendarIcon,
  CheckCircleIcon,
  CTraderIcon,
  DailyLossIcon,
  DrawdownIcon,
  DXTradeIcon,
  FreshnessIcon,
  LiveAccountIcon,
  MinDaysIcon,
  MT4Icon,
  MT5Icon,
  NewsIcon,
  PaperTradingIcon,
  PayoutIcon,
  ProfitTargetIcon,
  TargetIcon,
  TimeLimitIcon,
  TradingViewIcon,
  TrophyIcon,
  WeekendIcon,
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
  // Availability
  recurring?: boolean;
  next_edition_date?: string | null;
  // Competition
  max_participants?: number | null;
};

type Program = {
  id: string;
  name: string;
  organizer_name: string;
  category: 'free_competition' | 'paid_evaluation';
  subtype: string; // 'paper', 'demo', 'sim', 'live', 'hybrid'
  has_free_trial: boolean;
  // Competition type
  ruleset_mode?: 'target_based' | 'ranking_based';
};

type Permissions = {
  ea_allowed?: boolean;
  news_trading?: boolean;
  weekend_holding?: boolean;
};

type KPIs = {
  profit_target_phase1: number | null;
  profit_target_phase2: number | null;
  max_drawdown_pct: number | null;
  max_daily_loss_pct: number | null;
  profit_split_max: number | null;
  min_trading_days: number | null;
  phase_count: number;
  first_payout_delay_days: number | null;
  time_limit_common: number | null;
  freshness_days: number;
  sources_count: number;
};

type ProgramCardProps = {
  program: Program;
  offers: Offer[];
  kpis: KPIs;
  permissions?: Permissions;
  platforms?: string[];
  onViewDetails: (programId: string, offerId: string) => void;
  onCompareToggle: (offerId: string) => void;
  isComparing: boolean;
};

const PLATFORM_ICONS: Record<string, typeof MT4Icon> = {
  MT4: MT4Icon,
  MT5: MT5Icon,
  cTrader: CTraderIcon,
  DXtrade: DXTradeIcon,
  TradingView: TradingViewIcon,
};

const EMPTY_PLATFORMS: string[] = [];

export function ProgramCard({
  program,
  offers,
  kpis,
  permissions,
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
  const isRanking = program.ruleset_mode === 'ranking_based';
  const isLiveAccount = program.subtype === 'live' || program.subtype === 'hybrid';

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

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className={cn(
        'card-ios-26 card-ios-26-interactive group relative overflow-hidden',
        isFree && 'border-green-500/20 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20',
        isComparing && 'card-ios-26-selected',
      )}
    >
      {/* Header - Program Info & Badges */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Badges Row */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {/* Category Badge */}
            {isFree ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-green-500/30">
                <span className="size-1.5 animate-pulse rounded-full bg-white" />
                {t('badges.free')}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-600 backdrop-blur-sm dark:text-blue-400">
                {t('badges.paid')}
              </span>
            )}

            {/* Free Trial Badge */}
            {program.has_free_trial && (
              <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">
                {t('badges.trial')}
              </span>
            )}
          </div>

          {/* Program Name */}
          <h3 className="mb-1 line-clamp-1 text-lg font-bold leading-tight tracking-tight">
            {program.name}
          </h3>

          {/* Organizer */}
          <p className="text-sm text-muted-foreground">{program.organizer_name}</p>
        </div>

        {/* Freshness Indicator */}
        <div className={cn('flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 backdrop-blur-sm', freshness.bg)}>
          <FreshnessIcon size={12} className={freshness.color} />
          <span className={cn('text-xs font-bold', freshness.color)}>{freshness.label}</span>
        </div>
      </div>

      {/* Offer Selector */}
      <div className="mb-4">
        <OfferSelector
          offers={offers}
          selectedOfferId={selectedOfferId}
          onSelect={setSelectedOfferId}
        />
      </div>

      {/* Status Bar - Critical Info */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* Availability Status */}
        {selectedOffer?.recurring && selectedOffer?.next_edition_date ? (
          <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <CalendarIcon size={14} />
            <span>
              {t('availability.next')}
              {' '}
              {new Date(selectedOffer.next_edition_date).toLocaleDateString()}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/10 px-2.5 py-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
            <CheckCircleIcon size={14} />
            <span>{t('availability.alwaysOpen')}</span>
          </div>
        )}

        {/* Competition Type */}
        {isRanking && selectedOffer?.max_participants ? (
          <div className="flex items-center gap-1.5 rounded-lg border border-orange-500/20 bg-orange-500/10 px-2.5 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
            <TrophyIcon size={14} />
            <span>{t('competition.vsTraders', { count: selectedOffer.max_participants })}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground">
            <TargetIcon size={14} />
            <span>{t('competition.targetBased')}</span>
          </div>
        )}

        {/* Account Type */}
        {isLiveAccount ? (
          <div className="flex items-center gap-1.5 rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <LiveAccountIcon size={14} />
            <span>{t('accountType.live')}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground">
            <PaperTradingIcon size={14} />
            <span>{t('accountType.paper')}</span>
          </div>
        )}
      </div>

      {/* Permissions Row - Deal Breakers */}
      {permissions && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {/* EA/Bot Allowed */}
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium',
              permissions.ea_allowed
                ? 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                : 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
            )}
          >
            <BotIcon size={14} />
            <span>{permissions.ea_allowed ? t('permissions.eaAllowed') : t('permissions.noEa')}</span>
          </div>

          {/* News Trading */}
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium',
              permissions.news_trading
                ? 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                : 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
            )}
          >
            <NewsIcon size={14} />
            <span>{permissions.news_trading ? t('permissions.newsOk') : t('permissions.noNews')}</span>
          </div>

          {/* Weekend Holding */}
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium',
              permissions.weekend_holding
                ? 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
                : 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
            )}
          >
            <WeekendIcon size={14} />
            <span>{permissions.weekend_holding ? t('permissions.weekendOk') : t('permissions.noWeekend')}</span>
          </div>
        </div>
      )}

      {/* KPI Grid - 2x4 (Stable, non cambia con offer) */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        {/* Profit Target */}
        {kpis.profit_target_phase1 && (
          <div className="card-nested group/metric relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3 transition-all hover:border-green-500/30">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ProfitTargetIcon size={14} />
              {t('metrics.target')}
            </div>
            <div className="text-lg font-bold tracking-tight text-green-600 dark:text-green-400">
              {kpis.profit_target_phase1}
              %
              {kpis.profit_target_phase2 && (
                <span className="text-sm">
                  {' '}
                  →
                  {' '}
                  {kpis.profit_target_phase2}
                  %
                </span>
              )}
            </div>
          </div>
        )}

        {/* Max Drawdown */}
        {kpis.max_drawdown_pct && (
          <div className="card-nested group/metric relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3 transition-all hover:border-red-500/30">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <DrawdownIcon size={14} />
              {t('metrics.drawdown')}
            </div>
            <div className="text-lg font-bold tracking-tight text-red-600 dark:text-red-400">
              {kpis.max_drawdown_pct}
              %
            </div>
          </div>
        )}

        {/* Daily Loss */}
        {kpis.max_daily_loss_pct && (
          <div className="card-nested group/metric relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3 transition-all hover:border-orange-500/30">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <DailyLossIcon size={14} />
              {t('metrics.daily')}
            </div>
            <div className="text-lg font-bold tracking-tight text-orange-600 dark:text-orange-400">
              {kpis.max_daily_loss_pct}
              %
            </div>
          </div>
        )}

        {/* Profit Split */}
        {kpis.profit_split_max && (
          <div className="card-nested group/metric relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3 transition-all hover:border-blue-500/30">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <PayoutIcon size={14} />
              {t('metrics.split')}
            </div>
            <div className="text-lg font-bold tracking-tight text-blue-600 dark:text-blue-400">
              {kpis.profit_split_max}
              %
            </div>
          </div>
        )}

        {/* Time Limit */}
        {kpis.time_limit_common !== null && (
          <div className="card-nested group/metric relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3 transition-all">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <TimeLimitIcon size={14} />
              {t('metrics.time')}
            </div>
            <div className="text-lg font-bold tracking-tight">
              {kpis.time_limit_common === 0 ? '∞' : `${kpis.time_limit_common}d`}
            </div>
          </div>
        )}

        {/* Min Days */}
        {kpis.min_trading_days && (
          <div className="card-nested group/metric relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3 transition-all">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MinDaysIcon size={14} />
              {t('metrics.minDays')}
            </div>
            <div className="text-lg font-bold tracking-tight">
              {kpis.min_trading_days}
            </div>
          </div>
        )}

        {/* Phases */}
        <div className="card-nested group/metric relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3 transition-all">
          <div className="mb-1.5 text-xs font-medium text-muted-foreground">
            {t('metrics.phases')}
          </div>
          <div className="text-lg font-bold tracking-tight">
            {kpis.phase_count}
            -
            {t('metrics.step')}
          </div>
        </div>

        {/* First Payout */}
        {kpis.first_payout_delay_days !== null && (
          <div className="card-nested group/metric relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3 transition-all">
            <div className="mb-1.5 text-xs font-medium text-muted-foreground">
              {t('metrics.payout')}
            </div>
            <div className="text-lg font-bold tracking-tight">
              {kpis.first_payout_delay_days}
              d
            </div>
          </div>
        )}
      </div>

      {/* Platforms */}
      {platforms.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {platforms.slice(0, 4).map((platform) => {
            const Icon = PLATFORM_ICONS[platform];
            return Icon ? (
              <div
                key={platform}
                className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/50 px-2.5 py-1.5 text-xs font-medium"
                title={platform}
              >
                <Icon size={14} className="text-muted-foreground" />
                <span>{platform}</span>
              </div>
            ) : (
              <div
                key={platform}
                className="rounded-lg border border-border/50 bg-background/50 px-2.5 py-1.5 text-xs font-medium"
              >
                {platform}
              </div>
            );
          })}
          {platforms.length > 4 && (
            <div className="rounded-lg border border-border/50 bg-background/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
              +
              {platforms.length - 4}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 border-t border-border/50 pt-4">
        {/* Compare Checkbox */}
        <button
          onClick={() => onCompareToggle(selectedOfferId)}
          className={cn(
            'group/compare flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all sm:px-4',
            isComparing
              ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'border-border bg-background/50 hover:border-primary/50 hover:bg-muted/50',
          )}
          type="button"
          aria-label={isComparing ? 'Remove from comparison' : 'Add to comparison'}
        >
          <div
            className={cn(
              'flex size-4 items-center justify-center rounded border-2 transition-all',
              isComparing
                ? 'border-primary-foreground bg-primary-foreground'
                : 'border-current group-hover/compare:border-primary',
            )}
          >
            {isComparing && (
              <svg
                width="12"
                height="12"
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
          <span className="hidden sm:inline">
            {t('actions.compare')}
          </span>
        </button>

        {/* View Details */}
        <button
          onClick={() => onViewDetails(program.id, selectedOfferId)}
          className="group/cta flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          type="button"
        >
          <span>
            {t('actions.details')}
          </span>
          <svg
            className="size-4 transition-transform group-hover/cta:translate-x-0.5"
            width="16"
            height="16"
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
