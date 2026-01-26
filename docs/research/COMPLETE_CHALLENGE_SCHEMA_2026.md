# Complete Challenge Schema - Comprehensive Requirements 2026

**Date**: 2026-01-26  
**Status**: 🔴 SCHEMA DESIGN PHASE  
**Goal**: Definire TUTTO quello che serve sapere su una challenge/torneo PRIMA di implementare

---

## 🎯 DISTINZIONI CRITICHE A MONTE

### 1. CATEGORIZZAZIONE PRIMARIA (UI Level)

```
Dashboard Challenges
├── 🆓 FREE COMPETITIONS (Sezione separata, verde)
│   ├── Paper Trading Competitions
│   ├── Demo Contests
│   └── Free Tournaments
│
└── 💰 PAID EVALUATIONS (Sezione separata, blu)
    ├── Prop Firm Challenges
    │   ├── Con trial gratuito disponibile (badge "Free Trial")
    │   └── Senza trial
    │
    └── Instant Funding (badge "Instant", viola)
```

**REGOLA UI**: Le due sezioni DEVONO essere visivamente separate nella dashboard.

---

## 📊 SCHEMA DATI NORMALIZZATO (Supabase/Postgres)

### Tabelle Core

#### 1. `organizers` - Chi organizza
```sql
CREATE TABLE IF NOT EXISTS organizers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  organizer_type TEXT NOT NULL, -- prop_firm | broker | platform | exchange
  website_url TEXT NOT NULL,
  founded_year INT,
  headquarters TEXT,
  legal_status TEXT, -- active | paused | legal_issues | ceased
  legal_notes TEXT,
  logo_url TEXT,
  
  -- Trust Metrics (calcolati)
  reputation_score NUMERIC(5,2), -- 0-100
  trustpilot_score NUMERIC(3,2), -- 0-5
  trustpilot_reviews INT,
  trustpilot_updated_at DATE,
  
  -- Payout History
  total_paid_out NUMERIC,
  total_paid_currency TEXT DEFAULT 'USD',
  active_traders INT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Indexes
CREATE INDEX idx_organizers_type ON organizers(organizer_type);
CREATE INDEX idx_organizers_status ON organizers(legal_status);
```

#### 2. `programs` - Linea prodotto (es. "FTMO Challenge", "Stellar", "The Leap")
```sql
CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  organizer_id TEXT REFERENCES organizers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  
  -- Categorizzazione
  category TEXT NOT NULL, -- free_competition | paid_evaluation | instant_funding
  type TEXT NOT NULL, -- paper_trading | demo_contest | prop_challenge | tournament
  subtype TEXT, -- 1_step | 2_step | 3_step | instant | recurring | one_time
  
  -- URLs & Info
  official_url TEXT NOT NULL,
  terms_url TEXT,
  faq_url TEXT,
  description TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active', -- active | upcoming | ended | paused
  
  -- Trial Info (IMPORTANTE!)
  has_free_trial BOOLEAN DEFAULT FALSE,
  free_trial_description TEXT,
  free_trial_url TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_programs_organizer ON programs(organizer_id);
CREATE INDEX idx_programs_category ON programs(category);
CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_trial ON programs(has_free_trial);
```

