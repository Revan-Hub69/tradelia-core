-- Supabase Setup: COMPLETE RLS Policies (2026)
-- Run this in Supabase SQL Editor after running migrations
-- 
-- This file includes ALL RLS policies for complete security coverage:
-- - SELECT, INSERT, UPDATE, DELETE for all user tables
-- - Admin policies for learning_path
-- - Cascade deletes for GDPR compliance
-- - Performance indexes

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completion ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER PROFILE POLICIES (Complete: SELECT, INSERT, UPDATE, DELETE)
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profile;

-- SELECT: Users can view own profile
CREATE POLICY "Users can view own profile" ON user_profile
  FOR SELECT USING (auth.uid() = id);

-- INSERT: Users can insert own profile
CREATE POLICY "Users can insert own profile" ON user_profile
  FOR INSERT WITH CHECK (auth.uid() = id);

-- UPDATE: Users can update own profile
CREATE POLICY "Users can update own profile" ON user_profile
  FOR UPDATE USING (auth.uid() = id);

-- DELETE: Users can delete own profile (GDPR compliance)
CREATE POLICY "Users can delete own profile" ON user_profile
  FOR DELETE USING (auth.uid() = id);

-- ============================================================================
-- USER PROGRESS POLICIES (Complete: SELECT, INSERT, UPDATE, DELETE)
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;

-- SELECT: Users can view own progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid()::text = "user_id");

-- INSERT: Users can insert own progress
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid()::text = "user_id");

-- UPDATE: Users can update own progress
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid()::text = "user_id");

-- DELETE: Users can delete own progress (GDPR compliance)
CREATE POLICY "Users can delete own progress" ON user_progress
  FOR DELETE USING (auth.uid()::text = "user_id");

-- ============================================================================
-- LESSON COMPLETION POLICIES (Complete: SELECT, INSERT, UPDATE, DELETE)
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own completions" ON lesson_completion;
DROP POLICY IF EXISTS "Users can insert own completions" ON lesson_completion;
DROP POLICY IF EXISTS "Users can update own completions" ON lesson_completion;
DROP POLICY IF EXISTS "Users can delete own completions" ON lesson_completion;

-- SELECT: Users can view own completions
CREATE POLICY "Users can view own completions" ON lesson_completion
  FOR SELECT USING (auth.uid()::text = "user_id");

-- INSERT: Users can insert own completions
CREATE POLICY "Users can insert own completions" ON lesson_completion
  FOR INSERT WITH CHECK (auth.uid()::text = "user_id");

-- UPDATE: Users can update own completions (for corrections)
CREATE POLICY "Users can update own completions" ON lesson_completion
  FOR UPDATE USING (auth.uid()::text = "user_id");

-- DELETE: Users can delete own completions (GDPR compliance)
CREATE POLICY "Users can delete own completions" ON lesson_completion
  FOR DELETE USING (auth.uid()::text = "user_id");

-- ============================================================================
-- USER BADGES POLICIES (Complete: SELECT, INSERT, UPDATE, DELETE)
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own badges" ON user_badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON user_badges;
DROP POLICY IF EXISTS "Users can update own badges" ON user_badges;
DROP POLICY IF EXISTS "Users can delete own badges" ON user_badges;

-- SELECT: Users can view own badges
CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid()::text = "user_id");

-- INSERT: Users can insert own badges
CREATE POLICY "Users can insert own badges" ON user_badges
  FOR INSERT WITH CHECK (auth.uid()::text = "user_id");

-- UPDATE: Users can update own badges (for metadata)
CREATE POLICY "Users can update own badges" ON user_badges
  FOR UPDATE USING (auth.uid()::text = "user_id");

-- DELETE: Users can delete own badges (GDPR compliance)
CREATE POLICY "Users can delete own badges" ON user_badges
  FOR DELETE USING (auth.uid()::text = "user_id");

-- ============================================================================
-- LEARNING PATH POLICIES (Public read, Admin write)
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view learning paths" ON learning_path;
DROP POLICY IF EXISTS "Admins can insert learning paths" ON learning_path;
DROP POLICY IF EXISTS "Admins can update learning paths" ON learning_path;
DROP POLICY IF EXISTS "Admins can delete learning paths" ON learning_path;

-- SELECT: Public read access
CREATE POLICY "Anyone can view learning paths" ON learning_path
  FOR SELECT USING (true);

