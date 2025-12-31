// Distributed locking system to prevent concurrent pipeline runs
// Ensures data consistency and prevents race conditions

import { supabaseAdmin } from '../mce/db/supabase';

export interface LockConfig {
  name: string;
  ttl: number; // Time to live in milliseconds
  retryDelay?: number; // Delay between retry attempts
  maxRetries?: number; // Maximum number of retry attempts
}

export interface Lock {
  id: string;
  name: string;
  owner: string;
  acquired_at: string;
  expires_at: string;
  metadata?: Record<string, any>;
}

export class DistributedLock {
  private readonly config: Required<LockConfig>;
  private readonly owner: string;
  private lockId: string | null = null;

  constructor(config: LockConfig) {
    this.config = {
      retryDelay: 1000, // 1 second
      maxRetries: 5,
      ...config
    };
    
    // Generate unique owner ID
    this.owner = `${process.pid}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async acquire(metadata?: Record<string, any>): Promise<boolean> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.ttl);
    
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        // Try to acquire lock
        const { data, error } = await supabaseAdmin()
          .from('distributed_locks')
          .insert({
            name: this.config.name,
            owner: this.owner,
            acquired_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            metadata: metadata || {}
          })
          .select('id')
          .single();

        if (error) {
          // Lock might already exist, try to clean up expired locks
          await this.cleanupExpiredLocks();
          
          if (attempt < this.config.maxRetries) {
            await this.sleep(this.config.retryDelay);
            continue;
          }
          
          console.warn(`Failed to acquire lock "${this.config.name}":`, error.message);
          return false;
        }

        this.lockId = data.id;
        console.log(`Lock "${this.config.name}" acquired by ${this.owner}`);
        return true;

      } catch (error) {
        console.error(`Error acquiring lock "${this.config.name}":`, error);
        
        if (attempt < this.config.maxRetries) {
          await this.sleep(this.config.retryDelay);
          continue;
        }
        
        return false;
      }
    }

    return false;
  }

  async release(): Promise<boolean> {
    if (!this.lockId) {
      console.warn(`No lock to release for "${this.config.name}"`);
      return true;
    }

    try {
      const { error } = await supabaseAdmin()
        .from('distributed_locks')
        .delete()
        .eq('id', this.lockId)
        .eq('owner', this.owner); // Ensure we only delete our own lock

      if (error) {
        console.error(`Failed to release lock "${this.config.name}":`, error.message);
        return false;
      }

      console.log(`Lock "${this.config.name}" released by ${this.owner}`);
      this.lockId = null;
      return true;

    } catch (error) {
      console.error(`Error releasing lock "${this.config.name}":`, error);
      return false;
    }
  }

  async extend(additionalTtl: number): Promise<boolean> {
    if (!this.lockId) {
      console.warn(`No lock to extend for "${this.config.name}"`);
      return false;
    }

    try {
      const newExpiresAt = new Date(Date.now() + additionalTtl);
      
      const { error } = await supabaseAdmin()
        .from('distributed_locks')
        .update({ expires_at: newExpiresAt.toISOString() })
        .eq('id', this.lockId)
        .eq('owner', this.owner);

      if (error) {
        console.error(`Failed to extend lock "${this.config.name}":`, error.message);
        return false;
      }

      console.log(`Lock "${this.config.name}" extended by ${this.owner}`);
      return true;

    } catch (error) {
      console.error(`Error extending lock "${this.config.name}":`, error);
      return false;
    }
  }

  async isLocked(): Promise<boolean> {
    try {
      const { data, error } = await supabaseAdmin()
        .from('distributed_locks')
        .select('*')
        .eq('name', this.config.name)
        .gt('expires_at', new Date().toISOString())
        .limit(1);

      if (error) {
        console.error(`Error checking lock status for "${this.config.name}":`, error.message);
        return false;
      }

      return data && data.length > 0;

    } catch (error) {
      console.error(`Error checking lock status for "${this.config.name}":`, error);
      return false;
    }
  }

  async getLockInfo(): Promise<Lock | null> {
    try {
      const { data, error } = await supabaseAdmin()
        .from('distributed_locks')
        .select('*')
        .eq('name', this.config.name)
        .gt('expires_at', new Date().toISOString())
        .limit(1)
        .single();

      if (error || !data) {
        return null;
      }

      return data as Lock;

    } catch (error) {
      console.error(`Error getting lock info for "${this.config.name}":`, error);
      return null;
    }
  }

  private async cleanupExpiredLocks(): Promise<void> {
    try {
      const { error } = await supabaseAdmin()
        .from('distributed_locks')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) {
        console.warn('Failed to cleanup expired locks:', error.message);
      }

    } catch (error) {
      console.warn('Error during lock cleanup:', error);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Utility function for executing code with a distributed lock
export async function withLock<T>(
  config: LockConfig,
  operation: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const lock = new DistributedLock(config);
  
  const acquired = await lock.acquire(metadata);
  if (!acquired) {
    throw new Error(`Failed to acquire lock "${config.name}"`);
  }

  try {
    const result = await operation();
    return result;
  } finally {
    await lock.release();
  }
}

// Pre-configured locks for common operations
export const locks = {
  ucmPipeline: (ttl = 5 * 60 * 1000) => new DistributedLock({
    name: 'ucm_pipeline',
    ttl, // 5 minutes default
    retryDelay: 2000,
    maxRetries: 3
  }),

  mcePipeline: (ttl = 10 * 60 * 1000) => new DistributedLock({
    name: 'mce_pipeline',
    ttl, // 10 minutes default
    retryDelay: 3000,
    maxRetries: 2
  }),

  universeUpdate: (ttl = 2 * 60 * 1000) => new DistributedLock({
    name: 'universe_update',
    ttl, // 2 minutes default
    retryDelay: 1000,
    maxRetries: 5
  })
};

// Database migration for distributed_locks table
export const DISTRIBUTED_LOCKS_MIGRATION = `
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
COMMENT ON COLUMN distributed_locks.metadata IS 'Additional context about the lock';
`;