#### 3. `offers` - Tagli specifici (account size o edizione torneo)
```sql
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  program_id TEXT REFERENCES programs(id) ON DELETE CASCADE,
  
  -- Naming
  offer_name TEXT, -- "FTMO Challenge $10K", "Stellar Lite $5K"
  display_order INT DEFAULT 0, -- Per ordinamento UI
  
  -- Account/Prize
  account_size NUMERIC,
  account_currency TEXT DEFAULT 'USD',
  entry_fee NUMERIC,
  fee_currency TEXT DEFAULT 'USD',
  refundable BOOLEAN DEFAULT FALSE,
  refund_conditions TEXT,
  prize_pool NUMERIC, -- Per free competitions
  
  -- Scaling
  scaling_max NUMERIC,
  scaling_conditions TEXT,
  
  -- Timing
  time_limit_days INT, -- NULL = unlimited
  recurring BOOLEAN DEFAULT FALSE,
  frequency TEXT, -- always_open | monthly | quarterly | annual | one_time
  start_date DATE,
  end_date DATE,
  registration_deadline DATE,
  next_edition_date DATE,
  
  -- Restrictions
  max_participants INT,
  min_age INT,
  kyc_required BOOLEAN DEFAULT FALSE,
  geo_restrictions JSONB, -- ["US", "CA", "UK"] = allowed, or blocked list
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE,
  is_hot BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_offers_program ON offers(program_id);
CREATE INDEX idx_offers_fee ON offers(entry_fee);
CREATE INDEX idx_offers_size ON offers(account_size);
CREATE INDEX idx_offers_featured ON offers(is_featured);
```

#### 4. `rulesets` - Regole di trading
```sql
CREATE TABLE IF NOT EXISTS rulesets (
  id TEXT PRIMARY KEY,
  offer_id TEXT REFERENCES offers(id) ON DELETE CASCADE,
  
  -- Phase Info (per multi-step)
  phase_number INT DEFAULT 1, -- 1, 2, 3
  phase_name TEXT, -- "Challenge", "Verification", "Phase 1"
  
  -- Profit Targets
  profit_target_pct NUMERIC(5,2) NOT NULL,
  
  -- Loss Limits
  max_daily_loss_pct NUMERIC(5,2),
  max_daily_loss_type TEXT, -- equity_based | balance_based | static
  max_drawdown_pct NUMERIC(5,2),
  max_drawdown_type TEXT, -- equity_based | balance_based | trailing | static
  
  -- Trading Days
  min_trading_days INT,
  max_trading_days INT,
  
  -- Consistency
  consistency_rule TEXT,
  consistency_required BOOLEAN DEFAULT FALSE,
  best_day_max_pct NUMERIC(5,2), -- es. 30% = best day max 30% of total profit
  
  -- Trading Restrictions
  weekend_holding BOOLEAN DEFAULT TRUE,
  news_trading BOOLEAN DEFAULT TRUE,
  news_trading_window_minutes INT, -- es. 2 = 2-min window before/after news
  ea_allowed BOOLEAN DEFAULT TRUE,
  hedging_allowed BOOLEAN DEFAULT TRUE,
  scalping_allowed BOOLEAN DEFAULT TRUE,
  
  -- Position Limits
  max_position_size TEXT,
  max_contracts INT,
  max_lots NUMERIC,
  
  -- Other Rules
  compulsory_stop_loss BOOLEAN DEFAULT FALSE,
  weekend_force_close BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_rulesets_offer ON rulesets(offer_id);
CREATE INDEX idx_rulesets_phase ON rulesets(phase_number);
```

#### 5. `payout_terms` - Condizioni di payout
```sql
CREATE TABLE IF NOT EXISTS payout_terms (
  id TEXT PRIMARY KEY,
  offer_id TEXT REFERENCES offers(id) ON DELETE CASCADE,
  
  -- Profit Split
  profit_split_initial_pct NUMERIC(5,2),
  profit_split_scaled_pct NUMERIC(5,2),
  profit_split_max_pct NUMERIC(5,2),
  profit_split_conditions TEXT,
  
  -- Payout Timing
  payout_frequency TEXT, -- on_demand | daily | weekly | bi_weekly | monthly | cycle
  first_payout_delay_days INT,
  subsequent_payout_delay_days INT,
  
  -- Withdrawal
  min_withdrawal NUMERIC,
  max_withdrawal NUMERIC,
  withdrawal_methods JSONB, -- ["bank", "crypto", "paypal", "wise"]
  
  -- Processing
  payout_processing_time_hours INT, -- es. 24h, 72h
  
  -- Special Conditions
  first_payout_special_conditions TEXT,
  payout_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payout_offer ON payout_terms(offer_id);
```

