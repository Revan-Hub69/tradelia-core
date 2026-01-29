/* eslint-disable no-console */
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://higkhlfjfhlecbtfnznx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZ2tobGZqZmhsZWNidGZuem54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ1Nzk5OSwiZXhwIjoyMDc4MDMzOTk5fQ.iOqVIFi-WxChkTNkc58fizixSfRcANohcG1A9ggtkjs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTop5Opportunities() {
  console.log('🚀 Adding TOP 5 Free Opportunities to Supabase...\n');

  // 1. Add Organizers
  console.log('📋 Step 1: Adding Organizers...');

  const organizers = [
    {
      id: 'the5ers',
      name: 'The5ers',
      organizer_type: 'prop_firm',
      website_url: 'https://the5ers.com',
      founded_year: 2016,
      headquarters: 'Israel',
      legal_status: 'active',
      reputation_score: 88,
      trustpilot_score: 4.6,
      logo_url: '/logos/the5ers.svg',
      notes: 'Prop firm with free competitions - Top 100 prizes',
    },
    {
      id: 'ninjatrader',
      name: 'NinjaTrader',
      organizer_type: 'platform',
      website_url: 'https://ninjatrader.com',
      founded_year: 2003,
      headquarters: 'Denver, USA',
      legal_status: 'active',
      reputation_score: 92,
      trustpilot_score: 4.5,
      logo_url: '/logos/ninjatrader.svg',
      notes: 'Futures trading platform with Arena competitions',
    },
    {
      id: 'fundednext',
      name: 'FundedNext',
      organizer_type: 'prop_firm',
      website_url: 'https://fundednext.com',
      founded_year: 2022,
      headquarters: 'Dubai, UAE',
      legal_status: 'active',
      reputation_score: 92,
      trustpilot_score: 4.4,
      logo_url: '/logos/fundednext.svg',
      notes: 'Top 4 prop firm with cash contests',
    },
    {
      id: 'xm',
      name: 'XM',
      organizer_type: 'broker',
      website_url: 'https://www.xm.com',
      founded_year: 2009,
      headquarters: 'Cyprus',
      legal_status: 'active',
      reputation_score: 87,
      trustpilot_score: 4.3,
      logo_url: '/logos/xm.svg',
      notes: 'Regulated forex broker with trading competitions',
    },
  ];

  for (const org of organizers) {
    const { error } = await supabase
      .from('organizers')
      .upsert(org, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Error adding ${org.name}:`, error.message);
    } else {
      console.log(`✅ Added/Updated: ${org.name}`);
    }
  }

  // 2. Add Programs
  console.log('\n📋 Step 2: Adding Programs...');

  const programs = [
    {
      id: 'the5ers-top100',
      organizer_id: 'the5ers',
      name: 'The5ers Top 100 Competition',
      category: 'free_competition',
      type: 'demo_contest',
      subtype: 'periodic',
      official_url: 'https://the5ers.com/competition',
      status: 'active',
      has_free_trial: false,
      ruleset_mode: 'ranking_based',
      description: 'Free trading competition - Top 100 win funded accounts from $5K to $100K',
      pros: JSON.stringify(['Funded account prizes', 'Up to $4M scaling', 'Up to 100% profit split']),
      cons: JSON.stringify(['High competition', 'Top 100 only']),
      best_for: 'Elite traders',
    },
    {
      id: 'ninjatrader-arena',
      organizer_id: 'ninjatrader',
      name: 'NinjaTrader Arena',
      category: 'free_competition',
      type: 'demo_contest',
      subtype: 'monthly',
      official_url: 'https://ninjatrader.com/arena',
      status: 'active',
      has_free_trial: false,
      ruleset_mode: 'ranking_based',
      description: 'Monthly futures trading competition with real cash prizes',
      pros: JSON.stringify(['Cash prizes', 'Professional platform', 'Real money rewards']),
      cons: JSON.stringify(['Futures complexity', 'High skill required']),
      best_for: 'Futures traders',
    },
    {
      id: 'tradingview-leap',
      organizer_id: 'tradingview',
      name: 'TradingView The Leap',
      category: 'free_competition',
      type: 'paper_trading',
      subtype: 'periodic',
      official_url: 'https://www.tradingview.com/the-leap/',
      status: 'active',
      has_free_trial: false,
      ruleset_mode: 'ranking_based',
      description: 'Paper trading competition with cash prizes up to $10,000 for 1st place',
      pros: JSON.stringify(['$10K first prize', 'Top 250 win', 'No risk', 'Monthly recurring']),
      cons: JSON.stringify(['High competition', '10K-50K participants']),
      best_for: 'All levels',
    },
    {
      id: 'fundednext-contest',
      organizer_id: 'fundednext',
      name: 'FundedNext Cash Contest',
      category: 'free_competition',
      type: 'demo_contest',
      subtype: 'periodic',
      official_url: 'https://fundednext.com/contests',
      status: 'active',
      has_free_trial: false,
      ruleset_mode: 'ranking_based',
      description: 'Demo contests with real cash prizes (not just funded accounts)',
      pros: JSON.stringify(['Real cash prizes', 'Top 4 prop firm', 'Reliable payouts']),
      cons: JSON.stringify(['Periodic only', 'Limited spots']),
      best_for: 'Serious traders',
    },
    {
      id: 'xm-competitions',
      organizer_id: 'xm',
      name: 'XM Trading Competitions',
      category: 'free_competition',
      type: 'demo_contest',
      subtype: 'periodic',
      official_url: 'https://www.xm.com/competitions',
      status: 'active',
      has_free_trial: false,
      ruleset_mode: 'ranking_based',
      description: 'Weekly and monthly demo contests with cash prizes $500-$10,000',
      pros: JSON.stringify(['Regulated broker', 'Frequent contests', 'Cash prizes']),
      cons: JSON.stringify(['Check T&C for withdrawal', 'KYC required']),
      best_for: 'Forex traders',
    },
  ];

  for (const prog of programs) {
    const { error } = await supabase
      .from('programs')
      .upsert(prog, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Error adding ${prog.name}:`, error.message);
    } else {
      console.log(`✅ Added/Updated: ${prog.name}`);
    }
  }

  // 3. Add Offers
  console.log('\n📋 Step 3: Adding Offers...');

  const offers = [
    {
      id: 'the5ers-top100-main',
      program_id: 'the5ers-top100',
      offer_name: 'Top 100 Competition',
      account_size: 100000,
      account_currency: 'USD',
      entry_fee: null,
      fee_currency: null,
      prize_pool: 500000,
      first_prize: 100000,
      current_participants: 0,
      recurring: false,
      frequency: 'one_time',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      registration_deadline: '2026-12-31',
      display_order: 1,
      is_featured: true,
      is_hot: true,
      refund_conditions: 'Free entry - no refund needed',
      scaling_conditions: 'Funded account prizes',
    },
    {
      id: 'ninjatrader-arena-monthly',
      program_id: 'ninjatrader-arena',
      offer_name: 'Monthly Arena',
      account_size: 100000,
      account_currency: 'USD',
      entry_fee: null,
      fee_currency: null,
      prize_pool: 50000,
      first_prize: 10000,
      current_participants: 0,
      recurring: true,
      frequency: 'monthly',
      start_date: '2026-02-01',
      end_date: '2026-02-28',
      registration_deadline: '2026-01-31',
      display_order: 2,
      is_featured: true,
      is_hot: true,
      refund_conditions: 'Free entry',
      scaling_conditions: 'Cash prizes paid monthly',
    },
    {
      id: 'tradingview-leap-feb2026',
      program_id: 'tradingview-leap',
      offer_name: 'The Leap February 2026',
      account_size: 100000,
      account_currency: 'USD',
      entry_fee: null,
      fee_currency: null,
      prize_pool: 100000,
      first_prize: 10000,
      current_participants: 0,
      recurring: true,
      frequency: 'monthly',
      start_date: '2026-02-01',
      end_date: '2026-02-28',
      registration_deadline: '2026-03-09',
      display_order: 3,
      is_featured: true,
      is_hot: true,
      refund_conditions: 'Free entry - zero catch',
      scaling_conditions: 'Top 500 win prizes',
    },
    {
      id: 'fundednext-cash-contest',
      program_id: 'fundednext-contest',
      offer_name: 'Cash Contest',
      account_size: 100000,
      account_currency: 'USD',
      entry_fee: null,
      fee_currency: null,
      prize_pool: 25000,
      first_prize: 5000,
      current_participants: 0,
      recurring: false,
      frequency: 'one_time',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      registration_deadline: '2026-12-31',
      display_order: 4,
      is_featured: true,
      is_hot: false,
      refund_conditions: 'Free entry',
      scaling_conditions: 'Real cash prizes',
    },
    {
      id: 'xm-demo-monthly',
      program_id: 'xm-competitions',
      offer_name: 'Monthly Demo Race',
      account_size: 10000,
      account_currency: 'USD',
      entry_fee: null,
      fee_currency: null,
      prize_pool: 15000,
      first_prize: 5000,
      current_participants: 0,
      recurring: true,
      frequency: 'monthly',
      start_date: '2026-02-01',
      end_date: '2026-02-28',
      registration_deadline: '2026-01-31',
      display_order: 5,
      is_featured: true,
      is_hot: false,
      refund_conditions: 'Free entry',
      scaling_conditions: 'Cash prizes',
    },
  ];

  for (const offer of offers) {
    const { error } = await supabase
      .from('offers')
      .upsert(offer, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Error adding ${offer.offer_name}:`, error.message);
    } else {
      console.log(`✅ Added/Updated: ${offer.offer_name} | First Prize: $${offer.first_prize}`);
    }
  }

  console.log('\n✅ TOP 5 Free Opportunities added successfully!');
  console.log('\n📊 Summary:');
  console.log('   1. The5ers Top 100 - $100K funded account prize');
  console.log('   2. NinjaTrader Arena - $10K monthly cash prize');
  console.log('   3. TradingView The Leap - $10K first prize (Top 500 win)');
  console.log('   4. FundedNext Cash Contest - $5K cash prize');
  console.log('   5. XM Trading Competitions - $5K monthly prize');
}

addTop5Opportunities().catch(console.error);
