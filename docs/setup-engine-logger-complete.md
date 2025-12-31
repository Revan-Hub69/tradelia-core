# Setup Engine Logger - Professional Trading System

## 🎯 OVERVIEW

The Setup Engine Logger is the **nervous system** of our professional trading system. It provides structured event logging, replay capability, and KPI extraction for the complete setup lifecycle - from detection to exit.

This is **desk-grade** infrastructure that enables:
- ✅ Complete setup lifecycle tracking
- ✅ Replay capability for debugging
- ✅ Professional KPI extraction
- ✅ Phase 1 validation metrics
- ✅ Derivatives readiness assessment

## 🏗️ ARCHITECTURE

### Core Components

```
MarketState → SetupEngine → EventLogger → Database
     ↓             ↓            ↓           ↓
  Context      Detection    Structured   KPI
  Filters      Validation   Events      Analysis
```

### Event Types

1. **CONTEXT_FILTER** - Market conditions check
2. **STRUCTURE_ANALYSIS** - Multi-timeframe structure
3. **ORDERFLOW_ANALYSIS** - L2/tape analysis
4. **SETUP_DETECTED** - Setup candidate found
5. **SETUP_VALIDATED** - Setup passes all checks
6. **SETUP_REJECTED** - Setup fails validation
7. **SETUP_EXPIRED** - Setup TTL exceeded
8. **ENTRY_TRIGGERED** - Position opened
9. **STOP_HIT** - Stop loss triggered
10. **TARGET_HIT** - Take profit hit
11. **MANUAL_EXIT** - Manual position close

## 📊 DATA STRUCTURES

### SetupCandidate
```typescript
{
  setupId: string;              // Deterministic hash
  symbol: string;
  setupType: 'BREAKOUT_ACCEPTANCE' | 'PULLBACK_STRUCTURAL' | 'LIQUIDITY_SWEEP_REVERSAL';
  direction: 'LONG' | 'SHORT';
  
  entryModel: {
    type: 'LIMIT' | 'STOP';
    price: number;
    ttlSec: number;
  };
  
  stopModel: {
    type: 'STRUCTURAL';
    level: number;
  };
  
  targets: {
    primary: number;
    secondary?: number;
  };
  
  confidenceScore: number;      // 0-1
  evidence: Evidence[];
  riskReward: number;
  maxRisk: number;
}
```

### SetupEvent
```typescript
{
  eventId: string;              // UUID
  setupId?: string;             // Links lifecycle events
  symbol: string;
  eventType: SetupEventType;
  timestamp: number;
  data: Record<string, any>;    // Event-specific data
  marketState: Partial<MarketState>;
  outcome?: SetupOutcome;       // For exit events
}
```

## 🔧 IMPLEMENTATION

### 1. Event Logging

```typescript
import { setupLogger } from '@/lib/setup/logger';

// Log setup detection
await setupLogger.logSetupDetected(setup, marketState);

// Log entry trigger
await setupLogger.logEntryTriggered(setupId, symbol, entryPrice, slippage, marketState);

// Log trade exit
await setupLogger.logTradeExit(setupId, symbol, outcome, marketState);
```

### 2. KPI Extraction

```typescript
// Extract KPIs for validation
const kpis = await setupLogger.extractKPIs(fromTimestamp, toTimestamp);

console.log(`Expectancy: ${kpis.expectancy}`);
console.log(`Win Rate: ${kpis.winRate}`);
console.log(`Avg R:R: ${kpis.avgRiskReward}`);
```

### 3. Setup Replay

```typescript
// Replay complete setup lifecycle
const events = await setupLogger.replaySetup(setupId);

events.forEach(event => {
  console.log(`${event.eventType} at ${new Date(event.timestamp)}`);
});
```

## 📈 KPI METRICS

### Volume Metrics
- **Total Setups**: Count of detected setups
- **Trigger Rate**: % of setups that triggered
- **Setup Distribution**: By type and symbol

### Quality Metrics
- **Avg Confidence Score**: Setup detection quality
- **Avg Risk-Reward**: Risk management quality
- **Avg Slippage**: Execution quality

### Performance Metrics
- **Expectancy**: Average $ per trade
- **Win Rate**: % winning trades
- **Max Drawdown**: Worst losing streak
- **Avg Hold Time**: Position duration

### Phase 1 Validation Criteria

✅ **PASS CRITERIA** (Required for derivatives):
- Expectancy > 0
- Avg R:R ≥ 1.2
- Max Drawdown < 10%
- Sample size ≥ 100 trades
- Avg slippage < 0.1%

## 🚀 API ENDPOINTS

### GET /api/setup/kpis
```bash
curl "/api/setup/kpis?days=30"
```

Returns comprehensive KPI analysis including derivatives readiness assessment.

### GET /api/setup/replay/[setupId]
```bash
curl "/api/setup/replay/123e4567-e89b-12d3-a456-426614174000"
```

Returns complete setup lifecycle for debugging.

## 🗄️ DATABASE SCHEMA

### setup_events Table
```sql
CREATE TABLE setup_events (
  id UUID PRIMARY KEY,
  event_id UUID UNIQUE,
  setup_id UUID,                    -- Links lifecycle events
  symbol TEXT NOT NULL,
  event_type TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  data JSONB DEFAULT '{}',          -- Event-specific data
  market_state JSONB DEFAULT '{}', -- Context snapshot
  outcome JSONB                     -- Trade outcome
);
```

### Key Indexes
- `idx_setup_events_timestamp` - Time-based queries
- `idx_setup_events_setup_id_timestamp` - Lifecycle replay
- `idx_setup_events_kpi_extraction` - Performance analysis

## 🧪 TESTING

Run the comprehensive test suite:

```bash
node scripts/dev/test-setup-logger.mjs
```

Tests cover:
- ✅ Complete setup lifecycle
- ✅ Multiple setup types
- ✅ KPI extraction
- ✅ Replay capability
- ✅ Error handling
- ✅ Performance validation

## 🔒 PRODUCTION CONSIDERATIONS

### Performance
- **Batched writes** (100 events per batch)
- **Auto-flush** every 5 seconds
- **Indexed queries** for fast KPI extraction

### Reliability
- **Fail-safe logging** (continues on DB errors)
- **Event deduplication** via unique event_id
- **Graceful degradation** if logging fails

### Monitoring
- **Event volume** tracking
- **Write latency** monitoring
- **Error rate** alerting

## 🎯 PHASE 1 VALIDATION WORKFLOW

1. **Deploy Setup Engine** with logger
2. **Run on Spot/Spot-Margin** for 100+ trades
3. **Extract KPIs** via API
4. **Validate Criteria**:
   - Expectancy > 0 ✅
   - R:R ≥ 1.2 ✅
   - Drawdown < 10% ✅
   - Slippage < 0.1% ✅
5. **Derivatives Promotion** if all criteria met

## 🚀 NEXT STEPS

With the logger complete, we can now implement:

1. **Setup Detection Rules** (numerical criteria)
2. **Risk Engine Integration** (position sizing)
3. **Real-time Setup Engine** (live detection)
4. **Dashboard Integration** (monitoring UI)

The logging infrastructure is **production-ready** and provides the foundation for professional setup validation and derivatives promotion.

---

**Status**: ✅ COMPLETE - Ready for Phase 1 validation
**Dependencies**: Supabase, MCE, UCM, MSF
**Next**: Setup detection rules implementation