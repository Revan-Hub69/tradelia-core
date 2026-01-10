/**
 * JourneyPage - Tradelia 2026
 * 
 * Implementa la struttura definitiva per ogni journey:
 * 1. Header di contesto (breadcrumb + titolo + descrizione)
 * 2. Sub-navigazione locale (Introduzione, Errori, Educativo, Tool, Piattaforme)
 * 3. Contenuto scalabile per ogni tab
 */

'use client'

import { useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { SectionLayout } from '@/src/widgets/section-layout/SectionLayout'
import { JOURNEYS, type JourneyId } from '@/src/shared/config/journeys'
import {
  ShieldIcon,
  TrendingUpIcon,
  BoltIcon,
  RefreshIcon,
  BookOpenIcon,
  AlertTriangleIcon,
  GraduationCapIcon,
  CogIcon,
  SettingsIcon
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

export function JourneyPage({ journeyId }: JourneyPageProps) {
  const t = useTranslations()
  const tJourney = useTranslations('common.journeyPage')
  const locale = useLocale()
  const journey = JOURNEYS[journeyId]
  const Icon = JOURNEY_ICONS[journeyId]

  // Handle tab switching from empty state
  useEffect(() => {
    const handleTabSwitch = (event: CustomEvent) => {
      const targetTab = event.detail
      // This would need to be connected to SectionLayout's tab state
      // For now, we'll use a simple approach
      const tabElement = document.querySelector(`[data-tab-id="${targetTab}"]`) as HTMLButtonElement
      if (tabElement) {
        tabElement.click()
      }
    }

    window.addEventListener('switchToTab', handleTabSwitch as EventListener)
    return () => window.removeEventListener('switchToTab', handleTabSwitch as EventListener)
  }, [])

  // Sub-navigazione standardizzata per tutte le sezioni
  const subNavItems = [
    {
      id: 'intro',
      label: tJourney('tabs.intro'),
      icon: <BookOpenIcon className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div className="bg-background/60 border border-border/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Benvenuto in {t(journey.labelKey)}</h3>
            <p className="text-muted-foreground mb-4">
              {t(`journeys.${journeyId}.description`)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Obiettivo</h4>
                <p className="text-sm text-muted-foreground">
                  Definire chiaramente cosa vuoi ottenere con questo percorso
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Approccio</h4>
                <p className="text-sm text-muted-foreground">
                  Metodologia step-by-step per raggiungere i tuoi obiettivi
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'errors',
      label: tJourney('tabs.errors'),
      icon: <AlertTriangleIcon className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div className="bg-background/60 border border-border/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Errori comuni in {t(journey.labelKey)}</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 bg-error/5 border border-error/20 rounded-lg">
                  <AlertTriangleIcon className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-error mb-1">Errore #{i}</h4>
                    <p className="text-sm text-muted-foreground">
                      Descrizione dell'errore e come evitarlo. Contenuto specifico per {journeyId}.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'educational',
      label: tJourney('tabs.educational'),
      icon: <GraduationCapIcon className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div className="bg-background/60 border border-border/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Risorse educative</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <GraduationCapIcon className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Lezione {i}</h4>
                  <p className="text-sm text-muted-foreground">
                    Contenuto educativo specifico per {journeyId}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tools',
      label: tJourney('tabs.tools'),
      icon: <CogIcon className="w-4 h-4" />,
      count: 0, // No tools available yet - show educational empty state
      content: (
        <div className="space-y-8">
          {/* Educational Empty State */}
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangleIcon className="w-8 h-8 text-warning" />
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {tJourney('toolsEmptyState.title')}
            </h3>
            
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              {tJourney('toolsEmptyState.description')}
            </p>
            
            <button 
              onClick={() => {
                // This will be connected to the parent's onItemClick
                const event = new CustomEvent('switchToTab', { detail: 'errors' })
                window.dispatchEvent(event)
              }}
              className="px-6 py-3 bg-warning text-white rounded-lg font-medium hover:bg-warning/90 transition-colors"
            >
              {tJourney('toolsEmptyState.readErrorsButton')}
            </button>
          </div>

          {/* Educational Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">1. Educativo</h4>
                  <p className="text-xs text-primary/70">Basi teoriche</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprendi i principi fondamentali prima di utilizzare qualsiasi strumento.
              </p>
            </div>

            <div className="p-6 bg-warning/5 border border-warning/20 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <AlertTriangleIcon className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h4 className="font-semibold text-warning">2. Errori</h4>
                  <p className="text-xs text-warning/70">Cosa evitare</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Gli errori comuni possono costare caro. Leggi questa sezione per primo.
              </p>
            </div>

            <div className="p-6 bg-muted/30 border border-border/50 rounded-xl opacity-60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center">
                  <CogIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-muted-foreground">3. Tool</h4>
                  <p className="text-xs text-muted-foreground/70">Strumenti pratici</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Disponibili dopo aver completato la preparazione necessaria.
              </p>
            </div>
          </div>

          {/* Context-specific warning */}
          <div className="bg-error/5 border border-error/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <ShieldIcon className="w-6 h-6 text-error flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-error mb-2">
                  {tJourney(`errorWarnings.${journeyId}.title`)}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {tJourney(`errorWarnings.${journeyId}.description`)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'platforms',
      label: tJourney('tabs.platforms'),
      icon: <SettingsIcon className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div className="bg-background/60 border border-border/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Piattaforme consigliate</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg">
                  <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                    <SettingsIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Piattaforma {i}</h4>
                    <p className="text-sm text-muted-foreground">
                      {tJourney('platformDescription', { journeyId })}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">
                    Visita
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <SectionLayout
          sectionId={journeyId}
          breadcrumb={[
            { label: 'Home', href: `/${locale}/dashboard` },
            { label: t(journey.labelKey) }
          ]}
          title={t(journey.labelKey)}
          description={t(`journeys.${journeyId}.description`)}
          icon={<Icon className="w-6 h-6 text-primary" />}
          primaryAction={{
            label: t(journey.primaryActionKey),
            onClick: () => console.log('Primary action clicked')
          }}
          subNavItems={subNavItems}
          defaultActiveTab="intro"
        />
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}

export default JourneyPage
