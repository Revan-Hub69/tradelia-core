/**
 * Dashboard Home - Tradelia 2026
 * 
 * Hub centrale con 4 journey. Design unificato con JourneyCard.
 */

'use client'

import { useTranslations, useLocale } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { JourneyCard } from '@/src/shared/ui/JourneyCard'
import { ComplexityIndicator } from '@/src/shared/ui/ComplexityIndicator'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { JOURNEY_ORDER, JOURNEYS, type JourneyId } from '@/src/shared/config/journeys'
import {
  ShieldIcon,
  TrendingUpIcon,
  BoltIcon,
  RefreshIcon
} from '@/components/icons/TradeliaIcons'

const JOURNEY_ICONS: Record<JourneyId, React.ComponentType<{ className?: string }>> = {
  emergency: ShieldIcon,
  longterm: TrendingUpIcon,
  speculation: BoltIcon,
  passive: RefreshIcon
}

const JOURNEY_COLORS: Record<JourneyId, 'warning' | 'info' | 'success' | 'primary'> = {
  emergency: 'warning',
  passive: 'info',
  longterm: 'success',
  speculation: 'primary'
}

export function DashboardHome() {
  const locale = useLocale()
  const t = useTranslations()
  const tDashboard = useTranslations('dashboard')
  const { state } = useDashboardAuth()
  
  const userName = state.profile?.nickname || state.profile?.full_name || tDashboard('guestUser')

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="section-frame p-6 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {tDashboard('welcome')}, {userName}
            </h1>
            <p className="text-muted-foreground">
              {tDashboard('chooseOrientation')}
            </p>
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>{tDashboard('noImmediateAction')}</strong> {tDashboard('understandFirst')}
              </p>
            </div>
          </div>

          {/* Journey Cards */}
          <div className="section-frame p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">{tDashboard('tradeliaJourneys')}</h2>
              <p className="text-sm text-muted-foreground">
                {tDashboard('journeyExplanation')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {JOURNEY_ORDER.map((journeyId) => {
                const journey = JOURNEYS[journeyId]
                const Icon = JOURNEY_ICONS[journeyId]
                const color = JOURNEY_COLORS[journeyId]
                
                return (
                  <JourneyCard
                    key={journeyId}
                    href={`/${locale}/dashboard/${journeyId}`}
                    title={t(journey.labelKey)}
                    description={t(`journeys.${journeyId}.description`)}
                    icon={<Icon className="w-6 h-6" />}
                    accentColor={color}
                    badge={
                      <ComplexityIndicator 
                        level={journey.complexity}
                        size="sm"
                        showTooltip={false}
                      />
                    }
                  >
                    {/* Focus Areas */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {tDashboard('focusOn')}:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {getFocusAreas(journeyId, tDashboard).map((area) => (
                          <span 
                            key={area}
                            className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </JourneyCard>
                )
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}

function getFocusAreas(journeyId: JourneyId, tDashboard: (key: string) => string): string[] {
  const focusAreas: Record<JourneyId, string[]> = {
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
