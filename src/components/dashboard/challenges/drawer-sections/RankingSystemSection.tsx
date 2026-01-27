/**
 * RANKING SYSTEM SECTION - Program Drawer
 * Enterprise component 2026 - Adaptive for Tournaments
 *
 * Shows ranking methodology and scoring system
 * Only visible when ruleset_mode === 'ranking_based'
 */

import { useTranslations } from 'next-intl';

import { StarIcon, TrendingUpIcon } from '../PremiumIcons';
import { SectionHeader } from './SectionHeader';

type RankingSystemSectionProps = {
  rankingMethod?: 'profit_percentage' | 'absolute_profit' | 'risk_adjusted' | 'consistency';
  scoringFactors?: Array<{
    factor: string;
    weight: number;
  }>;
  updateFrequency?: string;
};

const DEFAULT_SCORING_FACTORS = [
  { factor: 'Total Profit %', weight: 50 },
  { factor: 'Consistency Score', weight: 30 },
  { factor: 'Risk Management', weight: 20 },
];

export function RankingSystemSection({
  rankingMethod = 'profit_percentage',
  scoringFactors = DEFAULT_SCORING_FACTORS,
  updateFrequency = 'Real-time',
}: RankingSystemSectionProps) {
  const t = useTranslations('Challenges') as any;

  const rankingMethodLabels = {
    profit_percentage: t('ranking.profitPercentage'),
    absolute_profit: t('ranking.absoluteProfit'),
    risk_adjusted: t('ranking.riskAdjusted'),
    consistency: t('ranking.consistency'),
  };

  return (
    <section>
      <SectionHeader
        icon={<TrendingUpIcon size={20} />}
        title={t('ranking.title')}
        iconColor="purple"
      />

      {/* Ranking Method */}
      <div className="mb-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <StarIcon size={18} className="text-purple-600 dark:text-purple-400" />
          <span className="font-medium">{t('ranking.method')}</span>
        </div>
        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
          {rankingMethodLabels[rankingMethod]}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {t('ranking.updatedFrequency', { frequency: updateFrequency })}
        </div>
      </div>

      {/* Scoring Factors */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-muted-foreground">
          {t('ranking.scoringFactors')}
        </div>
        {scoringFactors.map(factor => (
          <div
            key={factor.factor}
            className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4"
          >
            <span className="font-medium">{factor.factor}</span>
            <div className="flex items-center gap-3">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                  style={{ width: `${factor.weight}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm font-bold text-purple-600 dark:text-purple-400">
                {factor.weight}
                %
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Info */}
      <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-blue-600 dark:text-blue-400">ℹ️</div>
          <div className="text-sm text-muted-foreground">
            {t('ranking.leaderboardInfo')}
          </div>
        </div>
      </div>
    </section>
  );
}
