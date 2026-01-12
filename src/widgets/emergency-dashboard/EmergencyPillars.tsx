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
import { PremiumDrawer } from '@/src/shared/ui/PremiumDrawer'
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
  const [activePillar, setActivePillar] = useState<string | null>(null)
  
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

  const activeData = pillarsWithProgress.find(p => p.id === activePillar)
  const activeSections = activeData ? PILLAR_SECTIONS[activeData.id] || [] : []
  const activeProgress = activeData ? getPillarProgress('emergency', activeData.id) : null

  const handleToggleSection = async (sectionId: string) => {
    if (!activeData) return
    
    const isCompleted = activeProgress?.completedSections?.includes(sectionId)
    const totalSections = activeSections.length

    if (isCompleted) {
      await markSectionIncomplete('emergency', activeData.id, sectionId, totalSections)
    } else {
      await markSectionComplete('emergency', activeData.id, sectionId, totalSections)
    }
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
            onClick={() => setActivePillar(pillar.id)}
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

      {/* Drawer - laterale su desktop, full su mobile */}
      {activeData && (
        <PremiumDrawer
          isOpen={!!activePillar}
          onClose={() => setActivePillar(null)}
          accentColor={activeData.accentColor}
          size="xl"
          minimalHeader
          showCloseButton={false}
          footer={activeData.hasCta && activeData.completionPercent === 100 ? (
            <button
              onClick={() => console.log(`Complete ${activeData.id}`)}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Completa pilastro
            </button>
          ) : undefined}
        >
          <div className="px-4 sm:px-6 py-5 space-y-5">
            {/* Title inside content */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${activeData.accentColor === 'primary' ? 'bg-primary/10' : activeData.accentColor === 'success' ? 'bg-emerald-500/10' : activeData.accentColor === 'warning' ? 'bg-amber-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                <PillarIcon type={activeData.iconType} className={`w-5 h-5 ${activeData.accentColor === 'primary' ? 'text-primary' : activeData.accentColor === 'success' ? 'text-emerald-600' : activeData.accentColor === 'warning' ? 'text-amber-600' : 'text-red-600'}`} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {activeData.title}
              </h2>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <span className="text-xs text-muted-foreground">{t('completion')}:</span>
              <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${activeData.completionPercent}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{activeData.completionPercent}%</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {activeData.description}
            </p>
            
            {/* Sezioni del pillar - con checkbox interattive */}
            <div className="space-y-3">
              {activeSections.map((section, index) => {
                const isCompleted = activeProgress?.completedSections?.includes(section.id)
                return (
                  <button
                    key={section.id}
                    onClick={() => handleToggleSection(section.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-muted/30 border-border/30 hover:border-border/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isCompleted 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-muted-foreground/30'
                        }`}>
                          {isCompleted && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <h4 className={`text-sm font-medium ${isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                          {index + 1}. {section.titleKey}
                        </h4>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        isCompleted 
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-muted/50 text-muted-foreground'
                      }`}>
                        {isCompleted ? 'Completato' : 'Da completare'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-9">
                      Contenuto educativo per questa sezione. Clicca per segnare come completato.
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
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
