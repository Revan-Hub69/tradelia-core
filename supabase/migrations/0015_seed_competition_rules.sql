-- Migration: Seed competition_rules data for all programs
-- Created: 2026-01-28

-- FTMO Challenge Rules
INSERT INTO competition_rules (
  program_id, ea_allowed, news_trading, weekend_holding, copy_trading, 
  third_party_copy, hft_allowed, martingale_allowed, grid_trading_allowed, hedging_allowed,
  daily_loss_limit, weekly_loss_limit, max_lot_size, min_lot_size, leverage,
  instruments, created_at, updated_at
) VALUES (
  (SELECT id FROM programs WHERE slug = 'ftmo-challenge'),
  true, false, true, false, false, false, false, false, true,
  5.00, 10.00, 100.00, 0.01, 100.00,
  '["forex", "indices", "commodities", "crypto"]',
  NOW(), NOW()
)
ON CONFLICT (program_id) DO UPDATE SET
  ea_allowed = EXCLUDED.ea_allowed,
  news_trading = EXCLUDED.news_trading,
  weekend_holding = EXCLUDED.weekend_holding,
  copy_trading = EXCLUDED.copy_trading,
  third_party_copy = EXCLUDED.third_party_copy,
  hft_allowed = EXCLUDED.hft_allowed,
  martingale_allowed = EXCLUDED.martingale_allowed,
  grid_trading_allowed = EXCLUDED.grid_trading_allowed,
  hedging_allowed = EXCLUDED.hedging_allowed,
  daily_loss_limit = EXCLUDED.daily_loss_limit,
  weekly_loss_limit = EXCLUDED.weekly_loss_limit,
  max_lot_size = EXCLUDED.max_lot_size,
  min_lot_size = EXCLUDED.min_lot_size,
  leverage = EXCLUDED.leverage,
  instruments = EXCLUDED.instruments,
  updated_at = NOW();

-- The5ers Challenge Rules
INSERT INTO competition_rules (
  program_id, ea_allowed, news_trading, weekend_holding, copy_trading, 
  third_party_copy, hft_allowed, martingale_allowed, grid_trading_allowed, hedging_allowed,
  daily_loss_limit, weekly_loss_limit, max_lot_size, min_lot_size, leverage,
  instruments, created_at, updated_at
) VALUES (
  (SELECT id FROM programs WHERE slug = 'the5ers-challenge'),
  true, true, true, false, false, false, true, true, true,
  4.00, 8.00, 100.00, 0.01, 100.00,
  '["forex", "indices", "commodities", "crypto", "stocks"]',
  NOW(), NOW()
)
ON CONFLICT (program_id) DO UPDATE SET
  ea_allowed = EXCLUDED.ea_allowed,
  news_trading = EXCLUDED.news_trading,
  weekend_holding = EXCLUDED.weekend_holding,
  copy_trading = EXCLUDED.copy_trading,
  third_party_copy = EXCLUDED.third_party_copy,
  hft_allowed = EXCLUDED.hft_allowed,
  martingale_allowed = EXCLUDED.martingale_allowed,
  grid_trading_allowed = EXCLUDED.grid_trading_allowed,
  hedging_allowed = EXCLUDED.hedging_allowed,
  daily_loss_limit = EXCLUDED.daily_loss_limit,
  weekly_loss_limit = EXCLUDED.weekly_loss_limit,
  max_lot_size = EXCLUDED.max_lot_size,
  min_lot_size = EXCLUDED.min_lot_size,
  leverage = EXCLUDED.leverage,
  instruments = EXCLUDED.instruments,
  updated_at = NOW();

-- True Forex Funds Challenge Rules
INSERT INTO competition_rules (
  program_id, ea_allowed, news_trading, weekend_holding, copy_trading, 
  third_party_copy, hft_allowed, martingale_allowed, grid_trading_allowed, hedging_allowed,
  daily_loss_limit, weekly_loss_limit, max_lot_size, min_lot_size, leverage,
  instruments, created_at, updated_at
) VALUES (
  (SELECT id FROM programs WHERE slug = 'true-forex-funds'),
  true, false, false, false, false, false, false, false, true,
  5.00, 10.00, 50.00, 0.01, 100.00,
  '["forex", "indices", "commodities", "crypto"]',
  NOW(), NOW()
)
ON CONFLICT (program_id) DO UPDATE SET
  ea_allowed = EXCLUDED.ea_allowed,
  news_trading = EXCLUDED.news_trading,
  weekend_holding = EXCLUDED.weekend_holding,
  copy_trading = EXCLUDED.copy_trading,
  third_party_copy = EXCLUDED.third_party_copy,
  hft_allowed = EXCLUDED.hft_allowed,
  martingale_allowed = EXCLUDED.martingale_allowed,
  grid_trading_allowed = EXCLUDED.grid_trading_allowed,
  hedging_allowed = EXCLUDED.hedging_allowed,
  daily_loss_limit = EXCLUDED.daily_loss_limit,
  weekly_loss_limit = EXCLUDED.weekly_loss_limit,
  max_lot_size = EXCLUDED.max_lot_size,
  min_lot_size = EXCLUDED.min_lot_size,
  leverage = EXCLUDED.leverage,
  instruments = EXCLUDED.instruments,
  updated_at = NOW();

