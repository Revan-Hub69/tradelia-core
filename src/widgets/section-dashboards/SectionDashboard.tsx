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
import { OWN_MODULE_LIST, getModuleById } from '@/src/shared/config/own-learning-path'
import { ModuleContent } from './ModuleContent'
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
  const section = CRYPTO_SECTIONS[sectionId]
  const pillars = SECTION_PILLARS[sectionId]

  // Drawer state - state machine like EmergencyPillars
  type DrawerView = 'list' | 'module'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerView, setDrawerView] = useState<DrawerView>('list')
  const [activePillar, setActivePillar] = useState<string | null>(null)
  const [activeModule, setActiveModule] = useState<string | null>(null)

  // Progress tracking
  const { state } = useDashboardAuth()
  const { 
    getPillarProgress,
    markSectionComplete,
    markSectionIncomplete,
    progressCache
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

  // Get modules for active pillar (only learning-path has real modules for now)
  const activeModules = activePillar === 'learning-path' ? OWN_MODULE_LIST : []
  const activeProgress = useMemo(() => 
    activePillarData ? getPillarProgress(sectionId, activePillarData.id) : null,
    [activePillarData, getPillarProgress, sectionId, progressCache]
  )
  const activeModuleData = activeModule ? getModuleById(activeModule) : null

  const handleOpenPillar = (pillarId: string) => {
    setActivePillar(pillarId)
    setActiveModule(null)
    setDrawerView('list')
    setDrawerOpen(true)
  }

  const handleSelectModule = (moduleId: string) => {
    setActiveModule(moduleId)
    setDrawerView('module')
  }

  const handleBack = () => {
    if (drawerView === 'module') {
      setActiveModule(null)
      setDrawerView('list')
      return
    }
    closeDrawer()
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
    setDrawerView('list')
    setActiveModule(null)
    
    // Hard cleanup - ensure inert is removed BEFORE unmounting
    const mainContent = document.querySelector('#main-content') as HTMLElement | null
    if (mainContent) {
      mainContent.removeAttribute('inert')
    }
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    
    // Delay resetting activePillar to allow drawer animation to complete
    setTimeout(() => {
      setActivePillar(null)
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
                <span className="text-sm text-muted-foreground">{t(`${sectionId}.complexity`)}</span>
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
            title={drawerView === 'module' && activeModuleData ? activeModuleData.title : t(activePillarData.titleKey)}
            subtitle={drawerView === 'module' && activeModuleData 
              ? `${t(activePillarData.titleKey)} • Modulo ${activeModules.findIndex(m => m.id === activeModule) + 1} di ${activeModules.length}`
              : t(`${sectionId}.title`)
            }
            icon={<PillarIcon type={activePillarData.icon} className="w-6 h-6" />}
            accentColor={activePillarData.color}
            size="xl"
            closeOnBackdrop={true}
            closeOnEscape={true}
          >
            {drawerView === 'list' ? (
              /* LIST VIEW - Show all modules or placeholder */
              <div className="space-y-6">
                {/* Back button */}
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                  <button
                    onClick={closeDrawer}
                    aria-label="Chiudi drawer"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg px-3 py-2 -ml-2 min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <span className="text-lg">←</span>
                    Chiudi
                  </button>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium" id="progress-label">Completamento:</span>
                  <div 
                    className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={activePillarData.completionPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-labelledby="progress-label"
                  >
                    <div 
                      className="h-full bg-success rounded-full transition-all duration-300"
                      style={{ width: `${activePillarData.completionPercent}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{activePillarData.completionPercent}%</span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-base font-semibold mb-2">Cosa imparerai</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(activePillarData.descriptionKey)}
                  </p>
                </div>

                {/* Modules list or placeholder */}
                {activeModules.length > 0 ? (
                  <div>
                    <h3 className="text-base font-semibold mb-4">Moduli del percorso</h3>
                    <div className="space-y-2">
                      {activeModules.map((module, index) => {
                        const isCompleted = activeProgress?.completedSections?.includes(module.id)
                        return (
                          <button
                            key={module.id}
                            onClick={() => handleSelectModule(module.id)}
                            aria-label={`${isCompleted ? 'Completato: ' : ''}${module.title}, ${module.estimatedMinutes} minuti`}
                            className="w-full flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-colors text-left min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isCompleted 
                                  ? 'bg-success border-success' 
                                  : 'border-muted-foreground/30'
                              }`}>
                                {isCompleted && (
                                  <span className="text-white text-xs">✓</span>
                                )}
                              </div>
                              <div>
                                <span className="font-medium">{index + 1}. {module.title}</span>
                                <span className="text-xs text-muted-foreground ml-2">~{module.estimatedMinutes} min</span>
                              </div>
                            </div>
                            <span className="text-muted-foreground">→</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  /* Placeholder for pillars without modules yet */
                  <div className="p-8 rounded-lg border border-dashed border-border/50 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <PillarIcon type={activePillarData.icon} className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Contenuto in arrivo
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      I moduli per questo pilastro sono in fase di sviluppo.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* MODULE VIEW - Show module content */
              <div className="space-y-6">
                {/* Navigation header */}
                <div className="space-y-4 pb-4 border-b border-border/50">
                  {/* Progress bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">Progresso:</span>
                    <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ 
                          width: `${((activeModules.findIndex(m => m.id === activeModule) + 1) / activeModules.length) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activeModules.findIndex(m => m.id === activeModule) + 1}/{activeModules.length}
                    </span>
                  </div>
                  
                  {/* Navigation controls */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleBack}
                      aria-label="Torna alla lista moduli"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg px-3 py-2 -ml-2 min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <span>←</span>
                      Indietro
                    </button>
                    
                    {/* Prev/Next navigation */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const currentIndex = activeModules.findIndex(m => m.id === activeModule)
                          if (currentIndex > 0) {
                            setActiveModule(activeModules[currentIndex - 1]?.id || '')
                          }
                        }}
                        disabled={activeModules.findIndex(m => m.id === activeModule) === 0}
                        aria-label="Modulo precedente"
                        className="w-11 h-11 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-muted hover:bg-muted-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => {
                          const currentIndex = activeModules.findIndex(m => m.id === activeModule)
                          if (currentIndex < activeModules.length - 1) {
                            setActiveModule(activeModules[currentIndex + 1]?.id || '')
                          }
                        }}
                        disabled={activeModules.findIndex(m => m.id === activeModule) === activeModules.length - 1}
                        aria-label="Modulo successivo"
                        className="w-11 h-11 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-muted hover:bg-muted-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Module content */}
                {activeModuleData && (
                  <ModuleContent 
                    module={activeModuleData}
                    onComplete={() => handleCompleteModule(activeModule!)}
                    isCompleted={activeProgress?.completedSections?.includes(activeModule!) || false}
                  />
                )}
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
