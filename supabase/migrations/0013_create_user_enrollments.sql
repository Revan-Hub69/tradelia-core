-- Migration: Create user_enrollments table for challenge enrollment flow
-- Created: 2026-01-28
-- Description: Tracks user challenge enrollments with status workflow

-- ============================================================================
-- ENUM TYPE: Enrollment Status
-- ============================================================================
CREATE TYPE enrollment_status AS ENUM (
  'interested',           -- User clicked but not confirmed
  'pending_redirect',     -- Enrollment saved, redirect pending
  'pending_confirmation', -- User returned, waiting for confirmation
  'active',               -- Challenge started, tracking active
  'completed',            -- Challenge passed successfully
  'failed',               -- Challenge failed
  'abandoned',            -- User didn't confirm within timeout
  'archived'              -- Archived after completion/failure
);

-- ============================================================================
-- TABLE: User Enrollments
-- ============================================================================
CREATE TABLE user_enrollments (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  offer_id TEXT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  
  -- Status
  status enrollment_status NOT NULL DEFAULT 'interested',
  
  -- Timestamps for status tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicked_at TIMESTAMP WITH TIME ZONE,           -- When user clicked "Start"
  redirected_at TIMESTAMP WITH TIME ZONE,        -- When redirected to external site
  confirmed_at TIMESTAMP WITH TIME ZONE,         -- When user confirmed start
  started_at TIMESTAMP WITH TIME ZONE,           -- When challenge actually started
  completed_at TIMESTAMP WITH TIME ZONE,         -- When challenge completed
  failed_at TIMESTAMP WITH TIME ZONE,            -- When challenge failed
  abandoned_at TIMESTAMP WITH TIME ZONE,         -- When marked as abandoned
  archived_at TIMESTAMP WITH TIME ZONE,          -- When archived
  
  -- Metadata for extensibility
  metadata JSONB DEFAULT '{}',
  
  -- Constraints
  UNIQUE(user_id, program_id, offer_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_enrollments_user_id ON user_enrollments(user_id);
CREATE INDEX idx_enrollments_status ON user_enrollments(status);
CREATE INDEX idx_enrollments_program_id ON user_enrollments(program_id);
CREATE INDEX idx_enrollments_user_status ON user_enrollments(user_id, status);
CREATE INDEX idx_enrollments_created_at ON user_enrollments(created_at);

-- Partial index for active/pending enrollments (most queried)
CREATE INDEX idx_enrollments_active ON user_enrollments(user_id, created_at) 
  WHERE status IN ('interested', 'pending_redirect', 'pending_confirmation', 'active');

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE user_enrollments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own enrollments
CREATE POLICY "Users can view own enrollments"
  ON user_enrollments FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own enrollments
CREATE POLICY "Users can create own enrollments"
  ON user_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own enrollments
CREATE POLICY "Users can update own enrollments"
  ON user_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can only delete pending enrollments
CREATE POLICY "Users can delete own pending enrollments"
  ON user_enrollments FOR DELETE
  USING (
    auth.uid() = user_id 
    AND status IN ('interested', 'pending_redirect', 'pending_confirmation')
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Update timestamps automatically based on status changes
CREATE OR REPLACE FUNCTION update_enrollment_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  -- Set clicked_at when status changes to pending_redirect
  IF NEW.status = 'pending_redirect' AND OLD.status = 'interested' THEN
    NEW.clicked_at = NOW();
  END IF;
  
  -- Set redirected_at when status changes from pending_redirect
  IF NEW.status = 'pending_confirmation' AND OLD.status = 'pending_redirect' THEN
    NEW.redirected_at = NOW();
  END IF;
  
  -- Set confirmed_at when status changes to active
  IF NEW.status = 'active' AND OLD.status = 'pending_confirmation' THEN
    NEW.confirmed_at = NOW();
    NEW.started_at = NOW();
  END IF;
  
  -- Set completed_at when status changes to completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  
  -- Set failed_at when status changes to failed
  IF NEW.status = 'failed' AND OLD.status != 'failed' THEN
    NEW.failed_at = NOW();
  END IF;
  
  -- Set abandoned_at when status changes to abandoned
  IF NEW.status = 'abandoned' AND OLD.status != 'abandoned' THEN
    NEW.abandoned_at = NOW();
  END IF;
  
  -- Set archived_at when status changes to archived
  IF NEW.status = 'archived' AND OLD.status != 'archived' THEN
    NEW.archived_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_enrollment_timestamps
  BEFORE UPDATE ON user_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_enrollment_timestamps();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Get user's active enrollments count
CREATE OR REPLACE FUNCTION get_user_active_enrollments_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  active_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO active_count
  FROM user_enrollments
  WHERE user_id = p_user_id
    AND status IN ('interested', 'pending_redirect', 'pending_confirmation', 'active');
  
  RETURN active_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user can create new enrollment (rate limiting)
CREATE OR REPLACE FUNCTION can_create_enrollment(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Check enrollments created in last 24 hours
  SELECT COUNT(*) INTO recent_count
  FROM user_enrollments
  WHERE user_id = p_user_id
    AND created_at > NOW() - INTERVAL '24 hours';
  
  -- Max 10 enrollments per day
  RETURN recent_count < 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE user_enrollments IS 'Tracks user challenge enrollments with full status workflow';
COMMENT ON COLUMN user_enrollments.status IS 'Current status in enrollment workflow: interested → pending_redirect → pending_confirmation → active → [completed|failed]';
COMMENT ON COLUMN user_enrollments.metadata IS 'JSONB field for extensible metadata (e.g., referral source, tracking params)';

-- ============================================================================
-- GRANTS
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON user_enrollments TO authenticated;
GRANT USAGE ON SEQUENCE user_enrollments_id_seq TO authenticated;
