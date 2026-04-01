/*
 * RADAR - Swing Trader Intelligence Terminal
 * Homepage with 3 intelligence cards - Tier 1 Design
 */

'use client';

import { DynamicIcon } from '@/components/icons';
import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';
import { TICKER_INTELLIGENCE_DATA, getTopBullish, getTopBearish, formatSize, type TickerIntelligence } from '@/data/ticker-intelligence';
import Link from 'next/link';

// Get data from mock dataset
const uoaAlerts = TICKER_INTELLIGENCE_DATA
  .filter(t => t.bias === 'BULLISH' || t.bias === 'VOLATILE')
  .slice(0, 3)
  .map(t => ({
    ticker: t.ticker,
    type: t.flow_3d.replace('_', ' '),
    strike: `${t.key_strikes[0]}`,
    change: `+${t.call_pressure}%`,
    time: '1h ago',
    urgency: t.confidence > 70 ? 'high' : 'medium' as const
  }));

const smartMoney = getTopBullish(3).map(t => ({
  name: t.ticker,
  ticker: t.ticker,
  amount: formatSize(Math.floor(Math.random() * 5000000) + 500000),
  type: t.bias === 'BULLISH' ? 'buy' as const : 'sell' as const,
  date: new Date().toISOString().split('T')[0],
  source: 'Flow'
}));

const darkPoolLevels = TICKER_INTELLIGENCE_DATA.slice(0, 4).map(t => ({
  ticker: t.ticker,
  price: `${t.price.toFixed(2)}`,
  type: t.gex === 'POSITIVE' ? 'Support' : t.gex === 'NEGATIVE' ? 'Wall' : 'Neutral' as const,
  volume: formatSize(Math.floor(Math.random() * 5000000) + 500000),
  level: t.confidence > 70 ? 'major' as const : 'minor' as const
}));

export default function RadarPage() {
  return (
    <PageTransitionWrapper>
      <div className="mx-auto max-w-screen-xl space-y-8 pb-20">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">RADAR</h1>
          <p className="text-muted-foreground">
            Swing Trader Intelligence Terminal
          </p>
        </div>

        {/* 3 Card Grid - Bento Style (2+1 asymmetric) */}
        <div className="grid gap-4 md:grid-cols-3">
          
          {/* Card 1: Unusual Options Activity (UOA) - Featured (2/3 width) */}
          <div className="card-ios-26 group flex flex-col overflow-hidden md:col-span-2">
            <div className="flex items-center justify-between border-b border-neutral-300 dark:border-neutral-800 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-800">
                  <DynamicIcon name="WarningIcon" size={20} className="text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-white">Unusual Options Activity</h2>
                  <p className="text-xs text-neutral-500">Volatility Alerts</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
                LIVE
              </span>
            </div>
            
            <div className="flex-1 space-y-2 p-3">
              {uoaAlerts.map((alert, i) => (
                <Link key={i} href={`/dashboard/${alert.ticker}`} className="block">
                  <div className="flex items-center justify-between rounded-md bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-transparent p-2.5 hover:bg-neutral-200 dark:hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900 dark:text-white w-12">{alert.ticker}</span>
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-600">{alert.type}</span>
                        <span className="text-xs text-neutral-400">Strike: {alert.strike}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block font-mono text-sm font-medium text-emerald-600 dark:text-emerald-400">{alert.change}</span>
                      <span className="text-xs text-neutral-400">{alert.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="border-t border-neutral-300 dark:border-neutral-800 p-3">
              <button className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:hover:text-neutral-300">
                View All Alerts →
              </button>
            </div>
          </div>

          {/* Right Column - Smart Money + Dark Pool stacked */}
          <div className="flex flex-col gap-4">

          {/* Card 2: Smart Money Flows */}
          <div className="card-ios-26 group flex flex-col overflow-hidden flex-1">
            <div className="flex items-center justify-between border-b border-neutral-300 dark:border-neutral-800 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-800">
                  <DynamicIcon name="UserIcon" size={20} className="text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-white">Smart Money Flows</h2>
                  <p className="text-xs text-neutral-500">Insider & Congress</p>
                </div>
              </div>
              <span className="rounded border border-neutral-300 dark:border-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-500">
                TODAY
              </span>
            </div>
            
            <div className="flex-1 space-y-2 p-3">
              {smartMoney.map((item, i) => (
                <Link key={i} href={`/dashboard/${item.ticker}`} className="block">
                  <div className="flex items-center justify-between rounded-md bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-transparent p-2.5 hover:bg-neutral-200 dark:hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400 w-8 shrink-0">
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-900 dark:text-white text-sm truncate max-w-[80px]">{item.name}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            item.type === 'buy' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                          }`}>
                            {item.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <span className="font-mono text-neutral-600 dark:text-neutral-400">{item.ticker}</span>
                          <span>•</span>
                          <span>{item.source}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`block font-mono text-sm font-medium ${
                        item.type === 'buy' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {item.type === 'buy' ? '+' : '-'}{item.amount}
                      </span>
                      <span className="text-xs text-neutral-400">{item.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="border-t border-neutral-300 dark:border-neutral-800 p-3">
              <button className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:hover:text-neutral-300">
                View All Activity →
              </button>
            </div>
          </div>

          {/* Card 3: Dark Pool Prints */}
          <div className="card-ios-26 group flex flex-col overflow-hidden flex-1">
            <div className="flex items-center justify-between border-b border-neutral-300 dark:border-neutral-800 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-800">
                  <DynamicIcon name="TrendingUpIcon" size={20} className="text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-white">Dark Pool Prints</h2>
                  <p className="text-xs text-neutral-500">Invisible Levels</p>
                </div>
              </div>
              <span className="rounded border border-neutral-300 dark:border-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-500">
                ACTIVE
              </span>
            </div>
            
            <div className="flex-1 space-y-2 p-3">
              {darkPoolLevels.map((level, i) => (
                <Link key={i} href={`/dashboard/${level.ticker}`} className="block">
                  <div className="flex items-center justify-between rounded-md bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-transparent p-2.5 hover:bg-neutral-200 dark:hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900 dark:text-white w-12">{level.ticker}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        level.type === 'Wall' ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' :
                        level.type === 'Support' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' :
                        'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                      }`}>
                        {level.type}
                      </span>
                      {level.level === 'major' && (
                        <span className="text-xs text-neutral-400">★</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="block font-mono text-sm font-medium text-neutral-700 dark:text-neutral-300">{level.price}</span>
                      <span className="text-xs text-neutral-400">{level.volume}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="border-t border-neutral-300 dark:border-neutral-800 p-3">
              <button className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:hover:text-neutral-300">
                View All Levels →
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
}
