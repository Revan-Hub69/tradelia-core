/**
 * Portfolio Page - Tradelia 2026
 */

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

interface PortfolioPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard' })
  
  return {
    title: t('portfolio'),
    description: t('portfolioDescription')
  }
}

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Portfolio</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestisci il tuo portafoglio crypto
        </p>
      </div>
      
      <div className="rounded border border-border/50 bg-background p-6">
        <p className="text-sm text-muted-foreground">
          Sezione Portfolio in sviluppo...
        </p>
      </div>
    </div>
  )
}