# MCE + Dashboard Intraday - Implementation Tasks

## Overview

Sviluppo integrato del Market Context Engine e Dashboard Intraday con approccio "vertical slice". Ogni step produce qualcosa che gira davvero, seguendo il piano di ChatGPT per arrivare velocemente al Checkpoint 1 (Day 7) senza magie.

## Vertical Slice Objective (End of Phase 1)

Entro fine Phase 1 vuoi già poter:
- Fetchare klines BTCUSDT 1m (e 5m/15m/1h/4h)
- Validarli (Zod)
- Salvarli in Supabase (upsert)
- Calcolare features minime (ATR14 + EMA trend)
- Generare una RegimeSignature v1
- Scriverla in regime_signatures
- Avere una API GET /api/regime/current che torna l'ultima signature

Questo sblocca tutto il resto (SSE, UI, history).

## File Tree Structure

```
/lib/mce/
  types.ts
  schemas.ts
  utils/
    time.ts
    math.ts
  binance/
    client.ts
    endpoints.ts
    normalize.ts
  db/
    supabase.ts
    repo.marketData.ts
    repo.regimes.ts
    repo.health.ts
  features/
    atr.ts
    ema.ts
    volatility.ts
    volume.ts
    index.ts
  engine/
    classify.ts
    signature.ts
    smoothing.ts
    quality.ts
  pipeline/
    ingest.ts
    compute.ts
    runOnce.ts

/app/api/
  ingest/route.ts          (opzionale admin)
  regime/current/route.ts
  regime/history/route.ts
  sse/regime/route.ts

/scripts/
  mce-run-once.mjs

/.github/workflows/
  mce-ingest.yml
```

## Tasks

### Phase 1: Foundation & Data Models (Days 1-3)

- [x] 1. Setup project structure and core TypeScript types
  - Create `/lib/mce/` module structure
  - Define canonical TypeScript interfaces (Symbol, TF, Kline, FeatureVector, RegimeSignature)
  - Setup Zod schemas for data validation (KlineSchema, RegimeSignatureSchema)
  - Create deterministic types with proper constraints
  - _Requirements: 1.1, 1.7, 3.6_

- [x] 2. Create Supabase database schema and integration
  - Create DDL for market_data, regime_signatures, system_health tables
  - Add proper time-series indexing (symbol, tf, open_time DESC)
  - Setup RLS policies (read public, write service role only)
  - Create Supabase admin client and repository layer
  - _Requirements: 3.6, 10.2, 10.6_

- [x] 3. Implement Binance REST client with rate limiting
  - Create BinanceClient class with throttling (8 RPS conservative)
  - Implement klines endpoint with proper error handling
  - Add data normalization and Zod validation
  - Handle API rate limits and timeouts gracefully
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

### Phase 2: Core MCE Engine (Days 4-7)

- [x] 4. Implement feature calculation engine (minimal viable)
  - Create ATR calculation (14, 50 periods) - True Range with prev close
  - Implement EMA calculation (20, 50 periods) for trend detection
  - Add trend strength calculation (EMA distance normalized by ATR)
  - Create scale-invariant feature normalization
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 5. Build rule-based regime classification logic
  - Implement trend classification (up/down/range based on EMA + strength)
  - Add volatility classification (compressed/normal/expanded via ATR percentiles)
  - Create confidence scoring (trend strength + data quality)
  - Add anti-flip smoothing (hysteresis/streak counting)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 6. Create RegimeSignature generation with canonical hash
  - Implement data quality calculation (gaps, freshness, completeness)
  - Build canonical JSON serialization (stable key order, 6 decimal precision)
  - Add SHA-256 hash for determinism validation
  - Create regime change detection and persistence
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 1.7_

- [x] 7. Create pipeline runner and GitHub Actions workflow
  - Build `scripts/mce-run-once.mjs` for complete pipeline execution
  - Create GitHub Actions workflow with 1-minute cron schedule
  - Add error handling, retry logic, and gap detection
  - Implement system health monitoring and logging
  - _Requirements: 1.4, 6.1, 6.2, 8.4, 8.6_

### Phase 3: Real-time API & SSE (Days 8-10)

