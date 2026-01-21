/**
 * Keyboard Shortcut Conflict Detection
 * 
 * Detects conflicts between application shortcuts and browser/OS shortcuts.
 * Provides alternative shortcuts when conflicts are detected.
 * 
 * Note: This is a best-effort detection. It's impossible to detect all conflicts
 * across all browsers and operating systems. The goal is to catch common conflicts
 * and provide helpful alternatives.
 * 
 * @example
 * ```typescript
 * import { detectShortcutConflict, getAlternativeShortcut } from '@/lib/keyboard/shortcuts';
 * 
 * const conflict = detectShortcutConflict('Alt+T');
 * if (conflict) {
 *   const alternative = getAlternativeShortcut('Alt+T');
 *   console.log(`Conflict: ${conflict}. Try ${alternative} instead.`);
 * }
 * ```
 */

/**
 * Platform type
 */
export type Platform = 'windows' | 'mac' | 'linux' | 'unknown';

/**
 * Shortcut definition
 */
export interface Shortcut {
  key: string;
  modifiers: string[];
  description: string;
}

/**
 * Known browser/OS shortcuts that may conflict
 * 
 * This is not exhaustive - it's a best-effort list of common conflicts.
 * Sources:
 * - Chrome keyboard shortcuts: https://support.google.com/chrome/answer/157179
 * - Firefox keyboard shortcuts: https://support.mozilla.org/en-US/kb/keyboard-shortcuts-perform-firefox-tasks-quickly
 * - Safari keyboard shortcuts: https://support.apple.com/guide/safari/keyboard-and-other-shortcuts-cpsh003/mac
 * - Windows keyboard shortcuts: https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec
 */
export const RESERVED_SHORTCUTS: Record<string, string> = {
  // Alt + Letter shortcuts (common conflicts)
  'Alt+D': 'Browser: Focus address bar (Chrome, Firefox)',
  'Alt+E': 'Browser: Open Edit menu (Firefox)',
  'Alt+F': 'Browser: Open File menu (Firefox)',
  'Alt+H': 'Browser: Open Help menu (Firefox)',
  'Alt+T': 'Browser: Open Tools menu (Firefox) / Focus address bar (some browsers)',
  'Alt+V': 'Browser: Open View menu (Firefox)',
  
  // Ctrl + Letter shortcuts (very common)
  'Ctrl+T': 'Browser: New tab',
  'Ctrl+W': 'Browser: Close tab',
  'Ctrl+N': 'Browser: New window',
  'Ctrl+Shift+T': 'Browser: Reopen closed tab',
  'Ctrl+Tab': 'Browser: Switch tabs',
  
  // Cmd + Letter shortcuts (macOS)
  'Cmd+T': 'Browser: New tab (macOS)',
  'Cmd+W': 'Browser: Close tab (macOS)',
  'Cmd+N': 'Browser: New window (macOS)',
  
  // Function keys
  'F1': 'Browser: Open help',
  'F5': 'Browser: Refresh page',
  'F11': 'Browser: Toggle fullscreen',
  'F12': 'Browser: Open developer tools',
};

/**
 * Application shortcuts
 */
export const APP_SHORTCUTS = {
  TOGGLE_THEME: {
    primary: 'Alt+T',
    alternative: 'Ctrl+Shift+T',
    description: 'Toggle theme',
  },
  CHANGE_LANGUAGE: {
    primary: 'Alt+L',
    alternative: 'Ctrl+Shift+L',
    description: 'Change language',
  },
  OPEN_SETTINGS: {
    primary: 'Alt+S',
    alternative: 'Ctrl+Shift+S',
    description: 'Open settings',
  },
  OPEN_COMMAND_PALETTE: {
    primary: 'Ctrl+K',
    alternative: 'Cmd+K',
    description: 'Open command palette',
  },
} as const;

/**
 * Detect the current platform
 * 
 * @returns Platform type
 */
export function detectPlatform(): Platform {
  if (typeof window === 'undefined') {
    return 'unknown';
  }
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform?.toLowerCase() || '';
  
  if (platform.includes('mac') || userAgent.includes('mac')) {
    return 'mac';
  }
  
  if (platform.includes('win') || userAgent.includes('win')) {
    return 'windows';
  }
  
  if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux';
  }
  
  return 'unknown';
}

/**
 * Normalize a shortcut string
 * 
 * Converts shortcuts to a consistent format for comparison.
 * 
 * @param shortcut - Shortcut string (e.g., "alt+t", "Alt+T", "ALT+T")
 * @returns Normalized shortcut (e.g., "Alt+T")
 * 
 * @example
 * ```typescript
 * normalizeShortcut('alt+t'); // "Alt+T"
 * normalizeShortcut('CTRL+SHIFT+T'); // "Ctrl+Shift+T"
 * ```
 */
export function normalizeShortcut(shortcut: string): string {
  return shortcut
    .split('+')
    .map(part => {
      const normalized = part.trim().toLowerCase();
      
      // Capitalize first letter
      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    })
    .join('+');
}

/**
 * Detect if a shortcut conflicts with browser/OS shortcuts
 * 
 * @param shortcut - Shortcut to check (e.g., "Alt+T")
 * @returns Conflict description if found, null otherwise
 * 
 * @example
 * ```typescript
 * detectShortcutConflict('Alt+T'); // "Browser: Open Tools menu (Firefox)"
 * detectShortcutConflict('Alt+X'); // null (no known conflict)
 * ```
 */