#### 6. `market_access` - Mercati e piattaforme
```sql
CREATE TABLE IF NOT EXISTS market_access (
  id TEXT PRIMARY KEY,
  offer_id TEXT REFERENCES offers(id) ON DELETE CASCADE,
  
  -- Markets
  markets_available JSONB, -- ["forex", "futures", "indices", "commodities", "crypto", "stocks"]
  
  -- Instruments
  instruments_count INT,
  instruments_list JSONB, -- ["EUR/USD", "GBP/USD", "NQ", "ES", "BTC/USD"]
  
  -- Leverage
  leverage_forex TEXT, -- "1:100"
  leverage_indices TEXT,
  leverage_commodities TEXT,
  leverage_crypto TEXT,
  leverage_stocks TEXT,
  
  -- Platforms
  platforms JSONB, -- ["MT4", "MT5", "cTrader", "TradingView", "NinjaTrader"]
  platform_fees JSONB, -- {"cTrader": 25} = $25 extra fee
  
  -- Trading Hours
  trading_hours TEXT,
  trading_hours_restrictions TEXT,
  
  -- Costs
  spreads_from NUMERIC,
  commission_forex NUMERIC,
  commission_type TEXT, -- per_lot | per_side | round_turn | percentage
  commission_other JSONB, -- {"metals": 1, "indices": 0}
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_market_offer ON market_access(offer_id);
```

#### 7. `trust_metrics` - Metriche di fiducia (calcolate)
```sql
CREATE TABLE IF NOT EXISTS trust_metrics (
  id TEXT PRIMARY KEY,
  organizer_id TEXT REFERENCES organizers(id) ON DELETE CASCADE,
  
  -- Reputation Score Components (0-100 total)
  longevity_score NUMERIC(5,2), -- 0-20 (anni attività)
  transparency_score NUMERIC(5,2), -- 0-15 (docs, help center)
  payout_policy_score NUMERIC(5,2), -- 0-20 (policy chiara + prove)
  legal_penalty NUMERIC(5,2), -- 0-30 (controversie, shutdown)
  user_feedback_score NUMERIC(5,2), -- 0-15 (Trustpilot + forum)
  disclosure_score NUMERIC(5,2), -- 0-10 (sim vs live clarity)
  
  -- Total (calcolato)
  total_reputation_score NUMERIC(5,2), -- somma dei componenti
  
  -- Success Metrics
  success_rate_pct NUMERIC(5,2), -- % che passa challenge
  avg_pass_days INT,
  
  -- Calculation Date
  calculated_at DATE NOT NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trust_organizer ON trust_metrics(organizer_id);
CREATE INDEX idx_trust_score ON trust_metrics(total_reputation_score);
```

#### 8. `sources` - Fonti dati (AUDIT TRAIL)
```sql
CREATE TABLE IF NOT EXISTS sources (
  id BIGSERIAL PRIMARY KEY,
  source_type TEXT NOT NULL, -- official | help_center | terms | faq | review | news | trustpilot
  title TEXT,
  url TEXT NOT NULL,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Freshness
  freshness_days INT GENERATED ALWAYS AS (
    EXTRACT(DAY FROM NOW() - accessed_at)
  ) STORED,
  
  -- Status
  status TEXT DEFAULT 'valid', -- valid | outdated | broken | review_needed
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sources_type ON sources(source_type);
CREATE INDEX idx_sources_freshness ON sources(freshness_days);
CREATE INDEX idx_sources_status ON sources(status);
```

#### 9. `field_sources` - Fonte per singolo campo (AUDIT GRANULARE)
```sql
CREATE TABLE IF NOT EXISTS field_sources (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  source_id BIGINT REFERENCES sources(id) ON DELETE CASCADE,
  
  -- Evidence
  quote TEXT, -- Citazione esatta dalla fonte
  confidence NUMERIC(3,2) DEFAULT 0.8, -- 0-1
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_field_sources_record ON field_sources(table_name, record_id);
CREATE INDEX idx_field_sources_field ON field_sources(field_name);
CREATE INDEX idx_field_sources_source ON field_sources(source_id);
```

