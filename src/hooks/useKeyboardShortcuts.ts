/*
 * KEYBOARD SHORTCUTS HOOK - Enterprise Navigation
 *
 * Global keyboard shortcuts for navigation and actions
 * Alt+1-5 for navigation, Cmd/Ctrl+K for command palette
 */

'use client';

import { useEffect } from 'react';

import { getVisibleNavigationItems } from '@/data/navigation.config';
import { useRouter } from '@/libs/i18nNavigation';

export const useKeyboardShortcuts = () => {
  const router = useRouter();
  const navigationItems = getVisibleNavigationItems();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (
        e.target instanceof HTMLInputElement
        || e.target instanceof HTMLTextAreaElement
        || e.target instanceof HTMLSelectElement
        || (e.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return;
      }

      // Navigation shortcuts (Alt + 1-5)
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const keyNumber = Number.parseInt(e.key);
        if (keyNumber >= 1 && keyNumber <= 5) {
          e.preventDefault();
          const targetItem = navigationItems[keyNumber - 1];
          if (targetItem) {
            router.push(targetItem.href);
          }
        }
      }

      // Quick actions shortcuts
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'h': // Alt+H for Home
            e.preventDefault();
            router.push('/dashboard');
            break;
          case 'c': // Alt+C for Challenges
            e.preventDefault();
            router.push('/dashboard/challenges');
            break;
          case 'm': // Alt+M for My Challenges
            e.preventDefault();
            router.push('/dashboard/my-challenges');
            break;
          case 's': // Alt+S for Signals
            e.preventDefault();
            router.push('/dashboard/signals');
            break;
        }
      }

      // Global shortcuts
      if (!e.altKey && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case '/': // Ctrl+/ or Cmd+/ for help
            e.preventDefault();
            // TODO: Open help modal or navigate to help
            break;
        }
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, navigationItems]);

  // Return available shortcuts for display
  return {
    shortcuts: [
      { key: 'Alt+1', description: 'Challenges' },
      { key: 'Alt+2', description: 'My Challenges' },
      { key: 'Alt+3', description: 'Signals' },
      { key: 'Ctrl+K', description: 'Command Palette' },
      { key: 'Alt+H', description: 'Dashboard' },
      { key: 'Alt+C', description: 'Challenges' },
      { key: 'Alt+M', description: 'My Challenges' },
      { key: 'Alt+S', description: 'Signals' },
    ],
  };
};
