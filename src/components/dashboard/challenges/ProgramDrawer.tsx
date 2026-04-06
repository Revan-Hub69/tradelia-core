'use client';

/**
 * PROGRAM DRAWER - Enterprise Premium 2026 Edition
 *
 * Design Principles:
 * - Tradelia institutional palette: single accent #1B62E8, zero gradients
 * - iOS 26 Glass Morphism: Translucency, depth, premium feel
 * - No blob glows, no colored shadows, no gradient buttons
 * - Sticky footer with solid CTA
 * - HEADER SCROLL-COMPACT: Reduces on scroll
 */

import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useNavigationContext } from '@/components/navigation/useNavigationContext';
import { cn } from '@/utils/Helpers';

import { AboutSection } from './drawer-sections/AboutSection';
import { GuideSection } from './drawer-sections/GuideSection';
import { MarketsSection } from './drawer-sections/MarketsSection';
import { PayoutSection } from './drawer-sections/PayoutSection';
import { PermissionsSection } from './drawer-sections/PermissionsSection';
import { PhaseRulesSection } from './drawer-sections/PhaseRulesSection';

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
  rulesets?: Ruleset[];
  payout_terms?: PayoutTerms | null;
  market_access?: MarketAccess | null;
};

type Ruleset = {
  offer_id?: string;
  phase_number: number;
  phase_name?: string;
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
  onEnrollAction?: (programId: string, offerId: string) => Promise<{ success: boolean; error?: string }>;
};

const CloseIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className || 'size-5'}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const triggerHaptic = (type: 'light' | 'medium' = 'light') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    const patterns = { light: [10], medium: [20] };
    navigator.vibrate(patterns[type]);
  }
};

