# Implementation Plan: Setup Engine Intraday v2 (With Funding & L2 Integration)

## Overview

This implementation plan adds three critical components to the Setup Engine:
1. **Funding Manager** - Capital tracking and position sizing
2. **L2 Imbalance Detector** - Order book analysis for setup signals
3. **Setup Trigger Engine** - Combining funding + L2 imbalance to generate setups

The plan follows an incremental approach, building each component independently before integration.

## Tasks

### Phase 1: Funding Manager (Days 1-2)

- [ ] 1.1 Create Funding Manager core implementation
  - Create `lib/setup/funding-manager.ts`
  - Implement FundingManager class with initialization
  - Implement capital allocation/release logic
  - Implement position tracking
  - Implement P&L calculation
  - _Requirements: Funding Management (US1)_

- [ ]* 1.2 Write property tests for Funding Manager
  - **Property 1: Funding Allocation Correctness**
  - **Validates: Funding Manager integrity**
  - Test: For any capital allocation, used + available = current
  - Test: No allocation exceeds available capital
  - Test: P&L calculations are accurate

- [ ] 1.3 Create Funding Manager API endpoints
  - Create `app/api/setup/funding/route.ts`
  - Implement GET /api/setup/funding (get current state)
  - Implement POST /api/setup/funding/allocate (allocate capital)
  - Implement POST /api/setup/funding/release (release capital)
  - Implement POST /api/setup/funding/trade (record trade)
  - _Requirements: Funding Management (US1)_

- [ ]* 1.4 Write unit tests for Funding Manager API
  - Test capital allocation endpoint
  - Test capital release endpoint
  - Test trade recording endpoint
  - Test state persistence

- [ ] 1.5 Checkpoint - Funding Manager complete
  - Ensure all tests pass
  - Verify capital calculations are accurate
  - Ask the user if questions arise

### Phase 2: L2 Imbalance Detector (Days 3-4)

- [ ] 2.1 Create L2 Imbalance Detector core implementation
  - Create `lib/setup/l2-imbalance-detector.ts`
  - Implement L2ImbalanceDetector class
  - Implement L2 book fetching from Binance
  - Implement imbalance calculation (top-of-book, depth 5/10/20)
  - Implement void detection
  - Implement microprice calculation
  - _Requirements: L2 Imbalance Detection (US2)_

- [ ]* 2.2 Write property tests for L2 Imbalance Detector
  - **Property 2: L2 Imbalance Bounds**
  - **Validates: L2 Imbalance Detector correctness**
  - Test: Imbalance ratios bounded between -1.0 and 1.0
  - Test: Strength scores bounded between 0.0 and 1.0
  - Test: Direction correctly identified (BULLISH/BEARISH/NEUTRAL)

- [ ] 2.3 Create L2 Imbalance Detector API endpoints
  - Create `app/api/setup/l2-imbalance/route.ts`
  - Implement GET /api/setup/l2-imbalance/:symbol (get current imbalance)
  - Implement GET /api/setup/l2-imbalance/:symbol/history (get imbalance history)
  - Implement POST /api/setup/l2-imbalance/analyze (analyze L2 book)
  - _Requirements: L2 Imbalance Detection (US2)_

- [ ]* 2.4 Write unit tests for L2 Imbalance Detector API
  - Test L2 book fetching
  - Test imbalance calculation
  - Test void detection
  - Test microprice calculation

- [ ] 2.5 Checkpoint - L2 Imbalance Detector complete
  - Ensure all tests pass
  - Verify imbalance calculations against Binance data
  - Ask the user if questions arise

### Phase 3: Setup Trigger Engine (Days 5-6)

- [ ] 3.1 Create Setup Trigger Engine core implementation
  - Create `lib/setup/setup-trigger-engine.ts`
  - Implement SetupTriggerEngine class
  - Implement trigger checking logic (imbalance + funding)
  - Implement confidence calculation
  - Implement position sizing logic
  - _Requirements: Setup Trigger Logic (US3)_

- [ ]* 3.2 Write property tests for Setup Trigger Engine
  - **Property 3: Setup Trigger Consistency**
  - **Validates: Setup Trigger Engine determinism**
  - Test: Identical inputs produce identical outputs
  - Test: Confidence scores are consistent
  - Test: Position sizing is deterministic

- [ ] 3.3 Write property tests for capital constraints
  - **Property 4: Capital Constraint Enforcement**
  - **Validates: Risk management enforcement**
  - Test: Required capital never exceeds available
  - Test: Position sizing respects max utilization
  - Test: Triggers blocked when capital insufficient

- [ ] 3.4 Create Setup Trigger Engine API endpoints
  - Create `app/api/setup/trigger/route.ts`
  - Implement POST /api/setup/trigger/check (check for triggers)
  - Implement GET /api/setup/trigger/history (get trigger history)
  - Implement POST /api/setup/trigger/validate (validate setup)
  - _Requirements: Setup Trigger Logic (US3)_

