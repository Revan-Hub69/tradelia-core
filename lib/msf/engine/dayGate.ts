// MSF Day Gate Engine - Binary ON/OFF Decision
// Best practice: fail-closed, explicit, auditabile

import { DayGate, MarketFit, MSFConfig, calculateHash } from "../types";
import { RegimeSignature } from "../../mce/types";
import { UniverseActiveType } from "../../ucm/schemas";

export interface DayGateInput {
  regime: RegimeSignature;
  universe: UniverseActiveType;
  marketFits: MarketFit[];
  config: MSFConfig;
}

export function generateDayGate(input: DayGateInput, asOf: number): DayGate {
  const { regime, universe, marketFits, config } = input;
  const timestamp = asOf; // ✅ DETERMINISTIC: Use passed timestamp
  const reasons: string[] = [];
  
  // Count A and B symbols (for reporting only, not decision logic)
  const countA = marketFits.filter(fit => fit.fitClass === "A").length;
  const countB = marketFits.filter(fit => fit.fitClass === "B").length;
  
  // MSF v1.5: 3 simple binary checks only
  let tradableDay = true;
  
  // Check 1: Regime confidence (POLICY: avoid low confidence - needs calibration)
  if (regime.confidence < config.minRegimeConfidence) {
    tradableDay = false;
    reasons.push("low regime confidence");
  }
  
  // Check 2: Data quality (POLICY: high completeness - conservative threshold)
  const avgDataQuality = marketFits.reduce((sum, fit) => sum + fit.dataQuality, 0) / marketFits.length;
  if (avgDataQuality < config.minDataQuality) {
    tradableDay = false;
    reasons.push("poor data quality");
  }
  
  // Check 3: Volatility expansion (POLICY: expanded vol dangerous - monitor frequency)
  if (regime.volatility === "expanded") {
    tradableDay = false;
    reasons.push("expanded volatility");
  }
  
  // Additional fail-closed checks
  if (config.failClosed) {
    // Universe too small (operational risk)
    if (universe.symbols.length < 3) {
      tradableDay = false;
      reasons.push("universe too small");
    }
    
    // ✅ FIX BUG: Correct string match for gaps
    const avgGaps = marketFits.reduce((sum, fit) => sum + (fit.reasons.includes("too many gaps") ? 1 : 0), 0);
    if (avgGaps > marketFits.length * 0.3) { // >30% symbols have gap issues
      tradableDay = false;
      reasons.push("widespread data gaps");
    }
  }
  
  // Positive reasons when tradable (simple reporting)
  if (tradableDay && reasons.length === 0) {
    if (countA > 0) reasons.push(`${countA} premium symbols`);
    if (countB > 0) reasons.push(`${countB} good symbols`);
    reasons.push(`${regime.trend} regime`);
  }
  
  // Limit to max 3 reasons
  const finalReasons = reasons.slice(0, 3);
  
  const dayGate: DayGate = {
    v: "msf.daygate.v1",
    asOf: timestamp,
    tradableDay,
    countA,
    countB,
    reasons: finalReasons,
    hash: "", // will be calculated
  };
  
  // ✅ DETERMINISTIC HASH: Use stable inputs
  dayGate.hash = calculateHash({
    tradableDay,
    countA,
    countB,
    reasons: finalReasons,
    regimeHash: regime.hash,
    universeHash: universe.hash,
    asOf: timestamp,
  });
  
  return dayGate;
}

// Analyze day gate performance over time
export function analyzeDayGatePerformance(dayGates: DayGate[]): {
  noTradeDaysPct: number;
  avgACount: number;
  avgBCount: number;
  flipRate: number;
  commonReasons: { reason: string; count: number }[];
} {
  if (dayGates.length === 0) {
    return {
      noTradeDaysPct: 0,
      avgACount: 0,
      avgBCount: 0,
      flipRate: 0,
      commonReasons: [],
    };
  }
  
  const noTradeDays = dayGates.filter(dg => !dg.tradableDay).length;
  const noTradeDaysPct = noTradeDays / dayGates.length;
  
  const avgACount = dayGates.reduce((sum, dg) => sum + dg.countA, 0) / dayGates.length;
  const avgBCount = dayGates.reduce((sum, dg) => sum + dg.countB, 0) / dayGates.length;
  
  // Calculate flip rate (how often tradableDay changes)
  let flips = 0;
  for (let i = 1; i < dayGates.length; i++) {
    if (dayGates[i].tradableDay !== dayGates[i-1].tradableDay) {
      flips++;
    }
  }
  const flipRate = dayGates.length > 1 ? flips / (dayGates.length - 1) : 0;
  
  // Count common reasons
  const reasonCounts = new Map<string, number>();
  dayGates.forEach(dg => {
    dg.reasons.forEach(reason => {
      reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
    });
  });
  
  const commonReasons = Array.from(reasonCounts.entries())
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    noTradeDaysPct,
    avgACount,
    avgBCount,
    flipRate,
    commonReasons,
  };
}

// Validate day gate against best practices
export function validateDayGate(dayGate: DayGate, config: MSFConfig): {
  valid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check reasons quality
  if (dayGate.reasons.length === 0) {
    issues.push("No reasons provided");
  }
  
  if (dayGate.reasons.some(r => r.length > 50)) {
    issues.push("Reasons too verbose");
    recommendations.push("Keep reasons concise (<50 chars)");
  }
  
  // Check hash presence
  if (!dayGate.hash || dayGate.hash.length === 0) {
    issues.push("Missing hash");
  }
  
  // MSF v1.5: No artificial targets to validate against
  // The market decides A/B/C distribution naturally
  
  return {
    valid: issues.length === 0,
    issues,
    recommendations,
  };
}