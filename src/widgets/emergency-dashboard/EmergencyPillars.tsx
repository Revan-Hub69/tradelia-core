/**
 * Emergency Pillars - Tradelia 2026
 *
 * Design unificato con JourneyCard + PremiumDrawer
 * Struttura identica alle card della home: icon + title + description + completion + focus areas
 * Progress tracking con IndexedDB (guest) o Supabase (registrati)
 */

'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { JourneyCard } from '@/src/shared/ui/JourneyCard'
import { 
  PremiumDrawer
} from '@/src/shared/ui/PremiumDrawer'
import { useProgressTracking } from '@/src/shared/hooks/useProgressTracking'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'

// Configurazione sezioni per ogni pillar (espandibile)
const PILLAR_SECTIONS: Record<string, { id: string; titleKey: string }[]> = {
  academic: [
    { id: 'history', titleKey: 'Storia e contesto' },
    { id: 'principles', titleKey: 'Principi di funzionamento' },
    { id: 'usecases', titleKey: 'Casi d\'uso reali' },
    { id: 'limits', titleKey: 'Limiti e rischi' },
    { id: 'quiz', titleKey: 'Verifica comprensione' }
  ],
  analysis: [
    { id: 'tech-eval', titleKey: 'Valutazione tecnologie' },
    { id: 'risk-analysis', titleKey: 'Analisi rischi' },
    { id: 'comparison', titleKey: 'Confronto soluzioni' },
    { id: 'criteria', titleKey: 'Criteri di scelta' },
    { id: 'quiz', titleKey: 'Verifica comprensione' }
  ],
  errors: [
    { id: 'operational', titleKey: 'Errori operativi' },
    { id: 'evaluation', titleKey: 'Errori di valutazione' },
    { id: 'timing', titleKey: 'Errori di timing' },
    { id: 'prevention', titleKey: 'Prevenzione' },
    { id: 'quiz', titleKey: 'Verifica comprensione' }
  ],
  demo: [
    { id: 'setup', titleKey: 'Setup ambiente' },
    { id: 'procedures', titleKey: 'Procedure pratiche' },
    { id: 'tests', titleKey: 'Test operativi' },
    { id: 'verification', titleKey: 'Verifica finale' }
  ]
}

interface PillarConfig {
  id: string
  title: string
  description: string
  iconType: 'book' | 'chart' | 'alert' | 'play'
  accentColor: 'primary' | 'success' | 'warning' | 'error'
  focusAreas: string[]
  hasCta: boolean
}

