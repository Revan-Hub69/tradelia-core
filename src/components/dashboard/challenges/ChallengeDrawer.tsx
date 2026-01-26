'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import type { Challenge } from '@/types/challenge';

type ChallengeDrawerProps = {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (challenge: Challenge) => void;
};

type Tab = 'overview' | 'rules' | 'pricing';

// Custom SVG Icons
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export function ChallengeDrawer({
  challenge,
  isOpen,
  onClose,
  onEnroll,
}: ChallengeDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width
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

  // Reset tab when drawer opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
    }
  }, [isOpen]);

  if (!challenge) {
    return null;
  }

  const maxSplit =
    challenge.profit_split.maximum ||
    challenge.profit_split.scaled ||
    challenge.profit_split.initial;

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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 size-full overflow-hidden bg-background shadow-2xl sm:w-[600px]"
          >
            {/* Header - Fixed with proper spacing */}
            <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4 p-6 pb-4">
                <div className="flex-1 pr-8">
                  <div className="mb-2 flex items-center gap-2">
                    {challenge.is_free && (
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600 dark:text-green-400">
                        FREE COMPETITION
                      </span>
                    )}
                    {!challenge.is_free && (
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                        PROP FIRM
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold">{challenge.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {challenge.prop_firms.name}
                  </p>
                </div>

                {/* Close button - properly positioned */}
                <button
                  onClick={onClose}
                  className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close drawer"
                  type="button"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border px-6">
                {(['overview', 'rules', 'pricing'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 py-3 text-sm font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    type="button"
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="h-[calc(100vh-240px)] overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Description
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="text-xs text-muted-foreground">
                        Account Size
                      </div>
                      <div className="mt-1 text-2xl font-bold">
                        $
                        {challenge.account_size.toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="text-xs text-muted-foreground">
                        Profit Split
                      </div>
                      <div className="mt-1 text-2xl font-bold">
                        {maxSplit}
                        %
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="text-xs text-muted-foreground">
                        Entry Fee
                      </div>
                      <div className="mt-1 text-2xl font-bold">
                        {challenge.is_free
                          ? 'FREE'
                          : `$${challenge.entry_fee}`}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="text-xs text-muted-foreground">
                        Payout Speed
                      </div>
                      <div className="mt-1 text-lg font-bold capitalize">
                        {challenge.payout_speed.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  {/* Markets */}
                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Available Markets
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {challenge.markets.map(market => (
                        <span
                          key={market}
                          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium capitalize"
                        >
                          {market}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                        <CheckIcon />
                        Pros
                      </h3>
                      <ul className="space-y-2">
                        {challenge.pros.map(pro => (
                          <li key={pro} className="flex gap-2 text-sm">
                            <span className="text-green-600 dark:text-green-400">
                              •
                            </span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                        <AlertIcon />
                        Cons
                      </h3>
                      <ul className="space-y-2">
                        {challenge.cons.map(con => (
                          <li key={con} className="flex gap-2 text-sm">
                            <span className="text-orange-600 dark:text-orange-400">
                              •
                            </span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-4">
                  {challenge.rules.profitTarget && (
                    <div className="rounded-lg border border-border p-4">
                      <div className="text-sm font-semibold">Profit Target</div>
                      <div className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                        {challenge.rules.profitTarget}
                        %
                      </div>
                    </div>
                  )}
                  {challenge.rules.maxDailyLoss && (
                    <div className="rounded-lg border border-border p-4">
                      <div className="text-sm font-semibold">
                        Max Daily Loss
                      </div>
                      <div className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                        {challenge.rules.maxDailyLoss}
                        %
                      </div>
                    </div>
                  )}
                  {challenge.rules.maxDrawdown && (
                    <div className="rounded-lg border border-border p-4">
                      <div className="text-sm font-semibold">Max Drawdown</div>
                      <div className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                        {challenge.rules.maxDrawdown}
                        %
                      </div>
                    </div>
                  )}
                  {challenge.rules.minTradingDays && (
                    <div className="rounded-lg border border-border p-4">
                      <div className="text-sm font-semibold">
                        Min Trading Days
                      </div>
                      <div className="mt-1 text-2xl font-bold">
                        {challenge.rules.minTradingDays}
                        {' '}
                        days
                      </div>
                    </div>
                  )}
                  {challenge.rules.timeLimit && (
                    <div className="rounded-lg border border-border p-4">
                      <div className="text-sm font-semibold">Time Limit</div>
                      <div className="mt-1 text-2xl font-bold">
                        {challenge.rules.timeLimit}
                        {' '}
                        days
                      </div>
                    </div>
                  )}
                  {challenge.rules.consistencyRule && (
                    <div className="rounded-lg border border-border p-4">
                      <div className="text-sm font-semibold">
                        Consistency Rule
                      </div>
                      <div className="mt-1 text-sm">
                        {challenge.rules.consistencyRule}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div className="rounded-lg border border-border bg-muted/30 p-6">
                    <div className="text-sm text-muted-foreground">
                      Entry Fee
                    </div>
                    <div className="mt-2 text-4xl font-bold">
                      {challenge.is_free ? (
                        <span className="text-green-600 dark:text-green-400">
                          FREE
                        </span>
                      ) : (
                        <>
                          $
                          {challenge.entry_fee}
                          {' '}
                          <span className="text-lg text-muted-foreground">
                            {challenge.currency}
                          </span>
                        </>
                      )}
                    </div>
                    {challenge.refundable && (
                      <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                        ✓ Refundable on first payout
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Profit Split Structure
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between rounded-lg border border-border p-3">
                        <span className="text-sm">Initial Split</span>
                        <span className="font-bold">
                          {challenge.profit_split.initial}
                          %
                        </span>
                      </div>
                      {challenge.profit_split.scaled && (
                        <div className="flex justify-between rounded-lg border border-border p-3">
                          <span className="text-sm">After Scaling</span>
                          <span className="font-bold">
                            {challenge.profit_split.scaled}
                            %
                          </span>
                        </div>
                      )}
                      {challenge.profit_split.maximum && (
                        <div className="flex justify-between rounded-lg border border-primary/50 bg-primary/5 p-3">
                          <span className="text-sm font-semibold">Maximum</span>
                          <span className="font-bold text-primary">
                            {challenge.profit_split.maximum}
                            %
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Payout Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Payout Speed
                        </span>
                        <span className="font-semibold capitalize">
                          {challenge.payout_speed.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          First Payout Delay
                        </span>
                        <span className="font-semibold">
                          {challenge.first_payout_delay}
                          {' '}
                          days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Fixed */}
            <div className="absolute inset-x-0 bottom-0 border-t border-border bg-background p-6">
              <div className="flex gap-3">
                <a
                  href={challenge.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  Visit Website
                  <ExternalLinkIcon />
                </a>
                <button
                  onClick={() => onEnroll(challenge)}
                  className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  type="button"
                >
                  {challenge.is_free ? 'Join Competition' : 'Start Challenge'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
