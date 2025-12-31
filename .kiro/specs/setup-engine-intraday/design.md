# Setup Engine Intraday - Design Document

## Overview

The Setup Engine Intraday is a professional-grade algorithmic trading system that generates high-probability setup candidates through multi-dimensional market analysis. The system implements institutional-level standards for setup identification, combining multi-timeframe structural analysis, Level 2 order book dynamics, and trade tape order flow analysis into a unified decision framework.

The engine operates as a deterministic state machine, processing standardized market inputs through a series of validation filters to produce mathematically precise setup candidates with defined risk parameters, confidence scores, and execution specifications.

## Architecture

### System Architecture

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
```

### Data Flow Architecture

The system follows a strict pipeline architecture where each component has clearly defined inputs, outputs, and failure modes:

1. **Input Validation Layer**: Ensures all required market state components are present and valid
2. **Context Filtering Layer**: Applies regime, session, and risk filters before setup generation
3. **Analysis Layer**: Parallel processing of structure, liquidity, and order flow analysis
4. **Generation Layer**: Combines analysis outputs to generate setup candidates
5. **Validation Layer**: Applies quality controls and risk management rules
6. **Output Layer**: Produces standardized setup candidates with execution parameters

## Components and Interfaces

### MarketState Input Interface

```typescript
interface MarketState {
  timestamp: number;           // UTC milliseconds
  symbol: string;             // Trading pair
  regime: RegimeState;        // From MCE
  universeFit: FitState;      // From MSF  
  structure: StructureMap;    // Multi-timeframe levels
  orderflow: OrderflowState;  // Tape analysis
  liquidity: LiquidityState;  // L2 book analysis
  volatility: VolatilityState; // ATR and realized vol
  session: SessionState;      // Trading session info
}

interface RegimeState {
  type: 'TREND' | 'RANGE' | 'EXPANSION' | 'COMPRESSION';
  strength: number;           // 0.0 - 1.0
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  confidence: number;         // 0.0 - 1.0
  duration: number;           // Minutes in current regime
}

interface StructureMap {
  H4: StructureLevel[];       // 4-hour levels
  H1: StructureLevel[];       // 1-hour levels  
  M15: StructureLevel[];      // 15-minute levels
}

interface StructureLevel {
  price: number;              // Exact price level
  type: 'SWING_HIGH' | 'SWING_LOW' | 'RANGE_HIGH' | 'RANGE_LOW' | 'LIQUIDITY_POOL';
  strength: number;           // 0.0 - 1.0 based on touches and volume
  age: number;               // Minutes since formation
  volume: number;            // Volume at level formation
  touches: number;           // Number of times tested
}
```

### Context Filter Component

The Context Filter implements a fail-closed approach, blocking setup generation when market conditions are unsuitable:

**Regime Compatibility Matrix:**
- TREND regime: Allows Breakout and Pullback setups
- RANGE regime: Allows Liquidity Sweep setups only  
- EXPANSION regime: Allows Breakout setups only
- COMPRESSION regime: Blocks all setup generation

**Session Validation:**
- EU Session: 07:00-16:00 UTC (High priority)
- US Session: 13:00-22:00 UTC (High priority)
- Overlap: 13:00-16:00 UTC (Maximum priority)
- Asian Session: 23:00-08:00 UTC (Reduced setup generation)

**Volatility Thresholds:**
- Minimum ATR: 0.5% of current price for setup generation
- Maximum ATR: 3.0% of current price (excessive volatility block)
- ATR calculation: 14-period on M15 timeframe

### Structure Engine Component

The Structure Engine identifies key levels across multiple timeframes using mathematical precision:

**Swing High/Low Detection Algorithm:**
```
For each timeframe (H4, H1, M15):
  lookback_period = 20 for H4, 15 for H1, 10 for M15
  
  For each bar i:
    is_swing_high = high[i] > max(high[i-lookback:i]) AND 
                   high[i] > max(high[i+1:i+lookback])
    
    is_swing_low = low[i] < min(low[i-lookback:i]) AND 
                  low[i] < min(low[i+1:i+lookback])
    
    strength = (volume[i] / avg_volume_20) * (touches / 10) * age_factor
