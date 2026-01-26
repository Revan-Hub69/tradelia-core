'use client';

import { motion } from 'framer-motion';

import type { Challenge } from '@/types/challenge';

type ChallengeCardProps = {
  challenge: Challenge;
  onViewDetails: (challenge: Challenge) => void;
  onCompareToggle: (id: string) => void;
  isComparing: boolean;
};

// Custom SVG Icons - Premium Design
const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const DollarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TargetIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

  // Calculate rating (mock - should come from API)
  const rating = challenge.prop_firms.reputation / 20; // Convert 0-100 to 0-5

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className={`card-ios-26 card-ios-26-interactive group relative overflow-hidden ${
        challenge.is_free
          ? 'border-green-500/20 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20'
          : ''
      } ${isComparing ? 'card-ios-26-selected' : ''}`}
    >
      {/* Header Section - Badges & Rating */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Badge - Primary */}
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

          {/* Status Badges - Secondary */}
          {isPopular && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
              🔥 Hot
            </span>
          )}
          {isHighSuccess && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">
              ⭐ Top
            </span>
          )}
        </div>

        {/* Rating - Trust Signal */}
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-muted/50 px-2 py-1 backdrop-blur-sm">
          <StarIcon filled />
          <span className="text-xs font-bold">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-6">
        <h3 className="mb-1.5 text-lg font-bold leading-tight tracking-tight">
          {challenge.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {challenge.prop_firms.name}
        </p>
      </div>

      {/* Key Metrics Grid - 2x2 Premium Layout */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        {/* Account Size - Primary Metric */}
        <div className="card-nested group/metric relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-4 transition-all hover:border-primary/30 hover:shadow-md">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <TargetIcon />
            <span>Account</span>
          </div>
          <div className="text-2xl font-bold tracking-tight">
            $
            {(challenge.account_size / 1000).toFixed(0)}
            <span className="text-base font-semibold text-muted-foreground">k</span>
          </div>
          {/* Subtle gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover/metric:opacity-100" />
        </div>

        {/* Profit Split - Primary Metric */}
        <div className="card-nested group/metric relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-4 transition-all hover:border-green-500/30 hover:shadow-md">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <TrendingUpIcon />
            <span>Split</span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-green-600 dark:text-green-400">
            {maxSplit}
            <span className="text-base font-semibold">%</span>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 transition-opacity group-hover/metric:opacity-100" />
        </div>

        {/* Entry Fee - Secondary Metric */}
        <div className="card-nested group/metric relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-4 transition-all hover:border-blue-500/30 hover:shadow-md">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <DollarIcon />
            <span>Cost</span>
          </div>
          <div className="text-xl font-bold tracking-tight">
            {challenge.is_free ? (
              <span className="text-green-600 dark:text-green-400">FREE</span>
            ) : (
              <>
                $
                {challenge.entry_fee}
              </>
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover/metric:opacity-100" />
        </div>

        {/* Payout Speed - Secondary Metric */}
        <div className="card-nested group/metric relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-4 transition-all hover:border-orange-500/30 hover:shadow-md">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ClockIcon />
            <span>Payout</span>
          </div>
          <div className="text-sm font-bold capitalize leading-tight tracking-tight">
            {challenge.payout_speed.replace('_', ' ')}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 transition-opacity group-hover/metric:opacity-100" />
        </div>
      </div>

      {/* Risk Summary - Compact */}
      <div className="mb-6 flex flex-wrap gap-2 text-xs">
        {challenge.rules.maxDailyLoss && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-2.5 py-1.5 font-medium text-orange-700 dark:text-orange-300">
            <span className="size-1.5 rounded-full bg-orange-500" />
            {challenge.rules.maxDailyLoss}
            % Daily Loss
          </div>
        )}
        {challenge.rules.maxDrawdown && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2.5 py-1.5 font-medium text-red-700 dark:text-red-300">
            <span className="size-1.5 rounded-full bg-red-500" />
            {challenge.rules.maxDrawdown}
            % Max DD
          </div>
        )}
      </div>

      {/* Actions - Premium Layout */}
      <div className="flex gap-2 border-t border-border/50 pt-4">
        {/* Compare Checkbox - Subtle */}
        <button
          onClick={() => onCompareToggle(challenge.id)}
          className={`group/compare flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
            isComparing
              ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'border-border bg-background/50 hover:border-primary/50 hover:bg-muted/50'
          }`}
          type="button"
          aria-label={isComparing ? 'Remove from comparison' : 'Add to comparison'}
        >
          <div className={`flex size-4 items-center justify-center rounded border-2 transition-all ${
            isComparing
              ? 'border-primary-foreground bg-primary-foreground'
              : 'border-current group-hover/compare:border-primary'
          }`}>
            {isComparing && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="hidden sm:inline">Compare</span>
        </button>

        {/* View Details - Primary Action */}
        <button
          onClick={() => onViewDetails(challenge)}
          className="group/cta flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          type="button"
        >
          <span>View Details</span>
          <svg className="size-4 transition-transform group-hover/cta:translate-x-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Hover Glow Effect - Premium Touch */}
      <div className="pointer-events-none absolute inset-0 rounded-[32px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      </div>
    </motion.article>
  );
}
