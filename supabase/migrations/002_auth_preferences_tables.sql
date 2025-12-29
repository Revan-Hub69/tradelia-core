-- ============================================
-- AUTH & PREFERENCES SYSTEM TABLES
-- ============================================

-- Add preferences column to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_active timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS created_via text DEFAULT 'email',
ADD COLUMN IF NOT EXISTS data_retention_days integer DEFAULT 365;

-- Cookie preferences table
CREATE TABLE IF NOT EXISTS public.cookie_preferences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id text, -- For guest users
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  essential boolean DEFAULT true,
  functional boolean DEFAULT false,
  analytics boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(session_id)
);

-- User sessions table for session management
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  device_info jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Auth events table for audit log (privacy-compliant)
CREATE TABLE IF NOT EXISTS public.auth_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type text NOT NULL,
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Start flow responses table (already exists but ensure it has session_id)
CREATE TABLE IF NOT EXISTS public.start_flow_responses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id text NOT NULL, -- Can be user ID or guest session ID
  mental_state text,
  cognitive_need text,
  suggested_path text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id)
);

-- Microlearning progress table (ensure it exists)
CREATE TABLE IF NOT EXISTS public.microlearning_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id text NOT NULL, -- Can be user ID or guest session ID
  lesson_id text NOT NULL,
  completed boolean DEFAULT false,
  completion_date timestamptz,
  time_spent_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id, lesson_id)
);

-- Platform checks table (ensure it exists)
CREATE TABLE IF NOT EXISTS public.platform_checks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id text NOT NULL, -- Can be user ID or guest session ID
  platform_name text NOT NULL,
  check_results jsonb NOT NULL,
  risk_score integer,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, platform_name)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_cookie_preferences_user ON public.cookie_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_cookie_preferences_session ON public.cookie_preferences(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions(user_id, last_active DESC);
CREATE INDEX IF NOT EXISTS idx_auth_events_user ON public.auth_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_start_flow_session ON public.start_flow_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_microlearning_session ON public.microlearning_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_platform_checks_session ON public.platform_checks(session_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on new tables
ALTER TABLE public.cookie_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.start_flow_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microlearning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_checks ENABLE ROW LEVEL SECURITY;

-- Cookie preferences policies
CREATE POLICY "Users can view own cookie preferences" ON public.cookie_preferences
  FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can manage own cookie preferences" ON public.cookie_preferences
  FOR ALL USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sessions" ON public.user_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Auth events policies (read-only for users)
CREATE POLICY "Users can view own auth events" ON public.auth_events
  FOR SELECT USING (auth.uid() = user_id);

-- Start flow responses policies (accessible by session_id)
CREATE POLICY "Users can view own start flow responses" ON public.start_flow_responses
  FOR SELECT USING (
    auth.uid()::text = session_id OR 
    session_id NOT LIKE '%-%-%-%-%' -- Allow guest sessions (non-UUID format)
  );

CREATE POLICY "Users can manage own start flow responses" ON public.start_flow_responses
  FOR ALL USING (
    auth.uid()::text = session_id OR 
    session_id NOT LIKE '%-%-%-%-%' -- Allow guest sessions (non-UUID format)
  );

-- Microlearning progress policies
CREATE POLICY "Users can view own microlearning progress" ON public.microlearning_progress
  FOR SELECT USING (
    auth.uid()::text = session_id OR 
    session_id NOT LIKE '%-%-%-%-%' -- Allow guest sessions
  );

CREATE POLICY "Users can manage own microlearning progress" ON public.microlearning_progress
  FOR ALL USING (
    auth.uid()::text = session_id OR 
    session_id NOT LIKE '%-%-%-%-%' -- Allow guest sessions
  );

-- Platform checks policies
CREATE POLICY "Users can view own platform checks" ON public.platform_checks
  FOR SELECT USING (
    auth.uid()::text = session_id OR 
    session_id NOT LIKE '%-%-%-%-%' -- Allow guest sessions
  );

CREATE POLICY "Users can manage own platform checks" ON public.platform_checks
  FOR ALL USING (
    auth.uid()::text = session_id OR 
    session_id NOT LIKE '%-%-%-%-%' -- Allow guest sessions
  );

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp for new tables
CREATE TRIGGER update_cookie_preferences_updated_at BEFORE UPDATE ON public.cookie_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_start_flow_responses_updated_at BEFORE UPDATE ON public.start_flow_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_microlearning_progress_updated_at BEFORE UPDATE ON public.microlearning_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to clean up expired guest data
CREATE OR REPLACE FUNCTION cleanup_expired_guest_data()
RETURNS void AS $$
BEGIN
  -- Delete guest data older than 30 days
  DELETE FROM public.start_flow_responses 
  WHERE session_id NOT LIKE '%-%-%-%-%' -- Guest sessions
    AND created_at < now() - interval '30 days';
    
  DELETE FROM public.microlearning_progress 
  WHERE session_id NOT LIKE '%-%-%-%-%' -- Guest sessions
    AND created_at < now() - interval '30 days';
    
  DELETE FROM public.platform_checks 
  WHERE session_id NOT LIKE '%-%-%-%-%' -- Guest sessions
    AND created_at < now() - interval '30 days';
    
  DELETE FROM public.cookie_preferences 
  WHERE session_id IS NOT NULL 
    AND user_id IS NULL 
    AND created_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup function (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-guest-data', '0 2 * * *', 'SELECT cleanup_expired_guest_data();');