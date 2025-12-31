# Tradelia AI - Dashboard Intraday / MCE Project Overview

*Panoramica completa del progetto per sviluppo locale*

---

## 🎯 **Vision & Obiettivo**

**Dashboard Interna Tradelia AI** - Primo step dell'infrastruttura AI per trading intraday con setup chiavi in mano.

### Principi Fondamentali
- **MAX Architecture**: Architettura massimale, attivazione progressiva
- **Free-First**: Iniziare con infrastruttura a costo zero
- **Determinismo Assoluto**: Same input → Same output (bit-per-bit)
- **Strategy Agnostic**: Vincola selezione strategica, non implica azioni di trading

---

## 🏗️ **Architettura Generale**

```
┌─────────────────────────────────────────────────────────────┐
│                    TRADELIA DASHBOARD                       │
│                   (Vercel + Next.js)                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                MARKET CONTEXT ENGINE                        │
│              (GitHub Actions + Supabase)                   │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Ingestion  │  │ Classifier  │  │    Regime Cache     │ │
│  │   (5min)    │  │   (5min)    │  │   (API Ready)       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  BINANCE API                                │
│              (Free Tier - REST)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧱 **Market Context Engine (MCE) - Brick #1**

### Cosa È
Il **primo mattoncino obbligatorio** per un'infrastruttura di trading AI accademicamente rigorosa. Implementa **Canonical Event Log + Replay Deterministico** per classificazione falsificabile dei regimi di mercato.

### Cosa Fa
- **Ingestion**: Raccoglie dati da Binance ogni 5 minuti
- **Classification**: Calcola regime di mercato (trend + volatility)
- **Storage**: Mantiene storico deterministico per replay
- **API**: Serve dati classificati alla dashboard

### Output Canonico
```json
{
  "as_of_ts": 1730000000000,
  "symbol": "BTCUSDT",
  "price_regime": {
    "trend": "range",           // up | down | range
    "volatility": "compressed"  // compressed | normal | expanded
  },
  "confidence": 0.81,
  "data_quality": {
    "missing_pct": 0.2,
    "late_events_pct": 1.1,
    "coverage_pct": 99.8
  }
}
```

---

## 💰 **Infrastruttura FREE TIER**

### Stack Tecnologico (Costo: $0/mese)
- **Frontend**: Vercel Hobby (dashboard esistente)
- **Backend**: GitHub Actions (MCE engine schedulato)
- **Database**: Supabase Free (cache + recent data)
- **Storage**: GitHub Repository (dati storici)
- **API**: Binance REST (free tier)

### Limiti e Workaround
| Servizio | Limite | Workaround |
|----------|--------|------------|
| Vercel | 100GB bandwidth | Cache API responses |
| GitHub Actions | 2000 min/mese | Batch processing, smart scheduling |
| Supabase | 500MB database | 7-day rolling window + cleanup |
| Binance | Rate limits | REST calls ogni 5 minuti |

---

## 📊 **Status Attuale del Progetto**

### ✅ **COMPLETATO**
- **Requirements**: EARS-compliant, 10 requirements principali
- **Architecture**: Design v2 separato e pulito
- **Output Format**: Canonical JSON specification
- **KPI Metrics**: Validation criteria (non-PnL based)
- **Free Tier Plan**: Implementazione dettagliata con codice
- **Documentation**: Struttura best-practice completa

### 🔄 **IN PROGRESS**
- **Implementation**: Pronto per iniziare
- **Dashboard Integration**: Da integrare endpoint MCE

### ⏳ **TODO**
- Setup GitHub Actions workflows
- Configurazione Supabase database
- Integrazione API nella dashboard Vercel
- Testing end-to-end

---

## 📁 **Struttura File del Progetto**

### Core Specification
```
.kiro/specs/market-context-engine/
├── requirements.md          # EARS requirements (workflow)
└── tasks.md                 # Implementation plan (workflow)
```

### Reference Documentation
```
docs/
├── README.md                # Navigation hub
├── project-overview.md      # QUESTO FILE
├── mce-design-v2.md         # Architecture reference
├── mce-canonical-output-v2.md # Output format spec
├── mce-validation-kpi-v2.md   # KPI metrics reference
└── mce-free-tier-architecture.md # Implementation guide
```

---

## 🎯 **Roadmap di Implementazione**

### **Week 1: Foundation Setup**
- [ ] Setup GitHub Actions workflows
- [ ] Configurare Supabase free tier database
- [ ] Implementare Binance REST client
- [ ] Creare basic regime classifier

### **Week 2: Integration**
- [ ] Integrare MCE API endpoints in dashboard Vercel
- [ ] Implementare data cleanup automatico
- [ ] Aggiungere error handling e retry logic
- [ ] Testing end-to-end completo

### **Future Bricks (Post-MVP)**
- **Brick #2**: Advanced classifiers (Leverage + Behavioral)
- **Brick #3**: Multi-source ingestion (Bybit)
- **Brick #4**: Real-time WebSocket (quando budget disponibile)
- **Brick #5**: API layer + Redis caching

---

## 🔧 **Componenti Tecnici Chiave**

### 1. GitHub Actions Workflows
- **mce-ingestion.yml**: Ogni 5 minuti, fetch da Binance
- **mce-cleanup.yml**: Daily, pulizia dati vecchi
- **Scripts**: Node.js per ingestion, classification, cleanup

### 2. Supabase Database
- **events_recent**: 7-day rolling window
- **regime_cache**: Latest classifications per symbol
- **system_metrics**: Health monitoring

### 3. Vercel API Routes
- **GET /api/mce/regime/[symbol]**: Regime data
- **GET /api/mce/health**: System status
- Cache-first, fast responses (<100ms)

### 4. Dashboard Integration
- Nuova sezione "Intraday" nella dashboard esistente
- Widget regime display per BTCUSDT, ETHUSDT
- Health status indicator

---

## 📈 **KPI di Validazione**

### Core Determinism (Non-negoziabili)
- **Determinism Hash Match**: 100%
- **Event Processing Success**: >99.9%
- **Schema Validation Pass**: >99.95%

### Data Quality
- **Missing Events Rate**: <0.01%
- **Late Events Rate**: <1%
- **Data Coverage**: >99.5%

### Performance (Realistici)
- **API Response Time**: <100ms
- **Ingestion Lag**: <10 minuti
- **Memory Usage**: <100MB steady state

---

## 🚨 **Rischi e Mitigazioni**

### Rischi Tecnici
- **GitHub Actions Limits**: Mitigato con batch processing
- **Supabase Storage**: Mitigato con cleanup automatico
- **Binance Rate Limits**: Mitigato con 5-min intervals

### Rischi di Business
- **Free Tier Changes**: Plan di upgrade definito
- **Data Quality**: Monitoring e alerting automatico
- **Scalability**: Architettura progettata per upgrade incrementali

---

## 🎮 **Come Usare Questa Overview**

### Per Development
1. **Leggi Architecture**: `mce-design-v2.md`
2. **Controlla Tasks**: `.kiro/specs/market-context-engine/tasks.md`
3. **Implementa**: Segui `mce-free-tier-architecture.md`

### Per Review
1. **Requirements**: `.kiro/specs/market-context-engine/requirements.md`
2. **Output Format**: `mce-canonical-output-v2.md`
3. **KPI Validation**: `mce-validation-kpi-v2.md`

### Per Debugging
1. **Health Check**: `/api/mce/health`
2. **GitHub Actions**: Logs nei workflow
3. **Supabase**: Query dirette su system_metrics

---

## 🎯 **Next Actions**

### Immediate (Oggi)
- [ ] Review completo di questa overview
- [ ] Decisione su quale componente iniziare
- [ ] Setup ambiente di sviluppo locale

### This Week
- [ ] Implementazione primo workflow GitHub Actions
- [ ] Setup Supabase database con migration
- [ ] Test ingestion da Binance API

### Next Week
- [ ] Integrazione API nella dashboard
- [ ] Testing end-to-end
- [ ] Deploy e monitoring

---

*Ultimo aggiornamento: Dicembre 2024*
*Versione: 1.0 - MVP Ready*