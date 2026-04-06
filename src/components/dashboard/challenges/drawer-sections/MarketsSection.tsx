/**
 * MARKETS SECTION - Program Drawer
 * Enterprise component 2026
 * Palette: single institutional accent, no purple/orange icon overrides
 */

import { useTranslations } from 'next-intl';
import { SectionHeader } from './SectionHeader';

type MarketAccess = {
  markets_available: string[] | string;
  platforms: string[] | string;
  instruments_count?: number | null;
  leverage_forex?: string | null;
  leverage_indices?: string | null;
  leverage_commodities?: string | null;
  leverage_crypto?: string | null;
  commission_forex?: number | null;
  commission_indices?: number | null;
  trading_hours?: string | null;
};

const _parseArrayField = (value: string[] | string | null | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return [value];
    }
  }
  return [];
};

type MarketsSectionProps = {
  marketAccess: MarketAccess | null;
};

// Custom markets header SVG — chart with upward path
const MarketsHeaderIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

// Custom leverage SVG — scale/balance
const LeverageHeaderIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="3" x2="12" y2="21" />
    <path d="M5 8l7-5 7 5" />
    <path d="M5 8c0 2.5 2 4 4 4s4-1.5 4-4" />
    <path d="M15 16c0 2.5-2 4-4 4s-4-1.5-4-4h8z" />
  </svg>
);

// Custom commission SVG — dollar circle
const CommissionHeaderIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

// Custom clock SVG — trading hours
const ClockHeaderIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const BulletIcon = () => (
  <svg className="mt-0.5 size-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export function MarketsSection({ marketAccess }: MarketsSectionProps) {
  const t = useTranslations('Challenges') as any;

  if (!marketAccess) return null;

  const marketsAvailable = _parseArrayField(marketAccess?.markets_available);
  const platforms = _parseArrayField(marketAccess?.platforms);

  return (
    <section>
      <SectionHeader
        icon={<MarketsHeaderIcon size={20} />}
        title={t('markets.title')}
        iconColor="blue"
      />

      {/* Available Markets */}
      {marketsAvailable.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('markets.available')}</div>
          <div className="flex flex-wrap gap-1.5">
            {marketsAvailable.map(market => (
              <span
                key={market}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium capitalize text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              >
                {market}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Platforms */}
      {platforms.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('markets.platforms')}</div>
          <div className="flex flex-wrap gap-1.5">
            {platforms.map(platform => (
              <span
                key={platform}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Leverage */}
      {(marketAccess.leverage_forex || marketAccess.leverage_indices || marketAccess.leverage_commodities || marketAccess.leverage_crypto) && (
        <div className="mb-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-black/4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <LeverageHeaderIcon />
            {t('markets.leverage')}
          </div>
          <ul className="space-y-2 text-sm">
            {marketAccess.leverage_forex && (
              <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <BulletIcon />
                <span><strong className="text-slate-700 dark:text-slate-300">{t('markets.forex')}:</strong> {marketAccess.leverage_forex}</span>
              </li>
            )}
            {marketAccess.leverage_indices && (
              <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <BulletIcon />
                <span><strong className="text-slate-700 dark:text-slate-300">{t('markets.indices')}:</strong> {marketAccess.leverage_indices}</span>
              </li>
            )}
            {marketAccess.leverage_commodities && (
              <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <BulletIcon />
                <span><strong className="text-slate-700 dark:text-slate-300">{t('markets.commodities')}:</strong> {marketAccess.leverage_commodities}</span>
              </li>
            )}
            {marketAccess.leverage_crypto && (
              <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <BulletIcon />
                <span><strong className="text-slate-700 dark:text-slate-300">{t('markets.crypto')}:</strong> {marketAccess.leverage_crypto}</span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Commission */}
      {(marketAccess.commission_forex || marketAccess.commission_indices) && (
        <div className="mb-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-black/4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <CommissionHeaderIcon />
            {t('markets.commission')}
          </div>
          <ul className="space-y-2 text-sm">
            {marketAccess.commission_forex && (
              <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <BulletIcon />
                <span><strong className="text-slate-700 dark:text-slate-300">{t('markets.forex')}:</strong> ${marketAccess.commission_forex}{t('markets.perLot')}</span>
              </li>
            )}
            {marketAccess.commission_indices && (
              <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <BulletIcon />
                <span><strong className="text-slate-700 dark:text-slate-300">{t('markets.indices')}:</strong> ${marketAccess.commission_indices}{t('markets.perLot')}</span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Trading Hours */}
      {marketAccess.trading_hours && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-black/4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <ClockHeaderIcon />
            {t('markets.tradingHours')}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{marketAccess.trading_hours}</div>
        </div>
      )}
    </section>
  );
}
