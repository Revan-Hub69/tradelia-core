/**
 * TRUST SECTION - Program Drawer
 * Enterprise component 2026 - NO EMOJI
 */

import { useTranslations } from 'next-intl';

import { FreshnessIcon, StarIcon, TrendingUpIcon, VerifiedIcon } from '@/components/icons/unified';
import { SectionHeader } from './SectionHeader';

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
  const t = useTranslations('Challenges') as any;

  return (
    <section>
      <SectionHeader
        icon={<VerifiedIcon size={20} />}
        title={t('drawer.sections.aboutFirm', { name: organizerName })}
        iconColor="amber"
      />

      <div className="space-y-3">
        {/* Rating */}
        <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2">
            <StarIcon size={20} className="text-amber-600 dark:text-amber-400" />
            <span className="font-medium">{t('drawer.sections.rating')}</span>
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
            <span className="font-medium">{t('drawer.sections.passRate')}</span>
          </div>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {trustSignals.successRate}
            %
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="mb-1 text-xs text-muted-foreground">
              {t('drawer.sections.activeTradersStat')}
            </div>
            <div className="text-xl font-bold">
              {trustSignals.traderCount.toLocaleString()}
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="mb-1 text-xs text-muted-foreground">
              {t('drawer.sections.totalPaid')}
            </div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              $
              {trustSignals.totalPaid}
              M
            </div>
          </div>

          <div className="col-span-2 rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="mb-1 text-xs text-muted-foreground">
              {t('drawer.sections.founded')}
            </div>
            <div className="text-xl font-bold">{trustSignals.founded}</div>
          </div>
        </div>

        {/* Data Freshness */}
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FreshnessIcon size={20} className="text-green-600 dark:text-green-400" />
            <span className="font-medium">{t('drawer.sections.dataFreshness')}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {t('drawer.sections.lastVerified', { date: 'Today (T-0)' })}
          </div>
        </div>
      </div>
    </section>
  );
}
