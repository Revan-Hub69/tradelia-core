/**
 * CHALLENGE CONSTANTS - Centralized Configuration
 * Best Practice 2026: Extract magic numbers and strings
 */

/**
 * Freshness Thresholds (days)
 */
export const FRESHNESS_THRESHOLDS = {
  EXCELLENT: 0, // T-0
  GOOD: 7, // T-7
  FAIR: 30, // T-30
  STALE: 90, // T-90+
} as const;

/**
 * Freshness Badge Configuration
 */
export const FRESHNESS_BADGES = {
  [FRESHNESS_THRESHOLDS.EXCELLENT]: {
    label: 'T-0',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-500/10',
  },
  [FRESHNESS_THRESHOLDS.GOOD]: {
    label: 'T-7',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10',
  },
  [FRESHNESS_THRESHOLDS.FAIR]: {
    label: 'T-30',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500/10',
  },
} as const;

export const FRESHNESS_STALE = {
  label: 'T-90+',
  color: 'text-red-600 dark:text-red-400',
  bg: 'bg-red-500/10',
} as const;

/**
 * Availability Status Thresholds
 */
export const AVAILABILITY_THRESHOLDS = {
  CLOSING_SOON_DAYS: 7,
  CLOSING_URGENT_DAYS: 3,
  REGISTRATION_WARNING_DAYS: 7,
  LIMITED_SPOTS_WARNING: 10,
} as const;

/**
 * Card Dimensions
 */
export const CARD_DIMENSIONS = {
  HEIGHT: 320, // px
  MIN_WIDTH: 280, // px
  MAX_WIDTH: 400, // px
  GRID_GAP: 16, // px
} as const;

/**
 * Animation Durations (ms)
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  DRAWER: 300,
} as const;

/**
 * Z-Index Layers
 */
export const Z_INDEX = {
  CARD: 1,
  DROPDOWN: 10,
  MODAL: 50,
  DRAWER: 50,
  TOAST: 100,
} as const;

/**
 * Comparison Limits
 */
export const COMPARISON_LIMITS = {
  MAX_ITEMS: 3,
  MIN_ITEMS: 2,
} as const;

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Trust Signal Defaults (fallback values)
 */
export const DEFAULT_TRUST_SIGNALS = {
  rating: 0,
  successRate: 0,
  traderCount: 0,
  totalPaid: 0,
  founded: new Date().getFullYear(),
} as const;

/**
 * Empty Array Constant (prevent re-creation)
 */
export const EMPTY_ARRAY: readonly never[] = Object.freeze([]);

/**
 * Empty Object Constant (prevent re-creation)
 */
export const EMPTY_OBJECT: Readonly<Record<string, never>> = Object.freeze({});

/**
 * Category Colors
 */
export const CATEGORY_COLORS = {
  free_competition: {
    border: 'border-green-500/20',
    bg: 'bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20',
    badge: 'from-green-500 to-emerald-500',
  },
  paid_evaluation: {
    border: 'border-blue-500/20',
    bg: 'bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20',
    badge: 'from-blue-500 to-blue-600',
  },
  ranking_based: {
    border: 'border-purple-500/20',
    bg: 'bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20',
    badge: 'from-purple-500 to-purple-600',
  },
} as const;

/**
 * Focusable Elements Selector
 */
export const FOCUSABLE_ELEMENTS_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Keyboard Keys
 */
export const KEYS = {
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ENTER: 'Enter',
  SPACE: ' ',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;
