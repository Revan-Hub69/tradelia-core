# Challenge Data Collection Plan - Comprehensive Research 2026

**Date**: 2026-01-26  
**Status**: 🔴 RESEARCH PHASE  
**Goal**: Raccogliere TUTTI i dati necessari per capire ogni challenge/torneo/competizione

---

## 🎯 OBIETTIVO

Creare un database completo e accurato di:
1. **Competizioni Gratuite** (paper trading, demo, tornei)
2. **Prop Firm Challenges** (evaluation, instant funding)
3. **Tornei Ricorrenti** (mensili, trimestrali, annuali)
4. **Eventi Speciali** (one-time, stagionali)

---

## 📊 DATI DA RACCOGLIERE PER OGNI CHALLENGE

### 1. IDENTIFICAZIONE BASE
- [ ] Nome completo
- [ ] Prop Firm / Organizzatore
- [ ] Tipo (Free Competition / Paid Evaluation / Instant Funding / Tournament)
- [ ] Sottotipo (Paper Trading / Demo / Live / Sim)
- [ ] URL ufficiale
- [ ] Logo/Immagine

### 2. COSTI & PREMI
- [ ] Entry Fee (o FREE)
- [ ] Valuta (USD, EUR, etc.)
- [ ] Refundable? (Sì/No + condizioni)
- [ ] Prize Pool (per competizioni)
- [ ] Account Size (capitale virtuale/reale)
- [ ] Scaling Potential (max account raggiungibile)

### 3. PROFIT SPLIT & PAYOUT
- [ ] Profit Split iniziale (%)
- [ ] Profit Split dopo scaling (%)
- [ ] Profit Split massimo (%)
- [ ] Payout Speed (instant, same_day, 24h, weekly, bi-weekly, monthly)
- [ ] First Payout Delay (giorni)
- [ ] Payout Methods (bank, crypto, PayPal, etc.)
- [ ] Minimum Withdrawal

### 4. REGOLE & OBIETTIVI
- [ ] Profit Target (%)
- [ ] Max Daily Loss (%)
- [ ] Max Drawdown (%)
- [ ] Min Trading Days
- [ ] Max Trading Days
- [ ] Time Limit (giorni totali)
- [ ] Consistency Rule (se presente)
- [ ] Weekend Holding (allowed/not allowed)
- [ ] News Trading (allowed/not allowed)
- [ ] EA/Bots (allowed/not allowed)

### 5. MERCATI & STRUMENTI
- [ ] Markets Available (Forex, Futures, Stocks, Crypto, Indices, Commodities)
- [ ] Instruments List (EUR/USD, NQ, BTC, etc.)
- [ ] Leverage
- [ ] Trading Hours
- [ ] Platforms (MT4, MT5, cTrader, TradingView, etc.)

### 6. TIMING & DISPONIBILITÀ
- [ ] Status (Active, Upcoming, Ended, Recurring)
- [ ] Start Date (se fisso)
- [ ] End Date (se fisso)
- [ ] Registration Deadline
- [ ] Recurring? (Yes/No)
- [ ] Frequency (Monthly, Quarterly, Annual, Always Open)
- [ ] Next Edition Date

### 7. REQUISITI & RESTRIZIONI
- [ ] Geographic Restrictions (paesi esclusi)
- [ ] Age Requirement
- [ ] KYC Required? (Yes/No)
- [ ] Previous Experience Required?
- [ ] Max Participants
- [ ] Registration Process

### 8. VALUTAZIONE & TRUST
- [ ] Firm Reputation (0-100)
- [ ] Years in Business
- [ ] Total Paid Out (lifetime)
- [ ] Active Traders Count
- [ ] Success Rate (% che passano)
- [ ] Average Pass Time (giorni)
- [ ] User Reviews Rating
- [ ] Trustpilot Score

### 9. PROS & CONS
- [ ] 3-5 Pros (vantaggi principali)
- [ ] 3-5 Cons (svantaggi principali)
- [ ] Best For (tipo di trader ideale)
- [ ] Not Recommended For

### 10. EXTRA INFO
- [ ] Description (100-200 parole)
- [ ] Special Features
- [ ] Unique Selling Points
- [ ] Comparison vs Competitors

---

## 🏢 PROP FIRMS DA ANALIZZARE (Priority Order)

### Tier 1 - Top Firms (Must Have)
1. **FTMO** - Leader mondiale
2. **FundedNext** - Fast growing
3. **The5ers** - Instant funding
4. **MyForexFunds** - High splits
5. **E8 Funding** - Flexible rules

### Tier 2 - Popular Firms
6. **The Funded Trader**
7. **Apex Trader Funding**
8. **TopStep**
9. **Earn2Trade**
10. **Lux Trading Firm**

### Tier 3 - Emerging Firms
11. **Blue Guardian**
12. **FXIFY**
13. **True Forex Funds**
14. **Funding Pips**
15. **Skilled Funded Trader**

---

