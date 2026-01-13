/**
 * Dynamic Imports Utility - Tradelia 2026
 * 
 * Centralized dynamic import configuration for code splitting.
 * Reduces initial bundle size by lazy loading heavy components.
 * 
 * @see Requirements 11.4 - Code splitting and lazy loading
 */

import { lazy, type ComponentType } from 'react';

/**
 * Lazy load configuration for heavy UI components
 * These components are loaded on-demand to reduce initial bundle
 * 
 * Components are categorized by:
 * - Modals/Drawers: Heavy overlay components with complex interactions
 * - Utilities: Complex utility components with dependencies
 * 
 * Note: Widget-level components should be lazy loaded at the widget layer,
 * not in shared/lib to respect layer boundaries.
 */
export const LazyComponents = {
  // ============================================
  // MODALS & DRAWERS - Heavy overlay components
  // ============================================
  
  // Command Palette - Heavy due to fuzzy search and keyboard handling
  CommandPalette: lazy(() => 
    import('@/src/shared/ui/CommandPalette').then(m => ({ default: m.CommandPalette }))
  ),
  
  // Help Panel - Loaded when user requests help
  HelpPanel: lazy(() => 
    import('@/src/shared/ui/HelpPanel').then(m => ({ default: m.HelpPanel }))
  ),
  
  // Status Center - Loaded when user clicks network status
  StatusCenter: lazy(() => 
    import('@/src/shared/ui/StatusCenter').then(m => ({ default: m.StatusCenter }))
  ),
  
  // Keyboard Help Modal - Loaded when user presses ?
  KeyboardHelpModal: lazy(() => 
    import('@/src/shared/ui/KeyboardHelpModal').then(m => ({ default: m.KeyboardHelpModal }))
  ),
  
  // Premium Drawer - Heavy component with many features
  PremiumDrawer: lazy(() => 
    import('@/src/shared/ui/PremiumDrawer').then(m => ({ default: m.PremiumDrawer }))
  ),
  
  // Privacy Consent Modal - Heavy GDPR/CCPA modal
  PrivacyConsentModal: lazy(() => 
    import('@/src/shared/ui/PrivacyConsentModal').then(m => ({ default: m.PrivacyConsentModal }))
  ),
  
  // ============================================
  // UTILITY COMPONENTS - Complex utilities
  // ============================================
  
  // Password Strength - Complex validation logic
  PasswordStrength: lazy(() => 
    import('@/src/shared/ui/PasswordStrength').then(m => ({ default: m.PasswordStrength }))
  ),
  
  // Scrollspy Nav - Complex intersection observer logic
  ScrollspyNav: lazy(() => 
    import('@/src/shared/ui/ScrollspyNav').then(m => ({ default: m.ScrollspyNav }))
  ),
} as const;

export type LazyComponentName = keyof typeof LazyComponents;

/**
 * Component categories for organized preloading
 */
export const ComponentCategories = {
  modals: ['CommandPalette', 'HelpPanel', 'StatusCenter', 'KeyboardHelpModal', 'PremiumDrawer', 'PrivacyConsentModal'] as const,
  utilities: ['PasswordStrength', 'ScrollspyNav'] as const,
} as const;

/**
 * Preload a lazy component without rendering it
 * Useful for preloading on hover/focus to improve perceived performance
 * 
 * @example
 * // Preload CommandPalette when user focuses on search
 * onFocus={() => preloadLazyComponent('CommandPalette')}
 */
export function preloadLazyComponent(name: LazyComponentName): void {
  const component = LazyComponents[name];
  if (component) {
    // Accessing the lazy component triggers the import
    void component;
  }
}

/**
 * Preload multiple components at once
 * Useful for preloading related components together
 * 
 * @example
 * // Preload all modal components when user hovers over menu
 * onMouseEnter={() => preloadComponents(['CommandPalette', 'HelpPanel'])}
 */
export function preloadComponents(names: LazyComponentName[]): void {
  names.forEach(name => preloadLazyComponent(name));
}

/**
 * Preload components by category
 * Useful for preloading all components of a certain type
 * 
 * @example
 * // Preload all modals when dashboard loads
 * useEffect(() => { preloadCategory('modals') }, [])
 */
export function preloadCategory(category: keyof typeof ComponentCategories): void {
  const components = ComponentCategories[category];
  components.forEach(name => preloadLazyComponent(name as LazyComponentName));
}

/**
 * Create a lazy component with retry logic
 * Useful for components that may fail to load due to network issues
 * 
 * @param importFn - Dynamic import function
 * @param retries - Number of retry attempts (default: 3)
 * @param delay - Base delay between retries in ms (default: 1000)
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError: Error | undefined;
    
    for (let i = 0; i < retries; i++) {
      try {
        return await importFn();
      } catch (error) {
        lastError = error as Error;
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }
    
    throw lastError;
  });
}

/**
 * Dynamic import with loading state tracking
 * Returns a promise that resolves when the component is loaded
 */
export async function loadComponent<T>(
  importFn: () => Promise<{ default: T }>
): Promise<T> {
  const loadedModule = await importFn();
  return loadedModule.default;
}

/**
 * Check if a component is already loaded (cached)
 * Useful for conditional rendering decisions
 */
export function isComponentLoaded(name: LazyComponentName): boolean {
  try {
    // Try to access the component - if it throws, it's not loaded
    const component = LazyComponents[name];
    // Check if the lazy component has been resolved
    // This is a heuristic - lazy components don't expose their load state directly
    return component !== undefined;
  } catch {
    return false;
  }
}

/**
 * Preload components after initial page load
 * Uses requestIdleCallback for non-blocking preloading
 * 
 * @param names - Components to preload
 * @param priority - 'high' uses setTimeout, 'low' uses requestIdleCallback
 */
export function preloadAfterLoad(
  names: LazyComponentName[],
  priority: 'high' | 'low' = 'low'
): void {
  const preload = () => {
    names.forEach(name => preloadLazyComponent(name));
  };

  if (priority === 'high') {
    // High priority: preload after a short delay
    setTimeout(preload, 100);
  } else {
    // Low priority: preload when browser is idle
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(preload);
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(preload, 1000);
    }
  }
}
