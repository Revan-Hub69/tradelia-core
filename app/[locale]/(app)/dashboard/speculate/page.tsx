/**
 * Speculate Section Page - Speculare
 * 
 * Sezione educativa: asimmetria rischio, competenze richieste, errori ricorrenti
 * Complessità: Molto Alta
 */

import { setRequestLocale } from 'next-intl/server'
import { SectionDashboard } from '@/src/widgets/section-dashboards/SectionDashboard'

interface SpeculatePageProps {
  params: Promise<{ locale: string }>
}

export default async function SpeculatePage({ params }: SpeculatePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  return <SectionDashboard sectionId="speculate" />
}
