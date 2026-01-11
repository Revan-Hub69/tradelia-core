/**
 * Emergency Pillars - Tradelia 2026
 * 
 * 4 pilastri interattivi con animazioni CSS moderne e SVG espandibili
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
  color: string
  bgColor: string
  borderColor: string
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
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'analysis',
      title: t('analysis.title'),
      subtitle: t('analysis.subtitle'),
      description: t('analysis.description'),
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'errors',
      title: t('errors.title'),
      subtitle: t('errors.subtitle'),
      description: t('errors.description'),
      icon: AlertTriangleIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 'demo',
      title: t('demo.title'),
      subtitle: t('demo.subtitle'),
      description: t('demo.description'),
      icon: PlayIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ]

  const handlePillarClick = (pillarId: string) => {
    setExpandedPillar(expandedPillar === pillarId ? null : pillarId)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Desktop Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon
          const isExpanded = expandedPillar === pillar.id
          
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
                h-full border-2 rounded-xl p-6
                transition-all duration-300 ease-out
                ${pillar.borderColor} ${pillar.bgColor}
                hover:shadow-lg hover:shadow-primary/10
                ${isExpanded ? 'shadow-xl' : 'shadow-sm'}
              `}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className={`
                      w-12 h-12 rounded-lg ${pillar.bgColor} 
                      flex items-center justify-center mb-4
                      group-hover:scale-110 transition-transform duration-200
                    `}>
                      <Icon className={`w-6 h-6 ${pillar.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1 leading-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {pillar.subtitle}
                    </p>
                  </div>
                  
                  {/* Expand/Collapse Button */}
                  <button
                    className={`
                      w-8 h-8 rounded-full border-2 ${pillar.borderColor}
                      flex items-center justify-center
                      hover:bg-white transition-colors
                      focus:outline-none focus:ring-2 focus:ring-primary/50
                    `}
                    aria-label={isExpanded ? t('collapse') : t('expand')}
                  >
                    {isExpanded ? (
                      <MinimizeIcon className={`w-4 h-4 ${pillar.color}`} />
                    ) : (
                      <ExpandIcon className={`w-4 h-4 ${pillar.color}`} />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className={`
                  overflow-hidden transition-all duration-300 ease-out
                  ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  {isExpanded && (
                    <div className="pt-4 border-t border-current/10">
                      <p className="text-base text-foreground leading-relaxed mb-6">
                        {pillar.description}
                      </p>
                      
                      {/* Action Button */}
                      <button
                        className={`
                          w-full py-3 px-4 rounded-lg font-medium
                          ${pillar.color} ${pillar.bgColor} border-2 ${pillar.borderColor}
                          hover:bg-white transition-colors
                          focus:outline-none focus:ring-2 focus:ring-primary/50
                        `}
                        onClick={(e) => {
                          e.stopPropagation()
                          // Navigate to pillar content
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
                      w-16 h-16 mx-auto rounded-full ${pillar.bgColor} 
                      flex items-center justify-center mb-4
                      group-hover:scale-110 transition-transform duration-200
                    `}>
                      <ExpandIcon className={`w-6 h-6 ${pillar.color}`} />
                    </div>
                    <p className="text-sm text-muted-foreground">
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
                border-2 rounded-xl p-4 sm:p-6
                transition-all duration-300 ease-out
                ${pillar.borderColor} ${pillar.bgColor}
                ${isExpanded ? 'shadow-lg' : 'shadow-sm'}
              `}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${pillar.bgColor} 
                      flex items-center justify-center
                    `}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${pillar.color}`} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    className={`
                      w-8 h-8 rounded-full border-2 ${pillar.borderColor}
                      flex items-center justify-center
                      hover:bg-white transition-colors
                      focus:outline-none focus:ring-2 focus:ring-primary/50
                    `}
                    aria-label={isExpanded ? t('collapse') : t('expand')}
                  >
                    {isExpanded ? (
                      <MinimizeIcon className={`w-4 h-4 ${pillar.color}`} />
                    ) : (
                      <ExpandIcon className={`w-4 h-4 ${pillar.color}`} />
                    )}
                  </button>
                </div>

                {/* Expandable Content */}
                <div className={`
                  overflow-hidden transition-all duration-300 ease-out
                  ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  {isExpanded && (
                    <div className="pt-4 border-t border-current/10">
                      <p className="text-sm sm:text-base text-foreground leading-relaxed mb-4">
                        {pillar.description}
                      </p>
                      
                      <button
                        className={`
                          w-full py-3 px-4 rounded-lg font-medium text-sm sm:text-base
                          ${pillar.color} ${pillar.bgColor} border-2 ${pillar.borderColor}
                          hover:bg-white transition-colors
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