/**
 * PAYOUT SECTION - Program Drawer
 * Enterprise component 2026
 * Palette: desaturated, single institutional accent, SVG-only bullets
 */

import { useTranslations } from 'next-intl';
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

// Custom payout SVG — coin with arrow
const PayoutHeaderIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20" />
    <path d="M6 15h4" />
  </svg>
);

// Bullet used in list items
const BulletIcon = () => (
  <svg className="mt-0.5 size-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export function PayoutSection({ payoutTerms }: PayoutSectionProps) {
  const t = useTranslations('Challenges') as any;

  if (!payoutTerms) return null;

  return (
    <section>
      <SectionHeader
        icon={<PayoutHeaderIcon size={20} />}
        title={t('payout.title')}
        iconColor="blue"
      />

      {/* Profit Split card */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-black/4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t('payout.profitSplit')}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">{t('payout.initial')}</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{payoutTerms.profit_split_initial}%</span>
          </div>
          {payoutTerms.profit_split_scaled && (
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">{t('payout.scaled')}</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{payoutTerms.profit_split_scaled}%</span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">{t('payout.maximum')}</span>
            <span className="font-bold text-[#1E7D4F] dark:text-[#5AB585]">{payoutTerms.profit_split_max}%</span>
          </div>
        </div>
      </div>

      {/* Schedule list */}
      <ul className="space-y-2.5 text-sm">
        <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
          <BulletIcon />
          <span><strong className="text-slate-700 dark:text-slate-300">{t('payout.frequency')}:</strong> {payoutTerms.payout_frequency}</span>
        </li>
        <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
          <BulletIcon />
          <span><strong className="text-slate-700 dark:text-slate-300">{t('payout.firstDelay')}:</strong> {payoutTerms.first_payout_delay_days} {t('drawer.sections.days')}</span>
        </li>
        {payoutTerms.payout_processing_time_hours && (
          <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
            <BulletIcon />
            <span><strong className="text-slate-700 dark:text-slate-300">{t('payout.processingTime')}:</strong> {payoutTerms.payout_processing_time_hours}{t('payout.hours')}</span>
          </li>
        )}
        {payoutTerms.withdrawal_methods && payoutTerms.withdrawal_methods.length > 0 && (
          <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
            <BulletIcon />
            <span>
              <strong className="text-slate-700 dark:text-slate-300">{t('payout.withdrawalMethods')}:</strong>
              {' '}
              {Array.isArray(payoutTerms.withdrawal_methods)
                ? payoutTerms.withdrawal_methods.join(', ')
                : String(payoutTerms.withdrawal_methods)}
            </span>
          </li>
        )}
      </ul>
    </section>
  );
}
