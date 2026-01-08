/**
 * Hotkey Hook - Tradelia 2026
 * 
 * Hook per gestire keyboard shortcuts globali
 * Ottimizzato per accessibilità e performance
 */

import { useEffect, useCallback, useMemo } from 'react';

interface UseHotkeyOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enableOnFormTags?: boolean;
}

const DEFAULT_OPTIONS: UseHotkeyOptions = {
  enabled: true,
  preventDefault: true,
  stopPropagation: false,
  enableOnFormTags: false
};

export function useHotkey(
  keys: string | string[],
  callback: (event: KeyboardEvent) => void,
  options: UseHotkeyOptions = {}
) {
  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!opts.enabled) return;
    
    // Check if we should ignore form elements
    if (!opts.enableOnFormTags) {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const isFormElement = ['input', 'textarea', 'select'].includes(tagName);
      const isContentEditable = target.contentEditable === 'true';
      
      if (isFormElement || isContentEditable) return;
    }
    
    const keyArray = Array.isArray(keys) ? keys : [keys];
    const pressedKey = formatKeyEvent(event);
    
    if (keyArray.some(key => key.toLowerCase() === pressedKey.toLowerCase())) {
      if (opts.preventDefault) event.preventDefault();
      if (opts.stopPropagation) event.stopPropagation();
      callback(event);
    }
  }, [keys, callback, opts]);

  useEffect(() => {
    if (!opts.enabled) return;
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, opts.enabled]);
}

function formatKeyEvent(event: KeyboardEvent): string {
  const parts: string[] = [];
  
  if (event.ctrlKey || event.metaKey) parts.push('cmd');
  if (event.altKey) parts.push('alt');
  if (event.shiftKey) parts.push('shift');
  
  // Handle special keys
  const key = event.key.toLowerCase();
  switch (key) {
    case ' ':
      parts.push('space');
      break;
    case 'escape':
      parts.push('esc');
      break;
    case 'arrowup':
      parts.push('up');
      break;
    case 'arrowdown':
      parts.push('down');
      break;
    case 'arrowleft':
      parts.push('left');
      break;
    case 'arrowright':
      parts.push('right');
      break;
    case 'enter':
      parts.push('enter');
      break;
    default:
      parts.push(key);
  }
  
  return parts.join('+');
}

// Utility function to format hotkey display
export function formatHotkeyDisplay(hotkey: string): string {
  return hotkey
    .split('+')
    .map(key => {
      switch (key.toLowerCase()) {
        case 'cmd':
          return typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl';
        case 'alt':
          return typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac') ? '⌥' : 'Alt';
        case 'shift':
          return '⇧';
        case 'esc':
          return 'Esc';
        case 'space':
          return 'Space';
        case 'enter':
          return 'Enter';
        case 'up':
          return '↑';
        case 'down':
          return '↓';
        case 'left':
          return '←';
        case 'right':
          return '→';
        default:
          return key.toUpperCase();
      }
    })
    .join(' + ');
}