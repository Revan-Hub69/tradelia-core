/**
 * TrustBadges - Ultra-Chicca 2026
 * 
 * Trust Badges & SSL Indicators
 * - SSL Secure, Privacy First, Educational Only
 * - Discrete placement in header/footer
 * - Hover explanations for transparency
 * - Builds user confidence and compliance signaling
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { 
  ShieldIcon, 
  CheckIcon, 
  InfoIcon,
  GraduationCapIcon,
  EyeIcon
} from '@/components/icons/TradeliaIcons'

export interface TrustBadgesProps {
  placement?: 'header' | 'footer' | 'sidebar'
  variant?: 'minimal' | 'detailed' | 'compact'
  showTooltips?: boolean
  className?: string
}

interface BadgeConfig {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  status: 'active' | 'verified' | 'compliant'
  color: string
}

export function TrustBadges({ 
  placement = 'footer',
  variant = 'detailed',
  showTooltips = true,
  className = ''
}: TrustBadgesProps) {
  const t = useTranslations('common.trustBadges')
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)

  const badges: BadgeConfig[] = [
    {
      id: 'ssl',
      icon: ShieldIcon,
      label: t('ssl.label'),
      description: t('ssl.description'),
      status: 'verified',
      color: 'text-success'
    },
    {
      id: 'privacy',
      icon: EyeIcon,
      label: t('privacy.label'),
      description: t('privacy.description'),
      status: 'compliant',
      color: 'text-primary'
    },
    {
      id: 'educational',
      icon: GraduationCapIcon,
      label: t('educational.label'),
      description: t('educational.description'),
      status: 'active',
      color: 'text-warning'
    }
  ]

  // Check if SSL is actually active
  const isSSL = typeof window !== 'undefined' && window.location.protocol === 'https:'

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'text-xs gap-3'
      case 'compact':
        return 'text-xs gap-2'
      case 'detailed':
      default:
        return 'text-sm gap-4'
    }
  }

  const getPlacementClasses = () => {
    switch (placement) {
      case 'header':
        return 'justify-end'
      case 'sidebar':
        return 'flex-col items-start'
      case 'footer':
      default:
        return 'justify-center'
    }
  }

  return (
    <div className={`flex items-center ${getVariantClasses()} ${getPlacementClasses()} ${className}`}>
      {badges.map((badge) => {
        const Icon = badge.icon
        const isActive = badge.id === 'ssl' ? isSSL : true
        
        return (
          <div
            key={badge.id}
            className="relative"
            onMouseEnter={() => showTooltips && setHoveredBadge(badge.id)}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <div 
              className={`
                flex items-center gap-1.5 transition-all duration-200 cursor-help
                ${isActive ? badge.color : 'text-muted-foreground'}
                ${variant === 'minimal' ? 'hover:opacity-80' : 'hover:scale-105'}
                ${placement === 'sidebar' ? 'py-1' : ''}
              `}
              title={showTooltips ? badge.description : undefined}
            >
              <Icon className={`
                ${variant === 'minimal' ? 'w-3 h-3' : 'w-4 h-4'}
                ${isActive ? badge.color : 'text-muted-foreground'}
              `} />
              
              {variant !== 'minimal' && (
                <span className="font-medium whitespace-nowrap">
                  {badge.label}
                </span>
              )}
              
              {variant === 'detailed' && isActive && (
                <div className={`
                  w-2 h-2 rounded-full flex-shrink-0
                  ${badge.status === 'verified' ? 'bg-success' : ''}
                  ${badge.status === 'compliant' ? 'bg-primary' : ''}
                  ${badge.status === 'active' ? 'bg-warning' : ''}
                `} />
              )}
            </div>

            {/* Tooltip */}
            {showTooltips && hoveredBadge === badge.id && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                <div className="bg-background border border-border rounded-lg shadow-lg p-3 max-w-xs animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 ${badge.color} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-1">
                        {badge.label}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {badge.description}
                      </p>
                      {badge.id === 'ssl' && (
                        <div className="mt-2 flex items-center gap-1">
                          {isSSL ? (
                            <>
                              <CheckIcon className="w-3 h-3 text-success" />
                              <span className="text-xs text-success font-medium">
                                {t('ssl.verified')}
                              </span>
                            </>
                          ) : (
                            <>
                              <InfoIcon className="w-3 h-3 text-warning" />
                              <span className="text-xs text-warning font-medium">
                                {t('ssl.notSecure')}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-background border-r border-b border-border rotate-45" />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Specialized trust badge components
export function HeaderTrustBadges(props: Omit<TrustBadgesProps, 'placement'>) {
  return (
    <TrustBadges 
      placement="header" 
      variant="minimal"
      {...props} 
    />
  )
}

export function FooterTrustBadges(props: Omit<TrustBadgesProps, 'placement'>) {
  return (
    <TrustBadges 
      placement="footer" 
      variant="detailed"
      {...props} 
    />
  )
}

export function SidebarTrustBadges(props: Omit<TrustBadgesProps, 'placement'>) {
  return (
    <TrustBadges 
      placement="sidebar" 
      variant="compact"
      {...props} 
    />
  )
}

// Security status indicator
export function SecurityStatus({ className = '' }: { className?: string }) {
  const t = useTranslations('common.trustBadges')
  const isSSL = typeof window !== 'undefined' && window.location.protocol === 'https:'
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`
        w-2 h-2 rounded-full
        ${isSSL ? 'bg-success' : 'bg-warning'}
      `} />
      <span className={`
        text-xs font-medium
        ${isSSL ? 'text-success' : 'text-warning'}
      `}>
        {isSSL ? t('secure') : t('notSecure')}
      </span>
    </div>
  )
}

// Compliance footer
export function ComplianceFooter({ className = '' }: { className?: string }) {
  const t = useTranslations('common.trustBadges')
  
  return (
    <div className={`text-center space-y-2 ${className}`}>
      <TrustBadges variant="detailed" />
      <div className="text-xs text-muted-foreground space-y-1">
        <p>{t('compliance.gdpr')}</p>
        <p>{t('compliance.educational')}</p>
        <p>{t('compliance.noAdvice')}</p>
      </div>
    </div>
  )
}