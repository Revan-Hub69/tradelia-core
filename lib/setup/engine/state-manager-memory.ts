// Setup State Manager - In-Memory Version for Development
// Temporary solution until database is properly set up

import { SetupCandidate } from '../types';

export class SetupStateManagerMemory {
  private activeSetups: SetupCandidate[] = [];
  
  constructor(private readonly config = { maxConcurrentSetups: 3, maxExposurePerSymbol: 200 }) {}
  
  // ============================================================================
  // ACTIVE SETUP MANAGEMENT
  // ============================================================================

  async addActiveSetup(setup: SetupCandidate): Promise<void> {
    // Remove any existing setup with same ID
    this.activeSetups = this.activeSetups.filter(s => s.setupId !== setup.setupId);
    
    // Add new setup
    this.activeSetups.push(setup);
    
    console.log(`📝 Added setup ${setup.setupId} to memory (${this.activeSetups.length} total)`);
  }

  async getActiveSetups(): Promise<SetupCandidate[]> {
    // Filter out expired setups
    const now = Date.now();
    this.activeSetups = this.activeSetups.filter(s => s.expiresAt > now);
    
    return [...this.activeSetups];
  }

  async removeActiveSetup(setupId: string): Promise<void> {
    const initialCount = this.activeSetups.length;
    this.activeSetups = this.activeSetups.filter(s => s.setupId !== setupId);
    
    if (this.activeSetups.length < initialCount) {
      console.log(`🗑️ Removed setup ${setupId} from memory`);
    }
  }

  async cleanupExpiredSetups(): Promise<number> {
    const now = Date.now();
    const initialCount = this.activeSetups.length;
    
    this.activeSetups = this.activeSetups.filter(s => s.expiresAt > now);
    
    const deletedCount = initialCount - this.activeSetups.length;
    
    if (deletedCount > 0) {
      console.log(`🧹 Cleaned up ${deletedCount} expired setups from memory`);
    }
    
    return deletedCount;
  }

  async getSetupsBySymbol(symbol: string): Promise<SetupCandidate[]> {
    const now = Date.now();
    return this.activeSetups.filter(s => s.symbol === symbol && s.expiresAt > now);
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
export const setupStateManagerMemory = new SetupStateManagerMemory();