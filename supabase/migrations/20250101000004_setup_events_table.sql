-- Setup Events Table - Professional Trading System
-- Best practice: structured events, replay capability, KPI extraction

-- ============================================================================
-- SETUP EVENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS setup_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL UNIQUE,
  setup_id TEXT,                    -- Links related events (deterministic hash)
  symbol TEXT NOT NULL,
  event_type TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  
  -- Event-specific data (JSON)
  data JSONB NOT NULL DEFAULT '{}',
  
  -- Market state snapshot (JSON)
  market_state JSONB NOT NULL DEFAULT '{}',
  
  -- Trade outcome (for exit events)
  outcome JSONB,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_event_type CHECK (
    event_type IN (
      'CONTEXT_FILTER',
      'STRUCTURE_ANALYSIS',
      'ORDERFLOW_ANALYSIS', 
      'SETUP_DETECTED',
      'SETUP_VALIDATED',
      'SETUP_REJECTED',
      'SETUP_EXPIRED',
      'ENTRY_TRIGGERED',
      'STOP_HIT',
      'TARGET_HIT',
      'MANUAL_EXIT'
    )
  )
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Primary query patterns
CREATE INDEX IF NOT EXISTS idx_setup_events_timestamp 
ON setup_events(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_setup_events_symbol_timestamp 
ON setup_events(symbol, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_setup_events_setup_id_timestamp 
ON setup_events(setup_id, timestamp ASC) 
WHERE setup_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_setup_events_event_type_timestamp 
ON setup_events(event_type, timestamp DESC);

-- KPI extraction queries
CREATE INDEX IF NOT EXISTS idx_setup_events_kpi_extraction 
ON setup_events(event_type, timestamp, symbol) 
WHERE event_type IN ('SETUP_DETECTED', 'ENTRY_TRIGGERED', 'STOP_HIT', 'TARGET_HIT', 'MANUAL_EXIT');

-- JSONB indexes for common queries
CREATE INDEX IF NOT EXISTS idx_setup_events_setup_type 
ON setup_events USING GIN ((data->'setupType'));

CREATE INDEX IF NOT EXISTS idx_setup_events_regime 
ON setup_events USING GIN ((market_state->'regime'));

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE setup_events ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to setup_events" 
ON setup_events FOR ALL 
USING (auth.role() = 'service_role');

-- Authenticated users can read their own events (future: user-specific filtering)
CREATE POLICY "Authenticated users can read setup events" 
ON setup_events FOR SELECT 
USING (auth.role() = 'authenticated');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get setup lifecycle events
CREATE OR REPLACE FUNCTION get_setup_lifecycle(setup_hash TEXT)
RETURNS TABLE (
  event_id UUID,
  event_type TEXT,
  timestamp TIMESTAMPTZ,
  data JSONB,
  market_state JSONB,
  outcome JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    se.event_id,
    se.event_type,
    se.timestamp,
    se.data,
    se.market_state,
    se.outcome
  FROM setup_events se
  WHERE se.setup_id = setup_hash
  ORDER BY se.timestamp ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate setup KPIs for a period
CREATE OR REPLACE FUNCTION calculate_setup_kpis(
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_setups INTEGER;
  total_triggered INTEGER;
  total_completed INTEGER;
  total_winners INTEGER;
  total_pnl NUMERIC;
  avg_confidence NUMERIC;
  avg_rr NUMERIC;
BEGIN
  -- Count total setups detected
  SELECT COUNT(*) INTO total_setups
  FROM setup_events 
  WHERE event_type = 'SETUP_DETECTED' 
    AND timestamp BETWEEN start_time AND end_time;
  
  -- Count triggered setups
  SELECT COUNT(*) INTO total_triggered
  FROM setup_events 
  WHERE event_type = 'ENTRY_TRIGGERED' 
    AND timestamp BETWEEN start_time AND end_time;
  
  -- Count completed trades
  SELECT COUNT(*) INTO total_completed
  FROM setup_events 
  WHERE event_type IN ('STOP_HIT', 'TARGET_HIT', 'MANUAL_EXIT')
    AND outcome IS NOT NULL
    AND timestamp BETWEEN start_time AND end_time;
  
  -- Count winners and total PnL
  SELECT 
    COUNT(*) FILTER (WHERE (outcome->>'pnl')::NUMERIC > 0),
    COALESCE(SUM((outcome->>'pnl')::NUMERIC), 0)
  INTO total_winners, total_pnl
  FROM setup_events 
  WHERE event_type IN ('STOP_HIT', 'TARGET_HIT', 'MANUAL_EXIT')
    AND outcome IS NOT NULL
    AND timestamp BETWEEN start_time AND end_time;
  
  -- Calculate averages
  SELECT 
    AVG((data->>'confidenceScore')::NUMERIC),
    AVG((data->>'riskReward')::NUMERIC)
  INTO avg_confidence, avg_rr
  FROM setup_events 
  WHERE event_type = 'SETUP_DETECTED' 
    AND timestamp BETWEEN start_time AND end_time;
  
  -- Build result JSON
  result := jsonb_build_object(
    'period', jsonb_build_object(
      'from', start_time,
      'to', end_time,
      'days', EXTRACT(EPOCH FROM (end_time - start_time)) / 86400
    ),
    'volume', jsonb_build_object(
      'totalSetups', COALESCE(total_setups, 0),
      'triggered', COALESCE(total_triggered, 0),
      'completed', COALESCE(total_completed, 0),
      'triggerRate', CASE WHEN total_setups > 0 THEN total_triggered::NUMERIC / total_setups ELSE 0 END
    ),
    'quality', jsonb_build_object(
      'avgConfidenceScore', COALESCE(avg_confidence, 0),
      'avgRiskReward', COALESCE(avg_rr, 0)
    ),
    'performance', jsonb_build_object(
      'winners', COALESCE(total_winners, 0),
      'losers', COALESCE(total_completed - total_winners, 0),
      'winRate', CASE WHEN total_completed > 0 THEN total_winners::NUMERIC / total_completed ELSE 0 END,
      'totalPnl', COALESCE(total_pnl, 0),
      'expectancy', CASE WHEN total_completed > 0 THEN total_pnl / total_completed ELSE 0 END
    )
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get setup performance by type
CREATE OR REPLACE FUNCTION get_setup_performance_by_type(
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ
)
RETURNS TABLE (
  setup_type TEXT,
  total_setups BIGINT,
  triggered BIGINT,
  completed BIGINT,
  winners BIGINT,
  total_pnl NUMERIC,
  win_rate NUMERIC,
  expectancy NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH setup_stats AS (
    SELECT 
      se.data->>'setupType' as setup_type,
      se.setup_id
    FROM setup_events se
    WHERE se.event_type = 'SETUP_DETECTED'
      AND se.timestamp BETWEEN start_time AND end_time
  ),
  trigger_stats AS (
    SELECT 
      ss.setup_type,
      COUNT(*) as triggered_count
    FROM setup_stats ss
    JOIN setup_events se ON se.setup_id = ss.setup_id
    WHERE se.event_type = 'ENTRY_TRIGGERED'
      AND se.timestamp BETWEEN start_time AND end_time
    GROUP BY ss.setup_type
  ),
  outcome_stats AS (
    SELECT 
      ss.setup_type,
      COUNT(*) as completed_count,
      COUNT(*) FILTER (WHERE (se.outcome->>'pnl')::NUMERIC > 0) as winner_count,
      COALESCE(SUM((se.outcome->>'pnl')::NUMERIC), 0) as total_pnl
    FROM setup_stats ss
    JOIN setup_events se ON se.setup_id = ss.setup_id
    WHERE se.event_type IN ('STOP_HIT', 'TARGET_HIT', 'MANUAL_EXIT')
      AND se.outcome IS NOT NULL
      AND se.timestamp BETWEEN start_time AND end_time
    GROUP BY ss.setup_type
  )
  SELECT 
    COALESCE(ss.setup_type, ts.setup_type, os.setup_type) as setup_type,
    COUNT(ss.setup_id) as total_setups,
    COALESCE(ts.triggered_count, 0) as triggered,
    COALESCE(os.completed_count, 0) as completed,
    COALESCE(os.winner_count, 0) as winners,
    COALESCE(os.total_pnl, 0) as total_pnl,
    CASE WHEN os.completed_count > 0 THEN os.winner_count::NUMERIC / os.completed_count ELSE 0 END as win_rate,
    CASE WHEN os.completed_count > 0 THEN os.total_pnl / os.completed_count ELSE 0 END as expectancy
  FROM setup_stats ss
  FULL OUTER JOIN trigger_stats ts ON ss.setup_type = ts.setup_type
  FULL OUTER JOIN outcome_stats os ON COALESCE(ss.setup_type, ts.setup_type) = os.setup_type
  GROUP BY COALESCE(ss.setup_type, ts.setup_type, os.setup_type), ts.triggered_count, os.completed_count, os.winner_count, os.total_pnl;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CLEANUP FUNCTION
-- ============================================================================

-- Function to cleanup old events (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_setup_events(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM setup_events 
  WHERE timestamp < NOW() - (retention_days || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE setup_events IS 'Professional setup engine event logging for replay and KPI analysis';
COMMENT ON COLUMN setup_events.event_id IS 'Unique event identifier for deduplication';
COMMENT ON COLUMN setup_events.setup_id IS 'Links related events in setup lifecycle';
COMMENT ON COLUMN setup_events.data IS 'Event-specific data in JSON format';
COMMENT ON COLUMN setup_events.market_state IS 'Market context snapshot for replay';
COMMENT ON COLUMN setup_events.outcome IS 'Trade outcome data for performance analysis';

COMMENT ON FUNCTION get_setup_lifecycle IS 'Retrieve complete lifecycle events for a setup';
COMMENT ON FUNCTION calculate_setup_kpis IS 'Calculate comprehensive KPIs for a time period';
COMMENT ON FUNCTION get_setup_performance_by_type IS 'Breakdown performance metrics by setup type';
COMMENT ON FUNCTION cleanup_old_setup_events IS 'Cleanup old events based on retention policy';