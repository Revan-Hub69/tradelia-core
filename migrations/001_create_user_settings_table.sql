-- Migration: Create user_settings table
-- Version: 001
-- Date: 2026-01-21
-- Description: User settings storage with versioning support

-- ============================================================================
-- Create user_settings table
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_settings (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key to user
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Settings JSON (UserSettingsV1)
  settings JSONB NOT NULL DEFAULT '{
    "version": 1,
    "appearance": {
      "theme": "system",
      "fontSize": 1,
      "density": "comfortable",
      "contrast": "normal",
      "motion": "full"
    },
    "preferences": {
      "language": "it",
      "difficulty": "adaptive",
      "autoPlay": true
    },
    "notifications": {
      "email": true,
      "push": true,
      "dailyReminder": false,
      "streakReminder": true
    },
    "privacy": {
      "profileVisible": true,
      "progressVisible": true,
      "leaderboardVisible": true
    }
  }'::jsonb,
  
  -- Server-authoritative timestamp
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Created timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Unique constraint: one settings record per user
  CONSTRAINT user_settings_user_id_key UNIQUE (user_id)
);

-- ============================================================================
-- Indexes
-- ============================================================================

-- Index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id 
  ON user_settings(user_id);

-- Index on updated_at for sync queries
CREATE INDEX IF NOT EXISTS idx_user_settings_updated_at 
  ON user_settings(updated_at DESC);

-- GIN index on settings JSONB for fast JSON queries
CREATE INDEX IF NOT EXISTS idx_user_settings_settings_gin 
  ON user_settings USING GIN (settings);

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own settings
CREATE POLICY "Users can read own settings"
  ON user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own settings
CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own settings
CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own settings
CREATE POLICY "Users can delete own settings"
  ON user_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- Triggers
-- ============================================================================

-- Trigger: Auto-update updated_at on row update
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_settings_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE user_settings IS 
  'User settings storage with versioning support (UserSettingsV1)';

COMMENT ON COLUMN user_settings.user_id IS 
  'Foreign key to auth.users';

COMMENT ON COLUMN user_settings.settings IS 
  'Settings JSON (UserSettingsV1 schema)';

COMMENT ON COLUMN user_settings.updated_at IS 
  'Server-authoritative timestamp (auto-updated on change)';

COMMENT ON COLUMN user_settings.created_at IS 
  'Record creation timestamp';

-- ============================================================================
-- Grant permissions
-- ============================================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON user_settings TO authenticated;