## 🎮 FREE COMPETITIONS DA ANALIZZARE

### Paper Trading Competitions
1. **TradingView The Leap** - Quarterly, $1M+ prizes
2. **TradingView Paper Trading** - Always open
3. **Deriv Tournaments** - Monthly
4. **Gate.io Demo Challenge** - Monthly
5. **Binance Futures Demo** - Quarterly

### Broker Tournaments
6. **XM Trading Contest**
7. **FBS Competitions**
8. **OctaFX Contest**
9. **RoboForex Tournaments**
10. **Exness Competitions**

---

## 📋 RESEARCH WORKFLOW

### Phase 1: Data Collection (2-3 ore)
Per ogni firm/competition:
1. Visitare sito ufficiale
2. Leggere Terms & Conditions
3. Verificare pricing page
4. Controllare FAQ
5. Cercare reviews (Trustpilot, Reddit, YouTube)
6. Verificare date e availability

### Phase 2: Data Verification (1 ora)
1. Cross-check informazioni su più fonti
2. Verificare date di inizio/fine
3. Confermare costi e regole
4. Validare reputation scores

### Phase 3: Database Update (1 ora)
1. Creare migration SQL con tutti i dati
2. Aggiornare schema se necessario
3. Inserire dati via Supabase MCP
4. Verificare integrità dati

### Phase 4: Documentation (30 min)
1. Documentare fonti
2. Note su dati incerti
3. TODO per follow-up

---

## 🔍 FONTI AFFIDABILI

### Official Sources (Priority 1)
- Siti ufficiali prop firms
- Terms & Conditions pages
- Pricing pages
- FAQ sections

### Review Aggregators (Priority 2)
- Trustpilot
- Reddit r/Forex, r/FundedTrading
- YouTube reviews (verificati)
- PropFirms.com comparisons

### Community Sources (Priority 3)
- Discord communities
- Telegram groups
- Twitter/X discussions

---

## 📊 TEMPLATE DATI (Per Ogni Challenge)

```json
{
  "id": "ftmo-10k-challenge",
  "name": "FTMO Challenge $10,000",
  "firm": "FTMO",
  "type": "paid_evaluation",
  "subtype": "demo_sim",
  "challenge_type": "2-step",
  
  "cost": {
    "entry_fee": 155,
    "currency": "EUR",
    "refundable": true,
    "refund_conditions": "On first profit split"
  },
  
  "account": {
    "size": 10000,
    "currency": "USD",
    "leverage": "1:100",
    "scaling_max": 200000
  },
  
  "profit_split": {
    "initial": 80,
    "scaled": 90,
    "maximum": 90
  },
  
  "payout": {
    "speed": "bi_weekly",
    "first_delay_days": 14,
    "methods": ["bank", "crypto"],
    "minimum": 50
  },
  
  "rules": {
    "profit_target": 10,
    "max_daily_loss": 5,
    "max_drawdown": 10,
    "min_trading_days": 4,
    "time_limit_days": 30,
    "consistency_rule": "Best day max 30% of total profit",
    "weekend_holding": true,
    "news_trading": true,
    "ea_allowed": true
  },
  
  "markets": {
    "available": ["forex", "indices", "commodities", "crypto"],
    "instruments": ["EUR/USD", "GBP/USD", "NQ", "ES", "BTC/USD"],
    "platforms": ["MT4", "MT5", "cTrader", "DXtrade"]
  },
  
  "timing": {
    "status": "active",
    "start_date": null,
    "end_date": null,
    "recurring": false,
    "frequency": "always_open"
  },
  
  "trust": {
    "reputation": 96,
    "founded": 2015,
    "total_paid": 150000000,
    "active_traders": 15000,
    "success_rate": 8,
    "avg_pass_days": 45,
    "trustpilot": 4.6
  },
  
  "description": "FTMO's flagship 2-step evaluation...",
  "pros": ["Excellent reputation", "Refundable fee", "Scaling to $200k"],
  "cons": ["Strict consistency rule", "5-10% pass rate"],
  "best_for": "Serious traders ready to invest in evaluation"
}
```

---

## ✅ SUCCESS CRITERIA

1. **Completezza**: Almeno 50 challenges documentate
2. **Accuratezza**: Tutti i dati verificati da fonti ufficiali
3. **Aggiornamento**: Date e status corretti (Gennaio 2026)
4. **Chiarezza**: Ogni campo compilato o marcato come N/A
5. **Usabilità**: Dati pronti per UI/UX design

---

## 🚀 NEXT STEPS

1. **START RESEARCH** - Iniziare con Tier 1 firms
2. **COLLECT DATA** - Seguire template sopra
3. **UPDATE DATABASE** - Via Supabase MCP
4. **DESIGN UI** - Solo DOPO aver capito tutti i dati
5. **IMPLEMENT** - Con gerarchia cognitiva chiara

---

**Status**: Ready to start research  
**Estimated Time**: 4-5 ore totali  
**Priority**: P0 - Blocca tutto il resto
