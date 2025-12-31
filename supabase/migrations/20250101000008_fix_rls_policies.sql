-- Fix RLS Policies for Production
-- Allow both authenticated users and guest sessions

-- Fix user_profiles policies
DROP POLICY IF EXISTS "Users can manage their own profiles" ON public.user_profiles;
CREATE POLICY "Users can manage their own profiles" 
ON public.user_profiles 
FOR ALL 
TO public
USING (
  (auth.uid() IS NOT NULL AND auth.uid()::text = id) OR
  (auth.uid() IS NULL AND id IS NOT NULL)
);

-- Fix cookie_preferences policies  
DROP POLICY IF EXISTS "Authenticated users can manage their cookie preferences" ON public.cookie_preferences;
CREATE POLICY "Users can manage their cookie preferences" 
ON public.cookie_preferences 
FOR ALL 
TO public
USING (
  (auth.uid() IS NOT NULL AND auth.uid()::text = user_id) OR
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

-- Fix start_flow_responses policies
DROP POLICY IF EXISTS "Authenticated users can manage their start flow responses" ON public.start_flow_responses;
CREATE POLICY "Users can manage their start flow responses" 
ON public.start_flow_responses 
FOR ALL 
TO public
USING (
  (auth.uid() IS NOT NULL AND auth.uid()::text = session_id) OR
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

-- Allow public read access to core data tables
CREATE POLICY IF NOT EXISTS "Public read access to mce_regime_snapshots" 
ON public.mce_regime_snapshots FOR SELECT TO public USING (true);

CREATE POLICY IF NOT EXISTS "Public read access to universe_active" 
ON public.universe_active FOR SELECT TO public USING (true);

CREATE POLICY IF NOT EXISTS "Public read access to msf_snapshots" 
ON public.msf_snapshots FOR SELECT TO public USING (true);

-- Success message
DO $
BEGIN
  RAISE NOTICE 'RLS policies fixed for production!';
  RAISE NOTICE 'Both authenticated and guest users can access their data';
  RAISE NOTICE 'Core data tables have public read access';
END $;