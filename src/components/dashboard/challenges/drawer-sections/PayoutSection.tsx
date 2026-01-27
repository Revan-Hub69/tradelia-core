/**
 * PAYOUT SECTION - Program Drawer
 * Enterprise component 2026 - NO EMOJI
 */

import { useTranslations } from 'next-intl';

import { PayoutIcon } from '../PremiumIcons';
import { SectionHeader } from './SectionHeader';

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
  const t = useTranslations('Challenges') as any;

  if (!payoutTerms) {
    return null;
  }

  return (
    <section>
      <SectionHeader
        icon={<PayoutIcon size={20} />}
        title={t('payout.title')}
        iconColor="green"
      />

      {/* Profit Split */}
      <div className="mb-4 rounded-xl border border-border/50 bg-muted/30 p-4">
        <div className="mb-3 flex items-center gap-2">
          <PayoutIcon size={20} className="text-blue-600 dark:text-blue-400" />
          <span className="font-medium">{t('payout.profitSplit')}</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('payout.initial')}</span>
            <span className="font-semibold">
              {payoutTerms.profit_split_initial}
              %
            </span>
          </div>
          {payoutTerms.profit_split_scaled && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('payout.scaled')}</span>
              <span className="font-semibold">
                {payoutTerms.profit_split_scaled}
                %
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('payout.maximum')}</span>
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
            <strong>
{t('payout.frequency')}
:
            </strong>
            {' '}
            {payoutTerms.payout_frequency}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 dark:text-blue-400">✓</span>
          <span>
            <strong>
{t('payout.firstDelay')}
:
            </strong>
            {' '}
            {payoutTerms.first_payout_delay_days}
            {' '}
            {t('drawer.sections.days')}
          </span>
        </li>
        {payoutTerms.payout_processing_time_hours && (
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>
              <strong>
{t('payout.processingTime')}
:
              </strong>
              {' '}
              {payoutTerms.payout_processing_time_hours}
              {t('payout.hours')}
            </span>
          </li>
        )}
        {payoutTerms.withdrawal_methods && payoutTerms.withdrawal_methods.length > 0 && (
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>
              <strong>
{t('payout.withdrawalMethods')}
:
              </strong>
              {' '}
              {payoutTerms.withdrawal_methods.join(', ')}
            </span>
          </li>
        )}
      </ul>
    </section>
  );
}
