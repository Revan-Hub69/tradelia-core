# Tradelia Infrastructure Blueprint v1.1 (Audit-Ready, Backbone-First)

Status: DRAFT (implementation doc)
Scope: build the real infrastructure that implements the frozen audit spec without changing it.
Rule: no changes to contracts/invariants/reason codes/hash spec without version bump.

---

## 0) Goals (non-negotiable)
- Deterministic decisions, replay-safe.
- Clear separation: measure vs decide vs execute.
- Challenge-agnostic: the system absorbs any constraints we feed it.
- Audit-ready logs: DecisionState -> PolicyDecision -> ExecutionLog, with state_hash.

---

## 1) Architecture: 3 engines + 2 data planes

### A) State Engine (measure + package)
Input: Market snapshot + DataQuality + ChallengeSpec + Cost proxies + Regime snapshot
Output: DecisionState + DecisionStateCanonical + state_hash
Hard rule: never decides. Only measures and packages.

### B) Policy Engine (deterministic decision)
Input: DecisionStateCanonical(v1)
Output: PolicyDecision (action + reason_codes + risk_budget_applied + cost_check + versions + state_hash)
Hard rule: pure function, no I/O, no randomness.

### C) Execution/Sim Engine (world touch)
Input: PolicyDecision (+ optional order intent)
Output: ExecutionLog (slippage/spread/fill_time/violations)
Hard rule: only component that touches broker/sim.

### Online data plane
DecisionState -> PolicyDecision -> ExecutionLog

### Offline data plane (replay + calibration)
DecisionStateCanonical + ExecutionLog -> CalibrationSnapshot

---

## 2) Data flow (online)

[Market/News/Regime/Costs] -> StateEngine -> DecisionStateCanonical -> PolicyEngine.decide() -> PolicyDecision -> ExecutionEngine -> ExecutionLog

Notes:
- state_hash is computed on DecisionStateCanonical (v1) only.
- PolicyDecision must include state_hash + versions (policy/model/spec).

---

## 3) Core contracts (frozen)

### DecisionState (runtime state)
- constraints: trade_gate, risk_budget, hard_limits
- data_quality, uncertainty, regime, market, path_state
- cost_distribution, venue_selection, signal_candidates

### DecisionStateCanonical(v1)
- same content, canonicalized order, stable rounding
- all optional fields present as null

### PolicyDecision
- action: TRADE | DELAY | SKIP | HALT
- reason_codes: short deterministic list
- trade_gate, selected_setup_id, instruments
- risk_budget_applied, cost_check
- version + state_hash

### ExecutionLog
- fill_time, slippage, spread, violations
- venue, symbol, order_intent (if any)

### CalibrationSnapshot
- arena, symbol
- p95_spread, p99_slippage
- updatedAt, source

Rule: CalibrationSnapshot never rewrites history. It only appends new versions.

---

## 4) Determinism and audit constraints

### Canonicalization rules (hard)
- fixed field order
- rounding: scores/uncertainty/confidence -> 2 decimals; cost expected/tail -> 4 decimals
- arrays sorted: watchlist_target ASC, universe_today[arena] ASC
- signal_candidates_sorted: setup_id ASC, expected_edge DESC
- timestamp_utc_iso must be ISO-8601 UTC with Z suffix
- no omitted fields: use null if absent

### Hash spec
state_hash = SHA256(JSON.stringify(DecisionStateCanonical(v1)))

### Action/Reason matrix
Every PolicyDecision.action must be consistent with reason_codes. Invalid otherwise.

---

## 5) ChallengeSpec ingestion (dynamic, not hardcoded)

### Principle
We do not build around 2 competitions. We build a generic ChallengeSpec parser + normalizer.

### Normalization
- ChallengeSpec.news_trading -> hard_limits.news_trading_allowed
- ChallengeSpec is immutable during enrollment (versioned)

### Venue rules
- venue_gate is derived from ChallengeSpec, not from score.
- If challenge is FX-only, CRYPTO/FUTURES/EQUITIES_NEWS are DISABLED.
- Venue selection is a compliance check, not a discovery system, when challenge restricts venues.

---

## 6) Control loop (orchestrator)

### runOnce (online)
1) Load ChallengeSpec version
2) Build MarketSnapshot + DataQuality + Regime + Cost proxies
3) StateEngine.build() -> DecisionState + DecisionStateCanonical + state_hash
4) PolicyEngine.decide() -> PolicyDecision
5) ExecutionEngine.execute()/simulate() -> ExecutionLog
6) Persist logs (append-only)

### runLoop
- periodic runOnce with stable scheduling
- circuit breakers on data quality or repeated EXEC.HALT

---

## 7) Offline loop (replay + calibration)

### replay
Input: DecisionStateCanonical log -> PolicyEngine.decide() -> compare with stored PolicyDecision
Output: replay consistency report

