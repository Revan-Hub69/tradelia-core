/**
 * Emergency Pillars - Tradelia 2026
 * 
 * Design premium: professionale, elegante, innovativo
 * Griglia 2x2 con drawer unificato
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
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

  const getAccentClasses = (color: string) => ({
    primary: { 
      border: 'border-l-primary', 
      text: 'text-primary', 
      bg: 'bg-primary/5',
      hover: 'hover:border-primary/30 hover:shadow-primary/5'
    },
    success: { 
      border: 'border-l-emerald-500', 
      text: 'text-emerald-600 dark:text-emerald-400', 
      bg: 'bg-emerald-500/5',
      hover: 'hover:border-emerald-500/30 hover:shadow-emerald-500/5'
    },
    warning: { 
      border: 'border-l-amber-500', 
      text: 'text-amber-600 dark:text-amber-400', 
      bg: 'bg-amber-500/5',
      hover: 'hover:border-amber-500/30 hover:shadow-amber-500/5'
    },
    error: { 
      border: 'border-l-red-500', 
      text: 'text-red-600 dark:text-red-400', 
      bg: 'bg-red-500/5',
      hover: 'hover:border-red-500/30 hover:shadow-red-500/5'
    }
  }[color] || { border: 'border-l-primary', text: 'text-primary', bg: 'bg-primary/5', hover: '' })

  return (
    <>
      {/* Grid 2x2 - Design premium */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
        {pillars.map((pillar) => {
          const accent = getAccentClasses(pillar.accentColor)
          const isActive = activePillar === pillar.id
          
          return (
            <button
              key={pillar.id}
              onClick={(e) => openDrawer(pillar.id, e.currentTarget)}
              className={`
                group relative text-left
                bg-background/80 backdrop-blur-sm
                border border-border/40
                rounded-xl p-5 md:p-6
                transition-all duration-200 ease-out
                ${accent.hover}
                hover:shadow-lg hover:-translate-y-0.5
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
                ${isActive ? 'ring-2 ring-primary/30 shadow-lg' : ''}
              `}
              aria-expanded={isActive}
            >
              {/* Accent line - refined */}
              <div className={`
                absolute left-0 top-5 bottom-5 w-0.5 rounded-full
                ${accent.border.replace('border-l-', 'bg-')}
                opacity-40 group-hover:opacity-80
                transition-opacity duration-200
              `} />
              
              {/* Icon - elegant container */}
              <div className={`
                w-11 h-11 rounded-xl ${accent.bg} 
                border border-current/10
                flex items-center justify-center mb-4
                transition-transform duration-200
                group-hover:scale-105
              `}>
                <PillarIcon type={pillar.iconType} className={`w-5 h-5 ${accent.text}`} />
              </div>

              {/* Content */}
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-1.5 leading-tight">
                {pillar.title}
              </h3>
              <p className={`text-[11px] font-semibold ${accent.text} uppercase tracking-wider mb-2.5`}>
                {pillar.subtitle}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {pillar.description}
              </p>

              {/* Arrow indicator - refined */}
              <div className={`
                absolute bottom-5 right-5 
                w-8 h-8 rounded-lg
                flex items-center justify-center
                bg-muted/0 group-hover:bg-muted/50
                opacity-0 group-hover:opacity-100
                transition-all duration-200
              `}>
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
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
              className={`
                w-full py-3.5 px-4 rounded-xl
                text-sm font-semibold
                bg-gradient-to-r from-primary to-primary/90
                text-white
                shadow-lg shadow-primary/20
                hover:shadow-xl hover:shadow-primary/30
                hover:-translate-y-0.5
                active:translate-y-0
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
              `}
            >
              {t('startPillar')}
            </button>
          }
        >
          <div className="px-6 py-6 space-y-6">
            {/* Description */}
            <p className="text-base text-muted-foreground leading-relaxed">
              {activeData.description}
            </p>

            {/* Content Sections - Premium cards */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <article 
                  key={i}
                  className={`
                    p-5 rounded-xl
                    bg-muted/20 border border-border/30
                    hover:bg-muted/30 hover:border-border/40
                    transition-colors duration-150
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* Section number */}
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{i}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground mb-1.5">
                        {t('sectionTitle')} {i}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('sectionContent')}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Progress indicator */}
            <div className="pt-4 border-t border-border/20">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Progresso</span>
                <span>0%</span>
              </div>
              <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500" />
              </div>
            </div>
          </div>
        </PremiumDrawer>
      )}
    </>
  )
}

// Elegant, lightweight SVG icons - refined strokes
function PillarIcon({ type, className }: { type: string; className?: string }) {
  const icons = {
    book: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8" />
        <path d="M8 11h6" />
      </svg>
    ),
    chart: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 6-6" />
        <circle cx="21" cy="10" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    alert: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9v4" />
        <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none" />
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      </svg>
    ),
    play: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  
  return icons[type as keyof typeof icons] || icons.book
}
