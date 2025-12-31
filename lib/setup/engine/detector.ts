// Setup Detection Engine - Professional Trading System
// Best practice: numerical rules, no visual patterns, deterministic

import { 
  MarketState, 
  SetupCandidate, 
  SetupType, 
  Evidence, 
  SetupEngineConfig,
  DEFAULT_SETUP_CONFIG 
} from '../types';
import { setupLogger } from '../logger';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import * as breakoutRules from './breakout-rules';

export class SetupDetector {
  constructor(private readonly config: SetupEngineConfig = DEFAULT_SETUP_CONFIG) {}

  // ============================================================================
  // MAIN DETECTION ENGINE
  // ============================================================================

  async detectSetups(marketState: MarketState): Promise<SetupCandidate[]> {
    const candidates: SetupCandidate[] = [];
    
    // Context filter - fail-closed
    const contextGate = await this.checkContextGate(marketState);
    if (!contextGate.allowed) {
      await setupLogger.logContextFilter(
        'ALL_SYMBOLS',
        false,
        contextGate.reasonCodes,
        marketState
      );
      return [];
    }

    // Process each symbol in the universe
    const symbols = Object.keys(marketState.structure);
    
    for (const symbol of symbols) {
      try {
        // Check if symbol has required data
        if (!this.hasRequiredData(symbol, marketState)) {
          continue;
        }

        // Log structure analysis
        await setupLogger.logStructureAnalysis(
          symbol,
          marketState.structure[symbol],
          marketState
        );

        // Log orderflow analysis
        if (marketState.orderflow[symbol]) {
          await setupLogger.logOrderflowAnalysis(
            symbol,
            marketState.orderflow[symbol],
            marketState
          );
        }

        // Detect each setup type
        const breakoutSetup = await this.detectBreakoutAcceptance(symbol, marketState);
        const pullbackSetup = await this.detectPullbackStructural(symbol, marketState);
        const liquiditySetup = await this.detectLiquiditySweepReversal(symbol, marketState);

        // Collect valid candidates
        if (breakoutSetup) candidates.push(breakoutSetup);
        if (pullbackSetup) candidates.push(pullbackSetup);
        if (liquiditySetup) candidates.push(liquiditySetup);

      } catch (error) {
        console.error(`Setup detection error for ${symbol}:`, error);
        // Continue with other symbols
      }
    }

    return candidates;
  }

  // ============================================================================
  // CONTEXT GATE - MARKET CONDITIONS CHECK
  // ============================================================================

  private async checkContextGate(marketState: MarketState): Promise<{
    allowed: boolean;
    reasonCodes: string[];
    regimeCompatible: boolean;
    sessionValid: boolean;
    volatilityAdequate: boolean;
    msfEnabled: boolean;
  }> {
    const reasonCodes: string[] = [];
    
    // Check regime compatibility
    const regimeCompatible = this.isRegimeCompatible(marketState.regime);
    if (!regimeCompatible) {
      reasonCodes.push('regime_incompatible');
    }

    // Check session validity
    const sessionValid = this.isSessionValid(marketState.session);
    if (!sessionValid) {
      reasonCodes.push('session_invalid');
    }

    // Check MSF day gate
    const msfEnabled = marketState.universeFit.dayGate.tradableDay;
    if (!msfEnabled) {
      reasonCodes.push('msf_day_gate_closed');
    }

    // Check volatility conditions
    const volatilityAdequate = this.isVolatilityAdequate(marketState.volatility);
    if (!volatilityAdequate) {
      reasonCodes.push('volatility_inadequate');
    }

    const allowed = regimeCompatible && sessionValid && msfEnabled && volatilityAdequate;

    return {
      allowed,
      reasonCodes,
      regimeCompatible,
      sessionValid,
      volatilityAdequate,
      msfEnabled,
    };
  }

  private isRegimeCompatible(regime: any): boolean {
    // Accept trend and expansion regimes, be cautious with range
    const classification = regime.classification;
    const strength = regime.strength || 0;
    
    if (classification === 'TREND' && strength >= 0.6) return true;
    if (classification === 'EXPANSION' && strength >= 0.7) return true;
    if (classification === 'RANGE' && strength >= 0.8) return true; // High confidence range only
    
    return false;
  }