#### 10. `snapshots` - Versioning (storico modifiche)
```sql
CREATE TABLE IF NOT EXISTS snapshots (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  snapshot_date DATE NOT NULL,
  data JSONB NOT NULL, -- Snapshot completo del record
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_snapshots_record ON snapshots(table_name, record_id);
CREATE INDEX idx_snapshots_date ON snapshots(snapshot_date);
```

---

## 🎨 CAMPI UI/UX AGGIUNTIVI

### Badges & Tags
```sql
-- Aggiungere a offers table
ALTER TABLE offers ADD COLUMN badges JSONB;
-- ["cheapest", "best_scaling", "instant", "hot", "new", "verified", "top_rated"]

ALTER TABLE offers ADD COLUMN tags JSONB;
-- ["beginner_friendly", "crypto_trading", "no_time_limit", "high_leverage"]
```

### Pros & Cons
```sql
-- Aggiungere a programs table
ALTER TABLE programs ADD COLUMN pros JSONB;
-- ["Excellent reputation", "Refundable fee", "Scaling to $2M"]

ALTER TABLE programs ADD COLUMN cons JSONB;
-- ["Strict consistency rule", "Low pass rate", "High fees"]

ALTER TABLE programs ADD COLUMN best_for TEXT;
-- "Serious traders with proven strategy, patient traders"

ALTER TABLE programs ADD COLUMN not_recommended_for TEXT;
-- "Beginners, aggressive scalpers, traders needing quick results"
```

---

## 📋 CAMPI OBBLIGATORI (Data Quality)

### Sempre Obbligatori
- `organizers`: name, organizer_type, website_url, legal_status
- `programs`: name, category, type, official_url, status
- `offers`: program_id, entry_fee, refundable
- `rulesets`: profit_target_pct, max_daily_loss_pct, max_drawdown_pct
- `payout_terms`: profit_split_initial_pct, payout_frequency, first_payout_delay_days
- `market_access`: markets_available, platforms
- `sources`: source_type, url, accessed_at

### Obbligatori per Paid Evaluations
- `offers`: account_size, account_currency
- `rulesets`: min_trading_days
- `payout_terms`: min_withdrawal, withdrawal_methods

### Obbligatori per Free Competitions
- `offers`: prize_pool (se presente), start_date, end_date
- `offers`: max_participants (se limitato)

---

## 🔄 FRESHNESS RULES (Data Quality)

### Regole Automatiche
```sql
-- Trigger per aggiornare status sources
CREATE OR REPLACE FUNCTION check_source_freshness()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.freshness_days > 90 THEN
    NEW.status = 'review_needed';
  ELSIF NEW.freshness_days > 180 THEN
    NEW.status = 'outdated';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_source_freshness
BEFORE INSERT OR UPDATE ON sources
FOR EACH ROW
EXECUTE FUNCTION check_source_freshness();
```

### Alert System
- freshness_days > 90 ⇒ Status: REVIEW (giallo)
- freshness_days > 180 ⇒ Status: OUTDATED (rosso)
- URL non raggiungibile ⇒ Status: BROKEN (rosso)
- Organizer legal_status = 'paused' ⇒ Tutti gli offers: status = 'paused'

---

## 🎯 REPUTATION SCORE FORMULA (0-100)

