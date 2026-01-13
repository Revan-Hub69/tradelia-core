/**
 * Help Content Library - Tradelia 2026
 * 
 * Provides help content for key modules in the dashboard.
 * Content is localized via next-intl translations.
 * 
 * @see Requirements 23.4
 */

import type { HelpContent } from '@/src/shared/ui/HelpPanel'

/** Available help module IDs */
export type HelpModuleId = 
  | 'emergency'
  | 'longterm'
  | 'passive'
  | 'speculation'
  | 'riskLevel'
  | 'diversification'

/**
 * Get help content for a module using translations
 * 
 * @param moduleId - The module identifier
 * @param t - Translation function from useTranslations('help.modules')
 * @returns HelpContent object or null if module not found
 * 
 * @example
 * const t = useTranslations('help.modules')
 * const content = getHelpContent('emergency', t)
 * if (content) {
 *   console.log(content.title, content.definition)
 * }
 */
export function getHelpContent(
  moduleId: HelpModuleId,
  t: (key: string) => string
): HelpContent | null {
  const validModules: HelpModuleId[] = [
    'emergency',
    'longterm', 
    'passive',
    'speculation',
    'riskLevel',
    'diversification'
  ]

  if (!validModules.includes(moduleId)) {
    return null
  }

  return {
    title: t(`${moduleId}.title`),
    definition: t(`${moduleId}.definition`),
    commonErrors: [
      t(`${moduleId}.commonErrors.0`),
      t(`${moduleId}.commonErrors.1`),
      t(`${moduleId}.commonErrors.2`),
      t(`${moduleId}.commonErrors.3`),
    ].filter(Boolean),
    whatToLook: [
      t(`${moduleId}.whatToLook.0`),
      t(`${moduleId}.whatToLook.1`),
      t(`${moduleId}.whatToLook.2`),
      t(`${moduleId}.whatToLook.3`),
    ].filter(Boolean),
  }
}

/**
 * Map journey IDs to help module IDs
 */
export const journeyToHelpModule: Record<string, HelpModuleId> = {
  'emergency': 'emergency',
  'longterm': 'longterm',
  'passive': 'passive',
  'speculation': 'speculation',
}

/**
 * Check if a module has help content available
 * 
 * @param moduleId - The module identifier to check
 * @returns True if the module has help content, false otherwise
 * 
 * @example
 * if (hasHelpContent('emergency')) {
 *   const content = getHelpContent('emergency', t)
 * }
 */
export function hasHelpContent(moduleId: string): moduleId is HelpModuleId {
  const validModules: string[] = [
    'emergency',
    'longterm',
    'passive',
    'speculation',
    'riskLevel',
    'diversification'
  ]
  return validModules.includes(moduleId)
}
