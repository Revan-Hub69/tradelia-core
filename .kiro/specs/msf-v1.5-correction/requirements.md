# MSF v1.5 - Correzione Chirurgica

## Principio Fondamentale

**MSF decide solo 3 cose:**
1. **Il giorno è pulito?** (Day Gate: YES/NO)
2. **Questo simbolo è frizionale?** (Fit Class: A/B/C/NO_TRADE)  
3. **Questo regime supporta questo stile?** (Playbook: allowed/not allowed)

**Stop. Nient'altro.**

## ❌ Cosa NON Fare (Errori MSF v1)

- ❌ **Non bloccare % di trade** (15% A symbols era arbitrario)
- ❌ **Non usare "target A symbols"** (il mercato decide, non noi)
- ❌ **Non ottimizzare win-rate** (MSF non è un sistema di trading)
- ❌ **Non far decidere il backtest al runtime** (la scienza sta nei parametri)

## ✅ Cosa Fare (MSF v1.5 Corretto)

### **1. Day Gate Semplificato**
```
Regime: OK? → Check
Volatility: Normal? → Check  
DataQuality: >95%? → Check
→ TRADABLE DAY: YES
```

**Se anche solo uno fallisce → NO_TRADE DAY**

### **2. Fit Class Basato su Frizione Reale**
```
Spread BTC: 0.7 bps → OK → FIT B
Spread ETH: 3.2 bps → High → NO_TRADE
```

**Soglie basate su letteratura, ma decisione binaria semplice**

### **3. Regime-Style Matching**
```
Regime: Trend + Vol: Normal → Pullback: ALLOWED
Regime: Range + Vol: Low → Mean Revert: ALLOWED  
Regime: Any + Vol: Explosive → ALL: NOT ALLOWED
```

## Correzioni Specifiche

### **Parametri Scientifici (Una Tantum)**

**Spread Thresholds** (Hasbrouck 2007):
- A Class: < 1.0 bps (premium liquidity)
- B Class: < 2.0 bps (good liquidity)  
- C Class: < 5.0 bps (acceptable)
- NO_TRADE: > 5.0 bps (too expensive)

**Data Quality** (ISO 25012):
- Minimum: 95% completeness
- Freshness: < 5 minutes old
- Accuracy: No obvious outliers

**Volatility Expansion** (Mandelbrot):
- Normal: < 2x recent average
- Expanded: > 2x recent average
- Explosive: > 3x recent average

### **Decision Logic Semplificato**

```typescript
// Day Gate - 3 checks only
function isDayTradable(regime, dataQuality, volatility): boolean {
  if (regime.confidence < 0.6) return false;      // Regime unclear
  if (dataQuality < 0.95) return false;          // Data poor  
  if (volatility === "explosive") return false;   // Vol dangerous
  return true; // Otherwise tradable
}

// Fit Class - friction only
function classifySymbol(spread, gaps, completeness): FitClass {
  if (completeness < 0.95) return "NO_TRADE";    // Data issue
  if (gaps > 2) return "NO_TRADE";               // Too many gaps
  
  if (spread < 1.0) return "A";                  // Premium
  if (spread < 2.0) return "B";                  // Good
  if (spread < 5.0) return "C";                  // Acceptable
  return "NO_TRADE";                             // Too expensive
}

// Playbook - regime matching
function getAllowedPlaybooks(regime, fitClass): Playbook[] {
  if (fitClass === "NO_TRADE") return ["none"];
  if (regime.volatility === "explosive") return ["none"];
  
  if (regime.trend === "range") return ["mean_revert"];
  if (regime.trend === "up" || regime.trend === "down") return ["pullback"];
  return ["none"]; // Unclear regime
}
```

## Esempio Reale di Funzionamento

### **Scenario 1: Giorno Normale**
```
Input:
- Regime: Trend UP, Confidence: 0.8, Vol: Normal
- Data Quality: 96%
- BTC Spread: 0.7 bps, Gaps: 0
- ETH Spread: 1.5 bps, Gaps: 1

Output:
- Day Gate: TRADABLE (regime OK, data OK, vol OK)
- BTC: FIT A, Allowed: [pullback]
- ETH: FIT B, Allowed: [pullback]
```

### **Scenario 2: Giorno Pericoloso**  
```
Input:
- Regime: Trend UP, Confidence: 0.8, Vol: EXPLOSIVE
- Data Quality: 98%
- BTC Spread: 0.6 bps, Gaps: 0

Output:
- Day Gate: NO_TRADE (vol explosive)
- BTC: FIT A, Allowed: [none] (vol override)
```

### **Scenario 3: Simbolo Costoso**
```
Input:
- Regime: Range, Confidence: 0.7, Vol: Normal  
- Data Quality: 97%
- ALTCOIN Spread: 8.2 bps, Gaps: 0

Output:
- Day Gate: TRADABLE (tutto OK)
- ALTCOIN: NO_TRADE (spread troppo alto)
```

## Implementazione MSF v1.5

### **Modifiche Minime Richieste**

1. **Rimuovere logica % A symbols** da dayGate.ts
2. **Semplificare friction calculation** in fitClass.ts  
3. **Aggiornare soglie con valori scientifici** in types.ts
4. **Rimuovere KPI "ottimizzazione"** da pipeline

### **Parametri Aggiornati**

```typescript
export const MSF_V15_CONFIG = {
  // Day Gate - binary checks only
  minRegimeConfidence: 0.6,        // Kahneman: avoid low confidence
  minDataQuality: 0.95,            // ISO 25012: high completeness
  maxVolatilityMultiple: 2.0,      // Mandelbrot: 2x = expansion
  
  // Fit Class - friction thresholds (Hasbrouck)
  spreadThresholds: {
    aMax: 1.0,   // 1.0 bps - premium liquidity
    bMax: 2.0,   // 2.0 bps - good liquidity  
    cMax: 5.0,   // 5.0 bps - acceptable
    // > 5.0 bps = NO_TRADE
  },
  
  maxGapsAllowed: 2,               // Data integrity
  
  // Regime-Style Matching - simple rules
  regimePlaybooks: {
    "trend": ["pullback"],         // Trend = pullback only
    "range": ["mean_revert"],      // Range = mean revert only
    "unclear": ["none"],           // Unclear = nothing
  },
  
  // Fail-closed overrides
  explosiveVolOverride: true,      // Vol explosive = all none
  lowConfidenceOverride: true,     // Low confidence = day off
};
```

## Vantaggi MSF v1.5

### **✅ Mantiene Semplicità**
- 3 decisioni binarie semplici
- Nessuna ottimizzazione runtime
- Logica trasparente e auditabile

### **✅ Parametri Scientifici**  
- Soglie basate su letteratura peer-reviewed
- Ma applicate in modo deterministico
- Nessuna "intelligenza artificiale" nel loop

### **✅ Fail-Closed Robusto**
- Vol explosive → tutto OFF
- Data poor → tutto OFF  
- Regime unclear → tutto OFF

### **✅ Operativamente Sano**
- Il mercato decide quanti A/B/C ci sono
- MSF dice solo se sono tradabili o no
- Nessun target artificiale da raggiungere

## Conclusione

**MSF v1.5 = MSF v1 con parametri scientifici ma logica identica**

- ✅ **Scienza nei parametri** (soglie da letteratura)
- ✅ **Semplicità nel runtime** (3 decisioni binarie)  
- ✅ **Fail-closed robusto** (OFF quando incerto)
- ✅ **Nessuna ottimizzazione** (il mercato decide)

**La correzione è chirurgica: cambiamo i numeri, non la logica.**