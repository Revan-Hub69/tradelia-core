/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  detectPlatform,
  normalizeShortcut,
  detectShortcutConflict,
  getAlternativeShortcut,
  getResolvedShortcut,
  shouldShowConflictWarning,
  getConflictMessage,
  parseKeyboardEvent,
  RESERVED_SHORTCUTS,
  APP_SHORTCUTS,
  type Platform,
} from '../shortcuts';

describe('Keyboard Shortcuts', () => {
  describe('RESERVED_SHORTCUTS', () => {
    it('should have common browser shortcuts', () => {
      expect(RESERVED_SHORTCUTS).toHaveProperty('Alt+T');
      expect(RESERVED_SHORTCUTS).toHaveProperty('Ctrl+T');
      expect(RESERVED_SHORTCUTS).toHaveProperty('F5');
    });
    
    it('should have descriptions for all shortcuts', () => {
      for (const [shortcut, description] of Object.entries(RESERVED_SHORTCUTS)) {
        expect(description).toBeTruthy();
        expect(description.length).toBeGreaterThan(0);
      }
    });
  });
  
  describe('APP_SHORTCUTS', () => {
    it('should have primary and alternative shortcuts', () => {
      expect(APP_SHORTCUTS.TOGGLE_THEME).toHaveProperty('primary');
      expect(APP_SHORTCUTS.TOGGLE_THEME).toHaveProperty('alternative');
      expect(APP_SHORTCUTS.TOGGLE_THEME).toHaveProperty('description');
    });
    
    it('should have all required app shortcuts', () => {
      expect(APP_SHORTCUTS).toHaveProperty('TOGGLE_THEME');
      expect(APP_SHORTCUTS).toHaveProperty('CHANGE_LANGUAGE');
      expect(APP_SHORTCUTS).toHaveProperty('OPEN_SETTINGS');
      expect(APP_SHORTCUTS).toHaveProperty('OPEN_COMMAND_PALETTE');
    });
  });
  
  describe('detectPlatform()', () => {
    let originalNavigator: Navigator;
    
    beforeEach(() => {
      originalNavigator = window.navigator;
    });
    
    afterEach(() => {
      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });
    
    it('should detect macOS', () => {
      Object.defineProperty(window, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          platform: 'MacIntel',
        },
        writable: true,
      });
      
      expect(detectPlatform()).toBe('mac');
    });
    
    it('should detect Windows', () => {
      Object.defineProperty(window, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          platform: 'Win32',
        },
        writable: true,
      });
      
      expect(detectPlatform()).toBe('windows');
    });
    
    it('should detect Linux', () => {
      Object.defineProperty(window, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
          platform: 'Linux x86_64',
        },
        writable: true,
      });
      
      expect(detectPlatform()).toBe('linux');
    });
  });
  
  describe('normalizeShortcut()', () => {
    it('should normalize lowercase shortcuts', () => {
      expect(normalizeShortcut('alt+t')).toBe('Alt+T');
      expect(normalizeShortcut('ctrl+shift+t')).toBe('Ctrl+Shift+T');
    });
    
    it('should normalize uppercase shortcuts', () => {
      expect(normalizeShortcut('ALT+T')).toBe('Alt+T');
      expect(normalizeShortcut('CTRL+SHIFT+T')).toBe('Ctrl+Shift+T');
    });
    
    it('should normalize mixed case shortcuts', () => {
      expect(normalizeShortcut('aLt+T')).toBe('Alt+T');
      expect(normalizeShortcut('CtRl+ShIfT+t')).toBe('Ctrl+Shift+T');
    });
    
    it('should handle shortcuts with spaces', () => {
      expect(normalizeShortcut('alt + t')).toBe('Alt+T');
      expect(normalizeShortcut('ctrl + shift + t')).toBe('Ctrl+Shift+T');
    });
  });
  
  describe('detectShortcutConflict()', () => {
    it('should detect Alt+T conflict', () => {
      const conflict = detectShortcutConflict('Alt+T');
      expect(conflict).toBeTruthy();
      expect(conflict).toContain('Browser');
    });
    
    it('should detect Ctrl+T conflict', () => {
      const conflict = detectShortcutConflict('Ctrl+T');
      expect(conflict).toBeTruthy();
      expect(conflict).toContain('New tab');
    });
    
    it('should return null for non-conflicting shortcuts', () => {
      expect(detectShortcutConflict('Alt+X')).toBeNull();
      expect(detectShortcutConflict('Ctrl+Shift+X')).toBeNull();
    });
    
    it('should be case-insensitive', () => {
      expect(detectShortcutConflict('alt+t')).toBeTruthy();
      expect(detectShortcutConflict('ALT+T')).toBeTruthy();
    });
  });
  
  describe('getAlternativeShortcut()', () => {
    it('should return alternative for Alt+T', () => {
      expect(getAlternativeShortcut('Alt+T')).toBe('Ctrl+Shift+T');
    });
    
    it('should return alternative for Alt+L', () => {
      expect(getAlternativeShortcut('Alt+L')).toBe('Ctrl+Shift+L');
    });
    
    it('should handle generic Alt shortcuts', () => {
      expect(getAlternativeShortcut('Alt+X')).toBe('Ctrl+Shift+X');
    });
    
    it('should handle Ctrl+Shift shortcuts', () => {
      const alternative = getAlternativeShortcut('Ctrl+Shift+T');
      expect(alternative).toBe('Ctrl+Alt+T');
    });
    
    it('should be case-insensitive', () => {
      expect(getAlternativeShortcut('alt+t')).toBe('Ctrl+Shift+T');
    });
  });
  
  describe('getResolvedShortcut()', () => {
    it('should resolve Alt to Option on macOS', () => {
      expect(getResolvedShortcut('Alt+T', 'mac')).toBe('Option+T');
    });
    
    it('should resolve Ctrl to Cmd on macOS', () => {
      expect(getResolvedShortcut('Ctrl+K', 'mac')).toBe('Cmd+K');
    });
    
    it('should not change shortcuts on Windows', () => {
      expect(getResolvedShortcut('Alt+T', 'windows')).toBe('Alt+T');
      expect(getResolvedShortcut('Ctrl+K', 'windows')).toBe('Ctrl+K');
    });
    
    it('should not change shortcuts on Linux', () => {
      expect(getResolvedShortcut('Alt+T', 'linux')).toBe('Alt+T');
      expect(getResolvedShortcut('Ctrl+K', 'linux')).toBe('Ctrl+K');
    });
    
    it('should handle complex shortcuts on macOS', () => {
      expect(getResolvedShortcut('Ctrl+Shift+T', 'mac')).toBe('Cmd+Shift+T');
    });
  });
  
  describe('shouldShowConflictWarning()', () => {
    it('should return true for conflicting shortcuts', () => {
      expect(shouldShowConflictWarning('Alt+T')).toBe(true);
      expect(shouldShowConflictWarning('Ctrl+T')).toBe(true);
    });
    
    it('should return false for non-conflicting shortcuts', () => {
      expect(shouldShowConflictWarning('Alt+X')).toBe(false);
      expect(shouldShowConflictWarning('Ctrl+Shift+X')).toBe(false);
    });
  });
  
  describe('getConflictMessage()', () => {
    it('should return message with alternative', () => {
      const message = getConflictMessage('Alt+T');
      expect(message).toContain('conflict');
      expect(message).toContain('Ctrl+Shift+T');
    });
    
    it('should return message without alternative', () => {
      const message = getConflictMessage('Alt+T', false);
      expect(message).toContain('conflict');
      expect(message).not.toContain('Ctrl+Shift+T');
    });
    
    it('should return empty string for non-conflicting shortcuts', () => {
      expect(getConflictMessage('Alt+X')).toBe('');
    });
  });
  
  describe('parseKeyboardEvent()', () => {
    it('should parse Ctrl+T', () => {
      const event = new KeyboardEvent('keydown', {
        key: 't',
        ctrlKey: true,
      });
      
      expect(parseKeyboardEvent(event)).toBe('Ctrl+T');
    });
    
    it('should parse Alt+T', () => {
      const event = new KeyboardEvent('keydown', {
        key: 't',
        altKey: true,
      });
      
      expect(parseKeyboardEvent(event)).toBe('Alt+T');
    });
    
    it('should parse Ctrl+Shift+T', () => {
      const event = new KeyboardEvent('keydown', {
        key: 't',
        ctrlKey: true,
        shiftKey: true,
      });
      
      expect(parseKeyboardEvent(event)).toBe('Ctrl+Shift+T');
    });
    
    it('should parse Meta+K (Cmd+K on macOS)', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
      });
      
      expect(parseKeyboardEvent(event)).toBe('Meta+K');
    });
    
    it('should handle special keys', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        ctrlKey: true,
      });
      
      expect(parseKeyboardEvent(event)).toBe('Ctrl+Enter');
    });
    
    it('should uppercase single letter keys', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
      });
      
      expect(parseKeyboardEvent(event)).toBe('Ctrl+A');
    });
  });
  
  describe('Integration', () => {
    it('should support typical usage flow', () => {
      // 1. Check if shortcut conflicts
      const shortcut = 'Alt+T';
      const hasConflict = shouldShowConflictWarning(shortcut);
      expect(hasConflict).toBe(true);
      
      // 2. Get conflict details
      const conflict = detectShortcutConflict(shortcut);
      expect(conflict).toBeTruthy();
      
      // 3. Get alternative
      const alternative = getAlternativeShortcut(shortcut);
      expect(alternative).toBe('Ctrl+Shift+T');
      
      // 4. Get user-friendly message
      const message = getConflictMessage(shortcut);
      expect(message).toContain('conflict');
      expect(message).toContain(alternative);
      
      // 5. Get platform-specific shortcut
      const resolved = getResolvedShortcut(shortcut, 'mac');
      expect(resolved).toBe('Option+T');
    });
    
    it('should handle non-conflicting shortcuts gracefully', () => {
      const shortcut = 'Alt+X';
      
      expect(shouldShowConflictWarning(shortcut)).toBe(false);
      expect(detectShortcutConflict(shortcut)).toBeNull();
      expect(getConflictMessage(shortcut)).toBe('');
      
      // Should still provide alternative
      expect(getAlternativeShortcut(shortcut)).toBe('Ctrl+Shift+X');
    });
  });
});
