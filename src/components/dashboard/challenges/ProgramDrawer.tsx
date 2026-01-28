'use client';

/**
 * PROGRAM DRAWER - iOS Glass 2026 Edition
 *
 * Design Principles (Tier 1 Research):
 * - iOS 26 Glass Morphism: Translucency, depth, premium feel
 * - Constraint: 3 sezioni max per clarity
 * - Focus: OfferSelector come elemento centrale
 * - No mock data, no trust signals fake
 * - Sticky footer con CTA chiara
 *
 * Structure:
 * 1. Header: Glass header con nome e badge
 * 2. Body: 3 sezioni (Key Rules, Offers, Markets)
 * 3. Footer: Glass footer con CTA primaria
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

// iOS 26 Close Icon
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

// Haptic feedback
const triggerHaptic = (type: 'light' | 'medium' = 'light') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    const patterns = { light: [10], medium: [20] };
    navigator.vibrate(patterns[type]);
  }
};

export function ProgramDrawer({
  program,
  offers,
  rulesets,
  payoutTerms,
  marketAccess,
  isOpen,
  onCloseAction,
  onEnrollAction,
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

  const handleEnroll = async () => {
    triggerHaptic('medium');
    if (onEnrollAction && selectedOffer) {
      const result = await onEnrollAction(program.id, selectedOffer.id);
      if (result.success && result.officialUrl) {
        window.open(result.officialUrl, '_blank');
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - iOS 26 blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseAction}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer - iOS 26 Glass */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex size-full flex-col overflow-hidden sm:w-[480px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* iOS 26 Glass Background */}
            <div className="absolute inset-0 bg-white/90 dark:bg-black/90 backdrop-blur-2xl" />
            
            {/* iOS 26 Hairline Border */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-black/5 dark:bg-white/10" />

            {/* Header - iOS 26 Glass */}
            <header className="relative border-b border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-xl px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {/* iOS 26 Pill Badge */}
                  <div className="mb-2">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
                      isFree 
                        ? 'bg-green-500/15 text-green-700 dark:text-green-400'
                        : 'bg-blue-500/15 text-blue-700 dark:text-blue-400'
                    )}>
                      {isFree ? t('badges.free') : t('badges.paid')}
                    </span>
                  </div>

                  {/* Title - iOS 26 Typography */}
                  <h2 id="drawer-title" className="text-[19px] font-semibold leading-tight tracking-tight">
                    {program.name}
                  </h2>

                  {/* Organizer */}
                  <p className="mt-1 text-[13px] text-muted-foreground/80">
                    {program.organizer_name}
                  </p>

                  {/* Offer Selector - iOS 26 Style */}
                  {offers.length > 1 && (
                    <div className="mt-4">
                      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
                        {t('drawer.selectAccountSize')}
                      </label>
                      <select
                        value={selectedOfferId}
                        onChange={(e) => {
                          triggerHaptic();
                          setSelectedOfferId(e.target.value);
                        }}
                        className={cn(
                          'w-full rounded-xl border border-black/10 dark:border-white/10',
                          'bg-white/80 dark:bg-white/5',
                          'backdrop-blur-sm',
                          'px-3 py-2.5 text-[14px]',
                          'focus:outline-none focus:ring-2 focus:ring-primary/20',
                          'appearance-none'
                        )}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 12px center',
                        }}
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

                {/* Close Button - iOS 26 Glass */}
                <button
                  onClick={onCloseAction}
                  className={cn(
                    'shrink-0 rounded-full p-2',
                    'bg-black/5 dark:bg-white/10',
                    'text-muted-foreground',
                    'transition-all duration-200',
                    'hover:bg-black/10 dark:hover:bg-white/15',
                    'active:scale-95'
                  )}
                  aria-label={t('a11y.closeDrawer')}
                  type="button"
                >
                  <CloseIcon />
                </button>
              </div>
            </header>

            {/* Content - 3 sezioni max */}
            <div className="relative flex-1 overflow-y-auto">
              <div className="space-y-6 p-5 pb-28">
                {/* SEZIONE 1: Regole Chiave - iOS 16 Grid */}
                {phase1Rules && (
                  <section>
                    <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                      {t('drawer.keyRules')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {phase1Rules.profit_target_pct && (
                        <div className={cn(
                          'flex flex-col rounded-xl px-3 py-3',
                          'bg-green-500/10 dark:bg-green-500/15',
                          'backdrop-blur-sm'
                        )}>
                          <span className="text-[10px] font-medium uppercase tracking-wide text-green-700/70 dark:text-green-400/70">
                            {t('drawer.profitTarget')}
                          </span>
                          <span className="text-[17px] font-bold text-green-700 dark:text-green-400">
                            {phase1Rules.profit_target_pct}%
                          </span>
                        </div>
                      )}
                      {phase1Rules.max_drawdown_pct && (
                        <div className={cn(
                          'flex flex-col rounded-xl px-3 py-3',
                          'bg-red-500/10 dark:bg-red-500/15',
                          'backdrop-blur-sm'
                        )}>
                          <span className="text-[10px] font-medium uppercase tracking-wide text-red-700/70 dark:text-red-400/70">
                            {t('drawer.maxDrawdown')}
                          </span>
                          <span className="text-[17px] font-bold text-red-700 dark:text-red-400">
                            {phase1Rules.max_drawdown_pct}%
                          </span>
                        </div>
                      )}
                      {phase1Rules.max_daily_loss_pct && (
                        <div className={cn(
                          'flex flex-col rounded-xl px-3 py-3',
                          'bg-orange-500/10 dark:bg-orange-500/15',
                          'backdrop-blur-sm'
                        )}>
                          <span className="text-[10px] font-medium uppercase tracking-wide text-orange-700/70 dark:text-orange-400/70">
                            {t('drawer.maxDailyLoss')}
                          </span>
                          <span className="text-[17px] font-bold text-orange-700 dark:text-orange-400">
                            {phase1Rules.max_daily_loss_pct}%
                          </span>
                        </div>
                      )}
                      {phase1Rules.min_trading_days && (
                        <div className={cn(
                          'flex flex-col rounded-xl px-3 py-3',
                          'bg-black/[0.03] dark:bg-white/[0.06]',
                          'backdrop-blur-sm'
                        )}>
                          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
                            {t('drawer.minTradingDays')}
                          </span>
                          <span className="text-[17px] font-bold">
                            {phase1Rules.min_trading_days}
                          </span>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* SEZIONE 2: Tabella Offerte - iOS 26 Style */}
                {offers.length > 1 && (
                  <section>
                    <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                      {t('drawer.allOffers')}
                    </h3>
                    <div className="overflow-hidden rounded-xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm">
                      <table className="w-full text-[13px]">
                        <thead className="bg-black/[0.03] dark:bg-white/[0.05]">
                          <tr>
                            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">{t('drawer.accountSize')}</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">{t('drawer.fee')}</th>
                            <th className="px-3 py-2 text-right text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                          {offers.map((offer) => (
                            <tr
                              key={offer.id}
                              className={cn(
                                'cursor-pointer transition-colors',
                                'hover:bg-black/[0.02] dark:hover:bg-white/[0.03]',
                                offer.id === selectedOfferId && 'bg-primary/5'
                              )}
                              onClick={() => {
                                triggerHaptic();
                                setSelectedOfferId(offer.id);
                              }}
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
                                  <span className="text-[11px] font-medium text-primary">{t('drawer.selected')}</span>
                                ) : (
                                  <span className="text-[11px] text-muted-foreground/60">{t('drawer.select')}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* SEZIONE 3: Mercati e Payout - iOS 26 List */}
                <section>
                  <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                    {t('drawer.marketsAndPayout')}
                  </h3>
                  <div className="space-y-2">
                    {/* Piattaforme */}
                    {marketAccess?.platforms && marketAccess.platforms.length > 0 && (
                      <div className={cn(
                        'flex items-center justify-between rounded-xl px-3 py-2.5',
                        'bg-black/[0.03] dark:bg-white/[0.06]',
                        'backdrop-blur-sm'
                      )}>
                        <span className="text-[13px] text-muted-foreground/80">{t('drawer.platforms')}</span>
                        <span className="text-[13px] font-medium">{marketAccess.platforms.join(', ')}</span>
                      </div>
                    )}

                    {/* Leverage */}
                    {marketAccess?.leverage_forex && (
                      <div className={cn(
                        'flex items-center justify-between rounded-xl px-3 py-2.5',
                        'bg-black/[0.03] dark:bg-white/[0.06]',
                        'backdrop-blur-sm'
                      )}>
                        <span className="text-[13px] text-muted-foreground/80">{t('drawer.leverage')}</span>
                        <span className="text-[13px] font-medium">{marketAccess.leverage_forex}</span>
                      </div>
                    )}

                    {/* Profit Split - Highlighted */}
                    {payoutTerms && (
                      <div className={cn(
                        'flex items-center justify-between rounded-xl px-3 py-2.5',
                        'bg-green-500/10 dark:bg-green-500/15',
                        'backdrop-blur-sm'
                      )}>
                        <span className="text-[13px] text-green-700/80 dark:text-green-400/80">{t('drawer.profitSplit')}</span>
                        <span className="text-[15px] font-bold text-green-700 dark:text-green-400">
                          {payoutTerms.profit_split_max}%
                        </span>
                      </div>
                    )}

                    {/* Payout Frequency */}
                    {payoutTerms?.payout_frequency && (
                      <div className={cn(
                        'flex items-center justify-between rounded-xl px-3 py-2.5',
                        'bg-black/[0.03] dark:bg-white/[0.06]',
                        'backdrop-blur-sm'
                      )}>
                        <span className="text-[13px] text-muted-foreground/80">{t('drawer.payoutFrequency')}</span>
                        <span className="text-[13px] font-medium capitalize">{payoutTerms.payout_frequency}</span>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>

            {/* Footer - iOS 26 Glass Sticky */}
            <footer className="relative border-t border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl px-5 py-4">
              <div className="flex gap-3">
                {onEnrollAction && selectedOffer && (
                  <motion.button
                    onClick={handleEnroll}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'flex-1 rounded-xl px-4 py-3 text-[14px] font-semibold',
                      'transition-all duration-200',
                      isFree
                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-[0_2px_8px_-2px_rgba(34,197,94,0.4)]'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.2)]'
                    )}
                    type="button"
                  >
                    {isFree ? t('drawer.joinChallenge') : t('drawer.startChallenge')}
                  </motion.button>
                )}

                <motion.button
                  onClick={onCloseAction}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'rounded-xl border border-black/10 dark:border-white/10',
                    'bg-white/50 dark:bg-white/5',
                    'px-4 py-3 text-[14px] font-semibold',
                    'transition-all duration-200',
                    'hover:bg-black/5 dark:hover:bg-white/10'
                  )}
                  type="button"
                >
                  {t('drawer.close')}
                </motion.button>
              </div>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
