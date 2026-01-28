'use client';

/**
 * PROGRAM CARD - Enterprise Edition 2026
 *
 * Design Principles:
 * - Clarity: Solo informazioni essenziali
 * - Professional: No mock data, no effetti "carnevale"
 * - Constraint: Card decide, Drawer conferma
 *
 * Structure:
 * 1. Header: Badge tipo (Free/Paid)
 * 2. Title: Program name
 * 3. Organizer: Company name
 * 4. 2 KPI: Account Size + Entry Fee
 * 5. CTA: View Details
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
  platforms?: string[];
  onViewDetailsAction: (programId: string, offerId: string) => void;
};

const EMPTY_PLATFORMS: string[] = [];

export function ProgramCard({
  program,
  offers,
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

  const handleCardClick = useCallback(() => {
    if (defaultOffer) {
      onViewDetailsAction(program.id, defaultOffer.id);
    }
  }, [onViewDetailsAction, program.id, defaultOffer]);

  // Format account size
  const formatSize = (size: number, currency: string) => {
    if (size >= 1000) {
      return `${currency}${(size / 1000).toFixed(0)}K`;
    }
    return `${currency}${size.toLocaleString()}`;
  };

  // Format fee
  const formatFee = (offer: Offer) => {
    if (offer.entry_fee === null || offer.entry_fee === 0) {
      return t('card.free');
    }
    return `${offer.fee_currency}${offer.entry_fee}`;
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      whileHover={{ y: -2 }}
      onClick={handleCardClick}
      className={cn(
        'relative flex flex-col gap-4 rounded-2xl border border-border/40',
        'bg-background p-5 transition-all duration-200',
        'hover:border-border hover:shadow-md',
        'cursor-pointer',
        isFree && 'border-green-500/20 bg-green-50/5 dark:bg-green-950/5',
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
      {/* 1. HEADER - Badge tipo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isFree ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
              <span className="size-1.5 rounded-full bg-green-600 dark:bg-green-400" />
              {t('badges.free')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
              {t('badges.paid')}
            </span>
          )}
        </div>

        {/* Piattaforme (max 2) */}
        {platforms.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{platforms[0]}</span>
            {platforms.length > 1 && (
              <span className="text-muted-foreground/60">+{platforms.length - 1}</span>
            )}
          </div>
        )}
      </div>

      {/* 2. TITLE - Program Name */}
      <div>
        <h3 className="line-clamp-2 text-lg font-bold leading-tight">
          {program.name}
        </h3>
      </div>

      {/* 3. ORGANIZER */}
      <p className="text-sm text-muted-foreground">
        {program.organizer_name}
      </p>

      {/* 4. KPI GRID - Solo 2 metriche */}
      {defaultOffer && (
        <div className="grid grid-cols-2 gap-3 border-t border-border/30 pt-4">
          {/* Account Size */}
          <div className="flex flex-col rounded-lg bg-muted/30 p-3">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {t('card.accountSize')}
            </span>
            <span className="text-lg font-bold">
              {formatSize(defaultOffer.account_size, defaultOffer.account_currency)}
            </span>
          </div>

          {/* Entry Fee */}
          <div className="flex flex-col rounded-lg bg-muted/30 p-3">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {t('card.entryFee')}
            </span>
            <span className={cn(
              'text-lg font-bold',
              isFree ? 'text-green-600 dark:text-green-400' : 'text-foreground',
            )}>
              {formatFee(defaultOffer)}
            </span>
          </div>
        </div>
      )}

      {/* 5. CTA - View Details */}
      <div className="border-t border-border/30 pt-4">
        <button
          type="button"
          className={cn(
            'w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90',
            'focus:outline-none focus:ring-2 focus:ring-primary/20',
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          {t('card.viewDetails')}
        </button>
      </div>
    </motion.article>
  );
}
