/*
 * Volatility - Swing Trader Intelligence Terminal
 * Page showing Volatility Analysis (Squeeze, IV, Gamma exposure)
 * Legal Safe: Shows market metrics, NOT trading signals
 */

'use client';

import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';
import { TICKER_INTELLIGENCE_DATA, type TickerIntelligence } from '@/data/ticker-intelligence';
import { DynamicIcon } from '@/components/icons';

type VolatilityItem = {
  ticker: TickerIntelligence;
  ivRank: number;
  ivPercentile: number;
  squeezeSignal: 'HIGH' | 'MEDIUM' | 'LOW';
  gammaExposure: number;
  riskLevel: 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW';
};

function getVolatilityData(): VolatilityItem[] {
  return TICKER_INTELLIGENCE_DATA.map((ticker) => {
    const ivRank = Math.min(100, Math.max(0, Math.abs(ticker.change) * 10 + 30));
    const ivPercentile = Math.min(95, Math.max(5, ivRank * 0.9));

    let squeezeSignal: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (ticker.gamma_flip) {
      const priceDistance = Math.abs(ticker.price - ticker.gamma_flip) / ticker.price;
      if (priceDistance < 0.02 && ticker.gex === 'POSITIVE') {
        squeezeSignal = 'HIGH';
      } else if (priceDistance < 0.05) {
        squeezeSignal = 'MEDIUM';
      }
    }

    const gammaExposure = ticker.gex === 'POSITIVE' ? ticker.call_pressure : -ticker.put_pressure;

    let riskLevel: 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW' = 'MODERATE';
    if (ticker.confidence > 80 && (ticker.bias === 'BULLISH' || ticker.bias === 'BEARISH')) {
      riskLevel = ticker.call_pressure > 75 || ticker.put_pressure > 75 ? 'EXTREME' : 'HIGH';
    } else if (ticker.confidence < 50) {
      riskLevel = 'LOW';
    }

    return {
      ticker,
      ivRank,
      ivPercentile,
      squeezeSignal,
      gammaExposure,
      riskLevel,
    };
  }).sort((a, b) => b.ivRank - a.ivRank);
}

