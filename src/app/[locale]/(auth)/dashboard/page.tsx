/*
 * RADAR - Swing Trader Intelligence Terminal
 * Homepage with 3 intelligence cards - Tier 1 Design
 */

'use client';

import { DynamicIcon, type IconName } from '@/components/icons';
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
      <div className="mx-auto max-w-screen-xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">RADAR</h1>
          <p className="text-muted-foreground">
            Swing Trader Intelligence Terminal
          </p>
        </div>

        {/* 3 Card Grid - Bento Style */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Card 1: Unusual Options Activity (UOA) */}
          <div className="card-ios-26 group flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10">
                  <DynamicIcon name="WarningIcon" size={20} className="text-red-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Unusual Options Activity</h2>
                  <p className="text-xs text-muted-foreground">Volatility Alerts</p>
                </div>
              </div>
              <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs font-medium text-red-500">
                LIVE
              </span>
            </div>
            
            <div className="flex-1 space-y-2 p-4">
              {UOA_ALERTS.map((alert, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-red-400">{alert.ticker}</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">{alert.type}</span>
                      <span className="text-xs text-muted-foreground/70">Strike: {alert.strike}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-sm font-medium text-green-400">{alert.change}</span>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border/40 p-4">
              <button className="text-sm font-medium text-red-400 transition-colors hover:text-red-300">
                View All Alerts →
              </button>
            </div>
          </div>

          {/* Card 2: Smart Money Flows */}
          <div className="card-ios-26 group flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-green-500/10">
                  <DynamicIcon name="UserIcon" size={20} className="text-green-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Smart Money Flows</h2>
                  <p className="text-xs text-muted-foreground">Insider & Congress</p>
                </div>
              </div>
              <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-500">
                TODAY
              </span>
            </div>
            
            <div className="flex-1 space-y-2 p-4">
              {SMART_MONEY.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-green-500/20">
                      <span className="text-xs font-bold text-green-400">
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          item.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono text-green-400">{item.ticker}</span>
                        <span>•</span>
                        <span>{item.source}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`block font-mono text-sm font-medium ${
                      item.type === 'buy' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.type === 'buy' ? '+' : '-'}{item.amount}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border/40 p-4">
              <button className="text-sm font-medium text-green-400 transition-colors hover:text-green-300">
                View All Activity →
              </button>
            </div>
          </div>

          {/* Card 3: Dark Pool Prints */}
          <div className="card-ios-26 group flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <DynamicIcon name="TrendingUpIcon" size={20} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Dark Pool Prints</h2>
                  <p className="text-xs text-muted-foreground">Invisible Levels</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-500">
                ACTIVE
              </span>
            </div>
            
            <div className="flex-1 space-y-2 p-4">
              {DARK_POOL_LEVELS.map((level, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-blue-400">{level.ticker}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      level.type === 'Wall' ? 'bg-red-500/20 text-red-400' :
                      level.type === 'Support' ? 'bg-green-500/20 text-green-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {level.type}
                    </span>
                    {level.level === 'major' && (
                      <span className="text-xs text-muted-foreground/50">★</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-sm font-medium text-blue-300">{level.price}</span>
                    <span className="text-xs text-muted-foreground">{level.volume}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border/40 p-4">
              <button className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300">
                View All Levels →
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageTransitionWrapper>
  );
}
