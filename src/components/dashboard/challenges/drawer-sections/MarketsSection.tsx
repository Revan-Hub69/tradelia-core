/**
 * MARKETS SECTION - Program Drawer
 * Modular component following best practices 2026
 */

import { ClockIcon, CommissionIcon, LeverageIcon } from '../PremiumIcons';

type MarketAccess = {
  markets_available: string[];
  platforms: string[];
  instruments_count?: number | null;
  leverage_forex?: string | null;
  leverage_indices?: string | null;
  leverage_commodities?: string | null;
  leverage_crypto?: string | null;
  commission_forex?: number | null;
  commission_indices?: number | null;
  trading_hours?: string | null;
};

type MarketsSectionProps = {
  marketAccess: MarketAccess | null;
};

export function MarketsSection({ marketAccess }: MarketsSectionProps) {
  if (!marketAccess) {
    return null;
  }

  return (
    <section>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <span>📊</span>
        Markets & Platforms
      </h3>

      {/* Available Markets */}
      <div className="mb-4">
        <div className="mb-2 text-sm font-medium">Available Markets</div>
        <div className="flex flex-wrap gap-2">
          {marketAccess.markets_available.map(market => (
            <span
              key={market}
              className="rounded-lg border border-border/50 bg-background px-3 py-1.5 text-xs font-medium capitalize"
            >
              {market}
            </span>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div className="mb-4">
        <div className="mb-2 text-sm font-medium">Trading Platforms</div>
        <div className="flex flex-wrap gap-2">
          {marketAccess.platforms.map(platform => (
            <span
              key={platform}
              className="rounded-lg border border-border/50 bg-background px-3 py-1.5 text-xs font-medium"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>

      {/* Leverage */}
      {(marketAccess.leverage_forex ||
        marketAccess.leverage_indices ||
        marketAccess.leverage_commodities ||
        marketAccess.leverage_crypto) && (
        <div className="mb-4 rounded-xl border border-border/50 bg-muted/30 p-4">
          <div className="mb-3 flex items-center gap-2">
            <LeverageIcon size={20} className="text-purple-600 dark:text-purple-400" />
            <span className="font-medium">Leverage</span>
          </div>
          <ul className="space-y-2 text-sm">
            {marketAccess.leverage_forex && (
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400">✓</span>
                <span>
                  <strong>Forex:</strong>
                  {' '}
                  {marketAccess.leverage_forex}
                </span>
              </li>
            )}
            {marketAccess.leverage_indices && (
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400">✓</span>
                <span>
                  <strong>Indices:</strong>
                  {' '}
                  {marketAccess.leverage_indices}
                </span>
              </li>
            )}
            {marketAccess.leverage_commodities && (
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400">✓</span>
                <span>
                  <strong>Commodities:</strong>
                  {' '}
                  {marketAccess.leverage_commodities}
                </span>
              </li>
            )}
            {marketAccess.leverage_crypto && (
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400">✓</span>
                <span>
                  <strong>Crypto:</strong>
                  {' '}
                  {marketAccess.leverage_crypto}
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Commission */}
      {(marketAccess.commission_forex || marketAccess.commission_indices) && (
        <div className="mb-4 rounded-xl border border-border/50 bg-muted/30 p-4">
          <div className="mb-3 flex items-center gap-2">
            <CommissionIcon size={20} className="text-orange-600 dark:text-orange-400" />
            <span className="font-medium">Commission</span>
          </div>
          <ul className="space-y-2 text-sm">
            {marketAccess.commission_forex && (
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400">✓</span>
                <span>
                  <strong>Forex:</strong>
                  {' '}
                  $
                  {marketAccess.commission_forex}
                  /lot
                </span>
              </li>
            )}
            {marketAccess.commission_indices && (
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400">✓</span>
                <span>
                  <strong>Indices:</strong>
                  {' '}
                  $
                  {marketAccess.commission_indices}
                  /lot
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Trading Hours */}
      {marketAccess.trading_hours && (
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
          <div className="mb-2 flex items-center gap-2">
            <ClockIcon size={20} className="text-blue-600 dark:text-blue-400" />
            <span className="font-medium">Trading Hours</span>
          </div>
          <div className="text-sm text-muted-foreground">{marketAccess.trading_hours}</div>
        </div>
      )}
    </section>
  );
}
