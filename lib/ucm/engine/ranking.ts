// UCM Ranking Engine - Symbol scoring and ranking for universe selection
// Implements the frozen ranking algorithm: 55% volume + 25% friction + 20% quality

import { EligibilitySnapshotType } from "../schemas";
import { UCM_CONFIG } from "../config";
import { roundTo } from "../../mce/utils/math";

export interface RankingResult {
  symbol: string;
  rankScore: number;
  components: {
    volumeScore: number;
    frictionScore: number;
    qualityScore: number;
  };
  eligible: boolean;
  reasons: string[];
}

export function calculateRankingScore(snapshot: EligibilitySnapshotType): number {
  // Calculate individual components
  const volumeScore = calculateVolumeScore(snapshot.volQuote_24h);
  const frictionScore = calculateFrictionScore(snapshot);
  const qualityScore = calculateQualityScore(snapshot);
  
  // Weighted combination (FROZEN weights)
  const rankScore = 
    UCM_CONFIG.RANKING_WEIGHTS.volume * volumeScore +
    UCM_CONFIG.RANKING_WEIGHTS.friction * (100 - frictionScore) + // Invert friction (lower is better)
    UCM_CONFIG.RANKING_WEIGHTS.quality * qualityScore;
  
  return roundTo(Math.max(0, Math.min(100, rankScore)), 2);
}

export function calculateRankingResult(snapshot: EligibilitySnapshotType): RankingResult {
  const volumeScore = calculateVolumeScore(snapshot.volQuote_24h);
  const frictionScore = calculateFrictionScore(snapshot);
  const qualityScore = calculateQualityScore(snapshot);
  const rankScore = calculateRankingScore(snapshot);
  
  const reasons: string[] = [];
  
  // Add explanatory reasons
  if (volumeScore >= 80) reasons.push("High volume");
  else if (volumeScore >= 50) reasons.push("Medium volume");
  else reasons.push("Low volume");
  
  if (frictionScore <= 20) reasons.push("Low friction");
  else if (frictionScore <= 50) reasons.push("Medium friction");
  else reasons.push("High friction");
  
  if (qualityScore >= 90) reasons.push("Excellent data quality");
  else if (qualityScore >= 70) reasons.push("Good data quality");
  else reasons.push("Poor data quality");
  
  return {
    symbol: snapshot.symbol,
    rankScore,
    components: {
      volumeScore: roundTo(volumeScore, 2),
      frictionScore: roundTo(frictionScore, 2),
      qualityScore: roundTo(qualityScore, 2),
    },
    eligible: isEligible(snapshot),
    reasons,
  };
}

export function calculateVolumeScore(volume: number): number {
  // Log normalization with baseline volume
  const { baseline_volume, log_scale_factor, min_log_volume } = UCM_CONFIG.VOLUME_NORMALIZATION;
  
  if (volume <= 0) return 0;
  
  const logVolume = Math.log10(volume);
  const normalizedScore = (logVolume - min_log_volume) * log_scale_factor;
  
  return Math.max(0, Math.min(100, normalizedScore));
}

export function calculateFrictionScore(snapshot: EligibilitySnapshotType): number {
  // Base spread penalty (0-100, higher = worse friction)
  const spreadPenalty = Math.min(100, snapshot.spreadBps * 2); // 50bps = 100 penalty
  
  // ATR percentile adjustment (high percentile = more volatile = higher friction)
  // Scale ATR percentile impact: 0-30 additional penalty
  const volatilityPenalty = snapshot.atrPercentile_1m * 0.3;
  
  const totalFriction = spreadPenalty + volatilityPenalty;
  
  return Math.min(100, totalFriction);
}

export function calculateQualityScore(snapshot: EligibilitySnapshotType): number {
  // Hard failures get 0 score
  if (snapshot.gaps_60m > 0) return 0;
  
  // Completeness-based scoring
  if (snapshot.completeness_60m >= 0.99) {
    return 100; // Perfect quality
  } else if (snapshot.completeness_60m >= 0.95) {
    // Scale from 70-99 for completeness 0.95-0.99
    return 70 + ((snapshot.completeness_60m - 0.95) / 0.04) * 29;
  } else {
    // Scale from 0-70 for completeness 0-0.95
    return snapshot.completeness_60m * 70 / 0.95;
  }
}

export function isEligible(snapshot: EligibilitySnapshotType): boolean {
  // Hard requirements (FROZEN)
  if (snapshot.spreadBps > UCM_CONFIG.SPREAD_ENTER_MAX) return false;
  if (snapshot.completeness_60m < UCM_CONFIG.ELIGIBLE.completeness_60m) return false;
  if (snapshot.gaps_60m > UCM_CONFIG.ELIGIBLE.gaps_60m) return false;
  if (snapshot.atr14_1m < UCM_CONFIG.ATR_MIN) return false;
  
  return true;
}

export function shouldBlacklist(snapshot: EligibilitySnapshotType): boolean {
  // Hard disqualification criteria (FROZEN)
  if (snapshot.completeness_60m < UCM_CONFIG.HARD_DQ.completeness_60m) return true;
  if (snapshot.gaps_60m > UCM_CONFIG.HARD_DQ.gaps_60m) return true;
  if (snapshot.spreadBps > UCM_CONFIG.SPREAD_HARD_MAX) return true;
  
  return false;
}

