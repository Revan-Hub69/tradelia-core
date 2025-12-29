-- Dashboard tables for user progress tracking

-- Tabella per tracking progresso utente generale
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  section TEXT NOT NULL,
  step TEXT,
  data JSONB DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per start flow responses
CREATE TABLE IF NOT EXISTS start_flow_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  mental_state TEXT,
  cognitive_need TEXT,
  suggested_path TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per microlearning progress
CREATE TABLE IF NOT EXISTS microlearning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, lesson_id)
);

-- Tabella per platform checks salvati
CREATE TABLE IF NOT EXISTS platform_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  platform_name TEXT NOT NULL,
  check_data JSONB DEFAULT '{}',
  score INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_user_progress_session_id ON user_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_section ON user_progress(section);
CREATE INDEX IF NOT EXISTS idx_start_flow_session_id ON start_flow_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_microlearning_session_id ON microlearning_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_microlearning_lesson_id ON microlearning_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_platform_checks_session_id ON platform_checks(session_id);

-- Trigger per updated_at automatico
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Applicare trigger a tutte le tabelle
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_start_flow_updated_at ON start_flow_responses;
CREATE TRIGGER update_start_flow_updated_at
    BEFORE UPDATE ON start_flow_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_microlearning_updated_at ON microlearning_progress;
CREATE TRIGGER update_microlearning_updated_at
    BEFORE UPDATE ON microlearning_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_platform_checks_updated_at ON platform_checks;
CREATE TRIGGER update_platform_checks_updated_at
    BEFORE UPDATE ON platform_checks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();;
