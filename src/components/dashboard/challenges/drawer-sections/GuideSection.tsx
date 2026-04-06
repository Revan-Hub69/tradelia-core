/**
 * GUIDE SECTION - AI-Powered Challenge Guide
 * Enterprise component 2026
 * Palette: single institutional accent, desaturated semantic colors
 */

import { useTranslations } from 'next-intl';
import React from 'react';

import { LightbulbIcon, TargetIcon, TrendingUpIcon } from '@/components/icons/unified';
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
    if (isRankingBased) tips.push(t('guide.tips.ranking') as string);
    if (phase1?.profit_target_pct) tips.push(t('guide.tips.profitTarget', { target: phase1.profit_target_pct }) as string);
    if (phase1?.max_drawdown_pct) tips.push(t('guide.tips.riskManagement', { drawdown: phase1.max_drawdown_pct }) as string);
    if (phase1?.min_trading_days) tips.push(t('guide.tips.consistency', { days: phase1.min_trading_days }) as string);
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
        <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {isFree
              ? (t('guide.description.free') as string)
              : (t('guide.description.paid') as string)}
          </p>
        </div>

        {/* How It Works */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <TargetIcon size={16} className="text-slate-500 dark:text-slate-400" />
            {t('guide.howItWorks') as string}
          </h4>

          <ol className="space-y-2 text-sm">
            {[1, 2, 3].map((step, i) => {
              const labels = [
                t('guide.steps.selectSize') as string,
                isFree ? (t('guide.steps.registerFree') as string) : (t('guide.steps.payFee') as string),
                isRankingBased ? (t('guide.steps.tradeRanking') as string) : (t('guide.steps.tradeTarget') as string),
              ];
              return (
                <li key={step} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EEF3FD] text-xs font-bold text-[#1B62E8] dark:bg-[#1B62E8]/15 dark:text-[#6B9FF5]">
                    {step}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">{labels[i]}</span>
                </li>
              );
            })}
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E8F5EE] dark:bg-[#1E7D4F]/15">
                <svg className="size-3.5 text-[#1E7D4F] dark:text-[#5AB585]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-slate-600 dark:text-slate-400">
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
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <TrendingUpIcon size={16} className="text-slate-500 dark:text-slate-400" />
              {t('guide.practicalTips') as string}
            </h4>
            <ul className="space-y-2">
              {tips.map(tip => (
                <li key={tip} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Note */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
          <strong className="text-slate-600 dark:text-slate-400">{t('guide.aiNote.title') as string}</strong>
          {' '}
          {t('guide.aiNote.description') as string}
        </div>
      </div>
    </section>
  );
});

GuideSection.displayName = 'GuideSection';
