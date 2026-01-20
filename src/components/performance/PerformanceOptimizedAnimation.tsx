/**
 * PERFORMANCE OPTIMIZED ANIMATION COMPONENT - Enterprise 2026
 *
 * Componente wrapper che ottimizza automaticamente le animazioni basato su:
 * - Device capabilities
 * - Battery status
 * - User preferences
 * - Network conditions
 * - Hardware acceleration availability
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type AnimationPriority = 'low' | 'medium' | 'high' | 'critical';

export type AnimationType =
  | 'signature-press'
  | 'signature-hover'
  | 'signature-shimmer'
  | 'micro-moment'
  | 'focus-transition'
  | 'loading-state'
  | 'custom';

export type PerformanceOptimizedAnimationProps = {
  children: React.ReactNode;
  type: AnimationType;
  priority?: AnimationPriority;
  className?: string;
  disabled?: boolean;
  fallbackClassName?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  customDuration?: number;
  enableGPUAcceleration?: boolean;
};

// ============================================================================
// PERFORMANCE OPTIMIZED ANIMATION COMPONENT
// ============================================================================

export const PerformanceOptimizedAnimation: React.FC<PerformanceOptimizedAnimationProps> = ({
  children,
  type,
  priority = 'medium',
  className = '',
  disabled = false,
  fallbackClassName = '',
  onAnimationStart,
  onAnimationEnd,
  customDuration,
  enableGPUAcceleration = true,
}) => {
  const {
    performanceConfig,
    getPerformanceClasses,
    getAnimationDuration,
    shouldAnimate,
  } = usePerformanceOptimization();

  const elementRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get animation type specific classes
  const getAnimationTypeClasses = useCallback(() => {
    const typeClasses: Record<AnimationType, string> = {
      'signature-press': 'signature-press-optimized',
      'signature-hover': 'signature-hover-optimized',
      'signature-shimmer': 'signature-shimmer-optimized',
      'micro-moment': 'performance-safe',
      'focus-transition': 'performance-safe',
      'loading-state': 'performance-critical',
      'custom': 'performance-safe',
    };

    return typeClasses[type] || 'performance-safe';
  }, [type]);

  // Calculate final classes
  const finalClasses = React.useMemo(() => {
    const baseClasses = [className];

    // Add animation type classes
    baseClasses.push(getAnimationTypeClasses());

    // Add performance optimization classes
    baseClasses.push(getPerformanceClasses());

    // Add animating state
    if (isAnimating) {
      baseClasses.push('animating');
    }

    // Add GPU acceleration if enabled and supported
    if (enableGPUAcceleration && performanceConfig.enableGPUAcceleration) {
      baseClasses.push('gpu-accelerated');
    }

    // Add fallback classes if animations are disabled
    if (!shouldAnimate(priority) || disabled) {
      baseClasses.push(fallbackClassName);
      baseClasses.push('no-animations');
    }

    return baseClasses.filter(Boolean).join(' ');
  }, [
    className,
    getAnimationTypeClasses,
    getPerformanceClasses,
    isAnimating,
    enableGPUAcceleration,
    performanceConfig.enableGPUAcceleration,
    shouldAnimate,
    priority,
    disabled,
    fallbackClassName,
  ]);

  // Calculate animation duration
  const animationDuration = React.useMemo(() => {
    if (!shouldAnimate(priority) || disabled) {
      return 0;
    }

    const baseDuration = customDuration || 300;
    return getAnimationDuration(baseDuration);
  }, [shouldAnimate, priority, disabled, customDuration, getAnimationDuration]);

  // Handle animation start
  const handleAnimationStart = useCallback(() => {
    setIsAnimating(true);
    onAnimationStart?.();

    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // Set timeout to end animation state
    if (animationDuration > 0) {
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        onAnimationEnd?.();
      }, animationDuration + 50); // Add small buffer
    }
  }, [animationDuration, onAnimationStart, onAnimationEnd]);

  // Handle animation end
  const handleAnimationEnd = useCallback(() => {
    setIsAnimating(false);
    onAnimationEnd?.();

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, [onAnimationEnd]);

  // Set up event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    element.addEventListener('animationstart', handleAnimationStart);
    element.addEventListener('animationend', handleAnimationEnd);
    element.addEventListener('transitionstart', handleAnimationStart);
    element.addEventListener('transitionend', handleAnimationEnd);

    return () => {
      element.removeEventListener('animationstart', handleAnimationStart);
      element.removeEventListener('animationend', handleAnimationEnd);
      element.removeEventListener('transitionstart', handleAnimationStart);
      element.removeEventListener('transitionend', handleAnimationEnd);

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [handleAnimationStart, handleAnimationEnd]);

  // Apply custom CSS properties
  const customStyles = React.useMemo(() => {
    const styles: React.CSSProperties & {
      '--animation-duration'?: string;
      '--transition-duration'?: string;
    } = {};

    if (animationDuration > 0) {
      styles['--animation-duration'] = `${animationDuration}ms`;
      styles['--transition-duration'] = `${animationDuration}ms`;
    }

    return styles;
  }, [animationDuration]);

  return (
    <div
      ref={elementRef}
      className={finalClasses}
      style={customStyles}
      data-animation-type={type}
      data-animation-priority={priority}
      data-performance-level={performanceConfig.level}
      aria-hidden={isAnimating ? 'true' : undefined}
    >
      {children}
    </div>
  );
};

// ============================================================================
// PERFORMANCE OPTIMIZED BUTTON COMPONENT
// ============================================================================

export type PerformanceOptimizedButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  animationPriority?: AnimationPriority;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const PerformanceOptimizedButton: React.FC<PerformanceOptimizedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  animationPriority = 'medium',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center rounded-lg font-medium
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${size === 'sm' ? 'px-3 py-1.5 text-sm' : ''}
    ${size === 'md' ? 'px-4 py-2 text-base' : ''}
    ${size === 'lg' ? 'px-6 py-3 text-lg' : ''}
    ${variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' : ''}
    ${variant === 'secondary' ? 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500' : ''}
    ${variant === 'ghost' ? 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500' : ''}
  `;

  return (
    <PerformanceOptimizedAnimation
      type="signature-press"
      priority={animationPriority}
      className={className}
      fallbackClassName="opacity-80"
    >
      <button
        type="button"
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {children}
      </button>
    </PerformanceOptimizedAnimation>
  );
};

// ============================================================================
// PERFORMANCE OPTIMIZED CARD COMPONENT
// ============================================================================

export type PerformanceOptimizedCardProps = {
  children: React.ReactNode;
  className?: string;
  animationPriority?: AnimationPriority;
  enableHover?: boolean;
  enablePress?: boolean;
};

export const PerformanceOptimizedCard: React.FC<PerformanceOptimizedCardProps> = ({
  children,
  className = '',
  animationPriority = 'low',
  enableHover = true,
  enablePress = false,
}) => {
  const baseClasses = `
    rounded-lg border border-gray-200 dark:border-gray-700
    bg-white dark:bg-gray-800 p-6 shadow-sm
  `;

  const animationType = enablePress ? 'signature-press' : 'signature-hover';

  return (
    <PerformanceOptimizedAnimation
      type={animationType}
      priority={animationPriority}
      className={className}
      fallbackClassName="border-gray-300 dark:border-gray-600"
      disabled={!enableHover && !enablePress}
    >
      <div className={`${baseClasses} ${className}`}>
        {children}
      </div>
    </PerformanceOptimizedAnimation>
  );
};

export default PerformanceOptimizedAnimation;
