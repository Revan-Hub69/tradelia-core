# UCM + MSF v1 - Rischi Residui e Mitigazioni

## ⚠️ Rischi Identificati (Reali, Non Teorici)

### 1. ATR Percentile su TF 1m - Rumore su Mid-Cap

**Problema**: ATR percentile su 1m può essere rumoroso su certi symbol, soprattutto crypto mid-cap.

**Impatto**: 
- Falsi segnali di eligibilità/non-eligibilità
- Flipping eccessivo nell'universo attivo
- Degradazione qualità ranking

**Mitigazione v1 (Accettabile)**:
- ✅ Hysteresis 10min/20min mitiga il rumore
- ✅ Blacklist hard per data gaps elimina worst case
- ✅ Core symbols sempre inclusi (stabilità base)

**Mitigazione v2 (Futura)**:
```typescript
// Non implementare ora - solo per riferimento futuro
atrPercentileSmoothed = EMA(atrPercentile_1m, period: 3-5)
```

**Decisione**: v1 va bene così. Monitorare KPI turnover.

### 2. SpreadBps come Metrica Unica di Frizione

**Problema**: 
- Spread è ottimo ma su alcune coppie crypto è "finto" (order book sottile)
- Non riflette sempre la frizione reale di esecuzione

**Impatto**:
- Overestimation della liquidità su alcuni symbol
- Possibili sorprese in execution reale

**Mitigazione v1 (Sufficiente)**:
- ✅ Volume weighting nel ranking (55% peso)
- ✅ LiquidityTier classification in MSF
- ✅ Conservative approach: quando in dubbio, NO_TRADE

**Mitigazione v2 (Futura)**:
```typescript
// Effective spread simulato
effectiveSpread = spread * volumeRatio * depthFactor
// O simulazione market impact
```

**Decisione**: NON necessario per v1. Spread + volume è sufficiente.

### 3. Supabase Free Storage Limit (6-8 Mesi)

**Problema**: Storage growth ~1GB/anno, limite 500MB.

**Timeline**:
- Mesi 1-3: ~125MB (safe)
- Mesi 4-6: ~250MB (monitoring)
- Mesi 7-8: ~350MB (action needed)

**Mitigazione Operativa**:
```sql
-- Dopo ~6 mesi, implementare:
-- 1. Archiviazione snapshot vecchi
DELETE FROM eligibility_snapshots WHERE created_at < NOW() - INTERVAL '90 days';

-- 2. Downsampling (1 ogni 15 min invece di 5 min)
-- 3. Compressione JSONB fields
```

**Decisione**: Non è un problema ora. Pianificare per mese 6.

## 🧭 Coerenza con Visione Tradelia

### Value Proposition Validato
```
"Tradelia non ti dice cosa comprare. 
Ti dice quando NON ha senso tradare e dove ha senso guardare."
```

**Coerenza Stack MCE → UCM → MSF → Dashboard**:
- ✅ **Educational**: Spiega il "perché" dietro ogni decisione
- ✅ **MiFID Compliant**: Nessun consiglio di investimento
- ✅ **Anti-fuffa**: Criteri rigorosi, conservative approach

### Messaging Corretto
- ❌ "Compra BTCUSDT ora"
- ✅ "Oggi il mercato è tradabile, 3 simboli hanno fit A/B"
- ✅ "Regime range + volatilità espansa = NO_TRADE consigliato"
- ✅ "ETHUSDT ha data gaps, blacklisted per 7 giorni"

## 📋 Piano Implementazione Rivisto

### Step 1: UCM Phase 1 ONLY (Settimana 1-2)
**Focus**: Eligibility + Hysteresis + Universe Active stabile

**Deliverables**:
```
✅ Database schema UCM (006_ucm_schema.sql)
✅ UCM types & schemas
✅ Eligibility engine
✅ Hysteresis logic
✅ Universe active generation
✅ API: GET /api/universe/active
```

