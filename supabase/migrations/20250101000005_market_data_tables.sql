-- Market Data Integration Phase 1 - Database Schema
-- Professional market data storage with replay capability

-- Market events table (append-only log)
CREATE TABLE IF NOT EXISTS market_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('TRADE', 'ORDERBOOK', 'CANDLE')),
  timestamp TIMESTAMPTZ NOT NULL,
  data JSONB NOT NULL,
  hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure idempotency and prevent duplicates
  CONSTRAINT unique_market_event UNIQUE (run_id, symbol, event_type, timestamp, hash)
);

-- Market candles table (derived from events)
CREATE TABLE IF NOT EXISTS market_candles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  timeframe TEXT NOT NULL CHECK (timeframe IN ('M1', 'M5', 'M15', 'H1', 'H4')),
  open_time TIMESTAMPTZ NOT NULL,
  close_time TIMESTAMPTZ NOT NULL,
  open DECIMAL(20,8) NOT NULL,
  high DECIMAL(20,8) NOT NULL,
  low DECIMAL(20,8) NOT NULL,
  close DECIMAL(20,8) NOT NULL,
  volume DECIMAL(20,8) NOT NULL,
  trades INTEGER NOT NULL DEFAULT 0,
  hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique candles per symbol/timeframe/time
  CONSTRAINT unique_candle UNIQUE (symbol, timeframe, open_time)
);

-- Paper trades table (simulated execution)
CREATE TABLE IF NOT EXISTS paper_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setup_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  order_type TEXT NOT NULL CHECK (order_type IN ('LIMIT', 'MARKET', 'STOP')),
  entry_price DECIMAL(20,8) NOT NULL,
  exit_price DECIMAL(20,8),
  quantity DECIMAL(20,8) NOT NULL,
  pnl DECIMAL(20,8),
  pnl_pct DECIMAL(10,4),
  r_multiple DECIMAL(10,4),
  hold_time INTEGER, -- milliseconds
  slippage DECIMAL(10,6),
  exit_reason TEXT CHECK (exit_reason IN ('STOP', 'TARGET', 'TTL', 'MANUAL')),
  ttl_sec INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Link to setup events
  FOREIGN KEY (setup_id) REFERENCES setup_events(setup_id) ON DELETE CASCADE
);

-- Market data runs table (track processing sessions)
CREATE TABLE IF NOT EXISTS market_data_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID UNIQUE NOT NULL,
  symbols TEXT[] NOT NULL,
  timeframes TEXT[] NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'RUNNING' CHECK (status IN ('RUNNING', 'COMPLETED', 'FAILED', 'STOPPED')),
  events_processed INTEGER DEFAULT 0,
  candles_generated INTEGER DEFAULT 0,
  trades_executed INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_market_events_symbol_timestamp 
ON market_events(symbol, timestamp);

CREATE INDEX IF NOT EXISTS idx_market_events_run_id 
ON market_events(run_id);

CREATE INDEX IF NOT EXISTS idx_market_events_type_timestamp 
ON market_events(event_type, timestamp);

CREATE INDEX IF NOT EXISTS idx_market_candles_symbol_timeframe_time 
ON market_candles(symbol, timeframe, open_time);

CREATE INDEX IF NOT EXISTS idx_market_candles_timeframe_time 
ON market_candles(timeframe, open_time);

CREATE INDEX IF NOT EXISTS idx_paper_trades_setup_id 
ON paper_trades(setup_id);

CREATE INDEX IF NOT EXISTS idx_paper_trades_symbol_created 
ON paper_trades(symbol, created_at);

CREATE INDEX IF NOT EXISTS idx_paper_trades_completed 
ON paper_trades(completed_at) WHERE completed_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_market_data_runs_status 
ON market_data_runs(status);

-- RLS policies
ALTER TABLE market_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_candles ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data_runs ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to market_events" 
ON market_events FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to market_candles" 
ON market_candles FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to paper_trades" 
ON paper_trades FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to market_data_runs" 
ON market_data_runs FOR ALL 
USING (auth.role() = 'service_role');

