# Market Context Engine (MCE) - Requirements v2

## Introduction

Il Market Context Engine è il primo mattoncino obbligatorio per un'infrastruttura di trading AI accademicamente rigorosa. Implementa il principio fondamentale: **se non puoi riprodurre gli stessi output dagli stessi input, non puoi validare nulla**.

**Strategy Agnostic Principle**: The Market Context Engine does not encode or imply any trading action. It only constrains downstream strategy selection by providing objective market regime classification.

Questo documento definisce il Brick #1: **Canonical Event Log + Replay Deterministico** - la base scientifica per classificazione falsificabile dei regimi di mercato.

## Glossary

- **Event_Envelope**: Struttura standardizzata per tutti gli eventi di mercato
- **Canonical_Log**: Append-only event stream con ordering deterministico
- **Replay_Engine**: Sistema per riproduzione bit-per-bit degli output
- **Ground_Truth_Stream**: Dataset normalizzato da single source (Binance)
- **Deterministic_Pipeline**: Processing che garantisce same input → same output
- **Lookahead_Leakage**: Uso di dati futuri per calcoli presenti (vietato)
- **Time_Monotonicity**: Robustezza a eventi out-of-order
- **Scale_Invariance**: Stabilità delle classificazioni a variazioni di prezzo

## Non-Goals (Brick #1 Scope)

Per evitare scope creep, il Brick #1 esplicitamente NON include:

- **No UI/Dashboard**: Solo core engine e CLI tools
- **No Multi-Source**: Solo Binance per stabilità
- **No Redis/Caching**: Storage semplice PostgreSQL/file
- **No REST/WebSocket API**: Solo internal interfaces
- **No TimescaleDB**: PostgreSQL plain è sufficiente
- **No Trading Execution**: Solo classificazione, no ordini
- **No Real-time Streaming API**: Solo batch replay e ingestion
- **No Advanced Classifiers**: Solo Price Regime v0
- **No Production Monitoring**: Solo basic health metrics
- **No Data Compression**: Ottimizzazione per fasi successive

## Requirements

### Requirement 1: Canonical Event Schema

**User Story:** Come sistema di trading, voglio uno schema standardizzato per tutti gli eventi di mercato, così da garantire consistenza e riproducibilità.

#### Acceptance Criteria

1. THE System SHALL definire EventEnvelope con versioning (v: 1)
2. THE EventEnvelope SHALL includere id (ULID/UUID v7) e seq (monotonic ingest sequence)
3. THE EventEnvelope SHALL includere source ("binance"), stream type, symbol standardizzato
4. THE EventEnvelope SHALL separare ts_event (exchange) da ts_ingest (local monotonic)
5. THE EventEnvelope SHALL supportare payload tipizzato per kline/funding/oi/liquidation
6. THE System SHALL ordinare deterministicamente per (ts_event, ts_ingest, seq)
7. THE System SHALL validare tutti gli eventi con Zod schemas
8. THE System SHALL mappare simboli in formato canonico (BTCUSDT standard)
9. THE System SHALL rifiutare eventi con schema invalido

### Requirement 2: Single Source Data Ingestion

**User Story:** Come ricercatore quantitativo, voglio dati da una fonte stabile e gratuita, così da costruire una base affidabile senza dipendenze esterne fragili.

#### Acceptance Criteria

1. THE System SHALL consumare SOLO dati Binance Perpetual Futures
2. WHEN si connette a Binance WebSocket, THE System SHALL sottoscrivere kline/funding/oi streams
3. THE System SHALL gestire liquidations via REST polling se stream non disponibile
4. THE System SHALL normalizzare tutti i timestamp in UTC milliseconds
5. THE System SHALL applicare canonical symbol mapping (es. BTCUSDT)
6. THE System SHALL validare data quality prima dell'inserimento
7. THE System SHALL scartare eventi duplicati basati su (symbol, ts_event, stream)

### Requirement 3: Append-Only Event Log

**User Story:** Come sistema di backtesting, voglio un log immutabile degli eventi, così da poter riprodurre qualsiasi calcolo storico.

#### Acceptance Criteria

1. THE System SHALL scrivere eventi in append-only log (PostgreSQL o file)
2. THE System SHALL ordinare eventi per (ts_event, ts_ingest, seq) per determinismo
3. THE System SHALL mantenere correlation keys per eventi correlati (symbol, stream, ts_event bucket)
4. THE System SHALL supportare query efficienti per range temporali
5. THE System SHALL prevenire modifiche o cancellazioni di eventi storici
6. THE System SHALL fornire checksum per validazione integrità
7. THE System SHALL supportare optional correlation_id per eventi derivati

### Requirement 4: Deterministic Replay Engine

**User Story:** Come quant researcher, voglio riprodurre esattamente gli stessi calcoli, così da validare e debuggare i modelli di classificazione.

#### Acceptance Criteria

1. THE Replay Engine SHALL leggere eventi in ordine cronologico (ts_event)
2. THE Replay Engine SHALL processare eventi in-memory senza side effects
3. THE Replay Engine SHALL produrre output identici per input identici (bit-per-bit)
4. THE Replay Engine SHALL gestire eventi out-of-order senza corrompere stato
5. THE Replay Engine SHALL salvare snapshots dello stato a intervalli configurabili
6. THE Replay Engine SHALL supportare replay da qualsiasi timestamp storico
7. THE Replay Engine SHALL validare no-lookahead-leakage in tutti i calcoli

### Requirement 5: Time-Order Robustness

**User Story:** Come sistema real-time, voglio gestire eventi fuori ordine, così da mantenere accuratezza anche con network jitter.

