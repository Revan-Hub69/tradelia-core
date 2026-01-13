/**
 * Academic Foundations Module Configuration - Tradelia 2026
 * 
 * 17 moduli educativi per il pilastro "Basi Accademiche" del percorso Emergency.
 * Struttura: crypto come RISERVA DI EMERGENZA, NON come investimento.
 * 
 * Navigazione: Opzione C (Hybrid)
 * - Sezioni si sbloccano sequenzialmente
 * - Moduli dentro ogni sezione navigabili liberamente
 * - Conferma richiesta per ogni modulo
 * 
 * Ordine: Definizione → Prerequisiti → Rischi → Crypto → Applicazione
 * (Risk-first = rischi prima di BENEFICI, non prima di tutto)
 */

export type SectionId = 'definition' | 'prerequisites' | 'risks' | 'crypto' | 'application'
export type ModuleId = string

export interface AcademicModule {
  id: ModuleId
  sectionId: SectionId
  order: number
  titleKey: string        // chiave i18n per titolo
  descriptionKey: string  // chiave i18n per descrizione breve
  topics: string[]        // chiavi i18n per sotto-argomenti
  estimatedMinutes: number
  isCritical?: boolean    // moduli che richiedono attenzione extra (es. MiFID)
}

export interface AcademicSection {
  id: SectionId
  order: number
  titleKey: string
  descriptionKey: string
  icon: 'book' | 'user' | 'alert' | 'cpu' | 'target'
  accentColor: 'primary' | 'info' | 'warning' | 'error' | 'success'
  modules: ModuleId[]
  unlockCondition: 'always' | 'previous-section-complete'
}

// ============================================================================
// SEZIONE A: DEFINIZIONE (Moduli 1-4)
// ============================================================================

const DEFINITION_MODULES: AcademicModule[] = [
  {
    id: 'what-are-reserves',
    sectionId: 'definition',
    order: 1,
    titleKey: 'academic.modules.whatAreReserves.title',
    descriptionKey: 'academic.modules.whatAreReserves.description',
    topics: [
      'academic.modules.whatAreReserves.topics.functionalDefinition',
      'academic.modules.whatAreReserves.topics.emergencyVsInvestment',
      'academic.modules.whatAreReserves.topics.accessVsValue',
      'academic.modules.whatAreReserves.topics.whatTheyAreNot'
    ],
    estimatedMinutes: 5
  },
  {
    id: 'reserve-categories',
    sectionId: 'definition',
    order: 2,
    titleKey: 'academic.modules.reserveCategories.title',
    descriptionKey: 'academic.modules.reserveCategories.description',
    topics: [
      'academic.modules.reserveCategories.topics.immediateCash',
      'academic.modules.reserveCategories.topics.bankLiquidity',
      'academic.modules.reserveCategories.topics.physicalReserves',
      'academic.modules.reserveCategories.topics.digitalNonBank',
      'academic.modules.reserveCategories.topics.jurisdictionalDiversification',
      'academic.modules.reserveCategories.topics.failurePrinciple'
    ],
    estimatedMinutes: 8
  },
  {
    id: 'what-they-solve',
    sectionId: 'definition',
    order: 3,
    titleKey: 'academic.modules.whatTheySolve.title',
    descriptionKey: 'academic.modules.whatTheySolve.description',
    topics: [
      'academic.modules.whatTheySolve.topics.liquidityShocks',
      'academic.modules.whatTheySolve.topics.operationalBlocks',
      'academic.modules.whatTheySolve.topics.withdrawalLimits',
      'academic.modules.whatTheySolve.topics.paymentInterruptions',
      'academic.modules.whatTheySolve.topics.buyingTimeOptions'
    ],
    estimatedMinutes: 6
  },
  {
    id: 'what-they-dont-solve',
    sectionId: 'definition',
    order: 4,
    titleKey: 'academic.modules.whatTheyDontSolve.title',
    descriptionKey: 'academic.modules.whatTheyDontSolve.description',
    topics: [
      'academic.modules.whatTheyDontSolve.topics.yield',
      'academic.modules.whatTheyDontSolve.topics.marketRiskProtection',
      'academic.modules.whatTheyDontSolve.topics.inflationHedge',
      'academic.modules.whatTheyDontSolve.topics.investmentReplacement'
    ],
    estimatedMinutes: 5
  }
]

// ============================================================================
// SEZIONE B: PREREQUISITI PERSONALI (Moduli 5-7)
// ============================================================================

