import { createClient } from '@/libs/supabase/server';
import { NextResponse } from 'next/server';

// Prop Firms Data
const propFirms = [
  {
    id: 'tradingview',
    name: 'TradingView',
    slug: 'tradingview',
    founded: 2011,
    total_paid: 5000000,
    reputation: 98,
    logo_url: '/assets/logos/tradingview.svg',
    website_url: 'https://www.tradingview.com',
    description: 'Leading charting platform with free paper trading competitions'
  },
  {
    id: 'deriv',
    name: 'Deriv',
    slug: 'deriv',
    founded: 2000,
    total_paid: 10000000,
    reputation: 95,
    logo_url: '/assets/logos/deriv.svg',
    website_url: 'https://deriv.com',
    description: 'Online broker with ongoing free trading tournaments'
  },
  {
    id: 'gateio',
    name: 'Gate.io',
    slug: 'gateio',
    founded: 2013,
    total_paid: 50000000,
    reputation: 92,
    logo_url: '/assets/logos/gateio.svg',
    website_url: 'https://www.gate.io',
    description: 'Crypto exchange with demo trading challenges'
  },
  {
    id: 'ftmo',
    name: 'FTMO',
    slug: 'ftmo',
    founded: 2015,
    total_paid: 150000000,
    reputation: 96,
    logo_url: '/assets/logos/ftmo.svg',
    website_url: 'https://ftmo.com',
    description: 'Leading prop firm with 2-step evaluation'
  },
  {
    id: 'fundednext',
    name: 'FundedNext',
    slug: 'fundednext',
    founded: 2022,
    total_paid: 20000000,
    reputation: 94,
    logo_url: '/assets/logos/fundednext.svg',
    website_url: 'https://fundednext.com',
    description: 'Fast-growing prop firm with flexible challenges'
  }
];

// Challenges Data (sample - add more as needed)
const challenges = [
  {
    id: 'tradingview-leap-feb-2026',
    slug: 'tradingview-leap-feb-2026',
    name: 'TradingView The Leap - February 2026',
    prop_firm_id: 'tradingview',
    type: 'free_competition',
    challenge_type: 'competition',
    is_free: true,
    account_size: 100000,
    profit_split: JSON.stringify({ initial: 100 }),
    rules: JSON.stringify({
      minTradingDays: 3,
      timeLimit: 28
    }),
    payout_speed: 'instant',
    first_payout_delay: 0,
    markets: JSON.stringify(['forex', 'futures', 'crypto', 'stocks']),
    platforms: JSON.stringify(['TradingView Paper Trading']),
    status: 'active',
    start_date: '2026-02-10',
    end_date: '2026-03-09',
    recurring: true,
    frequency: 'quarterly',
    description: 'The Leap is TradingView\'s flagship paper trading competition with $1M+ prize pool.',
    pros: JSON.stringify(['Zero cost', 'Top 500 win', '$100K virtual capital']),
    cons: JSON.stringify(['High competition', 'Aggressive trading needed']),
    best_for: 'Traders wanting to test aggressive strategies risk-free',
    official_url: 'https://www.tradingview.com/the-leap/february-2026/',
    popularity: 98,
    success_rate: 5
  }
];

export async function POST() {
  try {
    const supabase = await createClient();

    // Insert prop firms
    const { error: firmsError } = await supabase
      .from('prop_firms')
      .upsert(propFirms, { onConflict: 'id' });

    if (firmsError) {
      return NextResponse.json({ error: firmsError.message }, { status: 500 });
    }

    // Insert challenges
    const { error: challengesError } = await supabase
      .from('challenges')
      .upsert(challenges, { onConflict: 'id' });

    if (challengesError) {
      return NextResponse.json({ error: challengesError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Seed completed',
      data: {
        propFirms: propFirms.length,
        challenges: challenges.length
      }
    });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
