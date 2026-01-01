# Setup Engine v2 - Funding & L2 Integration Complete

**Date**: 2026-01-01  
**Status**: SPEC COMPLETE - READY FOR IMPLEMENTATION  
**Scope**: Complete setup detection flow with funding management and L2 imbalance triggers

## What Was Missing

The original Setup Engine had comprehensive market analysis (structure, liquidity, orderflow) but was missing the **critical last brick** that connects analysis to actual trading signals:

### ❌ Three Missing Components

1. **Funding Manager** ❌
   - No capital tracking
   - No position sizing logic
   - No available capital calculation
   - Impact: Can't enforce risk management

2. **L2 Imbalance Detector** ❌
   - No order book analysis
   - No imbalance calculation
   - No signal generation
   - Impact: Can't identify high-probability setups

3. **Setup Trigger Engine** ❌
   - No logic to combine funding + L2 imbalance
   - No setup generation
   - No confidence scoring
   - Impact: Can't trigger actual setups

## What Was Created

### 1. Design Document: `design-v2-with-funding.md`

**Comprehensive design including:**
- Funding Manager architecture and interfaces
- L2 Imbalance Detector algorithms and calculations
- Setup Trigger Engine logic and trigger conditions
- Extended data flow showing all three components
- Integration points with existing systems
- Correctness properties for each component
- Error handling strategies
- Testing strategy with property-based tests

**Key Features:**
- Funding allocation/release with capital constraints
- L2 imbalance calculation (top-of-book, depth 5/10/20)
- Void detection and microprice calculation
- Trigger logic combining funding + L2 imbalance
- Confidence scoring based on multiple factors
- Position sizing based on available capital and risk

### 2. Tasks Document: `tasks-v2-with-funding.md`

**Implementation plan with 6 phases:**

**Phase 1: Funding Manager (Days 1-2)**
- Core implementation
- Property tests for allocation correctness
- API endpoints
- Unit tests

**Phase 2: L2 Imbalance Detector (Days 3-4)**
- Core implementation
- Property tests for bounds checking
- API endpoints
- Unit tests

**Phase 3: Setup Trigger Engine (Days 5-6)**
- Core implementation
- Property tests for consistency
- Property tests for capital constraints
- API endpoints
- Unit tests

**Phase 4: Integration (Days 7-8)**
- Integration with Paper Execution
- End-to-end tests
- Dashboard components
- Integration tests

**Phase 5: Performance & Hardening (Days 9-10)**
- Performance optimization
- Circuit breakers and error handling
- Monitoring and alerting
- Stress tests

**Phase 6: Production Deployment (Days 11-12)**
- Deployment guide
- Staging deployment
- Production deployment
- Final verification

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  MCE → regime_signatures                                    │
│  UCM → universe_active                                      │
│  MSF → msf_day_gates + msf_market_fits                      │
│                                                             │
│  ✅ All working, all data flowing                           │
│                                                             │
│  NEW: Funding Manager                                       │
│  - Initialize with starting capital                         │
│  - Track open positions                                     │
│  - Calculate available capital                              │
│  - Enforce position sizing limits                           │
│                                                             │
│  NEW: L2 Imbalance Detector                                 │
│  - Fetch L2 order book                                      │
│  - Calculate bid/ask imbalance                              │
│  - Detect liquidity voids                                   │
│  - Calculate microprice                                     │
│                                                             │
│  NEW: Setup Trigger Engine                                  │
│  - Check: Imbalance significance                            │
│  - Check: Available capital                                 │
│  - Check: Capital utilization limits                        │
│  - Generate setup with entry/stop/target                    │
│  - Calculate confidence score                               │
│                                                             │
│  ✅ Setup Validator (existing)                              │
│  - Validate R:R ratio                                       │
│  - Validate execution feasibility                           │
│  - Validate portfolio conflicts                             │
│                                                             │
│  ✅ Paper Execution (existing)                              │
│  - Execute triggered setups                                 │
│  - Track P&L                                                │
│  - Update funding after trades                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## End-to-End Flow