  private isSessionValid(session: any): boolean {
    // Avoid Asian session (low liquidity), prefer EU/US
    return session.current !== 'ASIA';
  }

  private isVolatilityAdequate(volatility: any): boolean {
    // Check if we have sufficient volatility for intraday moves
    const symbols = Object.keys(volatility);
    if (symbols.length === 0) return false;
    
    // At least 50% of symbols should have adequate volatility
    const adequateCount = symbols.filter(symbol => {
      const vol = volatility[symbol];
      return vol.atr > 0 && vol.realized > 0.01; // Minimum 1% realized vol
    }).length;
    
    return adequateCount >= symbols.length * 0.5;
  }

  // ============================================================================
  // SETUP 1: BREAKOUT + ACCEPTANCE
  // ============================================================================

  private async detectBreakoutAcceptance(
    symbol: string, 
    marketState: MarketState
  ): Promise<SetupCandidate | null> {
    const structure = marketState.structure[symbol];
    const orderflow = marketState.orderflow[symbol];
    const volatility = marketState.volatility[symbol];
    
    if (!structure || !orderflow || !volatility) return null;

    const evidence: Evidence[] = [];
    let confidenceScore = 0;

    // 1. STRUCTURAL BREAK DETECTION
    const structuralBreak = this.detectStructuralBreak(structure);
    if (!structuralBreak) return null;

    evidence.push({
      type: 'STRUCTURE',
      description: `${structuralBreak.direction} break of ${structuralBreak.level} (${structuralBreak.timeframe})`,
      weight: 0.3,
      data: structuralBreak,
    });
    confidenceScore += 0.3 * structuralBreak.strength;

    // 2. ACCEPTANCE CHECK (price holding above/below break level)
    const acceptance = this.checkAcceptance(structuralBreak, marketState.asOf);
    if (!acceptance.confirmed) return null;

    evidence.push({
      type: 'STRUCTURE',
      description: `Acceptance confirmed: ${acceptance.duration}ms above break`,
      weight: 0.25,
      data: acceptance,
    });
    confidenceScore += 0.25;

    // 3. ORDERFLOW CONFIRMATION
    const orderflowConfirmation = this.checkOrderflowAlignment(
      orderflow, 
      structuralBreak.direction
    );
    
    if (this.config.breakoutConfig.requireOrderflowConfirmation && !orderflowConfirmation.aligned) {
      return null;
    }

    if (orderflowConfirmation.aligned) {
      evidence.push({
        type: 'ORDERFLOW',
        description: `Orderflow aligned: ${orderflowConfirmation.strength}`,
        weight: 0.25,
        data: orderflowConfirmation,
      });
      confidenceScore += 0.25 * orderflowConfirmation.confidence;
    }

    // 4. REGIME ALIGNMENT
    const regimeAlignment = this.checkRegimeAlignment(
      marketState.regime, 
      structuralBreak.direction
    );
    
    evidence.push({
      type: 'REGIME',
      description: `Regime ${regimeAlignment.compatible ? 'supports' : 'neutral to'} ${structuralBreak.direction}`,
      weight: 0.2,
      data: regimeAlignment,
    });
    confidenceScore += 0.2 * regimeAlignment.score;

    // 5. CALCULATE ENTRY/STOP/TARGETS
    const entryPrice = this.calculateBreakoutEntry(structuralBreak);
    const stopLevel = this.calculateBreakoutStop(structuralBreak, structure);
    const targets = this.calculateBreakoutTargets(structuralBreak, structure, volatility);

    const riskReward = Math.abs(targets.primary - entryPrice) / Math.abs(entryPrice - stopLevel);
    
    // Risk-reward filter
    if (riskReward < this.config.minRiskReward) return null;

    // Confidence filter
    if (confidenceScore < this.config.minConfidenceScore) return null;

    const setupCandidate: SetupCandidate = {
      setupId: this.generateSetupId(symbol, 'BREAKOUT_ACCEPTANCE', marketState.asOf),
      symbol,
      setupType: 'BREAKOUT_ACCEPTANCE',
      direction: structuralBreak.direction,
      
      entryModel: {
        type: 'LIMIT',
        price: entryPrice,
        ttlSec: this.config.breakoutConfig.maxRetestTime / 1000,
      },
      
      stopModel: {
        type: 'STRUCTURAL',
        level: stopLevel,
      },
      
      targets,
      
      confidenceScore,
      evidence,
      invalidationCodes: [],
      expiresAt: marketState.asOf + this.config.breakoutConfig.maxRetestTime,
      riskReward,
      maxRisk: Math.abs(entryPrice - stopLevel) * 100, // Assuming $100 position size
    };

    await setupLogger.logSetupDetected(setupCandidate, marketState);
    return setupCandidate;
  }

