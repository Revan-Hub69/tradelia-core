/**
 * Invest Section Page - Investire in Criptovalute
 * 
 * Sezione educativa: orizzonte realistico, volatilità, errori comportamentali
 * Complessità: Alta
 */

import { setRequestLocale } from 'next-intl/server'
import { SectionDashboard } from '@/src/widgets/section-dashboards/SectionDashboard'

interface InvestPageProps {
  params: Promise<{ locale: string }>
}

export default async function InvestPage({ params }: InvestPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  return <SectionDashboard sectionId="invest" />
}
