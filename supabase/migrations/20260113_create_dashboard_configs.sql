-- ============================================
-- CREATE DASHBOARD_CONFIGS TABLE
-- ============================================
-- This table stores user dashboard configurations
-- Required for session continuity and user preferences

CREATE TABLE IF NOT EXISTS dashboard_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  last_journey TEXT,
  last_section TEXT,
  density TEXT DEFAULT 'comfortable',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one config per user
  CONSTRAINT unique_user_config UNIQUE (user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_dashboard_configs_user_id ON dashboard_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_configs_session_token ON dashboard_configs(session_token);

-- Enable RLS
ALTER TABLE dashboard_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own dashboard config"
  ON dashboard_configs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own dashboard config"
  ON dashboard_configs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own dashboard config"
  ON dashboard_configs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own dashboard config"
  ON dashboard_configs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_dashboard_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_dashboard_configs_updated_at
  BEFORE UPDATE ON dashboard_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_dashboard_configs_updated_at();
