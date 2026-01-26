'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

import type { Challenge } from '@/types/challenge';

type ChallengeDrawerProps = {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (challenge: Challenge) => void;
};

// Premium SVG Icons
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export function ChallengeDrawer({
  challenge,
  isOpen,
  onClose,
  onEnroll,
}: ChallengeDrawerProps) {
  // Body scroll lock with scrollbar compensation
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

  if (!challenge) {
    return null;
  }

  const maxSplit =
    challenge.profit_split.maximum ||
    challenge.profit_split.scaled ||
    challenge.profit_split.initial;

  const rating = challenge.prop_firms.reputation / 20;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Premium Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          />

          {/* Drawer - iOS 26 Liquid Glass */}
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
            {/* Header - Fixed with Liquid Glass */}
            <header className="glass-panel sticky top-0 z-10 border-b border-border/50 backdrop-blur-xl">
              <div className="flex items-start gap-4 p-6">
                {/* Title & Badges */}
                <div className="min-w-0 flex-1">
                  {/* Badges Row */}
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {challenge.is_free ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-green-500/30">
                        <span className="size-1.5 animate-pulse rounded-full bg-white" />
                        Free Competition
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-600 backdrop-blur-sm dark:text-blue-400">
                        Prop Firm
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 id="drawer-title" className="mb-2 text-2xl font-bold leading-tight tracking-tight">
                    {challenge.name}
                  </h2>

                  {/* Firm Info with Rating */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{challenge.prop_firms.name}</span>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <StarIcon filled />
                      <span className="font-semibold">{rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">(2,341)</span>
                    </div>
                  </div>
                </div>

                {/* Close Button - Premium */}
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

            {/* Content - Single Scroll */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-8 p-6">
                {/* 📊 KEY METRICS */}
                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    <span>📊</span>
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="card-nested rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-4">
                      <div className="mb-1 text-xs font-medium text-muted-foreground">Account Size</div>
                      <div className="text-2xl font-bold tracking-tight">
                        $
                        {challenge.account_size.toLocaleString()}
                      </div>
                    </div>
                    <div className="card-nested rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-4">
                      <div className="mb-1 text-xs font-medium text-muted-foreground">Profit Split</div>
                      <div className="text-2xl font-bold tracking-tight text-green-600 dark:text-green-400">
                        {maxSplit}
                        %
                      </div>
                    </div>
                    <div className="card-nested rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-4">
                      <div className="mb-1 text-xs font-medium text-muted-foreground">Entry Fee</div>
                      <div className="text-2xl font-bold tracking-tight">
                        {challenge.is_free ? (
                          <span className="text-green-600 dark:text-green-400">FREE</span>
                        ) : (
                          `$${challenge.entry_fee}`
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* ⚠️ RISK RULES */}
                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    <span>⚠️</span>
                    Risk Rules
                  </h3>
                  <div className="space-y-3">
                    {challenge.rules.profitTarget && (
                      <div className="flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                        <span className="font-medium">Profit Target</span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {challenge.rules.profitTarget}
                          %
                        </span>
                      </div>
                    )}
                    {challenge.rules.maxDailyLoss && (
                      <div className="flex items-center justify-between rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                        <span className="font-medium">Max Daily Loss</span>
                        <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          {challenge.rules.maxDailyLoss}
                          %
                        </span>
                      </div>
                    )}
                    {challenge.rules.maxDrawdown && (
                      <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                        <span className="font-medium">Max Drawdown</span>
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                          {challenge.rules.maxDrawdown}
                          %
                        </span>
                      </div>
                    )}
                    {challenge.rules.minTradingDays && (
                      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4">
                        <span className="font-medium">Min Trading Days</span>
                        <span className="text-lg font-bold">
                          {challenge.rules.minTradingDays}
                          {' '}
                          days
                        </span>
                      </div>
                    )}
                    {challenge.rules.timeLimit && (
                      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4">
                        <span className="font-medium">Time Limit</span>
                        <span className="text-lg font-bold">
                          {challenge.rules.timeLimit}
                          {' '}
                          days
                        </span>
                      </div>
                    )}
                  </div>
                </section>

                {/* 💰 PAYOUT DETAILS */}
                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    <span>💰</span>
                    Payout Details
                  </h3>
                  <div className="space-y-3 rounded-2xl border border-border/50 bg-muted/30 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payout Speed</span>
                      <span className="font-semibold capitalize">{challenge.payout_speed.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">First Payout Delay</span>
                      <span className="font-semibold">
                        {challenge.first_payout_delay}
                        {' '}
                        days
                      </span>
                    </div>
                    {challenge.refundable && (
                      <div className="mt-2 rounded-lg bg-green-500/10 p-3 text-sm font-medium text-green-600 dark:text-green-400">
                        ✓ Fee refundable on first payout
                      </div>
                    )}
                  </div>
                </section>

                {/* 📈 SCALING & GROWTH */}
                {challenge.scaling_potential && (
                  <section>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                      <span>📈</span>
                      Scaling & Growth
                    </h3>
                    <div className="space-y-3 rounded-2xl border border-border/50 bg-muted/30 p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Max Account Size</span>
                        <span className="font-semibold">
                          $
                          {challenge.scaling_potential.toLocaleString()}
                        </span>
                      </div>
                      {challenge.profit_split.scaled && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Profit Split Growth</span>
                          <span className="font-semibold">
                            {challenge.profit_split.initial}
                            % →
                            {' '}
                            {challenge.profit_split.scaled}
                            %
                          </span>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* 🎯 BEST FOR */}
                {challenge.best_for && (
                  <section>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                      <span>🎯</span>
                      Best For
                    </h3>
                    <p className="rounded-2xl border border-border/50 bg-muted/30 p-4 text-sm leading-relaxed">
                      {challenge.best_for}
                    </p>
                  </section>
                )}

                {/* ✅ PROS & ⚠️ CONS */}
                <section>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Pros */}
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400">
                        <span>✅</span>
                        Pros
                      </h3>
                      <ul className="space-y-2">
                        {challenge.pros.map(pro => (
                          <li key={pro} className="flex gap-2 text-sm">
                            <span className="mt-0.5 text-green-600 dark:text-green-400">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-orange-400">
                        <span>⚠️</span>
                        Cons
                      </h3>
                      <ul className="space-y-2">
                        {challenge.cons.map(con => (
                          <li key={con} className="flex gap-2 text-sm">
                            <span className="mt-0.5 text-orange-600 dark:text-orange-400">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 🏢 ABOUT FIRM */}
                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    <span>🏢</span>
                    About Firm
                  </h3>
                  <div className="space-y-3 rounded-2xl border border-border/50 bg-muted/30 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Firm Name</span>
                      <span className="font-semibold">{challenge.prop_firms.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reputation</span>
                      <div className="flex items-center gap-1">
                        <StarIcon filled />
                        <span className="font-semibold">
{rating.toFixed(1)}
/5.0
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Traders</span>
                      <span className="font-semibold">2,341</span>
                    </div>
                  </div>
                </section>

                {/* 📊 MARKETS & PLATFORMS */}
                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    <span>📊</span>
                    Markets & Platforms
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 text-sm font-medium">Available Markets</div>
                      <div className="flex flex-wrap gap-2">
                        {challenge.markets.map(market => (
                          <span
                            key={market}
                            className="rounded-lg border border-border/50 bg-background px-3 py-1.5 text-xs font-medium capitalize"
                          >
                            {market}
                          </span>
                        ))}
                      </div>
                    </div>
                    {challenge.platforms && challenge.platforms.length > 0 && (
                      <div>
                        <div className="mb-2 text-sm font-medium">Trading Platforms</div>
                        <div className="flex flex-wrap gap-2">
                          {challenge.platforms.map(platform => (
                            <span
                              key={platform}
                              className="rounded-lg border border-border/50 bg-background px-3 py-1.5 text-xs font-medium"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>

            {/* Footer - Fixed Actions */}
            <footer className="glass-panel sticky bottom-0 border-t border-border/50 p-6 backdrop-blur-xl">
              <div className="flex gap-3">
                <a
                  href={challenge.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold transition-all hover:bg-muted"
                >
                  Visit Website
                  <ExternalLinkIcon />
                </a>
                <button
                  onClick={() => onEnroll(challenge)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                  type="button"
                >
                  {challenge.is_free ? 'Join Competition' : 'Start Challenge'}
                </button>
              </div>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