-- INSERT: Admin-only (via JWT custom claims)
CREATE POLICY "Admins can insert learning paths" ON learning_path
  FOR INSERT WITH CHECK (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- UPDATE: Admin-only (via JWT custom claims)
CREATE POLICY "Admins can update learning paths" ON learning_path
  FOR UPDATE USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- DELETE: Admin-only (via JWT custom claims)
CREATE POLICY "Admins can delete learning paths" ON learning_path
  FOR DELETE USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- ============================================================================
-- CASCADE DELETES (GDPR Compliance)
-- ============================================================================

-- When user_profile is deleted, cascade to all related tables
-- This ensures complete data deletion for GDPR compliance

-- user_progress: Cascade delete when profile is deleted
ALTER TABLE user_progress
  DROP CONSTRAINT IF EXISTS user_progress_user_id_fkey,
  ADD CONSTRAINT user_progress_user_id_fkey
    FOREIGN KEY ("user_id")
    REFERENCES user_profile(id)
    ON DELETE CASCADE;

-- lesson_completion: Cascade delete when profile is deleted
ALTER TABLE lesson_completion
  DROP CONSTRAINT IF EXISTS lesson_completion_user_id_fkey,
  ADD CONSTRAINT lesson_completion_user_id_fkey
    FOREIGN KEY ("user_id")
    REFERENCES user_profile(id)
    ON DELETE CASCADE;

-- user_badges: Cascade delete when profile is deleted
ALTER TABLE user_badges
  DROP CONSTRAINT IF EXISTS user_badges_user_id_fkey,
  ADD CONSTRAINT user_badges_user_id_fkey
    FOREIGN KEY ("user_id")
    REFERENCES user_profile(id)
    ON DELETE CASCADE;

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- User-based indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress("user_id");
CREATE INDEX IF NOT EXISTS idx_lesson_completion_user_id ON lesson_completion("user_id");
CREATE INDEX IF NOT EXISTS idx_lesson_completion_lesson_id ON lesson_completion("lesson_id");
CREATE INDEX IF NOT EXISTS idx_lesson_completion_completed_at ON lesson_completion("completed_at");
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges("user_id");
CREATE INDEX IF NOT EXISTS idx_learning_path_active ON learning_path("is_active") WHERE "is_active" = true;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_lesson_completion_user_lesson ON lesson_completion("user_id", "lesson_id");
CREATE INDEX IF NOT EXISTS idx_user_progress_xp_level ON user_progress("total_xp", "level");

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to automatically create user progress when profile is created
CREATE OR REPLACE FUNCTION create_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_progress ("user_id", "total_xp", "level", "current_streak", "longest_streak", "last_activity_date")
  VALUES (NEW.id, 0, 1, 0, 0, CURRENT_DATE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create progress when profile is created
DROP TRIGGER IF EXISTS on_profile_created ON user_profile;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON user_profile
  FOR EACH ROW EXECUTE FUNCTION create_user_progress();

-- Function to update user progress when lesson is completed
CREATE OR REPLACE FUNCTION update_user_progress_on_completion()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_progress 
  SET 
    "total_xp" = "total_xp" + NEW."xp_earned",
    "level" = FLOOR(("total_xp" + NEW."xp_earned") / 100) + 1,
    "last_activity_date" = CURRENT_DATE,
    "updated_at" = NOW()
  WHERE "user_id" = NEW."user_id";
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update progress when lesson is completed
DROP TRIGGER IF EXISTS on_lesson_completed ON lesson_completion;
CREATE TRIGGER on_lesson_completed
  AFTER INSERT ON lesson_completion
  FOR EACH ROW EXECUTE FUNCTION update_user_progress_on_completion();

-- ============================================================================
-- DEFAULT DATA
-- ============================================================================

-- Insert default learning path
INSERT INTO learning_path (id, title, description, difficulty, "is_premium", "estimated_duration", "lesson_order", prerequisites, "is_active")
VALUES (
  'base',
  'Percorso Fondamentale',
  'Fondamenti delle criptovalute: cosa sono, come funzionano, rischi e opportunità',
  'beginner',
  false,
  720, -- 12 hours (12 lessons * 60 min avg)
  '["lesson-0", "lesson-1", "lesson-2", "lesson-3", "lesson-4", "lesson-5", "lesson-6", "lesson-7", "lesson-8", "lesson-9", "lesson-10", "lesson-11"]',
  '[]',
  true
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries to verify RLS policies are working:

-- 1. Check all policies are created
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, cmd;

-- 2. Check cascade deletes are configured
-- SELECT
--   tc.table_name, 
--   kcu.column_name, 
--   ccu.table_name AS foreign_table_name,
--   ccu.column_name AS foreign_column_name,
--   rc.delete_rule
-- FROM information_schema.table_constraints AS tc 
-- JOIN information_schema.key_column_usage AS kcu
--   ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.constraint_column_usage AS ccu
--   ON ccu.constraint_name = tc.constraint_name
-- JOIN information_schema.referential_constraints AS rc
--   ON rc.constraint_name = tc.constraint_name
-- WHERE tc.constraint_type = 'FOREIGN KEY'
-- AND tc.table_schema = 'public';

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================

-- 1. Service Role Key:
--    - NEVER expose service role key to client
--    - Service role bypasses ALL RLS policies
--    - Use ONLY in server-side code (API routes, Edge Functions)

-- 2. Admin Access:
--    - Admin role is checked via JWT custom claims
--    - Set admin role in Supabase Auth user metadata
--    - Example: UPDATE auth.users SET raw_app_meta_data = '{"role": "admin"}' WHERE id = 'user-id';

-- 3. GDPR Compliance:
--    - DELETE policies allow users to delete their own data
--    - CASCADE deletes ensure complete data removal
--    - Implement "Delete Account" feature in UI

-- 4. Testing:
--    - Test all policies with different user roles
--    - Verify cross-user access is blocked
--    - Test admin operations with admin JWT
--    - Test cascade deletes work correctly

-- ============================================================================
-- END OF SETUP
-- ============================================================================
