# Dashboard Challenge/Prop Firm - Requirements REALI 2026

**Data**: 26 Gennaio 2026  
**Tipo**: Analisi Tier1 Basata su Prodotti Esistenti  
**Obiettivo**: Sistema per gestire multiple challenge + signal generator AI

---

## Executive Summary: Il Vero Problema

### Cosa Serve DAVVERO

**Scenario reale:**
- Trader ha 3-5 challenge attive contemporaneamente (FTMO $10K, FundedNext $25K, The5ers $15K)
- Ogni challenge ha regole diverse (daily loss, drawdown, consistency)
- Serve monitorare TUTTE in real-time
- Serve generare segnali trading per tutte

**Prodotti esistenti analizzati:**
- **Tradevian**: Multi-account tracking + AI pattern recognition ($30/mese)
- **PropFlow**: Financial tracking per multiple prop firm
- **Trade Ideas**: AI signal generator ($118/mese)
- **TrendSpider**: Automated technical analysis ($39-$199/mese)

### Le 3 Sezioni CORE

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  1. CHALLENGE MANAGER                                   │
│     └─ Gestione multiple challenge/account              │
│     └─ Real-time rule monitoring                        │
│     └─ Violation alerts                                 │
│                                                          │
│  2. SIGNAL GENERATOR                                    │
│     └─ AI-powered trade signals                         │
│     └─ Multi-indicator analysis                         │
│     └─ Entry/Exit/SL/TP levels                          │
│                                                          │
│  3. TRADE EXECUTION TRACKER                             │
│     └─ Log trades per challenge                         │
│     └─ P&L tracking                                     │
│     └─ Performance analytics                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## SEZIONE 1: Challenge Manager (Multi-Account)

### 1.1 Challenge Overview Dashboard

**Vista principale:**


```
┌─────────────────────────────────────────────────────────────────────┐
│  ACTIVE CHALLENGES (3)                                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  FTMO $10K Normal - Phase 1                                  │  │
│  │  ────────────────────────────────────────────────────────────│  │
│  │  Balance: $10,680 (+6.8%)                                    │  │
│  │  Days: 23/30 remaining                                       │  │
│  │                                                               │  │
│  │  Profit Target:  ████████████░░░░░░░░ 68% ($680/$1,000)     │  │
│  │  Daily Loss:     ████████████████░░░░ 64% (-$320/-$500) ⚠️   │  │
│  │  Max Drawdown:   ████████░░░░░░░░░░░░ 45% (-$450/-$1,000)   │  │
│  │                                                               │  │
│  │  Status: ⚠️ APPROACHING DAILY LIMIT                          │  │
│  │  [View Details] [Add Trade] [Close Challenge]               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  FundedNext $25K Express                                     │  │
│  │  ────────────────────────────────────────────────────────────│  │
│  │  Balance: $26,200 (+4.8%)                                    │  │
│  │  Days: 12/14 remaining                                       │  │
│  │                                                               │  │
│  │  Profit Target:  ████████████████░░░░ 80% ($1,200/$1,500)   │  │
│  │  Daily Loss:     ████░░░░░░░░░░░░░░░░ 20% (-$250/-$1,250)   │  │
│  │  Max Drawdown:   ██████░░░░░░░░░░░░░░ 30% (-$750/-$2,500)   │  │
│  │                                                               │  │
│  │  Status: ✅ ON TRACK                                         │  │
│  │  [View Details] [Add Trade] [Close Challenge]               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  The5ers $15K Bootcamp                                       │  │
│  │  ────────────────────────────────────────────────────────────│  │
│  │  Balance: $15,900 (+6.0%)                                    │  │
│  │  Days: Unlimited                                             │  │
│  │                                                               │  │
│  │  Profit Target:  ████████████████████ 100% ($900/$900) ✅    │  │
│  │  Daily Loss:     ██░░░░░░░░░░░░░░░░░░ 10% (-$60/-$600)      │  │
│  │  Max Drawdown:   ████░░░░░░░░░░░░░░░░ 20% (-$300/-$1,500)   │  │
│  │                                                               │  │
│  │  Status: ✅ READY FOR VERIFICATION                           │  │
│  │  [View Details] [Request Verification]                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [+ Add New Challenge]                                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Challenge Data Model

```typescript
interface Challenge {
  // Identificazione
  id: string;
  name: string;                    // "FTMO $10K Normal"
  propFirm: PropFirm;              // FTMO, FundedNext, The5ers, etc.
  accountSize: number;             // 10000
  phase: 'challenge' | 'verification' | 'funded';
  
