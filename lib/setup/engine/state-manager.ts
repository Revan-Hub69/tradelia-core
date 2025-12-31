// Setup State Manager - Database-backed active setup tracking
// Best practice: serverless-compatible, persistent state, atomic operations

import { supabaseAdmin } from '../../mce/db/supabase';
import { SetupCandidate } from '../types';

export class SetupStateManager {
  constructor(private readonly config = { maxConcurrentSetups: 3, maxExposurePerSymbol: 200 }) {}
  
  // ============================================================================
  // ACTIVE SETUP MANAGEMENT
  // ============================================================================

  async addActiveSetup(setup: SetupCandidate): Promise<void> {
    const sb = supabaseAdmin();
    
    const { error } = await sb
      .from('active_setups')
      .insert({
        setup_id: setup.setupId,
        symbol: setup.symbol,
        setup_type: setup.setupType,
        direction: setup.direction,
        entry_price: setup.entryModel.price,
        stop_level: setup.stopModel.level,
        target_primary: setup.targets.primary,
        target_secondary: setup.targets.secondary,
        confidence_score: setup.confidenceScore,
        risk_reward: setup.riskReward,
        max_risk: setup.maxRisk,
        expires_at: new Date(setup.expiresAt).toISOString(),
        setup_data: setup,
        created_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error(`Failed to add active setup: ${error.message}`);
    }
  }

  async getActiveSetups(): Promise<SetupCandidate[]> {
    const sb = supabaseAdmin();
    
    const { data, error } = await sb
      .from('active_setups')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get active setups: ${error.message}`);
    }

    return (data || []).map(row => row.setup_data as SetupCandidate);
  }

  async removeActiveSetup(setupId: string): Promise<void> {
    const sb = supabaseAdmin();
    
    const { error } = await sb
      .from('active_setups')
      .delete()
      .eq('setup_id', setupId);

    if (error) {
      throw new Error(`Failed to remove active setup: ${error.message}`);
    }
  }

  async cleanupExpiredSetups(): Promise<number> {
    const sb = supabaseAdmin();
    
    const { data, error } = await sb
      .from('active_setups')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('setup_id');

    if (error) {
      throw new Error(`Failed to cleanup expired setups: ${error.message}`);
    }

    return data?.length || 0;
  }

  async getSetupsBySymbol(symbol: string): Promise<SetupCandidate[]> {
    const sb = supabaseAdmin();
    
    const { data, error } = await sb
      .from('active_setups')
      .select('*')
      .eq('symbol', symbol)
      .gt('expires_at', new Date().toISOString());

    if (error) {
      throw new Error(`Failed to get setups for symbol ${symbol}: ${error.message}`);
    }

    return (data || []).map(row => row.setup_data as SetupCandidate);
  }

  async getEngineStats(): Promise<{
    activeSetups: number;
    maxConcurrentSetups: number;
    totalRisk: number;
    setupsByType: Record<string, number>;
    setupsBySymbol: Record<string, number>;
    avgConfidenceScore: number;
    avgRiskReward: number;
  }> {
    const activeSetups = await this.getActiveSetups();
    
    const setupsByType: Record<string, number> = {};
    const setupsBySymbol: Record<string, number> = {};
    let totalRisk = 0;
    let totalConfidence = 0;
    let totalRiskReward = 0;

    for (const setup of activeSetups) {
      setupsByType[setup.setupType] = (setupsByType[setup.setupType] || 0) + 1;
      setupsBySymbol[setup.symbol] = (setupsBySymbol[setup.symbol] || 0) + 1;
      totalRisk += setup.maxRisk;
      totalConfidence += setup.confidenceScore;
      totalRiskReward += setup.riskReward;
    }

    return {
      activeSetups: activeSetups.length,
      maxConcurrentSetups: this.config.maxConcurrentSetups,
      totalRisk,
      setupsByType,
      setupsBySymbol,
      avgConfidenceScore: activeSetups.length > 0 ? totalConfidence / activeSetups.length : 0,
      avgRiskReward: activeSetups.length > 0 ? totalRiskReward / activeSetups.length : 0,
    };
  }

  // ============================================================================
  // CONFLICT DETECTION
  // ============================================================================

  async checkConflicts(newSetup: SetupCandidate): Promise<{
    hasConflicts: boolean;
    conflicts: string[];
  }> {
    const existingSetups = await this.getSetupsBySymbol(newSetup.symbol);
    const conflicts: string[] = [];

    // Check for opposing directions
    const opposingSetups = existingSetups.filter(s => s.direction !== newSetup.direction);
    if (opposingSetups.length > 0) {
      conflicts.push(`opposing_direction_${newSetup.symbol}`);
    }

    // Check for overlapping price levels
    const overlappingSetups = existingSetups.filter(s => {
      const priceOverlap = Math.abs(s.entryModel.price - newSetup.entryModel.price) / newSetup.entryModel.price;
      return priceOverlap < 0.01; // 1% overlap threshold
    });
    
    if (overlappingSetups.length > 0) {
      conflicts.push(`overlapping_entry_levels_${newSetup.symbol}`);
    }

    // Check total risk exposure
    const symbolRisk = existingSetups.reduce((sum, s) => sum + s.maxRisk, 0);
    if (symbolRisk + newSetup.maxRisk > this.config.maxExposurePerSymbol) {
      conflicts.push(`max_symbol_exposure_exceeded_${newSetup.symbol}`);
    }

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
    };
  }
}

// Singleton instance
export const setupStateManager = new SetupStateManager();