```
1. Funding Manager
   Starting Capital: $10,000
   Open Positions: -$3,500
   Available Capital: $6,500
   ↓

2. L2 Imbalance Detector
   BTCUSDT L2 Book:
   - Bid Volume (top 5): 150 BTC
   - Ask Volume (top 5): 100 BTC
   - Imbalance: 1.5x (BULLISH)
   - Strength: 0.78
   - Persistence: 2.3 seconds
   ↓

3. Setup Trigger Engine
   Check: Imbalance (1.5x) ✓
   Check: Capital ($6,500) ✓
   Check: Strength (0.78) ✓
   Check: Persistence (2.3s) ✓
   Generate Setup:
   - Entry: $87,900
   - Stop: $87,500
   - Target: $88,500
   - Position Size: $1,300 (20% of available)
   - Confidence: 0.78
   ↓

4. Setup Validator
   Validate R:R: 1.5:1 ✓
   Validate Execution: Feasible ✓
   Validate Portfolio: No conflicts ✓
   ↓

5. Paper Execution
   Execute Setup:
   - Entry: $87,900 @ 12:34:56
   - Exit: $88,200 @ 12:45:23
   - P&L: +$300 (+23% ROI)
   ↓

6. Update Funding
   Release Capital: +$1,300
   New Available: $7,800
   Ready for next setup
```

## Key Components

### Funding Manager

```typescript
class FundingManager {
  initialize(startingCapital: number): FundingState
  getAvailableCapital(): number
  getUsedCapital(): number
  allocateCapital(amount: number, positionId: string): void
  releaseCapital(amount: number, positionId: string): void
  getMaxPositionSize(riskPercent: number): number
  recordTrade(trade: Trade): void
}
```

**Key Calculations:**
- Available Capital = Current Capital - Used Capital
- Max Position Size = (Available Capital × Risk %) / (Entry - Stop)
- Capital Utilization = Used Capital / Current Capital

### L2 Imbalance Detector

```typescript
class L2ImbalanceDetector {
  fetchL2Book(symbol: string, depth: number): Promise<L2Book>
  calculateImbalance(book: L2Book): L2Imbalance
  isSignificant(imbalance: L2Imbalance, config: ImbalanceConfig): boolean
  trackPersistence(imbalance: L2Imbalance): Promise<number>
  detectVoids(book: L2Book): number[]
  calculateMicroprice(book: L2Book): number
}
```

**Key Calculations:**
- Top of Book Imbalance = (Bid Size - Ask Size) / (Bid Size + Ask Size)
- Depth Imbalance = Sum(Bid Sizes) / Sum(Ask Sizes)
- Microprice = (Bid Price × Ask Size + Ask Price × Bid Size) / (Bid Size + Ask Size)

### Setup Trigger Engine

```typescript
class SetupTriggerEngine {
  checkTrigger(
    symbol: string,
    imbalance: L2Imbalance,
    funding: FundingState,
    config: SetupTriggerConfig
  ): SetupTrigger | null
  
  validateSetup(setup: SetupTrigger, config: SetupTriggerConfig): boolean
  calculateConfidence(imbalance: L2Imbalance, funding: FundingState, config: SetupTriggerConfig): number
  calculatePositionSize(entry: number, stop: number, availableCapital: number, config: SetupTriggerConfig): number
}
```

**Trigger Logic:**
1. Check imbalance significance (ratio, strength, persistence)
2. Check available capital (minimum required)
3. Check capital utilization (maximum allowed)
4. Generate setup with entry/stop/target
5. Calculate confidence score
6. Return SetupTrigger or null

## Correctness Properties

### Property 1: Funding Allocation Correctness
*For any* capital allocation, used + available = current, and no allocation exceeds available.

### Property 2: L2 Imbalance Bounds
*For any* L2 book analysis, imbalance ratios bounded [-1.0, 1.0] and strength [0.0, 1.0].

