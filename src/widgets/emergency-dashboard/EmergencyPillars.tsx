/**
 * Emergency Pillars - Tradelia 2026
 * 
 * Design coerente con DashboardHome journey cards
 * Griglia responsive con drawer premium
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { PremiumDrawer } from '@/src/shared/ui/PremiumDrawer'
import { ArrowRightIcon } from '@/components/icons/TradeliaIcons'

interface Pillar {
  id: string
  title: string
  subtitle: string
  description: string
  iconType: 'book' | 'chart' | 'alert' | 'play'
  accentColor: 'primary' | 'success' | 'warning' | 'error'
}

const PILLAR_COLORS = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-l-primary' },
  success: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-l-emerald-500' },
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-l-amber-500' },
  error: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-l-red-500' }
}

export function EmergencyPillars() {
  const t = useTranslations('emergencyDashboard.pillars')
  const [activePillar, setActivePillar] = useState<string | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

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

  const openDrawer = useCallback((pillarId: string, buttonRef: HTMLButtonElement) => {
    triggerRef.current = buttonRef
    setActivePillar(pillarId)
  }, [])

  const closeDrawer = useCallback(() => {
    setActivePillar(null)
    setTimeout(() => triggerRef.current?.focus(), 200)
  }, [])

  const activeData = pillars.find(p => p.id === activePillar)

  return (
    <>
      {/* Grid - stesso layout di DashboardHome */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pillars.map((pillar) => {
          const colors = PILLAR_COLORS[pillar.accentColor]
          const isActive = activePillar === pillar.id
          
          return (
            <button
              key={pillar.id}
              onClick={(e) => openDrawer(pillar.id, e.currentTarget)}
              className={`
                card-2026 group relative p-6 text-left
                border-l-4 ${colors.border}
                transition-all duration-200
                hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}
              `}
              aria-expanded={isActive}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <PillarIcon type={pillar.iconType} className={`w-6 h-6 ${colors.text}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {pillar.title}
                  </h3>
                  <p className={`text-xs font-medium ${colors.text} uppercase tracking-wider mb-2`}>
                    {pillar.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {pillar.description}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRightIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Premium Drawer */}
      {activePillar && activeData && (
        <PremiumDrawer
          isOpen={true}
          onClose={closeDrawer}
          title={activeData.title}
          subtitle={activeData.subtitle}
          icon={<PillarIcon type={activeData.iconType} className="w-6 h-6" />}
          accentColor={activeData.accentColor}
          size="lg"
          footer={
            <button
              onClick={() => console.log(`Start ${activeData.id}`)}
              className="w-full py-3 px-4 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {t('startPillar')}
            </button>
          }
        >
          <div className="p-6 space-y-6">
            {/* Description */}
            <p className="text-base text-muted-foreground leading-relaxed">
              {activeData.description}
            </p>

            {/* Content Sections */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="p-4 rounded-lg bg-muted/30 border border-border/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{i}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {t('sectionTitle')} {i}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t('sectionContent')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PremiumDrawer>
      )}
    </>
  )
}

// Icons - stroke-based, lightweight
function PillarIcon({ type, className }: { type: string; className?: string }) {
  const icons = {
    book: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8M8 11h6" />
      </svg>
    ),
    chart: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 6-6" />
      </svg>
    ),
    alert: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9v4M12 17h.01" />
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      </svg>
    ),
    play: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  
  return icons[type as keyof typeof icons] || icons.book
}
