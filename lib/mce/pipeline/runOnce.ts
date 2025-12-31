// MCE Pipeline - Single Execution
// Complete pipeline from data fetch to regime signature generation

import { binanceClient } from "../binance/client";
import { normalizeBinanceKlines } from "../binance/normalize";
import { upsertKlines, getLatestKlines } from "../db/repo.marketData";
import { calculateFeaturesRobust } from "../features";
import { classifyRegime, applyAntiFlipSmoothing, type AntiFlipState } from "../engine/classify";
import { assessDataQuality } from "../engine/quality";
import { generateRegimeSignature, createRegimeChange } from "../engine/signature";
import { type Symbol, type TF, type RegimeSignature, MCEError } from "../types";
import { supabaseAdmin } from "../db/supabase";

export interface PipelineConfig {
  symbols: Symbol[];
  timeframes: TF[];
  dataLookback: {
    hours: number;           // Hours of data to fetch for calculations
    minKlines: number;       // Minimum klines required
  };
  processing: {
    enableAntiFlip: boolean; // Enable anti-flip smoothing
    maxRetries: number;      // Max retries for failed operations
    timeoutMs: number;       // Timeout for individual operations
  };
  output: {
    saveToDatabase: boolean; // Save regime signatures to database
    logResults: boolean;     // Log results to console
  };
}

export const DEFAULT_PIPELINE_CONFIG: PipelineConfig = {
  symbols: ["BTCUSDT"],
  timeframes: ["1m", "5m", "15m", "1h", "4h"],
  dataLookback: {
    hours: 48,               // 48 hours of data for robust calculations
    minKlines: 100,          // Minimum 100 klines
  },
  processing: {
    enableAntiFlip: true,
    maxRetries: 3,
    timeoutMs: 30000,        // 30 second timeout
  },
  output: {
    saveToDatabase: true,
    logResults: true,
  },
};

export interface PipelineResult {
  success: boolean;
  timestamp: number;
  duration: number;
  results: Array<{
    symbol: Symbol;
    tf: TF;
    success: boolean;
    signature?: RegimeSignature;
    error?: string;
    metrics: {
      klinesProcessed: number;
      dataQualityScore: number;
      calculationTime: number;
    };
  }>;
  summary: {
    totalProcessed: number;
    successCount: number;
    errorCount: number;
    avgDataQuality: number;
    avgCalculationTime: number;
  };
  errors: string[];
}

// Anti-flip state storage (in-memory for now)
const antiFlipStates = new Map<string, AntiFlipState>();

// Main pipeline execution function
export async function runMCEPipeline(
  config: PipelineConfig = DEFAULT_PIPELINE_CONFIG
): Promise<PipelineResult> {
  const startTime = Date.now();
  const results: PipelineResult["results"] = [];
  const errors: string[] = [];

  if (config.output.logResults) {
    console.log(`🚀 MCE Pipeline starting at ${new Date().toISOString()}`);
    console.log(`   Symbols: ${config.symbols.join(", ")}`);
    console.log(`   Timeframes: ${config.timeframes.join(", ")}`);
  }

  // Process each symbol/timeframe combination
  for (const symbol of config.symbols) {
    for (const tf of config.timeframes) {
      try {
        const result = await processSinglePair(symbol, tf, config);
        results.push(result);
        
        if (config.output.logResults) {
          const status = result.success ? "✅" : "❌";
          const regime = result.signature ? `${result.signature.trend}/${result.signature.volatility}` : "N/A";
          const confidence = result.signature ? `${(result.signature.confidence * 100).toFixed(1)}%` : "N/A";
          console.log(`   ${status} ${symbol} ${tf}: ${regime} (${confidence})`);
        }
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        errors.push(`${symbol} ${tf}: ${errorMsg}`);
        
        results.push({
          symbol,
          tf,
          success: false,
          error: errorMsg,
          metrics: {
            klinesProcessed: 0,
            dataQualityScore: 0,
            calculationTime: 0,
          },
        });
      }
    }
  }

  // Calculate summary statistics
  const summary = calculateSummary(results);
  const duration = Date.now() - startTime;

  if (config.output.logResults) {
    console.log(`🏁 MCE Pipeline completed in ${duration}ms`);
    console.log(`   Success: ${summary.successCount}/${summary.totalProcessed}`);
    console.log(`   Avg Quality: ${(summary.avgDataQuality * 100).toFixed(1)}%`);
    if (errors.length > 0) {
      console.log(`   Errors: ${errors.length}`);
      errors.forEach(error => console.log(`     - ${error}`));
    }
  }

  return {
    success: summary.errorCount === 0,
    timestamp: startTime,
    duration,
    results,
    summary,
    errors,
  };
}

