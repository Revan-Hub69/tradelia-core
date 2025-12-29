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

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_cookie_preferences_user ON public.cookie_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_cookie_preferences_session ON public.cookie_preferences(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions(user_id, last_active DESC);
CREATE INDEX IF NOT EXISTS idx_auth_events_user ON public.auth_events(user_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on new tables
ALTER TABLE public.cookie_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_events ENABLE ROW LEVEL SECURITY;

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

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp for new tables
CREATE TRIGGER update_cookie_preferences_updated_at BEFORE UPDATE ON public.cookie_preferences
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
$$ LANGUAGE plpgsql;;
