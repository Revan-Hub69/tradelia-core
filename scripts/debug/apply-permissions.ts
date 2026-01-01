#!/usr/bin/env tsx

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../../lib/mce/db/supabase';

async function applyPermissions() {
  const sb = supabaseAdmin();
  
  console.log('🔧 Applying permissions...');
  
  const sql = `
    -- Grant permissions on market_data table
    GRANT ALL ON TABLE public.market_data TO service_role;
    GRANT ALL ON TABLE public.market_data TO authenticated;
    GRANT SELECT ON TABLE public.market_data TO anon;

    -- Grant permissions on mce_regime_snapshots table  
    GRANT ALL ON TABLE public.mce_regime_snapshots TO service_role;
    GRANT ALL ON TABLE public.mce_regime_snapshots TO authenticated;
    GRANT SELECT ON TABLE public.mce_regime_snapshots TO anon;
  `;
  
  const { error } = await sb.rpc('exec_sql', { sql });
  
  if (error) {
    console.error('❌ Failed to apply permissions:', error);
  } else {
    console.log('✅ Permissions applied successfully!');
  }
}

applyPermissions().catch(console.error);