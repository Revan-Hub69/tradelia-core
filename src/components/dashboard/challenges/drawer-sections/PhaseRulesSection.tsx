/**
 * PHASE RULES SECTION - Vertical Timeline
 * Enterprise component 2026
 * Palette: desaturated semantic tokens, single institutional accent
 */

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { CheckCircleIcon } from '@/components/icons/unified';
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
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
  } catch {
    return `${currency} ${Math.round(value).toLocaleString()}`.trim();
  }
};

export function PhaseRulesSection({ phases, offer, program, payoutTerms }: PhaseRulesSectionProps) {
  const t = useTranslations('Challenges') as any;

  const sortedPhases = useMemo(
    () => [...(phases || [])].sort((a, b) => a.phase_number - b.phase_number),
    [phases],
  );

  if (!sortedPhases.length) return null;

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
        {/* Timeline line */}
        <div className="absolute left-2 top-2 h-full w-px bg-slate-200 dark:bg-slate-800" />

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
                {/* Step dot */}
                <div className="relative z-10 mt-1 flex size-5 items-center justify-center rounded-full bg-[#1B62E8] text-[10px] font-bold text-white shadow-sm shadow-black/10">
                  {phase.phase_number}
                </div>

                <div className="flex-1 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-black/4 dark:border-slate-800/80 dark:bg-slate-900">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {phase.phase_name || `${t('phaseRules.phase')} ${phase.phase_number}`}
                    </div>
                    {offer && (
                      <div className="text-xs font-medium text-slate-400 dark:text-slate-500">
                        {t('card.accountSize')}{': '}{formatMoney(offer.account_size, currency)}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {phase.profit_target_pct && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                        <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          {t('phaseRules.profitTarget')}
                        </span>
                        <div className="font-semibold text-[#1E7D4F] dark:text-[#5AB585]">
                          {phase.profit_target_pct}%
                        </div>
                      </div>
                    )}

                    {phase.max_drawdown_pct && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                        <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          {t('phaseRules.maxDrawdown')}
                        </span>
                        <div className="font-semibold text-[#C0373A] dark:text-[#E07A7C]">
                          {phase.max_drawdown_pct}%
                          {maxLossAmount && (
                            <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">
                              ({formatMoney(maxLossAmount, currency)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {phase.max_daily_loss_pct && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                        <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          {t('phaseRules.dailyLoss')}
                        </span>
                        <div className="font-semibold text-[#A05C00] dark:text-[#D4956A]">
                          {phase.max_daily_loss_pct}%
                          {dailyLossAmount && (
                            <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">
                              ({formatMoney(dailyLossAmount, currency)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {phase.min_trading_days && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                        <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          {t('phaseRules.minDays')}
                        </span>
                        <div className="font-semibold text-slate-700 dark:text-slate-300">
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
              <div className="relative z-10 mt-1 flex size-5 items-center justify-center rounded-full bg-[#1E7D4F] text-[10px] font-bold text-white shadow-sm shadow-black/10">
                <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-sm font-semibold text-[#1E7D4F] dark:text-[#5AB585]">
                  {t('phaseRules.funded')}
                </div>
                <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {payoutTerms?.profit_split_max && (
                    <div>
                      {t('drawer.profitSplit')}{': '}
                      <strong className="text-slate-900 dark:text-slate-100">{payoutTerms.profit_split_max}%</strong>
                    </div>
                  )}
                  {offer?.scaling_max && (
                    <div>
                      {t('pricing.scaling')}{': '}
                      <strong className="text-slate-900 dark:text-slate-100">{formatMoney(offer.scaling_max, currency)}</strong>
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
