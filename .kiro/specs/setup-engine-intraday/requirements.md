# Setup Engine Intraday - Requirements Document

## Introduction

The Setup Engine Intraday is a professional-grade decision system that generates actionable trading setups based on multi-timeframe market structure, order flow analysis, and regime context. This system implements desk-level standards for setup identification, validation, and execution, designed for progression from spot trading to derivatives with mathematical precision and full auditability.

## Glossary

- **Setup_Engine**: The core system that processes market state and generates validated setup candidates
- **Market_State**: Aggregated input containing regime, structure, liquidity, and order flow data
- **Setup_Candidate**: A validated trading opportunity with defined entry, stop, and target parameters
- **Context_Filter**: Pre-validation system that determines if market conditions allow setup generation
- **Structure_Engine**: Multi-timeframe analysis system for identifying key levels and patterns
- **Liquidity_Engine**: Level 2 order book analysis for imbalance and void detection
- **Orderflow_Engine**: Trade tape analysis for aggression, absorption, and exhaustion detection
- **Setup_Validator**: Final validation system ensuring risk-reward and execution quality standards
- **Confidence_Score**: Numerical rating (0-100) indicating setup quality and probability
- **Evidence_Chain**: Traceable sequence of conditions that led to setup generation
- **Invalidation_Code**: Specific reason why a setup becomes invalid or expires

## Requirements

### Requirement 1: Market State Input Processing

**User Story:** As a trading system, I want to process standardized market state inputs, so that setup generation is consistent and deterministic across all market conditions.

#### Acceptance Criteria

1. WHEN market state is received, THE Setup_Engine SHALL validate all required input components are present
2. WHEN any required input component is missing, THE Setup_Engine SHALL reject the request and return NO_SETUP with specific missing component codes
3. WHEN input validation passes, THE Setup_Engine SHALL convert all inputs to canonical units and precisions; any scaling must be explicitly defined per-feature and causal
4. THE Setup_Engine SHALL maintain input state immutability throughout processing
5. WHEN processing completes, THE Setup_Engine SHALL generate deterministic hash of input state for replay capability

### Requirement 2: Context Filtering System

**User Story:** As a risk management system, I want to filter market contexts before setup generation, so that setups are only generated in appropriate market conditions.

#### Acceptance Criteria

1. WHEN regime is not compatible with setup requirements, THE Context_Filter SHALL block setup generation
2. WHEN market session is outside valid trading hours, THE Context_Filter SHALL block setup generation  
3. WHEN volatility is below minimum threshold, THE Context_Filter SHALL block setup generation
4. WHEN MSF day gate is OFF, THE Context_Filter SHALL block all setup generation
5. WHEN liquidity conditions are insufficient, THE Context_Filter SHALL block setup generation
6. THE Context_Filter SHALL provide specific reason codes for each blocking condition
7. WHEN all context conditions pass, THE Context_Filter SHALL allow setup generation to proceed

### Requirement 3: Multi-Timeframe Structure Analysis

**User Story:** As a technical analysis system, I want to identify key structural levels across multiple timeframes, so that setups can be anchored to significant support and resistance.

#### Acceptance Criteria

1. WHEN analyzing H4 timeframe, THE Structure_Engine SHALL identify swing highs and lows with minimum 20-period lookback
2. WHEN analyzing H1 timeframe, THE Structure_Engine SHALL identify range boundaries and breakout levels
3. WHEN analyzing M15 timeframe, THE Structure_Engine SHALL identify micro-structure and entry zones
4. THE Structure_Engine SHALL calculate strength scores for each structural level based on touch count (price within ε ticks + rejection), recency, and timeframe priority; volume is optional and engine must function without it
5. THE Structure_Engine SHALL identify liquidity pool proxies at structural levels using swing clusters, range extremes, round levels, and thin liquidity zones
6. WHEN structural levels conflict across timeframes, THE Structure_Engine SHALL prioritize higher timeframe levels
7. THE Structure_Engine SHALL maintain structural level validity periods and auto-expire stale levels

### Requirement 4: Level 2 Liquidity Analysis

**User Story:** As a market microstructure system, I want to analyze order book imbalances and liquidity voids, so that setups can incorporate real-time supply and demand dynamics.

#### Acceptance Criteria

