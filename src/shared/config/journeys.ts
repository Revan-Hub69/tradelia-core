/**
 * Journey Configuration - Tradelia 2026
 * 
 * I 4 percorsi anti-errore ordinati per complessità cognitiva:
 * - Emergenza: liquidità immediata, protezione (MEDIA)
 * - Passivo: rendite automatiche, staking (MEDIO-ALTA)
 * - Lungo termine: crescita stabile, DCA (ALTA)
 * - Speculazione: trading attivo, opportunità (ALTISSIMA)
 */

import type { ComplexityLevel } from '@/src/shared/ui/ComplexityIndicator'

export type JourneyId = 'emergency' | 'longterm' | 'speculation' | 'passive'

export interface JourneySection {
  id: string
  labelKey: string // chiave i18n
  href: string
}

export interface JourneyConfig {
  id: JourneyId
  labelKey: string
  icon: string // nome icona
  color: string // colore semantico
  complexity: ComplexityLevel // livello di complessità cognitiva
  primaryActionKey: string
  sections: JourneySection[]
}

export const JOURNEYS: Record<JourneyId, JourneyConfig> = {
  emergency: {
    id: 'emergency',
    labelKey: 'journeys.emergency.name',
    icon: 'shield',
    color: 'warning',
    complexity: 'medium', // 🟢 🟠 ⚪ ⚪ ⚪ (2/5)
    primaryActionKey: 'journeys.emergency.action',
    sections: [
      { id: 'overview', labelKey: 'journeys.emergency.sections.overview', href: '' },
      { id: 'liquid-assets', labelKey: 'journeys.emergency.sections.liquidAssets', href: '/liquid' },
      { id: 'exit-plan', labelKey: 'journeys.emergency.sections.exitPlan', href: '/exit' },
      { id: 'history', labelKey: 'journeys.emergency.sections.history', href: '/history' },
    ]
  },
  passive: {
    id: 'passive',
    labelKey: 'journeys.passive.name',
    icon: 'refresh',
    color: 'info',
    complexity: 'medium-high', // 🟢 🟠 🟠 ⚪ ⚪ (3/5)
    primaryActionKey: 'journeys.passive.action',
    sections: [
      { id: 'overview', labelKey: 'journeys.passive.sections.overview', href: '' },
      { id: 'staking', labelKey: 'journeys.passive.sections.staking', href: '/staking' },
      { id: 'yields', labelKey: 'journeys.passive.sections.yields', href: '/yields' },
      { id: 'projections', labelKey: 'journeys.passive.sections.projections', href: '/projections' },
    ]
  },
  longterm: {
    id: 'longterm',
    labelKey: 'journeys.longterm.name',
    icon: 'growth',
    color: 'success',
    complexity: 'high', // 🟢 🟠 🟠 🔴 ⚪ (4/5)
    primaryActionKey: 'journeys.longterm.action',
    sections: [
      { id: 'overview', labelKey: 'journeys.longterm.sections.overview', href: '' },
      { id: 'dca-plans', labelKey: 'journeys.longterm.sections.dcaPlans', href: '/dca' },
      { id: 'projections', labelKey: 'journeys.longterm.sections.projections', href: '/projections' },
      { id: 'rebalance', labelKey: 'journeys.longterm.sections.rebalance', href: '/rebalance' },
    ]
  },
  speculation: {
    id: 'speculation',
    labelKey: 'journeys.speculation.name',
    icon: 'bolt',
    color: 'primary',
    complexity: 'very-high', // 🟢 🟠 🟠 🔴 🔴 (5/5)
    primaryActionKey: 'journeys.speculation.action',
    sections: [
      { id: 'overview', labelKey: 'journeys.speculation.sections.overview', href: '' },
      { id: 'signals', labelKey: 'journeys.speculation.sections.signals', href: '/signals' },
      { id: 'positions', labelKey: 'journeys.speculation.sections.positions', href: '/positions' },
      { id: 'analysis', labelKey: 'journeys.speculation.sections.analysis', href: '/analysis' },
    ]
  }
}

// ORDINE CORRETTO: dal meno complesso al più complesso
export const JOURNEY_ORDER: JourneyId[] = ['emergency', 'passive', 'longterm', 'speculation']

export function getJourneyFromPath(pathname: string): JourneyId {
  if (pathname.includes('/emergency')) return 'emergency'
  if (pathname.includes('/passive')) return 'passive'
  if (pathname.includes('/longterm')) return 'longterm'
  if (pathname.includes('/speculation')) return 'speculation'
  return 'emergency' // default
}