  // ============================================================================
  // SETUP 2: PULLBACK STRUCTURAL
  // ============================================================================

  private async detectPullbackStructural(
    symbol: string,
    marketState: MarketState
  ): Promise<SetupCandidate | null> {
    const structure = marketState.structure[symbol];
    const orderflow = marketState.orderflow[symbol];
    const volatility = marketState.volatility[symbol];
    
    if (!structure || !orderflow || !volatility) return null;

    const evidence: Evidence[] = [];
    let confidenceScore = 0;

    // 1. TREND IDENTIFICATION
    const trend = this.identifyTrend(structure, marketState.regime);
    if (!trend || trend.strength < this.config.pullbackConfig.minTrendStrength) return null;

    evidence.push({
      type: 'STRUCTURE',
      description: `${trend.direction} trend identified, strength: ${trend.strength}`,
      weight: 0.3,
      data: trend,
    });
    confidenceScore += 0.3 * trend.strength;

    // 2. PULLBACK TO STRUCTURE
    const pullback = this.detectPullbackToStructure(structure, trend);
    if (!pullback) return null;

    const pullbackDepth = pullback.depth;
    if (pullbackDepth > this.config.pullbackConfig.maxPullbackDepth) return null;

    evidence.push({
      type: 'STRUCTURE',
      description: `Pullback to ${pullback.level} (${pullbackDepth * 100}% retracement)`,
      weight: 0.25,
      data: pullback,
    });
    confidenceScore += 0.25 * (1 - pullbackDepth); // Shallower pullbacks score higher

    // 3. ORDERFLOW RESUMPTION
    const orderflowResumption = this.checkOrderflowResumption(orderflow, trend.direction);
    
    if (this.config.pullbackConfig.requireVolumeConfirmation && !orderflowResumption.confirmed) {
      return null;
    }

    if (orderflowResumption.confirmed) {
      evidence.push({
        type: 'ORDERFLOW',
        description: `Trend resumption confirmed: ${orderflowResumption.signal}`,
        weight: 0.25,
        data: orderflowResumption,
      });
      confidenceScore += 0.25 * orderflowResumption.strength;
    }

    // 4. REGIME ALIGNMENT
    const regimeAlignment = this.checkRegimeAlignment(marketState.regime, trend.direction);
    evidence.push({
      type: 'REGIME',
      description: `Regime alignment: ${regimeAlignment.score}`,
      weight: 0.2,
      data: regimeAlignment,
    });
    confidenceScore += 0.2 * regimeAlignment.score;

    // 5. CALCULATE ENTRY/STOP/TARGETS
    const entryPrice = this.calculatePullbackEntry(pullback);
    const stopLevel = this.calculatePullbackStop(pullback, trend);
    const targets = this.calculatePullbackTargets(trend, structure, volatility);

    const riskReward = Math.abs(targets.primary - entryPrice) / Math.abs(entryPrice - stopLevel);
    
    if (riskReward < this.config.minRiskReward) return null;
    if (confidenceScore < this.config.minConfidenceScore) return null;

    const setupCandidate: SetupCandidate = {
      setupId: this.generateSetupId(symbol, 'PULLBACK_STRUCTURAL', marketState.asOf),
      symbol,
      setupType: 'PULLBACK_STRUCTURAL',
      direction: trend.direction,
      
      entryModel: {
        type: 'LIMIT',
        price: entryPrice,
        ttlSec: 600, // 10 minutes for pullback entries
      },
      
      stopModel: {
        type: 'STRUCTURAL',
        level: stopLevel,
      },
      
      targets,
      
      confidenceScore,
      evidence,
      invalidationCodes: [],
      expiresAt: marketState.asOf + 600000, // 10 minutes
      riskReward,
      maxRisk: Math.abs(entryPrice - stopLevel) * 100,
    };

    await setupLogger.logSetupDetected(setupCandidate, marketState);
    return setupCandidate;
  }