export function EmergencyPillars() {
  const t = useTranslations('emergencyDashboard.pillars')
  
  // State machine: drawerOpen controls existence, drawerView controls content
  type DrawerView = 'list' | 'module'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerView, setDrawerView] = useState<DrawerView>('list')
  const [activePillar, setActivePillar] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  
  const { state } = useDashboardAuth()
  const { 
    getPillarProgress, 
    markSectionComplete, 
    markSectionIncomplete
  } = useProgressTracking({
    isGuest: state.isGuestMode,
    userId: state.user?.id
  })

  const pillarsConfig: PillarConfig[] = useMemo(() => [
    {
      id: 'academic',
      title: t('academic.title'),
      description: t('academic.description'),
      iconType: 'book',
      accentColor: 'primary',
      focusAreas: [t('academic.focus1'), t('academic.focus2'), t('academic.focus3')],
      hasCta: true
    },
    {
      id: 'analysis',
      title: t('analysis.title'),
      description: t('analysis.description'),
      iconType: 'chart',
      accentColor: 'success',
      focusAreas: [t('analysis.focus1'), t('analysis.focus2'), t('analysis.focus3')],
      hasCta: true
    },
    {
      id: 'errors',
      title: t('errors.title'),
      description: t('errors.description'),
      iconType: 'alert',
      accentColor: 'warning',
      focusAreas: [t('errors.focus1'), t('errors.focus2'), t('errors.focus3')],
      hasCta: true
    },
    {
      id: 'demo',
      title: t('demo.title'),
      description: t('demo.description'),
      iconType: 'play',
      accentColor: 'error',
      focusAreas: [t('demo.focus1'), t('demo.focus2'), t('demo.focus3')],
      hasCta: false
    }
  ], [t])

  // Calcola percentuali dinamiche
  const pillarsWithProgress = useMemo(() => {
    return pillarsConfig.map(pillar => {
      const progress = getPillarProgress('emergency', pillar.id)
      const percentage = progress?.percentage || 0
      return { ...pillar, completionPercent: percentage }
    })
  }, [pillarsConfig, getPillarProgress])

  const activeData = activePillar ? pillarsWithProgress.find(p => p.id === activePillar) : null
  const activeSections = activeData ? PILLAR_SECTIONS[activeData.id] || [] : []
  const activeProgress = activeData ? getPillarProgress('emergency', activeData.id) : null
  const activeSectionData = activeSection ? activeSections.find(s => s.id === activeSection) : null

  const handleCompleteSection = async (sectionId: string) => {
    if (!activeData) return
    
    const isCompleted = activeProgress?.completedSections?.includes(sectionId)
    const totalSections = activeSections.length

    if (isCompleted) {
      await markSectionIncomplete('emergency', activeData.id, sectionId, totalSections)
    } else {
      await markSectionComplete('emergency', activeData.id, sectionId, totalSections)
    }
  }

  // CLOSE: Reset everything and cleanup
  const closeDrawer = () => {
    setDrawerOpen(false)
    setDrawerView('list')
    setActiveSection(null)
    setActivePillar(null)
    
    // Hard cleanup - ensure inert is removed
    const mainContent = document.querySelector('#main-content') as HTMLElement | null
    if (mainContent) {
      mainContent.removeAttribute('inert')
    }
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }

  // BACK: If in module, go to list. If in list, close.
  const handleBack = () => {
    if (drawerView === 'module') {
      // Go back to list view
      setActiveSection(null)
      setDrawerView('list')
      return
    }
    // Already in list, close drawer
    closeDrawer()
  }

  // OPEN: From dashboard card click
  const handleOpenPillar = (pillarId: string) => {
    setActivePillar(pillarId)
    setActiveSection(null)
    setDrawerView('list')
    setDrawerOpen(true)
  }

  // SELECT MODULE: From list view
  const handleSelectModule = (sectionId: string) => {
    setActiveSection(sectionId)
    setDrawerView('module')
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pillarsWithProgress.map((pillar) => (
          <JourneyCard
            key={pillar.id}
            title={pillar.title}
            description={pillar.description}
            icon={<PillarIcon type={pillar.iconType} className="w-6 h-6" />}
            accentColor={pillar.accentColor}
            onClick={() => handleOpenPillar(pillar.id)}
            badge={<CompletionIndicator percentage={pillar.completionPercent} label={t('completion')} />}
          >
            {/* Focus Areas */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('focusOn')}:
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

      {/* Enterprise Drawer - State Machine: LIST or MODULE view */}
      {activeData && (
        <PremiumDrawer
          isOpen={drawerOpen}
          onClose={closeDrawer}
          title={drawerView === 'module' && activeSectionData ? activeSectionData.titleKey : activeData.title}
          subtitle={drawerView === 'module' && activeSectionData 
            ? `${activeData.title} • Modulo ${activeSections.findIndex(s => s.id === activeSection) + 1} di ${activeSections.length}`
            : 'Pilastro di emergenza'
          }
          icon={<PillarIcon type={activeData.iconType} className="w-6 h-6" />}
          accentColor={activeData.accentColor}
          size="xl"
          closeOnBackdrop={true}
          closeOnEscape={true}
        >
          {drawerView === 'list' ? (
            /* LIST VIEW - Show all modules */
            <div className="space-y-6">
              {/* Back button */}
              <div className="flex items-center gap-3 pb-4 border-b border-enterprise-soft">
                <button
                  onClick={closeDrawer}
                  className="flex items-center gap-2 text-sm font-medium text-enterprise-secondary hover:text-enterprise-primary transition-colors focus-enterprise-ring rounded-lg px-2 py-1 -ml-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Chiudi
                </button>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Completamento:</span>
                <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success rounded-full transition-all duration-300"
                    style={{ width: `${activeData.completionPercent}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{activeData.completionPercent}%</span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-base font-semibold mb-2">Cosa imparerai</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activeData.description}
                </p>
              </div>

              {/* Modules list */}
              <div>
                <h3 className="text-base font-semibold mb-4">Moduli del percorso</h3>
                <div className="space-y-2">
                  {activeSections.map((section, index) => {
                    const isCompleted = activeProgress?.completedSections?.includes(section.id)
                    return (
                      <button
                        key={section.id}
                        onClick={() => handleSelectModule(section.id)}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-success border-success' 
                              : 'border-muted-foreground/30'
                          }`}>
                            {isCompleted && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium">{index + 1}. {section.titleKey}</span>
                        </div>
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* MODULE VIEW - Show module content */
            <div className="space-y-6">
              {/* Navigation header */}
              <div className="space-y-4 pb-4 border-b border-enterprise-soft">
                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">Progresso:</span>
                  <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((activeSections.findIndex(s => s.id === activeSection) + 1) / activeSections.length) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activeSections.findIndex(s => s.id === activeSection) + 1}/{activeSections.length}
                  </span>
                </div>
                
                {/* Navigation controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg px-2 py-1 -ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Indietro
                  </button>
                  
                  {/* Prev/Next navigation */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const currentIndex = activeSections.findIndex(s => s.id === activeSection)
                        if (currentIndex > 0) {
                          setActiveSection(activeSections[currentIndex - 1]?.id || '')
                        }
                      }}
                      disabled={activeSections.findIndex(s => s.id === activeSection) === 0}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-muted hover:bg-muted-foreground/20"
                      title="Modulo precedente"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const currentIndex = activeSections.findIndex(s => s.id === activeSection)
                        if (currentIndex < activeSections.length - 1) {
                          setActiveSection(activeSections[currentIndex + 1]?.id || '')
                        }
                      }}
                      disabled={activeSections.findIndex(s => s.id === activeSection) === activeSections.length - 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-muted hover:bg-muted-foreground/20"
                      title="Modulo successivo"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Module content */}
              {activeSection && (
                <SubmoduleContent 
                  pillarId={activeData.id}
                  sectionId={activeSection}
                  onComplete={() => handleCompleteSection(activeSection)}
                  isCompleted={activeProgress?.completedSections?.includes(activeSection) || false}
                />
              )}
            </div>
          )}
        </PremiumDrawer>
      )}
    </>
  )
}

