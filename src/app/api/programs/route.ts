import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

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
    // NOTE: rulesets, payout_terms, market_access are linked to offers, not programs
    const { data: programs, error: programsError } = await supabase
      .from('programs')
      .select(`
        *,
        offers (
          *,
          rulesets (*),
          payout_terms (*),
          market_access (*)
        )
      `)
      .order('created_at', { ascending: false });

    // Debug logging
    logger.debug('Programs query result:', {
      programsCount: programs?.length,
      hasError: !!programsError,
      errorMessage: programsError?.message,
      firstProgram: programs?.[0]?.id,
    });

    // Handle table not found error (migration not applied yet)
    if (programsError) {
      // Check if it's a "relation does not exist" error (table not found)
      if (programsError.message?.includes('relation') || programsError.message?.includes('does not exist')) {
        logger.warn('Programs table not found - migration 0006 not applied yet');
        return NextResponse.json({
          success: true,
          data: [],
          message: 'Challenge library not initialized yet. Please run migrations.',
        });
      }

      logger.error('Error fetching programs:', programsError);
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

      const mapRuleset = (ruleset: any, offerId: string) => ({
        offer_id: ruleset.offer_id || offerId,
        phase_number: ruleset.phase_number || 1,
        phase_name: ruleset.phase_name || null,
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
      });

      const mapPayoutTerms = (payout: any) => ({
        profit_split_initial: payout?.profit_split_initial ?? payout?.profit_split_initial_pct ?? 0,
        profit_split_scaled: payout?.profit_split_scaled ?? payout?.profit_split_scaled_pct ?? undefined,
        profit_split_max: payout?.profit_split_max ?? payout?.profit_split_max_pct ?? 0,
        payout_frequency: payout?.payout_frequency || 'monthly',
        first_payout_delay_days: payout?.first_payout_delay_days ?? 0,
        eligible_after_phase: payout?.eligible_after_phase ?? 1,
        withdrawal_methods: payout?.withdrawal_methods || undefined,
        min_withdrawal: payout?.min_withdrawal || undefined,
        payout_processing_time_hours: payout?.payout_processing_time_hours || undefined,
      });

      const mappedOffers = offers.map((offer: any) => {
        const offerRulesets = Array.isArray(offer.rulesets) ? offer.rulesets : [];
        const payoutTermsArray = Array.isArray(offer.payout_terms) ? offer.payout_terms : [];
        const marketAccessArray = Array.isArray(offer.market_access) ? offer.market_access : [];
        const payoutTerms = payoutTermsArray[0] ? mapPayoutTerms(payoutTermsArray[0]) : null;

        return {
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
          current_participants: offer.current_participants || 0,
          prize_pool: offer.prize_pool || null,
          first_prize: offer.first_prize || null,
          start_date: offer.start_date || null,
          end_date: offer.end_date || null,
          registration_deadline: offer.registration_deadline || null,
          frequency: offer.frequency || 'always_open',
          scaling_max: offer.scaling_max || null,
          time_limit_days: offer.time_limit_days || null,
          rulesets: offerRulesets.map((ruleset: any) => mapRuleset(ruleset, offer.id)),
          payout_terms: payoutTerms,
          market_access: marketAccessArray[0] || null,
        };
      });

      // Collect all rulesets from all offers
      const allRulesets = mappedOffers.flatMap((offer: any) =>
        Array.isArray(offer.rulesets) ? offer.rulesets : [],
      ).sort((a: any, b: any) => (a.phase_number || 0) - (b.phase_number || 0));

      // Default offer for KPIs/permissions
      const defaultOffer = mappedOffers.find((offer: any) => offer.is_featured)
        || [...mappedOffers].sort((a: any, b: any) => (a.entry_fee || 0) - (b.entry_fee || 0))[0]
        || mappedOffers[0];

      const defaultRulesets = defaultOffer?.rulesets?.length ? defaultOffer.rulesets : allRulesets;
      const defaultPayoutTerms = defaultOffer?.payout_terms || null;
      const defaultMarketAccess = defaultOffer?.market_access || null;

      // Get phase 1 rules for permissions (fallback to empty object)
      const phase1Rules = defaultRulesets.find((r: any) => r.phase_number === 1) || {};

      // Calculate KPIs from rulesets (with safe fallbacks)
      const kpis = {
        profit_target_phase1: defaultRulesets[0]?.profit_target_pct || null,
        profit_target_phase2: defaultRulesets[1]?.profit_target_pct || null,
        max_drawdown_pct: defaultRulesets[0]?.max_drawdown_pct || null,
        max_daily_loss_pct: defaultRulesets[0]?.max_daily_loss_pct || null,
        profit_split_max: defaultPayoutTerms?.profit_split_max || null,
        min_trading_days: defaultRulesets[0]?.min_trading_days || null,
        phase_count: defaultRulesets.length || 1,
        first_payout_delay_days: defaultPayoutTerms?.first_payout_delay_days || null,
        time_limit_common: defaultRulesets[0]?.time_limit_days || null,
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
      const platforms = defaultMarketAccess?.platforms || [];

      // Parse pros/cons from JSON string if needed
      const parseStringArray = (value: any): string[] => {
        if (Array.isArray(value)) {
 return value;
}
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return value ? [value] : [];
          }
        }
        return [];
      };

      return {
        program: {
          id: program.id,
          name: program.name || 'Unnamed Program',
          organizer_name: program.organizer_name || 'Unknown',
          category: program.category || 'paid_evaluation',
          subtype: program.subtype || 'demo',
          has_free_trial: program.has_free_trial || false,
          ruleset_mode: program.ruleset_mode || 'target_based',
          status: program.status || 'active',
          description: program.description || null,
          best_for: program.best_for || null,
          pros: parseStringArray(program.pros),
          cons: parseStringArray(program.cons),
          official_url: program.official_url || null,
        },
        offers: mappedOffers,
        rulesets: allRulesets.map((ruleset: any) => ({
          offer_id: ruleset.offer_id || undefined,
          phase_number: ruleset.phase_number || 1,
          phase_name: ruleset.phase_name || null,
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
        payoutTerms: defaultPayoutTerms ? {
          profit_split_initial: defaultPayoutTerms.profit_split_initial || 0,
          profit_split_scaled: defaultPayoutTerms.profit_split_scaled || undefined,
          profit_split_max: defaultPayoutTerms.profit_split_max || 0,
          payout_frequency: defaultPayoutTerms.payout_frequency || 'monthly',
          first_payout_delay_days: defaultPayoutTerms.first_payout_delay_days || 0,
          eligible_after_phase: defaultPayoutTerms.eligible_after_phase || 1,
          withdrawal_methods: defaultPayoutTerms.withdrawal_methods || undefined,
          min_withdrawal: defaultPayoutTerms.min_withdrawal || undefined,
          payout_processing_time_hours: defaultPayoutTerms.payout_processing_time_hours || undefined,
        } : null,
        marketAccess: defaultMarketAccess ? {
          markets_available: defaultMarketAccess.markets_available || [],
          platforms: defaultMarketAccess.platforms || [],
          instruments_count: defaultMarketAccess.instruments_count || undefined,
          leverage_forex: defaultMarketAccess.leverage_forex || undefined,
          leverage_indices: defaultMarketAccess.leverage_indices || undefined,
          leverage_commodities: defaultMarketAccess.leverage_commodities || undefined,
          leverage_crypto: defaultMarketAccess.leverage_crypto || undefined,
          commission_forex: defaultMarketAccess.commission_forex || undefined,
          commission_indices: defaultMarketAccess.commission_indices || undefined,
          trading_hours: defaultMarketAccess.trading_hours || undefined,
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
    logger.error('Unexpected error in /api/programs:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
