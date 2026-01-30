-- Migration: Create open_positions table for active trades per enrollment
-- Created: 2026-01-30
-- Description: Stores open positions linked to user enrollments

-- ============================================================================
-- TABLE: open_positions
-- ============================================================================
CREATE TABLE IF NOT EXISTS open_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ownership + linkage
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES user_enrollments(id) ON DELETE CASCADE,
  program_id TEXT REFERENCES programs(id) ON DELETE SET NULL,
  offer_id TEXT REFERENCES offers(id) ON DELETE SET NULL,

  -- Position details
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('long', 'short')),
  size NUMERIC(18, 6) NOT NULL,
  entry_price NUMERIC(18, 6),
  opened_at TIMESTAMP WITH TIME ZONE,
  stop_loss NUMERIC(18, 6),
  take_profit NUMERIC(18, 6),
  unrealized_pnl NUMERIC(18, 6),
  notional_value NUMERIC(18, 6),
  leverage NUMERIC(10, 4),
  broker_position_id TEXT,
  is_open BOOLEAN DEFAULT true,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_open_positions_user ON open_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_open_positions_enrollment ON open_positions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_open_positions_open ON open_positions(is_open);
CREATE INDEX IF NOT EXISTS idx_open_positions_symbol ON open_positions(symbol);

-- ============================================================================
-- RLS
-- ============================================================================
ALTER TABLE open_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own open_positions"
  ON open_positions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own open_positions"
  ON open_positions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own open_positions"
  ON open_positions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own open_positions"
  ON open_positions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_open_positions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

DROP TRIGGER IF EXISTS trigger_update_open_positions_timestamp ON open_positions;
CREATE TRIGGER trigger_update_open_positions_timestamp
  BEFORE UPDATE ON open_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_open_positions_timestamp();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE open_positions IS 'Open positions linked to user enrollments for correlation checks';
COMMENT ON COLUMN open_positions.is_open IS 'Whether the position is currently open';

-- ============================================================================
-- GRANTS
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON open_positions TO authenticated;
