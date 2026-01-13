/**
 * Own Section Page - Possedere Criptovalute
 * 
 * Sezione educativa: custodia, controllo, responsabilità
 * Complessità: Bassa – Media
 */

import { setRequestLocale } from 'next-intl/server'
import { SectionDashboard } from '@/src/widgets/section-dashboards/SectionDashboard'

interface OwnPageProps {
  params: Promise<{ locale: string }>
}

export default async function OwnPage({ params }: OwnPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  return <SectionDashboard sectionId="own" />
}
