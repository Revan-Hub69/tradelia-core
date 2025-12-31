// UCM Pipeline - Main execution pipeline for Universe Control Module
// Orchestrates data collection, universe generation, and state updates

import { UCMRepository } from "../db/repo";
import { generateUniverseWithStats, UniverseGenerationResult } from "../engine/universe";
import { collectEligibilitySnapshotsWithStats, CollectionResult } from "./collect";
import { UCM_CONFIG, validateUCMConfig, getConfigSummary } from "../config";
import { 
  UniversePoolType, 
  UniverseActiveType, 
  UniverseStateType,
  EligibilitySnapshotType,
  generatePoolHash,
  UCMError 
} from "../schemas";
import { withLock } from "../../utils/distributed-lock";

export interface UCMPipelineResult {
  success: boolean;
  universeActive: UniverseActiveType | null;
  errors: string[];
  warnings: string[];
  stats: {
    execution: {
      startTime: number;
      endTime: number;
      durationMs: number;
    };
    collection: CollectionResult['stats'];
    generation: UniverseGenerationResult['stats'];
    changes: {
      added: string[];
      removed: string[];
      blacklisted: string[];
      maintained: string[];
    };
    health: {
      poolHealth: boolean;
      dataHealth: boolean;
      universeHealth: boolean;
    };
  };
}

export async function runUCMPipeline(): Promise<UCMPipelineResult> {
  // Use distributed lock to prevent concurrent pipeline runs
  return await withLock(
    {
      name: 'ucm_pipeline',
      ttl: 5 * 60 * 1000, // 5 minutes
      retryDelay: 2000,
      maxRetries: 3
    },
    async () => {
      return await runUCMPipelineInternal();
    },
    {
      startedBy: process.pid.toString(),
      startedAt: Date.now(),
      version: 'v1.0.0'
    }
  );
}

