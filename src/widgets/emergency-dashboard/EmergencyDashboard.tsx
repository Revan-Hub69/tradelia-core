/**
 * Emergency Dashboard - Tradelia 2026
 * 
 * Dashboard moderna per il percorso emergenza con hero alert e 4 pilastri interattivi
 */

'use client'

import { useTranslations } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { EmergencyHeroAlert } from './EmergencyHeroAlert'
import { EmergencyPillars } from './EmergencyPillars'
import { ShieldIcon } from '@/components/icons/TradeliaIcons'

export function EmergencyDashboard() {
  const t = useTranslations()

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        {/* Page Header - senza breadcrumb (ora è sticky nel layout) */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <ShieldIcon className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t('journeys.emergency.name')}
            </h1>
          </div>
        </div>
        
        {/* Main Dashboard Content */}
        <div className="space-y-8 pb-8">
          {/* Hero Alert */}
          <EmergencyHeroAlert />
          
          {/* 4 Pillars */}
          <EmergencyPillars />
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}