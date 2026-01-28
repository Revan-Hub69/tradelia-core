import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

/**
 * GET /api/enrollments
 * List user's enrollments with optional status filter
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Build query
    let query = supabase
      .from('user_enrollments')
      .select(`
        *,
        programs:program_id (
          id,
          name,
          organizer_name,
          official_url,
          category
        ),
        offers:offer_id (
          id,
          offer_name,
          account_size,
          account_currency,
          entry_fee,
          fee_currency
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    const status = searchParams.get('status');
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by multiple statuses
    const statuses = searchParams.get('statuses');
    if (statuses) {
      const statusList = statuses.split(',');
      query = query.in('status', statusList);
    }

    const { data: enrollments, error } = await query;

    if (error) {
      console.error('Error fetching enrollments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch enrollments' },
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
        createdAt: enrollment.created_at,
        clickedAt: enrollment.clicked_at,
        redirectedAt: enrollment.redirected_at,
        confirmedAt: enrollment.confirmed_at,
        startedAt: enrollment.started_at,
        program: {
          id: program?.id,
          name: program?.name,
          organizerName: program?.organizer_name,
          officialUrl: program?.official_url,
          category: program?.category,
        },
        offer: {
          id: offer?.id,
          name: offer?.offer_name,
          accountSize: offer?.account_size,
          accountCurrency: offer?.account_currency,
          entryFee: offer?.entry_fee,
          feeCurrency: offer?.fee_currency,
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

/**
 * POST /api/enrollments
 * Create a new enrollment
 */
export async function POST(request: Request) {
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

    // Parse request body
    const body = await request.json();
    const { programId, offerId } = body;

    // Validation
    if (!programId || !offerId) {
      return NextResponse.json(
        { error: 'Missing required fields: programId, offerId' },
        { status: 400 },
      );
    }

    // Check rate limit (max 10 enrollments per day)
    const { data: canCreate, error: rateError } = await supabase
      .rpc('can_create_enrollment', { p_user_id: user.id });

    if (rateError) {
      console.error('Rate limit check error:', rateError);
    }

    if (canCreate === false) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 10 enrollments per day.' },
        { status: 429 },
      );
    }

    // Check if enrollment already exists
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('user_enrollments')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('program_id', programId)
      .eq('offer_id', offerId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing enrollment:', checkError);
    }

    if (existingEnrollment) {
      // If already exists and not archived, return existing
      if (!['completed', 'failed', 'abandoned', 'archived'].includes(existingEnrollment.status)) {
        return NextResponse.json(
          {
            error: 'Enrollment already exists',
            data: { id: existingEnrollment.id, status: existingEnrollment.status },
          },
          { status: 409 },
        );
      }
    }

    // Get program details for official URL
    const { data: program, error: programError } = await supabase
      .from('programs')
      .select('official_url, name')
      .eq('id', programId)
      .single();

    if (programError || !program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 },
      );
    }

    // Create enrollment
    const { data: enrollment, error: insertError } = await supabase
      .from('user_enrollments')
      .insert({
        user_id: user.id,
        program_id: programId,
        offer_id: offerId,
        status: 'pending_redirect',
        clicked_at: new Date().toISOString(),
      })
      .select('id, status, program_id, offer_id')
      .single();

    if (insertError) {
      console.error('Error creating enrollment:', insertError);
      return NextResponse.json(
        { error: 'Failed to create enrollment' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: enrollment.id,
        status: enrollment.status,
        officialUrl: program.official_url,
        programName: program.name,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
