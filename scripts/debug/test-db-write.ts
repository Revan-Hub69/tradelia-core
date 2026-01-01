#!/usr/bin/env tsx

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../../lib/mce/db/supabase';

async function testWrite() {
  const sb = supabaseAdmin();
  
  console.log('🧪 Testing database write permissions...');
  
  // Test writing to mce_regime_snapshots
  try {
    const testData = {
      symbol: 'BTCUSDT',
      tf: '1m',
      as_of: Date.now(),
      signature: {
        v: 'mce.v1',
        symbol: 'BTCUSDT',
        tf: '1m',
        asOf: Date.now(),
        trend: 'up',
        volatility: 'normal',
        confidence: 0.8,
        features: {},
        quality: { valid: true },
        change: { changed: false },
        hash: 'test_' + Date.now()
      }
    };
    
    const { data, error } = await sb
      .from('mce_regime_snapshots')
      .insert(testData)
      .select();
    
    if (error) {
      console.error('❌ Write failed:', error);
    } else {
      console.log('✅ Write successful:', data);
    }
    
  } catch (error) {
    console.error('💥 Exception:', error);
  }
}

testWrite().catch(console.error);