# Setup Engine - Complete Professional Trading System

## 🎯 OVERVIEW

The Setup Engine is the **decision-making core** of our professional trading system. It combines market context analysis, structural pattern recognition, and orderflow confirmation to generate high-probability trading setups with precise entry, stop, and target levels.

This is **desk-grade** infrastructure that enables:
- ✅ Automated setup detection with numerical rules
- ✅ Professional validation and risk management
- ✅ Real-time setup monitoring and lifecycle management
- ✅ Phase 1 validation for derivatives promotion
- ✅ Complete audit trail and replay capability

## 🏗️ ARCHITECTURE

### System Flow
```
MarketState → ContextGate → SetupDetector → SetupValidator → SetupDecision
     ↓             ↓            ↓              ↓              ↓
  MCE/UCM/MSF   Regime       Pattern        Risk           Active
  Integration   Session      Recognition    Management     Setups
                Volatility   Orderflow      Conflicts      
                MSF Gate     Evidence       Liquidity      
```

### Core Components

1. **SetupDetector** - Pattern recognition engine
2. **SetupValidator** - Risk and conflict validation
3. **SetupEngine** - Coordination and lifecycle management
4. **EventLogger** - Complete audit trail
5. **API Layer** - Real-time monitoring and control

## 📊 SETUP TYPES

### 1. Breakout + Acceptance
**Regime**: Trend, Expansion  
**Logic**: Clean structural break with price acceptance above/below level

**Detection Criteria**:
- Structural break on H1/M15/H4 with strength ≥ 0.6
- Acceptance time: 5-15 minutes depending on timeframe
- Orderflow alignment: CVD trend + imbalance support
- Volume confirmation on break

**Entry**: Limit order slightly beyond break level (0.05% buffer)  
**Stop**: Next structural level or ATR-based  
**Target**: Next resistance/support or ATR multiple

### 2. Pullback Structural
**Regime**: Strong Trend (≥0.7 strength)  
**Logic**: Trend continuation after pullback to structural support/resistance

**Detection Criteria**:
- Clear trend identification across timeframes
- Pullback to significant level (max 50% retracement)
- Orderflow resumption in trend direction
- Volume confirmation on resumption

**Entry**: Limit at structural level  
**Stop**: Beyond pullback invalidation level  
**Target**: Trend continuation projection

### 3. Liquidity Sweep + Reversal
**Regime**: Range, Late Trend  
**Logic**: False breakout sweeps liquidity then reverses

**Detection Criteria**:
- Liquidity sweep beyond range/swing (min 0.2% distance)
- Absorption detection in orderflow
- CVD flip confirmation
- High stress → low stress transition

**Entry**: Limit on reversal confirmation  
**Stop**: Beyond sweep high/low  
**Target**: Return to range or structural level

## 🔧 IMPLEMENTATION

### Setup Detection
```typescript
import { setupEngine } from '@/lib/setup/engine';

// Process market state
const decision = await setupEngine.processMarketState(marketState);

console.log(`Found ${decision.setups.length} valid setups`);
decision.setups.forEach(setup => {
  console.log(`${setup.setupType} on ${setup.symbol}: ${setup.confidenceScore}`);
});
```

### Setup Monitoring
```typescript
// Get active setups
const activeSetups = setupEngine.getActiveSetups();

// Get engine statistics
const stats = setupEngine.getEngineStats();
console.log(`Active: ${stats.activeSetups}/${stats.maxConcurrentSetups}`);
```

### Setup Triggering
```typescript
// Trigger setup when price reached
const triggered = await setupEngine.triggerSetup(
  setupId, 
  actualEntryPrice, 
  marketState
);
```

## 📈 VALIDATION CRITERIA

### Basic Validation
- ✅ All required fields present
- ✅ Valid price levels and relationships
- ✅ Reasonable TTL (1 minute - 1 hour)
- ✅ Evidence support (≥3 pieces)

### Risk Validation
- ✅ Confidence score ≥ 70%
- ✅ Risk-reward ratio ≥ 1.2
- ✅ Max risk per trade ≤ $100
- ✅ Stop distance 0.5% - 5%
- ✅ Logical entry/stop/target relationship

### Market Validation
- ✅ Symbol in MSF universe with good fit
- ✅ Regime compatible with setup type
- ✅ Session compatibility (avoid Asian)
- ✅ Adequate liquidity and low stress

### Conflict Validation
- ✅ Max concurrent setups (3)
- ✅ Max exposure per symbol ($200)
- ✅ No conflicting directions on same symbol
- ✅ No overlapping entry levels (1% threshold)

## 🚀 API ENDPOINTS

### GET /api/setup/current
Real-time active setups and engine state
```json
{
  "ok": true,
  "data": {
    "activeSetups": [...],
    "stats": {
      "activeSetups": 2,
      "maxConcurrentSetups": 3,
      "avgConfidenceScore": 0.82,
      "totalRisk": 180
    },
    "alerts": [...]
  }
}
```

