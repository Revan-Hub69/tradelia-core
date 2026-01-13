/**
 * Invest Section Page - Investire in Criptovalute
 * 
 * Sezione educativa: orizzonte realistico, volatilità, errori comportamentali
 * Complessità: Alta
 * 
 * STATUS: Coming Soon
 */

import { setRequestLocale } from 'next-intl/server'
import { ComingSoonSection } from '@/src/widgets/section-dashboards/ComingSoonSection'

interface InvestPageProps {
  params: Promise<{ locale: string }>
}

export default async function InvestPage({ params }: InvestPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  return <ComingSoonSection sectionId="invest" />
}
