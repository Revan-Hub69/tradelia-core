-- =========================================================================
-- TRADELIA CHALLENGE LIBRARY - ENTERPRISE SCHEMA 2026
-- =========================================================================
-- Version: 1.0.0
-- Date: 2026-01-26
-- Description: Complete normalized schema for challenges with audit trail
-- Fixes: All 7 critical issues from ChatGPT audit
-- =========================================================================

-- ========================= 
-- 0) DROP OLD TABLES (if exist)
-- ========================= 
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS challenge_rules CASCADE;

-- ========================= 
-- 1) ENUMS (Type Safety)
-- ========================= 
DO $$ BEGIN
  CREATE TYPE organizer_type_enum AS ENUM ('prop_firm','broker','platform','exchange');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE legal_status_enum AS ENUM ('active','paused','legal_issues','ceased');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE program_category_enum AS ENUM ('free_competition','paid_evaluation','instant_funding');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE program_type_enum AS ENUM ('paper_trading','demo_contest','prop_challenge','tournament');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE program_status_enum AS ENUM ('active','upcoming','ended','paused');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE frequency_enum AS ENUM ('always_open','monthly','quarterly','annual','one_time');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payout_frequency_enum AS ENUM ('on_demand','daily','weekly','bi_weekly','monthly','cycle');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE source_type_enum AS ENUM ('official','help_center','terms','faq','review','news','trustpilot');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE source_status_enum AS ENUM ('valid','outdated','broken','review_needed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE geo_mode_enum AS ENUM ('allow','block');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ruleset_mode_enum AS ENUM ('target_based','ranking_based');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ========================= 
-- 2) COMMON TRIGGER: updated_at
-- ========================= 
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================= 
-- 3) CORE TABLES
-- ========================= 

-- -------------------------
-- 3.1) ORGANIZERS
-- -------------------------
CREATE TABLE IF NOT EXISTS organizers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  organizer_type organizer_type_enum NOT NULL,
  website_url TEXT NOT NULL,
  founded_year INT,
  headquarters TEXT,
  legal_status legal_status_enum NOT NULL DEFAULT 'active',
  legal_notes TEXT,
  logo_url TEXT,
  
  -- Trust Metrics (quick fields for UI; details in trust_metrics)
  reputation_score NUMERIC(5,2),
  trustpilot_score NUMERIC(3,2),
  trustpilot_reviews INT,
  trustpilot_updated_at DATE,
  
  total_paid_out NUMERIC,
  total_paid_currency TEXT DEFAULT 'USD',
  active_traders INT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  
  -- Constraints
  CONSTRAINT chk_organizers_trustpilot CHECK (
    trustpilot_score IS NULL OR (trustpilot_score >= 0 AND trustpilot_score <= 5)
  ),
  CONSTRAINT chk_organizers_reputation CHECK (
    reputation_score IS NULL OR (reputation_score >= 0 AND reputation_score <= 100)
  )
);

CREATE INDEX IF NOT EXISTS idx_organizers_type ON organizers(organizer_type);
CREATE INDEX IF NOT EXISTS idx_organizers_status ON organizers(legal_status);
CREATE INDEX IF NOT EXISTS idx_organizers_reputation ON organizers(reputation_score);

CREATE TRIGGER trg_organizers_updated 
BEFORE UPDATE ON organizers 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE organizers IS 'Prop firms, brokers, platforms, exchanges that organize challenges';
COMMENT ON COLUMN organizers.id IS 'Slug ID (e.g., ftmo, fundednext, tradingview)';
COMMENT ON COLUMN organizers.reputation_score IS 'Calculated score 0-100 from trust_metrics';

-- -------------------------
-- 3.2) PROGRAMS
-- -------------------------
CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  organizer_id TEXT NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  
  category program_category_enum NOT NULL,
  type program_type_enum NOT NULL,
  subtype TEXT,
  
  official_url TEXT NOT NULL,
  terms_url TEXT,
  faq_url TEXT,
  description TEXT,
  
  status program_status_enum NOT NULL DEFAULT 'active',
  
  has_free_trial BOOLEAN NOT NULL DEFAULT FALSE,
  free_trial_description TEXT,
  free_trial_url TEXT,
  
  -- UX fields
  pros JSONB,
  cons JSONB,
  best_for TEXT,
  not_recommended_for TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_programs_organizer ON programs(organizer_id);
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_trial ON programs(has_free_trial);

