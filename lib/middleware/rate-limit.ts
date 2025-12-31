// Rate limiting middleware for UCM API endpoints
// Prevents DDoS and abuse while maintaining performance

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (for production, use Redis)
const store: RateLimitStore = {};

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export function createRateLimit(config: RateLimitConfig) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const now = Date.now();
    const windowMs = config.windowMs;
    const maxRequests = config.maxRequests;
    
    // Create key from IP and endpoint
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') || // Cloudflare
               'unknown';
    const endpoint = new URL(request.url).pathname;
    const key = `${ip}:${endpoint}`;
    
    // Initialize or get current count
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs
      };
    }
    
    // Increment counter
    store[key].count++;
    
    // Check if limit exceeded
    if (store[key].count > maxRequests) {
      const resetTime = new Date(store[key].resetTime).toISOString();
      
      return NextResponse.json(
        {
          ok: false,
          error: 'Rate limit exceeded',
          message: `Too many requests. Limit: ${maxRequests} per ${windowMs/1000}s`,
          retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
          resetTime
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': Math.max(0, maxRequests - store[key].count).toString(),
            'X-RateLimit-Reset': store[key].resetTime.toString(),
            'Retry-After': Math.ceil((store[key].resetTime - now) / 1000).toString()
          }
        }
      );
    }
    
    // Add rate limit headers to successful requests
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, maxRequests - store[key].count).toString());
    response.headers.set('X-RateLimit-Reset', store[key].resetTime.toString());
    
    return null; // Continue to next middleware/handler
  };
}

// Predefined rate limit configurations
export const rateLimits = {
  // Strict limits for expensive operations
  universe: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100 // 100 requests per 15 min
  }),
  
  // More lenient for read operations
  general: createRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60 // 60 requests per minute
  }),
  
  // Very strict for admin operations
  admin: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10 // 10 requests per hour
  })
};

// IP whitelist for trusted sources
const TRUSTED_IPS = new Set([
  '127.0.0.1',
  '::1',
  // Add your server IPs here
  // process.env.TRUSTED_IPS?.split(',') || []
]);

export function isWhitelistedIP(request: NextRequest): boolean {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             request.headers.get('cf-connecting-ip');
  
  return ip ? TRUSTED_IPS.has(ip) : false;
}

// Security headers middleware
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}