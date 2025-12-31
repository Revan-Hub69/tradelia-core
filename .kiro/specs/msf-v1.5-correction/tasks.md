# MSF v1.5 - Tasks di Correzione Chirurgica

## Obiettivo

Correggere MSF v1 rimuovendo logiche arbitrarie e sostituendo parametri hardcoded con valori scientificamente giustificati, mantenendo la semplicità operativa.

## Task 1: Aggiornare Parametri Scientifici

**Priority**: P0 - Critical
**Effort**: 1 hour
**Files**: `lib/msf/types.ts`

### Subtasks
- [ ] Sostituire `DEFAULT_MSF_CONFIG` con `MSF_V15_CONFIG`
- [ ] Aggiornare spread thresholds con valori Hasbrouck
- [ ] Rimuovere `aClassMaxPct` (non più usato)
- [ ] Aggiungere `maxVolatilityMultiple` per vol expansion
- [ ] Semplificare `regimePlaybooks` mapping

### Parametri da Aggiornare
```typescript
// OLD (arbitrario)
aClassMaxPct: 0.15,              // ❌ Target artificiale
frictionThresholds: {
  aMax: 0.2,                     // ❌ Valore inventato
  bMax: 0.4,                     // ❌ Valore inventato  
  cMax: 0.6,                     // ❌ Valore inventato
},

// NEW (scientifico)
spreadThresholds: {              // ✅ Hasbrouck 2007
  aMax: 1.0,                     // 1.0 bps premium
  bMax: 2.0,                     // 2.0 bps good
  cMax: 5.0,                     // 5.0 bps acceptable
},
maxVolatilityMultiple: 2.0,      // ✅ Mandelbrot expansion
```

## Task 2: Semplificare Day Gate Logic

**Priority**: P0 - Critical  
**Effort**: 30 minutes
**Files**: `lib/msf/engine/dayGate.ts`

### Subtasks
- [ ] Rimuovere controllo `(countA + countB) >= minABCount`
- [ ] Rimuovere controllo `aSymbolsPct > config.aClassMaxPct`
- [ ] Semplificare a 3 controlli binari:
  - Regime confidence >= threshold
  - Data quality >= threshold  
  - Volatility not explosive
- [ ] Aggiornare reasons per essere più specifici

### Logic Changes
```typescript
// OLD (complesso)
let tradableDay = (countA + countB) >= config.minABCount;
if (avgDataQuality < config.minDataQuality) tradableDay = false;
if (regime.volatility === "expanded") tradableDay = false;
// + altri 5 controlli...

// NEW (semplice)  
let tradableDay = true;
if (regime.confidence < config.minRegimeConfidence) tradableDay = false;
if (avgDataQuality < config.minDataQuality) tradableDay = false;  
if (regime.volatility === "explosive") tradableDay = false;
// Stop. 3 controlli binari.
```

## Task 3: Correggere Fit Class Calculation

**Priority**: P0 - Critical
**Effort**: 45 minutes  
**Files**: `lib/msf/engine/fitClass.ts`

### Subtasks
- [ ] Sostituire `frictionScore` con `spreadBps` diretto
- [ ] Rimuovere calcolo complesso di friction components
- [ ] Usare spread threshold diretti per classificazione
- [ ] Semplificare `determineAllowedPlaybooks` logic
- [ ] Rimuovere downgrade basato su vol (gestito in playbooks)

### Friction Calculation Changes
```typescript
// OLD (complesso)
function calculateFrictionScore(snapshot, regime): number {
  let friction = 0;
  friction += spreadFriction * 0.3;
  friction += atrFriction * 0.2;
  friction += gapFriction * 0.2;
  friction += volumeFriction * 0.3;
  friction += confidenceFriction * 0.3;
  return Math.min(friction, 1);
}

// NEW (diretto)
function getSpreadBps(snapshot): number {
  return snapshot.spread * 10000; // Convert to basis points
}

function classifyBySpread(spreadBps, config): FitClass {
  if (spreadBps <= config.spreadThresholds.aMax) return "A";
  if (spreadBps <= config.spreadThresholds.bMax) return "B";  
  if (spreadBps <= config.spreadThresholds.cMax) return "C";
  return "NO_TRADE";
}
```

## Task 4: Semplificare Playbook Logic

**Priority**: P1 - Important
**Effort**: 30 minutes
**Files**: `lib/msf/engine/fitClass.ts`

### Subtasks
- [ ] Rimuovere logica `volExpandedPlaybooks` (gestito in day gate)
- [ ] Semplificare regime-playbook mapping
- [ ] Rimuovere fit class restrictions su playbooks
- [ ] Aggiungere override per vol explosive

### Playbook Logic Changes
```typescript
// OLD (complesso)
if (regime.volatility === "expanded") {
  basePlaybooks = config.volExpandedPlaybooks;
} else if (regime.trend === "range") {
  basePlaybooks = config.rangeRegimePlaybooks;
} else {
  basePlaybooks = config.trendRegimePlaybooks;
}
if (fitClass === "C") {
  basePlaybooks = basePlaybooks.filter(pb => pb === "mean_revert" || pb === "none");
}

// NEW (semplice)
function getAllowedPlaybooks(regime, fitClass, config): AllowedPlaybook[] {
  if (fitClass === "NO_TRADE") return ["none"];
  if (regime.volatility === "explosive") return ["none"]; // Override
  
  if (regime.trend === "range") return ["mean_revert"];
  if (regime.trend === "up" || regime.trend === "down") return ["pullback"];
  return ["none"]; // Unclear regime
}
```

