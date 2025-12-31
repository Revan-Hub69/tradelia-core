-- MCE (Market Context Engine) Database Schema
-- Migration 005: Core MCE tables for market data and regime signatures

-- 1) market_data: Normalized klines from Binance
CREATE TABLE IF NOT EXISTS public.market_data (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  tf TEXT NOT NULL,
  open_time BIGINT NOT NULL,
  close_time BIGINT NOT NULL,
  open NUMERIC NOT NULL,
  high NUMERIC NOT NULL,
  low NUMERIC NOT NULL,
  close NUMERIC NOT NULL,
  volume NUMERIC NOT NULL,
  trades INTEGER,
  source TEXT NOT NULL DEFAULT 'binance',
  inserted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure no duplicate klines
  UNIQUE(symbol, tf, open_time)
);

-- Time-series optimized index (most recent first)
CREATE INDEX IF NOT EXISTS idx_market_data_symbol_tf_open_time 
  ON public.market_data(symbol, tf, open_time DESC);

-- Query optimization index for range queries
CREATE INDEX IF NOT EXISTS idx_market_data_close_time 
  ON public.market_data(symbol, tf, close_time DESC);

-- 2) regime_signatures: MCE output with canonical format
CREATE TABLE IF NOT EXISTS public.regime_signatures (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  tf TEXT NOT NULL,
  as_of BIGINT NOT NULL,
  trend TEXT NOT NULL,
  volatility TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  quality JSONB NOT NULL,
  features JSONB NOT NULL,
  signature JSONB NOT NULL,
  hash TEXT NOT NULL,
  inserted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure no duplicate signatures
  UNIQUE(symbol, tf, as_of)
);

-- Time-series optimized index for regime queries
CREATE INDEX IF NOT EXISTS idx_regime_symbol_tf_asof 
  ON public.regime_signatures(symbol, tf, as_of DESC);

-- Hash index for determinism validation
CREATE INDEX IF NOT EXISTS idx_regime_hash 
  ON public.regime_signatures(hash);

-- Trend/volatility index for analytics
CREATE INDEX IF NOT EXISTS idx_regime_classification 
  ON public.regime_signatures(symbol, trend, volatility);

-- 3) system_health: Pipeline status and monitoring
CREATE TABLE IF NOT EXISTS public.system_health (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4) Row Level Security (RLS) Setup
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regime_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

-- Public read access for regime signatures (dashboard)
CREATE POLICY "regime_read_public" ON public.regime_signatures 
  FOR SELECT USING (true);

-- Public read access for market data (optional, for charts)
CREATE POLICY "market_read_public" ON public.market_data 
  FOR SELECT USING (true);

-- System health: read only for authenticated users
CREATE POLICY "health_read_auth" ON public.system_health 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Note: Write operations bypass RLS when using service role key
-- This ensures only the MCE pipeline can write data

-- 5) Helpful views for common queries
CREATE OR REPLACE VIEW public.latest_regimes AS
SELECT DISTINCT ON (symbol, tf) 
  symbol, tf, as_of, trend, volatility, confidence, 
  (signature->>'hash') as hash,
  inserted_at
FROM public.regime_signatures 
ORDER BY symbol, tf, as_of DESC;

-- 6) Functions for data quality monitoring
CREATE OR REPLACE FUNCTION public.get_data_gaps(
  p_symbol TEXT DEFAULT 'BTCUSDT',
  p_tf TEXT DEFAULT '1m',
  p_hours INTEGER DEFAULT 24
) RETURNS TABLE (
  expected_time BIGINT,
  actual_time BIGINT,
  gap_minutes INTEGER
) AS $$
DECLARE
  interval_ms BIGINT;
  start_time BIGINT;
  end_time BIGINT;
BEGIN
  -- Calculate interval in milliseconds
  interval_ms := CASE p_tf
    WHEN '1m' THEN 60000
    WHEN '5m' THEN 300000
    WHEN '15m' THEN 900000
    WHEN '1h' THEN 3600000
    WHEN '4h' THEN 14400000
    ELSE 60000
  END;
  
  -- Time range
  end_time := EXTRACT(EPOCH FROM NOW()) * 1000;
  start_time := end_time - (p_hours * 3600000);
  
  -- Find gaps in data
  RETURN QUERY
  WITH expected_times AS (
    SELECT generate_series(
      start_time, 
      end_time, 
      interval_ms
    ) AS expected_time
  ),
  actual_data AS (
    SELECT open_time as actual_time
    FROM public.market_data 
    WHERE symbol = p_symbol 
      AND tf = p_tf 
      AND open_time >= start_time 
      AND open_time <= end_time
  )
  SELECT 
    e.expected_time,
    a.actual_time,
    ((e.expected_time - COALESCE(a.actual_time, 0)) / 60000)::INTEGER as gap_minutes
  FROM expected_times e
  LEFT JOIN actual_data a ON e.expected_time = a.actual_time
  WHERE a.actual_time IS NULL
  ORDER BY e.expected_time;
END;
$$ LANGUAGE plpgsql;

-- 7) Cleanup function for old data (free tier space management)
CREATE OR REPLACE FUNCTION public.cleanup_old_data(
  p_days INTEGER DEFAULT 90
) RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
  cutoff_time TIMESTAMPTZ;
BEGIN
  cutoff_time := NOW() - (p_days || ' days')::INTERVAL;
  
  -- Delete old market data
  DELETE FROM public.market_data 
  WHERE inserted_at < cutoff_time;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Update system health
  INSERT INTO public.system_health (key, value) 
  VALUES ('last_cleanup', jsonb_build_object(
    'timestamp', EXTRACT(EPOCH FROM NOW()),
    'deleted_rows', deleted_count,
    'cutoff_days', p_days
  ))
  ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();
    
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 8) Initial system health record
INSERT INTO public.system_health (key, value) 
VALUES ('mce_schema_version', jsonb_build_object(
  'version', '005',
  'created_at', EXTRACT(EPOCH FROM NOW()),
  'description', 'MCE core schema with market_data, regime_signatures, system_health'
))
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();