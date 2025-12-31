# UCM + MSF v1 - Implementation Tasks

## Overview

Implementazione di Universe Control Module (UCM) e Market Selection & Fit Engine (MSF) seguendo l'approccio "vertical slice" già utilizzato per MCE.

**Obiettivo**: Entro fine implementazione avere pipeline completa MCE → UCM → MSF → API funzionante.

## Phase 1: UCM Foundation (Week 1)

### Task 1.1: Database Schema UCM
**Durata**: 1 giorno
**Output**: Migrazione Supabase per tabelle UCM

```sql
-- File: supabase/migrations/006_ucm_schema.sql
CREATE TABLE universe_pool (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL,
  as_of BIGINT NOT NULL,
  symbols JSONB NOT NULL,
  core_symbols JSONB NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE universe_state (
  symbol TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLACKLISTED')),
  entered_at BIGINT,
  exited_at BIGINT,
  cooldown_until BIGINT,
  blacklist_until BIGINT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE universe_active (
  id SERIAL PRIMARY KEY,
  as_of BIGINT NOT NULL,
  version TEXT NOT NULL,
  target_count INTEGER NOT NULL,
  min_count INTEGER NOT NULL,
  max_count INTEGER NOT NULL,
  symbols JSONB NOT NULL,
  core_included BOOLEAN NOT NULL,
  meta JSONB NOT NULL,
  based_on JSONB NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE eligibility_snapshots (
  symbol TEXT NOT NULL,
  as_of BIGINT NOT NULL,
  vol_quote_24h NUMERIC NOT NULL,
  spread_bps NUMERIC NOT NULL,
  completeness_60m NUMERIC NOT NULL,
  gaps_60m INTEGER NOT NULL,
  atr14_1m NUMERIC NOT NULL,
  atr_percentile_1m NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (symbol, as_of)
);

-- Indexes for performance
CREATE INDEX idx_universe_active_as_of ON universe_active(as_of DESC);
CREATE INDEX idx_eligibility_snapshots_as_of ON eligibility_snapshots(as_of DESC);
CREATE INDEX idx_universe_state_status ON universe_state(status);
```

### Task 1.2: UCM Types & Schemas
**Durata**: 1 giorno
**Output**: TypeScript types e Zod schemas per UCM

```typescript
// File: lib/ucm/schemas.ts
import { z } from "zod";

export const UniversePoolSchema = z.object({
  v: z.literal("ucm.pool.v1"),
  asOf: z.number().int().nonnegative(),
  symbols: z.array(z.string()).min(10).max(150),
  coreSymbols: z.array(z.string()).min(3).max(10),
  hash: z.string().regex(/^[a-f0-9]{64}$/),
});

export const EligibilitySnapshotSchema = z.object({
  symbol: z.string(),
  asOf: z.number().int().nonnegative(),
  volQuote_24h: z.number().nonnegative(),
  spreadBps: z.number().nonnegative(),
  completeness_60m: z.number().min(0).max(1),
  gaps_60m: z.number().int().min(0),
  atr14_1m: z.number().positive(),
  atrPercentile_1m: z.number().min(0).max(100),
});

export const UniverseStateSchema = z.object({
  symbol: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE", "BLACKLISTED"]),
  enteredAt: z.number().int().nonnegative().optional(),
  exitedAt: z.number().int().nonnegative().optional(),
  cooldownUntil: z.number().int().nonnegative().optional(),
  blacklistUntil: z.number().int().nonnegative().optional(),
});

export const UniverseActiveSchema = z.object({
  v: z.literal("ucm.active.v1"),
  asOf: z.number().int().nonnegative(),
  target: z.number().int().positive(),
  min: z.number().int().positive(),
  max: z.number().int().positive(),
  symbols: z.array(z.string()),
  coreIncluded: z.boolean(),
  meta: z.object({
    added: z.array(z.string()),
    removed: z.array(z.string()),
    blacklisted: z.array(z.string()),
  }),
  basedOn: z.object({
    poolHash: z.string(),
    eligibilityBatchHash: z.string(),
    prevActiveHash: z.string().optional(),
  }),
  hash: z.string().regex(/^[a-f0-9]{64}$/),
});

// Type exports
export type UniversePoolType = z.infer<typeof UniversePoolSchema>;
export type EligibilitySnapshotType = z.infer<typeof EligibilitySnapshotSchema>;
export type UniverseStateType = z.infer<typeof UniverseStateSchema>;
export type UniverseActiveType = z.infer<typeof UniverseActiveSchema>;
```

