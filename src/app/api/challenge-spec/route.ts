import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const enrollmentId = searchParams.get('enrollmentId');

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Missing enrollmentId' }, { status: 400 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: enrollment, error: enrollmentError } = await supabase
      .from('user_enrollments')
      .select('id, user_id, program_id, offer_id, status')
      .eq('id', enrollmentId)
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    if (enrollment.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: rulesets, error: rulesetError } = await supabase
      .from('rulesets')
      .select('*')
      .eq('offer_id', enrollment.offer_id)
      .order('phase_number', { ascending: true });

    if (rulesetError) {
      return NextResponse.json({ error: 'Failed to fetch rulesets' }, { status: 500 });
    }

    const { data: competitionRules } = await supabase
      .from('competition_rules')
      .select('*')
      .eq('program_id', enrollment.program_id)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      data: {
        enrollment,
        rulesets: rulesets ?? [],
        competitionRules: competitionRules ?? null,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