## Task 5: Aggiornare KPI Analysis

**Priority**: P2 - Nice to have
**Effort**: 20 minutes
**Files**: `lib/msf/engine/dayGate.ts`, `lib/msf/engine/fitClass.ts`

### Subtasks
- [ ] Rimuovere `aSymbolsPct` validation da `validateDayGate`
- [ ] Rimuovere "Too many A symbols" issue check
- [ ] Aggiornare `analyzeFitClassDistribution` per non aspettarsi target %
- [ ] Rimuovere recommendations su "Tighten A class criteria"

### KPI Changes
```typescript
// OLD (target-based)
if (aSymbolsPct > config.aClassMaxPct) {
  issues.push(`Too many A symbols: ${(aSymbolsPct * 100).toFixed(1)}%`);
  recommendations.push("Tighten A class criteria");
}

// NEW (descriptive only)
// Just report distribution, no "too many" logic
const distribution = {
  A: countA,
  B: countB, 
  C: countC,
  NO_TRADE: countNoTrade
};
// No validation against targets
```

## Task 6: Update Documentation

**Priority**: P2 - Documentation
**Effort**: 15 minutes
**Files**: `docs/msf-v1-implementation-complete.md`

### Subtasks
- [ ] Aggiornare documentazione con MSF v1.5 changes
- [ ] Rimuovere riferimenti a "A must be rare (<15%)"
- [ ] Aggiornare esempi con nuova logica
- [ ] Aggiungere sezione "Scientific Parameters"

## Task 7: Test Updated Logic

**Priority**: P1 - Validation
**Effort**: 30 minutes
**Files**: Test scenarios

### Subtasks
- [ ] Testare day gate con 3 controlli semplici
- [ ] Verificare fit classification con spread thresholds
- [ ] Testare playbook logic con regime matching
- [ ] Verificare che vol explosive blocchi tutto
- [ ] Confermare che non ci sono target % artificiali

### Test Scenarios
```typescript
// Scenario 1: Normal day
regime = { trend: "up", confidence: 0.8, volatility: "normal" }
dataQuality = 0.96
btcSpread = 0.7 // bps
Expected: Day=TRADABLE, BTC=A, Playbooks=[pullback]

// Scenario 2: Explosive vol
regime = { trend: "up", confidence: 0.8, volatility: "explosive" }  
dataQuality = 0.98
btcSpread = 0.6 // bps
Expected: Day=NO_TRADE, BTC=A, Playbooks=[none]

// Scenario 3: Expensive symbol
regime = { trend: "range", confidence: 0.7, volatility: "normal" }
dataQuality = 0.97  
altSpread = 8.2 // bps
Expected: Day=TRADABLE, ALT=NO_TRADE, Playbooks=[none]
```

## Implementation Order

### Phase 1: Core Logic (1 hour)
1. Task 1: Update parameters (30 min)
2. Task 2: Simplify day gate (30 min)

### Phase 2: Classification (1 hour)  
3. Task 3: Fix fit class calculation (45 min)
4. Task 4: Simplify playbooks (15 min)

### Phase 3: Cleanup (45 min)
5. Task 5: Update KPI analysis (20 min)
6. Task 6: Update docs (15 min)  
7. Task 7: Test scenarios (10 min)

## Success Criteria

### ✅ Logic Simplified
- [ ] Day gate has exactly 3 binary checks
- [ ] Fit class uses direct spread thresholds  
- [ ] Playbooks use simple regime matching
- [ ] No % targets or optimization logic

### ✅ Parameters Scientific
- [ ] Spread thresholds from Hasbrouck (1.0, 2.0, 5.0 bps)
- [ ] Vol expansion from Mandelbrot (2x multiplier)
- [ ] Data quality from ISO 25012 (95% minimum)
- [ ] Regime confidence from behavioral finance (60% minimum)

### ✅ Behavior Correct
- [ ] Market decides A/B/C distribution naturally
- [ ] Vol explosive blocks everything
- [ ] Poor data blocks day trading
- [ ] Unclear regime blocks day trading
- [ ] No artificial targets or optimization

## Risk Mitigation

### Technical Risk
- **Breaking Changes**: MSF v1.5 changes core logic
  - *Mitigation*: Parallel testing, gradual rollout
- **Parameter Sensitivity**: New thresholds may change behavior
  - *Mitigation*: Monitor first week, adjust if needed

### Operational Risk  
- **Different A/B/C Counts**: Natural distribution may differ from v1
  - *Mitigation*: This is expected and correct behavior
- **More NO_TRADE Days**: Stricter vol/data rules may reduce trading
  - *Mitigation*: This is fail-closed working correctly

---

**MSF v1.5 = Scienza nei parametri, semplicità nel runtime**

*Correzione chirurgica completabile in 2-3 ore di lavoro focalizzato.*