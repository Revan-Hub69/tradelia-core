/**
 * Rate Limiter for Authentication Endpoints
 * Implements sliding window rate limiting for security
 */

type RateLimitConfig = {
  windowMs: number;
  maxAttempts: number;
  blockDurationMs: number;
};

type RateLimitEntry = {
  attempts: number;
  windowStart: number;
  blockedUntil?: number;
};

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;

    // Cleanup old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      // Remove entries older than window + block duration
      const maxAge = this.config.windowMs + this.config.blockDurationMs;
      if (now - entry.windowStart > maxAge) {
        this.store.delete(key);
      }
    }
  }

  private getKey(identifier: string, action: string): string {
    return `${identifier}:${action}`;
  }

  public async checkLimit(
    identifier: string,
    action: 'email-check' | 'login' | 'signup' | 'oauth',
  ): Promise<{ allowed: boolean; remainingAttempts: number; resetTime: number }> {
    const key = this.getKey(identifier, action);
    const now = Date.now();
    const entry = this.store.get(key);

    // Check if currently blocked
    if (entry?.blockedUntil && now < entry.blockedUntil) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: entry.blockedUntil,
      };
    }

    // Initialize or reset window if expired
    if (!entry || now - entry.windowStart > this.config.windowMs) {
      this.store.set(key, {
        attempts: 1,
        windowStart: now,
      });
      return {
        allowed: true,
        remainingAttempts: this.config.maxAttempts - 1,
        resetTime: now + this.config.windowMs,
      };
    }

    // Increment attempts
    entry.attempts++;

    // Check if limit exceeded
    if (entry.attempts > this.config.maxAttempts) {
      entry.blockedUntil = now + this.config.blockDurationMs;
      this.store.set(key, entry);

      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: entry.blockedUntil,
      };
    }

    this.store.set(key, entry);
    return {
      allowed: true,
      remainingAttempts: this.config.maxAttempts - entry.attempts,
      resetTime: entry.windowStart + this.config.windowMs,
    };
  }

  public recordAttempt(): void {
    // This method is called after a failed attempt
    // The actual rate limiting is done in checkLimit
  }
}

// Export configured rate limiters
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5, // 5 attempts per window
  blockDurationMs: 30 * 60 * 1000, // Block for 30 minutes
});

export const emailCheckRateLimiter = new RateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxAttempts: 10, // 10 email checks per window
  blockDurationMs: 10 * 60 * 1000, // Block for 10 minutes
});

/**
 * Get client identifier for rate limiting
 * Uses IP address with fallback to user agent hash
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for production with reverse proxy)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0] || 'unknown';

  // Fallback to user agent hash if no IP
  if (ip === 'unknown') {
    const userAgent = request.headers.get('user-agent') || 'unknown-ua';
    return `ua-${btoa(userAgent).slice(0, 16)}`;
  }

  return `ip-${ip}`;
}
