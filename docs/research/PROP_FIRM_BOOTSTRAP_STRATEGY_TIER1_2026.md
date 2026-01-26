# Strategia Bootstrap per Prop Firm - Ricerca Approfondita Tier1 2026

**Data**: 26 Gennaio 2026  
**Tipo**: Ricerca Pratica con Dati Reali  
**Obiettivo**: Creare sistema trading automatico a budget zero per superare prop firm challenge

---

## Executive Summary: La Verità Cruda

### Statistiche Reali del Settore (2026)

**Pass Rate Challenge**:
- Solo **5-10%** dei trader passa la valutazione iniziale
- Solo **7%** degli account funded riceve payout
- Solo **1%** dei clienti totali guadagna effettivamente

**Fonte**: [QuantVPS Prop Firm Statistics 2026](https://www.quantvps.com/blog/prop-firm-statistics)

**Perché Falliscono**:
1. Violazione regole (max drawdown, daily loss)
2. Over-trading emotivo
3. Mancanza di risk management
4. Strategia non testata adeguatamente

**Perché l'Automazione Aiuta**:
- Elimina emozioni
- Rispetta regole rigorosamente
- Trading 24/7 senza fatica
- Consistenza matematica

---

## 1. Realtà dei Guadagni: Casi Verificati

### Caso Studio 1: Leon (Croazia)

**Background**:
- 19 anni, villaggio croato
- 2.5 anni di fallimenti prima del successo
- Primo withdrawal: $81

**Risultati**:
- Oggi: $300,000+ in account funded
- Multiple prop firm
- Income mensile stimato: $3,000-5,000

[Fonte: ThinkCapital Success Story](https://www.thinkcapital.com/prop-firm-success-story-leon-thinkcapital-interview/)

### Caso Studio 2: Trader Anonimo (EA User)

**Setup**:
- Expert Advisor automatico
- Challenge The5ers ($15K)
- Tempo: 3 ore di trading

**Risultati**:
- Passed Phase 2 in <3 ore
- 100% automatico
- Nessun intervento manuale

[Fonte: IqbalCyberLibrary](https://iqbalcyberlibrary.com/article/10-best-prop-firms-that-allow-eas-hft-and-algo-trading-bots)

### Proiezioni Realistiche

**Scenario Conservativo** (1 account):
```
Mese 1-2: Challenge + Verification ($0 guadagno)
Mese 3+: $10K funded account
Target: 5% mensile = $500 profit
Split 80/20: $400 per te

Anno 1: $400 × 9 mesi = $3,600
```

**Scenario Ottimistico** (3 accounts dopo 6 mesi):
```
3 × $10K = $30K capitale gestito
5% mensile = $1,500 profit totale
Split 80/20: $1,200 per te

Anno 1: $1,200 × 6 mesi = $7,200
```

---

## 2. Stack Tecnologico Budget Zero

### Opzione A: Python + MetaTrader 5 (Forex)

**Componenti**:
```python
# Stack completo gratuito
import MetaTrader5 as mt5  # Gratis
import pandas as pd         # Gratis
import numpy as np          # Gratis
import talib               # Gratis (indicatori tecnici)

# Broker con MT5 gratis
brokers = ['IC Markets', 'Pepperstone', 'FTMO Demo']
```

**Costi**:
- Software: $0
- Dati storici: $0 (MT5 fornisce)
- VPS: $5-10/mese (Contabo, Hetzner)
- Challenge fee: $75-155 (una tantum)

**Totale primo mese**: ~$80-165

### Opzione B: Freqtrade (Crypto)

**Componenti**:
```bash
# Open source completo
git clone https://github.com/freqtrade/freqtrade
cd freqtrade
./setup.sh -i

# Features incluse:
- Backtesting engine
- Strategy optimization
- Dry-run mode
- Telegram bot integration
- Web UI
```

**Vantaggi**:
- Community attiva (10K+ stars GitHub)
- Strategie pre-built disponibili
- Machine learning integrato
- Supporto 100+ exchange

[Fonte: Freqtrade.io](https://www.freqtrade.io/)

---

## 3. Strategia Concreta: Mean Reversion RSI

### Perché Questa Strategia

**Backtest Verificati**:
- Win Rate: 81-91% (con filtri)
- Sharpe Ratio: >1.5
- Max Drawdown: <15%
- Profit Factor: 1.5-2.0

[Fonte: TraderVPS RSI Strategy](https://www.tradervps.com/blog/rsi-trading-strategy)

### Implementazione Python

```python
class PropFirmBot:
    def __init__(self, account_size=10000):
        self.account_size = account_size
        self.risk_per_trade = 0.01  # 1% risk
        self.max_daily_loss = 0.05   # 5% stop
        self.daily_pnl = 0
        
    def calculate_indicators(self, df):
        """Calcola RSI + Bollinger Bands"""
        df['rsi'] = talib.RSI(df['close'], timeperiod=14)
        df['bb_upper'], df['bb_middle'], df['bb_lower'] = \
            talib.BBANDS(df['close'], timeperiod=20)
        df['atr'] = talib.ATR(df['high'], df['low'], df['close'], 14)
        return df
    
    def generate_signal(self, df):
        """Logica entry/exit"""
        last = df.iloc[-1]
        
        # BUY Signal
        if (last['rsi'] < 30 and 
            last['close'] < last['bb_lower'] and
            last['volume'] > df['volume'].rolling(20).mean().iloc[-1]):
            return 'BUY'
        
        # SELL Signal  
        if (last['rsi'] > 70 and
            last['close'] > last['bb_upper'] and
            last['volume'] > df['volume'].rolling(20).mean().iloc[-1]):
            return 'SELL'
        
        return 'HOLD'
    
    def calculate_position_size(self, stop_loss_pips, symbol):
        """Risk management: 1% per trade"""
        risk_amount = self.account_size * self.risk_per_trade
        pip_value = self.get_pip_value(symbol)
        position_size = risk_amount / (stop_loss_pips * pip_value)
        return round(position_size, 2)
    
    def check_daily_loss_limit(self):
        """Stop trading se daily loss > 5%"""
        if self.daily_pnl < -(self.account_size * self.max_daily_loss):
            return False  # Stop trading
        return True
```

### Parametri Ottimizzati

**Timeframe**: H1 (1 ora)
- Evita noise dei timeframe bassi
- Sufficiente per prop firm (non serve HFT)
- Permette backtesting accurato

**Pairs**: EURUSD, GBPUSD, USDJPY
- Alta liquidità
- Spread bassi
- Comportamento prevedibile

**Risk:Reward**: 1:2 minimo
- Stop Loss: 1 × ATR
- Take Profit: 2 × ATR

---

## 4. Backtesting Rigoroso

### Framework: Backtrader

```python
import backtrader as bt

class RSIMeanReversion(bt.Strategy):
    params = (
        ('rsi_period', 14),
        ('rsi_oversold', 30),
        ('rsi_overbought', 70),
        ('risk_pct', 0.01),
    )
    
    def __init__(self):
        self.rsi = bt.indicators.RSI(period=self.p.rsi_period)
        self.bb = bt.indicators.BollingerBands()
        self.atr = bt.indicators.ATR()
        
    def next(self):
        if not self.position:
            # Entry logic
            if (self.rsi < self.p.rsi_oversold and
                self.data.close < self.bb.bot):
                size = self.calculate_size()
                self.buy(size=size)
                self.stop_loss = self.data.close - self.atr[0]
                self.take_profit = self.data.close + (2 * self.atr[0])
        else:
            # Exit logic
            if (self.data.close <= self.stop_loss or
                self.data.close >= self.take_profit):
                self.close()

# Run backtest
cerebro = bt.Cerebro()
cerebro.addstrategy(RSIMeanReversion)
cerebro.broker.setcash(10000)
cerebro.run()

# Metriche
print(f"Final Value: ${cerebro.broker.getvalue():.2f}")
print(f"Sharpe Ratio: {cerebro.analyzers.sharpe.get_analysis()}")
print(f"Max Drawdown: {cerebro.analyzers.drawdown.get_analysis()}")
```

### Requisiti Minimi per Prop Firm

| Metrica | Target | Perché |
|---------|--------|--------|
| **Win Rate** | >50% | Consistenza |
| **Sharpe Ratio** | >1.5 | Risk-adjusted return |
| **Max Drawdown** | <10% | Regola prop firm |
| **Profit Factor** | >1.5 | Profittabilità |
| **Trades/Month** | 20-40 | Attività sufficiente |

---

## 5. Prop Firm Specifiche: Confronto Dettagliato

### FTMO (Più Popolare)

**Challenge**:
- Fee: €155 ($170)
- Target Profit: 10% (Phase 1), 5% (Phase 2)
- Max Drawdown: 10%
- Max Daily Loss: 5%
- Tempo: 30 giorni per fase

**Funded Account**:
- Split: 80/20 (scalabile a 90/10)
- Payout: Ogni 14 giorni
- Scaling: Fino a $400K

**Regole EA**:
- ✅ Permessi
- ❌ No HFT (<1 min hold)
- ❌ No hedging tra account

[Fonte: FTMO Official](https://ftmo.com/)

### The5ers (Budget-Friendly)

**Challenge**:
- Fee: $75 (più economico!)
- Target Profit: 6%
- Max Drawdown: 4% (più stretto)
- Tempo: Illimitato (grande vantaggio)

**Funded Account**:
- Split: 50% → 100% (progressivo)
- Scaling: Fino a $4M
- Payout: Settimanale

**Regole EA**:
- ✅ Permessi
- ✅ Più flessibile di FTMO

[Fonte: The5ers Official](https://the5ers.com/)

### MyForexFunds

**Challenge**:
- Fee: $99
- Target: 8%
- Max DD: 5%
- Tempo: 30 giorni

**Funded Account**:
- Split: 80/20
- Payout: Bi-settimanale
- Scaling: Fino a $300K

**Regole EA**:
- ✅ Permessi
- ⚠️ Verifica manuale trades

### Raccomandazione

**Per Iniziare**: The5ers
- Fee più bassa ($75)
- Tempo illimitato
- Meno pressione

**Per Scalare**: FTMO
- Reputazione solida
- Payout veloci
- Community grande

---

## 6. VPS: Opzioni Budget

### Contabo (Più Economico)

**Piano VPS S**:
- €5.99/mese (~$6.50)
- 4 vCPU
- 8GB RAM
- 200GB SSD
- Uptime: 99.9%

**Latenza**:
- EU: 10-20ms
- US: 80-100ms

[Link: Contabo.com](https://contabo.com/)

### Hetzner (Migliore Rapporto)

**Piano CX11**:
- €4.51/mese (~$5)
- 1 vCPU
- 2GB RAM
- 20GB SSD

**Vantaggi**:
- Datacenter Germania
- Latenza EU eccellente
- Affidabilità alta

### QuantVPS (Specializzato Trading)

**VPS Lite**:
- $69/mese
- Latency <2ms (exchange proximity)
- Pre-configured per MT5

**Solo se**:
- Hai già guadagnato
- Vuoi HFT
- Budget disponibile

**Verdict**: Inizia con Contabo/Hetzner, upgrade dopo primi profitti.

---

## 7. Roadmap 90 Giorni Dettagliata

### Giorni 1-10: Setup & Apprendimento

**Tasks**:
- [ ] Installa Python 3.11
- [ ] Setup MT5 + broker demo
- [ ] Installa librerie (pandas, talib, backtrader)
- [ ] Studia documentazione MT5 API
- [ ] Scarica 2 anni dati storici EURUSD

**Deliverables**:
- Ambiente dev funzionante
- Primo script connessione MT5
- Dati storici pronti

### Giorni 11-30: Sviluppo Strategia

**Tasks**:
- [ ] Implementa RSI + Bollinger strategy
- [ ] Aggiungi risk management (1% risk)
- [ ] Implementa daily loss limit (5%)
- [ ] Crea logging sistema
- [ ] Test su demo account

**Deliverables**:
- Bot funzionante
- Logs dettagliati
- Performance tracking

### Giorni 31-50: Backtesting

**Tasks**:
- [ ] Backtest 2 anni EURUSD
- [ ] Backtest GBPUSD, USDJPY
- [ ] Walk-forward analysis
- [ ] Ottimizza parametri
- [ ] Out-of-sample testing

**Metriche Target**:
- Sharpe >1.5
- Max DD <10%
- Win Rate >50%
- Profit Factor >1.5

### Giorni 51-70: Paper Trading

**Tasks**:
- [ ] Deploy su VPS
- [ ] Run 24/7 su demo
- [ ] Monitor performance real-time
- [ ] Affina parametri
- [ ] Test slippage reale

**Verifiche**:
- Bot stabile 24/7
- Nessun crash
- Performance simile a backtest

### Giorni 71-90: Challenge

**Tasks**:
- [ ] Scegli prop firm (The5ers recommended)
- [ ] Paga challenge fee ($75)
- [ ] Deploy bot su demo prop firm
- [ ] Monitor giornaliero
- [ ] Passa Phase 1 e 2

**Target**:
- 6% profit (The5ers)
- Max DD <4%
- Tempo: 30-60 giorni

---

## 8. Costi Totali Reali

### Setup Iniziale

```
Software & Tools:
- Python: $0
- MT5: $0
- Librerie: $0
- Backtest data: $0
Total: $0

Infrastructure:
- VPS (Contabo): $6.50/mese
- Domain (opzionale): $0
Total: $6.50/mese

Challenge:
- The5ers fee: $75 (una tantum)
- Retry budget: $150 (2 tentativi extra)
Total: $225

TOTALE PRIMO MESE: $231.50
TOTALE MESI 2-3: $6.50/mese
```

### Break-Even Analysis

**Scenario**:
- Investment: $250 (setup + 3 mesi VPS)
- Funded account: $10K
- Monthly return: 5% = $500
- Your cut (80%): $400

**Break-even**: 1 mese di trading funded

**ROI Anno 1**:
```
Investment: $250
Earnings: $400 × 9 mesi = $3,600
ROI: 1,340%
```

---

## 9. Rischi & Mitigazioni

### Rischio 1: Fallimento Challenge (85% probabilità)

**Mitigazioni**:
- Backtest rigoroso (2+ anni)
- Paper trading 3+ settimane
- Inizia con The5ers (più economico)
- Budget 3 tentativi ($225)

### Rischio 2: Over-Optimization

**Problema**: Strategia perfetta su backtest, fallisce live

**Mitigazioni**:
- Walk-forward analysis
- Out-of-sample testing (20% dati)
- Multiple pairs testing
- Aggiungi slippage/commissioni nei test

### Rischio 3: Violazione Regole

**Problema**: Bot viola max DD o daily loss

**Mitigazioni**:
- Hard-code limits nel bot
- Real-time monitoring
- Auto-stop su soglie
- Alert Telegram

### Rischio 4: Technical Failures

**Problema**: VPS crash, connessione persa

**Mitigazioni**:
- VPS con 99.9% uptime
- Auto-restart script
- Monitoring esterno (UptimeRobot)
- Backup VPS (dopo funded)

---

## 10. Strategie Alternative (Se RSI Non Funziona)

### Strategia B: Breakout con Volume

```python
def breakout_strategy(df):
    # Identifica range consolidation
    high_20 = df['high'].rolling(20).max()
    low_20 = df['low'].rolling(20).min()
    
    # Breakout con volume confirmation
    if (df['close'].iloc[-1] > high_20.iloc[-2] and
        df['volume'].iloc[-1] > df['volume'].rolling(20).mean().iloc[-1] * 1.5):
        return 'BUY'
    
    if (df['close'].iloc[-1] < low_20.iloc[-2] and
        df['volume'].iloc[-1] > df['volume'].rolling(20).mean().iloc[-1] * 1.5):
        return 'SELL'
    
    return 'HOLD'
```

**Vantaggi**:
- Cattura trend forti
- Volume filter riduce falsi segnali
- Win rate 60-70%

### Strategia C: EMA Crossover (Semplice)

```python
def ema_crossover(df):
    df['ema_fast'] = df['close'].ewm(span=12).mean()
    df['ema_slow'] = df['close'].ewm(span=26).mean()
    
    if (df['ema_fast'].iloc[-1] > df['ema_slow'].iloc[-1] and
        df['ema_fast'].iloc[-2] <= df['ema_slow'].iloc[-2]):
        return 'BUY'
    
    if (df['ema_fast'].iloc[-1] < df['ema_slow'].iloc[-1] and
        df['ema_fast'].iloc[-2] >= df['ema_slow'].iloc[-2]):
        return 'SELL'
    
    return 'HOLD'
```

**Vantaggi**:
- Semplicissima
- Trend-following
- Facile da backtest

---

## 11. Tools & Risorse Gratuite

### Backtesting

- **Backtrader**: [backtrader.com](https://www.backtrader.com/)
- **Zipline**: [zipline.io](https://www.zipline.io/)
- **VectorBT**: [vectorbt.dev](https://vectorbt.dev/)

### Dati Storici

- **Yahoo Finance**: Gratis, API Python
- **MT5**: Dati forex inclusi
- **Binance API**: Crypto gratis

### Community & Learning

- **QuantConnect**: Forum + tutorials
- **r/algotrading**: Reddit community
- **Elite Trader**: Forum veterani

### Monitoring

- **Telegram Bot**: Notifiche gratis
- **UptimeRobot**: VPS monitoring gratis
- **Grafana**: Dashboard open source

---

## 12. Conclusioni & Next Steps

### È Fattibile?

**SÌ**, ma con aspettative realistiche:

✅ **Pro**:
- Budget minimo ($250)
- Skills apprendibili (Python base)
- Automazione elimina emozioni
- Scalabile (multi-account)

❌ **Contro**:
- 85% fail rate challenge
- 3-6 mesi sviluppo serio
- Richiede disciplina
- Non è "soldi facili"

### Chi Dovrebbe Provare

**Ideale per**:
- Developer con tempo libero
- Trader con esperienza base
- Chi vuole imparare algo trading
- Budget limitato ma pazienza alta

**Non adatto per**:
- Chi cerca soldi veloci
- Zero esperienza trading
- Nessuna skill programmazione
- Budget <$200

### Prossimi Passi Immediati

**Questa Settimana**:
1. Installa Python + MT5
2. Apri demo account broker
3. Scarica dati storici EURUSD
4. Implementa strategia RSI base
5. Primo backtest

**Questo Mese**:
1. Ottimizza strategia
2. Backtest 2+ anni
3. Deploy su VPS
4. Paper trading 2 settimane

**Prossimi 3 Mesi**:
1. Affina performance
2. Scegli prop firm
3. Tenta challenge
4. Ottieni funded account

---

## Fonti & Attribution

Questo documento è basato su ricerche verificate e dati pubblici:

1. [QuantVPS - Prop Firm Statistics 2026](https://www.quantvps.com/blog/prop-firm-statistics)
2. [ThinkCapital - Success Story Leon](https://www.thinkcapital.com/prop-firm-success-story-leon-thinkcapital-interview/)
3. [TraderVPS - RSI Strategy Backtest](https://www.tradervps.com/blog/rsi-trading-strategy)
4. [Freqtrade Official Documentation](https://www.freqtrade.io/)
5. [IqbalCyberLibrary - EA Success Stories](https://iqbalcyberlibrary.com/article/10-best-prop-firms-that-allow-eas-hft-and-algo-trading-bots)

*Content was rephrased for compliance with licensing restrictions*

---

**Documento creato**: 26 Gennaio 2026  
**Versione**: 1.0  
**Prossimo Update**: Dopo primi risultati challenge
