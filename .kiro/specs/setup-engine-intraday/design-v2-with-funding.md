# Setup Engine Intraday - Design v2 (With Funding & L2 Integration)

**Status**: DESIGN DRAFT - FUNDING & L2 INTEGRATION  
**Last Updated**: 2026-01-01  
**Scope**: Complete setup detection flow including funding management and L2 imbalance trigger logic

## Overview

This design extends the existing Setup Engine with three critical missing components:

1. **Funding Manager** - Manages trading capital, tracks open positions, calculates available capital
2. **L2 Imbalance Detector** - Analyzes order book for imbalances that signal trading opportunities
3. **Setup Trigger Engine** - Combines funding availability + L2 imbalance to generate actual setups

These components bridge the gap between market analysis (MCE/UCM/MSF) and actual trading signal generation.

## Architecture - Extended

```mermaid
graph TB
    A[Market State Input] --> B[Context Filter]
    B --> C[Structure Engine]
    B --> D[Liquidity Engine] 
    B --> E[Orderflow Engine]
    
    C --> F[Setup Generator]
    D --> F
    E --> F
    
    F --> G[Setup Validator]
    G --> H[Output: SetupCandidate[]]
    
    I[MCE/MSF/UCM] --> A
    J[Real-time Feeds] --> A
    
    K[Performance Monitor] --> F
    L[Risk Engine] --> G
    
    M[Funding Manager] -.-> N[Setup Trigger Engine]
    D -.-> N
    N -.-> H
    
    O[Paper Execution] --> M
```

## New Components

### 1. Funding Manager

**Purpose**: Track available capital, manage position sizing, enforce risk limits

**Interface**:

```typescript
interface FundingState {
  startingCapital: number;           // Initial capital in USD
  currentCapital: number;            // Current available capital
  usedCapital: number;               // Capital allocated to open positions
  openPositions: Position[];         // Array of open positions
  trades: Trade[];                   // Historical trades
  timestamp: number;                 // Last update timestamp
  version: string;                   // State version for replay
}

interface Position {
  positionId: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  quantity: number;
  allocatedCapital: number;          // Capital tied up in this position
  timestamp: number;
}

interface Trade {
  tradeId: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  duration: number;                  // Milliseconds
  outcome: 'WIN' | 'LOSS' | 'BREAKEVEN';
  timestamp: number;
}

class FundingManager {
  // Initialization
  initialize(startingCapital: number): FundingState
  
  // Capital queries
  getAvailableCapital(): number
  getUsedCapital(): number
  getCapitalUtilization(): number    // 0-1 ratio
  
  // Position management
  allocateCapital(amount: number, positionId: string): void
  releaseCapital(amount: number, positionId: string): void
  getMaxPositionSize(riskPercent: number): number
  
  // Trade recording
  recordTrade(trade: Trade): void
  updatePosition(positionId: string, currentPrice: number): void
  
  // State management
  getState(): FundingState
  setState(state: FundingState): void
  
  // Validation
  canAllocate(amount: number): boolean
  validatePositionSize(amount: number, riskPercent: number): boolean
}
```

**Key Calculations**:

```typescript
// Available capital calculation
availableCapital = currentCapital - usedCapital

// Position sizing based on risk percentage
maxPositionSize = (availableCapital * riskPercent) / (entryPrice - stopPrice)

// Capital utilization
utilization = usedCapital / currentCapital

// Position P&L tracking
positionPnL = (currentPrice - entryPrice) * quantity
positionPnLPercent = (currentPrice - entryPrice) / entryPrice
```

### 2. L2 Imbalance Detector

**Purpose**: Analyze order book for imbalances that signal trading opportunities

**Interface**:

```typescript
interface L2Book {
  symbol: string;
  timestamp: number;
  bids: L2Level[];                   // Bid side levels
  asks: L2Level[];                   // Ask side levels
  midPrice: number;
  spread: number;
}

interface L2Level {
  price: number;
  size: number;
  count: number;                     // Number of orders at this level
}

interface L2Imbalance {
  symbol: string;
  timestamp: number;
  
  // Imbalance metrics
  topOfBookImbalance: number;        // (bid_size - ask_size) / (bid_size + ask_size)
  depth5Imbalance: number;           // Imbalance at 5-level depth
  depth10Imbalance: number;          // Imbalance at 10-level depth
  depth20Imbalance: number;          // Imbalance at 20-level depth
  
  // Direction and strength
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  strength: number;                  // 0-1 score
  
  // Persistence tracking
  persistenceDuration: number;       // Seconds imbalance has persisted
  persistenceStrength: number;       // How consistent the imbalance is
  
  // Liquidity voids
  voidLevels: number[];              // Price levels with liquidity voids
  voidStrength: number;              // 0-1 score
  
  // Microprice divergence
  microprice: number;
  micropriceDivergence: number;      // Ticks from mid-price
}

class L2ImbalanceDetector {
  // L2 book fetching
  fetchL2Book(symbol: string, depth: number): Promise<L2Book>
  
  // Imbalance calculation
  calculateImbalance(book: L2Book): L2Imbalance
  
  // Significance testing
  isSignificant(imbalance: L2Imbalance, config: ImbalanceConfig): boolean
  
  // Persistence tracking
  trackPersistence(imbalance: L2Imbalance): Promise<number>
  
  // Void detection
  detectVoids(book: L2Book): number[]
  
  // Microprice calculation
  calculateMicroprice(book: L2Book): number
}

interface ImbalanceConfig {
  minRatioThreshold: number;         // Minimum imbalance ratio (e.g., 1.3)
  minPersistenceSeconds: number;     // Minimum persistence (e.g., 2)
  minStrengthScore: number;          // Minimum strength (0-1)
  voidThreshold: number;             // Void detection threshold
}
```

**Key Calculations**:

```typescript
// Top of book imbalance
topOfBookImbalance = (bidSize - askSize) / (bidSize + askSize)

// Depth imbalance
depth5Imbalance = sum(bidSizes[1:5]) / sum(askSizes[1:5])

// Direction determination
if (imbalance > 0.1) direction = 'BULLISH'
else if (imbalance < -0.1) direction = 'BEARISH'
else direction = 'NEUTRAL'

// Strength scoring
strength = min(1.0, abs(imbalance) / maxImbalanceThreshold)

// Microprice calculation
microprice = (bidPrice * askSize + askPrice * bidSize) / (bidSize + askSize)

// Void detection
for each level in orderBook:
  expectedSize = averageSize[distanceFromMid]
  if (actualSize < expectedSize * 0.3):
    markAsVoid(level)
```

### 3. Setup Trigger Engine

**Purpose**: Combine funding availability + L2 imbalance to generate actual setups

**Interface**:

```typescript
interface SetupTrigger {
  setupId: string;
  timestamp: number;
  symbol: string;
  
  // Trigger source
  triggerType: 'L2_IMBALANCE' | 'FUNDING_AVAILABLE' | 'COMBINED';
  triggerReason: string;             // Human-readable reason
  
  // Setup parameters
  direction: 'LONG' | 'SHORT';
  entry: number;
  stop: number;
  target: number;
  positionSize: number;
  
  // Quality metrics
  confidence: number;                // 0-100
  riskReward: number;
  
  // Funding integration
  capitalRequired: number;
  capitalAvailable: number;
  capitalUtilization: number;
  
  // L2 integration
  imbalanceRatio: number;
  imbalanceDirection: string;
  imbalanceStrength: number;
}

class SetupTriggerEngine {
  // Trigger checking
  checkTrigger(
    symbol: string,
    imbalance: L2Imbalance,
    funding: FundingState,
    config: SetupTriggerConfig
  ): SetupTrigger | null
  
  // Setup validation
  validateSetup(setup: SetupTrigger, config: SetupTriggerConfig): boolean
  
  // Confidence calculation
  calculateConfidence(
    imbalance: L2Imbalance,
    funding: FundingState,
    config: SetupTriggerConfig
  ): number
  
  // Position sizing
  calculatePositionSize(
    entry: number,
    stop: number,
    availableCapital: number,
    config: SetupTriggerConfig
  ): number
}

interface SetupTriggerConfig {
  // Imbalance thresholds
  minImbalanceRatio: number;         // e.g., 1.3
  minImbalanceStrength: number;      // 0-1
  minPersistenceSeconds: number;     // e.g., 2
  
  // Funding requirements
  minAvailableCapital: number;       // Minimum capital to trigger
  maxCapitalUtilization: number;     // Max % of capital to use
  riskPercentPerTrade: number;       // % of capital at risk per trade
  
  // Setup requirements
  minRiskReward: number;             // Minimum R:R ratio
  minConfidence: number;             // Minimum confidence score
  
  // Position sizing
  positionSizeMultiplier: number;    // Multiplier for position size
  maxPositionSize: number;           // Maximum position size
}
```