```

**Level Strength Calculation:**
```
strength_score = base_strength * touch_multiplier * recency_multiplier * htf_priority * optional_volume_multiplier

Where:
- base_strength = 0.5 (initial)
- touch_multiplier = min(2.0, 1.0 + (touches * 0.2))
- touch_definition = price within ε ticks (ε = 2 * tick_size) + rejection (price reversal > 5 ticks)
- recency_multiplier = max(0.1, 1.0 - (age_minutes / 1440)) // Decay over 24h
- htf_priority = 2.0 for H4, 1.5 for H1, 1.0 for M15
- optional_volume_multiplier = min(2.0, volume_at_level / average_volume_20) if volume available, else 1.0
```

**Liquidity Pool Proxies:**
```
Proxy Type 1 - Swing Clusters:
  Identify clusters of swing highs/lows within 0.5% price range
  Strength = number_of_swings * timeframe_weight * recency_factor

Proxy Type 2 - Range Extremes:
  Identify range boundaries with multiple touches
  Strength = touch_count * range_duration_factor * volume_factor

Proxy Type 3 - Round Levels:
  Identify psychologically significant levels (00, 50 endings)
  Strength = proximity_to_round * historical_significance

Proxy Type 4 - Thin Liquidity Zones:
  Identify price levels with consistently low order book depth
  Strength = depth_deficit * consistency_factor * proximity_to_structure
```

### Liquidity Engine Component

The Liquidity Engine analyzes Level 2 order book data for imbalances and liquidity voids:

**Imbalance Calculation:**
```
top_of_book_imbalance = (bid_size - ask_size) / (bid_size + ask_size)
depth_imbalance_5 = sum(bid_sizes[1:5]) / sum(ask_sizes[1:5])
depth_imbalance_10 = sum(bid_sizes[1:10]) / sum(ask_sizes[1:10])
depth_imbalance_20 = sum(bid_sizes[1:20]) / sum(ask_sizes[1:20])

// Imbalance thresholds:
// Strong: |imbalance| > 0.6
// Medium: |imbalance| > 0.3  
// Weak: |imbalance| > 0.1
```

**Liquidity Void Detection:**
```
For each price level in order book:
  expected_size = average_size_at_distance[distance_from_mid]
  actual_size = current_size_at_level
  
  if actual_size < (expected_size * 0.3):
    mark_as_liquidity_void(price_level)
```

**Microprice Calculation:**
```
microprice = (bid_price * ask_size + ask_price * bid_size) / (bid_size + ask_size)
microprice_divergence = abs(microprice - last_trade_price) / tick_size

// Divergence thresholds:
// High: divergence > 3 ticks
// Medium: divergence > 1.5 ticks
// Low: divergence > 0.5 ticks
```

### Orderflow Engine Component

The Orderflow Engine analyzes trade tape data for aggression, absorption, and momentum patterns:

**Cumulative Volume Delta (CVD) Calculation:**
```
For each trade:
  if trade_price >= ask_price:
    cvd += trade_volume  // Aggressive buy
  elif trade_price <= bid_price:
    cvd -= trade_volume  // Aggressive sell
  else:
    // Mid-price trade, use tick rule
    if trade_price > previous_trade_price:
      cvd += trade_volume
    elif trade_price < previous_trade_price:
      cvd -= trade_volume

cvd_slope_1m = (cvd_current - cvd_1m_ago) / 60
cvd_slope_5m = (cvd_current - cvd_5m_ago) / 300
cvd_slope_15m = (cvd_current - cvd_15m_ago) / 900
```

**Aggression Ratio Calculation:**
```
aggressive_buy_volume = sum(trades where price >= ask)
aggressive_sell_volume = sum(trades where price <= bid)
total_aggressive_volume = aggressive_buy_volume + aggressive_sell_volume