const PREREQUISITES_MODULES: AcademicModule[] = [
  {
    id: 'non-negotiable-prerequisites',
    sectionId: 'prerequisites',
    order: 5,
    titleKey: 'academic.modules.prerequisites.title',
    descriptionKey: 'academic.modules.prerequisites.description',
    topics: [
      'academic.modules.prerequisites.topics.essentialExpenses',
      'academic.modules.prerequisites.topics.classicEmergencyFund',
      'academic.modules.prerequisites.topics.cashFlowStability',
      'academic.modules.prerequisites.topics.emotionalStability'
    ],
    estimatedMinutes: 7,
    isCritical: true
  },
  {
    id: 'personal-economic-perimeter',
    sectionId: 'prerequisites',
    order: 6,
    titleKey: 'academic.modules.economicPerimeter.title',
    descriptionKey: 'academic.modules.economicPerimeter.description',
    topics: [
      'academic.modules.economicPerimeter.topics.wealthMap',
      'academic.modules.economicPerimeter.topics.sacrificableQuota',
      'academic.modules.economicPerimeter.topics.nonUseHorizon',
      'academic.modules.economicPerimeter.topics.essentialNeedsImpact'
    ],
    estimatedMinutes: 8
  },
  {
    id: 'stress-tolerance',
    sectionId: 'prerequisites',
    order: 7,
    titleKey: 'academic.modules.stressTolerance.title',
    descriptionKey: 'academic.modules.stressTolerance.description',
    topics: [
      'academic.modules.stressTolerance.topics.drawdownReaction',
      'academic.modules.stressTolerance.topics.accessBlockReaction',
      'academic.modules.stressTolerance.topics.panicVsControl',
      'academic.modules.stressTolerance.topics.errorsUnderPressure'
    ],
    estimatedMinutes: 6
  }
]

// ============================================================================
// SEZIONE C: FRAMEWORK RISCHI (Moduli 8-12)
// ============================================================================

const RISKS_MODULES: AcademicModule[] = [
  {
    id: 'risk-types',
    sectionId: 'risks',
    order: 8,
    titleKey: 'academic.modules.riskTypes.title',
    descriptionKey: 'academic.modules.riskTypes.description',
    topics: [
      'academic.modules.riskTypes.topics.valueLoss',
      'academic.modules.riskTypes.topics.inaccessibility',
      'academic.modules.riskTypes.topics.regulatory',
      'academic.modules.riskTypes.topics.operational',
      'academic.modules.riskTypes.topics.human'
    ],
    estimatedMinutes: 10,
    isCritical: true
  },
  {
    id: 'risk-budget',
    sectionId: 'risks',
    order: 9,
    titleKey: 'academic.modules.riskBudget.title',
    descriptionKey: 'academic.modules.riskBudget.description',
    topics: [
      'academic.modules.riskBudget.topics.personalBudgeting',
      'academic.modules.riskBudget.topics.accessStabilityTradeoff',
      'academic.modules.riskBudget.topics.concentrationVsRedundancy',
      'academic.modules.riskBudget.topics.acceptableErrorThreshold'
    ],
    estimatedMinutes: 8
  },
  {
    id: 'quantitative-ranges',
    sectionId: 'risks',
    order: 10,
    titleKey: 'academic.modules.quantitativeRanges.title',
    descriptionKey: 'academic.modules.quantitativeRanges.description',
    topics: [
      'academic.modules.quantitativeRanges.topics.zeroPercent',
      'academic.modules.quantitativeRanges.topics.oneToThree',
      'academic.modules.quantitativeRanges.topics.threeToFive',
      'academic.modules.quantitativeRanges.topics.fivePercentStop',
      'academic.modules.quantitativeRanges.topics.whyLowPercentages'
    ],
    estimatedMinutes: 6
  },
  {
    id: 'failure-modes',
    sectionId: 'risks',
    order: 11,
    titleKey: 'academic.modules.failureModes.title',
    descriptionKey: 'academic.modules.failureModes.description',
    topics: [
      'academic.modules.failureModes.topics.howEachFails',
      'academic.modules.failureModes.topics.whenItFails',
      'academic.modules.failureModes.topics.accessImpact',
      'academic.modules.failureModes.topics.valueImpact'
    ],
    estimatedMinutes: 10
  },
  {
    id: 'tools-risk-matrix',
    sectionId: 'risks',
    order: 12,
    titleKey: 'academic.modules.toolsRiskMatrix.title',
    descriptionKey: 'academic.modules.toolsRiskMatrix.description',
    topics: [
      'academic.modules.toolsRiskMatrix.topics.access',
      'academic.modules.toolsRiskMatrix.topics.censorability',
      'academic.modules.toolsRiskMatrix.topics.thirdPartyDependency',
      'academic.modules.toolsRiskMatrix.topics.humanError',
      'academic.modules.toolsRiskMatrix.topics.errorRecoverability'
    ],
    estimatedMinutes: 12
  }
]

