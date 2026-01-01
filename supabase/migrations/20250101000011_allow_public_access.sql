-- Allow public (unauthenticated) access to dashboard tables
-- This is for the public trading dashboard

-- Disable RLS on tables that should be publicly accessible
ALTER TABLE cookie_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE start_flow_responses DISABLE ROW LEVEL SECURITY;

-- Grant public read access to these tables
GRANT SELECT ON cookie_preferences TO anon;
GRANT SELECT ON user_profiles TO anon;
GRANT SELECT ON start_flow_responses TO anon;

-- If you want to keep RLS but allow public access, use these policies instead:
-- (Uncomment if you prefer RLS with public policies)

-- CREATE POLICY "Allow public read on cookie_preferences"
-- ON cookie_preferences FOR SELECT
-- USING (true);

-- CREATE POLICY "Allow public read on user_profiles"
-- ON user_profiles FOR SELECT
-- USING (true);

-- CREATE POLICY "Allow public read on start_flow_responses"
-- ON start_flow_responses FOR SELECT
-- USING (true);
