/**
 * Settings Page - Tradelia 2026
 */

import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

interface SettingsPageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: SettingsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'dashboard' })
  
  return {
    title: t('settings'),
    description: t('settingsDescription')
  }
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Impostazioni</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configura le tue preferenze
        </p>
      </div>
      
      <div className="rounded border border-border/50 bg-background p-6">
        <p className="text-sm text-muted-foreground">
          Sezione Impostazioni in sviluppo...
        </p>
      </div>
    </div>
  )
}