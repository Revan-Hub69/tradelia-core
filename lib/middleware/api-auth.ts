// API Authentication Middleware - Production Security
// Professional authentication and authorization for market data APIs

import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { supabaseAdmin } from '@/lib/mce/db/supabase';

export interface AuthContext {
  userId?: string;
  role: 'admin' | 'user' | 'service' | 'readonly';
  permissions: string[];
  rateLimit: {
    tier: 'basic' | 'premium' | 'enterprise';
    requestsPerMinute: number;
  };
}

export interface ApiKeyRecord {
  id: string;
  key_hash: string;
  user_id?: string;
  role: string;
  permissions: string[];
  rate_limit_tier: string;
  is_active: boolean;
  expires_at?: string;
  last_used_at?: string;
  created_at: string;
}

export class ApiAuthenticator {
  private readonly keyCache = new Map<string, { context: AuthContext; expires: number }>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async authenticate(request: NextRequest): Promise<AuthContext | null> {
    try {
      // Extract API key from header
      const apiKey = this.extractApiKey(request);
      if (!apiKey) {
        return this.getAnonymousContext();
      }

      // Check cache first
      const cached = this.keyCache.get(apiKey);
      if (cached && cached.expires > Date.now()) {
        return cached.context;
      }

      // Validate API key
      const context = await this.validateApiKey(apiKey);
      if (context) {
        // Cache the result
        this.keyCache.set(apiKey, {
          context,
          expires: Date.now() + this.cacheTimeout,
        });

        // Update last used timestamp
        await this.updateLastUsed(apiKey);
      }

      return context;

    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  async requireAuth(request: NextRequest, requiredRole?: string): Promise<NextResponse | AuthContext> {
    const context = await this.authenticate(request);
    
    if (!context) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Authentication required',
          message: 'Valid API key required for this endpoint'
        },
        { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'ApiKey realm="Market Data API"',
          }
        }
      );
    }

    if (requiredRole && !this.hasRole(context, requiredRole)) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Insufficient permissions',
          message: `Role '${requiredRole}' required for this endpoint`
        },
        { status: 403 }
      );
    }

    return context;
  }

  async requirePermission(request: NextRequest, permission: string): Promise<NextResponse | AuthContext> {
    const context = await this.authenticate(request);
    
    if (!context) {
      return NextResponse.json(
        { ok: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!context.permissions.includes(permission) && !context.permissions.includes('*')) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Insufficient permissions',
          message: `Permission '${permission}' required for this endpoint`
        },
        { status: 403 }
      );
    }

    return context;
  }

  private extractApiKey(request: NextRequest): string | null {
    // Try multiple header formats
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    const apiKeyHeader = request.headers.get('x-api-key');
    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    // Try query parameter (less secure, for development only)
    if (process.env.NODE_ENV !== 'production') {
      const url = new URL(request.url);
      return url.searchParams.get('api_key');
    }

    return null;
  }

  private async validateApiKey(apiKey: string): Promise<AuthContext | null> {
    try {
      const keyHash = this.hashApiKey(apiKey);
      const supabase = supabaseAdmin();

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key_hash', keyHash)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return null;
      }

      const keyRecord = data as ApiKeyRecord;

      // Check expiration
      if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
        return null;
      }

      // Build auth context
      return {
        userId: keyRecord.user_id,
        role: keyRecord.role as AuthContext['role'],
        permissions: keyRecord.permissions,
        rateLimit: {
          tier: keyRecord.rate_limit_tier as AuthContext['rateLimit']['tier'],
          requestsPerMinute: this.getRateLimitForTier(keyRecord.rate_limit_tier),
        },
      };

    } catch (error) {
      console.error('API key validation error:', error);
      return null;
    }
  }

  private getAnonymousContext(): AuthContext {
    return {
      role: 'readonly',
      permissions: ['read:public'],
      rateLimit: {
        tier: 'basic',
        requestsPerMinute: 10,
      },
    };
  }

  private hasRole(context: AuthContext, requiredRole: string): boolean {
    const roleHierarchy = {
      'readonly': 0,
      'user': 1,
      'service': 2,
      'admin': 3,
    };

    const userLevel = roleHierarchy[context.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  }

  private hashApiKey(apiKey: string): string {
    return createHash('sha256')
      .update(apiKey)
      .update(process.env.API_KEY_SALT || 'default-salt')
      .digest('hex');
  }

  private getRateLimitForTier(tier: string): number {
    const limits = {
      'basic': 60,
      'premium': 300,
      'enterprise': 1000,
    };
    return limits[tier as keyof typeof limits] || 60;
  }

  private async updateLastUsed(apiKey: string): Promise<void> {
    try {
      const keyHash = this.hashApiKey(apiKey);
      const supabase = supabaseAdmin();

      await supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('key_hash', keyHash);

    } catch (error) {
      // Non-critical error, just log it
      console.error('Failed to update last used timestamp:', error);
    }
  }

  // Utility method to generate new API keys
  async generateApiKey(
    userId?: string,
    role: AuthContext['role'] = 'user',
    permissions: string[] = ['read:basic'],
    tier: AuthContext['rateLimit']['tier'] = 'basic',
    expiresInDays?: number
  ): Promise<{ apiKey: string; keyId: string }> {
    const apiKey = this.createSecureApiKey();
    const keyHash = this.hashApiKey(apiKey);
    const expiresAt = expiresInDays ? 
      new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString() : 
      null;

    const supabase = supabaseAdmin();
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        key_hash: keyHash,
        user_id: userId,
        role,
        permissions,
        rate_limit_tier: tier,
        is_active: true,
        expires_at: expiresAt,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create API key: ${error.message}`);
    }

    return {
      apiKey,
      keyId: data.id,
    };
  }

  private createSecureApiKey(): string {
    const prefix = 'trd_';
    const randomBytes = require('crypto').randomBytes(32).toString('hex');
    return prefix + randomBytes;
  }

  // Cleanup expired keys and cache
  async cleanup(): Promise<void> {
    try {
      // Clear expired cache entries
      const now = Date.now();
      for (const [key, cached] of this.keyCache) {
        if (cached.expires <= now) {
          this.keyCache.delete(key);
        }
      }

      // Deactivate expired API keys in database
      const supabase = supabaseAdmin();
      await supabase
        .from('api_keys')
        .update({ is_active: false })
        .lt('expires_at', new Date().toISOString())
        .eq('is_active', true);

    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

// Singleton instance
export const apiAuth = new ApiAuthenticator();

// Convenience functions
export async function requireAuth(request: NextRequest, role?: string) {
  return apiAuth.requireAuth(request, role);
}

export async function requirePermission(request: NextRequest, permission: string) {
  return apiAuth.requirePermission(request, permission);
}

export async function authenticate(request: NextRequest) {
  return apiAuth.authenticate(request);
}