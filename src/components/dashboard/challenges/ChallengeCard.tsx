'use client';

import { motion } from 'framer-motion';

import type { Challenge } from '@/types/challenge';

type ChallengeCardProps = {
  challenge: Challenge;
  onViewDetails: (challenge: Challenge) => void;
  onCompareToggle: (id: string) => void;
  isComparing: boolean;
};

// Custom SVG Icons
const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const TargetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export function ChallengeCard({
  challenge,
  onViewDetails,
  onCompareToggle,
  isComparing,
}: ChallengeCardProps) {
  const maxSplit =
    challenge.profit_split.maximum ||
    challenge.profit_split.scaled ||
    challenge.profit_split.initial;

  const isPopular = challenge.popularity >= 80;
  const isHighSuccess = (challenge.success_rate || 0) >= 70;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 ${
        challenge.is_free
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-border hover:border-primary/50'
      } ${isComparing ? 'ring-2 ring-primary' : ''}`}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        {/* Badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {challenge.is_free ? (
            <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-green-500/20">
              FREE COMPETITION
            </span>
          ) : (
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
              PROP FIRM
            </span>
          )}
          {isPopular && (
            <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
              🔥 POPULAR
            </span>
          )}
          {isHighSuccess && (
            <span className="rounded-full bg-purple-500/10 px-2 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">
              ⭐ HIGH SUCCESS
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-1 text-lg font-bold leading-tight">
          {challenge.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {challenge.prop_firms.name}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 px-6 pb-6">
        <div className="rounded-lg border border-border bg-background/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <DollarIcon />
            Account Size
          </div>
          <div className="text-lg font-bold">
            $
            {(challenge.account_size / 1000).toFixed(0)}
            k
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUpIcon />
            Profit Split
          </div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {maxSplit}
            %
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <TargetIcon />
            Entry Fee
          </div>
          <div className="text-lg font-bold">
            {challenge.is_free ? (
              <span className="text-green-600 dark:text-green-400">FREE</span>
            ) : (
              `$${challenge.entry_fee}`
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClockIcon />
            Payout
          </div>
          <div className="text-sm font-bold capitalize">
            {challenge.payout_speed.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Markets */}
      <div className="border-t border-border px-6 py-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Markets
        </div>
        <div className="flex flex-wrap gap-1.5">
          {challenge.markets.slice(0, 4).map(market => (
            <span
              key={market}
              className="rounded-md bg-muted px-2 py-1 text-xs font-medium capitalize"
            >
              {market}
            </span>
          ))}
          {challenge.markets.length > 4 && (
            <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
              +
              {challenge.markets.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-border p-4">
        <button
          onClick={() => onCompareToggle(challenge.id)}
          className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all ${
            isComparing
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background hover:bg-muted'
          }`}
          type="button"
        >
          {isComparing ? '✓ Selected' : 'Compare'}
        </button>
        <button
          onClick={() => onViewDetails(challenge)}
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          type="button"
        >
          View Details
        </button>
      </div>

      {/* Hover Effect Overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      </div>
    </motion.div>
  );
}