**Trigger Logic**:

```typescript
function checkTrigger(
  symbol: string,
  imbalance: L2Imbalance,
  funding: FundingState,
  config: SetupTriggerConfig
): SetupTrigger | null {
  
  // Check 1: Imbalance significance
  if (abs(imbalance.topOfBookImbalance) < config.minImbalanceRatio) {
    return null;  // Imbalance not significant enough
  }
  
  // Check 2: Imbalance strength
  if (imbalance.strength < config.minImbalanceStrength) {
    return null;  // Imbalance not strong enough
  }
  
  // Check 3: Imbalance persistence
  if (imbalance.persistenceDuration < config.minPersistenceSeconds) {
    return null;  // Imbalance not persistent enough
  }
  
  // Check 4: Available capital
  if (funding.getAvailableCapital() < config.minAvailableCapital) {
    return null;  // Not enough capital
  }
  
  // Check 5: Capital utilization
  if (funding.getCapitalUtilization() > config.maxCapitalUtilization) {
    return null;  // Already too much capital in use
  }
  
  // All checks passed - generate setup
  const direction = imbalance.direction === 'BULLISH' ? 'LONG' : 'SHORT';
  const entry = imbalance.microprice;
  const stop = calculateStop(entry, direction, imbalance);
  const target = calculateTarget(entry, direction, imbalance);
  
  const positionSize = calculatePositionSize(
    entry,
    stop,
    funding.getAvailableCapital(),
    config
  );
  
  const confidence = calculateConfidence(imbalance, funding, config);
  
  return {
    setupId: generateId(),
    timestamp: Date.now(),
    symbol,
    triggerType: 'COMBINED',
    triggerReason: `L2 imbalance (${imbalance.direction}) + available capital`,
    direction,
    entry,
    stop,
    target,
    positionSize,
    confidence,
    riskReward: (target - entry) / (entry - stop),
    capitalRequired: positionSize * entry,
    capitalAvailable: funding.getAvailableCapital(),
    capitalUtilization: funding.getCapitalUtilization(),
    imbalanceRatio: abs(imbalance.topOfBookImbalance),
    imbalanceDirection: imbalance.direction,
    imbalanceStrength: imbalance.strength
  };
}
```

## Data Flow - Extended

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. Funding Manager                                         │
│     - Initialize with $10,000                               │
│     - Track open positions: -$3,500                          │
│     - Calculate available capital: $6,500                   │
│                                                             │
│  2. L2 Imbalance Detector                                   │
│     - Fetch L2 book for BTCUSDT                             │
│     - Calculate imbalance: 1.5x (bullish)                   │
│     - Strength: 0.78                                        │
│     - Persistence: 2.3 seconds                              │
│                                                             │
│  3. Setup Trigger Engine                                    │
│     - Check: Imbalance (1.5x) ✓                             │
│     - Check: Capital ($6,500) ✓                             │
│     - Check: Strength (0.78) ✓                              │
│     - Check: Persistence (2.3s) ✓                           │
│     - Generate setup with entry/stop/target                │
│     - Confidence: 0.78                                      │
│                                                             │
│  4. Setup Validator (existing)                              │
│     - Validate R:R ratio                                    │
│     - Validate execution feasibility                        │
│     - Validate portfolio conflicts                          │
│                                                             │
│  5. Paper Execution                                         │
│     - Execute at entry: $87,900                             │
│     - Track P&L in real-time                                │
│     - Close at target: $88,200                              │
│     - Record: +$300 profit                                  │
│                                                             │
│  6. Update Funding                                          │
│     - Release capital from trade                            │
│     - Update available capital: $6,800                      │
│     - Ready for next setup                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Integration Points