### Task 1.3: UCM Configuration
**Durata**: 0.5 giorni
**Output**: Configurazione parametri UCM

```typescript
// File: lib/ucm/config.ts
export const UCM_CONFIG = {
  TARGET: 20,
  MIN_ACTIVE: 12,
  MAX_ACTIVE: 25,
  
  ENTER_CONFIRM_MINUTES: 10,
  EXIT_CONFIRM_MINUTES: 20,
  
  COOLDOWN_MINUTES: 60,
  BLACKLIST_DAYS: 7,
  
  // Thresholds (da configurare in base ai dati reali)
  SPREAD_ENTER_MAX: 15, // bps
  SPREAD_HARD_MAX: 50,  // bps
  ATR_MIN: 0.001,       // minimum ATR for eligibility
  
  // Ranking weights
  RANKING_WEIGHTS: {
    volume: 0.55,
    friction: 0.25,
    quality: 0.20,
  },
} as const;
```

### Task 1.4: UCM Core Engine
**Durata**: 2 giorni
**Output**: Logica principale UCM

```typescript
// File: lib/ucm/engine/ranking.ts
export function calculateRankingScore(snapshot: EligibilitySnapshotType): number;

// File: lib/ucm/engine/eligibility.ts
export function isEligible(snapshot: EligibilitySnapshotType): boolean;
export function shouldBlacklist(snapshot: EligibilitySnapshotType): boolean;

// File: lib/ucm/engine/hysteresis.ts
export function checkEnterHysteresis(symbol: string, history: EligibilitySnapshotType[]): boolean;
export function checkExitHysteresis(symbol: string, history: EligibilitySnapshotType[]): boolean;

// File: lib/ucm/engine/universe.ts
export function updateUniverseActive(
  pool: UniversePoolType,
  eligibilityBatch: EligibilitySnapshotType[],
  currentStates: UniverseStateType[],
  prevActive?: UniverseActiveType
): UniverseActiveType;
```

### Task 1.5: UCM Database Layer
**Durata**: 1 giorno
**Output**: Repository pattern per UCM

```typescript
// File: lib/ucm/db/repo.ts
export class UCMRepository {
  async getUniversePool(): Promise<UniversePoolType | null>;
  async updateUniversePool(pool: UniversePoolType): Promise<void>;
  
  async getUniverseStates(): Promise<UniverseStateType[]>;
  async updateUniverseState(state: UniverseStateType): Promise<void>;
  
  async getLatestUniverseActive(): Promise<UniverseActiveType | null>;
  async saveUniverseActive(active: UniverseActiveType): Promise<void>;
  
  async saveEligibilitySnapshots(snapshots: EligibilitySnapshotType[]): Promise<void>;
  async getEligibilityHistory(symbol: string, minutes: number): Promise<EligibilitySnapshotType[]>;
}
```

## Phase 2: MSF Foundation (Week 2)

### Task 2.1: Database Schema MSF
**Durata**: 0.5 giorni
**Output**: Migrazione Supabase per tabelle MSF

