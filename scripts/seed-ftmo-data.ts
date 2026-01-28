#!/usr/bin/env tsx
/**
 * Seed script for FTMO data
 * Run with: npx tsx scripts/seed-ftmo-data.ts
 * 
 * This script seeds FTMO data into the correct database tables:
 * - organizers (prop firms)
 * - programs (challenge types)
 * - offers (account sizes with pricing)
 * - rulesets (trading rules per phase)
 * - payout_terms (payout conditions)
 * - market_access (markets and platforms)
 */

import { resolve } from 'node:path';

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// ============================================
// FTMO ORGANIZER DATA
// ============================================
const ftmoOrganizer = {
  id: 'ftmo',
  name: 'FTMO',
  slug: 'ftmo',
};

// ============================================
// FTMO PROGRAMS (Challenge Types)
// ============================================
const ftmoPrograms = [
  {
    id: 'ftmo-challenge',
    organizer_id: 'ftmo',
    name: 'FTMO Challenge',
    slug: 'ftmo-challenge',
    category: 'paid_evaluation',
    ruleset_mode: 'target_based',
    description: 'FTMO\'s flagship 2-step evaluation. Pass Phase 1 (10% profit target) and Phase 2 (5% profit target) to get funded. Industry-leading reputation with bi-weekly payouts.',
    best_for: 'Serious traders ready to invest in evaluation and follow strict rules',
    pros: JSON.stringify(['Excellent reputation', 'Refundable fee', 'Scaling to $2M', 'Multiple platforms', 'Bi-weekly payouts', 'No time limit on Verification']),
    cons: JSON.stringify(['Strict consistency rule', '5-10% pass rate', 'No weekend holding']),
    popularity_score: 98,
    difficulty_rating: 'hard',
    time_limit_days: 30,
    phases_count: 2,
    features: JSON.stringify(['Swing trading allowed', 'News trading allowed', 'EA trading allowed']),
    official_url: 'https://ftmo.com/en/evaluation/',
    status: 'active',
  },
  {
    id: 'ftmo-swing',
    organizer_id: 'ftmo',
    name: 'FTMO Swing',
    slug: 'ftmo-swing',
    category: 'paid_evaluation',
    ruleset_mode: 'target_based',
    description: 'FTMO Swing account with weekend holding allowed. Same 2-step evaluation with relaxed rules for swing traders who hold positions over weekends.',
    best_for: 'Swing traders who hold positions over weekends',
    pros: JSON.stringify(['Weekend holding allowed', 'Refundable fee', 'Swing trading friendly', 'Multiple platforms', 'No time limit on Verification']),
    cons: JSON.stringify(['Strict consistency rule', '5-10% pass rate', 'Higher spreads']),
    popularity_score: 85,
    difficulty_rating: 'hard',
    time_limit_days: 30,
    phases_count: 2,
    features: JSON.stringify(['Weekend holding', 'News trading allowed', 'EA trading allowed']),
    official_url: 'https://ftmo.com/en/evaluation/',
    status: 'active',
  },
  {
    id: 'ftmo-trial',
    organizer_id: 'ftmo',
    name: 'FTMO Free Trial',
    slug: 'ftmo-trial',
    category: 'free_evaluation',
    ruleset_mode: 'target_based',
    description: 'FTMO Free Trial - Test the platform with $100,000 virtual account for 14 days. No credit card required. Experience FTMO rules and platform before purchasing a real challenge.',
    best_for: 'Traders wanting to test FTMO platform and rules before investing',
    pros: JSON.stringify(['Completely FREE', 'No credit card required', '$100K virtual account', 'Real FTMO conditions', 'Test all platforms']),
    cons: JSON.stringify(['No real funding', 'No payouts', 'Must pass to be meaningful', 'Same strict rules']),
    popularity_score: 99,
    difficulty_rating: 'medium',
    time_limit_days: 14,
    phases_count: 1,
    features: JSON.stringify(['Free trial', 'No credit card', '14 days duration']),
    official_url: 'https://ftmo.com/en/free-trial/',
    status: 'active',
  },
];

