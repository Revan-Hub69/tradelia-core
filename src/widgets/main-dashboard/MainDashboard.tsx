/**
 * Main Dashboard - Tradelia 2026
 * 
 * Dashboard principale con le 4 sezioni educative.
 * Ogni sezione porta al journey operativo corrispondente.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { CryptoSectionsGrid } from '@/src/widgets/crypto-sections'
import { type SectionId, CRYPTO_SECTIONS } from '@/src/shared/config/crypto-sections'

export function MainDashboard() {
  const router = useRouter()
  const locale = useLocale()
  const [completedSections] = useState<SectionId[]>([]) // TODO: persistenza

  const handleSectionClick = (sectionId: SectionId) => {
    const section = CRYPTO_SECTIONS[sectionId]
    // Naviga al journey corrispondente
    router.push(`/${locale}/dashboard/${section.journeyId}`)
  }

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <div className="py-4 sm:py-8">
          <CryptoSectionsGrid 
            onSectionClick={handleSectionClick}
            completedSections={completedSections}
          />
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}