aggression_ratio = (aggressive_buy_volume - aggressive_sell_volume) / total_aggressive_volume

// Thresholds:
// Strong Buy: aggression_ratio > 0.6
// Medium Buy: aggression_ratio > 0.3
// Neutral: -0.3 <= aggression_ratio <= 0.3
// Medium Sell: aggression_ratio < -0.3
// Strong Sell: aggression_ratio < -0.6
```

**Absorption Detection:**
```
For price level P:
  incoming_volume = sum(aggressive_trades_at_P)
  price_movement = abs(price_after - P) / tick_size
  
  absorption_strength = incoming_volume / price_movement
  
  if absorption_strength > threshold:
    mark_absorption_at_level(P)

// Absorption thresholds:
// Massive: absorption_strength > 1000
// Strong: absorption_strength > 500
// Medium: absorption_strength > 200
```

## Data Models

### Canonical Units and Precision

```typescript
// Price representation: All prices in ticks (integer)
interface PriceTick {
  value: number;                    // Integer tick value
  tickSize: number;                 // Minimum price increment
  precision: number;                // Decimal places for display
}

// Size representation: All sizes in lot steps (integer)  
interface SizeLot {
  value: number;                    // Integer lot value
  lotSize: number;                  // Minimum size increment
  precision: number;                // Decimal places for display
}

// Basis points: All percentages as integer basis points
interface BasisPoints {
  value: number;                    // Integer basis points (1 bp = 0.0001)
  
  // Conversion utilities
  toDecimal(): number;              // Convert to decimal (e.g., 150 bp = 0.015)
  toPercentage(): number;           // Convert to percentage (e.g., 150 bp = 1.5%)
}

// Rounding Policy: Banker's rounding (round half to even)
function bankerRound(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  const rounded = Math.round(value * factor);
  
  // If exactly halfway, round to even
  if (Math.abs(value * factor - rounded) === 0.5) {
    return (rounded % 2 === 0) ? rounded / factor : (rounded - 1) / factor;
  }
  
  return rounded / factor;
}
```

### SetupConfig Model

```typescript
interface SetupConfig {
  version: string;              // Semantic version (e.g., "1.2.3")
  timestamp: number;            // UTC milliseconds when config was created
  createdBy: string;            // User/system that created config
  
  // Regime-specific parameters
  regimeParams: {
    [regime: string]: {
      imbalanceThreshold: number;     // L2 imbalance threshold (0.0-1.0)
      volumeMultiplier: number;       // Volume confirmation multiplier
      ttlSeconds: number;             // Default TTL for setups
      confidenceBonus: number;        // Regime-specific confidence adjustment
    };
  };
  
  // Setup-specific parameters  
  setupParams: {
    breakoutAcceptance: {
      minRiskReward: number;          // Minimum R:R ratio
      acceptancePeriods: number;      // Periods for acceptance confirmation
      volumeThreshold: number;        // Volume multiplier for breakout
      maxSlippagePct: number;         // Maximum acceptable slippage %
    };
    pullbackStructural: {
      minRiskReward: number;
      maxRetracementPct: number;      // Maximum pullback percentage
      trendStrengthMin: number;       // Minimum trend strength required
      structuralStrengthMin: number;  // Minimum structural level strength
    };
    liquiditySweep: {
      minRiskReward: number;
      maxSweepATR: number;           // Maximum sweep distance in ATR
      absorptionThreshold: number;    // Minimum absorption strength
      reversalTimeoutMin: number;     // Maximum time for reversal confirmation
    };
  };
  
  // Hysteresis and debounce parameters
  hysteresisParams: {
    entryThreshold: number;         // Threshold to enter condition
    exitThreshold: number;          // Threshold to exit condition (different from entry)
    confirmationPeriods: number;    // Periods to confirm signal
    cooldownSeconds: number;        // Cooldown between same setup types
  };
  