/** Indicatore completamento in percentuale */
function CompletionIndicator({ percentage, label }: { percentage: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <div className="flex items-center gap-1.5">
        <div className="w-16 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{percentage}%</span>
      </div>
    </div>
  )
}

function PillarIcon({ type, className }: { type: string; className?: string }) {
  if (type === 'book') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    )
  }
  if (type === 'chart') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 6-6" />
      </svg>
    )
  }
  if (type === 'alert') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9v4M12 17h.01" />
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      </svg>
    )
  }
  // play
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  )
}

// Component for submodule content
function SubmoduleContent({ 
  pillarId, 
  sectionId, 
  onComplete, 
  isCompleted 
}: {
  pillarId: string
  sectionId: string | null
  onComplete: () => void
  isCompleted: boolean
}) {
  if (!sectionId) return null
  // Mock content - in real app this would come from CMS or API
  const getSubmoduleContent = (pillarId: string, sectionId: string) => {
    return {
      title: `Contenuto per ${sectionId}`,
      content: [
        {
          type: 'text',
          content: 'Questo è il contenuto dettagliato del modulo. Qui troverai informazioni approfondite, esempi pratici e linee guida specifiche.'
        },
        {
          type: 'list',
          title: 'Punti chiave:',
          items: [
            'Concetto fondamentale 1',
            'Applicazione pratica 2', 
            'Considerazioni importanti 3'
          ]
        },
        {
          type: 'text',
          content: 'Dopo aver letto e compreso questi contenuti, potrai segnare il modulo come completato.'
        }
      ]
    }
  }

  const content = getSubmoduleContent(pillarId, sectionId)

  return (
    <div className="space-y-6">
      {/* Content sections */}
              {content.content.map((section) => (
        <section key={`content-${sectionId}-${section.type}-${section.content?.slice(0, 20) || section.title?.slice(0, 20) || 'section'}`}>
          {section.type === 'text' && (
            <div className="reading-width">
              <p className="text-enterprise-body reading-line-height reading-paragraph-spacing">
                {section.content}
              </p>
            </div>
          )}
          
          {section.type === 'list' && (
            <div>
              <h4 className="text-enterprise-primary font-semibold mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.items?.map((item) => (
                  <li key={`list-item-${sectionId}-${item.slice(0, 20).replace(/\s+/g, '-')}`} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-enterprise-body reading-line-height">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}

      {/* Completion section */}
      <section className="border-t border-enterprise-soft pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-enterprise-primary font-semibold mb-1">
              Completamento modulo
            </h4>
            <p className="text-enterprise-secondary text-sm">
              {isCompleted ? 'Modulo completato' : 'Segna come completato quando hai finito di leggere'}
            </p>
          </div>
          <button
            onClick={onComplete}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isCompleted
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {isCompleted ? 'Completato ✓' : 'Segna completato'}
          </button>
        </div>
      </section>
    </div>
  )
}