-- My Forex Funds Challenge Rules
INSERT INTO competition_rules (
  program_id, ea_allowed, news_trading, weekend_holding, copy_trading, 
  third_party_copy, hft_allowed, martingale_allowed, grid_trading_allowed, hedging_allowed,
  daily_loss_limit, weekly_loss_limit, max_lot_size, min_lot_size, leverage,
  instruments, created_at, updated_at
) VALUES (
  (SELECT id FROM programs WHERE slug = 'my-forex-funds'),
  true, true, true, true, false, false, true, true, true,
  5.00, 10.00, 100.00, 0.01, 100.00,
  '["forex", "indices", "commodities", "crypto", "stocks"]',
  NOW(), NOW()
)
ON CONFLICT (program_id) DO UPDATE SET
  ea_allowed = EXCLUDED.ea_allowed,
  news_trading = EXCLUDED.news_trading,
  weekend_holding = EXCLUDED.weekend_holding,
  copy_trading = EXCLUDED.copy_trading,
  third_party_copy = EXCLUDED.third_party_copy,
  hft_allowed = EXCLUDED.hft_allowed,
  martingale_allowed = EXCLUDED.martingale_allowed,
  grid_trading_allowed = EXCLUDED.grid_trading_allowed,
  hedging_allowed = EXCLUDED.hedging_allowed,
  daily_loss_limit = EXCLUDED.daily_loss_limit,
  weekly_loss_limit = EXCLUDED.weekly_loss_limit,
  max_lot_size = EXCLUDED.max_lot_size,
  min_lot_size = EXCLUDED.min_lot_size,
  leverage = EXCLUDED.leverage,
  instruments = EXCLUDED.instruments,
  updated_at = NOW();

-- Update programs with pros and cons data
UPDATE programs SET 
  best_for = 'Traders seeking a reliable and established prop firm with clear rules and excellent reputation',
  pros = '["Industry-leading reputation", "Fast payout processing", "Clear and transparent rules", "Excellent customer support", "Multiple account sizes", "No time limit on challenges"]',
  cons = '["Higher challenge fees", "No weekend holding in some phases", "Strict risk management rules"]',
  updated_at = NOW()
WHERE slug = 'ftmo-challenge';

UPDATE programs SET 
  best_for = 'Traders who want flexibility with EAs and news trading, plus instant funding options',
  pros = '["EA and news trading allowed", "Instant funding available", "Lower challenge fees", "Multiple challenge types", "Good profit split", "Fast scaling plan"]',
  cons = '["Newer firm than FTMO", "Limited educational resources", "Stricter drawdown rules"]',
  updated_at = NOW()
WHERE slug = 'the5ers-challenge';

UPDATE programs SET 
  best_for = 'Traders looking for competitive pricing and straightforward evaluation process',
  pros = '["Competitive pricing", "Transparent evaluation", "Good trading conditions", "Fast support response", "Multiple platforms supported"]',
  cons = '["No weekend holding allowed", "Limited instrument variety", "Newer in the market"]',
  updated_at = NOW()
WHERE slug = 'true-forex-funds';

UPDATE programs SET 
  best_for = 'Traders who want maximum flexibility with copy trading and various strategies',
  pros = '["Copy trading allowed", "EA friendly", "Multiple strategy support", "Good profit sharing", "Fast account setup", "Regular promotions"]',
  cons = '["Complex fee structure", "Stricter verification process", "Limited withdrawal methods"]',
  updated_at = NOW()
WHERE slug = 'my-forex-funds';

-- Verify the data was inserted
SELECT 
  p.name as program_name,
  p.best_for,
  p.pros IS NOT NULL as has_pros,
  p.cons IS NOT NULL as has_cons,
  cr.ea_allowed,
  cr.news_trading,
  cr.weekend_holding,
  cr.leverage
FROM programs p
LEFT JOIN competition_rules cr ON p.id = cr.program_id
ORDER BY p.id;