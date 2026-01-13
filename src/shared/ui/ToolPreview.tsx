/**
 * ToolPreview - Ultra-Chicca 2026
 * 
 * Graceful Tool Degradation
 * - Preview mode for unavailable tools
 * - Feature expectations, launch timeline
 * - Interest tracking for prioritization
 * - Zero UI holes, always something to show
 */

'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { 
  CogIcon, 
  CalendarIcon, 
  StarIcon, 
  BellIcon, 
  CheckIcon,
  TrendingUpIcon,
  InfoIcon
} from '@/components/icons/TradeliaIcons'
import { SafeButton } from '@/src/shared/ui/SafeButton'
import { SmartEmptyState } from './SmartEmptyState'

export interface ToolPreviewProps {
  toolId: string
  title: string
  description: string
  expectedFeatures: string[]
  estimatedLaunch?: string
  complexity?: 'simple' | 'intermediate' | 'advanced'
  category?: string
  onShowInterest?: (toolId: string) => void
  onNotifyMe?: (toolId: string) => void
  className?: string
}

export function ToolPreview({
  toolId,
  title,
  description,
  expectedFeatures,
  estimatedLaunch,
  complexity = 'intermediate',
  category,
  onShowInterest,
  onNotifyMe,
  className = ''
}: ToolPreviewProps) {
  const t = useTranslations('common.toolPreview')
  const [hasShownInterest, setHasShownInterest] = useState(() => {
    if (typeof window === 'undefined') return false
    const interests = localStorage.getItem('tradelia-tool-interests')
    if (interests) {
      try {
        const parsed = JSON.parse(interests)
        return parsed.includes(toolId)
      } catch {
        return false
      }
    }
    return false
  })

  const [isNotifying, setIsNotifying] = useState(() => {
    if (typeof window === 'undefined') return false
    const notifications = localStorage.getItem('tradelia-tool-notifications')
    if (notifications) {
      try {
        const parsed = JSON.parse(notifications)
        return parsed.includes(toolId)
      } catch {
        return false
      }
    }
    return false
  })

  const complexityConfig = {
    simple: {
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: t('complexity.simple')
    },
    intermediate: {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: t('complexity.intermediate')
    },
    advanced: {
      color: 'text-error',
      bgColor: 'bg-error/10',
      label: t('complexity.advanced')
    }
  }

  const config = complexityConfig[complexity]

  const handleShowInterest = useCallback(() => {
    if (hasShownInterest) return

    setHasShownInterest(true)
    
    // Save to localStorage
    try {
      const interests = localStorage.getItem('tradelia-tool-interests')
      const parsed = interests ? JSON.parse(interests) : []
      if (!parsed.includes(toolId)) {
        parsed.push(toolId)
        localStorage.setItem('tradelia-tool-interests', JSON.stringify(parsed))
      }
    } catch (error) {
      console.warn('Failed to save tool interest:', error)
    }

    // Track analytics
    if (typeof window !== 'undefined' && 'trackEvent' in window && typeof (window as Window & { trackEvent?: (event: { event: string; properties: Record<string, string | undefined> }) => void }).trackEvent === 'function') {
      (window as Window & { trackEvent: (event: { event: string; properties: Record<string, string | undefined> }) => void }).trackEvent({
        event: 'tool_interest_shown',
        properties: { toolId, title, category }
      })
    }

    onShowInterest?.(toolId)
  }, [toolId, title, category, hasShownInterest, onShowInterest])

  const handleNotifyMe = useCallback(() => {
    if (isNotifying) return

    setIsNotifying(true)
    
    // Save to localStorage
    try {
      const notifications = localStorage.getItem('tradelia-tool-notifications')
      const parsed = notifications ? JSON.parse(notifications) : []
      if (!parsed.includes(toolId)) {
        parsed.push(toolId)
        localStorage.setItem('tradelia-tool-notifications', JSON.stringify(parsed))
      }
    } catch (error) {
      console.warn('Failed to save notification preference:', error)
    }

    // Track analytics
    if (typeof window !== 'undefined' && 'trackEvent' in window && typeof (window as Window & { trackEvent?: (event: { event: string; properties: Record<string, string | undefined> }) => void }).trackEvent === 'function') {
      (window as Window & { trackEvent: (event: { event: string; properties: Record<string, string | undefined> }) => void }).trackEvent({
        event: 'tool_notification_requested',
        properties: { toolId, title, category }
      })
    }

    onNotifyMe?.(toolId)
  }, [toolId, title, category, isNotifying, onNotifyMe])

  return (
    <div className={`p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <CogIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
                  {t('preview')}
                </span>
              </div>
              {category && (
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {category}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Complexity Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`px-2 py-1 ${config.bgColor} ${config.color} text-xs font-medium rounded-full flex items-center gap-1`}>
          <TrendingUpIcon className="w-3 h-3" />
          {config.label}
        </div>
        {estimatedLaunch && (
          <div className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs font-medium rounded-full flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            {estimatedLaunch}
          </div>
        )}
      </div>

      {/* Expected Features */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <InfoIcon className="w-4 h-4 text-primary" />
          {t('expectedFeatures')}
        </h4>
        <ul className="space-y-2">
          {expectedFeatures.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full flex-shrink-0 mt-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Launch Timeline */}
      {estimatedLaunch && (
        <div className="p-3 bg-background/50 border border-border/50 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <h5 className="text-sm font-medium text-foreground">
              {t('launchTimeline')}
            </h5>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('estimatedLaunch', { date: estimatedLaunch })}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <SafeButton
          onClick={handleShowInterest}
          variant="safe"
          size="sm"
          disabled={hasShownInterest}
          className={`
            flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50
            ${hasShownInterest 
              ? 'bg-success/20 text-success cursor-default' 
              : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            {hasShownInterest ? (
              <>
                <CheckIcon className="w-4 h-4" />
                {t('interestShown')}
              </>
            ) : (
              <>
                <StarIcon className="w-4 h-4" />
                {t('showInterest')}
              </>
            )}
          </div>
        </SafeButton>
        
        <SafeButton
          onClick={handleNotifyMe}
          variant="safe"
          size="sm"
          disabled={isNotifying}
          className={`
            px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50
            ${isNotifying
              ? 'text-success bg-success/10 cursor-default'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 active:scale-95'
            }
          `}
        >
          <div className="flex items-center gap-2">
            {isNotifying ? (
              <>
                <CheckIcon className="w-4 h-4" />
                {t('notifying')}
              </>
            ) : (
              <>
                <BellIcon className="w-4 h-4" />
                {t('notifyMe')}
              </>
            )}
          </div>
        </SafeButton>
      </div>

      {/* Interest Confirmation */}
      {hasShownInterest && (
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg animate-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-success">
            {t('thankYouForInterest')}
          </p>
        </div>
      )}
    </div>
  )
}

// Specialized preview components
export function RiskCalculatorPreview(props: Omit<ToolPreviewProps, 'toolId' | 'title' | 'expectedFeatures'>) {
  const t = useTranslations('tools.riskCalculator')
  
  return (
    <ToolPreview
      toolId="risk-calculator"
      title={t('title')}
      expectedFeatures={[
        t('features.portfolioAnalysis'),
        t('features.riskScoring'),
        t('features.diversificationTips'),
        t('features.stressTest')
      ]}
      complexity="intermediate"
      category={t('category')}
      {...props}
    />
  )
}

export function PortfolioAnalyzerPreview(props: Omit<ToolPreviewProps, 'toolId' | 'title' | 'expectedFeatures'>) {
  const t = useTranslations('tools.portfolioAnalyzer')
  
  return (
    <ToolPreview
      toolId="portfolio-analyzer"
      title={t('title')}
      expectedFeatures={[
        t('features.performanceTracking'),
        t('features.allocationAnalysis'),
        t('features.rebalancingSuggestions'),
        t('features.historicalComparison')
      ]}
      complexity="advanced"
      category={t('category')}
      {...props}
    />
  )
}

// Grid container for tool previews
export function ToolPreviewGrid({ 
  previews, 
  className = '' 
}: {
  previews: ToolPreviewProps[]
  className?: string
}) {
  if (previews.length === 0) {
    return (
      <SmartEmptyState
        icon={<CogIcon className="w-8 h-8 text-muted-foreground" />}
        title="Nessun tool in anteprima"
        description="Non ci sono ancora tool in anteprima per questa sezione. Stiamo lavorando per portarti nuovi strumenti."
        action={{
          label: "Esplora altri journey",
          onClick: () => {
            window.location.href = '/dashboard'
          }
        }}
        hint="I tool per questa sezione saranno disponibili presto."
      />
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {previews.map((preview) => (
        <ToolPreview key={preview.toolId} {...preview} />
      ))}
    </div>
  )
}