### Property 3: Setup Trigger Consistency
*For any* identical market state, identical setup candidates with identical confidence scores.

### Property 4: Capital Constraint Enforcement
*For any* setup trigger, required capital ≤ available capital and position sizing respects limits.

### Property 5: Imbalance Persistence Validation
*For any* L2 imbalance, if persistence < minimum, no setup is generated.

### Property 6: Confidence Score Monotonicity
*For any* two imbalances, stronger metrics → higher confidence score.

## Success Metrics

1. **Funding Management**
   - Zero over-allocation (never exceed available capital)
   - Accurate P&L tracking (within 0.01%)
   - Proper capital release after trades

2. **L2 Imbalance Detection**
   - Detect imbalances within 100ms
   - Accuracy: >85% (correctly identify direction)
   - False positive rate: <15%

3. **Setup Trigger Generation**
   - Trigger latency: <50ms
   - Confidence score accuracy: >80%
   - Capital constraint enforcement: 100%

4. **End-to-End Flow**
   - Complete flow latency: <200ms
   - Setup generation rate: 100+ per day
   - Capital utilization: 60-80% optimal range

## Implementation Timeline

- **Phase 1**: Days 1-2 (Funding Manager)
- **Phase 2**: Days 3-4 (L2 Imbalance Detector)
- **Phase 3**: Days 5-6 (Setup Trigger Engine)
- **Phase 4**: Days 7-8 (Integration)
- **Phase 5**: Days 9-10 (Performance & Hardening)
- **Phase 6**: Days 11-12 (Production Deployment)

**Total**: 12 days for complete implementation

## Files Created

1. `.kiro/specs/setup-engine-intraday/design-v2-with-funding.md` - Complete design document
2. `.kiro/specs/setup-engine-intraday/tasks-v2-with-funding.md` - Implementation tasks
3. `docs/setup-engine-v2-funding-integration-complete.md` - This summary

## Next Steps

1. **Review Design** - Check `.kiro/specs/setup-engine-intraday/design-v2-with-funding.md`
2. **Review Tasks** - Check `.kiro/specs/setup-engine-intraday/tasks-v2-with-funding.md`
3. **Approve** - Confirm you want to proceed with implementation
4. **Start Phase 1** - Begin with Funding Manager implementation
5. **Execute Tasks** - Work through each phase incrementally

## Key Decisions Needed

1. **L2 Imbalance Thresholds**
   - What ratio triggers a setup? (1.3x, 1.5x, 2.0x?)
   - How long should imbalance persist? (1s, 2s, 5s?)
   - Different thresholds per symbol?

2. **Funding Allocation**
   - What % of available capital per setup? (10%, 20%, 50%?)
   - Support leverage? (1x, 2x, 5x?)
   - How to handle margin calls?

3. **Setup Confidence**
   - How to weight funding vs L2 imbalance?
   - Require trend confirmation from MCE?
   - How to handle conflicting signals?

4. **Paper Execution**
   - Simulate slippage?
   - Simulate order rejection?
   - Handle partial fills?

## Conclusion

You now have a **complete specification** for the three missing components that will make your system truly operational:

- ✅ **Design Document** - Comprehensive architecture and algorithms
- ✅ **Tasks Document** - Detailed implementation plan with 6 phases
- ✅ **Correctness Properties** - Formal specifications for validation
- ✅ **Success Metrics** - Clear targets for each component

The system is ready for implementation. Once these three components are built and integrated, you'll have:

- ✅ Real-time market data (MCE)
- ✅ Intelligent symbol selection (UCM)
- ✅ Market classification (MSF)
- ✅ **Capital management** ← NEW
- ✅ **L2 imbalance detection** ← NEW
- ✅ **Setup trigger generation** ← NEW
- ✅ Paper execution for validation
- ✅ Complete end-to-end trading system

**Ready to proceed with implementation?**
