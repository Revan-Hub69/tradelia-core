/*
 * DASHBOARD CLIENT COMPONENTS - PHASE 3C OPTIMIZED
 * 
 * Tier 1 Implementation:
 * - Optimized client components with server data
 * - Granular loading states
 * - Error boundaries
 * - Memory leak detection
 * - Performance-first rendering
 */

'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { UiSurface } from '@/components/ui/UiSurface';
import { UiStatusChip } from '@/components/ui/UiStatusChip';
import { BellIcon, TrendingUpIcon, StarIcon, ClockIcon } from '@/components/icons/unified/UnifiedIconSystem';
import { useMemoryLeakDetection } from '@/hooks/useMemoryLeakDetection';

// ✅ TIER 1: Type definitions for dashboard data
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

// ✅ TIER 1: Props interface for type safety
interface DashboardStatusCardProps {
  userData: UserData;
}

interface DashboardNextStepsProps {
  userData: UserData;
}

interface SecondaryDataProps {
  userId: string;
}

// ✅ TIER 1: Optimized status card with server data
export const DashboardStatusCard = ({ userData }: DashboardStatusCardProps) => {
  const t = useTranslations('Dashboard');

  return (
    <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t('current_status_title')}</h2>
        <UiStatusChip 
          variant={userData.subscription === 'premium' ? 'success' : 'info'}
          label={userData.subscription.toUpperCase()}
        />
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">{t('path_label')}</div>
          <div className="font-medium">{userData.progress.pathName}</div>
          {userData.progress.currentLesson && (
            <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Current: {userData.progress.currentLesson}
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{t('progress_label')}</span>
            <span>
              {userData.progress.completedLessons}/{userData.progress.totalLessons}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${userData.progress.progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{userData.progress.progressPercentage}% completed</span>
            {userData.progress.estimatedTimeToComplete && (
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                {userData.progress.estimatedTimeToComplete} remaining
              </span>
            )}
          </div>
        </div>
      </div>
    </UiSurface>
  );
};

// ✅ TIER 1: Optimized next steps with server data
export const DashboardNextSteps = ({ userData }: DashboardNextStepsProps) => {
  const t = useTranslations('Dashboard');

  const isJustStarted = userData.progress.completedLessons === 0;
  const isNearCompletion = userData.progress.progressPercentage > 80;

  return (
    <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
      <h2 className="mb-4 text-lg font-semibold">{t('next_objectives_title')}</h2>
      
      {isJustStarted ? (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Welcome {userData.name}! Let's start your crypto learning journey.
          </p>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
            <div className="font-medium text-blue-900 dark:text-blue-100">
              {t('first_lesson_objective')}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Estimated time: 15 minutes
            </div>
          </div>
        </div>
      ) : isNearCompletion ? (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            You're almost there! Just a few more lessons to complete.
          </p>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
            <div className="font-medium text-green-900 dark:text-green-100">
              Complete your learning path
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 mt-1">
              {userData.progress.totalLessons - userData.progress.completedLessons} lessons left
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {t('continue_message')}
          </p>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/30">
            <div className="font-medium text-purple-900 dark:text-purple-100">
              {userData.progress.currentLesson || t('continue_path_objective')}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">
              Progress so far: {userData.progress.progressPercentage}%
            </div>
          </div>
        </div>
      )}
    </UiSurface>
  );
};

// ✅ TIER 1: Stats card with client-side data loading
export const DashboardStatsCard = ({ userId }: SecondaryDataProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ PHASE 3C: Memory leak detection
  useMemoryLeakDetection({
    componentName: 'DashboardStatsCard',
    enableInProduction: false,
    memoryThreshold: 50, // 50MB threshold
  });

  useEffect(() => {
    let timeoutId: number | null = null;
    
    // Simulate API call for stats
    const loadStats = () => {
      try {
        timeoutId = window.setTimeout(() => {
          setStats({
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
          });
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error('Failed to load stats:', error);
        setLoading(false);
      }
    };

    loadStats();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [userId]);

  if (loading) {
    return (
      <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </UiSurface>
    );
  }

  if (!stats) {
    return (
      <UiSurface variant="card" className="ui-glass-card p-6 text-center">
        <div className="text-muted-foreground">Failed to load statistics</div>
      </UiSurface>
    );
  }

  return (
    <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
      <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
        <TrendingUpIcon className="h-5 w-5 text-green-500" />
        Statistics
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-500">{stats.streak}</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{stats.xp}</div>
          <div className="text-sm text-muted-foreground">Total XP</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">{stats.level}</div>
          <div className="text-sm text-muted-foreground">Current Level</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{stats.achievements.total}</div>
          <div className="text-sm text-muted-foreground">Achievements</div>
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Weekly Goal</span>
          <span className="font-medium">
            {stats.weeklyGoal.completed}/{stats.weeklyGoal.target}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
            style={{ width: `${stats.weeklyGoal.percentage}%` }}
          />
        </div>
      </div>
    </UiSurface>
  );
};

// ✅ TIER 1: Notifications with client-side data loading
export const DashboardNotifications = ({ userId }: SecondaryDataProps) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ PHASE 3C: Memory leak detection
  useMemoryLeakDetection({
    componentName: 'DashboardNotifications',
    enableInProduction: false,
  });

  useEffect(() => {
    let timeoutId: number | null = null;
    
    const loadNotifications = () => {
      try {
        timeoutId = window.setTimeout(() => {
          setNotifications([
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
          ]);
          setLoading(false);
        }, 200);
      } catch (error) {
        console.error('Failed to load notifications:', error);
        setLoading(false);
      }
    };

    loadNotifications();

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [userId]);

  if (loading) {
    return (
      <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </UiSurface>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BellIcon className="h-5 w-5" />
          Notifications
        </h2>
        {unreadCount > 0 && (
          <UiStatusChip 
            variant="warning" 
            label="unread"
            value={unreadCount}
            dot
          />
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No notifications
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-colors ${
                notification.read 
                  ? 'bg-muted/50 border-border' 
                  : 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {notification.message}
                  </div>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </UiSurface>
  );
};

// ✅ TIER 1: Activity feed with client-side data loading
export const DashboardActivityFeed = ({ userId }: SecondaryDataProps) => {
  const [activity, setActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ PHASE 3C: Memory leak detection
  useMemoryLeakDetection({
    componentName: 'DashboardActivityFeed',
    enableInProduction: false,
  });

  useEffect(() => {
    let timeoutId: number | null = null;
    
    const loadActivity = () => {
      try {
        timeoutId = window.setTimeout(() => {
          setActivity([
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
          ]);
          setLoading(false);
        }, 250);
      } catch (error) {
        console.error('Failed to load activity:', error);
        setLoading(false);
      }
    };

    loadActivity();

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [userId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <StarIcon className="h-5 w-5 text-yellow-500" />;
      case 'lesson_completed':
        return <div className="h-5 w-5 rounded-full bg-green-500" />;
      case 'quiz_passed':
        return <div className="h-5 w-5 rounded-full bg-blue-500" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </UiSurface>
    );
  }

  return (
    <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
      <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
      
      {activity.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No recent activity
        </div>
      ) : (
        <div className="space-y-4">
          {activity.map((activityItem) => (
            <div key={activityItem.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activityItem.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{activityItem.title}</div>
                {activityItem.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {activityItem.description}
                  </div>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{formatTimeAgo(activityItem.timestamp)}</span>
                  {activityItem.metadata?.score && (
                    <span className="text-green-600 dark:text-green-400">
                      Score: {activityItem.metadata.score}%
                    </span>
                  )}
                  {activityItem.metadata?.duration && (
                    <span>
                      {activityItem.metadata.duration} minutes
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </UiSurface>
  );
};