1. WHEN analyzing top-of-book, THE Liquidity_Engine SHALL calculate bid-ask imbalance ratios
2. WHEN analyzing depth, THE Liquidity_Engine SHALL identify imbalances at 5, 10, and 20 level depths
3. WHEN liquidity voids are detected, THE Liquidity_Engine SHALL mark void levels and expected fill behavior
4. THE Liquidity_Engine SHALL detect microprice divergence between mid-price and last trade price
5. WHEN order cancellation stress is detected, THE Liquidity_Engine SHALL flag unstable liquidity conditions
6. THE Liquidity_Engine SHALL calculate liquidity stress scores on LOW/MEDIUM/HIGH scale
7. WHEN liquidity conditions change rapidly, THE Liquidity_Engine SHALL complete processing update within 100ms given new L2 event

### Requirement 5: Order Flow Tape Analysis

**User Story:** As an execution analysis system, I want to analyze trade tape for aggression patterns, so that setups can identify momentum and exhaustion signals.

#### Acceptance Criteria

1. WHEN analyzing trade tape, THE Orderflow_Engine SHALL calculate Cumulative Volume Delta (CVD) slope over multiple periods
2. WHEN aggressive buying is detected, THE Orderflow_Engine SHALL measure buy-to-sell aggression ratios
3. WHEN absorption patterns are identified, THE Orderflow_Engine SHALL flag potential reversal zones
4. WHEN exhaustion is detected, THE Orderflow_Engine SHALL identify momentum deceleration patterns
5. WHEN volume bursts occur, THE Orderflow_Engine SHALL classify burst type and directional bias
6. THE Orderflow_Engine SHALL maintain rolling windows of 1m, 5m, and 15m for pattern detection
7. THE Orderflow_Engine SHALL provide confidence scores for each detected pattern

### Requirement 6: Setup Generation - Breakout + Acceptance

**User Story:** As a momentum trading system, I want to identify valid breakout setups with acceptance confirmation, so that I can capture structural breaks with high probability.

#### Acceptance Criteria

1. WHEN regime is TREND or EXPANSION, THE Setup_Engine SHALL evaluate breakout conditions
2. WHEN structural break occurs on H1 or M15, THE Setup_Engine SHALL wait for acceptance above/below level
3. WHEN L2 imbalance favors breakout direction with ratio ≥ 2.0, THE Setup_Engine SHALL increase setup confidence
4. WHEN tape shows aggressive flow in breakout direction, THE Setup_Engine SHALL validate momentum confirmation
5. WHEN entry is generated, THE Setup_Engine SHALL use limit orders at retest levels with maximum 60-second TTL
6. WHEN invalidation occurs, THE Setup_Engine SHALL trigger on failure below breakout level or opposite absorption
7. THE Setup_Engine SHALL require minimum 1.2 risk-reward ratio for breakout setups

### Requirement 7: Setup Generation - Pullback Structural

**User Story:** As a trend-following system, I want to identify pullback opportunities in established trends, so that I can enter trends at optimal risk-reward levels.

#### Acceptance Criteria

1. WHEN regime is TREND, THE Setup_Engine SHALL evaluate pullback conditions
2. WHEN clear trend is established on H1/H4, THE Setup_Engine SHALL identify pullback to structural support/resistance
3. WHEN aggression reduces against trend during pullback, THE Setup_Engine SHALL monitor for trend resumption
4. WHEN CVD shows trend resumption, THE Setup_Engine SHALL generate pullback entry signal
5. THE Setup_Engine SHALL place entries at structural levels with trend-favorable L2 imbalance
6. WHEN pullback exceeds 50% of prior move, THE Setup_Engine SHALL invalidate pullback setup
7. THE Setup_Engine SHALL require minimum 1.5 risk-reward ratio for pullback setups

### Requirement 8: Setup Generation - Liquidity Sweep + Reversal

**User Story:** As a contrarian trading system, I want to identify liquidity sweep reversals, so that I can capture moves after stop-loss hunting events.

#### Acceptance Criteria

1. WHEN regime is RANGE or LATE_TREND, THE Setup_Engine SHALL evaluate sweep conditions
2. WHEN price sweeps beyond range or swing levels, THE Setup_Engine SHALL detect liquidity void creation
3. WHEN massive absorption is detected during sweep, THE Setup_Engine SHALL flag potential reversal
4. WHEN CVD flips direction after sweep, THE Setup_Engine SHALL confirm reversal setup
5. THE Setup_Engine SHALL enter on limit orders at sweep level with rapid execution requirements
6. WHEN sweep fails to reverse within 5 minutes, THE Setup_Engine SHALL invalidate setup
7. THE Setup_Engine SHALL require minimum 1.8 risk-reward ratio for sweep reversal setups

