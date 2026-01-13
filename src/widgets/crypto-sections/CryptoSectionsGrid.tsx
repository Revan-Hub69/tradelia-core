/**
 * Crypto Sections Grid - Tradelia 2026
 * 
 * Pagina principale con le 4 sezioni educative.
 * Ogni sezione analizza un modo diverso di rapportarsi alle criptovalute.
 * 
 * Design: Card con complessità visibile, focus areas, CTA per iniziare
 */

'use client'

import { useTranslations } from 'next-intl'
import { 
  CRYPTO_SECTIONS, 
  SECTION_ORDER,
  type SectionId 
} from '@/src/shared/config/crypto-sections'
import { ComplexityIndicator } from '@/src/shared/ui/ComplexityIndicator'

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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-enterprise-primary mb-3">
          {t('pageTitle')}
        </h1>
        <p className="text-enterprise-secondary leading-relaxed">
          {t('pageSubtitle')}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECTION_ORDER.map((sectionId, index) => {
          const isCompleted = completedSections.includes(sectionId)
          const isLocked = index > 0 && !completedSections.includes(SECTION_ORDER[index - 1] as SectionId)
          
          return (
            <SectionCard
              key={sectionId}
              sectionId={sectionId}
              order={index + 1}
              isCompleted={isCompleted}
              isLocked={isLocked}
              onClick={() => !isLocked && onSectionClick?.(sectionId)}
              t={t}
            />
          )
        })}
      </div>
    </div>
  )
}

interface SectionCardProps {
  sectionId: SectionId
  order: number
  isCompleted: boolean
  isLocked: boolean
  onClick: () => void
  t: ReturnType<typeof useTranslations>
}

function SectionCard({ 
  sectionId, 
  order, 
  isCompleted, 
  isLocked, 
  onClick,
  t 
}: SectionCardProps) {
  const section = CRYPTO_SECTIONS[sectionId]
  
  const colorClasses = {
    success: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', icon: 'text-emerald-500' },
    warning: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', icon: 'text-amber-500' },
    orange: { bg: 'bg-orange-500/5', border: 'border-orange-500/20', icon: 'text-orange-500' },
    error: { bg: 'bg-red-500/5', border: 'border-red-500/20', icon: 'text-red-500' }
  } as const
  
  const colors = colorClasses[section.color as keyof typeof colorClasses] ?? colorClasses.success

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        relative w-full text-left p-6 rounded-2xl border-2 transition-all duration-200
        ${isLocked 
          ? 'opacity-50 cursor-not-allowed border-border/30 bg-muted/20' 
          : `${colors.border} ${colors.bg} hover:shadow-lg hover:scale-[1.01] cursor-pointer`
        }
        ${isCompleted ? 'ring-2 ring-success/30' : ''}
      `}
    >
      {/* Order badge */}
      <div className={`
        absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center
        text-sm font-bold
        ${isCompleted 
          ? 'bg-success text-white' 
          : isLocked 
            ? 'bg-muted text-muted-foreground'
            : `${colors.bg} ${colors.icon} border-2 ${colors.border}`
        }
      `}>
        {isCompleted ? '✓' : order}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-enterprise-primary mb-1">
              {t(`${sectionId}.title`)}
            </h3>
            <p className="text-sm text-enterprise-secondary">
              {t(`${sectionId}.subtitle`)}
            </p>
          </div>
          <SectionIcon type={section.icon} className={`w-8 h-8 ${colors.icon} flex-shrink-0`} />
        </div>

        {/* Description */}
        <p className="text-sm text-enterprise-body leading-relaxed">
          {t(`${sectionId}.description`)}
        </p>

        {/* Complexity */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t('ui.complexity')}:</span>
          <ComplexityIndicator level={section.complexity} showLabel={false} size="sm" />
          <span className="text-xs font-medium text-enterprise-secondary">
            {t(`${sectionId}.complexity`)}
          </span>
        </div>

        {/* Focus areas */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t('ui.focus')}
          </span>
          <div className="flex flex-wrap gap-2">
            {section.focusAreas.map((focus) => (
              <span 
                key={focus.id}
                className="px-2.5 py-1 text-xs bg-background/80 text-enterprise-secondary rounded-full border border-border/50"
              >
                {t(`${sectionId}.focus.${focus.id}`)}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          {isLocked ? (
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <LockIcon className="w-3.5 h-3.5" />
              {t('ui.locked')}
            </span>
          ) : isCompleted ? (
            <span className="text-xs text-success font-medium flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5" />
              {t('ui.completed')}
            </span>
          ) : section.moduleCount > 0 ? (
            <span className="text-xs text-primary font-medium">
              {t('ui.startLearning')} →
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              {t('ui.comingSoon')}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

// Icons
function SectionIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    wallet: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>
    ),
    percent: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    trending: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    zap: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    )
  }
  return <>{icons[type] || icons.wallet}</>
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}