```sql
CREATE OR REPLACE FUNCTION calculate_reputation_score(org_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
  longevity NUMERIC := 0;
  transparency NUMERIC := 0;
  payout_policy NUMERIC := 0;
  legal_penalty NUMERIC := 0;
  user_feedback NUMERIC := 0;
  disclosure NUMERIC := 0;
  total NUMERIC := 0;
BEGIN
  -- 1. Longevity (0-20): anni di attività
  SELECT LEAST(20, (EXTRACT(YEAR FROM NOW()) - founded_year) * 2)
  INTO longevity
  FROM organizers WHERE id = org_id;
  
  -- 2. Transparency (0-15): docs complete
  -- TODO: Implementare logica basata su presenza terms_url, faq_url, etc.
  transparency := 10; -- Placeholder
  
  -- 3. Payout Policy (0-20): policy verificabile
  -- TODO: Implementare logica basata su field_sources per payout_terms
  payout_policy := 15; -- Placeholder
  
  -- 4. Legal Penalty (0-30): controversie
  SELECT CASE legal_status
    WHEN 'active' THEN 0
    WHEN 'paused' THEN -15
    WHEN 'legal_issues' THEN -25
    WHEN 'ceased' THEN -30
    ELSE 0
  END INTO legal_penalty
  FROM organizers WHERE id = org_id;
  
  -- 5. User Feedback (0-15): Trustpilot normalized
  SELECT LEAST(15, (trustpilot_score / 5.0) * 15)
  INTO user_feedback
  FROM organizers WHERE id = org_id;
  
  -- 6. Disclosure (0-10): sim vs live clarity
  -- TODO: Implementare logica basata su description/notes
  disclosure := 8; -- Placeholder
  
  -- Total
  total := longevity + transparency + payout_policy + legal_penalty + user_feedback + disclosure;
  
  RETURN GREATEST(0, LEAST(100, total));
END;
$$ LANGUAGE plpgsql;
```

---

## 🚀 WORKFLOW IMPLEMENTAZIONE

### Phase 1: Schema Creation (2 ore)
1. Creare tutte le tabelle in Supabase
2. Creare indexes
3. Creare triggers per freshness
4. Creare function per reputation score
5. Testare con dati mock

### Phase 2: Data Collection (4-6 ore)
1. **Tier 1 Prop Firms** (15 offers):
   - FTMO (5 offers)
   - FundedNext (6 offers - solo Stellar per ora)
   - The5ers (3 offers)
   - E8 Markets (2 offers)
   - The Funded Trader (3 offers - solo Knight/Royal)

2. **Free Competitions** (5 competitions):
   - TradingView The Leap
   - TradingView Paper Trading
   - Deriv Tournaments
   - Gate.io Demo Challenge
   - Binance Futures Demo

3. **Sources**: Per ogni campo critico, salvare fonte

### Phase 3: TypeScript Types (1 ora)
1. Generare types da schema Supabase
2. Creare helper types per UI
3. Creare validation schemas (Zod)

### Phase 4: UI Implementation (4-6 ore)
1. Separare visivamente FREE vs PAID
2. Implementare filters avanzati
3. Implementare sorting
4. Implementare badges/tags
5. Mobile responsive

---

## 📊 ESEMPIO COMPLETO: FTMO Challenge $10K

