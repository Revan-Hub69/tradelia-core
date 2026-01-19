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
    
  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_profile')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
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
    
  if (error) throw error;
  return data;
};

// User Progress Operations
export const createUserProgress = async (userId: string, initialXP = 0) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_progress')
    .insert([{
      userId,
      totalXP: initialXP,
      level: Math.floor(initialXP / 100) + 1,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date().toISOString().split('T')[0],
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const getUserProgress = async (userId: string) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('userId', userId)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const updateUserProgress = async (userId: string, updates: any) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_progress')
    .update(updates)
    .eq('userId', userId)
    .select()
    .single();
    
  if (error) throw error;
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
    .eq('userId', lessonData.userId)
    .eq('lessonId', lessonData.lessonId)
    .single();
    
  if (existing) {
    throw new Error('Lesson already completed');
  }
  
  // Insert lesson completion
  const { data: completion, error: completionError } = await supabase
    .from('lesson_completion')
    .insert([{
      ...lessonData,
      approachesUsed: JSON.stringify(lessonData.approachesUsed || []),
    }])
    .select()
    .single();
    
  if (completionError) throw completionError;
  
  // Update user progress
  const currentProgress = await getUserProgress(lessonData.userId);
  if (currentProgress) {
    const newTotalXP = currentProgress.totalXP + lessonData.xpEarned;
    const newLevel = Math.floor(newTotalXP / 100) + 1;
    
    await updateUserProgress(lessonData.userId, {
      totalXP: newTotalXP,
      level: newLevel,
      lastActivityDate: new Date().toISOString().split('T')[0],
    });
  }
  
  return completion;
};

export const getUserLessonCompletions = async (userId: string) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('lesson_completion')
    .select('*')
    .eq('userId', userId)
    .order('completedAt', { ascending: false });
    
  if (error) throw error;
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
    .eq('userId', badgeData.userId)
    .eq('badgeId', badgeData.badgeId)
    .single();
    
  if (existing) {
    return existing; // Badge already awarded
  }
  
  const { data, error } = await supabase
    .from('user_badges')
    .insert([badgeData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const getUserBadges = async (userId: string) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_badges')
    .select('*')
    .eq('userId', userId)
    .order('unlockedAt', { ascending: false });
    
  if (error) throw error;
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