CREATE TRIGGER trg_programs_updated 
BEFORE UPDATE ON programs 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE programs IS 'Challenge programs (e.g., FTMO Challenge, Stellar, The Leap)';
COMMENT ON COLUMN programs.id IS 'Slug ID (e.g., ftmo-challenge, fundednext-stellar-lite)';
COMMENT ON COLUMN programs.category IS 'FREE vs PAID distinction for UI';
COMMENT ON COLUMN programs.has_free_trial IS 'Shows "Free Trial" badge in UI';

-- -------------------------
-- 3.3) OFFERS
-- -------------------------
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  
  offer_name TEXT,
  display_order INT NOT NULL DEFAULT 0,
  
  account_size NUMERIC,
  account_currency TEXT DEFAULT 'USD',
  
  entry_fee NUMERIC,
  fee_currency TEXT DEFAULT 'USD',
  refundable BOOLEAN NOT NULL DEFAULT FALSE,
  refund_conditions TEXT,
  
  prize_pool NUMERIC,
  
  scaling_max NUMERIC,
  scaling_conditions TEXT,
  
  time_limit_days INT, -- NULL = unlimited
  recurring BOOLEAN NOT NULL DEFAULT FALSE,
  frequency frequency_enum NOT NULL DEFAULT 'always_open',
  start_date DATE,
  end_date DATE,
  registration_deadline DATE,
  next_edition_date DATE,
  
  max_participants INT,
  min_age INT,
  kyc_required BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- FIX #3: Semantic geo restrictions
  geo_mode geo_mode_enum DEFAULT 'block',
  geo_list JSONB, -- ["US","CA"] etc.
  
  -- UI flags
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_hot BOOLEAN NOT NULL DEFAULT FALSE,
  badges JSONB,
  tags JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT chk_offers_entry_fee CHECK (entry_fee IS NULL OR entry_fee >= 0),
  CONSTRAINT chk_offers_account_size CHECK (account_size IS NULL OR account_size > 0),
  CONSTRAINT chk_offers_prize_pool CHECK (prize_pool IS NULL OR prize_pool >= 0)
);

CREATE INDEX IF NOT EXISTS idx_offers_program ON offers(program_id);
CREATE INDEX IF NOT EXISTS idx_offers_fee ON offers(entry_fee);
CREATE INDEX IF NOT EXISTS idx_offers_size ON offers(account_size);
CREATE INDEX IF NOT EXISTS idx_offers_featured ON offers(is_featured);
CREATE INDEX IF NOT EXISTS idx_offers_hot ON offers(is_hot);

CREATE TRIGGER trg_offers_updated 
BEFORE UPDATE ON offers 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE offers IS 'Specific account sizes or tournament editions';
COMMENT ON COLUMN offers.id IS 'Slug ID (e.g., ftmo-challenge-10k, stellar-lite-5k)';
COMMENT ON COLUMN offers.geo_mode IS 'allow = whitelist, block = blacklist';
COMMENT ON COLUMN offers.badges IS 'UI badges: ["cheapest", "best_scaling", "hot"]';

