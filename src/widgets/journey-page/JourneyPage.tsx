/**
 * JourneyPage - Tradelia 2026
 * 
 * Implementa la struttura definitiva per ogni journey:
 * 1. Header di contesto (breadcrumb + titolo + descrizione)
 * 2. Sub-navigazione locale (Introduzione, Errori, Educativo, Tool, Piattaforme)
 * 3. Contenuto scalabile per ogni tab
 */

'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { DashboardIntroOverlay } from '@/src/widgets/dashboard-intro'
import { SectionLayout } from '@/src/widgets/section-layout/SectionLayout'
import { SafeButton } from '@/src/shared/ui/SafeButton'
import { useEducationMemory } from '@/src/shared/hooks/useEducationMemory'
import { JOURNEYS, type JourneyId } from '@/src/shared/config/journeys'
import {
  ShieldIcon,
  TrendingUpIcon,
  BoltIcon,
  RefreshIcon,
  AlertTriangleIcon
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

  // Emergency intro overlay state
  const [showEmergencyIntro, setShowEmergencyIntro] = useState(false)

  // Ultra-Chicche: Education Memory for intelligent guidance
  const educationMemory = useEducationMemory(journeyId)

  // Show emergency intro overlay on first visit to emergency journey
  useEffect(() => {
    if (journeyId === 'emergency') {
      const hasSeenEmergencyIntro = localStorage.getItem('tradelia-emergency-intro-seen-v2')
      if (!hasSeenEmergencyIntro) {
        setShowEmergencyIntro(true)
      }
    }
  }, [journeyId])

  const handleCloseEmergencyIntro = () => {
    setShowEmergencyIntro(false)
    localStorage.setItem('tradelia-emergency-intro-seen-v2', 'true')
  }

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
  const _getRecommendedTab = () => {
    if (journeyId !== 'emergency') return null
    
    if (!educationMemory.hasSeenIntro) return 'intro'
    if (!educationMemory.hasReadErrors) return 'errors'
    if (!educationMemory.hasReadEducational) return 'educational'
    return null
  }

  // Sub-navigazione standardizzata per tutte le sezioni
  const subNavItems = [
    {
      id: 'intro',
      label: tJourney('tabs.intro'),
      content: (
        <div className="space-y-6">
          {/* Emergency-specific introduction - Ultra-Chicche implementation */}
          {journeyId === 'emergency' ? (
            <div className="max-w-[54ch] mx-auto px-8">
              {/* Meta indicators - top right, silent */}
              <div className="flex justify-between items-start mb-16">
                <div></div>
                <div className="text-xs text-muted-foreground/40 space-y-1 text-right">
                  <div>Scope: Orientation</div>
                  <div>Mode: Risk-first</div>
                </div>
              </div>

              {/* Anti-hero title - policy brief style */}
              <h1 className="text-[20px] font-normal text-foreground mb-16 leading-[1.4]">
                {t('journeys.emergency.introduction.title')}
              </h1>

              {/* Blocchi cognitivi - ogni paragrafo = una idea */}
              <div className="space-y-12 text-[16px] text-muted-foreground leading-[1.75]">
                {/* Blocco 1: Contesto storico */}
                <div className="space-y-4">
                  <p>
                    {t('journeys.emergency.introduction.whyExists.content')}
                  </p>
                </div>

                {/* Blocco 2: Sistemi alternativi */}
                <div className="space-y-4">
                  <p>
                    {t('journeys.emergency.introduction.problemType.content')}
                  </p>
                </div>

                {/* Blocco 3: Domanda centrale */}
                <div className="space-y-4">
                  <p>
                    {t('journeys.emergency.introduction.mentalRule.content')}
                  </p>
                </div>

                {/* Blocco 4: Priorità in emergenza */}
                <div className="space-y-4">
                  <p>
                    {t('journeys.emergency.introduction.whoItMakesSense.content')}
                  </p>
                </div>

                {/* Blocco 5: Contesto finale */}
                <div className="space-y-4">
                  <p>
                    {t('journeys.emergency.introduction.finalNote.content')}
                  </p>
                </div>
              </div>

              {/* Principio chiave - callout vero */}
              <div className="mt-16 mb-12 p-6 bg-primary/5 border-l-4 border-primary/30 rounded-r-lg">
                <p className="text-[16px] text-primary/90 leading-[1.6] font-medium">
                  {tJourney('memoryAnchor')}
                </p>
              </div>

              {/* Chiusura di fase - non sezione separata */}
              <div className="mt-12 pt-6 border-t border-border/20">
                <div className="space-y-6">
                  {/* Stato completamento */}
                  <p className="text-sm text-muted-foreground/70">
                    {tJourney('completedIntroduction')}
                  </p>
                  
                  {/* CTA Tradelia-style */}
                  <div className="bg-muted/20 border border-border/30 rounded-lg p-5 space-y-4">
                    <div className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                      {tJourney('stepTransition.nextStep')}
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tJourney('stepTransition.beforeUsingTools')}
                    </p>
                    
                    <button
                      onClick={() => {
                        educationMemory.markIntroSeen()
                        
                        const errorsTab = document.querySelector('[data-tab-id="errors"]') as HTMLButtonElement
                        if (errorsTab) {
                          errorsTab.click()
                        } else {
                          const tabContainer = document.querySelector('[role="tablist"]')
                          if (tabContainer) {
                            const errorButton = tabContainer.querySelector('[data-tab-id="errors"]') as HTMLButtonElement
                            if (errorButton) {
                              errorButton.click()
                            }
                          }
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 border border-border/50 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:border-border transition-colors focus:outline-none focus:ring-2 focus:ring-muted-foreground/20 focus:ring-offset-2 min-h-[44px]"
                      aria-label={tJourney('continueWithErrorsAriaLabel')}
                    >
                      {tJourney('stepTransition.goToErrors')} →
                    </button>
                  </div>
                </div>
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
      content: (
        <div className="space-y-6">
          {/* Soft contextual warning - adult-to-adult communication */}
          {journeyId === 'emergency' && !educationMemory.hasSeenIntro && (
            <div className="max-w-[66ch] mx-auto px-6 mb-8">
              <p className="text-sm text-muted-foreground/80 mb-2">
                {tJourney('assumesDecisionFrame')}
              </p>
              <button
                onClick={() => {
                  const introTab = document.querySelector('[data-tab-id="intro"]') as HTMLButtonElement
                  if (introTab) {
                    introTab.click()
                  }
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline decoration-muted-foreground/30 hover:decoration-foreground underline-offset-2"
              >
                {tJourney('viewIntroduction')}
              </button>
            </div>
          )}

          <div className="max-w-[54ch] mx-auto px-8">
            <h3 className="text-[20px] font-normal text-foreground mb-12 leading-[1.4]">
              {tJourney('commonErrorsIn')} {t(journey.labelKey)}
            </h3>
            
            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="flex gap-4">
                    <AlertTriangleIcon className="w-5 h-5 text-error flex-shrink-0 mt-1" />
                    <div className="space-y-3">
                      <h4 className="text-[16px] font-medium text-error leading-[1.4]">
                        {tJourney('errorNumber')} #{i}
                      </h4>
                      <p className="text-[16px] text-muted-foreground leading-[1.75]">
                        {tJourney('errorDescription')} {journeyId}.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chiusura di fase - Tradelia style */}
            <div className="mt-16 pt-6 border-t border-border/20">
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground/70">
                  {tJourney('identifiedErrors')}
                </p>
                
                <div className="bg-muted/20 border border-border/30 rounded-lg p-5 space-y-4">
                  <div className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                    {tJourney('stepTransition.nextStep')}
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tJourney('stepTransition.afterIdentifyingErrorsBlock')}
                  </p>
                  
                  <button
                    onClick={() => {
                      educationMemory.markErrorsRead()
                      const educationalTab = document.querySelector('[data-tab-id="educational"]') as HTMLButtonElement
                      if (educationalTab) {
                        educationalTab.click()
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-border/50 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:border-border transition-colors focus:outline-none focus:ring-2 focus:ring-muted-foreground/20 focus:ring-offset-2 min-h-[44px]"
                    aria-label={tJourney('continueWithEducationalAriaLabel')}
                  >
                    {educationMemory.hasSeenIntro 
                      ? tJourney('stepTransition.goToEducational')
                      : tJourney('stepTransition.reviewIntroduction')
                    } →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'educational',
      label: tJourney('tabs.educational'),
      content: (
        <div className="space-y-6">
          {/* Soft contextual warning for educational section */}
          {journeyId === 'emergency' && !educationMemory.hasReadErrors && (
            <div className="max-w-[66ch] mx-auto px-6 mb-8">
              <p className="text-sm text-muted-foreground/80 mb-2">
                {tJourney('assumesErrorsKnowledge')}
              </p>
              <button
                onClick={() => {
                  const errorsTab = document.querySelector('[data-tab-id="errors"]') as HTMLButtonElement
                  if (errorsTab) {
                    errorsTab.click()
                  }
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline decoration-muted-foreground/30 hover:decoration-foreground underline-offset-2"
              >
                {tJourney('viewErrors')}
              </button>
            </div>
          )}

          <div className="max-w-[66ch] mx-auto px-6">
            <h3 className="text-[20px] font-normal text-foreground mb-8 leading-[1.4]">
              {tJourney('educationalResources')}
            </h3>
            
            {/* Educational content - anti-marketing layout */}
            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <h4 className="text-[16px] font-normal text-foreground leading-[1.4]">
                    {tJourney('lesson')} {i}
                  </h4>
                  <p className="text-[16px] text-muted-foreground leading-[1.75] max-w-[60ch]">
                    {tJourney('educationalContentWithContext', { journeyId })}
                  </p>
                </div>
              ))}
            </div>

            {/* Completion without gamification */}
            <div className="mt-16 pt-8 border-t border-border/20">
              <p className="text-sm text-muted-foreground/80 mb-4 max-w-[60ch]">
                {tJourney('sectionEstablishesFoundation')}
              </p>
              
              <button
                onClick={() => {
                  educationMemory.markEducationalRead()
                  // No automatic navigation - let user choose
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-muted-foreground/20 focus:ring-offset-2 rounded-sm min-h-[44px] flex items-center"
                aria-label="Mark educational section as completed"
              >
                Continue with Tools
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tools',
      label: tJourney('tabs.tools'),
      content: (
        <div className="space-y-8">
          <div className="max-w-[66ch] mx-auto px-6">
            {/* Context check - soft warning */}
            {!educationMemory.hasReadErrors && (
              <div className="mb-8">
                <p className="text-sm text-muted-foreground/80 mb-2">
                  {tJourney('toolsAssumeKnowledge')}
                </p>
                <button
                  onClick={() => {
                    const errorsTab = document.querySelector('[data-tab-id="errors"]') as HTMLButtonElement
                    if (errorsTab) {
                      errorsTab.click()
                    }
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline decoration-muted-foreground/30 hover:decoration-foreground underline-offset-2"
                >
                  {tJourney('reviewPreparationSteps')}
                </button>
              </div>
            )}

            <h3 className="text-[20px] font-normal text-foreground mb-8 leading-[1.4]">
              {tJourney('toolsEmptyState.title')}
            </h3>
            
            <div className="space-y-8 text-[16px] text-muted-foreground leading-[1.75]">
              <p className="max-w-[60ch]">
                {tJourney('toolsEmptyState.description')}
              </p>
              
              <p className="max-w-[60ch]">
                {tJourney('toolsAvailableAfterPrep')}
              </p>
            </div>

            {/* Only here: operative CTA (when tools are actually available) */}
            {educationMemory.hasReadErrors && educationMemory.hasReadEducational && (
              <div className="mt-12 pt-8 border-t border-border/20">
                <p className="text-sm text-muted-foreground/80 mb-6 max-w-[60ch]">
                  {tJourney('sectionProvidesTools')}
                </p>
                
                {/* This would be the actual operative CTA when tools exist */}
                <button
                  onClick={() => {
                    // Actual tool interaction would go here
                    console.log('Tool interaction')
                  }}
                  className="px-6 py-3 bg-foreground text-background text-sm font-normal rounded-sm hover:bg-foreground/90 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2"
                >
                  {tJourney('accessEmergencyTool')}
                </button>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'platforms',
      label: tJourney('tabs.platforms'),
      content: (
        <div className="space-y-6">
          <div className="max-w-[66ch] mx-auto px-6">
            <h3 className="text-[20px] font-normal text-foreground mb-8 leading-[1.4]">
              {tJourney('recommendedPlatforms')}
            </h3>
            
            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <h4 className="text-[16px] font-normal text-foreground leading-[1.4]">
                    {tJourney('platform')} {i}
                  </h4>
                  <p className="text-[16px] text-muted-foreground leading-[1.75] max-w-[60ch]">
                    {tJourney('platformDescription', { journeyId })}
                  </p>
                  
                  {/* Operative CTA only in platforms section */}
                  <button
                    onClick={() => {
                      // Actual platform visit would go here
                      console.log(`Visit platform ${i}`)
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline decoration-muted-foreground/30 hover:decoration-foreground underline-offset-2 focus:outline-none focus:ring-2 focus:ring-muted-foreground/20 focus:ring-offset-2 rounded-sm min-h-[44px] flex items-center"
                  >
                    {tJourney('visit')}
                  </button>
                </div>
              ))}
            </div>

            {/* Final completion - no gamification */}
            <div className="mt-16 pt-8 border-t border-border/20">
              <p className="text-sm text-muted-foreground/80 max-w-[60ch]">
                {tJourney('sectionProvidesGuidance')}
              </p>
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
        
        {/* Emergency Introduction Overlay - Only for emergency journey */}
        {journeyId === 'emergency' && (
          <DashboardIntroOverlay 
            isOpen={showEmergencyIntro}
            onClose={handleCloseEmergencyIntro}
          />
        )}
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}

export default JourneyPage