// ============================================
// FTMO OFFERS (Account Sizes with Pricing)
// ============================================
const ftmoOffers = [
  // FTMO Challenge - All Sizes
  { program_id: 'ftmo-challenge', account_size: 10000, entry_fee: 155, currency: 'EUR', display_order: 1 },
  { program_id: 'ftmo-challenge', account_size: 25000, entry_fee: 250, currency: 'EUR', display_order: 2 },
  { program_id: 'ftmo-challenge', account_size: 50000, entry_fee: 345, currency: 'EUR', display_order: 3 },
  { program_id: 'ftmo-challenge', account_size: 100000, entry_fee: 540, currency: 'EUR', display_order: 4 },
  { program_id: 'ftmo-challenge', account_size: 200000, entry_fee: 1080, currency: 'EUR', display_order: 5 },
  // FTMO Swing - All Sizes
  { program_id: 'ftmo-swing', account_size: 10000, entry_fee: 155, currency: 'EUR', display_order: 1 },
  { program_id: 'ftmo-swing', account_size: 25000, entry_fee: 250, currency: 'EUR', display_order: 2 },
  { program_id: 'ftmo-swing', account_size: 50000, entry_fee: 345, currency: 'EUR', display_order: 3 },
  { program_id: 'ftmo-swing', account_size: 100000, entry_fee: 540, currency: 'EUR', display_order: 4 },
  { program_id: 'ftmo-swing', account_size: 200000, entry_fee: 1080, currency: 'EUR', display_order: 5 },
  // FTMO Trial - Free
  { program_id: 'ftmo-trial', account_size: 100000, entry_fee: null, currency: 'EUR', display_order: 1 },
];

// Generate offer IDs and add common fields
const ftmoOffersWithIds = ftmoOffers.map((offer, index) => ({
  id: `ftmo-offer-${index + 1}`,
  ...offer,
  offer_name: `$${offer.account_size.toLocaleString()} Account`,
  fee_currency: 'EUR',
  refundable: offer.program_id !== 'ftmo-trial',
  refund_conditions: offer.program_id !== 'ftmo-trial' ? 'Refunded with first profit split' : null,
  is_featured: offer.account_size === 100000,
  scaling_max: offer.program_id !== 'ftmo-trial' ? 2000000 : null,
  time_limit_days: offer.program_id === 'ftmo-trial' ? 14 : 30,
  status: 'active',
}));

// ============================================
// FTMO RULESETS (Trading Rules per Phase)
// ============================================
const ftmoRulesets = [
  // FTMO Challenge - Phase 1
  {
    program_id: 'ftmo-challenge',
    phase_number: 1,
    phase_name: 'Challenge Phase',
    profit_target_pct: 10,
    max_drawdown_pct: 10,
    max_drawdown_type: 'trailing',
    max_daily_loss_pct: 5,
    max_daily_loss_type: 'equity_based',
    daily_loss_reset_time: '00:00 CET',
    min_trading_days: 4,
    consistency_required: true,
    best_day_max_pct: 30,
    ea_allowed: true,
    news_trading: true,
    weekend_holding: false,
    time_limit_days: 30,
    description: 'Phase 1: Reach 10% profit target without violating risk rules',
  },
  // FTMO Challenge - Phase 2
  {
    program_id: 'ftmo-challenge',
    phase_number: 2,
    phase_name: 'Verification Phase',
    profit_target_pct: 5,
    max_drawdown_pct: 10,
    max_drawdown_type: 'trailing',
    max_daily_loss_pct: 5,
    max_daily_loss_type: 'equity_based',
    daily_loss_reset_time: '00:00 CET',
    min_trading_days: 4,
    consistency_required: true,
    best_day_max_pct: 30,
    ea_allowed: true,
    news_trading: true,
    weekend_holding: false,
    time_limit_days: 60,
    description: 'Phase 2: Reach 5% profit target to get funded. No time limit.',
  },
  // FTMO Swing - Phase 1
  {
    program_id: 'ftmo-swing',
    phase_number: 1,
    phase_name: 'Challenge Phase',
    profit_target_pct: 10,
    max_drawdown_pct: 10,
    max_drawdown_type: 'trailing',
    max_daily_loss_pct: 5,
    max_daily_loss_type: 'equity_based',
    daily_loss_reset_time: '00:00 CET',
    min_trading_days: 4,
    consistency_required: true,
    best_day_max_pct: 30,
    ea_allowed: true,
    news_trading: true,
    weekend_holding: true,
    time_limit_days: 30,
    description: 'Phase 1: Reach 10% profit target. Weekend holding allowed.',
  },
  // FTMO Swing - Phase 2
  {
    program_id: 'ftmo-swing',
    phase_number: 2,
    phase_name: 'Verification Phase',
    profit_target_pct: 5,
    max_drawdown_pct: 10,
    max_drawdown_type: 'trailing',
    max_daily_loss_pct: 5,
    max_daily_loss_type: 'equity_based',
    daily_loss_reset_time: '00:00 CET',
    min_trading_days: 4,
    consistency_required: true,
    best_day_max_pct: 30,
    ea_allowed: true,
    news_trading: true,
    weekend_holding: true,
    time_limit_days: 60,
    description: 'Phase 2: Reach 5% profit target. Weekend holding allowed.',
  },
  // FTMO Trial - Phase 1 (Single Phase)
  {
    program_id: 'ftmo-trial',
    phase_number: 1,
    phase_name: 'Trial Phase',
    profit_target_pct: 10,
    max_drawdown_pct: 10,
    max_drawdown_type: 'trailing',
    max_daily_loss_pct: 5,
    max_daily_loss_type: 'equity_based',
    daily_loss_reset_time: '00:00 CET',
    min_trading_days: 4,
    consistency_required: true,
    best_day_max_pct: 30,
    ea_allowed: true,
    news_trading: true,
    weekend_holding: false,
    time_limit_days: 14,
    description: 'Free trial: Test FTMO conditions with $100K virtual account for 14 days',
  },
];

