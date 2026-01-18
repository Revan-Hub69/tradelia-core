// Dashboard Types
// Based on design document specifications

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
  prerequisites: string[];
  modules: Module[];
  estimatedDuration: number; // minutes
  completionRate: number; // 0-100
  isLocked: boolean;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
  isLocked: boolean;
  completionRate: number;
  estimatedTime: number;
};

export type Lesson = {
  id: string;
  title: string;
  type: 'interactive' | 'video' | 'quiz' | 'practice';
  duration: number;
  xpReward: number;
  isCompleted: boolean;
  isUnlocked: boolean;
};

export type ProgressData = {
  overallProgress: number;
  pathProgress: Record<string, PathProgress>;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  nextRecommendedLesson?: string;
  totalStudyTime?: number;
  lastActivity?: Date;
  completedLessons?: string[];
};

export type PathProgress = {
  pathId: string;
  completionRate: number;
  currentModule: number;
  timeSpent: number;
  lastAccessed: Date;
};

export type GamificationData = {
  badges: Badge[];
  achievements: Achievement[];
  streakHistory: StreakEntry[];
  xpHistory: XPEntry[];
  leaderboardPosition?: number;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
};

export type StreakEntry = {
  date: Date;
  count: number;
};

export type XPEntry = {
  date: Date;
  amount: number;
  source: string;
};

export type UserSettings = {
  notifications: {
    email: boolean;
    push: boolean;
    dailyReminder: boolean;
    streakReminder: boolean;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    difficulty: 'adaptive' | 'beginner' | 'intermediate' | 'advanced';
    autoPlay: boolean;
  };
  privacy: {
    profileVisible: boolean;
    progressVisible: boolean;
    leaderboardVisible: boolean;
  };
};

export type DashboardState = {
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    subscription: 'free' | 'premium';
    subscriptionExpiry?: Date;
  };
  learningPaths: LearningPath[];
  progress: ProgressData;
  gamification: GamificationData;
  settings: UserSettings;
  ui: {
    isLoading: boolean;
    error?: string;
    activeSection: 'overview' | 'paths' | 'progress' | 'settings';
    isMobile: boolean;
  };
};

export type DashboardHeaderProps = {
  user: DashboardState['user'];
  currentStreak: number;
  totalXP: number;
  onSettingsClick: () => void;
  showGamification?: boolean;
};

export type LearningPathCardProps = {
  path: LearningPath;
  progress: number;
  isLocked: boolean;
  isPremium: boolean;
  onPathClick: (pathId: string) => void;
};

export type ProgressTrackerProps = {
  pathProgress: PathProgress[];
  overallProgress: number;
  nextRecommendedLesson?: Lesson;
};

export type GamificationPanelProps = {
  streak: number;
  xp: number;
  level: number;
  badges: Badge[];
  achievements: Achievement[];
  showLeaderboard?: boolean;
};