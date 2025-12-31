# Market Context Engine - Canonical Output Format v2

## Overview

Il Market Context Engine produce un output standardizzato per replay, confronto versioni e validazione. Questo formato garantisce determinismo e comparabilità tra diverse esecuzioni del sistema.

## RegimeSignature Schema

```typescript
interface RegimeSignature {
  output_v: 1;                         // Output format version
  as_of_ts: number;                    // Timestamp of classification (ms UTC)
  symbol: string;                      // Canonical symbol (BTCUSDT)
  price_regime: {
    trend: "up" | "down" | "range";
    volatility: "compressed" | "normal" | "expanded";
  };
  confidence: number;                  // 0.0 - 1.0 classification confidence
  data_quality: {
    missing_pct: number;               // % missing events in window
    late_events_pct: number;           // % events beyond reorder window
    coverage_pct: number;              // % data completeness
  };
  metadata: {
    events_processed: number;          // Total events used for classification
    regime_duration_minutes: number;   // How long current regime has persisted
    last_regime_change: number;        // Timestamp of last regime change (ms UTC)
    canonical_hash: string;            // SHA-256 hash for determinism validation
  };
}
```

## Canonical JSON Example

```json
{
  "output_v": 1,
  "as_of_ts": 1730000000000,
  "symbol": "BTCUSDT",
  "price_regime": {
    "trend": "range",
    "volatility": "compressed"
  },
  "confidence": 0.81,
  "data_quality": {
    "missing_pct": 0.2,
    "late_events_pct": 1.1,
    "coverage_pct": 99.8
  },
  "metadata": {
    "events_processed": 14523,
    "regime_duration_minutes": 47,
    "last_regime_change": 1729998200000,
    "canonical_hash": "sha256:a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
  }
}
```

## Alternative Example - Trending Market

```json
{
  "output_v": 1,
  "as_of_ts": 1730003600000,
  "symbol": "ETHUSDT",
  "price_regime": {
    "trend": "up",
    "volatility": "expanded"
  },
  "confidence": 0.94,
  "data_quality": {
    "missing_pct": 0.0,
    "late_events_pct": 0.3,
    "coverage_pct": 100.0
  },
  "metadata": {
    "events_processed": 8947,
    "regime_duration_minutes": 23,
    "last_regime_change": 1730002220000,
    "canonical_hash": "sha256:f7e8d9c0b1a2345678901234567890abcdef1234567890abcdef1234567890ab"
  }
}
```

## Serialization Rules

### Canonical JSON Serialization

1. **Key Ordering**: All JSON keys must be sorted alphabetically at every level
2. **Numeric Precision**: All floating-point numbers rounded to 6 decimal places
3. **Timestamp Format**: All timestamps as integer milliseconds UTC
4. **String Normalization**: All strings trimmed and lowercase where applicable
5. **No Whitespace**: Compact JSON without spaces or newlines

### Hash Calculation

```typescript
function calculateCanonicalHash(signature: RegimeSignature): string {
  // Create copy without the hash field
  const { metadata: { canonical_hash, ...restMetadata }, ...rest } = signature;
  const hashInput = { ...rest, metadata: restMetadata };
  
  // Serialize with canonical rules
  const canonicalJson = JSON.stringify(hashInput, Object.keys(hashInput).sort());
  
  // Calculate SHA-256
  return `sha256:${crypto.createHash('sha256').update(canonicalJson).digest('hex')}`;
}
```

### Version Compatibility

- **output_v: 1**: Initial format (Brick #1)
- **Future versions**: Backward compatible, additive changes only
- **Breaking changes**: Increment major version, maintain parallel support

## Usage Patterns

### Replay Validation
```typescript
// Compare two runs for determinism
const run1 = await replayEngine.replay(params);
const run2 = await replayEngine.replay(params);

assert(run1.metadata.canonical_hash === run2.metadata.canonical_hash);
```

### Version Comparison
```typescript
// Compare different MCE versions
const v1Results = await mceV1.classify(data);
const v2Results = await mceV2.classify(data);

// Analyze differences
const differences = compareRegimeSignatures(v1Results, v2Results);
```

### System Health Monitoring
```typescript
// Track regime stability
const signatures = await getRecentSignatures(symbol, '1h');
const flipRate = calculateFlipRate(signatures);
const avgConfidence = signatures.reduce((sum, s) => sum + s.confidence, 0) / signatures.length;
```

## Validation Rules

### Required Fields
- All fields in the schema are required
- `output_v` must be a positive integer
- `as_of_ts` must be a valid Unix timestamp in milliseconds
- `confidence` must be between 0.0 and 1.0
- All percentage fields must be between 0.0 and 100.0

### Data Quality Constraints
- `missing_pct + coverage_pct` should approximately equal 100.0
- `late_events_pct` should be < 10.0 under normal conditions
- `events_processed` must be > 0
- `regime_duration_minutes` must be >= 0

### Hash Validation
- `canonical_hash` must be valid SHA-256 format
- Hash must match recalculated hash from signature data
- Hash validation is critical for determinism verification

This canonical output format ensures reproducible, comparable, and validatable results across all MCE operations.