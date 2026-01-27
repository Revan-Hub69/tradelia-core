/**
 * RISK RULES SECTION - Program Drawer
 * Modular component following best practices
 */

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
  return (
    <section>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <span>⚠️</span>
        Risk Rules
      </h3>
      {rulesets.map(ruleset => (
        <div key={ruleset.phase_number} className="mb-4 space-y-3">
          {ruleset.phase_number > 1 && (
            <div className="text-sm font-bold text-muted-foreground">
              Phase
              {' '}
              {ruleset.phase_number}
            </div>
          )}

          <ul className="space-y-2 text-sm">
            {ruleset.profit_target_pct && (
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>
                  <strong>Profit Target:</strong>
                  {' '}
                  {ruleset.profit_target_pct}
                  %
                </span>
              </li>
            )}
            {ruleset.max_drawdown_pct && (
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400">⚠</span>
                <span>
                  <strong>Max Drawdown:</strong>
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
                <span className="text-orange-600 dark:text-orange-400">⚠</span>
                <span>
                  <strong>Max Daily Loss:</strong>
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
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                <span>
                  <strong>Min Trading Days:</strong>
                  {' '}
                  {ruleset.min_trading_days}
                  {' '}
                  days
                </span>
              </li>
            )}
            {ruleset.consistency_required && ruleset.best_day_max_pct && (
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400">✓</span>
                <span>
                  <strong>Consistency Rule:</strong>
                  {' '}
                  Best day max
                  {' '}
                  {ruleset.best_day_max_pct}
                  % of total profit
                </span>
              </li>
            )}
          </ul>
        </div>
      ))}
    </section>
  );
}
