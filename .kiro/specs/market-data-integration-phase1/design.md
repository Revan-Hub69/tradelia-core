# Design Document - Market Data Integration Phase 1

## Overview

This document outlines the design for a production-grade market data integration system that closes the operational loop for Phase 1 validation. The system provides real-time market data ingestion, deterministic processing, bulletproof logging, and automated KPI calculation for derivatives promotion assessment.

## Architecture

### System Flow
```
Binance WebSocket → MarketEventLog → Aggregator → MarketStateBuilder → SetupEngine
       ↓                ↓              ↓              ↓              ↓
   Raw Events      Append-Only     Candles M1-H4   Normalized    Decision Events
   (Trades/L2)        Store        Deterministic    MarketState      + Outcomes
                        ↓              ↓              ↓              ↓
                  Replay Source    Time-Series    Setup Detection   KPI Pipeline
                                   Database       + Validation      + Readiness
```

### Core Components

1. **MarketDataAdapter** - WebSocket connection and event normalization
2. **MarketEventLog** - Append-only event storage with replay capability
3. **CandleAggregator** - Deterministic OHLCV construction
4. **MarketStateBuilder** - Normalized state for setup engine
5. **PaperOMS** - Simulated order management and execution
6. **KPIPipeline** - Automated performance calculation and readiness assessment

## Components and Interfaces

### MarketDataAdapter

```typescript
interface MarketDataAdapter {
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

interface TradeEvent {
  symbol: string;
  price: number;
  quantity: number;
  timestamp: number;
  side: 'BUY' | 'SELL';
  tradeId: string;
}

interface OrderBookEvent {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
  lastUpdateId: number;
}
```

### MarketEventLog

```typescript
interface MarketEventLog {
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

interface MarketEvent {
  id: string;
  runId: string;
  symbol: string;
  eventType: 'TRADE' | 'ORDERBOOK' | 'CANDLE';
  timestamp: number;
  data: any;
  hash: string;
}
```

### CandleAggregator

```typescript
interface CandleAggregator {
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

interface CandleData {
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

type Timeframe = 'M1' | 'M5' | 'M15' | 'H1' | 'H4';
```

### MarketStateBuilder

```typescript
interface MarketStateBuilder {
  // State construction
  buildMarketState(timestamp: number): Promise<MarketState>;
  updateStructure(symbol: string, candles: CandleData[]): StructureMap;
  updateOrderflow(symbol: string, trades: TradeEvent[], orderbook: OrderBookEvent): OrderflowState;
  updateVolatility(symbol: string, candles: CandleData[]): VolState;
  
  // Normalization
  normalizePrice(symbol: string, price: number): number;
  normalizePrecision(symbol: string, value: number): number;
  validateState(state: MarketState): ValidationResult;
}
```

### PaperOMS

```typescript
interface PaperOMS {
  // Order management
  submitOrder(intent: OrderIntent): Promise<OrderResult>;
  cancelOrder(orderId: string): Promise<boolean>;
  getOrderStatus(orderId: string): OrderStatus;
  
  // Execution simulation
  simulateFill(order: Order, marketPrice: number): FillResult;
  calculateSlippage(order: Order, fillPrice: number): number;
  
  // Outcome tracking
  recordOutcome(setupId: string, outcome: TradeOutcome): Promise<void>;
  getOutcomes(from: number, to: number): Promise<TradeOutcome[]>;
}

interface OrderIntent {
  setupId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET' | 'STOP';
  price?: number;
  quantity: number;
  ttlSec: number;
}

interface TradeOutcome {
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
```

## Data Models

### Event Storage Schema