export function rankSymbols(snapshots: EligibilitySnapshotType[]): RankingResult[] {
  // Calculate ranking for all symbols
  const rankings = snapshots.map(calculateRankingResult);
  
  // Sort by rank score (descending)
  rankings.sort((a, b) => b.rankScore - a.rankScore);
  
  return rankings;
}

export function getEligibleSymbols(snapshots: EligibilitySnapshotType[]): EligibilitySnapshotType[] {
  return snapshots.filter(isEligible);
}

export function getBlacklistCandidates(snapshots: EligibilitySnapshotType[]): EligibilitySnapshotType[] {
  return snapshots.filter(shouldBlacklist);
}

// Utility functions for ranking analysis
export function getRankingStats(rankings: RankingResult[]): {
  eligible: number;
  total: number;
  avgRankScore: number;
  avgVolumeScore: number;
  avgFrictionScore: number;
  avgQualityScore: number;
  topSymbols: string[];
} {
  const eligible = rankings.filter(r => r.eligible);
  
  const avgRankScore = rankings.reduce((sum, r) => sum + r.rankScore, 0) / rankings.length;
  const avgVolumeScore = rankings.reduce((sum, r) => sum + r.components.volumeScore, 0) / rankings.length;
  const avgFrictionScore = rankings.reduce((sum, r) => sum + r.components.frictionScore, 0) / rankings.length;
  const avgQualityScore = rankings.reduce((sum, r) => sum + r.components.qualityScore, 0) / rankings.length;
  
  const topSymbols = rankings.slice(0, 10).map(r => r.symbol);
  
  return {
    eligible: eligible.length,
    total: rankings.length,
    avgRankScore: roundTo(avgRankScore, 2),
    avgVolumeScore: roundTo(avgVolumeScore, 2),
    avgFrictionScore: roundTo(avgFrictionScore, 2),
    avgQualityScore: roundTo(avgQualityScore, 2),
    topSymbols,
  };
}

// Debug function for ranking analysis
export function explainRanking(snapshot: EligibilitySnapshotType): {
  symbol: string;
  eligible: boolean;
  rankScore: number;
  breakdown: {
    volume: { score: number; weight: number; contribution: number; explanation: string };
    friction: { score: number; weight: number; contribution: number; explanation: string };
    quality: { score: number; weight: number; contribution: number; explanation: string };
  };
  eligibilityChecks: {
    spreadOk: boolean;
    completenessOk: boolean;
    gapsOk: boolean;
    atrOk: boolean;
  };
  blacklistChecks: {
    completenessOk: boolean;
    gapsOk: boolean;
    spreadOk: boolean;
  };
} {
  const volumeScore = calculateVolumeScore(snapshot.volQuote_24h);
  const frictionScore = calculateFrictionScore(snapshot);
  const qualityScore = calculateQualityScore(snapshot);
  const rankScore = calculateRankingScore(snapshot);
  
  return {
    symbol: snapshot.symbol,
    eligible: isEligible(snapshot),
    rankScore,
    breakdown: {
      volume: {
        score: roundTo(volumeScore, 2),
        weight: UCM_CONFIG.RANKING_WEIGHTS.volume,
        contribution: roundTo(UCM_CONFIG.RANKING_WEIGHTS.volume * volumeScore, 2),
        explanation: `24h volume: ${snapshot.volQuote_24h.toLocaleString()} USDT`,
      },
      friction: {
        score: roundTo(frictionScore, 2),
        weight: UCM_CONFIG.RANKING_WEIGHTS.friction,
        contribution: roundTo(UCM_CONFIG.RANKING_WEIGHTS.friction * (100 - frictionScore), 2),
        explanation: `Spread: ${snapshot.spreadBps}bps, ATR percentile: ${snapshot.atrPercentile_1m}%`,
      },
      quality: {
        score: roundTo(qualityScore, 2),
        weight: UCM_CONFIG.RANKING_WEIGHTS.quality,
        contribution: roundTo(UCM_CONFIG.RANKING_WEIGHTS.quality * qualityScore, 2),
        explanation: `Completeness: ${(snapshot.completeness_60m * 100).toFixed(1)}%, Gaps: ${snapshot.gaps_60m}`,
      },
    },
    eligibilityChecks: {
      spreadOk: snapshot.spreadBps <= UCM_CONFIG.SPREAD_ENTER_MAX,
      completenessOk: snapshot.completeness_60m >= UCM_CONFIG.ELIGIBLE.completeness_60m,
      gapsOk: snapshot.gaps_60m <= UCM_CONFIG.ELIGIBLE.gaps_60m,
      atrOk: snapshot.atr14_1m >= UCM_CONFIG.ATR_MIN,
    },
    blacklistChecks: {
      completenessOk: snapshot.completeness_60m >= UCM_CONFIG.HARD_DQ.completeness_60m,
      gapsOk: snapshot.gaps_60m <= UCM_CONFIG.HARD_DQ.gaps_60m,
      spreadOk: snapshot.spreadBps <= UCM_CONFIG.SPREAD_HARD_MAX,
    },
  };
}