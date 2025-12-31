-- API Keys Management - Production Security
-- Professional API authentication and authorization system

-- API keys table for secure authentication
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_hash TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'service', 'readonly')),
  permissions TEXT[] NOT NULL DEFAULT ARRAY['read:basic'],
  rate_limit_tier TEXT NOT NULL DEFAULT 'basic' CHECK (rate_limit_tier IN ('basic', 'premium', 'enterprise')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata for tracking
  name TEXT,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  
  -- Usage tracking
  total_requests INTEGER DEFAULT 0,
  last_ip_address INET,
  user_agent TEXT
);

-- API key usage logs for monitoring and analytics
CREATE TABLE IF NOT EXISTS api_key_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  request_size INTEGER,
  response_size INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Request metadata
  query_params JSONB,
  headers JSONB,
  error_message TEXT
);

-- Rate limiting tracking table
CREATE TABLE IF NOT EXISTS api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  tier TEXT NOT NULL,
  limit_exceeded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique rate limit windows per key
  CONSTRAINT unique_rate_limit_window UNIQUE (api_key_id, window_start)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_api_keys_expires ON api_keys(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_api_key_usage_key_id ON api_key_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_timestamp ON api_key_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_endpoint ON api_key_usage(endpoint);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_key_window ON api_rate_limits(api_key_id, window_start);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_window_end ON api_rate_limits(window_end);

-- RLS policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to api_keys" 
ON api_keys FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to api_key_usage" 
ON api_key_usage FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to api_rate_limits" 
ON api_rate_limits FOR ALL 
USING (auth.role() = 'service_role');

-- Users can only see their own API keys
CREATE POLICY "Users can view own api_keys" 
ON api_keys FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own api_keys" 
ON api_keys FOR UPDATE 
USING (auth.uid() = user_id);

-- Functions for API key management
CREATE OR REPLACE FUNCTION update_api_key_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION update_api_key_updated_at();

-- Function to cleanup expired API keys
CREATE OR REPLACE FUNCTION cleanup_expired_api_keys()
RETURNS INTEGER AS $$
DECLARE
  deactivated_count INTEGER;
BEGIN
  UPDATE api_keys 
  SET is_active = false, updated_at = NOW()
  WHERE expires_at < NOW() AND is_active = true;
  
  GET DIAGNOSTICS deactivated_count = ROW_COUNT;
  
  RETURN deactivated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get API key statistics
CREATE OR REPLACE FUNCTION get_api_key_stats(key_id UUID DEFAULT NULL)
RETURNS TABLE (
  total_keys BIGINT,
  active_keys BIGINT,
  expired_keys BIGINT,
  total_requests BIGINT,
  requests_last_24h BIGINT,
  avg_response_time NUMERIC,
  top_endpoints JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM api_keys WHERE key_id IS NULL OR id = key_id) as total_keys,
    (SELECT COUNT(*) FROM api_keys WHERE is_active = true AND (key_id IS NULL OR id = key_id)) as active_keys,
    (SELECT COUNT(*) FROM api_keys WHERE expires_at < NOW() AND (key_id IS NULL OR id = key_id)) as expired_keys,
    (SELECT COALESCE(SUM(total_requests), 0) FROM api_keys WHERE key_id IS NULL OR id = key_id) as total_requests,
    (SELECT COUNT(*) FROM api_key_usage u 
     JOIN api_keys k ON u.api_key_id = k.id 
     WHERE u.timestamp > NOW() - INTERVAL '24 hours' 
     AND (key_id IS NULL OR k.id = key_id)) as requests_last_24h,
    (SELECT COALESCE(AVG(response_time_ms), 0) FROM api_key_usage u 
     JOIN api_keys k ON u.api_key_id = k.id 
     WHERE u.timestamp > NOW() - INTERVAL '24 hours' 
     AND (key_id IS NULL OR k.id = key_id)) as avg_response_time,
    (SELECT COALESCE(
       jsonb_agg(
         jsonb_build_object(
           'endpoint', endpoint,
           'count', request_count
         ) ORDER BY request_count DESC
       ) FILTER (WHERE rn <= 10), 
       '[]'::jsonb
     )
     FROM (
       SELECT endpoint, COUNT(*) as request_count,
              ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rn
       FROM api_key_usage u 
       JOIN api_keys k ON u.api_key_id = k.id 
       WHERE u.timestamp > NOW() - INTERVAL '24 hours' 
       AND (key_id IS NULL OR k.id = key_id)
       GROUP BY endpoint
     ) ranked) as top_endpoints;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log API usage
CREATE OR REPLACE FUNCTION log_api_usage(
  p_api_key_id UUID,
  p_endpoint TEXT,
  p_method TEXT,
  p_status_code INTEGER,
  p_response_time_ms INTEGER DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_request_size INTEGER DEFAULT NULL,
  p_response_size INTEGER DEFAULT NULL,
  p_query_params JSONB DEFAULT NULL,
  p_headers JSONB DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  usage_id UUID;
BEGIN
  INSERT INTO api_key_usage (
    api_key_id, endpoint, method, status_code, response_time_ms,
    ip_address, user_agent, request_size, response_size,
    query_params, headers, error_message
  ) VALUES (
    p_api_key_id, p_endpoint, p_method, p_status_code, p_response_time_ms,
    p_ip_address, p_user_agent, p_request_size, p_response_size,
    p_query_params, p_headers, p_error_message
  ) RETURNING id INTO usage_id;
  
  -- Update total requests counter
  UPDATE api_keys 
  SET total_requests = total_requests + 1,
      last_used_at = NOW(),
      last_ip_address = p_ip_address,
      user_agent = p_user_agent
  WHERE id = p_api_key_id;
  
  RETURN usage_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_api_key_id UUID,
  p_tier TEXT,
  p_window_minutes INTEGER DEFAULT 1
)
RETURNS TABLE (
  allowed BOOLEAN,
  current_count INTEGER,
  limit_value INTEGER,
  window_start TIMESTAMPTZ,
  window_end TIMESTAMPTZ
) AS $$
DECLARE
  v_limit INTEGER;
  v_window_start TIMESTAMPTZ;
  v_window_end TIMESTAMPTZ;
  v_current_count INTEGER;
BEGIN
  -- Get rate limit for tier
  v_limit := CASE p_tier
    WHEN 'basic' THEN 60
    WHEN 'premium' THEN 300
    WHEN 'enterprise' THEN 1000
    ELSE 60
  END;
  
  -- Calculate window
  v_window_start := date_trunc('minute', NOW()) - INTERVAL '1 minute' * (p_window_minutes - 1);
  v_window_end := v_window_start + INTERVAL '1 minute' * p_window_minutes;
  
  -- Get current count
  SELECT COALESCE(SUM(request_count), 0) INTO v_current_count
  FROM api_rate_limits
  WHERE api_key_id = p_api_key_id
    AND window_start >= v_window_start
    AND window_end <= v_window_end;
  
  RETURN QUERY SELECT 
    v_current_count < v_limit as allowed,
    v_current_count as current_count,
    v_limit as limit_value,
    v_window_start as window_start,
    v_window_end as window_end;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default service API key for system operations
DO $$
DECLARE
  service_key_hash TEXT;
BEGIN
  -- Generate hash for default service key (change in production!)
  service_key_hash := encode(digest('trd_service_key_change_in_production' || COALESCE(current_setting('app.api_key_salt', true), 'default-salt'), 'sha256'), 'hex');
  
  INSERT INTO api_keys (
    key_hash,
    role,
    permissions,
    rate_limit_tier,
    is_active,
    name,
    description
  ) VALUES (
    service_key_hash,
    'service',
    ARRAY['*'],
    'enterprise',
    true,
    'Default Service Key',
    'System service key for internal operations'
  ) ON CONFLICT (key_hash) DO NOTHING;
END $$;

-- Comments for documentation
COMMENT ON TABLE api_keys IS 'API keys for secure authentication and authorization';
COMMENT ON TABLE api_key_usage IS 'Detailed usage logs for API monitoring and analytics';
COMMENT ON TABLE api_rate_limits IS 'Rate limiting tracking per API key and time window';

COMMENT ON COLUMN api_keys.key_hash IS 'SHA256 hash of the API key for secure storage';
COMMENT ON COLUMN api_keys.permissions IS 'Array of permissions granted to this API key';
COMMENT ON COLUMN api_keys.rate_limit_tier IS 'Rate limiting tier (basic/premium/enterprise)';
COMMENT ON COLUMN api_key_usage.response_time_ms IS 'API response time in milliseconds';
COMMENT ON COLUMN api_rate_limits.window_start IS 'Start of the rate limiting time window';