/*
 * Structure - Swing Trader Intelligence Terminal
 * Page showing Sector Rotation (Dark pool and key levels)
 * Legal Safe: Shows market allocation pressure, NOT trading signals
 */

'use client';

import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';
import {
  getSectorRotation,
  formatSectorVolume,
  formatDelta,
  type SectorRotation,
} from '@/data/ticker-intelligence';
import { DynamicIcon } from '@/components/icons';

function SectorRow({ sector, index }: { sector: SectorRotation; index: number }) {
  return (
    <div
      className="flex items-center justify-between rounded-lg border border-neutral-200/60 dark:border-neutral-800 p-4 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/30 transition-colors"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Sector & ETF */}
      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
          <span className="font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400">
            {sector.etf}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">{sector.sector}</h3>
          <p className="text-xs text-neutral-500">Options flow dominance</p>
        </div>
      </div>

      {/* Dominance Bar */}
      <div className="flex-1 mx-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                sector.bias === 'BULLISH'
                  ? 'bg-emerald-500'
                  : sector.bias === 'BEARISH'
                    ? 'bg-rose-500'
                    : 'bg-neutral-400'
              }`}
              style={{ width: `${sector.dominance * 100}%` }}
            />
          </div>
          <span className="font-mono text-sm font-medium text-neutral-700 dark:text-neutral-300 w-12 text-right">
            {(sector.dominance * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Delta & Bias */}
      <div className="flex items-center gap-4">
        <span
          className={`text-sm font-mono ${
            sector.delta > 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : sector.delta < 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-neutral-500'
          }`}
        >
          {formatDelta(sector.delta)}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded ${
            sector.bias === 'BULLISH'
              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
              : sector.bias === 'BEARISH'
                ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          {sector.bias}
        </span>
      </div>
    </div>
  );
}

export default function StructurePage() {
  const sectors = getSectorRotation();

  // Calculate summary stats
  const isBullish = (s: SectorRotation) => s.bias === 'BULLISH';
  const isBearish = (s: SectorRotation) => s.bias === 'BEARISH';
  const isNeutral = (s: SectorRotation) => s.bias === 'NEUTRAL';
  const bullishSectors = sectors.filter(isBullish).length;
  const bearishSectors = sectors.filter(isBearish).length;
  const neutralSectors = sectors.filter(isNeutral).length;
  const totalVolume = sectors.reduce((acc, s) => acc + s.volume, 0);

  return (
    <PageTransitionWrapper>
      <div className="mx-auto max-w-screen-xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">Structure</h1>
          <p className="text-muted-foreground">
            Sector Rotation Analysis — Market Allocation Pressure
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="card-ios-26 p-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
                <DynamicIcon name="TrendingUpIcon" size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{bullishSectors}</p>
                <p className="text-xs text-neutral-500">Bullish Sectors</p>
              </div>
            </div>
          </div>

          <div className="card-ios-26 p-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center">
                <DynamicIcon name="WarningIcon" size={16} className="text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{bearishSectors}</p>
                <p className="text-xs text-neutral-500">Bearish Sectors</p>
              </div>
            </div>
          </div>

          <div className="card-ios-26 p-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <DynamicIcon name="MinusIcon" size={16} className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-600 dark:text-neutral-400">{neutralSectors}</p>
                <p className="text-xs text-neutral-500">Neutral Sectors</p>
              </div>
            </div>
          </div>

          <div className="card-ios-26 p-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                <DynamicIcon name="StarIcon" size={16} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatSectorVolume(totalVolume)}</p>
                <p className="text-xs text-neutral-500">Total Options Volume</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Rotation Table */}
        <div className="card-ios-26 overflow-hidden">
          <div className="flex items-center justify-between border-b border-neutral-300 dark:border-neutral-800 p-4">
            <div className="flex items-center gap-2">
              <DynamicIcon name="SearchIcon" size={20} className="text-neutral-600 dark:text-neutral-400" />
              <h2 className="font-semibold text-neutral-900 dark:text-white">Sector Rotation</h2>
            </div>
            <span className="text-xs text-neutral-500">Call vs Put dominance • 24h</span>
          </div>

          <div className="p-4 space-y-3">
            {sectors.map((sector, index) => (
              <SectorRow key={sector.etf} sector={sector} index={index} />
            ))}
          </div>

          {/* Legal Disclaimer */}
          <div className="border-t border-neutral-300 dark:border-neutral-800 p-4">
            <p className="text-xs text-neutral-400">
              <strong>Legal:</strong> This data shows market allocation pressure, not trading signals.
              Sector dominance calculated from options flow (call vs put volume).
              Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
}