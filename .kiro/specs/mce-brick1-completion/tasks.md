# MCE Brick #1 Completion - Implementation Tasks

## Overview

Implementazione dei 3 elementi mancanti identificati dall'audit per completare operativamente il Brick #1 del Market Context Engine.

## Tasks

### Phase 1: Expected Event Grid (Days 1-2)

- [ ] 1. Define expected event grid configuration
  - Create EventGridConfig interface with symbol/timeframe mappings
  - Define expected intervals: 1m=1440/day, 5m=288/day, 1h=24/day, 4h=6/day, 1d=1/day
  - Account for market closure periods (weekends for crypto = 24/7)
  - Store configuration in canonical JSON format
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ] 2. Implement missing events calculation
  - Update data quality metrics to use expected event grid
  - Calculate missing_pct based on expected vs actual events
  - Handle edge cases (partial days, system downtime)
  - Validate against historical data patterns
  - _Requirements: 1.1, 1.2_

### Phase 2: Engine Versioning (Days 3-4)

- [ ] 3. Add engine version to RegimeSignature
  - Update RegimeSignature interface to include engine_version in metadata
  - Implement semantic versioning (mce-0.1.0 format)
  - Embed version in all generated outputs
  - Create version compatibility matrix
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ] 4. Implement version-based analysis
  - Enable comparison between different engine versions
  - Validate determinism within same version
  - Create version migration strategy for future updates
  - Document version changelog format
  - _Requirements: 2.4, 2.6_

### Phase 3: Minimal CLI Interface (Days 5-7)

- [ ] 5. Create CLI foundation
  - Setup CLI framework (Commander.js or similar)
  - Implement basic argument parsing and validation
  - Create help system and usage documentation
  - Setup error handling and logging
  - _Requirements: 3.5, 3.6_

- [ ] 6. Implement replay command
  - Create `mce replay --symbol BTCUSDT --from 2024-01-01 --to 2024-01-07` command
  - Output NDJSON stream of RegimeSignatures
  - Calculate and output final canonical hash
  - Support dry-run mode for validation
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.7_

### Phase 4: Determinism Validation (Days 8-9)

- [ ] 7. Implement determinism validation
  - Create automated determinism verification system
  - Compare canonical hashes between multiple replay runs
  - Detect and report non-deterministic behavior
  - Validate floating-point consistency
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 8. Create determinism audit system
  - Implement hash comparison across different timestamps
  - Maintain determinism audit log
  - Create determinism test suite
  - Document determinism validation protocol
  - _Requirements: 4.5, 4.6_

### Phase 5: Scientific Validation (Days 10-12)

- [ ] 9. Implement financial property tests
  - Create scale invariance test suite
  - Implement time monotonicity validation
  - Add no-lookahead verification
  - Validate canonical JSON determinism
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 10. Setup property-based testing framework
  - Integrate fast-check or similar PBT library
  - Create custom generators for market data
  - Implement financial robustness property tests
  - Create comprehensive test coverage
  - _Requirements: 7.5, 7.6_

### Phase 6: Performance Measurement (Days 13-14)

- [ ] 11. Implement component-level latency measurement
  - Separate ws_to_ram latency measurement
  - Separate ram_to_store latency measurement
  - Separate compute latency measurement
  - Separate classification latency measurement
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 12. Create performance monitoring system
  - Implement realistic performance targets
  - Focus on correctness before optimization
  - Create performance regression detection
  - Document performance characteristics
  - _Requirements: 6.6, 6.7_

### Phase 7: Operational Validation (Days 15-21)

- [ ] 13. 7-day continuous operation test
  - Deploy system for continuous 7-day operation
  - Monitor all KPI targets continuously
  - Validate determinism across entire period
  - Collect performance metrics
  - _Requirements: All requirements validation_

- [ ] 14. Final CLI validation test
  - Execute CLI replay of complete 7-day historical data
  - Verify 100% deterministic hash match
  - Validate all scientific properties
  - Document operational readiness
  - _Requirements: Final validation protocol_

### Phase 8: Documentation and Handoff (Days 22-23)

- [ ] 15. Create operational documentation
  - Document CLI usage and examples
  - Create troubleshooting guide
  - Document performance characteristics
  - Create deployment guide
  - _Requirements: Operational readiness_

- [ ] 16. Prepare for Brick #2 transition
  - Document Brick #1 completion criteria
  - Define clear boundaries for Brick #2
  - Create handoff documentation
  - Archive Brick #1 validation results
  - _Requirements: 5.7_

## Checkpoint Tasks

- [ ] Checkpoint 1 (Day 7): CLI functional, basic replay working
- [ ] Checkpoint 2 (Day 14): All scientific properties validated
- [ ] Checkpoint 3 (Day 21): 7-day continuous operation completed
- [ ] Final Checkpoint (Day 23): Brick #1 operationally complete

## Success Criteria

Brick #1 is complete when:
- ✅ Expected event grid implemented and tested
- ✅ Engine versioning embedded in all outputs
- ✅ CLI replay command functional
- ✅ 100% determinism validation across multiple runs
- ✅ All financial robustness properties pass
- ✅ 7-day continuous operation successful
- ✅ Performance targets met with proper measurement

## What NOT to Implement

**Explicitly forbidden in this phase:**
- Multi-source ingestion
- Redis caching
- Public APIs
- ML classifiers
- Dashboard integration
- Trading logic
- Real-time WebSocket

**Focus:** Single-source, deterministic, scientifically rigorous foundation.

## Notes

- Each task builds incrementally on previous tasks
- Determinism validation is critical - any failure requires investigation
- Performance optimization comes AFTER correctness validation
- CLI is the primary validation interface, not UI
- Scientific rigor is non-negotiable