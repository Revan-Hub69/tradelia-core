/*
 * DASHBOARD DATA FETCHING - PHASE 3A IMPLEMENTATION
 *
 * Tier 1 Research Implementation:
 * - React cache() pattern (Next.js Official)
 * - Parallel Promise.all() fetching (Vercel Best Practices)
 * - Preload pattern for critical data (React 19)
 * - Server Components optimization (Next.js 15)
 *
 * Expected Impact: -300ms loading time, better UX
 */

import { cache } from 'react';

// ✅ TIER 1 TYPES - Production ready
export type UserData = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscription: 'free' | 'premium' | 'enterprise';
  progress: {
    pathName: string;
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
    currentLesson?: string;
    estimatedTimeToComplete?: string;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
};

export type DashboardStats = {
  streak: number;
  xp: number;
  level: number;
  nextMilestone: string;
  weeklyGoal: {
    target: number;
    completed: number;
    percentage: number;
  };
  achievements: {
    total: number;
    recent: string[];
  };
};

export type RecentActivity = {
  id: string;
  type: 'lesson_completed' | 'achievement' | 'streak' | 'milestone' | 'quiz_passed';
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: {
    score?: number;
    duration?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
};

export type NotificationData = {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
};

// ✅ TIER 1 PATTERN: React cache() for request memoization
export const getUserData = cache(async (userId?: string): Promise<UserData | null> => {
  if (!userId) {
    return null;
  }

  // Simulate realistic API call with proper error handling
  try {
    await new Promise(resolve => setTimeout(resolve, 120)); // Realistic DB query time

    return {
      id: userId,
      name: 'Marco Rossi',
      email: 'marco.rossi@example.com',
      avatar: '/avatars/user-1.jpg',
      subscription: 'premium',
      progress: {
        pathName: 'Crypto Fundamentals Pro',
        completedLessons: 7,
        totalLessons: 15,
        progressPercentage: 47,
        currentLesson: 'DeFi Protocols Deep Dive',
        estimatedTimeToComplete: '2 weeks',
      },
      preferences: {
        language: 'it',
        theme: 'dark',
        notifications: true,
      },
    };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
});

export const getDashboardStats = cache(async (userId: string): Promise<DashboardStats> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 90));

    // Use userId for future database queries

    return {
      streak: 12,
      xp: 2850,
      level: 5,
      nextMilestone: 'Complete Advanced Trading module',
      weeklyGoal: {
        target: 5,
        completed: 3,
        percentage: 60,
      },
      achievements: {
        total: 18,
        recent: ['Crypto Expert', 'Week Warrior', 'Quiz Master'],
      },
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
});

export const getRecentActivity = cache(async (userId: string): Promise<RecentActivity[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 70));

    // Use userId for future database queries

    return [
      {
        id: '1',
        type: 'lesson_completed',
        title: 'Completed: Smart Contracts Fundamentals',
        description: 'Learned about Ethereum smart contracts and their applications',
        timestamp: new Date(Date.now() - 2 * 3600000),
        metadata: {
          duration: 25,
          difficulty: 'intermediate',
        },
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Achievement Unlocked: Crypto Expert',
        description: 'Completed 10 advanced crypto lessons',
        timestamp: new Date(Date.now() - 4 * 3600000),
      },
      {
        id: '3',
        type: 'quiz_passed',
        title: 'Quiz Passed: DeFi Protocols',
        description: 'Scored 95% on the DeFi protocols assessment',
        timestamp: new Date(Date.now() - 6 * 3600000),
        metadata: {
          score: 95,
          difficulty: 'advanced',
        },
      },
      {
        id: '4',
        type: 'streak',
        title: '12-day learning streak!',
        description: 'Keep up the great work!',
        timestamp: new Date(Date.now() - 8 * 3600000),
      },
    ];
  } catch (error) {
    console.error('Failed to fetch recent activity:', error);
    return [];
  }
});

export const getNotifications = cache(async (userId: string): Promise<NotificationData[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 50));

    // Use userId for future database queries

    return [
      {
        id: '1',
        type: 'info',
        title: 'New Lesson Available',
        message: 'Advanced NFT Trading is now available in your learning path',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        actionUrl: '/dashboard/lessons/nft-trading',
      },
      {
        id: '2',
        type: 'success',
        title: 'Weekly Goal Achieved',
        message: 'Congratulations! You completed 5 lessons this week',
        timestamp: new Date(Date.now() - 2 * 24 * 3600000),
        read: true,
      },
    ];
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
});

// ✅ TIER 1 PATTERN: Preload for performance
export const preloadDashboardData = (userId: string) => {
  // void prevents the promise from being returned
  void getUserData(userId);
  void getDashboardStats(userId);
  void getRecentActivity(userId);
  void getNotifications(userId);
};

// ✅ TIER 1 PATTERN: Parallel Promise.all() fetching
export const getDashboardData = cache(async (userId?: string) => {
  if (!userId) {
    return {
      userData: null,
      stats: null,
      activity: [],
      notifications: [],
      error: 'No user ID provided',
    };
  }

  try {
    // PARALLEL EXECUTION - Key performance optimization
    // All requests start simultaneously, reducing total wait time
    const [userData, stats, activity, notifications] = await Promise.all([
      getUserData(userId),
      getDashboardStats(userId),
      getRecentActivity(userId),
      getNotifications(userId),
    ]);

    return {
      userData,
      stats,
      activity,
      notifications,
      error: null,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return {
      userData: null,
      stats: null,
      activity: [],
      notifications: [],
      error: 'Failed to load dashboard data',
    };
  }
});

// ✅ TIER 1 PATTERN: Critical path optimization
export const getCriticalDashboardData = cache(async (userId?: string) => {
  if (!userId) {
    return { userData: null, error: 'No user ID' };
  }

  try {
    // Get only critical data for initial render
    const userData = await getUserData(userId);

    return {
      userData,
      error: null,
    };
  } catch (error) {
    console.error('Failed to fetch critical dashboard data:', error);
    return {
      userData: null,
      error: 'Failed to load user data',
    };
  }
});

// ✅ TIER 1 PATTERN: Secondary data for progressive loading
export const getSecondaryDashboardData = cache(async (userId: string) => {
  try {
    // Non-critical data loaded after initial render
    const [stats, activity, notifications] = await Promise.all([
      getDashboardStats(userId),
      getRecentActivity(userId),
      getNotifications(userId),
    ]);

    return {
      stats,
      activity,
      notifications,
      error: null,
    };
  } catch (error) {
    console.error('Failed to fetch secondary dashboard data:', error);
    return {
      stats: null,
      activity: [],
      notifications: [],
      error: 'Failed to load dashboard data',
    };
  }
});

// ✅ TIER 1 PATTERN: Streaming data with error boundaries
export const getDashboardDataStream = async function* (userId: string) {
  // Yield critical data first
  yield await getCriticalDashboardData(userId);

  // Then yield secondary data
  yield await getSecondaryDashboardData(userId);
};
