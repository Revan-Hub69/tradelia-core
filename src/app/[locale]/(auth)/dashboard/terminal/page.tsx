/*
 * Terminal - Swing Trader Intelligence Terminal
 * Page for deep ticker research and search
 * Legal Safe: Shows market data, NOT trading signals
 */

'use client';

import { useState, type KeyboardEvent } from 'react';
import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';
import {
  TICKER_INTELLIGENCE_DATA,
  formatSize,
  type TickerIntelligence,
} from '@/data/ticker-intelligence';
import { DynamicIcon } from '@/components/icons';

function TickerCard({ ticker, onSelect }: { ticker: TickerIntelligence; onSelect: (t: TickerIntelligence) => void }) {
  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'BULLISH':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30';
      case 'BEARISH':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30';
      case 'NEUTRAL':
        return 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800';
      case 'VOLATILE':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30';
      default:
        return 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800';
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onSelect(ticker);
    }
  };

  const formattedPrice = ticker.price.toFixed(2);
  const changeStr = ticker.change >= 0 ? `+${ticker.change}` : `${ticker.change}`;
  const confStr = `${ticker.confidence}%`;
  const callStr = `${ticker.call_pressure}%`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(ticker)}
      onKeyDown={handleKeyDown}
      className="cursor-pointer rounded-lg border border-neutral-200/60 dark:border-neutral-800 p-4 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/30 transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xl font-bold text-neutral-900 dark:text-white">
            {ticker.ticker}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${getBiasColor(ticker.bias)}`}>
            {ticker.bias}
          </span>
        </div>
        <div className="text-right">
          <span className="font-mono text-lg font-semibold text-neutral-900 dark:text-white">
            $
            {formattedPrice}
          </span>
          <span className={`text-xs ml-2 ${ticker.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {changeStr}
            %
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <p className="text-neutral-500">Confidence</p>
          <p className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">
            {confStr}
          </p>
        </div>
        <div className="text-center">
          <p className="text-neutral-500">Call Pressure</p>
          <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            {callStr}
          </p>
        </div>
        <div className="text-center">
          <p className="text-neutral-500">GEX</p>
          <p className={`font-mono font-semibold ${
            ticker.gex === 'POSITIVE' ? 'text-emerald-600' : ticker.gex === 'NEGATIVE' ? 'text-rose-600' : 'text-neutral-500'
          }`}>
            {ticker.gex}
          </p>
        </div>
      </div>
    </div>
  );
}

