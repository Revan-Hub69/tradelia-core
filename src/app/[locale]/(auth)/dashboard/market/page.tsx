/*
 * MARKET OVERVIEW - ETF & Macro Intelligence
 * Shows major indices and sector ETFs with status and performance
 */

'use client';

import { DynamicIcon } from '@/components/icons';
import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';
import { SECTOR_ROTATION_DATA, type SectorRotation } from '@/data/ticker-intelligence';

// Mock ETF data for market overview
const ETF_DATA = [
  { ticker: 'SPY', name: 'S&P 500', price: 502.34, change: 0.85, bias: 'BULLISH' as const },
  { ticker: 'QQQ', name: 'Nasdaq 100', price: 438.12, change: 1.12, bias: 'BULLISH' as const },
  { ticker: 'DIA', name: 'Dow Jones', price: 389.45, change: 0.45, bias: 'NEUTRAL' as const },
  { ticker: 'IWM', name: 'Russell 2000', price: 198.67, change: -0.32, bias: 'BEARISH' as const },
  { ticker: 'VIX', name: 'Volatility', price: 14.23, change: -2.15, bias: 'NEUTRAL' as const },
];

const getBiasColor = (bias: string) => {
  switch (bias) {
    case 'BULLISH':
      return 'bg-emerald-500';
    case 'BEARISH':
      return 'bg-rose-500';
    default:
      return 'bg-neutral-400';
  }
};

const getBiasTextColor = (bias: string) => {
  switch (bias) {
    case 'BULLISH':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'BEARISH':
      return 'text-rose-600 dark:text-rose-400';
    default:
      return 'text-neutral-500';
  }
};

function EtfCard({ etf, index }: { etf: typeof ETF_DATA[0]; index: number }) {
  return (
    <div
      className="card-ios-26 cursor-pointer p-4 transition-transform hover:scale-[1.01]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
            <span className="font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400">
              {etf.ticker}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">{etf.name}</h3>
            <span className={`text-xs ${getBiasTextColor(etf.bias)}`}>
              {etf.bias}
            </span>
          </div>
        </div>
        <div className={`rounded px-2 py-1 text-xs ${getBiasTextColor(etf.bias)} bg-opacity-10`}>
          {etf.bias}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xl font-bold text-neutral-900 dark:text-white">
            $
{etf.price.toFixed(2)}
          </p>
        </div>
        <div className={`font-mono text-lg font-semibold ${
          etf.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
        }`}
        >
          {etf.change >= 0 ? '+' : ''}
{etf.change.toFixed(2)}
%
        </div>
      </div>
    </div>
  );
}

function SectorHeatmap({ sectors }: { sectors: SectorRotation[] }) {
  return (
    <div className="card-ios-26 overflow-hidden">
      <div className="flex items-center justify-between border-b border-neutral-300 p-4 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <DynamicIcon name="TrendingUpIcon" size={20} className="text-neutral-600 dark:text-neutral-400" />
          <h2 className="font-semibold text-neutral-900 dark:text-white">Sector Heatmap</h2>
        </div>
        <span className="text-xs text-neutral-500">Sorted by dominance</span>
      </div>

      <div className="grid grid-cols-4 gap-2 p-4">
        {sectors.map(sector => (
          <div
            key={sector.sector}
            className={`rounded-lg border p-3 ${
              sector.bias === 'BULLISH'
                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30'
                : sector.bias === 'BEARISH'
                  ? 'border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30'
                  : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/30'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {sector.etf}
              </span>
              <div className={`size-2 rounded-full ${getBiasColor(sector.bias)}`} />
            </div>
            <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">
              {sector.sector}
            </p>
            <p className="mt-1 font-mono text-sm font-semibold text-neutral-900 dark:text-white">
              {(sector.dominance * 100).toFixed(0)}
%
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 border-t border-neutral-300 p-3 text-xs text-neutral-500 dark:border-neutral-800">
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-emerald-500" />
          <span>Bullish</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-neutral-400" />
          <span>Neutral</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-rose-500" />
          <span>Bearish</span>
        </div>
      </div>
    </div>
  );
}

function SectorList({ sectors }: { sectors: SectorRotation[] }) {
  const formatVolume = (vol: number) => {
    if (vol >= 1e9) {
 return `$${(vol / 1e9).toFixed(1)}B`;
}
    return `$${(vol / 1e6).toFixed(0)}M`;
  };

  return (
    <div className="card-ios-26 overflow-hidden">
      <div className="flex items-center justify-between border-b border-neutral-300 p-4 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <DynamicIcon name="TrendingUpIcon" size={20} className="text-neutral-600 dark:text-neutral-400" />
          <h2 className="font-semibold text-neutral-900 dark:text-white">Sector Rotation</h2>
        </div>
        <span className="text-xs text-neutral-500">Flow dominance</span>
      </div>

      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {sectors.map((sector, index) => (
          <div
            key={sector.sector}
            className="flex items-center justify-between p-4 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900/30"
          >
            <div className="flex items-center gap-3">
              <span className="w-4 text-xs text-neutral-400">{index + 1}</span>
              <div className="flex size-8 items-center justify-center rounded border border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
                <span className="font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400">
                  {sector.etf}
                </span>
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">{sector.sector}</p>
                <p className="text-xs text-neutral-500">{formatVolume(sector.volume)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24">
                <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div
                    className={`h-full rounded-full ${getBiasColor(sector.bias)}`}
                    style={{ width: `${sector.dominance * 100}%` }}
                  />
                </div>
              </div>
              <span className={`rounded px-2 py-0.5 text-xs ${getBiasTextColor(sector.bias)} bg-opacity-10`}>
                {sector.bias}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketOverviewPage() {
  const sortedSectors = [...SECTOR_ROTATION_DATA].sort((a, b) => b.dominance - a.dominance);

  return (
    <PageTransitionWrapper>
      <div className="mx-auto max-w-screen-xl space-y-6 pb-20">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">Market Overview</h1>
          <p className="text-muted-foreground">
            ETF performance and sector rotation analysis
          </p>
        </div>

        {/* Major Indices */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
            Major Indices
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ETF_DATA.map((etf, index) => (
              <EtfCard key={etf.ticker} etf={etf} index={index} />
            ))}
          </div>
        </div>

        {/* Sector Heatmap */}
        <SectorHeatmap sectors={sortedSectors} />

        {/* Sector Rotation List */}
        <SectorList sectors={sortedSectors} />

        {/* Legal Disclaimer */}
        <div className="rounded-lg bg-neutral-100 p-4 text-xs text-neutral-500 dark:bg-neutral-900/50">
          <strong>Disclaimer:</strong>
{' '}
This data shows market metrics and sector rotation patterns.
          Not a recommendation to buy or sell. Past performance does not guarantee future results.
        </div>
      </div>
    </PageTransitionWrapper>
  );
}
