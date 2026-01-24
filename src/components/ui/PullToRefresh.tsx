/*
 * PULL-TO-REFRESH COMPONENT - iOS 26 Liquid Glass
 *
 * Based on Tier-1 Research:
 * - Apple: Liquid Glass Design Language
 * - MacRumors: iOS 26 Patterns
 * - Shakuro: Pull-to-Refresh Best Practices
 * - AppCoda: Haptic Feedback iOS
 *
 * Features:
 * - Liquid Glass material (translucent)
 * - Haptic feedback (10ms light vibration)
 * - Spring physics animations
 * - 70px threshold, 120px max pull
 * - Mobile only (< 768px)
 * - GPU-optimized
 *
 * RESEARCH DOCUMENT:
 * docs/research/LOADING_EMPTY_STATES_MOBILE_TIER1_2026.md
 */

'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/Helpers';

const PULL_THRESHOLD = 70; // px
const MAX_PULL = 120; // px

export type PullToRefreshProps = {
  /**
   * Async function to call when refresh is triggered
   * Should return a Promise that resolves when refresh is complete
   */
  onRefresh: () => Promise<void>;

  /**
   * Children content to render
   */
  children: ReactNode;

  /**
   * Optional className for container
   */
  className?: string;

  /**
   * Disable pull-to-refresh
   * @default false
   */
  disabled?: boolean;
};

/**
 * PullToRefresh Component
 *
 * iOS 26 Liquid Glass pull-to-refresh pattern.
 * Mobile only (< 768px), with haptic feedback.
 *
 * @example
 * ```tsx
 * <PullToRefresh onRefresh={async () => {
 *   await fetchNewData();
 * }}>
 *   <YourContent />
 * </PullToRefresh>
 * ```
 */
export function PullToRefresh({
  onRefresh,
  children,
  className,
  disabled = false,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const hasTriggeredHaptic = useRef(false);

  useEffect(() => {
    if (disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if at top of page
      if (window.scrollY === 0 && !isRefreshing && e.touches[0]) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && !isRefreshing && startY.current > 0 && e.touches[0]) {
        const currentY = e.touches[0].clientY;
        const distance = Math.min(currentY - startY.current, MAX_PULL);

        if (distance > 0) {
          setPullDistance(distance);

          // Haptic feedback at threshold (once)
          if (distance >= PULL_THRESHOLD && !hasTriggeredHaptic.current) {
            // Light impact vibration (10ms)
            if ('vibrate' in navigator) {
              navigator.vibrate(10);
            }
            hasTriggeredHaptic.current = true;
          }

          // Reset haptic flag if pulled back below threshold
          if (distance < PULL_THRESHOLD) {
            hasTriggeredHaptic.current = false;
          }
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);

        try {
          await onRefresh();
        } catch (error) {
          console.error('Pull-to-refresh error:', error);
        } finally {
          setIsRefreshing(false);
        }
      }

      setPullDistance(0);
      startY.current = 0;
      hasTriggeredHaptic.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing, onRefresh, disabled]);

  // Calculate progress (0 to 1)
  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);

  // Calculate rotation for spinner
  const rotation = progress * 360;

  return (
    <div className={cn('pull-to-refresh-container', className)}>
      {/* Pull indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className={cn(
            'pull-to-refresh-ios-26',
            {
              pulling: pullDistance > 0 && !isRefreshing,
              refreshing: isRefreshing,
            },
          )}
          style={{
            transform: `translateX(-50%) translateY(${pullDistance}px) translateZ(0)`,
            opacity: isRefreshing ? 1 : progress,
          }}
          aria-live="polite"
          aria-busy={isRefreshing}
        >
          <div
            className={cn('ptr-spinner', {
              spinning: isRefreshing,
            })}
            style={{
              transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
            }}
          />
        </div>
      )}

      {/* Content */}
      {children}
    </div>
  );
}