function TickerDetail({ ticker }: { ticker: TickerIntelligence }) {
  const formattedPrice = ticker.price.toFixed(2);
  const changeStr = ticker.change >= 0 ? `+${ticker.change}` : `${ticker.change}`;
  const confStr = `${ticker.confidence}%`;
  const callStr = `${ticker.call_pressure}%`;
  const putStr = `${ticker.put_pressure}%`;
  const flipStr = ticker.gamma_flip ? `$${ticker.gamma_flip}` : null;
  const invStr = ticker.invalidation_level ? `$${ticker.invalidation_level}` : null;
  const sourceStr = ticker.source;
  const updateStr = new Date(ticker.last_updated).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {ticker.ticker}
          </h2>
          <p className="text-neutral-500">{ticker.name}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">
            $
            {formattedPrice}
          </p>
          <p className={`text-lg ${ticker.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {changeStr}
            %
          </p>
        </div>
      </div>

      {/* Scenario Summary */}
      <div className="card-ios-26 p-4">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Scenario Analysis</h3>
        <p className="text-neutral-600 dark:text-neutral-400">{ticker.scenario_summary}</p>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <span className={`px-2 py-1 rounded ${
            ticker.bias === 'BULLISH' ? 'bg-emerald-100 text-emerald-700' :
            ticker.bias === 'BEARISH' ? 'bg-rose-100 text-rose-700' :
            'bg-neutral-100 text-neutral-700'
          }`}>
            {ticker.bias}
          </span>
          <span className="text-neutral-500">
            {confStr}
            {' '}
            Confidence
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-ios-26 p-4">
          <p className="text-xs text-neutral-500 mb-1">Call Pressure</p>
          <p className="text-2xl font-bold text-emerald-600">
            {callStr}
          </p>
          <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full mt-2">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${ticker.call_pressure}%` }} />
          </div>
        </div>

        <div className="card-ios-26 p-4">
          <p className="text-xs text-neutral-500 mb-1">Put Pressure</p>
          <p className="text-2xl font-bold text-rose-600">
            {putStr}
          </p>
          <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full mt-2">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${ticker.put_pressure}%` }} />
          </div>
        </div>

        <div className="card-ios-26 p-4">
          <p className="text-xs text-neutral-500 mb-1">Gamma Exposure</p>
          <p className={`text-2xl font-bold ${ticker.gex === 'POSITIVE' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {ticker.gex}
          </p>
          {flipStr && (
            <p className="text-xs text-neutral-500 mt-1">
              Flip:
              {' '}
              {flipStr}
            </p>
          )}
        </div>

        <div className="card-ios-26 p-4">
          <p className="text-xs text-neutral-500 mb-1">Flow 3D</p>
          <p className="text-xl font-semibold text-neutral-900 dark:text-white">
            {ticker.flow_3d.replace('_', ' ')}
          </p>
          <p className="text-xs text-neutral-500 mt-1">3-day aggregate</p>
        </div>
      </div>

      {/* Key Strikes */}
      <div className="card-ios-26 p-4">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Key Strikes</h3>
        <div className="flex flex-wrap gap-2">
          {ticker.key_strikes.map((strike, i) => (
            <span key={i} className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">
              $
              {strike}
            </span>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card-ios-26 p-4">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Upcoming Events</h3>
        <div className="space-y-2">
          {ticker.upcoming_events.map((event, i) => (
            <div key={i} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <DynamicIcon name="ClockIcon" size={16} className="text-neutral-500" />
              <span>{event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invalidation Level */}
      {invStr && (
        <div className="card-ios-26 p-4 border-l-4 border-l-rose-500">
          <p className="text-xs text-neutral-500">Invalidation Level</p>
          <p className="text-xl font-bold text-rose-600">
            {invStr}
          </p>
          <p className="text-xs text-neutral-400 mt-1">Below this level, scenario invalidates</p>
        </div>
      )}

      {/* Recent Flows */}
      <div className="card-ios-26 p-4">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Recent Options Flow</h3>
        <div className="space-y-2">
          {ticker.recent_flows.slice(0, 5).map((flow, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold ${flow.type === 'CALL' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {flow.type}
                </span>
                <span className="text-neutral-500">{flow.execution}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Strike:
                  {' '}
                  $
                  {flow.strike}
                </span>
                <span className="text-neutral-500">{formatSize(flow.size)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source */}
      <p className="text-xs text-neutral-400 text-center">
        Data source:
        {' '}
        {sourceStr}
        {' '}
        •
        {' '}
        Last updated:
        {' '}
        {updateStr}
      </p>
    </div>
  );
}

export default function TerminalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicker, setSelectedTicker] = useState<TickerIntelligence | null>(null);

  const filterPredicate = (t: TickerIntelligence) => {
    const query = searchQuery.toLowerCase();
    return t.ticker.toLowerCase().includes(query) || t.name.toLowerCase().includes(query);
  };
  const filteredTickers = searchQuery
    ? TICKER_INTELLIGENCE_DATA.filter(filterPredicate)
    : TICKER_INTELLIGENCE_DATA;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedTicker(null);
  };

  const handleInputChange = (e: { target: { value: string } }) => {
    handleSearch(e.target.value);
  };

  const noResultsMsg = `No tickers found matching "${searchQuery}"`;

  return (
    <PageTransitionWrapper>
      <div className="mx-auto max-w-screen-xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">Terminal</h1>
          <p className="text-muted-foreground">Deep Ticker Research & Analysis</p>
        </div>

        {/* Search */}
        <div className="card-ios-26 p-4">
          <div className="relative">
            <DynamicIcon
              name="SearchIcon"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search by ticker or company name..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Content */}
        {selectedTicker ? (
          <div>
            <button
              onClick={() => setSelectedTicker(null)}
              className="flex items-center gap-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 mb-4"
            >
              <DynamicIcon name="ChevronDownIcon" size={16} className="rotate-90" />
              Back to list
            </button>
            <TickerDetail ticker={selectedTicker} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTickers.map((ticker) => (
              <TickerCard
                key={ticker.ticker}
                ticker={ticker}
                onSelect={setSelectedTicker}
              />
            ))}
          </div>
        )}

        {!selectedTicker && filteredTickers.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            <DynamicIcon
              name="SearchIcon"
              size={24}
              className="mx-auto mb-4 text-neutral-300"
            />
            <p>{noResultsMsg}</p>
          </div>
        )}
      </div>
    </PageTransitionWrapper>
  );
}
