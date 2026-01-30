import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

const VALID_PHASE_STATUSES = ['not_started', 'active', 'passed', 'failed'] as const;

/**
 * PATCH /api/enrollments/:id/phase
 * Update current phase for an enrollment
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { phaseNumber, phaseStatus, rulesetId } = body || {};

    const { data: enrollment, error: enrollmentError } = await supabase
      .from('user_enrollments')
      .select('status')
      .eq('id', id)
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    if (enrollment.status !== 'active') {
      return NextResponse.json(
        { error: 'Phase change allowed only for active enrollments' },
        { status: 400 },
      );
    }

    if (!Number.isInteger(phaseNumber) || phaseNumber < 1) {
      return NextResponse.json(
        { error: 'Invalid phaseNumber. Must be an integer >= 1.' },
        { status: 400 },
      );
    }

    const safeStatus = phaseStatus ?? 'active';
    if (!VALID_PHASE_STATUSES.includes(safeStatus)) {
      return NextResponse.json(
        { error: `Invalid phaseStatus. Must be one of: ${VALID_PHASE_STATUSES.join(', ')}` },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .rpc('set_enrollment_phase', {
        p_enrollment_id: id,
        p_phase_number: phaseNumber,
        p_phase_status: safeStatus,
        p_ruleset_id: rulesetId ?? null,
      })
      .single();

    if (error) {
      const message = error.message?.includes('Forbidden')
        ? 'Forbidden'
        : error.message || 'Failed to update phase';
      const status = message === 'Forbidden' ? 403 : 400;
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
