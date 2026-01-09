/**
 * Verify Page - Tradelia 2026
 */

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

interface VerifyPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard' })
  
  return {
    title: t('verify'),
    description: t('verifyDescription')
  }
}

export default function VerifyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Verifica</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verifica la coerenza dei tuoi strumenti
        </p>
      </div>
      
      <div className="rounded border border-border/50 bg-background p-6">
        <p className="text-sm text-muted-foreground">
          Sezione Verifica in sviluppo...
        </p>
      </div>
    </div>
  )
}