# Implementation Plan: Market Context Engine v2

## Overview

Implementazione del Market Context Engine seguendo l'approccio "MAX architecture, progressive activation, free-first". Focus sul Brick #1: Canonical Event Log + Replay Deterministico - la base scientifica per classificazione falsificabile dei regimi di mercato.

**Principio Guida**: Prima rendi falsificabile il classificatore, poi costruisci i tubi d'acciaio.

## Repository Structure (MAX Architecture)

```
mce/
  packages/
    core/
      src/
        types/
          envelope.ts           # EventEnvelope + payload types
          symbols.ts           # Canonical symbol mapping
        zod/
          envelope.zod.ts      # Runtime validation schemas
          payloads.zod.ts      # Payload validation
        ordering/
          sortKey.ts           # Deterministic ordering logic
          reorderBuffer.ts     # Watermark + reorder buffer
        replay/
          replayEngine.ts      # Deterministic replay
          snapshot.ts          # System snapshots
        features/
          timeseriesBuffer.ts  # Circular buffers
          rolling.ts           # Rolling calculations
        health/
          metrics.ts           # KPI tracking
      test/
        properties/
          determinism.spec.ts      # Property 1
          idempotency.spec.ts      # Property 4
          noLookahead.spec.ts      # Property 3
          scaleInvariance.spec.ts  # Property 2
          timeOrderRobustness.spec.ts # Property 5
    ingest-binance/
      src/
        ws/
          client.ts            # WebSocket connection
          streams/
            kline.ts           # Kline stream handler
            funding.ts         # Funding stream handler
            openInterest.ts    # OI stream handler
        rest/
          liquidations.ts      # REST polling for liquidations
        normalize.ts           # Event normalization
        writer.ts            # Event log writer
      test/
        integration/
    storage-pg/
      src/
        schema.sql             # PostgreSQL schema
        writer.ts              # Event log writer
        reader.ts              # Event log reader
        migrations/
  apps/
    replay-cli/
      src/
        main.ts                # CLI for replay testing
    ingest-daemon/
      src/
        main.ts                # Ingestion daemon
  docker/
    docker-compose.yml         # PostgreSQL only
  .env.example
  package.json
  tsconfig.base.json
```

## Tasks

### Brick #0: Foundation Setup (Days 1-2)

- [ ] 1. Setup progetto TypeScript con architettura modulare
  - Inizializzare monorepo con packages/core, packages/ingest, packages/replay
  - Configurare TypeScript strict mode e ESLint per financial code
  - Setup Jest + fast-check per property-based testing
  - Configurare environment per development/testing
  - _Requirements: 10.1, 10.2_

- [ ] 2. Definire EventEnvelope schema e validazione
  - [ ] 2.1 Creare interfacce TypeScript per EventEnvelope e payload types
    - Definire schema versioning (v: 1) con id (ULID) e seq (monotonic)
    - Implementare KlinePayload, FundingPayload, OpenInterestPayload, LiquidationPayload
    - Deterministic ordering: (ts_event, ts_ingest, seq)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_

  - [ ] 2.2 Implementare Zod schemas per validazione runtime
    - Schema validation per tutti i payload types
    - Error handling dettagliato per validation failures
    - _Requirements: 1.5, 1.7_

  - [ ] 2.3 Scrivere property test per schema validation
    - **Property 6: Schema Validation Consistency**
    - **Validates: Requirements 1.5, 1.7**

- [ ] 3. Implementare canonical symbol mapping
  - [ ] 3.1 Creare SymbolMap e mapping rules
    - Mapping Binance symbols → canonical format
    - Validation per symbol format
    - _Requirements: 1.6, 2.5_

  - [ ] 3.2 Scrivere property test per symbol mapping
    - **Property 7: Symbol Mapping Determinism**
    - **Validates: Requirements 1.6, 2.5**

### Brick #1a: Event Ingestion (Days 3-4)

- [ ] 4. Implementare Binance WebSocket connection
  - [ ] 4.1 Creare BinanceEventNormalizer
    - WebSocket connection con auto-reconnect
    - Event normalization da raw Binance format
    - Timestamp handling (ts_event vs ts_ingest)
    - _Requirements: 2.1, 2.2, 2.4_

  - [ ] 4.2 Implementare data quality validation
    - Validation prima dell'inserimento nel log
    - Quality scoring basato su completezza e latency
    - _Requirements: 2.6, 9.3_

  - [ ] 4.3 Gestire duplicate detection
    - Identificazione duplicati basata su (symbol, ts_event, stream)
    - Idempotent handling per eventi ripetuti
    - _Requirements: 2.7_

  - [ ] 4.4 Scrivere property test per idempotency
    - **Property 4: Idempotency**
    - **Validates: Requirements 6.2**

