# MCE Brick #1 Completion - Requirements

## Introduction

Completamento del Market Context Engine Brick #1 basato su audit completo. Il design è accademicamente valido e praticamente utile, ma mancano 3 elementi specifici per la validazione operativa.

## Glossary

- **MCE**: Market Context Engine
- **Expected_Event_Grid**: Griglia temporale degli eventi attesi per validazione data quality
- **Engine_Version**: Versione del motore per confronti deterministici
- **CLI_Minimal**: Command Line Interface per validazione operativa
- **RegimeSignature**: Output canonico del sistema MCE

## Requirements

### Requirement 1: Expected Event Grid Definition

**User Story:** As a system validator, I want explicit definition of expected event patterns, so that I can measure data quality accurately.

#### Acceptance Criteria

1. THE System SHALL define expected event grid for each symbol and timeframe
2. WHEN calculating missing_pct, THE System SHALL use expected event grid as baseline
3. FOR kline 1m intervals, THE System SHALL expect 1440 events per day per symbol
4. FOR kline 5m intervals, THE System SHALL expect 288 events per day per symbol
5. THE System SHALL account for market closure periods in expected grid
6. THE System SHALL store expected grid configuration in canonical format

### Requirement 2: Engine Versioning

**User Story:** As a researcher, I want engine version tracking, so that I can perform causal analysis between different engine versions.

#### Acceptance Criteria

1. THE RegimeSignature SHALL include engine_version field in metadata
2. WHEN generating output, THE System SHALL embed current engine version
3. THE engine_version SHALL follow semantic versioning (e.g., "mce-0.1.0")
4. WHEN comparing outputs, THE System SHALL enable version-based analysis
5. THE System SHALL maintain version compatibility matrix
6. THE System SHALL validate determinism within same engine version

### Requirement 3: Minimal CLI Interface

**User Story:** As an operator, I want minimal CLI for validation, so that I can verify Brick #1 functionality without UI complexity.

#### Acceptance Criteria

1. THE CLI SHALL support replay command with symbol, from, to parameters
2. WHEN executing replay, THE CLI SHALL output NDJSON of RegimeSignatures
3. THE CLI SHALL output final canonical hash for determinism validation
4. THE CLI SHALL support format: `mce replay --symbol BTCUSDT --from 2024-01-01 --to 2024-01-07`
5. THE CLI SHALL validate input parameters before execution
6. THE CLI SHALL provide clear error messages for invalid inputs
7. THE CLI SHALL support dry-run mode for validation without execution

### Requirement 4: Determinism Validation

**User Story:** As a system validator, I want automated determinism verification, so that I can ensure bit-per-bit reproducibility.

#### Acceptance Criteria

1. THE System SHALL support determinism validation between replay runs
2. WHEN running same parameters twice, THE System SHALL produce identical canonical hashes
3. THE System SHALL detect and report any non-deterministic behavior
4. THE System SHALL validate floating-point consistency through canonical JSON
5. THE System SHALL support hash comparison across different timestamps
6. THE System SHALL maintain determinism audit log

### Requirement 5: Operational Readiness

**User Story:** As a system operator, I want clear operational boundaries, so that I can deploy Brick #1 without scope creep.

#### Acceptance Criteria

1. THE System SHALL NOT implement multi-source ingestion in Brick #1
2. THE System SHALL NOT implement Redis caching in Brick #1
3. THE System SHALL NOT implement public APIs in Brick #1
4. THE System SHALL NOT implement ML classifiers in Brick #1
5. THE System SHALL NOT implement dashboard integration in Brick #1
6. THE System SHALL focus exclusively on single-source deterministic replay
7. THE System SHALL validate core functionality before any extensions

### Requirement 6: Performance Boundaries

**User Story:** As a system architect, I want realistic performance expectations, so that I can avoid premature optimization.

#### Acceptance Criteria

1. THE System SHALL separate latency measurements by component
2. THE System SHALL measure ws_to_ram latency independently
3. THE System SHALL measure ram_to_store latency independently  
4. THE System SHALL measure compute latency independently
5. THE System SHALL measure classification latency independently
6. THE System SHALL NOT optimize for unrealistic latency targets
7. THE System SHALL focus on correctness before performance

### Requirement 7: Scientific Validation

**User Story:** As a researcher, I want scientific rigor validation, so that I can trust the system for quantitative research.

#### Acceptance Criteria

1. THE System SHALL implement scale invariance testing
2. THE System SHALL implement time monotonicity validation
3. THE System SHALL implement no-lookahead verification
4. THE System SHALL implement canonical JSON determinism
5. THE System SHALL support property-based testing framework
6. THE System SHALL validate financial robustness properties
7. THE System SHALL maintain audit trail for all validations

## Implementation Constraints

