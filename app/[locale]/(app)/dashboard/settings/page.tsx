/**
 * Settings Page - Tradelia 2026
 */

import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SettingsContent } from './SettingsContent'

interface SettingsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: SettingsPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'settings' })
  
  return {
    title: t('title'),
    description: t('description')
  }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  return <SettingsContent />
}