```sql
-- 1. Organizer
INSERT INTO organizers (id, name, organizer_type, website_url, founded_year, headquarters, legal_status, reputation_score, trustpilot_score, trustpilot_reviews)
VALUES ('ftmo', 'FTMO', 'prop_firm', 'https://ftmo.com', 2015, 'Prague, Czech Republic', 'active', 96, 4.6, 15000);

-- 2. Program
INSERT INTO programs (id, organizer_id, name, category, type, subtype, official_url, status, has_free_trial, description)
VALUES ('ftmo-challenge', 'ftmo', 'FTMO Challenge', 'paid_evaluation', 'prop_challenge', '2_step', 'https://ftmo.com/en/challenge/', 'active', TRUE, 'FTMO''s flagship 2-step evaluation program...');

-- 3. Offer
INSERT INTO offers (id, program_id, offer_name, account_size, account_currency, entry_fee, fee_currency, refundable, refund_conditions, scaling_max, time_limit_days, recurring, frequency)
VALUES ('ftmo-challenge-10k', 'ftmo-challenge', 'FTMO Challenge $10,000', 10000, 'USD', 155, 'EUR', TRUE, 'Refunded on first profit split', 200000, NULL, FALSE, 'always_open');

-- 4. Ruleset Phase 1
INSERT INTO rulesets (id, offer_id, phase_number, phase_name, profit_target_pct, max_daily_loss_pct, max_daily_loss_type, max_drawdown_pct, max_drawdown_type, min_trading_days, consistency_required, best_day_max_pct, weekend_holding, news_trading, ea_allowed)
VALUES ('ftmo-challenge-10k-phase1', 'ftmo-challenge-10k', 1, 'Challenge', 10, 5, 'equity_based', 10, 'equity_based', 4, TRUE, 30, TRUE, TRUE, TRUE);

-- 5. Ruleset Phase 2
INSERT INTO rulesets (id, offer_id, phase_number, phase_name, profit_target_pct, max_daily_loss_pct, max_daily_loss_type, max_drawdown_pct, max_drawdown_type, min_trading_days, consistency_required, best_day_max_pct, weekend_holding, news_trading, ea_allowed)
VALUES ('ftmo-challenge-10k-phase2', 'ftmo-challenge-10k', 2, 'Verification', 5, 5, 'equity_based', 10, 'equity_based', 4, TRUE, 30, TRUE, TRUE, TRUE);

-- 6. Payout Terms
INSERT INTO payout_terms (id, offer_id, profit_split_initial_pct, profit_split_scaled_pct, profit_split_max_pct, payout_frequency, first_payout_delay_days, min_withdrawal, withdrawal_methods, payout_processing_time_hours)
VALUES ('ftmo-challenge-10k-payout', 'ftmo-challenge-10k', 80, 90, 90, 'bi_weekly', 14, 50, '["bank", "crypto"]', 72);

-- 7. Market Access
INSERT INTO market_access (id, offer_id, markets_available, instruments_count, leverage_forex, leverage_indices, leverage_commodities, leverage_crypto, platforms, commission_forex)
VALUES ('ftmo-challenge-10k-market', 'ftmo-challenge-10k', '["forex", "indices", "commodities", "crypto"]', 100, '1:100', '1:100', '1:100', '1:2', '["MT4", "MT5", "cTrader", "DXtrade"]', 0);

-- 8. Source
INSERT INTO sources (source_type, title, url, accessed_at)
VALUES ('official', 'FTMO Challenge Pricing Page', 'https://ftmo.com/en/challenge/', '2026-01-26');

-- 9. Field Sources (esempi)
INSERT INTO field_sources (table_name, record_id, field_name, source_id, quote, confidence)
VALUES 
  ('offers', 'ftmo-challenge-10k', 'entry_fee', 1, 'Account Size $10,000 | Entry Fee €155', 1.0),
  ('rulesets', 'ftmo-challenge-10k-phase1', 'profit_target_pct', 1, 'Profit Target: 10%', 1.0),
  ('rulesets', 'ftmo-challenge-10k-phase1', 'max_daily_loss_pct', 1, 'Maximum Daily Loss: 5% (Equity-based)', 1.0);
```

---

## ✅ CHECKLIST FINALE

### Schema Design
- [ ] Tutte le tabelle create
- [ ] Tutti gli indexes creati
- [ ] Triggers per freshness implementati
- [ ] Function per reputation score implementata
- [ ] Constraints e foreign keys corretti

### Data Quality
- [ ] Campi obbligatori definiti
- [ ] Freshness rules implementate
- [ ] Source tracking per campi critici
- [ ] Snapshot system per versioning

### UI/UX Requirements
- [ ] Distinzione FREE vs PAID chiara
- [ ] Badges e tags definiti
- [ ] Pros/cons per ogni program
- [ ] Trial info visibile
- [ ] Mobile responsive

### Documentation
- [ ] Schema documentato
- [ ] Esempi di query
- [ ] Workflow di data collection
- [ ] Regole di data quality

---

**Status**: ✅ Schema Completo Definito  
**Next**: Implementare schema in Supabase  
**Estimated Time**: 2 ore per schema + 4-6 ore per data collection

