/**
 * RISK RULES SECTION - Program Drawer
 * Enterprise component 2026 - NO EMOJI
 */

import { useTranslations } from 'next-intl';

import { DailyLossIcon } from '../PremiumIcons';
import { SectionHeader } from './SectionHeader';

type Ruleset = {
  phase_number: number;
  profit_target_pct: number | null;
  max_drawdown_pct: number | null;
  max_drawdown_type?: string;
  max_daily_loss_pct: number | null;
  max_daily_loss_type?: string;
  min_trading_days: number | null;
  consistency_required?: boolean;
  best_day_max_pct?: number | null;
};

type RiskRulesSectionProps = {
  rulesets: Ruleset[];
};

export function RiskRulesSection({ rulesets }: RiskRulesSectionProps) {
  const t = useTranslations('Challenges') as any;

  return (
    <section>
      <SectionHeader
        icon={<DailyLossIcon size={20} />}
        title={t('drawer.sections.riskRules')}
        iconColor="red"
      />
      {rulesets.map(ruleset => (
        <div key={ruleset.phase_number} className="mb-4 space-y-3">
          {ruleset.phase_number > 1 && (
            <div className="text-sm font-bold text-muted-foreground">
              {t('drawer.sections.phase')}
              {' '}
              {ruleset.phase_number}
            </div>
          )}

          <ul className="space-y-2 text-sm">
            {ruleset.profit_target_pct && (
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  <strong>
{t('drawer.sections.profitTarget')}
:
                  </strong>
                  {' '}
                  {ruleset.profit_target_pct}
                  %
                </span>
              </li>
            )}
            {ruleset.max_drawdown_pct && (
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>
                  <strong>
{t('drawer.sections.maxDrawdown')}
:
                  </strong>
                  {' '}
                  {ruleset.max_drawdown_pct}
                  %
                  {' '}
                  {ruleset.max_drawdown_type && `(${ruleset.max_drawdown_type.replace('_', ' ')})`}
                </span>
              </li>
            )}
            {ruleset.max_daily_loss_pct && (
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 size-4 shrink-0 text-orange-600 dark:text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>
                  <strong>
{t('drawer.sections.maxDailyLoss')}
:
                  </strong>
                  {' '}
                  {ruleset.max_daily_loss_pct}
                  %
                  {' '}
                  {ruleset.max_daily_loss_type && `(${ruleset.max_daily_loss_type.replace('_', ' ')})`}
                </span>
              </li>
            )}
            {ruleset.min_trading_days && (
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  <strong>
{t('drawer.sections.minTradingDays')}
:
                  </strong>
                  {' '}
                  {ruleset.min_trading_days}
                  {' '}
                  {t('drawer.sections.days')}
                </span>
              </li>
            )}
            {ruleset.consistency_required && ruleset.best_day_max_pct && (
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 size-4 shrink-0 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  <strong>
{t('drawer.sections.consistencyRule')}
:
                  </strong>
                  {' '}
                  {t('drawer.sections.bestDayMax', { percent: ruleset.best_day_max_pct })}
                </span>
              </li>
            )}
          </ul>
        </div>
      ))}
    </section>
  );
}
