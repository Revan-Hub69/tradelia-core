-- MSF Snapshots Table
-- Stores real-time symbol snapshots collected from Binance for MSF analysis

-- Create snapshots table
CREATE TABLE IF NOT EXISTS msf_snapshots (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  collected_at BIGINT NOT NULL,
  
  -- Snapshot metrics
  spread_pct DECIMAL(10,6) NOT NULL,     -- Spread as percentage (e.g., 0.001 = 0.1%)
  atr DECIMAL(15,6) NOT NULL,            -- Average True Range
  gaps INTEGER NOT NULL DEFAULT 0,       -- Number of data gaps detected
  completeness DECIMAL(5,3) NOT NULL,    -- Data completeness (0-1)
  volume_24h DECIMAL(20,2) NOT NULL,     -- 24h volume
  last_update BIGINT NOT NULL,           -- Last data update timestamp
  
  -- Full snapshot data (JSON)
  snapshot_data JSONB NOT NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_msf_snapshots_symbol_time 
  ON msf_snapshots(symbol, collected_at DESC);

CREATE INDEX IF NOT EXISTS idx_msf_snapshots_collected_at 
  ON msf_snapshots(collected_at DESC);

CREATE INDEX IF NOT EXISTS idx_msf_snapshots_spread 
  ON msf_snapshots(spread_pct);

-- Partial index for recent data (last 7 days)
CREATE INDEX IF NOT EXISTS idx_msf_snapshots_recent 
  ON msf_snapshots(symbol, collected_at DESC) 
  WHERE collected_at > EXTRACT(EPOCH FROM NOW() - INTERVAL '7 days') * 1000;

-- RLS policies
ALTER TABLE msf_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role can manage snapshots" ON msf_snapshots
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read snapshots
CREATE POLICY "Authenticated users can read snapshots" ON msf_snapshots
  FOR SELECT USING (auth.role() = 'authenticated');

-- Utility functions

-- Get latest snapshot for a symbol
CREATE OR REPLACE FUNCTION get_latest_snapshot(symbol_name TEXT)
RETURNS TABLE (
  symbol TEXT,
  spread_pct DECIMAL,
  atr DECIMAL,
  gaps INTEGER,
  completeness DECIMAL,
  volume_24h DECIMAL,
  collected_at BIGINT
) 
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    s.symbol,
    s.spread_pct,
    s.atr,
    s.gaps,
    s.completeness,
    s.volume_24h,
    s.collected_at
  FROM msf_snapshots s
  WHERE s.symbol = symbol_name
  ORDER BY s.collected_at DESC
  LIMIT 1;
$$;

-- Get snapshot statistics for a symbol over time period
CREATE OR REPLACE FUNCTION get_snapshot_stats(
  symbol_name TEXT,
  hours_back INTEGER DEFAULT 24
)
RETURNS TABLE (
  symbol TEXT,
  avg_spread DECIMAL,
  min_spread DECIMAL,
  max_spread DECIMAL,
  avg_atr DECIMAL,
  avg_completeness DECIMAL,
  total_gaps INTEGER,
  sample_count BIGINT
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    symbol_name as symbol,
    AVG(s.spread_pct) as avg_spread,
    MIN(s.spread_pct) as min_spread,
    MAX(s.spread_pct) as max_spread,
    AVG(s.atr) as avg_atr,
    AVG(s.completeness) as avg_completeness,
    SUM(s.gaps) as total_gaps,
    COUNT(*) as sample_count
  FROM msf_snapshots s
  WHERE s.symbol = symbol_name
    AND s.collected_at > EXTRACT(EPOCH FROM NOW() - INTERVAL '1 hour' * hours_back) * 1000
  GROUP BY symbol_name;
$$;

-- Cleanup old snapshots (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_snapshots()
RETURNS INTEGER
LANGUAGE SQL
AS $$
  WITH deleted AS (
    DELETE FROM msf_snapshots 
    WHERE collected_at < EXTRACT(EPOCH FROM NOW() - INTERVAL '30 days') * 1000
    RETURNING id
  )
  SELECT COUNT(*) FROM deleted;
$$;

-- Comments for documentation
COMMENT ON TABLE msf_snapshots IS 'Real-time symbol snapshots from Binance for MSF analysis';
COMMENT ON COLUMN msf_snapshots.spread_pct IS 'Estimated spread as percentage of price';
COMMENT ON COLUMN msf_snapshots.atr IS 'Average True Range (14-period)';
COMMENT ON COLUMN msf_snapshots.gaps IS 'Number of missing data periods detected';
COMMENT ON COLUMN msf_snapshots.completeness IS 'Data completeness ratio (0-1)';
COMMENT ON COLUMN msf_snapshots.volume_24h IS '24-hour trading volume';
COMMENT ON COLUMN msf_snapshots.snapshot_data IS 'Full snapshot object as JSON';

-- Grant permissions
GRANT SELECT ON msf_snapshots TO authenticated;
GRANT ALL ON msf_snapshots TO service_role;
GRANT USAGE ON SEQUENCE msf_snapshots_id_seq TO service_role;