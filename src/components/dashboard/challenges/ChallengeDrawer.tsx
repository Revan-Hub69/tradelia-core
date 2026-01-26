'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, TrendingUp, DollarSign, Award, Clock, Target, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Challenge {
  id: string;
  name: string;
  description: string;
  is_free: boolean;
  entry_fee: number | null;
  currency: string;
  refundable: boolean;
  account_size: number;
  scaling_potential: number | null;
  profit_split: { initial: number; scaled?: number; maximum?: number };
  rules: {
    profitTarget?: number;
    maxDailyLoss?: number;
    maxDrawdown?: number;
    minTradingDays?: number;
    timeLimit?: number;
    consistencyRule?: string;
  };
  payout_speed: string;
  first_payout_delay: number;
  markets: string[];
  platforms: string[];
  pros: string[];
  cons: string[];
  best_for: string;
  official_url: string;
  popularity: number;
  success_rate: number | null;
  prop_firms: {
    name: string;
    logo_url: string;
    reputation: number;
    website_url: string;
  };
}

interface ChallengeDrawerProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (challenge: Challenge) => void;
}

type Tab = 'overview' | 'rules' | 'pricing';

export function ChallengeDrawer({ challenge, isOpen, onClose, onEnroll }: ChallengeDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  if (!challenge) return null;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatAccountSize = (size: number) => {
    if (size >= 1000000) return `$${(size / 1000000).toFixed(1)}M`;
    if (size >= 1000) return `$${(size / 1000).toFixed(0)}K`;
    return `$${size}`;
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
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl overflow-hidden bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{challenge.name}</h2>
                    <p className="text-sm text-muted-foreground">{challenge.prop_firms.name}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="rounded-lg p-2 hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 px-6">
                {(['overview', 'rules', 'pricing'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 py-3 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="h-[calc(100vh-180px)] overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="mb-2 text-sm font-semibold text-foreground">About</h3>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            Account Size
                          </div>
                          <div className="text-2xl font-bold">{formatAccountSize(challenge.account_size)}</div>
                        </div>

                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Award className="h-4 w-4" />
                            Profit Split
                          </div>
                          <div className="text-2xl font-bold">
                            {challenge.profit_split.initial}%
                            {challenge.profit_split.scaled && (
                              <span className="text-sm text-muted-foreground"> → {challenge.profit_split.scaled}%</span>
                            )}
                          </div>
                        </div>

                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            Payout Speed
                          </div>
                          <div className="text-lg font-bold capitalize">{challenge.payout_speed.replace('_', ' ')}</div>
                        </div>

                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            Popularity
                          </div>
                          <div className="text-2xl font-bold">{challenge.popularity}/100</div>
                        </div>
                      </div>

                      {/* Pros & Cons */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Pros
                          </h3>
                          <ul className="space-y-2">
                            {challenge.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                            <AlertTriangle className="h-4 w-4" />
                            Cons
                          </h3>
                          <ul className="space-y-2">
                            {challenge.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Best For */}
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <h3 className="mb-2 text-sm font-semibold text-foreground">Best For</h3>
                        <p className="text-sm text-muted-foreground">{challenge.best_for}</p>
                      </div>

                      {/* Markets & Platforms */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h3 className="mb-2 text-sm font-semibold">Markets</h3>
                          <div className="flex flex-wrap gap-2">
                            {challenge.markets.map((market) => (
                              <span
                                key={market}
                                className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize"
                              >
                                {market}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-2 text-sm font-semibold">Platforms</h3>
                          <div className="flex flex-wrap gap-2">
                            {challenge.platforms.map((platform) => (
                              <span
                                key={platform}
                                className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'rules' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Challenge Rules</h3>
                      
                      {challenge.rules.profitTarget && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
                            <Target className="h-4 w-4 text-green-600" />
                            Profit Target
                          </div>
                          <div className="text-2xl font-bold">{challenge.rules.profitTarget}%</div>
                        </div>
                      )}

                      {challenge.rules.maxDailyLoss && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            Max Daily Loss
                          </div>
                          <div className="text-2xl font-bold">{challenge.rules.maxDailyLoss}%</div>
                        </div>
                      )}

                      {challenge.rules.maxDrawdown && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            Max Drawdown
                          </div>
                          <div className="text-2xl font-bold">{challenge.rules.maxDrawdown}%</div>
                        </div>
                      )}

                      {challenge.rules.minTradingDays && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            Minimum Trading Days
                          </div>
                          <div className="text-2xl font-bold">{challenge.rules.minTradingDays} days</div>
                        </div>
                      )}

                      {challenge.rules.timeLimit && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
                            <Clock className="h-4 w-4 text-purple-600" />
                            Time Limit
                          </div>
                          <div className="text-2xl font-bold">{challenge.rules.timeLimit} days</div>
                        </div>
                      )}

                      {challenge.rules.consistencyRule && (
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                          <div className="mb-2 text-sm font-semibold">Consistency Rule</div>
                          <p className="text-sm text-muted-foreground">{challenge.rules.consistencyRule}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'pricing' && (
                    <div className="space-y-6">
                      <div className="rounded-lg border border-border bg-muted/30 p-6">
                        <div className="mb-4 text-center">
                          <div className="mb-2 text-sm text-muted-foreground">Entry Fee</div>
                          <div className="text-4xl font-bold">
                            {challenge.is_free ? (
                              <span className="text-green-600">FREE</span>
                            ) : (
                              formatCurrency(challenge.entry_fee!, challenge.currency)
                            )}
                          </div>
                          {challenge.refundable && !challenge.is_free && (
                            <div className="mt-2 text-sm text-green-600">✓ Refundable with first payout</div>
                          )}
                        </div>

                        <div className="space-y-3 border-t border-border pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Account Size</span>
                            <span className="font-semibold">{formatAccountSize(challenge.account_size)}</span>
                          </div>
                          {challenge.scaling_potential && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Scaling Potential</span>
                              <span className="font-semibold">{formatAccountSize(challenge.scaling_potential)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Profit Split</span>
                            <span className="font-semibold">{challenge.profit_split.initial}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Payout Speed</span>
                            <span className="font-semibold capitalize">{challenge.payout_speed.replace('_', ' ')}</span>
                          </div>
                          {challenge.first_payout_delay > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">First Payout Delay</span>
                              <span className="font-semibold">{challenge.first_payout_delay} days</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {challenge.success_rate && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="mb-2 text-sm font-semibold">Success Rate</div>
                          <div className="text-3xl font-bold">{challenge.success_rate}%</div>
                          <p className="mt-1 text-xs text-muted-foreground">of traders pass this challenge</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 border-t border-border bg-background/95 p-6 backdrop-blur-sm">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEnroll(challenge)}
                  className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {challenge.is_free ? 'Join Challenge' : 'Enroll Now'}
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={challenge.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-semibold transition-colors hover:bg-muted"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit
                </motion.a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