  // Timing
  startDate: Date;
  endDate: Date | null;            // null se unlimited
  daysRemaining: number;
  
  // Balance & P&L
  startingBalance: number;         // 10000
  currentBalance: number;          // 10680
  highWaterMark: number;           // 11000
  totalPnL: number;                // 680
  todayPnL: number;                // -320
  
  // Regole Challenge
  rules: ChallengeRules;
  
  // Status
  status: 'active' | 'passed' | 'failed' | 'pending_verification';
  violations: Violation[];
}

interface ChallengeRules {
  // Profit Target
  profitTarget: {
    amount: number;                // 1000
    percentage: number;            // 10%
    current: number;               // 680
    reached: boolean;
  };
  
  // Daily Loss Limit
  dailyLoss: {
    limit: number;                 // -500 (5%)
    current: number;               // -320
    percentage: number;            // 64%
    resetTime: string;             // "17:00 EST"
    status: 'safe' | 'warning' | 'critical';
  };
  
  // Max Drawdown
  maxDrawdown: {
    limit: number;                 // -1000 (10%)
    current: number;               // -450
    percentage: number;            // 45%
    calculationType: 'balance' | 'equity';
    highWaterMark: number;
  };
  
  // Consistency Rule (opzionale)
  consistency?: {
    maxDailyProfit: number;        // 30% del total profit
    bestTradingDay: number;
    compliant: boolean;
  };
  
  // Minimum Trading Days (opzionale)
  minTradingDays?: {
    required: number;              // 5
    completed: number;             // 3
    remaining: number;             // 2
  };
}

interface PropFirm {
  name: string;                    // "FTMO"
  logo: string;
  defaultRules: ChallengeRules;    // Template regole
  website: string;
}
```

### 1.3 Challenge Detail View

**Quando clicchi su una challenge:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  FTMO $10K Normal - Phase 1                          [Edit] [Close] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  OVERVIEW                                                    │   │
│  │  ────────────────────────────────────────────────────────────│   │
│  │  Starting Balance:    $10,000                                │   │
│  │  Current Balance:     $10,680 (+6.8%)                        │   │
│  │  High Water Mark:     $11,000                                │   │
│  │  Today's P&L:         -$320 (-3.2%)                          │   │
│  │  Total Trades:        47                                     │   │
│  │  Win Rate:            61.7%                                  │   │
│  │  Started:             Jan 3, 2026                            │   │
│  │  Days Remaining:      23 / 30                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  RULES COMPLIANCE                                            │   │
│  │  ────────────────────────────────────────────────────────────│   │
│  │                                                               │   │
│  │  ✅ Profit Target (10%)                                      │   │
│  │     $680 / $1,000 (68%)                                      │   │
│  │     ████████████░░░░░░░░                                     │   │
│  │                                                               │   │
│  │  ⚠️  Daily Loss Limit (5%)                                   │   │
│  │     -$320 / -$500 (64%)                                      │   │
│  │     ████████████████░░░░                                     │   │
│  │     Resets in: 4h 23m                                        │   │
│  │                                                               │   │
│  │  ✅ Max Drawdown (10%)                                       │   │
│  │     -$450 / -$1,000 (45%)                                    │   │
│  │     ████████░░░░░░░░░░░░                                     │   │
│  │     From HWM: $11,000                                        │   │
│  │                                                               │   │
│  │  ✅ Minimum Trading Days                                     │   │
│  │     3 / 5 days completed                                     │   │
│  │     ████████████░░░░░░░░                                     │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  EQUITY CURVE                                                │   │
│  │  ────────────────────────────────────────────────────────────│   │
│  │  $11,000 ┤                    ╭─╮                            │   │
│  │          │                  ╭─╯ ╰╮                           │   │
│  │  $10,500 ┤              ╭───╯    ╰─╮                         │   │
│  │          │          ╭───╯          ╰─╮                       │   │
│  │  $10,000 ┼──────────╯                ╰───────                │   │
│  │          │                                                    │   │
│  │   $9,500 ┤                                                    │   │
│  │          └────────────────────────────────────────────────   │   │
│  │          Jan 3      Jan 10      Jan 17      Jan 24           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  [View All Trades] [Export Data] [Performance Analytics]           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.4 Alert System

**Tipi di alert:**

```typescript
interface Alert {
  id: string;
  challengeId: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  dismissed: boolean;
}

