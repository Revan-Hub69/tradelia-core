#!/usr/bin/env tsx
/**
 * Script to seed competition_rules and program pros/cons data
 * Usage: npx tsx scripts/seed-drawer-data.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://higkhlfjfhlecbtfnznx.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZ2tobGZqZmhsZWNidGZuem54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ1Nzk5OSwiZXhwIjoyMDc4MDMzOTk5fQ.iOqVIFi-WxChkTNkc58fizixSfRcANohcG1A9ggtkjs';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Competition rules data for each program (using name matching)
// Only using fields that exist in the database
const competitionRulesData = [
  {
    name: 'FTMO Challenge',
    rules: {
      ea_allowed: true,
      news_trading: false,
      weekend_holding: true,
    },
  },
  {
    name: 'The5ers Top 100 Competition',
    rules: {
      ea_allowed: true,
      news_trading: true,
      weekend_holding: true,
    },
  },
  {
    name: 'FundedNext Cash Contest',
    rules: {
      ea_allowed: true,
      news_trading: false,
      weekend_holding: false,
    },
  },
  {
    name: 'NinjaTrader Arena',
    rules: {
      ea_allowed: true,
      news_trading: true,
      weekend_holding: true,
    },
  },
];

// Program pros/cons data (using name matching)
const programDetailsData = [
  {
    name: 'FTMO Challenge',
    best_for: 'Traders seeking a reliable and established prop firm with clear rules and excellent reputation',
    pros: [
      'Industry-leading reputation',
      'Fast payout processing',
      'Clear and transparent rules',
      'Excellent customer support',
      'Multiple account sizes',
      'No time limit on challenges',
    ],
    cons: [
      'Higher challenge fees',
      'No weekend holding in some phases',
      'Strict risk management rules',
    ],
  },
  {
    name: 'The5ers Top 100 Competition',
    best_for: 'Traders who want flexibility with EAs and news trading, plus instant funding options',
    pros: [
      'EA and news trading allowed',
      'Instant funding available',
      'Lower challenge fees',
      'Multiple challenge types',
      'Good profit split',
      'Fast scaling plan',
    ],
    cons: [
      'Newer firm than FTMO',
      'Limited educational resources',
      'Stricter drawdown rules',
    ],
  },
  {
    name: 'FundedNext Cash Contest',
    best_for: 'Traders looking for competitive pricing and straightforward evaluation process',
    pros: [
      'Competitive pricing',
      'Transparent evaluation',
      'Good trading conditions',
      'Fast support response',
      'Multiple platforms supported',
    ],
    cons: [
      'No weekend holding allowed',
      'Limited instrument variety',
      'Newer in the market',
    ],
  },
  {
    name: 'NinjaTrader Arena',
    best_for: 'Traders who want maximum flexibility with copy trading and various strategies',
    pros: [
      'Copy trading allowed',
      'EA friendly',
      'Multiple strategy support',
      'Good profit sharing',
      'Fast account setup',
      'Regular promotions',
    ],
    cons: [
      'Complex fee structure',
      'Stricter verification process',
      'Limited withdrawal methods',
    ],
  },
];

async function seedCompetitionRules() {
  console.log('🚀 Seeding competition rules...\n');

  for (const item of competitionRulesData) {
    // Get program ID
    const { data: program, error: programError } = await supabase
      .from('programs')
      .select('id')
      .eq('name', item.name)
      .single();

    if (programError || !program) {
      console.error(`❌ Program not found: ${item.name}`);
      continue;
    }

    // Upsert competition rules
    const { error } = await supabase
      .from('competition_rules')
      .upsert({
        program_id: program.id,
        ...item.rules,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'program_id',
      });

    if (error) {
      console.error(`❌ Error seeding rules for ${item.name}:`, error.message);
    } else {
      console.log(`✅ Competition rules seeded for: ${item.name}`);
    }
  }
}

async function seedProgramDetails() {
  console.log('\n🚀 Seeding program details (pros/cons)...\n');

  for (const item of programDetailsData) {
    const { error } = await supabase
      .from('programs')
      .update({
        best_for: item.best_for,
        pros: item.pros,
        cons: item.cons,
        updated_at: new Date().toISOString(),
      })
      .eq('name', item.name);

    if (error) {
      console.error(`❌ Error updating ${item.name}:`, error.message);
    } else {
      console.log(`✅ Program details updated for: ${item.name}`);
    }
  }
}

async function verifyData() {
  console.log('\n📊 Verifying seeded data...\n');

  const { data: programs, error } = await supabase
    .from('programs')
    .select(`
      name,
      best_for,
      pros,
      cons,
      competition_rules (
        ea_allowed,
        news_trading,
        weekend_holding
      )
    `)
    .order('id');

  if (error) {
    console.error('❌ Error verifying data:', error.message);
    return;
  }

  for (const program of programs) {
    const hasPros = program.pros && Array.isArray(program.pros) && program.pros.length > 0;
    const hasCons = program.cons && Array.isArray(program.cons) && program.cons.length > 0;
    const hasRules = program.competition_rules !== null;

    console.log(`📋 ${program.name}:`);
    console.log(`   - Best for: ${program.best_for ? '✅' : '❌'}`);
    console.log(`   - Pros: ${hasPros ? '✅' : '❌'}`);
    console.log(`   - Cons: ${hasCons ? '✅' : '❌'}`);
    console.log(`   - Competition Rules: ${hasRules ? '✅' : '❌'}`);
    console.log('');
  }
}

async function main() {
  console.log('🎯 Starting drawer data seeding...\n');

  await seedCompetitionRules();
  await seedProgramDetails();
  await verifyData();

  console.log('✨ Seeding complete!');
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
