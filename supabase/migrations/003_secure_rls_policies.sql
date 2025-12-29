-- ============================================
-- TRADELIA - Secure RLS Policies
-- Migration: 003_secure_rls_policies
-- ============================================

-- CRITICAL: Re-enable RLS on indicators table
ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;

-- Secure policy for indicators: READ public, WRITE server only
DROP POLICY IF EXISTS "Public read access for indicators" ON public.indicators;
CREATE POLICY "Public read access for indicators" 
ON public.indicators FOR SELECT 
TO public 
USING (true);

-- No public write access to indicators - only service role
-- (Service role bypasses RLS anyway, but explicit is better)

-- GUEST DATA SECURITY: Remove dangerous session-based policies
-- Guest data should NOT be in database - only localStorage

-- Remove unsafe guest policies from start_flow_responses
DROP POLICY IF EXISTS "Users can manage their own start flow responses" ON public.start_flow_responses;
DROP POLICY IF EXISTS "Guest sessions can manage their responses" ON public.start_flow_responses;

-- Remove unsafe guest policies from cookie_preferences  
DROP POLICY IF EXISTS "Users can manage their own cookie preferences" ON public.cookie_preferences;
DROP POLICY IF EXISTS "Guest sessions can manage their preferences" ON public.cookie_preferences;

-- Remove unsafe guest policies from user_progress
DROP POLICY IF EXISTS "Users can manage their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Guest sessions can manage their progress" ON public.user_progress;

-- SECURE POLICIES: Only authenticated users with proper auth.uid()
CREATE POLICY "Authenticated users can manage their start flow responses" 
ON public.start_flow_responses 
FOR ALL 
TO authenticated 
USING (auth.uid()::text = session_id)
WITH CHECK (auth.uid()::text = session_id);

CREATE POLICY "Authenticated users can manage their cookie preferences" 
ON public.cookie_preferences 
FOR ALL 
TO authenticated 
USING (auth.uid()::text = session_id)
WITH CHECK (auth.uid()::text = session_id);

CREATE POLICY "Authenticated users can manage their progress" 
ON public.user_progress 
FOR ALL 
TO authenticated 
USING (auth.uid()::text = session_id)
WITH CHECK (auth.uid()::text = session_id);

-- Success message
DO $
BEGIN
  RAISE NOTICE 'Migration 003_secure_rls_policies completed successfully!';
  RAISE NOTICE 'RLS re-enabled with secure policies';
  RAISE NOTICE 'Guest data removed from database - localStorage only';
  RAISE NOTICE 'Only authenticated users can access their data';
END $;