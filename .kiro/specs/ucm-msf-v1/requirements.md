# UCM + MSF v1 - Requirements Specification

## Overview

Implementazione di Universe Control Module (UCM) e Market Selection & Fit Engine (MSF) che si integrano con il MCE esistente per creare un sistema completo di selezione e valutazione dei mercati.

**Architettura**: MCE → UCM → MSF → Dashboard Intraday

## UCM v1 - Universe Control Module

### Scope
Selezionare e mantenere un UniverseActive dinamico (target 20 simboli) da un UniversePool più ampio, con regole anti-flip (isteresi + cooldown) e hard blacklist.

**Principio**: UCM decide chi è eleggibile. MSF decide chi è fit oggi.

### Input Contracts (CONGELATI)

#### 1.1 UniversePool (statico, aggiornato manualmente)
```typescript
UniversePool_v1 {
  v: "ucm.pool.v1"
  asOf: number
  symbols: string[]          // 50–150 max
  coreSymbols: string[]      // sempre dentro, es. ["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","XRPUSDT"]
  hash: string
}
```

#### 1.2 EligibilitySnapshot (aggiornato ogni 1m o 5m)
```typescript
EligibilitySnapshot_v1 {
  symbol: string
  asOf: number
  
  // Liquidity / friction
  volQuote_24h: number       // da Binance 24h ticker
  spreadBps: number          // proxy bestBid/bestAsk
  
  // Data quality
  completeness_60m: number   // 0..1 (1m bars)
  gaps_60m: number           // count gaps
  
  // Activity
  atr14_1m: number
  atrPercentile_1m: number   // 0..100 su finestra 300
}
```

#### 1.3 UniverseState (persistito)
```typescript
UniverseState_v1 {
  symbol: string
  status: "ACTIVE" | "INACTIVE" | "BLACKLISTED"
  enteredAt?: number
  exitedAt?: number
  cooldownUntil?: number
  blacklistUntil?: number
}
```

### Output Contract (CONGELATO)

```typescript
UniverseActive_v1 {
  v: "ucm.active.v1"
  asOf: number
  
  target: number            // 20
  min: number               // 12
  max: number               // 25
  
  symbols: string[]         // ordered, length <= max
  coreIncluded: boolean
  
  meta: {
    added: string[]
    removed: string[]
    blacklisted: string[]
  }
  
  basedOn: {
    poolHash: string
    eligibilityBatchHash: string
    prevActiveHash?: string
  }
  
  hash: string
}
```

### Parameters (CONGELATI)

```typescript
const UCM_CONFIG = {
  TARGET: 20,
  MIN_ACTIVE: 12,
  MAX_ACTIVE: 25,
  
  ENTER_CONFIRM_MINUTES: 10,      // isteresi entrata
  EXIT_CONFIRM_MINUTES: 20,       // isteresi uscita
  
  COOLDOWN_MINUTES: 60,           // dopo uscita
  BLACKLIST_DAYS: 7,              // hard fail
  
  // Hard disqualification thresholds
  HARD_DQ: {
    completeness_60m: 0.98,
    gaps_60m: 0
  },
  
  // Eligibility thresholds
  ELIGIBLE: {
    spreadBps: "SPREAD_ENTER_MAX",
    completeness_60m: 0.99,
    gaps_60m: 0,
    atr14_1m: "ATR_MIN"
  }
}
```

### Ranking Score (CONGELATO)

```typescript
rankScore = 0.55 * norm(volQuote_24h)
          + 0.25 * (100 - frictionScore)
          + 0.20 * norm(dataQualityScore)

// Dove:
frictionScore = clamp(f(spreadBps, atrPercentile_1m), 0..100)
dataQualityScore = 100 se gaps=0 e completeness >=0.99, altrimenti scala giù
```

### UCM Rules (CONGELATE)

1. **Blacklist hard**: HARD_DQ → BLACKLISTED per BLACKLIST_DAYS
2. **Core symbols always-in**: coreSymbols sempre in Active se non blacklisted
3. **Entrata (isteresi)**: eligible per ENTER_CONFIRM_MINUTES consecutivi
4. **Uscita (isteresi)**: non-eligible per EXIT_CONFIRM_MINUTES consecutivi
5. **Cap & floors**: rispetta MIN_ACTIVE/MAX_ACTIVE

## MSF v1 - Market Selection & Fit Engine

### Scope
Dato MCE e UniverseActive, calcolare "fit" e decidere giornata tradabile/no-trade.

### Input Contracts (CONGELATI)

```typescript
// Da MCE esistente
MCE.RegimeSignature_v1

// Da UCM
UniverseActive_v1

// Per ogni symbol in active
UniverseSnapshot_v1 {
  symbol: string
  asOf: number
  price: number
  
  atr14_1m: number
  atrPercentile_1m: number
  
  ret1mAbs: number
  ret15mAbs: number
  
  volume1m: number
  volumeMA_15m: number
  
  spreadBps: number
  
  gapCount_60m: number
  completeness_60m: number
}
```

### Output Contracts (CONGELATI)

