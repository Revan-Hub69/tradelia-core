# Tradelia AI - Dashboard Intraday

Tradelia è una piattaforma educativa per il trading di criptovalute che combina contenuti didattici, strumenti di analisi e **Market Context Engine (MCE)** per classificazione deterministica dei regimi di mercato intraday.

## 🎯 Progetto Attuale: Dashboard Intraday + MCE

**Obiettivo**: Primo step dell'infrastruttura AI per trading intraday con setup chiavi in mano.

### Principi Fondamentali
- **MAX Architecture**: Architettura massimale, attivazione progressiva
- **Free-First**: Infrastruttura a costo zero ($0/mese)
- **Determinismo Assoluto**: Same input → Same output (bit-per-bit)
- **Strategy Agnostic**: Vincola selezione strategica, non implica azioni di trading

## 📋 Documentazione Completa

**🎯 OVERVIEW PRINCIPALE**: [`docs/project-overview.md`](docs/project-overview.md)

### Market Context Engine (MCE)
- **[Requirements](/.kiro/specs/market-context-engine/requirements.md)** - EARS-compliant requirements
- **[Tasks](/.kiro/specs/market-context-engine/tasks.md)** - Implementation plan
- **[Architecture](docs/mce-design-v2.md)** - System design
- **[Output Format](docs/mce-canonical-output-v2.md)** - Canonical JSON specification
- **[KPI Metrics](docs/mce-validation-kpi-v2.md)** - Validation criteria
- **[Free Tier Implementation](docs/mce-free-tier-architecture.md)** - Zero-cost deployment

## 🏗️ Architettura Attuale

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

## 💰 Stack FREE TIER (Costo: $0/mese)

- **Frontend**: Vercel Hobby (dashboard esistente)
- **Backend**: GitHub Actions (MCE engine schedulato)
- **Database**: Supabase Free (cache + recent data)
- **Storage**: GitHub Repository (dati storici)
- **API**: Binance REST (free tier)

## 🚀 Status Implementazione

### ✅ COMPLETATO
- Requirements (EARS-compliant)
- Architecture design (v2)
- Output format specification
- KPI validation metrics
- Free tier implementation plan
- Documentation completa

### 🔄 IN PROGRESS
- Setup GitHub Actions workflows
- Supabase database configuration
- Dashboard API integration

## Stack Tecnologico Base

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **AI**: Market regime classification

## Getting Started

1. **Leggi la Overview Completa**
   ```bash
   # Apri in browser o editor
   docs/project-overview.md
   ```

2. **Setup Ambiente di Sviluppo**
   ```bash
   git clone [repository-url]
   cd tradelia
   npm install
   cp .env.local.example .env.local
   npm run dev
   ```

3. **Implementazione MCE**
   - Segui [`docs/mce-free-tier-architecture.md`](docs/mce-free-tier-architecture.md)
   - Tasks in [`.kiro/specs/market-context-engine/tasks.md`](.kiro/specs/market-context-engine/tasks.md)

## 📊 MCE Output Example

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

## 🎯 Next Steps

1. **Review**: [`docs/project-overview.md`](docs/project-overview.md)
2. **Implement**: Follow MCE implementation guide
3. **Deploy**: GitHub Actions + Supabase setup
4. **Integrate**: MCE API endpoints in dashboard

## Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.