/**
 * Settings Page - Tradelia 2026
 */

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { SettingsContent } from './SettingsContent'

interface SettingsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: SettingsPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard' })
  
  return {
    title: t('settings'),
    description: t('settingsDescription')
  }
}

export default function SettingsPage() {
  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <SettingsContent />
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}
