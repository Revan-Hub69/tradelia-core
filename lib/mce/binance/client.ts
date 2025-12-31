// Binance REST Client with Rate Limiting
// Conservative 8 RPS to stay well under Binance limits

import { z } from "zod";
import { BinanceKlineResponseSchema } from "../schemas";
import { MCEError } from "../types";

// Rate limiter class
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    // If we're at the limit, wait
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest) + 10; // +10ms buffer
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.waitForSlot(); // Recursive check
      }
    }
    
    // Record this request
    this.requests.push(now);
  }
}

// Binance API response types
interface BinanceKlineRaw extends Array<string | number> {
  0: number;  // Open time
  1: string;  // Open
  2: string;  // High
  3: string;  // Low
  4: string;  // Close
  5: string;  // Volume
  6: number;  // Close time
  7: string;  // Quote asset volume
  8: number;  // Number of trades
  9: string;  // Taker buy base asset volume
  10: string; // Taker buy quote asset volume
  11: string; // Ignore
}

export interface BinanceKlineParams {
  symbol: string;
  interval: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

export interface BinanceApiError {
  code: number;
  msg: string;
}

// Main Binance client class
export class BinanceClient {
  private readonly baseUrl = "https://api.binance.com";
  private readonly rateLimiter: RateLimiter;
  private readonly timeout: number;

  constructor(options: {
    rateLimit?: { requests: number; windowMs: number };
    timeout?: number;
  } = {}) {
    // Conservative 8 RPS (480 requests per minute)
    const { requests = 8, windowMs = 1000 } = options.rateLimit || {};
    this.rateLimiter = new RateLimiter(requests, windowMs);
    this.timeout = options.timeout || 10000; // 10s timeout
  }

  // Fetch klines with rate limiting and error handling
  async getKlines(params: BinanceKlineParams): Promise<BinanceKlineRaw[]> {
    await this.rateLimiter.waitForSlot();

    const url = new URL("/api/v3/klines", this.baseUrl);
    
    // Add query parameters
    url.searchParams.set("symbol", params.symbol);
    url.searchParams.set("interval", params.interval);
    
    if (params.startTime) {
      url.searchParams.set("startTime", params.startTime.toString());
    }
    
    if (params.endTime) {
      url.searchParams.set("endTime", params.endTime.toString());
    }
    
    if (params.limit) {
      url.searchParams.set("limit", Math.min(params.limit, 1000).toString());
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "User-Agent": "MCE/1.0",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}`;
        
        try {
          const errorData = await response.json() as BinanceApiError;
          errorMsg = `${errorData.code}: ${errorData.msg}`;
        } catch {
          // Use HTTP status if JSON parsing fails
        }
        
        throw new MCEError(
          `Binance API error: ${errorMsg}`,
          "BINANCE_API_ERROR",
          { status: response.status, url: url.toString() }
        );
      }

      const data = await response.json();
      
      // Validate response structure
      const validatedData = BinanceKlineResponseSchema.parse(data);
      
      return validatedData as BinanceKlineRaw[];
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new MCEError(
          "Invalid Binance API response format",
          "VALIDATION_ERROR",
          { zodError: error.issues, url: url.toString() }
        );
      }
      
      if (error instanceof Error && error.name === "AbortError") {
        throw new MCEError(
          `Binance API timeout after ${this.timeout}ms`,
          "TIMEOUT_ERROR",
          { url: url.toString() }
        );
      }
      
      if (error instanceof MCEError) {
        throw error;
      }
      
      throw new MCEError(
        `Binance API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        "NETWORK_ERROR",
        { originalError: error, url: url.toString() }
      );
    }
  }

  // Get recent klines (last N periods)
  async getRecentKlines(
    symbol: string,
    interval: string,
    limit: number = 500
  ): Promise<BinanceKlineRaw[]> {
    return this.getKlines({
      symbol,
      interval,
      limit: Math.min(limit, 1000), // Binance max is 1000
    });
  }

  // Get klines for a specific time range
  async getKlinesRange(
    symbol: string,
    interval: string,
    startTime: number,
    endTime: number
  ): Promise<BinanceKlineRaw[]> {
    const results: BinanceKlineRaw[] = [];
    let currentStart = startTime;
    
    // Binance returns max 1000 klines per request
    // For 1m interval, that's ~16.7 hours
    while (currentStart < endTime) {
      const batch = await this.getKlines({
        symbol,
        interval,
        startTime: currentStart,
        endTime,
        limit: 1000,
      });
      
      if (batch.length === 0) {
        break; // No more data
      }
      
      results.push(...batch);
      
      // Update start time for next batch
      const lastKline = batch[batch.length - 1];
      currentStart = (lastKline[6] as number) + 1; // Close time + 1ms
      
      // Prevent infinite loops
      if (batch.length < 1000) {
        break; // Last batch
      }
    }
    
    return results;
  }

  // Health check - test API connectivity
  async healthCheck(): Promise<{
    connected: boolean;
    latencyMs: number;
    error?: string;
  }> {
    const start = Date.now();
    
    try {
      // Use server time endpoint (lightweight)
      const url = new URL("/api/v3/time", this.baseUrl);
      
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "User-Agent": "MCE/1.0" },
        signal: AbortSignal.timeout(5000), // 5s timeout for health check
      });
      
      const latencyMs = Date.now() - start;
      
      if (!response.ok) {
        return {
          connected: false,
          latencyMs,
          error: `HTTP ${response.status}`,
        };
      }
      
      return {
        connected: true,
        latencyMs,
      };
      
    } catch (error) {
      return {
        connected: false,
        latencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// Default client instance
export const binanceClient = new BinanceClient();

// Utility function to convert Binance interval to milliseconds
export function intervalToMs(interval: string): number {
  const intervals: Record<string, number> = {
    "1m": 60_000,
    "3m": 180_000,
    "5m": 300_000,
    "15m": 900_000,
    "30m": 1_800_000,
    "1h": 3_600_000,
    "2h": 7_200_000,
    "4h": 14_400_000,
    "6h": 21_600_000,
    "8h": 28_800_000,
    "12h": 43_200_000,
    "1d": 86_400_000,
    "3d": 259_200_000,
    "1w": 604_800_000,
    "1M": 2_629_746_000, // Approximate month
  };
  
  return intervals[interval] || 60_000; // Default to 1m
}

// Utility to validate Binance symbol format
export function isValidBinanceSymbol(symbol: string): boolean {
  // Basic validation: uppercase, ends with USDT, reasonable length
  return /^[A-Z]{2,10}USDT$/.test(symbol);
}

// Utility to validate Binance interval
export function isValidBinanceInterval(interval: string): boolean {
  const validIntervals = [
    "1m", "3m", "5m", "15m", "30m",
    "1h", "2h", "4h", "6h", "8h", "12h",
    "1d", "3d", "1w", "1M"
  ];
  
  return validIntervals.includes(interval);
}