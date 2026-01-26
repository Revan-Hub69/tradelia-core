-- Add indexes for trading challenges dashboard performance

-- Tracked Challenges indexes
CREATE INDEX IF NOT EXISTS "idx_tracked_challenges_user_id" ON "tracked_challenges" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_tracked_challenges_status" ON "tracked_challenges" ("status");
CREATE INDEX IF NOT EXISTS "idx_tracked_challenges_user_status" ON "tracked_challenges" ("user_id", "status");

-- Trades indexes
CREATE INDEX IF NOT EXISTS "idx_trades_user_id" ON "trades" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_trades_challenge_id" ON "trades" ("challenge_id");
CREATE INDEX IF NOT EXISTS "idx_trades_status" ON "trades" ("status");
CREATE INDEX IF NOT EXISTS "idx_trades_user_challenge" ON "trades" ("user_id", "challenge_id");
CREATE INDEX IF NOT EXISTS "idx_trades_entry_time" ON "trades" ("entry_time" DESC);

-- Trading Signals indexes
CREATE INDEX IF NOT EXISTS "idx_trading_signals_user_id" ON "trading_signals" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_trading_signals_status" ON "trading_signals" ("status");
CREATE INDEX IF NOT EXISTS "idx_trading_signals_expires_at" ON "trading_signals" ("expires_at");
CREATE INDEX IF NOT EXISTS "idx_trading_signals_user_status" ON "trading_signals" ("user_id", "status");

-- Alerts indexes
CREATE INDEX IF NOT EXISTS "idx_alerts_user_id" ON "alerts" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_alerts_dismissed" ON "alerts" ("dismissed");
CREATE INDEX IF NOT EXISTS "idx_alerts_user_dismissed" ON "alerts" ("user_id", "dismissed");
CREATE INDEX IF NOT EXISTS "idx_alerts_challenge_id" ON "alerts" ("challenge_id");

-- Challenges indexes
CREATE INDEX IF NOT EXISTS "idx_challenges_status" ON "challenges" ("status");
CREATE INDEX IF NOT EXISTS "idx_challenges_is_free" ON "challenges" ("is_free");
CREATE INDEX IF NOT EXISTS "idx_challenges_type" ON "challenges" ("type");
CREATE INDEX IF NOT EXISTS "idx_challenges_prop_firm_id" ON "challenges" ("prop_firm_id");