#### Acceptance Criteria

1. THE System SHALL mantenere buffer di riordino per finestra configurabile (30s)
2. THE System SHALL definire watermark = max_ts_event_seen - reorder_window_ms
3. THE System SHALL processare solo eventi con ts_event <= watermark
4. THE System SHALL ordinare eventi nel buffer per (ts_event, ts_ingest, seq)
5. THE System SHALL marcare eventi oltre watermark come "late" ma processarli
6. THE System SHALL tracciare metriche di out-of-order events
7. THE System SHALL garantire che calcoli rolling non usino dati futuri

### Requirement 6: Financial Properties Validation

**User Story:** Come financial engineer, voglio proprietà matematiche robuste, così da evitare classificazioni instabili o errate.

#### Acceptance Criteria

1. THE System SHALL garantire scale invariance (prezzo x10 non cambia trend classification)
2. THE System SHALL garantire idempotency (stesso evento → stesso output)
3. THE System SHALL prevenire lookahead leakage (feature(t) usa solo dati ≤ t)
4. THE System SHALL validare time monotonicity su rolling calculations
5. THE System SHALL tracciare data consistency metrics
6. THE System SHALL applicare deterministic ordering per eventi simultanei
7. THE System SHALL mantenere audit trail per debugging

### Requirement 7: Multi-Window Feature Store

**User Story:** Come classificatore di regimi, voglio finestre temporali multiple, così da catturare dinamiche a diverse scale temporali.

#### Acceptance Criteria

1. THE System SHALL calcolare features su finestre 7d/30d/90d
2. THE System SHALL mantenere as-of-time semantics per anti-leakage
3. THE System SHALL utilizzare rolling percentiles per volatility classification
4. THE System SHALL calcolare ATR% su finestre 14/50 periods
5. THE System SHALL tracciare trend direction su H1/H4/D1 timeframes
6. THE System SHALL validare feature consistency across windows
7. THE System SHALL supportare feature snapshots per replay

### Requirement 8: Minimal Price Regime Classification

**User Story:** Come primo classificatore, voglio un regime di prezzo semplice ma robusto, così da validare l'approccio prima di aggiungere complessità.

#### Acceptance Criteria

1. THE Price Classifier SHALL calcolare ATR% normalizzato per prezzo
2. THE Price Classifier SHALL utilizzare rolling percentiles per compression/expansion
3. THE Price Classifier SHALL combinare volatility regime con trend direction
4. THE Price Classifier SHALL classificare in {trend_up, trend_down, range} x {compressed, normal, expanded}
5. THE Price Classifier SHALL includere confidence score basato su data quality
6. THE Price Classifier SHALL applicare smoothing per prevenire oscillazioni
7. THE Price Classifier SHALL limitare regime flip rate (max 1 cambio per 5 minuti)
8. THE Price Classifier SHALL applicare robust statistics (median/MAD) per outlier resistance

### Requirement 9: System Health & Metrics

**User Story:** Come operatore del sistema, voglio metriche di salute, così da monitorare qualità dei dati e performance.

#### Acceptance Criteria

1. THE System SHALL tracciare ingestion latency (network → storage)
2. THE System SHALL tracciare compute latency (data → classification)
3. THE System SHALL monitorare data quality score per source
4. THE System SHALL contare eventi out-of-order e late arrivals
5. THE System SHALL misurare regime flip rate e stability
6. THE System SHALL tracciare missing data percentage
7. THE System SHALL fornire health endpoint con status aggregato

### Requirement 10: Progressive Architecture Foundation

**User Story:** Come sistema evolutivo, voglio architettura estensibile, così da aggiungere fonti e classificatori senza refactoring.

#### Acceptance Criteria

1. THE System SHALL separare ingestion/storage/compute/classification layers
2. THE System SHALL supportare plugin architecture per nuovi classificatori
3. THE System SHALL permettere aggiunta di nuove sources senza breaking changes
4. THE System SHALL mantenere backward compatibility per event schema
5. THE System SHALL supportare feature flag per abilitare/disabilitare componenti
6. THE System SHALL documentare extension points per future enhancements
7. THE System SHALL validare che core determinism non sia compromesso da estensioni

## Brick #1 Canonical Output

Il Market Context Engine produce un output standardizzato per replay, confronto versioni e validazione:

```json
{
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
    "last_regime_change": 1729998200000
  }
}
```

**Purpose**: 
- Deterministic replay validation
- Version comparison testing  
- System health monitoring
- Regime stability analysis
## Brick #1 Validation Metrics

Il sistema deve essere validato attraverso KPI oggettivi (non PnL):

### Core Determinism Metrics
- **Determinism Hash Match**: 100% (replay identici)
- **Event Processing Success Rate**: >99.9%
- **Schema Validation Pass Rate**: >99.95%

### Data Quality Metrics  
- **Missing Events Rate**: <0.01% (gap rate)
- **Late Events Rate**: <1% (oltre reorder window)
- **Out-of-Order Events Rate**: <5% (reorder buffer usage)
- **Data Coverage**: >99.5% (klines completeness)

### Regime Stability Metrics
- **Regime Flip Rate**: <12 flips/hour (stability bound)
- **Average Regime Duration**: >5 minutes (anti-oscillation)
- **Confidence Score**: >0.7 average (data quality threshold)

### Performance Metrics
- **Ingestion Lag P50/P95**: <10ms/50ms
- **Replay Throughput**: >1000 events/second
- **Memory Usage**: <100MB steady state

**Validation Rule**: Brick #1 è considerato funzionante solo se TUTTI i KPI sono rispettati su 7+ giorni di dati continui.