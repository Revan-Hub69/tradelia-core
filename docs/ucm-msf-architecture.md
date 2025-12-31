# UCM + MSF v1 Architecture

## System Overview

Universe Control Module (UCM) e Market Selection & Fit Engine (MSF) completano l'architettura di Tradelia AI creando un sistema completo di selezione e valutazione dei mercati.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     MCE     │───▶│     UCM     │───▶│     MSF     │───▶│  Dashboard  │
│   (Brick1)  │    │   (Brick2)  │    │   (Brick3)  │    │  Intraday   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                    │                    │                    │
      ▼                    ▼                    ▼                    ▼
 Regime Context      Universe Active      Market Fit         Trading UI
```

## Data Flow Architecture

### 1. MCE → UCM Flow
```
MCE RegimeSignature ──┐
                      ├──▶ UCM Engine ──▶ UniverseActive
Market Data (ATR) ────┘
```

### 2. UCM → MSF Flow
```
UniverseActive ───┐
                  ├──▶ MSF Engine ──▶ MarketFit[] + DayGate
MCE Regime ───────┘
```

### 3. Complete Pipeline
```
Binance API
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                    MCE Pipeline                             │
│  Klines → Features → Classification → RegimeSignature      │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                    UCM Pipeline                             │
│  Pool → Eligibility → Hysteresis → UniverseActive          │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                    MSF Pipeline                             │
│  Snapshots → Fit Calculation → MarketFit[] + DayGate       │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                  Dashboard APIs                             │
│  /api/regime/current + /api/msf/top + /api/universe/active  │
└─────────────────────────────────────────────────────────────┘
```

## UCM (Universe Control Module) Architecture

### Purpose
Mantenere un universo dinamico di ~20 simboli tradabili da un pool più ampio (~50-150), con regole anti-flip per stabilità.

### Core Components

#### 1. Universe Pool Management
```typescript
UniversePool {
  symbols: string[]        // 50-150 symbols
  coreSymbols: string[]   // Always included (BTCUSDT, ETHUSDT, etc.)
  hash: string            // Deterministic versioning
}
```

#### 2. Eligibility Engine
```typescript
EligibilitySnapshot {
  volQuote_24h: number    // Liquidity proxy
  spreadBps: number       // Friction proxy
  completeness_60m: number // Data quality
  gaps_60m: number        // Data gaps
  atr14_1m: number        // Volatility
  atrPercentile_1m: number // Relative volatility
}
```

#### 3. Hysteresis System
- **Enter Hysteresis**: 10 minutes consecutive eligibility
- **Exit Hysteresis**: 20 minutes consecutive non-eligibility
- **Cooldown**: 60 minutes after exit
- **Blacklist**: 7 days for hard failures

#### 4. Ranking Algorithm
```typescript
rankScore = 0.55 * norm(volQuote_24h)      // Volume weight
          + 0.25 * (100 - frictionScore)   // Friction penalty
          + 0.20 * norm(dataQualityScore)  // Quality bonus
```

### UCM State Machine

```
INACTIVE ──[eligible 10min]──▶ ACTIVE
    ▲                             │
    │                             │
    └──[cooldown 60min]──[non-eligible 20min]
    
ACTIVE ──[hard_fail]──▶ BLACKLISTED
                           │
                           └──[7 days]──▶ INACTIVE
```

## MSF (Market Selection & Fit Engine) Architecture

### Purpose
Valutare la "tradabilità" di ogni simbolo nell'universo attivo e decidere se la giornata è tradabile.

### Core Components

#### 1. Liquidity Tier Classification
```typescript
T1: High volume + Low spread    // Premium symbols
T2: Medium volume + Medium spread // Standard symbols  
T3: Low volume + High spread    // Never class A
```

#### 2. Friction Score Calculation
```typescript
frictionScore = w1 * norm(spreadBps) +
                w2 * norm(ret1mAbs) +
                w3 * norm(spreadBps * atrPercentile_1m)
