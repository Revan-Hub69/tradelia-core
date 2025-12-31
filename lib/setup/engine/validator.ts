// Setup Validator - Professional Trading System
// Best practice: comprehensive validation, risk checks, conflict detection

import { SetupCandidate, MarketState, SetupEngineConfig } from '../types';
import { setupLogger } from '../logger';

export interface ValidationResult {
  valid: boolean;
  rejectionReasons: string[];
  warnings: string[];
  adjustedSetup?: SetupCandidate;
}

export class SetupValidator {
  constructor(private readonly config: SetupEngineConfig) {}

  // ============================================================================
  // MAIN VALIDATION ENGINE
  // ============================================================================

  async validateSetup(
    setup: SetupCandidate,
    marketState: MarketState,
    existingSetups: SetupCandidate[] = []
  ): Promise<ValidationResult> {
    const rejectionReasons: string[] = [];
    const warnings: string[] = [];
    let adjustedSetup: SetupCandidate | undefined;

    try {
      // 1. BASIC SETUP VALIDATION
      const basicValidation = this.validateBasicSetup(setup);
      if (!basicValidation.valid) {
        rejectionReasons.push(...basicValidation.reasons);
      }

      // 2. RISK VALIDATION
      const riskValidation = this.validateRisk(setup);
      if (!riskValidation.valid) {
        rejectionReasons.push(...riskValidation.reasons);
      }
      warnings.push(...riskValidation.warnings);

      // 3. MARKET CONDITIONS VALIDATION
      const marketValidation = this.validateMarketConditions(setup, marketState);
      if (!marketValidation.valid) {
        rejectionReasons.push(...marketValidation.reasons);
      }

      // 4. CONFLICT DETECTION
      const conflictValidation = this.validateConflicts(setup, existingSetups);
      if (!conflictValidation.valid) {
        rejectionReasons.push(...conflictValidation.reasons);
      }

      // 5. LIQUIDITY VALIDATION
      const liquidityValidation = await this.validateLiquidity(setup, marketState);
      if (!liquidityValidation.valid) {
        rejectionReasons.push(...liquidityValidation.reasons);
      }

      // 6. TIMING VALIDATION
      const timingValidation = this.validateTiming(setup, marketState);
      if (!timingValidation.valid) {
        rejectionReasons.push(...timingValidation.reasons);
      }

      const isValid = rejectionReasons.length === 0;

      // Log validation result
      if (isValid) {
        await setupLogger.logSetupValidated(
          setup,
          {
            validationChecks: [
              'basic_setup_ok',
              'risk_checks_ok',
              'market_conditions_ok',
              'no_conflicts',
              'liquidity_ok',
              'timing_ok'
            ],
            warnings,
          },
          marketState
        );
      } else {
        await setupLogger.logSetupRejected(
          setup.setupId,
          setup.symbol,
          rejectionReasons,
          marketState
        );
      }

      return {
        valid: isValid,
        rejectionReasons,
        warnings,
        adjustedSetup,
      };

    } catch (error) {
      console.error('Setup validation error:', error);
      rejectionReasons.push('validation_system_error');
      
      await setupLogger.logSetupRejected(
        setup.setupId,
        setup.symbol,
        ['validation_system_error'],
        marketState
      );

      return {
        valid: false,
        rejectionReasons,
        warnings,
      };
    }
  }

  // ============================================================================
  // VALIDATION CHECKS
  // ============================================================================

  private validateBasicSetup(setup: SetupCandidate): {
    valid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    // Check required fields
    if (!setup.setupId) reasons.push('missing_setup_id');
    if (!setup.symbol) reasons.push('missing_symbol');
    if (!setup.setupType) reasons.push('missing_setup_type');
    if (!setup.direction) reasons.push('missing_direction');

    // Check entry model
    if (!setup.entryModel) {
      reasons.push('missing_entry_model');
    } else {
      if (!setup.entryModel.price || setup.entryModel.price <= 0) {
        reasons.push('invalid_entry_price');
      }
      if (!setup.entryModel.ttlSec || setup.entryModel.ttlSec <= 0) {
        reasons.push('invalid_entry_ttl');
      }
    }

    // Check stop model
    if (!setup.stopModel) {
      reasons.push('missing_stop_model');
    } else {
      if (!setup.stopModel.level || setup.stopModel.level <= 0) {
        reasons.push('invalid_stop_level');
      }
    }

    // Check targets
    if (!setup.targets || !setup.targets.primary || setup.targets.primary <= 0) {
      reasons.push('invalid_targets');
    }

    // Check confidence score
    if (setup.confidenceScore < 0 || setup.confidenceScore > 1) {
      reasons.push('invalid_confidence_score');
    }

    // Check evidence
    if (!setup.evidence || setup.evidence.length === 0) {
      reasons.push('missing_evidence');
    }

    return {
      valid: reasons.length === 0,
      reasons,
    };
  }

