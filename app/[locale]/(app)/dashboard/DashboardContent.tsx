/**
 * Dashboard Content - Tradelia 2026
 * 
 * Dashboard professionale enterprise seguendo le spec del design system
 * Layout moderno con glassmorphism e componenti ottimizzati per performance
 */

'use client'

import { useTranslations } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { Button } from '@/src/shared/ui/Button'
import { 
  TrendingUpIcon, 
  ShieldIcon, 
  AlertTriangleIcon,
  ChartIcon,
  DiamondIcon
} from '@/components/icons/TradeliaIcons'

export function DashboardContent() {
  const t = useTranslations('dashboard')
  const { state } = useDashboardAuth()

  // Dati dinamici basati su utente reale o guest
  const getDashboardData = () => {
    const baseData = {
      summary: {
        totalAssets: state.isGuestMode ? 8 : 12,
        portfolioValue: state.isGuestMode ? 25000.00 : 45678.90,
        monthlyChange: state.isGuestMode ? 1.2 : 2.34,
        riskScore: state.isGuestMode ? 4.5 : 6.2,
        coherenceScore: state.isGuestMode ? 65 : 78
      },
      alerts: state.isGuestMode ? [
        {
          id: '1',
          type: 'warning' as const,
          title: t('limitedMode'),
          message: t('registerForAnalysis'),
          source: t('systemTradelia')
        }
      ] : [
        {
          id: '1',
          type: 'warning' as const,
          title: t('highConcentration'),
          message: t('concentrationMessage'),
          source: t('diversificationAnalysis')
        }
      ]
    }

    return baseData
  }

  const dashboardData = getDashboardData()
  const userName = state.profile?.full_name || t('guestUser')

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  {t('welcome')}, {userName}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {t('subtitle')}
                </p>
              </div>
              
              {state.isGuestMode && (
                <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/20 rounded-lg">
                  <ShieldIcon className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium text-warning">{t('guestMode')}</span>
                </div>
              )}
            </div>
          </div>

          {/* KPI Cards - Ottimizzate per performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Asset Totali */}
            <div className="bg-surface-elevated border border-border/60 rounded-xl p-6 card-interactive">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    {t('totalAssets')}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {dashboardData.summary.totalAssets}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('monitoredTools')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DiamondIcon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            {/* Valore Portafoglio */}
            <div className="bg-surface-elevated border border-border/60 rounded-xl p-6 card-interactive">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    {t('portfolioValue')}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    €{dashboardData.summary.portfolioValue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUpIcon className="w-3 h-3 text-success" />
                    <span className="text-sm text-success font-medium">
                      +{dashboardData.summary.monthlyChange}%
                    </span>
                    <span className="text-sm text-muted-foreground">{t('thisMonth')}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <TrendingUpIcon className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>

            {/* Score di Rischio */}
            <div className="bg-surface-elevated border border-border/60 rounded-xl p-6 card-interactive">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    {t('riskScore')}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {dashboardData.summary.riskScore}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('riskScaleDescription')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <AlertTriangleIcon className="w-6 h-6 text-warning" />
                </div>
              </div>
            </div>

            {/* Coerenza */}
            <div className="bg-surface-elevated border border-border/60 rounded-xl p-6 card-interactive">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    {t('coherence')}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {state.isGuestMode ? t('notAvailable') : `${dashboardData.summary.coherenceScore}%`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('coherenceDescription')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ShieldIcon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Analisi Portafoglio - Ottimizzata */}
            <div className="lg:col-span-2">
              <div className="bg-surface-elevated border border-border/60 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{t('portfolioAnalysis')}</h2>
                    <p className="text-sm text-muted-foreground">
                      {state.isGuestMode ? t('sampleData') : t('distributionAndPerformance')}
                    </p>
                  </div>
                  <ChartIcon className="w-6 h-6 text-muted-foreground" />
                </div>

                {state.isGuestMode ? (
                  <div className="text-center py-12">
                    <ShieldIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t('fullAnalysisAvailable')}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('registerForAnalysis')}
                    </p>
                    <Button onClick={() => window.location.href = '/'} size="sm">
                      {t('registerNow')}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                        {t('allocation')}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t('bitcoin')}</span>
                          <span className="text-sm font-semibold text-foreground">45%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t('ethereum')}</span>
                          <span className="text-sm font-semibold text-foreground">30%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t('others')}</span>
                          <span className="text-sm font-semibold text-foreground">25%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                        {t('performance30d')}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t('bitcoin')}</span>
                          <span className="text-sm font-semibold text-success">+12.3%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t('ethereum')}</span>
                          <span className="text-sm font-semibold text-success">+8.7%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t('others')}</span>
                          <span className="text-sm font-semibold text-error">-2.1%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Card - Ottimizzata */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-surface-elevated border border-border/60 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {state.isGuestMode ? t('getStarted') : t('quickActions')}
                </h2>
                <div className="space-y-3">
                  <Button className="w-full flex-col items-start gap-1 text-left" size="lg">
                    <span className="font-medium">
                      {state.isGuestMode ? t('register') : t('rebalancePortfolio')}
                    </span>
                    <span className="text-sm opacity-90">
                      {state.isGuestMode ? t('accessAllFeatures') : t('optimizeAllocation')}
                    </span>
                  </Button>
                  <Button
                    className="w-full flex-col items-start gap-1 text-left"
                    size="lg"
                    variant="outline"
                  >
                    <span className="font-medium text-foreground">{t('verifyCoherence')}</span>
                    <span className="text-sm text-muted-foreground">{t('analyzeTools')}</span>
                  </Button>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-surface-elevated border border-border/60 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">{t('alerts')}</h2>
                <div className="space-y-3">
                  {dashboardData.alerts.map((alert) => (
                    <div key={alert.id} className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangleIcon className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-warning">{alert.title}</p>
                          <p className="text-xs text-warning/80 mt-1">{alert.message}</p>
                          <p className="text-xs text-warning/70 mt-2 opacity-75">{alert.source}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}
