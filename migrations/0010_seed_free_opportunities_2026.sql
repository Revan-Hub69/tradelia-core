-- ============================================================================
-- FREE OPPORTUNITIES SEED DATA - Migration 0010
-- ============================================================================
-- Date: 2026-01-27
-- Description: Seed verified free trading opportunities (0 EUR entry, real prizes)
-- Schema: organizers, programs, offers, rulesets, payout_terms (migrations 0006+0009)
-- ============================================================================

-- ============================================================================
-- TIER 1 ORGANIZERS - Highest reliability
-- ============================================================================

INSERT INTO organizers (id, name, organizer_type, website_url, founded_year, headquarters, legal_status, reputation_score, trustpilot_score, logo_url, notes)
VALUES
  ('ninjatrader', 'NinjaTrader', 'platform', 'https://ninjatrader.com', 2003, 'Denver, USA', 'active', 92, 4.5, '/logos/ninjatrader.svg', 'Futures trading platform'),
  ('primexbt', 'PrimeXBT', 'exchange', 'https://primexbt.com', 2018, 'Seychelles', 'active', 85, 4.2, '/logos/primexbt.svg', 'Crypto/Forex/Commodities'),
  ('the5ers', 'The5ers', 'prop_firm', 'https://the5ers.com', 2016, 'Israel', 'active', 88, 4.6, '/logos/the5ers.svg', 'Prop firm with free competitions'),
  ('bybit', 'Bybit', 'exchange', 'https://www.bybit.com', 2018, 'Dubai, UAE', 'active', 90, 4.4, '/logos/bybit.svg', 'Major crypto exchange')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- TIER 2 ORGANIZERS
-- ============================================================================

INSERT INTO organizers (id, name, organizer_type, website_url, founded_year, headquarters, legal_status, reputation_score, trustpilot_score, logo_url, notes)
VALUES
  ('bitget', 'Bitget', 'exchange', 'https://www.bitget.com', 2018, 'Seychelles', 'active', 84, 4.1, '/logos/bitget.svg', 'Crypto exchange'),
  ('tradingview', 'TradingView', 'platform', 'https://www.tradingview.com', 2011, 'London, UK', 'active', 95, 4.8, '/logos/tradingview.svg', 'Charting platform'),
  ('xm', 'XM', 'broker', 'https://www.xm.com', 2009, 'Cyprus', 'active', 87, 4.3, '/logos/xm.svg', 'Forex broker'),
  ('fbs', 'FBS', 'broker', 'https://fbs.com', 2009, 'Belize', 'active', 82, 4.0, '/logos/fbs.svg', 'Forex broker')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- TIER 3-4 ORGANIZERS
-- ============================================================================

INSERT INTO organizers (id, name, organizer_type, website_url, founded_year, headquarters, legal_status, reputation_score, logo_url, notes)
VALUES
  ('kucoin', 'KuCoin', 'exchange', 'https://www.kucoin.com', 2017, 'Seychelles', 'active', 83, '/logos/kucoin.svg', 'Crypto exchange'),
  ('mexc', 'MEXC', 'exchange', 'https://www.mexc.com', 2018, 'Seychelles', 'active', 80, '/logos/mexc.svg', 'Crypto exchange'),
  ('instaforex', 'InstaForex', 'broker', 'https://www.instaforex.com', 2007, 'Belize', 'active', 75, '/logos/instaforex.svg', 'Forex broker')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PROGRAMS - All Tiers
-- ============================================================================

