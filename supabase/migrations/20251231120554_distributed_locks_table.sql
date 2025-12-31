-- Distributed locks table for preventing concurrent operations
CREATE TABLE IF NOT EXISTS distributed_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure only one active lock per name
  CONSTRAINT unique_active_lock UNIQUE (name)
);

-- Index for efficient cleanup of expired locks
CREATE INDEX IF NOT EXISTS idx_distributed_locks_expires_at 
ON distributed_locks(expires_at);

-- Index for lock name lookups
CREATE INDEX IF NOT EXISTS idx_distributed_locks_name 
ON distributed_locks(name);

-- RLS policies
ALTER TABLE distributed_locks ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access to distributed_locks" 
ON distributed_locks FOR ALL 
USING (auth.role() = 'service_role');

-- Function to automatically cleanup expired locks
CREATE OR REPLACE FUNCTION cleanup_expired_locks()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM distributed_locks 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE distributed_locks IS 'Distributed locking system for preventing concurrent operations';
COMMENT ON COLUMN distributed_locks.name IS 'Unique name identifier for the lock';
COMMENT ON COLUMN distributed_locks.owner IS 'Process/instance that owns the lock';
COMMENT ON COLUMN distributed_locks.expires_at IS 'When the lock expires and can be acquired by others';
COMMENT ON COLUMN distributed_locks.metadata IS 'Additional context about the lock';;
