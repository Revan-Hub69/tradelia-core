// UCM Configuration - FROZEN parameters for v1
// Universe Control Module configuration with frozen parameters for deterministic behavior

export const UCM_CONFIG = {
  // Universe sizing (FROZEN)
  TARGET: 20,
  MIN_ACTIVE: 12,
  MAX_ACTIVE: 25,
  
  // Hysteresis timing in minutes (FROZEN)
  ENTER_CONFIRM_MINUTES: 10,      // Must be eligible for 10 consecutive minutes to enter
  EXIT_CONFIRM_MINUTES: 20,       // Must be non-eligible for 20 consecutive minutes to exit
  
  // Cooldown and blacklist periods (FROZEN)
  COOLDOWN_MINUTES: 60,           // 1 hour cooldown after exit
  BLACKLIST_DAYS: 7,              // 7 days blacklist for hard failures
  
  // Eligibility thresholds (FROZEN for v1 - to be calibrated with real data)
  SPREAD_ENTER_MAX: 15,           // bps - maximum spread for eligibility
  SPREAD_HARD_MAX: 50,            // bps - blacklist threshold for persistent high spread
  ATR_MIN: 0.001,                 // minimum ATR for eligibility (filters out dead symbols)
  
  // Hard disqualification thresholds (FROZEN)
  HARD_DQ: {
    completeness_60m: 0.98,       // Below 98% completeness = blacklist
    gaps_60m: 0,                  // Any gaps = blacklist
  },
  
  // Eligibility requirements (FROZEN)
  ELIGIBLE: {
    completeness_60m: 0.99,       // Must have 99% completeness
    gaps_60m: 0,                  // No gaps allowed
  },
  
  // Ranking algorithm weights (FROZEN)
  RANKING_WEIGHTS: {
    volume: 0.55,                 // Volume quality weight
    friction: 0.25,               // Friction penalty weight
    quality: 0.20,                // Data quality weight
  },
  
  // Volume normalization parameters (to be calibrated)
  VOLUME_NORMALIZATION: {
    baseline_volume: 1_000_000,   // 1M USDT as baseline (log scale reference)
    log_scale_factor: 25,         // Scaling factor for log normalization
    min_log_volume: 6,            // log10(1M) = 6
  },
  
  // Default universe pool (starter set for initialization)
  DEFAULT_POOL: {
    coreSymbols: [
      "BTCUSDT",    // Bitcoin - always included
      "ETHUSDT",    // Ethereum - always included
      "SOLUSDT",    // Solana - high volume, good liquidity
      "BNBUSDT",    // Binance Coin - exchange native
      "XRPUSDT",    // XRP - major altcoin
    ],
    symbols: [
      // Major pairs (high volume, good liquidity)
      "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT",
      "ADAUSDT", "DOTUSDT", "LINKUSDT", "LTCUSDT", "BCHUSDT",
      
      // Large cap altcoins
      "AVAXUSDT", "MATICUSDT", "ATOMUSDT", "NEARUSDT", "FTMUSDT",
      "ALGOUSDT", "VETUSDT", "ICPUSDT", "FILUSDT", "TRXUSDT",
      
      // DeFi tokens (good volume)
      "UNIUSDT", "AAVEUSDT", "SUSHIUSDT", "COMPUSDT", "MKRUSDT",
      "CRVUSDT", "1INCHUSDT", "YFIUSDT", "SNXUSDT", "BALUSDT",
      
      // Layer 1/2 tokens
      "ARBUSDT", "OPUSDT", "APTUSDT", "SUIUSDT", "INJUSDT",
      
      // Additional for pool diversity (to reach ~40-50 symbols)
      "DOGEUSDT", "SHIBUSDT", "PEPEUSDT", "FLOKIUSDT", // Meme coins (high volume)
      "GMTUSDT", "GALAUSDT", "SANDUSDT", "MANAUSDT",   // Gaming/Metaverse
      "AXSUSDT", "CHZUSDT", "ENJUSDT", "FLOWUSDT",     // Gaming/NFT
    ],
  },
  
  // Pipeline timing
  PIPELINE: {
    interval_minutes: 5,          // Run every 5 minutes (aligned with MCE)
    timeout_seconds: 30,          // Maximum execution time
    max_retries: 3,               // Retry attempts on failure
  },
  
  // Data collection parameters
  DATA_COLLECTION: {
    atr_percentile_window: 300,   // 300 periods for ATR percentile calculation (5 hours on 1m)
    completeness_window_minutes: 60, // 60 minutes window for completeness check
    max_symbols_per_batch: 50,    // Maximum symbols to process in one batch
  },
  
  // Storage management
  STORAGE: {
    eligibility_retention_days: 30,  // Keep eligibility snapshots for 30 days
    cleanup_frequency_hours: 24,     // Run cleanup every 24 hours
  },
  
} as const;