async function runUCMPipelineInternal(): Promise<UCMPipelineResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];
  
  let universeActive: UniverseActiveType | null = null;
  let collectionStats: CollectionResult['stats'] = {
    requested: 0,
    collected: 0,
    failed: 0,
    avgCompleteness: 0,
    avgSpread: 0,
  };
  let generationStats: UniverseGenerationResult['stats'] = {
    totalSymbols: 0,
    eligibleSymbols: 0,
    activeSymbols: 0,
    coreSymbols: 0,
    addedSymbols: 0,
    removedSymbols: 0,
    blacklistedSymbols: 0,
    rankingStats: { avgScore: 0, topScore: 0, bottomScore: 0 },
  };
  let changes: {
    added: string[];
    removed: string[];
    blacklisted: string[];
    maintained: string[];
  } = { added: [], removed: [], blacklisted: [], maintained: [] };
  
  try {
    console.log('🚀 Starting UCM Pipeline...');
    
    // 1. Validate configuration
    const configValidation = validateUCMConfig();
    if (!configValidation.valid) {
      throw new UCMError(`Invalid UCM configuration: ${configValidation.errors.join(', ')}`, 'CONFIG_ERROR');
    }
    
    console.log('✅ Configuration validated');
    console.log('📊 Config:', JSON.stringify(getConfigSummary(), null, 2));
    
    // 2. Initialize repository
    const repo = new UCMRepository();
    
    // 3. Health check
    const healthCheck = await repo.healthCheck();
    if (!healthCheck.healthy) {
      throw new UCMError(`Database health check failed: ${healthCheck.message}`, 'DB_ERROR');
    }
    
    console.log(`✅ Database healthy (${healthCheck.latency}ms)`);
    
    // 4. Get or initialize universe pool
    let pool = await repo.getUniversePool();
    if (!pool) {
      console.log('🔧 Initializing default universe pool...');
      pool = await initializeDefaultPool(repo);
    }
    
    console.log(`📦 Universe pool: ${pool.symbols.length} symbols, ${pool.coreSymbols.length} core`);
    
    // 5. Collect eligibility snapshots
    console.log('📊 Collecting eligibility data...');
    const collectionResult = await collectEligibilitySnapshotsWithStats(pool.symbols);
    collectionStats = collectionResult.stats;
    
    if (collectionResult.errors.length > 0) {
      warnings.push(...collectionResult.errors);
    }
    
    console.log(`✅ Collected ${collectionResult.snapshots.length}/${pool.symbols.length} snapshots`);
    
    // 6. Get eligibility history for hysteresis (REAL HISTORY, not 1 snapshot)
    console.log('📊 Building eligibility history for hysteresis...');
    const eligibilityHistory = new Map<string, EligibilitySnapshotType[]>();
    
    // Get 30 minutes of history for each symbol (covers both enter/exit windows)
    const historyPromises = pool.symbols.map(async (symbol) => {
      const history = await repo.getEligibilityHistory(symbol, 30);
      eligibilityHistory.set(symbol, history);
      return { symbol, historyLength: history.length };
    });
    
    const historyResults = await Promise.all(historyPromises);
    const avgHistoryLength = historyResults.reduce((sum, r) => sum + r.historyLength, 0) / historyResults.length;
    console.log(`📈 History built: avg ${avgHistoryLength.toFixed(1)} snapshots per symbol`);
    
    // Add current snapshots to history
    collectionResult.snapshots.forEach(snapshot => {
      const existing = eligibilityHistory.get(snapshot.symbol) || [];
      // Avoid duplicates by checking timestamp
      const isDuplicate = existing.some(h => h.asOf === snapshot.asOf);
      if (!isDuplicate) {
        existing.push(snapshot);
        eligibilityHistory.set(snapshot.symbol, existing.sort((a, b) => a.asOf - b.asOf));
      }
    });
    
    // 8. Save eligibility snapshots
    if (collectionResult.snapshots.length > 0) {
      await repo.saveEligibilitySnapshots(collectionResult.snapshots);
      console.log('💾 Eligibility snapshots saved');
    }
    
    // 9. Get current universe states
    const currentStates = await repo.getUniverseStates();
    console.log(`📋 Current states: ${currentStates.length} symbols tracked`);
    
    // 9. Get previous active universe
    const prevActive = await repo.getLatestUniverseActive();
    if (prevActive) {
      console.log(`🔄 Previous universe: ${prevActive.symbols.length} symbols`);
    }
    
    // 10. Generate new universe active (with REAL history)
    console.log('🎯 Generating new universe...');
    const generationResult = await generateUniverseWithStats(
      pool,
      collectionResult.snapshots,
      currentStates,
      prevActive,
      eligibilityHistory // Pass real history instead of creating fake one
    );
    
    universeActive = generationResult.universeActive;
    generationStats = generationResult.stats;
    changes = generationResult.changes;
    
    if (generationResult.warnings.length > 0) {
      warnings.push(...generationResult.warnings);
    }
    
    console.log(`✅ Universe generated: ${universeActive.symbols.length} active symbols`);
    console.log(`📈 Changes: +${changes.added.length} -${changes.removed.length} ⚫${changes.blacklisted.length}`);
    
    // 11. Save new universe active
    await repo.saveUniverseActive(universeActive);
    console.log('💾 Universe active saved');
    
    // 12. Update universe states
    const stateUpdates: UniverseStateType[] = [];
    
    // Add new active symbols
    stateUpdates.push(...Array.from(generationResult.changes.added).map(symbol => ({
      symbol,
      status: 'ACTIVE' as const,
      enteredAt: universeActive!.asOf,
      exitedAt: undefined,
      cooldownUntil: undefined,
      blacklistUntil: undefined,
    })));
    
    // Add removed symbols with cooldown
    stateUpdates.push(...Array.from(generationResult.changes.removed).map(symbol => ({
      symbol,
      status: 'INACTIVE' as const,
      enteredAt: undefined,
      exitedAt: universeActive!.asOf,
      cooldownUntil: Date.now() + (UCM_CONFIG.COOLDOWN_MINUTES * 60 * 1000),
      blacklistUntil: undefined,
    })));
    
    // Add blacklisted symbols
    stateUpdates.push(...Array.from(generationResult.changes.blacklisted).map(symbol => ({
      symbol,
      status: 'BLACKLISTED' as const,
      enteredAt: undefined,
      exitedAt: universeActive!.asOf,
      cooldownUntil: undefined,
      blacklistUntil: Date.now() + (UCM_CONFIG.BLACKLIST_DAYS * 24 * 60 * 60 * 1000),
    })));
    
    if (stateUpdates.length > 0) {
      await repo.updateUniverseStates(stateUpdates);
      console.log(`💾 Updated ${stateUpdates.length} universe states`);
    }
    
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    
    console.log(`🎉 UCM Pipeline completed successfully in ${durationMs}ms`);
    
    return {
      success: true,
      universeActive,
      errors,
      warnings,
      stats: {
        execution: {
          startTime,
          endTime,
          durationMs,
        },
        collection: collectionStats,
        generation: generationStats,
        changes,
        health: {
          poolHealth: true,
          dataHealth: collectionStats.collected > collectionStats.requested * 0.8, // 80% success rate
          universeHealth: universeActive.symbols.length >= UCM_CONFIG.MIN_ACTIVE,
        },
      },
    };
    
  } catch (error) {
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`UCM pipeline failed: ${errorMessage}`);
    
    console.error('❌ UCM Pipeline failed:', errorMessage);
    
    return {
      success: false,
      universeActive,
      errors,
      warnings,
      stats: {
        execution: {
          startTime,
          endTime,
          durationMs,
        },
        collection: collectionStats,
        generation: generationStats,
        changes,
        health: {
          poolHealth: false,
          dataHealth: false,
          universeHealth: false,
        },
      },
    };
  }
}