  // Risk and portfolio constraints
  riskParams: {
    maxConcurrentSetups: number;    // Per symbol
    maxPortfolioExposure: number;   // Total exposure limit
    maxCorrelation: number;         // Maximum correlation between positions
    stopoutCooldownMin: number;     // Cooldown after stop-out
  };
}
```

### Setup State Machine

```typescript
enum SetupState {
  DETECTED = 'DETECTED',                    // Initial detection
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION', // Awaiting confirmation
  ARMED = 'ARMED',                         // Ready for execution
  TRIGGERED = 'TRIGGERED',                 // Execution triggered
  EXPIRED = 'EXPIRED',                     // Time-based expiration
  INVALIDATED = 'INVALIDATED'              // Condition-based invalidation
}

interface SetupStateMachine {
  setupId: string;
  currentState: SetupState;
  stateSince: number;                      // UTC timestamp of last state change
  stateHistory: StateTransition[];         // Full state history
  cooldownUntil?: number;                  // UTC timestamp when cooldown expires
  
  // State transition rules
  allowedTransitions: {
    [state: string]: SetupState[];
  };
  
  // Automatic expiration rules
  maxAgeByState: {
    [state: string]: number;               // Maximum seconds in each state
  };
}

interface StateTransition {
  fromState: SetupState;
  toState: SetupState;
  timestamp: number;
  reason: string;                          // Why transition occurred
  triggerData?: any;                       // Data that triggered transition
}
```

```typescript
interface SetupCandidate {
  setupId: string;              // SHA-256 hash of input state + setup params
  timestamp: number;            // UTC milliseconds
  symbol: string;               // Trading pair
  setupType: 'BREAKOUT_ACCEPTANCE' | 'PULLBACK_STRUCTURAL' | 'LIQUIDITY_SWEEP_REVERSAL';
  direction: 'LONG' | 'SHORT';
  
  entryModel: {
    type: 'LIMIT' | 'STOP' | 'MARKET';
    price: number;              // Exact entry price
    ttlSeconds: number;         // Time to live for order
    slippageTolerance: number;  // Maximum acceptable slippage %
  };
  
  stopModel: {
    type: 'STRUCTURAL' | 'ATR_BASED' | 'LIQUIDITY_VOID';
    price: number;              // Exact stop price
    reasoning: string;          // Why this stop level was chosen
  };
  
  targets: {
    primary: {
      price: number;            // Primary target price
      reasoning: string;        // Target calculation method
    };
    secondary?: {
      price: number;            // Optional secondary target
      reasoning: string;
    };
  };
  
  riskReward: {
    ratio: number;              // Calculated R:R ratio
    riskAmount: number;         // Risk in price units
    rewardAmount: number;       // Reward in price units
  };
  
  confidenceScore: number;      // 0-100 based on confluence factors
  
  evidence: Evidence[];         // Chain of supporting conditions
  
  invalidationConditions: {
    priceLevel?: number;        // Price that invalidates setup
    timeExpiry: number;         // UTC timestamp when setup expires
    volumeThreshold?: number;   // Volume that invalidates setup
    regimeChange: boolean;      // Whether regime change invalidates
  };
  
  executionRequirements: {
    minimumLiquidity: number;   // Minimum order book depth required
    maxLatency: number;         // Maximum execution latency allowed (ms)
    sessionRestrictions: string[]; // Valid trading sessions
  };
}