enum AlertType {
  // Critical
  DAILY_LOSS_80 = 'daily_loss_80',           // 80% del daily limit
  DAILY_LOSS_90 = 'daily_loss_90',           // 90% del daily limit
  DRAWDOWN_80 = 'drawdown_80',               // 80% del max drawdown
  DRAWDOWN_90 = 'drawdown_90',               // 90% del max drawdown
  
  // Warning
  DAILY_LOSS_50 = 'daily_loss_50',           // 50% del daily limit
  DRAWDOWN_50 = 'drawdown_50',               // 50% del max drawdown
  DEADLINE_7_DAYS = 'deadline_7_days',       // 7 giorni alla scadenza
  DEADLINE_3_DAYS = 'deadline_3_days',       // 3 giorni alla scadenza
  
  // Info
  PROFIT_TARGET_REACHED = 'profit_target_reached',
  MIN_DAYS_COMPLETED = 'min_days_completed',
  CONSISTENCY_RISK = 'consistency_risk',     // Vicino al 30% rule
}
```

**Esempi alert:**

```typescript
const alerts: Alert[] = [
  {
    type: AlertType.DAILY_LOSS_80,
    severity: 'critical',
    message: '🚨 FTMO $10K: Daily loss at 80% (-$400/-$500). STOP TRADING TODAY.',
    action: 'Show modal, disable trade logging for today'
  },
  {
    type: AlertType.DRAWDOWN_90,
    severity: 'critical',
    message: '🚨 FundedNext $25K: Max drawdown at 90% (-$2,250/-$2,500). CLOSE POSITIONS NOW.',
    action: 'Flash red screen, sound alert, show close positions button'
  },
  {
    type: AlertType.DEADLINE_3_DAYS,
    severity: 'warning',
    message: '⏰ The5ers $15K: Challenge ends in 3 days. Profit target: 80% complete.',
    action: 'Daily reminder notification'
  },
  {
    type: AlertType.PROFIT_TARGET_REACHED,
    severity: 'info',
    message: '✅ FTMO $10K: Profit target reached! Complete min trading days to pass.',
    action: 'Celebration animation'
  }
];
```

---

## SEZIONE 2: Signal Generator (AI-Powered)

### 2.1 Signal Dashboard

**Vista principale segnali:**


```
┌─────────────────────────────────────────────────────────────────────┐
│  ACTIVE SIGNALS (8)                          [Filters] [Settings]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🟢 EURUSD - LONG                                Confidence: 87%│  │
│  │  ────────────────────────────────────────────────────────────│  │
│  │  Entry:    1.0850                                            │  │
│  │  SL:       1.0820 (-30 pips)                                 │  │
│  │  TP:       1.0910 (+60 pips)                                 │  │
│  │  R:R:      1:2                                               │  │
│  │                                                               │  │
│  │  Indicators:                                                  │  │
│  │  • RSI: 32 (oversold)                                        │  │
│  │  • MACD: Bullish crossover                                   │  │
│  │  • Price: Bouncing off 200 EMA                               │  │
│  │  • Volume: Above average (+45%)                              │  │
│  │                                                               │  │
│  │  Reasoning:                                                   │  │
│  │  Strong support at 1.0850 (tested 3x). RSI oversold +       │  │
│  │  bullish divergence. MACD crossover confirms momentum.       │  │
│  │                                                               │  │
│  │  Generated: 2 minutes ago                                    │  │
│  │  [Execute Trade] [Dismiss] [View Chart]                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🔴 GBPUSD - SHORT                               Confidence: 82%│  │
│  │  ────────────────────────────────────────────────────────────│  │
│  │  Entry:    1.2650                                            │  │
│  │  SL:       1.2680 (-30 pips)                                 │  │
│  │  TP:       1.2590 (+60 pips)                                 │  │
│  │  R:R:      1:2                                               │  │
│  │                                                               │  │
│  │  Indicators:                                                  │  │
│  │  • RSI: 71 (overbought)                                      │  │
│  │  • Price: Rejected at resistance 1.2650                      │  │
│  │  • Bearish engulfing candle                                  │  │
│  │  • Volume: Spike on rejection                                │  │
│  │                                                               │  │
│  │  Generated: 5 minutes ago                                    │  │
│  │  [Execute Trade] [Dismiss] [View Chart]                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🟡 GOLD - LONG                                  Confidence: 65%│  │
│  │  ────────────────────────────────────────────────────────────│  │
│  │  Entry:    2,045                                             │  │
│  │  SL:       2,035 (-$10)                                      │  │
│  │  TP:       2,065 (+$20)                                      │  │
│  │  R:R:      1:2                                               │  │
│  │                                                               │  │
│  │  Indicators:                                                  │  │
│  │  • Price: Testing 50 EMA support                             │  │
│  │  • Bollinger Bands: Lower band touch                         │  │
│  │  • Mixed signals - lower confidence                          │  │
│  │                                                               │  │
│  │  Generated: 12 minutes ago                                   │  │
│  │  [Execute Trade] [Dismiss] [View Chart]                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [Load More Signals]                                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Signal Data Model

