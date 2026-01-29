-- Migration: Allow deleting abandoned enrollments
-- Created: 2026-01-29

-- Update delete policy to include abandoned status
DROP POLICY IF EXISTS "Users can delete own pending enrollments" ON user_enrollments;

CREATE POLICY "Users can delete own pending enrollments"
  ON user_enrollments FOR DELETE
  USING (
    auth.uid() = user_id
    AND status IN ('interested', 'pending_redirect', 'pending_confirmation', 'abandoned')
  );
