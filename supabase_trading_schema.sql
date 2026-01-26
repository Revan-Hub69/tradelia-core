-- ============================================================================
-- TRADING CHALLENGES DASHBOARD - SUPABASE SCHEMA
-- ============================================================================
-- Execute this SQL in Supabase SQL Editor to create all tables
-- ============================================================================

-- Prop Firms Table
CREATE TABLE IF NOT EXISTS prop_firms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  founded INTEGER,
  total_paid BIGINT,
  reputation INTEGER CHECK (reputation >= 0 AND reputation <= 100),
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  prop_firm_id TEXT REFERENCES prop_firms(id),
  
  -- Type
  type TEXT NOT NULL CHECK (type IN ('free_competition', 'paid_evaluation', 'instant_funding')),
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('1-step', '2-step', 'competition', 'instant')),
  
  -- Pricing
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  entry_fee INTEGER,
  currency TEXT DEFAULT 'USD',
  refundable BOOLEAN DEFAULT FALSE,
  refund_conditions TEXT,
  
  -- Account
  account_size INTEGER NOT NULL,
  scaling_potential INTEGER,
  
  -- Profit split (JSON)
  profit_split TEXT NOT NULL,
  
  -- Rules (JSON)
  rules TEXT NOT NULL,
  
  -- Payout
  payout_speed TEXT NOT NULL CHECK (payout_speed IN ('instant', 'same_day', '24_hours', 'weekly', 'bi_weekly')),
  first_payout_delay INTEGER,
  
  -- Markets & Platforms (JSON arrays)
  markets TEXT NOT NULL,
  platforms TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'ended')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  recurring BOOLEAN DEFAULT FALSE,
  frequency TEXT CHECK (frequency IN ('monthly', 'quarterly', 'annual')),
  
  -- Metadata
  description TEXT,
  pros TEXT,
  cons TEXT,
  best_for TEXT,
  official_url TEXT,
  logo_url TEXT,
  
  -- Analytics
  popularity INTEGER DEFAULT 0 CHECK (popularity >= 0 AND popularity <= 100),
  success_rate INTEGER CHECK (success_rate >= 0 AND success_rate <= 100),
  average_pass_time INTEGER,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tracked Challenges Table (user's enrolled challenges)
CREATE TABLE IF NOT EXISTS tracked_challenges (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT REFERENCES challenges(id),
  name TEXT NOT NULL,
  account_size INTEGER NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('challenge', 'verification', 'funded')),
  
  -- Timing
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  days_remaining INTEGER,
  
  -- Balance & P&L
  starting_balance INTEGER NOT NULL,
  current_balance INTEGER NOT NULL,
  high_water_mark INTEGER NOT NULL,
  total_pnl INTEGER DEFAULT 0 NOT NULL,
  today_pnl INTEGER DEFAULT 0 NOT NULL,
  
  -- Rules (JSON)
  rules TEXT NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'passed', 'failed', 'pending_verification')),
  violations TEXT DEFAULT '[]',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trades Table
CREATE TABLE IF NOT EXISTS trades (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT REFERENCES tracked_challenges(id) ON DELETE CASCADE,
  signal_id TEXT,
  
  -- Asset
  symbol TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('long', 'short')),
  
  -- Levels (stored as integers for precision)
  entry_price INTEGER NOT NULL,
  exit_price INTEGER,
  stop_loss INTEGER NOT NULL,
  take_profit INTEGER NOT NULL,
  
  -- Position
  position_size INTEGER NOT NULL,
  risk_amount INTEGER NOT NULL,
  
  -- Timing
  entry_time TIMESTAMPTZ NOT NULL,
  exit_time TIMESTAMPTZ,
  
  -- P&L
  pnl INTEGER,
  pnl_percentage INTEGER,
  r_multiple INTEGER,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed_win', 'closed_loss', 'closed_breakeven')),
  
  -- Metadata
  notes TEXT,
  tags TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trading Signals Table