// ============================================
// FTMO PAYOUT TERMS
// ============================================
const ftmoPayoutTerms = [
  // Challenge and Swing have same payout terms
  {
    program_id: 'ftmo-challenge',
    profit_split_initial: 80,
    profit_split_scaled: 90,
    profit_split_max: 90,
    payout_frequency: 'bi_weekly',
    first_payout_delay_days: 14,
    eligible_after_phase: 2,
    withdrawal_methods: JSON.stringify(['Bank Transfer', 'PayPal', 'Crypto', 'Wise']),
    min_withdrawal: null,
    payout_processing_time_hours: 48,
  },
  {
    program_id: 'ftmo-swing',
    profit_split_initial: 80,
    profit_split_scaled: 90,
    profit_split_max: 90,
    payout_frequency: 'bi_weekly',
    first_payout_delay_days: 14,
    eligible_after_phase: 2,
    withdrawal_methods: JSON.stringify(['Bank Transfer', 'PayPal', 'Crypto', 'Wise']),
    min_withdrawal: null,
    payout_processing_time_hours: 48,
  },
  // Trial has no payouts
  {
    program_id: 'ftmo-trial',
    profit_split_initial: 0,
    profit_split_scaled: null,
    profit_split_max: 0,
    payout_frequency: null,
    first_payout_delay_days: null,
    eligible_after_phase: null,
    withdrawal_methods: null,
    min_withdrawal: null,
    payout_processing_time_hours: null,
  },
];

// ============================================
// FTMO MARKET ACCESS
// ============================================
const ftmoMarketAccess = [
  {
    program_id: 'ftmo-challenge',
    markets_available: JSON.stringify(['forex', 'indices', 'commodities', 'crypto', 'stocks']),
    platforms: JSON.stringify(['MT4', 'MT5', 'cTrader', 'DXtrade']),
    instruments_count: 1000,
    leverage_forex: '1:100',
    leverage_indices: '1:20',
    leverage_commodities: '1:20',
    leverage_crypto: '1:2',
    commission_forex: 0,
    commission_indices: 0,
    trading_hours: '24/5 Forex, Exchange hours for indices',
  },
  {
    program_id: 'ftmo-swing',
    markets_available: JSON.stringify(['forex', 'indices', 'commodities', 'crypto', 'stocks']),
    platforms: JSON.stringify(['MT4', 'MT5', 'cTrader', 'DXtrade']),
    instruments_count: 1000,
    leverage_forex: '1:100',
    leverage_indices: '1:20',
    leverage_commodities: '1:20',
    leverage_crypto: '1:2',
    commission_forex: 0,
    commission_indices: 0,
    trading_hours: '24/5 Forex, Exchange hours for indices',
  },
  {
    program_id: 'ftmo-trial',
    markets_available: JSON.stringify(['forex', 'indices', 'commodities', 'crypto', 'stocks']),
    platforms: JSON.stringify(['MT4', 'MT5', 'cTrader', 'DXtrade']),
    instruments_count: 1000,
    leverage_forex: '1:100',
    leverage_indices: '1:20',
    leverage_commodities: '1:20',
    leverage_crypto: '1:2',
    commission_forex: 0,
    commission_indices: 0,
    trading_hours: '24/5 Forex, Exchange hours for indices',
  },
];

