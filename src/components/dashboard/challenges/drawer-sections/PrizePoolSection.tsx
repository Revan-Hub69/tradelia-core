/**
 * PRIZE POOL SECTION - Program Drawer
 * Enterprise component 2026 - Adaptive for Free Competitions
 *
 * Shows prize distribution for tournaments and competitions
 * Only visible when category === 'free_competition'
 */

import { useTranslations } from 'next-intl';

import { TrophyIcon } from '../PremiumIcons';
import { SectionHeader } from './SectionHeader';

type PrizePoolSectionProps = {
  totalPrize?: number;
  currency?: string;
  prizeDistribution?: Array<{
    position: number;
    amount: number;
    percentage?: number;
  }>;
};

const DEFAULT_PRIZE_DISTRIBUTION = [
  { position: 1, amount: 5000, percentage: 50 },
  { position: 2, amount: 3000, percentage: 30 },
  { position: 3, amount: 2000, percentage: 20 },
];

export function PrizePoolSection({
  totalPrize = 10000,
  currency = 'USD',
  prizeDistribution = DEFAULT_PRIZE_DISTRIBUTION,
}: PrizePoolSectionProps) {
  const t = useTranslations('Challenges') as any;

  return (
    <section>
      <SectionHeader
        icon={<TrophyIcon size={20} />}
        title={t('prizePool.title')}
        iconColor="amber"
      />

      {/* Total Prize Pool */}
      <div className="mb-4 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-4 sm:mb-5 sm:p-6 lg:mb-6 lg:p-8">
        <div className="mb-2 text-xs font-medium text-muted-foreground sm:text-sm">
          {t('prizePool.totalPool')}
        </div>
        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 sm:text-4xl lg:text-5xl">
          {currency}
          {' '}
          {totalPrize.toLocaleString()}
        </div>
      </div>

      {/* Prize Distribution */}
      <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
        <div className="text-xs font-medium text-muted-foreground sm:text-sm">
          {t('prizePool.distribution')}
        </div>
        {prizeDistribution.map(prize => (
          <div
            key={prize.position}
            className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-3 sm:p-4 lg:p-5"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4">
              <div
                className={`flex size-9 items-center justify-center rounded-lg font-bold sm:size-10 lg:size-12 lg:text-lg ${
                  prize.position === 1
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : prize.position === 2
                      ? 'bg-gray-400/20 text-gray-600 dark:text-gray-400'
                      : 'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                }`}
              >
                {prize.position}
              </div>
              <span className="text-sm font-medium sm:text-base lg:text-lg">
                {prize.position === 1
                  ? t('prizePool.firstPlace')
                  : prize.position === 2
                    ? t('prizePool.secondPlace')
                    : t('prizePool.thirdPlace')}
              </span>
            </div>
            <div className="text-right">
              <div className="text-base font-bold sm:text-lg lg:text-xl">
                {currency}
                {' '}
                {prize.amount.toLocaleString()}
              </div>
              {prize.percentage && (
                <div className="text-xs text-muted-foreground">
                  {prize.percentage}
                  %
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