CREATE TABLE IF NOT EXISTS trading_signals (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('long', 'short')),
  
  -- Timing
  generated_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Levels
  entry INTEGER NOT NULL,
  stop_loss INTEGER NOT NULL,
  take_profit INTEGER NOT NULL,
  risk_reward INTEGER NOT NULL,
  
  -- Confidence & Reasoning
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  indicators TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  
  -- Market Context
  market_condition TEXT NOT NULL CHECK (market_condition IN ('trending', 'ranging', 'volatile')),
  timeframe TEXT NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'executed', 'expired', 'dismissed')),
  executed_trade_id TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Signal Settings Table
CREATE TABLE IF NOT EXISTS signal_settings (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  watchlist TEXT NOT NULL DEFAULT '[]',
  min_confidence INTEGER NOT NULL DEFAULT 70 CHECK (min_confidence >= 0 AND min_confidence <= 100),
  max_risk_per_trade INTEGER NOT NULL DEFAULT 100,
  min_risk_reward INTEGER NOT NULL DEFAULT 150,
  timeframes TEXT NOT NULL DEFAULT '["H1","H4"]',
  
  -- Indicators config (JSON)
  indicators TEXT NOT NULL,
  
  -- Notifications (JSON)
  notifications TEXT NOT NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT REFERENCES tracked_challenges(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN ('daily_loss', 'max_drawdown', 'profit_target', 'deadline', 'consistency')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  dismissed BOOLEAN NOT NULL DEFAULT FALSE,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_challenges_prop_firm_id ON challenges(prop_firm_id);
CREATE INDEX IF NOT EXISTS idx_challenges_is_free ON challenges(is_free);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(type);
CREATE INDEX IF NOT EXISTS idx_challenges_popularity ON challenges(popularity DESC);

CREATE INDEX IF NOT EXISTS idx_tracked_challenges_user_id ON tracked_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_challenges_status ON tracked_challenges(status);

CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_challenge_id ON trades(challenge_id);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);

CREATE INDEX IF NOT EXISTS idx_trading_signals_user_id ON trading_signals(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_signals_status ON trading_signals(status);
CREATE INDEX IF NOT EXISTS idx_trading_signals_expires_at ON trading_signals(expires_at);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_dismissed ON alerts(dismissed);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE tracked_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Prop Firms and Challenges are public (read-only)
ALTER TABLE prop_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Public read access to prop_firms and challenges
CREATE POLICY "Public read access to prop_firms" ON prop_firms FOR SELECT USING (true);
CREATE POLICY "Public read access to challenges" ON challenges FOR SELECT USING (true);

-- Tracked Challenges: Users can only see their own
CREATE POLICY "Users can view their own tracked challenges" ON tracked_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tracked challenges" ON tracked_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tracked challenges" ON tracked_challenges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tracked challenges" ON tracked_challenges FOR DELETE USING (auth.uid() = user_id);

-- Trades: Users can only see their own
CREATE POLICY "Users can view their own trades" ON trades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own trades" ON trades FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trades" ON trades FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trades" ON trades FOR DELETE USING (auth.uid() = user_id);

-- Trading Signals: Users can only see their own
CREATE POLICY "Users can view their own signals" ON trading_signals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own signals" ON trading_signals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own signals" ON trading_signals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own signals" ON trading_signals FOR DELETE USING (auth.uid() = user_id);

-- Signal Settings: Users can only see their own
CREATE POLICY "Users can view their own signal settings" ON signal_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own signal settings" ON signal_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own signal settings" ON signal_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own signal settings" ON signal_settings FOR DELETE USING (auth.uid() = user_id);

-- Alerts: Users can only see their own
CREATE POLICY "Users can view their own alerts" ON alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own alerts" ON alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON alerts FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Trading Challenges Dashboard schema created successfully!';
  RAISE NOTICE '   - 7 tables created';
  RAISE NOTICE '   - Indexes added for performance';
  RAISE NOTICE '   - RLS policies configured';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next step: Run seed script to populate challenges data';
  RAISE NOTICE '   npm run seed:challenges';
END $$;