INSERT INTO programs (id, organizer_id, name, category, type, subtype, official_url, status, has_free_trial, ruleset_mode, description, pros, cons, best_for)
VALUES
  -- TIER 1
  ('ninjatrader-arena', 'ninjatrader', 'NinjaTrader Arena', 'free_competition', 'demo_contest', 'monthly', 'https://ninjatrader.com/arena', 'active', FALSE, 'ranking_based',
   'Monthly futures trading competition with cash prizes',
   '["Cash prizes", "Professional platform"]'::jsonb, '["Complex futures"]'::jsonb, 'Futures traders'),
  ('primexbt-demo', 'primexbt', 'PrimeXBT Demo Contests', 'free_competition', 'demo_contest', 'weekly', 'https://primexbt.com/contests', 'active', FALSE, 'ranking_based',
   'Weekly demo contests with bonus prizes up to $10K',
   '["Weekly", "High bonuses"]'::jsonb, '["Volume conditions"]'::jsonb, 'Multi-asset traders'),
  ('the5ers-competition', 'the5ers', 'The5ers Trading Competition', 'free_competition', 'demo_contest', 'periodic', 'https://the5ers.com/competition', 'active', FALSE, 'ranking_based',
   'Competition with funded account prizes for top 3-5',
   '["Funded account prize"]'::jsonb, '["Extreme competition"]'::jsonb, 'Elite traders'),
  ('bybit-demo-arena', 'bybit', 'Bybit Demo Trading Arena', 'free_competition', 'demo_contest', 'weekly', 'https://www.bybit.com/trading-arena', 'active', FALSE, 'ranking_based',
   'Weekly demo arena with USDT prizes',
   '["USDT prizes", "Weekly"]'::jsonb, '["Crypto only"]'::jsonb, 'Crypto traders'),
  -- TIER 2
  ('bitget-demo', 'bitget', 'Bitget Demo Competitions', 'free_competition', 'demo_contest', 'weekly', 'https://www.bitget.com/competition', 'active', FALSE, 'ranking_based',
   'Regular demo competitions with USDT bonuses',
   '["Regular", "USDT bonuses"]'::jsonb, '["Conditions apply"]'::jsonb, 'Crypto traders'),
  ('tradingview-leap', 'tradingview', 'TradingView The Leap', 'free_competition', 'paper_trading', 'periodic', 'https://www.tradingview.com/leap', 'active', FALSE, 'ranking_based',
   'Paper trading competition with subscriptions/cash',
   '["No risk", "Subscriptions"]'::jsonb, '["Not always active"]'::jsonb, 'Learners'),
  ('xm-demo-contests', 'xm', 'XM Trading Competitions', 'free_competition', 'demo_contest', 'periodic', 'https://www.xm.com/competitions', 'active', FALSE, 'ranking_based',
   'Demo and real competitions with cash prizes',
   '["Cash prizes"]'::jsonb, '["Check status"]'::jsonb, 'Forex traders'),
  ('fbs-demo-contests', 'fbs', 'FBS Demo Contests', 'free_competition', 'demo_contest', 'periodic', 'https://fbs.com/contests', 'active', FALSE, 'ranking_based',
   'Various demo contests with bonus/cash prizes',
   '["Multiple contests"]'::jsonb, '["Conditions apply"]'::jsonb, 'Forex traders'),
  -- TIER 3-4
  ('kucoin-demo', 'kucoin', 'KuCoin Demo Competitions', 'free_competition', 'demo_contest', 'periodic', 'https://www.kucoin.com/competition', 'active', FALSE, 'ranking_based',
   'Demo trading battles with USDT prizes',
   '["USDT prizes"]'::jsonb, '["Periodic"]'::jsonb, 'Crypto traders'),
  ('mexc-demo', 'mexc', 'MEXC Demo Contests', 'free_competition', 'demo_contest', 'periodic', 'https://www.mexc.com/competition', 'active', FALSE, 'ranking_based',
   'Demo contests with USDT prizes',
   '["Simple contests"]'::jsonb, '["Variable"]'::jsonb, 'Crypto traders'),
  ('instaforex-contests', 'instaforex', 'InstaForex Contests', 'free_competition', 'demo_contest', 'periodic', 'https://www.instaforex.com/contests', 'active', FALSE, 'ranking_based',
   'Contests with cash pools over $10K',
   '["Large pools"]'::jsonb, '["Lower reliability"]'::jsonb, 'Forex traders')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- OFFERS - TIER 1 (with first_prize from migration 0009)
