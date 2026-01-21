/**
 * useLongPress Hook
 *
 * Production-ready long-press hook with Pointer Events (primary) and
 * touch events fallback (iOS Safari). Implements 10px movement threshold
 * to prevent conflicts with scrolling.
 *
 * @module hooks/useLongPress
 * @version 1.0.0
 * @since 2026-01-21
 *
 * Task: P1.T1
 * Design: .kiro/specs/dashboard-accessibility-personalization/design.md
 */

import { useCallback, useRef, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

/**
 * Quick Action definition for context menus
 */
export type QuickAction = {
  id: string;
  labelKey: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'destructive';
};

export type LongPressOptions = {
  /**
   * Time threshold in milliseconds to trigger long-press
   * @default 500
   */
  threshold?: number;

  /**
   * Movement threshold in CSS pixels to cancel long-press (touch slop)
   * Prevents conflicts with scrolling
   * @default 10
   */
  moveThreshold?: number;

  /**
   * Callback when long-press starts (pointer/touch down)
   */
  onStart?: () => void;

  /**
   * Callback when long-press completes successfully
   */
  onFinish?: () => void;

  /**
   * Callback when long-press is cancelled (movement, release, etc.)
   */
  onCancel?: () => void;
};

export type LongPressHandlers = {
  // Pointer Events (primary)
  onPointerDown: (event: React.PointerEvent) => void;
  onPointerMove: (event: React.PointerEvent) => void;
  onPointerUp: (event: React.PointerEvent) => void;
  onPointerCancel: (event: React.PointerEvent) => void;

  // Touch Events (iOS Safari fallback)
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
  onTouchCancel: (event: React.TouchEvent) => void;

  // State
  isLongPressing: boolean;
  isPressed: boolean;
};

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * useLongPress Hook
 *
 * Implements long-press interaction with:
 * - Pointer Events (primary) for modern browsers
 * - Touch events fallback for iOS Safari
 * - 10px movement threshold to prevent scroll conflicts
 * - Haptic feedback on trigger
 * - Event de-duplication (touchHandled flag)
 *
 * @example
 * ```tsx
 * const longPress = useLongPress(() => {
 *   console.log('Long press triggered!');
 * }, {
 *   threshold: 500,
 *   moveThreshold: 10,
 *   onStart: () => console.log('Press started'),
 *   onCancel: () => console.log('Press cancelled'),
 * });
 *
 * return <button {...longPress}>Long press me</button>;
 * ```
 */
export const useLongPress = (
  callback: () => void,
  options: LongPressOptions = {},
): LongPressHandlers => {
  const {
    threshold = 500,
    moveThreshold = 10,
    onStart,
    onFinish,
    onCancel,
  } = options;

  // State
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Refs
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startPositionRef = useRef<{ x: number; y: number } | null>(null);
  const touchHandledRef = useRef(false); // Prevent duplicate events

  // ============================================================================
  // Helpers
  // ============================================================================

  /**
   * Calculate distance between two points
   */
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  };

  /**
   * Trigger haptic feedback (if available)
   */
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  /**
   * Clear timeout and reset state
   */
  const clearLongPress = useCallback((shouldCancel = true) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (shouldCancel && isPressed) {
      onCancel?.();
    }

    setIsPressed(false);
    setIsLongPressing(false);
    startPositionRef.current = null;
  }, [isPressed, onCancel]);

  // ============================================================================
  // Pointer Events (Primary)
  // ============================================================================

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    // Ignore right-click
    if (event.button === 2) {
      return;
    }

    // Prevent default to avoid text selection
    event.preventDefault();

    // Mark touch as handled to prevent duplicate touch events
    touchHandledRef.current = true;

    // Store start position
    startPositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    setIsPressed(true);
    onStart?.();

    // Start timer
    timeoutRef.current = setTimeout(() => {
      setIsLongPressing(true);
      triggerHaptic();
      callback();
      onFinish?.();
      clearLongPress(false);
    }, threshold);
  }, [callback, threshold, onStart, onFinish, clearLongPress]);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (!isPressed || !startPositionRef.current) {
      return;
    }

    // Calculate distance moved
    const distance = calculateDistance(
      startPositionRef.current.x,
      startPositionRef.current.y,
      event.clientX,
      event.clientY,
    );

    // Cancel if moved more than threshold (touch slop)
    if (distance > moveThreshold) {
      clearLongPress(true);
    }
  }, [isPressed, moveThreshold, clearLongPress]);

  const handlePointerUp = useCallback(() => {
    clearLongPress(true);
  }, [clearLongPress]);

  const handlePointerCancel = useCallback(() => {
    clearLongPress(true);
  }, [clearLongPress]);

  // ============================================================================
  // Touch Events (iOS Safari Fallback)
  // ============================================================================

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    // Skip if already handled by pointer events
    if (touchHandledRef.current) {
      touchHandledRef.current = false;
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    // Store start position
    startPositionRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    setIsPressed(true);
    onStart?.();

    // Start timer
    timeoutRef.current = setTimeout(() => {
      setIsLongPressing(true);
      triggerHaptic();
      callback();
      onFinish?.();
      clearLongPress(false);
    }, threshold);
  }, [callback, threshold, onStart, onFinish, clearLongPress]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!isPressed || !startPositionRef.current) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    // Calculate distance moved
    const distance = calculateDistance(
      startPositionRef.current.x,
      startPositionRef.current.y,
      touch.clientX,
      touch.clientY,
    );

    // Cancel if moved more than threshold (touch slop)
    if (distance > moveThreshold) {
      clearLongPress(true);
    }
  }, [isPressed, moveThreshold, clearLongPress]);

  const handleTouchEnd = useCallback(() => {
    clearLongPress(true);
  }, [clearLongPress]);

  const handleTouchCancel = useCallback(() => {
    clearLongPress(true);
  }, [clearLongPress]);

  // ============================================================================
  // Return Handlers
  // ============================================================================

  return {
    // Pointer Events (primary)
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,

    // Touch Events (iOS Safari fallback)
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,

    // State
    isLongPressing,
    isPressed,
  };
};
