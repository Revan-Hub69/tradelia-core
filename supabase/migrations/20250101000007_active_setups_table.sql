-- Active Setups Table - Serverless-compatible setup state management
-- Best practice: persistent state, atomic operations, automatic cleanup

-- ============================================================================
-- ACTIVE SETUPS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS active_setups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setup_id TEXT NOT NULL UNIQUE,
  symbol TEXT NOT NULL,
  setup_type TEXT NOT NULL,
  direction TEXT NOT NULL,
  
  -- Entry/Exit levels
  entry_price NUMERIC NOT NULL,
  stop_level NUMERIC NOT NULL,
  target_primary NUMERIC NOT NULL,
  target_secondary NUMERIC,
  
  -- Risk metrics
  confidence_score NUMERIC NOT NULL,
  risk_reward NUMERIC NOT NULL,
  max_risk NUMERIC NOT NULL,
  
  -- Timing
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Full setup data (JSON)
  setup_data JSONB NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_setup_type CHECK (
    setup_type IN ('BREAKOUT_ACCEPTANCE', 'PULLBACK_STRUCTURAL', 'LIQUIDITY_SWEEP_REVERSAL')
  ),
  CONSTRAINT valid_direction CHECK (
    direction IN ('LONG', 'SHORT')
  ),
  CONSTRAINT valid_confidence CHECK (
    confidence_score >= 0 AND confidence_score <= 1
  ),
  CONSTRAINT valid_risk_reward CHECK (
    risk_reward > 0
  ),
  CONSTRAINT valid_max_risk CHECK (
    max_risk > 0
  )
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Primary query patterns
CREATE INDEX IF NOT EXISTS idx_active_setups_expires_at 
ON active_setups(expires_at DESC);

CREATE INDEX IF NOT EXISTS idx_active_setups_symbol 
ON active_setups(symbol);

CREATE INDEX IF NOT EXISTS idx_active_setups_setup_type 
ON active_setups(setup_type);

CREATE INDEX IF NOT EXISTS idx_active_setups_active 
ON active_setups(expires_at, symbol) 
WHERE expires_at > NOW();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE active_setups ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to active_setups" 
ON active_setups FOR ALL 
USING (auth.role() = 'service_role');

-- Authenticated users can read active setups
CREATE POLICY "Authenticated users can read active setups" 
ON active_setups FOR SELECT 
USING (auth.role() = 'authenticated');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get active setups summary
CREATE OR REPLACE FUNCTION get_active_setups_summary()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_active INTEGER;
  total_risk NUMERIC;
  setups_by_type JSONB;
  setups_by_symbol JSONB;
BEGIN
  -- Count active setups
  SELECT COUNT(*) INTO total_active
  FROM active_setups 
  WHERE expires_at > NOW();
  
  -- Calculate total risk
  SELECT COALESCE(SUM(max_risk), 0) INTO total_risk
  FROM active_setups 
  WHERE expires_at > NOW();
  
  -- Group by setup type
  SELECT jsonb_object_agg(setup_type, count) INTO setups_by_type
  FROM (
    SELECT setup_type, COUNT(*) as count
    FROM active_setups 
    WHERE expires_at > NOW()
    GROUP BY setup_type
  ) t;
  
  -- Group by symbol
  SELECT jsonb_object_agg(symbol, count) INTO setups_by_symbol
  FROM (
    SELECT symbol, COUNT(*) as count
    FROM active_setups 
    WHERE expires_at > NOW()
    GROUP BY symbol
  ) t;
  
  -- Build result
  result := jsonb_build_object(
    'totalActive', COALESCE(total_active, 0),
    'totalRisk', COALESCE(total_risk, 0),
    'setupsByType', COALESCE(setups_by_type, '{}'::jsonb),
    'setupsBySymbol', COALESCE(setups_by_symbol, '{}'::jsonb),
    'timestamp', NOW()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup expired setups
CREATE OR REPLACE FUNCTION cleanup_expired_setups()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM active_setups 
  WHERE expires_at <= NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check setup conflicts
CREATE OR REPLACE FUNCTION check_setup_conflicts(
  new_symbol TEXT,
  new_direction TEXT,
  new_entry_price NUMERIC,
  new_max_risk NUMERIC
)
RETURNS JSONB AS $$
DECLARE
  conflicts JSONB := '[]'::jsonb;
  opposing_count INTEGER;
  overlapping_count INTEGER;
  symbol_risk NUMERIC;
  price_overlap_threshold NUMERIC := 0.01; -- 1%
  max_symbol_risk NUMERIC := 200; -- $200 max per symbol
BEGIN
  -- Check for opposing directions
  SELECT COUNT(*) INTO opposing_count
  FROM active_setups 
  WHERE symbol = new_symbol 
    AND direction != new_direction 
    AND expires_at > NOW();
  
  IF opposing_count > 0 THEN
    conflicts := conflicts || jsonb_build_array('opposing_direction');
  END IF;
  
  -- Check for overlapping price levels
  SELECT COUNT(*) INTO overlapping_count
  FROM active_setups 
  WHERE symbol = new_symbol 
    AND ABS(entry_price - new_entry_price) / new_entry_price < price_overlap_threshold
    AND expires_at > NOW();
  
  IF overlapping_count > 0 THEN
    conflicts := conflicts || jsonb_build_array('overlapping_entry_levels');
  END IF;
  
  -- Check symbol risk exposure
  SELECT COALESCE(SUM(max_risk), 0) INTO symbol_risk
  FROM active_setups 
  WHERE symbol = new_symbol 
    AND expires_at > NOW();
  
  IF symbol_risk + new_max_risk > max_symbol_risk THEN
    conflicts := conflicts || jsonb_build_array('max_symbol_exposure_exceeded');
  END IF;
  
  RETURN jsonb_build_object(
    'hasConflicts', jsonb_array_length(conflicts) > 0,
    'conflicts', conflicts,
    'symbolRisk', symbol_risk,
    'newTotalRisk', symbol_risk + new_max_risk
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- AUTOMATIC CLEANUP TRIGGER
-- ============================================================================

-- Create a function to be called by cron or manually
CREATE OR REPLACE FUNCTION schedule_setup_cleanup()
RETURNS void AS $$
BEGIN
  -- This would be called by pg_cron or external scheduler
  PERFORM cleanup_expired_setups();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE active_setups IS 'Persistent storage for active trading setups in serverless environment';
COMMENT ON COLUMN active_setups.setup_id IS 'Deterministic hash identifier for the setup';
COMMENT ON COLUMN active_setups.setup_data IS 'Complete setup object for reconstruction';
COMMENT ON COLUMN active_setups.expires_at IS 'When the setup expires and should be cleaned up';

COMMENT ON FUNCTION get_active_setups_summary IS 'Get summary statistics of active setups';
COMMENT ON FUNCTION cleanup_expired_setups IS 'Remove expired setups and return count deleted';
COMMENT ON FUNCTION check_setup_conflicts IS 'Check if a new setup conflicts with existing ones';