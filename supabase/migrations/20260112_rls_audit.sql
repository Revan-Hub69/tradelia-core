-- Migration: RLS Security Audit
-- Date: 2026-01-12
-- Description: Comprehensive RLS policies audit and fixes for enterprise security
-- Requirements: 4.1, 4.2 - Row Level Security on all user tables

-- ============================================
-- ENABLE RLS ON ALL USER TABLES
-- ============================================

-- Enable RLS on user_profiles (if not already enabled)
ALTER TABLE IF EXISTS user_profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on dashboard_configs (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboard_configs') THEN
    ALTER TABLE dashboard_configs ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Enable RLS on user_progress (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_progress') THEN
    ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Enable RLS on user_preferences (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_preferences') THEN
    ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ============================================
-- USER_PROFILES RLS POLICIES
-- ============================================

-- Drop existing policies to recreate with proper security
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- Policy: Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can only insert their own profile (on registration)
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can delete their own profile (account deletion)
CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  USING (auth.uid() = id);

-- Policy: Users can delete their own profile (account deletion)
CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================
-- DASHBOARD_CONFIGS RLS POLICIES (if table exists)
-- ============================================

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboard_configs') THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view own dashboard config" ON dashboard_configs;
    DROP POLICY IF EXISTS "Users can update own dashboard config" ON dashboard_configs;
    DROP POLICY IF EXISTS "Users can insert own dashboard config" ON dashboard_configs;
    DROP POLICY IF EXISTS "Users can delete own dashboard config" ON dashboard_configs;

    -- Policy: Users can only view their own dashboard config
    EXECUTE 'CREATE POLICY "Users can view own dashboard config"
      ON dashboard_configs
      FOR SELECT
      USING (auth.uid() = user_id)';

    -- Policy: Users can only update their own dashboard config
    EXECUTE 'CREATE POLICY "Users can update own dashboard config"
      ON dashboard_configs
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id)';

    -- Policy: Users can only insert their own dashboard config
    EXECUTE 'CREATE POLICY "Users can insert own dashboard config"
      ON dashboard_configs
      FOR INSERT
      WITH CHECK (auth.uid() = user_id)';

    -- Policy: Users can delete their own dashboard config
    EXECUTE 'CREATE POLICY "Users can delete own dashboard config"
      ON dashboard_configs
      FOR DELETE
      USING (auth.uid() = user_id)';
  END IF;
END $$;

-- ============================================
-- USER_PROGRESS RLS POLICIES (if table exists)
-- ============================================

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_progress') THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
    DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
    DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
    DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;

    -- Policy: Users can only view their own progress
    EXECUTE 'CREATE POLICY "Users can view own progress"
      ON user_progress
      FOR SELECT
      USING (auth.uid() = user_id)';

    -- Policy: Users can only update their own progress
    EXECUTE 'CREATE POLICY "Users can update own progress"
      ON user_progress
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id)';

    -- Policy: Users can only insert their own progress
    EXECUTE 'CREATE POLICY "Users can insert own progress"
      ON user_progress
      FOR INSERT
      WITH CHECK (auth.uid() = user_id)';

    -- Policy: Users can delete their own progress
    EXECUTE 'CREATE POLICY "Users can delete own progress"
      ON user_progress
      FOR DELETE
      USING (auth.uid() = user_id)';
  END IF;
END $$;

-- ============================================
-- USER_PREFERENCES RLS POLICIES (if table exists)
-- ============================================

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_preferences') THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
    DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
    DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
    DROP POLICY IF EXISTS "Users can delete own preferences" ON user_preferences;

    -- Policy: Users can only view their own preferences
    EXECUTE 'CREATE POLICY "Users can view own preferences"
      ON user_preferences
      FOR SELECT
      USING (auth.uid() = user_id)';

    -- Policy: Users can only update their own preferences
    EXECUTE 'CREATE POLICY "Users can update own preferences"
      ON user_preferences
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id)';

    -- Policy: Users can only insert their own preferences
    EXECUTE 'CREATE POLICY "Users can insert own preferences"
      ON user_preferences
      FOR INSERT
      WITH CHECK (auth.uid() = user_id)';

    -- Policy: Users can delete their own preferences
    EXECUTE 'CREATE POLICY "Users can delete own preferences"
      ON user_preferences
      FOR DELETE
      USING (auth.uid() = user_id)';
  END IF;
END $$;

-- ============================================
-- AUDIT COMMENTS
-- ============================================

COMMENT ON POLICY "Users can view own profile" ON user_profiles IS 
  'RLS Policy: Users can only SELECT their own profile row (auth.uid() = id). REQ 4.1, 4.2';

COMMENT ON POLICY "Users can update own profile" ON user_profiles IS 
  'RLS Policy: Users can only UPDATE their own profile row (auth.uid() = id). REQ 4.1, 4.2';

COMMENT ON POLICY "Users can insert own profile" ON user_profiles IS 
  'RLS Policy: Users can only INSERT their own profile row (auth.uid() = id). REQ 4.1, 4.2';

COMMENT ON POLICY "Users can delete own profile" ON user_profiles IS 
  'RLS Policy: Users can only DELETE their own profile row (auth.uid() = id). REQ 4.1, 4.2';

-- ============================================
-- VERIFICATION QUERY (for manual audit)
-- ============================================

-- Run this query to verify RLS is enabled on all user tables:
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE tablename IN ('user_profiles', 'dashboard_configs', 'user_progress', 'user_preferences');

-- Run this query to list all RLS policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('user_profiles', 'dashboard_configs', 'user_progress', 'user_preferences');
