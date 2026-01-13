/**
 * Coming Soon Section - Placeholder per sezioni in sviluppo
 */

'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { CRYPTO_SECTIONS, type SectionId } from '@/src/shared/config/crypto-sections'
import { ComplexityIndicator } from '@/src/shared/ui/ComplexityIndicator'

interface ComingSoonSectionProps {
  sectionId: SectionId
}

export function ComingSoonSection({ sectionId }: ComingSoonSectionProps) {
  const t = useTranslations('sections')
  const locale = useLocale()
  const section = CRYPTO_SECTIONS[sectionId]

  // Color mapping for section
  const sectionColors = {
    success: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
    error: { bg: 'bg-error/10', text: 'text-error', border: 'border-error/20' },
    info: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' }
  }
  const colors = sectionColors[section.color] || sectionColors.success

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-2xl ${colors.bg} flex items-center justify-center mb-6`}>
            <SectionIcon type={section.icon} className={`w-10 h-10 ${colors.text}`} />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {t(`${sectionId}.title`)}
          </h1>

          {/* Complexity */}
          <div className="flex items-center gap-2 mb-6">
            <ComplexityIndicator level={section.complexity} size="sm" showTooltip={false} />
            <span className="text-sm text-muted-foreground">{t(`${sectionId}.complexity`)}</span>
          </div>

          {/* Coming Soon Badge */}
          <div className="flex items-center gap-2 px-6 py-3 bg-muted/50 rounded-full border border-border/50 mb-6">
            <ClockIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-base font-medium text-muted-foreground">
              {t('ui.comingSoon')}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
            {t(`${sectionId}.description`)}
          </p>

          {/* Focus Areas Preview */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {section.focusAreas.map((focus) => (
              <span 
                key={focus.id}
                className="px-3 py-1.5 text-sm bg-muted/30 text-muted-foreground rounded-lg"
              >
                {t(`${sectionId}.focus.${focus.id}`)}
              </span>
            ))}
          </div>

          {/* Back to Dashboard */}
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Torna alla Dashboard
          </Link>
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}

// Icons
function SectionIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'wallet':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </svg>
      )
    case 'percent':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'trending':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      )
    case 'zap':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      )
    default:
      return null
  }
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}