-- ============================================================================

INSERT INTO offers (id, program_id, offer_name, account_size, account_currency, entry_fee, fee_currency, prize_pool, first_prize, current_participants, recurring, frequency, start_date, end_date, registration_deadline, display_order, is_featured, is_hot, refund_conditions, scaling_conditions)
VALUES
  ('ninjatrader-arena-monthly', 'ninjatrader-arena', 'Monthly Arena', 100000, 'USD', NULL, NULL, 50000, 10000, 0, TRUE, 'monthly', '2026-02-01', '2026-02-28', '2026-01-31', 1, TRUE, TRUE, 'No refund - free entry', 'N/A - competition'),
  ('primexbt-demo-weekly', 'primexbt-demo', 'Weekly Demo Cup', 100000, 'USD', NULL, NULL, 10000, 3000, 0, TRUE, 'weekly', '2026-01-27', '2026-02-03', '2026-01-27', 2, TRUE, TRUE, 'No refund - free entry', 'Bonus requires volume'),
  ('the5ers-comp-main', 'the5ers-competition', 'Trading Competition', 100000, 'USD', NULL, NULL, NULL, 100000, 0, FALSE, 'one_time', '2026-01-01', '2026-12-31', '2026-12-31', 3, TRUE, FALSE, 'No refund - free entry', 'Funded account prize'),
  ('bybit-demo-weekly', 'bybit-demo-arena', 'Demo Arena Weekly', 100000, 'USDT', NULL, NULL, 50000, 5000, 0, TRUE, 'weekly', '2026-01-27', '2026-02-03', '2026-01-27', 4, TRUE, TRUE, 'No refund - free entry', 'USDT prizes')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- OFFERS - TIER 2
-- ============================================================================

INSERT INTO offers (id, program_id, offer_name, account_size, account_currency, entry_fee, fee_currency, prize_pool, first_prize, current_participants, recurring, frequency, start_date, end_date, registration_deadline, display_order, is_featured, is_hot, refund_conditions, scaling_conditions)
VALUES
  ('bitget-demo-weekly', 'bitget-demo', 'Demo Wars', 50000, 'USDT', NULL, NULL, 20000, 2000, 0, TRUE, 'weekly', '2026-01-27', '2026-02-03', '2026-01-27', 5, FALSE, FALSE, 'Free entry', 'Bonus conditions'),
  ('tradingview-leap', 'tradingview-leap', 'The Leap', 100000, 'USD', NULL, NULL, 5000, 1000, 0, FALSE, 'one_time', '2026-03-01', '2026-03-31', '2026-02-28', 6, FALSE, FALSE, 'Free entry', 'Subscription prizes'),
  ('xm-demo-monthly', 'xm-demo-contests', 'Monthly Demo Race', 10000, 'USD', NULL, NULL, 15000, 5000, 0, TRUE, 'monthly', '2026-02-01', '2026-02-28', '2026-01-31', 7, FALSE, FALSE, 'Free entry', 'Cash prizes'),
  ('fbs-demo-champion', 'fbs-demo-contests', 'Demo Champion', 10000, 'USD', NULL, NULL, 10000, 3000, 0, TRUE, 'monthly', '2026-02-01', '2026-02-28', '2026-01-31', 8, FALSE, FALSE, 'Free entry', 'Bonus prizes')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- OFFERS - TIER 3-4
-- ============================================================================

