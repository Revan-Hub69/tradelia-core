/*
 * TRADELIA NAVIGATION CONFIG v2.0 - Enterprise 2026
 *
 * Single source of truth per navigation items
 * Supporta feature flags, badges, analytics tracking
 */

export type NavigationItemId = 'dashboard' | 'academy' | 'fundamentals' | 'dca-simulator' | 'tools' | 'settings';

export type SettingsNavItem = Extract<NavigationItemId, 'settings'>;

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
  sectionDivider?: boolean; // Per separatore visivo
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
  ACADEMY_ENABLED: true, // Academy/Courses
  FUNDAMENTALS_ENABLED: true, // Fundamental analysis
  DCA_SIMULATOR_ENABLED: true, // DCA/PAC simulator
  TOOLS_ENABLED: true, // Recommended platforms (affiliate)
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
      id: 'academy',
      labelKey: 'Dashboard.nav_academy',
      ariaKey: 'Dashboard.nav_academy',
      href: '/dashboard/academy',
      iconName: 'LearnIcon',
      isPriority: true, // Prefetch priority
      featureFlag: 'ACADEMY_ENABLED',
      badgeType: 'new', // New courses available
    },
    {
      id: 'fundamentals',
      labelKey: 'Dashboard.nav_fundamentals',
      ariaKey: 'Dashboard.nav_fundamentals',
      href: '/dashboard/fundamentals',
      iconName: 'GlobeIcon', // Esplora = discovery, exploration
      isPriority: true, // Prefetch priority
      featureFlag: 'FUNDAMENTALS_ENABLED',
    },
    {
      id: 'dca-simulator',
      labelKey: 'Dashboard.nav_dca_simulator',
      ariaKey: 'Dashboard.nav_dca_simulator',
      href: '/dashboard/dca-simulator',
      iconName: 'CalculatorIcon', // Planning & calculation
      featureFlag: 'DCA_SIMULATOR_ENABLED',
      badgeType: 'new', // New feature
    },
    // Affiliate/Monetization section - Separated with divider
    {
      id: 'tools',
      labelKey: 'Dashboard.nav_tools',
      ariaKey: 'Dashboard.nav_tools',
      href: '/dashboard/tools',
      iconName: 'ToolsIcon', // Cassetta attrezzi
      featureFlag: 'TOOLS_ENABLED',
      sectionDivider: true, // Visual separator
    },
  ],
};

// Header navigation items (tablet/desktop)
export const HEADER_NAVIGATION_ITEMS: NavigationItem[] = [];

// Mobile menu items
export const MOBILE_MENU_ITEMS: NavigationItem[] = [];

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
  academy: { type: 'new' }, // New courses available
  fundamentals: { type: 'dot' }, // New analysis available
  'dca-simulator': { type: 'new' }, // New feature
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
