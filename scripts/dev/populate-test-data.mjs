#!/usr/bin/env node

// Populate Test Data - Quick database population for dashboard testing
// Creates minimal test data so the trading dashboard APIs work

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://higkhlfjfhlecbtfnznx.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZ2tobGZqZmhsZWNidGZuem54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ1Nzk5OSwiZXhwIjoyMDc4MDMzOTk5fQ.iOqVIFi-WxChkTNkc58fizixSfRcANohcG1A9ggtkjs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateTestData() {
  console.log('🚀 POPULATING TEST DATA FOR TRADING DASHBOARD');
  console.log('=' .repeat(60));

  try {
    const now = Date.now();
    const nowISO = new Date(now).toISOString();

    // 1. Insert MCE regime signature
    console.log('📊 Step 1: Inserting MCE regime signature...');
    const regimeSignature = {
      trend: 'bull',
      volatility: 'normal',
      confidence: 0.75,
      asOf: now,
      features: {
        ema_trend: 0.8,
        volume_trend: 0.7,
        atr_volatility: 0.6
      },
      quality: {
        completeness: 0.95,
        freshness: 0.98,
        consistency: 0.92
      }
    };

    const { error: regimeError } = await supabase
      .from('regime_signatures')
      .upsert({
        symbol: 'BTCUSDT',
        tf: '1m',
        signature: regimeSignature,
        as_of: now,
        inserted_at: nowISO
      });

    if (regimeError) {
      console.error('❌ Failed to insert regime signature:', regimeError);
    } else {
      console.log('✅ MCE regime signature inserted');
    }

    // 2. Insert UCM universe data
    console.log('\n🎯 Step 2: Inserting UCM universe data...');
    const universeSymbols = [
      { symbol: 'BTCUSDT', rank: 1, score: 85.5, reasons: ['high_volume', 'low_spread'] },
      { symbol: 'ETHUSDT', rank: 2, score: 78.2, reasons: ['good_liquidity', 'stable_spread'] },
      { symbol: 'BNBUSDT', rank: 3, score: 72.1, reasons: ['decent_volume', 'acceptable_spread'] },
      { symbol: 'XRPUSDT', rank: 4, score: 68.9, reasons: ['moderate_volume', 'tight_spread'] },
      { symbol: 'SOLUSDT', rank: 5, score: 65.3, reasons: ['growing_volume', 'improving_liquidity'] }
    ];

    const universeActive = {
      symbols: universeSymbols,
      asOf: now,
      hash: 'test_universe_' + Math.random().toString(36).substring(7),
      metadata: {
        totalEligible: 5,
        coreIncluded: true,
        turnoverRate: 0.2
      }
    };

    const { error: universeError } = await supabase
      .from('universe_active')
      .upsert({
        as_of: now,
        universe_active: universeActive,
        inserted_at: nowISO
      });

    if (universeError) {
      console.error('❌ Failed to insert universe data:', universeError);
    } else {
      console.log('✅ UCM universe data inserted');
    }

    // 3. Insert MSF day gate and market fits
    console.log('\n🔍 Step 3: Inserting MSF data...');
    
    // Day gate
    const dayGate = {
      v: 'msf.daygate.v1',
      asOf: now,
      tradableDay: true,
      countA: 2,
      countB: 2,
      reasons: ['good_regime_confidence', 'adequate_liquidity', 'normal_volatility'],
      hash: 'test_daygate_' + Math.random().toString(36).substring(7)
    };

    const { error: dayGateError } = await supabase
      .from('day_gates')
      .upsert({
        as_of: now,
        day_gate: dayGate,
        inserted_at: nowISO
      });

    if (dayGateError) {
      console.error('❌ Failed to insert day gate:', dayGateError);
    } else {
      console.log('✅ MSF day gate inserted');
    }

    // Market fits
    const marketFits = [
      {
        symbol: 'BTCUSDT',
        fitClass: 'A',
        allowedPlaybooks: ['pullback'],
        frictionScore: 0.15,
        dataQuality: 0.98,
        reasons: ['tight_spread', 'high_volume', 'good_data']
      },
      {
        symbol: 'ETHUSDT',
        fitClass: 'A',
        allowedPlaybooks: ['pullback'],
        frictionScore: 0.22,
        dataQuality: 0.96,
        reasons: ['good_liquidity', 'stable_spread', 'complete_data']
      },
      {
        symbol: 'BNBUSDT',
        fitClass: 'B',
        allowedPlaybooks: ['mean_revert'],
        frictionScore: 0.35,
        dataQuality: 0.94,
        reasons: ['moderate_spread', 'decent_volume']
      },
      {
        symbol: 'XRPUSDT',
        fitClass: 'B',
        allowedPlaybooks: ['mean_revert'],
        frictionScore: 0.28,
        dataQuality: 0.95,
        reasons: ['tight_spread', 'lower_volume']
      },
      {
        symbol: 'SOLUSDT',
        fitClass: 'C',
        allowedPlaybooks: ['none'],
        frictionScore: 0.45,
        dataQuality: 0.91,
        reasons: ['wider_spread', 'variable_liquidity']
      }
    ];

    for (const fit of marketFits) {
      const marketFit = {
        v: 'msf.marketfit.v1',
        symbol: fit.symbol,
        asOf: now,
        fitClass: fit.fitClass,
        allowedPlaybooks: fit.allowedPlaybooks,
        frictionScore: fit.frictionScore,
        dataQuality: fit.dataQuality,
        reasons: fit.reasons,
        hash: 'test_fit_' + fit.symbol.toLowerCase() + '_' + Math.random().toString(36).substring(7)
      };

      const { error: fitError } = await supabase
        .from('market_fits')
        .upsert({
          symbol: fit.symbol,
          as_of: now,
          market_fit: marketFit,
          inserted_at: nowISO
        });

      if (fitError) {
        console.error(`❌ Failed to insert market fit for ${fit.symbol}:`, fitError);
      } else {
        console.log(`✅ MSF market fit inserted for ${fit.symbol}`);
      }
    }

    console.log('\n' + '=' .repeat(60));
    console.log('🎉 TEST DATA POPULATION COMPLETE!');
    console.log('\nData Summary:');
    console.log('   📊 MCE: BULL/NORMAL regime (75% confidence)');
    console.log('   🎯 UCM: 5 active symbols in universe');
    console.log('   🔍 MSF: Trading day OPEN, 2 A-class, 2 B-class, 1 C-class');
    console.log('\nAPIs should now work:');
    console.log('   ✅ /api/regime/current');
    console.log('   ✅ /api/universe/active');
    console.log('   ✅ /api/msf/current');
    console.log('\nTesting dashboard: http://localhost:3001/dashboard/trading');

  } catch (error) {
    console.error('\n❌ TEST DATA POPULATION FAILED:', error);
    console.error('Stack:', error.stack);
  }
}

populateTestData();