### calibrate
Input: DecisionStateCanonical + ExecutionLog
Output: CalibrationSnapshot (new version)

Rule: state_hash + policy_version => same PolicyDecision in replay.

---

## 8) Repo structure (TypeScript)

/src
  /domain                // PURE: no I/O
    /contracts
      challengeSpec.ts
      decisionState.ts
      policyDecision.ts
      executionLog.ts
      calibrationSnapshot.ts
      reasonCodes.ts
    /canonical
      canonicalizeDecisionState.ts
      stateHash.ts
    /policy
      invariants.ts
      reasonMatrix.ts
      decide.ts
  /adapters              // I/O
    /marketFeed
    /newsFeed
    /broker
    /storage
  /orchestrator          // control loop
    runOnce.ts
    runLoop.ts
  /offline               // replay/calibration
    replay.ts
    calibrate.ts
/tests
  domain.invariants.test.ts
  domain.hash.test.ts
  domain.reasonMatrix.test.ts

CI enforcement:
- /domain/** forbids: fetch, Date.now, Math.random, fs, process.env

---

## 9) Milestones (backbone first)

### M0: Backbone lock (mandatory)
Deliverables:
- Contracts: DecisionState, PolicyDecision, ExecutionLog, CalibrationSnapshot
- DecisionStateCanonical(v1) + state_hash
- ReasonCodes v0.1 + action/reason validator
- PolicyEngine.decide(): hard limits + session window + news buffer + basic cost verdict
- 6 invariants tests: idempotence, determinism, no bypass, fail-safe, matrix coherence, hash stability

### M1: Online runOnce (mocked data)
- StateEngine builds DecisionState from mock market snapshot
- PolicyEngine returns PolicyDecision
- ExecutionLog mock

### M2: Execution + calibration
- Simulated fill_time/slippage/spread
- CalibrationSnapshot update pipeline

### M3: Real adapters
- MarketFeed + NewsFeed adapters
- Storage adapter (append-only)

### M4: Regime provider (v0 observable)
- deterministic regime classifier

### M5: Setup scoring (optional)
- only after backbone is stable

---

## 10) What we build first (concrete)

1) Contracts + canonicalization + hash
2) PolicyEngine (hard limits, session window, news buffer, cost verdict)
3) Orchestrator runOnce
4) ExecutionLog mock + CalibrationSnapshot
5) Tests + CI rules

This gives a working audit-ready loop without any broker dependency.

---

## 11) Audit artifacts (expected)
- ChallengeSpec versions (JSON)
- DecisionStateCanonical log (append-only)
- PolicyDecision log (append-only, includes state_hash)
- ExecutionLog (append-only)
- CalibrationSnapshot versions
- Replay report (determinism)

---

## 12) Open inputs needed
- List of allowed venues per challenge
- News policy per challenge
- Session windows per challenge
- Cost proxy sources (spread/slippage proxies)
- Regime classifier rules (v0)

---

## 13) Non-goals (for v1.1)
- No ML-based decisions in PolicyEngine
- No adaptive rule changes during an active challenge
- No live broker execution until replay is stable

---

## 14) Implementation notes (short)
- Keep domain pure and deterministic.
- Store everything append-only; never rewrite history.
- Any change to contracts or invariants requires version bump and replay re-baseline.

---

## 15) Audit M0 findings and required patches (backbone hardening)

### What is already strong
- Determinism: canonicalize + pure PolicyEngine are solid for replay.
- Auditability: state_hash + version fields are correct backbone.
- Domain purity: eslint guardrails are in place.

### Critical gaps to close before freezing M0
1) Stable hash input (key ordering)
   - Risk: JSON.stringify preserves insertion order only.
   - Patch: stable stringify (recursive key sort) for hash input.

2) Centralized rounding policy
   - Risk: scattered rounding rules drift over time.
   - Patch: quantize(field, value) with a field -> decimals map.

3) ReasonCodes enforcement in schemas
   - Risk: reason_codes accept any string.
   - Patch: reason_codes = enum(ReasonCodes); dominant_constraint = ReasonCode | "UNKNOWN".

4) Action/reason matrix coherence
   - Risk: SKIP with only REGIME.REVIEW.* is invalid.
   - Patch: if only high uncertainty and no hard fail, use DELAY not SKIP.

5) Session window handling (M0 surrogate)
   - Current M0 uses market.event_risk + session only.
   - If full session flags are needed, add in v1.2 (not in frozen v1.1).

6) Execution bridge (outside domain)
   - Add ExecutionPlan in adapters: PolicyDecision -> OrderIntent validation.
   - Log violations in ExecutionLog without mutating PolicyDecision.

### Tier-1 audit extras (recommended)
- Hash sensitivity test (1 bit change -> hash change).
- Reason set validity test (all reasons in ReasonCodes).
- dominant_constraint in reason_codes test.
- Monotonicity test for quality/uncertainty.
