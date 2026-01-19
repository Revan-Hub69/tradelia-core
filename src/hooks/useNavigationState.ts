/*
 * NAVIGATION STATE MACHINE - Enterprise 2026
 * 
 * Gestisce tutti gli stati di navigazione con pattern enterprise
 * Separazione tra visual states e UX messaging
 */

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from '@/libs/i18nNavigation';
import { trackNavigationEvent, type NavigationItemId } from '@/data/navigation.config';

// Visual states per UI
export type NavigationVisualState = 'default' | 'pressed' | 'pending' | 'active';

// UX messaging states (separati)
export type NavigationUXState = 'blocked' | 'offline' | 'error' | null;

// Online status hook
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Feature flag hook (mock - in produzione da database)
const useFeatureFlag = (href: string): boolean => {
  // Mock feature gating logic
  if (href.includes('/tools')) return false; // Tools temporaneamente disabilitato
  return true;
};

export interface NavigationStateHook {
  visualState: NavigationVisualState;
  uxState: NavigationUXState;
  navigate: () => void;
  canNavigate: boolean;
}

export const useNavigationState = (
  href: string,
  itemId: NavigationItemId
): NavigationStateHook => {
  const [visualState, setVisualState] = useState<NavigationVisualState>('default');
  const [uxState, setUXState] = useState<NavigationUXState>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const isEnabled = useFeatureFlag(href);

  // Auto-reset pressed state
  useEffect(() => {
    if (visualState === 'pressed') {
      const timer = setTimeout(() => setVisualState('default'), 150);
      return () => clearTimeout(timer);
    }
    // No cleanup needed for other states
    return undefined;
  }, [visualState]);

  // Navigation handler
  const navigate = () => {
    // UX messaging checks
    if (!isEnabled) {
      setUXState('blocked');
      return;
    }
    
    if (!isOnline) {
      setUXState('offline');
      return;
    }

    // Clear UX state and proceed
    setUXState(null);
    setVisualState('pressed');

    // Track navigation event
    trackNavigationEvent({
      action: 'nav_click',
      itemId,
      timestamp: Date.now(),
      metadata: { href, isOnline, isEnabled },
    });

    // Use transition for pending state
    startTransition(() => {
      // Navigation handled by Next.js App Router
      // Error handling via error boundaries, not here
      router.push(href);
    });
  };

  return {
    visualState: isPending ? 'pending' : visualState,
    uxState,
    navigate,
    canNavigate: isEnabled && isOnline,
  };
};

// Hook per gestire pending state con timeout
export const usePendingAnnouncement = (isPending: boolean, delay = 250) => {
  const [shouldAnnounce, setShouldAnnounce] = useState(false);

  useEffect(() => {
    if (isPending) {
      const timer = setTimeout(() => {
        setShouldAnnounce(true);
      }, delay);

      return () => {
        clearTimeout(timer);
        setShouldAnnounce(false);
      };
    } else {
      setShouldAnnounce(false);
      // No cleanup needed when not pending
      return undefined;
    }
  }, [isPending, delay]);

  return shouldAnnounce;
};