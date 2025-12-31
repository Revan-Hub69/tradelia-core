-- MCE Schema Canonical Migration
-- Creates all tables and functions needed for Market Context Engine

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Market Data Table (core MCE data storage)
CREATE TABLE IF NOT EXISTS market_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  symbol TEXT NOT NULL,
  tf TEXT NOT NULL, -- timeframe: 1m, 5m, 15m, 1h, 4h
  open_time BIGINT NOT NULL, -- Unix timestamp in milliseconds
  open_price DECIMAL(20,8) NOT NULL,
  high_price DECIMAL(20,8) NOT NULL,
  low_price DECIMAL(20,8) NOT NULL,
  close_price DECIMAL(20,8) NOT NULL,
  volume DECIMAL(20,8) NOT NULL,
  close_time BIGINT NOT NULL,
  quote_volume DECIMAL(20,8) NOT NULL,
  trades_count INTEGER NOT NULL,
  taker_buy_base_volume DECIMAL(20,8) NOT NULL,
  taker_buy_quote_volume DECIMAL(20,8) NOT NULL,
  
  -- MCE specific fields
  atr14 DECIMAL(20,8), -- Average True Range (14 periods)
  ema20 DECIMAL(20,8), -- Exponential Moving Average (20 periods)
  volume_ma20 DECIMAL(20,8), -- Volume Moving Average (20 periods)
  
  -- Metadata
  data_quality DECIMAL(3,2) DEFAULT 1.0, -- 0.0 to 1.0
  inserted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT market_data_symbol_tf_open_time_key UNIQUE (symbol, tf, open_time),
  CONSTRAINT market_data_prices_check CHECK (
    open_price > 0 AND high_price > 0 AND low_price > 0 AND close_price > 0 AND
    high_price >= open_price AND high_price >= close_price AND
    low_price <= open_price AND low_price <= close_price
  ),
  CONSTRAINT market_data_volume_check CHECK (volume >= 0 AND quote_volume >= 0),
  CONSTRAINT market_data_quality_check CHECK (data_quality >= 0.0 AND data_quality <= 1.0)
);

-- Regime Signatures Table (MCE output storage)
CREATE TABLE IF NOT EXISTS regime_signatures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  as_of BIGINT NOT NULL, -- Unix timestamp when signature was generated
  symbol TEXT NOT NULL,
  tf TEXT NOT NULL,
  
  -- Regime classification
  trend_class TEXT NOT NULL CHECK (trend_class IN ('TRENDING', 'RANGING', 'TRANSITIONAL')),
  volatility_class TEXT NOT NULL CHECK (volatility_class IN ('LOW', 'MEDIUM', 'HIGH', 'EXTREME')),
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
  
  -- Feature values used for classification
  features JSONB NOT NULL, -- {atr14, ema20, volume_ma20, etc.}
  
  -- Canonical signature
  signature_hash TEXT NOT NULL, -- SHA-256 hash of canonical representation
  signature_version TEXT NOT NULL DEFAULT 'v1.0.0',
  
  -- Quality metrics
  data_quality_score DECIMAL(3,2) NOT NULL CHECK (data_quality_score >= 0.0 AND data_quality_score <= 1.0),
  calculation_time_ms INTEGER NOT NULL CHECK (calculation_time_ms >= 0),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT regime_signatures_as_of_symbol_tf_key UNIQUE (as_of, symbol, tf)
);

-- System Health Table (operational monitoring)
CREATE TABLE IF NOT EXISTS system_health (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pipeline Runs Table (audit trail)
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  run_id TEXT NOT NULL,
  module TEXT NOT NULL CHECK (module IN ('MCE', 'UCM', 'MSF')),
  as_of BIGINT NOT NULL,
  
  -- Input/Output hashes for determinism
  input_hash TEXT,
  output_hash TEXT,
  
  -- Execution metrics
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'PARTIAL', 'FAILED')),
  duration_ms INTEGER NOT NULL CHECK (duration_ms >= 0),
  
  -- Counts and metrics
  processed_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  
  -- Error details
  errors JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT pipeline_runs_run_id_module_key UNIQUE (run_id, module)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_data_symbol_tf_time ON market_data (symbol, tf, open_time DESC);
