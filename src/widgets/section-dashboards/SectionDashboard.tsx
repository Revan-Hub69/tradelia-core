/**
 * Section Dashboard - Generic Component
 * 
 * Struttura pagina sezione:
 * ┌─────────────────────────────────────────────────────┐
 * │  INTRODUZIONE COGNITIVA (hero alert in alto)        │
 * └─────────────────────────────────────────────────────┘
 * ┌─────────────────────┐  ┌─────────────────────┐
 * │ Percorso dinamico   │  │ Checklist anti-err  │
 * └─────────────────────┘  └─────────────────────┘
 * ┌─────────────────────┐  ┌─────────────────────┐
 * │ Indicatori base     │  │ Demo assistita      │
 * └─────────────────────┘  └─────────────────────┘
 */

'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { JourneyCard } from '@/src/shared/ui/JourneyCard'
import { PremiumDrawer } from '@/src/shared/ui/PremiumDrawer'
import { ComplexityIndicator } from '@/src/shared/ui/ComplexityIndicator'
import { CRYPTO_SECTIONS, type SectionId } from '@/src/shared/config/crypto-sections'
import { OWN_MODULE_LIST, getModuleById as getOwnModuleById } from '@/src/shared/config/own-learning-path'
import { YIELD_MODULE_LIST, getYieldModuleById } from '@/src/shared/config/yield-learning-path'
import { INVEST_MODULE_LIST, getInvestModuleById } from '@/src/shared/config/invest-learning-path'
import { SPECULATE_MODULE_LIST, getSpeculateModuleById } from '@/src/shared/config/speculate-learning-path'
import { TECHNICAL_MODULE_LIST, getTechnicalModuleById } from '@/src/shared/config/technical-deep-dives'
import { 
  GroupsView, 
  ModulesListView, 
  ModuleContentView 
} from '@/src/widgets/learning-path-drawer'
import { 
  getLearningPathGroups
} from '@/src/shared/config/learning-path-groups'
import { useProgressTracking } from '@/src/shared/hooks/useProgressTracking'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'

interface SectionDashboardProps {
  sectionId: SectionId
}

// Configurazione 4 pilastri per ogni sezione
const SECTION_PILLARS: Record<SectionId, PillarConfig[]> = {
  own: [
    { id: 'learning-path', titleKey: 'pillars.learningPath.title', descriptionKey: 'pillars.learningPath.description', icon: 'book', color: 'primary', focusKeys: ['pillars.learningPath.focus1', 'pillars.learningPath.focus2', 'pillars.learningPath.focus3'] },
    { id: 'checklist', titleKey: 'pillars.checklist.title', descriptionKey: 'pillars.checklist.description', icon: 'check', color: 'success', focusKeys: ['pillars.checklist.focus1', 'pillars.checklist.focus2', 'pillars.checklist.focus3'] },
    { id: 'indicators', titleKey: 'pillars.indicators.title', descriptionKey: 'pillars.indicators.description', icon: 'chart', color: 'warning', focusKeys: ['pillars.indicators.focus1', 'pillars.indicators.focus2', 'pillars.indicators.focus3'] },
    { id: 'demo', titleKey: 'pillars.demo.title', descriptionKey: 'pillars.demo.description', icon: 'play', color: 'error', focusKeys: ['pillars.demo.focus1', 'pillars.demo.focus2', 'pillars.demo.focus3'] }
  ],
  yield: [
    { id: 'learning-path', titleKey: 'pillars.learningPath.title', descriptionKey: 'pillars.learningPath.description', icon: 'book', color: 'primary', focusKeys: ['pillars.learningPath.focus1', 'pillars.learningPath.focus2', 'pillars.learningPath.focus3'] },
    { id: 'checklist', titleKey: 'pillars.checklist.title', descriptionKey: 'pillars.checklist.description', icon: 'check', color: 'success', focusKeys: ['pillars.checklist.focus1', 'pillars.checklist.focus2', 'pillars.checklist.focus3'] },
    { id: 'indicators', titleKey: 'pillars.indicators.title', descriptionKey: 'pillars.indicators.description', icon: 'chart', color: 'warning', focusKeys: ['pillars.indicators.focus1', 'pillars.indicators.focus2', 'pillars.indicators.focus3'] },
    { id: 'demo', titleKey: 'pillars.demo.title', descriptionKey: 'pillars.demo.description', icon: 'play', color: 'error', focusKeys: ['pillars.demo.focus1', 'pillars.demo.focus2', 'pillars.demo.focus3'] }
  ],
  invest: [
    { id: 'learning-path', titleKey: 'pillars.learningPath.title', descriptionKey: 'pillars.learningPath.description', icon: 'book', color: 'primary', focusKeys: ['pillars.learningPath.focus1', 'pillars.learningPath.focus2', 'pillars.learningPath.focus3'] },
    { id: 'checklist', titleKey: 'pillars.checklist.title', descriptionKey: 'pillars.checklist.description', icon: 'check', color: 'success', focusKeys: ['pillars.checklist.focus1', 'pillars.checklist.focus2', 'pillars.checklist.focus3'] },
    { id: 'indicators', titleKey: 'pillars.indicators.title', descriptionKey: 'pillars.indicators.description', icon: 'chart', color: 'warning', focusKeys: ['pillars.indicators.focus1', 'pillars.indicators.focus2', 'pillars.indicators.focus3'] },
    { id: 'demo', titleKey: 'pillars.demo.title', descriptionKey: 'pillars.demo.description', icon: 'play', color: 'error', focusKeys: ['pillars.demo.focus1', 'pillars.demo.focus2', 'pillars.demo.focus3'] }
  ],
  speculate: [
    { id: 'learning-path', titleKey: 'pillars.learningPath.title', descriptionKey: 'pillars.learningPath.description', icon: 'book', color: 'primary', focusKeys: ['pillars.learningPath.focus1', 'pillars.learningPath.focus2', 'pillars.learningPath.focus3'] },
    { id: 'checklist', titleKey: 'pillars.checklist.title', descriptionKey: 'pillars.checklist.description', icon: 'check', color: 'success', focusKeys: ['pillars.checklist.focus1', 'pillars.checklist.focus2', 'pillars.checklist.focus3'] },
    { id: 'indicators', titleKey: 'pillars.indicators.title', descriptionKey: 'pillars.indicators.description', icon: 'chart', color: 'warning', focusKeys: ['pillars.indicators.focus1', 'pillars.indicators.focus2', 'pillars.indicators.focus3'] },
    { id: 'demo', titleKey: 'pillars.demo.title', descriptionKey: 'pillars.demo.description', icon: 'play', color: 'error', focusKeys: ['pillars.demo.focus1', 'pillars.demo.focus2', 'pillars.demo.focus3'] }
  ]
}

