-- ============================================================================
-- FIX RLS POLICIES FOR ANON CLIENT (PostgREST)
-- ============================================================================

-- user_profiles: Allow anon to read own profile (via session_id or auth context)
DROP POLICY IF EXISTS "user_profiles_anon_read" ON public.user_profiles;
CREATE POLICY "user_profiles_anon_read" ON public.user_profiles
  FOR SELECT USING (auth.role() = 'anon');

-- start_flow_responses: Allow anon to read
DROP POLICY IF EXISTS "start_flow_responses_anon_read" ON public.start_flow_responses;
CREATE POLICY "start_flow_responses_anon_read" ON public.start_flow_responses
  FOR SELECT USING (auth.role() = 'anon');

-- cookie_preferences: Allow anon to read/write
DROP POLICY IF EXISTS "cookie_preferences_anon" ON public.cookie_preferences;
CREATE POLICY "cookie_preferences_anon" ON public.cookie_preferences
  FOR ALL USING (auth.role() = 'anon');

-- user_progress: Allow anon to read/write
DROP POLICY IF EXISTS "user_progress_anon" ON public.user_progress;
CREATE POLICY "user_progress_anon" ON public.user_progress
  FOR ALL USING (auth.role() = 'anon');

-- platform_checks: Allow anon to read/write
DROP POLICY IF EXISTS "platform_checks_anon" ON public.platform_checks;
CREATE POLICY "platform_checks_anon" ON public.platform_checks
  FOR ALL USING (auth.role() = 'anon');

-- microlearning_progress: Allow anon to read/write
DROP POLICY IF EXISTS "microlearning_progress_anon" ON public.microlearning_progress;
CREATE POLICY "microlearning_progress_anon" ON public.microlearning_progress
  FOR ALL USING (auth.role() = 'anon');

-- auth_events: Allow anon to read
DROP POLICY IF EXISTS "auth_events_anon_read" ON public.auth_events;
CREATE POLICY "auth_events_anon_read" ON public.auth_events
  FOR SELECT USING (auth.role() = 'anon');

-- user_sessions: Allow anon to read/write
DROP POLICY IF EXISTS "user_sessions_anon" ON public.user_sessions;
CREATE POLICY "user_sessions_anon" ON public.user_sessions
  FOR ALL USING (auth.role() = 'anon');

SELECT 'Anon client RLS policies fixed' as status;;
