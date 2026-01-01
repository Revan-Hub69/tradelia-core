#!/usr/bin/env node

/**
 * Run UCM and MSF Pipelines
 * Populates universe_active, msf_day_gates, and msf_market_fits tables
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  db: { schema: 'public' }
});

// UCM Pipeline - Select tradable symbols
async function runUCMPipeline() {
  console.log('\n🚀 UCM Pipeline - Universe Control Module');
  console.log('═'.repeat(60));
  
  const runId = `ucm_${Date.now()}`;
  
  try {
    // Record run start
    console.log(`📝 Recording run: ${runId}`);
    const { error: runError } = await supabase
      .from('market_data_runs')
      .insert({
        run_id: runId,
        module: 'UCM',
        status: 'RUNNING',
        records_processed: 0
      });
    
    if (runError) throw new Error(`Failed to record run: ${runError.message}`);
    
    // Get all symbols from market_data
    const { data: symbols, error: symbolError } = await supabase
      .from('market_data')
      .select('symbol', { count: 'exact' })
      .eq('tf', '1m')
      .order('symbol');
    
    if (symbolError) throw new Error(`Failed to get symbols: ${symbolError.message}`);
    
    const uniqueSymbols = [...new Set(symbols.map(s => s.symbol))];
    console.log(`📊 Found ${uniqueSymbols.length} unique symbols`);
    
    // Simple UCM logic: select top symbols by volume
    const { data: volumeData, error: volError } = await supabase
      .from('market_data')
      .select('symbol, volume')
      .eq('tf', '1m')
      .order('volume', { ascending: false })
      .limit(100);
    
    if (volError) throw new Error(`Failed to get volume data: ${volError.message}`);
    
    // Calculate average volume per symbol
    const volumeBySymbol = {};
    volumeData.forEach(row => {
      if (!volumeBySymbol[row.symbol]) {
        volumeBySymbol[row.symbol] = [];
      }
      volumeBySymbol[row.symbol].push(parseFloat(row.volume));
    });
    
    const avgVolume = {};
    Object.entries(volumeBySymbol).forEach(([symbol, volumes]) => {
      avgVolume[symbol] = volumes.reduce((a, b) => a + b) / volumes.length;
    });
    
    // Select top 5 symbols by average volume
    const topSymbols = Object.entries(avgVolume)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([symbol]) => symbol);
    
    console.log(`✅ Selected top symbols: ${topSymbols.join(', ')}`);
    
    // Create universe_active entry
    const asOf = Date.now();
    const { error: insertError } = await supabase
      .from('universe_active')
      .insert({
        as_of: asOf,
        version: 'ucm.v1',
        target_count: topSymbols.length,
        min_count: 3,
        max_count: 10,
        symbols: topSymbols,
        core_included: true,
        meta: { method: 'volume_based', timeframe: '1m' },
        based_on: { source: 'market_data', count: volumeData.length },
        hash: `ucm_${asOf}_${topSymbols.join('_')}`
      });
    
    if (insertError) throw new Error(`Failed to insert universe_active: ${insertError.message}`);
    
    console.log(`✅ Universe active created with ${topSymbols.length} symbols`);
    
    // Update run status
    const { error: updateError } = await supabase
      .from('market_data_runs')
      .update({
        status: 'SUCCESS',
        completed_at: new Date().toISOString(),
        records_processed: topSymbols.length
      })
      .eq('run_id', runId);
    
    if (updateError) {
      console.log(`⚠️  Warning: Could not update run status: ${updateError.message}`);
    }
    
    return true;
    
  } catch (error) {
    console.error(`❌ UCM Pipeline failed: ${error.message}`);
    
    await supabase
      .from('market_data_runs')
      .update({
        status: 'FAILED',
        completed_at: new Date().toISOString(),
        error_message: error.message
      })
      .eq('run_id', runId);
    
    return false;
  }
}

// MSF Pipeline - Market Selection & Fit
async function runMSFPipeline() {
  console.log('\n🚀 MSF Pipeline - Market Selection & Fit');
  console.log('═'.repeat(60));
  
  const runId = `msf_${Date.now()}`;
  
  try {
    // Record run start
    console.log(`📝 Recording run: ${runId}`);
    const { error: runError } = await supabase
      .from('market_data_runs')
      .insert({
        run_id: runId,
        module: 'MSF',
        status: 'RUNNING',
        records_processed: 0
      });
    
    if (runError) throw new Error(`Failed to record run: ${runError.message}`);
    
    // Get universe_active
    const { data: universeData, error: univError } = await supabase
      .from('universe_active')
      .select('symbols')
      .order('as_of', { ascending: false })
      .limit(1);
    
    if (univError) throw new Error(`Failed to get universe: ${univError.message}`);
    
    if (!universeData || universeData.length === 0) {
      throw new Error('No universe_active found. Run UCM pipeline first.');
    }
    
    const symbols = universeData[0].symbols;
    console.log(`📊 Processing ${symbols.length} symbols from universe`);
    
    // Get latest regime signatures for each symbol
    const { data: regimeData, error: regimeError } = await supabase
      .from('regime_signatures')
      .select('symbol, trend, volatility, confidence')
      .in('symbol', symbols)
      .order('as_of', { ascending: false });
    
    if (regimeError) throw new Error(`Failed to get regime data: ${regimeError.message}`);
    
    // Classify symbols based on regime
    const classifySymbol = (trend, volatility, confidence) => {
      if (confidence < 0.5) return 'NO_TRADE';
      if (trend === 'up' && volatility === 'compressed') return 'A';
      if (trend === 'up' && volatility === 'normal') return 'A';
      if (trend === 'range' && volatility === 'compressed') return 'B';
      if (trend === 'range' && volatility === 'normal') return 'B';
      if (trend === 'down') return 'C';
      return 'NO_TRADE';
    };
    
    // Create market fits
    const asOf = Date.now();
    let countA = 0, countB = 0;
    
    for (const regime of regimeData) {
      const fitClass = classifySymbol(regime.trend, regime.volatility, regime.confidence);
      
      if (fitClass === 'A') countA++;
      if (fitClass === 'B') countB++;
      
      const { error: fitError } = await supabase
        .from('msf_market_fits')
        .insert({
          symbol: regime.symbol,
          as_of: asOf,
          fit_class: fitClass,
          allowed_playbooks: fitClass === 'NO_TRADE' ? [] : ['breakout', 'range'],
          friction_score: 0.3,
          data_quality: 0.8,
          reasons: [`Trend: ${regime.trend}`, `Vol: ${regime.volatility}`],
          market_fit: { trend: regime.trend, volatility: regime.volatility },
          hash: `msf_${regime.symbol}_${asOf}`
        });
      
      if (fitError) {
        console.log(`⚠️  Warning: Could not insert fit for ${regime.symbol}: ${fitError.message}`);
      }
    }
    
    console.log(`✅ Market fits created: A=${countA}, B=${countB}`);
    
    // Create day gate
    const tradableDay = countA + countB > 0;
    const { error: gateError } = await supabase
      .from('msf_day_gates')
      .insert({
        as_of: asOf,
        tradable_day: tradableDay,
        count_a: countA,
        count_b: countB,
        reasons: tradableDay ? ['Sufficient A/B symbols'] : ['No tradable symbols'],
        day_gate: { tradable: tradableDay, countA, countB },
        hash: `daygate_${asOf}`
      });
    
    if (gateError) throw new Error(`Failed to insert day gate: ${gateError.message}`);
    
    console.log(`✅ Day gate created: tradable=${tradableDay}`);
    
    // Update run status
    const { error: updateError } = await supabase
      .from('market_data_runs')
      .update({
        status: 'SUCCESS',
        completed_at: new Date().toISOString(),
        records_processed: regimeData.length
      })
      .eq('run_id', runId);
    
    if (updateError) {
      console.log(`⚠️  Warning: Could not update run status: ${updateError.message}`);
    }
    
    return true;
    
  } catch (error) {
    console.error(`❌ MSF Pipeline failed: ${error.message}`);
    
    await supabase
      .from('market_data_runs')
      .update({
        status: 'FAILED',
        completed_at: new Date().toISOString(),
        error_message: error.message
      })
      .eq('run_id', runId);
    
    return false;
  }
}

async function main() {
  console.log('🔄 Running UCM and MSF Pipelines');
  console.log('═'.repeat(60));
  
  const ucmSuccess = await runUCMPipeline();
  if (!ucmSuccess) {
    console.error('\n❌ UCM pipeline failed. Aborting MSF pipeline.');
    process.exit(1);
  }
  
  const msfSuccess = await runMSFPipeline();
  
  // Summary
  console.log('\n📊 Summary');
  console.log('═'.repeat(60));
  console.log(`✅ UCM Pipeline: SUCCESS`);
  console.log(`✅ MSF Pipeline: ${msfSuccess ? 'SUCCESS' : 'FAILED'}`);
  
  if (ucmSuccess && msfSuccess) {
    console.log('\n🎉 All pipelines completed successfully!');
    console.log('   System is now fully operational.');
    console.log('   Check /api/universe/active and /api/msf/current for data.');
  }
  
  process.exit(ucmSuccess && msfSuccess ? 0 : 1);
}

main();
