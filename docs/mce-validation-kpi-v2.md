# Market Context Engine - Validation KPI v2

## Overview

Il sistema MCE deve essere validato attraverso KPI oggettivi e misurabili. Questi KPI non sono basati su PnL ma su metriche tecniche e di qualità dei dati che garantiscono il corretto funzionamento del sistema.

## Core Determinism Metrics

### Determinism Hash Match
- **Definition**: Percentage of replay runs that produce identical canonical hashes
- **Target**: 100.0%
- **Calculation**: `identical_hashes / total_replay_runs * 100`
- **Critical**: Any value < 100% indicates non-deterministic behavior

### Event Processing Success Rate
- **Definition**: Percentage of events successfully processed without errors
- **Target**: >99.9%
- **Calculation**: `(total_events - failed_events) / total_events * 100`
- **Measurement Window**: Rolling 24 hours

### Schema Validation Pass Rate
- **Definition**: Percentage of incoming events that pass Zod schema validation
- **Target**: >99.95%
- **Calculation**: `valid_events / total_incoming_events * 100`
- **Note**: Low values indicate data source issues or schema drift

## Data Quality Metrics

### Missing Events Rate (Gap Rate)
- **Definition**: Percentage of expected kline intervals that are missing
- **Target**: <0.01%
- **Calculation**: `missing_intervals / expected_intervals * 100`
- **Example**: For 1m klines, expect 1440 per day per symbol

### Late Events Rate
- **Definition**: Percentage of events arriving beyond the reorder window
- **Target**: <1.0%
- **Calculation**: `late_events / total_events * 100`
- **Reorder Window**: 30 seconds default
- **Note**: High values indicate network issues or exchange delays

### Out-of-Order Events Rate
- **Definition**: Percentage of events requiring reordering within the buffer window
- **Target**: <5.0%
- **Calculation**: `reordered_events / total_events * 100`
- **Normal Range**: 1-3% is typical for crypto exchanges

### Data Coverage
- **Definition**: Percentage of time periods with complete data
- **Target**: >99.5%
- **Calculation**: `periods_with_complete_data / total_periods * 100`
- **Measurement**: Per symbol, per timeframe (1m, 5m, 1h, 4h, 1d)

## Regime Stability Metrics

### Regime Flip Rate
- **Definition**: Number of regime changes per hour
- **Target**: <12 flips/hour
- **Calculation**: `regime_changes / hours_observed`
- **Anti-Oscillation**: Prevents excessive regime switching

### Average Regime Duration
- **Definition**: Mean duration of regime persistence
- **Target**: >5 minutes
- **Calculation**: `sum(regime_durations) / number_of_regimes`
- **Stability Indicator**: Longer durations indicate stable classification

### Confidence Score
- **Definition**: Average confidence of regime classifications
- **Target**: >0.7
- **Calculation**: `sum(confidence_scores) / number_of_classifications`
- **Quality Threshold**: Low confidence indicates uncertain market conditions

## Performance Metrics (Corrected Latency Breakdown)

### WebSocket to RAM Latency
- **ws_to_ram_p50_ms**: <5ms (median)
- **ws_to_ram_p95_ms**: <15ms (95th percentile)
- **Definition**: Time from WebSocket message receipt to in-memory queue
- **Realistic**: Network and parsing overhead

### RAM to Storage Latency
- **ram_to_store_p50_ms**: <20ms (median)
- **ram_to_store_p95_ms**: <100ms (95th percentile)
- **Definition**: Time from memory buffer to PostgreSQL commit
- **Realistic**: Includes batch writing and disk I/O

### Compute Latency
- **compute_p50_ms**: <2ms (median)
- **compute_p95_ms**: <10ms (95th percentile)
- **Definition**: Time from RAM event to feature calculation
- **Realistic**: In-memory mathematical operations

### Classification Latency
- **classify_p50_ms**: <1ms (median)
- **classify_p95_ms**: <5ms (95th percentile)
- **Definition**: Time from features to regime classification
- **Realistic**: Simple rule-based classification

### Memory Usage
- **Target**: <100MB steady state
- **Measurement**: RSS memory after 24h continuous operation
- **Includes**: Event buffers, feature cache, connection pools

### Replay Throughput
- **Target**: >1000 events/second
- **Definition**: Events processed per second during historical replay
- **Measurement**: Sustained rate over 1+ hour replay session

## KPI Calculation Methods

### Rolling Window Calculations
```typescript
interface KPICalculator {
  // 24-hour rolling window for most metrics
  calculateSuccessRate(events: Event[], windowHours: number = 24): number;
  
  // Real-time latency tracking
  trackLatency(startTime: number, endTime: number, metric: LatencyMetric): void;
  
  // Regime stability analysis
  analyzeRegimeStability(signatures: RegimeSignature[]): StabilityMetrics;
}
```

### Measurement Frequency
- **Real-time**: Latency metrics (per event)
- **Minutely**: Data quality rates
- **Hourly**: Regime stability metrics
- **Daily**: Determinism validation runs

## Pass/Fail Criteria

### System Health Status
- **HEALTHY**: All KPI targets met
- **DEGRADED**: 1-2 KPI targets missed, system functional
- **CRITICAL**: 3+ KPI targets missed or determinism failure
- **FAILED**: Core determinism or data integrity compromised

### Validation Rules
1. **Determinism is non-negotiable**: Any determinism failure = FAILED status
2. **Data quality threshold**: <99% coverage = DEGRADED
3. **Performance degradation**: >2x latency targets = DEGRADED
4. **Regime instability**: >20 flips/hour = DEGRADED

### Alerting Thresholds
- **Warning**: KPI approaches target (within 10%)
- **Critical**: KPI exceeds target
- **Emergency**: Determinism failure or data corruption

## Realistic Expectations

### What's Achievable
- **Determinism**: 100% achievable with proper implementation
- **Data Coverage**: 99.5%+ realistic for major crypto pairs
- **Latency**: Targets are conservative for single-source ingestion
- **Regime Stability**: Depends on market conditions, targets are reasonable

### What's Challenging
- **Perfect Data Coverage**: Exchange outages and maintenance windows
- **Consistent Low Latency**: Network jitter and GC pauses
- **Stable Regimes**: Volatile markets naturally cause more regime changes

### Hardware Dependencies
- **SSD Storage**: Required for storage latency targets
- **Stable Network**: <10ms to exchange for realistic latency
- **Sufficient RAM**: 8GB+ recommended for buffer management

## Validation Schedule

### Continuous Monitoring
- Real-time KPI dashboard
- Automated alerting on threshold breaches
- Hourly health checks

### Weekly Validation
- 7-day determinism replay test
- Performance regression analysis
- Data quality trend review

### Monthly Assessment
- KPI target review and adjustment
- System capacity planning
- Performance optimization opportunities

**Validation Rule**: Brick #1 is considered production-ready only when ALL KPI targets are consistently met over 7+ consecutive days of continuous operation.