// Market Data Integration Phase 1 - Main Exports
// Professional real-time market data processing system

export * from './types';
export { BinanceMarketDataAdapter } from './adapter';
export { DatabaseMarketEventLog } from './event-log';
export { DeterministicCandleAggregator } from './aggregator';
export { SimulatedPaperOMS } from './paper-oms';
export { MarketDataEngine } from './engine';

// Re-export commonly used types for convenience
export type {
  MarketDataAdapter,
  MarketEventLog,
  CandleAggregator,
  PaperOMS,
  TradeEvent,
  OrderBookEvent,
  CandleData,
  MarketEvent,
  OrderIntent,
  TradeOutcome,
  MarketDataConfig,
} from './types';