### Requirement 9: Setup Validation and Quality Control

**User Story:** As a risk management system, I want to validate all generated setups against quality standards, so that only high-probability setups are executed.

#### Acceptance Criteria

1. WHEN setup is generated, THE Setup_Validator SHALL verify minimum risk-reward ratio is met
2. WHEN stop level is too close to entry, THE Setup_Validator SHALL reject setup for insufficient risk buffer
3. WHEN liquidity is insufficient for minimum position size, THE Setup_Validator SHALL reject setup
4. WHEN setup conflicts with active position, THE Setup_Validator SHALL reject conflicting setup
5. WHEN risk rules would be violated, THE Setup_Validator SHALL reject setup with specific violation codes
6. THE Setup_Validator SHALL calculate confidence scores based on confluence of supporting factors
7. WHEN validation passes, THE Setup_Validator SHALL generate complete setup candidate with all parameters

### Requirement 10: Setup Output and Execution Interface

**User Story:** As an execution system, I want to receive complete setup specifications, so that I can execute trades with precise parameters and risk controls.

#### Acceptance Criteria

1. WHEN setup is validated, THE Setup_Engine SHALL output complete SetupCandidate with deterministic hash
2. WHEN entry model is specified, THE Setup_Engine SHALL include order type, price, and TTL parameters
3. WHEN stop model is defined, THE Setup_Engine SHALL specify stop type and exact level
4. WHEN targets are set, THE Setup_Engine SHALL provide primary and optional secondary target levels
5. THE Setup_Engine SHALL include confidence score and complete evidence chain for audit trail
6. THE Setup_Engine SHALL specify invalidation conditions and expiration timestamp
7. WHEN setup expires or invalidates, THE Setup_Engine SHALL provide specific reason codes

### Requirement 11: Performance Monitoring and Analytics

**User Story:** As a performance analysis system, I want to track setup generation statistics, so that I can optimize setup parameters and identify edge degradation.

#### Acceptance Criteria

1. WHEN setups are generated, THE Setup_Engine SHALL log all setup attempts with outcomes
2. WHEN setups are executed, THE Setup_Engine SHALL track execution quality metrics
3. THE Setup_Engine SHALL calculate setup win rates by type and market regime
4. THE Setup_Engine SHALL measure average risk-reward ratios achieved vs. planned
5. THE Setup_Engine SHALL track setup invalidation rates and primary causes
6. WHEN performance degrades, THE Setup_Engine SHALL flag setup types for review
7. THE Setup_Engine SHALL provide daily, weekly, and monthly performance summaries

### Requirement 12: Integration with Existing Systems

**User Story:** As a trading infrastructure, I want seamless integration with MCE, MSF, and UCM systems, so that setup generation leverages all available market intelligence.

#### Acceptance Criteria

1. WHEN MCE provides regime updates, THE Setup_Engine SHALL update context filters within 1 second
2. WHEN MSF day gate changes, THE Setup_Engine SHALL immediately halt or resume setup generation
3. WHEN UCM universe updates, THE Setup_Engine SHALL refresh available symbols for setup generation
4. THE Setup_Engine SHALL consume real-time market data feeds with sub-second latency
5. THE Setup_Engine SHALL integrate with existing rate limiting and circuit breaker systems
6. WHEN system errors occur, THE Setup_Engine SHALL fail closed and log detailed error information
7. THE Setup_Engine SHALL support replay mode using historical market state data

### Requirement 13: Mathematical Precision and Determinism

**User Story:** As an algorithmic trading system, I want mathematically precise and deterministic setup generation, so that results are reproducible and auditable.

#### Acceptance Criteria

