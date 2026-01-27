/**
 * PHASE RULES SECTION - Program Drawer
 * Enterprise component 2026 - Adaptive for Paid Evaluations
 *
 * Shows detailed phase-by-phase rules for prop firm challenges
 * Only visible when category === 'paid_evaluation'
 */

import { useTranslations } from 'next-intl';

import { CheckCircleIcon, ProfitTargetIcon } from '../PremiumIcons';
import { SectionHeader } from './SectionHeader';

type PhaseRule = {
  phase_number: number;
  phase_name?: string;
  profit_target_pct: number | null;
  max_drawdown_pct: number | null;
  max_daily_loss_pct: number | null;
  min_trading_days: number | null;
  time_limit_days?: number | null;
};

type PhaseRulesSectionProps = {
  phases: PhaseRule[];
};

export function PhaseRulesSection({ phases }: PhaseRulesSectionProps) {
  const t = useTranslations('Challenges') as any;

  if (!phases || phases.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeader
        icon={<CheckCircleIcon size={20} />}
        title={t('phaseRules.title')}
        iconColor="blue"
      />

      <div className="space-y-3 sm:space-y-4 lg:space-y-5">
        {phases.map(phase => (
          <div
            key={phase.phase_number}
            className="rounded-xl border border-border/50 bg-muted/30 p-4 sm:p-5 lg:p-6"
          >
            {/* Phase Header */}
            <div className="mb-3 flex items-center justify-between sm:mb-4 lg:mb-5">
              <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/20 text-sm font-bold text-blue-600 dark:text-blue-400 sm:size-10 sm:text-base lg:size-12 lg:text-lg">
                  {phase.phase_number}
                </div>
                <div>
                  <div className="text-sm font-bold sm:text-base lg:text-lg">
                    {phase.phase_name || `${t('phaseRules.phase')} ${phase.phase_number}`}
                  </div>
                  {phase.time_limit_days && (
                    <div className="text-xs text-muted-foreground sm:text-sm">
                      {phase.time_limit_days}
                      {' '}
                      {t('phaseRules.daysLimit')}
                    </div>
                  )}
                </div>
              </div>
              {phase.phase_number === phases.length && (
                <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-600 dark:text-green-400 sm:px-3 sm:text-sm">
                  {t('phaseRules.funded')}
                </span>
              )}
            </div>

            {/* Phase Metrics */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4 lg:gap-4">
              {phase.profit_target_pct && (
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-2.5 sm:p-3 lg:col-span-1">
                  <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ProfitTargetIcon size={14} />
                    {t('phaseRules.profitTarget')}
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400 sm:text-xl lg:text-2xl">
                    {phase.profit_target_pct}
                    %
                  </div>
                </div>
              )}

              {phase.max_drawdown_pct && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-2.5 sm:p-3 lg:col-span-1">
                  <div className="mb-1 text-xs text-muted-foreground">
                    {t('phaseRules.maxDrawdown')}
                  </div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-400 sm:text-xl lg:text-2xl">
                    {phase.max_drawdown_pct}
                    %
                  </div>
                </div>
              )}

              {phase.max_daily_loss_pct && (
                <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-2.5 sm:p-3 lg:col-span-1">
                  <div className="mb-1 text-xs text-muted-foreground">
                    {t('phaseRules.dailyLoss')}
                  </div>
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400 sm:text-xl lg:text-2xl">
                    {phase.max_daily_loss_pct}
                    %
                  </div>
                </div>
              )}

              {phase.min_trading_days && (
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-2.5 sm:p-3 lg:col-span-1">
                  <div className="mb-1 text-xs text-muted-foreground">
                    {t('phaseRules.minDays')}
                  </div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400 sm:text-xl lg:text-2xl">
                    {phase.min_trading_days}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
