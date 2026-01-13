/**
 * Crypto Sections Grid - Tradelia 2026
 * 
 * Pagina principale con le 4 sezioni educative.
 * Usa JourneyCard per design coerente con il resto dell'app.
 */

'use client'

import { useTranslations } from 'next-intl'
import { JourneyCard } from '@/src/shared/ui/JourneyCard'
import { ComplexityIndicator } from '@/src/shared/ui/ComplexityIndicator'
import { 
  CRYPTO_SECTIONS, 
  SECTION_ORDER,
  type SectionId 
} from '@/src/shared/config/crypto-sections'

interface CryptoSectionsGridProps {
  onSectionClick?: (sectionId: SectionId) => void
  completedSections?: SectionId[]
}

export function CryptoSectionsGrid({ 
  onSectionClick,
  completedSections = []
}: CryptoSectionsGridProps) {
  const t = useTranslations('sections')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {t('pageTitle')}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('pageSubtitle')}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {SECTION_ORDER.map((sectionId) => {
          const section = CRYPTO_SECTIONS[sectionId]
          const isCompleted = completedSections.includes(sectionId)
          
          // Map section color to JourneyCard accentColor
          const accentColorMap: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
            success: 'success',
            warning: 'warning', 
            orange: 'warning', // fallback to warning
            error: 'error'
          }
          const accentColor = accentColorMap[section.color] || 'primary'
          
          return (
            <JourneyCard
              key={sectionId}
              title={t(`${sectionId}.title`)}
              description={t(`${sectionId}.description`)}
              subtitle={t(`${sectionId}.subtitle`)}
              icon={<SectionIcon type={section.icon} />}
              accentColor={accentColor}
              onClick={() => onSectionClick?.(sectionId)}
              badge={
                <div className="flex items-center gap-3">
                  <ComplexityIndicator 
                    level={section.complexity}
                    size="sm"
                    showTooltip={false}
                  />
                  <span className="text-xs text-muted-foreground">
                    {t(`${sectionId}.complexity`)}
                  </span>
                  {isCompleted && (
                    <span className="text-xs text-success font-medium">
                      ✓ {t('ui.completed')}
                    </span>
                  )}
                </div>
              }
            >
              {/* Focus Areas */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('ui.focus')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {section.focusAreas.map((focus) => (
                    <span 
                      key={focus.id}
                      className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md"
                    >
                      {t(`${sectionId}.focus.${focus.id}`)}
                    </span>
                  ))}
                </div>
              </div>
            </JourneyCard>
          )
        })}
      </div>
    </div>
  )
}

// Icons
function SectionIcon({ type }: { type: string }) {
  const className = "w-6 h-6"
  
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
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </svg>
      )
  }
}