-- -------------------------
-- 3.4) RULESETS
-- -------------------------
CREATE TABLE IF NOT EXISTS rulesets (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  
  phase_number INT NOT NULL DEFAULT 1,
  phase_name TEXT,
  
  -- FIX #2: Nullable profit target for ranking-based
  ruleset_mode ruleset_mode_enum NOT NULL DEFAULT 'target_based',
  
  profit_target_pct NUMERIC(5,2), -- nullable for ranking-based
  max_daily_loss_pct NUMERIC(5,2),
  max_daily_loss_type TEXT, -- equity_based | balance_based | static
  max_drawdown_pct NUMERIC(5,2),
  max_drawdown_type TEXT, -- equity_based | balance_based | trailing | static
  
  min_trading_days INT,
  max_trading_days INT,
  
  consistency_rule TEXT,
  consistency_required BOOLEAN NOT NULL DEFAULT FALSE,
  best_day_max_pct NUMERIC(5,2),
  
  -- FIX #6: Tri-state for permissions (allowed | not_allowed | unknown)
  weekend_holding BOOLEAN,
  weekend_holding_known BOOLEAN NOT NULL DEFAULT TRUE,
  news_trading BOOLEAN,
  news_trading_known BOOLEAN NOT NULL DEFAULT TRUE,
  ea_allowed BOOLEAN,
  ea_allowed_known BOOLEAN NOT NULL DEFAULT TRUE,
  hedging_allowed BOOLEAN,
  hedging_allowed_known BOOLEAN NOT NULL DEFAULT TRUE,
  scalping_allowed BOOLEAN,
  scalping_allowed_known BOOLEAN NOT NULL DEFAULT TRUE,
  
  max_position_size TEXT,
  max_contracts INT,
  max_lots NUMERIC,
  
  compulsory_stop_loss BOOLEAN NOT NULL DEFAULT FALSE,
  weekend_force_close BOOLEAN NOT NULL DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT chk_rulesets_phase_positive CHECK (phase_number >= 1),
  CONSTRAINT chk_rulesets_profit_target_range CHECK (
    profit_target_pct IS NULL OR (profit_target_pct >= 0 AND profit_target_pct <= 100)
  ),
  CONSTRAINT chk_rulesets_loss_ranges CHECK (
    (max_daily_loss_pct IS NULL OR (max_daily_loss_pct >= 0 AND max_daily_loss_pct <= 100))
    AND
    (max_drawdown_pct IS NULL OR (max_drawdown_pct >= 0 AND max_drawdown_pct <= 100))
  )
);

CREATE INDEX IF NOT EXISTS idx_rulesets_offer ON rulesets(offer_id);
CREATE INDEX IF NOT EXISTS idx_rulesets_phase ON rulesets(phase_number);

CREATE TRIGGER trg_rulesets_updated 
BEFORE UPDATE ON rulesets 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE rulesets IS 'Trading rules per phase (multi-step challenges have multiple rows)';
COMMENT ON COLUMN rulesets.id IS 'Slug ID (e.g., ftmo-10k-p1, ftmo-10k-p2)';
COMMENT ON COLUMN rulesets.ruleset_mode IS 'target_based = profit target, ranking_based = leaderboard';

-- -------------------------
-- 3.5) PAYOUT TERMS
-- -------------------------
CREATE TABLE IF NOT EXISTS payout_terms (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  
  profit_split_initial_pct NUMERIC(5,2),
  profit_split_scaled_pct NUMERIC(5,2),
  profit_split_max_pct NUMERIC(5,2),
  profit_split_conditions TEXT,
  
  payout_frequency payout_frequency_enum,
  first_payout_delay_days INT,
  subsequent_payout_delay_days INT,
  
  min_withdrawal NUMERIC,
  max_withdrawal NUMERIC,
  withdrawal_methods JSONB,
  
  payout_processing_time_hours INT,
  
  first_payout_special_conditions TEXT,
  payout_notes TEXT,
  
  -- FIX #4: Payout eligibility after phase
  eligible_after_phase INT, -- 0=instant, 1=after phase 1, 2=after phase 2, etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT chk_payout_profit_split CHECK (
    (profit_split_initial_pct IS NULL OR (profit_split_initial_pct BETWEEN 0 AND 100))
    AND (profit_split_scaled_pct IS NULL OR (profit_split_scaled_pct BETWEEN 0 AND 100))
    AND (profit_split_max_pct IS NULL OR (profit_split_max_pct BETWEEN 0 AND 100))
  )
);

CREATE INDEX IF NOT EXISTS idx_payout_offer ON payout_terms(offer_id);

CREATE TRIGGER trg_payout_updated 
BEFORE UPDATE ON payout_terms 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE payout_terms IS 'Payout conditions and profit splits';
COMMENT ON COLUMN payout_terms.id IS 'Slug ID (e.g., ftmo-10k-payout)';
COMMENT ON COLUMN payout_terms.eligible_after_phase IS 'When payouts become available (0=instant, 2=after eval)';