- [x] 8. Build core API endpoints
  - Create GET /api/regime/current (latest RegimeSignature)
  - Implement GET /api/regime/history (time range queries)
  - Add proper error handling and rate limiting
  - Create admin ingest endpoint (optional)
  - _Requirements: 6.3, 7.2, 10.4_

- [x] 9. Implement Server-Sent Events for real-time updates
  - Create SSE endpoint with DB polling (2-3 second intervals)
  - Add connection management and graceful reconnection
  - Implement update queuing during disconnections
  - Add connection status monitoring
  - _Requirements: 6.4, 6.5, 6.6, 6.7_

- [ ] 10. Add system reliability and monitoring
  - Implement health checks and system status API
  - Add automatic recovery from transient failures
  - Create error logging with proper context
  - Add graceful degradation for API outages
  - _Requirements: 8.3, 8.4, 8.5, 8.7_

### Phase 4: Dashboard Interface (Days 11-14)

- [ ] 11. Create dashboard layout and real-time connection
  - Build responsive dashboard layout with navigation
  - Implement useRegimeSSE hook for real-time updates
  - Add connection status indicator and error boundaries
  - Create loading states and graceful degradation
  - _Requirements: 2.1, 2.7, 6.4_

- [ ] 12. Build regime display components
  - Create RegimeStatusCard (trend/volatility/confidence display)
  - Add data quality indicators with visual feedback
  - Implement regime change alerts and notifications
  - Add color-coded regime indicators
  - _Requirements: 2.1, 2.2, 2.5_

- [ ] 13. Implement price chart with regime overlays
  - Integrate lightweight charting library (Chart.js or similar)
  - Display BTCUSDT price with regime background colors
  - Add regime change markers on timeline
  - Implement multiple timeframe switching
  - _Requirements: 2.4, 2.3_

- [ ] 14. Add metrics and analytics panels
  - Display key indicators (ATR, volatility percentiles, EMA values)
  - Show regime statistics (duration, frequency, confidence trends)
  - Add system health dashboard with data quality metrics
  - Create performance monitoring display
  - _Requirements: 2.6, 7.4, 8.4_

### Phase 5: Historical Analysis & Export (Days 15-17)

- [ ] 15. Build regime timeline and history views
  - Create interactive timeline (24h, 7d, 30d views)
  - Add regime duration and frequency statistics
  - Implement regime performance analysis
  - Add historical regime pattern visualization
  - _Requirements: 7.1, 7.3, 7.4, 7.5_

- [ ] 16. Implement data export and reporting
  - Add CSV export for historical regime data
  - Create regime performance reports
  - Build data quality assessment reports
  - Add system performance analytics export
  - _Requirements: 7.6, 8.4_

### Phase 6: Performance & Free Tier Optimization (Days 18-21)

- [ ] 17. Optimize for free tier constraints
  - Implement feature calculation caching
  - Optimize database queries and indexing
  - Add efficient batch processing for GitHub Actions
  - Monitor and optimize resource usage
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 18. Add comprehensive monitoring and alerting
  - Implement cost monitoring for all services
  - Add performance metrics collection
  - Create automated alerting for system degradation
  - Add resource usage tracking and limits
  - _Requirements: 8.4, 8.5, 9.6, 8.7_

### Phase 7: Security & Production Readiness (Days 22-24)

- [ ] 19. Implement security measures
  - Setup secure environment variable management
  - Add API key rotation support
  - Implement input validation and sanitization
  - Create security event logging
  - _Requirements: 10.1, 10.3, 10.5, 10.7_

- [ ] 20. Add configuration management
  - Create dynamic configuration system
  - Implement feature flags for gradual rollout
  - Add configuration validation and change logging
  - Setup deployment configuration management
  - _Requirements: 10.6, 9.7_

### Phase 8: Final Integration & Validation (Days 25-28)

- [ ] 21. End-to-end integration testing
  - Test complete data flow: Binance → GitHub Actions → Supabase → API → Dashboard
  - Validate regime classification accuracy and consistency
  - Test all error handling and recovery scenarios
  - Verify real-time update mechanisms
  - _Requirements: All requirements integration_

- [ ] 22. Performance validation and free tier compliance
  - Validate all performance targets (5s update latency, <2s dashboard load)
  - Test system under various load conditions
  - Verify free tier resource usage stays within limits
  - Optimize any performance bottlenecks
  - _Requirements: 8.1, 8.2, 9.1-9.7_

