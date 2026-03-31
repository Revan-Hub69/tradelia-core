/*
 * RADAR - Swing Trader Intelligence Terminal
 * Homepage with 3 intelligence cards - Tier 1 Design
 */

'use client';

import { DynamicIcon } from '@/components/icons';
import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';

// Mock Data - UOA (Unusual Options Activity)
const UOA_ALERTS = [
  { ticker: 'TSLA', type: 'Call Volume Spike', strike: '$200', change: '+500%', time: '2h ago', urgency: 'high' },
  { ticker: 'NVDA', type: 'Unusual Put Activity', strike: '$150', change: '+340%', time: '4h ago', urgency: 'medium' },
  { ticker: 'AAPL', type: 'Whale Sweep', strike: '$175', change: '+280%', time: '6h ago', urgency: 'low' },
];

// Mock Data - Smart Money Flows (Insider & Congress)
const SMART_MONEY = [
  { name: 'Nancy Pelosi', ticker: 'NVDA', amount: '$1.5M', type: 'buy', date: '2024-01-15', source: 'Congress' },
  { name: 'Michael Burry', ticker: 'AAPL', amount: '$820K', type: 'buy', date: '2024-01-12', source: '13F' },
  { name: 'Elon Musk', ticker: 'TSLA', amount: '$5.2M', type: 'sell', date: '2024-01-10', source: 'Insider' },
];

// Mock Data - Dark Pool Prints
const DARK_POOL_LEVELS = [
  { ticker: 'AAPL', price: '$175.50', type: 'Wall', volume: '2.5M', level: 'major' },
  { ticker: 'MSFT', price: '$380.20', type: 'Support', volume: '1.8M', level: 'minor' },
  { ticker: 'NVDA', price: '$148.75', type: 'Resistance', volume: '3.2M', level: 'major' },
  { ticker: 'TSLA', price: '$205.00', type: 'Wall', volume: '4.1M', level: 'major' },
];

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

        {/* 3 Card Grid - Bento Style */}
        <div className="grid gap-4 md:grid-cols-2">
          
          {/* Card 1: Unusual Options Activity (UOA) - Featured (2/3 width) */}
          <div className="card-ios-26 group flex flex-col overflow-hidden md:col-span-2">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800">
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
              {UOA_ALERTS.map((alert, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-neutral-50 dark:bg-neutral-900/50 p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-900 dark:text-white w-12">{alert.ticker}</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-neutral-500">{alert.type}</span>
                      <span className="text-xs text-neutral-400">Strike: {alert.strike}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-sm font-medium text-emerald-600 dark:text-emerald-400">{alert.change}</span>
                    <span className="text-xs text-neutral-400">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-neutral-200 dark:border-neutral-800 p-3">
              <button className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:hover:text-neutral-300">
                View All Alerts →
              </button>
            </div>
          </div>

          {/* Card 2: Smart Money Flows */}
          <div className="card-ios-26 group flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <DynamicIcon name="UserIcon" size={20} className="text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-white">Smart Money Flows</h2>
                  <p className="text-xs text-neutral-500">Insider & Congress</p>
                </div>
              </div>
              <span className="rounded border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-500">
                TODAY
              </span>
            </div>
            
            <div className="flex-1 space-y-2 p-3">
              {SMART_MONEY.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-neutral-50 dark:bg-neutral-900/50 p-2.5">
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
              ))}
            </div>
            
            <div className="border-t border-neutral-200 dark:border-neutral-800 p-3">
              <button className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:hover:text-neutral-300">
                View All Activity →
              </button>
            </div>
          </div>

          {/* Card 3: Dark Pool Prints */}
          <div className="card-ios-26 group flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <DynamicIcon name="TrendingUpIcon" size={20} className="text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-white">Dark Pool Prints</h2>
                  <p className="text-xs text-neutral-500">Invisible Levels</p>
                </div>
              </div>
              <span className="rounded border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-500">
                ACTIVE
              </span>
            </div>
            
            <div className="flex-1 space-y-2 p-3">
              {DARK_POOL_LEVELS.map((level, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-neutral-50 dark:bg-neutral-900/50 p-2.5">
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
              ))}
            </div>
            
            <div className="border-t border-neutral-200 dark:border-neutral-800 p-3">
              <button className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:hover:text-neutral-300">
                View All Levels →
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageTransitionWrapper>
  );
}