async function initializeDefaultPool(repo: UCMRepository): Promise<UniversePoolType> {
  const pool: UniversePoolType = {
    v: "ucm.pool.v1",
    asOf: Date.now(),
    symbols: [...UCM_CONFIG.DEFAULT_POOL.symbols],
    coreSymbols: [...UCM_CONFIG.DEFAULT_POOL.coreSymbols],
    hash: generatePoolHash([...UCM_CONFIG.DEFAULT_POOL.symbols], [...UCM_CONFIG.DEFAULT_POOL.coreSymbols]),
  };
  
  await repo.updateUniversePool(pool);
  return pool;
}

// Utility functions for pipeline analysis
export function analyzePipelineResult(result: UCMPipelineResult): {
  performance: 'excellent' | 'good' | 'fair' | 'poor';
  issues: string[];
  recommendations: string[];
  kpis: {
    turnoverRate: number;
    dataQuality: number;
    executionTime: number;
    successRate: number;
  };
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Calculate KPIs
  const turnoverRate = result.stats.generation.activeSymbols > 0 
    ? (result.stats.generation.addedSymbols + result.stats.generation.removedSymbols) / result.stats.generation.activeSymbols
    : 0;
  
  const dataQuality = result.stats.collection.requested > 0
    ? result.stats.collection.collected / result.stats.collection.requested
    : 0;
  
  const executionTime = result.stats.execution.durationMs;
  const successRate = result.success ? 1 : 0;
  
  // Analyze performance
  let performance: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
  
  // Check turnover rate (target: <= 0.2 per run)
  if (turnoverRate > 0.5) {
    performance = 'poor';
    issues.push(`High turnover rate: ${(turnoverRate * 100).toFixed(1)}%`);
    recommendations.push('Review hysteresis parameters or data quality');
  } else if (turnoverRate > 0.3) {
    performance = 'fair';
    issues.push(`Elevated turnover rate: ${(turnoverRate * 100).toFixed(1)}%`);
  }
  
  // Check data quality (target: >= 0.9)
  if (dataQuality < 0.7) {
    performance = 'poor';
    issues.push(`Low data collection success: ${(dataQuality * 100).toFixed(1)}%`);
    recommendations.push('Check Binance API connectivity and MCE data availability');
  } else if (dataQuality < 0.9) {
    if (performance === 'excellent') performance = 'good';
    issues.push(`Moderate data collection issues: ${(dataQuality * 100).toFixed(1)}%`);
  }
  
  // Check execution time (target: < 30s)
  if (executionTime > 60000) {
    performance = 'poor';
    issues.push(`Slow execution: ${(executionTime / 1000).toFixed(1)}s`);
    recommendations.push('Optimize data collection or database queries');
  } else if (executionTime > 30000) {
    if (performance === 'excellent') performance = 'good';
    issues.push(`Elevated execution time: ${(executionTime / 1000).toFixed(1)}s`);
  }
  
  // Check universe health
  if (!result.stats.health.universeHealth) {
    performance = 'poor';
    issues.push('Universe below minimum active symbols');
    recommendations.push('Review eligibility criteria or expand universe pool');
  }
  
  // Check errors and warnings
  if (result.errors.length > 0) {
    performance = 'poor';
    issues.push(`${result.errors.length} errors occurred`);
  }
  
  if (result.warnings.length > 5) {
    if (performance === 'excellent') performance = 'good';
    issues.push(`${result.warnings.length} warnings generated`);
  }
  
  return {
    performance,
    issues,
    recommendations,
    kpis: {
      turnoverRate: Math.round(turnoverRate * 1000) / 1000,
      dataQuality: Math.round(dataQuality * 1000) / 1000,
      executionTime: executionTime,
      successRate: successRate,
    },
  };
}

