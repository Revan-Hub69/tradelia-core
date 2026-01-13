/**
 * Speculate Section Page - Speculare
 * 
 * Sezione educativa: asimmetria rischio, competenze richieste, errori ricorrenti
 * Complessità: Molto Alta
 * 
 * STATUS: Coming Soon
 */

import { setRequestLocale } from 'next-intl/server'
import { ComingSoonSection } from '@/src/widgets/section-dashboards/ComingSoonSection'

interface SpeculatePageProps {
  params: Promise<{ locale: string }>
}

export default async function SpeculatePage({ params }: SpeculatePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  return <ComingSoonSection sectionId="speculate" />
}
