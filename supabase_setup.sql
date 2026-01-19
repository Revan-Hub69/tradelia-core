-- Supabase Setup: RLS Policies and Indexes
-- Run this in Supabase SQL Editor after running migrations

-- Enable RLS on all tables
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completion ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path ENABLE ROW LEVEL SECURITY;

-- User Profile Policies
CREATE POLICY "Users can view own profile" ON user_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profile
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profile
  FOR UPDATE USING (auth.uid() = id);

-- User Progress Policies
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid()::text = "userId");

-- Lesson Completion Policies
CREATE POLICY "Users can view own completions" ON lesson_completion
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own completions" ON lesson_completion
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- User Badges Policies
CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own badges" ON user_badges
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Learning Path Policies (public read)
CREATE POLICY "Anyone can view learning paths" ON learning_path
  FOR SELECT USING (true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress("userId");
CREATE INDEX IF NOT EXISTS idx_lesson_completion_user_id ON lesson_completion("userId");
CREATE INDEX IF NOT EXISTS idx_lesson_completion_lesson_id ON lesson_completion("lessonId");
CREATE INDEX IF NOT EXISTS idx_lesson_completion_completed_at ON lesson_completion("completedAt");
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges("userId");
CREATE INDEX IF NOT EXISTS idx_learning_path_active ON learning_path("isActive") WHERE "isActive" = true;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_lesson_completion_user_lesson ON lesson_completion("userId", "lessonId");
CREATE INDEX IF NOT EXISTS idx_user_progress_xp_level ON user_progress("totalXP", "level");

-- Function to automatically create user progress when profile is created
CREATE OR REPLACE FUNCTION create_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_progress ("userId", "totalXP", "level", "currentStreak", "longestStreak", "lastActivityDate")
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
    "totalXP" = "totalXP" + NEW."xpEarned",
    "level" = FLOOR(("totalXP" + NEW."xpEarned") / 100) + 1,
    "lastActivityDate" = CURRENT_DATE,
    "updatedAt" = NOW()
  WHERE "userId" = NEW."userId";
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update progress when lesson is completed
DROP TRIGGER IF EXISTS on_lesson_completed ON lesson_completion;
CREATE TRIGGER on_lesson_completed
  AFTER INSERT ON lesson_completion
  FOR EACH ROW EXECUTE FUNCTION update_user_progress_on_completion();

-- Insert default learning path
INSERT INTO learning_path (id, title, description, difficulty, "isPremium", "estimatedDuration", "lessonOrder", prerequisites, "isActive")
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