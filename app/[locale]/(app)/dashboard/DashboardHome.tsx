/**
 * Dashboard Home - Tradelia 2026
 * 
 * Hub centrale con le 4 sezioni educative.
 * Ogni sezione analizza un modo diverso di rapportarsi alle criptovalute.
 * Nessuna dice cosa fare. Tutte aiutano ad evitare errori costosi.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { CryptoSectionsGrid } from '@/src/widgets/crypto-sections'
import { type SectionId, CRYPTO_SECTIONS } from '@/src/shared/config/crypto-sections'

export function DashboardHome() {
  const router = useRouter()
  const locale = useLocale()
  const tDashboard = useTranslations('dashboard')
  const { state } = useDashboardAuth()
  
  const userName = state.profile?.nickname || state.profile?.full_name || tDashboard('guestUser')
  const [completedSections] = useState<SectionId[]>([]) // TODO: persistenza

  const handleSectionClick = (sectionId: SectionId) => {
    const section = CRYPTO_SECTIONS[sectionId]
    // Naviga al journey corrispondente
    router.push(`/${locale}/dashboard/${section.journeyId}`)
  }

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="section-frame p-6 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {tDashboard('welcome')}, {userName}
            </h1>
            <p className="text-muted-foreground">
              {tDashboard('chooseOrientation')}
            </p>
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>{tDashboard('noImmediateAction')}</strong> {tDashboard('understandFirst')}
              </p>
            </div>
          </div>

          {/* 4 Crypto Sections */}
          <div className="section-frame p-6">
            <CryptoSectionsGrid 
              onSectionClick={handleSectionClick}
              completedSections={completedSections}
            />
          </div>
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}