export function detectShortcutConflict(shortcut: string): string | null {
  const normalized = normalizeShortcut(shortcut);
  return RESERVED_SHORTCUTS[normalized] || null;
}

/**
 * Get an alternative shortcut that doesn't conflict
 * 
 * @param shortcut - Original shortcut (e.g., "Alt+T")
 * @returns Alternative shortcut (e.g., "Ctrl+Shift+T")
 * 
 * @example
 * ```typescript
 * getAlternativeShortcut('Alt+T'); // "Ctrl+Shift+T"
 * getAlternativeShortcut('Alt+L'); // "Ctrl+Shift+L"
 * ```
 */
export function getAlternativeShortcut(shortcut: string): string {
  const normalized = normalizeShortcut(shortcut);
  
  // Check if this is a known app shortcut
  for (const appShortcut of Object.values(APP_SHORTCUTS)) {
    if (normalizeShortcut(appShortcut.primary) === normalized) {
      return appShortcut.alternative;
    }
  }
  
  // Generic fallback: replace Alt with Ctrl+Shift
  if (normalized.startsWith('Alt+')) {
    const key = normalized.replace('Alt+', '');
    return `Ctrl+Shift+${key}`;
  }
  
  // If already using Ctrl+Shift, try Ctrl+Alt
  if (normalized.startsWith('Ctrl+Shift+')) {
    const key = normalized.replace('Ctrl+Shift+', '');
    return `Ctrl+Alt+${key}`;
  }
  
  // Fallback: add Shift
  return `Shift+${normalized}`;
}

/**
 * Get the resolved shortcut for the current platform
 * 
 * On macOS, Alt key behaves differently (Option key).
 * This function returns the actual shortcut that will work on the user's platform.
 * 
 * @param shortcut - Shortcut to resolve (e.g., "Alt+T")
 * @param platform - Platform (defaults to detected platform)
 * @returns Resolved shortcut for the platform
 * 
 * @example
 * ```typescript
 * getResolvedShortcut('Alt+T', 'mac'); // "Option+T"
 * getResolvedShortcut('Alt+T', 'windows'); // "Alt+T"
 * getResolvedShortcut('Ctrl+K', 'mac'); // "Cmd+K"
 * ```
 */
export function getResolvedShortcut(
  shortcut: string,
  platform: Platform = detectPlatform()
): string {
  const normalized = normalizeShortcut(shortcut);
  
  if (platform === 'mac') {
    // On macOS, replace Alt with Option and Ctrl with Cmd
    return normalized
      .replace(/^Alt\+/, 'Option+')
      .replace(/^Ctrl\+/, 'Cmd+')
      .replace(/\+Ctrl\+/, '+Cmd+');
  }
  
  return normalized;
}

/**
 * Check if a shortcut should show a conflict warning
 * 
 * @param shortcut - Shortcut to check
 * @returns True if warning should be shown
 * 
 * @example
 * ```typescript
 * shouldShowConflictWarning('Alt+T'); // true (conflicts with Firefox)
 * shouldShowConflictWarning('Alt+X'); // false (no known conflict)
 * ```
 */
export function shouldShowConflictWarning(shortcut: string): boolean {
  return detectShortcutConflict(shortcut) !== null;
}

/**
 * Get a user-friendly conflict message
 * 
 * @param shortcut - Shortcut that has a conflict
 * @param includeAlternative - Whether to include alternative suggestion
 * @returns User-friendly message
 * 
 * @example
 * ```typescript
 * getConflictMessage('Alt+T'); 
 * // "Shortcut may conflict with browser. Try Ctrl+Shift+T"
 * 
 * getConflictMessage('Alt+T', false);
 * // "Shortcut may conflict with browser"
 * ```
 */
export function getConflictMessage(
  shortcut: string,
  includeAlternative: boolean = true
): string {
  const conflict = detectShortcutConflict(shortcut);
  
  if (!conflict) {
    return '';
  }
  
  const baseMessage = 'Shortcut may conflict with browser';
  
  if (!includeAlternative) {
    return baseMessage;
  }
  
  const alternative = getAlternativeShortcut(shortcut);
  return `${baseMessage}. Try ${alternative}`;
}

/**
 * Parse a keyboard event into a shortcut string
 * 
 * @param event - Keyboard event
 * @returns Shortcut string (e.g., "Ctrl+Shift+T")
 * 
 * @example
 * ```typescript
 * // In an event handler:
 * const shortcut = parseKeyboardEvent(event);
 * console.log(shortcut); // "Ctrl+T"
 * ```
 */
export function parseKeyboardEvent(event: KeyboardEvent): string {
  const modifiers: string[] = [];
  
  if (event.ctrlKey) modifiers.push('Ctrl');
  if (event.altKey) modifiers.push('Alt');
  if (event.shiftKey) modifiers.push('Shift');
  if (event.metaKey) modifiers.push('Meta');
  
  const key = event.key.length === 1 
    ? event.key.toUpperCase() 
    : event.key;
  
  return [...modifiers, key].join('+');
}
