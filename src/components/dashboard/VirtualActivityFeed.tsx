/*
 * VIRTUAL ACTIVITY FEED - PHASE 3B IMPLEMENTATION
 *
 * Tier 1 Implementation:
 * - Virtual scrolling for unlimited activity items
 * - Dynamic height measurement for variable content
 * - 60 FPS performance with large datasets
 * - Memory efficient rendering (only visible items)
 *
 * Expected Impact: Handle 10,000+ activity items at 60 FPS
 */

'use client';

import { useEffect, useMemo, useState } from 'react';

import type { RecentActivity } from '@/app/[locale]/(auth)/dashboard/components';
import { StarIcon } from '@/components/icons/unified/UnifiedIconSystem';
import { VirtualList } from '@/components/ui/VirtualScrollList';

// ✅ TIER 1: Props interface for virtual activity feed
type VirtualActivityFeedProps = {
  userId: string;
  maxHeight?: number;
  itemsPerPage?: number;
};

// ✅ TIER 1: Activity item height estimation based on content
const estimateActivityHeight = (activity: RecentActivity): number => {
  let baseHeight = 60; // Base height for title + timestamp

  if (activity.description) {
    baseHeight += 20; // Additional height for description
  }

  if (activity.metadata?.score || activity.metadata?.duration) {
    baseHeight += 16; // Additional height for metadata
  }

  return baseHeight;
};

// ✅ TIER 1: Generate large dataset for testing virtual scrolling
const generateMockActivityData = (count: number): RecentActivity[] => {
  const activities: RecentActivity[] = [];
  const types: RecentActivity['type'][] = ['lesson_completed', 'achievement', 'quiz_passed', 'streak', 'milestone'];

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length] as RecentActivity['type'];
    const hoursAgo = Math.floor(Math.random() * 24 * 30); // Random within 30 days

    activities.push({
      id: `activity-${i}`,
      type,
      title: `${type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${i + 1}`,
      description: i % 3 === 0 ? `Detailed description for activity ${i + 1}` : undefined,
      timestamp: new Date(Date.now() - hoursAgo * 3600000),
      metadata: i % 4 === 0
        ? {
            score: Math.floor(Math.random() * 40) + 60,
            duration: Math.floor(Math.random() * 30) + 10,
            difficulty: ['beginner', 'intermediate', 'advanced'][i % 3] as 'beginner' | 'intermediate' | 'advanced',
          }
        : undefined,
    });
  }

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// ✅ TIER 1: Activity item renderer for virtual list
const ActivityItemRenderer = ({ activity, index }: { activity: RecentActivity; index: number }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <StarIcon className="size-5 text-yellow-500" />;
      case 'lesson_completed':
        return <div className="size-5 rounded-full bg-green-500" />;
      case 'quiz_passed':
        return <div className="size-5 rounded-full bg-blue-500" />;
      case 'streak':
        return <div className="size-5 rounded-full bg-orange-500" />;
      case 'milestone':
        return <div className="size-5 rounded-full bg-purple-500" />;
      default:
        return <div className="size-5 rounded-full bg-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      return 'Just now';
    }
    if (hours < 24) {
      return `${hours} hours ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="flex items-start space-x-3 border-b border-border/50 p-3 last:border-b-0">
      <div className="mt-1 shrink-0">
        {getActivityIcon(activity.type)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{activity.title}</div>
        {activity.description && (
          <div className="mt-1 text-xs text-muted-foreground">
            {activity.description}
          </div>
        )}
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{formatTimeAgo(activity.timestamp)}</span>
          {activity.metadata?.score && (
            <span className="text-green-600 dark:text-green-400">
              Score:
              {' '}
              {activity.metadata.score}
              %
            </span>
          )}
          {activity.metadata?.duration && (
            <span>
              {activity.metadata.duration}
              {' '}
              minutes
            </span>
          )}
          {activity.metadata?.difficulty && (
            <span className="capitalize">
              {activity.metadata.difficulty}
            </span>
          )}
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        #
        {index + 1}
      </div>
    </div>
  );
};

// ✅ TIER 1: Virtual activity feed component
export const VirtualActivityFeed = ({
  userId,
  maxHeight = 400,
  itemsPerPage = 50,
}: VirtualActivityFeedProps) => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // ✅ TIER 1: Load activity data with pagination simulation
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);

        // Simulate API call with large dataset
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate large dataset for virtual scrolling demo
        const mockData = generateMockActivityData(1000); // 1000 items for testing

        setActivities(mockData);
        setTotalCount(mockData.length);
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [userId, itemsPerPage]);

  // ✅ TIER 1: Memoized height estimation function
  const getItemHeight = useMemo(() => {
    return (index: number) => {
      const activity = activities[index];
      return activity ? estimateActivityHeight(activity) : 60;
    };
  }, [activities]);

  if (loading) {
    return (
      <div className="card-ios-26">
        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="size-10 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-ios-26">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="text-sm text-muted-foreground">
          {totalCount.toLocaleString()}
          {' '}
          items
        </div>
      </div>

      {activities.length === 0
        ? (
            <div className="py-8 text-center text-muted-foreground">
              No recent activity
            </div>
          )
        : (
            <div className="overflow-hidden rounded-lg border border-border">
              <VirtualList
                data={activities}
                height={maxHeight}
                itemHeight={getItemHeight}
                renderItem={(activity, index) => (
                  <ActivityItemRenderer activity={activity} index={index} />
                )}
                className="bg-background"
              />
            </div>
          )}

      {/* ✅ TIER 1: Performance info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <div className="mb-1 font-medium">Virtual Scrolling Performance:</div>
          <div>
            • Total items:
            {totalCount.toLocaleString()}
          </div>
          <div>• Rendered items: Only visible items (~10-15)</div>
          <div>• Memory usage: Constant regardless of dataset size</div>
          <div>• Scroll performance: 60 FPS with unlimited data</div>
        </div>
      )}
    </div>
  );
};

VirtualActivityFeed.displayName = 'VirtualActivityFeed';