  // ============================================================================
  // SETUP 3: LIQUIDITY SWEEP + REVERSAL
  // ============================================================================

  private async detectLiquiditySweepReversal(
    symbol: string,
    marketState: MarketState
  ): Promise<SetupCandidate | null> {
    const structure = marketState.structure[symbol];
    const orderflow = marketState.orderflow[symbol];
    const volatility = marketState.volatility[symbol];
    
    if (!structure || !orderflow || !volatility) return null;

    const evidence: Evidence[] = [];
    let confidenceScore = 0;

    // 1. LIQUIDITY SWEEP DETECTION
    const liquiditySweep = this.detectLiquiditySweep(structure);
    if (!liquiditySweep) return null;

    if (liquiditySweep.distance < this.config.liquiditySweepConfig.minSweepDistance) return null;

    evidence.push({
      type: 'LIQUIDITY',
      description: `Liquidity sweep detected: ${liquiditySweep.direction} beyond ${liquiditySweep.level}`,
      weight: 0.3,
      data: liquiditySweep,
    });
    confidenceScore += 0.3 * liquiditySweep.strength;

    // 2. ABSORPTION DETECTION
    const absorption = this.detectAbsorption(orderflow, liquiditySweep);
    if (!absorption.detected) return null;

    evidence.push({
      type: 'ORDERFLOW',
      description: `Absorption detected: ${absorption.intensity} at ${absorption.level}`,
      weight: 0.25,
      data: absorption,
    });
    confidenceScore += 0.25 * absorption.strength;

    // 3. CVD FLIP CONFIRMATION
    const cvdFlip = this.detectCVDFlip(orderflow, liquiditySweep.direction);
    
    if (this.config.liquiditySweepConfig.requireCVDFlip && !cvdFlip.confirmed) {
      return null;
    }

    if (cvdFlip.confirmed) {
      evidence.push({
        type: 'ORDERFLOW',
        description: `CVD flip confirmed: ${cvdFlip.direction}`,
        weight: 0.25,
        data: cvdFlip,
      });
      confidenceScore += 0.25 * cvdFlip.strength;
    }

    // 4. REGIME COMPATIBILITY
    const regimeCompatibility = this.checkLiquiditySweepRegimeCompatibility(
      marketState.regime, 
      liquiditySweep
    );
    
    evidence.push({
      type: 'REGIME',
      description: `Regime compatibility: ${regimeCompatibility.score}`,
      weight: 0.2,
      data: regimeCompatibility,
    });
    confidenceScore += 0.2 * regimeCompatibility.score;

    // 5. CALCULATE ENTRY/STOP/TARGETS
    const reversalDirection = liquiditySweep.direction === 'LONG' ? 'SHORT' : 'LONG';
    const entryPrice = this.calculateLiquiditySweepEntry(liquiditySweep, absorption);
    const stopLevel = this.calculateLiquiditySweepStop(liquiditySweep);
    const targets = this.calculateLiquiditySweepTargets(liquiditySweep, structure, volatility);

    const riskReward = Math.abs(targets.primary - entryPrice) / Math.abs(entryPrice - stopLevel);
    
    if (riskReward < this.config.minRiskReward) return null;
    if (confidenceScore < this.config.minConfidenceScore) return null;

    const setupCandidate: SetupCandidate = {
      setupId: this.generateSetupId(symbol, 'LIQUIDITY_SWEEP_REVERSAL', marketState.asOf),
      symbol,
      setupType: 'LIQUIDITY_SWEEP_REVERSAL',
      direction: reversalDirection,
      
      entryModel: {
        type: 'LIMIT',
        price: entryPrice,
        ttlSec: this.config.liquiditySweepConfig.maxAbsorptionTime / 1000,
      },
      
      stopModel: {
        type: 'STRUCTURAL',
        level: stopLevel,
      },
      
      targets,
      
      confidenceScore,
      evidence,
      invalidationCodes: [],
      expiresAt: marketState.asOf + this.config.liquiditySweepConfig.maxAbsorptionTime,
      riskReward,
      maxRisk: Math.abs(entryPrice - stopLevel) * 100,
    };

    await setupLogger.logSetupDetected(setupCandidate, marketState);
    return setupCandidate;
  }

