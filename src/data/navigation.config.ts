/*
 * TRADELIA NAVIGATION CONFIG v3.0 - Swing Trader Intelligence Terminal
 *
 * Single source of truth per navigation items
 * Pivotato da Prop Firm Challenge -> Terminale Intelligence Finanziaria
 */

export type NavigationItemId = 'radar' | 'structure' | 'volatility' | 'terminal' | 'settings';

export type SettingsNavItem = Extract<NavigationItemId, 'settings'>;

export type NavigationItem = {
  id: NavigationItemId;
  labelKey: string;
  ariaKey: string;
  href: string;
  iconName: string;
  isPriority?: boolean;
  featureFlag?: string;
  badgeType?: 'dot' | 'count' | 'new';
  badgeValue?: number | string;
  disabled?: boolean;
  hidden?: boolean;
  sectionDivider?: boolean;
};

export type NavigationConfig = {
  items: NavigationItem[];
  ariaLabelKey: string;
  semanticRole: 'navigation';
};

/*
 * FEATURE FLAGS - Controllo visibilità sezioni
 */
export const FEATURE_FLAGS = {
  RADAR_ENABLED: true,
  STRUCTURE_ENABLED: true,
  VOLATILITY_ENABLED: true,
  TERMINAL_ENABLED: true,
} as const;

/*
 * NAVIGATION ITEMS - Swing Trader Intelligence Terminal
 * 4 voci principali per la nuova orientamento
 */
export const NAVIGATION_CONFIG: NavigationConfig = {
  ariaLabelKey: 'Dashboard.nav_aria_primary',
  semanticRole: 'navigation',
  items: [
    {
      id: 'radar',
      labelKey: 'Radar',
      ariaKey: 'Dashboard.nav_radar',
      href: '/dashboard',
      iconName: 'SignalsIcon',
      isPriority: true,
      featureFlag: 'RADAR_ENABLED',
      badgeType: 'dot',
    },
    {
      id: 'structure',
      labelKey: 'Structure',
      ariaKey: 'Dashboard.nav_structure',
      href: '/dashboard/structure',
      iconName: 'TrendingUpIcon',
      isPriority: true,
      featureFlag: 'STRUCTURE_ENABLED',
    },
    {
      id: 'volatility',
      labelKey: 'Volatility',
      ariaKey: 'Dashboard.nav_volatility',
      href: '/dashboard/volatility',
      iconName: 'WarningIcon',
      isPriority: true,
      featureFlag: 'VOLATILITY_ENABLED',
      badgeType: 'new',
    },
    {
      id: 'terminal',
      labelKey: 'Terminal',
      ariaKey: 'Dashboard.nav_terminal',
      href: '/dashboard/terminal',
      iconName: 'SearchIcon',
      isPriority: true,
      featureFlag: 'TERMINAL_ENABLED',
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
    if (item.hidden) {
      return false;
    }

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
 */
export type NavigationBadgeState = {
  [key: string]: {
    type: 'dot' | 'count' | 'new';
    value?: number | string;
    timestamp?: number;
  };
};

export const MOCK_BADGE_STATE: NavigationBadgeState = {
  radar: { type: 'dot' },
  volatility: { type: 'new' },
};

export const getBadgeForItem = (itemId: NavigationItemId): NavigationBadgeState[string] | null => {
  return MOCK_BADGE_STATE[itemId] || null;
};

/*
 * ANALYTICS TRACKING - Navigation events
 */
export type NavigationAnalyticsEvent = {
  action: 'nav_click' | 'nav_hover' | 'nav_focus';
  itemId: NavigationItemId;
  timestamp: number;
  metadata?: Record<string, any>;
};

export const trackNavigationEvent = (_event: NavigationAnalyticsEvent): void => {
  // Development logging removed for production readiness
};
