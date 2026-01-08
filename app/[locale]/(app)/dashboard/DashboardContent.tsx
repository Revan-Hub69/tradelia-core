/**
 * Dashboard Content - Tradelia 2026
 * 
 * Dashboard professionale enterprise seguendo le spec del design system
 * Layout moderno con glassmorphism e componenti avanzati
 */

'use client'

import { useTranslations } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { 
  TrendingUpIcon, 
  ShieldIcon, 
  AlertTriangleIcon,
  ChartIcon,
  DiamondIcon
} from '@/components/icons/TradeliaIcons'

export function DashboardContent() {
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
          title: 'Modalità limitata',
          message: 'Registrati per accedere a tutte le funzionalità di analisi',
          source: 'Sistema Tradelia'
        }
      ] : [
        {
          id: '1',
          type: 'warning' as const,
          title: 'Concentrazione elevata',
          message: 'Il 65% del portafoglio è concentrato in un singolo asset',
          source: 'Analisi diversificazione'
        }
      ]
    }

    return baseData
  }

  const dashboardData = getDashboardData()
  const userName = state.profile?.full_name || 'Utente'

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  Benvenuto, {userName}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Dashboard dinamica che evita gli errori nel mondo crypto
                </p>
              </div>
              
              {state.isGuestMode && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <ShieldIcon className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">Modalità Ospite</span>
                </div>
              )}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Asset Totali */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-background/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    Asset Totali
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {dashboardData.summary.totalAssets}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Strumenti monitorati
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DiamondIcon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            {/* Valore Portafoglio */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-background/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    Valore Portafoglio
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    €{dashboardData.summary.portfolioValue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUpIcon className="w-3 h-3 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      +{dashboardData.summary.monthlyChange}%
                    </span>
                    <span className="text-sm text-muted-foreground">questo mese</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUpIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Score di Rischio */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-background/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    Score di Rischio
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {dashboardData.summary.riskScore}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Su scala 1-10
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <AlertTriangleIcon className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Coerenza */}
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-background/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    Coerenza
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {state.isGuestMode ? "N/A" : `${dashboardData.summary.coherenceScore}%`}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Obiettivi vs strumenti
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <ShieldIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Analisi Portafoglio */}
            <div className="lg:col-span-2">
              <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Analisi Portafoglio</h2>
                    <p className="text-sm text-muted-foreground">
                      {state.isGuestMode ? "Dati di esempio" : "Distribuzione e performance degli asset"}
                    </p>
                  </div>
                  <ChartIcon className="w-6 h-6 text-muted-foreground" />
                </div>

                {state.isGuestMode ? (
                  <div className="text-center py-12">
                    <ShieldIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Analisi completa disponibile per utenti registrati
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Registrati per accedere a grafici dettagliati, analisi di rischio e raccomandazioni personalizzate
                    </p>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-150"
                    >
                      Registrati ora
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                        Allocazione
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Bitcoin</span>
                          <span className="text-sm font-semibold text-foreground">45%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Ethereum</span>
                          <span className="text-sm font-semibold text-foreground">30%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Altri</span>
                          <span className="text-sm font-semibold text-foreground">25%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                        Performance 30gg
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Bitcoin</span>
                          <span className="text-sm font-semibold text-green-600">+12.3%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Ethereum</span>
                          <span className="text-sm font-semibold text-green-600">+8.7%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Altri</span>
                          <span className="text-sm font-semibold text-red-600">-2.1%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Card */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {state.isGuestMode ? "Inizia ora" : "Azioni rapide"}
                </h2>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-150 text-left">
                    <div className="font-medium">
                      {state.isGuestMode ? "Registrati" : "Riequilibra Portafoglio"}
                    </div>
                    <div className="text-sm opacity-90">
                      {state.isGuestMode ? "Accedi a tutte le funzionalità" : "Ottimizza l'allocazione"}
                    </div>
                  </button>
                  <button className="w-full p-3 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors duration-150 text-left">
                    <div className="font-medium text-foreground">Verifica Coerenza</div>
                    <div className="text-sm text-muted-foreground">Analizza i tuoi strumenti</div>
                  </button>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Avvisi</h2>
                <div className="space-y-3">
                  {dashboardData.alerts.map((alert) => (
                    <div key={alert.id} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangleIcon className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-amber-800">{alert.title}</p>
                          <p className="text-xs text-amber-700 mt-1">{alert.message}</p>
                          <p className="text-xs text-amber-600 mt-2 opacity-75">{alert.source}</p>
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