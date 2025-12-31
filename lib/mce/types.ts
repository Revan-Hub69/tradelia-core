// MCE Core Types - Canonical and Deterministic
// These types define the exact data structures used throughout the MCE system

// Supported symbols (production ready symbols)
export type Symbol = "BTCUSDT" | "ETHUSDT" | "BNBUSDT" | "XRPUSDT" | "SOLUSDT" | "ADAUSDT" | "DOTUSDT" | "LINKUSDT";

// Supported timeframes
export type TF = "1m" | "5m" | "15m" | "1h" | "4h";

// Regime classifications
export type TrendClass = "up" | "down" | "range";
export type VolClass = "compressed" | "normal" | "expanded";

// Core market data structure (normalized from Binance)
export interface Kline {
  symbol: Symbol;
  tf: TF;
  openTime: number;   // ms epoch
  closeTime: number;  // ms epoch
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades?: number;
}

// Feature vector for regime classification
export interface FeatureVector {
  atr14: number | null;           // Average True Range 14 periods
  atr50: number | null;           // Average True Range 50 periods
  atrPct7d: number | null;        // ATR percentile in 7d window (0-100)
  atrPct30d: number | null;       // ATR percentile in 30d window (0-100)
  emaFast: number | null;         // EMA 20 (fast)
  emaSlow: number | null;         // EMA 50 (slow)
  trendStrength: number | null;   // 0-1, EMA distance normalized by ATR
  volNorm: number | null;         // 0-1, volume normalized
  volZ?: number | null;           // Volume z-score (optional)
  volMA?: number | null;          // Volume moving average (optional)
}

// Data quality metrics
export interface DataQuality {
  completeness: number;    // 0-1, percentage of expected data points
  gaps: number;           // count of missing intervals
  freshnessSec: number;   // seconds since last data point
  source: "binance";      // data source identifier
  valid: boolean;         // overall data quality flag
}

// Regime change tracking
export interface RegimeChange {
  changed: boolean;
  prevAsOf?: number;      // timestamp of previous regime
  prevTrend?: TrendClass;
  prevVol?: VolClass;
}

// Main MCE output - canonical regime signature
export interface RegimeSignature {
  v: "mce.v1";                    // schema version
  symbol: Symbol;
  tf: "1m";                       // realtime engine uses 1m base
  asOf: number;                   // closeTime of last candle used
  trend: TrendClass;
  volatility: VolClass;
  confidence: number;             // 0-1 classification confidence
  features: FeatureVector;
  quality: DataQuality;
  change: RegimeChange;
  hash: string;                   // canonical SHA-256 hash for determinism
}

// Database row types (matching SQL schema)
export interface MarketDataRow {
  id: number;
  symbol: string;
  tf: string;
  open_time: number;
  close_time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades: number | null;
  source: string;
  inserted_at: string;
}

export interface RegimeSignatureRow {
  id: number;
  symbol: string;
  tf: string;
  as_of: number;
  trend: string;
  volatility: string;
  confidence: number;
  quality: any;      // JSONB
  features: any;     // JSONB
  signature: any;    // JSONB - full RegimeSignature
  hash: string;
  inserted_at: string;
}

export interface SystemHealthRow {
  key: string;
  value: any;        // JSONB
  updated_at: string;
}

// Utility types for API responses
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface RegimeHistoryQuery {
  symbol?: Symbol;
  tf?: TF;
  from?: number;     // timestamp
  to?: number;       // timestamp
  limit?: number;
}

// SSE event types
export interface SSERegimeEvent {
  type: "regime";
  data: RegimeSignature;
}

export interface SSEHealthEvent {
  type: "health";
  data: {
    status: "healthy" | "degraded" | "error";
    lastUpdate: number;
    message?: string;
  };
}

export type SSEEvent = SSERegimeEvent | SSEHealthEvent;

// Configuration types
export interface MCEConfig {
  symbols: Symbol[];
  timeframes: TF[];
  features: {
    atrPeriods: number[];
    emaPeriods: number[];
    lookbackDays: number[];
  };
  classification: {
    trendThreshold: number;
    volCompressedPct: number;
    volExpandedPct: number;
    minConfidence: number;
  };
  quality: {
    minCompleteness: number;
    maxFreshnessSec: number;
    maxGapsPct: number;
  };
}

// Default configuration
export const DEFAULT_MCE_CONFIG: MCEConfig = {
  symbols: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "SOLUSDT", "ADAUSDT", "DOTUSDT", "LINKUSDT"],
  timeframes: ["1m", "5m", "15m", "1h", "4h"],
  features: {
    atrPeriods: [14, 50],
    emaPeriods: [20, 50],
    lookbackDays: [7, 30]
  },
  classification: {
    trendThreshold: 0.35,
    volCompressedPct: 30,
    volExpandedPct: 70,
    minConfidence: 0.5
  },
  quality: {
    minCompleteness: 0.95,
    maxFreshnessSec: 180,
    maxGapsPct: 5.0
  }
};

// Error types
export class MCEError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: any
  ) {
    super(message);
    this.name = "MCEError";
  }
}

export class DataQualityError extends MCEError {
  constructor(message: string, context?: any) {
    super(message, "DATA_QUALITY", context);
    this.name = "DataQualityError";
  }
}

export class ClassificationError extends MCEError {
  constructor(message: string, context?: any) {
    super(message, "CLASSIFICATION", context);
    this.name = "ClassificationError";
  }
}

// Type guards
export function isValidSymbol(symbol: string): symbol is Symbol {
  return ["BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "SOLUSDT", "ADAUSDT", "DOTUSDT", "LINKUSDT"].includes(symbol);
}

export function isValidTF(tf: string): tf is TF {
  return ["1m", "5m", "15m", "1h", "4h"].includes(tf);
}

export function isValidTrendClass(trend: string): trend is TrendClass {
  return ["up", "down", "range"].includes(trend);
}

export function isValidVolClass(vol: string): vol is VolClass {
  return ["compressed", "normal", "expanded"].includes(vol);
}

// Utility functions
export function tfToMs(tf: TF): number {
  const intervals = {
    "1m": 60_000,
    "5m": 300_000,
    "15m": 900_000,
    "1h": 3_600_000,
    "4h": 14_400_000
  };
  return intervals[tf];
}

export function msToTF(ms: number): TF | null {
  const mapping: Record<number, TF> = {
    60_000: "1m",
    300_000: "5m",
    900_000: "15m",
    3_600_000: "1h",
    14_400_000: "4h"
  };
  return mapping[ms] || null;
}