### With Existing Setup Engine

The three new components integrate seamlessly with the existing Setup Engine:

1. **Funding Manager** provides capital constraints to Setup Validator
2. **L2 Imbalance Detector** feeds into Liquidity Engine (already exists)
3. **Setup Trigger Engine** generates SetupCandidate objects compatible with existing validator

### With MCE (Market Context Engine)

- Use regime signatures for trigger validation
- Only trigger setups in compatible regimes
- Example: Only trigger bullish setups in UP trend

### With UCM (Universe Control Module)

- Only trigger setups for symbols in active universe
- Respect symbol eligibility criteria

### With MSF (Market Selection & Fit)

- Only trigger setups for A/B class symbols
- Respect market fit classification

### With Paper Execution

- Execute triggered setups
- Update funding after each trade
- Track P&L and statistics

## Correctness Properties - Extended

### Property 1: Funding Allocation Correctness
*For any* capital allocation, the sum of used capital plus available capital should equal current capital, and no allocation should exceed available capital.
**Validates: Funding Manager integrity**

### Property 2: L2 Imbalance Bounds
*For any* L2 book analysis, calculated imbalance ratios should be bounded between -1.0 and 1.0, and strength scores should be between 0.0 and 1.0.
**Validates: L2 Imbalance Detector correctness**

### Property 3: Setup Trigger Consistency
*For any* identical market state (funding + L2 imbalance), the Setup Trigger Engine should produce identical setup candidates with identical confidence scores.
**Validates: Setup Trigger Engine determinism**

### Property 4: Capital Constraint Enforcement
*For any* setup trigger, the required capital should never exceed available capital, and position sizing should respect maximum utilization limits.
**Validates: Risk management enforcement**

### Property 5: Imbalance Persistence Validation
*For any* L2 imbalance, if persistence duration is less than configured minimum, the Setup Trigger Engine should not generate a setup.
**Validates: Imbalance quality filtering**

### Property 6: Confidence Score Monotonicity
*For any* two L2 imbalances where one has stronger metrics (higher ratio, higher strength, longer persistence), the confidence score should be higher.
**Validates: Confidence scoring consistency**

## Error Handling - Extended

**Funding Manager Errors:**
- `INSUFFICIENT_CAPITAL`: Allocation request exceeds available capital
- `INVALID_POSITION_ID`: Position ID not found in open positions
- `CAPITAL_MISMATCH`: Used + available capital doesn't equal current capital

**L2 Imbalance Detector Errors:**
- `L2_FETCH_FAILED`: Unable to fetch L2 book from exchange
- `INVALID_L2_DATA`: L2 book data format invalid
- `IMBALANCE_CALCULATION_FAILED`: Calculation error in imbalance computation

**Setup Trigger Engine Errors:**
- `INSUFFICIENT_CAPITAL_FOR_SETUP`: Available capital below minimum
- `IMBALANCE_NOT_SIGNIFICANT`: Imbalance below significance threshold
- `TRIGGER_VALIDATION_FAILED`: Setup failed trigger validation

## Testing Strategy - Extended

### Unit Tests

**Funding Manager Tests:**
- Capital allocation and release
- Position tracking
- P&L calculation
- State persistence

**L2 Imbalance Detector Tests:**
- Imbalance calculation correctness
- Void detection accuracy
- Microprice calculation
- Persistence tracking

**Setup Trigger Engine Tests:**
- Trigger condition evaluation
- Confidence scoring
- Position sizing
- Capital constraint enforcement

### Property-Based Tests

