'use client';

/**
 * PROGRAM CARD - Tradelia Design System 2026 Edition
 *
 * Design Principles (Tier 1 Research):
 * - Tradelia Color Palette: Scale di blu e grigi-celesti
 * - iOS 26 Glass Morphism: Translucency, depth, premium feel
 * - No CTA Button: Card intera è cliccabile (pattern iOS 26)
 * - Visual Hierarchy: Badge → Title → KPIs (2 max)
 * - Micro-interactions: Scale on hover, haptic feedback
 *
 * Pattern: Card = Button (Apple Design 2026)
 * - L'intera card è tappabile
 * - No "View Details" button ridondante
 * - Visual affordance con hover state
 */

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';

import { cn } from '@/utils/Helpers';

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

type ProgramCardProps = {
  program: Program;
  offers: Offer[];
  kpis: {
    profit_target_phase1: number | null;
    max_drawdown_pct: number | null;
    max_daily_loss_pct: number | null;
  };
  marketAccess: {
    leverage_forex?: string | null;
    leverage_indices?: string | null;
    leverage_commodities?: string | null;
    leverage_crypto?: string | null;
  } | null;
  platforms?: string[];
  onViewDetailsAction: (programId: string, offerId: string) => void;
};

const EMPTY_PLATFORMS: string[] = [];

// Haptic feedback helper
const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([5]);
  }
};

export function ProgramCard({
  program,
  offers,
  kpis,
  marketAccess,
  platforms = EMPTY_PLATFORMS,
  onViewDetailsAction,
}: ProgramCardProps) {
  const t = useTranslations('Challenges') as any;

  // Default offer: featured > lowest fee > first
  const defaultOffer = useMemo(
    () =>
      offers.find(o => o.is_featured) ||
      [...offers].sort((a, b) => (a.entry_fee || 0) - (b.entry_fee || 0))[0] ||
      offers[0],
    [offers],
  );

  const isFree = program.category === 'free_competition';

  const leverage = useMemo(() => {
    return marketAccess?.leverage_forex
      || marketAccess?.leverage_indices
      || marketAccess?.leverage_commodities
      || marketAccess?.leverage_crypto
      || null;
  }, [marketAccess]);

  const handleCardClick = useCallback(() => {
    triggerHaptic();
    if (defaultOffer) {
      onViewDetailsAction(program.id, defaultOffer.id);
    }
  }, [onViewDetailsAction, program.id, defaultOffer]);

  const kpiItems = useMemo(() => {
    const items: { label: string; value: string }[] = [];

    if (kpis.profit_target_phase1) {
      items.push({ label: t('card.profitTarget'), value: `${kpis.profit_target_phase1}%` });
    }

    if (kpis.max_drawdown_pct) {
      items.push({ label: t('card.maxLoss'), value: `${kpis.max_drawdown_pct}%` });
    }

    if (kpis.max_daily_loss_pct) {
      items.push({ label: t('card.dailyLoss'), value: `${kpis.max_daily_loss_pct}%` });
    }

    if (leverage) {
      items.push({ label: t('card.leverage'), value: leverage });
    }

    if (items.length === 0 && defaultOffer) {
      const formatSize = (size: number, currency: string) => {
        if (size >= 1000) {
          return `${currency}${(size / 1000).toFixed(0)}K`;
        }
        return `${currency}${size.toLocaleString()}`;
      };
      const formatFee = (offer: Offer) => {
        if (offer.entry_fee === null || offer.entry_fee === 0) {
          return t('card.free');
        }
        return `${offer.fee_currency}${offer.entry_fee}`;
      };
      items.push(
        { label: t('card.accountSize'), value: formatSize(defaultOffer.account_size, defaultOffer.account_currency) },
        { label: t('card.entryFee'), value: formatFee(defaultOffer) },
      );
    }

    return items.slice(0, 3);
  }, [kpis, leverage, t, defaultOffer]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{
        scale: 1.01,
        y: -2,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={cn(
        // Tradelia Glass Card
        'group relative flex flex-col gap-3 rounded-2xl',
        'bg-white dark:bg-slate-900',
        'backdrop-blur-xl',
        'border border-slate-200 dark:border-slate-800',
        'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]',
        'dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3)]',
        'p-4',
        'cursor-pointer',
        'transition-shadow duration-300',
        // Hover: Tradelia depth effect
        'hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)]',
        'dark:hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)]',
        // Active state
        'active:scale-[0.98]',
        // Free variant: subtle sky tint
        isFree && 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-200/50 dark:border-sky-500/20',
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
      {/* HEADER: Badge + Platforms */}
      <div className="flex items-center justify-between">
        {/* Tradelia Pill Badge */}
        <span className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
          isFree
            ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
        )}
        >
          {isFree ? t('badges.free') : t('badges.paid')}
        </span>

        {/* Platforms - Tradelia subtle text */}
        {platforms.length > 0 && (
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {platforms[0]}
            {platforms.length > 1 && (
              <span className="text-slate-300 dark:text-slate-600">
                {' '}
                +
                {platforms.length - 1}
              </span>
            )}
          </span>
        )}
      </div>

      {/* TITLE - Tradelia Typography */}
      <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-100">
        {program.name}
      </h3>

      {/* ORGANIZER - Subtle secondary */}
      <p className="text-[13px] text-slate-500 dark:text-slate-400">
        {program.organizer_name}
      </p>

      {/* KPI GRID - Universal KPIs */}
      {kpiItems.length > 0 && (
        <div className={cn(
          'mt-1 grid gap-2',
          kpiItems.length === 1 ? 'grid-cols-1' : kpiItems.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
        )}
        >
          {kpiItems.map((item) => (
            <div
              key={item.label}
              className={cn(
                'flex flex-col rounded-xl px-3 py-2.5',
                'bg-slate-100 dark:bg-slate-800',
                'backdrop-blur-sm',
              )}
            >
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {item.label}
              </span>
              <span className={cn(
                'text-[15px] font-bold tracking-tight',
                isFree ? 'text-sky-700 dark:text-sky-300' : 'text-slate-900 dark:text-slate-100',
              )}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tradelia: Chevron Indicator (subtle affordance) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-400 dark:text-slate-500"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </motion.article>
  );
}
