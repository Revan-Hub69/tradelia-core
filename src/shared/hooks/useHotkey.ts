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

// Hook for managing multiple hotkeys - must be called at top level
export function useHotkeys(hotkeys: Array<{
  id: string;
  key: string;
  callback: () => void;
  options?: HotkeyOptions;
}>) {
  // Register all hotkeys in a single effect
  useEffect(() => {
    const handlers: Array<(event: KeyboardEvent) => void> = [];
    
    hotkeys.forEach(({ key, callback, options = {} }) => {
      const {
        metaKey = false,
        ctrlKey = false,
        altKey = false,
        shiftKey = false,
        preventDefault = true
      } = options;
      
      const handler = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
          return;
        }
        
        if (event.key.toLowerCase() !== key.toLowerCase()) return;
        if (event.metaKey !== metaKey || event.ctrlKey !== ctrlKey || 
            event.altKey !== altKey || event.shiftKey !== shiftKey) return;
        
        if (preventDefault) event.preventDefault();
        callback();
      };
      
      handlers.push(handler);
      document.addEventListener('keydown', handler);
    });
    
    return () => {
      handlers.forEach(handler => {
        document.removeEventListener('keydown', handler);
      });
    };
  }, [hotkeys]);
}