// ============================================================================
// SEZIONE D: CRYPTO SPECIFICO (Moduli 13-14)
// ============================================================================

const CRYPTO_MODULES: AcademicModule[] = [
  {
    id: 'crypto-technical-perimeter',
    sectionId: 'crypto',
    order: 13,
    titleKey: 'academic.modules.cryptoPerimeter.title',
    descriptionKey: 'academic.modules.cryptoPerimeter.description',
    topics: [
      'academic.modules.cryptoPerimeter.topics.whatTheySolve',
      'academic.modules.cryptoPerimeter.topics.whatTheyWorsen',
      'academic.modules.cryptoPerimeter.topics.volatility',
      'academic.modules.cryptoPerimeter.topics.operationalComplexity',
      'academic.modules.cryptoPerimeter.topics.structuralLimits'
    ],
    estimatedMinutes: 10,
    isCritical: true
  },
  {
    id: 'custody-cognitive-cost',
    sectionId: 'crypto',
    order: 14,
    titleKey: 'academic.modules.custodyCost.title',
    descriptionKey: 'academic.modules.custodyCost.description',
    topics: [
      'academic.modules.custodyCost.topics.directResponsibility',
      'academic.modules.custodyCost.topics.irreversibleErrors',
      'academic.modules.custodyCost.topics.mentalMaintenance',
      'academic.modules.custodyCost.topics.recoverableComparison'
    ],
    estimatedMinutes: 8
  }
]

// ============================================================================
// SEZIONE E: APPLICAZIONE (Moduli 15-17)
// ============================================================================

const APPLICATION_MODULES: AcademicModule[] = [
  {
    id: 'real-scenarios',
    sectionId: 'application',
    order: 15,
    titleKey: 'academic.modules.realScenarios.title',
    descriptionKey: 'academic.modules.realScenarios.description',
    topics: [
      'academic.modules.realScenarios.topics.blockedBank',
      'academic.modules.realScenarios.topics.atmFailures',
      'academic.modules.realScenarios.topics.rejectedCards',
      'academic.modules.realScenarios.topics.intermittentInternet',
      'academic.modules.realScenarios.topics.crossBorderBlocks'
    ],
    estimatedMinutes: 8
  },
  {
    id: 'decision-gate',
    sectionId: 'application',
    order: 16,
    titleKey: 'academic.modules.decisionGate.title',
    descriptionKey: 'academic.modules.decisionGate.description',
    topics: [
      'academic.modules.decisionGate.topics.notSuitable',
      'academic.modules.decisionGate.topics.minimalBackupOnly',
      'academic.modules.decisionGate.topics.suitableWithLimits',
      'academic.modules.decisionGate.topics.coherenceCheck'
    ],
    estimatedMinutes: 6,
    isCritical: true
  },
  {
    id: 'mifid-operational-block',
    sectionId: 'application',
    order: 17,
    titleKey: 'academic.modules.mifidBlock.title',
    descriptionKey: 'academic.modules.mifidBlock.description',
    topics: [
      'academic.modules.mifidBlock.topics.noPurchaseIndication',
      'academic.modules.mifidBlock.topics.noPlatform',
      'academic.modules.mifidBlock.topics.noStrategy',
      'academic.modules.mifidBlock.topics.educationOperationSeparation'
    ],
    estimatedMinutes: 5,
    isCritical: true
  }
]

// ============================================================================
// CONFIGURAZIONE SEZIONI
// ============================================================================