// Type for config (readonly)
export type UCMConfig = typeof UCM_CONFIG;

// Validation functions for config values
export function validateUCMConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate universe sizing
  if (UCM_CONFIG.MIN_ACTIVE >= UCM_CONFIG.TARGET) {
    errors.push("MIN_ACTIVE must be less than TARGET");
  }
  
  if (UCM_CONFIG.TARGET >= UCM_CONFIG.MAX_ACTIVE) {
    errors.push("TARGET must be less than MAX_ACTIVE");
  }
  
  // Validate hysteresis timing
  if (UCM_CONFIG.ENTER_CONFIRM_MINUTES <= 0) {
    errors.push("ENTER_CONFIRM_MINUTES must be positive");
  }
  
  if (UCM_CONFIG.EXIT_CONFIRM_MINUTES <= 0) {
    errors.push("EXIT_CONFIRM_MINUTES must be positive");
  }
  
  // Validate thresholds
  if (UCM_CONFIG.SPREAD_ENTER_MAX >= UCM_CONFIG.SPREAD_HARD_MAX) {
    errors.push("SPREAD_ENTER_MAX must be less than SPREAD_HARD_MAX");
  }
  
  if (UCM_CONFIG.ATR_MIN <= 0) {
    errors.push("ATR_MIN must be positive");
  }
  
  // Validate weights sum to reasonable range
  const totalWeight = UCM_CONFIG.RANKING_WEIGHTS.volume + 
                     UCM_CONFIG.RANKING_WEIGHTS.friction + 
                     UCM_CONFIG.RANKING_WEIGHTS.quality;
  
  if (Math.abs(totalWeight - 1.0) > 0.01) {
    errors.push(`Ranking weights sum to ${totalWeight}, should be close to 1.0`);
  }
  
  // Validate core symbols are in pool
  const coreSymbols = new Set(UCM_CONFIG.DEFAULT_POOL.coreSymbols);
  const poolSymbols = new Set(UCM_CONFIG.DEFAULT_POOL.symbols);
  
  for (const coreSymbol of coreSymbols) {
    if (!poolSymbols.has(coreSymbol)) {
      errors.push(`Core symbol ${coreSymbol} not found in default pool`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Helper functions for config access
export function getHysteresisMinutes(type: 'enter' | 'exit'): number {
  return type === 'enter' ? UCM_CONFIG.ENTER_CONFIRM_MINUTES : UCM_CONFIG.EXIT_CONFIRM_MINUTES;
}

export function getCooldownTimestamp(): number {
  return Date.now() + (UCM_CONFIG.COOLDOWN_MINUTES * 60 * 1000);
}

export function getBlacklistTimestamp(): number {
  return Date.now() + (UCM_CONFIG.BLACKLIST_DAYS * 24 * 60 * 60 * 1000);
}

export function isInCooldown(cooldownUntil?: number): boolean {
  if (!cooldownUntil) return false;
  return Date.now() < cooldownUntil;
}

export function isBlacklisted(blacklistUntil?: number): boolean {
  if (!blacklistUntil) return false;
  return Date.now() < blacklistUntil;
}

// Config summary for logging/debugging
export function getConfigSummary(): Record<string, any> {
  return {
    universe: {
      target: UCM_CONFIG.TARGET,
      min: UCM_CONFIG.MIN_ACTIVE,
      max: UCM_CONFIG.MAX_ACTIVE,
    },
    hysteresis: {
      enter: UCM_CONFIG.ENTER_CONFIRM_MINUTES,
      exit: UCM_CONFIG.EXIT_CONFIRM_MINUTES,
    },
    cooldown: {
      minutes: UCM_CONFIG.COOLDOWN_MINUTES,
      days: UCM_CONFIG.BLACKLIST_DAYS,
    },
    thresholds: {
      spreadEnter: UCM_CONFIG.SPREAD_ENTER_MAX,
      spreadHard: UCM_CONFIG.SPREAD_HARD_MAX,
      atrMin: UCM_CONFIG.ATR_MIN,
    },
    weights: UCM_CONFIG.RANKING_WEIGHTS,
    pool: {
      coreCount: UCM_CONFIG.DEFAULT_POOL.coreSymbols.length,
      totalCount: UCM_CONFIG.DEFAULT_POOL.symbols.length,
    },
  };
}