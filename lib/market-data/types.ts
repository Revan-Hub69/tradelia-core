// Market Data Integration Phase 1 - Core Types
// Professional trading system with real-time data processing

export type Timeframe = 'M1' | 'M5' | 'M15' | 'H1' | 'H4';

export interface TradeEvent {
  symbol: string;
  price: number;
  quantity: number;
  timestamp: number;
  side: 'BUY' | 'SELL';
  tradeId: string;
}

export interface OrderBookEvent {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
  lastUpdateId: number;
}

export interface KlineEvent {
  symbol: string;
  timeframe: Timeframe;
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades: number;
}

export interface CandleData {
  symbol: string;
  timeframe: Timeframe;
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades: number;
  hash: string;
}

export interface MarketEvent {
  id: string;
  runId: string;
  symbol: string;
  eventType: 'TRADE' | 'ORDERBOOK' | 'CANDLE';
  timestamp: number;
  data: any;
  hash: string;
}

export interface ConnectionStatus {
  connected: boolean;
  lastHeartbeat: number;
  reconnectCount: number;
  latency: number;
}

export interface CandleState {
  symbol: string;
  timeframes: Record<Timeframe, CandleData | null>;
  lastUpdate: number;
}

export interface OrderIntent {
  setupId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET' | 'STOP';
  price?: number;
  quantity: number;
  ttlSec: number;
}

export interface OrderResult {
  orderId: string;
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  fillPrice?: number;
  fillQuantity?: number;
  slippage?: number;
}

export interface OrderStatus {
  orderId: string;
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  createdAt: number;
  updatedAt: number;
  ttlExpiry: number;
}

export interface FillResult {
  fillPrice: number;
  fillQuantity: number;
  slippage: number;
  timestamp: number;
}

export interface TradeOutcome {
  setupId: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPct: number;
  rMultiple: number;
  holdTime: number;
  slippage: number;
  exitReason: 'STOP' | 'TARGET' | 'TTL' | 'MANUAL';
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Market Data Adapter Interface
export interface MarketDataAdapter {
  // Connection management
  connect(symbols: string[]): Promise<void>;
  disconnect(): Promise<void>;
  
  // Event streaming
  onTrade(callback: (event: TradeEvent) => void): void;
  onOrderBook(callback: (event: OrderBookEvent) => void): void;
  onKline(callback: (event: KlineEvent) => void): void;
  
  // Health monitoring
  getConnectionStatus(): ConnectionStatus;
  getLatency(): number;
}

// Market Event Log Interface
export interface MarketEventLog {
  // Event storage
  appendTrade(event: TradeEvent): Promise<void>;
  appendOrderBook(event: OrderBookEvent): Promise<void>;
  appendCandle(candle: CandleData): Promise<void>;
  
  // Replay capability
  getEvents(symbol: string, from: number, to: number): Promise<MarketEvent[]>;
  getEventHash(runId: string): string;
  
  // Validation
  validateReplay(runId: string, expectedHash: string): boolean;
}

// Candle Aggregator Interface
export interface CandleAggregator {
  // Candle building
  processTrade(trade: TradeEvent): CandleData[];
  processOrderBook(orderbook: OrderBookEvent): void;
  
  // Timeframe management
  getCandle(symbol: string, timeframe: Timeframe, timestamp: number): CandleData | null;
  getCandles(symbol: string, timeframe: Timeframe, from: number, to: number): CandleData[];
  
  // State management
  getCurrentState(symbol: string): CandleState;
  restoreState(symbol: string, state: CandleState): void;
}

// Paper OMS Interface
export interface PaperOMS {
  // Order management
  submitOrder(intent: OrderIntent): Promise<OrderResult>;
  cancelOrder(orderId: string): Promise<boolean>;
  getOrderStatus(orderId: string): OrderStatus;
  
  // Execution simulation
  simulateFill(order: OrderIntent, marketPrice: number): FillResult;
  calculateSlippage(order: OrderIntent, fillPrice: number): number;
  
  // Outcome tracking
  recordOutcome(setupId: string, outcome: TradeOutcome): Promise<void>;
  getOutcomes(from: number, to: number): Promise<TradeOutcome[]>;
}

// Configuration
export interface MarketDataConfig {
  symbols: string[];
  timeframes: Timeframe[];
  batchSize: number;
  reconnectDelay: number;
  maxReconnects: number;
  heartbeatInterval: number;
}

export const DEFAULT_CONFIG: MarketDataConfig = {
  symbols: ['BTCUSDT', 'ETHUSDT', 'ADAUSDT'],
  timeframes: ['M1', 'M5', 'M15', 'H1', 'H4'],
  batchSize: 100,
  reconnectDelay: 5000,
  maxReconnects: 10,
  heartbeatInterval: 30000,
};