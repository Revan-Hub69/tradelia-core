/**
 * FeatureGate - Ultra-Chicca 2026
 * 
 * Feature Gate Component
 * - Graceful degradation for disabled features
 * - Fallback components for better UX
 * - Loading states during flag resolution
 */

'use client'

import { useFeatureFlag, useFeatureFlags, type FeatureFlags } from '@/src/shared/lib/featureFlags'
import { useTranslations } from 'next-intl'
import { SafeButton } from '@/src/shared/ui/SafeButton'
import { InfoIcon, SettingsIcon } from '@/components/icons/TradeliaIcons'

interface FeatureGateProps {
  feature: keyof FeatureFlags
  fallback?: React.ReactNode
  loadingFallback?: React.ReactNode
  children: React.ReactNode
  showReason?: boolean
}

export function FeatureGate({ 
  feature, 
  fallback, 
  loadingFallback,
  children,
  showReason = false
}: FeatureGateProps) {
  const { isLoading } = useFeatureFlags()
  const isEnabled = useFeatureFlag(feature)
  const t = useTranslations('common.featureGate')

  // Show loading state while flags are being resolved
  if (isLoading) {
    return loadingFallback || (
      <div className="p-4 bg-muted/30 border border-border/50 rounded-lg animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-muted rounded" />
          <div className="h-4 bg-muted rounded flex-1 max-w-48" />
        </div>
      </div>
    )
  }

  // Feature is enabled, render children
  if (isEnabled) {
    return <>{children}</>
  }

  // Feature is disabled, show fallback
  return fallback || (
    <DisabledFeatureFallback 
      feature={feature} 
      showReason={showReason}
    />
  )
}

// Default fallback component for disabled features
function DisabledFeatureFallback({ 
  feature, 
  showReason 
}: { 
  feature: keyof FeatureFlags
  showReason: boolean 
}) {
  const t = useTranslations('common.featureGate')

  const featureLabels: Record<keyof FeatureFlags, string> = {
    animations: t('features.animations'),
    complexAnimations: t('features.complexAnimations'),
    autoplay: t('features.autoplay'),
    riskCalculator: t('features.riskCalculator'),
    portfolioAnalyzer: t('features.portfolioAnalyzer'),
    advancedCharts: t('features.advancedCharts'),
    aiFeatures: t('features.aiFeatures'),
    tooltips: t('features.tooltips'),
    notifications: t('features.notifications'),
    soundEffects: t('features.soundEffects'),
    hapticFeedback: t('features.hapticFeedback'),
    lazyLoading: t('features.lazyLoading'),
    imageOptimization: t('features.imageOptimization'),
    prefetching: t('features.prefetching'),
    betaFeatures: t('features.betaFeatures'),
    debugMode: t('features.debugMode')
  }

  return (
    <div className="p-4 bg-muted/30 border border-border/50 rounded-lg">
      <div className="flex items-start gap-3">
        <InfoIcon className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-foreground mb-1">
            {t('temporarilyUnavailable')}
          </h4>
          <p className="text-sm text-muted-foreground">
            {showReason ? (
              t('featureDisabledReason', { feature: featureLabels[feature] || feature })
            ) : (
              t('featureDisabled')
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

// Specialized feature gates for common use cases
export function ToolGate({ 
  toolId, 
  children, 
  fallback 
}: { 
  toolId: string
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  const t = useTranslations('common.featureGate')
  
  // Map tool IDs to feature flags
  const toolFeatureMap: Record<string, keyof FeatureFlags> = {
    'risk-calculator': 'riskCalculator',
    'portfolio-analyzer': 'portfolioAnalyzer',
    'advanced-charts': 'advancedCharts',
    'ai-assistant': 'aiFeatures'
  }

  const feature = toolFeatureMap[toolId]
  
  if (!feature) {
    // Unknown tool, assume it's available
    return <>{children}</>
  }

  return (
    <FeatureGate 
      feature={feature}
      fallback={fallback || <ComingSoonCard toolId={toolId} />}
    >
      {children}
    </FeatureGate>
  )
}

export function AnimationGate({ children }: { children: React.ReactNode }) {
  const animationsEnabled = useFeatureFlag('animations')
  
  if (!animationsEnabled) {
    return null
  }
  
  return <>{children}</>
}

// Coming soon card for disabled tools
function ComingSoonCard({ toolId }: { toolId: string }) {
  const t = useTranslations('common.featureGate')
  
  return (
    <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">
            {t('comingSoon')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('toolComingSoon', { toolId })}
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-medium bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors">
              {t('notifyMe')}
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('learnMore')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Debug component for development
export function FeatureFlagsDebug() {
  const flags = useFeatureFlags()
  
  if (!flags.debugMode) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-background border border-border rounded-lg shadow-lg z-50 max-w-sm">
      <h4 className="font-semibold mb-2">Feature Flags Debug</h4>
      <div className="space-y-1 text-xs">
        {Object.entries(flags).map(([key, value]) => {
          if (key === 'updateFlag' || key === 'resetFlags' || key === 'isLoading') return null
          
          return (
            <div key={key} className="flex justify-between">
              <span className="text-muted-foreground">{key}:</span>
              <span className={value ? 'text-success' : 'text-error'}>
                {value ? '✓' : '✗'}
              </span>
            </div>
          )
        })}
      </div>
      <SafeButton
        variant="destructive"
        onClick={flags.resetFlags}
        className="mt-2 px-2 py-1 text-xs bg-error text-white rounded"
        size="sm"
      >
        Reset All Flags
      </SafeButton>
    </div>
  )
}