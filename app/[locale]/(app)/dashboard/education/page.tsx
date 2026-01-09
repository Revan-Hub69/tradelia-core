/**
 * Education Page - Tradelia 2026
 */

import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

interface EducationPageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: EducationPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'dashboard' })
  
  return {
    title: t('education'),
    description: t('educationDescription')
  }
}

export default function EducationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Educazione</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Risorse educative per il trading crypto
        </p>
      </div>
      
      <div className="rounded border border-border/50 bg-background p-6">
        <p className="text-sm text-muted-foreground">
          Sezione Educazione in sviluppo...
        </p>
      </div>
    </div>
  )
}