# Challenge Setup System - Vincere le Challenges

## Obiettivo: Setup Perfetto per Massimizzare Vincite

---

## 1. Sistema di Setup Pre-Challenge

### A. Challenge Analyzer (Prima di Iniziare)

**Dati da raccogliere per ogni challenge:**

```typescript
type ChallengeSetup = {
  // Identificazione
  programId: string;
  offerId: string;
  accountSize: number;
  
  // Regole Critiche
  profitTarget: number;        // % da raggiungere
  maxDrawdown: number;         // % massima perdita
  maxDailyLoss: number;        // % perdita giornaliera
  minTradingDays: number;      // giorni minimi
  timeLimit: number;           // giorni a disposizione
  
  // Setup Calcolato
  dailyTarget: number;         // profitto giornaliero necessario
  maxPositionSize: number;     // dimensione massima posizione
  riskPerTrade: number;        // % rischio per trade
  maxTradesPerDay: number;     // numero max trade giornalieri
};
```

**Calcolatore Automatico:**
```typescript
function calculateChallengeSetup(challenge: Challenge): ChallengeSetup {
  const daysAvailable = challenge.timeLimit;
  const profitNeeded = challenge.profitTarget;
  
  // Target giornaliero conservativo (80% del teorico)
  const dailyTarget = (profitNeeded / daysAvailable) * 0.8;
  
  // Risk management: max 1% per trade
  const riskPerTrade = 1;
  
  // Position sizing: basato su volatilità
  const maxPositionSize = calculatePositionSize(
    challenge.accountSize,
    riskPerTrade,
    challenge.maxDailyLoss
  );
  
  return {
    ...challenge,
    dailyTarget,
    riskPerTrade,
    maxPositionSize,
    maxTradesPerDay: Math.floor(challenge.maxDailyLoss / riskPerTrade)
  };
}
```

### B. Pre-Challenge Checklist

**Da completare PRIMA di iniziare:**

- [ ] **Account Setup**
  - [ ] Verificare connessione piattaforma (MT4/MT5/cTrader)
  - [ ] Testare latency server (ping < 50ms)
  - [ ] Configurare timezone corretto
  - [ ] Impostare leva finanziaria corretta

- [ ] **Risk Management Setup**
  - [ ] Impostare stop loss automatico su ogni trade
  - [ ] Configurare max daily loss alert
  - [ ] Impostare trailing stop quando in profitto
  - [ ] Definire orari di trading (evitare news)

- [ ] **Strategy Setup**
  - [ ] Scegliere max 3 coppie di valute
  - [ ] Definire timeframe principale (H1/H4)
  - [ ] Impostare indicatori (max 3)
  - [ ] Backtest strategy su account demo

- [ ] **Mental Preparation**
  - [ ] Definire orario inizio/fine trading
  - [ ] Preparare piano per giorni di perdita
  - [ ] Impostare reminder pausa ogni 2 ore

---

## 2. Tracker Progresso Challenge

### Dashboard Personale

```typescript
type ChallengeProgress = {
  // Stato
  status: 'active' | 'passed' | 'failed' | 'pending';
  
  // Progresso
  daysElapsed: number;
  daysRemaining: number;
  currentProfit: number;        // % profitto attuale
  profitRemaining: number;      // % mancante al target
  
  // Metriche
  winRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  maxDrawdownReached: number;
  
  // Previsioni
  projectedCompletion: Date;
  probabilityOfSuccess: number; // 0-100%
  
  // Alert
  alerts: Alert[];
};

type Alert = {
  type: 'warning' | 'danger' | 'info';
  message: string;
  action?: string;
};
```

### Visualizzazione Progresso

**Componente ChallengeProgressCard:**

```
┌─────────────────────────────────────┐
│  FTMO Challenge - $50K             │
│  Giorno 12/30 - 40% completato     │
├─────────────────────────────────────┤
│                                     │
│  Profitto: 4.2% / 10% target       │
│  ████████░░░░░░░░░░ 42%            │
│                                     │
│  Drawdown: 2.1% / 10% max          │
│  ███░░░░░░░░░░░░░░░ 21%            │
│                                     │
│  Daily Target: 0.33%               │
│  Oggi: +0.45% ✅                   │
│                                     │
│  Probabilità Successo: 78%         │
│  Fine stimata: 18 Feb 2026         │
│                                     │
├─────────────────────────────────────┤
│ ⚠️ Alert: Sei vicino al daily loss │
└─────────────────────────────────────┘
```

---

## 3. Sistema Alert Intelligente

### Alert Automatici

**1. Alert Giornalieri**
- Morning Briefing (8:00 AM): "Oggi devi fare 0.33% di profitto"
- Mid-day Check (12:00 PM): "Sei a +0.15%, mancano 0.18%"
- End of Day (5:00 PM): "Target raggiunto! Stop trading"

**2. Alert di Rischio**
```typescript
const riskAlerts = {
  dailyLoss75: {
    trigger: (dd) => dd >= maxDailyLoss * 0.75,
    message: "⚠️ Sei al 75% del daily loss. Riduci il rischio!",
    action: "Riduci size del 50%"
  },
  
  dailyLoss90: {
    trigger: (dd) => dd >= maxDailyLoss * 0.90,
    message: "🛑 STOP! Sei al 90% del daily loss. Chiudi tutto!",
    action: "Chiudi tutte le posizioni"
  },
  
  drawdown50: {
    trigger: (dd) => dd >= maxDrawdown * 0.50,
    message: "⚠️ Drawdown al 50%. Rivedi la strategia",
    action: "Analizza ultimi 10 trade"
  },
  
  behindSchedule: {
    trigger: (progress, days) => progress < (days/totalDays) * target,
    message: "📉 Sei indietro con il target. Aggiungi un trade?",
    action: "Valuta opportunità"
  }
};
```

