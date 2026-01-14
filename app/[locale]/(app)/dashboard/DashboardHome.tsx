/**
 * Dashboard Home - Tradelia 2026
 * 
 * Hub centrale con le 4 sezioni educative.
 * Ogni sezione analizza un modo diverso di rapportarsi alle criptovalute.
 * Nessuna dice cosa fare. Tutte aiutano ad evitare errori costosi.
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
        <div className="space-y-8 font-professional">
          {/* Welcome Header with premium gradient - matching drawer design */}
          <div className="relative p-8 rounded-xl bg-gradient-to-br from-primary-500/8 to-primary-500/3 border border-primary-500/20 overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
            }} />
            
            <div className="relative z-10 space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {tDashboard('welcome')}, {userName}
              </h1>
              <p className="text-base text-muted-foreground reading-line-height leading-relaxed">
                {tDashboard('chooseOrientation')}
              </p>
              
              {/* Info box with gradient - matching ModuleContent callout style */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/8 to-amber-500/4 border border-amber-500/20">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  </div>
                  <div className="flex-1">
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

          {/* Decorative divider - matching GroupsView */}
          <div className="flex items-center gap-4 py-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
          </div>

          {/* 4 Crypto Sections */}
          <div className="section-frame p-6">
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