  private validateRisk(setup: SetupCandidate): {
    valid: boolean;
    reasons: string[];
    warnings: string[];
  } {
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Check minimum confidence score
    if (setup.confidenceScore < this.config.minConfidenceScore) {
      reasons.push(`confidence_too_low: ${setup.confidenceScore} < ${this.config.minConfidenceScore}`);
    }

    // Check minimum risk-reward ratio
    if (setup.riskReward < this.config.minRiskReward) {
      reasons.push(`risk_reward_too_low: ${setup.riskReward} < ${this.config.minRiskReward}`);
    }

    // Check maximum risk per trade
    if (setup.maxRisk > this.config.maxRiskPerTrade) {
      reasons.push(`risk_too_high: $${setup.maxRisk} > $${this.config.maxRiskPerTrade}`);
    }

    // Check stop distance (not too tight)
    const stopDistance = Math.abs(setup.entryModel.price - setup.stopModel.level) / setup.entryModel.price;
    const minStopDistance = 0.005; // 0.5% minimum
    const maxStopDistance = 0.05;  // 5% maximum

    if (stopDistance < minStopDistance) {
      reasons.push(`stop_too_tight: ${(stopDistance * 100).toFixed(2)}% < ${(minStopDistance * 100).toFixed(1)}%`);
    }

    if (stopDistance > maxStopDistance) {
      warnings.push(`stop_very_wide: ${(stopDistance * 100).toFixed(2)}% > ${(maxStopDistance * 100).toFixed(1)}%`);
    }

    // Check target distance (realistic)
    const targetDistance = Math.abs(setup.targets.primary - setup.entryModel.price) / setup.entryModel.price;
    const minTargetDistance = 0.01; // 1% minimum

    if (targetDistance < minTargetDistance) {
      warnings.push(`target_very_close: ${(targetDistance * 100).toFixed(2)}% < ${(minTargetDistance * 100).toFixed(1)}%`);
    }

    // Validate entry vs stop vs target logic
    const entryPrice = setup.entryModel.price;
    const stopLevel = setup.stopModel.level;
    const targetLevel = setup.targets.primary;

    if (setup.direction === 'LONG') {
      if (stopLevel >= entryPrice) {
        reasons.push('invalid_long_stop: stop must be below entry');
      }
      if (targetLevel <= entryPrice) {
        reasons.push('invalid_long_target: target must be above entry');
      }
    } else {
      if (stopLevel <= entryPrice) {
        reasons.push('invalid_short_stop: stop must be above entry');
      }
      if (targetLevel >= entryPrice) {
        reasons.push('invalid_short_target: target must be below entry');
      }
    }

    return {
      valid: reasons.length === 0,
      reasons,
      warnings,
    };
  }

  private validateMarketConditions(setup: SetupCandidate, marketState: MarketState): {
    valid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    // Check if symbol is in MSF universe and has good fit
    const symbolFit = marketState.universeFit.marketFits.find(f => f.symbol === setup.symbol);
    if (!symbolFit) {
      reasons.push('symbol_not_in_msf_universe');
    } else {
      if (symbolFit.fitClass === 'NO_TRADE') {
        reasons.push('symbol_msf_no_trade');
      }
      if (symbolFit.dataQuality < 0.9) {
        reasons.push(`symbol_poor_data_quality: ${symbolFit.dataQuality}`);
      }
      if (symbolFit.frictionScore > 0.5) {
        reasons.push(`symbol_high_friction: ${symbolFit.frictionScore}`);
      }
    }

    // Check regime compatibility with setup type
    const regimeCompatible = this.checkRegimeSetupCompatibility(
      marketState.regime,
      setup.setupType
    );
    if (!regimeCompatible) {
      reasons.push(`regime_incompatible_with_${setup.setupType.toLowerCase()}`);
    }

    // Check session compatibility
    const sessionCompatible = this.checkSessionCompatibility(
      marketState.session,
      setup.setupType
    );
    if (!sessionCompatible) {
      reasons.push(`session_incompatible_with_${setup.setupType.toLowerCase()}`);
    }

    return {
      valid: reasons.length === 0,
      reasons,
    };
  }

