/**
 * Dashboard Home - Tradelia 2026
 * 
 * Hub centrale con le 4 sezioni educative.
 * Ogni sezione analizza un modo diverso di rapportarsi alle criptovalute.
 * Nessuna dice cosa fare. Tutte aiutano ad evitare errori costosi.
 * 
 * @requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6 - Dashboard Home Visual Coherence
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { CryptoSectionsGrid } from '@/src/widgets/crypto-sections'
import { OnboardingPreferencesModal } from '@/src/shared/components/OnboardingPreferencesModal'
import { type TechnicalLevel } from '@/src/shared/components/TechnicalLevelSelector'
import { useUserPreferences } from '@/src/shared/hooks/useUserPreferences'
import { type SectionId, CRYPTO_SECTIONS } from '@/src/shared/config/crypto-sections'
import { DecorativeDivider, IconBox } from '@/src/shared/ui'

export function DashboardHome() {
  const router = useRouter()
  const locale = useLocale()
  const tDashboard = useTranslations('dashboard')
  const { state } = useDashboardAuth()
  const { country, isLoading: prefsLoading } = useUserPreferences(
    state.isGuestMode ? undefined : state.user?.id
  )
  
  const userName = state.profile?.nickname || state.profile?.full_name || tDashboard('guestUser')
  const [completedSections] = useState<SectionId[]>([]) // TODO: persistenza
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Show onboarding modal if preferences not set (first time user)
  useEffect(() => {
    if (!prefsLoading && !country) {
      setShowOnboarding(true)
    }
  }, [country, prefsLoading])

  const handleSectionClick = (sectionId: SectionId) => {
    const section = CRYPTO_SECTIONS[sectionId]
    // Naviga al journey corrispondente
    router.push(`/${locale}/dashboard/${section.journeyId}`)
  }

  const handleOnboardingComplete = (_preferences: { country: string; technicalLevel: TechnicalLevel }) => {
    setShowOnboarding(false)
  }

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        {/* Main container with font-professional and responsive spacing */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 font-professional">
          {/* Welcome Header with premium gradient - matching drawer design */}
          {/* Requirements 5.1: gradient background coerente (primary-500/8 to primary-500/3) */}
          <div className="relative p-4 sm:p-6 lg:p-8 rounded-xl bg-gradient-to-br from-primary-500/8 to-primary-500/3 border border-primary-500/20 overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
            }} />
            
            <div className="relative z-10 space-y-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                {tDashboard('welcome')}, {userName}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground reading-line-height leading-relaxed">
                {tDashboard('chooseOrientation')}
              </p>
              
              {/* Info callout with IconBox - Requirements 5.3: icon gradient + glow */}
              <div className="group p-4 sm:p-5 rounded-xl bg-gradient-to-br from-amber-500/8 to-amber-500/4 border border-amber-500/20">
                <div className="flex gap-3 sm:gap-4">
                  <IconBox
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                    }
                    color="warning"
                    size="sm"
                    animated={false}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">
                      {tDashboard('noImmediateAction')}
                    </p>
                    <p className="text-sm text-foreground/70 reading-line-height leading-relaxed">
                      {tDashboard('understandFirst')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative divider - Requirements 5.2: decorative dividers coerenti */}
          <DecorativeDivider variant="dots" spacing="md" />

          {/* 4 Crypto Sections - Requirements 5.6: CryptoSectionsGrid con card coerenti */}
          <div className="section-frame p-4 sm:p-5 lg:p-6">
            <CryptoSectionsGrid 
              onSectionClick={handleSectionClick}
              completedSections={completedSections}
            />
          </div>
        </div>

        {/* Onboarding Preferences Modal */}
        <OnboardingPreferencesModal
          isOpen={showOnboarding}
          onComplete={handleOnboardingComplete}
          userId={state.user?.id}
        />
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}
