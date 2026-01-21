/**
 * useLongPress Hook Tests
 *
 * @module hooks/__tests__/useLongPress
 * @version 1.0.0
 * @since 2026-01-21
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLongPress } from '../useLongPress';

describe('useLongPress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ============================================================================
  // Basic Functionality
  // ============================================================================

  it('should trigger callback after threshold (500ms)', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback));

    // Simulate pointer down
    act(() => {
      result.current.onPointerDown({
        button: 0,
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as any);
    });

    expect(callback).not.toHaveBeenCalled();
    expect(result.current.isPressed).toBe(true);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current.isLongPressing).toBe(false); // Reset after trigger
  });

  it('should not trigger if released before threshold', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback));

    // Simulate pointer down
    act(() => {
      result.current.onPointerDown({
        button: 0,
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as any);
    });

    // Release before threshold
    act(() => {
      vi.advanceTimersByTime(300);
      result.current.onPointerUp({} as any);
    });

    // Fast-forward remaining time
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  // ============================================================================
  // Movement Threshold (Touch Slop)
  // ============================================================================

  it('should cancel if movement exceeds 10px threshold', () => {
    const callback = vi.fn();
    const onCancel = vi.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { onCancel, moveThreshold: 10 }),
    );

    // Simulate pointer down
    act(() => {
      result.current.onPointerDown({
        button: 0,
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as any);
    });

    // Move 15px (exceeds threshold)
    act(() => {
      result.current.onPointerMove({
        clientX: 115,
        clientY: 100,
      } as any);
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(result.current.isPressed).toBe(false);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not cancel if movement is within 10px threshold', () => {
    const callback = vi.fn();
    const onCancel = vi.fn();
    const { result } = renderHook(() =>
      useLongPress(callback, { onCancel, moveThreshold: 10 }),
    );

    // Simulate pointer down
    act(() => {
      result.current.onPointerDown({
        button: 0,
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as any);
    });

    // Move 5px (within threshold)
    act(() => {
      result.current.onPointerMove({
        clientX: 105,
        clientY: 100,
      } as any);
    });

    expect(onCancel).not.toHaveBeenCalled();
    expect(result.current.isPressed).toBe(true);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  // ============================================================================
  // Callbacks
  // ============================================================================

  it('should call onStart when press begins', () => {
    const callback = vi.fn();
    const onStart = vi.fn();
    const { result } = renderHook(() => useLongPress(callback, { onStart }));

    act(() => {
      result.current.onPointerDown({
        button: 0,
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as any);
    });

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('should call onFinish when long-press completes', () => {
    const callback = vi.fn();
    const onFinish = vi.fn();
    const { result } = renderHook(() => useLongPress(callback, { onFinish }));

    act(() => {
      result.current.onPointerDown({
        button: 0,
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as any);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when press is cancelled', () => {
    const callback = vi.fn();
    const onCancel = vi.fn();
    const { result } = renderHook(() => useLongPress(callback, { onCancel }));

    act(() => {
      result.current.onPointerDown({
        button: 0,
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as any);
    });

    act(() => {
      result.current.onPointerUp({} as any);
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  // ============================================================================
  // Touch Events (iOS Safari Fallback)
  // ============================================================================

  it('should work with touch events', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback));

    // Simulate touch start
    act(() => {
      result.current.onTouchStart({
        touches: [{ clientX: 100, clientY: 100 }],
      } as any);
    });

    expect(result.current.isPressed).toBe(true);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cancel touch on movement exceeding threshold', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback, { moveThreshold: 10 }));

    // Simulate touch start
    act(() => {
      result.current.onTouchStart({
        touches: [{ clientX: 100, clientY: 100 }],
      } as any);
    });

    // Move 15px
    act(() => {
      result.current.onTouchMove({
        touches: [{ clientX: 115, clientY: 100 }],
      } as any);
    });

    expect(result.current.isPressed).toBe(false);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  // ============================================================================
  // Edge Cases
  // ============================================================================

  it('should ignore right-click (button 2)', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback));

    act(() => {
      result.current.onPointerDown({
        button: 2, // Right-click
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as any);
    });

    expect(result.current.isPressed).toBe(false);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle pointer cancel', () => {
    const callback = vi.fn();
    const onCancel = vi.fn();
    const { result } = renderHook(() => useLongPress(callback, { onCancel }));

    act(() => {
      result.current.onPointerDown({
        button: 0,
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as any);
    });

    act(() => {
      result.current.onPointerCancel({} as any);
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(result.current.isPressed).toBe(false);
  });

  it('should handle touch cancel', () => {
    const callback = vi.fn();
    const onCancel = vi.fn();
    const { result } = renderHook(() => useLongPress(callback, { onCancel }));

    act(() => {
      result.current.onTouchStart({
        touches: [{ clientX: 100, clientY: 100 }],
      } as any);
    });

    act(() => {
      result.current.onTouchCancel({} as any);
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(result.current.isPressed).toBe(false);
  });

  // ============================================================================
  // Custom Threshold
  // ============================================================================

  it('should respect custom threshold', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback, { threshold: 1000 }));

    act(() => {
      result.current.onPointerDown({
        button: 0,
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as any);
    });

    // 500ms - should not trigger
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();

    // 1000ms - should trigger
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
