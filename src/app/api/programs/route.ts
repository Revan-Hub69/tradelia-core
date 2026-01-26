import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

/**
 * GET /api/programs
 *
 * Fetch all trading programs with their offers, rulesets, payout terms, and market access.
 * Handles missing data gracefully to prevent crashes.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Check if programs table exists by trying a simple query
    const { data: programs, error: programsError } = await supabase
      .from('programs')
      .select(`
        *,
        offers (*),
        rulesets (*),
        payout_terms (*),
        market_access (*)
      `)
      .order('created_at', { ascending: false });

    // Handle table not found error (migration not applied yet)
    if (programsError) {
      // Check if it's a "relation does not exist" error (table not found)
      if (programsError.message?.includes('relation') || programsError.message?.includes('does not exist')) {
        console.warn('Programs table not found - migration 0006 not applied yet');
        return NextResponse.json({
          success: true,
          data: [],
          message: 'Challenge library not initialized yet. Please run migrations.',
        });
      }

      console.error('Error fetching programs:', programsError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch programs' },
        { status: 500 },
      );
    }

    // Handle case where no programs exist
    if (!programs || programs.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No programs available yet',
      });
    }

    // Transform and validate data
    const transformedPrograms = programs.map((program) => {
      // Ensure offers array exists
      const offers = Array.isArray(program.offers) ? program.offers : [];

      // Ensure rulesets array exists and sort by phase
      const rulesets = Array.isArray(program.rulesets)
        ? program.rulesets.sort((a: any, b: any) => (a.phase_number || 0) - (b.phase_number || 0))
        : [];

      // Get phase 1 rules for permissions (fallback to empty object)
      const phase1Rules = rulesets.find((r: any) => r.phase_number === 1) || {};

      // Calculate KPIs from rulesets (with safe fallbacks)
      const kpis = {
        profit_target_phase1: rulesets[0]?.profit_target_pct || null,
        profit_target_phase2: rulesets[1]?.profit_target_pct || null,
        max_drawdown_pct: rulesets[0]?.max_drawdown_pct || null,
        max_daily_loss_pct: rulesets[0]?.max_daily_loss_pct || null,
        profit_split_max: program.payout_terms?.profit_split_max || null,
        min_trading_days: rulesets[0]?.min_trading_days || null,
        phase_count: rulesets.length || 1,
        first_payout_delay_days: program.payout_terms?.first_payout_delay_days || null,
        time_limit_common: rulesets[0]?.time_limit_days || null,
        freshness_days: 0, // TODO: Calculate from last_verified_at
        sources_count: 1, // TODO: Implement source tracking
      };

      // Extract permissions from phase 1 rules
      const permissions = {
        ea_allowed: phase1Rules.ea_allowed ?? undefined,
        news_trading: phase1Rules.news_trading ?? undefined,
        weekend_holding: phase1Rules.weekend_holding ?? undefined,
      };

      // Extract platforms from market_access
      const platforms = program.market_access?.platforms || [];

      return {
        program: {
          id: program.id,
          name: program.name || 'Unnamed Program',
          organizer_name: program.organizer_name || 'Unknown',
          category: program.category || 'paid_evaluation',
          subtype: program.subtype || 'demo',
          has_free_trial: program.has_free_trial || false,
          ruleset_mode: program.ruleset_mode || 'target_based',
          description: program.description || null,
          best_for: program.best_for || null,
          pros: program.pros || [],
          cons: program.cons || [],
        },
        offers: offers.map((offer: any) => ({
          id: offer.id,
          offer_name: offer.offer_name || 'Standard',
          account_size: offer.account_size || 0,
          account_currency: offer.account_currency || 'USD',
          entry_fee: offer.entry_fee,
          fee_currency: offer.fee_currency || 'USD',
          refundable: offer.refundable || false,
          is_featured: offer.is_featured || false,
          display_order: offer.display_order || 0,
          recurring: offer.recurring ?? true,
          next_edition_date: offer.next_edition_date || null,
          max_participants: offer.max_participants || null,
          scaling_max: offer.scaling_max || null,
          time_limit_days: offer.time_limit_days || null,
        })),
        rulesets: rulesets.map((ruleset: any) => ({
          phase_number: ruleset.phase_number || 1,
          profit_target_pct: ruleset.profit_target_pct || null,
          max_drawdown_pct: ruleset.max_drawdown_pct || null,
          max_drawdown_type: ruleset.max_drawdown_type || undefined,
          max_daily_loss_pct: ruleset.max_daily_loss_pct || null,
          max_daily_loss_type: ruleset.max_daily_loss_type || undefined,
          daily_loss_reset_time: ruleset.daily_loss_reset_time || undefined,
          min_trading_days: ruleset.min_trading_days || null,
          consistency_required: ruleset.consistency_required || undefined,
          best_day_max_pct: ruleset.best_day_max_pct || undefined,
          ea_allowed: ruleset.ea_allowed ?? undefined,
          news_trading: ruleset.news_trading ?? undefined,
          weekend_holding: ruleset.weekend_holding ?? undefined,
          max_position_size: ruleset.max_position_size || undefined,
          max_open_positions: ruleset.max_open_positions || undefined,
        })),
        payoutTerms: program.payout_terms ? {
          profit_split_initial: program.payout_terms.profit_split_initial || 0,
          profit_split_scaled: program.payout_terms.profit_split_scaled || undefined,
          profit_split_max: program.payout_terms.profit_split_max || 0,
          payout_frequency: program.payout_terms.payout_frequency || 'monthly',
          first_payout_delay_days: program.payout_terms.first_payout_delay_days || 0,
          eligible_after_phase: program.payout_terms.eligible_after_phase || 1,
          withdrawal_methods: program.payout_terms.withdrawal_methods || undefined,
          min_withdrawal: program.payout_terms.min_withdrawal || undefined,
          payout_processing_time_hours: program.payout_terms.payout_processing_time_hours || undefined,
        } : null,
        marketAccess: program.market_access ? {
          markets_available: program.market_access.markets_available || [],
          platforms: program.market_access.platforms || [],
          instruments_count: program.market_access.instruments_count || undefined,
          leverage_forex: program.market_access.leverage_forex || undefined,
          leverage_indices: program.market_access.leverage_indices || undefined,
          leverage_commodities: program.market_access.leverage_commodities || undefined,
          leverage_crypto: program.market_access.leverage_crypto || undefined,
          commission_forex: program.market_access.commission_forex || undefined,
          commission_indices: program.market_access.commission_indices || undefined,
          trading_hours: program.market_access.trading_hours || undefined,
        } : null,
        kpis,
        permissions,
        platforms,
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedPrograms,
      count: transformedPrograms.length,
    });
  } catch (error) {
    console.error('Unexpected error in /api/programs:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
