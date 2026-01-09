'use client';

import { useEffect, useCallback } from 'react';

interface HotkeyOptions {
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  description?: string;
  preventDefault?: boolean;
}

export function useHotkey(
  id: string,
  key: string,
  callback: () => void,
  options: HotkeyOptions = {}
) {
  const {
    metaKey = false,
    ctrlKey = false,
    altKey = false,
    shiftKey = false,
    preventDefault = true
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check if we're in an input field
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    // Check key match
    if (event.key.toLowerCase() !== key.toLowerCase()) {
      return;
    }

    // Check modifier keys
    if (
      event.metaKey !== metaKey ||
      event.ctrlKey !== ctrlKey ||
      event.altKey !== altKey ||
      event.shiftKey !== shiftKey
    ) {
      return;
    }

    if (preventDefault) {
      event.preventDefault();
    }

    callback();
  }, [key, metaKey, ctrlKey, altKey, shiftKey, preventDefault, callback]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Hook for managing multiple hotkeys
export function useHotkeys(hotkeys: Array<{
  id: string;
  key: string;
  callback: () => void;
  options?: HotkeyOptions;
}>) {
  hotkeys.forEach(({ id, key, callback, options }) => {
    useHotkey(id, key, callback, options);
  });
}