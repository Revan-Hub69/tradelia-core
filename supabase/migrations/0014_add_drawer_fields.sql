-- Migration: Add missing fields for Enterprise Premium 2026 Drawer
-- Created: 2026-01-28
-- Description: Adds fields required for the complete drawer experience

-- ============================================================================
-- TABLE: programs - Add About section fields
-- ============================================================================
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS best_for TEXT,
ADD COLUMN IF NOT EXISTS pros TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cons TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS organizer_name TEXT;

-- ============================================================================
-- TABLE: competition_rules - Add Permissions fields
-- ============================================================================
ALTER TABLE competition_rules 
ADD COLUMN IF NOT EXISTS ea_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS news_trading BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS weekend_holding BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS max_position_size DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS max_open_positions INTEGER,
ADD COLUMN IF NOT EXISTS consistency_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS best_day_max_pct DECIMAL(5,2);

-- ============================================================================
-- INDEXES for new fields
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_programs_organizer ON programs(organizer_name);
CREATE INDEX IF NOT EXISTS idx_competition_rules_permissions ON competition_rules(ea_allowed, news_trading, weekend_holding);

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON COLUMN programs.best_for IS 'Target audience description (e.g., "Beginner traders", "Scalpers")';
COMMENT ON COLUMN programs.pros IS 'Array of program advantages for display';
COMMENT ON COLUMN programs.cons IS 'Array of program disadvantages for display';
COMMENT ON COLUMN programs.organizer_name IS 'Name of the prop firm or organizer';

COMMENT ON COLUMN competition_rules.ea_allowed IS 'Whether Expert Advisors / Trading Bots are allowed';
COMMENT ON COLUMN competition_rules.news_trading IS 'Whether trading during news events is allowed';
COMMENT ON COLUMN competition_rules.weekend_holding IS 'Whether positions can be held over weekends';
COMMENT ON COLUMN competition_rules.max_position_size IS 'Maximum position size in lots';
COMMENT ON COLUMN competition_rules.max_open_positions IS 'Maximum number of open positions allowed';
COMMENT ON COLUMN competition_rules.consistency_required IS 'Whether consistency rule applies';
COMMENT ON COLUMN competition_rules.best_day_max_pct IS 'Maximum percentage of profit from single day (consistency rule)';

-- ============================================================================
-- GRANTS
-- ============================================================================
GRANT SELECT, INSERT, UPDATE ON programs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON competition_rules TO authenticated;