export const ACADEMIC_SECTIONS: AcademicSection[] = [
  {
    id: 'definition',
    order: 1,
    titleKey: 'academic.sections.definition.title',
    descriptionKey: 'academic.sections.definition.description',
    icon: 'book',
    accentColor: 'primary',
    modules: ['what-are-reserves', 'reserve-categories', 'what-they-solve', 'what-they-dont-solve'],
    unlockCondition: 'always'
  },
  {
    id: 'prerequisites',
    order: 2,
    titleKey: 'academic.sections.prerequisites.title',
    descriptionKey: 'academic.sections.prerequisites.description',
    icon: 'user',
    accentColor: 'info',
    modules: ['non-negotiable-prerequisites', 'personal-economic-perimeter', 'stress-tolerance'],
    unlockCondition: 'previous-section-complete'
  },
  {
    id: 'risks',
    order: 3,
    titleKey: 'academic.sections.risks.title',
    descriptionKey: 'academic.sections.risks.description',
    icon: 'alert',
    accentColor: 'warning',
    modules: ['risk-types', 'risk-budget', 'quantitative-ranges', 'failure-modes', 'tools-risk-matrix'],
    unlockCondition: 'previous-section-complete'
  },
  {
    id: 'crypto',
    order: 4,
    titleKey: 'academic.sections.crypto.title',
    descriptionKey: 'academic.sections.crypto.description',
    icon: 'cpu',
    accentColor: 'error',
    modules: ['crypto-technical-perimeter', 'custody-cognitive-cost'],
    unlockCondition: 'previous-section-complete'
  },
  {
    id: 'application',
    order: 5,
    titleKey: 'academic.sections.application.title',
    descriptionKey: 'academic.sections.application.description',
    icon: 'target',
    accentColor: 'success',
    modules: ['real-scenarios', 'decision-gate', 'mifid-operational-block'],
    unlockCondition: 'previous-section-complete'
  }
]

// ============================================================================
// TUTTI I MODULI (flat array per lookup)
// ============================================================================

export const ACADEMIC_MODULES: AcademicModule[] = [
  ...DEFINITION_MODULES,
  ...PREREQUISITES_MODULES,
  ...RISKS_MODULES,
  ...CRYPTO_MODULES,
  ...APPLICATION_MODULES
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getModuleById(moduleId: ModuleId): AcademicModule | undefined {
  return ACADEMIC_MODULES.find(m => m.id === moduleId)
}

export function getSectionById(sectionId: SectionId): AcademicSection | undefined {
  return ACADEMIC_SECTIONS.find(s => s.id === sectionId)
}

export function getModulesForSection(sectionId: SectionId): AcademicModule[] {
  return ACADEMIC_MODULES.filter(m => m.sectionId === sectionId)
}

export function getSectionForModule(moduleId: ModuleId): AcademicSection | undefined {
  const module = getModuleById(moduleId)
  if (!module) return undefined
  return getSectionById(module.sectionId)
}

export function getNextModule(currentModuleId: ModuleId): AcademicModule | undefined {
  const currentModule = getModuleById(currentModuleId)
  if (!currentModule) return undefined
  return ACADEMIC_MODULES.find(m => m.order === currentModule.order + 1)
}

export function getPreviousModule(currentModuleId: ModuleId): AcademicModule | undefined {
  const currentModule = getModuleById(currentModuleId)
  if (!currentModule) return undefined
  return ACADEMIC_MODULES.find(m => m.order === currentModule.order - 1)
}

export function isSectionUnlocked(
  sectionId: SectionId, 
  completedModules: ModuleId[]
): boolean {
  const section = getSectionById(sectionId)
  if (!section) return false
  
  if (section.unlockCondition === 'always') return true
  
  // Find previous section
  const previousSection = ACADEMIC_SECTIONS.find(s => s.order === section.order - 1)
  if (!previousSection) return true
  
  // Check if all modules in previous section are completed
  return previousSection.modules.every(moduleId => completedModules.includes(moduleId))
}

export function getSectionProgress(
  sectionId: SectionId,
  completedModules: ModuleId[]
): { completed: number; total: number; percentage: number } {
  const section = getSectionById(sectionId)
  if (!section) return { completed: 0, total: 0, percentage: 0 }
  
  const completed = section.modules.filter(m => completedModules.includes(m)).length
  const total = section.modules.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return { completed, total, percentage }
}

export function getTotalProgress(
  completedModules: ModuleId[]
): { completed: number; total: number; percentage: number } {
  const completed = completedModules.length
  const total = ACADEMIC_MODULES.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return { completed, total, percentage }
}

export function getTotalEstimatedTime(): number {
  return ACADEMIC_MODULES.reduce((acc, m) => acc + m.estimatedMinutes, 0)
}

export function getRemainingTime(completedModules: ModuleId[]): number {
  return ACADEMIC_MODULES
    .filter(m => !completedModules.includes(m.id))
    .reduce((acc, m) => acc + m.estimatedMinutes, 0)
}
