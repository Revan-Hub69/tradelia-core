import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

/**
 * GET /api/enrollments/pending
 * Get enrollments waiting for user confirmation (pending_confirmation status)
 * Used by PostRedirectBanner to show confirmation prompt
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Get pending confirmation enrollments (user returned from external site)
    const { data: enrollments, error } = await supabase
      .from('user_enrollments')
      .select(`
        id,
        status,
        redirected_at,
        programs:program_id (
          id,
          name,
          official_url
        ),
        offers:offer_id (
          id,
          offer_name,
          account_size,
          account_currency
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'pending_confirmation')
      .order('redirected_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending enrollments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch pending enrollments' },
        { status: 500 },
      );
    }

    // Transform data for frontend
    const transformedEnrollments = enrollments?.map((enrollment) => {
      const program = Array.isArray(enrollment.programs)
        ? enrollment.programs[0]
        : enrollment.programs;
      const offer = Array.isArray(enrollment.offers)
        ? enrollment.offers[0]
        : enrollment.offers;

      return {
        id: enrollment.id,
        status: enrollment.status,
        redirectedAt: enrollment.redirected_at,
        program: {
          id: program?.id,
          name: program?.name,
          officialUrl: program?.official_url,
        },
        offer: {
          id: offer?.id,
          name: offer?.offer_name,
          accountSize: offer?.account_size,
          accountCurrency: offer?.account_currency,
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedEnrollments,
      count: transformedEnrollments?.length || 0,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