```sql
-- File: supabase/migrations/007_msf_schema.sql
CREATE TABLE market_fit (
  symbol TEXT NOT NULL,
  as_of BIGINT NOT NULL,
  fit_score NUMERIC NOT NULL,
  fit_class TEXT NOT NULL CHECK (fit_class IN ('A', 'B', 'C', 'NO_TRADE')),
  tradable_today BOOLEAN NOT NULL,
  allowed_playbooks JSONB NOT NULL,
  liquidity_tier TEXT NOT NULL CHECK (liquidity_tier IN ('T1', 'T2', 'T3')),
  friction_score NUMERIC NOT NULL,
  data_quality JSONB NOT NULL,
  reasons JSONB NOT NULL,
  based_on JSONB NOT NULL,
  hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (symbol, as_of)
);

CREATE TABLE day_gate (
  as_of BIGINT PRIMARY KEY,
  tradable_day BOOLEAN NOT NULL,
  count_a INTEGER NOT NULL,
  count_b INTEGER NOT NULL,
  based_on JSONB NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_market_fit_as_of ON market_fit(as_of DESC);
CREATE INDEX idx_market_fit_class ON market_fit(fit_class);
```

### Task 2.2: MSF Types & Schemas
**Durata**: 1 giorno
**Output**: TypeScript types e Zod schemas per MSF

```typescript
// File: lib/msf/schemas.ts
export const UniverseSnapshotSchema = z.object({
  symbol: z.string(),
  asOf: z.number().int().nonnegative(),
  price: z.number().positive(),
  atr14_1m: z.number().positive(),
  atrPercentile_1m: z.number().min(0).max(100),
  ret1mAbs: z.number().nonnegative(),
  ret15mAbs: z.number().nonnegative(),
  volume1m: z.number().nonnegative(),
  volumeMA_15m: z.number().nonnegative(),
  spreadBps: z.number().nonnegative(),
  gapCount_60m: z.number().int().min(0),
  completeness_60m: z.number().min(0).max(1),
});

export const MarketFitSchema = z.object({
  v: z.literal("msf.v1"),
  asOf: z.number().int().nonnegative(),
  symbol: z.string(),
  fitScore: z.number().min(0).max(100),
  fitClass: z.enum(["A", "B", "C", "NO_TRADE"]),
  tradableToday: z.boolean(),
  allowedPlaybooks: z.object({
    breakout: z.boolean(),
    pullback: z.boolean(),
    meanRevert: z.boolean(),
  }),
  liquidityTier: z.enum(["T1", "T2", "T3"]),
  frictionScore: z.number().min(0).max(100),
  dataQuality: z.object({
    valid: z.boolean(),
    gaps60m: z.number().int().min(0),
    completeness60m: z.number().min(0).max(1),
  }),
  reasons: z.array(z.string()).max(5),
  basedOn: z.object({
    mceHash: z.string(),
    universeActiveHash: z.string(),
    universeSnapshotHash: z.string(),
  }),
  hash: z.string().regex(/^[a-f0-9]{64}$/),
});

export const DayGateSchema = z.object({
  v: z.literal("msf.daygate.v1"),
  asOf: z.number().int().nonnegative(),
  tradableDay: z.boolean(),
  countA: z.number().int().min(0),
  countB: z.number().int().min(0),
  basedOn: z.object({
    mceHash: z.string(),
    universeActiveHash: z.string(),
  }),
  hash: z.string().regex(/^[a-f0-9]{64}$/),
});
```

### Task 2.3: MSF Core Engine
**Durata**: 2 giorni
**Output**: Logica principale MSF

```typescript
// File: lib/msf/engine/liquidity.ts
export function calculateLiquidityTier(snapshot: UniverseSnapshotType): "T1" | "T2" | "T3";

// File: lib/msf/engine/friction.ts
export function calculateFrictionScore(snapshot: UniverseSnapshotType): number;

// File: lib/msf/engine/playbooks.ts
export function getAllowedPlaybooks(
  regime: RegimeSignatureType,
  liquidityTier: string,
  confidence: number
): { breakout: boolean; pullback: boolean; meanRevert: boolean };

// File: lib/msf/engine/fit.ts
export function calculateMarketFit(
  snapshot: UniverseSnapshotType,
  regime: RegimeSignatureType,
  universeActive: UniverseActiveType
): MarketFitType;

// File: lib/msf/engine/daygate.ts
export function calculateDayGate(
  marketFits: MarketFitType[],
  regime: RegimeSignatureType,
  universeActive: UniverseActiveType
): DayGateType;
```

