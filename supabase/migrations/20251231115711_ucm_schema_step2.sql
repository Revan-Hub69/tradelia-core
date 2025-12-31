-- UCM Schema Step 2: RLS policies and functions

-- RLS (Row Level Security) policies - SECURE, not open
ALTER TABLE universe_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE universe_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE universe_active ENABLE ROW LEVEL SECURITY;
ALTER TABLE eligibility_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read (not public read)
CREATE POLICY "Allow authenticated read on universe_pool" ON universe_pool 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read on universe_state" ON universe_state 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read on universe_active" ON universe_active 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read on eligibility_snapshots" ON eligibility_snapshots 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role full access for pipeline operations
CREATE POLICY "Service role full access to universe_pool" ON universe_pool 
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to universe_state" ON universe_state 
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to universe_active" ON universe_active 
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to eligibility_snapshots" ON eligibility_snapshots 
  FOR ALL USING (auth.role() = 'service_role');

-- Function to check if symbol is in cooldown
CREATE OR REPLACE FUNCTION is_symbol_in_cooldown(symbol_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  cooldown_until_ts BIGINT;
  current_ts BIGINT;
BEGIN
  current_ts := EXTRACT(EPOCH FROM NOW()) * 1000;
  
  SELECT cooldown_until INTO cooldown_until_ts
  FROM universe_state
  WHERE symbol = symbol_name;
  
  RETURN COALESCE(cooldown_until_ts > current_ts, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if symbol is blacklisted
CREATE OR REPLACE FUNCTION is_symbol_blacklisted(symbol_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  blacklist_until_ts BIGINT;
  current_ts BIGINT;
BEGIN
  current_ts := EXTRACT(EPOCH FROM NOW()) * 1000;
  
  SELECT blacklist_until INTO blacklist_until_ts
  FROM universe_state
  WHERE symbol = symbol_name;
  
  RETURN COALESCE(blacklist_until_ts > current_ts, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old eligibility snapshots (for storage management)
CREATE OR REPLACE FUNCTION cleanup_old_eligibility_snapshots(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  cutoff_ts BIGINT;
  deleted_count INTEGER;
BEGIN
  cutoff_ts := EXTRACT(EPOCH FROM NOW() - INTERVAL '1 day' * days_to_keep) * 1000;
  
  DELETE FROM eligibility_snapshots
  WHERE as_of < cutoff_ts;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;;
