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
          case 'l': // Alt+L for Learn
            e.preventDefault();
            router.push('/dashboard/learn');
            break;
          case 'p': // Alt+P for Profile
            e.preventDefault();
            router.push('/dashboard/profile');
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
      { key: 'Alt+1', description: 'Dashboard' },
      { key: 'Alt+2', description: 'Learn' },
      { key: 'Alt+3', description: 'Tools' },
      { key: 'Alt+4', description: 'Community' },
      { key: 'Alt+5', description: 'Profile' },
      { key: 'Ctrl+K', description: 'Command Palette' },
      { key: 'Alt+H', description: 'Home' },
      { key: 'Alt+L', description: 'Learn' },
      { key: 'Alt+P', description: 'Profile' },
    ],
  };
};