-- Functions for data management
CREATE OR REPLACE FUNCTION cleanup_old_market_events(days_to_keep INTEGER DEFAULT 7)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM market_events 
  WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_market_data_stats(run_id_param UUID DEFAULT NULL)
RETURNS TABLE (
  total_events BIGINT,
  total_candles BIGINT,
  total_trades BIGINT,
  symbols_count BIGINT,
  latest_event TIMESTAMPTZ,
  run_duration INTERVAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM market_events WHERE run_id_param IS NULL OR run_id = run_id_param) as total_events,
    (SELECT COUNT(*) FROM market_candles) as total_candles,
    (SELECT COUNT(*) FROM paper_trades WHERE run_id_param IS NULL OR setup_id IN (
      SELECT DISTINCT setup_id FROM setup_events WHERE run_id_param IS NULL OR run_id = run_id_param
    )) as total_trades,
    (SELECT COUNT(DISTINCT symbol) FROM market_events WHERE run_id_param IS NULL OR run_id = run_id_param) as symbols_count,
    (SELECT MAX(timestamp) FROM market_events WHERE run_id_param IS NULL OR run_id = run_id_param) as latest_event,
    (SELECT 
      CASE 
        WHEN run_id_param IS NOT NULL THEN 
          COALESCE(end_time, NOW()) - start_time
        ELSE 
          INTERVAL '0'
      END
      FROM market_data_runs 
      WHERE run_id_param IS NOT NULL AND run_id = run_id_param
      LIMIT 1
    ) as run_duration;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update market_data_runs statistics
CREATE OR REPLACE FUNCTION update_run_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'market_events' THEN
    UPDATE market_data_runs 
    SET 
      events_processed = events_processed + 1,
      updated_at = NOW()
    WHERE run_id = NEW.run_id;
  ELSIF TG_TABLE_NAME = 'market_candles' THEN
    UPDATE market_data_runs 
    SET 
      candles_generated = candles_generated + 1,
      updated_at = NOW()
    WHERE run_id IN (
      SELECT DISTINCT run_id FROM market_events 
      WHERE symbol = NEW.symbol 
      AND timestamp >= NEW.open_time 
      AND timestamp <= NEW.close_time
      LIMIT 1
    );
  ELSIF TG_TABLE_NAME = 'paper_trades' THEN
    UPDATE market_data_runs 
    SET 
      trades_executed = trades_executed + 1,
      updated_at = NOW()
    WHERE run_id IN (
      SELECT DISTINCT run_id FROM setup_events 
      WHERE setup_id = NEW.setup_id
      LIMIT 1
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_run_stats_events ON market_events;
CREATE TRIGGER trigger_update_run_stats_events
  AFTER INSERT ON market_events
  FOR EACH ROW EXECUTE FUNCTION update_run_stats();

DROP TRIGGER IF EXISTS trigger_update_run_stats_candles ON market_candles;
CREATE TRIGGER trigger_update_run_stats_candles
  AFTER INSERT ON market_candles
  FOR EACH ROW EXECUTE FUNCTION update_run_stats();

DROP TRIGGER IF EXISTS trigger_update_run_stats_trades ON paper_trades;
CREATE TRIGGER trigger_update_run_stats_trades
  AFTER INSERT ON paper_trades
  FOR EACH ROW EXECUTE FUNCTION update_run_stats();

-- Comments for documentation
COMMENT ON TABLE market_events IS 'Append-only log of all market events for replay capability';
COMMENT ON TABLE market_candles IS 'Aggregated OHLCV candles derived from market events';
COMMENT ON TABLE paper_trades IS 'Simulated trade executions for validation and KPI calculation';
COMMENT ON TABLE market_data_runs IS 'Tracking table for market data processing sessions';

COMMENT ON COLUMN market_events.run_id IS 'Unique identifier for processing session';
COMMENT ON COLUMN market_events.hash IS 'Deterministic hash for replay validation';
COMMENT ON COLUMN market_candles.hash IS 'Deterministic hash for candle validation';
COMMENT ON COLUMN paper_trades.r_multiple IS 'Risk-adjusted return multiple';
COMMENT ON COLUMN paper_trades.ttl_sec IS 'Time-to-live for order execution';