interface Evidence {
  type: 'STRUCTURAL' | 'LIQUIDITY' | 'ORDERFLOW' | 'REGIME';
  description: string;          // Human-readable evidence
  value: number;               // Numerical value supporting setup
  weight: number;              // Weight in confidence calculation (0-1)
  timestamp: number;           // When evidence was observed
}
```

## Setup Generation Algorithms

### Setup 1: Breakout + Acceptance

**Conditions Matrix:**
```
Required Conditions (using SetupConfig.setupParams.breakoutAcceptance):
1. Regime: TREND (strength > config.regimeParams.trend.confidenceMin) OR 
           EXPANSION (strength > config.regimeParams.expansion.confidenceMin)
2. Structural break: Price breaks H1 or M15 level with strength > config.structuralStrengthMin
3. Acceptance: Price closes above/below break level for config.acceptancePeriods consecutive periods
4. L2 Imbalance: Depth imbalance > config.regimeParams[regime].imbalanceThreshold in breakout direction
5. Orderflow: CVD slope aligned with breakout (slope > config.cvdSlopeMin for 5m period)
6. Volume: Break volume > config.volumeThreshold * average volume (20-period)

Entry Logic:
- Entry Type: LIMIT order at 50% retracement of breakout candle
- TTL: config.regimeParams[regime].ttlSeconds
- Slippage Tolerance: config.maxSlippagePct

Stop Logic:
- Stop Price: Structural level that was broken + config.atrBufferMultiplier * ATR
- Stop Type: STRUCTURAL

Target Logic:
- Primary Target: Next structural resistance/support level
- Secondary Target: config.fibonacciExtension * breakout move
- Minimum R:R: config.minRiskReward

Confidence Scoring:
confidence = base_score * regime_multiplier * volume_multiplier * imbalance_multiplier

Where:
- base_score = config.baseConfidence
- regime_multiplier = 1.0 + (regime_strength - config.regimeStrengthBase)
- volume_multiplier = min(config.maxVolumeMultiplier, volume_ratio / config.volumeThreshold)
- imbalance_multiplier = 1.0 + (abs(imbalance) - config.imbalanceThreshold) * config.imbalanceWeight
```

### Setup 2: Pullback Structural

**Conditions Matrix:**
```
Required Conditions:
1. Regime: TREND (strength > 0.7, duration > 60 minutes)
2. Trend Direction: Clear H1/H4 trend with 3+ consecutive higher highs/lower lows
3. Pullback: Price retraces 38.2%-61.8% of prior trend move
4. Structural Level: Pullback reaches significant support/resistance (strength > 0.6)
5. Orderflow Reduction: Aggression against trend reduces to < 0.2
6. Trend Resumption: CVD slope resumes trend direction (slope > 30 for 5m)

Entry Logic:
- Entry Type: LIMIT order at structural level
- TTL: 120 seconds (longer for pullback setups)
- Slippage Tolerance: 0.05% (tighter for structural entries)

Stop Logic:
- Stop Price: Beyond next structural level in pullback direction
- Buffer: 0.5 ATR beyond structural level
- Stop Type: STRUCTURAL

Target Logic:
- Primary Target: Previous swing high/low in trend direction
- Secondary Target: 127.2% extension of trend move
- Minimum R:R: 1.5:1

Confidence Scoring:
confidence = base_score * trend_strength * pullback_quality * structure_strength

Where:
- base_score = 65
- trend_strength = regime_strength
- pullback_quality = 1.0 if 38.2%-61.8% retracement, else 0.8
- structure_strength = structural_level_strength
```

### Setup 3: Liquidity Sweep + Reversal

**Conditions Matrix:**
```
Required Conditions:
1. Regime: RANGE (strength > 0.6) OR LATE_TREND (strength < 0.4, duration > 240 min)
2. Liquidity Sweep: Price moves beyond range/swing level by 0.5-2.0 ATR
3. Liquidity Void: Order book shows void beyond sweep level
4. Absorption: Massive absorption detected (strength > 500)
5. CVD Flip: CVD changes direction within 5 minutes of sweep
6. Failed Follow-through: Price fails to sustain beyond sweep level

