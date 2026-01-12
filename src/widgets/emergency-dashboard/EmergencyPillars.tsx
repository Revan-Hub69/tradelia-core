/**
 * Emergency Pillars - Tradelia 2026
 * 
 * 4 pilastri in griglia 2x2 con espansione fullscreen cinematografica
 * Best Practices 2026: Transizioni lente, visibili, professionali
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { 
  BookOpenIcon, 
  ChartBarIcon, 
  AlertTriangleIcon, 
  PlayIcon,
  CloseIcon
} from '@/components/icons/TradeliaIcons'

interface Pillar {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  semanticType: 'primary' | 'success' | 'warning' | 'error'
}

export function EmergencyPillars() {
  const t = useTranslations('emergencyDashboard.pillars')
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null)
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle')
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const pillars: Pillar[] = [
    {
      id: 'academic',
      title: t('academic.title'),
      subtitle: t('academic.subtitle'),
      description: t('academic.description'),
      icon: BookOpenIcon,
      semanticType: 'primary'
    },
    {
      id: 'analysis',
      title: t('analysis.title'),
      subtitle: t('analysis.subtitle'),
      description: t('analysis.description'),
      icon: ChartBarIcon,
      semanticType: 'success'
    },
    {
      id: 'errors',
      title: t('errors.title'),
      subtitle: t('errors.subtitle'),
      description: t('errors.description'),
      icon: AlertTriangleIcon,
      semanticType: 'warning'
    },
    {
      id: 'demo',
      title: t('demo.title'),
      subtitle: t('demo.subtitle'),
      description: t('demo.description'),
      icon: PlayIcon,
      semanticType: 'error'
    }
  ]

  const handleExpand = useCallback((pillarId: string, _e: React.MouseEvent) => {
    const card = cardRefs.current[pillarId]
    if (card) {
      const rect = card.getBoundingClientRect()
      setClickPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      })
    }
    
    setAnimationPhase('opening')
    setExpandedPillar(pillarId)
    document.body.style.overflow = 'hidden'
    
    // Transition to fully open after animation
    setTimeout(() => setAnimationPhase('open'), 800)
  }, [])

  const handleClose = useCallback(() => {
    setAnimationPhase('closing')
    
    setTimeout(() => {
      setExpandedPillar(null)
      setAnimationPhase('idle')
      document.body.style.overflow = ''
    }, 600)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedPillar && animationPhase === 'open') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [expandedPillar, animationPhase, handleClose])

  const getSemanticColors = (type: string) => {
    const colors = {
      primary: { 
        text: 'text-primary', 
        bg: 'bg-primary', 
        bgLight: 'bg-primary/10',
        border: 'border-primary/40',
        gradient: 'from-primary/30 via-primary/10 to-transparent',
        glow: 'shadow-primary/20'
      },
      success: { 
        text: 'text-success', 
        bg: 'bg-success', 
        bgLight: 'bg-success/10',
        border: 'border-success/40',
        gradient: 'from-success/30 via-success/10 to-transparent',
        glow: 'shadow-success/20'
      },
      warning: { 
        text: 'text-warning', 
        bg: 'bg-warning', 
        bgLight: 'bg-warning/10',
        border: 'border-warning/40',
        gradient: 'from-warning/30 via-warning/10 to-transparent',
        glow: 'shadow-warning/20'
      },
      error: { 
        text: 'text-error', 
        bg: 'bg-error', 
        bgLight: 'bg-error/10',
        border: 'border-error/40',
        gradient: 'from-error/30 via-error/10 to-transparent',
        glow: 'shadow-error/20'
      }
    }
    return colors[type as keyof typeof colors] || colors.primary
  }

  const expandedData = pillars.find(p => p.id === expandedPillar)
  const expandedColors = expandedData ? getSemanticColors(expandedData.semanticType) : null

  return (
    <>
      {/* 2x2 Grid - Always 2 columns */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-2 sm:px-0">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon
          const colors = getSemanticColors(pillar.semanticType)
          
          return (
            <button
              key={pillar.id}
              ref={(el) => { cardRefs.current[pillar.id] = el }}
              onClick={(e) => handleExpand(pillar.id, e)}
              disabled={animationPhase !== 'idle'}
              className={`
                group relative overflow-hidden
                aspect-[4/3] sm:aspect-[3/2]
                bg-background border ${colors.border}
                rounded-xl sm:rounded-2xl md:rounded-3xl
                p-3 sm:p-5 md:p-8
                text-left
                transition-all duration-500 ease-out
                hover:scale-[1.03] hover:-translate-y-1
                hover:shadow-2xl ${colors.glow}
                hover:border-opacity-80
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
                active:scale-[0.98] active:duration-150
                disabled:pointer-events-none
              `}
              style={{
                transitionDelay: `${index * 50}ms`
              }}
              aria-label={`${pillar.title} - Clicca per espandere`}
            >
              {/* Ambient Glow */}
              <div className={`
                absolute -inset-1 bg-gradient-to-br ${colors.gradient}
                rounded-xl sm:rounded-2xl md:rounded-3xl
                opacity-0 group-hover:opacity-100
                transition-opacity duration-700 ease-out
                blur-xl -z-10
              `} />

              {/* Content Container */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Icon */}
                <div className={`
                  w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16
                  rounded-lg sm:rounded-xl md:rounded-2xl
                  ${colors.bgLight}
                  flex items-center justify-center
                  mb-2 sm:mb-3 md:mb-5
                  group-hover:scale-110 group-hover:rotate-6
                  transition-transform duration-500 ease-out
                  shadow-lg ${colors.glow}
                `}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ${colors.text}`} />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-h-0">
                  <h3 className="text-sm sm:text-base md:text-xl font-bold text-foreground mb-0.5 sm:mb-1 leading-tight line-clamp-2">
                    {pillar.title}
                  </h3>
                  <p className={`text-[10px] sm:text-xs md:text-sm font-semibold ${colors.text} uppercase tracking-wider mb-1 sm:mb-2`}>
                    {pillar.subtitle}
                  </p>
                  <p className="hidden sm:block text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Expand Hint */}
                <div className={`
                  mt-auto pt-2 sm:pt-3
                  flex items-center gap-1 sm:gap-2
                  text-[10px] sm:text-xs md:text-sm font-medium ${colors.text}
                  opacity-50 group-hover:opacity-100
                  transition-all duration-500
                `}>
                  <span className="hidden sm:inline">{t('clickToExpand')}</span>
                  <span className="sm:hidden">Espandi</span>
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Corner Decoration */}
              <div className={`
                absolute -bottom-12 -right-12 w-32 h-32 sm:w-40 sm:h-40
                rounded-full ${colors.bgLight}
                opacity-20 group-hover:opacity-40 group-hover:scale-150
                transition-all duration-700 ease-out
                blur-2xl
              `} />
            </button>
          )
        })}
      </div>

      {/* Fullscreen Expanded View */}
      {expandedPillar && expandedData && expandedColors && (
        <div 
          className="fixed inset-0 z-[100]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="expanded-pillar-title"
        >
          {/* Backdrop - Slow fade */}
          <button
            className={`
              absolute inset-0 cursor-default
              bg-black/90 backdrop-blur-xl
              transition-opacity ease-out
              ${animationPhase === 'opening' ? 'duration-700 opacity-100' : ''}
              ${animationPhase === 'open' ? 'opacity-100' : ''}
              ${animationPhase === 'closing' ? 'duration-500 opacity-0' : ''}
              ${animationPhase === 'idle' ? 'opacity-0' : ''}
            `}
            onClick={animationPhase === 'open' ? handleClose : undefined}
            aria-label="Chiudi"
            disabled={animationPhase !== 'open'}
          />
          
          {/* Expanding Circle Effect */}
          <div 
            className={`
              absolute rounded-full ${expandedColors.bg}
              transition-all ease-out
              ${animationPhase === 'opening' ? 'duration-700 scale-[50] opacity-10' : ''}
              ${animationPhase === 'open' ? 'scale-[50] opacity-5' : ''}
              ${animationPhase === 'closing' ? 'duration-500 scale-0 opacity-0' : ''}
              ${animationPhase === 'idle' ? 'scale-0 opacity-0' : ''}
            `}
            style={{
              left: clickPosition.x,
              top: clickPosition.y,
              width: 100,
              height: 100,
              marginLeft: -50,
              marginTop: -50,
            }}
          />

          {/* Content Panel */}
          <div 
            className={`
              absolute inset-2 sm:inset-4 md:inset-8 lg:inset-12
              bg-background rounded-2xl sm:rounded-3xl
              overflow-hidden
              shadow-2xl
              transition-all ease-out
              ${animationPhase === 'opening' ? 'duration-700 opacity-100 scale-100 translate-y-0' : ''}
              ${animationPhase === 'open' ? 'opacity-100 scale-100 translate-y-0' : ''}
              ${animationPhase === 'closing' ? 'duration-500 opacity-0 scale-95 translate-y-8' : ''}
              ${animationPhase === 'idle' ? 'opacity-0 scale-90 translate-y-16' : ''}
            `}
          >
            {/* Gradient Header */}
            <div className={`
              relative h-40 sm:h-52 md:h-64
              bg-gradient-to-br ${expandedColors.gradient}
              overflow-hidden
            `}>
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className={`absolute top-0 left-0 w-96 h-96 ${expandedColors.bgLight} rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2`} />
                <div className={`absolute bottom-0 right-0 w-96 h-96 ${expandedColors.bgLight} rounded-full blur-3xl translate-x-1/2 translate-y-1/2`} />
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                disabled={animationPhase !== 'open'}
                className={`
                  absolute top-3 right-3 sm:top-5 sm:right-5 md:top-6 md:right-6
                  w-10 h-10 sm:w-12 sm:h-12
                  rounded-full bg-background/95 backdrop-blur-sm
                  border border-border/50
                  flex items-center justify-center
                  hover:bg-background hover:scale-110 hover:rotate-90
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                  shadow-xl
                  ${animationPhase === 'open' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
                  transition-all duration-500 delay-300
                `}
                aria-label="Chiudi"
              >
                <CloseIcon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              </button>

              {/* Header Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10">
                <div className="flex items-end gap-4 sm:gap-6">
                  {/* Icon */}
                  <div 
                    className={`
                      w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                      rounded-xl sm:rounded-2xl
                      ${expandedColors.bgLight} border ${expandedColors.border}
                      flex items-center justify-center
                      shadow-2xl ${expandedColors.glow}
                      ${animationPhase === 'open' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                      transition-all duration-700 delay-200
                    `}
                  >
                    <expandedData.icon className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${expandedColors.text}`} />
                  </div>
                  
                  {/* Title */}
                  <div 
                    className={`
                      flex-1
                      ${animationPhase === 'open' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
                      transition-all duration-700 delay-300
                    `}
                  >
                    <p className={`text-xs sm:text-sm font-semibold ${expandedColors.text} uppercase tracking-wider mb-1 sm:mb-2`}>
                      {expandedData.subtitle}
                    </p>
                    <h2 
                      id="expanded-pillar-title" 
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
                    >
                      {expandedData.title}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="h-[calc(100%-10rem)] sm:h-[calc(100%-13rem)] md:h-[calc(100%-16rem)] overflow-y-auto">
              <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto">
                {/* Description */}
                <p 
                  className={`
                    text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-12
                    ${animationPhase === 'open' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                    transition-all duration-700 delay-400
                  `}
                >
                  {expandedData.description}
                </p>

                {/* Content Sections */}
                <div className="space-y-4 sm:space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className={`
                        p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl
                        bg-muted/20 border border-border/30
                        ${animationPhase === 'open' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                        transition-all duration-700
                      `}
                      style={{ transitionDelay: `${400 + i * 150}ms` }}
                    >
                      <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                        {t('sectionTitle')} {i}
                      </h4>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {t('sectionContent')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div 
                  className={`
                    mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/30
                    ${animationPhase === 'open' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                    transition-all duration-700 delay-[850ms]
                  `}
                >
                  <button
                    onClick={() => console.log(`Start ${expandedData.id}`)}
                    className={`
                      w-full sm:w-auto
                      px-6 sm:px-10 py-3 sm:py-4
                      rounded-xl sm:rounded-2xl
                      font-semibold text-base sm:text-lg
                      ${expandedColors.bg} text-white
                      hover:scale-105 hover:shadow-2xl ${expandedColors.glow}
                      active:scale-95
                      transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
                    `}
                  >
                    {t('startPillar')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}