### Task 2.4: MSF Database Layer
**Durata**: 1 giorno
**Output**: Repository pattern per MSF

```typescript
// File: lib/msf/db/repo.ts
export class MSFRepository {
  async saveMarketFits(fits: MarketFitType[]): Promise<void>;
  async getLatestMarketFits(limit?: number): Promise<MarketFitType[]>;
  async getMarketFit(symbol: string): Promise<MarketFitType | null>;
  
  async saveDayGate(dayGate: DayGateType): Promise<void>;
  async getLatestDayGate(): Promise<DayGateType | null>;
}
```

## Phase 3: Integration & Pipeline (Week 3)

### Task 3.1: Data Collection Pipeline
**Durata**: 2 giorni
**Output**: Pipeline per raccogliere dati necessari a UCM/MSF

```typescript
// File: lib/ucm/pipeline/collect.ts
export async function collectEligibilitySnapshots(
  symbols: string[]
): Promise<EligibilitySnapshotType[]>;

// File: lib/msf/pipeline/collect.ts
export async function collectUniverseSnapshots(
  symbols: string[]
): Promise<UniverseSnapshotType[]>;
```

### Task 3.2: UCM Pipeline
**Durata**: 1 giorno
**Output**: Pipeline completa UCM

```typescript
// File: lib/ucm/pipeline/runOnce.ts
export async function runUCMPipeline(): Promise<{
  success: boolean;
  universeActive: UniverseActiveType | null;
  errors: string[];
  stats: {
    eligibleCount: number;
    activeCount: number;
    blacklistedCount: number;
    addedCount: number;
    removedCount: number;
  };
}>;
```

### Task 3.3: MSF Pipeline
**Durata**: 1 giorno
**Output**: Pipeline completa MSF

```typescript
// File: lib/msf/pipeline/runOnce.ts
export async function runMSFPipeline(): Promise<{
  success: boolean;
  dayGate: DayGateType | null;
  marketFits: MarketFitType[];
  errors: string[];
  stats: {
    countA: number;
    countB: number;
    countC: number;
    countNoTrade: number;
    tradableDay: boolean;
  };
}>;
```

### Task 3.4: Integrated Pipeline
**Durata**: 1 giorno
**Output**: Pipeline completa MCE → UCM → MSF

```typescript
// File: lib/pipeline/integrated.ts
export async function runIntegratedPipeline(): Promise<{
  success: boolean;
  mce: { regime: RegimeSignatureType | null };
  ucm: { universeActive: UniverseActiveType | null };
  msf: { dayGate: DayGateType | null; marketFits: MarketFitType[] };
  errors: string[];
  executionTime: number;
}>;
```

## Phase 4: APIs & Automation (Week 4)

### Task 4.1: UCM APIs
**Durata**: 1 giorno
**Output**: API endpoints per UCM

```typescript
// File: app/api/universe/active/route.ts
export async function GET(): Promise<Response> // → UniverseActiveType

// File: app/api/universe/diff/route.ts
export async function GET(request: Request): Promise<Response> // → changes

// File: app/api/universe/pool/route.ts
export async function GET(): Promise<Response> // → UniversePoolType
export async function POST(request: Request): Promise<Response> // update pool
```

### Task 4.2: MSF APIs
**Durata**: 1 giorno
**Output**: API endpoints per MSF