-- -------------------------
-- 3.6) MARKET ACCESS
-- -------------------------
CREATE TABLE IF NOT EXISTS market_access (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  
  markets_available JSONB,
  instruments_count INT,
  instruments_list JSONB,
  
  leverage_forex TEXT,
  leverage_indices TEXT,
  leverage_commodities TEXT,
  leverage_crypto TEXT,
  leverage_stocks TEXT,
  
  platforms JSONB,
  platform_fees JSONB,
  
  trading_hours TEXT,
  trading_hours_restrictions TEXT,
  
  spreads_from NUMERIC,
  commission_forex NUMERIC,
  commission_type TEXT,
  commission_other JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_offer ON market_access(offer_id);

CREATE TRIGGER trg_market_updated 
BEFORE UPDATE ON market_access 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE market_access IS 'Trading platforms, markets, leverage, costs';
COMMENT ON COLUMN market_access.id IS 'Slug ID (e.g., ftmo-10k-market)';
COMMENT ON COLUMN market_access.platforms IS 'Array: ["MT4", "MT5", "cTrader"]';

-- -------------------------
-- 3.7) TRUST METRICS (Time Series)
-- -------------------------
-- FIX #5: Primary key (organizer_id, calculated_at) for time series
CREATE TABLE IF NOT EXISTS trust_metrics (
  id BIGSERIAL PRIMARY KEY,
  organizer_id TEXT NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,
  
  longevity_score NUMERIC(5,2),
  transparency_score NUMERIC(5,2),
  payout_policy_score NUMERIC(5,2),
  legal_penalty NUMERIC(5,2),
  user_feedback_score NUMERIC(5,2),
  disclosure_score NUMERIC(5,2),
  
  total_reputation_score NUMERIC(5,2),
  
  success_rate_pct NUMERIC(5,2),
  avg_pass_days INT,
  
  calculated_at DATE NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT uq_trust_metrics UNIQUE (organizer_id, calculated_at)
);

CREATE INDEX IF NOT EXISTS idx_trust_organizer ON trust_metrics(organizer_id);
CREATE INDEX IF NOT EXISTS idx_trust_score ON trust_metrics(total_reputation_score);
CREATE INDEX IF NOT EXISTS idx_trust_calculated ON trust_metrics(calculated_at);

CREATE TRIGGER trg_trust_updated 
BEFORE UPDATE ON trust_metrics 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE trust_metrics IS 'Reputation scores over time (time series)';
COMMENT ON COLUMN trust_metrics.total_reputation_score IS 'Sum of all components (0-100)';

-- -------------------------
-- 3.8) SOURCES (Audit Trail)
-- -------------------------
-- FIX #1: NO freshness_days stored (calculated in view)
CREATE TABLE IF NOT EXISTS sources (
  id BIGSERIAL PRIMARY KEY,
  source_type source_type_enum NOT NULL,
  title TEXT,
  url TEXT NOT NULL,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status source_status_enum NOT NULL DEFAULT 'valid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sources_type ON sources(source_type);
CREATE INDEX IF NOT EXISTS idx_sources_status ON sources(status);
CREATE INDEX IF NOT EXISTS idx_sources_accessed ON sources(accessed_at);

COMMENT ON TABLE sources IS 'Data sources for audit trail';
COMMENT ON COLUMN sources.accessed_at IS 'When data was collected from this source';
COMMENT ON COLUMN sources.status IS 'valid | outdated | broken | review_needed';

-- -------------------------
-- 3.9) FIELD SOURCES (Granular Audit)
-- -------------------------
CREATE TABLE IF NOT EXISTS field_sources (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  source_id BIGINT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  quote TEXT,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.8,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT chk_field_sources_confidence CHECK (confidence BETWEEN 0 AND 1)
);