  private validateConflicts(setup: SetupCandidate, existingSetups: SetupCandidate[]): {
    valid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    // Check maximum concurrent setups
    if (existingSetups.length >= this.config.maxConcurrentSetups) {
      reasons.push(`max_concurrent_setups_exceeded: ${existingSetups.length} >= ${this.config.maxConcurrentSetups}`);
    }

    // Check maximum exposure per symbol
    const symbolSetups = existingSetups.filter(s => s.symbol === setup.symbol);
    const symbolExposure = symbolSetups.reduce((sum, s) => sum + s.maxRisk, 0);
    
    if (symbolExposure + setup.maxRisk > this.config.maxExposurePerSymbol) {
      reasons.push(`max_symbol_exposure_exceeded: $${symbolExposure + setup.maxRisk} > $${this.config.maxExposurePerSymbol}`);
    }

    // Check for conflicting directions on same symbol
    const conflictingSetups = symbolSetups.filter(s => s.direction !== setup.direction);
    if (conflictingSetups.length > 0) {
      reasons.push(`conflicting_direction_on_${setup.symbol}: existing ${conflictingSetups[0].direction} vs new ${setup.direction}`);
    }

    // Check for overlapping price levels
    const overlappingSetups = symbolSetups.filter(s => {
      const priceOverlap = Math.abs(s.entryModel.price - setup.entryModel.price) / setup.entryModel.price;
      return priceOverlap < 0.01; // 1% overlap threshold
    });
    
    if (overlappingSetups.length > 0) {
      reasons.push(`overlapping_entry_levels_on_${setup.symbol}`);
    }

    return {
      valid: reasons.length === 0,
      reasons,
    };
  }

  private async validateLiquidity(setup: SetupCandidate, marketState: MarketState): Promise<{
    valid: boolean;
    reasons: string[];
  }> {
    const reasons: string[] = [];

    // Check if we have orderflow data for liquidity assessment
    const orderflow = marketState.orderflow[setup.symbol];
    if (!orderflow) {
      reasons.push('no_orderflow_data_for_liquidity_check');
      return { valid: false, reasons };
    }

    // Check stress level (high stress = poor liquidity)
    if (orderflow.stress === 'HIGH') {
      reasons.push('high_market_stress_poor_liquidity');
    }

    // Setup-type specific liquidity checks
    if (setup.setupType === 'LIQUIDITY_SWEEP_REVERSAL') {
      // For liquidity sweep setups, absorption is REQUIRED
      if (!orderflow.absorption) {
        reasons.push('liquidity_sweep_requires_absorption');
      }
    } else {
      // For other setups, absorption indicates potential liquidity issues
      if (orderflow.absorption) {
        reasons.push('absorption_detected_liquidity_concern');
      }
    }

    return {
      valid: reasons.length === 0,
      reasons,
    };
  }

  private validateTiming(setup: SetupCandidate, marketState: MarketState): {
    valid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    // Check if setup is not expired
    if (setup.expiresAt <= marketState.asOf) {
      reasons.push('setup_already_expired');
    }

    // Check if TTL is reasonable
    const ttlMs = setup.entryModel.ttlSec * 1000;
    const minTTL = 60 * 1000;  // 1 minute minimum
    const maxTTL = 60 * 60 * 1000; // 1 hour maximum

    if (ttlMs < minTTL) {
      reasons.push(`ttl_too_short: ${setup.entryModel.ttlSec}s < ${minTTL / 1000}s`);
    }

    if (ttlMs > maxTTL) {
      reasons.push(`ttl_too_long: ${setup.entryModel.ttlSec}s > ${maxTTL / 1000}s`);
    }

    // Check session timing (avoid session closes)
    if (marketState.session.closingSoon) {
      reasons.push('session_closing_soon');
    }

    return {
      valid: reasons.length === 0,
      reasons,
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private checkRegimeSetupCompatibility(regime: any, setupType: string): boolean {
    const classification = regime.classification;
    const strength = regime.strength || 0;

    switch (setupType) {
      case 'BREAKOUT_ACCEPTANCE':
        // Breakouts work best in trend and expansion
        return (classification === 'TREND' && strength >= 0.6) ||
               (classification === 'EXPANSION' && strength >= 0.7);
      
      case 'PULLBACK_STRUCTURAL':
        // Pullbacks need clear trend
        return classification === 'TREND' && strength >= 0.7;
      
      case 'LIQUIDITY_SWEEP_REVERSAL':
        // Liquidity sweeps work in range and late trend
        return (classification === 'RANGE' && strength >= 0.6) ||
               (classification === 'TREND' && strength >= 0.8); // Late trend
      
      default:
        return false;
    }
  }

  private checkSessionCompatibility(session: any, setupType: string): boolean {
    // Avoid Asian session for most setups (low liquidity)
    if (session.current === 'ASIA') return false;
    
    // All setup types prefer EU/US sessions
    return ['EU', 'US', 'OVERLAP_EU_US'].includes(session.current);
  }
}