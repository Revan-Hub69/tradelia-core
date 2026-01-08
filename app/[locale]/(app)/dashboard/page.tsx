/**
 * Tradelia SuperBig Dashboard - Localized Page
 * 
 * Dashboard enterprise-level seguendo i principi Tradelia 2026:
 * - Chiarezza > Persuasione
 * - Verificabilità > Opinione  
 * - Neutralità > Bias
 */

import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { DashboardShell } from '@/widgets/dashboard-shell/DashboardShell';
import { CardGrid } from '@/widgets/cards/CardGrid';
import { SummaryCard } from '@/widgets/cards/SummaryCard';
import { DetailCard } from '@/widgets/cards/DetailCard';
import { ActionCard } from '@/widgets/cards/ActionCard';
import { WarningCard } from '@/widgets/cards/WarningCard';
import { EducationalCard } from '@/widgets/cards/EducationalCard';

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations('dashboard');
  
  // Mock data per la demo - in produzione verrebbe da API
  const dashboardData = {
    summary: {
      totalAssets: 12,
      portfolioValue: 45678.90,
      monthlyChange: 2.34,
      riskScore: 6.2
    },
    alerts: [
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
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {t('title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('subtitle')}
          </p>
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
              value="78%"
              subtitle="Obiettivi vs strumenti"
              trend="warning"
            />
          </div>

          {/* Main Content Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detail Card - Portfolio Analysis */}
            <div className="lg:col-span-2">
              <DetailCard
                title="Analisi Portafoglio"
                subtitle="Distribuzione e performance degli asset"
                lastUpdated={new Date()}
                dataSource="Dati di mercato in tempo reale"
              >
                <div className="space-y-4">
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
                </div>
              </DetailCard>
            </div>

            {/* Action Card */}
            <ActionCard
              title="Riequilibra Portafoglio"
              description="Ottimizza l'allocazione basandoti sui tuoi obiettivi"
              primaryAction={{
                label: "Avvia Analisi",
                actionId: "start-analysis"
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
    </DashboardShell>
  );
}