```sql
-- Market events table (append-only)
CREATE TABLE market_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  event_type TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  data JSONB NOT NULL,
  hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure idempotency
  CONSTRAINT unique_market_event UNIQUE (run_id, symbol, event_type, timestamp, hash)
);

-- Candles table (derived from events)
CREATE TABLE market_candles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  open_time TIMESTAMPTZ NOT NULL,
  close_time TIMESTAMPTZ NOT NULL,
  open DECIMAL NOT NULL,
  high DECIMAL NOT NULL,
  low DECIMAL NOT NULL,
  close DECIMAL NOT NULL,
  volume DECIMAL NOT NULL,
  trades INTEGER NOT NULL,
  hash TEXT NOT NULL,
  
  CONSTRAINT unique_candle UNIQUE (symbol, timeframe, open_time)
);

-- Paper trades table
CREATE TABLE paper_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setup_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL,
  entry_price DECIMAL NOT NULL,
  exit_price DECIMAL,
  quantity DECIMAL NOT NULL,
  pnl DECIMAL,
  pnl_pct DECIMAL,
  r_multiple DECIMAL,
  hold_time INTEGER,
  slippage DECIMAL,
  exit_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Event Log Determinism
*For any* sequence of market events with identical timestamps and data, the MarketEventLog should produce identical hashes and replay results
**Validates: Requirements 1.5, 2.5**

### Property 2: Candle Aggregation Consistency  
*For any* set of trade events within a timeframe, the CandleAggregator should produce identical OHLCV values regardless of processing order
**Validates: Requirements 1.3**

### Property 3: Replay Bit-Identity
*For any* recorded run with run_id, replaying the same market events should produce identical decision events and setup outcomes
**Validates: Requirements 2.3, 2.5**

### Property 4: Order Execution Causality
*For any* paper trade, the entry and exit prices should be achievable given the market data at the respective timestamps
**Validates: Requirements 3.1, 3.4**

### Property 5: KPI Calculation Consistency
*For any* set of completed trades, calculating KPIs multiple times should produce identical expectancy, drawdown, and R-distribution values
**Validates: Requirements 4.2**

### Property 6: State Normalization Idempotency
*For any* MarketState, normalizing it multiple times should produce identical tick precision and unit values
**Validates: Requirements 1.4**

### Property 7: TTL Enforcement Accuracy
*For any* order with TTL, the time between submission and cancellation should not exceed the specified TTL by more than 1 second
**Validates: Requirements 3.2**

### Property 8: Data Quality Validation
*For any* market event with missing or invalid data, the system should reject it without affecting subsequent processing
**Validates: Requirements 6.3**

## Error Handling

### Connection Management
- **WebSocket Disconnection**: Automatic reconnection with exponential backoff
- **Gap Detection**: Identify missing events and request historical data
- **Heartbeat Monitoring**: Detect stale connections within 30 seconds

### Data Validation
- **Schema Validation**: Reject malformed events at ingestion
- **Timestamp Validation**: Ensure chronological ordering
- **Price Validation**: Check for unrealistic price movements (circuit breakers)

### Replay Validation
- **Hash Mismatch**: Halt processing and alert operators
- **Event Count Mismatch**: Flag potential data corruption
- **Decision Divergence**: Compare expected vs actual setup decisions

### System Recovery
- **Graceful Shutdown**: Complete current processing before stopping
- **State Persistence**: Save aggregator state for restart recovery
- **Checkpoint Recovery**: Resume from last known good state

## Testing Strategy

### Unit Testing
- **Event Processing**: Test individual event handlers with edge cases
- **Candle Building**: Validate OHLCV calculation with various trade patterns
- **State Normalization**: Test precision and unit conversion accuracy
- **Order Simulation**: Verify slippage and fill logic

### Property Testing
- **Determinism Tests**: Generate random event sequences and verify consistency
- **Replay Tests**: Record and replay sessions with hash validation
- **Performance Tests**: Measure throughput under high event volume
- **Stress Tests**: Test system behavior under connection failures

### Integration Testing
- **End-to-End Flow**: Market data → Setup detection → Paper execution → KPIs
- **Multi-Symbol Testing**: Verify concurrent processing of multiple symbols
- **Time Progression**: Test system behavior across session boundaries
- **Failure Recovery**: Test reconnection and state recovery scenarios

### Acceptance Testing
- **Phase 1 Simulation**: Run 100+ paper trades with real market data
- **KPI Validation**: Verify calculated metrics match manual calculations
- **Readiness Assessment**: Test automated derivatives promotion criteria
- **Operational Testing**: 24-hour continuous operation validation

## Performance Requirements

### Throughput
- **Event Processing**: 100+ events/second per symbol
- **Candle Updates**: Real-time aggregation with <100ms latency
- **State Building**: MarketState generation within 500ms
- **Database Writes**: Batched inserts with <1s commit latency

### Scalability
- **Symbol Support**: 10+ symbols without performance degradation
- **Historical Data**: 30 days of minute-level data per symbol
- **Concurrent Users**: 5+ simultaneous API consumers
- **Storage Growth**: 1GB/day sustainable storage rate

### Reliability
- **Uptime**: 99.9% availability during market hours
- **Data Integrity**: Zero data loss during normal operations
- **Recovery Time**: <5 minutes from failure to full operation
- **Monitoring**: <30 second alert on system degradation

---

**Status**: 🟡 **DESIGN COMPLETE** - Ready for implementation  
**Dependencies**: Binance WebSocket API, Supabase, Setup Engine  
**Next**: Implement MarketDataAdapter and MarketEventLog