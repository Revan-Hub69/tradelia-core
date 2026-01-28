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
  organizer_type: 'prop_firm',
  website_url: 'https://ftmo.com',
  founded_year: 2015,
  headquarters: 'Prague, Czech Republic',
  legal_status: 'active',
  reputation_score: 96,
  trustpilot_score: 4.6,
  trustpilot_reviews: 15000,
  trustpilot_updated_at: new Date('2026-01-26'),
  total_paid_out: 150000000,
  total_paid_currency: 'USD',
  active_traders: 25000,
};

// ============================================
// FTMO PROGRAMS (Challenge Types)
// ============================================
const ftmoPrograms = [
  {
    id: 'ftmo-challenge',
    organizer_id: 'ftmo',
    name: 'FTMO Challenge',
    category: 'paid_evaluation',
    type: 'prop_challenge',
    subtype: '2_step',
    description: 'FTMO\'s flagship 2-step evaluation. Pass Phase 1 (10% profit target) and Phase 2 (5% profit target) to get funded. Industry-leading reputation with bi-weekly payouts.',
    best_for: 'Serious traders ready to invest in evaluation and follow strict rules',
    pros: JSON.stringify(['Excellent reputation', 'Refundable fee', 'Scaling to $2M', 'Multiple platforms', 'Bi-weekly payouts', 'No time limit on Verification']),
    cons: JSON.stringify(['Strict consistency rule', '5-10% pass rate', 'No weekend holding']),
    official_url: 'https://ftmo.com/en/evaluation/',
    status: 'active',
    has_free_trial: true,
    free_trial_description: 'Free demo account to practice before purchasing challenge',
    free_trial_url: 'https://ftmo.com/en/free-trial/',
  },
  {
    id: 'ftmo-trial',
    organizer_id: 'ftmo',
    name: 'FTMO Free Trial',
    category: 'free_competition',
    type: 'paper_trading',
    subtype: 'trial',
    description: 'FTMO Free Trial - Test the platform with $100,000 virtual account for 14 days. No credit card required. Experience FTMO rules and platform before purchasing a real challenge.',
    best_for: 'Traders wanting to test FTMO platform and rules before investing',
    pros: JSON.stringify(['Completely FREE', 'No credit card required', '$100K virtual account', 'Real FTMO conditions', 'Test all platforms']),
    cons: JSON.stringify(['No real funding', 'No payouts', 'Must pass to be meaningful', 'Same strict rules']),
    official_url: 'https://ftmo.com/en/free-trial/',
    status: 'active',
    has_free_trial: false,
  },
];

// ============================================
// FTMO OFFERS (Account Sizes with Pricing)
// ============================================
const ftmoOffers = [
  // FTMO Challenge - All Sizes
  { program_id: 'ftmo-challenge', account_size: 10000, entry_fee: 155, display_order: 1 },
  { program_id: 'ftmo-challenge', account_size: 25000, entry_fee: 250, display_order: 2 },
  { program_id: 'ftmo-challenge', account_size: 50000, entry_fee: 345, display_order: 3 },
  { program_id: 'ftmo-challenge', account_size: 100000, entry_fee: 540, display_order: 4 },
  { program_id: 'ftmo-challenge', account_size: 200000, entry_fee: 1080, display_order: 5 },
  // FTMO Trial - Free
  { program_id: 'ftmo-trial', account_size: 100000, entry_fee: null, display_order: 1 },
];

// Generate offer IDs and add common fields
const ftmoOffersWithIds = ftmoOffers.map((offer, index) => ({
  id: `ftmo-offer-${index + 1}`,
  ...offer,
  offer_name: `$${offer.account_size.toLocaleString()} Account`,
  account_currency: 'USD',
  fee_currency: 'EUR',
  refundable: offer.program_id !== 'ftmo-trial',
  refund_conditions: offer.program_id !== 'ftmo-trial' ? 'Refunded with first profit split' : null,
  is_featured: offer.account_size === 100000,
  scaling_max: offer.program_id !== 'ftmo-trial' ? 2000000 : null,
  recurring: true,
  frequency: 'always_open',
  min_age: 18,
  kyc_required: true,
}));

