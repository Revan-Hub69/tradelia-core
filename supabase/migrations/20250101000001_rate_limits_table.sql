-- Rate Limits Table for Database-Backed Rate Limiting
-- Supports serverless/multi-instance rate limiting

CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL, -- Rate limit key (IP, user, endpoint, etc.)
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL, -- Start of the current window
  expires_at TIMESTAMPTZ NOT NULL, -- When this window expires
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint per key per window (fixed)
  CONSTRAINT rate_limits_key_window_unique UNIQUE (key, window_start)
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_key_window ON rate_limits (key, window_start DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_expires_at ON rate_limits (expires_at);

-- Updated at trigger
DROP TRIGGER IF EXISTS update_rate_limits_updated_at ON rate_limits;
CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (needed for rate limiting middleware)
CREATE POLICY "Service role full access on rate_limits" ON rate_limits
  FOR ALL USING (auth.role() = 'service_role');

-- Cleanup function for expired rate limit records
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete records where window has expired
  DELETE FROM rate_limits
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON rate_limits TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_expired_rate_limits() TO service_role;