1. THE Setup_Engine SHALL use fixed-point arithmetic for all price and ratio calculations with explicit tick/step specifications and defined rounding policy (banker's rounding) to prevent drift
2. WHEN given identical inputs, THE Setup_Engine SHALL produce identical outputs every time
3. THE Setup_Engine SHALL round all calculations to instrument-specific precision (e.g., 2 decimals for forex)
4. WHEN timestamps are used, THE Setup_Engine SHALL use UTC with millisecond precision
5. THE Setup_Engine SHALL generate cryptographic hashes for all setup decisions for audit trails
6. THE Setup_Engine SHALL support full replay of any setup decision using stored input state
7. WHEN parameters are updated, THE Setup_Engine SHALL version all configuration changes

### Requirement 14: Setup Lifecycle State Machine

**User Story:** As a trading execution system, I want setup candidates to follow a defined lifecycle state machine, so that duplicate signals are prevented and setup states are clearly tracked.

#### Acceptance Criteria

1. WHEN setup is first detected, THE Setup_Engine SHALL create setup in DETECTED state with state_since timestamp
2. WHEN setup conditions are confirmed, THE Setup_Engine SHALL transition setup to PENDING_CONFIRMATION state
3. WHEN all confirmation criteria are met, THE Setup_Engine SHALL transition setup to ARMED state
4. WHEN entry conditions are triggered, THE Setup_Engine SHALL transition setup to TRIGGERED state
5. WHEN setup expires or invalidates, THE Setup_Engine SHALL transition setup to EXPIRED or INVALIDATED state
6. THE Setup_Engine SHALL implement cooldown periods to prevent re-emission of identical setups within defined time windows
7. THE Setup_Engine SHALL deduplicate setups by setup_id and prevent spam of identical signals

### Requirement 15: Setup Configuration Management

**User Story:** As a trading system administrator, I want setup parameters to be configurable and versioned, so that setup behavior can be optimized without code changes.

#### Acceptance Criteria

1. THE Setup_Engine SHALL load all numerical thresholds from versioned SetupConfig objects
2. WHEN regime changes, THE Setup_Engine SHALL apply regime-specific parameter adjustments (e.g., longer TTL in low volatility)
3. THE Setup_Engine SHALL version all configuration changes with timestamps and change reasons
4. WHEN parameters are updated, THE Setup_Engine SHALL validate parameter ranges and dependencies
5. THE Setup_Engine SHALL support rollback to previous configuration versions
6. THE Setup_Engine SHALL log all configuration changes with user attribution
7. THE Setup_Engine SHALL apply hysteresis/debounce parameters to prevent signal jitter

### Requirement 16: Real-time Performance Requirements

**User Story:** As a low-latency trading system, I want sub-second setup generation, so that opportunities are captured before market conditions change.

#### Acceptance Criteria

1. WHEN market state updates, THE Setup_Engine SHALL complete processing within 500ms
2. WHEN setup candidates are generated, THE Setup_Engine SHALL deliver results within 100ms of validation
3. THE Setup_Engine SHALL maintain processing latency under 200ms for 99% of requests
4. WHEN system load increases, THE Setup_Engine SHALL prioritize active symbol processing
5. THE Setup_Engine SHALL implement circuit breakers for processing time violations
6. WHEN latency exceeds thresholds, THE Setup_Engine SHALL log performance degradation events
7. THE Setup_Engine SHALL support horizontal scaling for increased throughput requirements

### Requirement 17: Portfolio Conflict Management

**User Story:** As a risk management system, I want to prevent conflicting setups and enforce portfolio constraints, so that position sizing and risk limits are respected.

#### Acceptance Criteria

1. THE Setup_Engine SHALL implement conflict matrix preventing opposing setups on same symbol within defined time windows
2. WHEN active position exists, THE Setup_Engine SHALL evaluate setup compatibility using position direction and size
3. THE Setup_Engine SHALL enforce maximum concurrent setups per symbol based on configuration
4. WHEN stop-out occurs, THE Setup_Engine SHALL implement cooldown period before allowing new setups on same symbol
5. THE Setup_Engine SHALL validate total portfolio exposure before approving new setups
6. THE Setup_Engine SHALL reject setups that would violate maximum correlation limits across symbols
7. THE Setup_Engine SHALL maintain setup conflict history for performance analysis

### Requirement 18: Execution Feasibility Analysis

**User Story:** As an execution system, I want setup validation to include execution feasibility, so that only executable setups are generated.

#### Acceptance Criteria

1. WHEN validating setup, THE Setup_Engine SHALL verify order book depth is sufficient for minimum position size
2. THE Setup_Engine SHALL calculate estimated slippage based on current market impact models
3. WHEN estimated slippage exceeds percentage of setup risk, THE Setup_Engine SHALL reject setup with slippage violation code
4. THE Setup_Engine SHALL verify spread conditions are within acceptable ranges for setup type
5. THE Setup_Engine SHALL validate that entry price is achievable given current market conditions
6. THE Setup_Engine SHALL include execution feasibility score in setup confidence calculation
7. THE Setup_Engine SHALL update feasibility models based on actual execution performance