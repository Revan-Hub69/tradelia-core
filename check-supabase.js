/* eslint-disable no-console */
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://higkhlfjfhlecbtfnznx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZ2tobGZqZmhsZWNidGZuem54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ1Nzk5OSwiZXhwIjoyMDc4MDMzOTk5fQ.iOqVIFi-WxChkTNkc58fizixSfRcANohcG1A9ggtkjs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking Supabase database...\n');

  // Check organizers
  const { data: organizers, error: orgError } = await supabase
    .from('organizers')
    .select('id, name, organizer_type');

  if (orgError) {
    console.error('❌ Error fetching organizers:', orgError.message);
  } else {
    console.log(`✅ Found ${organizers.length} organizers:`);
    organizers.forEach(o => console.log(`   - ${o.name} (${o.organizer_type})`));
  }

  console.log('\n');

  // Check programs
  const { data: programs, error: progError } = await supabase
    .from('programs')
    .select('id, name, category, organizer_id');

  if (progError) {
    console.error('❌ Error fetching programs:', progError.message);
  } else {
    console.log(`✅ Found ${programs.length} programs:`);
    programs.forEach(p => console.log(`   - ${p.name} (${p.category})`));
  }

  console.log('\n');

  // Check offers with entry_fee = null (free)
  const { data: freeOffers, error: offerError } = await supabase
    .from('offers')
    .select('id, offer_name, entry_fee, first_prize, program_id')
    .is('entry_fee', null);

  if (offerError) {
    console.error('❌ Error fetching offers:', offerError.message);
  } else {
    console.log(`✅ Found ${freeOffers.length} FREE offers (entry_fee = null):`);
    freeOffers.forEach(o => console.log(`   - ${o.offer_name} | First Prize: $${o.first_prize || 'N/A'}`));
  }

  console.log('\n');

  // Check if TradingView The Leap exists
  const { data: tradingview, error: tvError } = await supabase
    .from('programs')
    .select('*')
    .ilike('name', '%TradingView%');

  if (tvError) {
    console.error('❌ Error:', tvError.message);
  } else if (tradingview.length > 0) {
    console.log('✅ TradingView program found:', tradingview[0].name);
  } else {
    console.log('⚠️ TradingView The Leap NOT found in database');
  }

  // Check if FundedNext exists
  const { data: fundednext, error: fnError } = await supabase
    .from('programs')
    .select('*')
    .ilike('name', '%FundedNext%');

  if (fnError) {
    console.error('❌ Error:', fnError.message);
  } else if (fundednext.length > 0) {
    console.log('✅ FundedNext program found:', fundednext[0].name);
  } else {
    console.log('⚠️ FundedNext contest NOT found in database');
  }

  // Check if XM exists
  const { data: xm, error: xmError } = await supabase
    .from('programs')
    .select('*')
    .ilike('name', '%XM%');

  if (xmError) {
    console.error('❌ Error:', xmError.message);
  } else if (xm.length > 0) {
    console.log('✅ XM program found:', xm[0].name);
  } else {
    console.log('⚠️ XM Trading Competitions NOT found in database');
  }
}

checkDatabase();
