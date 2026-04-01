/*
 * TICKER INTELLIGENCE PAGE
 * Full ticker analysis with scenario, positioning, flow, and risk
 */

'use client';

import { DynamicIcon } from '@/components/icons';
import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';
import { 
  getTickerBySymbol, 
  formatSize,
  type TickerIntelligence,
  type BiasType
} from '@/data/ticker-intelligence';
import { useParams } from 'next/navigation';

const BiasBadge = ({ bias, confidence }: { bias: BiasType; confidence: number }) => {
  const colors = {
    BULLISH: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
    BEARISH: 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300',
    NEUTRAL: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
    VOLATILE: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className={`px-2.5 py-1 rounded-md text-sm font-semibold ${colors[bias]}`}>
        {bias}
      </span>
      <span className="text-xs text-neutral-500 font-mono">
        {confidence}% confidence
      </span>
    </div>
  );
};

const FlowCard = ({ flow, index }: { flow: any; index: number }) => {
  const isCall = flow.type === 'CALL';
  const execColors = {
    SWEEP: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    BLOCK: 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    SWING: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    PASSIVE: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500',
  };
  
  return (
    <div key={index} className="flex items-center justify-between p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-transparent">
      <div className="flex items-center gap-2">
        <span className={`text-lg ${isCall ? '📈' : '📉'}`} />
        <div className="flex flex-col">
          <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">
            {flow.strike}
          </span>
          <span className="text-xs text-neutral-500">
            {flow.expiry_days}d expiry
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-1.5 py-0.5 rounded ${execColors[flow.execution]}`}>
          {flow.execution}
        </span>
        <span className="font-mono text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {formatSize(flow.size)}
        </span>
      </div>
    </div>
  );
};

const StatBlock = ({ label, value, subtext, highlight }: { 
  label: string; 
  value: string | React.ReactNode; 
  subtext?: string;
  highlight?: 'positive' | 'negative' | 'neutral';
}) => {
  const highlightColors = {
    positive: 'text-emerald-600 dark:text-emerald-400',
    negative: 'text-rose-600 dark:text-rose-400',
    neutral: 'text-neutral-700 dark:text-neutral-300',
  };
  
  return (
    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-transparent">
      <div className="text-xs text-neutral-500 mb-1">{label}</div>
      <div className={`font-mono text-lg font-semibold ${highlight ? highlightColors[highlight] : 'text-neutral-900 dark:text-white'}`}>
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-neutral-400 mt-1">{subtext}</div>
      )}
    </div>
  );
};

const RiskEvent = ({ event, index }: { event: string; index: number }) => (
  <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200/40 dark:border-amber-800/40">
    <span className="text-amber-500">⚠️</span>
    <span className="text-sm text-amber-700 dark:text-amber-300">{event}</span>
  </div>
);

export default function TickerPage() {
  const params = useParams();
  const ticker = params?.ticker as string;
  
  const data: TickerIntelligence | undefined = getTickerBySymbol(ticker);
  
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
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
                {data.ticker}
              </h1>
              <span className="text-lg text-neutral-500">{data.name}</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-mono text-xl text-neutral-900 dark:text-white">
                ${data.price.toFixed(2)}
              </span>
              <span className={`font-mono text-sm ${
                data.change >= 0 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                {data.change >= 0 ? '+' : ''}{data.change}%
              </span>
            </div>
          </div>
          <BiasBadge bias={data.bias} confidence={data.confidence} />
        </div>

        {/* Main Grid - 2 columns on desktop */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Section 1: Scenario Engine (full width) */}
          <div className="md:col-span-2 lg:col-span-2 card-ios-26 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/50">
                <DynamicIcon name="SearchIcon" size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="font-semibold text-neutral-900 dark:text-white">Scenario Engine</h2>
                <p className="text-xs text-neutral-500">AI-generated market assessment</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200/40 dark:border-purple-800/40">
              <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed">
                {data.scenario_summary}
              </p>
            </div>
          </div>

          {/* Section 2: Options Positioning (1 column) */}
          <div className="card-ios-26 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50">
                <DynamicIcon name="CalculatorIcon" size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="font-semibold text-neutral-900 dark:text-white">Positioning</h2>
                <p className="text-xs text-neutral-500">GEX & Gamma</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <StatBlock 
                label="GEX" 
                value={data.gex}
                highlight={data.gex === 'POSITIVE' ? 'positive' : data.gex === 'NEGATIVE' ? 'negative' : 'neutral'}
              />
              <StatBlock 
                label="Gamma Flip" 
                value={data.gamma_flip ? `$${data.gamma_flip}` : 'N/A'}
                subtext="Pivot level"
              />
            </div>
            <div className="mt-3">
              <div className="text-xs text-neutral-500 mb-2">Key Strikes</div>
              <div className="flex flex-wrap gap-1.5">
                {data.key_strikes.map((strike, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300">
                    ${strike}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Flow Intelligence (full width) */}
          <div className="md:col-span-2 lg:col-span-2 card-ios-26 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-950/50">
                  <DynamicIcon name="TrendingUpIcon" size={20} className="text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-white">Flow Intelligence</h2>
                  <p className="text-xs text-neutral-500">Last 3 days activity</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-neutral-500">Call</span>
                  <span className="font-mono text-neutral-700 dark:text-neutral-300">{data.call_pressure}%</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-neutral-500">Put</span>
                  <span className="font-mono text-neutral-700 dark:text-neutral-300">{data.put_pressure}%</span>
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {data.recent_flows.slice(0, 4).map((flow, i) => (
                <FlowCard key={i} flow={flow} index={i} />
              ))}
            </div>
          </div>

          {/* Section 4: Risk Layer */}
          <div className="card-ios-26 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/50">
                <DynamicIcon name="WarningIcon" size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="font-semibold text-neutral-900 dark:text-white">Risk Layer</h2>
                <p className="text-xs text-neutral-500">Key levels & events</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-neutral-500 mb-1">Invalidation Level</div>
                <div className="p-2 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200/40 dark:border-rose-800/40">
                  <span className="font-mono font-semibold text-rose-700 dark:text-rose-400">
                    ${data.invalidation_level}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-neutral-500 mb-2">Upcoming Events</div>
                <div className="space-y-1.5">
                  {data.upcoming_events.map((event, i) => (
                    <RiskEvent key={i} event={event} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <span>Source: {data.source}</span>
          <span>Last updated: {new Date(data.last_updated).toLocaleString()}</span>
        </div>
      </div>
    </PageTransitionWrapper>
  );
}