/*
 * TRADELIA NAVIGATION CONFIG v3.0 - Challenge Dashboard 2026
 *
 * Single source of truth per navigation items
 * Supporta feature flags, badges, analytics tracking
 */

export type NavigationItemId = 
  | 'home' 
  | 'challenges' 
  | 'my-challenges' 
  | 'signals' 
  | 'settings';

export type NavigationItem = {
  id: NavigationItemId;
  labelKey: string;
  ariaKey: string;
  href: string;
  iconName: string;
  isPriority?: boolean; // Per prefetch intelligente
  featureFlag?: string; // Per feature gating
  badgeType?: 'dot' | 'count' | 'new';
  badgeValue?: number | string;
  disabled?: boolean;
  hidden?: boolean;
};

export type NavigationConfig = {
  items: NavigationItem[];
  ariaLabelKey: string;
  semanticRole: 'navigation';
};

/*
 * FEATURE FLAGS - Controllo visibilità sezioni
 * Collegato al database user permissions in futuro
 */
export const FEATURE_FLAGS = {
  SIGNALS_ENABLED: true, // AI Signal Generator
  CHALLENGES_LIBRARY: true, // Challenge catalog
  MY_CHALLENGES: true, // User's active challenges
  ADVANCED_ANALYTICS: false, // Advanced performance analytics (V2)
} as const;

/*
 * NAVIGATION ITEMS - Configurazione principale
 * Ordine definisce sequenza nella UI
 */
export const NAVIGATION_CONFIG: NavigationConfig = {
  ariaLabelKey: 'Dashboard.nav_aria_primary',
  semanticRole: 'navigation',
  items: [
    {
      id: 'home',
      labelKey: 'Dashboard.nav_home',
      ariaKey: 'Dashboard.nav_home',
      href: '/dashboard',
      iconName: 'HomeIcon',
      isPriority: true, // Prefetch priority
    },
    {
      id: 'challenges',
      labelKey: 'Dashboard.nav_challenges',
      ariaKey: 'Dashboard.nav_challenges',
      href: '/dashboard/challenges',
      iconName: 'ChallengesIcon',
      isPriority: true, // Prefetch priority
      featureFlag: 'CHALLENGES_LIBRARY',
      badgeType: 'new', // Nuove challenge disponibili
    },
    {
      id: 'my-challenges',
      labelKey: 'Dashboard.nav_my_challenges',
      ariaKey: 'Dashboard.nav_my_challenges',
      href: '/dashboard/my-challenges',
      iconName: 'MyChartsIcon',
      isPriority: true, // Prefetch priority
      featureFlag: 'MY_CHALLENGES',
      badgeType: 'dot', // Alert attivi (daily loss, etc.)
    },
    {
      id: 'signals',
      labelKey: 'Dashboard.nav_signals',
      ariaKey: 'Dashboard.nav_signals',
      href: '/dashboard/signals',
      iconName: 'SignalsIcon',
      isPriority: true, // Prefetch priority
      featureFlag: 'SIGNALS_ENABLED',
      badgeType: 'count', // Numero segnali attivi
    },
    {
      id: 'settings',
      labelKey: 'Dashboard.nav_settings',
      ariaKey: 'Dashboard.nav_settings',
      href: '/dashboard/settings',
      iconName: 'SettingsIcon',
      isPriority: false,
    },
  ],
};

/*
 * UTILITY FUNCTIONS - Helpers per filtering/processing
 */

export const getVisibleNavigationItems = (): NavigationItem[] => {
  return NAVIGATION_CONFIG.items.filter((item) => {
    // Nascondi se hidden flag
    if (item.hidden) {
      return false;
    }

    // Controlla feature flag se presente
    if (item.featureFlag && !FEATURE_FLAGS[item.featureFlag as keyof typeof FEATURE_FLAGS]) {
      return false;
    }

    return true;
  });
};

export const getEnabledNavigationItems = (): NavigationItem[] => {
  return getVisibleNavigationItems().filter(item => !item.disabled);
};

export const getPriorityNavigationItems = (): NavigationItem[] => {
  return getVisibleNavigationItems().filter(item => item.isPriority);
};

export const getNavigationItemById = (id: NavigationItemId): NavigationItem | undefined => {
  return NAVIGATION_CONFIG.items.find(item => item.id === id);
};

/*
 * BADGE MANAGEMENT - Dynamic badge state
 * In futuro collegato a database/real-time updates
 */
export type NavigationBadgeState = {
  [key: string]: {
    type: 'dot' | 'count' | 'new';
    value?: number | string;
    timestamp?: number;
  };
};

// Mock badge state - in produzione da database/context
export const MOCK_BADGE_STATE: NavigationBadgeState = {
  challenges: { type: 'new' }, // Nuove challenge disponibili
  'my-challenges': { type: 'dot' }, // Alert attivi (daily loss warning, etc.)
  signals: { type: 'count', value: 5 }, // 5 segnali attivi
};

export const getBadgeForItem = (itemId: NavigationItemId): NavigationBadgeState[string] | null => {
  return MOCK_BADGE_STATE[itemId] || null;
};

/*
 * ANALYTICS TRACKING - Navigation events
 * Preparato per implementazione analytics
 */
export type NavigationAnalyticsEvent = {
  action: 'nav_click' | 'nav_hover' | 'nav_focus';
  itemId: NavigationItemId;
  timestamp: number;
  metadata?: Record<string, any>;
};

export const trackNavigationEvent = (_event: NavigationAnalyticsEvent): void => {
  // TODO: Implementare tracking reale
  // Development logging removed for production readiness

  // In produzione: inviare a analytics service
  // analytics.track('navigation', _event);
};
