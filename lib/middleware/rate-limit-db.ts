// Database-backed rate limiting for serverless environments
// Uses Supabase for persistent rate limit tracking

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../mce/db/supabase';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (request: NextRequest) => string;
}

interface RateLimitRecord {
  key: string;
  count: number;
  window_start: string;
  expires_at: string;
}

export class DatabaseRateLimit {
  private readonly config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async check(request: NextRequest): Promise<NextResponse | null> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - this.config.windowMs);
    const expiresAt = new Date(now.getTime() + this.config.windowMs);
    
    // Generate rate limit key
    const key = this.config.keyGenerator ? 
      this.config.keyGenerator(request) : 
      this.getDefaultKey(request);
    
    try {
      const supabase = supabaseAdmin();
      
      // Clean up expired records first
      await supabase
        .from('rate_limits')
        .delete()
        .lt('expires_at', now.toISOString());
      
      // Get current count for this key in the current window
      const windowStartBucket = new Date(Math.floor(now.getTime() / this.config.windowMs) * this.config.windowMs);
      const windowEndBucket = new Date(windowStartBucket.getTime() + this.config.windowMs);
      
      const { data: existing, error: selectError } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('key', key)
        .eq('window_start', windowStartBucket.toISOString())
        .single();
      
      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows
        console.error('Rate limit check error:', selectError);
        // Fail open - allow request if DB error
        return null;
      }
      
      let currentCount = 0;
      let resetTime = windowEndBucket;
      
      if (existing) {
        currentCount = existing.count;
        resetTime = new Date(existing.expires_at);
        
        // Check if limit exceeded
        if (currentCount >= this.config.maxRequests) {
          return this.createRateLimitResponse(
            currentCount,
            this.config.maxRequests,
            resetTime
          );
        }
        
        // Increment counter
        const { error: updateError } = await supabase
          .from('rate_limits')
          .update({ 
            count: currentCount + 1,
            updated_at: now.toISOString()
          })
          .eq('key', key);
        
        if (updateError) {
          console.error('Rate limit update error:', updateError);
          // Fail open
          return null;
        }
        
        currentCount += 1;
        
      } else {
        // Create new rate limit record for this window
        const { error: insertError } = await supabase
          .from('rate_limits')
          .insert({
            key,
            count: 1,
            window_start: windowStartBucket.toISOString(),
            expires_at: windowEndBucket.toISOString()
          });
        
        if (insertError) {
          console.error('Rate limit insert error:', insertError);
          // Fail open
          return null;
        }
        
        currentCount = 1;
      }
      
      // Add rate limit headers to response
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', this.config.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', Math.max(0, this.config.maxRequests - currentCount).toString());
      response.headers.set('X-RateLimit-Reset', resetTime.getTime().toString());
      
      return null; // Allow request
      
    } catch (error) {
      console.error('Rate limit system error:', error);
      // Fail open - allow request if system error
      return null;
    }
  }

  private getDefaultKey(request: NextRequest): string {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown';
    const endpoint = new URL(request.url).pathname;
    return `${ip}:${endpoint}`;
  }

  private createRateLimitResponse(
    currentCount: number,
    maxRequests: number,
    resetTime: Date
  ): NextResponse {
    const retryAfter = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
    
    return NextResponse.json(
      {
        ok: false,
        error: 'Rate limit exceeded',
        message: `Too many requests. Limit: ${maxRequests} per ${this.config.windowMs/1000}s`,
        retryAfter,
        resetTime: resetTime.toISOString()
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.getTime().toString(),
          'Retry-After': retryAfter.toString(),
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Pre-configured rate limiters
export const dbRateLimits = {
  // Strict limits for expensive operations
  universe: new DatabaseRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  }),
  
  // More lenient for read operations
  general: new DatabaseRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60
  }),
  
  // Very strict for admin operations
  admin: new DatabaseRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    keyGenerator: (request) => {
      // Include auth token in key for admin operations
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '').substring(0, 10) || 'noauth';
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
      return `admin:${ip}:${token}`;
    }
  })
};

// Database migration for rate_limits table
export const RATE_LIMITS_MIGRATION = `
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
COMMENT ON COLUMN rate_limits.expires_at IS 'When this rate limit record expires';
`;