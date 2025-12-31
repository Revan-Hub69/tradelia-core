// Binance API Endpoints Configuration
// Centralized endpoint definitions and utilities

export const BINANCE_BASE_URL = "https://api.binance.com";

// API endpoints
export const ENDPOINTS = {
  // Market data endpoints
  KLINES: "/api/v3/klines",
  SERVER_TIME: "/api/v3/time",
  EXCHANGE_INFO: "/api/v3/exchangeInfo",
  TICKER_24HR: "/api/v3/ticker/24hr",
  
  // Rate limit info
  RATE_LIMIT: "/api/v3/rateLimit/order",
} as const;

// Binance interval mappings
export const BINANCE_INTERVALS = {
  "1m": "1m",
  "5m": "5m", 
  "15m": "15m",
  "1h": "1h",
  "4h": "4h",
} as const;

// MCE TF to Binance interval conversion
export function tfToBinanceInterval(tf: string): string {
  const mapping: Record<string, string> = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m", 
    "1h": "1h",
    "4h": "4h",
  };
  
  const interval = mapping[tf];
  if (!interval) {
    throw new Error(`Unsupported timeframe: ${tf}`);
  }
  
  return interval;
}

// Binance rate limits (conservative estimates)
export const RATE_LIMITS = {
  // Weight-based limits
  REQUEST_WEIGHT_PER_MINUTE: 1200,
  
  // Raw request limits  
  REQUESTS_PER_SECOND: 10,
  REQUESTS_PER_MINUTE: 600,
  
  // Klines specific
  KLINES_WEIGHT: 1, // Weight per klines request
  KLINES_MAX_LIMIT: 1000, // Max klines per request
  
  // Conservative limits for MCE (stay well under limits)
  MCE_REQUESTS_PER_SECOND: 8,
  MCE_REQUESTS_PER_MINUTE: 480,
} as const;

// Default request parameters
export const DEFAULT_PARAMS = {
  KLINES_LIMIT: 500, // Default number of klines to fetch
  TIMEOUT_MS: 10000, // 10 second timeout
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;

// Error codes from Binance API
export const BINANCE_ERROR_CODES = {
  // General errors
  UNKNOWN: -1000,
  DISCONNECTED: -1001,
  UNAUTHORIZED: -1002,
  TOO_MANY_REQUESTS: -1003,
  UNEXPECTED_RESP: -1006,
  TIMEOUT: -1007,
  
  // Request errors
  ILLEGAL_CHARS: -1100,
  TOO_MANY_PARAMETERS: -1101,
  MANDATORY_PARAM_EMPTY_OR_MALFORMED: -1102,
  UNKNOWN_PARAM: -1103,
  UNREAD_PARAMETERS: -1104,
  PARAM_EMPTY: -1105,
  PARAM_NOT_REQUIRED: -1106,
  
  // Rate limiting
  WAF_LIMIT: -1015,
  IP_BANNED: -1003,
  
  // Market data specific
  INVALID_SYMBOL: -1121,
  INVALID_INTERVAL: -1120,
} as const;

// Check if error is retryable
export function isRetryableError(errorCode: number): boolean {
  const retryableCodes = [
    BINANCE_ERROR_CODES.DISCONNECTED,
    BINANCE_ERROR_CODES.TIMEOUT,
    BINANCE_ERROR_CODES.TOO_MANY_REQUESTS,
    BINANCE_ERROR_CODES.WAF_LIMIT,
  ];
  
  return retryableCodes.includes(errorCode);
}

// Get retry delay based on error type
export function getRetryDelay(errorCode: number, attempt: number): number {
  const baseDelay = DEFAULT_PARAMS.RETRY_DELAY_MS;
  
  // Exponential backoff for rate limiting
  if (errorCode === BINANCE_ERROR_CODES.TOO_MANY_REQUESTS || 
      errorCode === BINANCE_ERROR_CODES.WAF_LIMIT) {
    return baseDelay * Math.pow(2, attempt) + Math.random() * 1000; // Add jitter
  }
  
  // Linear backoff for other errors
  return baseDelay * attempt;
}

// Validate symbol format for Binance
export function validateBinanceSymbol(symbol: string): boolean {
  // Must be uppercase, reasonable length, ends with USDT for our use case
  return /^[A-Z]{2,10}USDT$/.test(symbol);
}

// Validate interval format for Binance
export function validateBinanceInterval(interval: string): boolean {
  const validIntervals = Object.values(BINANCE_INTERVALS);
  return validIntervals.includes(interval as any);
}

// Build full URL for endpoint
export function buildUrl(endpoint: string, params?: Record<string, string | number>): string {
  const url = new URL(endpoint, BINANCE_BASE_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value.toString());
    });
  }
  
  return url.toString();
}

// Calculate request weight for rate limiting
export function calculateRequestWeight(endpoint: string, params?: Record<string, any>): number {
  switch (endpoint) {
    case ENDPOINTS.KLINES:
      // Klines weight is based on limit parameter
      const limit = params?.limit || DEFAULT_PARAMS.KLINES_LIMIT;
      return Math.max(1, Math.ceil(limit / 100)); // Rough estimate
      
    case ENDPOINTS.SERVER_TIME:
      return 1;
      
    case ENDPOINTS.EXCHANGE_INFO:
      return 10;
      
    case ENDPOINTS.TICKER_24HR:
      return params?.symbol ? 1 : 40; // Single symbol vs all symbols
      
    default:
      return 1; // Default weight
  }
}

// Common request headers
export function getDefaultHeaders(): Record<string, string> {
  return {
    "User-Agent": "MCE/1.0",
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
}

// Parse Binance timestamp to Date
export function parseTimestamp(timestamp: number): Date {
  return new Date(timestamp);
}

// Format timestamp for Binance API
export function formatTimestamp(date: Date): number {
  return date.getTime();
}

// Get current server time offset (for clock sync)
export async function getServerTimeOffset(): Promise<number> {
  try {
    const response = await fetch(buildUrl(ENDPOINTS.SERVER_TIME));
    const data = await response.json();
    
    const serverTime = data.serverTime;
    const localTime = Date.now();
    
    return serverTime - localTime;
  } catch (error) {
    console.warn("Failed to get server time offset:", error);
    return 0; // Assume no offset if we can't get server time
  }
}