**Success Criteria**:
- Universe si muove poco ma bene
- Turnover <= 2-4 simboli per ora
- Core symbols sempre presenti
- Blacklist funziona per data gaps

### Step 2: Dashboard Minimale Read-Only (Settimana 3)
**Focus**: Visualizzazione universe prima di MSF

**Deliverables**:
```
✅ /api/universe/active consumption
✅ /api/universe/diff per tracking changes
✅ UI: Current universe display
✅ UI: Added/removed timeline
✅ UI: Timestamp + hash validation
```

**Obiettivo**: Fidarsi del sistema prima di aggiungere MSF.

### Step 3: MSF con DayGate Visibile (Settimana 4-5)
**Focus**: Solo dopo aver validato UCM

**Deliverables**:
```
✅ MSF database schema
✅ Market fit calculation
✅ Day gate logic
✅ API: GET /api/msf/status
✅ UI: TRADABLE DAY: YES/NO
✅ UI: 3-5 simboli max con fit score
```

**Messaging**:
- Niente segnali
- Solo fit assessment
- Conservative quando in dubbio

## 🎯 KPI Monitoring per Rischi

### Turnover Rate (UCM Risk #1)
```typescript
// Target: <= 0.2 per hour (2-4 simboli su 20)
turnoverRate = (added + removed) / totalActive / hours
```

**Alert Thresholds**:
- Warning: > 0.3 per hour
- Critical: > 0.5 per hour

### Spread Accuracy (UCM Risk #2)
```typescript
// Proxy validation: volume correlation
spreadVolumeCorrelation = corr(spreadBps, volQuote_24h)
// Target: < -0.3 (negative correlation expected)
```

### Storage Growth (Risk #3)
```sql
-- Monthly monitoring query
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as records,
  pg_size_pretty(pg_total_relation_size('eligibility_snapshots')) as size
FROM eligibility_snapshots 
GROUP BY month 
ORDER BY month DESC;
```

## 🔧 Operational Playbook

### Quando Turnover è Alto
1. Check ATR percentile noise su mid-cap symbols
2. Verify hysteresis parameters effectiveness
3. Consider temporary blacklist per noisy symbols
4. Review eligibility thresholds

### Quando Spread Metrics Sembrano Off
1. Cross-check con volume patterns
2. Manual spot-check su major pairs
3. Consider liquidity tier adjustments
4. Document per future v2 improvements

### Quando Storage si Avvicina al Limite
1. Implement data archival strategy
2. Downsample historical snapshots
3. Compress JSONB fields
4. Consider paid tier migration

## 📊 Success Metrics

### UCM Health
- ✅ Turnover rate <= 0.2/hour
- ✅ Core symbols uptime > 95%
- ✅ Blacklist effectiveness > 90%
- ✅ API response time < 200ms

### MSF Health  
- ✅ tradableDay=false 20-40% dei giorni
- ✅ Class A symbols <= 3 per day
- ✅ Conservative accuracy > 80%
- ✅ No data gap symbols in A/B class

### System Health
- ✅ Pipeline success rate > 95%
- ✅ Storage growth within projections
- ✅ Error rate < 1%
- ✅ User trust metrics positive

## 🚀 Next Actions

### Immediate (This Week)
1. ✅ Start UCM Phase 1 implementation
2. ✅ Focus on database schema + core engine
3. ✅ Ignore MSF completely for now
4. ✅ Build confidence in universe stability

### Week 2-3
1. Complete UCM + basic dashboard
2. Monitor turnover KPIs
3. Validate hysteresis effectiveness
4. Build user trust in system

### Week 4-5
1. Add MSF only after UCM is solid
2. Conservative DayGate implementation
3. Minimal UI: just tradable/not-tradable
4. No trading signals, just context

Questo approccio incrementale riduce i rischi e costruisce fiducia step-by-step, mantenendo la coerenza con la visione educativa di Tradelia.