// ============================================
// FTMO RULESETS (Trading Rules per Phase)
// ============================================
const ftmoRulesets = [
  // FTMO Challenge - Phase 1
  {
    id: 'ftmo-challenge-p1',
    offer_id: 'ftmo-offer-1',
    phase_number: 1,
    phase_name: 'Challenge Phase',
    ruleset_mode: 'target_based',
    profit_target_pct: 10,
    max_drawdown_pct: 10,
    max_drawdown_type: 'trailing',
    max_daily_loss_pct: 5,
    max_daily_loss_type: 'equity_based',
    min_trading_days: 4,
    consistency_required: true,
    best_day_max_pct: 30,
    ea_allowed: true,
    ea_allowed_known: true,
    news_trading: true,
    news_trading_known: true,
    weekend_holding: false,
    weekend_holding_known: true,
  },
  // FTMO Challenge - Phase 2
  {
    id: 'ftmo-challenge-p2',
    offer_id: 'ftmo-offer-1',
    phase_number: 2,
    phase_name: 'Verification Phase',
    ruleset_mode: 'target_based',
    profit_target_pct: 5,
    max_drawdown_pct: 10,
    max_drawdown_type: 'trailing',
    max_daily_loss_pct: 5,
    max_daily_loss_type: 'equity_based',
    min_trading_days: 4,
    consistency_required: true,
    best_day_max_pct: 30,
    ea_allowed: true,
    ea_allowed_known: true,
    news_trading: true,
    news_trading_known: true,
    weekend_holding: false,
    weekend_holding_known: true,
  },
  // FTMO Trial - Phase 1 (Single Phase)
  {
    id: 'ftmo-trial-p1',
    offer_id: 'ftmo-offer-11',
    phase_number: 1,
    phase_name: 'Trial Phase',
    ruleset_mode: 'target_based',
    profit_target_pct: 10,
    max_drawdown_pct: 10,
    max_drawdown_type: 'trailing',
    max_daily_loss_pct: 5,
    max_daily_loss_type: 'equity_based',
    min_trading_days: 4,
    consistency_required: true,
    best_day_max_pct: 30,
    ea_allowed: true,
    ea_allowed_known: true,
    news_trading: true,
    news_trading_known: true,
    weekend_holding: false,
    weekend_holding_known: true,
  },
];

// ============================================
// FTMO PAYOUT TERMS
// ============================================
const ftmoPayoutTerms = [
  // Challenge and Swing have same payout terms
  {
    id: 'ftmo-challenge-payout',
    offer_id: 'ftmo-offer-1',
    profit_split_initial_pct: 80,
    profit_split_scaled_pct: 90,
    profit_split_max_pct: 90,
    payout_frequency: 'bi_weekly',
    first_payout_delay_days: 14,
    eligible_after_phase: 2,
    withdrawal_methods: JSON.stringify(['bank', 'paypal', 'crypto', 'wise']),
    payout_processing_time_hours: 48,
  },
  // Trial has no payouts
  {
    id: 'ftmo-trial-payout',
    offer_id: 'ftmo-offer-11',
    profit_split_initial_pct: 0,
    profit_split_scaled_pct: null,
    profit_split_max_pct: 0,
    payout_frequency: null,
    first_payout_delay_days: null,
    eligible_after_phase: null,
  },
];

// ============================================
// FTMO MARKET ACCESS
// ============================================
const ftmoMarketAccess = [
  {
    id: 'ftmo-challenge-market',
    offer_id: 'ftmo-offer-1',
    markets_available: JSON.stringify(['forex', 'indices', 'commodities', 'crypto', 'stocks']),
    platforms: JSON.stringify(['MT4', 'MT5', 'cTrader', 'DXtrade']),
    instruments_count: 1000,
    leverage_forex: '1:100',
    leverage_indices: '1:20',
    leverage_commodities: '1:20',
    leverage_crypto: '1:2',
    commission_forex: 0,
    commission_type: 'per_lot',
    trading_hours: '24/5 Forex, Exchange hours for indices',
  },
  {
    id: 'ftmo-trial-market',
    offer_id: 'ftmo-offer-11',
    markets_available: JSON.stringify(['forex', 'indices', 'commodities', 'crypto', 'stocks']),
    platforms: JSON.stringify(['MT4', 'MT5', 'cTrader', 'DXtrade']),
    instruments_count: 1000,
    leverage_forex: '1:100',
    leverage_indices: '1:20',
    leverage_commodities: '1:20',
    leverage_crypto: '1:2',
    commission_forex: 0,
    commission_type: 'per_lot',
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
      .upsert(ftmoRulesets, { onConflict: 'id' });

    if (rulesetsError) {
      console.error('❌ Error seeding rulesets:', rulesetsError);
      throw rulesetsError;
    }
    console.log(`✅ ${ftmoRulesets.length} FTMO rulesets seeded`);

    // 5. Seed Payout Terms
    console.log('\n📝 Seeding FTMO payout terms...');
    const { error: payoutError } = await supabase
      .from('payout_terms')
      .upsert(ftmoPayoutTerms, { onConflict: 'id' });

    if (payoutError) {
      console.error('❌ Error seeding payout terms:', payoutError);
      throw payoutError;
    }
    console.log(`✅ ${ftmoPayoutTerms.length} FTMO payout terms seeded`);

    // 6. Seed Market Access
    console.log('\n📝 Seeding FTMO market access...');
    const { error: marketError } = await supabase
      .from('market_access')
      .upsert(ftmoMarketAccess, { onConflict: 'id' });

    if (marketError) {
      console.error('❌ Error seeding market access:', marketError);
      throw marketError;
    }
    console.log(`✅ ${ftmoMarketAccess.length} FTMO market access records seeded`);

    console.log('\n✅ FTMO seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - 1 Organizer (FTMO)');
    console.log(`   - ${ftmoPrograms.length} Programs (Challenge, Trial)`);
    console.log(`   - ${ftmoOffersWithIds.length} Offers (Challenge sizes)`);
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