### Brick #1b: Canonical Event Log (Days 4-5)

- [ ] 5. Implementare PostgreSQL event storage
  - [ ] 5.1 Creare database schema per events table
    - Tabella events con indexes ottimizzati
    - Constraints per data integrity
    - Partitioning strategy per performance
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 5.2 Implementare PostgreSQLEventLog class
    - Append-only operations con conflict resolution
    - Query interface per range temporali
    - Integrity validation e checksum
    - _Requirements: 3.4, 3.5, 3.7_

  - [ ] 5.3 Implementare compression per dati storici
    - Compressione automatica oltre 90 giorni
    - Archival strategy per old events
    - _Requirements: 3.6_

### Brick #1c: Replay Engine (Days 6-7)

- [ ] 6. Implementare DeterministicReplayEngine
  - [ ] 6.1 Creare core replay functionality
    - Event ordering per ts_event deterministico
    - In-memory processing senza side effects
    - Snapshot creation a intervalli configurabili
    - _Requirements: 4.1, 4.2, 4.5, 4.6_

  - [ ] 6.2 Implementare watermark + reorder buffer algorithm
    - Buffer di riordino per network jitter (30s window)
    - Watermark = max_ts_event_seen - reorder_window_ms
    - Processare solo eventi con ts_event <= watermark
    - Late event marking per eventi oltre watermark
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 6.3 Scrivere property test per out-of-order robustness
    - **Property 5: Out-of-Order Robustness**
    - **Validates: Requirements 5.4**

  - [ ] 6.4 Implementare lookahead leakage prevention
    - Validation che feature(t) usa solo dati ≤ t
    - Time order enforcement in calculations
    - _Requirements: 4.7, 6.3_

  - [ ] 6.5 Scrivere property test per time monotonicity
    - **Property 3: Time Monotonicity**
    - **Validates: Requirements 4.7, 6.3**

  - [ ] 6.6 Implementare determinism validation
    - Bit-per-bit output comparison per replay multipli
    - Checksum validation per system snapshots
    - _Requirements: 4.3_

  - [ ] 6.7 Scrivere property test per deterministic replay
    - **Property 1: Deterministic Replay**
    - **Validates: Requirements 4.3**

- [ ] 7. Checkpoint - Validare Replay Engine con KPI
  - **KPI Brick #1 Metrics**:
    - % eventi invalidi scartati < 0.1%
    - Reorder rate (% out-of-order) < 5%
    - Late rate (% oltre finestra) < 1%
    - Ingestion lag p50/p95 < 10ms/50ms
    - Replay determinism hash = 100% match
    - Gap rate (% missing klines) < 0.01%
  - Verificare determinismo assoluto su dati storici
  - Validare robustezza a eventi out-of-order

### Brick #2: Feature Store (Week 2, Days 8-10)

- [ ] 8. Implementare FeatureStore con rolling calculations
  - [ ] 8.1 Creare core FeatureStore interface
    - Multi-window feature computation (7d/30d/90d)
    - As-of-time semantics per anti-leakage
    - Efficient circular buffers per rolling stats
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ] 8.2 Implementare ATR calculations
    - ATR(14) e ATR(50) con True Range formula
    - ATR% normalization per prezzo
    - Rolling percentiles invece di z-score fisso
    - _Requirements: 7.4, 7.5_

  - [ ] 8.3 Implementare trend direction detection
    - Trend classification su H1/H4/D1 timeframes
    - EMA-based slope calculation
    - Robust trend detection con smoothing
    - _Requirements: 7.5_

  - [ ] 8.4 Scrivere property test per feature consistency
    - **Property 8: Feature Window Consistency**
    - **Validates: Requirements 7.1, 7.7**

  - [ ] 8.5 Implementare exponential decay per dati vecchi
    - Weight decay per observations più vecchie
    - Configurable decay parameters
    - _Requirements: 7.6_

### Brick #3: Price Regime Classifier v0 (Week 2, Days 11-12)