Entry Logic:
- Entry Type: LIMIT order at sweep level (original range boundary)
- TTL: 30 seconds (rapid execution required)
- Slippage Tolerance: 0.2% (wider for reversal setups)

Stop Logic:
- Stop Price: 1.0 ATR beyond sweep high/low
- Stop Type: ATR_BASED (structural levels may be unreliable)

Target Logic:
- Primary Target: Opposite side of range/swing
- Secondary Target: 161.8% extension from sweep level
- Minimum R:R: 1.8:1 (higher requirement for contrarian setups)

Confidence Scoring:
confidence = base_score * absorption_strength * cvd_flip_speed * void_quality

Where:
- base_score = 55 (lower base for contrarian)
- absorption_strength = min(1.5, absorption_value / 500)
- cvd_flip_speed = max(0.5, 1.0 - (flip_time_minutes / 5))
- void_quality = liquidity_void_depth_ratio
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

<function_calls>
<invoke name="prework">
<parameter name="featureName">setup-engine-intraday

### Property Reflection

After analyzing all acceptance criteria, several properties can be consolidated to eliminate redundancy:

**Consolidated Properties:**
- Input validation properties (1.1-1.5) can be combined into comprehensive input validation property
- Context filtering properties (2.1-2.7) can be unified into context gate property  
- Risk-reward validation properties (6.7, 7.7, 8.7, 9.1) can be merged into universal R:R property
- Determinism properties (13.1-13.7) can be consolidated into comprehensive determinism property
- Performance monitoring properties (11.1-11.7) can be combined into analytics property

### Core Correctness Properties

**Property 1: Input Validation Completeness**
*For any* market state input, the Setup Engine should reject processing if any required component is missing and provide specific error codes for each missing component.
**Validates: Requirements 1.1, 1.2**

**Property 2: Input State Immutability** 
*For any* market state input, after processing through the Setup Engine, the original input object should remain completely unchanged.
**Validates: Requirements 1.4**

**Property 3: Deterministic Processing**
*For any* identical market state input, the Setup Engine should produce identical setup candidates with identical hashes across multiple executions.
**Validates: Requirements 1.5, 13.2, 13.5**

**Property 4: Context Gate Enforcement**
*For any* market state where context conditions fail (regime incompatible, MSF off, insufficient volatility, invalid session), the Setup Engine should block all setup generation and provide specific reason codes.
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

**Property 5: Context Gate Pass-Through**
*For any* market state where all context conditions pass, the Setup Engine should proceed to setup generation without blocking.
**Validates: Requirements 2.7**

**Property 6: Multi-Timeframe Structure Consistency**
*For any* structural analysis, higher timeframe levels (H4) should take priority over lower timeframe levels (M15) when conflicts occur, and all structural levels should have valid strength scores between 0.0 and 1.0.
**Validates: Requirements 3.6, 3.4**

**Property 7: Liquidity Analysis Bounds**
*For any* order book analysis, all calculated imbalance ratios should be bounded between -1.0 and 1.0, and liquidity stress scores should be categorized as LOW/MEDIUM/HIGH.
**Validates: Requirements 4.1, 4.2, 4.6**

**Property 8: Order Flow Pattern Detection**
*For any* trade tape analysis, CVD calculations should be mathematically consistent with trade direction classification, and confidence scores should be bounded between 0.0 and 1.0.
**Validates: Requirements 5.1, 5.7**

**Property 9: Setup Type Regime Compatibility**
*For any* setup generation attempt, breakout setups should only be generated in TREND or EXPANSION regimes, pullback setups only in TREND regimes, and sweep setups only in RANGE or LATE_TREND regimes.
**Validates: Requirements 6.1, 7.1, 8.1**

**Property 10: Universal Risk-Reward Enforcement**
*For any* generated setup candidate, the risk-reward ratio should meet the minimum threshold for its setup type (1.2 for breakout, 1.5 for pullback, 1.8 for sweep), and all setups should have positive expected value.
**Validates: Requirements 6.7, 7.7, 8.7, 9.1**

