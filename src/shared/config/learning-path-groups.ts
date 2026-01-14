/**
 * Learning Path Groups Configuration
 * 
 * Struttura a 4 livelli:
 * 1. Setup (country + technical level)
 * 2. Groups (Phase 0, Phase 1, Technical Deep Dives)
 * 3. Modules List
 * 4. Module Content
 */

export type TechnicalLevel = 'noob' | 'informato' | 'smart'
export type Country = 'IT' | 'US' | 'UK' | 'DE' | 'FR' | 'ES' | 'CH'

export interface LearningPathSetup {
  country: Country
  technicalLevel: TechnicalLevel
}

export interface LearningPathGroup {
  id: 'phase-0' | 'phase-1' | 'technical-deep-dives'
  titleKey: string
  descriptionKey: string
  isLocked: boolean
  unlockCondition?: string
  moduleCount: number
  estimatedHours: number
  color: 'primary' | 'success' | 'warning'
}

// Configurazione gruppi per ogni journey
export function getLearningPathGroups(
  journeyId: 'own' | 'yield' | 'invest' | 'speculate',
  phase0Completed: boolean,
  phase1Completed: boolean
): LearningPathGroup[] {
  return [
    {
      id: 'phase-0',
      titleKey: 'learningPath.groups.phase0.title',
      descriptionKey: 'learningPath.groups.phase0.description',
      isLocked: false, // Always free
      moduleCount: 8, // 5 alfabetizzazione + 3 meccanica
      estimatedHours: 1,
      color: 'primary'
    },
    {
      id: 'phase-1',
      titleKey: `learningPath.groups.phase1.${journeyId}.title`,
      descriptionKey: `learningPath.groups.phase1.${journeyId}.description`,
      isLocked: !phase0Completed,
      unlockCondition: 'learningPath.groups.phase1.unlockCondition',
      moduleCount: 7,
      estimatedHours: 1,
      color: 'success'
    },
    {
      id: 'technical-deep-dives',
      titleKey: 'learningPath.groups.technical.title',
      descriptionKey: 'learningPath.groups.technical.description',
      isLocked: !phase1Completed,
      unlockCondition: 'learningPath.groups.technical.unlockCondition',
      moduleCount: 10,
      estimatedHours: 3,
      color: 'warning'
    }
  ]
}

// Country labels
export const COUNTRY_LABELS: Record<Country, string> = {
  IT: 'Italia',
  US: 'Stati Uniti',
  UK: 'Regno Unito',
  DE: 'Germania',
  FR: 'Francia',
  ES: 'Spagna',
  CH: 'Svizzera'
}

// Technical level labels
export const TECHNICAL_LEVEL_LABELS: Record<TechnicalLevel, string> = {
  noob: 'Principiante assoluto',
  informato: 'Un po\' informato',
  smart: 'Pratico e informato'
}

// Technical level descriptions
export const TECHNICAL_LEVEL_DESCRIPTIONS: Record<TechnicalLevel, string> = {
  noob: 'Non ho mai usato crypto, parto da zero',
  informato: 'Ho letto qualcosa, ma non ho mai provato',
  smart: 'Ho già provato, voglio capire meglio'
}