- [ ] 23. 7-day continuous operation test
  - Deploy complete system for 7-day validation period
  - Monitor all KPIs and performance metrics continuously
  - Validate regime classification consistency over time
  - Document any issues, resolutions, and system behavior
  - _Requirements: Final validation protocol_

## Checkpoint Tasks

- [ ] **Checkpoint 1 (Day 7): MCE Engine Operational**
  - `scripts/mce-run-once.mjs` runs locally and on GitHub Actions
  - `market_data` table populated with BTCUSDT klines
  - `regime_signatures` table populated with valid signatures
  - GET `/api/regime/current` returns valid RegimeSignature (Zod validated)
  - Regime classification is coherent and stable (anti-flip working)

- [ ] **Checkpoint 2 (Day 14): Dashboard Real-time**
  - Dashboard page displays current regime + connection status
  - SSE updates dashboard without manual refresh
  - Basic 24h timeline showing regime changes
  - All components handle connection failures gracefully

- [ ] **Checkpoint 3 (Day 21): Full System Operational**
  - Historical analysis and export functionality working
  - Performance targets met consistently
  - Free tier resource usage within limits
  - System handles various failure scenarios

- [ ] **Final Checkpoint (Day 28): Production Ready**
  - 7-day continuous operation completed successfully
  - All KPIs and performance metrics validated
  - System ready for real-world usage

## Success Criteria

The integrated system is complete when:
- ✅ Real-time BTCUSDT regime classification updating every minute
- ✅ Dashboard displaying and updating with regime data automatically
- ✅ Historical analysis, timeline, and export functionality working
- ✅ All performance targets met consistently (5s update, <2s load time)
- ✅ 7-day continuous operation successful with >99.5% uptime
- ✅ Free tier resource usage within all service limits

## Implementation Priority (Exact Order)

**Phase 1 Critical Path (Days 1-7):**
1. DDL + Supabase admin client (1h)
2. Binance client + normalize + Zod validation (2-3h)
3. Upsert market_data repository (1h)
4. Compute features (ATR/EMA) minimal viable (2h)
5. RegimeSignature + canonical hash + insert regime_signatures (2h)
6. Script runOnce + GitHub Action schedule (2h)
7. API `/regime/current` endpoint (30m)
8. Dashboard MVP + SSE/polling fallback (3-5h)

**Free Tier Reality Check:**
- GitHub Actions cron 1m: OK for MVP, but not guaranteed to the second. Must have gap handling.
- Vercel free: SSE keeps connections open - works but watch limits. Fallback: client polling every 10-15s.
- Supabase free: Time-series OK if properly indexed and writing only BTCUSDT + 5 timeframes.

## Technology Implementation Notes

### Data Flow Architecture
```
Binance API → GitHub Actions → Supabase → Vercel API → Dashboard
     ↓              ↓             ↓           ↓           ↓
  Raw Data → Normalized Data → Features → Regime → Real-time UI
```

### Real-time Update Strategy
- **GitHub Actions**: Fetch data every minute via cron schedule
- **Supabase**: Store regime signatures with proper time-series indexing
- **Server-Sent Events**: Push updates to dashboard (with polling fallback)
- **Client**: Update UI components without page refresh

### Free Tier Optimization Strategy
- **Batch API calls** to minimize Binance requests (fetch multiple timeframes at once)
- **Cache calculations** to reduce compute (store intermediate results)
- **Optimize database queries** for performance (proper indexing, limit results)
- **Use efficient data structures** and algorithms (avoid O(n²) operations)

### Deterministic Implementation Requirements
- **Canonical JSON**: Stable key ordering, 6 decimal precision for floats
- **SHA-256 hashing**: For regime signature determinism validation
- **Scale-invariant features**: ATR normalization, percentage-based calculations
- **No-lookahead validation**: Ensure all calculations use only past data

## Notes

- Each task builds incrementally on previous tasks
- System remains functional and testable after each checkpoint
- Real-time validation ensures immediate feedback on implementation
- Free tier constraints guide all implementation decisions
- Focus on practical functionality over theoretical perfection
- Determinism and scientific rigor maintained throughout