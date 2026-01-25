/*
 * TRADELIA NAVIGATION CONFIG v2.0 - Enterprise 2026
 *
 * Single source of truth per navigation items
 * Supporta feature flags, badges, analytics tracking
 */

export type NavigationItemId = 'home' | 'learn' | 'tools' | 'community' | 'help' | 'profile';

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
  TOOLS_ENABLED: true, // Strumenti trading
  COMMUNITY_ENABLED: true, // Community features
  PROFILE_BADGES: true, // Sistema badge profilo
  LEARN_PROGRESS: true, // Progress tracking
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
      id: 'learn',
      labelKey: 'Dashboard.nav_learn',
      ariaKey: 'Dashboard.nav_learn',
      href: '/dashboard/learn',
      iconName: 'LearnIcon',
      isPriority: true, // Prefetch priority
      featureFlag: 'LEARN_PROGRESS',
      badgeType: 'dot', // Nuove lezioni disponibili
    },
    {
      id: 'tools',
      labelKey: 'Dashboard.nav_tools',
      ariaKey: 'Dashboard.nav_tools',
      href: '/dashboard/tools',
      iconName: 'ToolsIcon',
      featureFlag: 'TOOLS_ENABLED',
      // disabled: !FEATURE_FLAGS.TOOLS_ENABLED, // ENABLED NOW
    },
    {
      id: 'community',
      labelKey: 'Dashboard.nav_community',
      ariaKey: 'Dashboard.nav_community',
      href: '/dashboard/community',
      iconName: 'CommunityIcon',
      featureFlag: 'COMMUNITY_ENABLED',
      badgeType: 'dot', // Nuovi messaggi/reply
    },
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
      isPriority: false, // Non priority per prefetch
      featureFlag: 'PROFILE_BADGES',
      badgeType: 'new', // Badge temporaneo 24h
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
  learn: { type: 'dot' }, // Nuove lezioni
  community: { type: 'count', value: 3 }, // 3 nuovi messaggi
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
