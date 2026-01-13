/**
 * Tool Card Component - Tradelia 2026
 * 
 * Card per tool con affordance chiara
 * - Tutta la card è clickable
 * - Pulsante "Apri" rende ovvio l'intento
 * - Riduce misclick e aumenta accessibilità
 * - Density-aware: responds to compact/comfortable mode (REQ 20.2)
 * - Help button: contextual help for tools (REQ 23.1)
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { RiskBadge, type RiskLevel } from './RiskBadge'
import { ToolPreview } from './ToolPreview'
import { SmartEmptyState } from './SmartEmptyState'
import { HelpButton } from './HelpButton'
import type { HelpModuleId } from '@/src/shared/lib/help-content'
import { CogIcon, ArrowRightIcon, StarIcon, ClockIcon } from '@/components/icons/TradeliaIcons'

interface ToolCardProps {
  // Tool info
  id: string
  title: string
  description: string
  category?: string
  riskLevel: RiskLevel
  
  // Status
  isNew?: boolean
  isFavorite?: boolean
  estimatedTime?: string // e.g. "5 min"
  
  // Actions
  onOpen: (toolId: string) => void
  onFavorite?: ((toolId: string) => void) | undefined
  
  // Customization
  icon?: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  
  // Help (REQ 23.1)
  helpModuleId?: HelpModuleId | string
}

export function ToolCard({
  id,
  title,
  description,
  category,
  riskLevel,
  isNew = false,
  isFavorite = false,
  estimatedTime,
  onOpen,
  onFavorite,
  icon,
  className = '',
  size = 'md',
  helpModuleId
}: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const t = useTranslations('common.toolCard')

  // Size classes now use density variables for responsive sizing
  const sizeClasses = {
    sm: 'density-card',
    md: 'density-card',
    lg: 'p-8' // Large keeps fixed padding for emphasis
  }

  const handleCardClick = () => {
    onOpen(id)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    onFavorite?.(id)
  }

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative bg-background border border-border/50 rounded-xl cursor-pointer
        card-hover-lift group min-h-[24px]
        hover:border-border focus-within:ring-2 focus-within:ring-primary/50
        ${sizeClasses[size]} ${className}
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
      aria-label={t('openToolLabel', { title })}
    >
      {/* Header - density-aware spacing */}
      <div className="flex items-start justify-between mb-[var(--density-item-gap)]">
        <div className="flex items-center density-gap">
          {/* Icon - density-aware sizing with min 24px for WCAG 2.5.8 */}
          <div className={`
            density-icon-box rounded-lg bg-primary/10 flex items-center justify-center
            transition-colors group-hover:bg-primary/15
          `}>
            {icon || <CogIcon className="density-icon text-primary" />}
          </div>
          
          {/* Title & Category */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors density-text-secondary">
                {title}
              </h3>
              {/* Help button - REQ 23.1 */}
              {helpModuleId && (
                <HelpButton 
                  moduleId={helpModuleId} 
                  size="sm" 
                  stopPropagation={true}
                  panelPosition="bottom"
                />
              )}
            </div>
            {category && (
              <p className="density-text-tertiary text-muted-foreground uppercase tracking-wider">
                {category}
              </p>
            )}
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex items-center gap-2">
          {/* New Badge */}
          {isNew && (
            <span className="px-2 py-1 density-text-tertiary font-medium bg-primary text-white rounded-full">
              {t('new')}
            </span>
          )}
          
          {/* Favorite Button - min 24px touch target */}
          {onFavorite && (
            <button
              onClick={handleFavoriteClick}
              className={`
                p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50
                min-w-[24px] min-h-[24px] flex items-center justify-center
                ${isFavorite 
                  ? 'text-warning bg-warning/10 hover:bg-warning/20' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
              aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            >
              <StarIcon className={`density-icon ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Description - density-aware text */}
      <p className="density-text-secondary text-muted-foreground mb-[var(--density-item-gap)] line-clamp-2">
        {description}
      </p>

      {/* Metadata - density-aware spacing */}
      <div className="flex items-center justify-between mb-[var(--density-item-gap)]">
        {/* Risk Badge */}
        <RiskBadge level={riskLevel} size="sm" showExplanation={false} />
        
        {/* Estimated Time */}
        {estimatedTime && (
          <div className="flex items-center gap-1 density-text-tertiary text-muted-foreground">
            <ClockIcon className="w-3 h-3" />
            <span>{estimatedTime}</span>
          </div>
        )}
      </div>

      {/* Action Button - density-aware with min 24px target */}
      <button
        onClick={(e) => {
          e.stopPropagation() // Prevent double-click
          handleCardClick()
        }}
        className={`
          w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
          font-medium density-text-secondary transition-all duration-200
          min-h-[var(--density-row-height)]
          ${isHovered 
            ? 'bg-primary text-white shadow-md' 
            : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
          }
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
        `}
      >
        <span>{t('openTool')}</span>
        <ArrowRightIcon className={`density-icon transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
      </button>

      {/* Hover Overlay Effect */}
      <div className={`
        absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent
        opacity-0 transition-opacity duration-200 pointer-events-none
        ${isHovered ? 'opacity-100' : ''}
      `} />
    </div>
  )
}

// Grid container for tool cards - density-aware gaps
export function ToolGrid({ 
  tools, 
  onToolOpen, 
  onToolFavorite,
  className = '',
  showPreviewTools = true // Ultra-Chicche: Show preview for upcoming tools
}: {
  tools: Array<{
    id: string
    title: string
    description: string
    category?: string
    riskLevel: RiskLevel
    isNew?: boolean
    isFavorite?: boolean
    estimatedTime?: string
    icon?: React.ReactNode
  }>
  onToolOpen: (toolId: string) => void
  onToolFavorite?: ((toolId: string) => void) | undefined
  className?: string
  showPreviewTools?: boolean
}) {
  const t = useTranslations('common.toolCard')
  
  if (tools.length === 0) {
    return (
      <div className="density-section-gap flex flex-col">
        {/* SmartEmptyState - REQ 22 compliant */}
        <SmartEmptyState
          icon={<CogIcon className="w-8 h-8 text-muted-foreground" />}
          title={t('noToolsAvailable')}
          description={t('toolsComingSoon')}
          action={{
            label: t('exploreOtherJourneys'),
            onClick: () => {
              // Navigate to dashboard home
              window.location.href = '/dashboard'
            }
          }}
          hint={t('toolsWillAppearHere')}
        />

        {/* Ultra-Chicche: Preview upcoming tools */}
        {showPreviewTools && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 density-section-gap">
            <ToolPreview
              toolId="risk-analyzer-pro"
              title="Risk Analyzer Pro"
              description="Analisi avanzata del rischio con machine learning per ottimizzare il tuo portafoglio"
              complexity="advanced"
              expectedFeatures={[
                "Analisi rischio real-time",
                "Correlazioni di mercato",
                "Stress testing automatico",
                "Alert personalizzati"
              ]}
              estimatedLaunch="Q2 2026"
            />
            
            <ToolPreview
              toolId="portfolio-optimizer"
              title="Portfolio Optimizer"
              description="Ottimizzazione automatica del portafoglio basata sui tuoi obiettivi e tolleranza al rischio"
              complexity="intermediate"
              expectedFeatures={[
                "Ribilanciamento automatico",
                "Ottimizzazione fiscale",
                "Diversificazione intelligente"
              ]}
              estimatedLaunch="Q3 2026"
            />
            
            <ToolPreview
              toolId="market-sentiment"
              title="Market Sentiment"
              description="Analisi del sentiment di mercato attraverso social media e news per timing ottimale"
              complexity="simple"
              expectedFeatures={[
                "Sentiment score real-time",
                "Trend analysis",
                "Signal di ingresso/uscita"
              ]}
              estimatedLaunch="Q4 2026"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 density-section-gap ${className}`}>
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          {...tool}
          onOpen={onToolOpen}
          onFavorite={onToolFavorite}
        />
      ))}
    </div>
  )
}

// Compact tool card for lists - density-aware with min 24px target
export function CompactToolCard({
  id,
  title,
  description,
  riskLevel,
  onOpen,
  className = ''
}: Pick<ToolCardProps, 'id' | 'title' | 'description' | 'riskLevel' | 'onOpen' | 'className'>) {
  return (
    <div
      onClick={() => onOpen(id)}
      className={`
        flex items-center density-gap density-list-item bg-background border border-border/50 rounded-lg
        cursor-pointer transition-all duration-200 hover:border-border hover:bg-muted/30
        focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(id)
        }
      }}
    >
      {/* Icon - density-aware with min 24px */}
      <div className="density-icon-box rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <CogIcon className="density-icon text-primary" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate density-text-secondary">{title}</h4>
        <p className="density-text-tertiary text-muted-foreground truncate">{description}</p>
      </div>
      
      {/* Risk & Action - min 24px touch target */}
      <div className="flex items-center gap-3">
        <RiskBadge level={riskLevel} size="sm" showExplanation={false} />
        <div className="min-w-[24px] min-h-[24px] flex items-center justify-center">
          <ArrowRightIcon className="density-icon text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}