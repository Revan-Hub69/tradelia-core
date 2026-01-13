/**
 * Security utilities for Tradelia Dashboard
 * Implements security controls from threat model
 */

// Input validation and sanitization
export class SecurityValidator {
  // Sanitize user input to prevent XSS
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 1000); // Limit length
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Validate trading symbol format
  static isValidTradingSymbol(symbol: string): boolean {
    const symbolRegex = /^[A-Z]{2,10}$/;
    return symbolRegex.test(symbol);
  }

  // Validate numeric values for financial data
  static isValidPrice(price: string | number): boolean {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numPrice) && numPrice >= 0 && numPrice < 1e12;
  }

  // Validate user preferences object
  static validateUserPreferences(prefs: unknown): boolean {
    if (!prefs || typeof prefs !== 'object') return false;
    
    const prefsObj = prefs as Record<string, unknown>;
    
    // Check for dangerous properties
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    for (const key of dangerousKeys) {
      if (key in prefsObj) return false;
    }
    
    // Validate specific preference types
    if (prefsObj.theme && !['light', 'dark', 'auto'].includes(prefsObj.theme as string)) {
      return false;
    }
    
    if (prefsObj.language && !['it', 'en'].includes(prefsObj.language as string)) {
      return false;
    }
    
    return true;
  }
}

// Rate limiting utilities
export class RateLimiter {
  private static requests = new Map<string, number[]>();
  
  static isAllowed(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get existing requests for this identifier
    const userRequests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    // Check if under limit
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
  
  static cleanup(): void {
    const now = Date.now();
    const oneHourAgo = now - 3600000; // 1 hour
    
    for (const [identifier, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(time => time > oneHourAgo);
      if (recentRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, recentRequests);
      }
    }
  }
}

// Secure token utilities
export class TokenSecurity {
  // Generate secure random token
  static generateSecureToken(length: number = 32): string {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback for environments without crypto API
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
  
  // Validate JWT token format (basic check)
  static isValidJWTFormat(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }
  
  // Extract payload from JWT (without verification - for client-side use only)
  static extractJWTPayload(token: string): Record<string, unknown> | null {
    try {
      if (!this.isValidJWTFormat(token)) return null;
      
      const payload = token.split('.')[1];
      if (!payload) return null;
      
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

// Audit log entry type
interface AuditLogEntry {
  timestamp: number;
  action: string;
  userId?: string;
  details: Record<string, unknown>;
  severity: 'info' | 'warning' | 'error';
}

// Audit logging utilities
export class AuditLogger {
  private static logs: AuditLogEntry[] = [];
  
  static log(action: string, details: unknown, userId?: string, severity: 'info' | 'warning' | 'error' = 'info'): void {
    // Sanitize details to prevent log injection
    const sanitizedDetails = this.sanitizeLogData(details);
    
    const logEntry: AuditLogEntry = {
      timestamp: Date.now(),
      action: SecurityValidator.sanitizeInput(action),
      details: sanitizedDetails as Record<string, unknown>,
      severity
    };
    
    if (userId) {
      logEntry.userId = SecurityValidator.sanitizeInput(userId);
    }
    
    this.logs.push(logEntry);
    
    // Keep only last 1000 entries in memory
    if (this.logs.length > 1000) {
      this.logs.shift();
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUDIT] ${action}:`, sanitizedDetails);
    }
  }
  
  private static sanitizeLogData(data: unknown): unknown {
    if (typeof data === 'string') {
      return SecurityValidator.sanitizeInput(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeLogData(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        // Skip sensitive fields
        if (['password', 'token', 'secret', 'key'].some(sensitive => 
          key.toLowerCase().includes(sensitive))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[SecurityValidator.sanitizeInput(key)] = this.sanitizeLogData(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }
  
  static getLogs(limit: number = 100): AuditLogEntry[] {
    return this.logs.slice(-limit);
  }
  
  static getSecurityEvents(): AuditLogEntry[] {
    return this.logs.filter(log => 
      log.severity === 'warning' || 
      log.severity === 'error' ||
      log.action.includes('security') ||
      log.action.includes('auth')
    );
  }
}

// CSP violation report type
interface CSPViolationReport {
  'blocked-uri'?: string;
  'violated-directive'?: string;
  'original-policy'?: string;
  'source-file'?: string;
  'line-number'?: number;
}

// Content Security Policy violation handler
export class CSPViolationHandler {
  static handleViolation(violationReport: CSPViolationReport): void {
    AuditLogger.log('csp_violation', {
      blockedURI: violationReport['blocked-uri'],
      violatedDirective: violationReport['violated-directive'],
      originalPolicy: violationReport['original-policy'],
      sourceFile: violationReport['source-file'],
      lineNumber: violationReport['line-number']
    }, undefined, 'warning');
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to monitoring service
      console.warn('CSP Violation:', violationReport);
    }
  }
}

import { type NextRequest, NextResponse } from 'next/server';

// Security middleware for Next.js API routes
export function withSecurity<T>(handler: (request: NextRequest) => Promise<NextResponse<T>>) {
  return async (request: NextRequest): Promise<NextResponse<T | { error: string }>> => {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIP = forwardedFor || 'unknown';
    
    // Rate limiting
    if (!RateLimiter.isAllowed(clientIP, 100, 60000)) { // 100 requests per minute
      AuditLogger.log('rate_limit_exceeded', { ip: clientIP }, undefined, 'warning');
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    
    // Input validation for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        // Validate JSON structure if body exists
        const contentType = request.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          await request.clone().json();
        }
      } catch {
        AuditLogger.log('invalid_json', { method: request.method, url: request.url }, undefined, 'warning');
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
      }
    }
    
    try {
      const response = await handler(request);
      
      // Add security headers to response
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('Cache-Control', 'no-store');
      
      return response;
    } catch (error) {
      AuditLogger.log('api_error', { 
        method: request.method, 
        url: request.url, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, undefined, 'error');
      
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}

// Cleanup function to be called periodically
export function cleanupSecurityData(): void {
  RateLimiter.cleanup();
  
  // Clean up old audit logs (keep last 24 hours)
  const oneDayAgo = Date.now() - 86400000;
  AuditLogger['logs'] = AuditLogger['logs'].filter(log => log.timestamp > oneDayAgo);
}