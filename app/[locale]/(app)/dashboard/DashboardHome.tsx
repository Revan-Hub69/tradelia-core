/**
 * Dashboard Home - Tradelia 2026
 * 
 * Hub centrale che mostra i 4 journey con KPI riassuntivi.
 * Ordinati per complessità cognitiva crescente con indicatori.
 */

'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { FeatureGate } from '@/src/shared/ui/FeatureGate'
import { ComplexityIndicator } from '@/src/shared/ui/ComplexityIndicator'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { JOURNEY_ORDER, JOURNEYS, type JourneyId } from '@/src/shared/config/journeys'
import { useAnalyticsTracking } from '@/components/AnalyticsProvider'
import {
  ShieldIcon,
  TrendingUpIcon,
  BoltIcon,
  RefreshIcon,
  ArrowRightIcon
} from '@/components/icons/TradeliaIcons'

const JOURNEY_ICONS: Record<JourneyId, React.ComponentType<{ className?: string }>> = {
  emergency: ShieldIcon,
  longterm: TrendingUpIcon,
  speculation: BoltIcon,
  passive: RefreshIcon
}

const JOURNEY_COLORS: Record<JourneyId, { bg: string; text: string; border: string; borderLeft: string }> = {
  emergency: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', borderLeft: 'border-l-warning' },
  passive: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/20', borderLeft: 'border-l-info' },
  longterm: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', borderLeft: 'border-l-success' },
  speculation: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', borderLeft: 'border-l-primary' }
}

export function DashboardHome() {
  const locale = useLocale()
  const t = useTranslations()
  const tDashboard = useTranslations('dashboard')
  const { state } = useDashboardAuth()
  const { trackUserAction } = useAnalyticsTracking()
  
  const userName = state.profile?.full_name || tDashboard('guestUser')

  const handleJourneyClick = (journeyId: string) => {
    trackUserAction('journey_click', {
      journey_id: journeyId,
      section: 'dashboard_home'
    })
  }

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Header - Section Frame */}
          <div className="section-frame p-6 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold content-primary">
              {tDashboard('welcome')}, {userName}
            </h1>
            <p className="content-secondary">
              {tDashboard('chooseOrientation')}
            </p>
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>{tDashboard('noImmediateAction')}</strong> {tDashboard('understandFirst')}
              </p>
            </div>
          </div>

          {/* Journey Cards Grid - Section Frame */}
          <div className="section-frame p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold content-primary mb-2">{tDashboard('tradeliaJourneys')}</h2>
              <p className="text-sm content-secondary">
                {tDashboard('journeyExplanation')}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {JOURNEY_ORDER.map((journeyId) => {
                const journey = JOURNEYS[journeyId]
                const Icon = JOURNEY_ICONS[journeyId]
                const colors = JOURNEY_COLORS[journeyId]
                
                return (
                  <Link
                    key={journeyId}
                    href={`/${locale}/dashboard/${journeyId}`}
                    onClick={() => handleJourneyClick(journeyId)}
                    className={`
                      card-2026 group relative p-6 transition-all duration-200
                      border-l-4 ${colors.borderLeft}
                      hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    `}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold content-primary mb-1">
                          {t(journey.labelKey)}
                        </h3>
                        <p className="text-sm content-secondary line-clamp-2 mb-3">
                          {t(`journeys.${journeyId}.description`)}
                        </p>
                        
                        {/* Complexity Indicator */}
                        <ComplexityIndicator 
                          level={journey.complexity}
                          size="sm"
                          showTooltip={false}
                          className="mb-2"
                        />
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    {/* Focus Areas */}
                    <div className="section-divider">
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {tDashboard('focusOn')}:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {getFocusAreas(journeyId, tDashboard).map((area, index) => (
                            <span 
                              key={`${journeyId}-focus-${index}`}
                              className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Feature Gate Demo */}
          <FeatureGate feature="betaFeatures">
            <div className="section-frame p-6">
              <h2 className="text-lg font-semibold content-primary mb-4">{tDashboard('betaFeatures')}</h2>
              <p className="content-secondary">
                {tDashboard('betaFeaturesDescription')}
              </p>
            </div>
          </FeatureGate>
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}

// Helper function to get focus areas for each journey
function getFocusAreas(journeyId: JourneyId, tDashboard: (key: string) => string): string[] {
  const focusAreas = {
    emergency: [
      tDashboard('focusAreas.emergency.accessibility'),
      tDashboard('focusAreas.emergency.operationalRisks'),
      tDashboard('focusAreas.emergency.concreteLimits')
    ],
    passive: [
      tDashboard('focusAreas.passive.yieldSource'),
      tDashboard('focusAreas.passive.realExposure'),
      tDashboard('focusAreas.passive.failureConditions')
    ],
    longterm: [
      tDashboard('focusAreas.longterm.timeHorizon'),
      tDashboard('focusAreas.longterm.cumulativeRisk'),
      tDashboard('focusAreas.longterm.personalCompatibility')
    ],
    speculation: [
      tDashboard('focusAreas.speculation.asymmetricRisk'),
      tDashboard('focusAreas.speculation.cognitiveErrors'),
      tDashboard('focusAreas.speculation.operationalLimits')
    ]
  }
  
  return focusAreas[journeyId] || []
}