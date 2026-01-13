/**
 * Redirect: /speculation → /speculate
 */
import { redirect } from 'next/navigation'

interface SpeculationPageProps {
  params: Promise<{ locale: string }>
}

export default async function SpeculationPage({ params }: SpeculationPageProps) {
  const { locale } = await params
  redirect(`/${locale}/dashboard/speculate`)
}