const formatSize = (size: number, currency: string) => {
  if (size >= 1000) {
    return `${currency}${(size / 1000).toFixed(0)}K`;
  }
  return `${currency}${size.toLocaleString()}`;
};

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
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll({ container: contentRef });
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.5 });

  const headerHeight = useTransform(smoothScrollY, [0, 80], [120, 64]);
  const headerPadding = useTransform(smoothScrollY, [0, 80], [20, 12]);
  const badgeOpacity = useTransform(smoothScrollY, [0, 60], [1, 0]);
  const offerSummaryOpacity = useTransform(smoothScrollY, [0, 40], [1, 0]);
  const titleScale = useTransform(smoothScrollY, [0, 80], [1, 0.95]);
  const headerBorderOpacity = useTransform(smoothScrollY, [0, 40], [0.6, 1]);

  const { setOverlayOpen } = useNavigationContext();

  useEffect(() => {
    setOverlayOpen(isOpen);
    return () => { setOverlayOpen(false); };
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

  const selectedRulesets = useMemo(() => {
    if (selectedOffer?.rulesets?.length) return selectedOffer.rulesets;
    if (selectedOffer?.id) {
      const filtered = rulesets.filter(r => r.offer_id === selectedOffer.id);
      return filtered.length ? filtered : rulesets;
    }
    return rulesets;
  }, [rulesets, selectedOffer]);

  const selectedPayoutTerms = selectedOffer?.payout_terms || payoutTerms;
  const selectedMarketAccess = selectedOffer?.market_access || marketAccess;

  if (!program) return null;

  const isFree = program.category === 'free_competition';
  const phase1Rules = selectedRulesets.find(r => r.phase_number === 1);

  const handleEnroll = async () => {
    triggerHaptic('medium');
    if (onEnrollAction && selectedOffer) {
      const result = await onEnrollAction(program.id, selectedOffer.id);
      if (result.success) {
        onCloseAction();
        router.push('/dashboard/my-challenges');
      }
    }
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
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={onCloseAction}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 400, mass: 0.8 }}
            className="fixed right-0 top-0 z-50 flex size-full flex-col overflow-hidden sm:w-[560px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-white/98 backdrop-blur-2xl dark:bg-slate-950/98" />

            {/* Left border */}
            <div className="absolute inset-y-0 left-0 w-px bg-slate-200/80 dark:bg-slate-800/80" />

            {/* Header */}
            <motion.header
              style={{ height: headerHeight, paddingTop: headerPadding, paddingBottom: headerPadding }}
              className="relative z-10 shrink-0 border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80"
            >
              <motion.div
                style={{ opacity: headerBorderOpacity }}
                className="absolute inset-x-0 bottom-0 h-px bg-slate-200/60 dark:bg-slate-800/60"
              />

              <div className="flex h-full items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <motion.div
                    style={{ opacity: badgeOpacity }}
                    className="mb-2 flex items-center gap-2"
                  >
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
                      isFree
                        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-[#EEF3FD] text-[#1B62E8] dark:bg-[#1B62E8]/15 dark:text-[#6B9FF5]',
                    )}>
                      {isFree ? t('badges.free') : t('badges.paid')}
                    </span>
                    <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">
                      {program.organizer_name}
                    </span>
                  </motion.div>

                  <motion.h2
                    id="drawer-title"
                    style={{ scale: titleScale }}
                    className="origin-left text-[21px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-100"
                  >
                    {program.name}
                  </motion.h2>

                  {selectedOffer && (
                    <motion.div
                      style={{ opacity: offerSummaryOpacity }}
                      className="mt-3 flex items-center gap-3"
                    >
                      <div className="flex items-center rounded-lg bg-slate-100/80 px-3 py-1.5 dark:bg-slate-800/80">
                        <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                          {formatSize(selectedOffer.account_size, selectedOffer.account_currency)}
                        </span>
                      </div>
                      <div className="flex items-center rounded-lg bg-slate-100/80 px-3 py-1.5 dark:bg-slate-800/80">
                        <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
                          {formatFee(selectedOffer, t)}
                        </span>
                      </div>
                      {selectedOffer.refundable && (
                        <span className="text-[11px] font-medium text-[#1E7D4F] dark:text-[#5AB585]">
                          {t('drawer.refundable')}
                        </span>
                      )}
                    </motion.div>
                  )}
                </div>

                <motion.button
                  onClick={onCloseAction}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'shrink-0 rounded-full p-2.5',
                    'bg-slate-100/80 text-slate-400',
                    'transition-all duration-200',
                    'hover:bg-slate-200/80 hover:text-slate-700',
                    'dark:bg-slate-800/80 dark:text-slate-500 dark:hover:bg-slate-700/80 dark:hover:text-slate-200',
                    'shadow-sm shadow-black/5',
                  )}
                  aria-label={t('a11y.closeDrawer')}
                  type="button"
                >
                  <CloseIcon />
                </motion.button>
              </div>
            </motion.header>

            {/* Content */}
            <div
              ref={contentRef}
              className="relative flex-1 overflow-y-auto overscroll-contain scroll-smooth"
            >
              <div className="space-y-8 p-6 pb-32">
                {/* Account Size Selection */}
                {offers.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <h3 className="mb-4 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      {t('drawer.selectAccountSize')}
                    </h3>
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-black/5 dark:border-slate-800/80 dark:bg-slate-900">
                      <table className="w-full text-[14px]">
                        <thead className="border-b border-slate-100 dark:border-slate-800">
                          <tr>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{t('drawer.accountSize')}</th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{t('drawer.fee')}</th>
                            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {offers.map((offer, index) => (
                            <motion.tr
                              key={offer.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 + index * 0.05, duration: 0.3 }}
                              className={cn(
                                'cursor-pointer transition-colors duration-150',
                                'hover:bg-slate-50 dark:hover:bg-slate-800/50',
                                offer.id === selectedOfferId && 'bg-[#EEF3FD] dark:bg-[#1B62E8]/10',
                              )}
                              onClick={() => {
                                triggerHaptic();
                                setSelectedOfferId(offer.id);
                              }}
                            >
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    'flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                    offer.id === selectedOfferId
                                      ? 'border-[#1B62E8] bg-[#1B62E8]'
                                      : 'border-slate-300 dark:border-slate-600',
                                  )}>
                                    {offer.id === selectedOfferId && (
                                      <svg className="size-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className={cn(
                                    'font-semibold',
                                    offer.id === selectedOfferId
                                      ? 'text-[#1B62E8] dark:text-[#6B9FF5]'
                                      : 'text-slate-900 dark:text-slate-100',
                                  )}>
                                    {formatSize(offer.account_size, offer.account_currency)}
                                  </span>
                                  {offer.is_featured && (
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                      Popular
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={cn(
                                  'font-medium',
                                  offer.entry_fee === 0
                                    ? 'text-[#1E7D4F] dark:text-[#5AB585]'
                                    : 'text-slate-700 dark:text-slate-300',
                                )}>
                                  {formatFee(offer, t)}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                {offer.id === selectedOfferId ? (
                                  <span className="text-[12px] font-bold text-[#1B62E8] dark:text-[#6B9FF5]">{t('drawer.selected')}</span>
                                ) : (
                                  <span className="text-[12px] text-slate-400 dark:text-slate-500">{t('drawer.select')}</span>
                                )}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.section>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <GuideSection program={program} rulesets={selectedRulesets} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <PhaseRulesSection phases={selectedRulesets} offer={selectedOffer} program={program} payoutTerms={selectedPayoutTerms} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <AboutSection program={program} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <MarketsSection marketAccess={selectedMarketAccess} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <PayoutSection payoutTerms={selectedPayoutTerms} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <PermissionsSection phase1Rules={phase1Rules} />
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <footer className="relative shrink-0 border-t border-slate-200/80 bg-white/95 px-6 py-5 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/95">
              <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-white/90 to-transparent dark:from-slate-950/90" />
              <div className="relative flex gap-3">
                {onEnrollAction && selectedOffer && (
                  <motion.button
                    onClick={handleEnroll}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'press-feedback flex-1 rounded-xl px-5 py-3.5 text-[15px] font-bold text-white',
                      'transition-colors duration-150',
                      'shadow-sm shadow-black/10',
                      isFree
                        ? 'bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white'
                        : 'bg-[#1B62E8] hover:bg-[#1550CC]',
                    )}
                    type="button"
                  >
                    {isFree ? t('drawer.joinChallenge') : t('drawer.startChallenge')}
                  </motion.button>
                )}
                <motion.button
                  onClick={onCloseAction}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-[15px] font-semibold text-slate-700',
                    'transition-colors duration-150',
                    'hover:bg-slate-50',
                    'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
                    'shadow-sm shadow-black/5',
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
