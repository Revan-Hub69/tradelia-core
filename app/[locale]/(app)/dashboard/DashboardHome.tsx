/**
 * Dashboard Home - Tradelia 2026
 * 
 * Hub centrale che mostra i 4 journey con KPI riassuntivi.
 * L'utente sceglie il percorso da qui o dalla BottomNav.
 */

'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { FeatureGate } from '@/src/shared/ui/FeatureGate'
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
  const locale = useLocale()
  const t = useTranslations()
  const tDashboard = useTranslations('dashboard')
  const { state } = useDashboardAuth()
  
  const userName = state.profile?.full_name || tDashboard('guestUser')

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
              Scegli il tuo percorso per iniziare
            </p>
          </div>

          {/* Journey Cards Grid - Section Frame */}
          <div className="section-frame p-6">
            <h2 className="text-lg font-semibold content-primary mb-4">Percorsi Disponibili</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {JOURNEY_ORDER.map((journeyId) => {
                const journey = JOURNEYS[journeyId]
                const Icon = JOURNEY_ICONS[journeyId]
                const colors = JOURNEY_COLORS[journeyId]
                
                return (
                  <Link
                    key={journeyId}
                    href={`/${locale}/dashboard/${journeyId}`}
                    className={`
                      card-2026 group relative p-6 transition-all duration-200
                      hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold content-primary mb-1">
                          {t(journey.labelKey)}
                        </h3>
                        <p className="text-sm content-secondary line-clamp-2">
                          {t(`journeys.${journeyId}.description`)}
                        </p>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    {/* Quick stat placeholder - Section divider */}
                    <div className="section-divider">
                      <div className="flex items-center justify-between text-sm">
                        <span className="content-secondary">
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
          </div>

          {/* Ultra-Chicche: Advanced Features with FeatureGate - Section Frame */}
          <div className="section-frame p-6 space-y-4">
            <h2 className="text-lg font-semibold content-primary">Funzionalità Avanzate</h2>
            
            <FeatureGate feature="advancedCharts">
              <div className="card-2026 p-6 border-l-4 border-l-primary">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUpIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">Grafici Avanzati</h3>
                    <p className="text-xs text-primary/70">Funzionalità sperimentale</p>
                  </div>
                </div>
                <p className="text-sm content-secondary mb-4">
                  Analisi avanzate con grafici interattivi e correlazioni di mercato in tempo reale.
                </p>
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">
                  Prova i Grafici Avanzati
                </button>
              </div>
            </FeatureGate>

            <FeatureGate feature="portfolioAnalyzer">
              <div className="card-2026 p-6 border-l-4 border-l-success">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <ShieldIcon className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-success">Analizzatore Portafoglio</h3>
                    <p className="text-xs text-success/70">Beta disponibile</p>
                  </div>
                </div>
                <p className="text-sm content-secondary mb-4">
                  Analisi automatica del rischio e suggerimenti di ottimizzazione per il tuo portafoglio.
                </p>
                <button className="px-4 py-2 bg-success text-white rounded-lg text-sm hover:bg-success/90 transition-colors">
                  Analizza Portafoglio
                </button>
              </div>
            </FeatureGate>
          </div>

          {/* Guest Mode CTA - Section Frame with warning accent */}
          {state.isGuestMode && (
            <div className="section-frame-warning p-4">
              <div className="flex items-center gap-3">
                <ShieldIcon className="w-5 h-5 text-warning flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium content-primary">
                    {tDashboard('limitedMode')}
                  </p>
                  <p className="text-xs content-tertiary mt-0.5">
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
