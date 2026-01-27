/**
 * PAYOUT SECTION - Program Drawer
 * Modular component following best practices 2026
 */

import { PayoutIcon } from '../PremiumIcons';

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

type PayoutSectionProps = {
  payoutTerms: PayoutTerms | null;
};

export function PayoutSection({ payoutTerms }: PayoutSectionProps) {
  if (!payoutTerms) {
    return null;
  }

  return (
    <section>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <span>💰</span>
        Payout Details
      </h3>

      {/* Profit Split */}
      <div className="mb-4 rounded-xl border border-border/50 bg-muted/30 p-4">
        <div className="mb-3 flex items-center gap-2">
          <PayoutIcon size={20} className="text-blue-600 dark:text-blue-400" />
          <span className="font-medium">Profit Split</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Initial</span>
            <span className="font-semibold">
              {payoutTerms.profit_split_initial}
              %
            </span>
          </div>
          {payoutTerms.profit_split_scaled && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scaled</span>
              <span className="font-semibold">
                {payoutTerms.profit_split_scaled}
                %
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Maximum</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {payoutTerms.profit_split_max}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Payout Schedule */}
      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 dark:text-blue-400">✓</span>
          <span>
            <strong>Frequency:</strong>
            {' '}
            {payoutTerms.payout_frequency}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 dark:text-blue-400">✓</span>
          <span>
            <strong>First Payout:</strong>
            {' '}
            {payoutTerms.first_payout_delay_days}
            {' '}
            days
          </span>
        </li>
        {payoutTerms.payout_processing_time_hours && (
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>
              <strong>Processing Time:</strong>
              {' '}
              {payoutTerms.payout_processing_time_hours}
              h
            </span>
          </li>
        )}
        {payoutTerms.withdrawal_methods && payoutTerms.withdrawal_methods.length > 0 && (
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>
              <strong>Methods:</strong>
              {' '}
              {payoutTerms.withdrawal_methods.join(', ')}
            </span>
          </li>
        )}
      </ul>
    </section>
  );
}