// Process a single symbol/timeframe pair
async function processSinglePair(
  symbol: Symbol,
  tf: TF,
  config: PipelineConfig
): Promise<PipelineResult["results"][0]> {
  const startTime = Date.now();
  
  try {
    // Step 1: Fetch fresh data from Binance
    const binanceData = await fetchBinanceData(symbol, tf, config);
    
    // Step 2: Normalize and upsert to database
    const normalizedKlines = normalizeBinanceKlines(binanceData, symbol, tf);
    
    if (config.output.saveToDatabase) {
      await upsertKlines(normalizedKlines);
    }
    
    // Step 3: Get comprehensive dataset for calculations
    const allKlines = await getLatestKlines(symbol, tf, config.dataLookback.minKlines * 2);
    
    if (allKlines.length < config.dataLookback.minKlines) {
      throw new MCEError(
        `Insufficient data: ${allKlines.length} < ${config.dataLookback.minKlines}`,
        "INSUFFICIENT_DATA"
      );
    }
    
    // Step 4: Calculate features
    const featureResult = calculateFeaturesRobust(allKlines);
    
    if (featureResult.metadata.errors.length > 0) {
      throw new MCEError(
        `Feature calculation failed: ${featureResult.metadata.errors.join(", ")}`,
        "FEATURE_CALCULATION_ERROR"
      );
    }
    
    // Step 5: Assess data quality
    const dataQuality = assessDataQuality(allKlines, tf);
    const dataQualityScore = dataQuality.completeness * (dataQuality.valid ? 1 : 0.5);
    
    // Step 6: Classify regime
    const currentPrice = allKlines[allKlines.length - 1].close;
    const classification = classifyRegime(
      featureResult.features,
      currentPrice,
      dataQualityScore
    );
    
    // Step 7: Apply anti-flip smoothing
    let finalTrend = classification.trend;
    let finalVolatility = classification.volatility;
    let regimeChanged = true;
    
    if (config.processing.enableAntiFlip) {
      const stateKey = `${symbol}-${tf}`;
      const currentState = antiFlipStates.get(stateKey) || {
        currentRegime: null,
        streakCount: 0,
        pendingRegime: null,
        lastChangeTime: null,
      };
      
      const smoothingResult = applyAntiFlipSmoothing(
        { trend: classification.trend, volatility: classification.volatility },
        currentState
      );
      
      finalTrend = smoothingResult.finalRegime.trend;
      finalVolatility = smoothingResult.finalRegime.volatility;
      regimeChanged = smoothingResult.changed;
      
      // Update state
      antiFlipStates.set(stateKey, smoothingResult.newState);
    }
    
    // Step 8: Get previous signature for change detection
    const previousSignature = await getPreviousSignature(symbol, tf);
    
    // Step 9: Create regime change object
    const regimeChange = createRegimeChange(
      previousSignature,
      finalTrend,
      finalVolatility
    );
    
    // Step 10: Generate regime signature
    const signature = generateRegimeSignature(
      symbol,
      allKlines[allKlines.length - 1].closeTime,
      finalTrend,
      finalVolatility,
      classification.confidence,
      featureResult.features,
      dataQuality,
      regimeChange
    );
    
    // Step 11: Save signature to database
    if (config.output.saveToDatabase) {
      await saveRegimeSignature(signature);
    }
    
    const calculationTime = Date.now() - startTime;
    
    return {
      symbol,
      tf,
      success: true,
      signature,
      metrics: {
        klinesProcessed: allKlines.length,
        dataQualityScore,
        calculationTime,
      },
    };
    
  } catch (error) {
    const calculationTime = Date.now() - startTime;
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    
    return {
      symbol,
      tf,
      success: false,
      error: errorMsg,
      metrics: {
        klinesProcessed: 0,
        dataQualityScore: 0,
        calculationTime,
      },
    };
  }
}

