/*
 * LONG PRESS HOOK - Apple/Linear/Stripe Level 2026
 * 
 * Sistema long press per quick actions mobile
 * Haptic feedback simulation + context menu premium
 */

import { useCallback, useRef, useState } from 'react';

export interface LongPressOptions {
  threshold?: number; // ms per attivare long press
  onStart?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
}

export interface QuickAction {
  id: string;
  labelKey: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'destructive';
}

export const useLongPress = (
  callback: () => void,
  options: LongPressOptions = {}
) => {
  const { threshold = 500, onStart, onFinish, onCancel } = options;
  const [isLongPressing, setIsLongPressing] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();

  const start = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    // Prevent context menu on right click
    if ('button' in event && event.button === 2) return;

    target.current = event.target;
    onStart?.();
    setIsLongPressing(true);

    timeout.current = setTimeout(() => {
      // Haptic feedback simulation
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      callback();
      onFinish?.();
      setIsLongPressing(false);
    }, threshold);
  }, [callback, threshold, onStart, onFinish]);

  const clear = useCallback((shouldCancel = true) => {
    timeout.current && clearTimeout(timeout.current);
    if (shouldCancel && isLongPressing) {
      onCancel?.();
    }
    setIsLongPressing(false);
  }, [isLongPressing, onCancel]);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: () => clear(true),
    onMouseLeave: () => clear(true),
    onTouchEnd: () => clear(true),
    onTouchCancel: () => clear(true),
    isLongPressing,
  };
};

// Hook per gestire quick actions
export const useQuickActions = (actions: QuickAction[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const openQuickActions = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10, // Sopra l'elemento
    });
    setIsOpen(true);
  }, []);

  const closeQuickActions = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    actions,
    isOpen,
    position,
    openQuickActions,
    closeQuickActions,
  };
};