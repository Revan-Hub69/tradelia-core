# Tradelia - Documento di Audit Esterno (AI Signals & Challenges)

## 1) Scopo
Questo documento definisce requisiti, dati e regole per un audit esterno
del sistema AI Signals integrato con le Challenge. L'obiettivo e garantire:
- Conformita alle regole delle challenge
- Controllo del rischio e dei costi
- Tracciabilita e spiegabilita delle decisioni
- Separazione netta tra regole statiche e segnali dinamici

---

## 2) Architettura (separazione obbligatoria)
### A. ChallengeSpec (Regolamento statico)
Regole ufficiali definite dal provider:
- Profit target
- Max drawdown
- Daily loss
- Min trading days
- Permessi (EA/news/weekend)

### B. MyChallenge (Stato giornaliero + limiti)
Stato operativo e output di vincolo:
- Rischio consumato oggi (daily loss used)
- Drawdown usato (max dd used)
- Giorni tradati
- Event risk (manuale o calendario)

Output:
- Trade Gate: OPEN / RESTRICTED / CLOSED
- Risk Budget: daily cap, risk per trade, max trades

### C. AI Signals (Layer advisory)
Legge solo:
- OperatingEnvelope
- Context Lite

Non puo mai superare i vincoli di ChallengeSpec e RiskBudget.

---

## 3) Ordine decisionale (best practice)
1. Data & Measurement Quality
2. ChallengeSpec (vincoli duri)
3. Risk/Cost Layer
4. Regime/Context Layer
5. Portfolio/Correlation Layer
6. Position sizing & pacing
7. Setup selection
8. Asset selection

---

## 4) Risk & Cost Layer (core accademico)
Requisiti minimi:
- Transaction costs (spread, commission, slippage proxy)
- Turnover e mitigazione costi
- Risk budget giornaliero
- Volatility regime e scaling del rischio

Senza cost model realistico il segnale e considerato non valido.

---

## 5) Regime / Context Layer
Variabili minime:
- Sessione (EU/US/ASIA/OFF)
- Event risk (NONE/SCHEDULED/LIVE)
- Volatilita (LOW/NORMAL/HIGH)
- Spread/liquidita proxy

Il contesto serve a decidere se il setup e applicabile oggi.

---

## 6) Portfolio & Correlation Layer
Requisiti:
- Correlazione fra asset (evitare concentrazione)
- Esposizione per valuta/settore
- Rischio cumulato multi-setup

---

## 7) Position sizing & pacing
Requisiti:
- Sizing coerente con daily loss e DD
- Pacing giornaliero (risk burn)
- Kill switch su soglie critiche

---

## 8) AI Signals - Output Contract
Un segnale deve includere:
- Trade Gate attivo
- Risk Budget applicabile
- Contesto (sessione + event risk)
- Motivazione sintetica

Se Trade Gate != OPEN, il segnale deve essere bloccato.

---

## 9) Evidence richieste per audit
Checklist minima:
- ChallengeSpec versionata e immutabile
- MyChallenge con stato e audit trail
- Log del Trade Gate e Risk Budget
- Regole di cost model documentate
- Policy di explainability

---

## 10) Data Schema (minimo)
### ChallengeSpec
- target_pct
- max_dd_pct
- daily_loss_pct
- min_days
- ea_allowed
- news_trading
- weekend_holding

### MyChallenge
- balance_start
- equity_now
- peak_equity
- profit_progress_pct
- max_dd_used_pct
- daily_loss_used_pct_today
- days_traded
- event_risk
- session

### OperatingEnvelope
- trade_gate
- risk_budget.daily_risk_cap_pct
- risk_budget.risk_per_trade_pct
- risk_budget.max_trades
- stop_rules

---

## 11) Governance
Qualsiasi modifica al modello:
- deve essere versionata
- deve produrre audit trail
- non puo bypassare i vincoli di ChallengeSpec

---

## 12) Conclusione
Il sistema e auditabile solo se:
- regole statiche sono separate
- risk layer precede i segnali
- contesto e tracciato
- decisioni sono spiegabili

Questo documento definisce i requisiti minimi per audit esterno.
