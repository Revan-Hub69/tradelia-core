/**
 * KEY METRICS SECTION - Program Drawer
 * Modular component following best practices
 */

type Offer = {
  account_size: number;
  account_currency: string;
  entry_fee: number | null;
  fee_currency: string | null;
};

type PayoutTerms = {
  profit_split_max: number;
  first_payout_delay_days: number;
};

type KeyMetricsSectionProps = {
  offer: Offer;
  payoutTerms: PayoutTerms | null;
};

export function KeyMetricsSection({ offer, payoutTerms }: KeyMetricsSectionProps) {
  return (
    <section>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <span>📊</span>
        Key Metrics
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Account Size */}
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
          <div className="mb-1 text-xs text-muted-foreground">Account Size</div>
          <div className="text-2xl font-bold">
            {offer.account_currency}
            {offer.account_size >= 1000
              ? `${offer.account_size / 1000}K`
              : offer.account_size}
          </div>
        </div>

        {/* Profit Split */}
        {payoutTerms && (
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
            <div className="mb-1 text-xs text-muted-foreground">Profit Split</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {payoutTerms.profit_split_max}
              %
            </div>
          </div>
        )}

        {/* Entry Fee */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="mb-1 text-xs text-muted-foreground">Entry Fee</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {offer.entry_fee ? (
              <>
                {offer.fee_currency}
                {offer.entry_fee}
              </>
            ) : (
              <span className="text-green-600 dark:text-green-400">FREE</span>
            )}
          </div>
        </div>

        {/* First Payout */}
        {payoutTerms && (
          <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="mb-1 text-xs text-muted-foreground">First Payout</div>
            <div className="text-2xl font-bold">
              {payoutTerms.first_payout_delay_days}
              d
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
