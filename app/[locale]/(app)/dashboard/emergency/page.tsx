/**
 * Redirect: /emergency → /own
 */
import { redirect } from 'next/navigation'

interface EmergencyPageProps {
  params: Promise<{ locale: string }>
}

export default async function EmergencyPage({ params }: EmergencyPageProps) {
  const { locale } = await params
  redirect(`/${locale}/dashboard/own`)
}