- [ ] 9. Implementare minimal price regime classification
  - [ ] 9.1 Creare PriceRegimeClassifier
    - Volatility regime: compressed/normal/expanded
    - Trend regime: up/down/sideways
    - Combination logic per final classification
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ] 9.2 Implementare confidence scoring
    - Data quality based confidence
    - Feature stability metrics
    - Uncertainty quantification
    - _Requirements: 8.5_

  - [ ] 9.3 Implementare regime stability validation
    - Anti-oscillation smoothing
    - Minimum regime duration enforcement
    - Flip rate monitoring
    - _Requirements: 8.6, 6.4_

  - [ ] 9.4 Scrivere property test per regime stability
    - **Property 9: Regime Stability Bounds**
    - **Validates: Requirements 6.4, 8.6**

  - [ ] 9.5 Implementare scale invariance validation
    - Test che prezzo x10 non cambia classificazione
    - Robust statistics per outlier resistance
    - _Requirements: 6.1_

  - [ ] 9.6 Scrivere property test per scale invariance
    - **Property 2: Scale Invariance**
    - **Validates: Requirements 6.1**

### Brick #4: System Health & Metrics (Week 2, Days 13-14)

- [ ] 10. Implementare comprehensive health monitoring
  - [ ] 10.1 Creare MetricsCollector
    - Ingestion latency tracking
    - Compute latency measurement
    - Data quality score monitoring
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 10.2 Implementare out-of-order event metrics
    - Count eventi late arrivals
    - Buffer utilization tracking
    - Time drift monitoring
    - _Requirements: 9.4, 5.5_

  - [ ] 10.3 Implementare regime quality metrics
    - Regime flip rate measurement
    - Stability score calculation
    - Missing data percentage tracking
    - _Requirements: 9.5, 9.6_

  - [ ] 10.4 Creare health endpoint
    - Aggregated system status
    - Component health checks
    - Performance dashboard data
    - _Requirements: 9.7_

  - [ ] 10.5 Scrivere property test per data quality monotonicity
    - **Property 10: Data Quality Monotonicity**
    - **Validates: Requirements 9.3, 9.6**

### Integration & Validation (Week 2, Days 14-15)

- [ ] 11. End-to-end integration testing
  - [ ] 11.1 Implementare historical data replay test
    - Load historical Binance data
    - Verify deterministic replay results
    - Performance benchmarking
    - _Requirements: All core requirements_

  - [ ] 11.2 Implementare failure scenario testing
    - Network disconnection handling
    - Data corruption recovery
    - System restart robustness
    - _Requirements: 2.2, 3.5, 4.6_

  - [ ] 11.3 Validare financial properties end-to-end
    - Scale invariance across full pipeline
    - Time monotonicity in real scenarios
    - Regime stability in volatile markets
    - _Requirements: 6.1, 6.3, 6.4_

- [ ] 12. Performance optimization e tuning
  - [ ] 12.1 Ottimizzare memory usage
    - Buffer size tuning
    - Garbage collection optimization
    - Memory leak detection
    - _Performance targets: <100MB steady state_

  - [ ] 12.2 Ottimizzare latency targets
    - Ingestion: <10ms, Compute: <5ms, Classification: <1ms
    - Hot path optimization
    - Async processing where appropriate
    - _Performance targets: <20ms total pipeline_

- [ ] 13. Final Checkpoint - Sistema Brick #1 Completo
  - Validare determinismo assoluto su 30+ giorni di dati
  - Verificare performance targets raggiunti
  - Confermare robustezza a failure scenarios
  - Documentare metrics baseline per future comparisons

## Notes

- **Strategy Agnostic**: MCE non implica azioni di trading, solo vincoli di selezione strategica
- **Focus**: Brick #1 (Canonical Event Log + Replay) è la base scientifica
- **No premature optimization**: Redis, API, multi-source vengono dopo
- **Determinismo assoluto**: Same input → Same output è non-negoziabile
- **Financial robustness**: Scale invariance e time monotonicity sono critici
- **Progressive activation**: Ogni brick deve essere completamente validato prima del successivo
- **Property-based testing**: 1000+ iterations per property per robustezza
- **Performance realistico**: 20ms total pipeline per single source è raggiungibile
- **KPI-based validation**: Tutti i KPI devono essere rispettati su 7+ giorni di dati
- **Canonical output**: Formato standardizzato per replay e confronto versioni

## Future Bricks (Post-Week 2)

- **Brick #5**: Multi-source ingestion (Bybit parallel)
- **Brick #6**: Advanced classifiers (Leverage, Behavioral)  
- **Brick #7**: API layer + Redis caching
- **Brick #8**: Production monitoring + alerting

Ogni future brick mantiene il determinismo core e estende le capabilities senza breaking changes.