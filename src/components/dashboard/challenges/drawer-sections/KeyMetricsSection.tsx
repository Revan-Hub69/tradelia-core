/**
 * KEY METRICS SECTION - Program Drawer
 * Enterprise component 2026 - NO EMOJI
 */

import { useTranslations } from 'next-intl';
import React from 'react';

import { TargetIcon } from '@/components/icons/unified';
import { SectionHeader } from './SectionHeader';

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

export const KeyMetricsSection = React.memo(({
  offer,
  payoutTerms,
}: KeyMetricsSectionProps) => {
  const t = useTranslations('Challenges') as any;

  return (
    <section>
      <SectionHeader
        icon={<TargetIcon size={20} />}
        title={t('drawer.sections.keyMetrics')}
        iconColor="blue"
      />
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4 lg:gap-4">
        {/* Account Size */}
        <div className="rounded-xl border border-border/50 bg-muted/30 p-3 sm:p-4 lg:col-span-1">
          <div className="mb-1 text-xs text-muted-foreground">
            {t('drawer.sections.accountSize')}
          </div>
          <div className="text-xl font-bold sm:text-2xl lg:text-3xl">
            {offer.account_currency}
            {offer.account_size >= 1000
              ? `${offer.account_size / 1000}K`
              : offer.account_size}
          </div>
        </div>

        {/* Profit Split */}
        {payoutTerms && (
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3 sm:p-4 lg:col-span-1">
            <div className="mb-1 text-xs text-muted-foreground">
              {t('drawer.sections.profitSplit')}
            </div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400 sm:text-2xl lg:text-3xl">
              {payoutTerms.profit_split_max}
              %
            </div>
          </div>
        )}

        {/* Entry Fee */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 sm:p-4 lg:col-span-1">
          <div className="mb-1 text-xs text-muted-foreground">
            {t('drawer.sections.entryFee')}
          </div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 sm:text-2xl lg:text-3xl">
            {offer.entry_fee ? (
              <>
                {offer.fee_currency}
                {offer.entry_fee}
              </>
            ) : (
              <span className="text-green-600 dark:text-green-400">
                {t('card.free')}
              </span>
            )}
          </div>
        </div>

        {/* First Payout */}
        {payoutTerms && (
          <div className="rounded-xl border border-border/50 bg-muted/30 p-3 sm:p-4 lg:col-span-1">
            <div className="mb-1 text-xs text-muted-foreground">
              {t('drawer.sections.firstPayout')}
            </div>
            <div className="text-xl font-bold sm:text-2xl lg:text-3xl">
              {payoutTerms.first_payout_delay_days}
              d
            </div>
          </div>
        )}
      </div>
    </section>
  );
});
