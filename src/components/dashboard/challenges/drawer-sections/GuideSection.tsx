/**
 * GUIDE SECTION - AI-Powered Challenge Guide
 * Enterprise component 2026 - NO EMOJI
 *
 * Conversational AI guide that explains the challenge
 * in a friendly, practical way with actionable tips
 */

import { useTranslations } from 'next-intl';
import React from 'react';

import { LightbulbIcon, TargetIcon, TrendingUpIcon } from '../PremiumIcons';
import { SectionHeader } from './SectionHeader';

type Program = {
  category: 'free_competition' | 'paid_evaluation';
  ruleset_mode?: 'target_based' | 'ranking_based';
};

type Ruleset = {
  phase_number: number;
  profit_target_pct: number | null;
  max_drawdown_pct: number | null;
  max_daily_loss_pct: number | null;
  min_trading_days: number | null;
};

type GuideSectionProps = {
  program: Program;
  rulesets: Ruleset[];
};

export const GuideSection = React.memo(({ program, rulesets }: GuideSectionProps) => {
  const t = useTranslations('Challenges') as any;

  const isFree = program.category === 'free_competition';
  const isRankingBased = program.ruleset_mode === 'ranking_based';
  const phase1 = rulesets.find(r => r.phase_number === 1);

  // Generate contextual tips based on challenge type
  const getContextualTips = (): string[] => {
    const tips: string[] = [];

    if (isFree) {
      tips.push(
        t('guide.tips.freePractice') as string,
        t('guide.tips.noRisk') as string,
        t('guide.tips.prizes') as string,
      );
    } else {
      tips.push(
        t('guide.tips.evaluation') as string,
        t('guide.tips.refund') as string,
        t('guide.tips.funding') as string,
      );
    }

    if (isRankingBased) {
      tips.push(t('guide.tips.ranking') as string);
    }

    if (phase1?.profit_target_pct) {
      tips.push(t('guide.tips.profitTarget', { target: phase1.profit_target_pct }) as string);
    }

    if (phase1?.max_drawdown_pct) {
      tips.push(t('guide.tips.riskManagement', { drawdown: phase1.max_drawdown_pct }) as string);
    }

    if (phase1?.min_trading_days) {
      tips.push(t('guide.tips.consistency', { days: phase1.min_trading_days }) as string);
    }

    return tips;
  };

  const tips = getContextualTips();

  return (
    <section>
      <SectionHeader
        icon={<LightbulbIcon size={20} />}
        title={t('guide.title') as string}
        iconColor="amber"
      />

      <div className="space-y-4">
        {/* Main Explanation */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 dark:bg-amber-950/20">
          <p className="text-sm leading-relaxed text-foreground">
            {isFree
              ? (t('guide.description.free') as string)
              : (t('guide.description.paid') as string)}
          </p>
        </div>

        {/* How It Works */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <TargetIcon size={16} className="text-blue-600 dark:text-blue-400" />
            {t('guide.howItWorks') as string}
          </h4>

          <ol className="space-y-2 text-sm">
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                1
              </span>
              <span className="text-muted-foreground">
                {t('guide.steps.selectSize') as string}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                2
              </span>
              <span className="text-muted-foreground">
                {isFree
                  ? (t('guide.steps.registerFree') as string)
                  : (t('guide.steps.payFee') as string)}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                3
              </span>
              <span className="text-muted-foreground">
                {isRankingBased
                  ? (t('guide.steps.tradeRanking') as string)
                  : (t('guide.steps.tradeTarget') as string)}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700 dark:bg-green-950 dark:text-green-300">
                {'\u2713'}
              </span>
              <span className="text-muted-foreground">
                {isFree
                  ? (t('guide.steps.winPrizes') as string)
                  : (t('guide.steps.getFunded') as string)}
              </span>
            </li>
          </ol>
        </div>

        {/* Practical Tips */}
        {tips.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <TrendingUpIcon size={16} className="text-green-600 dark:text-green-400" />
              {t('guide.practicalTips') as string}
            </h4>

            <ul className="space-y-2">
              {tips.map(tip => (
                <li
                  key={tip}
                  className="flex gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Assistant Note */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <strong>{t('guide.aiNote.title') as string}</strong>
          {' '}
          {t('guide.aiNote.description') as string}
        </div>
      </div>
    </section>
  );
});

GuideSection.displayName = 'GuideSection';
