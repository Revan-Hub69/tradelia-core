/**
 * JourneyPage - Tradelia 2026
 * 
 * Template base per ogni journey.
 * Mostra:
 * - Header con nome journey e azione primaria
 * - KPI specifici del journey
 * - Contenuto placeholder (da implementare per ogni journey)
 */

'use client'

import { useTranslations } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { JOURNEYS, type JourneyId } from '@/src/shared/config/journeys'
import { EmptyState } from '@/src/shared/ui/EmptyState'
import {
  ShieldIcon,
  TrendingUpIcon,
  BoltIcon,
  RefreshIcon,
  ChartIcon
} from '@/components/icons/TradeliaIcons'

interface JourneyPageProps {
  journeyId: JourneyId
}

const JOURNEY_ICONS: Record<JourneyId, React.ComponentType<{ className?: string }>> = {
  emergency: ShieldIcon,
  longterm: TrendingUpIcon,
  speculation: BoltIcon,
  passive: RefreshIcon
}

const JOURNEY_COLORS: Record<JourneyId, string> = {
  emergency: 'warning',
  longterm: 'success',
  speculation: 'primary',
  passive: 'info'
}

export function JourneyPage({ journeyId }: JourneyPageProps) {
  const t = useTranslations()
  const journey = JOURNEYS[journeyId]
  const Icon = JOURNEY_ICONS[journeyId]
  const color = JOURNEY_COLORS[journeyId]

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <div className="space-y-8 pb-20 lg:pb-8">
          {/* Journey Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl icon-bg-${color} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${color}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {t(journey.labelKey)}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t(`journeys.${journeyId}.description`)}
                </p>
              </div>
            </div>
            
            {/* Primary Action */}
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              {t(journey.primaryActionKey)}
            </button>
          </div>

          {/* KPI Grid - Placeholder */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="bg-background/60 border border-border/50 rounded-xl p-4 lg:p-6"
              >
                <div className="h-4 w-20 bg-muted rounded animate-pulse mb-2" />
                <div className="h-8 w-24 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Content Placeholder */}
          <div className="bg-background/60 border border-border/50 rounded-xl p-6 lg:p-8">
            <EmptyState
              icon={<ChartIcon className="w-12 h-12" />}
              title={`${t(journey.labelKey)} - In costruzione`}
              description="Questa sezione sarà disponibile presto. Stiamo lavorando per offrirti la migliore esperienza."
            />
          </div>

          {/* Sections Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {journey.sections.slice(1).map((section) => (
              <div 
                key={section.id}
                className="bg-background/60 border border-border/50 rounded-xl p-4 hover:bg-background/80 transition-colors cursor-pointer"
              >
                <h3 className="font-medium text-foreground mb-1">
                  {t(section.labelKey)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sezione in arrivo
                </p>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}

export default JourneyPage
