/**
 * Tradelia 2026 Constants
 * 
 * Costanti condivise che definiscono i valori fondamentali del sistema
 */

export const TRADELIA_CONSTANTS = {
  // Bundle size budgets (in bytes)
  BUNDLE_BUDGETS: {
    MARKETING: 150 * 1024, // 150KB
    DASHBOARD: 300 * 1024, // 300KB
    SHARED: 100 * 1024,    // 100KB
  },

  // Performance budgets
  PERFORMANCE: {
    LIGHTHOUSE_PERFORMANCE_MIN: 95,
    LIGHTHOUSE_ACCESSIBILITY_MIN: 100,
    FIRST_CONTENTFUL_PAINT_MAX: 1500, // ms
    LARGEST_CONTENTFUL_PAINT_MAX: 2000, // ms
  },

  // Accessibility standards
  ACCESSIBILITY: {
    CONTRAST_RATIO_PRIMARY: 8, // 8:1 for WCAG AAA+
    CONTRAST_RATIO_SECONDARY: 4.5, // 4.5:1 for WCAG AA
    MIN_TOUCH_TARGET: 44, // px
    FOCUS_RING_WIDTH: 2, // px
  },

  // Animation and transitions
  ANIMATION: {
    DURATION_FAST: 150, // ms
    DURATION_NORMAL: 300, // ms
    EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Data freshness categories
  DATA_FRESHNESS: {
    IMMUTABLE_ASSET: 'immutable-asset',
    FRESHNESS_CRITICAL: 'freshness-critical',
    STALE_ALLOWED: 'stale-allowed',
    STATIC_SNAPSHOT: 'static-snapshot',
  },

  // Error budgets
  ERROR_BUDGETS: {
    API_AVAILABILITY: 0.999, // 99.9%
    PAGE_PERFORMANCE: 0.95,  // 95%
    DATA_FRESHNESS: 0.99,    // 99%
  },

  // Breakpoints (matching Tailwind CSS)
  BREAKPOINTS: {
    SM: 640,  // px
    MD: 768,  // px
    LG: 1024, // px
    XL: 1280, // px
  },

  // Layout constants
  LAYOUT: {
    SIDEBAR_EXPANDED: 280, // px
    SIDEBAR_COMPACT: 72,   // px
    HEADER_HEIGHT: 56,     // px (h-14)
    MAX_CONTENT_WIDTH: 672, // px (max-w-2xl)
  },

  // Tradelia 2026 principles
  PRINCIPLES: {
    CLARITY_OVER_PERSUASION: 'chiarezza > persuasione',
    VERIFIABILITY_OVER_OPINION: 'verificabilità > opinione',
    NEUTRALITY_OVER_BIAS: 'neutralità > bias',
  },
} as const;

// Type-safe access to constants
export type TradeliaConstants = typeof TRADELIA_CONSTANTS;