/**
 * Density Hook - Tradelia 2026
 * 
 * Manages UI density preference (compact/comfortable).
 * Persists preference via session continuity.
 * Applies density to document root for CSS variable consumption.
 * 
 * REQ 20.3: Toggle between compact/comfortable
 * REQ 20.4: Accessible from settings and command palette
 * 
 * @example
 * ```tsx
 * const { density, toggleDensity, setDensity, isCompact } = useDensity()
 * 
 * // Toggle density
 * <button onClick={toggleDensity}>
 *   {isCompact ? 'Switch to Comfortable' : 'Switch to Compact'}
 * </button>
 * 
 * // Set specific density
 * <select onChange={(e) => setDensity(e.target.value as DensityMode)}>
 *   <option value="compact">Compact</option>
 *   <option value="comfortable">Comfortable</option>
 * </select>
 * ```
 */

'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { useSessionContinuity, type DensityMode } from './useSessionContinuity'

export type { DensityMode }

export interface UseDensityReturn {
  /** Current density mode */
  density: DensityMode
  /** Toggle between compact and comfortable */
  toggleDensity: () => void
  /** Set specific density mode */
  setDensity: (density: DensityMode) => void
  /** Whether current mode is compact */
  isCompact: boolean
  /** Whether current mode is comfortable */
  isComfortable: boolean
  /** Whether density has been restored from session */
  isRestored: boolean
}

/**
 * Hook for managing UI density preference.
 * 
 * Density affects:
 * - Card and section padding
 * - Font sizes for secondary/tertiary text
 * - Row heights and item gaps
 * - Icon sizes and icon box dimensions
 * 
 * All interactive elements maintain minimum 24px target size
 * regardless of density mode (WCAG 2.5.8 compliance).
 */
export function useDensity(): UseDensityReturn {
  const { state, setDensity: setSessionDensity, toggleDensity: toggleSessionDensity, isRestored } = useSessionContinuity()

  // Apply density to document root when it changes
  useEffect(() => {
    if (typeof document !== 'undefined' && isRestored) {
      document.documentElement.dataset.density = state.density
    }
  }, [state.density, isRestored])

  /**
   * Set specific density mode
   */
  const setDensity = useCallback((density: DensityMode) => {
    setSessionDensity(density)
  }, [setSessionDensity])

  /**
   * Toggle between compact and comfortable
   */
  const toggleDensity = useCallback(() => {
    toggleSessionDensity()
  }, [toggleSessionDensity])

  return useMemo(() => ({
    density: state.density,
    toggleDensity,
    setDensity,
    isCompact: state.density === 'compact',
    isComfortable: state.density === 'comfortable',
    isRestored
  }), [state.density, toggleDensity, setDensity, isRestored])
}

/**
 * Get density-aware class names
 * 
 * @example
 * ```tsx
 * const classes = getDensityClasses({
 *   card: true,
 *   text: 'secondary',
 *   gap: true
 * })
 * // Returns: "density-card density-text-secondary density-gap"
 * ```
 */
export function getDensityClasses(options: {
  card?: boolean
  section?: boolean
  row?: boolean
  gap?: boolean
  sectionGap?: boolean
  text?: 'secondary' | 'tertiary'
  iconBox?: boolean
  icon?: boolean
  listItem?: boolean
}): string {
  const classes: string[] = []

  if (options.card) classes.push('density-card')
  if (options.section) classes.push('density-section')
  if (options.row) classes.push('density-row')
  if (options.gap) classes.push('density-gap')
  if (options.sectionGap) classes.push('density-section-gap')
  if (options.text === 'secondary') classes.push('density-text-secondary')
  if (options.text === 'tertiary') classes.push('density-text-tertiary')
  if (options.iconBox) classes.push('density-icon-box')
  if (options.icon) classes.push('density-icon')
  if (options.listItem) classes.push('density-list-item')

  return classes.join(' ')
}

/**
 * Density labels for UI display
 */
export const DENSITY_LABELS = {
  compact: {
    en: 'Compact',
    it: 'Compatto'
  },
  comfortable: {
    en: 'Comfortable',
    it: 'Comodo'
  }
} as const

/**
 * Get localized density label
 */
export function getDensityLabel(density: DensityMode, locale: 'en' | 'it' = 'en'): string {
  return DENSITY_LABELS[density][locale]
}