// Fetch data from Binance with retry logic
async function fetchBinanceData(
  symbol: Symbol,
  tf: TF,
  config: PipelineConfig
): Promise<any[]> {
  const limit = Math.min(1000, config.dataLookback.hours * (60 / getTFMinutes(tf)));
  
  for (let attempt = 1; attempt <= config.processing.maxRetries; attempt++) {
    try {
      const data = await binanceClient.getRecentKlines(symbol, tf, limit);
      return data;
      
    } catch (error) {
      if (attempt === config.processing.maxRetries) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error("Max retries exceeded");
}

// Get previous regime signature from database
async function getPreviousSignature(
  symbol: Symbol,
  tf: TF
): Promise<RegimeSignature | null> {
  try {
    const sb = supabaseAdmin();
    
    const { data, error } = await sb
      .from("regime_signatures")
      .select("signature")
      .eq("symbol", symbol)
      .eq("tf", tf)
      .order("as_of", { ascending: false })
      .limit(1);
    
    if (error || !data || data.length === 0) {
      return null;
    }
    
    return data[0].signature as RegimeSignature;
    
  } catch (error) {
    console.warn("Failed to get previous signature:", error);
    return null;
  }
}

// Save regime signature to database
async function saveRegimeSignature(signature: RegimeSignature): Promise<void> {
  const sb = supabaseAdmin();
  
  const row = {
    symbol: signature.symbol,
    tf: signature.tf,
    as_of: signature.asOf,
    trend: signature.trend,
    volatility: signature.volatility,
    confidence: signature.confidence,
    quality: signature.quality,
    features: signature.features,
    signature: signature,
    hash: signature.hash,
  };
  
  const { error } = await sb
    .from("regime_signatures")
    .upsert(row, {
      onConflict: "symbol,tf,as_of",
    });
  
  if (error) {
    throw new MCEError(
      `Failed to save regime signature: ${error.message}`,
      "DATABASE_ERROR",
      { signature: signature.hash }
    );
  }
}

// Calculate summary statistics
function calculateSummary(results: PipelineResult["results"]): PipelineResult["summary"] {
  const totalProcessed = results.length;
  const successCount = results.filter(r => r.success).length;
  const errorCount = totalProcessed - successCount;
  
  const successfulResults = results.filter(r => r.success);
  
  const avgDataQuality = successfulResults.length > 0
    ? successfulResults.reduce((sum, r) => sum + r.metrics.dataQualityScore, 0) / successfulResults.length
    : 0;
  
  const avgCalculationTime = results.length > 0
    ? results.reduce((sum, r) => sum + r.metrics.calculationTime, 0) / results.length
    : 0;
  
  return {
    totalProcessed,
    successCount,
    errorCount,
    avgDataQuality,
    avgCalculationTime,
  };
}

// Helper function to get timeframe in minutes
function getTFMinutes(tf: TF): number {
  const minutes: Record<TF, number> = {
    "1m": 1,
    "5m": 5,
    "15m": 15,
    "1h": 60,
    "4h": 240,
  };
  
  return minutes[tf];
}

// Health check for pipeline dependencies
export async function checkPipelineHealth(): Promise<{
  healthy: boolean;
  checks: Array<{
    name: string;
    status: "pass" | "fail" | "warn";
    message: string;
    latency?: number;
  }>;
}> {
  const checks: Array<{
    name: string;
    status: "pass" | "fail" | "warn";
    message: string;
    latency?: number;
  }> = [];
  
  // Check Binance API
  try {
    const binanceHealth = await binanceClient.healthCheck();
    checks.push({
      name: "Binance API",
      status: binanceHealth.connected ? "pass" : "fail",
      message: binanceHealth.error || `Connected (${binanceHealth.latencyMs}ms)`,
      latency: binanceHealth.latencyMs,
    });
  } catch (error) {
    checks.push({
      name: "Binance API",
      status: "fail",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
  
  // Check Supabase connection
  try {
    const sb = supabaseAdmin();
    const start = Date.now();
    const { error } = await sb.from("system_health").select("key").limit(1);
    const latency = Date.now() - start;
    
    checks.push({
      name: "Supabase Database",
      status: error ? "fail" : "pass",
      message: error ? error.message : `Connected (${latency}ms)`,
      latency,
    });
  } catch (error) {
    checks.push({
      name: "Supabase Database",
      status: "fail",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
  
  const healthy = checks.every(check => check.status === "pass");
  
  return { healthy, checks };
}