CREATE INDEX IF NOT EXISTS idx_field_sources_record ON field_sources(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_field_sources_field ON field_sources(field_name);
CREATE INDEX IF NOT EXISTS idx_field_sources_source ON field_sources(source_id);

CREATE TRIGGER trg_field_sources_updated 
BEFORE UPDATE ON field_sources 
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE field_sources IS 'Links individual fields to their sources';
COMMENT ON COLUMN field_sources.quote IS 'Exact quote from source for verification';
COMMENT ON COLUMN field_sources.confidence IS 'Confidence level 0-1';

-- -------------------------
-- 3.10) SNAPSHOTS (Versioning)
-- -------------------------
-- FIX #6: Add sources_used for audit link
CREATE TABLE IF NOT EXISTS snapshots (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  snapshot_date DATE NOT NULL,
  data JSONB NOT NULL,
  sources_used JSONB, -- [1,2,3] source IDs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_snapshots_record ON snapshots(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_date ON snapshots(snapshot_date);

COMMENT ON TABLE snapshots IS 'Historical snapshots of records for versioning';
COMMENT ON COLUMN snapshots.sources_used IS 'Array of source IDs used for this snapshot';

-- ========================= 
-- 4) VIEWS
-- ========================= 

-- -------------------------
-- 4.1) Sources with Freshness (Dynamic)
-- -------------------------
-- FIX #1: Freshness calculated dynamically
CREATE OR REPLACE VIEW sources_with_freshness AS
SELECT
  s.*,
  FLOOR(EXTRACT(EPOCH FROM (NOW() - s.accessed_at)) / 86400)::INT AS freshness_days
FROM sources s;

COMMENT ON VIEW sources_with_freshness IS 'Sources with dynamic freshness calculation';

-- -------------------------
-- 4.2) Dashboard Offers (Base UI)
-- -------------------------
CREATE OR REPLACE VIEW dashboard_offers AS
SELECT
  o.id AS offer_id,
  o.offer_name,
  o.display_order,
  o.entry_fee,
  o.fee_currency,
  o.refundable,
  o.prize_pool,
  o.account_size,
  o.account_currency,
  o.frequency,
  o.next_edition_date,
  o.is_featured,
  o.is_hot,
  o.badges,
  o.tags,
  o.geo_mode,
  o.geo_list,
  
  p.id AS program_id,
  p.name AS program_name,
  p.category,
  p.type,
  p.subtype,
  p.status AS program_status,
  p.official_url,
  p.has_free_trial,
  p.pros,
  p.cons,
  
  org.id AS organizer_id,
  org.name AS organizer_name,
  org.organizer_type,
  org.legal_status,
  org.reputation_score,
  org.trustpilot_score,
  org.logo_url
FROM offers o
JOIN programs p ON p.id = o.program_id
JOIN organizers org ON org.id = p.organizer_id;

COMMENT ON VIEW dashboard_offers IS 'Complete offer data for UI (joins organizers + programs + offers)';

-- -------------------------
-- 4.3) FREE Offers (Green Section)
-- -------------------------
CREATE OR REPLACE VIEW dashboard_free_offers AS
SELECT * FROM dashboard_offers
WHERE category = 'free_competition';

COMMENT ON VIEW dashboard_free_offers IS 'FREE competitions for green section in UI';

-- -------------------------
-- 4.4) PAID Offers (Blue Section)
-- -------------------------
CREATE OR REPLACE VIEW dashboard_paid_offers AS
SELECT * FROM dashboard_offers
WHERE category IN ('paid_evaluation','instant_funding');

COMMENT ON VIEW dashboard_paid_offers IS 'PAID evaluations for blue section in UI';

-- -------------------------
-- 4.5) Latest Trust Metrics
-- -------------------------
CREATE OR REPLACE VIEW organizers_trust_latest AS
SELECT DISTINCT ON (tm.organizer_id)
  tm.organizer_id,
  tm.calculated_at,
  tm.total_reputation_score,
  tm.longevity_score,
  tm.transparency_score,
  tm.payout_policy_score,
  tm.legal_penalty,
  tm.user_feedback_score,
  tm.disclosure_score,
  tm.success_rate_pct,
  tm.avg_pass_days
FROM trust_metrics tm
ORDER BY tm.organizer_id, tm.calculated_at DESC;

