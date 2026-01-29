-- Migration: Create my_challenges table for audit-ready MyChallenge blocks
-- Created: 2026-01-29
-- Description: Stores challenge_ref, account_state, context_lite, operating_envelope per enrollment

-- ============================================================================
-- TABLE: my_challenges
-- ============================================================================
CREATE TABLE IF NOT EXISTS my_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ownership + linkage
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES user_enrollments(id) ON DELETE CASCADE,

  -- Optional denormalized references (helpful for queries)
  program_id TEXT REFERENCES programs(id) ON DELETE SET NULL,
  offer_id TEXT REFERENCES offers(id) ON DELETE SET NULL,

  -- Audit blocks (JSONB for flexibility)
  challenge_ref JSONB NOT NULL DEFAULT '{}'::jsonb,
  account_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  context_lite JSONB NOT NULL DEFAULT '{}'::jsonb,
  operating_envelope JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, enrollment_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_my_challenges_user ON my_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_my_challenges_enrollment ON my_challenges(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_my_challenges_program ON my_challenges(program_id);

-- ============================================================================
-- RLS
-- ============================================================================
ALTER TABLE my_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own my_challenges"
  ON my_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own my_challenges"
  ON my_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own my_challenges"
  ON my_challenges FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own my_challenges"
  ON my_challenges FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_my_challenges_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

DROP TRIGGER IF EXISTS trigger_update_my_challenges_timestamp ON my_challenges;
CREATE TRIGGER trigger_update_my_challenges_timestamp
  BEFORE UPDATE ON my_challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_my_challenges_timestamp();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE my_challenges IS 'Audit-ready MyChallenge blocks linked to user enrollments';
COMMENT ON COLUMN my_challenges.challenge_ref IS 'Challenge reference block (challenge_id, account_size, started_at, rule snapshot)';
COMMENT ON COLUMN my_challenges.account_state IS 'Account state block (equity, drawdown, progress)';
COMMENT ON COLUMN my_challenges.context_lite IS 'Minimal context block (session, event risk, volatility hint)';
COMMENT ON COLUMN my_challenges.operating_envelope IS 'Decision envelope block (trade gate, risk budget, stop rules)';

-- ============================================================================
-- GRANTS
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON my_challenges TO authenticated;
