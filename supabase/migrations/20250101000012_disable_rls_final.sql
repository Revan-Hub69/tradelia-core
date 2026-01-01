-- Disable RLS on public tables to allow anon access
-- This is safe for a public/educational dashboard

-- Disable RLS on cookie_preferences
ALTER TABLE public.cookie_preferences DISABLE ROW LEVEL SECURITY;

-- Disable RLS on user_profiles
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Disable RLS on start_flow_responses
ALTER TABLE public.start_flow_responses DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anon role for cookie_preferences
GRANT SELECT ON public.cookie_preferences TO anon;
GRANT INSERT ON public.cookie_preferences TO anon;
GRANT UPDATE ON public.cookie_preferences TO anon;
GRANT DELETE ON public.cookie_preferences TO anon;

-- Grant permissions to anon role for user_profiles
GRANT SELECT ON public.user_profiles TO anon;
GRANT INSERT ON public.user_profiles TO anon;
GRANT UPDATE ON public.user_profiles TO anon;
GRANT DELETE ON public.user_profiles TO anon;

-- Grant permissions to anon role for start_flow_responses
GRANT SELECT ON public.start_flow_responses TO anon;
GRANT INSERT ON public.start_flow_responses TO anon;
GRANT UPDATE ON public.start_flow_responses TO anon;
GRANT DELETE ON public.start_flow_responses TO anon;

-- Verify the changes
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('cookie_preferences', 'user_profiles', 'start_flow_responses');
