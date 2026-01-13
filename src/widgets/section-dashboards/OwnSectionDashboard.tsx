/**
 * Own Section Dashboard - Possedere Criptovalute
 * 
 * Sezione educativa che analizza:
 * - Cosa significa possedere cripto (custodia, controllo, responsabilità)
 * - Differenza tra detenere, usare, lasciare a terzi
 * - Cosa può andare storto anche con piccole cifre
 * 
 * Complessità: Bassa – Media
 */

'use client'

import { useTranslations } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { ComplexityIndicator } from '@/src/shared/ui/ComplexityIndicator'
import { CRYPTO_SECTIONS } from '@/src/shared/config/crypto-sections'

export function OwnSectionDashboard() {
  const t = useTranslations('sections')
  const section = CRYPTO_SECTIONS.own

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
              <WalletIcon className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                {t('own.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('own.subtitle')}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <ComplexityIndicator level={section.complexity} size="sm" />
                <span className="text-sm text-muted-foreground">
                  {t('own.complexity')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8 pb-8">
          {/* What it analyzes */}
          <section className="section-frame p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t('own.whatItAnalyzes')}
            </h2>
            <ul className="space-y-3">
              {(['whatItAnalyzesList.0', 'whatItAnalyzesList.1', 'whatItAnalyzesList.2'] as const).map((key, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center flex-shrink-0 text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-muted-foreground">
                    {t(`own.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Focus Areas */}
          <section className="section-frame p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t('ui.focus')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.focusAreas.map((focus) => (
                <div 
                  key={focus.id}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <FocusIcon type={focus.id} className="w-5 h-5 text-success mb-2" />
                  <h3 className="font-medium text-foreground">
                    {t(`own.focus.${focus.id}`)}
                  </h3>
                </div>
              ))}
            </div>
          </section>

          {/* Coming Soon - Modules */}
          <section className="section-frame p-6 border-dashed">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <BookIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Moduli educativi in arrivo
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                I contenuti educativi per questa sezione sono in fase di sviluppo. 
                Tornerai qui per imparare tutto su custodia, controllo e responsabilità.
              </p>
            </div>
          </section>
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}

// Icons
function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
  )
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function FocusIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'custody':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      )
    case 'errors':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      )
    case 'limits':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      )
    default:
      return null
  }
}
