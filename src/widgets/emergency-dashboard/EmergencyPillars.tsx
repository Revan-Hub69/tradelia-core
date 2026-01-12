/**
 * Emergency Pillars - Tradelia 2026
 * 
 * Design raffinato e professionale con drawer laterale
 * Approccio accademico: sostanza > effetti
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
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
    setIsDrawerOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
    document.body.style.overflow = ''
    
    // Restore focus
    setTimeout(() => {
      triggerRef.current?.focus()
      setActivePillar(null)
    }, 200)
  }, [])

  // ESC to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isDrawerOpen, closeDrawer])

  // Focus trap
  useEffect(() => {
    if (isDrawerOpen && drawerRef.current) {
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstFocusable = focusable[0]
      if (firstFocusable) {
        firstFocusable.focus()
      }
    }
  }, [isDrawerOpen])

  const activeData = pillars.find(p => p.id === activePillar)

  const getAccentClasses = (color: string) => ({
    primary: { border: 'border-l-primary', text: 'text-primary', bg: 'bg-primary/5' },
    success: { border: 'border-l-success', text: 'text-success', bg: 'bg-success/5' },
    warning: { border: 'border-l-warning', text: 'text-warning', bg: 'bg-warning/5' },
    error: { border: 'border-l-error', text: 'text-error', bg: 'bg-error/5' }
  }[color] || { border: 'border-l-primary', text: 'text-primary', bg: 'bg-primary/5' })

  return (
    <>
      {/* Grid 2x2 - Design pulito e raffinato */}
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
                bg-background border border-border/60
                rounded-lg p-5 md:p-6
                transition-all duration-200 ease-out
                hover:border-border hover:shadow-sm
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
                ${isActive ? 'ring-2 ring-primary/30' : ''}
              `}
              aria-expanded={isActive}
              aria-controls="pillar-drawer"
            >
              {/* Accent line */}
              <div className={`absolute left-0 top-4 bottom-4 w-0.5 ${accent.border} rounded-full opacity-60 group-hover:opacity-100 transition-opacity`} />
              
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg ${accent.bg} flex items-center justify-center mb-4`}>
                <PillarIcon type={pillar.iconType} className={`w-5 h-5 ${accent.text}`} />
              </div>

              {/* Content */}
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 leading-tight">
                {pillar.title}
              </h3>
              <p className={`text-xs font-medium ${accent.text} uppercase tracking-wide mb-2`}>
                {pillar.subtitle}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {pillar.description}
              </p>

              {/* Arrow indicator */}
              <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-60 transition-opacity">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </button>
          )
        })}
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default transition-opacity duration-200"
            onClick={closeDrawer}
            aria-label="Chiudi"
          />
          
          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            id="pillar-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            className={`
              absolute top-0 right-0 bottom-0
              w-full max-w-lg
              bg-background border-l border-border/50
              shadow-xl
              transform transition-transform duration-200 ease-out
              ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
              overflow-hidden flex flex-col
            `}
          >
            {activeData && (
              <>
                {/* Header */}
                <div className="flex-shrink-0 px-6 py-5 border-b border-border/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${getAccentClasses(activeData.accentColor).bg} flex items-center justify-center`}>
                        <PillarIcon type={activeData.iconType} className={`w-6 h-6 ${getAccentClasses(activeData.accentColor).text}`} />
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${getAccentClasses(activeData.accentColor).text} uppercase tracking-wide mb-0.5`}>
                          {activeData.subtitle}
                        </p>
                        <h2 id="drawer-title" className="text-xl font-semibold text-foreground">
                          {activeData.title}
                        </h2>
                      </div>
                    </div>
                    
                    <button
                      onClick={closeDrawer}
                      className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                      aria-label="Chiudi"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="space-y-6">
                    {/* Description */}
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {activeData.description}
                    </p>

                    {/* Sections */}
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i}
                          className="p-4 rounded-lg bg-muted/30 border border-border/30"
                        >
                          <h4 className="text-sm font-medium text-foreground mb-2">
                            {t('sectionTitle')} {i}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {t('sectionContent')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-border/50 bg-muted/20">
                  <button
                    onClick={() => console.log(`Start ${activeData.id}`)}
                    className={`
                      w-full py-3 px-4 rounded-lg
                      text-sm font-medium
                      ${getAccentClasses(activeData.accentColor).bg}
                      ${getAccentClasses(activeData.accentColor).text}
                      border border-current/20
                      hover:border-current/40
                      transition-colors duration-150
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                    `}
                  >
                    {t('startPillar')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// Elegant, lightweight SVG icons
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
      </svg>
    ),
    alert: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
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