interface PillarConfig {
  id: string
  titleKey: string
  descriptionKey: string
  icon: 'book' | 'check' | 'chart' | 'play'
  color: 'primary' | 'success' | 'warning' | 'error'
  focusKeys: string[]
}

export function SectionDashboard({ sectionId }: SectionDashboardProps) {
  const t = useTranslations('sections')
  const tDrawer = useTranslations('drawer')
  const section = CRYPTO_SECTIONS[sectionId]
  const pillars = SECTION_PILLARS[sectionId]

  // Drawer state - 3-level navigation (setup removed, now in onboarding modal)
  type DrawerView = 'groups' | 'modules-list' | 'module-content'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerView, setDrawerView] = useState<DrawerView>('groups')
  const [activePillar, setActivePillar] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [activeModule, setActiveModule] = useState<string | null>(null)

  // Progress tracking
  const { state } = useDashboardAuth()
  const { 
    getPillarProgress,
    markSectionComplete,
    markSectionIncomplete
  } = useProgressTracking({
    isGuest: state.isGuestMode,
    userId: state.user?.id
  })

  // Pillars with progress
  const pillarsWithProgress = useMemo(() => {
    return pillars.map(pillar => {
      const progress = getPillarProgress(sectionId, pillar.id)
      const focusAreas = pillar.focusKeys.map(key => t(key))
      return { ...pillar, completionPercent: progress?.percentage || 0, focusAreas }
    })
  }, [pillars, getPillarProgress, sectionId, t])

  const activePillarData = activePillar 
    ? pillarsWithProgress.find(p => p.id === activePillar) 
    : null

  // Get modules based on selected group and journey
  const getModulesForGroup = (groupId: string) => {
    if (groupId === 'phase-0') {
      // Phase 0 modules (0.1-0.8) - same for all journeys
      return OWN_MODULE_LIST.filter(m => m.id.startsWith('0.'))
    }
    
    if (groupId === 'phase-1') {
      // Phase 1 modules - journey specific
      switch (sectionId) {
        case 'own': return OWN_MODULE_LIST.filter(m => m.id.startsWith('1.'))
        case 'yield': return YIELD_MODULE_LIST
        case 'invest': return INVEST_MODULE_LIST
        case 'speculate': return SPECULATE_MODULE_LIST
        default: return []
      }
    }
    
    if (groupId === 'technical-deep-dives') {
      return TECHNICAL_MODULE_LIST
    }
    
    return []
  }

  const activeModules = selectedGroup ? getModulesForGroup(selectedGroup) : []
  const activeProgress = useMemo(() => 
    activePillarData ? getPillarProgress(sectionId, activePillarData.id) : null,
    [activePillarData, getPillarProgress, sectionId]
  )
  
  // Get module by ID from correct source
  const getModuleById = (moduleId: string) => {
    if (moduleId.startsWith('0.') || moduleId.startsWith('1.')) {
      return getOwnModuleById(moduleId)
    }
    if (moduleId.startsWith('2.')) {
      return getYieldModuleById(moduleId)
    }
    if (moduleId.startsWith('3.')) {
      return getInvestModuleById(moduleId)
    }
    if (moduleId.startsWith('4.')) {
      return getSpeculateModuleById(moduleId)
    }
    if (moduleId.startsWith('t.')) {
      return getTechnicalModuleById(moduleId)
    }
    return undefined
  }
  
  const activeModuleData = activeModule ? getModuleById(activeModule) : null
  
  // Check completion for unlock logic
  const phase0Completed = false // TODO: implement real check
  const phase1Completed = false // TODO: implement real check
  const groups = activePillar === 'learning-path' 
    ? getLearningPathGroups(sectionId, phase0Completed, phase1Completed)
    : []

  const handleOpenPillar = (pillarId: string) => {
    setActivePillar(pillarId)
    setDrawerView('groups')
    setDrawerOpen(true)
  }

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroup(groupId)
    setDrawerView('modules-list')
  }

  const handleSelectModule = (moduleId: string) => {
    setActiveModule(moduleId)
    setDrawerView('module-content')
  }

  const handleBackFromGroups = () => {
    closeDrawer()
  }

  const handleBackFromModulesList = () => {
    setSelectedGroup(null)
    setDrawerView('groups')
  }

  const handleBackFromModuleContent = () => {
    setActiveModule(null)
    setDrawerView('modules-list')
  }

  const handlePreviousModule = () => {
    const currentIndex = activeModules.findIndex(m => m.id === activeModule)
    if (currentIndex > 0) {
      setActiveModule(activeModules[currentIndex - 1]?.id || '')
    }
  }

  const handleNextModule = () => {
    const currentIndex = activeModules.findIndex(m => m.id === activeModule)
    if (currentIndex < activeModules.length - 1) {
      setActiveModule(activeModules[currentIndex + 1]?.id || '')
    }
  }

  const handleCompleteModule = async (moduleId: string) => {
    if (!activePillarData) return
    
    const isCompleted = activeProgress?.completedSections?.includes(moduleId)
    const totalModules = activeModules.length

    if (isCompleted) {
      await markSectionIncomplete(sectionId, activePillarData.id, moduleId, totalModules)
    } else {
      await markSectionComplete(sectionId, activePillarData.id, moduleId, totalModules)
    }
  }

  // CLOSE: Reset everything and cleanup inert
  const closeDrawer = () => {
    setDrawerOpen(false)
    
    // Hard cleanup - ensure inert is removed BEFORE unmounting
    const mainContent = document.querySelector('#main-content') as HTMLElement | null
    if (mainContent) {
      mainContent.removeAttribute('inert')
    }
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    
    // Delay resetting state to allow drawer animation to complete
    setTimeout(() => {
      setActivePillar(null)
      setSelectedGroup(null)
      setActiveModule(null)
      setDrawerView('groups')
    }, 200)
  }

  // Color mapping for section
  const sectionColors = {
    success: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
    error: { bg: 'bg-error/10', text: 'text-error', border: 'border-error/20' },
    info: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' }
  }
  const colors = sectionColors[section.color] || sectionColors.success

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
              <SectionIcon type={section.icon} className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {t(`${sectionId}.title`)}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <ComplexityIndicator level={section.complexity} size="sm" showTooltip={false} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 pb-8">
          {/* INTRODUZIONE COGNITIVA - Hero Alert */}
          <SectionHeroAlert sectionId={sectionId} colors={colors} t={t} />

          {/* 4 PILASTRI - Griglia 2x2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pillarsWithProgress.map((pillar) => (
              <JourneyCard
                key={pillar.id}
                title={t(pillar.titleKey)}
                description={t(pillar.descriptionKey)}
                icon={<PillarIcon type={pillar.icon} className="w-6 h-6" />}
                accentColor={pillar.color}
                onClick={() => handleOpenPillar(pillar.id)}
                badge={<CompletionBadge percentage={pillar.completionPercent} />}
              >
                {/* Focus Areas - come in EmergencyPillars */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('ui.focus')}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {pillar.focusAreas.map((area) => (
                      <span 
                        key={area}
                        className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </JourneyCard>
            ))}
          </div>
        </div>

        {/* Drawer per pilastro attivo */}
        {activePillarData && (
          <PremiumDrawer
            isOpen={drawerOpen}
            onClose={closeDrawer}
            title={
              drawerView === 'module-content' && activeModuleData 
                ? activeModuleData.title 
                : drawerView === 'modules-list' && selectedGroup
                ? selectedGroup === 'phase-0' ? tDrawer('groups.phase0Title')
                  : selectedGroup === 'phase-1' ? tDrawer('groups.phase1Title')
                  : tDrawer('groups.technicalTitle')
                : t(activePillarData.titleKey)
            }
            subtitle={
              drawerView === 'module-content' && activeModuleData
                ? tDrawer('modules.subtitle', { 
                    current: activeModules.findIndex(m => m.id === activeModule) + 1,
                    total: activeModules.length 
                  })
                : drawerView === 'modules-list'
                ? t(activePillarData.titleKey)
                : t(`${sectionId}.title`)
            }
            icon={<PillarIcon type={activePillarData.icon} className="w-6 h-6" />}
            accentColor={activePillarData.color}
            size="xl"
            closeOnBackdrop={true}
            closeOnEscape={true}
            showTechnicalLevelToggle={activePillar === 'learning-path'}
            {...(state.user?.id && { userId: state.user.id })}
          >
            {/* Level 1: Groups */}
            {drawerView === 'groups' && activePillar === 'learning-path' && (
              <GroupsView
                groups={groups}
                onSelectGroup={handleSelectGroup}
                onBack={handleBackFromGroups}
              />
            )}

            {/* Level 2: Modules List */}
            {drawerView === 'modules-list' && selectedGroup && (
              <ModulesListView
                groupId={selectedGroup}
                groupTitle={
                  selectedGroup === 'phase-0' ? tDrawer('groups.phase0Title')
                    : selectedGroup === 'phase-1' ? `${tDrawer('groups.phase1Title')} - ${t(`${sectionId}.title`)}`
                    : tDrawer('groups.technicalTitle')
                }
                modules={activeModules}
                completedModules={activeProgress?.completedSections || []}
                onSelectModule={handleSelectModule}
                onBack={handleBackFromModulesList}
              />
            )}

            {/* Level 3: Module Content */}
            {drawerView === 'module-content' && activeModuleData && (
              <ModuleContentView
                module={activeModuleData}
                currentIndex={activeModules.findIndex(m => m.id === activeModule)}
                totalModules={activeModules.length}
                isCompleted={activeProgress?.completedSections?.includes(activeModule!) || false}
                onComplete={() => handleCompleteModule(activeModule!)}
                onPrevious={handlePreviousModule}
                onNext={handleNextModule}
                onBack={handleBackFromModuleContent}
                hasPrevious={activeModules.findIndex(m => m.id === activeModule) > 0}
                hasNext={activeModules.findIndex(m => m.id === activeModule) < activeModules.length - 1}
              />
            )}

            {/* Placeholder for other pillars */}
            {drawerView === 'groups' && activePillar !== 'learning-path' && (
              <div className="space-y-6">
                <button
                  onClick={closeDrawer}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg px-3 py-2 -ml-2 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <span className="text-lg">←</span>
                  {t('drawer.navigation.close')}
                </button>
                
                <div className="p-8 rounded-lg border border-dashed border-border/50 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <PillarIcon type={activePillarData.icon} className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('drawer.content.inDevelopment')}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {t('drawer.content.inDevelopmentDescription')}
                  </p>
                </div>
              </div>
            )}
          </PremiumDrawer>
        )}
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}

// Hero Alert per introduzione cognitiva
function SectionHeroAlert({ 
  sectionId, 
  colors, 
  t 
}: { 
  sectionId: SectionId
  colors: { bg: string; text: string; border: string }
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div className={`section-frame p-6 border-l-4 ${colors.border}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <AlertIcon className={`w-5 h-5 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {t(`${sectionId}.whatItAnalyzes`)}
          </h2>
          <ul className="space-y-2">
            {[0, 1, 2].map((index) => (
              <li key={index} className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${colors.bg.replace('/10', '')} mt-2 flex-shrink-0`} />
                <span className="text-muted-foreground">
                  {t(`${sectionId}.whatItAnalyzesList.${index}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Badge completamento
function CompletionBadge({ percentage }: { percentage: number }) {
  if (percentage === 0) return null
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-success rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{percentage}%</span>
    </div>
  )
}

// Icons
function SectionIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'wallet':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </svg>
      )
    case 'percent':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'trending':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      )
    case 'zap':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      )
    default:
      return null
  }
}

function PillarIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'book':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      )
    case 'check':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'chart':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      )
    case 'play':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
        </svg>
      )
    default:
      return null
  }
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  )
}