```typescript
interface TradingSignal {
  // Identificazione
  id: string;
  symbol: string;                  // "EURUSD"
  direction: 'long' | 'short';
  
  // Timing
  generatedAt: Date;
  expiresAt: Date;                 // Signal valido per X ore
  
  // Livelli
  entry: number;                   // 1.0850
  stopLoss: number;                // 1.0820
  takeProfit: number;              // 1.0910
  riskReward: number;              // 2.0
  
  // Confidence & Reasoning
  confidence: number;              // 0-100
  indicators: Indicator[];
  reasoning: string;
  
  // Market Context
  marketCondition: 'trending' | 'ranging' | 'volatile';
  timeframe: string;               // "H1", "H4", "D1"
  
  // Status
  status: 'active' | 'executed' | 'expired' | 'dismissed';
  executedTrade?: string;          // Trade ID se eseguito
}

interface Indicator {
  name: string;                    // "RSI"
  value: number | string;          // 32 o "oversold"
  signal: 'bullish' | 'bearish' | 'neutral';
  weight: number;                  // Importanza 0-1
}
```

### 2.3 Signal Generation Logic

**Multi-Indicator Analysis:**

```typescript
class SignalGenerator {
  async generateSignal(symbol: string): Promise<TradingSignal | null> {
    // 1. Fetch market data
    const data = await this.getMarketData(symbol, 'H1', 100);
    
    // 2. Calculate indicators
    const indicators = {
      rsi: this.calculateRSI(data, 14),
      macd: this.calculateMACD(data),
      ema20: this.calculateEMA(data, 20),
      ema50: this.calculateEMA(data, 50),
      ema200: this.calculateEMA(data, 200),
      bb: this.calculateBollingerBands(data, 20, 2),
      volume: this.analyzeVolume(data),
      support: this.findSupport(data),
      resistance: this.findResistance(data)
    };
    
    // 3. Analyze confluence
    const analysis = this.analyzeConfluence(indicators, data);
    
    // 4. Generate signal if confidence > threshold
    if (analysis.confidence >= 70) {
      return {
        symbol,
        direction: analysis.direction,
        entry: analysis.entry,
        stopLoss: analysis.stopLoss,
        takeProfit: analysis.takeProfit,
        confidence: analysis.confidence,
        indicators: analysis.supportingIndicators,
        reasoning: analysis.reasoning,
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 ore
      };
    }
    
    return null;
  }
  
  private analyzeConfluence(indicators: any, data: any): Analysis {
    let bullishSignals = 0;
    let bearishSignals = 0;
    let supportingIndicators: Indicator[] = [];
    
    // RSI Analysis
    if (indicators.rsi < 30) {
      bullishSignals++;
      supportingIndicators.push({
        name: 'RSI',
        value: indicators.rsi,
        signal: 'bullish',
        weight: 0.8
      });
    } else if (indicators.rsi > 70) {
      bearishSignals++;
      supportingIndicators.push({
        name: 'RSI',
        value: indicators.rsi,
        signal: 'bearish',
        weight: 0.8
      });
    }
    
    // MACD Analysis
    if (indicators.macd.histogram > 0 && indicators.macd.crossover === 'bullish') {
      bullishSignals++;
      supportingIndicators.push({
        name: 'MACD',
        value: 'Bullish crossover',
        signal: 'bullish',
        weight: 0.9
      });
    }
    
    // EMA Analysis
    const currentPrice = data[data.length - 1].close;
    if (currentPrice > indicators.ema200) {
      bullishSignals++;
      supportingIndicators.push({
        name: 'Price vs 200 EMA',
        value: 'Above',
        signal: 'bullish',
        weight: 0.7
      });
    }
    
    // Volume Analysis
    if (indicators.volume.trend === 'increasing') {
      const signal = bullishSignals > bearishSignals ? 'bullish' : 'bearish';
      supportingIndicators.push({
        name: 'Volume',
        value: `+${indicators.volume.increase}%`,
        signal,
        weight: 0.6
      });
    }
    
    // Calculate confidence
    const totalSignals = bullishSignals + bearishSignals;
    const dominantSignals = Math.max(bullishSignals, bearishSignals);
    const confidence = (dominantSignals / totalSignals) * 100;
    
    // Determine direction
    const direction = bullishSignals > bearishSignals ? 'long' : 'short';
    
    // Calculate levels
    const { entry, stopLoss, takeProfit } = this.calculateLevels(
      direction,
      currentPrice,
      indicators
    );
    
    // Generate reasoning
    const reasoning = this.generateReasoning(supportingIndicators, direction);
    
    return {
      direction,
      entry,
      stopLoss,
      takeProfit,
      confidence,
      supportingIndicators,
      reasoning
    };
  }
  
  private generateReasoning(indicators: Indicator[], direction: string): string {
    const reasons = indicators
      .filter(i => i.signal === (direction === 'long' ? 'bullish' : 'bearish'))
      .map(i => `${i.name}: ${i.value}`)
      .join('. ');
    
    return reasons + '. Multiple indicators confirm ' + direction + ' bias.';
  }
}
```