#### MarketFit per symbol
```typescript
MarketFit_v1 {
  v: "msf.v1"
  asOf: number
  symbol: string
  
  fitScore: number            // 0..100
  fitClass: "A"|"B"|"C"|"NO_TRADE"
  tradableToday: boolean
  
  allowedPlaybooks: {
    breakout: boolean
    pullback: boolean
    meanRevert: boolean
  }
  
  liquidityTier: "T1"|"T2"|"T3"
  frictionScore: number       // 0..100
  
  dataQuality: {
    valid: boolean
    gaps60m: number
    completeness60m: number
  }
  
  reasons: string[]           // max 5
  
  basedOn: {
    mceHash: string
    universeActiveHash: string
    universeSnapshotHash: string
  }
  
  hash: string
}
```

#### DayGate (decisione giornaliera)
```typescript
DayGate_v1 {
  v: "msf.daygate.v1"
  asOf: number
  tradableDay: boolean
  countA: number
  countB: number
  basedOn: {
    mceHash: string
    universeActiveHash: string
  }
  hash: string
}
```

### MSF Rules (CONGELATE)

#### Hard Exclusions
- IF MCE.state = HOLD → NO_TRADE for all
- IF completeness_60m < 0.98 OR gapCount_60m > 0 → NO_TRADE
- IF spreadBps > SPREAD_FIT_MAX → NO_TRADE

#### LiquidityTier
- T1: volumeMA_15m alto + spread basso
- T2: medio
- T3: basso (mai A)

#### frictionScore
```typescript
frictionScore = clamp(
  w1*norm(spreadBps) + 
  w2*norm(ret1mAbs) + 
  w3*norm(spreadBps * atrPercentile_1m),
  0..100
)
```

#### Regime Compatibility → allowedPlaybooks
- Trend ≠ range & vol=normal → breakout=true, pullback=true, meanRevert=false
- Trend=range & vol!=expanded → meanRevert=true, breakout=false, pullback=false
- vol=expanded → tutto false (eccezione: T1 + confidence≥0.75 → breakout OR pullback, ma solo B)

#### fitScore & class
```typescript
fitScore = 35% liquidityQuality + 
           35% regimeCompatibilityScore + 
           30% (100 - frictionScore)

// Class:
// A ≥ 80
// B 65–79
// C 50–64
// NO_TRADE < 50
```

#### Tradable Day
```typescript
tradableDay = (count(A) + count(B) >= 1)
```

## Database Schema Requirements

### UCM Tables
```sql
-- Universe pool versions
universe_pool (
  id, version, as_of, symbols, core_symbols, hash, created_at
)

-- Per-symbol state tracking
universe_state (
  symbol, status, entered_at, exited_at, cooldown_until, blacklist_until, updated_at
)

-- Active universe snapshots
universe_active (
  id, as_of, version, target, min_count, max_count, symbols, core_included, 
  meta, based_on, hash, created_at
)

-- Eligibility snapshots
eligibility_snapshots (
  symbol, as_of, vol_quote_24h, spread_bps, completeness_60m, gaps_60m,
  atr14_1m, atr_percentile_1m, created_at
)
```

### MSF Tables
```sql
-- Market fit per symbol
market_fit (
  symbol, as_of, fit_score, fit_class, tradable_today, allowed_playbooks,
  liquidity_tier, friction_score, data_quality, reasons, based_on, hash, created_at
)

-- Daily gate decision
day_gate (
  as_of, tradable_day, count_a, count_b, based_on, hash, created_at
)
```

## API Requirements

### UCM APIs
- `GET /api/universe/active` → UniverseActive_v1
- `GET /api/universe/diff?from=...&to=...` → changes
- `GET /api/universe/pool` → current pool
- `POST /api/universe/pool` → update pool (admin)

### MSF APIs
- `GET /api/msf/top?limit=10` → top MarketFit_v1[]
- `GET /api/msf/status` → DayGate_v1
- `GET /api/msf/symbol/{symbol}` → MarketFit_v1

## KPI "Anti-Fuffa" (Validation Criteria)

UCM + MSF v1 è VALIDATO quando su 5–10 giorni:

1. **tradableDay=false almeno 20–40% dei giorni** (mercato spesso non è buono)
2. **fitClass A raramente > 2–3 simboli**
3. **turnover Active (added/removed) medio <= 2–4 per ora**
4. **simboli con data gaps finiscono in blacklist e non rientrano subito**

## Integration with MCE

UCM e MSF consumano:
- MCE RegimeSignature per regime compatibility
- MCE market_data per calcoli ATR/volume
- MCE system_health per validazione pipeline

## Free Tier Compliance

- Utilizza Supabase Free per persistenza
- GitHub Actions per automazione
- Vercel per API hosting
- Nessun servizio a pagamento richiesto

## Definition of Done

### UCM
- ✅ Active symbols stabili (non flippano ogni minuto)
- ✅ Added/removed per ora <= 2–4 in condizioni normali
- ✅ Blacklist funziona e "punisce" data gaps
- ✅ Core sempre presente (se non blacklisted)

### MSF
- ✅ fitScore riflette qualità reale del mercato
- ✅ tradableDay=false quando mercato è poor quality
- ✅ allowedPlaybooks coerenti con regime MCE
- ✅ Nessun symbol con data gaps in classe A/B

### Integration
- ✅ Pipeline completa MCE → UCM → MSF funzionante
- ✅ API responses < 200ms
- ✅ Deterministic hashing per replay
- ✅ Error handling robusto