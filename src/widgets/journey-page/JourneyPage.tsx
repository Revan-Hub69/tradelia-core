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
import { SoftConfirmation } from '@/src/shared/ui/SoftConfirmation'
import { SafeButton } from '@/src/shared/ui/SafeButton'
import { useEducationMemory } from '@/src/shared/hooks/useEducationMemory'
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

  // Ultra-Chicche: Education Memory for intelligent guidance
  const educationMemory = useEducationMemory(journeyId)

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

  // Determine recommended next tab based on education memory
  const getRecommendedTab = () => {
    if (journeyId !== 'emergency') return null
    
    if (!educationMemory.hasSeenIntro) return 'intro'
    if (!educationMemory.hasReadErrors) return 'errors'
    if (!educationMemory.hasReadEducational) return 'educational'
    return null
  }

  const recommendedTab = getRecommendedTab()

  // Sub-navigazione standardizzata per tutte le sezioni
  const subNavItems = [
    {
      id: 'intro',
      label: tJourney('tabs.intro'),
      recommended: recommendedTab === 'intro',
      content: (
        <div className="space-y-6">
          {/* Emergency-specific introduction - Cognitive microlearning approach */}
          {journeyId === 'emergency' ? (
            <div className="max-w-2xl">
              {/* Simple title - left aligned, no hero */}
              <h1 className="text-xl font-medium text-foreground mb-8">
                {t('journeys.emergency.introduction.title')}
              </h1>

              {/* Plain text blocks - no cards, no numbers, no emphasis */}
              <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
                <p>
                  {t('journeys.emergency.introduction.whyExists.content')}
                </p>

                <p>
                  {t('journeys.emergency.introduction.problemType.content')}
                </p>

                <p>
                  {t('journeys.emergency.introduction.mentalRule.content')}
                </p>

                <p>
                  {t('journeys.emergency.introduction.whoItMakesSense.content')}
                </p>
              </div>

              {/* Cognitive closure - semantic CTA */}
              <div className="mt-12 pt-6 border-t border-border/30">
                <button
                  onClick={() => {
                    educationMemory.markIntroSeen()
                    
                    // Try to find and click the errors tab
                    const errorsTab = document.querySelector('[data-tab-id="errors"]') as HTMLButtonElement
                    if (errorsTab) {
                      errorsTab.click()
                    } else {
                      // Fallback: try to trigger the parent's tab change handler
                      const tabContainer = document.querySelector('[role="tablist"]')
                      if (tabContainer) {
                        // Look for errors tab in the container
                        const errorButton = tabContainer.querySelector('[data-tab-id="errors"]') as HTMLButtonElement
                        if (errorButton) {
                          errorButton.click()
                        }
                      }
                    }
                  }}
                  className="text-sm text-sky-600 hover:text-sky-700 transition-colors italic underline decoration-sky-600/30 hover:decoration-sky-700 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 rounded-sm"
                >
                  Next: Errors to avoid
                </button>
              </div>
            </div>
          ) : (
            /* Generic introduction for other journeys */
            <>
              {/* Ultra-Chicche: Education Memory Progress */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h4 className="font-semibold text-primary mb-3">{tJourney('yourProgress')}</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{tJourney('introductionRead')}</span>
                    <span className={`text-xs px-2 py-1 rounded ${educationMemory.hasSeenIntro ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {educationMemory.hasSeenIntro ? tJourney('completed') : tJourney('toDo')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{tJourney('errorsStudied')}</span>
                    <span className={`text-xs px-2 py-1 rounded ${educationMemory.hasReadErrors ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {educationMemory.hasReadErrors ? tJourney('completed') : tJourney('toDo')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{tJourney('educationalSection')}</span>
                    <span className={`text-xs px-2 py-1 rounded ${educationMemory.hasReadEducational ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {educationMemory.hasReadEducational ? tJourney('completed') : tJourney('toDo')}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>{tJourney('nextStep')}:</strong> {educationMemory.getRecommendedAction().reason}
                  </p>
                </div>
              </div>

              <div className="bg-background/60 border border-border/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{tJourney('welcomeTo')} {t(journey.labelKey)}</h3>
                <p className="text-muted-foreground mb-4">
                  {t(`journeys.${journeyId}.description`)}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">{tJourney('objective')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {tJourney('objectiveDescription')}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">{tJourney('approach')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {tJourney('approachDescription')}
                    </p>
                  </div>
                </div>

                {/* Mark intro as seen when user reads this */}
                <div className="mt-6">
                  <SafeButton
                    onClick={() => educationMemory.markIntroSeen()}
                    variant="safe"
                    size="sm"
                    disabled={educationMemory.hasSeenIntro}
                  >
                    {educationMemory.hasSeenIntro ? tJourney('introductionCompleted') : tJourney('markAsRead')}
                  </SafeButton>
                </div>
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'errors',
      label: tJourney('tabs.errors'),
      recommended: recommendedTab === 'errors',
      content: (
        <div className="space-y-6">
          <div className="bg-background/60 border border-border/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">{tJourney('commonErrorsIn')} {t(journey.labelKey)}</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 bg-error/5 border border-error/20 rounded-lg">
                  <AlertTriangleIcon className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-error mb-1">{tJourney('errorNumber')} #{i}</h4>
                    <p className="text-sm text-muted-foreground">
                      {tJourney('errorDescription')} {journeyId}.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mark errors as read */}
            <div className="mt-6">
              <SafeButton
                onClick={() => educationMemory.markErrorsRead()}
                variant="safe"
                size="sm"
                disabled={educationMemory.hasReadErrors}
              >
                {educationMemory.hasReadErrors ? tJourney('errorsStudiedButton') : tJourney('readErrorsButton')}
              </SafeButton>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'educational',
      label: tJourney('tabs.educational'),
      recommended: recommendedTab === 'educational',
      content: (
        <div className="space-y-6">
          <div className="bg-background/60 border border-border/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">{tJourney('educationalResources')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <GraduationCapIcon className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">{tJourney('lesson')} {i}</h4>
                  <p className="text-sm text-muted-foreground">
                    {tJourney('educationalContent')} {journeyId}
                  </p>
                </div>
              ))}
            </div>

            {/* Mark educational as read */}
            <div className="mt-6">
              <SafeButton
                onClick={() => educationMemory.markEducationalRead()}
                variant="safe"
                size="sm"
                disabled={educationMemory.hasReadEducational}
              >
                {educationMemory.hasReadEducational ? tJourney('sectionCompleted') : tJourney('markAsCompleted')}
              </SafeButton>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tools',
      label: tJourney('tabs.tools'),
      // Remove count: 0 to avoid showing "0" badge
      secondary: true, // Mark as secondary
      disabled: true, // Mark as disabled when no tools available
      content: (
        <div className="space-y-8">
          {/* Ultra-Chicche: SoftConfirmation for tool access */}
          {!educationMemory.hasReadErrors && (
            <SoftConfirmation
              type="warning"
              message={`${tJourney('beforeAccessingTools')} ${t(journey.labelKey)}, ${tJourney('importantToRead')}.`}
              onProceed={() => {
                // Allow access but warn
                console.log('User proceeded without reading errors')
              }}
            >
              <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <p className="text-sm text-warning">
                  ⚠️ {tJourney('toolAccessWarning')}
                </p>
              </div>
            </SoftConfirmation>
          )}

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
                  <h4 className="font-semibold text-primary">1. {tJourney('educational')}</h4>
                  <p className="text-xs text-primary/70">{tJourney('theoreticalBases')}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {tJourney('understandPrinciples')}
              </p>
            </div>

            <div className="p-6 bg-warning/5 border border-warning/20 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <AlertTriangleIcon className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h4 className="font-semibold text-warning">2. {tJourney('errors')}</h4>
                  <p className="text-xs text-warning/70">{tJourney('whatToAvoid')}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {tJourney('commonErrorsCost')}
              </p>
            </div>

            <div className="p-6 bg-muted/30 border border-border/50 rounded-xl opacity-60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center">
                  <CogIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-muted-foreground">3. {tJourney('tools')}</h4>
                  <p className="text-xs text-muted-foreground/70">{tJourney('practicalTools')}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {tJourney('availableAfterPreparation')}
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
      secondary: true, // Mark as secondary
      content: (
        <div className="space-y-6">
          <div className="bg-background/60 border border-border/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">{tJourney('recommendedPlatforms')}</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg">
                  <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                    <SettingsIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{tJourney('platform')} {i}</h4>
                    <p className="text-sm text-muted-foreground">
                      {tJourney('platformDescription', { journeyId })}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">
                    {tJourney('visit')}
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
          description={journeyId === 'emergency' ? '' : t(`journeys.${journeyId}.description`)}
          icon={<Icon className="w-6 h-6 text-primary" />}
          {...(journeyId !== 'emergency' ? {
            primaryAction: {
              label: t(journey.primaryActionKey),
              onClick: () => console.log('Primary action clicked')
            }
          } : {})}
          subNavItems={subNavItems}
          defaultActiveTab="intro"
        />
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}

export default JourneyPage
