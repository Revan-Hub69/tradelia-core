/**
 * Crypto Sections Configuration - Tradelia 2026
 * 
 * 4 sezioni educative che analizzano modi diversi di rapportarsi alle criptovalute.
 * Nessuna dice cosa fare. Tutte aiutano ad evitare errori costosi.
 * 
 * Mapping con Journey operativi:
 * - Possedere → Emergency (riserve, custodia)
 * - Rendite → Passive (yield, staking)
 * - Investire → Longterm (DCA, holding)
 * - Speculare → Speculation (trading attivo)
 * 
 * Ordine: per complessità crescente
 */

import type { ComplexityLevel } from '@/src/shared/ui/ComplexityIndicator'

export type SectionId = 'own' | 'yield' | 'invest' | 'speculate'

export interface SectionFocus {
  id: string
  labelKey: string
}

export interface CryptoSection {
  id: SectionId
  order: number
  // Mapping al Journey operativo corrispondente
  journeyId: 'emergency' | 'passive' | 'longterm' | 'speculation'
  // UI
  titleKey: string
  subtitleKey: string
  descriptionKey: string
  whatItAnalyzesKey: string
  icon: 'wallet' | 'percent' | 'trending' | 'zap'
  color: 'success' | 'warning' | 'orange' | 'error' // Gradiente difficoltà: verde → giallo → arancione → rosso
  complexity: ComplexityLevel
  complexityLabel: string // "Bassa – Media", "Media – Alta", etc.
  // Focus areas (3 per sezione)
  focusAreas: SectionFocus[]
  // Moduli educativi (da definire per ogni sezione)
  moduleCount: number
  estimatedMinutes: number
}

export const CRYPTO_SECTIONS: Record<SectionId, CryptoSection> = {
  own: {
    id: 'own',
    order: 1,
    journeyId: 'emergency',
    titleKey: 'sections.own.title',
    subtitleKey: 'sections.own.subtitle',
    descriptionKey: 'sections.own.description',
    whatItAnalyzesKey: 'sections.own.whatItAnalyzes',
    icon: 'wallet',
    color: 'success', // Verde = più accessibile
    complexity: 'medium',
    complexityLabel: 'Bassa – Media',
    focusAreas: [
      { id: 'custody', labelKey: 'sections.own.focus.custody' },
      { id: 'errors', labelKey: 'sections.own.focus.errors' },
      { id: 'limits', labelKey: 'sections.own.focus.limits' }
    ],
    moduleCount: 0, // Da definire
    estimatedMinutes: 0
  },
  yield: {
    id: 'yield',
    order: 2,
    journeyId: 'passive',
    titleKey: 'sections.yield.title',
    subtitleKey: 'sections.yield.subtitle',
    descriptionKey: 'sections.yield.description',
    whatItAnalyzesKey: 'sections.yield.whatItAnalyzes',
    icon: 'percent',
    color: 'warning', // Giallo/Arancione = attenzione crescente
    complexity: 'mediumHigh',
    complexityLabel: 'Media – Alta',
    focusAreas: [
      { id: 'origin', labelKey: 'sections.yield.focus.origin' },
      { id: 'counterparty', labelKey: 'sections.yield.focus.counterparty' },
      { id: 'failure', labelKey: 'sections.yield.focus.failure' }
    ],
    moduleCount: 0,
    estimatedMinutes: 0
  },
  invest: {
    id: 'invest',
    order: 3,
    journeyId: 'longterm',
    titleKey: 'sections.invest.title',
    subtitleKey: 'sections.invest.subtitle',
    descriptionKey: 'sections.invest.description',
    whatItAnalyzesKey: 'sections.invest.whatItAnalyzes',
    icon: 'trending',
    color: 'orange', // Arancione = complessità alta
    complexity: 'high',
    complexityLabel: 'Alta',
    focusAreas: [
      { id: 'horizon', labelKey: 'sections.invest.focus.horizon' },
      { id: 'volatility', labelKey: 'sections.invest.focus.volatility' },
      { id: 'behavioral', labelKey: 'sections.invest.focus.behavioral' }
    ],
    moduleCount: 0,
    estimatedMinutes: 0
  },
  speculate: {
    id: 'speculate',
    order: 4,
    journeyId: 'speculation',
    titleKey: 'sections.speculate.title',
    subtitleKey: 'sections.speculate.subtitle',
    descriptionKey: 'sections.speculate.description',
    whatItAnalyzesKey: 'sections.speculate.whatItAnalyzes',
    icon: 'zap',
    color: 'error', // Rosso = massima complessità/rischio
    complexity: 'veryHigh',
    complexityLabel: 'Molto Alta',
    focusAreas: [
      { id: 'asymmetry', labelKey: 'sections.speculate.focus.asymmetry' },
      { id: 'skills', labelKey: 'sections.speculate.focus.skills' },
      { id: 'mistakes', labelKey: 'sections.speculate.focus.mistakes' }
    ],
    moduleCount: 0,
    estimatedMinutes: 0
  }
}

// Ordine per complessità crescente
export const SECTION_ORDER: SectionId[] = ['own', 'yield', 'invest', 'speculate']

// Helper functions
export function getSectionById(id: SectionId): CryptoSection {
  return CRYPTO_SECTIONS[id]
}

export function getSectionByJourney(journeyId: string): CryptoSection | undefined {
  return Object.values(CRYPTO_SECTIONS).find(s => s.journeyId === journeyId)
}

export function getAllSections(): CryptoSection[] {
  return SECTION_ORDER.map(id => CRYPTO_SECTIONS[id])
}
