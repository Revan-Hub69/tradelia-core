# Requirements Document - Market Data Integration Phase 1

## Introduction

Real market data integration system for closing the operational loop Phase 1. This system provides the foundation for live setup detection, validation, and KPI measurement with real Binance spot/margin data.

## Glossary

- **MarketEventLog**: Append-only log of raw market events (trades, L2, candles)
- **Aggregator**: Deterministic candle builder from raw events
- **MarketStateBuilder**: Normalizes market data into standardized MarketState
- **Decision_Hash**: Deterministic hash for replay validation
- **Run_ID**: Unique identifier for each engine execution
- **STRICT_Mode**: No graceful degradation, fail-closed validation

## Requirements

### Requirement 1: Market Data Adapter v0

**User Story:** As a trading system, I want real market data from Binance spot/margin, so that I can generate authentic MarketState for setup detection.

#### Acceptance Criteria

1. WHEN the system starts, THE MarketEventLog SHALL connect to Binance WebSocket for 3 symbols (BTCUSDT, ETHUSDT, 1 alt)
2. WHEN market events arrive, THE MarketEventLog SHALL append trades + L2 snapshots/diffs + derived candles
3. WHEN building candles, THE Aggregator SHALL create M1/M5/M15/H1/H4 timeframes deterministically
4. WHEN normalizing data, THE MarketStateBuilder SHALL produce standardized ticks, precision, and units
5. WHEN replaying data, THE system SHALL generate bit-identical Decision Stream for same input

### Requirement 2: Logger & Replay Hardening

**User Story:** As a system operator, I want bulletproof event logging with replay validation, so that I can trust the decision audit trail.

#### Acceptance Criteria

1. WHEN logging decisions, THE system SHALL generate decision_hash for deterministic validation
2. WHEN storing events, THE system SHALL enforce idempotency on run_id+setup_id+event_type+seq
3. WHEN replaying setups, THE replay/[id] endpoint SHALL recalculate and compare expected vs stored events
4. WHEN running in STRICT mode, THE system SHALL fail-closed with no graceful degradation
5. WHEN executing two runs with identical input, THE system SHALL produce identical SE_* decision events

### Requirement 3: OMS Paper Trading

**User Story:** As a validation system, I want simulated order management, so that I can measure slippage, TTL, and outcome accuracy before live trading.

#### Acceptance Criteria

1. WHEN a setup triggers, THE OMS SHALL create OrderIntent with simulated fills using micro-slippage model
2. WHEN orders have TTL, THE system SHALL enforce 30/60/120s timeouts with cancellation
3. WHEN trades complete, THE system SHALL generate SE_OUTCOME_RECORDED events with R-multiples
4. WHEN validating execution, THE system SHALL track partial fills and realistic slippage
5. WHEN measuring performance, THE system SHALL provide 100 paper trades with complete log and calculable KPIs

### Requirement 4: Phase-1 KPI Pipeline

**User Story:** As a system validator, I want automated KPI calculation and readiness assessment, so that I can objectively measure derivatives promotion criteria.

#### Acceptance Criteria

1. WHEN running daily queries, THE system SHALL track setups detected/validated/triggered/expired/invalidated
2. WHEN calculating performance, THE system SHALL compute R-distribution, expectancy, drawdown, slippage proxy
3. WHEN analyzing patterns, THE system SHALL breakdown performance by regime/session/symbol
4. WHEN assessing readiness, THE system SHALL generate daily "Phase-1 Readiness" report (green/yellow/red)
5. WHEN criteria are met, THE system SHALL automatically flag derivatives promotion eligibility

### Requirement 5: End-to-End Integration

**User Story:** As a complete trading system, I want seamless integration from market data to KPI reporting, so that I can operate the full Phase 1 validation loop.

#### Acceptance Criteria

1. WHEN market data flows, THE system SHALL continuously update MarketState for setup detection
2. WHEN setups are detected, THE system SHALL validate and log with complete audit trail
3. WHEN paper trades execute, THE system SHALL track outcomes and update performance metrics
4. WHEN KPIs are calculated, THE system SHALL provide real-time Phase 1 readiness status
5. WHEN the loop is complete, THE system SHALL operate autonomously for 100+ trade validation

### Requirement 6: Data Quality & Reliability

**User Story:** As a production system, I want robust data handling and error recovery, so that I can maintain continuous operation.

#### Acceptance Criteria

1. WHEN WebSocket disconnects, THE system SHALL reconnect automatically with gap detection
2. WHEN data is missing, THE system SHALL fail-closed rather than interpolate
3. WHEN events are corrupted, THE system SHALL reject and log errors without crashing
4. WHEN replay validation fails, THE system SHALL alert and halt processing
5. WHEN system restarts, THE system SHALL resume from last known good state

### Requirement 7: Performance & Scalability

**User Story:** As an operational system, I want efficient processing and storage, so that I can handle real-time market data without lag.

#### Acceptance Criteria

1. WHEN processing market events, THE system SHALL handle 100+ events/second per symbol
2. WHEN storing events, THE system SHALL use batched writes with <1s latency
3. WHEN building candles, THE system SHALL update incrementally without full recalculation
4. WHEN querying KPIs, THE system SHALL return results within 5 seconds
5. WHEN scaling symbols, THE system SHALL support 10+ symbols without performance degradation

### Requirement 8: Monitoring & Alerting

**User Story:** As a system operator, I want comprehensive monitoring and alerts, so that I can ensure system health and data integrity.

#### Acceptance Criteria

1. WHEN data feed degrades, THE system SHALL alert within 30 seconds
2. WHEN replay validation fails, THE system SHALL immediately notify operators
3. WHEN KPI thresholds are breached, THE system SHALL generate automated alerts
4. WHEN system performance degrades, THE system SHALL provide diagnostic information
5. WHEN Phase 1 criteria are met, THE system SHALL notify readiness for derivatives promotion