```

#### 3. Regime Compatibility Matrix
```
Regime State          │ Breakout │ Pullback │ MeanRevert
─────────────────────────────────────────────────────────
Trend≠range & vol=normal │   ✓    │    ✓     │     ✗
Trend=range & vol≠expanded│   ✗    │    ✗     │     ✓
vol=expanded             │   ✗    │    ✗     │     ✗
vol=expanded & T1 & conf≥0.75│ ✓*  │   ✓*     │     ✗

* = Only class B allowed
```

#### 4. Fit Score Calculation
```typescript
fitScore = 35% * liquidityQuality +
           35% * regimeCompatibilityScore +
           30% * (100 - frictionScore)

Classes:
A: ≥80 (Premium tradable)
B: 65-79 (Good tradable)  
C: 50-64 (Marginal)
NO_TRADE: <50 (Not tradable)
```

#### 5. Day Gate Logic
```typescript
tradableDay = (countA + countB >= 1)
```

## Database Schema

### UCM Tables
```sql
universe_pool (
  id, version, as_of, symbols, core_symbols, hash, created_at
)

universe_state (
  symbol, status, entered_at, exited_at, cooldown_until, 
  blacklist_until, updated_at
)

universe_active (
  id, as_of, version, target, min_count, max_count, symbols,
  core_included, meta, based_on, hash, created_at
)

eligibility_snapshots (
  symbol, as_of, vol_quote_24h, spread_bps, completeness_60m,
  gaps_60m, atr14_1m, atr_percentile_1m, created_at
)
```

### MSF Tables
```sql
market_fit (
  symbol, as_of, fit_score, fit_class, tradable_today,
  allowed_playbooks, liquidity_tier, friction_score,
  data_quality, reasons, based_on, hash, created_at
)

day_gate (
  as_of, tradable_day, count_a, count_b, based_on, hash, created_at
)
```

## API Architecture

### UCM APIs
```
GET /api/universe/active
├─ Returns: UniverseActive_v1
├─ Cache: 1 minute
└─ Usage: Dashboard universe display

GET /api/universe/diff?from=X&to=Y
├─ Returns: { added: [], removed: [], blacklisted: [] }
├─ Cache: 5 minutes
└─ Usage: Change tracking

POST /api/universe/pool (Admin only)
├─ Body: UniversePool_v1
├─ Auth: Required
└─ Usage: Manual pool updates
```

### MSF APIs
```
GET /api/msf/top?limit=10
├─ Returns: MarketFit_v1[]
├─ Cache: 1 minute
└─ Usage: Dashboard top symbols

GET /api/msf/status
├─ Returns: DayGate_v1
├─ Cache: 1 minute
└─ Usage: Tradable day indicator

GET /api/msf/symbol/{symbol}
├─ Returns: MarketFit_v1
├─ Cache: 1 minute
└─ Usage: Symbol detail view
```

## Automation Architecture

### GitHub Actions Pipeline
```yaml
Schedule: */5 * * * *  # Every 5 minutes

Jobs:
1. MCE Pipeline (existing)
   ├─ Fetch klines
   ├─ Calculate features
   ├─ Generate regime signature
   └─ Store in DB

2. UCM Pipeline (new)
   ├─ Collect eligibility snapshots
   ├─ Apply hysteresis rules
   ├─ Update universe active
   └─ Store results

3. MSF Pipeline (new)
   ├─ Collect universe snapshots
   ├─ Calculate market fits
   ├─ Generate day gate
   └─ Store results

4. Health Checks
   ├─ Validate pipeline success
   ├─ Check KPI compliance
   └─ Alert on failures
```

## Performance Characteristics

### Latency Targets
- **UCM Pipeline**: < 30 seconds
- **MSF Pipeline**: < 20 seconds
- **API Response**: < 200ms
- **Total Pipeline**: < 60 seconds

### Throughput
- **Symbols Processed**: 20-150 per run
- **Pipeline Frequency**: Every 5 minutes
- **API Requests**: 1000+ per hour supported

### Storage
- **UCM Data**: ~1MB per day
- **MSF Data**: ~2MB per day
- **Total Growth**: ~1GB per year
- **Supabase Free**: 500MB limit (sufficient for 6+ months)

## Error Handling & Resilience

### UCM Error Handling
```typescript
// Graceful degradation
if (eligibilityDataIncomplete) {
  // Use previous universe active
  // Log warning
  // Continue with reduced confidence
}

