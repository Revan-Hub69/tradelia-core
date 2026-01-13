/**
 * Redirect: /passive → /yield
 */
import { redirect } from 'next/navigation'

interface PassivePageProps {
  params: Promise<{ locale: string }>
}

export default async function PassivePage({ params }: PassivePageProps) {
  const { locale } = await params
  redirect(`/${locale}/dashboard/yield`)
}
