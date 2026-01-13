/**
 * CommandPaletteWrapper - Tradelia 2026
 * 
 * Wrapper component that integrates CommandProvider, CommandPalette,
 * and keyboard shortcuts (Ctrl+K to open).
 * 
 * Uses dynamic imports for CommandPalette to reduce initial bundle size.
 * 
 * @see Requirements: 16.1, 11.4
 */

'use client';

import { useEffect, useCallback, useState, Suspense, lazy, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CommandProvider, useCommandPalette, type Command } from './CommandProvider';
import { getCoreCommands, NAVIGATION_SHORTCUTS, SINGLE_KEY_SHORTCUTS } from '@/src/shared/lib/core-commands';
import { useDensity } from '@/src/shared/hooks/useDensity';

// Dynamic import for CommandPalette - only loaded when needed (REQ 11.4)
const CommandPalette = lazy(() => 
  import('./CommandPalette').then(m => ({ default: m.CommandPalette }))
);

// Skeleton fallback for CommandPalette while loading
const CommandPaletteSkeleton = () => (
  <div className="fixed inset-0 z-[100]" role="presentation">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
    <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-full max-w-lg mx-4 bg-background border-2 border-border rounded-xl shadow-2xl overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="w-5 h-5 bg-muted rounded animate-pulse" />
        <div className="flex-1 h-6 bg-muted rounded animate-pulse" />
      </div>
      <div className="p-4 space-y-2">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="h-10 bg-muted rounded animate-pulse" />
      </div>
    </div>
  </div>
);

interface CommandPaletteWrapperProps {
  children: ReactNode;
  /** Additional commands to register */
  additionalCommands?: Command[];
  /** Callback when help is opened */
  onOpenHelp?: () => void;
  /** Callback for logout */
  onLogout?: () => void;
}

/**
 * Inner component that uses the command palette context
 */
function CommandPaletteHotkeys({ onOpenHelp }: { onOpenHelp?: (() => void) | undefined }) {
  const { toggle, executeCommand, commands, isOpen } = useCommandPalette();

  // Track pending navigation shortcut (for two-key sequences like "g h")
  useEffect(() => {
    let pendingKey: string | null = null;
    let pendingTimeout: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if command palette is open (it handles its own keys)
      if (isOpen) return;

      // Don't handle if in input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      // Ctrl/Cmd + K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
        return;
      }

      // Handle two-key navigation shortcuts (g + key)
      if (pendingKey === 'g') {
        const shortcutKey = `g ${e.key.toLowerCase()}`;
        const commandId = NAVIGATION_SHORTCUTS[shortcutKey];
        
        if (commandId) {
          e.preventDefault();
          executeCommand(commandId);
        }
        
        // Clear pending key
        pendingKey = null;
        if (pendingTimeout) {
          clearTimeout(pendingTimeout);
          pendingTimeout = null;
        }
        return;
      }

      // Start two-key sequence with 'g'
      if (e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        pendingKey = 'g';
        // Clear after 1 second if no second key
        pendingTimeout = setTimeout(() => {
          pendingKey = null;
        }, 1000);
        return;
      }

      // Handle single-key shortcuts
      const singleKeyCommand = SINGLE_KEY_SHORTCUTS[e.key];
      if (singleKeyCommand && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        
        // Special handling for '?' to open help
        if (e.key === '?' && onOpenHelp) {
          onOpenHelp();
        } else {
          executeCommand(singleKeyCommand);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (pendingTimeout) {
        clearTimeout(pendingTimeout);
      }
    };
  }, [isOpen, toggle, executeCommand, commands, onOpenHelp]);

  // Only render CommandPalette when open (lazy loaded)
  if (!isOpen) return null;

  return (
    <Suspense fallback={<CommandPaletteSkeleton />}>
      <CommandPalette />
    </Suspense>
  );
}

/**
 * Main wrapper component
 */
export function CommandPaletteWrapper({
  children,
  additionalCommands = [],
  onOpenHelp,
  onLogout,
}: CommandPaletteWrapperProps) {
  const router = useRouter();
  const locale = useLocale();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { toggleDensity } = useDensity();

  // Sync with document theme on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setTheme(isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Navigation function
  const navigate = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    setTheme(newTheme);
    // Also update localStorage for persistence
    try {
      localStorage.setItem('theme', newTheme);
    } catch {
      // Ignore localStorage errors
    }
  }, [theme]);

  // Get core commands
  const coreCommands = getCoreCommands({
    navigate,
    locale,
    toggleTheme,
    currentTheme: theme,
    toggleDensity,
    openHelp: onOpenHelp,
    logout: onLogout,
  });

  // Combine core and additional commands
  const allCommands = [...coreCommands, ...additionalCommands];

  return (
    <CommandProvider initialCommands={allCommands}>
      {children}
      <CommandPaletteHotkeys onOpenHelp={onOpenHelp} />
    </CommandProvider>
  );
}