**Property 11: Setup Invalidation Consistency**
*For any* setup that becomes invalid, the Setup Engine should provide specific invalidation reason codes and ensure no further processing occurs for that setup instance.
**Validates: Requirements 6.6, 7.6, 8.6, 10.7**

**Property 12: Complete Setup Specification**
*For any* validated setup candidate, all required fields (entry model, stop model, targets, confidence score, evidence chain) should be present and properly formatted.
**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6**

**Property 13: System Integration Responsiveness**
*For any* external system state change (MSF day gate, UCM universe update), the Setup Engine should update its internal state and halt/resume operations as appropriate.
**Validates: Requirements 12.2, 12.3**

**Property 14: Error Handling Fail-Closed**
*For any* system error or exception condition, the Setup Engine should fail closed (no setup generation), log detailed error information, and maintain system stability.
**Validates: Requirements 12.6**

**Property 15: Mathematical Precision Consistency**
*For any* numerical calculation, the Setup Engine should use fixed-point arithmetic with instrument-specific precision and produce results that are mathematically consistent across all operations.
**Validates: Requirements 13.1, 13.3**

**Property 16: Performance Monitoring Completeness**
*For any* setup generation activity, the Setup Engine should log all attempts, track execution quality metrics, and maintain performance statistics for analysis.
**Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

## Error Handling

The Setup Engine implements a comprehensive error handling strategy based on fail-closed principles:

### Error Categories

**Input Validation Errors:**
- `MISSING_REGIME_DATA`: MCE regime data not provided
- `MISSING_MSF_DATA`: MSF fit data not provided  
- `MISSING_STRUCTURE_DATA`: Multi-timeframe structure data not provided
- `MISSING_LIQUIDITY_DATA`: Level 2 order book data not provided
- `MISSING_ORDERFLOW_DATA`: Trade tape data not provided
- `INVALID_TIMESTAMP`: Timestamp format or range invalid
- `INVALID_SYMBOL`: Symbol format invalid or not supported

**Context Filter Errors:**
- `REGIME_INCOMPATIBLE`: Current regime not suitable for any setup type
- `SESSION_INVALID`: Outside valid trading session hours
- `VOLATILITY_INSUFFICIENT`: ATR below minimum threshold for setup generation
- `VOLATILITY_EXCESSIVE`: ATR above maximum threshold (market too volatile)
- `MSF_DAY_GATE_OFF`: MSF system has blocked trading for the day
- `LIQUIDITY_INSUFFICIENT`: Order book depth insufficient for minimum position size

**Processing Errors:**
- `STRUCTURE_ANALYSIS_FAILED`: Unable to identify valid structural levels
- `LIQUIDITY_ANALYSIS_FAILED`: Unable to process order book data
- `ORDERFLOW_ANALYSIS_FAILED`: Unable to process trade tape data
- `SETUP_GENERATION_FAILED`: No valid setups could be generated from current conditions
- `VALIDATION_FAILED`: Generated setups failed quality validation

**System Errors:**
- `EXTERNAL_FEED_TIMEOUT`: Real-time data feed timeout or disconnection
- `CALCULATION_OVERFLOW`: Numerical calculation exceeded safe bounds
- `MEMORY_LIMIT_EXCEEDED`: System memory usage exceeded safe limits
- `PROCESSING_TIMEOUT`: Setup generation exceeded maximum allowed time

### Error Recovery Strategies

**Graceful Degradation:**
- If one analysis component fails, attempt to generate setups with remaining components
- Reduce setup confidence scores when operating with incomplete data
- Implement fallback calculations when primary algorithms fail

**Circuit Breaker Implementation:**
- Halt setup generation after 5 consecutive processing errors
- Implement exponential backoff for external feed reconnection attempts
- Automatic recovery after error conditions clear

