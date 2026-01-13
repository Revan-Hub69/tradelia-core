/**
 * Academic Foundations Drawer - Tradelia 2026
 * 
 * Navigazione modulare per i 17 moduli educativi "Basi Accademiche".
 * 
 * Navigazione Opzione C (Hybrid):
 * - Sezioni si sbloccano sequenzialmente
 * - Moduli dentro ogni sezione navigabili liberamente
 * - Conferma richiesta per ogni modulo
 * 
 * Stati:
 * - 'sections': Vista lista sezioni
 * - 'modules': Vista lista moduli di una sezione
 * - 'content': Vista contenuto singolo modulo
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { PremiumDrawer } from '@/src/shared/ui/PremiumDrawer'
import {
  ACADEMIC_SECTIONS,
  getModulesForSection,
  getModuleById,
  getSectionById,
  isSectionUnlocked,
  getSectionProgress,
  getTotalProgress,
  getNextModule,
  type SectionId,
  type ModuleId,
  type AcademicSection,
  type AcademicModule
} from '@/src/shared/config/academic-foundations'

type DrawerView = 'sections' | 'modules' | 'content'

interface AcademicFoundationsDrawerProps {
  isOpen: boolean
  onClose: () => void
  completedModules: ModuleId[]
  onModuleComplete: (moduleId: ModuleId) => void
  onModuleUncomplete: (moduleId: ModuleId) => void
}

export function AcademicFoundationsDrawer({
  isOpen,
  onClose,
  completedModules,
  onModuleComplete,
  onModuleUncomplete
}: AcademicFoundationsDrawerProps) {
  const t = useTranslations('academic')
  
  const [view, setView] = useState<DrawerView>('sections')
  const [activeSection, setActiveSection] = useState<SectionId | null>(null)
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null)

  // Computed data
  const activeSectionData = activeSection ? getSectionById(activeSection) : null
  const activeModuleData = activeModule ? getModuleById(activeModule) : null
  const sectionModules = useMemo(() => 
    activeSection ? getModulesForSection(activeSection) : [],
    [activeSection]
  )
  const totalProgress = getTotalProgress(completedModules)

  // Navigation handlers
  const handleClose = useCallback(() => {
    setView('sections')
    setActiveSection(null)
    setActiveModule(null)
    onClose()
  }, [onClose])

  const handleBack = useCallback(() => {
    if (view === 'content') {
      setActiveModule(null)
      setView('modules')
    } else if (view === 'modules') {
      setActiveSection(null)
      setView('sections')
    } else {
      handleClose()
    }
  }, [view, handleClose])

  const handleSelectSection = useCallback((sectionId: SectionId) => {
    if (!isSectionUnlocked(sectionId, completedModules)) return
    setActiveSection(sectionId)
    setView('modules')
  }, [completedModules])

  const handleSelectModule = useCallback((moduleId: ModuleId) => {
    setActiveModule(moduleId)
    setView('content')
  }, [])

  const handleToggleComplete = useCallback(() => {
    if (!activeModule) return
    
    if (completedModules.includes(activeModule)) {
      onModuleUncomplete(activeModule)
    } else {
      onModuleComplete(activeModule)
    }
  }, [activeModule, completedModules, onModuleComplete, onModuleUncomplete])

  const handleContinue = useCallback(() => {
    if (!activeModule) return
    
    // Mark as complete if not already
    if (!completedModules.includes(activeModule)) {
      onModuleComplete(activeModule)
    }
    
    // Go to next module or back to list
    const nextModule = getNextModule(activeModule)
    if (nextModule && nextModule.sectionId === activeSection) {
      // Same section, go to next module
      setActiveModule(nextModule.id)
    } else if (nextModule) {
      // Different section, go back to sections view
      setActiveModule(null)
      setActiveSection(null)
      setView('sections')
    } else {
      // No more modules, go back to sections
      setActiveModule(null)
      setActiveSection(null)
      setView('sections')
    }
  }, [activeModule, activeSection, completedModules, onModuleComplete])

  // Dynamic title based on view
  const drawerTitle = useMemo(() => {
    if (view === 'content' && activeModuleData) {
      return t(`modules.${getModuleTranslationKey(activeModuleData.id)}.title`)
    }
    if (view === 'modules' && activeSectionData) {
      return t(`sections.${activeSectionData.id}.title`)
    }
    return t('pillarTitle')
  }, [view, activeModuleData, activeSectionData, t])

  const drawerSubtitle = useMemo(() => {
    if (view === 'content' && activeModuleData && activeSectionData) {
      const moduleIndex = sectionModules.findIndex(m => m.id === activeModule) + 1
      return `${t(`sections.${activeSectionData.id}.title`)} • Modulo ${moduleIndex} di ${sectionModules.length}`
    }
    if (view === 'modules' && activeSectionData) {
      const progress = getSectionProgress(activeSectionData.id, completedModules)
      return `${progress.completed}/${progress.total} completati`
    }
    return `${totalProgress.completed}/${totalProgress.total} moduli completati`
  }, [view, activeModuleData, activeSectionData, activeModule, sectionModules, completedModules, totalProgress, t])

  return (
    <PremiumDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={drawerTitle}
      subtitle={drawerSubtitle}
      icon={<AcademicIcon className="w-6 h-6" />}
      accentColor="primary"
      size="xl"
      closeOnBackdrop={true}
      closeOnEscape={true}
    >
      <div className="space-y-6">
        {/* Navigation header */}
        <div className="flex items-center gap-3 pb-4 border-b border-enterprise-soft">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-enterprise-secondary hover:text-enterprise-primary transition-colors focus-enterprise-ring rounded-lg px-2 py-1 -ml-2"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            {view === 'sections' ? t('ui.close') : t('ui.back')}
          </button>
        </div>

        {/* Progress bar (always visible) */}
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
          <span className="text-sm font-medium">{t('ui.progress')}:</span>
          <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-success rounded-full transition-all duration-300"
              style={{ width: `${totalProgress.percentage}%` }}
            />
          </div>
          <span className="text-sm font-semibold">{totalProgress.percentage}%</span>
        </div>

        {/* SECTIONS VIEW */}
        {view === 'sections' && (
          <SectionsView
            sections={ACADEMIC_SECTIONS}
            completedModules={completedModules}
            onSelectSection={handleSelectSection}
            t={t}
          />
        )}

        {/* MODULES VIEW */}
        {view === 'modules' && activeSectionData && (
          <ModulesView
            section={activeSectionData}
            modules={sectionModules}
            completedModules={completedModules}
            onSelectModule={handleSelectModule}
            t={t}
          />
        )}

        {/* CONTENT VIEW */}
        {view === 'content' && activeModuleData && (
          <ContentView
            module={activeModuleData}
            isCompleted={completedModules.includes(activeModuleData.id)}
            onToggleComplete={handleToggleComplete}
            onContinue={handleContinue}
            t={t}
          />
        )}
      </div>
    </PremiumDrawer>
  )
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function SectionsView({
  sections,
  completedModules,
  onSelectSection,
  t
}: {
  sections: AcademicSection[]
  completedModules: ModuleId[]
  onSelectSection: (id: SectionId) => void
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const isUnlocked = isSectionUnlocked(section.id, completedModules)
        const progress = getSectionProgress(section.id, completedModules)
        const isComplete = progress.percentage === 100
        
        return (
          <button
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            disabled={!isUnlocked}
            className={`w-full p-4 rounded-xl border text-left transition-all ${
              isUnlocked
                ? 'border-border/50 hover:border-primary/50 hover:bg-muted/30 cursor-pointer'
                : 'border-border/30 bg-muted/10 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isComplete ? 'bg-success/10 text-success' :
                isUnlocked ? `bg-${section.accentColor}/10 text-${section.accentColor}` :
                'bg-muted text-muted-foreground'
              }`}>
                {isComplete ? (
                  <CheckIcon className="w-5 h-5" />
                ) : !isUnlocked ? (
                  <LockIcon className="w-5 h-5" />
                ) : (
                  <SectionIcon type={section.icon} className="w-5 h-5" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-enterprise-primary">
                    {t(`sections.${section.id}.title`)}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    ({section.modules.length} moduli)
                  </span>
                </div>
                <p className="text-sm text-enterprise-secondary line-clamp-2">
                  {t(`sections.${section.id}.description`)}
                </p>
                
                {/* Progress */}
                {isUnlocked && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isComplete ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                )}
                
                {!isUnlocked && (
                  <p className="text-xs text-warning mt-2">
                    {t('ui.sectionLocked')}
                  </p>
                )}
              </div>
              
              {/* Arrow */}
              {isUnlocked && (
                <ChevronRightIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function ModulesView({
  section,
  modules,
  completedModules,
  onSelectModule,
  t
}: {
  section: AcademicSection
  modules: AcademicModule[]
  completedModules: ModuleId[]
  onSelectModule: (id: ModuleId) => void
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div className="space-y-4">
      {/* Section description */}
      <div className="p-4 bg-muted/20 rounded-lg">
        <p className="text-sm text-enterprise-secondary">
          {t(`sections.${section.id}.description`)}
        </p>
      </div>
      
      {/* Modules list */}
      <div className="space-y-2">
        {modules.map((module, index) => {
          const isCompleted = completedModules.includes(module.id)
          const translationKey = getModuleTranslationKey(module.id)
          
          return (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                {/* Completion indicator */}
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isCompleted 
                    ? 'bg-success border-success' 
                    : 'border-muted-foreground/30'
                }`}>
                  {isCompleted ? (
                    <CheckIcon className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs text-muted-foreground">{index + 1}</span>
                  )}
                </div>
                
                {/* Module info */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-enterprise-primary">
                      {t(`modules.${translationKey}.title`)}
                    </span>
                    {module.isCritical && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-warning/10 text-warning rounded">
                        {t('ui.criticalModule')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      ~{module.estimatedMinutes} {t('ui.minutes')}
                    </span>
                  </div>
                </div>
              </div>
              
              <ChevronRightIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ContentView({
  module,
  isCompleted,
  onToggleComplete,
  onContinue,
  t
}: {
  module: AcademicModule
  isCompleted: boolean
  onToggleComplete: () => void
  onContinue: () => void
  t: ReturnType<typeof useTranslations>
}) {
  const translationKey = getModuleTranslationKey(module.id)
  
  return (
    <div className="space-y-6">
      {/* Module header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {module.isCritical && (
            <span className="px-2 py-1 text-xs font-medium bg-warning/10 text-warning rounded">
              {t('ui.criticalModule')}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            ~{module.estimatedMinutes} {t('ui.minutes')}
          </span>
        </div>
        <p className="text-enterprise-secondary">
          {t(`modules.${translationKey}.description`)}
        </p>
      </div>
      
      {/* Topics list */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-enterprise-primary">
          Argomenti trattati:
        </h4>
        <ul className="space-y-3">
          {module.topics.map((topicKey, index) => {
            // Extract topic name from key
            const topicName = topicKey.split('.').pop() || ''
            return (
              <li key={topicKey} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">
                  {index + 1}
                </div>
                <span className="text-enterprise-body pt-0.5">
                  {t(`modules.${translationKey}.topics.${topicName}`)}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
      
      {/* Placeholder for actual content */}
      <div className="p-6 bg-muted/20 rounded-lg border border-dashed border-border/50 text-center">
        <p className="text-sm text-muted-foreground">
          Contenuto educativo del modulo
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          (da implementare)
        </p>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-enterprise-soft">
        {isCompleted ? (
          <>
            <button
              onClick={onToggleComplete}
              className="flex-1 px-4 py-3 rounded-lg font-medium border border-success/30 bg-success/5 text-success hover:bg-success/10 transition-colors"
            >
              ✓ {t('ui.moduleCompleted')}
            </button>
            <button
              onClick={onContinue}
              className="flex-1 px-4 py-3 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              {t('ui.continue')} →
            </button>
          </>
        ) : (
          <button
            onClick={onContinue}
            className="w-full px-4 py-3 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            {t('ui.markComplete')}
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// ICONS
// ============================================================================

function AcademicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function SectionIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    book: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    user: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    alert: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    cpu: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
    target: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    )
  }
  return icons[type] || icons.book
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Converts module ID to translation key
 * e.g., 'what-are-reserves' -> 'whatAreReserves'
 */
function getModuleTranslationKey(moduleId: string): string {
  const keyMap: Record<string, string> = {
    'what-are-reserves': 'whatAreReserves',
    'reserve-categories': 'reserveCategories',
    'what-they-solve': 'whatTheySolve',
    'what-they-dont-solve': 'whatTheyDontSolve',
    'non-negotiable-prerequisites': 'prerequisites',
    'personal-economic-perimeter': 'economicPerimeter',
    'stress-tolerance': 'stressTolerance',
    'risk-types': 'riskTypes',
    'risk-budget': 'riskBudget',
    'quantitative-ranges': 'quantitativeRanges',
    'failure-modes': 'failureModes',
    'tools-risk-matrix': 'toolsRiskMatrix',
    'crypto-technical-perimeter': 'cryptoPerimeter',
    'custody-cognitive-cost': 'custodyCost',
    'real-scenarios': 'realScenarios',
    'decision-gate': 'decisionGate',
    'mifid-operational-block': 'mifidBlock'
  }
  return keyMap[moduleId] || moduleId
}
