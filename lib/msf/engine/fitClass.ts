// MSF Fit Class Engine - Symbol Classification A/B/C/NO_TRADE
// Best practice: trasforma watchlist in universo operabile

import { MarketFit, FitClass, AllowedPlaybook, SymbolSnapshot, MSFConfig, calculateHash } from "../types";
import { RegimeSignature } from "../../mce/types";

export interface FitClassInput {
  symbol: string;
  snapshot: SymbolSnapshot;
  regime: RegimeSignature;
  config: MSFConfig;
}

export function classifyMarketFit(input: FitClassInput, asOf: number): MarketFit {
  const { symbol, snapshot, regime, config } = input;
  const timestamp = asOf; // ✅ DETERMINISTIC: Use passed timestamp
  const reasons: string[] = [];
  
  // Start with data quality checks (fail-closed)
  let fitClass: FitClass = "NO_TRADE";
  
  // Data quality gate
  if (snapshot.completeness < config.minDataQuality) {
    reasons.push("incomplete data");
    return createMarketFit(symbol, timestamp, fitClass, [], 1.0, snapshot.completeness, reasons);
  }
  
  // Gap check
  if (snapshot.gaps > config.maxGapsAllowed) {
    reasons.push("too many gaps"); // ✅ CONSISTENT: Match dayGate string
    return createMarketFit(symbol, timestamp, fitClass, [], 1.0, snapshot.completeness, reasons);
  }
  
  // MSF v1.5: Direct spread-based classification (conservative policy defaults)
  const spreadBps = snapshot.spread * 10000; // Convert to basis points
  
  // Classify based on spread thresholds (POLICY: conservative defaults, need calibration)
  if (spreadBps <= config.spreadThresholds.aMax) {
    fitClass = "A";
    reasons.push("premium liquidity");
  } else if (spreadBps <= config.spreadThresholds.bMax) {
    fitClass = "B";
    reasons.push("good liquidity");
  } else if (spreadBps <= config.spreadThresholds.cMax) {
    fitClass = "C";
    reasons.push("acceptable liquidity");
  } else {
    fitClass = "NO_TRADE";
    reasons.push("poor liquidity");
  }
  
  // Calculate friction score for reporting (0 = no friction, 1 = max friction)
  const frictionScore = Math.min(spreadBps / config.spreadThresholds.cMax, 1.0);
  
  // Determine allowed playbooks based on regime and volatility
  const allowedPlaybooks = determineAllowedPlaybooks(regime, fitClass, config);
  
  // Limit reasons to max 3
  const finalReasons = reasons.slice(0, 3);
  
  return createMarketFit(symbol, timestamp, fitClass, allowedPlaybooks, frictionScore, snapshot.completeness, finalReasons);
}

// MSF v1.5: Removed complex friction calculation
// Now using direct spread-based classification (conservative policy defaults)

function determineAllowedPlaybooks(regime: RegimeSignature, fitClass: FitClass, config: MSFConfig): AllowedPlaybook[] {
  if (fitClass === "NO_TRADE") {
    return ["none"];
  }
  
  // MSF v1.5: Expanded volatility override (fail-closed safety)
  if (config.expandedVolOverride && regime.volatility === "expanded") {
    return ["none"];
  }
  
  // Simple regime-playbook matching (deterministic rules)
  if (regime.trend === "range") {
    return ["mean_revert"];
  }
  
  if (regime.trend === "up" || regime.trend === "down") {
    return ["pullback"];
  }
  
  // Unclear regime = no trading (fail-closed)
  return ["none"];
}

