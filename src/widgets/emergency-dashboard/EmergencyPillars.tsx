/**
 * Emergency Pillars - Tradelia 2026
 *
 * Design unificato con JourneyCard + PremiumDrawer
 * Struttura identica alle card della home: icon + title + description + completion + focus areas
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { JourneyCard } from '@/src/shared/ui/JourneyCard'
import { PremiumDrawer } from '@/src/shared/ui/PremiumDrawer'

interface Pillar {
  id: string
  title: string
  description: string
  iconType: 'book' | 'chart' | 'alert' | 'play'
  accentColor: 'primary' | 'success' | 'warning' | 'error'
  completion: number // 0-3 pallini pieni
  focusAreas: string[]
}

export function EmergencyPillars() {
  const t = useTranslations('emergencyDashboard.pillars')
  const [activePillar, setActivePillar] = useState<string | null>(null)

  const pillars: Pillar[] = [
    {
      id: 'academic',
      title: t('academic.title'),
      description: t('academic.description'),
      iconType: 'book',
      accentColor: 'primary',
      completion: 0,
      focusAreas: [t('academic.focus1'), t('academic.focus2'), t('academic.focus3')]
    },
    {
      id: 'analysis',
      title: t('analysis.title'),
      description: t('analysis.description'),
      iconType: 'chart',
      accentColor: 'success',
      completion: 0,
      focusAreas: [t('analysis.focus1'), t('analysis.focus2'), t('analysis.focus3')]
    },
    {
      id: 'errors',
      title: t('errors.title'),
      description: t('errors.description'),
      iconType: 'alert',
      accentColor: 'warning',
      completion: 0,
      focusAreas: [t('errors.focus1'), t('errors.focus2'), t('errors.focus3')]
    },
    {
      id: 'demo',
      title: t('demo.title'),
      description: t('demo.description'),
      iconType: 'play',
      accentColor: 'error',
      completion: 0,
      focusAreas: [t('demo.focus1'), t('demo.focus2'), t('demo.focus3')]
    }
  ]

  const activeData = pillars.find(p => p.id === activePillar)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pillars.map((pillar) => (
          <JourneyCard
            key={pillar.id}
            title={pillar.title}
            description={pillar.description}
            icon={<PillarIcon type={pillar.iconType} className="w-6 h-6" />}
            accentColor={pillar.accentColor}
            onClick={() => setActivePillar(pillar.id)}
            badge={<CompletionIndicator completed={pillar.completion} total={3} label={t('completion')} />}
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

      {/* Drawer */}
      {activeData && (
        <PremiumDrawer
          isOpen={!!activePillar}
          onClose={() => setActivePillar(null)}
          accentColor={activeData.accentColor}
          size="full"
          minimalHeader
          showCloseButton={false}
          footer={
            <button
              onClick={() => console.log(`Start ${activeData.id}`)}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Continua
            </button>
          }
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

            <p className="text-sm text-muted-foreground leading-relaxed">
              {activeData.description}
            </p>
            
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/30">
                  <h4 className="text-sm font-medium text-foreground mb-1.5">
                    Sezione {i}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Contenuto dettagliato per questa sezione sarà disponibile a breve.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </PremiumDrawer>
      )}
    </>
  )
}

/** Indicatore completamento: ●●○ */
function CompletionIndicator({ completed, total, label }: { completed: number; total: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full ${i < completed ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}
          />
        ))}
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