COMMENT ON VIEW organizers_trust_latest IS 'Latest trust metrics per organizer';

-- ========================= 
-- 5) FUNCTIONS
-- ========================= 

-- -------------------------
-- 5.1) Refresh Source Status (Cron Job)
-- -------------------------
-- FIX #1: Status update via scheduled function
CREATE OR REPLACE FUNCTION refresh_source_status()
RETURNS VOID AS $$
BEGIN
  UPDATE sources
  SET status = CASE
    WHEN accessed_at < NOW() - INTERVAL '180 days' THEN 'outdated'::source_status_enum
    WHEN accessed_at < NOW() - INTERVAL '90 days'  THEN 'review_needed'::source_status_enum
    ELSE 'valid'::source_status_enum
  END
  WHERE status <> 'broken';
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION refresh_source_status IS 'Updates source status based on freshness (run via cron)';

-- -------------------------
-- 5.2) Calculate Reputation Score (Application Logic)
-- -------------------------
-- Note: This is a placeholder. Actual calculation should be done in application code
-- and results stored in trust_metrics table.
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
  -- 1. Longevity (0-20): years of activity
  SELECT LEAST(20, (EXTRACT(YEAR FROM NOW()) - founded_year) * 2)
  INTO longevity
  FROM organizers WHERE id = org_id;
  
  -- 2. Legal Penalty (0 to -30)
  SELECT CASE legal_status
    WHEN 'active' THEN 0
    WHEN 'paused' THEN -15
    WHEN 'legal_issues' THEN -25
    WHEN 'ceased' THEN -30
    ELSE 0
  END INTO legal_penalty
  FROM organizers WHERE id = org_id;
  
  -- 3. User Feedback (0-15): Trustpilot normalized
  SELECT LEAST(15, (COALESCE(trustpilot_score, 0) / 5.0) * 15)
  INTO user_feedback
  FROM organizers WHERE id = org_id;
  
  -- Other components should be calculated by application
  transparency := 10; -- Placeholder
  payout_policy := 15; -- Placeholder
  disclosure := 8; -- Placeholder
  
  -- Total
  total := longevity + transparency + payout_policy + legal_penalty + user_feedback + disclosure;
  
  RETURN GREATEST(0, LEAST(100, total));
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_reputation_score IS 'Calculates reputation score (0-100) - use in application, not DB';

-- ========================= 
-- 6) SEED DATA (Minimal for Testing & Verification)
-- ========================= 

-- FIX #2: Add minimal seed data for verification

-- 1. Sample Organizer
INSERT INTO organizers (id, name, organizer_type, website_url, founded_year, headquarters, legal_status, reputation_score, trustpilot_score, trustpilot_reviews, trustpilot_updated_at)
VALUES ('ftmo', 'FTMO', 'prop_firm', 'https://ftmo.com', 2015, 'Prague, Czech Republic', 'active', 96, 4.6, 15000, '2026-01-26')
ON CONFLICT (id) DO NOTHING;