**3. Alert di Opportunità**
- "Oggi hai raggiunto il target in 2 ore. Puoi smettere o continuare con cautela"
- "Sei in streak di 3 giorni positivi. Considera di ridurre il rischio"

---

## 4. Challenge Strategy Templates

### Template Conservativo (Raccomandato)

```yaml
Nome: "Steady Winner"
Descrizione: "Basso rischio, alta probabilità di successo"

Parametri:
  RiskPerTrade: 0.5%        # Metà del normale
  MaxTradesPerDay: 3
  TargetDaily: 0.33%        # Minimo richiesto
  Pairs: [EURUSD, GBPUSD]   # Solo 2 coppie
  Timeframe: H1
  
Regole:
  - Solo trade con trend daily
  - Solo A+ setups
  - Stop trading dopo 2 loss consecutive
  - Non tradare prima delle 9:00 o dopo le 17:00
  
ExpectedOutcome:
  WinRate: 55%
  ProfitFactor: 1.5
  SuccessProbability: 85%
  AvgCompletionDays: 25
```

### Template Aggressivo

```yaml
Nome: "Fast Pass"
Descrizione: "Alto rischio, completamento rapido"

Parametri:
  RiskPerTrade: 1.0%
  MaxTradesPerDay: 6
  TargetDaily: 0.5%
  Pairs: [EURUSD, GBPUSD, USDJPY, XAUUSD]
  Timeframe: M15/H1
  
Regole:
  - Trade con trend H1
  - A e B setups accettati
  - Max 3 loss consecutive poi stop
  
ExpectedOutcome:
  WinRate: 45%
  ProfitFactor: 1.3
  SuccessProbability: 65%
  AvgCompletionDays: 15
```

---

## 5. Post-Trade Analysis

### Journal Automatico

```typescript
type TradeJournal = {
  // Trade Data
  entryDate: Date;
  exitDate: Date;
  pair: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  size: number;
  pnl: number;
  pnlPercent: number;
  
  // Analysis
  setupType: 'A' | 'B' | 'C';
  entryQuality: 1-10;
  exitQuality: 1-10;
  emotions: 'calm' | 'fomo' | 'fear' | 'greed';
  
  // Learning
  whatWorked: string;
  whatDidnt: string;
  lesson: string;
};
```

### Report Settimanale

```
WEEKLY CHALLENGE REPORT
Week 2 of 4 - FTMO $50K

Performance:
- Profit: +2.1% (Target: +2.0%) ✅
- Win Rate: 58% (12W / 8L)
- Profit Factor: 1.6
- Max Drawdown: 1.2%

Analysis:
- Best Day: +0.8% (Tuesday)
- Worst Day: -0.4% (Thursday)
- Avg Trade: +0.12%

Improvements:
- Thursday: Entered during high-impact news
- Action: Add news filter to strategy

Next Week Goal: +2.0% (cumulative +4.1%)
```

---

## 6. Database Schema

### Tabelle Necessarie

```sql
-- Challenge Setups utente
CREATE TABLE user_challenge_setups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  enrollment_id UUID REFERENCES user_enrollments(id),
  
  -- Setup scelto
  strategy_template TEXT, -- 'conservative' | 'aggressive' | 'custom'
  
  -- Parametri
  risk_per_trade DECIMAL(4,2),
  max_trades_per_day INTEGER,
  selected_pairs TEXT[],
  trading_hours_start TIME,
  trading_hours_end TIME,
  
  -- Checklist completata
  checklist_completed JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Progresso giornaliero
CREATE TABLE challenge_daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES user_enrollments(id),
  date DATE NOT NULL,
  
  -- Metriche giornaliere
  starting_balance DECIMAL(12,2),
  ending_balance DECIMAL(12,2),
  profit_loss DECIMAL(12,2),
  profit_loss_pct DECIMAL(5,2),
  
  -- Trade
  trades_count INTEGER,
  wins INTEGER,
  losses INTEGER,
  
  -- Analisi
  target_met BOOLEAN,
  max_drawdown_reached DECIMAL(5,2),
  
  UNIQUE(enrollment_id, date)
);

-- Journal trades
CREATE TABLE challenge_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES user_enrollments(id),
  
  -- Trade details
  pair TEXT,
  direction TEXT,
  entry_time TIMESTAMPTZ,
  exit_time TIMESTAMPTZ,
  entry_price DECIMAL(12,5),
  exit_price DECIMAL(12,5),
  size DECIMAL(12,2),
  pnl DECIMAL(12,2),
  pnl_pct DECIMAL(5,2),
  
  -- Analisi
  setup_type TEXT,
  entry_quality INTEGER,
  exit_quality INTEGER,
  notes TEXT
);
```

---

## 7. Implementazione Frontend

### Componenti da Creare

1. **ChallengeSetupWizard**
   - Step 1: Seleziona strategy template
   - Step 2: Configura parametri
   - Step 3: Completa checklist
   - Step 4: Conferma e inizia

2. **ChallengeProgressDashboard**
   - Progresso visual
   - Metriche chiave
   - Alert attivi
   - Prossimi milestone

3. **TradeEntryForm**
   - Input rapido trade
   - Calcolo automatico position size
   - Check risk limits
   - Salva in journal

4. **DailyReportCard**
   - Riassunto giornaliero
   - Confronto con target
   - Suggerimenti per domani

---

## Next Steps

1. **Priorità Alta:**
   - Creare tabella `user_challenge_setups`
   - Implementare ChallengeSetupWizard
   - Creare alert system

2. **Priorità Media:**
   - Trade journal
   - Daily progress tracking
   - Weekly reports

3. **Priorità Bassa:**
   - Advanced analytics
   - Strategy backtesting
   - Community features
