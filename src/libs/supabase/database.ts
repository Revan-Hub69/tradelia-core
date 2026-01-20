import { createClient } from './client';

// User Profile Operations
export const createUserProfile = async (userData: {
  id: string;
  email: string;
  name?: string;
}) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profile')
    .insert([userData])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const getUserProfile = async (userId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profile')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  } // PGRST116 = no rows
  return data;
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profile')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

// User Progress Operations
export const createUserProgress = async (userId: string, initialXP = 0) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_progress')
    .insert([{
      user_id: userId,
      total_xp: initialXP,
      level: Math.floor(initialXP / 100) + 1,
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: new Date().toISOString().split('T')[0],
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const getUserProgress = async (userId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  return data;
};

export const updateUserProgress = async (userId: string, updates: any) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_progress')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

// Lesson Completion Operations
export const completeLessonForUser = async (lessonData: {
  userId: string;
  lessonId: string;
  pathId: string;
  xpEarned: number;
  approachesUsed?: string[];
  quizScore?: number;
  timeSpent?: number;
}) => {
  const supabase = createClient();

  // Check if lesson already completed
  const { data: existing } = await supabase
    .from('lesson_completion')
    .select('id')
    .eq('user_id', lessonData.userId)
    .eq('lesson_id', lessonData.lessonId)
    .single();

  if (existing) {
    throw new Error('Lesson already completed');
  }

  // Insert lesson completion
  const { data: completion, error: completionError } = await supabase
    .from('lesson_completion')
    .insert([{
      user_id: lessonData.userId,
      lesson_id: lessonData.lessonId,
      path_id: lessonData.pathId,
      xp_earned: lessonData.xpEarned,
      approaches_used: JSON.stringify(lessonData.approachesUsed || []),
      quiz_score: lessonData.quizScore,
      time_spent: lessonData.timeSpent,
    }])
    .select()
    .single();

  if (completionError) {
    throw completionError;
  }

  // Update user progress
  const currentProgress = await getUserProgress(lessonData.userId);
  if (currentProgress) {
    const newTotalXP = currentProgress.total_xp + lessonData.xpEarned;
    const newLevel = Math.floor(newTotalXP / 100) + 1;

    await updateUserProgress(lessonData.userId, {
      total_xp: newTotalXP,
      level: newLevel,
      last_activity_date: new Date().toISOString().split('T')[0],
    });
  }

  return completion;
};

export const getUserLessonCompletions = async (userId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('lesson_completion')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) {
    throw error;
  }
  return data || [];
};

// Badge Operations
export const awardBadgeToUser = async (badgeData: {
  userId: string;
  badgeId: string;
  badgeName: string;
  badgeDescription?: string;
  badgeIcon?: string;
  rarity: string;
}) => {
  const supabase = createClient();

  // Check if badge already awarded
  const { data: existing } = await supabase
    .from('user_badges')
    .select('id')
    .eq('user_id', badgeData.userId)
    .eq('badge_id', badgeData.badgeId)
    .single();

  if (existing) {
    return existing; // Badge already awarded
  }

  const { data, error } = await supabase
    .from('user_badges')
    .insert([{
      user_id: badgeData.userId,
      badge_id: badgeData.badgeId,
      badge_name: badgeData.badgeName,
      badge_description: badgeData.badgeDescription,
      badge_icon: badgeData.badgeIcon,
      rarity: badgeData.rarity,
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const getUserBadges = async (userId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) {
    throw error;
  }
  return data || [];
};

// Combined user data fetch
export const getCompleteUserData = async (userId: string) => {
  const [profile, progress, completions, badges] = await Promise.all([
    getUserProfile(userId),
    getUserProgress(userId),
    getUserLessonCompletions(userId),
    getUserBadges(userId),
  ]);

  return {
    profile,
    progress,
    completions,
    badges,
  };
};