-- 2. Sample Program
INSERT INTO programs (id, organizer_id, name, category, type, subtype, official_url, terms_url, status, has_free_trial, free_trial_description, pros, cons)
VALUES ('ftmo-challenge', 'ftmo', 'FTMO Challenge', 'paid_evaluation', 'prop_challenge', '2_step', 'https://ftmo.com/en/challenge/', 'https://ftmo.com/en/terms-and-conditions/', 'active', TRUE, 'Free demo account to practice before purchasing challenge', 
  '["Excellent reputation (10+ years)", "Refundable fee on first payout", "Scaling to $2M", "No time limit", "High profit split (90%)"]'::jsonb,
  '["Strict consistency rule (30%)", "Low pass rate (8-10%)", "Relatively high entry fees", "Equity-based drawdown"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. Sample Offer
INSERT INTO offers (id, program_id, offer_name, account_size, account_currency, entry_fee, fee_currency, refundable, refund_conditions, scaling_max, time_limit_days, recurring, frequency, geo_mode, geo_list, display_order, badges, tags)
VALUES ('ftmo-challenge-10k', 'ftmo-challenge', 'FTMO Challenge $10,000', 10000, 'USD', 155, 'EUR', TRUE, 'Refunded on first profit split', 200000, NULL, FALSE, 'always_open', 'block', '["US"]'::jsonb, 1, '["verified", "top_rated"]'::jsonb, '["beginner_friendly", "no_time_limit"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 4. Sample Rulesets (2 phases)
INSERT INTO rulesets (id, offer_id, phase_number, phase_name, ruleset_mode, profit_target_pct, max_daily_loss_pct, max_daily_loss_type, max_drawdown_pct, max_drawdown_type, min_trading_days, consistency_required, best_day_max_pct, weekend_holding, weekend_holding_known, news_trading, news_trading_known, ea_allowed, ea_allowed_known)
VALUES 
  ('ftmo-challenge-10k-p1', 'ftmo-challenge-10k', 1, 'Challenge', 'target_based', 10, 5, 'equity_based', 10, 'equity_based', 4, TRUE, 30, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
  ('ftmo-challenge-10k-p2', 'ftmo-challenge-10k', 2, 'Verification', 'target_based', 5, 5, 'equity_based', 10, 'equity_based', 4, TRUE, 30, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 5. Sample Payout Terms
INSERT INTO payout_terms (id, offer_id, profit_split_initial_pct, profit_split_scaled_pct, profit_split_max_pct, payout_frequency, first_payout_delay_days, min_withdrawal, withdrawal_methods, payout_processing_time_hours, eligible_after_phase)
VALUES ('ftmo-challenge-10k-payout', 'ftmo-challenge-10k', 80, 90, 90, 'bi_weekly', 14, 50, '["bank", "crypto"]'::jsonb, 72, 2)
ON CONFLICT (id) DO NOTHING;

-- 6. Sample Market Access
INSERT INTO market_access (id, offer_id, markets_available, instruments_count, leverage_forex, leverage_indices, leverage_commodities, leverage_crypto, platforms, commission_forex, commission_type)
VALUES ('ftmo-challenge-10k-market', 'ftmo-challenge-10k', '["forex", "indices", "commodities", "crypto"]'::jsonb, 100, '1:100', '1:100', '1:100', '1:2', '["MT4", "MT5", "cTrader", "DXtrade"]'::jsonb, 0, 'per_lot')
ON CONFLICT (id) DO NOTHING;

-- 7. Sample Source
INSERT INTO sources (source_type, title, url, accessed_at, status)
VALUES ('official', 'FTMO Challenge Pricing Page', 'https://ftmo.com/en/challenge/', '2026-01-26', 'valid')
ON CONFLICT DO NOTHING
RETURNING id;

-- 8. Sample Field Sources (link data to sources)
-- Note: This requires the source_id from above, so it's done in application layer

-- ========================= 
-- 7) GRANTS (Supabase RLS - adjust as needed)
-- ========================= 

-- Grant read access to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on views
GRANT SELECT ON sources_with_freshness TO authenticated;
GRANT SELECT ON dashboard_offers TO authenticated;
GRANT SELECT ON dashboard_free_offers TO authenticated;
GRANT SELECT ON dashboard_paid_offers TO authenticated;
GRANT SELECT ON organizers_trust_latest TO authenticated;

-- ========================= 
-- 8) COMPLETION MESSAGE
-- ========================= 

DO $$
BEGIN
  RAISE NOTICE '✅ Challenge Library Schema Created Successfully!';
  RAISE NOTICE '📊 Tables: 10 core tables';
  RAISE NOTICE '👁️ Views: 5 views (FREE/PAID separation)';
  RAISE NOTICE '🔧 Functions: 2 functions (status refresh, reputation calc)';
  RAISE NOTICE '🌱 Seed: 1 complete challenge (FTMO $10K) for verification';
  RAISE NOTICE '🎯 Ready for data ingestion!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Next Steps:';
  RAISE NOTICE '1. Verify seed data: SELECT * FROM dashboard_offers;';
  RAISE NOTICE '2. Test views: SELECT * FROM dashboard_paid_offers;';
  RAISE NOTICE '3. Run ingestion script for remaining 24 challenges';
END $$;