### 2.4 Signal Filters & Settings

**User può configurare:**

```typescript
interface SignalSettings {
  // Symbols to monitor
  watchlist: string[];             // ["EURUSD", "GBPUSD", "GOLD", "BTCUSD"]
  
  // Confidence threshold
  minConfidence: number;           // 70 (non mostrare signal <70%)
  
  // Risk parameters
  maxRiskPerTrade: number;         // 1% (per position sizing)
  minRiskReward: number;           // 1.5 (non mostrare R:R <1.5)
  
  // Timeframes
  timeframes: string[];            // ["H1", "H4"]
  
  // Indicator preferences
  indicators: {
    rsi: { enabled: boolean; period: number };
    macd: { enabled: boolean };
    ema: { enabled: boolean; periods: number[] };
    bollingerBands: { enabled: boolean };
    volume: { enabled: boolean };
  };
  
  // Notifications
  notifications: {
    highConfidence: boolean;       // Alert per signal >85%
    sound: boolean;
    push: boolean;
  };
}
```

---

## SEZIONE 3: Trade Execution Tracker

### 3.1 Quick Trade Log

**Quando esegui un signal:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  LOG TRADE FROM SIGNAL                                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Signal: EURUSD LONG (Confidence: 87%)                              │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  SELECT CHALLENGE                                            │   │
│  │  ────────────────────────────────────────────────────────────│   │
│  │  ○ FTMO $10K Normal                                          │   │
│  │     Balance: $10,680 | Daily Loss: -$320/-$500 ⚠️            │   │
│  │                                                               │   │
│  │  ● FundedNext $25K Express                                   │   │
│  │     Balance: $26,200 | Daily Loss: -$250/-$1,250 ✅          │   │
│  │                                                               │   │
│  │  ○ The5ers $15K Bootcamp                                     │   │
│  │     Balance: $15,900 | Daily Loss: -$60/-$600 ✅             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  TRADE DETAILS                                               │   │
│  │  ────────────────────────────────────────────────────────────│   │
│  │  Entry Price:     1.0850  (from signal)                      │   │
│  │  Stop Loss:       1.0820  (from signal)                      │   │
│  │  Take Profit:     1.0910  (from signal)                      │   │
│  │                                                               │   │
│  │  Position Size:   0.83 lots                                  │   │
│  │  Risk Amount:     $250 (1% of $25,000)                       │   │
│  │  Potential Profit: $500 (R:R 1:2)                            │   │
│  │                                                               │   │
│  │  Entry Time:      [2026-01-26 14:35]                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  NOTES (Optional)                                            │   │
│  │  ────────────────────────────────────────────────────────────│   │
│  │  [Entered at signal level. Market showing strong support.]   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  [Cancel] [Log Trade]                                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Trade Data Model

```typescript
interface Trade {
  // Identificazione
  id: string;
  challengeId: string;
  signalId?: string;               // Se da signal
  
  // Asset
  symbol: string;                  // "EURUSD"
  direction: 'long' | 'short';
  
  // Livelli
  entryPrice: number;
  exitPrice?: number;              // null se ancora aperto
  stopLoss: number;
  takeProfit: number;
  
  // Position
  positionSize: number;            // 0.83 lots
  riskAmount: number;              // $250
  
  // Timing
  entryTime: Date;
  exitTime?: Date;
  
  // P&L
  pnl?: number;                    // null se ancora aperto
  pnlPercentage?: number;
  rMultiple?: number;              // Quanti R hai vinto/perso
  
  // Status
  status: 'open' | 'closed_win' | 'closed_loss' | 'closed_breakeven';
  
  // Metadata
  notes?: string;
  screenshot?: string;
  tags?: string[];                 // ["trend-following", "breakout"]
}
```

