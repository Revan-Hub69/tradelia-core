-- UCM Schema Step 1: Create tables and indexes

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
CREATE INDEX idx_eligibility_snapshots_symbol_as_of ON eligibility_snapshots(symbol, as_of DESC);;
