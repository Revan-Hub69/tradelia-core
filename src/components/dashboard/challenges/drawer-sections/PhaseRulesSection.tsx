/**
 * PHASE RULES SECTION - Vertical Timeline
 * Enterprise component 2026 - Adaptive for Paid Evaluations
 */

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { CheckCircleIcon } from '../PremiumIcons';
import { SectionHeader } from './SectionHeader';

type PhaseRule = {
  phase_number: number;
  phase_name?: string | null;
  profit_target_pct: number | null;
  max_drawdown_pct: number | null;
  max_daily_loss_pct: number | null;
  min_trading_days: number | null;
};

type OfferSummary = {
  account_size: number;
  account_currency: string;
  scaling_max?: number | null;
};

type ProgramSummary = {
  category: 'free_competition' | 'paid_evaluation';
};

type PayoutTerms = {
  profit_split_max: number;
};

type PhaseRulesSectionProps = {
  phases: PhaseRule[];
  offer?: OfferSummary | null;
  program?: ProgramSummary | null;
  payoutTerms?: PayoutTerms | null;
};

const formatMoney = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${Math.round(value).toLocaleString()}`.trim();
  }
};

export function PhaseRulesSection({
  phases,
  offer,
  program,
  payoutTerms,
}: PhaseRulesSectionProps) {
  const t = useTranslations('Challenges') as any;

  const sortedPhases = useMemo(
    () => [...(phases || [])].sort((a, b) => a.phase_number - b.phase_number),
    [phases],
  );

  if (!sortedPhases.length) {
    return null;
  }

  const currency = offer?.account_currency || 'USD';
  const isPaid = program?.category === 'paid_evaluation';

  return (
    <section>
      <SectionHeader
        icon={<CheckCircleIcon size={20} />}
        title={t('phaseRules.title')}
        iconColor="blue"
      />

      <div className="relative mt-4">
        <div className="absolute left-2 top-2 h-full w-px bg-border/70" />

        <div className="space-y-5">
          {sortedPhases.map((phase, index) => {
            const maxLossAmount = phase.max_drawdown_pct && offer
              ? (offer.account_size * phase.max_drawdown_pct) / 100
              : null;
            const dailyLossAmount = phase.max_daily_loss_pct && offer
              ? (offer.account_size * phase.max_daily_loss_pct) / 100
              : null;

            return (
              <div key={`${phase.phase_number}-${index}`} className="relative flex gap-4">
                <div className="relative z-10 mt-1 flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm">
                  {phase.phase_number}
                </div>

                <div className="flex-1 rounded-xl border border-border/60 bg-white/70 p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-foreground">
                      {phase.phase_name || `${t('phaseRules.phase')} ${phase.phase_number}`}
                    </div>
                    {offer && (
                      <div className="text-xs font-medium text-muted-foreground">
                        {t('card.accountSize')}
                        {': '}
                        {formatMoney(offer.account_size, currency)}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {phase.profit_target_pct && (
                      <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2 text-sm">
                        <span className="text-xs uppercase text-muted-foreground">
                          {t('phaseRules.profitTarget')}
                        </span>
                        <div className="font-semibold text-green-700 dark:text-green-300">
                          {phase.profit_target_pct}%
                        </div>
                      </div>
                    )}

                    {phase.max_drawdown_pct && (
                      <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm">
                        <span className="text-xs uppercase text-muted-foreground">
                          {t('phaseRules.maxDrawdown')}
                        </span>
                        <div className="font-semibold text-red-600 dark:text-red-300">
                          {phase.max_drawdown_pct}%
                          {maxLossAmount && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({formatMoney(maxLossAmount, currency)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {phase.max_daily_loss_pct && (
                      <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2 text-sm">
                        <span className="text-xs uppercase text-muted-foreground">
                          {t('phaseRules.dailyLoss')}
                        </span>
                        <div className="font-semibold text-orange-600 dark:text-orange-300">
                          {phase.max_daily_loss_pct}%
                          {dailyLossAmount && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({formatMoney(dailyLossAmount, currency)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {phase.min_trading_days && (
                      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2 text-sm">
                        <span className="text-xs uppercase text-muted-foreground">
                          {t('phaseRules.minDays')}
                        </span>
                        <div className="font-semibold text-blue-600 dark:text-blue-300">
                          {phase.min_trading_days}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isPaid && (
            <div className="relative flex gap-4">
              <div className="relative z-10 mt-1 flex size-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white shadow-sm">
                F
              </div>
              <div className="flex-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {t('phaseRules.funded')}
                </div>
                <div className="mt-2 space-y-1 text-sm text-emerald-700/80 dark:text-emerald-200/80">
                  {payoutTerms?.profit_split_max && (
                    <div>
                      {t('drawer.profitSplit')}
                      {': '}
                      <strong>{payoutTerms.profit_split_max}%</strong>
                    </div>
                  )}
                  {offer?.scaling_max && (
                    <div>
                      {t('pricing.scaling')}
                      {': '}
                      <strong>{formatMoney(offer.scaling_max, currency)}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
