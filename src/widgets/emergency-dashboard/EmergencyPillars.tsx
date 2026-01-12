/**
 * Emergency Pillars - Tradelia 2026
 * 
 * 4 pilastri in griglia 2x2 con espansione fullscreen professionale
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
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
  gradient: string
}

export function EmergencyPillars() {
  const t = useTranslations('emergencyDashboard.pillars')
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const pillars: Pillar[] = [
    {
      id: 'academic',
      title: t('academic.title'),
      subtitle: t('academic.subtitle'),
      description: t('academic.description'),
      icon: BookOpenIcon,
      semanticType: 'primary',
      gradient: 'from-primary/20 via-primary/5 to-transparent'
    },
    {
      id: 'analysis',
      title: t('analysis.title'),
      subtitle: t('analysis.subtitle'),
      description: t('analysis.description'),
      icon: ChartBarIcon,
      semanticType: 'success',
      gradient: 'from-success/20 via-success/5 to-transparent'
    },
    {
      id: 'errors',
      title: t('errors.title'),
      subtitle: t('errors.subtitle'),
      description: t('errors.description'),
      icon: AlertTriangleIcon,
      semanticType: 'warning',
      gradient: 'from-warning/20 via-warning/5 to-transparent'
    },
    {
      id: 'demo',
      title: t('demo.title'),
      subtitle: t('demo.subtitle'),
      description: t('demo.description'),
      icon: PlayIcon,
      semanticType: 'error',
      gradient: 'from-error/20 via-error/5 to-transparent'
    }
  ]

  const handleExpand = useCallback((pillarId: string) => {
    setIsAnimating(true)
    setExpandedPillar(pillarId)
    document.body.style.overflow = 'hidden'
  }, [])

  const handleClose = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setExpandedPillar(null)
      document.body.style.overflow = ''
      setIsAnimating(false)
    }, 300)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedPillar) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [expandedPillar, handleClose])

  // Animation complete
  useEffect(() => {
    if (expandedPillar && isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 400)
      return () => clearTimeout(timer)
    }
  }, [expandedPillar, isAnimating])

  const getSemanticClasses = (type: string) => {
    switch (type) {
      case 'primary':
        return { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30', ring: 'ring-primary/20' }
      case 'success':
        return { text: 'text-success', bg: 'bg-success/10', border: 'border-success/30', ring: 'ring-success/20' }
      case 'warning':
        return { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', ring: 'ring-warning/20' }
      case 'error':
        return { text: 'text-error', bg: 'bg-error/10', border: 'border-error/30', ring: 'ring-error/20' }
      default:
        return { text: 'text-foreground', bg: 'bg-muted/10', border: 'border-border', ring: 'ring-muted/20' }
    }
  }

  const expandedPillarData = pillars.find(p => p.id === expandedPillar)

  return (
    <>
      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon
          const semanticClasses = getSemanticClasses(pillar.semanticType)
          
          return (
            <button
              key={pillar.id}
              onClick={() => handleExpand(pillar.id)}
              className={`
                group relative overflow-hidden
                bg-background/80 backdrop-blur-sm
                border ${semanticClasses.border}
                rounded-2xl p-6 sm:p-8
                text-left transition-all duration-300 ease-out
                hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/10
                hover:border-opacity-60
                focus:outline-none focus:ring-2 ${semanticClasses.ring} focus:ring-offset-2 focus:ring-offset-background
                active:scale-[0.98]
              `}
              style={{
                animationDelay: `${index * 100}ms`
              }}
              aria-label={`${pillar.title} - Clicca per espandere`}
            >
              {/* Gradient Background */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${pillar.gradient}
                opacity-0 group-hover:opacity-100 transition-opacity duration-500
              `} />
              
              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`
                  w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${semanticClasses.bg}
                  flex items-center justify-center mb-5
                  group-hover:scale-110 group-hover:rotate-3
                  transition-all duration-300 ease-out
                  shadow-lg shadow-black/5
                `}>
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${semanticClasses.text}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 leading-tight group-hover:text-foreground/90 transition-colors">
                  {pillar.title}
                </h3>

                {/* Subtitle */}
                <p className={`text-sm font-semibold ${semanticClasses.text} uppercase tracking-wider mb-3`}>
                  {pillar.subtitle}
                </p>

                {/* Preview Text */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {pillar.description}
                </p>

                {/* Expand Indicator */}
                <div className={`
                  mt-5 flex items-center gap-2 text-sm font-medium ${semanticClasses.text}
                  opacity-60 group-hover:opacity-100 transition-opacity
                `}>
                  <span>{t('clickToExpand')}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              {/* Corner Accent */}
              <div className={`
                absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${semanticClasses.bg}
                opacity-30 group-hover:opacity-50 group-hover:scale-150
                transition-all duration-500 ease-out blur-2xl
              `} />
            </button>
          )
        })}
      </div>

      {/* Fullscreen Expanded View */}
      {expandedPillar && expandedPillarData && (
        <div 
          className={`
            fixed inset-0 z-[100] flex items-center justify-center
            ${isAnimating ? 'animate-in fade-in duration-300' : ''}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pillar-title"
        >
          {/* Backdrop */}
          <button 
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-default"
            onClick={handleClose}
            aria-label="Chiudi overlay"
          />
          
          {/* Content Panel */}
          <div 
            className={`
              relative w-full h-full sm:w-[95vw] sm:h-[90vh] sm:max-w-6xl sm:rounded-3xl
              bg-background overflow-hidden
              ${isAnimating && expandedPillar ? 'animate-in zoom-in-95 slide-in-from-bottom-4 duration-400' : ''}
              ${isAnimating && !expandedPillar ? 'animate-out zoom-out-95 slide-out-to-bottom-4 duration-300' : ''}
              shadow-2xl shadow-black/50
            `}
          >
            {/* Gradient Header */}
            <div className={`
              relative h-48 sm:h-64 bg-gradient-to-br ${expandedPillarData.gradient}
              flex items-end p-6 sm:p-10
            `}>
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-background hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg"
                aria-label="Chiudi"
              >
                <CloseIcon className="w-5 h-5 text-foreground" />
              </button>

              {/* Header Content */}
              <div className="flex items-end gap-5">
                <div className={`
                  w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${getSemanticClasses(expandedPillarData.semanticType).bg}
                  flex items-center justify-center shadow-xl
                  animate-in zoom-in-50 duration-500 delay-100
                `}>
                  <expandedPillarData.icon className={`w-10 h-10 sm:w-12 sm:h-12 ${getSemanticClasses(expandedPillarData.semanticType).text}`} />
                </div>
                <div className="animate-in slide-in-from-left-4 duration-500 delay-150">
                  <p className={`text-sm font-semibold ${getSemanticClasses(expandedPillarData.semanticType).text} uppercase tracking-wider mb-1`}>
                    {expandedPillarData.subtitle}
                  </p>
                  <h2 id="pillar-title" className="text-3xl sm:text-4xl font-bold text-foreground">
                    {expandedPillarData.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="h-[calc(100%-12rem)] sm:h-[calc(100%-16rem)] overflow-y-auto p-6 sm:p-10">
              <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                {/* Description */}
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  {expandedPillarData.description}
                </p>

                {/* Content Sections */}
                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="p-6 rounded-xl bg-muted/30 border border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-400"
                      style={{ animationDelay: `${200 + i * 100}ms` }}
                    >
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('sectionTitle')} {i}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {t('sectionContent')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                  <button
                    onClick={() => console.log(`Start ${expandedPillarData.id}`)}
                    className={`
                      w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg
                      ${getSemanticClasses(expandedPillarData.semanticType).bg}
                      ${getSemanticClasses(expandedPillarData.semanticType).text}
                      border-2 ${getSemanticClasses(expandedPillarData.semanticType).border}
                      hover:scale-105 active:scale-95
                      transition-all duration-200
                      focus:outline-none focus:ring-2 ${getSemanticClasses(expandedPillarData.semanticType).ring} focus:ring-offset-2
                      shadow-lg hover:shadow-xl
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