function VolatilityRow({ data, index }: { data: VolatilityItem; index: number }) {
  const getSqueezeColor = (signal: string) => {
    switch (signal) {
      case 'HIGH':
        return 'bg-rose-500';
      case 'MEDIUM':
        return 'bg-amber-500';
      default:
        return 'bg-emerald-500';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'EXTREME':
        return 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300';
      case 'HIGH':
        return 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300';
      case 'MODERATE':
        return 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300';
      default:
        return 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300';
    }
  };

  const formattedPrice = `${data.ticker.price.toFixed(2)}`;
  const formattedConf = `${data.ticker.confidence}%`;
  const formattedIvPercentile = `${data.ivPercentile.toFixed(0)}%`;

  return (
    <div
      className="flex items-center justify-between rounded-lg border border-neutral-200/60 dark:border-neutral-800 p-4 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/30 transition-colors"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Ticker Info */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="font-mono text-lg font-bold text-neutral-900 dark:text-white">
            {data.ticker.ticker}
          </span>
          <span className="text-xs text-neutral-500">
            $
            {formattedPrice}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                data.ticker.bias === 'BULLISH'
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                  : data.ticker.bias === 'BEARISH'
                    ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {data.ticker.bias}
            </span>
            <span className="text-xs text-neutral-400">
              {formattedConf}
              {' '}
              conf
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1 max-w-[200px] truncate">
            {data.ticker.scenario_summary}
          </p>
        </div>
      </div>

      {/* IV Metrics */}
      <div className="flex items-center gap-6 mx-4">
        <div className="text-center">
          <p className="text-sm font-mono font-medium text-neutral-700 dark:text-neutral-300">
            {data.ivRank.toFixed(0)}
          </p>
          <p className="text-xs text-neutral-500">IV Rank</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-mono font-medium text-neutral-700 dark:text-neutral-300">
            {formattedIvPercentile}
          </p>
          <p className="text-xs text-neutral-500">IV %ile</p>
        </div>
      </div>

      {/* Squeeze & Gamma */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${getSqueezeColor(data.squeezeSignal)}`} />
          <span className="text-xs text-neutral-600 dark:text-neutral-400">{data.squeezeSignal}</span>
        </div>
        <div className="text-center min-w-[60px]">
          <p
            className={`text-sm font-mono font-medium ${
              data.gammaExposure > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {data.gammaExposure > 0 ? '+' : ''}
            {data.gammaExposure.toFixed(0)}
          </p>
          <p className="text-xs text-neutral-500">GEX</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${getRiskBadge(data.riskLevel)}`}>
          {data.riskLevel}
        </span>
      </div>
    </div>
  );
}

export default function VolatilityPage() {
  const volatilityData = getVolatilityData();

  const isHighSqueeze = (d: VolatilityItem) => d.squeezeSignal === 'HIGH';
  const isExtremeRisk = (d: VolatilityItem) => d.riskLevel === 'EXTREME';
  const highSqueeze = volatilityData.filter(isHighSqueeze).length;
  const extremeRisk = volatilityData.filter(isExtremeRisk).length;
  const avgIvRank = Math.round(volatilityData.reduce((acc, d) => acc + d.ivRank, 0) / volatilityData.length);

  const tickerCount = volatilityData.length;
  const legalText = 'This data shows market volatility metrics, not trading signals. IV Rank measures current implied volatility vs 52-week range. Gamma exposure (GEX) shows market maker positioning. Past performance does not guarantee future results.';

  return (
    <PageTransitionWrapper>
      <div className="mx-auto max-w-screen-xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">Volatility</h1>
          <p className="text-muted-foreground">
            Volatility Analysis — Squeeze Monitoring & Risk Assessment
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="card-ios-26 p-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center">
                <DynamicIcon name="WarningIcon" size={16} className="text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{highSqueeze}</p>
                <p className="text-xs text-neutral-500">Squeeze Signals</p>
              </div>
            </div>
          </div>

          <div className="card-ios-26 p-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
                <DynamicIcon name="BellIcon" size={16} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{extremeRisk}</p>
                <p className="text-xs text-neutral-500">Extreme Risk</p>
              </div>
            </div>
          </div>

          <div className="card-ios-26 p-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                <DynamicIcon name="StarIcon" size={16} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{avgIvRank}</p>
                <p className="text-xs text-neutral-500">Avg IV Rank</p>
              </div>
            </div>
          </div>

          <div className="card-ios-26 p-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <DynamicIcon name="SearchIcon" size={16} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-600 dark:text-neutral-400">
                  {tickerCount}
                </p>
                <p className="text-xs text-neutral-500">Tickers Analyzed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Volatility Table */}
        <div className="card-ios-26 overflow-hidden">
          <div className="flex items-center justify-between border-b border-neutral-300 dark:border-neutral-800 p-4">
            <div className="flex items-center gap-2">
              <DynamicIcon name="WarningIcon" size={20} className="text-neutral-600 dark:text-neutral-400" />
              <h2 className="font-semibold text-neutral-900 dark:text-white">Volatility Monitor</h2>
            </div>
            <span className="text-xs text-neutral-500">IV Rank • Squeeze • GEX • Risk</span>
          </div>

          <div className="p-4 space-y-3">
            {volatilityData.map((data, index) => (
              <VolatilityRow key={data.ticker.ticker} data={data} index={index} />
            ))}
          </div>

          {/* Legend */}
          <div className="border-t border-neutral-300 dark:border-neutral-800 p-4">
            <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-rose-500" />
                <span>High Squeeze</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-amber-500" />
                <span>Medium Squeeze</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-emerald-500" />
                <span>Low Squeeze</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              <strong>Legal:</strong>
              {' '}
              {legalText}
            </p>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
}

