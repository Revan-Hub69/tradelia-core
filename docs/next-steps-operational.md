# Next Steps Operativi - Da "Build Green" a "Desk-Grade"

## 🎯 **Stato Attuale: Cosa Abbiamo**

### **✅ Architettura Solida**
- **MCE (Brick 1)**: Regime detection con pipeline deterministica
- **UCM (Brick 2)**: Universe control con anti-flip e hysteresis  
- **MSF v1.5 (Brick 3)**: Gate operativo fail-closed con policy conservative

**👉 Insieme**: Sistema che dice "oggi si opera o no" + "su quali simboli" con disciplina ingegneristica.

### **❌ Gap per Produzione**
- **Dati simulati**: MCE/UCM/MSF usano mock data, non Binance reale
- **Zero observability**: Nessun dashboard, monitoring, alerting
- **Policy non calibrate**: Parametri conservative ma non validati
- **Nessun runbook**: Cosa fare quando qualcosa va storto?

## 📋 **Roadmap Operativa (4 Settimane)**

### **Week 1: Real Data End-to-End**
**Obiettivo**: Sostituire simulazioni con dati Binance reali

**Tasks**:
- [ ] **MCE Real Data**: Binance API → market_data table (klines, volume, spread)
- [ ] **UCM Real Data**: Leggere completeness/gaps/ATR da market_data reali
- [ ] **MSF Real Data**: Calcolare spread reali + fee estimation basic
- [ ] **Pipeline Integration**: MCE → UCM → MSF con dati reali
- [ ] **Basic Logging**: Console output strutturato per debug

**Success Criteria**:
- MCE scrive dati Binance reali ogni 5 minuti
- UCM calcola universe da dati reali (non mock)
- MSF classifica simboli con spread reali
- Pipeline completa funziona end-to-end

### **Week 2: Observability Minima**
**Obiettivo**: Vedere cosa sta succedendo nel sistema

**Tasks**:
- [ ] **Health Dashboard**: Pagina read-only con stato corrente
  - Ultimo run timestamp
  - Day gate status (TRADABLE/NO_TRADE + reasons)
  - Universe size e composizione
  - Fit class distribution (A/B/C/NO_TRADE counts)
  - Data quality metrics
- [ ] **Basic KPIs**: Tracking essenziale
  - % giorni OFF (target <40%)
  - Turnover universe (stability metric)
  - Error rate pipeline
  - Data freshness (ultimo update)
- [ ] **Simple Alerting**: Email/Slack quando
  - Pipeline non gira da >30 minuti
  - Data quality <90% per >2 ore
  - Error rate >20%

**Success Criteria**:
- Dashboard mostra stato real-time
- KPI tracking funziona
- Alert funzionano per scenari critici

### **Week 3: Calibrazione Policy**
**Obiettivo**: Validare parametri conservative con dati reali

**Tasks**:
- [ ] **Data Collection**: 30 giorni di log strutturati
  - Spread distribution per simbolo
  - Volatility expansion frequency
  - Regime confidence distribution
  - Day gate decisions + reasons
- [ ] **Analysis**: Verificare se policy sono sensate
  - Spread 1/2/5 bps: troppo strict/loose?
  - Vol expansion: spegne troppo spesso?
  - Confidence 0.6: troppo conservative?
  - Data quality 0.95: raggiungibile?
- [ ] **Calibration**: Aggiustare parametri basandosi su dati
  - Target: 20-40% giorni OFF (disciplina ma utilizzabile)
  - Target: A class <20% universe (premium ma non vuoto)
  - Target: Error rate <10% (affidabilità)
- [ ] **A/B Testing**: Confrontare policy vecchie vs nuove

**Success Criteria**:
- Parametri calibrati su dati reali
- Sistema utilizzabile (non sempre OFF)
- Policy documentate con rationale

### **Week 4: Production Readiness**
**Obiettivo**: Runbook e procedure operative

**Tasks**:
- [ ] **Runbook Completo**: Procedure per scenari comuni
  - "Pipeline non gira": diagnosi + fix
  - "Binance API down": fallback + recovery
  - "Supabase rate limit": throttling + retry
  - "Data quality degraded": investigation + action
  - "Emergency shutdown": come spegnere tutto
- [ ] **Monitoring Enhancement**: 
  - Grafana dashboard con metriche storiche
  - PagerDuty integration per alert critici
  - Log aggregation e search (ELK/Datadog)
- [ ] **Backup & Recovery**:
  - Database backup automatico
  - Configuration backup
  - Rollback procedures per deploy
