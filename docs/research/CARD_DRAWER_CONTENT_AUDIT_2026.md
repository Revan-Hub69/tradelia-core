# Card & Drawer Content Audit 2026

**Date**: 2026-01-26  
**Status**: 🔍 AUDIT COMPLETE  
**Purpose**: Verificare che card e drawer mostrino TUTTE le info critiche per decisione utente

---

## 🎯 DOMANDE CRITICHE UTENTE

### Prima di iscriversi, l'utente DEVE sapere:

1. **Quando posso iniziare?**
   - ✅ Sempre aperto (always_open)
   - ✅ Date specifiche (start_date, end_date)
   - ✅ Prossima edizione (next_edition_date)
   - ✅ Frequenza (monthly, quarterly, annual)

2. **Contro chi competo?**
   - ✅ Solo regole da rispettare (target_based)
   - ✅ Ranking contro altri trader (ranking_based)
   - ✅ Max partecipanti (max_participants)

3. **Posso usare bot/EA?**
   - ✅ EA allowed (ea_allowed)
   - ✅ Copy trading (copy_trading_allowed)
   - ✅ Hedging (hedging_allowed)
   - ✅ Scalping (scalping_allowed)

4. **Posso tradare weekend/news?**
   - ✅ Weekend holding (weekend_holding)
   - ✅ News trading (news_trading)

5. **Che tipo di account è?**
   - ✅ Paper trading / Demo / Sim / Live
   - ✅ Instant funding o evaluation

6. **Dove posso tradare?**
   - ✅ Markets (forex, futures, crypto, stocks)
   - ✅ Platforms (MT4, MT5, cTrader, etc.)
   - ✅ Leverage per market

7. **Quando ricevo i soldi?**
   - ✅ Payout frequency
   - ✅ First payout delay
   - ✅ Eligible after phase (quale fase)

8. **Ci sono restrizioni geografiche?**
   - ✅ Geo restrictions (allowed/blocked countries)
   - ✅ KYC required

---

## 📊 AUDIT: PROGRAM CARD

### ✅ ATTUALMENTE MOSTRATO

#### Header
- Logo firm
- Nome program
- Organizer name
- Category badge (FREE/PAID)
- Free trial badge
- Freshness indicator (T-0, T-7, etc.)

#### Offer Selector
- Account sizes disponibili
- Entry fee per size
- Refundable status

#### KPI Grid (8 metriche)
1. Profit Target (phase 1 → phase 2)
2. Max Drawdown
3. Max Daily Loss
4. Profit Split
5. Time Limit
6. Min Trading Days
7. Phase Count
8. First Payout Delay

#### Platforms
- Platform icons (MT4, MT5, cTrader, DXtrade)

#### Actions
- Compare checkbox
- View Details button

---

### ❌ MANCANTE NELLA CARD (CRITICO)

#### 🚨 Priority 1 - Decisione Immediata

1. **Availability Status**
   - ❌ Always open vs Date-based
   - ❌ Next edition date (se recurring)
   - ❌ Registration deadline
   - ❌ Spots remaining (se limited)

2. **Competition Type**
   - ❌ Target-based (solo regole) vs Ranking-based (contro altri)
   - ❌ Max participants (se tournament)

3. **Trading Permissions** (Deal Breaker!)
   - ❌ EA/Bot allowed
   - ❌ News trading allowed
   - ❌ Weekend holding allowed

4. **Account Type**
   - ❌ Paper / Demo / Sim / Live
   - ❌ Instant funding vs Evaluation

#### 🟡 Priority 2 - Info Utile

5. **Prize Pool** (se free competition)
   - ❌ Total prize pool
   - ❌ Prize distribution

6. **Geo Restrictions**
   - ❌ Restricted countries indicator
   - ❌ KYC required badge

---

## 📱 AUDIT: DRAWER TABS

### Tab 1: Overview ✅ COMPLETO
- Key metrics
- Best for
- Pros & Cons
- About firm

### Tab 2: Pricing ✅ COMPLETO
- Comparison table tutte le sizes
- Refund conditions
- Scaling potential

### Tab 3: Rules ⚠️ INCOMPLETO

#### ✅ Attualmente mostrato
- Profit target
- Max daily loss
- Max drawdown
- Min trading days
- Time limit

