import { createClient } from '@/libs/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('challenges')
      .select(`
        *,
        prop_firms (
          id,
          name,
          slug,
          reputation,
          logo_url,
          website_url
        )
      `)
      .eq('status', 'active')
      .order('popularity', { ascending: false });

    // Filters
    const isFree = searchParams.get('is_free');
    if (isFree === 'true') {
      query = query.eq('is_free', true);
    } else if (isFree === 'false') {
      query = query.eq('is_free', false);
    }

    const type = searchParams.get('type');
    if (type) {
      query = query.eq('type', type);
    }

    const challengeType = searchParams.get('challenge_type');
    if (challengeType) {
      query = query.eq('challenge_type', challengeType);
    }

    // Search
    const search = searchParams.get('search');
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching challenges:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform database response to match Challenge type interface
    const challenges = data?.map((challenge) => ({
      id: challenge.id,
      name: challenge.name,
      description: challenge.description || '',
      is_free: challenge.is_free,
      entry_fee: challenge.entry_fee,
      currency: challenge.currency || 'USD',
      refundable: challenge.refundable || false,
      account_size: challenge.account_size,
      scaling_potential: challenge.scaling_potential,
      profit_split: JSON.parse(challenge.profit_split || '{}'),
      rules: JSON.parse(challenge.rules || '{}'),
      payout_speed: challenge.payout_speed,
      first_payout_delay: challenge.first_payout_delay || 0,
      markets: JSON.parse(challenge.markets || '[]'),
      platforms: JSON.parse(challenge.platforms || '[]'),
      pros: JSON.parse(challenge.pros || '[]'),
      cons: JSON.parse(challenge.cons || '[]'),
      best_for: challenge.best_for || '',
      official_url: challenge.official_url || '',
      popularity: challenge.popularity || 0,
      success_rate: challenge.success_rate,
      prop_firms: {
        name: challenge.prop_firms?.name || '',
        logo_url: challenge.prop_firms?.logo_url || '',
        reputation: challenge.prop_firms?.reputation || 0,
        website_url: challenge.prop_firms?.website_url || '',
      },
    }));

    return NextResponse.json({
      success: true,
      data: challenges,
      count: challenges?.length || 0,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