**Property 1: Funding Allocation Correctness**
```
For all: (startingCapital, allocations, releases)
  state = initialize(startingCapital)
  for each allocation:
    state = allocate(state, amount)
  for each release:
    state = release(state, amount)
  
  assert: state.usedCapital + state.availableCapital == state.currentCapital
  assert: state.availableCapital >= 0
  assert: state.usedCapital >= 0
```

**Property 2: L2 Imbalance Bounds**
```
For all: (L2Book)
  imbalance = calculateImbalance(book)
  
  assert: -1.0 <= imbalance.topOfBookImbalance <= 1.0
  assert: -1.0 <= imbalance.depth5Imbalance <= 1.0
  assert: 0.0 <= imbalance.strength <= 1.0
  assert: imbalance.direction in ['BULLISH', 'BEARISH', 'NEUTRAL']
```

**Property 3: Setup Trigger Consistency**
```
For all: (marketState, config)
  setup1 = checkTrigger(marketState, config)
  setup2 = checkTrigger(marketState, config)
  
  assert: setup1.setupId == setup2.setupId
  assert: setup1.confidence == setup2.confidence
  assert: setup1.entry == setup2.entry
  assert: setup1.stop == setup2.stop
  assert: setup1.target == setup2.target
```

**Property 4: Capital Constraint Enforcement**
```
For all: (availableCapital, setupRequirements, config)
  if availableCapital < config.minAvailableCapital:
    assert: checkTrigger(...) == null
  
  if capitalUtilization > config.maxCapitalUtilization:
    assert: checkTrigger(...) == null
```

## Implementation Phases

### Phase 1: Funding Manager (Days 1-2)
- [ ] Implement FundingManager class
- [ ] Add capital allocation/release logic
- [ ] Add position tracking
- [ ] Add P&L calculation
- [ ] Create API endpoints
- [ ] Write unit tests
- [ ] Write property tests

### Phase 2: L2 Imbalance Detector (Days 3-4)
- [ ] Implement L2ImbalanceDetector class
- [ ] Integrate with Binance L2 API
- [ ] Add imbalance calculation
- [ ] Add void detection
- [ ] Add microprice calculation
- [ ] Create API endpoints
- [ ] Write unit tests
- [ ] Write property tests

### Phase 3: Setup Trigger Engine (Days 5-6)
- [ ] Implement SetupTriggerEngine class
- [ ] Add trigger checking logic
- [ ] Add confidence calculation
- [ ] Add position sizing
- [ ] Create API endpoints
- [ ] Write unit tests
- [ ] Write property tests

### Phase 4: Integration (Days 7-8)
- [ ] Integrate with existing Setup Engine
- [ ] Integrate with Paper Execution
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Production deployment

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

## Open Questions

1. **L2 Imbalance Thresholds**
   - What ratio triggers a setup? (1.3x, 1.5x, 2.0x?)
   - How long should imbalance persist? (1s, 2s, 5s?)
   - Should we use different thresholds per symbol?

2. **Funding Allocation**
   - What % of available capital per setup? (10%, 20%, 50%?)
   - Should we support leverage? (1x, 2x, 5x?)
   - How to handle margin calls?

3. **Setup Confidence**
   - How to weight funding vs L2 imbalance?
   - Should we require trend confirmation from MCE?
   - How to handle conflicting signals?

4. **Paper Execution**
   - Should we simulate slippage?
   - Should we simulate order rejection?
   - How to handle partial fills?

## Dependencies

- `lib/setup/` - Existing Setup Engine components
- `lib/mce/` - Market Context Engine (regime signatures)
- `lib/ucm/` - Universe Control Module (symbol eligibility)
- `lib/msf/` - Market Selection & Fit (symbol classification)
- `lib/market-data/` - Market data aggregation
- Binance API - L2 order book data
- Supabase - State persistence

## References

- Setup Engine Intraday Requirements: `.kiro/specs/setup-engine-intraday/requirements.md`
- Setup Engine Intraday Design: `.kiro/specs/setup-engine-intraday/design.md`
- Paper Execution: `lib/setup/paper-execution.ts`
- Market Data Integration: `.kiro/specs/market-data-integration-phase1/`