INSERT INTO offers (id, program_id, offer_name, account_size, account_currency, entry_fee, fee_currency, prize_pool, first_prize, current_participants, recurring, frequency, start_date, end_date, registration_deadline, display_order, is_featured, is_hot, refund_conditions, scaling_conditions)
VALUES
  ('kucoin-demo-weekly', 'kucoin-demo', 'Demo Trading Battle', 50000, 'USDT', NULL, NULL, 15000, 2000, 0, TRUE, 'weekly', '2026-01-27', '2026-02-03', '2026-01-27', 9, FALSE, FALSE, 'Free entry', 'USDT prizes'),
  ('mexc-demo-weekly', 'mexc-demo', 'Demo Contest', 50000, 'USDT', NULL, NULL, 10000, 1500, 0, TRUE, 'weekly', '2026-01-27', '2026-02-03', '2026-01-27', 10, FALSE, FALSE, 'Free entry', 'USDT prizes'),
  ('instaforex-great-race', 'instaforex-contests', 'Great Race', 50000, 'USD', NULL, NULL, 50000, 15000, 0, TRUE, 'quarterly', '2026-01-01', '2026-03-31', '2026-03-31', 11, FALSE, FALSE, 'Free entry', 'Cash pool $50K')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- RULESETS
-- ============================================================================

INSERT INTO rulesets (id, offer_id, phase_number, phase_name, ruleset_mode, profit_target_pct, max_daily_loss_pct, max_drawdown_pct, min_trading_days, weekend_holding, weekend_holding_known, news_trading, news_trading_known, ea_allowed, ea_allowed_known, hedging_allowed, hedging_allowed_known)
VALUES
  ('ninjatrader-arena-rules', 'ninjatrader-arena-monthly', 1, 'Arena', 'ranking_based', NULL, NULL, NULL, 0, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE),
  ('primexbt-demo-rules', 'primexbt-demo-weekly', 1, 'Contest', 'ranking_based', NULL, NULL, NULL, 0, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE),
  ('the5ers-comp-rules', 'the5ers-comp-main', 1, 'Competition', 'ranking_based', 10, NULL, NULL, 0, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE),
  ('bybit-arena-rules', 'bybit-demo-weekly', 1, 'Arena', 'ranking_based', NULL, NULL, NULL, 0, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE),
  ('bitget-demo-rules', 'bitget-demo-weekly', 1, 'Demo Wars', 'ranking_based', NULL, NULL, NULL, 0, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PAYOUT TERMS
-- ============================================================================

INSERT INTO payout_terms (id, offer_id, profit_split_initial_pct, profit_split_scaled_pct, profit_split_max_pct, payout_frequency, first_payout_delay_days, eligible_after_phase, payout_notes)
VALUES
  ('ninjatrader-arena-payout', 'ninjatrader-arena-monthly', 100, 100, 100, 'monthly', 7, 1, 'Cash prizes paid monthly'),
  ('primexbt-demo-payout', 'primexbt-demo-weekly', 100, 100, 100, 'weekly', 14, 1, 'Bonus credited with volume requirements'),
  ('the5ers-comp-payout', 'the5ers-comp-main', 100, 100, 100, 'on_demand', 30, 1, 'Funded account activated after verification'),
  ('bybit-arena-payout', 'bybit-demo-weekly', 100, 100, 100, 'weekly', 3, 1, 'USDT credited to account')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE 'Migration 0010 Complete - Free Opportunities Seed Data';
  RAISE NOTICE 'Inserted:';
  RAISE NOTICE '   - 11 Organizers (Tiers 1-4)';
  RAISE NOTICE '   - 11 Programs (free competitions)';
  RAISE NOTICE '   - 11 Offers (0 EUR entry, first_prize set)';
  RAISE NOTICE '   - 5 Rulesets (ranking_based for competitions)';
  RAISE NOTICE '   - 4 Payout Terms';
  RAISE NOTICE '';
  RAISE NOTICE 'TOP 5 FREE OPPORTUNITIES:';
  RAISE NOTICE '   1. NinjaTrader Arena - $50K pool, $10K first prize';
  RAISE NOTICE '   2. Bybit Demo Arena - $50K USDT, $5K first prize';
  RAISE NOTICE '   3. The5ers Competition - $100K funded account';
  RAISE NOTICE '   4. PrimeXBT Demo - $10K weekly, $3K first prize';
  RAISE NOTICE '   5. InstaForex Great Race - $50K pool, $15K first prize';
  RAISE NOTICE '';
  RAISE NOTICE 'All entries have entry_fee = NULL (0 EUR cost)';
END $$;
