'use client';

/**
 * PROGRAM DRAWER - Enterprise Edition 2026
 *
 * Design Principles:
 * - Constraint: 3 sezioni max
 * - Focus: OfferSelector come elemento centrale
 * - No mock data, no trust signals fake
 * - Footer sempre visibile con CTA chiara
 *
 * Structure:
 * 1. Header: Nome + Organizer + OfferSelector
 * 2. Body:
    - Sezione A: Regole chiave (profit target, drawdown, daily loss)
    - Sezione B: Tabella offerte (se >1)
    - Sezione C: Mercati e payout essenziali
 * 3. Footer: CTA primaria + Chiudi
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';
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
  scaling_max?: number | null;
  time_limit_days?: number | null;
};

type Ruleset = {
  phase_number: number;
  profit_target_pct: number | null;
  max_drawdown_pct: number | null;
  max_drawdown_type?: 'balance_based' | 'equity_based' | 'trailing';
  max_daily_loss_pct: number | null;
  max_daily_loss_type?: 'balance_based' | 'equity_based';
  min_trading_days: number | null;
};

type PayoutTerms = {
  profit_split_max: number;
  payout_frequency: string;
  first_payout_delay_days: number;
};

type MarketAccess = {
  markets_available: string[];
  platforms: string[];
  leverage_forex?: string | null;
};

type Program = {
  id: string;
  name: string;
  organizer_name: string;
  category: 'free_competition' | 'paid_evaluation';
  ruleset_mode?: 'target_based' | 'ranking_based';
  description?: string | null;
};

type ProgramDrawerProps = {
  program: Program | null;
  offers: Offer[];
  rulesets: Ruleset[];
  payoutTerms: PayoutTerms | null;
  marketAccess: MarketAccess | null;
  isOpen: boolean;
  onCloseAction: () => void;
  onEnrollAction?: (programId: string, offerId: string) => Promise<{ success: boolean; officialUrl?: string; error?: string }>;
  officialUrl?: string;
};

// Close Icon
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

export function ProgramDrawer({
  program,
  offers,
  rulesets,
  payoutTerms,
  marketAccess,
  isOpen,
  onCloseAction,
  onEnrollAction,
  officialUrl = 'https://ftmo.com',
}: ProgramDrawerProps) {
  const t = useTranslations('Challenges') as any;

  // Body scroll lock
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

  if (!program) {
    return null;
  }

  const isFree = program.category === 'free_competition';
  const phase1Rules = rulesets.find(r => r.phase_number === 1);

  // Offer selection
  const defaultOffer = useMemo(
    () =>
      offers.find(o => o.is_featured) ||
      [...offers].sort((a, b) => (a.entry_fee || 0) - (b.entry_fee || 0))[0] ||
      offers[0],
    [offers],
  );

  const [selectedOfferId, setSelectedOfferId] = useState(defaultOffer?.id || '');
  const selectedOffer = useMemo(
    () => offers.find(o => o.id === selectedOfferId) || defaultOffer,
    [offers, selectedOfferId, defaultOffer],
  );

  // Format size
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseAction}
            className="fixed inset-0 z-50 bg-black/50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex size-full flex-col overflow-hidden bg-background shadow-xl sm:w-[560px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* Header */}
            <header className="border-b border-border/50 bg-background px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {/* Badge */}
                  <div className="mb-2">
                    {isFree ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400">
                        {t('badges.free')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
                        {t('badges.paid')}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 id="drawer-title" className="text-xl font-bold leading-tight">
                    {program.name}
                  </h2>

                  {/* Organizer */}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {program.organizer_name}
                  </p>

                  {/* Offer Selector (se >1) */}
                  {offers.length > 1 && (
                    <div className="mt-4">
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        {t('drawer.selectAccountSize')}
                      </label>
                      <select
                        value={selectedOfferId}
                        onChange={(e) => setSelectedOfferId(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      >
                        {offers.map((offer) => (
                          <option key={offer.id} value={offer.id}>
                            {formatSize(offer.account_size, offer.account_currency)} @ {formatFee(offer)}
                            {offer.refundable && ' (Refundable)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={onCloseAction}
                  className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={t('a11y.closeDrawer')}
                  type="button"
                >
                  <CloseIcon />
                </button>
              </div>
            </header>

            {/* Content - 3 sezioni max */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 p-5 pb-24">
                {/* SEZIONE 1: Regole Chiave */}
                {phase1Rules && (
                  <section>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('drawer.keyRules')}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {phase1Rules.profit_target_pct && (
                        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                          <div className="text-xs text-muted-foreground">{t('drawer.profitTarget')}</div>
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {phase1Rules.profit_target_pct}%
                          </div>
                        </div>
                      )}
                      {phase1Rules.max_drawdown_pct && (
                        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                          <div className="text-xs text-muted-foreground">{t('drawer.maxDrawdown')}</div>
                          <div className="text-lg font-bold text-red-600 dark:text-red-400">
                            {phase1Rules.max_drawdown_pct}%
                          </div>
                        </div>
                      )}
                      {phase1Rules.max_daily_loss_pct && (
                        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                          <div className="text-xs text-muted-foreground">{t('drawer.maxDailyLoss')}</div>
                          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                            {phase1Rules.max_daily_loss_pct}%
                          </div>
                        </div>
                      )}
                      {phase1Rules.min_trading_days && (
                        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                          <div className="text-xs text-muted-foreground">{t('drawer.minTradingDays')}</div>
                          <div className="text-lg font-bold">
                            {phase1Rules.min_trading_days}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* SEZIONE 2: Tabella Offerte (se >1) */}
                {offers.length > 1 && (
                  <section>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('drawer.allOffers')}
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-border/50">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">{t('drawer.accountSize')}</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">{t('drawer.fee')}</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {offers.map((offer) => (
                            <tr
                              key={offer.id}
                              className={cn(
                                'cursor-pointer transition-colors hover:bg-muted/30',
                                offer.id === selectedOfferId && 'bg-primary/5',
                              )}
                              onClick={() => setSelectedOfferId(offer.id)}
                            >
                              <td className="px-3 py-2.5 font-medium">
                                {formatSize(offer.account_size, offer.account_currency)}
                              </td>
                              <td className="px-3 py-2.5">
                                <span className={cn(
                                  offer.entry_fee === 0 && 'text-green-600 dark:text-green-400 font-medium',
                                )}>
                                  {formatFee(offer)}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 text-right">
                                {offer.id === selectedOfferId ? (
                                  <span className="text-xs font-medium text-primary">{t('drawer.selected')}</span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">{t('drawer.select')}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* SEZIONE 3: Mercati e Payout */}
                <section>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('drawer.marketsAndPayout')}
                  </h3>
                  <div className="space-y-3">
                    {/* Piattaforme */}
                    {marketAccess?.platforms && marketAccess.platforms.length > 0 && (
                      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">{t('drawer.platforms')}</span>
                        <span className="text-sm font-medium">{marketAccess.platforms.join(', ')}</span>
                      </div>
                    )}

                    {/* Leverage */}
                    {marketAccess?.leverage_forex && (
                      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">{t('drawer.leverage')}</span>
                        <span className="text-sm font-medium">{marketAccess.leverage_forex}</span>
                      </div>
                    )}

                    {/* Profit Split */}
                    {payoutTerms && (
                      <div className="flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">{t('drawer.profitSplit')}</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {payoutTerms.profit_split_max}%
                        </span>
                      </div>
                    )}

                    {/* Payout Frequency */}
                    {payoutTerms?.payout_frequency && (
                      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">{t('drawer.payoutFrequency')}</span>
                        <span className="text-sm font-medium capitalize">{payoutTerms.payout_frequency}</span>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>

            {/* Footer - Sticky CTA */}
            <footer className="sticky bottom-0 border-t border-border/50 bg-background px-5 py-4">
              <div className="flex gap-3">
                {onEnrollAction && selectedOffer && (
                  <button
                    onClick={async () => {
                      const result = await onEnrollAction(program.id, selectedOffer.id);
                      if (result.success && result.officialUrl) {
                        window.open(result.officialUrl, '_blank');
                      }
                    }}
                    className={cn(
                      'flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all',
                      isFree
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90',
                    )}
                    type="button"
                  >
                    {isFree ? t('drawer.joinChallenge') : t('drawer.startChallenge')}
                  </button>
                )}

                <button
                  onClick={onCloseAction}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                  type="button"
                >
                  {t('drawer.close')}
                </button>
              </div>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
