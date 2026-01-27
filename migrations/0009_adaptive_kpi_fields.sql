-- =========================================================================
-- ADAPTIVE KPI FIELDS - Migration 0009
-- =========================================================================
-- Version: 1.0.0
-- Date: 2026-01-27
-- Description: Add fields needed for adaptive KPI system
-- Related: CHALLENGE_LIBRARY_ENTERPRISE_GRADE_2026.md
-- =========================================================================

-- ========================= 
-- 1) ADD NEW FIELDS TO OFFERS TABLE
-- ========================= 

-- Prize fields for free competitions and tournaments
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS first_prize NUMERIC,
ADD COLUMN IF NOT EXISTS current_participants INT DEFAULT 0;

-- Add constraints (drop first if exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_offers_first_prize') THEN
    ALTER TABLE offers ADD CONSTRAINT chk_offers_first_prize CHECK (first_prize IS NULL OR first_prize >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_offers_participants') THEN
    ALTER TABLE offers ADD CONSTRAINT chk_offers_participants CHECK (current_participants >= 0);
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_offers_first_prize ON offers(first_prize) WHERE first_prize IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_offers_participants ON offers(current_participants);
CREATE INDEX IF NOT EXISTS idx_offers_dates ON offers(start_date, end_date) WHERE start_date IS NOT NULL;

-- ========================= 
-- 2) ADD RULESET MODE TO PROGRAMS
-- ========================= 

-- Add ruleset_mode to programs for ranking-based challenges
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS ruleset_mode ruleset_mode_enum DEFAULT 'target_based';

CREATE INDEX IF NOT EXISTS idx_programs_ruleset_mode ON programs(ruleset_mode);

-- ========================= 
-- 3) UPDATE VIEWS FOR ADAPTIVE KPIs
-- ========================= 

-- Drop and recreate dashboard_offers view with new fields
DROP VIEW IF EXISTS dashboard_offers CASCADE;

CREATE OR REPLACE VIEW dashboard_offers AS
SELECT
  o.id AS offer_id,
  o.offer_name,
  o.display_order,
  o.entry_fee,
  o.fee_currency,
  o.refundable,
  o.prize_pool,
  o.first_prize,
  o.max_participants,
  o.current_participants,
  o.account_size,
  o.account_currency,
  o.frequency,
  o.start_date,
  o.end_date,
  o.registration_deadline,
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
  p.ruleset_mode,
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

COMMENT ON VIEW dashboard_offers IS 'Complete offer data for UI with adaptive KPI fields';

-- Recreate dependent views
CREATE OR REPLACE VIEW dashboard_free_offers AS
SELECT * FROM dashboard_offers
WHERE category = 'free_competition';

COMMENT ON VIEW dashboard_free_offers IS 'FREE competitions for green section in UI';

CREATE OR REPLACE VIEW dashboard_paid_offers AS
SELECT * FROM dashboard_offers
WHERE category IN ('paid_evaluation','instant_funding');

COMMENT ON VIEW dashboard_paid_offers IS 'PAID evaluations for blue section in UI';

-- ========================= 
-- 4) ADD SAMPLE DATA FOR TESTING
-- ========================= 

-- Update FTMO Challenge to have ruleset_mode
UPDATE programs 
SET ruleset_mode = 'target_based'
WHERE id = 'ftmo-challenge';

-- Add a sample free competition for testing
INSERT INTO organizers (id, name, organizer_type, website_url, founded_year, headquarters, legal_status, reputation_score)
VALUES ('tradingview', 'TradingView', 'platform', 'https://www.tradingview.com', 2011, 'London, UK', 'active', 92)
ON CONFLICT (id) DO NOTHING;