#### ❌ Mancante (CRITICO)
- **Drawdown type**: Balance-based vs Equity-based vs Trailing
- **Daily loss type**: Balance-based vs Equity-based
- **Daily loss reset time**: "17:00 EST" (importante!)
- **Consistency rule**: Best day max % of total profit
- **Max position size**: Lots/contracts limit
- **Max positions**: Numero max posizioni aperte
- **Correlation rules**: Max correlated positions

### Tab 4: Payout ⚠️ INCOMPLETO

#### ✅ Attualmente mostrato
- Profit split (initial, scaled, max)
- Payout frequency
- First payout delay

#### ❌ Mancante
- **Withdrawal methods**: Bank, Crypto, PayPal, etc.
- **Min withdrawal amount**
- **Processing time**: Hours/days
- **Eligible after phase**: Quale fase (1, 2, funded)
- **Payout conditions**: Cosa serve per primo payout

### Tab 5: Markets ⚠️ INCOMPLETO

#### ✅ Attualmente mostrato
- Markets available
- Platforms available

#### ❌ Mancante (CRITICO)
- **Instruments count**: Quanti strumenti disponibili
- **Leverage per market**: Forex 1:100, Indices 1:50, etc.
- **Commission structure**: Per lot, per trade, etc.
- **Spread type**: Fixed vs Variable
- **Trading hours**: 24/5, 24/7, specific hours

### Tab 6: Trust & Audit ✅ COMPLETO (da implementare)
- Sources list
- Field sources
- Freshness
- Confidence scores

---

### 🆕 TAB MANCANTE: Permissions & Rules

**Dovrebbe contenere**:
- ✅ EA/Bot allowed
- ✅ Copy trading allowed
- ✅ Hedging allowed
- ✅ Scalping allowed
- ✅ News trading allowed
- ✅ Weekend holding allowed
- ✅ Max position size
- ✅ Max open positions
- ✅ Correlation rules

---

## 🎨 PROPOSTA: CARD REDESIGN

### Aggiungere alla Card (sopra KPI Grid):

#### Status Bar (nuovo)
```tsx
<div className="status-bar">
  {/* Availability */}
  {recurring ? (
    <Badge variant="blue">
      <CalendarIcon /> Next: Feb 1, 2026
    </Badge>
  ) : (
    <Badge variant="green">
      <CheckIcon /> Always Open
    </Badge>
  )}
  
  {/* Competition Type */}
  {ruleset_mode === 'ranking_based' ? (
    <Badge variant="orange">
      <TrophyIcon /> vs {max_participants} Traders
    </Badge>
  ) : (
    <Badge variant="gray">
      <TargetIcon /> Target-Based
    </Badge>
  )}
  
  {/* Account Type */}
  <Badge variant="purple">
    {subtype === 'paper' ? 'Paper Trading' : 'Live Account'}
  </Badge>
</div>
```

#### Permissions Row (nuovo)
```tsx
<div className="permissions-row">
  <PermissionBadge 
    allowed={ea_allowed} 
    icon={<BotIcon />}
    label="EA"
  />
  <PermissionBadge 
    allowed={news_trading} 
    icon={<NewsIcon />}
    label="News"
  />
  <PermissionBadge 
    allowed={weekend_holding} 
    icon={<WeekendIcon />}
    label="Weekend"
  />
</div>
```

---

## 📱 PROPOSTA: DRAWER TABS REDESIGN

### Nuova struttura (7 tabs):

1. **Overview** (unchanged)
2. **Pricing** (unchanged)
3. **Rules** (expanded)
   - Profit targets
   - Loss limits (con type e reset time)
   - Trading days
   - Consistency rules
   - Position limits
4. **Permissions** (NEW!)
   - EA/Bot allowed
   - Trading restrictions
   - Position rules
   - Correlation rules
5. **Payout** (expanded)
   - Split details
   - Withdrawal methods
   - Processing times
   - Conditions
6. **Markets** (expanded)
   - Markets + instruments count
   - Leverage per market
   - Commission structure
   - Trading hours
7. **Trust & Audit** (unchanged)

---

## 🗄️ DATABASE SCHEMA CHECK