### 3.3 Open Trades Monitor

```
┌─────────────────────────────────────────────────────────────────────┐
│  OPEN TRADES (3)                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  EURUSD LONG - FundedNext $25K                               │  │
│  │  ────────────────────────────────────────────────────────────│  │
│  │  Entry:     1.0850                                           │  │
│  │  Current:   1.0875 (+25 pips)                                │  │
│  │  SL:        1.0820 (-30 pips away)                           │  │
│  │  TP:        1.0910 (+35 pips away)                           │  │
│  │                                                               │  │
│  │  Unrealized P&L: +$208 (+0.83%)                              │  │
│  │  R-Multiple: +0.83R                                          │  │
│  │                                                               │  │
│  │  Opened: 2h 15m ago                                          │  │
│  │  [Close Trade] [Modify SL/TP] [View Chart]                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [View All Open Trades]                                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## SEZIONE 4: Performance Analytics

### 4.1 Challenge Performance

**Per ogni challenge:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  FTMO $10K - PERFORMANCE                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  KEY METRICS                                                 │   │
│  │  ────────────────────────────────────────────────────────────│   │
│  │  Total Trades:        47                                     │   │
│  │  Win Rate:            61.7% (29W / 18L)                      │   │
│  │  Profit Factor:       1.85                                   │   │
│  │  Average Win:         +$45 (+0.45%)                          │   │
│  │  Average Loss:        -$28 (-0.28%)                          │   │
│  │  Largest Win:         +$120 (+1.2%)                          │   │
│  │  Largest Loss:        -$65 (-0.65%)                          │   │
│  │  Avg R-Multiple:      +0.42R                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  TRADING PATTERNS                                            │   │
│  │  ────────────────────────────────────────────────────────────│   │
│  │  Best Day:            Monday (75% WR)                        │   │
│  │  Worst Day:           Friday (45% WR)                        │   │
│  │  Best Session:        London (68% WR)                        │   │
│  │  Best Symbol:         EURUSD (70% WR)                        │   │
│  │  Worst Symbol:        GBPUSD (50% WR)                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## RIEPILOGO: Sezioni Essenziali

### Must-Have (MVP)

1. **Challenge Manager**
   - Multi-account overview
   - Real-time rule monitoring
   - Alert system
   - Challenge detail view

2. **Signal Generator**
   - Multi-indicator analysis
   - Confidence scoring
   - Entry/SL/TP levels
   - Signal list view

3. **Trade Tracker**
   - Quick trade logging
   - Open trades monitor
   - P&L tracking per challenge

### Nice-to-Have (V2)

4. **Performance Analytics**
   - Win rate, profit factor
   - Pattern recognition
   - Best/worst analysis

5. **Advanced Features**
   - Backtesting
   - Strategy library
   - Community signals
   - Mobile app

---

## Tech Stack Consigliato

```typescript
// Frontend
- Next.js 15 (già hai)
- Supabase (già hai)
- TradingView Lightweight Charts (per grafici)
- Recharts (per analytics)

// Backend / Data
- Supabase Realtime (per alert real-time)
- Supabase Functions (per signal generation)
- External API: Alpha Vantage / Twelve Data (market data)

// AI/ML
- TensorFlow.js (client-side indicator calculation)
- OpenAI API (per reasoning generation)
```

---

## Fonti

1. [Tradevian](https://tradevian.com/) - Multi-account prop firm tracker
2. [Trade Ideas](https://www.stockbrokers.com/review/tools/trade-ideas) - AI signal generator
3. [TradersPost](https://blog.traderspost.io/article/how-to-manage-multiple-prop-firm-accounts) - Multi-account management
4. [Intellectia.ai](https://intellectia.ai/blog/stock-technical) - AI technical analysis
5. [PropFlow](https://www.propflowtrading.com/) - Prop firm financial tracking

*Content was rephrased for compliance with licensing restrictions*

---

**Documento creato**: 26 Gennaio 2026  
**Versione**: 1.0  
**Next**: Creare requirements.md basato su questa analisi
