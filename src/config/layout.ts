/*
 * LAYOUT CONFIGURATION - SINGLE SOURCE OF TRUTH
 *
 * Centralized layout dimensions for the entire application
 * Based on 2026 best practices: Single Source of Truth principle
 *
 * USAGE:
 * - Import this config in TypeScript/React components
 * - Use LAYOUT_CSS_VARS for inline styles
 * - CSS files should reference CSS custom properties only
 *
 * RESEARCH SOURCES:
 * - Vercel Technical Audits 2026
 * - Next.js App Router Best Practices
 * - Apple Human Interface Guidelines
 */

/**
 * Layout configuration object
 * All dimensions in pixels for consistency
 */
export const LAYOUT_CONFIG = {
  header: {
    height: 64,
    heightMobile: 56,
    zIndex: 40,
  },
  sidebar: {
    widthExpanded: 240,
    widthCollapsed: 64,
    zIndex: 40,
  },
  navigation: {
    bottomHeight: 64,
    zIndex: 50,
  },
  breakpoints: {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
  },
} as const;

/**
 * CSS custom properties generated from config
 * Use these for inline styles or dynamic CSS
 */
export const LAYOUT_CSS_VARS = {
  '--header-height': `${LAYOUT_CONFIG.header.height}px`,
  '--header-height-mobile': `${LAYOUT_CONFIG.header.heightMobile}px`,
  '--sidebar-width-expanded': `${LAYOUT_CONFIG.sidebar.widthExpanded}px`,
  '--sidebar-width-collapsed': `${LAYOUT_CONFIG.sidebar.widthCollapsed}px`,
  '--nav-height': `${LAYOUT_CONFIG.navigation.bottomHeight}px`,
} as const;

/**
 * Helper function to get current sidebar width based on collapsed state
 */
export function getSidebarWidth(isCollapsed: boolean): number {
  return isCollapsed
    ? LAYOUT_CONFIG.sidebar.widthCollapsed
    : LAYOUT_CONFIG.sidebar.widthExpanded;
}

/**
 * Helper function to get sidebar width as CSS value
 */
export function getSidebarWidthCSS(isCollapsed: boolean): string {
  return `${getSidebarWidth(isCollapsed)}px`;
}

/**
 * Helper function to get header height based on viewport
 */
export function getHeaderHeight(isMobile: boolean): number {
  return isMobile
    ? LAYOUT_CONFIG.header.heightMobile
    : LAYOUT_CONFIG.header.height;
}

/**
 * TypeScript types for layout dimensions
 */
export type LayoutConfig = typeof LAYOUT_CONFIG;
export type LayoutCSSVars = typeof LAYOUT_CSS_VARS;