- [ ] **Documentation**:
  - Architecture overview aggiornato
  - API documentation completa
  - Troubleshooting guide

**Success Criteria**:
- Runbook testato su scenari reali
- Monitoring production-grade
- Recovery procedures validate
- Documentation completa

## 🔧 **Implementation Details**

### **Week 1: Real Data Tasks**

**MCE Real Data Integration**:
```typescript
// Replace mock data collection with real Binance API
async function collectRealMarketData(symbols: string[]): Promise<MarketData[]> {
  // Real Binance klines API calls
  // Real volume/spread calculation
  // Real data persistence to market_data table
}
```

**UCM Real Data Integration**:
```typescript
// Read real completeness/gaps from market_data
async function calculateRealCompleteness(symbol: string): Promise<number> {
  // Query market_data for missing periods
  // Calculate actual completeness percentage
  // Return real data quality metrics
}
```

**MSF Real Spread Calculation**:
```typescript
// Calculate real trading costs
function calculateRealSpread(symbol: string): Promise<number> {
  // Binance orderbook spread
  // + Estimated trading fees
  // + Basic slippage estimation
  // = Real trading cost in bps
}
```

### **Week 2: Observability Implementation**

**Health Dashboard Structure**:
```typescript
interface SystemHealth {
  timestamp: number;
  dayGate: {
    status: 'TRADABLE' | 'NO_TRADE';
    reasons: string[];
    confidence: number;
  };
  universe: {
    size: number;
    symbols: string[];
    turnover: number;
  };
  dataQuality: {
    average: number;
    bySymbol: Record<string, number>;
    freshness: number;
  };
  pipeline: {
    lastRun: number;
    duration: number;
    errors: string[];
  };
}
```

### **Week 3: Calibration Framework**

**Policy Validation Logic**:
```typescript
interface PolicyAnalysis {
  spreadThresholds: {
    current: [number, number, number];
    distribution: number[];
    recommendation: [number, number, number];
    rationale: string;
  };
  volatilityThreshold: {
    current: number;
    offFrequency: number;
    recommendation: number;
    rationale: string;
  };
  // ... other policies
}
```

## 🚨 **Risk Mitigation**

### **Week 1 Risks**
- **Binance API limits**: Implement rate limiting + caching
- **Data quality issues**: Graceful degradation + fallbacks
- **Pipeline failures**: Circuit breakers + retry logic

### **Week 2 Risks**  
- **Dashboard performance**: Cache data, limit refresh rate
- **Alert fatigue**: Tune thresholds, escalation policies
- **Monitoring overhead**: Lightweight metrics, async logging

### **Week 3 Risks**
- **Overfitting to short period**: Use longer calibration window
- **Parameter instability**: Gradual changes, A/B testing
- **Market regime changes**: Monitor policy effectiveness over time

### **Week 4 Risks**
- **Runbook complexity**: Keep procedures simple, test regularly
- **Documentation drift**: Automated doc generation where possible
- **Operational burden**: Automate common tasks, clear escalation

## 🎯 **Success Metrics**

### **Technical Metrics**
- **Uptime**: >99% pipeline availability
- **Data Quality**: >95% completeness average
- **Performance**: <30s pipeline execution time
- **Error Rate**: <5% failed runs

### **Operational Metrics**
- **Usability**: 20-40% days OFF (disciplined but usable)
- **Stability**: <20% universe turnover per week
- **Responsiveness**: <5 minutes alert-to-action time
- **Reliability**: <1 hour mean-time-to-recovery

### **Business Metrics**
- **Risk Management**: Zero uncontrolled trading days
- **Cost Control**: Spread estimation within 20% of actual
- **Operational Efficiency**: <2 hours/week maintenance time
- **Scalability**: Support 50+ symbols without degradation

## 💡 **Conclusion**

**4 settimane per passare da "build is green" a "desk-grade operational"**:

1. **Week 1**: Dati reali → Sistema funziona con mercato vero
2. **Week 2**: Observability → Vediamo cosa succede  
3. **Week 3**: Calibrazione → Parametri validati su dati reali
4. **Week 4**: Production → Runbook e procedure operative

**Dopo 4 settimane**: Sistema operativo che autorizza trading con disciplina, basato su dati reali, con monitoring e procedure di recovery.

**Focus**: Operatività pratica, non perfezione accademica. L'affidabilità è noiosa, ma è quello che conta in produzione.

---

*"Tra quando divento ricco?" - Appena il circuit breaker smette di interrompere i sogni e inizia a interrompere le perdite.* 😄