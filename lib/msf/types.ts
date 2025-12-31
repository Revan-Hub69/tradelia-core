// MSF Types - Market Selection & Fit
// Best practice: contratti minimi, output deterministici

// Fit classification per simbolo
export type FitClass = "A" | "B" | "C" | "NO_TRADE";

// Playbook consentiti (non entry signals)
export type AllowedPlaybook = 
  | "breakout"
  | "pullback" 
  | "mean_revert"
  | "none";

// Day Gate - decisione binaria ON/OFF
export interface DayGate {
  v: "msf.daygate.v1";
  asOf: number;                    // timestamp decisione
  tradableDay: boolean;            // decisione binaria
  countA: number;                  // simboli classe A
  countB: number;                  // simboli classe B
  reasons: string[];               // max 3, umane
  hash: string;                    // determinismo
}

// Market Fit per simbolo
export interface MarketFit {
  v: "msf.marketfit.v1";
  symbol: string;
  asOf: number;
  fitClass: FitClass;
  allowedPlaybooks: AllowedPlaybook[];
  frictionScore: number;           // 0-1, higher = more friction
  dataQuality: number;             // 0-1, data completeness
  reasons: string[];               // max 3, umane
  hash: string;                    // determinismo
}

// Input snapshot semplice per simbolo
export interface SymbolSnapshot {
  symbol: string;
  spread: number;                  // bid-ask spread
  atr: number;                     // ATR current
  gaps: number;                    // gap count in lookback
  completeness: number;            // data completeness 0-1
  volume24h: number;               // 24h volume
  lastUpdate: number;              // timestamp last data
}

// MSF Pipeline Result
export interface MSFResult {
  success: boolean;
  timestamp: number;
  duration: number;
  dayGate: DayGate;
  marketFits: MarketFit[];
  kpis: {
    noTradeDays: number;           // running count
    aSymbolsPct: number;           // % of universe
    bSymbolsPct: number;           // % of universe
    flipRate: number;              // stability metric
    avgFriction: number;           // avg friction score
  };
  errors: string[];
  warnings: string[];
}

// MSF Configuration - Scientific parameters with literature backing
export interface MSFConfig {
  // Day Gate - binary decision thresholds
  minRegimeConfidence: number;     // POLICY: Minimum confidence (needs calibration)
  minDataQuality: number;          // POLICY: Data completeness requirement (conservative)
  maxVolatilityMultiple: number;   // POLICY: Vol expansion threshold (monitor frequency)
  
  // Fit Class - spread-based classification (conservative defaults)
  spreadThresholds: {
    aMax: number;                  // POLICY: Premium liquidity threshold (bps)
    bMax: number;                  // POLICY: Good liquidity threshold (bps)
    cMax: number;                  // POLICY: Acceptable liquidity threshold (bps)
    // NOTE: Quoted spread only - missing fee + slippage
    // TODO: Add venue normalization for crypto markets
  };
  
  maxGapsAllowed: number;          // POLICY: Data integrity threshold
  
  // Regime-Style Matching - deterministic rules (policy choice)
  regimePlaybooks: {
    [regime: string]: AllowedPlaybook[];
  };
  
  // Fail-closed safety overrides (architectural best practice)
  expandedVolOverride: boolean;    // Expanded volatility disables all trading
  lowConfidenceOverride: boolean;  // Low confidence disables day trading
  failClosed: boolean;             // Default to conservative/safe
}

// MSF v1.5 Configuration - Conservative policy defaults (NOT "scientific truth")
export const MSF_V15_CONFIG: MSFConfig = {
  // Day Gate - 3 binary checks (conservative risk policy)
  minRegimeConfidence: 0.6,        // POLICY: Avoid low confidence (needs calibration)
  minDataQuality: 0.95,            // POLICY: High completeness requirement (conservative)
  maxVolatilityMultiple: 2.0,      // POLICY: 2x = expansion (monitor OFF frequency)
  
  // Fit Class - conservative spread defaults (needs venue normalization)
  spreadThresholds: {
    aMax: 1.0,                     // POLICY: Very tight spread (may be too strict)
    bMax: 2.0,                     // POLICY: Reasonable spread (conservative)
    cMax: 5.0,                     // POLICY: Higher but tradable (needs validation)
    // NOTE: Quoted spread only - missing fee + slippage estimation
    // TODO: Calibrate with 30 days real crypto data
  },
  
  maxGapsAllowed: 2,               // POLICY: Data integrity threshold
  
  // Regime-Style Matching - simple deterministic rules
  regimePlaybooks: {
    "trend": ["pullback"],         // POLICY: Trend = pullback only
    "range": ["mean_revert"],      // POLICY: Range = mean revert only
    "unclear": ["none"],           // POLICY: Unclear = no trading
  },
  
  // Fail-closed overrides (good architectural practice)
  expandedVolOverride: true,       // POLICY: Expanded vol = all OFF (monitor usage)
  lowConfidenceOverride: true,     // POLICY: Low confidence = day OFF
  failClosed: true,                // ARCHITECTURE: Default to safe/conservative
};

// Backward compatibility alias
export const DEFAULT_MSF_CONFIG = MSF_V15_CONFIG;

// MSF Error types
export class MSFError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: any
  ) {
    super(message);
    this.name = "MSFError";
  }
}

// Type guards
export function isValidFitClass(fit: string): fit is FitClass {
  return ["A", "B", "C", "NO_TRADE"].includes(fit);
}

export function isValidPlaybook(playbook: string): playbook is AllowedPlaybook {
  return ["breakout", "pullback", "mean_revert", "none"].includes(playbook);
}

// ✅ DETERMINISTIC HASH: Deep canonical JSON sort for stable hashing
export function calculateHash(data: any): string {
  // Recursive function to sort object keys deeply
  function sortObjectDeep(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sortObjectDeep);
    }
    
    const sortedObj: any = {};
    const sortedKeys = Object.keys(obj).sort();
    
    for (const key of sortedKeys) {
      sortedObj[key] = sortObjectDeep(obj[key]);
    }
    
    return sortedObj;
  }
  
  // Create canonical string representation
  const canonicalData = sortObjectDeep(data);
  const canonicalStr = JSON.stringify(canonicalData);
  
  // Simple but stable hash function
  let hash = 0;
  for (let i = 0; i < canonicalStr.length; i++) {
    const char = canonicalStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
}