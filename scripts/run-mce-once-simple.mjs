#!/usr/bin/env node

/**
 * Run MCE Pipeline Once - Simple Version
 * Fetches market data from Binance and writes regime signatures to database
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BINANCE_API = 'https://api.binance.com';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  db: { schema: 'public' }
});

// Simple MCE logic
async function fetchBinanceKlines(symbol, interval, limit = 100) {
  const url = new URL('/api/v3/klines', BINANCE_API);
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('interval', interval);
  url.searchParams.set('limit', limit.toString());
  
  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'Tradelia/1.0' },
    timeout: 10000
  });
  
  if (!res.ok) throw new Error(`Binance error: ${res.status}`);
  return res.json();
}

function calculateTrend(closes) {
  if (closes.length < 2) return 'NEUTRAL';
  
  const recent = closes.slice(-5);
  const avg = recent.reduce((a, b) => a + b) / recent.length;
  const current = closes[closes.length - 1];
  
  if (current > avg * 1.01) return 'UP';
  if (current < avg * 0.99) return 'DOWN';
  return 'NEUTRAL';
}

function calculateVolatility(closes) {
  if (closes.length < 2) return 'LOW';
  
  const returns = [];
  for (let i = 1; i < closes.length; i++) {
    returns.push(Math.abs((closes[i] - closes[i-1]) / closes[i-1]));
  }
  
  const avgReturn = returns.reduce((a, b) => a + b) / returns.length;
  
  if (avgReturn > 0.02) return 'HIGH';
  if (avgReturn > 0.01) return 'MEDIUM';
  return 'LOW';
}

async function runMCEPipeline() {
  console.log('🚀 MCE Pipeline - Single Run');
  console.log('═'.repeat(60));
  
  const runId = `mce_${Date.now()}`;
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT'];
  const timeframes = ['1m', '5m', '15m'];
  
  try {
    // Record run start
    console.log(`\n📝 Recording run: ${runId}`);
    const { error: runError } = await supabase
      .from('market_data_runs')
      .insert({
        run_id: runId,
        module: 'MCE',
        status: 'RUNNING',
        records_processed: 0
      });
    
    if (runError) throw new Error(`Failed to record run: ${runError.message}`);
    
    let totalRecords = 0;
    
    // Process each symbol and timeframe
    for (const symbol of symbols) {
      for (const tf of timeframes) {
        try {
          console.log(`\n📊 Processing ${symbol} ${tf}...`);
          
          // Fetch klines
          const klines = await fetchBinanceKlines(symbol, tf, 100);
          
          if (!Array.isArray(klines) || klines.length === 0) {
            console.log(`   ⚠️  No data returned`);
            continue;
          }
          
          // Extract closes
          const closes = klines.map(k => parseFloat(k[4]));
          
          // Calculate metrics
          const trend = calculateTrend(closes);
          const volatility = calculateVolatility(closes);
          const confidence = 0.75; // Simple confidence
          
          const latestKline = klines[klines.length - 1];
          const asOf = latestKline[6]; // Close time
          
          // Write regime signature
          const { error: sigError } = await supabase
            .from('regime_signatures')
            .insert({
              symbol,
              tf,
              as_of: asOf,
              trend,
              volatility,
              confidence,
              quality: { dataPoints: closes.length },
              features: { closes: closes.slice(-10) },
              signature: { trend, volatility, confidence },
              hash: `${symbol}_${tf}_${asOf}`
            });
          
          if (sigError) {
            console.log(`   ❌ Error: ${sigError.message}`);
            continue;
          }
          
          // Write market data
          for (const kline of klines) {
            const { error: mdError } = await supabase
              .from('market_data')
              .insert({
                symbol,
                tf,
                open_time: kline[0],
                close_time: kline[6],
                open: kline[1],
                high: kline[2],
                low: kline[3],
                close: kline[4],
                volume: kline[5],
                trades: kline[8],
                source: 'binance'
              });
            
            if (!mdError) totalRecords++;
          }
          
          console.log(`   ✅ ${symbol} ${tf}: ${trend} (${volatility} volatility)`);
          
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}`);
        }
      }
    }
    
    // Update run status
    console.log(`\n✅ Pipeline completed`);
    console.log(`   Total records written: ${totalRecords}`);
    
    const { error: updateError } = await supabase
      .from('market_data_runs')
      .update({
        status: 'SUCCESS',
        completed_at: new Date().toISOString(),
        records_processed: totalRecords
      })
      .eq('run_id', runId);
    
    if (updateError) {
      console.log(`   ⚠️  Warning: Could not update run status: ${updateError.message}`);
    }
    
    // Summary
    console.log('\n📊 Summary');
    console.log('═'.repeat(60));
    console.log(`✅ MCE Pipeline executed successfully`);
    console.log(`   Run ID: ${runId}`);
    console.log(`   Symbols processed: ${symbols.length}`);
    console.log(`   Timeframes: ${timeframes.join(', ')}`);
    console.log(`   Total records: ${totalRecords}`);
    console.log(`   Regime signatures: ${symbols.length * timeframes.length}`);
    
    return true;
    
  } catch (error) {
    console.error(`\n❌ Pipeline failed: ${error.message}`);
    
    // Update run status to FAILED
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
  const success = await runMCEPipeline();
  process.exit(success ? 0 : 1);
}

main();
