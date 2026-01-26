'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Plus, X } from 'lucide-react';

import type { Challenge } from '@/types/challenge';

type ChallengeComparisonProps = {
  challenges: Challenge[];
  onRemove: (id: string) => void;
  onClose: () => void;
};

export function ChallengeComparison({
  challenges,
  onRemove,
  onClose,
}: ChallengeComparisonProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatAccountSize = (size: number) => {
    if (size >= 1000000) {
      return `$${(size / 1000000).toFixed(1)}M`;
    }
    if (size >= 1000) {
      return `$${(size / 1000).toFixed(0)}K`;
    }
    return `$${size}`;
  };

  const comparisonRows = [
    {
      label: 'Company',
      getValue: (c: Challenge) => {
        return c.prop_firms.name;
      },
    },
    {
      label: 'Challenge Name',
      getValue: (c: Challenge) => {
        return c.name;
      },
    },
    {
      label: 'Entry Fee',
      getValue: (c: Challenge) => {
        return c.is_free ? 'FREE' : formatCurrency(c.entry_fee!, c.currency);
      },
      highlight: true,
    },
    {
      label: 'Account Size',
      getValue: (c: Challenge) => {
        return formatAccountSize(c.account_size);
      },
      highlight: true,
    },
    {
      label: 'Profit Target',
      getValue: (c: Challenge) => {
        return c.rules.profitTarget ? `${c.rules.profitTarget}%` : 'N/A';
      },
    },
    {
      label: 'Max Daily Loss',
      getValue: (c: Challenge) => {
        return c.rules.maxDailyLoss ? `${c.rules.maxDailyLoss}%` : 'N/A';
      },
    },
    {
      label: 'Max Drawdown',
      getValue: (c: Challenge) => {
        return c.rules.maxDrawdown ? `${c.rules.maxDrawdown}%` : 'N/A';
      },
    },
    {
      label: 'Profit Split',
      getValue: (c: Challenge) => {
        const { initial, scaled } = c.profit_split;
        return scaled ? `${initial}% → ${scaled}%` : `${initial}%`;
      },
      highlight: true,
    },
    {
      label: 'Payout Speed',
      getValue: (c: Challenge) => {
        return c.payout_speed
          .replace('_', ' ')
          .replace(/\b\w/g, (l) => {
            return l.toUpperCase();
          });
      },
      highlight: true,
    },
    {
      label: 'Scaling Potential',
      getValue: (c: Challenge) => {
        return c.scaling_potential ? formatAccountSize(c.scaling_potential) : 'N/A';
      },
    },
    {
      label: 'Refundable',
      getValue: (c: Challenge) => {
        return c.refundable ? 'Yes' : 'No';
      },
    },
    {
      label: 'Min Trading Days',
      getValue: (c: Challenge) => {
        return c.rules.minTradingDays ? `${c.rules.minTradingDays} days` : 'None';
      },
    },
    {
      label: 'Time Limit',
      getValue: (c: Challenge) => {
        return c.rules.timeLimit ? `${c.rules.timeLimit} days` : 'Unlimited';
      },
    },
    {
      label: 'Markets',
      getValue: (c: Challenge) => {
        return c.markets.join(', ');
      },
    },
    {
      label: 'Platforms',
      getValue: (c: Challenge) => {
        return c.platforms.join(', ');
      },
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Comparison Panel */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-hidden rounded-t-2xl bg-background shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-border bg-background/95 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Compare Challenges</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-muted"
                type="button"
              >
                <X className="size-5" />
              </motion.button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto p-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-background p-4 text-left text-sm font-semibold">
                    Attribute
                  </th>
                  {challenges.map((challenge) => {
                    return (
                      <th
                        key={challenge.id}
                        className="relative min-w-[200px] p-4 text-left"
                      >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="text-sm font-semibold">
                              {challenge.prop_firms.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {challenge.name}
                            </div>
                          </div>
                          <button
                            onClick={() => onRemove(challenge.id)}
                            className="rounded-full p-1 hover:bg-muted"
                            type="button"
                            aria-label="Remove challenge"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                        <a
                          href={challenge.official_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Visit
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                      </th>
                    );
                  })}
                  {challenges.length < 3 && (
                    <th className="min-w-[200px] p-4">
                      <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-border p-8">
                        <div className="text-center">
                          <Plus className="mx-auto mb-2 size-8 text-muted-foreground" />
                          <div className="text-sm text-muted-foreground">
                            Add another challenge
                          </div>
                        </div>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => {
                  return (
                    <tr
                      key={row.label}
                      className={`border-t border-border ${
                        row.highlight ? 'bg-muted/30' : ''
                      }`}
                    >
                      <td className="sticky left-0 z-10 bg-background p-4 text-sm font-medium">
                        {row.label}
                      </td>
                      {challenges.map((challenge) => {
                        return (
                          <td key={challenge.id} className="p-4 text-sm">
                            {row.getValue(challenge)}
                          </td>
                        );
                      })}
                      {challenges.length < 3 && <td className="p-4" />}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
