/**
 * MARKETS SECTION - Program Drawer
 * Enterprise component 2026 - NO EMOJI
 */

import { useTranslations } from 'next-intl';

import { ClockIcon, CommissionIcon, LeverageIcon, TrendingUpIcon } from '../PremiumIcons';
import { SectionHeader } from './SectionHeader';

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
  const t = useTranslations('Challenges') as any;

  if (!marketAccess) {
    return null;
  }

  return (
    <section>
      <SectionHeader
        icon={<TrendingUpIcon size={20} />}
        title={t('markets.title')}
        iconColor="blue"
      />

      {/* Available Markets */}
      <div className="mb-4">
        <div className="mb-2 text-sm font-medium">{t('markets.available')}</div>
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
        <div className="mb-2 text-sm font-medium">{t('markets.platforms')}</div>
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
            <span className="font-medium">{t('markets.leverage')}</span>
          </div>
          <ul className="space-y-2 text-sm">
            {marketAccess.leverage_forex && (
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 size-4 shrink-0 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  <strong>
{t('markets.forex')}
:
                  </strong>
                  {' '}
                  {marketAccess.leverage_forex}
                </span>
              </li>
            )}
            {marketAccess.leverage_indices && (
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 size-4 shrink-0 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  <strong>
{t('markets.indices')}
:
                  </strong>
                  {' '}
                  {marketAccess.leverage_indices}
                </span>
              </li>
            )}
            {marketAccess.leverage_commodities && (
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 size-4 shrink-0 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  <strong>
{t('markets.commodities')}
:
                  </strong>
                  {' '}
                  {marketAccess.leverage_commodities}
                </span>
              </li>
            )}
            {marketAccess.leverage_crypto && (
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 size-4 shrink-0 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  <strong>
{t('markets.crypto')}
:
                  </strong>
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
            <span className="font-medium">{t('markets.commission')}</span>
          </div>
          <ul className="space-y-2 text-sm">
            {marketAccess.commission_forex && (
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 size-4 shrink-0 text-orange-600 dark:text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  <strong>
{t('markets.forex')}
:
                  </strong>
                  {' '}
                  $
                  {marketAccess.commission_forex}
                  {t('markets.perLot')}
                </span>
              </li>
            )}
            {marketAccess.commission_indices && (
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 size-4 shrink-0 text-orange-600 dark:text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  <strong>
{t('markets.indices')}
:
                  </strong>
                  {' '}
                  $
                  {marketAccess.commission_indices}
                  {t('markets.perLot')}
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
            <span className="font-medium">{t('markets.tradingHours')}</span>
          </div>
          <div className="text-sm text-muted-foreground">{marketAccess.trading_hours}</div>
        </div>
      )}
    </section>
  );
}
