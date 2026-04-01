/*
 * TICKER INTELLIGENCE PAGE - Premium UX
 * Restructured for immediate comprehension and compliant language
 */

'use client';

import { DynamicIcon } from '@/components/icons';
import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';
import { getTickerBySymbol, formatSize, type TickerIntelligence } from '@/data/ticker-intelligence';
import { useParams } from 'next/navigation';

// Hero Section - Main insight at a glance
const HeroSection = ({ data }: { data: TickerIntelligence }) => {
  const biasColors = {
    BULLISH: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    BEARISH: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
    NEUTRAL: 'bg-neutral-50 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-800',
    VOLATILE: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
  };
  
  const biasTextColors = {
    BULLISH: 'text-emerald-700 dark:text-emerald-400',
    BEARISH: 'text-rose-700 dark:text-rose-400',
    NEUTRAL: 'text-neutral-600 dark:text-neutral-400',
    VOLATILE: 'text-amber-700 dark:text-amber-400',
  };
  
  const biasLabels = {
    BULLISH: 'Bullish',
    BEARISH: 'Bearish',
    NEUTRAL: 'Neutral',
    VOLATILE: 'Volatile',
  };
  
  const flowLabels = {
    CALL_DOMINANT: 'Call Dominance',
    PUT_DOMINANT: 'Put Dominance',
    BALANCED: 'Balanced',
    MIXED: 'Mixed Flow',
  };
  
  return (
    <div className={`p-5 rounded-xl border-2 ${biasColors[data.bias]} mb-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-bold font-mono ${biasTextColors[data.bias]}`}>
            {data.ticker}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${biasTextColors[data.bias]} bg-white/50 dark:bg-black/20`}>
            {biasLabels[data.bias]}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-neutral-900 dark:text-white">
            ${data.price.toFixed(2)}
          </div>
          <div className={`text-sm font-mono ${data.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {data.change >= 0 ? '+' : ''}{data.change}%
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-neutral-500">Confidence:</span>
        <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${data.bias === 'BULLISH' ? 'bg-emerald-500' : data.bias === 'BEARISH' ? 'bg-rose-500' : 'bg-amber-500'}`}
            style={{ width: `${data.confidence}%` }}
          />
        </div>
        <span className="text-sm font-mono font-semibold text-neutral-700 dark:text-neutral-300">{data.confidence}%</span>
      </div>
      
      <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed mb-4">
        {data.scenario_summary}
      </p>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-200/50 dark:border-neutral-700/50">
        <div className="text-center">
          <div className="text-xs text-neutral-500 mb-1">Flow 3d</div>
          <div className={`text-sm font-semibold ${
            data.flow_3d === 'CALL_DOMINANT' ? 'text-emerald-600 dark:text-emerald-400' :
            data.flow_3d === 'PUT_DOMINANT' ? 'text-rose-600 dark:text-rose-400' :
            'text-neutral-600 dark:text-neutral-400'
          }`}>
            {flowLabels[data.flow_3d]}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-neutral-500 mb-1">GEX</div>
          <div className={`text-sm font-semibold ${
            data.gex === 'POSITIVE' ? 'text-emerald-600 dark:text-emerald-400' :
            data.gex === 'NEGATIVE' ? 'text-rose-600 dark:text-rose-400' :
            'text-neutral-600 dark:text-neutral-400'
          }`}>
            {data.gex}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-neutral-500 mb-1">Timeframe</div>
          <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Short-term
          </div>
        </div>
      </div>
    </div>
  );
};

// Price Context Section
const PriceContextSection = ({ data }: { data: TickerIntelligence }) => (
  <div className="card-ios-26 p-4 mb-4">
    <div className="flex items-center gap-2 mb-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50">
        <DynamicIcon name="TrendingUpIcon" size={20} className="text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="font-semibold text-neutral-900 dark:text-white">Price Context</h2>
    </div>
    
    <div className="space-y-2">
      <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
        <span className="text-sm text-neutral-500">Area of Interest</span>
        <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
          ${data.key_strikes?.[0] ? data.key_strikes[0] - 20 : 880} – ${data.key_strikes?.[0] || 900}
        </span>
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
        <span className="text-sm text-neutral-500">Key Resistance</span>
        <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
          ${data.key_strikes?.[1] || 400} – ${data.key_strikes?.[2] || 450}
        </span>
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/40 dark:border-rose-800/40">
        <span className="text-sm text-rose-600 dark:text-rose-400">Invalidation Level</span>
        <span className="font-mono text-sm font-semibold text-rose-700 dark:text-rose-400">
          Below ${data.invalidation_level}
        </span>
      </div>
    </div>
  </div>
);

// Positioning Section - Simplified
const PositioningSection = ({ data }: { data: TickerIntelligence }) => (
  <div className="card-ios-26 p-4 mb-4">
    <div className="flex items-center gap-2 mb-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/50">
        <DynamicIcon name="CalculatorIcon" size={20} className="text-purple-600 dark:text-purple-400" />
      </div>
      <h2 className="font-semibold text-neutral-900 dark:text-white">Options Positioning</h2>
    </div>
    
    <div className="mb-3">
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        {data.gex === 'POSITIVE' 
          ? 'Market stabilized with positive gamma exposure. Price action likely to stay above current levels.'
          : data.gex === 'NEGATIVE'
          ? 'Negative gamma indicates potential volatility. Market may move aggressively in either direction.'
          : 'Neutral positioning. Market in equilibrium with no strong directional bias.'
        }
      </p>
    </div>
    
    <div className="flex flex-wrap gap-1.5">
      {data.key_strikes.map((strike, i) => (
        <span key={i} className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300">
          ${strike}
        </span>
      ))}
    </div>
    
    {data.gamma_flip && (
      <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
        <span className="text-xs text-neutral-500">Gamma Flip Level: </span>
        <span className="text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300">${data.gamma_flip}</span>
      </div>
    )}
  </div>
);

// Flow Intelligence Section - Summary view
const FlowSection = ({ data }: { data: TickerIntelligence }) => (
  <div className="card-ios-26 p-4 mb-4">
    <div className="flex items-center gap-2 mb-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-950/50">
        <DynamicIcon name="SignalsIcon" size={20} className="text-rose-600 dark:text-rose-400" />
      </div>
      <h2 className="font-semibold text-neutral-900 dark:text-white">Flow Intelligence</h2>
    </div>
    
    {/* Call/Put Pressure Bar */}
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
        <span>Call Pressure</span>
        <span>Put Pressure</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden">
        <div 
          className="bg-emerald-500"
          style={{ width: `${data.call_pressure}%` }}
        />
        <div 
          className="bg-rose-500"
          style={{ width: `${data.put_pressure}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span className="text-emerald-600 dark:text-emerald-400 font-mono">{data.call_pressure}%</span>
        <span className="text-rose-600 dark:text-rose-400 font-mono">{data.put_pressure}%</span>
      </div>
    </div>
    
    {/* Recent Flows Summary */}
    <div className="space-y-2">
      {data.recent_flows.slice(0, 3).map((flow, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-md bg-neutral-50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <span className={flow.type === 'CALL' ? 'text-emerald-500' : 'text-rose-500'}>
              {flow.type === 'CALL' ? '↑' : '↓'}
            </span>
            <span className="text-sm font-mono text-neutral-900 dark:text-white">${flow.strike}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              flow.execution === 'SWEEP' ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' :
              flow.execution === 'BLOCK' ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400' :
              'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
            }`}>
              {flow.execution}
            </span>
          </div>
          <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
            {formatSize(flow.size)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// Risk Section
const RiskSection = ({ data }: { data: TickerIntelligence }) => (
  <div className="card-ios-26 p-4">
    <div className="flex items-center gap-2 mb-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/50">
        <DynamicIcon name="WarningIcon" size={20} className="text-amber-600 dark:text-amber-400" />
      </div>
      <h2 className="font-semibold text-neutral-900 dark:text-white">Risk Factors</h2>
    </div>
    
    <div className="space-y-2">
      {data.upcoming_events.map((event, i) => (
        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/40 dark:border-amber-800/40">
          <span className="text-amber-500">⚠️</span>
          <span className="text-sm text-amber-700 dark:text-amber-300">{event}</span>
        </div>
      ))}
      
      <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/40 dark:border-rose-800/40">
        <span className="text-rose-500">✖</span>
        <span className="text-sm text-rose-700 dark:text-rose-400">
          Scenario invalidates below ${data.invalidation_level}
        </span>
      </div>
    </div>
  </div>
);

export default function TickerPage() {
  const params = useParams();
  const ticker = params?.ticker as string;
  
  const data = getTickerBySymbol(ticker);
  
  if (!data) {
    return (
      <PageTransitionWrapper>
        <div className="mx-auto max-w-screen-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Ticker Not Found
          </h1>
          <p className="text-neutral-500 mt-2">
            No intelligence data available for {ticker}
          </p>
        </div>
      </PageTransitionWrapper>
    );
  }

  return (
    <PageTransitionWrapper>
      <div className="mx-auto max-w-screen-xl space-y-6 pb-20">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl text-neutral-900 dark:text-white">
            Ticker Intelligence
          </h1>
          <p className="text-muted-foreground">
            Institutional flow analysis and scenario outlook
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Left Column */}
          <div>
            <HeroSection data={data} />
            <PriceContextSection data={data} />
          </div>
          
          {/* Right Column */}
          <div>
            <PositioningSection data={data} />
            <FlowSection data={data} />
            <RiskSection data={data} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <span>Source: {data.source}</span>
          <span>Updated: {new Date(data.last_updated).toLocaleString()}</span>
        </div>
      </div>
    </PageTransitionWrapper>
  );
}