### ✅ Campi già nel database

```sql
-- offers table
recurring BOOLEAN
frequency TEXT -- always_open, monthly, quarterly, annual
start_date DATE
end_date DATE
registration_deadline DATE
next_edition_date DATE
max_participants INTEGER
prize_pool NUMERIC

-- rulesets table
ruleset_mode TEXT -- target_based, ranking_based
ea_allowed BOOLEAN
news_trading BOOLEAN
weekend_holding BOOLEAN
max_drawdown_type TEXT -- balance_based, equity_based, trailing
max_daily_loss_type TEXT -- balance_based, equity_based
daily_loss_reset_time TEXT -- "17:00 EST"
consistency_required BOOLEAN
best_day_max_pct NUMERIC
max_position_size NUMERIC
max_open_positions INTEGER

-- payout_terms table
withdrawal_methods JSONB -- ["bank", "crypto", "paypal"]
min_withdrawal NUMERIC
payout_processing_time_hours INTEGER
eligible_after_phase INTEGER

-- market_access table
instruments_count INTEGER
leverage_forex TEXT
leverage_indices TEXT
leverage_commodities TEXT
leverage_crypto TEXT
commission_forex NUMERIC
commission_indices NUMERIC
trading_hours TEXT

-- programs table
subtype TEXT -- paper, demo, sim, live, hybrid
```

### ✅ Tutti i campi esistono! Solo da mostrare in UI

---

## 🎯 PRIORITÀ IMPLEMENTAZIONE

### P0 - CRITICO (Card)
1. ✅ Availability status (always open vs date-based)
2. ✅ Competition type (target vs ranking)
3. ✅ Trading permissions (EA, news, weekend)
4. ✅ Account type (paper vs live)

### P1 - IMPORTANTE (Drawer)
5. ✅ Drawdown/daily loss type
6. ✅ Daily loss reset time
7. ✅ Withdrawal methods
8. ✅ Leverage per market
9. ✅ Trading hours

### P2 - NICE TO HAVE
10. ✅ Max position size
11. ✅ Max open positions
12. ✅ Correlation rules
13. ✅ Commission structure
14. ✅ Spread type

---

## 📋 ACTION ITEMS

### 1. Update ProgramCard.tsx
- [ ] Add Status Bar (availability, competition type, account type)
- [ ] Add Permissions Row (EA, news, weekend)
- [ ] Update KPI grid con info più rilevanti

### 2. Update ChallengeDrawer.tsx
- [ ] Expand Rules tab (drawdown type, reset time, consistency)
- [ ] Add Permissions tab (NEW)
- [ ] Expand Payout tab (methods, processing, conditions)
- [ ] Expand Markets tab (leverage, commission, hours)

### 3. Update Database Queries
- [ ] Include tutti i campi necessari in program_card_kpis VIEW
- [ ] Include permissions in drawer query
- [ ] Include market details in drawer query

### 4. Create New Icons
- [ ] CalendarIcon (availability)
- [ ] TrophyIcon (ranking)
- [ ] BotIcon (EA allowed)
- [ ] NewsIcon (news trading)
- [ ] WeekendIcon (weekend holding)
- [ ] LeverageIcon (leverage)
- [ ] CommissionIcon (commission)

---

## ✅ CONCLUSIONI

### Cosa mancava (CRITICO):
1. **Availability**: Quando posso iniziare?
2. **Competition Type**: Contro chi competo?
3. **Permissions**: Posso usare EA/bot?
4. **Account Type**: Paper o live?
5. **Drawdown Type**: Balance vs Equity vs Trailing
6. **Reset Time**: Quando resetta daily loss?
7. **Withdrawal Methods**: Come ricevo i soldi?
8. **Leverage**: Quanto leverage per market?

### Tutti i dati esistono nel database!
✅ Solo da mostrare in UI

### Next Steps:
1. Aggiornare ProgramCard con Status Bar + Permissions Row
2. Aggiungere tab Permissions nel drawer
3. Espandere tabs esistenti con info mancanti
4. Creare nuovi icons necessari

---

**Status**: Audit completo, action items definiti  
**Impact**: Informazioni critiche per decisione utente  
**Effort**: 3-4 ore per implementare tutto