  // ============================================================================
  // HELPER METHODS (IMPLEMENTATION STUBS - TO BE COMPLETED)
  // ============================================================================

  private hasRequiredData(symbol: string, marketState: MarketState): boolean {
    return !!(
      marketState.structure[symbol] &&
      marketState.orderflow[symbol] &&
      marketState.volatility[symbol]
    );
  }

  private generateSetupId(symbol: string, setupType: SetupType, timestamp: number): string {
    const data = `${symbol}-${setupType}-${timestamp}`;
    return createHash('sha256').update(data).digest('hex').substring(0, 16);
  }

  // ============================================================================
  // BREAKOUT SETUP IMPLEMENTATION
  // ============================================================================

  private detectStructuralBreak(structure: any): any {
    return breakoutRules.detectStructuralBreak(structure);
  }

  private checkAcceptance(structuralBreak: any, timestamp: number): any {
    return breakoutRules.checkAcceptance(structuralBreak, timestamp);
  }

  private checkOrderflowAlignment(orderflow: any, direction: 'LONG' | 'SHORT'): any {
    return breakoutRules.checkOrderflowAlignment(orderflow, direction);
  }

  private checkRegimeAlignment(regime: any, direction: 'LONG' | 'SHORT'): any {
    // Regime alignment logic
    const classification = regime.classification;
    const strength = regime.strength || 0;
    
    let score = 0;
    let compatible = false;
    
    if (classification === 'TREND') {
      // Trend regime supports both directions if strong enough
      score = strength;
      compatible = strength >= 0.6;
    } else if (classification === 'EXPANSION') {
      // Expansion regime is good for breakouts
      score = strength * 0.9; // Slightly lower than trend
      compatible = strength >= 0.7;
    } else if (classification === 'RANGE') {
      // Range regime is less favorable for breakouts
      score = strength * 0.5;
      compatible = strength >= 0.8; // Need very strong range
    }
    
    return { compatible, score };
  }

  private calculateBreakoutEntry(structuralBreak: any): number {
    return breakoutRules.calculateBreakoutEntry(structuralBreak);
  }

  private calculateBreakoutStop(structuralBreak: any, structure: any): number {
    return breakoutRules.calculateBreakoutStop(structuralBreak, structure);
  }

  private calculateBreakoutTargets(structuralBreak: any, structure: any, volatility: any): any {
    return breakoutRules.calculateBreakoutTargets(structuralBreak, structure, volatility);
  }
  
  private identifyTrend(structure: any, regime: any): any { return null; }
  private detectPullbackToStructure(structure: any, trend: any): any { return null; }
  private checkOrderflowResumption(orderflow: any, direction: string): any { return { confirmed: false }; }
  private calculatePullbackEntry(pullback: any): number { return 0; }
  private calculatePullbackStop(pullback: any, trend: any): number { return 0; }
  private calculatePullbackTargets(trend: any, structure: any, volatility: any): any { return { primary: 0 }; }
  
  private detectLiquiditySweep(structure: any): any { return null; }
  private detectAbsorption(orderflow: any, liquiditySweep: any): any { return { detected: false }; }
  private detectCVDFlip(orderflow: any, direction: string): any { return { confirmed: false }; }
  private checkLiquiditySweepRegimeCompatibility(regime: any, liquiditySweep: any): any { return { score: 0 }; }
  private calculateLiquiditySweepEntry(liquiditySweep: any, absorption: any): number { return 0; }
  private calculateLiquiditySweepStop(liquiditySweep: any): number { return 0; }
  private calculateLiquiditySweepTargets(liquiditySweep: any, structure: any, volatility: any): any { return { primary: 0 }; }
}