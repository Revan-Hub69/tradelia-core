/**
 * Yield Section Page - Ottenere Rendite
 * 
 * Sezione educativa: origine rendimento, rischio controparte, condizioni fallimento
 * Complessità: Media – Alta
 * 
 * STATUS: Coming Soon
 */

import { setRequestLocale } from 'next-intl/server'
import { ComingSoonSection } from '@/src/widgets/section-dashboards/ComingSoonSection'

interface YieldPageProps {
  params: Promise<{ locale: string }>
}

export default async function YieldPage({ params }: YieldPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  return <ComingSoonSection sectionId="yield" />
}