### GET /api/setup/kpis?days=30
Performance analysis and derivatives readiness
```json
{
  "ok": true,
  "data": {
    "performance": {
      "expectancy": 12.5,
      "winRate": 0.65,
      "avgRiskReward": 1.8
    },
    "assessment": {
      "readyForDerivatives": true
    }
  }
}
```

### GET /api/setup/replay/[setupId]
Complete setup lifecycle for debugging
```json
{
  "ok": true,
  "data": {
    "events": [...],
    "analysis": {
      "detectionQuality": {...},
      "executionQuality": {...}
    }
  }
}
```

## 🗄️ DATABASE INTEGRATION

### Event Storage
All setup events stored in `setup_events` table with:
- Complete lifecycle tracking
- Market state snapshots
- Performance outcomes
- Replay capability

### KPI Functions
- `calculate_setup_kpis(start_time, end_time)` - Performance metrics
- `get_setup_performance_by_type(...)` - Breakdown by setup type
- `get_setup_lifecycle(setup_id)` - Complete event history

## 🧪 TESTING

### Comprehensive Test Suite
```bash
# Test event logger
node scripts/dev/test-setup-logger.mjs

# Test complete engine
node scripts/dev/test-setup-engine.mjs
```

**Test Coverage**:
- ✅ Market state processing
- ✅ Setup detection and validation
- ✅ Risk management and conflicts
- ✅ Lifecycle management
- ✅ Edge cases and error handling
- ✅ Performance monitoring

## 🔒 PRODUCTION CONSIDERATIONS

### Performance
- **Efficient detection** - Prioritized timeframe analysis
- **Batched logging** - 100 events per batch, 5-second flush
- **Indexed queries** - Optimized for time-series and KPI extraction
- **Memory management** - Active setup cleanup and limits

### Reliability
- **Fail-closed design** - No setup if any validation fails
- **Error isolation** - Continue processing other symbols on errors
- **Graceful degradation** - System continues if logging fails
- **Circuit breakers** - Kill switches for system protection

### Monitoring
- **Real-time alerts** - Expiring setups, capacity limits
- **Performance tracking** - Success rates, slippage, drawdown
- **Risk monitoring** - Exposure limits, concentration alerts
- **System health** - Processing times, error rates

## 🎯 PHASE 1 VALIDATION WORKFLOW

### Deployment Process
1. **Deploy Setup Engine** with complete logging
2. **Run on Spot/Spot-Margin** for minimum 100 trades
3. **Monitor via APIs** - Real-time setup tracking
4. **Extract KPIs** - Automated performance analysis
5. **Validate Criteria** - Automated derivatives readiness check

### Success Criteria (Non-Negotiable)
- ✅ **Expectancy > 0** - Positive expected value
- ✅ **Risk-Reward ≥ 1.2** - Adequate risk management
- ✅ **Max Drawdown < 10%** - Controlled losses
- ✅ **Sample Size ≥ 100** - Statistical significance
- ✅ **Slippage < 0.1%** - Execution quality
- ✅ **System Stability** - No critical failures

### Derivatives Promotion
Only after **ALL** criteria are met:
- 🔓 **Unlock derivatives venues** (Bybit, OKX)
- 🔓 **Enable 2x-3x leverage** (same setups, same risk)
- 🔓 **Advanced features** (funding-adjusted expectancy)

## 📊 CURRENT STATUS

### ✅ COMPLETED COMPONENTS
- **Setup Detection Engine** - Breakout rules implemented
- **Setup Validator** - Comprehensive validation
- **Event Logger** - Complete audit trail
- **API Layer** - Real-time monitoring
- **Database Schema** - Optimized for performance
- **Test Suite** - Comprehensive coverage

### 🔄 IN PROGRESS
- **Pullback Rules** - Structural pullback detection
- **Liquidity Sweep Rules** - Sweep and reversal logic
- **Real Market Data Integration** - Live price feeds
- **Dashboard UI** - Visual setup monitoring

### 🎯 NEXT STEPS
1. **Complete remaining setup rules** (pullback, liquidity sweep)
2. **Integrate with real market data** (Binance WebSocket)
3. **Deploy to staging environment** 
4. **Begin Phase 1 validation** (100+ trades)
5. **Build monitoring dashboard**

---

**Status**: 🟡 **CORE COMPLETE** - Ready for rule completion and testing  
**Dependencies**: MCE, UCM, MSF, Supabase  
**Next**: Complete pullback and liquidity sweep rules  

The Setup Engine provides the **professional foundation** for systematic trading with complete audit trails, risk management, and derivatives promotion pathway. The core architecture is production-ready and extensible.