export function formatPipelineReport(result: UCMPipelineResult): string {
  const analysis = analyzePipelineResult(result);
  const duration = (result.stats.execution.durationMs / 1000).toFixed(1);
  
  const report = [
    '🎯 UCM Pipeline Report',
    '=' .repeat(50),
    '',
    `Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`,
    `Performance: ${analysis.performance.toUpperCase()}`,
    `Duration: ${duration}s`,
    '',
    '📊 Statistics:',
    `- Active Symbols: ${result.stats.generation.activeSymbols}`,
    `- Added: ${result.stats.changes.added.length}`,
    `- Removed: ${result.stats.changes.removed.length}`,
    `- Blacklisted: ${result.stats.changes.blacklisted.length}`,
    `- Data Quality: ${(analysis.kpis.dataQuality * 100).toFixed(1)}%`,
    `- Turnover Rate: ${(analysis.kpis.turnoverRate * 100).toFixed(1)}%`,
    '',
  ];
  
  if (result.stats.changes.added.length > 0) {
    report.push(`➕ Added: ${result.stats.changes.added.join(', ')}`);
  }
  
  if (result.stats.changes.removed.length > 0) {
    report.push(`➖ Removed: ${result.stats.changes.removed.join(', ')}`);
  }
  
  if (result.stats.changes.blacklisted.length > 0) {
    report.push(`⚫ Blacklisted: ${result.stats.changes.blacklisted.join(', ')}`);
  }
  
  if (analysis.issues.length > 0) {
    report.push('', '⚠️  Issues:');
    analysis.issues.forEach(issue => report.push(`- ${issue}`));
  }
  
  if (analysis.recommendations.length > 0) {
    report.push('', '💡 Recommendations:');
    analysis.recommendations.forEach(rec => report.push(`- ${rec}`));
  }
  
  if (result.errors.length > 0) {
    report.push('', '❌ Errors:');
    result.errors.forEach(error => report.push(`- ${error}`));
  }
  
  if (result.warnings.length > 0 && result.warnings.length <= 5) {
    report.push('', '⚠️  Warnings:');
    result.warnings.forEach(warning => report.push(`- ${warning}`));
  } else if (result.warnings.length > 5) {
    report.push('', `⚠️  ${result.warnings.length} warnings (showing first 3):`);
    result.warnings.slice(0, 3).forEach(warning => report.push(`- ${warning}`));
  }
  
  return report.join('\n');
}