INSERT INTO programs (id, organizer_id, name, category, type, subtype, official_url, status, has_free_trial, ruleset_mode, pros, cons)
VALUES ('tradingview-paper-trading', 'tradingview', 'TradingView Paper Trading Contest', 'free_competition', 'paper_trading', 'monthly', 'https://www.tradingview.com/paper-trading/', 'active', FALSE, 'ranking_based',
  '["Completely free", "No risk", "Real market data", "Monthly prizes", "Learn without losing money"]'::jsonb,
  '["Paper trading only", "No real money", "Limited to TradingView platform"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO offers (id, program_id, offer_name, account_size, account_currency, entry_fee, fee_currency, prize_pool, first_prize, max_participants, current_participants, recurring, frequency, start_date, end_date, registration_deadline, display_order, badges, tags)
VALUES ('tradingview-paper-monthly', 'tradingview-paper-trading', 'Monthly Paper Trading Contest', 100000, 'USD', NULL, NULL, 5000, 2000, 1000, 234, TRUE, 'monthly', '2026-02-01', '2026-02-28', '2026-01-31', 1, '["free", "beginner_friendly"]'::jsonb, '["paper_trading", "no_risk", "monthly"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Add ruleset for ranking-based challenge
INSERT INTO rulesets (id, offer_id, phase_number, phase_name, ruleset_mode, profit_target_pct, max_daily_loss_pct, max_drawdown_pct, min_trading_days, weekend_holding, weekend_holding_known, news_trading, news_trading_known, ea_allowed, ea_allowed_known)
VALUES ('tradingview-paper-monthly-p1', 'tradingview-paper-monthly', 1, 'Contest', 'ranking_based', NULL, NULL, NULL, NULL, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Add payout terms (prize distribution)
INSERT INTO payout_terms (id, offer_id, profit_split_initial_pct, profit_split_scaled_pct, profit_split_max_pct, payout_frequency, first_payout_delay_days, eligible_after_phase)
VALUES ('tradingview-paper-monthly-payout', 'tradingview-paper-monthly', 100, 100, 100, 'monthly', 7, 1)
ON CONFLICT (id) DO NOTHING;

-- Add market access
INSERT INTO market_access (id, offer_id, markets_available, instruments_count, platforms)
VALUES ('tradingview-paper-monthly-market', 'tradingview-paper-monthly', '["forex", "stocks", "crypto", "indices", "commodities"]'::jsonb, 500, '["TradingView"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ========================= 
-- 5) VERIFICATION QUERIES
-- ========================= 

-- Verify new fields exist
DO $
DECLARE
  field_count INT;
BEGIN
  -- Check offers table
  SELECT COUNT(*) INTO field_count
  FROM information_schema.columns
  WHERE table_name = 'offers'
  AND column_name IN ('first_prize', 'current_participants');
  
  IF field_count = 2 THEN
    RAISE NOTICE '✅ Offers table: All new fields added';
  ELSE
    RAISE WARNING '⚠️ Offers table: Missing fields (found % of 2)', field_count;
  END IF;
  
  -- Check programs table
  SELECT COUNT(*) INTO field_count
  FROM information_schema.columns
  WHERE table_name = 'programs'
  AND column_name = 'ruleset_mode';
  
  IF field_count = 1 THEN
    RAISE NOTICE '✅ Programs table: ruleset_mode added';
  ELSE
    RAISE WARNING '⚠️ Programs table: ruleset_mode missing';
  END IF;
  
  -- Check views
  SELECT COUNT(*) INTO field_count
  FROM information_schema.columns
  WHERE table_name = 'dashboard_offers'
  AND column_name IN ('first_prize', 'current_participants', 'ruleset_mode');
  
  IF field_count = 3 THEN
    RAISE NOTICE '✅ Views: All new fields available';
  ELSE
    RAISE WARNING '⚠️ Views: Missing fields (found % of 3)', field_count;
  END IF;
END $;

-- ========================= 
-- 6) TEST ADAPTIVE KPI QUERIES
-- ========================= 

-- Test query for free competition (should show prize_pool, first_prize, participants)
DO $
DECLARE
  test_record RECORD;
BEGIN
  SELECT 
    offer_id,
    program_name,
    category,
    ruleset_mode,
    prize_pool,
    first_prize,
    max_participants,
    current_participants,
    entry_fee
  INTO test_record
  FROM dashboard_offers
  WHERE category = 'free_competition'
  LIMIT 1;
  
  IF FOUND THEN
    RAISE NOTICE '✅ Free Competition Test:';
    RAISE NOTICE '   Program: %', test_record.program_name;
    RAISE NOTICE '   Prize Pool: $%', test_record.prize_pool;
    RAISE NOTICE '   1st Prize: $%', test_record.first_prize;
    RAISE NOTICE '   Participants: % / %', test_record.current_participants, test_record.max_participants;
    RAISE NOTICE '   Entry Fee: %', COALESCE(test_record.entry_fee::TEXT, 'FREE');
  ELSE
    RAISE WARNING '⚠️ No free competition found for testing';
  END IF;
END $;

-- Test query for paid evaluation (should show account_size, profit_split, entry_fee)
DO $
DECLARE
  test_record RECORD;
BEGIN
  SELECT 
    offer_id,
    program_name,
    category,
    ruleset_mode,
    account_size,
    account_currency,
    entry_fee,
    fee_currency
  INTO test_record
  FROM dashboard_offers
  WHERE category = 'paid_evaluation'
  LIMIT 1;
  
  IF FOUND THEN
    RAISE NOTICE '✅ Paid Evaluation Test:';
    RAISE NOTICE '   Program: %', test_record.program_name;
    RAISE NOTICE '   Account Size: % %', test_record.account_currency, test_record.account_size;
    RAISE NOTICE '   Entry Fee: % %', test_record.fee_currency, test_record.entry_fee;
    RAISE NOTICE '   Ruleset Mode: %', test_record.ruleset_mode;
  ELSE
    RAISE WARNING '⚠️ No paid evaluation found for testing';
  END IF;
END $;

-- ========================= 
-- 7) COMPLETION MESSAGE
-- ========================= 

DO $
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Migration 0009 Complete - Adaptive KPI Fields';
  RAISE NOTICE '📊 Added Fields:';
  RAISE NOTICE '   - offers.first_prize (for tournaments)';
  RAISE NOTICE '   - offers.current_participants (for limited spots)';
  RAISE NOTICE '   - programs.ruleset_mode (target_based | ranking_based)';
  RAISE NOTICE '👁️ Updated Views:';
  RAISE NOTICE '   - dashboard_offers (includes all new fields)';
  RAISE NOTICE '   - dashboard_free_offers';
  RAISE NOTICE '   - dashboard_paid_offers';
  RAISE NOTICE '🌱 Sample Data:';
  RAISE NOTICE '   - TradingView Paper Trading Contest (free competition)';
  RAISE NOTICE '   - FTMO Challenge (paid evaluation)';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Next Steps:';
  RAISE NOTICE '1. Test adaptive KPIs: SELECT * FROM dashboard_offers;';
  RAISE NOTICE '2. Verify free competitions: SELECT * FROM dashboard_free_offers;';
  RAISE NOTICE '3. Connect to Supabase and run migration';
  RAISE NOTICE '4. Update seed data with real challenges';
END $;

</content>
