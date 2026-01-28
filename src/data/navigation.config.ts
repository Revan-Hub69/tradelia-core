/*
 * TRADELIA NAVIGATION CONFIG v2.0 - Enterprise 2026
 *
 * Single source of truth per navigation items
 * Supporta feature flags, badges, analytics tracking
 */

export type NavigationItemId = 'home' | 'challenges' | 'my-challenges' | 'signals' | 'help' | 'profile';

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
  CHALLENGES_ENABLED: true, // Challenge library
  MY_CHALLENGES_ENABLED: true, // Active challenges tracking
  SIGNALS_ENABLED: true, // AI signal generator
  PROFILE_BADGES: true, // Sistema badge profilo
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
      id: 'challenges',
      labelKey: 'Dashboard.nav_challenges',
      ariaKey: 'Dashboard.nav_challenges',
      href: '/dashboard/challenges',
      iconName: 'ChallengesIcon',
      isPriority: true, // Prefetch priority
      featureFlag: 'CHALLENGES_ENABLED',
      badgeType: 'dot', // New challenges available
    },
    {
      id: 'my-challenges',
      labelKey: 'Dashboard.nav_my_challenges',
      ariaKey: 'Dashboard.nav_my_challenges',
      href: '/dashboard/my-challenges',
      iconName: 'MyChartsIcon',
      isPriority: true, // Prefetch priority
      featureFlag: 'MY_CHALLENGES_ENABLED',
    },
    {
      id: 'signals',
      labelKey: 'Dashboard.nav_signals',
      ariaKey: 'Dashboard.nav_signals',
      href: '/dashboard/signals',
      iconName: 'SignalsIcon',
      featureFlag: 'SIGNALS_ENABLED',
      badgeType: 'dot', // New signals available
    },
  ],
};

// Header navigation items (tablet/desktop) - includes help
export const HEADER_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'help',
    labelKey: 'Dashboard.nav_help',
    ariaKey: 'Dashboard.nav_help',
    href: '/dashboard/help',
    iconName: 'HelpIcon',
    isPriority: false,
  },
];

// Mobile menu items - includes help, profile, settings
export const MOBILE_MENU_ITEMS: NavigationItem[] = [
  {
    id: 'help',
    labelKey: 'Dashboard.nav_help',
    ariaKey: 'Dashboard.nav_help',
    href: '/dashboard/help',
    iconName: 'HelpIcon',
    isPriority: false,
  },
  {
    id: 'profile',
    labelKey: 'Dashboard.nav_profile',
    ariaKey: 'Dashboard.nav_profile',
    href: '/dashboard/profile',
    iconName: 'ProfileIcon',
    isPriority: false,
    featureFlag: 'PROFILE_BADGES',
  },
];

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
  challenges: { type: 'dot' }, // New challenges available
  signals: { type: 'count', value: 3 }, // 3 new signals
  profile: { type: 'new', timestamp: Date.now() }, // Badge nuovo temporaneo
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
