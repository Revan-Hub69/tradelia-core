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

-- 5) Helpful views for common queries
CREATE OR REPLACE VIEW public.latest_regimes AS
SELECT DISTINCT ON (symbol, tf) 
  symbol, tf, as_of, trend, volatility, confidence, 
  (signature->>'hash') as hash,
  inserted_at
FROM public.regime_signatures 
ORDER BY symbol, tf, as_of DESC;

-- 6) Initial system health record
INSERT INTO public.system_health (key, value) 
VALUES ('mce_schema_version', jsonb_build_object(
  'version', '005',
  'created_at', EXTRACT(EPOCH FROM NOW()),
  'description', 'MCE core schema with market_data, regime_signatures, system_health'
))
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();;
