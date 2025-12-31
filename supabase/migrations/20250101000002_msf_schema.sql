-- MSF (Market Selection & Fit) Schema
-- Best practice: minimal tables, deterministic storage

-- MSF Day Gates - Binary trading decisions
CREATE TABLE IF NOT EXISTS msf_day_gates (
  id BIGSERIAL PRIMARY KEY,
  as_of BIGINT NOT NULL,                    -- timestamp of decision
  tradable_day BOOLEAN NOT NULL,            -- binary ON/OFF decision
  count_a INTEGER NOT NULL DEFAULT 0,       -- A class symbols count
  count_b INTEGER NOT NULL DEFAULT 0,       -- B class symbols count
  reasons TEXT[] NOT NULL DEFAULT '{}',     -- human readable reasons (max 3)
  day_gate JSONB NOT NULL,                  -- full DayGate object
  hash TEXT NOT NULL,                       -- deterministic hash
  inserted_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT msf_day_gates_as_of_unique UNIQUE (as_of),
  CONSTRAINT msf_day_gates_reasons_max_3 CHECK (array_length(reasons, 1) <= 3)
);

-- MSF Market Fits - Symbol classifications
CREATE TABLE IF NOT EXISTS msf_market_fits (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,                     -- trading symbol
  as_of BIGINT NOT NULL,                    -- timestamp of classification
  fit_class TEXT NOT NULL,                  -- A, B, C, NO_TRADE
  allowed_playbooks TEXT[] NOT NULL DEFAULT '{}', -- allowed strategies
  friction_score DECIMAL(5,3) NOT NULL,    -- 0-1 friction score
  data_quality DECIMAL(5,3) NOT NULL,      -- 0-1 data quality
  reasons TEXT[] NOT NULL DEFAULT '{}',     -- human readable reasons (max 3)
  market_fit JSONB NOT NULL,                -- full MarketFit object
  hash TEXT NOT NULL,                       -- deterministic hash
  inserted_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT msf_market_fits_symbol_as_of_unique UNIQUE (symbol, as_of),
  CONSTRAINT msf_market_fits_fit_class_valid CHECK (fit_class IN ('A', 'B', 'C', 'NO_TRADE')),
  CONSTRAINT msf_market_fits_friction_range CHECK (friction_score >= 0 AND friction_score <= 1),
  CONSTRAINT msf_market_fits_quality_range CHECK (data_quality >= 0 AND data_quality <= 1),
  CONSTRAINT msf_market_fits_reasons_max_3 CHECK (array_length(reasons, 1) <= 3)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_msf_day_gates_as_of ON msf_day_gates (as_of DESC);
CREATE INDEX IF NOT EXISTS idx_msf_day_gates_tradable ON msf_day_gates (tradable_day, as_of DESC);

CREATE INDEX IF NOT EXISTS idx_msf_market_fits_symbol_as_of ON msf_market_fits (symbol, as_of DESC);
CREATE INDEX IF NOT EXISTS idx_msf_market_fits_fit_class ON msf_market_fits (fit_class, as_of DESC);
CREATE INDEX IF NOT EXISTS idx_msf_market_fits_as_of ON msf_market_fits (as_of DESC);

-- RLS Policies (read-only for authenticated users, admin write)
ALTER TABLE msf_day_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE msf_market_fits ENABLE ROW LEVEL SECURITY;

-- Read access for authenticated users
CREATE POLICY "msf_day_gates_read" ON msf_day_gates
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "msf_market_fits_read" ON msf_market_fits
  FOR SELECT TO authenticated
  USING (true);

-- Write access for service role only
CREATE POLICY "msf_day_gates_write" ON msf_day_gates
  FOR ALL TO service_role
  USING (true);

CREATE POLICY "msf_market_fits_write" ON msf_market_fits
  FOR ALL TO service_role
  USING (true);

-- Utility functions for MSF analysis

-- Get latest day gate
CREATE OR REPLACE FUNCTION get_latest_day_gate()
RETURNS TABLE (
  as_of BIGINT,
  tradable_day BOOLEAN,
  count_a INTEGER,
  count_b INTEGER,
  reasons TEXT[],
  day_gate JSONB
) 
LANGUAGE SQL STABLE
AS $$
  SELECT as_of, tradable_day, count_a, count_b, reasons, day_gate
  FROM msf_day_gates
  ORDER BY as_of DESC
  LIMIT 1;
$$;

-- Get latest market fits
CREATE OR REPLACE FUNCTION get_latest_market_fits()
RETURNS TABLE (
  symbol TEXT,
  as_of BIGINT,
  fit_class TEXT,
  allowed_playbooks TEXT[],
  friction_score DECIMAL(5,3),
  data_quality DECIMAL(5,3),
  reasons TEXT[],
  market_fit JSONB
)
LANGUAGE SQL STABLE
AS $$
  WITH latest_as_of AS (
    SELECT MAX(as_of) as max_as_of FROM msf_market_fits
  )
  SELECT symbol, as_of, fit_class, allowed_playbooks, friction_score, data_quality, reasons, market_fit
  FROM msf_market_fits, latest_as_of
  WHERE as_of = max_as_of
  ORDER BY 
    CASE fit_class 
      WHEN 'A' THEN 1 
      WHEN 'B' THEN 2 
      WHEN 'C' THEN 3 
      WHEN 'NO_TRADE' THEN 4 
    END,
    symbol;
$$;

-- MSF KPI analysis function
CREATE OR REPLACE FUNCTION analyze_msf_kpis(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
  total_decisions INTEGER,
  tradable_days INTEGER,
  no_trade_days INTEGER,
  tradable_days_pct DECIMAL(5,2),
  avg_a_symbols DECIMAL(5,2),
  avg_b_symbols DECIMAL(5,2),
  a_symbols_pct DECIMAL(5,2),
  flip_rate DECIMAL(5,3),
  avg_friction DECIMAL(5,3),
  data_quality DECIMAL(5,3)
)
LANGUAGE SQL STABLE
AS $$
  WITH time_window AS (
    SELECT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT - (days_back * 24 * 60 * 60 * 1000) AS cutoff
  ),
  day_gate_stats AS (
    SELECT 
      COUNT(*) as total_decisions,
      COUNT(*) FILTER (WHERE tradable_day = true) as tradable_days,
      COUNT(*) FILTER (WHERE tradable_day = false) as no_trade_days,
      AVG(count_a) as avg_a_symbols,
      AVG(count_b) as avg_b_symbols
    FROM msf_day_gates, time_window
    WHERE as_of >= cutoff
  ),
  market_fit_stats AS (
    SELECT 
      AVG(friction_score) as avg_friction,
      AVG(data_quality) as data_quality,
      COUNT(*) FILTER (WHERE fit_class = 'A') as total_a_symbols,
      COUNT(*) as total_symbols
    FROM msf_market_fits, time_window
    WHERE as_of >= cutoff
  ),
  flip_analysis AS (
    SELECT 
      COUNT(*) FILTER (
        WHERE tradable_day != LAG(tradable_day) OVER (ORDER BY as_of)
      ) as flips,
      COUNT(*) - 1 as periods
    FROM msf_day_gates, time_window
    WHERE as_of >= cutoff
  )
  SELECT 
    dgs.total_decisions,
    dgs.tradable_days,
    dgs.no_trade_days,
    CASE WHEN dgs.total_decisions > 0 
      THEN ROUND((dgs.tradable_days::DECIMAL / dgs.total_decisions) * 100, 2)
      ELSE 0 
    END as tradable_days_pct,
    ROUND(dgs.avg_a_symbols, 2) as avg_a_symbols,
    ROUND(dgs.avg_b_symbols, 2) as avg_b_symbols,
    CASE WHEN mfs.total_symbols > 0 
      THEN ROUND((mfs.total_a_symbols::DECIMAL / mfs.total_symbols) * 100, 2)
      ELSE 0 
    END as a_symbols_pct,
    CASE WHEN fa.periods > 0 
      THEN ROUND(fa.flips::DECIMAL / fa.periods, 3)
      ELSE 0 
    END as flip_rate,
    ROUND(mfs.avg_friction, 3) as avg_friction,
    ROUND(mfs.data_quality, 3) as data_quality
  FROM day_gate_stats dgs
  CROSS JOIN market_fit_stats mfs
  CROSS JOIN flip_analysis fa;
$$;

-- Data retention (keep 30 days of MSF data)
CREATE OR REPLACE FUNCTION cleanup_old_msf_data()
RETURNS INTEGER
LANGUAGE SQL
AS $$
  WITH cutoff AS (
    SELECT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT - (30 * 24 * 60 * 60 * 1000) AS cutoff_time
  ),
  deleted_day_gates AS (
    DELETE FROM msf_day_gates 
    WHERE as_of < (SELECT cutoff_time FROM cutoff)
    RETURNING 1
  ),
  deleted_market_fits AS (
    DELETE FROM msf_market_fits 
    WHERE as_of < (SELECT cutoff_time FROM cutoff)
    RETURNING 1
  )
  SELECT 
    (SELECT COUNT(*) FROM deleted_day_gates) + 
    (SELECT COUNT(*) FROM deleted_market_fits) as total_deleted;
$$;

-- Comments for documentation
COMMENT ON TABLE msf_day_gates IS 'MSF Day Gates - Binary trading authorization decisions';
COMMENT ON TABLE msf_market_fits IS 'MSF Market Fits - Symbol classifications and allowed strategies';

COMMENT ON COLUMN msf_day_gates.tradable_day IS 'Binary decision: true = trading authorized, false = no trading';
COMMENT ON COLUMN msf_day_gates.count_a IS 'Number of A class (premium) symbols';
COMMENT ON COLUMN msf_day_gates.count_b IS 'Number of B class (good) symbols';
COMMENT ON COLUMN msf_day_gates.reasons IS 'Human readable reasons for decision (max 3)';

COMMENT ON COLUMN msf_market_fits.fit_class IS 'Symbol classification: A=premium, B=good, C=borderline, NO_TRADE=excluded';
COMMENT ON COLUMN msf_market_fits.allowed_playbooks IS 'Allowed trading strategies for this symbol';
COMMENT ON COLUMN msf_market_fits.friction_score IS 'Trading friction score (0=low friction, 1=high friction)';
COMMENT ON COLUMN msf_market_fits.data_quality IS 'Data quality score (0=poor, 1=excellent)';