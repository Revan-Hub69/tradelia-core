/**
 * Dashboard Home - Tradelia 2026
 * 
 * Hub centrale che mostra i 4 journey con KPI riassuntivi.
 * L'utente sceglie il percorso da qui o dalla BottomNav.
 */

'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { JOURNEY_ORDER, JOURNEYS, type JourneyId } from '@/src/shared/config/journeys'
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

const JOURNEY_COLORS: Record<JourneyId, { bg: string; text: string; border: string }> = {
  emergency: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
  longterm: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
  speculation: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
  passive: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/20' }
}

export function DashboardHome() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations()
  const tDashboard = useTranslations('dashboard')
  const { state } = useDashboardAuth()
  
  const userName = state.profile?.full_name || tDashboard('guestUser')

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <div className="space-y-8 pb-20 lg:pb-8">
          {/* Welcome Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {tDashboard('welcome')}, {userName}
            </h1>
            <p className="text-muted-foreground">
              Scegli il tuo percorso per iniziare
            </p>
          </div>

          {/* Journey Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {JOURNEY_ORDER.map((journeyId) => {
              const journey = JOURNEYS[journeyId]
              const Icon = JOURNEY_ICONS[journeyId]
              const colors = JOURNEY_COLORS[journeyId]
              const href = `/${locale}/dashboard/${journeyId}`
              
              return (
                <Link
                  key={journeyId}
                  href={href}
                  className={`
                    group relative p-6 rounded-xl border transition-all duration-200
                    bg-background/60 hover:bg-background/80
                    ${colors.border} hover:border-border
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-foreground mb-1">
                        {t(journey.labelKey)}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {t(`journeys.${journeyId}.description`)}
                      </p>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  {/* Quick stat placeholder */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t(journey.primaryActionKey)}
                      </span>
                      <span className={`font-medium ${colors.text}`}>
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Guest Mode CTA */}
          {state.isGuestMode && (
            <div className="p-4 rounded-xl border border-warning/20 bg-warning/5">
              <div className="flex items-center gap-3">
                <ShieldIcon className="w-5 h-5 text-warning flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {tDashboard('limitedMode')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tDashboard('registerForAnalysis')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}

export default DashboardHome
