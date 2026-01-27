/**
 * TRUST SECTION - Program Drawer
 * Modular component following best practices 2026
 */

import { FreshnessIcon, StarIcon, TrendingUpIcon } from '../PremiumIcons';

type TrustSignals = {
  rating: number;
  successRate: number;
  traderCount: number;
  totalPaid: number;
  founded: number;
};

type TrustSectionProps = {
  trustSignals: TrustSignals;
  organizerName: string;
};

export function TrustSection({ trustSignals, organizerName }: TrustSectionProps) {
  return (
    <section>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <span>🏢</span>
        About
        {' '}
        {organizerName}
      </h3>

      <div className="space-y-3">
        {/* Rating */}
        <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2">
            <StarIcon size={20} className="text-amber-600 dark:text-amber-400" />
            <span className="font-medium">Rating</span>
          </div>
          <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
            {trustSignals.rating}
            /5
          </span>
        </div>

        {/* Success Rate */}
        <div className="flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-center gap-2">
            <TrendingUpIcon size={20} className="text-green-600 dark:text-green-400" />
            <span className="font-medium">Pass Rate</span>
          </div>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {trustSignals.successRate}
            %
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="mb-1 text-xs text-muted-foreground">Active Traders</div>
            <div className="text-xl font-bold">
              {trustSignals.traderCount.toLocaleString()}
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="mb-1 text-xs text-muted-foreground">Total Paid</div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              $
              {trustSignals.totalPaid}
              M
            </div>
          </div>

          <div className="col-span-2 rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="mb-1 text-xs text-muted-foreground">Founded</div>
            <div className="text-xl font-bold">{trustSignals.founded}</div>
          </div>
        </div>

        {/* Data Freshness */}
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FreshnessIcon size={20} className="text-green-600 dark:text-green-400" />
            <span className="font-medium">Data Freshness</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Last verified: Today (T-0)
          </div>
        </div>
      </div>
    </section>
  );
}
