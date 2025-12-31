#!/usr/bin/env tsx

// Populate core data tables for API testing
// This creates minimal data so APIs don't return 500 errors

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../../lib/mce/db/supabase';

async function populateCoreData() {
  const sb = supabaseAdmin();
  const now = Date.now();
  
  console.log('🔄 Populating core data tables...');
  
  // 1. MCE Regime Snapshots
  console.log('Adding MCE regime data...');
  const { error: mceError } = await sb
    .from('mce_regime_snapshots')
    .upsert({
      symbol: 'BTCUSDT',
      tf: '1m',
      as_of: now,
      signature: {
        v: 'mce.v1',
        symbol: 'BTCUSDT',
        tf: '1m',
        asOf: now,
        trend: 'up',
        volatility: 'normal',
        confidence: 0.8,
        features: {
          atr14: 1000,
          atr50: 1200,
          atrPct7d: 60,
          atrPct30d: 55,
          emaFast: 50000,
          emaSlow: 49500,
          trendStrength: 0.7,
          volNorm: 0.6
        },
        quality: {
          completeness: 0.95,
          gaps: 0,
          freshnessSec: 30,
          source: 'binance',
          valid: true
        },
        change: {
          changed: false
        },
        hash: 'test_hash_' + now
      }
    }, { onConflict: 'symbol,tf' });
  
  if (mceError) {
    console.error('MCE Error:', mceError);
  } else {
    console.log('✅ MCE regime data added');
  }
  
  // 2. Universe Active
  console.log('Adding universe data...');
  const { error: universeError } = await sb
    .from('universe_active')
    .upsert([
      {
        symbol: 'BTCUSDT',
        rank: 1,
        score: 0.95,
        volume_24h: 1000000000,
        market_cap: 1000000000000,
        active: true,
        as_of: now
      },
      {
        symbol: 'ETHUSDT', 
        rank: 2,
        score: 0.90,
        volume_24h: 500000000,
        market_cap: 400000000000,
        active: true,
        as_of: now
      }
    ], { onConflict: 'symbol' });
  
  if (universeError) {
    console.error('Universe Error:', universeError);
  } else {
    console.log('✅ Universe data added');
  }
  
  // 3. MSF Snapshots
  console.log('Adding MSF data...');
  const { error: msfError } = await sb
    .from('msf_snapshots')
    .upsert({
      as_of: now,
      day_gate: {
        tradableDay: true,
        countA: 3,
        countB: 2,
        reasons: []
      },
      market_fits: [
        {
          symbol: 'BTCUSDT',
          fitClass: 'A',
          frictionScore: 0.1,
          dataQuality: 0.95
        },
        {
          symbol: 'ETHUSDT',
          fitClass: 'A', 
          frictionScore: 0.15,
          dataQuality: 0.92
        }
      ]
    }, { onConflict: 'as_of' });
  
  if (msfError) {
    console.error('MSF Error:', msfError);
  } else {
    console.log('✅ MSF data added');
  }
  
  console.log('\n🎯 Core data populated successfully!');
  console.log('APIs should now return data instead of 500 errors');
}

populateCoreData().catch(console.error);