### What NOT to Build (Critical)
- Multi-source ingestion
- Redis caching layer
- Public API endpoints
- Machine learning components
- Dashboard integration
- Trading logic
- Real-time WebSocket (use REST for Brick #1)

### What TO Build (Essential)
- Expected event grid definition
- Engine version tracking
- Minimal CLI interface
- Determinism validation
- Single-source replay engine
- Canonical output format
- Property-based tests

## P0 Technical Specifications

### Schemas (Zod Validation)

```typescript
// RegimeSignature output validation
const RegimeSignatureSchema = z.object({
  output_v: z.literal(1),
  as_of_ts: z.number().int().positive(),
  symbol: z.string().regex(/^[A-Z]+USDT$/),
  price_regime: z.object({
    trend: z.enum(["up", "down", "range"]),
    volatility: z.enum(["compressed", "normal", "expanded"])
  }),
  confidence: z.number().min(0).max(1),
  data_quality: z.object({
    missing_pct: z.number().min(0).max(100),
    late_events_pct: z.number().min(0).max(100),
    coverage_pct: z.number().min(0).max(100)
  }),
  metadata: z.object({
    events_processed: z.number().int().nonnegative(),
    regime_duration_minutes: z.number().nonnegative(),
    last_regime_change: z.number().int().positive(),
    canonical_hash: z.string().regex(/^sha256:[a-f0-9]{64}$/),
    engine_version: z.string().regex(/^mce-\d+\.\d+\.\d+$/)
  })
});

// CLI arguments validation
const CliArgsSchema = z.object({
  symbol: z.string().regex(/^[A-Z]+USDT$/),
  from: z.string().datetime(), // ISO 8601
  to: z.string().datetime(),
  dryRun: z.boolean().optional()
});
```

### Expected Event Grid (Deterministic Definition)

```typescript
// Deterministic expected events calculation
function calculateExpectedEvents(symbol: string, interval: string, start: number, end: number): number {
  const intervalMs = {
    '1m': 60_000,
    '5m': 300_000,
    '1h': 3_600_000,
    '4h': 14_400_000,
    '1d': 86_400_000
  }[interval];
  
  if (!intervalMs) throw new Error(`Invalid interval: ${interval}`);
  
  // Crypto markets are 24/7 - no holidays
  return Math.floor((end - start) / intervalMs);
}

// Missing events calculation
function calculateMissingPct(actualEvents: number, expectedEvents: number): number {
  if (expectedEvents === 0) return 0;
  const missing = Math.max(0, expectedEvents - actualEvents);
  return (missing / expectedEvents) * 100;
}

// Gap handling rule for Brick #1
// NO interpolation - penalize data_quality only
// Gaps > 1 interval = missing event
```

### Canonical Hash Specification

```typescript
// Hash calculation (deterministic)
function calculateCanonicalHash(signature: Omit<RegimeSignature, 'metadata'> & { metadata: Omit<RegimeSignature['metadata'], 'canonical_hash'> }): string {
  // 1. Deep sort all object keys
  const sorted = deepSortKeys(signature);
  
  // 2. Round all floats to 6 decimal places
  const rounded = roundFloats(sorted, 6);
  
  // 3. Compact JSON (no whitespace)
  const canonicalJson = JSON.stringify(rounded);
  
  // 4. SHA-256 hash
  return `sha256:${crypto.createHash('sha256').update(canonicalJson).digest('hex')}`;
}
```

### Reorder Buffer Implementation

```typescript
// Use min-heap/priority queue - NOT .sort() per event
class EventBuffer {
  private heap: MinHeap<EventEnvelope>;
  
  add(event: EventEnvelope): void {
    // O(log n) insertion
    this.heap.insert(event, this.compareEvents);
  }
  
  drainUpTo(watermark: number): EventEnvelope[] {
    const result: EventEnvelope[] = [];
    while (!this.heap.isEmpty() && this.heap.peek().ts_event <= watermark) {
      result.push(this.heap.extractMin());
    }
    return result;
  }
  
  private compareEvents(a: EventEnvelope, b: EventEnvelope): number {
    if (a.ts_event !== b.ts_event) return a.ts_event - b.ts_event;
    if (a.ts_ingest !== b.ts_ingest) return a.ts_ingest - b.ts_ingest;
    return a.seq - b.seq;
  }
}
```

### Error Handling (Minimal)

```typescript
// Duplicate handling
function handleDuplicate(event: EventEnvelope): 'drop' | 'counter' {
  // Drop idempotent + increment counter
  duplicateCounter.increment(event.symbol);
  return 'drop';
}

// Engine version validation
function validateEngineVersion(version: string): void {
  if (!version.match(/^mce-\d+\.\d+\.\d+$/)) {
    throw new Error(`Invalid engine version: ${version}`);
  }
}

// CLI exit codes
const CLI_EXIT_CODES = {
  SUCCESS: 0,
  INVALID_ARGS: 1,
  DATA_ERROR: 2,
  DETERMINISM_FAILURE: 3,
  SYSTEM_ERROR: 4
} as const;
```

### Test Plan (Concrete)

```typescript
// Property tests (5 core tests)
const PROPERTY_TESTS = [
  'determinism: same input → same hash',
  'no-lookahead: ts_event <= current_time',
  'out-of-order: reorder within window works',
  'idempotency: duplicate events dropped',
  'scale-invariance: price scaling preserves trend'
];

// Edge case tests (4 critical tests)
const EDGE_CASE_TESTS = [
  'leap day: 2024-02-29 parsing',
  'month boundary: 2024-01-31 23:59 → 2024-02-01 00:00',
  'DST input: CLI accepts local time, normalizes to UTC',
  'out-of-order beyond window: late events marked but processed'
];
```

## Success Criteria

Brick #1 is considered **operationally complete** when:

1. **Zod Schemas**: RegimeSignature + CLI args validation working
2. **Expected Event Grid**: Deterministic calculation implemented
3. **Canonical Hash**: Bit-perfect determinism validated
4. **Reorder Buffer**: Min-heap implementation (no .sort() per event)
5. **Error Handling**: Duplicates, version validation, CLI exit codes
6. **Test Suite**: 5 property tests + 4 edge cases passing

## Validation Protocol

1. **Week 1**: Schemas + expected event grid + hash spec
2. **Week 2**: Reorder buffer + error handling + test suite
3. **Week 3**: End-to-end determinism validation
4. **Week 4**: 7-day continuous operation validation

**Final Test**: CLI replay of 7-day historical data with 100% deterministic hash match.