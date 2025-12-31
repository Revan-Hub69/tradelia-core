// MSF Pipeline - Single Execution
// Best practice: fail-closed, minimal inputs, deterministic outputs

import { MSFResult, MSFConfig, MSF_V15_CONFIG, SymbolSnapshot, MSFError } from "../types";
import { generateDayGate, analyzeDayGatePerformance } from "../engine/dayGate";
import { classifyMarketFit, analyzeFitClassDistribution } from "../engine/fitClass";
import { RegimeSignature } from "../../mce/types";
import { UniverseActiveType } from "../../ucm/schemas";
import { supabaseAdmin } from "../../mce/db/supabase";

export interface MSFPipelineInput {
  regime: RegimeSignature;
  universe: UniverseActiveType;
  config?: MSFConfig;
}

export async function runMSFPipeline(input: MSFPipelineInput): Promise<MSFResult> {
  const startTime = Date.now();
  const config = input.config || MSF_V15_CONFIG;
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    console.log('🎯 Starting MSF Pipeline...');
    
    // 1. Validate inputs
    if (!input.regime || !input.universe) {
      throw new MSFError('Missing required inputs: regime and universe', 'INVALID_INPUT');
    }
    
    if (input.universe.symbols.length === 0) {
      throw new MSFError('Empty universe - cannot generate MSF', 'EMPTY_UNIVERSE');
    }
    
    console.log(`📊 Processing ${input.universe.symbols.length} symbols`);
    
    // 2. Collect symbol snapshots
    console.log('📸 Collecting symbol snapshots...');
    const snapshots = await collectSymbolSnapshots(input.universe.symbols);
    
    if (snapshots.length === 0) {
      throw new MSFError('No symbol snapshots collected', 'NO_SNAPSHOTS');
    }
    
    console.log(`✅ Collected ${snapshots.length} snapshots`);
    
    // 3. Classify market fit for each symbol
    console.log('🔍 Classifying market fits...');
    const marketFits = snapshots.map(snapshot => {
      try {
        return classifyMarketFit({
          symbol: snapshot.symbol,
          snapshot,
          regime: input.regime,
          config,
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${snapshot.symbol}: ${errorMsg}`);
        
        // Return NO_TRADE fit for failed classifications
        return {
          v: "msf.marketfit.v1" as const,
          symbol: snapshot.symbol,
          asOf: Date.now(),
          fitClass: "NO_TRADE" as const,
          allowedPlaybooks: ["none" as const],
          frictionScore: 1.0,
          dataQuality: 0,
          reasons: ["classification failed"],
          hash: "error",
        };
      }
    });
    
    console.log(`✅ Classified ${marketFits.length} symbols`);
    
    // 4. Generate day gate
    console.log('🚪 Generating day gate...');
    const dayGate = generateDayGate({
      regime: input.regime,
      universe: input.universe,
      marketFits,
      config,
    });
    
    console.log(`${dayGate.tradableDay ? '✅' : '❌'} Day gate: ${dayGate.tradableDay ? 'TRADABLE' : 'NO_TRADE'}`);
    
    // 5. Calculate KPIs
    const fitAnalysis = analyzeFitClassDistribution(marketFits);
    const kpis = {
      noTradeDays: dayGate.tradableDay ? 0 : 1, // single run, would be accumulated
      aSymbolsPct: fitAnalysis.distributionPct.A,
      bSymbolsPct: fitAnalysis.distributionPct.B,
      flipRate: 0, // would be calculated from history
      avgFriction: (fitAnalysis.avgFriction.A + fitAnalysis.avgFriction.B + fitAnalysis.avgFriction.C) / 3,
    };
    
    // 6. Save results to database
    await saveMSFResults(dayGate, marketFits);
    
    const duration = Date.now() - startTime;
    
    console.log(`🎉 MSF Pipeline completed in ${duration}ms`);
    console.log(`📊 Results: A=${dayGate.countA}, B=${dayGate.countB}, Tradable=${dayGate.tradableDay}`);
    
    return {
      success: true,
      timestamp: startTime,
      duration,
      dayGate,
      marketFits,
      kpis,
      errors,
      warnings,
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`MSF pipeline failed: ${errorMessage}`);
    
    console.error('❌ MSF Pipeline failed:', errorMessage);
    
    // Return fail-closed result
    return {
      success: false,
      timestamp: startTime,
      duration,
      dayGate: {
        v: "msf.daygate.v1",
        asOf: startTime,
        tradableDay: false, // fail-closed
        countA: 0,
        countB: 0,
        reasons: ["pipeline failed"],
        hash: "error",
      },
      marketFits: [],
      kpis: {
        noTradeDays: 1,
        aSymbolsPct: 0,
        bSymbolsPct: 0,
        flipRate: 0,
        avgFriction: 1,
      },
      errors,
      warnings,
    };
  }
}

// Collect simple snapshots for symbols
async function collectSymbolSnapshots(symbols: string[]): Promise<SymbolSnapshot[]> {
  const snapshots: SymbolSnapshot[] = [];
  
  // For now, create mock snapshots - in production this would fetch real data
  for (const symbol of symbols) {
    try {
      // Mock data - replace with real Binance API calls
      const snapshot: SymbolSnapshot = {
        symbol,
        spread: Math.random() * 0.001, // 0-0.1% spread
        atr: Math.random() * 50 + 10, // 10-60 ATR
        gaps: Math.floor(Math.random() * 3), // 0-2 gaps
        completeness: 0.95 + Math.random() * 0.05, // 95-100% completeness
        volume24h: Math.random() * 10000000 + 1000000, // 1M-11M volume
        lastUpdate: Date.now() - Math.random() * 300000, // last 5 minutes
      };
      
      snapshots.push(snapshot);
      
    } catch (error) {
      console.warn(`Failed to collect snapshot for ${symbol}:`, error);
      // Continue with other symbols (fail-open for data collection)
    }
  }
  
  return snapshots;
}

// Save MSF results to database
async function saveMSFResults(dayGate: any, marketFits: any[]): Promise<void> {
  try {
    const sb = supabaseAdmin();
    
    // Save day gate
    const { error: dayGateError } = await sb
      .from('msf_day_gates')
      .upsert({
        as_of: dayGate.asOf,
        tradable_day: dayGate.tradableDay,
        count_a: dayGate.countA,
        count_b: dayGate.countB,
        reasons: dayGate.reasons,
        day_gate: dayGate,
        hash: dayGate.hash,
      }, {
        onConflict: 'as_of',
      });
    
    if (dayGateError) {
      console.warn('Failed to save day gate:', dayGateError);
    }
    
    // Save market fits
    const marketFitRows = marketFits.map(fit => ({
      symbol: fit.symbol,
      as_of: fit.asOf,
      fit_class: fit.fitClass,
      allowed_playbooks: fit.allowedPlaybooks,
      friction_score: fit.frictionScore,
      data_quality: fit.dataQuality,
      reasons: fit.reasons,
      market_fit: fit,
      hash: fit.hash,
    }));
    
    const { error: marketFitsError } = await sb
      .from('msf_market_fits')
      .upsert(marketFitRows, {
        onConflict: 'symbol,as_of',
      });
    
    if (marketFitsError) {
      console.warn('Failed to save market fits:', marketFitsError);
    }
    
  } catch (error) {
    console.warn('Failed to save MSF results:', error);
    // Don't throw - saving is not critical for pipeline success
  }
}

// Get historical MSF data for analysis
export async function getMSFHistory(days: number = 7): Promise<{
  dayGates: any[];
  marketFits: any[];
}> {
  try {
    const sb = supabaseAdmin();
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const [dayGatesResult, marketFitsResult] = await Promise.all([
      sb.from('msf_day_gates')
        .select('*')
        .gte('as_of', cutoff)
        .order('as_of', { ascending: false }),
      
      sb.from('msf_market_fits')
        .select('*')
        .gte('as_of', cutoff)
        .order('as_of', { ascending: false }),
    ]);
    
    return {
      dayGates: dayGatesResult.data || [],
      marketFits: marketFitsResult.data || [],
    };
    
  } catch (error) {
    console.warn('Failed to get MSF history:', error);
    return { dayGates: [], marketFits: [] };
  }
}

// Analyze MSF performance over time
export async function analyzeMSFPerformance(days: number = 7): Promise<{
  dayGateAnalysis: ReturnType<typeof analyzeDayGatePerformance>;
  fitClassAnalysis: ReturnType<typeof analyzeFitClassDistribution>;
  trends: {
    tradableDaysTrend: number; // positive = more tradable days
    aSymbolsTrend: number; // positive = more A symbols
    frictionTrend: number; // positive = more friction
  };
}> {
  const history = await getMSFHistory(days);
  
  // Convert database rows back to typed objects
  const dayGates = history.dayGates.map(row => row.day_gate);
  const marketFits = history.marketFits.map(row => row.market_fit);
  
  const dayGateAnalysis = analyzeDayGatePerformance(dayGates);
  const fitClassAnalysis = analyzeFitClassDistribution(marketFits);
  
  // Calculate trends (simplified - would use proper time series analysis)
  const trends = {
    tradableDaysTrend: 0, // placeholder
    aSymbolsTrend: 0, // placeholder
    frictionTrend: 0, // placeholder
  };
  
  return {
    dayGateAnalysis,
    fitClassAnalysis,
    trends,
  };
}