```typescript
// File: app/api/msf/top/route.ts
export async function GET(request: Request): Promise<Response> // → MarketFitType[]

// File: app/api/msf/status/route.ts
export async function GET(): Promise<Response> // → DayGateType

// File: app/api/msf/symbol/[symbol]/route.ts
export async function GET(request: Request): Promise<Response> // → MarketFitType
```

### Task 4.3: GitHub Actions Integration
**Durata**: 1 giorno
**Output**: Automazione UCM/MSF

```yaml
# File: .github/workflows/ucm-msf-pipeline.yml
name: UCM + MSF Pipeline

on:
  schedule:
    # Run every 5 minutes (same as MCE)
    - cron: '*/5 * * * *'
  workflow_dispatch:

jobs:
  pipeline:
    runs-on: ubuntu-latest
    steps:
      - name: Run Integrated Pipeline
        run: node scripts/integrated-pipeline.mjs
```

### Task 4.4: Monitoring & Health Checks
**Durata**: 1 giorno
**Output**: Sistema di monitoraggio

```typescript
// File: lib/monitoring/ucm-msf.ts
export function validateUCMHealth(universeActive: UniverseActiveType): HealthCheck;
export function validateMSFHealth(dayGate: DayGateType, marketFits: MarketFitType[]): HealthCheck;
export function checkKPICompliance(historicalData: any[]): KPIReport;
```

## Phase 5: Testing & Validation (Week 5)

### Task 5.1: Unit Tests
**Durata**: 2 giorni
**Output**: Test coverage per UCM/MSF

### Task 5.2: Integration Tests
**Durata**: 1 giorno
**Output**: Test pipeline completa

### Task 5.3: KPI Validation
**Durata**: 2 giorni
**Output**: Validazione criteri "anti-fuffa"

## Deliverables

### Week 1 (UCM Foundation)
- ✅ Database schema UCM
- ✅ TypeScript types & schemas
- ✅ Core UCM engine
- ✅ Database repository layer

### Week 2 (MSF Foundation)
- ✅ Database schema MSF
- ✅ TypeScript types & schemas
- ✅ Core MSF engine
- ✅ Database repository layer

### Week 3 (Integration)
- ✅ Data collection pipelines
- ✅ UCM pipeline
- ✅ MSF pipeline
- ✅ Integrated MCE → UCM → MSF pipeline

### Week 4 (APIs & Automation)
- ✅ UCM API endpoints
- ✅ MSF API endpoints
- ✅ GitHub Actions automation
- ✅ Monitoring & health checks

### Week 5 (Testing & Validation)
- ✅ Comprehensive test suite
- ✅ KPI validation against "anti-fuffa" criteria
- ✅ Production deployment ready

## Success Criteria

1. **Pipeline Stability**: MCE → UCM → MSF runs every 5 minutes without errors
2. **API Performance**: All endpoints respond < 200ms
3. **KPI Compliance**: Meets all "anti-fuffa" criteria over 10-day validation period
4. **Free Tier**: $0/mese cost, uses only Vercel + Supabase + GitHub Actions
5. **Deterministic**: All outputs have canonical hashes for replay capability

## File Structure

```
/lib/ucm/
  schemas.ts
  config.ts
  engine/
    ranking.ts
    eligibility.ts
    hysteresis.ts
    universe.ts
  db/
    repo.ts
  pipeline/
    collect.ts
    runOnce.ts

/lib/msf/
  schemas.ts
  config.ts
  engine/
    liquidity.ts
    friction.ts
    playbooks.ts
    fit.ts
    daygate.ts
  db/
    repo.ts
  pipeline/
    collect.ts
    runOnce.ts

/lib/pipeline/
  integrated.ts

/app/api/universe/
  active/route.ts
  diff/route.ts
  pool/route.ts

/app/api/msf/
  top/route.ts
  status/route.ts
  symbol/[symbol]/route.ts

/supabase/migrations/
  006_ucm_schema.sql
  007_msf_schema.sql

/scripts/
  integrated-pipeline.mjs
  ucm-test.mjs
  msf-test.mjs
```