if (hardDataFailure) {
  // Blacklist affected symbols
  // Maintain core symbols
  // Alert operators
}
```

### MSF Error Handling
```typescript
// Conservative approach
if (regimeDataMissing) {
  // Set all symbols to NO_TRADE
  // Set tradableDay = false
  // Preserve capital
}

if (partialDataFailure) {
  // Exclude affected symbols
  // Continue with available data
  // Lower confidence scores
}
```

### Pipeline Resilience
- **Retry Logic**: 3 attempts with exponential backoff
- **Circuit Breaker**: Stop pipeline if >50% symbols fail
- **Fallback Data**: Use cached data up to 15 minutes old
- **Health Monitoring**: Continuous validation of KPIs

## KPI Monitoring

### "Anti-Fuffa" Metrics
```typescript
// Stability metrics
turnoverRate = (added + removed) / totalActive  // Target: <0.2 per hour
flipRate = regimeChanges / totalUpdates         // Target: <0.1 per hour

// Quality metrics
blacklistEffectiveness = gappedSymbolsBlacklisted / totalGappedSymbols  // Target: >0.9
falsePositiveRate = classAFailures / totalClassA                       // Target: <0.1

// Market selectivity
noTradeDays = daysWithTradableDay_false / totalDays    // Target: 0.2-0.4
classASymbols = avgClassACount / totalActive           // Target: <0.15
```

### Alerting Thresholds
- **Critical**: Pipeline failure, API downtime
- **Warning**: KPI deviation >20%, high error rate
- **Info**: Normal operations, successful updates

## Security & Access Control

### API Security
- **Rate Limiting**: 100 requests/minute per IP
- **Authentication**: Admin endpoints require JWT
- **CORS**: Restricted to tradelia.ai domain
- **Input Validation**: All inputs validated with Zod

### Data Security
- **RLS Policies**: Row-level security on all tables
- **Audit Trail**: All changes logged with timestamps
- **Backup Strategy**: Daily Supabase backups
- **Access Logs**: All API calls logged

## Deployment Strategy

### Free Tier Architecture
```
Vercel (Frontend + APIs)
├─ Next.js app with API routes
├─ Edge functions for real-time data
└─ Static generation for documentation

GitHub Actions (Automation)
├─ Scheduled workflows every 5 minutes
├─ Error handling and retry logic
└─ Health monitoring and alerting

Supabase (Database + Auth)
├─ PostgreSQL with time-series optimization
├─ Row-level security policies
└─ Real-time subscriptions for UI updates
```

### Deployment Pipeline
1. **Development**: Local testing with test database
2. **Staging**: Preview deployments on Vercel
3. **Production**: Main branch auto-deploy
4. **Monitoring**: Real-time health checks

### Rollback Strategy
- **Database**: Migration rollback scripts
- **API**: Vercel instant rollback
- **Pipeline**: GitHub Actions workflow disable
- **Data**: Point-in-time recovery available

## Integration Points

### MCE Integration
- **Input**: RegimeSignature for MSF compatibility
- **Input**: Market data for UCM eligibility
- **Shared**: Database connection and schemas

### Dashboard Integration
- **APIs**: RESTful endpoints for all data
- **Real-time**: SSE for live updates
- **Caching**: Optimized for dashboard performance

### Future Extensions
- **Multi-asset**: Extend beyond crypto
- **ML Integration**: Enhanced ranking algorithms
- **Risk Management**: Position sizing integration
- **Backtesting**: Historical simulation capability

This architecture provides a robust, scalable foundation for the UCM + MSF system while maintaining the free-tier constraint and deterministic replay capability established by the MCE.