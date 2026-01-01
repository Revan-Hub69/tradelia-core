-- Comprehensive Schema and Permission Fix
-- This migration fixes all schema issues and permission problems
-- Run this to get the database into a working state

-- ============================================================================
-- STEP 1: CREATE MISSING TABLES
-- ============================================================================

-- mce_regime_snapshots (if not exists)
CREATE TABLE IF NOT EXISTS public.mce_regime_snapshots (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  tf TEXT NOT NULL,
  as_of BIGINT NOT NULL,
  signature JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(symbol, tf, as_of)
);

CREATE INDEX IF NOT EXISTS idx_mce_regime_snapshots_symbol_tf_as_of 
ON public.mce_regime_snapshots(symbol, tf, as_of DESC);

-- msf_snapshots (if not exists)
CREATE TABLE IF NOT EXISTS public.msf_snapshots (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  as_of BIGINT NOT NULL,
  day_gate JSONB NOT NULL,
  market_fits JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(symbol, as_of)
);

CREATE INDEX IF NOT EXISTS idx_msf_snapshots_symbol_as_of 
ON public.msf_snapshots(symbol, as_of DESC);

-- setup_events (if not exists)
CREATE TABLE IF NOT EXISTS public.setup_events (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  setup_id TEXT,
  symbol TEXT NOT NULL,
  event_type TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  market_state JSONB DEFAULT '{}',
  outcome JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_setup_events_symbol_timestamp 
ON public.setup_events(symbol, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_setup_events_setup_id 
ON public.setup_events(setup_id);

CREATE INDEX IF NOT EXISTS idx_setup_events_event_type_timestamp 
ON public.setup_events(event_type, timestamp DESC);

-- active_setups (if not exists)
CREATE TABLE IF NOT EXISTS public.active_setups (
  id BIGSERIAL PRIMARY KEY,
  setup_id TEXT NOT NULL UNIQUE,
  symbol TEXT NOT NULL,
  setup_type TEXT NOT NULL,
  direction TEXT NOT NULL,
  entry_price NUMERIC NOT NULL,
  stop_price NUMERIC NOT NULL,
  target_primary NUMERIC NOT NULL,
  target_secondary NUMERIC,
  confidence_score NUMERIC NOT NULL,
  risk_reward NUMERIC NOT NULL,
  max_risk NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_active_setups_symbol_status 
ON public.active_setups(symbol, status);

CREATE INDEX IF NOT EXISTS idx_active_setups_expires_at 
ON public.active_setups(expires_at);

-- ============================================================================
-- STEP 2: ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE IF EXISTS public.mce_regime_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.msf_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.setup_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.active_setups ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.universe_active ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: CREATE RLS POLICIES FOR PUBLIC READ ACCESS
-- ============================================================================

-- mce_regime_snapshots policies
DROP POLICY IF EXISTS "Public read access to mce_regime_snapshots" ON public.mce_regime_snapshots;
CREATE POLICY "Public read access to mce_regime_snapshots" 
ON public.mce_regime_snapshots FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Service role full access to mce_regime_snapshots" ON public.mce_regime_snapshots;
CREATE POLICY "Service role full access to mce_regime_snapshots" 
ON public.mce_regime_snapshots FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- msf_snapshots policies
DROP POLICY IF EXISTS "Public read access to msf_snapshots" ON public.msf_snapshots;
CREATE POLICY "Public read access to msf_snapshots" 
ON public.msf_snapshots FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Service role full access to msf_snapshots" ON public.msf_snapshots;
CREATE POLICY "Service role full access to msf_snapshots" 
ON public.msf_snapshots FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- setup_events policies
DROP POLICY IF EXISTS "Public read access to setup_events" ON public.setup_events;
CREATE POLICY "Public read access to setup_events" 
ON public.setup_events FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Service role full access to setup_events" ON public.setup_events;
CREATE POLICY "Service role full access to setup_events" 
ON public.setup_events FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- active_setups policies
DROP POLICY IF EXISTS "Public read access to active_setups" ON public.active_setups;
CREATE POLICY "Public read access to active_setups" 
ON public.active_setups FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Service role full access to active_setups" ON public.active_setups;
CREATE POLICY "Service role full access to active_setups" 
ON public.active_setups FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- market_data policies
DROP POLICY IF EXISTS "Public read access to market_data" ON public.market_data;
CREATE POLICY "Public read access to market_data" 
ON public.market_data FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Service role full access to market_data" ON public.market_data;
CREATE POLICY "Service role full access to market_data" 
ON public.market_data FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- universe_active policies
DROP POLICY IF EXISTS "Public read access to universe_active" ON public.universe_active;
CREATE POLICY "Public read access to universe_active" 
ON public.universe_active FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Service role full access to universe_active" ON public.universe_active;
CREATE POLICY "Service role full access to universe_active" 
ON public.universe_active FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- ============================================================================
-- STEP 4: GRANT PERMISSIONS
-- ============================================================================

GRANT ALL ON TABLE public.mce_regime_snapshots TO service_role;
GRANT SELECT ON TABLE public.mce_regime_snapshots TO authenticated;
GRANT SELECT ON TABLE public.mce_regime_snapshots TO anon;

GRANT ALL ON TABLE public.msf_snapshots TO service_role;
GRANT SELECT ON TABLE public.msf_snapshots TO authenticated;
GRANT SELECT ON TABLE public.msf_snapshots TO anon;

GRANT ALL ON TABLE public.setup_events TO service_role;
GRANT SELECT ON TABLE public.setup_events TO authenticated;
GRANT SELECT ON TABLE public.setup_events TO anon;

GRANT ALL ON TABLE public.active_setups TO service_role;
GRANT SELECT ON TABLE public.active_setups TO authenticated;
GRANT SELECT ON TABLE public.active_setups TO anon;

GRANT ALL ON TABLE public.market_data TO service_role;
GRANT SELECT ON TABLE public.market_data TO authenticated;
GRANT SELECT ON TABLE public.market_data TO anon;

GRANT ALL ON TABLE public.universe_active TO service_role;
GRANT SELECT ON TABLE public.universe_active TO authenticated;
GRANT SELECT ON TABLE public.universe_active TO anon;

-- ============================================================================
-- STEP 5: GRANT SEQUENCE PERMISSIONS
-- ============================================================================

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Schema and permissions fixed successfully!';
  RAISE NOTICE 'All tables created with proper RLS policies';
  RAISE NOTICE 'Service role has full write access';
  RAISE NOTICE 'Public has read-only access';
END $$;
