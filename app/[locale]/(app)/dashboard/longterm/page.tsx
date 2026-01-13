/**
 * Redirect: /longterm → /invest
 */
import { redirect } from 'next/navigation'

interface LongtermPageProps {
  params: Promise<{ locale: string }>
}

export default async function LongtermPage({ params }: LongtermPageProps) {
  const { locale } = await params
  redirect(`/${locale}/dashboard/invest`)
}