function createMarketFit(
  symbol: string,
  timestamp: number,
  fitClass: FitClass,
  allowedPlaybooks: AllowedPlaybook[],
  frictionScore: number,
  dataQuality: number,
  reasons: string[]
): MarketFit {
  const marketFit: MarketFit = {
    v: "msf.marketfit.v1",
    symbol,
    asOf: timestamp,
    fitClass,
    allowedPlaybooks,
    frictionScore: Math.round(frictionScore * 1000) / 1000, // 3 decimal places
    dataQuality: Math.round(dataQuality * 1000) / 1000,
    reasons,
    hash: "", // will be calculated
  };
  
  // ✅ DETERMINISTIC HASH: Use stable inputs only
  marketFit.hash = calculateHash({
    symbol,
    fitClass,
    allowedPlaybooks,
    frictionScore: marketFit.frictionScore,
    dataQuality: marketFit.dataQuality,
    reasons,
    asOf: timestamp, // Include timestamp for uniqueness
  });
  
  return marketFit;
}

// Analyze fit class distribution
export function analyzeFitClassDistribution(marketFits: MarketFit[]): {
  distribution: Record<FitClass, number>;
  distributionPct: Record<FitClass, number>;
  avgFriction: Record<FitClass, number>;
  avgDataQuality: number;
  playBookUsage: Record<AllowedPlaybook, number>;
} {
  const distribution: Record<FitClass, number> = { A: 0, B: 0, C: 0, NO_TRADE: 0 };
  const frictionByClass: Record<FitClass, number[]> = { A: [], B: [], C: [], NO_TRADE: [] };
  const playBookUsage: Record<AllowedPlaybook, number> = { breakout: 0, pullback: 0, mean_revert: 0, none: 0 };
  
  let totalDataQuality = 0;
  
  marketFits.forEach(fit => {
    distribution[fit.fitClass]++;
    frictionByClass[fit.fitClass].push(fit.frictionScore);
    totalDataQuality += fit.dataQuality;
    
    fit.allowedPlaybooks.forEach(pb => {
      playBookUsage[pb]++;
    });
  });
  
  const total = marketFits.length;
  const distributionPct: Record<FitClass, number> = {
    A: total > 0 ? distribution.A / total : 0,
    B: total > 0 ? distribution.B / total : 0,
    C: total > 0 ? distribution.C / total : 0,
    NO_TRADE: total > 0 ? distribution.NO_TRADE / total : 0,
  };
  
  const avgFriction: Record<FitClass, number> = {
    A: frictionByClass.A.length > 0 ? frictionByClass.A.reduce((a, b) => a + b, 0) / frictionByClass.A.length : 0,
    B: frictionByClass.B.length > 0 ? frictionByClass.B.reduce((a, b) => a + b, 0) / frictionByClass.B.length : 0,
    C: frictionByClass.C.length > 0 ? frictionByClass.C.reduce((a, b) => a + b, 0) / frictionByClass.C.length : 0,
    NO_TRADE: frictionByClass.NO_TRADE.length > 0 ? frictionByClass.NO_TRADE.reduce((a, b) => a + b, 0) / frictionByClass.NO_TRADE.length : 0,
  };
  
  const avgDataQuality = total > 0 ? totalDataQuality / total : 0;
  
  return {
    distribution,
    distributionPct,
    avgFriction,
    avgDataQuality,
    playBookUsage,
  };
}

// Validate fit class against best practices
export function validateFitClassDistribution(analysis: ReturnType<typeof analyzeFitClassDistribution>, config: MSFConfig): {
  valid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // MSF v1.5: No artificial targets - market decides distribution naturally
  
  // Data quality should be high
  if (analysis.avgDataQuality < config.minDataQuality) {
    issues.push(`Low average data quality: ${(analysis.avgDataQuality * 100).toFixed(1)}%`);
    recommendations.push("Improve data collection or increase quality threshold");
  }
  
  // Check for reasonable distribution (descriptive, not prescriptive)
  if (analysis.distributionPct.NO_TRADE < 0.1) {
    recommendations.push("Very few NO_TRADE symbols - consider if market conditions are unusually good");
  }
  
  if (analysis.distributionPct.A > 0.5) {
    recommendations.push("Many A-class symbols - consider if spread thresholds are appropriate");
  }
  
  return {
    valid: issues.length === 0,
    issues,
    recommendations,
  };
}