- [ ]* 3.5 Write unit tests for Setup Trigger Engine API
  - Test trigger checking with various market conditions
  - Test confidence calculation
  - Test position sizing
  - Test capital constraint enforcement

- [ ] 3.6 Checkpoint - Setup Trigger Engine complete
  - Ensure all tests pass
  - Verify triggers are generated correctly
  - Ask the user if questions arise

### Phase 4: Integration with Paper Execution (Days 7-8)

- [ ] 4.1 Integrate Setup Trigger Engine with Paper Execution
  - Update `lib/setup/paper-execution.ts`
  - Connect triggered setups to paper execution
  - Update funding after each trade
  - Track P&L and statistics
  - _Requirements: Paper Execution (US4)_

- [ ]* 4.2 Write integration tests for end-to-end flow
  - Test: Funding initialization
  - Test: L2 imbalance detection
  - Test: Setup trigger generation
  - Test: Paper execution
  - Test: Funding update after trade

- [ ] 4.3 Create end-to-end test script
  - Create `scripts/dev/test-setup-trigger-e2e.mjs`
  - Test complete flow: funding → L2 → trigger → execution
  - Verify P&L tracking
  - Verify capital updates
  - _Requirements: Paper Execution (US4)_

- [ ] 4.4 Create dashboard display components
  - Create `components/dashboard/setup-trigger/FundingStatus.tsx`
  - Create `components/dashboard/setup-trigger/L2ImbalanceChart.tsx`
  - Create `components/dashboard/setup-trigger/SetupTriggerList.tsx`
  - Display active setups and funding status
  - _Requirements: Dashboard integration_

- [ ]* 4.5 Write unit tests for dashboard components
  - Test funding status display
  - Test L2 imbalance visualization
  - Test setup trigger list rendering

- [ ] 4.6 Checkpoint - Integration complete
  - Ensure all tests pass
  - Verify end-to-end flow works
  - Ask the user if questions arise

### Phase 5: Performance Optimization & Hardening (Days 9-10)

- [ ] 5.1 Performance optimization
  - Profile Funding Manager operations
  - Profile L2 Imbalance Detector operations
  - Profile Setup Trigger Engine operations
  - Optimize hot paths
  - _Requirements: Real-time Performance (Req 16)_

- [ ] 5.2 Add circuit breakers and error handling
  - Add circuit breaker for L2 API failures
  - Add retry logic for Binance API
  - Add graceful degradation
  - _Requirements: Error Handling_

- [ ] 5.3 Add monitoring and alerting
  - Add performance metrics collection
  - Add error rate tracking
  - Add alerting for anomalies
  - _Requirements: Performance Monitoring (Req 11)_

- [ ]* 5.4 Write stress tests
  - Test with high-frequency market updates
  - Test with large number of positions
  - Test with extreme market conditions

- [ ] 5.5 Checkpoint - Performance & Hardening complete
  - Ensure all tests pass
  - Verify performance meets requirements
  - Ask the user if questions arise

### Phase 6: Production Deployment (Days 11-12)

- [ ] 6.1 Create production deployment guide
  - Document deployment steps
  - Document configuration requirements
  - Document monitoring setup
  - _Requirements: Production Readiness_

- [ ] 6.2 Deploy to staging environment
  - Deploy all components to staging
  - Run full test suite
  - Verify all endpoints work
  - _Requirements: Production Readiness_

- [ ] 6.3 Deploy to production
  - Deploy all components to production
  - Monitor for errors and anomalies
  - Verify live trading signals
  - _Requirements: Production Readiness_

- [ ] 6.4 Final checkpoint - System operational
  - Ensure all tests pass
  - Verify live trading signals
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end flows

## Success Criteria

1. **Funding Manager**
   - Zero over-allocation (never exceed available capital)
   - Accurate P&L tracking (within 0.01%)
   - Proper capital release after trades

2. **L2 Imbalance Detector**
   - Detect imbalances within 100ms
   - Accuracy: >85% (correctly identify direction)
   - False positive rate: <15%

3. **Setup Trigger Engine**
   - Trigger latency: <50ms
   - Confidence score accuracy: >80%
   - Capital constraint enforcement: 100%

4. **End-to-End Flow**
   - Complete flow latency: <200ms
   - Setup generation rate: 100+ per day
   - Capital utilization: 60-80% optimal range

## Timeline

- **Phase 1**: Days 1-2 (Funding Manager)
- **Phase 2**: Days 3-4 (L2 Imbalance Detector)
- **Phase 3**: Days 5-6 (Setup Trigger Engine)
- **Phase 4**: Days 7-8 (Integration)
- **Phase 5**: Days 9-10 (Performance & Hardening)
- **Phase 6**: Days 11-12 (Production Deployment)

**Total**: 12 days for complete implementation

## Dependencies

- Existing Setup Engine components
- MCE (Market Context Engine)
- UCM (Universe Control Module)
- MSF (Market Selection & Fit)
- Binance API
- Supabase database
