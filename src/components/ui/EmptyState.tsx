/*
 * EMPTY STATE COMPONENT - iOS 26 Professional
 *
 * Based on Tier-1 Research:
 * - Eleken: Empty State UX Best Practices
 * - Toptal: Empty States Design
 * - Shopify Polaris: Empty State Component
 *
 * Features:
 * - 3 types: informational, action, celebratory
 * - Descriptive and motivational messaging
 * - Icon/illustration support
 * - Smooth entrance animations
 * - Accessibility compliant
 *
 * RESEARCH DOCUMENT:
 * docs/research/LOADING_EMPTY_STATES_MOBILE_TIER1_2026.md
 */

'use client';

import type { ReactNode } from 'react';

import { cn } from '@/utils/Helpers';

export type EmptyStateType = 'informational' | 'action' | 'celebratory';

export type EmptyStateProps = {
  /**
   * Type of empty state
   * - informational: Neutral, helpful (first use, no data)
   * - action: Motivational with CTA (guide to next step)
   * - celebratory: Positive, congratulatory (completed tasks)
   */
  type: EmptyStateType;

  /**
   * Icon or illustration element
   * Recommended size: 120px (mobile: 96px)
   */
  icon: ReactNode;

  /**
   * Title text
   * Should be descriptive and clear
   * Example: "No activities yet" or "All done!"
   */
  title: string;

  /**
   * Description text
   * Should be motivational and helpful
   * Example: "Start tracking challenges to see activity here."
   */
  description: string;

  /**
   * Optional action button (for 'action' type)
   */
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };

  /**
   * Optional className for custom styling
   */
  className?: string;
};

/**
 * EmptyState Component
 *
 * Professional empty state following iOS 26 design patterns.
 * Use to turn dead ends into opportunities.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   type="action"
 *   icon={<TrophyIcon className="w-full h-full" />}
 *   title="No challenges yet"
 *   description="Start by exploring the challenge library."
 *   action={{
 *     label: "Explore Challenges",
 *     onClick: () => navigate('/dashboard/challenges')
 *   }}
 * />
 * ```
 */
export function EmptyState({
  type,
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'empty-state-ios-26',
        type,
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {/* Icon/Illustration */}
      <div
        className={cn(
          'empty-icon',
          type,
        )}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="empty-title">
        {title}
      </h3>

      {/* Description */}
      <p className="empty-description">
        {description}
      </p>

      {/* Action Button (for 'action' type) */}
      {action && type === 'action' && (
        <button
          type="button"
          onClick={action.onClick}
          disabled={action.disabled}
          className="empty-action"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