CREATE INDEX IF NOT EXISTS idx_market_data_inserted_at ON market_data (inserted_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_data_quality ON market_data (data_quality) WHERE data_quality < 0.95;

CREATE INDEX IF NOT EXISTS idx_regime_signatures_as_of ON regime_signatures (as_of DESC);
CREATE INDEX IF NOT EXISTS idx_regime_signatures_symbol_tf ON regime_signatures (symbol, tf);
CREATE INDEX IF NOT EXISTS idx_regime_signatures_created_at ON regime_signatures (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_module_as_of ON pipeline_runs (module, as_of DESC);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs (status, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_run_id ON pipeline_runs (run_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to market_data
DROP TRIGGER IF EXISTS update_market_data_updated_at ON market_data;
CREATE TRIGGER update_market_data_updated_at
  BEFORE UPDATE ON market_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to system_health
DROP TRIGGER IF EXISTS update_system_health_updated_at ON system_health;
CREATE TRIGGER update_system_health_updated_at
  BEFORE UPDATE ON system_health
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (secure by default)
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE regime_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access on market_data" ON market_data
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on regime_signatures" ON regime_signatures
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on system_health" ON system_health
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on pipeline_runs" ON pipeline_runs
  FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users can read (for dashboard)
CREATE POLICY "Authenticated read on regime_signatures" ON regime_signatures
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read on system_health" ON system_health
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read on pipeline_runs" ON pipeline_runs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Anonymous users can read recent regime signatures (for public dashboard)
CREATE POLICY "Anonymous read recent regime_signatures" ON regime_signatures
  FOR SELECT USING (
    auth.role() = 'anon' AND 
    created_at > NOW() - INTERVAL '24 hours'
  );

-- Utility functions for MCE operations
CREATE OR REPLACE FUNCTION get_latest_regime_signature(p_symbol TEXT, p_tf TEXT)
RETURNS regime_signatures AS $$
DECLARE
  result regime_signatures;
BEGIN
  SELECT * INTO result
  FROM regime_signatures
  WHERE symbol = p_symbol AND tf = p_tf
  ORDER BY as_of DESC
  LIMIT 1;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_market_data_stats(p_symbol TEXT DEFAULT NULL, p_tf TEXT DEFAULT NULL)
RETURNS TABLE(
  symbol TEXT,
  tf TEXT,
  count BIGINT,
  earliest_time BIGINT,
  latest_time BIGINT,
  avg_quality DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    md.symbol,
    md.tf,
    COUNT(*) as count,
    MIN(md.open_time) as earliest_time,
    MAX(md.open_time) as latest_time,
    AVG(md.data_quality) as avg_quality
  FROM market_data md
  WHERE (p_symbol IS NULL OR md.symbol = p_symbol)
    AND (p_tf IS NULL OR md.tf = p_tf)
  GROUP BY md.symbol, md.tf
  ORDER BY md.symbol, md.tf;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup function for old data (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_market_data(retention_days INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM market_data
  WHERE inserted_at < NOW() - (retention_days || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log cleanup operation
  INSERT INTO pipeline_runs (run_id, module, as_of, status, duration_ms, processed_count, started_at)
  VALUES (
    'cleanup-' || extract(epoch from now())::text,
    'MCE',
    extract(epoch from now() * 1000)::bigint,
    'SUCCESS',
    0,
    deleted_count,
    NOW()
  );
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON regime_signatures, system_health, pipeline_runs TO authenticated;
GRANT SELECT ON regime_signatures TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT EXECUTE ON FUNCTION get_latest_regime_signature(TEXT, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_market_data_stats(TEXT, TEXT) TO authenticated;