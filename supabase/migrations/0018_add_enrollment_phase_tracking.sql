-- Migration: Add phase tracking to user_enrollments
-- Created: 2026-01-30
-- Description: Stores current phase + phase history, plus RPC to change phase

-- ============================================================================
-- ENUM TYPE: Challenge Phase Status
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE challenge_phase_status AS ENUM (
    'not_started',
    'active',
    'passed',
    'failed'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- TABLE: user_enrollments - Add phase tracking columns
-- ============================================================================
ALTER TABLE user_enrollments
  ADD COLUMN IF NOT EXISTS current_phase_number INTEGER,
  ADD COLUMN IF NOT EXISTS current_phase_status challenge_phase_status DEFAULT 'not_started',
  ADD COLUMN IF NOT EXISTS current_phase_started_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS current_phase_completed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS current_ruleset_id TEXT REFERENCES rulesets(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS phase_updated_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS phase_history JSONB DEFAULT '[]'::jsonb;

ALTER TABLE user_enrollments
  ALTER COLUMN current_phase_number SET DEFAULT 1;

-- Backfill defaults for existing rows
UPDATE user_enrollments
SET current_phase_number = COALESCE(current_phase_number, 1),
    current_phase_status = COALESCE(
      current_phase_status,
      CASE
        WHEN status = 'active' THEN 'active'::challenge_phase_status
        ELSE 'not_started'::challenge_phase_status
      END
    )
WHERE current_phase_number IS NULL
   OR current_phase_status IS NULL;

-- ============================================================================
-- FUNCTION: set_enrollment_phase
-- ============================================================================
CREATE OR REPLACE FUNCTION set_enrollment_phase(
  p_enrollment_id UUID,
  p_phase_number INTEGER,
  p_phase_status challenge_phase_status,
  p_ruleset_id TEXT DEFAULT NULL
) RETURNS user_enrollments AS $$
DECLARE
  v_enrollment user_enrollments;
  v_history JSONB;
  v_started_at TIMESTAMPTZ;
BEGIN
  SELECT * INTO v_enrollment
  FROM user_enrollments
  WHERE id = p_enrollment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enrollment not found';
  END IF;

  IF v_enrollment.user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  v_history := COALESCE(v_enrollment.phase_history, '[]'::jsonb);
  v_started_at := v_enrollment.current_phase_started_at;

  IF v_enrollment.current_phase_number IS NOT NULL
     AND p_phase_number <> v_enrollment.current_phase_number THEN
    v_history := v_history || jsonb_build_object(
      'phase_number', v_enrollment.current_phase_number,
      'phase_status', v_enrollment.current_phase_status,
      'ruleset_id', v_enrollment.current_ruleset_id,
      'started_at', v_enrollment.current_phase_started_at,
      'ended_at', now()
    );
    v_started_at := now();
  ELSIF v_started_at IS NULL AND p_phase_status = 'active' THEN
    v_started_at := now();
  END IF;

  UPDATE user_enrollments
  SET current_phase_number = p_phase_number,
      current_phase_status = p_phase_status,
      current_ruleset_id = COALESCE(p_ruleset_id, current_ruleset_id),
      current_phase_started_at = v_started_at,
      current_phase_completed_at = CASE
        WHEN p_phase_status IN ('passed', 'failed') THEN now()
        ELSE NULL
      END,
      phase_updated_at = now(),
      phase_history = v_history
  WHERE id = p_enrollment_id
  RETURNING * INTO v_enrollment;

  RETURN v_enrollment;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION set_enrollment_phase(UUID, INTEGER, challenge_phase_status, TEXT) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON COLUMN user_enrollments.current_phase_number IS 'Current phase number (1..N)';
COMMENT ON COLUMN user_enrollments.current_phase_status IS 'Current phase status';
COMMENT ON COLUMN user_enrollments.current_phase_started_at IS 'When current phase started';
COMMENT ON COLUMN user_enrollments.current_phase_completed_at IS 'When current phase completed/failed';
COMMENT ON COLUMN user_enrollments.current_ruleset_id IS 'Ruleset linked to current phase';
COMMENT ON COLUMN user_enrollments.phase_updated_at IS 'Last phase update timestamp';
COMMENT ON COLUMN user_enrollments.phase_history IS 'JSON history of completed phase snapshots';
