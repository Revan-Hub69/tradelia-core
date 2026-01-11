/**
 * Emergency Pillars - Tradelia 2026
 * 
 * 4 pilastri interattivi con design system Tradelia raffinato
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { 
  BookOpenIcon, 
  ChartBarIcon, 
  AlertTriangleIcon, 
  PlayIcon,
  ExpandIcon,
  MinimizeIcon
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

  const handlePillarClick = (pillarId: string) => {
    setExpandedPillar(expandedPillar === pillarId ? null : pillarId)
  }

  const getSemanticClasses = (type: string) => {
    switch (type) {
      case 'primary':
        return {
          text: 'text-primary',
          bg: 'icon-bg-primary',
          border: 'border-primary/20'
        }
      case 'success':
        return {
          text: 'text-success',
          bg: 'icon-bg-success',
          border: 'border-success/20'
        }
      case 'warning':
        return {
          text: 'text-warning',
          bg: 'icon-bg-warning',
          border: 'border-warning/20'
        }
      case 'error':
        return {
          text: 'text-error',
          bg: 'icon-bg-error',
          border: 'border-error/20'
        }
      default:
        return {
          text: 'text-foreground',
          bg: 'bg-muted/10',
          border: 'border-border'
        }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Desktop Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon
          const isExpanded = expandedPillar === pillar.id
          const semanticClasses = getSemanticClasses(pillar.semanticType)
          
          return (
            <div
              key={pillar.id}
              className={`
                relative cursor-pointer group transition-all duration-300 ease-out
                ${isExpanded ? 'lg:col-span-2' : 'lg:col-span-1'}
                hover:-translate-y-1
              `}
              onClick={() => handlePillarClick(pillar.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handlePillarClick(pillar.id)
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-label={`${pillar.title} - ${isExpanded ? t('collapse') : t('expand')}`}
            >
              <div className={`
                h-full section-frame p-6 transition-all duration-300 ease-out
                ${isExpanded ? 'shadow-lg' : 'shadow-sm'}
                hover:shadow-md
              `}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className={`
                      w-12 h-12 rounded-lg ${semanticClasses.bg}
                      flex items-center justify-center mb-4
                      group-hover:scale-110 transition-transform duration-200
                    `}>
                      <Icon className={`w-6 h-6 ${semanticClasses.text}`} />
                    </div>
                    <h3 className="text-lg font-bold content-primary mb-1 leading-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-sm font-medium content-secondary uppercase tracking-wide">
                      {pillar.subtitle}
                    </p>
                  </div>
                  
                  {/* Expand/Collapse Button */}
                  <button
                    className={`
                      w-8 h-8 rounded-full border ${semanticClasses.border}
                      flex items-center justify-center
                      hover:bg-muted/30 transition-colors
                      focus:outline-none focus:ring-2 focus:ring-primary/50
                    `}
                    aria-label={isExpanded ? t('collapse') : t('expand')}
                  >
                    {isExpanded ? (
                      <MinimizeIcon className={`w-4 h-4 ${semanticClasses.text}`} />
                    ) : (
                      <ExpandIcon className={`w-4 h-4 ${semanticClasses.text}`} />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className={`
                  overflow-hidden transition-all duration-300 ease-out
                  ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  {isExpanded && (
                    <div className="pt-4 section-divider">
                      <p className="text-base content-primary leading-relaxed mb-6">
                        {pillar.description}
                      </p>
                      
                      {/* Action Button */}
                      <button
                        className={`
                          w-full py-3 px-4 rounded-lg font-medium
                          card-2026 hover:shadow-md transition-all duration-150
                          ${semanticClasses.text} border ${semanticClasses.border}
                          focus:outline-none focus:ring-2 focus:ring-primary/50
                        `}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log(`Navigate to ${pillar.id}`)
                        }}
                      >
                        {t('startPillar')}
                      </button>
                    </div>
                  )}
                </div>

                {/* Collapsed State Icon */}
                {!isExpanded && (
                  <div className="text-center">
                    <div className={`
                      w-16 h-16 mx-auto rounded-full ${semanticClasses.bg}
                      flex items-center justify-center mb-4
                      group-hover:scale-110 transition-transform duration-200
                    `}>
                      <ExpandIcon className={`w-6 h-6 ${semanticClasses.text}`} />
                    </div>
                    <p className="text-sm content-tertiary">
                      {t('clickToExpand')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile/Tablet Stacked Layout */}
      <div className="lg:hidden space-y-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon
          const isExpanded = expandedPillar === pillar.id
          const semanticClasses = getSemanticClasses(pillar.semanticType)
          
          return (
            <div
              key={pillar.id}
              className="cursor-pointer active:scale-98 transition-transform duration-150"
              onClick={() => handlePillarClick(pillar.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handlePillarClick(pillar.id)
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-label={`${pillar.title} - ${isExpanded ? t('collapse') : t('expand')}`}
            >
              <div className={`
                section-frame p-4 sm:p-6 transition-all duration-300 ease-out
                ${isExpanded ? 'shadow-lg' : 'shadow-sm'}
              `}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${semanticClasses.bg}
                      flex items-center justify-center
                    `}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${semanticClasses.text}`} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold content-primary leading-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium content-secondary uppercase tracking-wide">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    className={`
                      w-8 h-8 rounded-full border ${semanticClasses.border}
                      flex items-center justify-center
                      hover:bg-muted/30 transition-colors
                      focus:outline-none focus:ring-2 focus:ring-primary/50
                    `}
                    aria-label={isExpanded ? t('collapse') : t('expand')}
                  >
                    {isExpanded ? (
                      <MinimizeIcon className={`w-4 h-4 ${semanticClasses.text}`} />
                    ) : (
                      <ExpandIcon className={`w-4 h-4 ${semanticClasses.text}`} />
                    )}
                  </button>
                </div>

                {/* Expandable Content */}
                <div className={`
                  overflow-hidden transition-all duration-300 ease-out
                  ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  {isExpanded && (
                    <div className="pt-4 section-divider">
                      <p className="text-sm sm:text-base content-primary leading-relaxed mb-4">
                        {pillar.description}
                      </p>
                      
                      <button
                        className={`
                          w-full py-3 px-4 rounded-lg font-medium text-sm sm:text-base
                          card-2026 hover:shadow-md transition-all duration-150
                          ${semanticClasses.text} border ${semanticClasses.border}
                          focus:outline-none focus:ring-2 focus:ring-primary/50
                          min-h-[44px]
                        `}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log(`Navigate to ${pillar.id}`)
                        }}
                      >
                        {t('startPillar')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}