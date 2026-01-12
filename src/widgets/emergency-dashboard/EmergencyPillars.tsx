/**
 * Emergency Pillars - Tradelia 2026
 *
 * Design unificato con JourneyCard + PremiumDrawer
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { JourneyCard } from '@/src/shared/ui/JourneyCard'
import { PremiumDrawer } from '@/src/shared/ui/PremiumDrawer'

interface Pillar {
  id: string
  title: string
  subtitle: string
  description: string
  iconType: 'book' | 'chart' | 'alert' | 'play'
  accentColor: 'primary' | 'success' | 'warning' | 'error'
}

export function EmergencyPillars() {
  const t = useTranslations('emergencyDashboard.pillars')
  const [activePillar, setActivePillar] = useState<string | null>(null)

  const pillars: Pillar[] = [
    {
      id: 'academic',
      title: t('academic.title'),
      subtitle: t('academic.subtitle'),
      description: t('academic.description'),
      iconType: 'book',
      accentColor: 'primary'
    },
    {
      id: 'analysis',
      title: t('analysis.title'),
      subtitle: t('analysis.subtitle'),
      description: t('analysis.description'),
      iconType: 'chart',
      accentColor: 'success'
    },
    {
      id: 'errors',
      title: t('errors.title'),
      subtitle: t('errors.subtitle'),
      description: t('errors.description'),
      iconType: 'alert',
      accentColor: 'warning'
    },
    {
      id: 'demo',
      title: t('demo.title'),
      subtitle: t('demo.subtitle'),
      description: t('demo.description'),
      iconType: 'play',
      accentColor: 'error'
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
            subtitle={pillar.subtitle}
            icon={<PillarIcon type={pillar.iconType} className="w-6 h-6" />}
            accentColor={pillar.accentColor}
            onClick={() => setActivePillar(pillar.id)}
          />
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
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${activeData.accentColor === 'primary' ? 'text-primary' : activeData.accentColor === 'success' ? 'text-emerald-600' : activeData.accentColor === 'warning' ? 'text-amber-600' : 'text-red-600'}`}>
                  {activeData.subtitle}
                </p>
                <h2 className="text-lg font-semibold text-foreground">
                  {activeData.title}
                </h2>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {activeData.description}
            </p>
            
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/30">
                  <h4 className="text-sm font-medium text-foreground mb-1.5">
                    {t('sectionTitle')} {i}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('sectionContent')}
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
