# UCM + MSF v1 - Implementation Tasks (REVISED)

## Overview

Implementazione **incrementale** di UCM e MSF seguendo approccio pragmatico:
1. **UCM Phase 1 ONLY** - Universe stabile
2. **Dashboard Read-Only** - Fiducia nel sistema  
3. **MSF + DayGate** - Solo dopo validazione UCM

**Principio**: Non toccare MSF finché UCM non è solido e stabile.

## 🎯 STEP 1: UCM Phase 1 ONLY (Week 1-2)

### Obiettivo
Vedere l'universo muoversi **poco ma bene**. Focus su:
- Eligibility calculation
- Hysteresis anti-flip
- Universe_active stabile
- Niente MSF ancora

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

-- RLS policies
ALTER TABLE universe_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE universe_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE universe_active ENABLE ROW LEVEL SECURITY;
ALTER TABLE eligibility_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access" ON universe_pool FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON universe_state FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON universe_active FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON eligibility_snapshots FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Service role full access" ON universe_pool FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON universe_state FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON universe_active FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON eligibility_snapshots FOR ALL USING (auth.role() = 'service_role');
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

// Validation helpers
export function validateUniversePool(data: unknown): data is UniversePoolType {
  try {
    UniversePoolSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function validateUniverseActive(data: unknown): data is UniverseActiveType {
  try {
    UniverseActiveSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}
```

### Task 1.3: UCM Configuration
**Durata**: 0.5 giorni
**Output**: Configurazione parametri UCM (CONGELATI)

```typescript
// File: lib/ucm/config.ts
export const UCM_CONFIG = {
  // Universe sizing
  TARGET: 20,
  MIN_ACTIVE: 12,
  MAX_ACTIVE: 25,
  
  // Hysteresis timing (minutes)
  ENTER_CONFIRM_MINUTES: 10,
  EXIT_CONFIRM_MINUTES: 20,
  
  // Cooldown and blacklist (minutes/days)
  COOLDOWN_MINUTES: 60,
  BLACKLIST_DAYS: 7,
  
  // Hard thresholds (CONGELATI per v1)
  SPREAD_ENTER_MAX: 15, // bps - da calibrare con dati reali
  SPREAD_HARD_MAX: 50,  // bps - blacklist threshold
  ATR_MIN: 0.001,       // minimum ATR for eligibility
  
  // Ranking weights (CONGELATI)
  RANKING_WEIGHTS: {
    volume: 0.55,
    friction: 0.25,
    quality: 0.20,
  },
  
  // Default universe pool (starter set)
  DEFAULT_POOL: {
    coreSymbols: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"],
    symbols: [
      // Major pairs
      "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT",
      "ADAUSDT", "DOTUSDT", "LINKUSDT", "LTCUSDT", "BCHUSDT",
      // Mid-cap
      "AVAXUSDT", "MATICUSDT", "ATOMUSDT", "NEARUSDT", "FTMUSDT",
      "ALGOUSDT", "VETUSDT", "ICPUSDT", "FILUSDT", "TRXUSDT",
      // Additional for pool diversity
      "UNIUSDT", "AAVEUSDT", "SUSHIUSDT", "COMPUSDT", "MKRUSDT",
    ],
  },
} as const;

// Type for config
export type UCMConfig = typeof UCM_CONFIG;
```

### Task 1.4: UCM Core Engine
**Durata**: 2 giorni
**Output**: Logica principale UCM

```typescript
// File: lib/ucm/engine/ranking.ts
import { EligibilitySnapshotType } from "../schemas";
import { UCM_CONFIG } from "../config";

export function calculateRankingScore(snapshot: EligibilitySnapshotType): number {
  // Normalize volume (0-100)
  const volScore = normalizeVolume(snapshot.volQuote_24h);
  
  // Calculate friction score (0-100, higher = worse)
  const frictionScore = calculateFrictionScore(snapshot);
  
  // Calculate quality score (0-100)
  const qualityScore = calculateQualityScore(snapshot);
  
  // Weighted combination
  const rankScore = 
    UCM_CONFIG.RANKING_WEIGHTS.volume * volScore +
    UCM_CONFIG.RANKING_WEIGHTS.friction * (100 - frictionScore) +
    UCM_CONFIG.RANKING_WEIGHTS.quality * qualityScore;
  
  return Math.max(0, Math.min(100, rankScore));
}

function calculateFrictionScore(snapshot: EligibilitySnapshotType): number {
  // Base spread penalty
  const spreadPenalty = Math.min(100, snapshot.spreadBps * 2);
  
  // ATR percentile adjustment (high percentile = more volatile = higher friction)
  const volatilityPenalty = snapshot.atrPercentile_1m * 0.3;
  
  return Math.min(100, spreadPenalty + volatilityPenalty);
}

function calculateQualityScore(snapshot: EligibilitySnapshotType): number {
  if (snapshot.gaps_60m > 0) return 0;
  if (snapshot.completeness_60m < 0.99) return snapshot.completeness_60m * 50;
  return 100;
}

function normalizeVolume(volume: number): number {
  // Simple log normalization - da calibrare con dati reali
  const logVol = Math.log10(Math.max(1, volume));
  return Math.min(100, Math.max(0, (logVol - 6) * 25)); // Assume 1M = baseline
}
```

```typescript
// File: lib/ucm/engine/eligibility.ts
import { EligibilitySnapshotType } from "../schemas";
import { UCM_CONFIG } from "../config";

export function isEligible(snapshot: EligibilitySnapshotType): boolean {
  // Hard requirements
  if (snapshot.spreadBps > UCM_CONFIG.SPREAD_ENTER_MAX) return false;
  if (snapshot.completeness_60m < 0.99) return false;
  if (snapshot.gaps_60m > 0) return false;
  if (snapshot.atr14_1m < UCM_CONFIG.ATR_MIN) return false;
  
  return true;
}

export function shouldBlacklist(snapshot: EligibilitySnapshotType): boolean {
  // Hard disqualification criteria
  if (snapshot.completeness_60m < 0.98) return true;
  if (snapshot.gaps_60m > 0) return true;
  if (snapshot.spreadBps > UCM_CONFIG.SPREAD_HARD_MAX) return true;
  
  return false;
}
```

```typescript
// File: lib/ucm/engine/hysteresis.ts
import { EligibilitySnapshotType } from "../schemas";
import { UCM_CONFIG } from "../config";

export function checkEnterHysteresis(
  symbol: string, 
  history: EligibilitySnapshotType[]
): boolean {
  const confirmMinutes = UCM_CONFIG.ENTER_CONFIRM_MINUTES;
  const requiredSnapshots = Math.ceil(confirmMinutes / 5); // Assuming 5min intervals
  
  if (history.length < requiredSnapshots) return false;
  
  // Check last N snapshots are all eligible
  const recentHistory = history.slice(-requiredSnapshots);
  return recentHistory.every(snapshot => isEligible(snapshot));
}

export function checkExitHysteresis(
  symbol: string,
  history: EligibilitySnapshotType[]
): boolean {
  const confirmMinutes = UCM_CONFIG.EXIT_CONFIRM_MINUTES;
  const requiredSnapshots = Math.ceil(confirmMinutes / 5);
  
  if (history.length < requiredSnapshots) return false;
  
  // Check last N snapshots are all non-eligible
  const recentHistory = history.slice(-requiredSnapshots);
  return recentHistory.every(snapshot => !isEligible(snapshot));
}
```

### Task 1.5: UCM Database Layer
**Durata**: 1 giorno
**Output**: Repository pattern per UCM

```typescript
// File: lib/ucm/db/repo.ts
import { supabaseAdmin } from "../../mce/db/supabase";
import { 
  UniversePoolType, 
  UniverseStateType, 
  UniverseActiveType, 
  EligibilitySnapshotType 
} from "../schemas";

export class UCMRepository {
  async getUniversePool(): Promise<UniversePoolType | null> {
    const { data, error } = await supabaseAdmin
      .from('universe_pool')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) return null;
    
    return {
      v: "ucm.pool.v1",
      asOf: data.as_of,
      symbols: data.symbols,
      coreSymbols: data.core_symbols,
      hash: data.hash,
    };
  }
  
  async updateUniversePool(pool: UniversePoolType): Promise<void> {
    const { error } = await supabaseAdmin
      .from('universe_pool')
      .insert({
        version: pool.v,
        as_of: pool.asOf,
        symbols: pool.symbols,
        core_symbols: pool.coreSymbols,
        hash: pool.hash,
      });
    
    if (error) throw new Error(`Failed to update universe pool: ${error.message}`);
  }
  
  async getUniverseStates(): Promise<UniverseStateType[]> {
    const { data, error } = await supabaseAdmin
      .from('universe_state')
      .select('*');
    
    if (error) throw new Error(`Failed to get universe states: ${error.message}`);
    
    return data.map(row => ({
      symbol: row.symbol,
      status: row.status,
      enteredAt: row.entered_at,
      exitedAt: row.exited_at,
      cooldownUntil: row.cooldown_until,
      blacklistUntil: row.blacklist_until,
    }));
  }
  
  async updateUniverseState(state: UniverseStateType): Promise<void> {
    const { error } = await supabaseAdmin
      .from('universe_state')
      .upsert({
        symbol: state.symbol,
        status: state.status,
        entered_at: state.enteredAt,
        exited_at: state.exitedAt,
        cooldown_until: state.cooldownUntil,
        blacklist_until: state.blacklistUntil,
      });
    
    if (error) throw new Error(`Failed to update universe state: ${error.message}`);
  }
  
  async getLatestUniverseActive(): Promise<UniverseActiveType | null> {
    const { data, error } = await supabaseAdmin
      .from('universe_active')
      .select('*')
      .order('as_of', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) return null;
    
    return {
      v: "ucm.active.v1",
      asOf: data.as_of,
      target: data.target_count,
      min: data.min_count,
      max: data.max_count,
      symbols: data.symbols,
      coreIncluded: data.core_included,
      meta: data.meta,
      basedOn: data.based_on,
      hash: data.hash,
    };
  }
  
  async saveUniverseActive(active: UniverseActiveType): Promise<void> {
    const { error } = await supabaseAdmin
      .from('universe_active')
      .insert({
        as_of: active.asOf,
        version: active.v,
        target_count: active.target,
        min_count: active.min,
        max_count: active.max,
        symbols: active.symbols,
        core_included: active.coreIncluded,
        meta: active.meta,
        based_on: active.basedOn,
        hash: active.hash,
      });
    
    if (error) throw new Error(`Failed to save universe active: ${error.message}`);
  }
  
  async saveEligibilitySnapshots(snapshots: EligibilitySnapshotType[]): Promise<void> {
    const rows = snapshots.map(snapshot => ({
      symbol: snapshot.symbol,
      as_of: snapshot.asOf,
      vol_quote_24h: snapshot.volQuote_24h,
      spread_bps: snapshot.spreadBps,
      completeness_60m: snapshot.completeness_60m,
      gaps_60m: snapshot.gaps_60m,
      atr14_1m: snapshot.atr14_1m,
      atr_percentile_1m: snapshot.atrPercentile_1m,
    }));
    
    const { error } = await supabaseAdmin
      .from('eligibility_snapshots')
      .upsert(rows);
    
    if (error) throw new Error(`Failed to save eligibility snapshots: ${error.message}`);
  }
  
  async getEligibilityHistory(symbol: string, minutes: number): Promise<EligibilitySnapshotType[]> {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    
    const { data, error } = await supabaseAdmin
      .from('eligibility_snapshots')
      .select('*')
      .eq('symbol', symbol)
      .gte('as_of', cutoff)
      .order('as_of', { ascending: true });
    
    if (error) throw new Error(`Failed to get eligibility history: ${error.message}`);
    
    return data.map(row => ({
      symbol: row.symbol,
      asOf: row.as_of,
      volQuote_24h: row.vol_quote_24h,
      spreadBps: row.spread_bps,
      completeness_60m: row.completeness_60m,
      gaps_60m: row.gaps_60m,
      atr14_1m: row.atr14_1m,
      atrPercentile_1m: row.atr_percentile_1m,
    }));
  }
}
```

### Task 1.6: UCM Pipeline
**Durata**: 1 giorno
**Output**: Pipeline completa UCM

```typescript
// File: lib/ucm/pipeline/runOnce.ts
import { UCMRepository } from "../db/repo";
import { generateUniverseActive } from "../engine/universe";
import { collectEligibilitySnapshots } from "./collect";
import { UCM_CONFIG } from "../config";

export interface UCMPipelineResult {
  success: boolean;
  universeActive: UniverseActiveType | null;
  errors: string[];
  stats: {
    eligibleCount: number;
    activeCount: number;
    blacklistedCount: number;
    addedCount: number;
    removedCount: number;
    executionTime: number;
  };
}

export async function runUCMPipeline(): Promise<UCMPipelineResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const repo = new UCMRepository();
  
  try {
    // 1. Get current universe pool
    let pool = await repo.getUniversePool();
    if (!pool) {
      // Initialize with default pool
      pool = await initializeDefaultPool(repo);
    }
    
    // 2. Collect eligibility snapshots
    const snapshots = await collectEligibilitySnapshots(pool.symbols);
    await repo.saveEligibilitySnapshots(snapshots);
    
    // 3. Get current states
    const states = await repo.getUniverseStates();
    
    // 4. Get previous active universe
    const prevActive = await repo.getLatestUniverseActive();
    
    // 5. Generate new universe active
    const universeActive = await generateUniverseActive(
      pool,
      snapshots,
      states,
      prevActive
    );
    
    // 6. Save new universe active
    await repo.saveUniverseActive(universeActive);
    
    // 7. Calculate stats
    const stats = {
      eligibleCount: snapshots.filter(s => isEligible(s)).length,
      activeCount: universeActive.symbols.length,
      blacklistedCount: universeActive.meta.blacklisted.length,
      addedCount: universeActive.meta.added.length,
      removedCount: universeActive.meta.removed.length,
      executionTime: Date.now() - startTime,
    };
    
    return {
      success: true,
      universeActive,
      errors,
      stats,
    };
    
  } catch (error) {
    errors.push(`UCM pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    return {
      success: false,
      universeActive: null,
      errors,
      stats: {
        eligibleCount: 0,
        activeCount: 0,
        blacklistedCount: 0,
        addedCount: 0,
        removedCount: 0,
        executionTime: Date.now() - startTime,
      },
    };
  }
}

async function initializeDefaultPool(repo: UCMRepository): Promise<UniversePoolType> {
  const pool: UniversePoolType = {
    v: "ucm.pool.v1",
    asOf: Date.now(),
    symbols: UCM_CONFIG.DEFAULT_POOL.symbols,
    coreSymbols: UCM_CONFIG.DEFAULT_POOL.coreSymbols,
    hash: generatePoolHash(UCM_CONFIG.DEFAULT_POOL.symbols, UCM_CONFIG.DEFAULT_POOL.coreSymbols),
  };
  
  await repo.updateUniversePool(pool);
  return pool;
}
```

### Task 1.7: UCM API
**Durata**: 0.5 giorni
**Output**: API endpoint per UCM

```typescript
// File: app/api/universe/active/route.ts
import { NextResponse } from "next/server";
import { UCMRepository } from "../../../../lib/ucm/db/repo";

export async function GET() {
  try {
    const repo = new UCMRepository();
    const universeActive = await repo.getLatestUniverseActive();
    
    if (!universeActive) {
      return NextResponse.json(
        { ok: false, error: "No universe active found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      ok: true,
      data: universeActive,
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
```

## 🎯 STEP 1 Success Criteria

### Deliverables Checklist
- ✅ Database schema UCM deployed
- ✅ TypeScript types & schemas complete
- ✅ Core UCM engine implemented
- ✅ Database repository layer working
- ✅ UCM pipeline functional
- ✅ API endpoint responding

### KPI Targets (Week 1-2)
- **Turnover Rate**: <= 0.2 per hour (2-4 simboli su 20)
- **Core Symbols Uptime**: > 95%
- **Pipeline Success Rate**: > 95%
- **API Response Time**: < 200ms

### Validation Tests
```bash
# Test UCM pipeline
node scripts/ucm-test.mjs

# Test API endpoint
curl https://tradelia.ai/api/universe/active

# Monitor turnover
# Check universe changes over 24h period
```

## 🚫 What NOT to Implement in Step 1

- ❌ MSF database schema
- ❌ Market fit calculation
- ❌ Day gate logic
- ❌ MSF APIs
- ❌ Dashboard UI (except basic read-only)

**Focus**: Solo UCM. Niente MSF finché UCM non è stabile.

## Next Steps After Step 1

Solo dopo aver validato che:
1. Universe si muove poco ma bene
2. Turnover è sotto controllo
3. Hysteresis funziona
4. Core symbols sono stabili

Allora procediamo con:
- Step 2: Dashboard read-only
- Step 3: MSF + DayGate

**Principio**: Costruire fiducia step-by-step, non tutto insieme.

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