// ============================================
// SEED FUNCTION
// ============================================
async function seedFTMOData() {
  console.log('🌱 Starting FTMO seed process...\n');

  try {
    // 1. Seed Organizer (Prop Firm)
    console.log('📝 Seeding FTMO organizer...');
    const { error: organizerError } = await supabase
      .from('organizers')
      .upsert(ftmoOrganizer, { onConflict: 'id' });

    if (organizerError) {
      console.error('❌ Error seeding organizer:', organizerError);
      throw organizerError;
    }
    console.log('✅ FTMO organizer seeded');

    // 2. Seed Programs
    console.log('\n📝 Seeding FTMO programs...');
    const { error: programsError } = await supabase
      .from('programs')
      .upsert(ftmoPrograms, { onConflict: 'id' });

    if (programsError) {
      console.error('❌ Error seeding programs:', programsError);
      throw programsError;
    }
    console.log(`✅ ${ftmoPrograms.length} FTMO programs seeded`);

    // 3. Seed Offers
    console.log('\n📝 Seeding FTMO offers...');
    const { error: offersError } = await supabase
      .from('offers')
      .upsert(ftmoOffersWithIds, { onConflict: 'id' });

    if (offersError) {
      console.error('❌ Error seeding offers:', offersError);
      throw offersError;
    }
    console.log(`✅ ${ftmoOffersWithIds.length} FTMO offers seeded`);

    // 4. Seed Rulesets
    console.log('\n📝 Seeding FTMO rulesets...');
    const { error: rulesetsError } = await supabase
      .from('rulesets')
      .upsert(ftmoRulesets, { onConflict: 'program_id,phase_number' });

    if (rulesetsError) {
      console.error('❌ Error seeding rulesets:', rulesetsError);
      throw rulesetsError;
    }
    console.log(`✅ ${ftmoRulesets.length} FTMO rulesets seeded`);

    // 5. Seed Payout Terms
    console.log('\n📝 Seeding FTMO payout terms...');
    const { error: payoutError } = await supabase
      .from('payout_terms')
      .upsert(ftmoPayoutTerms, { onConflict: 'program_id' });

    if (payoutError) {
      console.error('❌ Error seeding payout terms:', payoutError);
      throw payoutError;
    }
    console.log(`✅ ${ftmoPayoutTerms.length} FTMO payout terms seeded`);

    // 6. Seed Market Access
    console.log('\n📝 Seeding FTMO market access...');
    const { error: marketError } = await supabase
      .from('market_access')
      .upsert(ftmoMarketAccess, { onConflict: 'program_id' });

    if (marketError) {
      console.error('❌ Error seeding market access:', marketError);
      throw marketError;
    }
    console.log(`✅ ${ftmoMarketAccess.length} FTMO market access records seeded`);

    console.log('\n✅ FTMO seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - 1 Organizer (FTMO)');
    console.log(`   - ${ftmoPrograms.length} Programs (Challenge, Swing, Trial)`);
    console.log(`   - ${ftmoOffersWithIds.length} Offers (all account sizes)`);
    console.log(`   - ${ftmoRulesets.length} Rulesets (phases)`);
    console.log(`   - ${ftmoPayoutTerms.length} Payout terms`);
    console.log(`   - ${ftmoMarketAccess.length} Market access records`);
    console.log('\n🎯 FTMO data is now live in the database!');

  } catch (error) {
    console.error('\n❌ FTMO seed failed:', error);
    process.exit(1);
  }
}

seedFTMOData();
