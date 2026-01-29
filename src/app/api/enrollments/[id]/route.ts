import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

/**
 * PATCH /api/enrollments/:id
 * Update enrollment status (confirm, abandon, etc.)
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { status } = body;

    // Validation
    if (!status) {
      return NextResponse.json(
        { error: 'Missing required field: status' },
        { status: 400 },
      );
    }

    // Valid status transitions
    const validStatuses = [
      'interested',
      'pending_redirect',
      'pending_confirmation',
      'active',
      'completed',
      'failed',
      'abandoned',
      'archived',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 },
      );
    }

    // Get current enrollment to check ownership and current status
    const { data: enrollment, error: fetchError } = await supabase
      .from('user_enrollments')
      .select('id, user_id, status, program_id, offer_id')
      .eq('id', id)
      .single();

    if (fetchError || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 },
      );
    }

    // Check ownership
    if (enrollment.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 },
      );
    }

    // Define valid status transitions
    const validTransitions: Record<string, string[]> = {
      interested: ['pending_redirect', 'abandoned'],
      pending_redirect: ['pending_confirmation', 'abandoned'],
      pending_confirmation: ['active', 'abandoned'],
      active: ['completed', 'failed', 'abandoned'],
      completed: ['archived'],
      failed: ['archived'],
      abandoned: ['archived'],
      archived: [],
    };

    // Check if transition is valid
    const allowedTransitions = validTransitions[enrollment.status] || [];
    if (!allowedTransitions.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from '${enrollment.status}' to '${status}'`,
          allowedTransitions,
        },
        { status: 400 },
      );
    }

    // Update enrollment
    const updateData: Record<string, string> = { status };

    // Set appropriate timestamp based on status
    const now = new Date().toISOString();
    switch (status) {
      case 'pending_redirect':
        updateData.clicked_at = now;
        break;
      case 'pending_confirmation':
        updateData.redirected_at = now;
        break;
      case 'active':
        updateData.confirmed_at = now;
        updateData.started_at = now;
        break;
      case 'completed':
        updateData.completed_at = now;
        break;
      case 'failed':
        updateData.failed_at = now;
        break;
      case 'abandoned':
        updateData.abandoned_at = now;
        break;
      case 'archived':
        updateData.archived_at = now;
        break;
    }

    const { data: updatedEnrollment, error: updateError } = await supabase
      .from('user_enrollments')
      .update(updateData)
      .eq('id', id)
      .select('id, status, confirmed_at, started_at')
      .single();

    if (updateError) {
      console.error('Error updating enrollment:', updateError);
      return NextResponse.json(
        { error: 'Failed to update enrollment' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedEnrollment,
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
 * DELETE /api/enrollments/:id
 * Delete enrollment (only allowed for pending statuses)
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Get enrollment to check ownership and status
    const { data: enrollment, error: fetchError } = await supabase
      .from('user_enrollments')
      .select('id, user_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 },
      );
    }

    // Check ownership
    if (enrollment.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 },
      );
    }

    // Only allow deletion for pending statuses (and abandoned for cleanup)
    const deletableStatuses = ['interested', 'pending_redirect', 'pending_confirmation', 'abandoned'];
    if (!deletableStatuses.includes(enrollment.status)) {
      return NextResponse.json(
        {
          error: `Cannot delete enrollment with status '${enrollment.status}'`,
          message: 'Only pending enrollments can be deleted',
        },
        { status: 400 },
      );
    }

    // Delete enrollment
    const { error: deleteError } = await supabase
      .from('user_enrollments')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting enrollment:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete enrollment' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Enrollment deleted successfully',
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