**Logging and Monitoring:**
- All errors logged with full context and stack traces
- Performance metrics tracked for error rates and recovery times
- Alerting system for critical error conditions

## Testing Strategy

The Setup Engine requires comprehensive testing across multiple dimensions to ensure reliability in live trading conditions.

### Unit Testing Approach

**Component Isolation Testing:**
- Each engine component (Structure, Liquidity, Orderflow) tested independently
- Mock market data generators for consistent test conditions
- Boundary condition testing for all numerical calculations
- Error injection testing for all failure modes

**Mathematical Precision Testing:**
- Fixed-point arithmetic validation across all calculations
- Rounding behavior verification for different instrument types
- Numerical stability testing with extreme market conditions
- Precision loss detection in complex calculation chains

### Property-Based Testing Configuration

**Test Framework:** Use fast-check (JavaScript/TypeScript) or Hypothesis (Python) for property-based testing
**Minimum Iterations:** 1000 iterations per property test to ensure statistical significance
**Test Data Generation:** Smart generators that produce realistic market conditions within valid ranges

**Property Test Examples:**

```typescript
// Property 1: Input Validation Completeness
property("input validation completeness", 
  fc.record({
    regime: fc.option(fc.record({...}), {nil: undefined}),
    structure: fc.option(fc.record({...}), {nil: undefined}),
    // ... other optional fields
  }),
  (marketState) => {
    const result = setupEngine.process(marketState);
    const missingFields = findMissingRequiredFields(marketState);
    
    if (missingFields.length > 0) {
      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain(missingFields.map(f => `MISSING_${f.toUpperCase()}_DATA`));
    }
  }
);

// Property 10: Universal Risk-Reward Enforcement  
property("risk-reward enforcement",
  fc.record({
    setupType: fc.constantFrom('BREAKOUT_ACCEPTANCE', 'PULLBACK_STRUCTURAL', 'LIQUIDITY_SWEEP_REVERSAL'),
    entryPrice: fc.float({min: 1, max: 100000}),
    stopPrice: fc.float({min: 1, max: 100000}),
    targetPrice: fc.float({min: 1, max: 100000})
  }),
  (setupData) => {
    const riskReward = calculateRiskReward(setupData);
    const minRR = getMinimumRiskReward(setupData.setupType);
    
    if (setupData.entryPrice !== setupData.stopPrice && setupData.entryPrice !== setupData.targetPrice) {
      expect(riskReward).toBeGreaterThanOrEqual(minRR);
    }
  }
);
```

**Property Test Tags:**
Each property test must include a comment tag referencing the design document:
```typescript
// Feature: setup-engine-intraday, Property 1: Input validation completeness
// Feature: setup-engine-intraday, Property 10: Universal risk-reward enforcement
```

### Integration Testing Strategy

**End-to-End Workflow Testing:**
- Complete market state → setup candidate pipeline testing
- Integration with MCE/MSF/UCM systems using test doubles
- Real-time data feed integration testing with simulated market conditions
- Performance testing under various load conditions

**Replay Testing:**
- Historical market data replay to verify deterministic behavior
- Regression testing using known good setup generation scenarios
- Cross-validation against manual setup identification by experienced traders

### Performance Testing Requirements

**Latency Testing:**
- Setup generation latency measurement under various market conditions
- Memory usage profiling during extended operation periods
- CPU utilization monitoring during peak market activity
- Network latency impact assessment for real-time data feeds

**Stress Testing:**
- High-frequency market update processing
- Concurrent setup generation for multiple symbols
- Memory leak detection during extended operation
- Error recovery testing under simulated system failures

**Benchmark Targets:**
- 95th percentile setup generation latency: < 200ms
- Memory usage growth: < 1MB per hour during normal operation
- CPU utilization: < 50% during peak market activity
- Error recovery time: < 5 seconds for transient failures

This comprehensive testing strategy ensures the Setup Engine meets institutional-grade reliability and performance standards required for live trading operations.