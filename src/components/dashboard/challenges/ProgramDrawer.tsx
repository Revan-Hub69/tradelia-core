'use client';

/**
 * PROGRAM DRAWER - Enterprise Premium 2026 Edition
 *
 * Design Principles (Tier 1 Research):
 * - Tradelia Color Palette: Scale di blu e grigi-celesti
 * - iOS 26 Glass Morphism: Translucency, depth, premium feel
 * - 6 sezioni strategiche per completezza e clarity
 * - Focus: OfferSelector come elemento centrale
 * - No mock data, no trust signals fake
 * - Sticky footer con CTA chiara
 * - Modular architecture with dedicated sections
 *
 * Structure Enterprise 2026:
 * 1. Header: Glass header con nome, badge, organizer
 * 2. Account Size Selection: Tabella offerte interattiva
 * 3. About: Descrizione, pros/cons, best for
 * 4. Risk Rules: Regole complete di trading
 * 5. Markets: Piattaforme, leverage, commissioni
 * 6. Payout: Profit split, frequenza, metodi
 * 7. Permissions: EA, news trading, weekend holding
 * 8. Footer: Glass footer con CTA primaria
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { useNavigationContext } from '@/components/navigation/useNavigationContext';
import { cn } from '@/utils/Helpers';

// Import modular sections
import { AboutSection } from './drawer-sections/AboutSection';
import { GuideSection } from './drawer-sections/GuideSection';
import { MarketsSection } from './drawer-sections/MarketsSection';
import { PayoutSection } from './drawer-sections/PayoutSection';
import { PermissionsSection } from './drawer-sections/PermissionsSection';
import { RiskRulesSection } from './drawer-sections/RiskRulesSection';

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
  consistency_required?: boolean;
  best_day_max_pct?: number | null;
  ea_allowed?: boolean;
  news_trading?: boolean;
  weekend_holding?: boolean;
  max_position_size?: number | null;
  max_open_positions?: number | null;
};

type PayoutTerms = {
  profit_split_initial: number;
  profit_split_scaled?: number | null;
  profit_split_max: number;
  payout_frequency: string;
  first_payout_delay_days: number;
  eligible_after_phase: number;
  withdrawal_methods?: string[];
  min_withdrawal?: number | null;
  payout_processing_time_hours?: number | null;
};

type MarketAccess = {
  markets_available: string[];
  platforms: string[];
  instruments_count?: number | null;
  leverage_forex?: string | null;
  leverage_indices?: string | null;
  leverage_commodities?: string | null;
  leverage_crypto?: string | null;
  commission_forex?: number | null;
  commission_indices?: number | null;
  trading_hours?: string | null;
};

type Program = {
  id: string;
  name: string;
  organizer_name: string;
  category: 'free_competition' | 'paid_evaluation';
  ruleset_mode?: 'target_based' | 'ranking_based';
  description?: string | null;
  best_for?: string | null;
  pros?: string[];
  cons?: string[];
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

// Tradelia Close Icon
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

// Format size helper
const formatSize = (size: number, currency: string) => {
  if (size >= 1000) {
    return `${currency}${(size / 1000).toFixed(0)}K`;
  }
  return `${currency}${size.toLocaleString()}`;
};

// Format fee helper
const formatFee = (offer: Offer, t: any) => {
  if (offer.entry_fee === null || offer.entry_fee === 0) {
    return t('card.free');
  }
  return `${offer.fee_currency}${offer.entry_fee}`;
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

  // Get navigation context to notify when drawer is open
  const { setOverlayOpen } = useNavigationContext();

  // Notify navigation context when drawer opens/closes
  useEffect(() => {
    setOverlayOpen(isOpen);
    return () => {
      setOverlayOpen(false);
    };
  }, [isOpen, setOverlayOpen]);

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

  // Offer selection - moved before early return to follow rules of hooks
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

  if (!program) {
    return null;
  }

  const isFree = program.category === 'free_competition';
  const phase1Rules = rulesets.find(r => r.phase_number === 1);

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
          {/* Backdrop - Tradelia blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseAction}
            className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm"
          />

          {/* Drawer - Tradelia Glass */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex size-full flex-col overflow-hidden sm:w-[520px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* Tradelia Glass Background */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl dark:bg-slate-950/95" />

            {/* Tradelia Hairline Border */}
            <div className="absolute inset-y-0 left-0 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Header - Enterprise Premium Glass */}
            <header className="relative border-b border-slate-200 bg-white/60 px-6 py-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {/* Badge + Organizer Row */}
                  <div className="mb-2 flex items-center gap-2">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
                      isFree
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
                    )}
                    >
                      {isFree ? t('badges.free') : t('badges.paid')}
                    </span>
                    <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                      {program.organizer_name}
                    </span>
                  </div>

                  {/* Title - Enterprise Typography */}
                  <h2 id="drawer-title" className="text-[21px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                    {program.name}
                  </h2>

                  {/* Selected Offer Summary */}
                  {selectedOffer && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                        <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                          {formatSize(selectedOffer.account_size, selectedOffer.account_currency)}
                        </span>
                      </div>
                      <div className={cn(
                        'flex items-center gap-1.5 rounded-lg px-3 py-1.5',
                        selectedOffer.entry_fee === 0
                          ? 'bg-sky-50 dark:bg-sky-950/30'
                          : 'bg-slate-100 dark:bg-slate-800',
                      )}
                      >
                        <span className={cn(
                          'text-[13px] font-medium',
                          selectedOffer.entry_fee === 0
                            ? 'text-sky-700 dark:text-sky-300'
                            : 'text-slate-700 dark:text-slate-300',
                        )}
                        >
                          {formatFee(selectedOffer, t)}
                        </span>
                      </div>
                      {selectedOffer.refundable && (
                        <span className="text-[11px] font-medium text-green-600 dark:text-green-400">
                          {t('drawer.refundable')}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Close Button - Premium Glass */}
                <button
                  onClick={onCloseAction}
                  className={cn(
                    'shrink-0 rounded-full p-2.5',
                    'bg-slate-100 text-slate-500',
                    'transition-all duration-200',
                    'hover:bg-slate-200 hover:text-slate-700 active:scale-95',
                    'dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200',
                  )}
                  aria-label={t('a11y.closeDrawer')}
                  type="button"
                >
                  <CloseIcon />
                </button>
              </div>
            </header>

            {/* Content - 6 Sezioni Enterprise */}
            <div className="relative flex-1 overflow-y-auto">
              <div className="space-y-8 p-6 pb-32">
                {/* SEZIONE 0: AI Guide - Come Funziona */}
                <GuideSection program={program} rulesets={rulesets} />

                {/* SEZIONE 1: Account Size Selection - PRIMA E CENTRALE */}
                {offers.length > 0 && (
                  <section>
                    <h3 className="mb-4 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      {t('drawer.selectAccountSize')}
                    </h3>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                      <table className="w-full text-[14px]">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('drawer.accountSize')}</th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('drawer.fee')}</th>
                            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {offers.map(offer => (
                            <tr
                              key={offer.id}
                              className={cn(
                                'cursor-pointer transition-all duration-200',
                                'hover:bg-slate-50 dark:hover:bg-slate-800/50',
                                offer.id === selectedOfferId && 'bg-blue-50/60 dark:bg-blue-950/30',
                              )}
                              onClick={() => {
                                triggerHaptic();
                                setSelectedOfferId(offer.id);
                              }}
                            >
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-3">
                                  {offer.id === selectedOfferId && (
                                    <div className="flex size-5 items-center justify-center rounded-full bg-blue-600">
                                      <svg className="size-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  )}
                                  <span className={cn(
                                    'font-semibold',
                                    offer.id === selectedOfferId
                                      ? 'text-blue-700 dark:text-blue-300'
                                      : 'text-slate-900 dark:text-slate-100',
                                  )}
                                  >
                                    {formatSize(offer.account_size, offer.account_currency)}
                                  </span>
                                  {offer.is_featured && (
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                      POPULAR
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={cn(
                                  'font-medium',
                                  offer.entry_fee === 0
                                    ? 'text-sky-600 dark:text-sky-400'
                                    : 'text-slate-700 dark:text-slate-300',
                                )}
                                >
                                  {formatFee(offer, t)}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                {offer.id === selectedOfferId ? (
                                  <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400">{t('drawer.selected')}</span>
                                ) : (
                                  <span className="text-[12px] text-slate-400 dark:text-slate-500">{t('drawer.select')}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* SEZIONE 2: About - Descrizione e Pros/Cons */}
                <AboutSection program={program} />

                {/* SEZIONE 3: Risk Rules - Regole complete */}
                <RiskRulesSection rulesets={rulesets} />

                {/* SEZIONE 4: Markets - Piattaforme e condizioni */}
                <MarketsSection marketAccess={marketAccess} />

                {/* SEZIONE 5: Payout - Termini di pagamento */}
                <PayoutSection payoutTerms={payoutTerms} />

                {/* SEZIONE 6: Permissions - Permessi di trading */}
                <PermissionsSection phase1Rules={phase1Rules} />
              </div>
            </div>

            {/* Footer - Enterprise Premium Glass Sticky */}
            <footer className="relative border-t border-slate-200 bg-white/90 px-6 py-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
              <div className="flex gap-3">
                {onEnrollAction && selectedOffer && (
                  <motion.button
                    onClick={handleEnroll}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'flex-1 rounded-xl px-5 py-3.5 text-[15px] font-bold',
                      'transition-all duration-200',
                      'shadow-lg',
                      isFree
                        ? 'bg-sky-600 text-white shadow-sky-500/30 hover:bg-sky-700 hover:shadow-sky-500/40'
                        : 'bg-blue-600 text-white shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40',
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
                    'rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-[15px] font-semibold text-slate-700',
                    'transition-all duration-200',
                    'hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
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
