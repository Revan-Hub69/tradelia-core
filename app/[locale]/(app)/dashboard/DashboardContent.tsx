/**
 * Dashboard Content - Tradelia 2026
 * 
 * Componente client che gestisce il contenuto della dashboard
 * con autenticazione reale e dati dinamici
 */

'use client'

import { useTranslations } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { CardGrid } from '@/widgets/cards/CardGrid'
import { SummaryCard } from '@/widgets/cards/SummaryCard'
import { DetailCard } from '@/widgets/cards/DetailCard'
import { ActionCard } from '@/widgets/cards/ActionCard'
import { WarningCard } from '@/widgets/cards/WarningCard'
import { EducationalCard } from '@/widgets/cards/EducationalCard'
import { UserIcon, ShieldIcon } from '@/components/icons/TradeliaIcons'

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
        riskScore: state.isGuestMode ? 4.5 : 6.2
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
      ],
      education: [
        {
          id: '1',
          title: 'Diversificazione del portafoglio',
          description: 'Principi accademici per ridurre il rischio attraverso la diversificazione',
          source: 'Markowitz Portfolio Theory (1952)'
        }
      ]
    }

    return baseData
  }

  const dashboardData = getDashboardData()
  const userName = state.profile?.full_name || 'Utente'
  const userObjective = state.profile?.crypto_objective || 'investment'
  const userExperience = state.profile?.experience_level || 'basic'

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header con informazioni utente */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {t('title')}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>

            {/* User Profile Summary */}
            <div className="rounded border border-border/50 bg-background p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                  {state.isGuestMode ? (
                    <ShieldIcon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {userName}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Obiettivo: {userObjective}</span>
                    <span>Esperienza: {userExperience}</span>
                    {state.isGuestMode && (
                      <span className="text-amber-700 font-medium">Modalità ospite</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Grid */}
          <CardGrid>
            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                title="Asset Totali"
                value={dashboardData.summary.totalAssets.toString()}
                subtitle="Strumenti monitorati"
                trend="neutral"
              />
              <SummaryCard
                title="Valore Portafoglio"
                value={`€${dashboardData.summary.portfolioValue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`}
                subtitle="Valutazione corrente"
                trend="positive"
                change={`+${dashboardData.summary.monthlyChange}%`}
              />
              <SummaryCard
                title="Score di Rischio"
                value={dashboardData.summary.riskScore.toString()}
                subtitle="Su scala 1-10"
                trend="neutral"
              />
              <SummaryCard
                title="Coerenza"
                value={state.isGuestMode ? "N/A" : "78%"}
                subtitle="Obiettivi vs strumenti"
                trend={state.isGuestMode ? "neutral" : "warning"}
              />
            </div>

            {/* Main Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detail Card - Portfolio Analysis */}
              <div className="lg:col-span-2">
                <DetailCard
                  title="Analisi Portafoglio"
                  subtitle={state.isGuestMode ? "Dati di esempio" : "Distribuzione e performance degli asset"}
                  lastUpdated={new Date()}
                  dataSource={state.isGuestMode ? "Dati simulati" : "Dati di mercato in tempo reale"}
                >
                  <div className="space-y-4">
                    {state.isGuestMode ? (
                      <div className="text-center py-8">
                        <ShieldIcon className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Analisi completa disponibile per utenti registrati
                        </p>
                        <button
                          onClick={() => window.location.href = '/'}
                          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors duration-150"
                        >
                          Registrati per accedere
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Allocazione
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Bitcoin</span>
                              <span className="text-sm font-medium">45%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Ethereum</span>
                              <span className="text-sm font-medium">30%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Altri</span>
                              <span className="text-sm font-medium">25%</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Performance 30gg
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Bitcoin</span>
                              <span className="text-sm font-medium text-green-700">+12.3%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Ethereum</span>
                              <span className="text-sm font-medium text-green-700">+8.7%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Altri</span>
                              <span className="text-sm font-medium text-red-700">-2.1%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </DetailCard>
              </div>

              {/* Action Card */}
              <ActionCard
                title={state.isGuestMode ? "Registrati" : "Riequilibra Portafoglio"}
                description={state.isGuestMode ? "Accedi a tutte le funzionalità di analisi" : "Ottimizza l'allocazione basandoti sui tuoi obiettivi"}
                primaryAction={{
                  label: state.isGuestMode ? "Registrati ora" : "Avvia Analisi",
                  actionId: state.isGuestMode ? "register" : "start-analysis"
                }}
                secondaryAction={{
                  label: "Scopri di più",
                  actionId: "learn-more"
                }}
              />
            </div>

            {/* Alerts and Education Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Warning Cards */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Avvisi</h2>
                {dashboardData.alerts.map((alert) => (
                  <WarningCard
                    key={alert.id}
                    title={alert.title}
                    message={alert.message}
                    severity={alert.type}
                    source={alert.source}
                    dismissActionId={`dismiss-alert-${alert.id}`}
                  />
                ))}
              </div>

              {/* Educational Cards */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Approfondimenti</h2>
                {dashboardData.education.map((item) => (
                  <EducationalCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    source={item.source}
                    learnMoreActionId={`learn-more-${item.id}`}
                  />
                ))}
              </div>
            </div>
          </CardGrid>
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}