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
  FOR SELECT USING (auth.uid()::text = "user_id");

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid()::text = "user_id");

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid()::text = "user_id");

-- Lesson Completion Policies
CREATE POLICY "Users can view own completions" ON lesson_completion
  FOR SELECT USING (auth.uid()::text = "user_id");

CREATE POLICY "Users can insert own completions" ON lesson_completion
  FOR INSERT WITH CHECK (auth.uid()::text = "user_id");

-- User Badges Policies
CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid()::text = "user_id");

CREATE POLICY "Users can insert own badges" ON user_badges
  FOR INSERT WITH CHECK (auth.uid()::text = "user_id");

-- Learning Path Policies (public read)
CREATE POLICY "Anyone can view learning paths" ON learning_path
  FOR SELECT USING (true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress("user_id");
CREATE INDEX IF NOT EXISTS idx_lesson_completion_user_id ON lesson_completion("user_id");
CREATE INDEX IF NOT EXISTS idx_lesson_completion_lesson_id ON lesson_completion("lesson_id");
CREATE INDEX IF NOT EXISTS idx_lesson_completion_completed_at ON lesson_completion("completed_at");
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges("user_id");
CREATE INDEX IF NOT EXISTS idx_learning_path_active ON learning_path("is_active") WHERE "is_active" = true;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_lesson_completion_user_lesson ON lesson_completion("user_id", "lesson_id");
CREATE INDEX IF NOT EXISTS idx_user_progress_xp_level ON user_progress("total_xp", "level");

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