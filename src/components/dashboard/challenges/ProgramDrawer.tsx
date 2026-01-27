'use client';

/**
 * PROGRAM DRAWER - Challenge Library 2026 (Tier-1 Compliant)
 *
 * Architecture: Modular single-scroll drawer
 *
 * Best Practices 2026:
 * - Single Responsibility: Each section is a separate component
 * - Progressive Disclosure: Most important info first
 * - NO TABS: Single scroll eliminates cognitive load
 * - Emoji section headers for visual scanning
 * - Trust signals integrated throughout
 *
 * Research Sources:
 * - Vaul (Emil Kowalski): Drawer patterns
 * - Nielsen Norman Group: Progressive disclosure
 * - Material Design 3: Content hierarchy
 * - shadcn/ui: Component architecture
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollToFocus } from '@/hooks/useScrollToFocus';

import {
  AboutSection,
  KeyMetricsSection,
  MarketsSection,
  PayoutSection,
  PermissionsSection,
  RiskRulesSection,
  TrustSection,
} from './drawer-sections';
import { ExternalLinkIcon, StarIcon, TrendingUpIcon } from './PremiumIcons';

// Close Icon
const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Types
type Offer = {
  id: string;
  offer_name: string;
  account_size: number;
  account_currency: string;
  entry_fee: number | null;
  fee_currency: string | null;
  refundable: boolean;
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
  daily_loss_reset_time?: string | null;
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
  onClose: () => void;
  onEnroll?: (programId: string) => void;
};

export function ProgramDrawer({
  program,
  offers,
  rulesets,
  payoutTerms,
  marketAccess,
  isOpen,
  onClose,
  onEnroll,
}: ProgramDrawerProps) {
  const t = useTranslations('Challenges') as any;

  // Focus trap for accessibility
  const drawerRef = useFocusTrap({
    isActive: isOpen,
    onEscape: onClose,
    restoreFocus: true,
  });

  // Scroll to focus for keyboard navigation
  const scrollContainerRef = useScrollToFocus({
    enabled: isOpen,
    behavior: 'smooth',
    block: 'nearest',
    offset: 80, // Account for fixed header
  });

  // Mock trust signals (TODO: Get from database)
  const trustSignals = {
    rating: 4.8,
    successRate: 68,
    traderCount: 2341,
    totalPaid: 12.5,
    founded: 2015,
  };

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
  const firstOffer = offers[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.aside
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex size-full flex-col overflow-hidden bg-background shadow-2xl sm:w-[640px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            aria-describedby="drawer-description"
          >
            {/* Header - Fixed */}
            <header className="glass-panel sticky top-0 z-10 border-b border-border/50 backdrop-blur-xl">
              <div className="flex items-start gap-4 p-6">
                <div className="min-w-0 flex-1">
                  {/* Badges & Trust Signals */}
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {isFree ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-green-500/30">
                        <span className="size-1.5 animate-pulse rounded-full bg-white" />
                        {t('badges.freeCompetition')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-600 backdrop-blur-sm dark:text-blue-400">
                        {t('badges.propFirm')}
                      </span>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1">
                      <StarIcon size={14} className="text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {trustSignals.rating}
                      </span>
                    </div>

                    {/* Success Rate */}
                    <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1">
                      <TrendingUpIcon size={14} className="text-green-600 dark:text-green-400" />
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">
                        {trustSignals.successRate}
                        %
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2
                    id="drawer-title"
                    className="mb-2 text-2xl font-bold leading-tight tracking-tight"
                  >
                    {program.name}
                  </h2>

                  {/* Organizer & Traders */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{program.organizer_name}</span>
                    <span>•</span>
                    <span>
                      {trustSignals.traderCount.toLocaleString()}
                      {' '}
                      {t('drawer.activeTraders')}
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="shrink-0 rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                  aria-label={t('a11y.closeDrawer')}
                  type="button"
                >
                  <CloseIcon />
                </button>
              </div>
            </header>

            {/* Content - Single Scroll with Modular Sections */}
            <div
              ref={scrollContainerRef as React.RefObject<HTMLDivElement>}
              className="flex-1 overflow-y-auto"
            >
              <div className="space-y-8 p-6">
                {/* 📊 KEY METRICS */}
                {firstOffer && (
                  <KeyMetricsSection offer={firstOffer} payoutTerms={payoutTerms} />
                )}

                {/* ⚠️ RISK RULES */}
                <RiskRulesSection rulesets={rulesets} />

                {/* 💰 PAYOUT DETAILS */}
                <PayoutSection payoutTerms={payoutTerms} />

                {/* 🔐 TRADING PERMISSIONS */}
                <PermissionsSection phase1Rules={phase1Rules} />

                {/* 📊 MARKETS & PLATFORMS */}
                <MarketsSection marketAccess={marketAccess} />

                {/* 🎯 ABOUT THIS CHALLENGE */}
                <AboutSection program={program} />

                {/* 🏢 ABOUT FIRM (Trust Signals) */}
                <TrustSection
                  trustSignals={trustSignals}
                  organizerName={program.organizer_name}
                />
              </div>
            </div>

            {/* Footer - Fixed Actions */}
            <footer className="glass-panel sticky bottom-0 border-t border-border/50 p-6 backdrop-blur-xl">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold transition-all hover:bg-muted"
                  type="button"
                >
                  {t('drawer.close')}
                </button>
                {onEnroll && (
                  <button
                    onClick={() => onEnroll(program.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                    type="button"
                  >
                    {isFree ? t('drawer.joinCompetition') : t('drawer.startChallenge')}
                    <ExternalLinkIcon size={16} />
                  </button>
                )}
              </div>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
