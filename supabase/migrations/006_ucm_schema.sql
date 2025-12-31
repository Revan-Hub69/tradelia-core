-- UCM (Universe Control Module) Database Schema
-- Migration 006: UCM Tables for dynamic universe management

-- Universe Pool: Static pool of symbols (updated manually/weekly)
CREATE TABLE universe_pool (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL,
  as_of BIGINT NOT NULL,
  symbols JSONB NOT NULL,
  core_symbols JSONB NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Universe State: Per-symbol state tracking with hysteresis
CREATE TABLE universe_state (
  symbol TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLACKLISTED')),
  entered_at BIGINT,
  exited_at BIGINT,
  cooldown_until BIGINT,
  blacklist_until BIGINT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Universe Active: Snapshots of active universe (target ~20 symbols)
CREATE TABLE universe_active (
  id SERIAL PRIMARY KEY,
  as_of BIGINT NOT NULL,
  version TEXT NOT NULL,
  target_count INTEGER NOT NULL,
  min_count INTEGER NOT NULL,
  max_count INTEGER NOT NULL,
  symbols JSONB NOT NULL,
  core_included BOOLEAN NOT NULL,
  meta JSONB NOT NULL,
  based_on JSONB NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eligibility Snapshots: Per-symbol eligibility data (updated every 5min)
CREATE TABLE eligibility_snapshots (
  symbol TEXT NOT NULL,
  as_of BIGINT NOT NULL,
  vol_quote_24h NUMERIC NOT NULL,
  spread_bps NUMERIC NOT NULL,
  completeness_60m NUMERIC NOT NULL CHECK (completeness_60m >= 0 AND completeness_60m <= 1),
  gaps_60m INTEGER NOT NULL CHECK (gaps_60m >= 0),
  atr14_1m NUMERIC NOT NULL CHECK (atr14_1m > 0),
  atr_percentile_1m NUMERIC NOT NULL CHECK (atr_percentile_1m >= 0 AND atr_percentile_1m <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (symbol, as_of)
);

-- Performance indexes
CREATE INDEX idx_universe_pool_as_of ON universe_pool(as_of DESC);
CREATE INDEX idx_universe_active_as_of ON universe_active(as_of DESC);
CREATE INDEX idx_universe_state_status ON universe_state(status);
CREATE INDEX idx_universe_state_cooldown ON universe_state(cooldown_until) WHERE cooldown_until IS NOT NULL;
CREATE INDEX idx_universe_state_blacklist ON universe_state(blacklist_until) WHERE blacklist_until IS NOT NULL;
CREATE INDEX idx_eligibility_snapshots_as_of ON eligibility_snapshots(as_of DESC);
CREATE INDEX idx_eligibility_snapshots_symbol_as_of ON eligibility_snapshots(symbol, as_of DESC);

-- RLS (Row Level Security) policies - SECURE, not open
ALTER TABLE universe_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE universe_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE universe_active ENABLE ROW LEVEL SECURITY;
ALTER TABLE eligibility_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read (not public read)
CREATE POLICY "Allow authenticated read on universe_pool" ON universe_pool 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read on universe_state" ON universe_state 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read on universe_active" ON universe_active 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read on eligibility_snapshots" ON eligibility_snapshots 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role full access for pipeline operations
CREATE POLICY "Service role full access to universe_pool" ON universe_pool 
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to universe_state" ON universe_state 
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to universe_active" ON universe_active 
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to eligibility_snapshots" ON eligibility_snapshots 
  FOR ALL USING (auth.role() = 'service_role');

-- Utility functions for UCM operations

-- Function to get current active symbols
CREATE OR REPLACE FUNCTION get_current_active_symbols()
RETURNS TEXT[] AS $$
DECLARE
  active_symbols TEXT[];
BEGIN
  SELECT symbols INTO active_symbols
  FROM universe_active
  ORDER BY as_of DESC
  LIMIT 1;
  
  RETURN COALESCE(active_symbols, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if symbol is in cooldown
CREATE OR REPLACE FUNCTION is_symbol_in_cooldown(symbol_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  cooldown_until_ts BIGINT;
  current_ts BIGINT;
BEGIN
  current_ts := EXTRACT(EPOCH FROM NOW()) * 1000;
  
  SELECT cooldown_until INTO cooldown_until_ts
  FROM universe_state
  WHERE symbol = symbol_name;
  
  RETURN COALESCE(cooldown_until_ts > current_ts, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if symbol is blacklisted
CREATE OR REPLACE FUNCTION is_symbol_blacklisted(symbol_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  blacklist_until_ts BIGINT;
  current_ts BIGINT;
BEGIN
  current_ts := EXTRACT(EPOCH FROM NOW()) * 1000;
  
  SELECT blacklist_until INTO blacklist_until_ts
  FROM universe_state
  WHERE symbol = symbol_name;
  
  RETURN COALESCE(blacklist_until_ts > current_ts, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old eligibility snapshots (for storage management)
CREATE OR REPLACE FUNCTION cleanup_old_eligibility_snapshots(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  cutoff_ts BIGINT;
  deleted_count INTEGER;
BEGIN
  cutoff_ts := EXTRACT(EPOCH FROM NOW() - INTERVAL '1 day' * days_to_keep) * 1000;
  
  DELETE FROM eligibility_snapshots
  WHERE as_of < cutoff_ts;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE universe_pool IS 'Static pool of symbols for universe selection, updated manually or weekly';
COMMENT ON TABLE universe_state IS 'Per-symbol state tracking with hysteresis (ACTIVE/INACTIVE/BLACKLISTED)';
COMMENT ON TABLE universe_active IS 'Snapshots of active universe (~20 symbols), generated every 5 minutes';
COMMENT ON TABLE eligibility_snapshots IS 'Per-symbol eligibility data for universe selection, updated every 5 minutes';

COMMENT ON COLUMN universe_pool.symbols IS 'Array of all symbols in the pool (50-150 max)';
COMMENT ON COLUMN universe_pool.core_symbols IS 'Array of core symbols that should always be included';
COMMENT ON COLUMN universe_pool.hash IS 'SHA-256 hash for deterministic versioning';

COMMENT ON COLUMN universe_state.status IS 'Current status: ACTIVE (in universe), INACTIVE (eligible but not selected), BLACKLISTED (hard failure)';
COMMENT ON COLUMN universe_state.entered_at IS 'Timestamp when symbol entered ACTIVE status';
COMMENT ON COLUMN universe_state.exited_at IS 'Timestamp when symbol exited ACTIVE status';
COMMENT ON COLUMN universe_state.cooldown_until IS 'Timestamp until which symbol is in cooldown (cannot re-enter)';
COMMENT ON COLUMN universe_state.blacklist_until IS 'Timestamp until which symbol is blacklisted';

COMMENT ON COLUMN universe_active.symbols IS 'Array of symbols in active universe, ordered by rank';
COMMENT ON COLUMN universe_active.core_included IS 'Whether all core symbols are included';
COMMENT ON COLUMN universe_active.meta IS 'Metadata: {added: [], removed: [], blacklisted: []}';
COMMENT ON COLUMN universe_active.based_on IS 'References to input data: {poolHash, eligibilityBatchHash, prevActiveHash}';

COMMENT ON COLUMN eligibility_snapshots.vol_quote_24h IS '24h volume in quote currency (liquidity proxy)';
COMMENT ON COLUMN eligibility_snapshots.spread_bps IS 'Bid-ask spread in basis points (friction proxy)';
COMMENT ON COLUMN eligibility_snapshots.completeness_60m IS 'Data completeness over last 60 minutes (0-1)';
COMMENT ON COLUMN eligibility_snapshots.gaps_60m IS 'Number of data gaps in last 60 minutes';
COMMENT ON COLUMN eligibility_snapshots.atr14_1m IS 'ATR(14) on 1-minute timeframe';
COMMENT ON COLUMN eligibility_snapshots.atr_percentile_1m IS 'ATR percentile over 300-period window (0-100)';