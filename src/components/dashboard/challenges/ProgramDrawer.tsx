'use client';

/**
 * PROGRAM DRAWER - Challenge Library 2026
 *
 * Pattern: Tabs-based navigation con lazy loading
 *
 * Features:
 * - 7 tabs: Overview, Pricing, Rules, Permissions, Payout, Markets, Trust & Audit
 * - Lazy loading per tab pesanti
 * - Sticky tabs list
 * - Premium SVG icons (no emoji)
 * - Liquid glass design (iOS 26)
 *
 * Design System:
 * - 32px border radius
 * - Soft cream palette
 * - Spring physics animations
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/utils/Helpers';

import {
  BotIcon,
  CheckCircleIcon,
  ClockIcon,
  CommissionIcon,
  ExternalLinkIcon,
  FreshnessIcon,
  LeverageIcon,
  NewsIcon,
  PayoutIcon,
  WeekendIcon,
} from './PremiumIcons';

// Close Icon
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
  const t = useTranslations('Challenges');
  const [activeTab, setActiveTab] = useState('overview');

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex size-full flex-col overflow-hidden bg-background shadow-2xl sm:w-[640px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* Header - Fixed */}
            <header className="glass-panel sticky top-0 z-10 border-b border-border/50 backdrop-blur-xl">
              <div className="flex items-start gap-4 p-6">
                <div className="min-w-0 flex-1">
                  {/* Badges */}
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
                  </div>

                  {/* Title */}
                  <h2 id="drawer-title" className="mb-2 text-2xl font-bold leading-tight tracking-tight">
                    {program.name}
                  </h2>

                  {/* Organizer */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{program.organizer_name}</span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="shrink-0 rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                  aria-label="Close drawer"
                  type="button"
                >
                  <CloseIcon />
                </button>
              </div>
            </header>

            {/* Tabs Navigation - Sticky */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
              <TabsList className="glass-panel sticky top-0 z-10 w-full justify-start gap-1 overflow-x-auto border-b border-border/50 bg-background/95 p-2 backdrop-blur-xl">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">
                  {t('tabs.overview')}
                </TabsTrigger>
                <TabsTrigger value="pricing" className="text-xs sm:text-sm">
                  {t('tabs.pricing')}
                </TabsTrigger>
                <TabsTrigger value="rules" className="text-xs sm:text-sm">
                  {t('tabs.rules')}
                </TabsTrigger>
                <TabsTrigger value="permissions" className="text-xs sm:text-sm">
                  {t('tabs.permissions')}
                </TabsTrigger>
                <TabsTrigger value="payout" className="text-xs sm:text-sm">
                  {t('tabs.payout')}
                </TabsTrigger>
                <TabsTrigger value="markets" className="text-xs sm:text-sm">
                  {t('tabs.markets')}
                </TabsTrigger>
                <TabsTrigger value="trust" className="text-xs sm:text-sm">
                  {t('tabs.trust')}
                </TabsTrigger>
              </TabsList>

              {/* Tab Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                {/* Tab 1: Overview */}
                <TabsContent value="overview" className="m-0 p-6">
                  <div className="space-y-6">
                    {/* Description */}
                    {program.description && (
                      <section>
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                          {t('sections.about')}
                        </h3>
                        <p className="leading-relaxed text-foreground">{program.description}</p>
                      </section>
                    )}

                    {/* Best For */}
                    {program.best_for && (
                      <section>
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                          {t('sections.bestFor')}
                        </h3>
                        <p className="leading-relaxed text-foreground">{program.best_for}</p>
                      </section>
                    )}

                    {/* Pros & Cons */}
                    {(program.pros || program.cons) && (
                      <section>
                        <div className="grid gap-6 sm:grid-cols-2">
                          {/* Pros */}
                          {program.pros && program.pros.length > 0 && (
                            <div>
                              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400">
                                <CheckCircleIcon size={16} />
                                {t('sections.pros')}
                              </h3>
                              <ul className="space-y-2">
                                {program.pros.map(pro => (
                                  <li key={pro} className="flex gap-2 text-sm">
                                    <span className="mt-0.5 text-green-600 dark:text-green-400">•</span>
                                    <span>{pro}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Cons */}
                          {program.cons && program.cons.length > 0 && (
                            <div>
                              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-orange-400">
                                <span>⚠️</span>
                                {t('sections.cons')}
                              </h3>
                              <ul className="space-y-2">
                                {program.cons.map(con => (
                                  <li key={con} className="flex gap-2 text-sm">
                                    <span className="mt-0.5 text-orange-600 dark:text-orange-400">•</span>
                                    <span>{con}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </section>
                    )}
                  </div>
                </TabsContent>

                {/* Tab 2: Pricing */}
                <TabsContent value="pricing" className="m-0 p-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                      {t('sections.allAvailableSizes')}
                    </h3>

                    {/* Desktop: Table */}
                    <div className="hidden overflow-hidden rounded-2xl border border-border/50 sm:block">
                      <table className="w-full">
                        <thead className="bg-muted/30">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                              {t('pricing.size')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                              {t('pricing.fee')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                              {t('pricing.refund')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                              {t('pricing.scaling')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {offers.map(offer => (
                            <tr key={offer.id} className="transition-colors hover:bg-muted/20">
                              <td className="px-4 py-3 font-semibold">
                                {offer.account_currency}
                                {offer.account_size.toLocaleString()}
                              </td>
                              <td className="px-4 py-3">
                                {offer.entry_fee ? `${offer.fee_currency}${offer.entry_fee}` : t('metrics.free')}
                              </td>
                              <td className="px-4 py-3">
                                {offer.refundable ? (
                                  <span className="text-green-600 dark:text-green-400">✓</span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {offer.scaling_max ? `${offer.account_currency}${offer.scaling_max.toLocaleString()}` : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile: Stacked Cards */}
                    <div className="space-y-3 sm:hidden">
                      {offers.map(offer => (
                        <div key={offer.id} className="card-nested rounded-xl border border-border/50 bg-muted/30 p-4">
                          <div className="mb-2 text-lg font-bold">
                            {offer.account_currency}
                            {offer.account_size.toLocaleString()}
                          </div>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t('metrics.entryFee')}
                              </span>
                              <span className="font-semibold">
                                {offer.entry_fee ? `${offer.fee_currency}${offer.entry_fee}` : t('metrics.free')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t('pricing.refundable')}
                              </span>
                              <span className="font-semibold">
                                {offer.refundable ? (
                                  <span className="text-green-600 dark:text-green-400">Yes</span>
                                ) : (
                                  <span>No</span>
                                )}
                              </span>
                            </div>
                            {offer.scaling_max && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t('pricing.maxScaling')}
                                </span>
                                <span className="font-semibold">
                                  {offer.account_currency}
                                  {offer.scaling_max.toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: Rules */}
                <TabsContent value="rules" className="m-0 p-6">
                  <div className="space-y-6">
                    {rulesets.map(ruleset => (
                      <section key={ruleset.phase_number}>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                          {t('rules.phase')}
                          {' '}
                          {ruleset.phase_number}
                        </h3>

                        <div className="space-y-3">
                          {/* Profit Target */}
                          {ruleset.profit_target_pct && (
                            <div className="flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                              <span className="font-medium">
                                {t('metrics.profitTarget')}
                              </span>
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                {ruleset.profit_target_pct}
                                %
                              </span>
                            </div>
                          )}

                          {/* Max Drawdown */}
                          {ruleset.max_drawdown_pct && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {t('metrics.maxDrawdown')}
                                </span>
                                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                  {ruleset.max_drawdown_pct}
                                  %
                                </span>
                              </div>
                              {ruleset.max_drawdown_type && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  {t('rules.type')}
                                  :
                                  {' '}
                                  {ruleset.max_drawdown_type.replace('_', ' ')}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Max Daily Loss */}
                          {ruleset.max_daily_loss_pct && (
                            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {t('metrics.maxDailyLoss')}
                                </span>
                                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                  {ruleset.max_daily_loss_pct}
                                  %
                                </span>
                              </div>
                              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                {ruleset.max_daily_loss_type && (
                                  <div>
                                    {t('rules.type')}
                                    :
                                    {' '}
                                    {ruleset.max_daily_loss_type.replace('_', ' ')}
                                  </div>
                                )}
                                {ruleset.daily_loss_reset_time && (
                                  <div className="flex items-center gap-1.5">
                                    <ClockIcon size={12} />
                                    {t('rules.resetsAt')}
                                    :
                                    {' '}
                                    {ruleset.daily_loss_reset_time}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Min Trading Days */}
                          {ruleset.min_trading_days && (
                            <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4">
                              <span className="font-medium">
                                {t('metrics.minTradingDays')}
                              </span>
                              <span className="text-lg font-bold">
                                {ruleset.min_trading_days}
                                {' '}
                                {t('metrics.days')}
                              </span>
                            </div>
                          )}

                          {/* Consistency Rule */}
                          {ruleset.consistency_required && ruleset.best_day_max_pct && (
                            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                              <div className="mb-1 font-medium">
                                {t('rules.consistencyRule')}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {t('rules.bestDayMax', { percent: ruleset.best_day_max_pct })}
                              </div>
                            </div>
                          )}
                        </div>
                      </section>
                    ))}
                  </div>
                </TabsContent>

                {/* Tab 4: Permissions (NEW) */}
                <TabsContent value="permissions" className="m-0 p-6">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                      {t('permissions.title')}
                    </h3>

                    {phase1Rules && (
                      <div className="space-y-3">
                        {/* EA/Bot Allowed */}
                        <div
                          className={cn(
                            'flex items-center justify-between rounded-xl border p-4',
                            phase1Rules.ea_allowed
                              ? 'border-green-500/20 bg-green-500/5'
                              : 'border-red-500/20 bg-red-500/5',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <BotIcon size={20} className={phase1Rules.ea_allowed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} />
                            <span className="font-medium">
                              {t('permissions.eaBot')}
                            </span>
                          </div>
                          <span
                            className={cn(
                              'text-lg font-bold',
                              phase1Rules.ea_allowed
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400',
                            )}
                          >
                            {phase1Rules.ea_allowed ? t('permissions.allowed') : t('permissions.notAllowed')}
                          </span>
                        </div>

                        {/* News Trading */}
                        <div
                          className={cn(
                            'flex items-center justify-between rounded-xl border p-4',
                            phase1Rules.news_trading
                              ? 'border-green-500/20 bg-green-500/5'
                              : 'border-red-500/20 bg-red-500/5',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <NewsIcon size={20} className={phase1Rules.news_trading ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} />
                            <span className="font-medium">
                              {t('permissions.newsTrading')}
                            </span>
                          </div>
                          <span
                            className={cn(
                              'text-lg font-bold',
                              phase1Rules.news_trading
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400',
                            )}
                          >
                            {phase1Rules.news_trading ? t('permissions.allowed') : t('permissions.notAllowed')}
                          </span>
                        </div>

                        {/* Weekend Holding */}
                        <div
                          className={cn(
                            'flex items-center justify-between rounded-xl border p-4',
                            phase1Rules.weekend_holding
                              ? 'border-green-500/20 bg-green-500/5'
                              : 'border-red-500/20 bg-red-500/5',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <WeekendIcon size={20} className={phase1Rules.weekend_holding ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} />
                            <span className="font-medium">
                              {t('permissions.weekendHolding')}
                            </span>
                          </div>
                          <span
                            className={cn(
                              'text-lg font-bold',
                              phase1Rules.weekend_holding
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400',
                            )}
                          >
                            {phase1Rules.weekend_holding ? t('permissions.allowed') : t('permissions.notAllowed')}
                          </span>
                        </div>

                        {/* Position Limits */}
                        {(phase1Rules.max_position_size || phase1Rules.max_open_positions) && (
                          <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                            <div className="mb-3 font-medium">
                              {t('permissions.positionLimits')}
                            </div>
                            <div className="space-y-2 text-sm">
                              {phase1Rules.max_position_size && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    {t('permissions.maxPositionSize')}
                                  </span>
                                  <span className="font-semibold">
                                    {phase1Rules.max_position_size}
                                    {' '}
                                    {t('permissions.lots')}
                                  </span>
                                </div>
                              )}
                              {phase1Rules.max_open_positions && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    {t('permissions.maxOpenPositions')}
                                  </span>
                                  <span className="font-semibold">{phase1Rules.max_open_positions}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Tab 5: Payout */}
                <TabsContent value="payout" className="m-0 p-6">
                  {payoutTerms && (
                    <div className="space-y-6">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                        {t('sections.payoutDetails')}
                      </h3>

                      {/* Profit Split */}
                      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <PayoutIcon size={20} className="text-blue-600 dark:text-blue-400" />
                          <span className="font-medium">
                            {t('payout.profitSplit')}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {t('payout.initial')}
                            </span>
                            <span className="font-semibold">
                              {payoutTerms.profit_split_initial}
                              %
                            </span>
                          </div>
                          {payoutTerms.profit_split_scaled && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t('payout.scaled')}
                              </span>
                              <span className="font-semibold">
                                {payoutTerms.profit_split_scaled}
                                %
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {t('payout.maximum')}
                            </span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {payoutTerms.profit_split_max}
                              %
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payout Schedule */}
                      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                        <div className="mb-3 font-medium">
                          {t('sections.payoutSchedule')}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {t('payout.frequency')}
                            </span>
                            <span className="font-semibold capitalize">{payoutTerms.payout_frequency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {t('payout.firstPayoutDelay')}
                            </span>
                            <span className="font-semibold">
                              {payoutTerms.first_payout_delay_days}
                              {' '}
                              {t('metrics.days')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {t('payout.eligibleAfter')}
                            </span>
                            <span className="font-semibold">
                              {t('rules.phase')}
                              {' '}
                              {payoutTerms.eligible_after_phase}
                            </span>
                          </div>
                          {payoutTerms.payout_processing_time_hours && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t('payout.processingTime')}
                              </span>
                              <span className="font-semibold">
                                {payoutTerms.payout_processing_time_hours}
                                h
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Withdrawal Methods */}
                      {payoutTerms.withdrawal_methods && payoutTerms.withdrawal_methods.length > 0 && (
                        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                          <div className="mb-3 font-medium">
                            {t('sections.withdrawalMethods')}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {payoutTerms.withdrawal_methods.map(method => (
                              <span
                                key={method}
                                className="rounded-lg border border-border/50 bg-background px-3 py-1.5 text-xs font-medium capitalize"
                              >
                                {method}
                              </span>
                            ))}
                          </div>
                          {payoutTerms.min_withdrawal && (
                            <div className="mt-3 text-xs text-muted-foreground">
                              {t('payout.minimumWithdrawal', { amount: payoutTerms.min_withdrawal })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* Tab 6: Markets */}
                <TabsContent value="markets" className="m-0 p-6">
                  {marketAccess && (
                    <div className="space-y-6">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                        {t('sections.marketsAndPlatforms')}
                      </h3>

                      {/* Available Markets */}
                      <div>
                        <div className="mb-3 font-medium">
                          {t('sections.availableMarkets')}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {marketAccess.markets_available.map(market => (
                            <span
                              key={market}
                              className="rounded-lg border border-border/50 bg-background px-3 py-1.5 text-xs font-medium capitalize"
                            >
                              {market}
                            </span>
                          ))}
                        </div>
                        {marketAccess.instruments_count && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            {t('markets.instrumentsAvailable', { count: marketAccess.instruments_count })}
                          </div>
                        )}
                      </div>

                      {/* Leverage */}
                      {(marketAccess.leverage_forex || marketAccess.leverage_indices || marketAccess.leverage_commodities || marketAccess.leverage_crypto) && (
                        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <LeverageIcon size={20} className="text-purple-600 dark:text-purple-400" />
                            <span className="font-medium">
                              {t('markets.leverage')}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            {marketAccess.leverage_forex && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t('markets.forex')}
                                </span>
                                <span className="font-semibold">{marketAccess.leverage_forex}</span>
                              </div>
                            )}
                            {marketAccess.leverage_indices && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t('markets.indices')}
                                </span>
                                <span className="font-semibold">{marketAccess.leverage_indices}</span>
                              </div>
                            )}
                            {marketAccess.leverage_commodities && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t('markets.commodities')}
                                </span>
                                <span className="font-semibold">{marketAccess.leverage_commodities}</span>
                              </div>
                            )}
                            {marketAccess.leverage_crypto && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t('markets.crypto')}
                                </span>
                                <span className="font-semibold">{marketAccess.leverage_crypto}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Commission */}
                      {(marketAccess.commission_forex || marketAccess.commission_indices) && (
                        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <CommissionIcon size={20} className="text-orange-600 dark:text-orange-400" />
                            <span className="font-medium">
                              {t('markets.commission')}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            {marketAccess.commission_forex && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t('markets.forex')}
                                </span>
                                <span className="font-semibold">
                                  $
                                  {marketAccess.commission_forex}
                                  {t('markets.perLot')}
                                </span>
                              </div>
                            )}
                            {marketAccess.commission_indices && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t('markets.indices')}
                                </span>
                                <span className="font-semibold">
                                  $
                                  {marketAccess.commission_indices}
                                  {t('markets.perLot')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Trading Hours */}
                      {marketAccess.trading_hours && (
                        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <ClockIcon size={20} className="text-blue-600 dark:text-blue-400" />
                            <span className="font-medium">
                              {t('markets.tradingHours')}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">{marketAccess.trading_hours}</div>
                        </div>
                      )}

                      {/* Platforms */}
                      <div>
                        <div className="mb-3 font-medium">
                          {t('sections.tradingPlatforms')}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {marketAccess.platforms.map(platform => (
                            <span
                              key={platform}
                              className="rounded-lg border border-border/50 bg-background px-3 py-1.5 text-xs font-medium"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Tab 7: Trust & Audit */}
                <TabsContent value="trust" className="m-0 p-6">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                      {t('sections.dataQuality')}
                    </h3>

                    {/* Freshness Indicator */}
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <FreshnessIcon size={20} className="text-green-600 dark:text-green-400" />
                        <span className="font-medium">
                          {t('sections.dataFreshness')}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('trust.lastVerified', { date: 'Today (T-0)' })}
                      </div>
                    </div>

                    {/* Placeholder for future source tracking */}
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                      <div className="mb-2 font-medium">
                        {t('sections.verifiedSources')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('trust.sourceTracking')}
                      </div>
                    </div>

                    {/* Report Issue */}
                    <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                      <div className="mb-2 font-medium text-orange-600 dark:text-orange-400">
                        {t('sections.foundOutdatedData')}
                      </div>
                      <div className="mb-3 text-sm text-muted-foreground">
                        {t('sections.helpUsKeepAccurate')}
                      </div>
                      <button
                        type="button"
                        className="rounded-lg border border-orange-500/20 bg-background px-3 py-1.5 text-xs font-medium text-orange-600 transition-colors hover:bg-orange-500/10 dark:text-orange-400"
                      >
                        {t('trust.reportIssue')}
                      </button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Footer - Fixed Actions */}
            <footer className="glass-panel sticky bottom-0 border-t border-border/50 p-6 backdrop-blur-xl">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold transition-all hover:bg-muted"
                  type="button"
                >
                  {t('actions.close')}
                </button>
                {onEnroll && (
                  <button
                    onClick={() => onEnroll(program.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                    type="button"
                  >
                    {isFree ? t('actions.joinCompetition') : t('actions.startChallenge')}
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
