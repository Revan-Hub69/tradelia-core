-- Rate limits table for serverless-friendly rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure only one record per key per window
  CONSTRAINT unique_rate_limit_key UNIQUE (key)
);

-- Index for efficient cleanup and lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_expires_at 
ON rate_limits(expires_at);

CREATE INDEX IF NOT EXISTS idx_rate_limits_key_window 
ON rate_limits(key, window_start);

-- RLS policies
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access to rate_limits" 
ON rate_limits FOR ALL 
USING (auth.role() = 'service_role');

-- Function to cleanup expired rate limits
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM rate_limits 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE rate_limits IS 'Serverless-friendly rate limiting with database persistence';
COMMENT ON COLUMN rate_limits.key IS 'Unique identifier for rate limit (IP + endpoint)';
COMMENT ON COLUMN rate_limits.count IS 'Current request count in this window';
COMMENT ON COLUMN rate_limits.window_start IS 'Start of the current rate limit window';
COMMENT ON COLUMN rate_limits.expires_at IS 'When this rate limit record expires';;
