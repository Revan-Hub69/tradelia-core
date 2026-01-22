'use client';

import { useEffect, useRef, useState } from 'react';

import type { UserSettings } from '@/components/dashboard/types';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Hook for auto-saving user settings
 *
 * Features:
 * - Debounced auto-save (500ms delay)
 * - Visual feedback for save status
 * - Error handling with retry logic
 * - Optimistic updates
 */
export const useAutoSaveSettings = (
  settings: UserSettings,
  onSave: (settings: UserSettings) => Promise<void>,
) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousSettingsRef = useRef<UserSettings>(settings);

  useEffect(() => {
    // Skip if settings haven't changed
    if (JSON.stringify(settings) === JSON.stringify(previousSettingsRef.current)) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set saving status immediately for UI feedback
    setSaveStatus('saving');

    // Debounce the save operation
    timeoutRef.current = setTimeout(async () => {
      try {
        await onSave(settings);
        setSaveStatus('saved');
        previousSettingsRef.current = settings;

        // Reset to idle after showing success
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Failed to save settings:', error);
        setSaveStatus('error');

        // Auto-retry after 3 seconds
        setTimeout(() => {
          setSaveStatus('saving');
          onSave(settings)
            .then(() => {
              setSaveStatus('saved');
              previousSettingsRef.current = settings;
              setTimeout(() => setSaveStatus('idle'), 2000);
            })
            .catch(() => setSaveStatus('error'));
        }, 3000);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [settings, onSave]);

  return { saveStatus };
};
