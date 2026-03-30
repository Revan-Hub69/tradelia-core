/*
 * TRADELIA NAVIGATION CONFIG v3.0 - Swing Trader Intelligence Terminal
 *
 * Single source of truth per navigation items
 * Pivotato da Prop Firm Challenge -> Terminale Intelligence Finanziaria
 */

export type NavigationItemId = 'dashboard' | 'liquidity' | 'squeeze' | 'ticker' | 'settings';

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
  LIQUIDITY_ENABLED: true,
  SQUEEZE_ENABLED: true,
  TICKER_ENABLED: true,
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
      id: 'dashboard',
      labelKey: 'Flows',
      ariaKey: 'Dashboard.nav_radar',
      href: '/dashboard',
      iconName: 'SignalsIcon',
      isPriority: true,
      featureFlag: 'RADAR_ENABLED',
      badgeType: 'dot',
    },
    {
      id: 'liquidity',
      labelKey: 'Structure',
      ariaKey: 'Dashboard.nav_liquidity',
      href: '/dashboard/liquidity',
      iconName: 'TrendingUpIcon',
      isPriority: true,
      featureFlag: 'LIQUIDITY_ENABLED',
    },
    {
      id: 'squeeze',
      labelKey: 'Volatility',
      ariaKey: 'Dashboard.nav_squeeze',
      href: '/dashboard/squeeze',
      iconName: 'WarningIcon',
      isPriority: true,
      featureFlag: 'SQUEEZE_ENABLED',
      badgeType: 'new',
    },
    {
      id: 'ticker',
      labelKey: 'Terminal',
      ariaKey: 'Dashboard.nav_ticker',
      href: '/dashboard/ticker',
      iconName: 'SearchIcon',
      isPriority: true,
      featureFlag: 'TICKER_ENABLED',
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
  dashboard: { type: 'dot' },
  squeeze: { type: 'new' },
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
