/**
 * Yield Section Page - Ottenere Rendite
 * 
 * Sezione educativa: origine rendimento, rischio controparte, condizioni fallimento
 * Complessità: Media – Alta
 */

import { setRequestLocale } from 'next-intl/server'
import { SectionDashboard } from '@/src/widgets/section-dashboards/SectionDashboard'

interface YieldPageProps {
  params: Promise<{ locale: string }>
}

export default async function YieldPage({ params }: YieldPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  return <SectionDashboard sectionId="yield" />
}
