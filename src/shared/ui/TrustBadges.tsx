/**
 * TrustBadges - Ultra-Chicca 2026 - STATIC VERSION
 * 
 * Trust Badges & SSL Indicators
 * - SSL Secure, Zero Tracking, Educational Only
 * - COMPLETELY STATIC - NO ANIMATIONS OR MOVEMENTS
 * - Discrete placement with enhanced visual hierarchy
 * - Builds user confidence and compliance signaling
 */

'use client'

import { useState, useEffect } from 'react'
import { 
  ShieldIcon, 
  CheckIcon, 
  InfoIcon,
  GraduationCapIcon
} from '@/components/icons/TradeliaIcons'

export interface TrustBadgesProps {
  placement?: 'header' | 'footer' | 'sidebar'
  variant?: 'minimal' | 'detailed' | 'compact' | 'premium' | 'micro'
  showTooltips?: boolean
  animated?: boolean
  className?: string
}

interface BadgeConfig {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  status: 'active' | 'verified' | 'compliant'
  color: string
  accentColor: string
  pulseColor: string
}

export function TrustBadges({ 
  placement = 'footer',
  variant = 'detailed',
  showTooltips = true,
  className = ''
}: TrustBadgesProps) {
  // Use hardcoded strings for now to avoid translation issues
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const badges: BadgeConfig[] = [
    {
      id: 'ssl',
      icon: ShieldIcon,
      label: 'SSL Sicuro',
      description: 'Connessione crittografata e sicura',
      status: 'verified',
      color: 'text-emerald-600 dark:text-emerald-400',
      accentColor: 'bg-emerald-500/10 border-emerald-500/20',
      pulseColor: 'bg-emerald-500'
    },
    {
      id: 'privacy',
      icon: ShieldIcon,
      label: 'Privacy Garantita',
      description: 'Nessun tracking, nessun cookie',
      status: 'compliant',
      color: 'text-blue-600 dark:text-blue-400',
      accentColor: 'bg-blue-500/10 border-blue-500/20',
      pulseColor: 'bg-blue-500'
    },
    {
      id: 'educational',
      icon: GraduationCapIcon,
      label: 'Solo Educativo',
      description: 'Nessun consiglio di investimento',
      status: 'active',
      color: 'text-amber-600 dark:text-amber-400',
      accentColor: 'bg-amber-500/10 border-amber-500/20',
      pulseColor: 'bg-amber-500'
    }
  ]

  // Check if SSL is actually active
  const isSSL = typeof window !== 'undefined' && window.location.protocol === 'https:'

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'text-xs gap-2'
      case 'compact':
        return 'text-xs gap-2'
      case 'micro':
        return 'text-[10px] gap-1'
      case 'premium':
        return 'text-sm gap-4'
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
        return 'flex-col items-start space-y-1'
      case 'footer':
      default:
        return 'justify-start flex-wrap gap-y-2'
    }
  }

  if (!mounted) {
    return <div className={`flex items-center ${getVariantClasses()} ${getPlacementClasses()} ${className}`} />
  }

  return (
    <div className={`flex items-center ${getVariantClasses()} ${getPlacementClasses()} ${className} trust-badges-static`}>
      {badges.map((badge) => {
        const Icon = badge.icon
        const isActive = badge.id === 'ssl' ? isSSL : true
        
        return (
          <div
            key={badge.id}
            className="relative trust-badge-no-select"
            onMouseEnter={() => {
              if (showTooltips) {
                setHoveredBadge(badge.id)
              }
            }}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <div 
              className={`
                relative flex items-center
                ${variant === 'micro' 
                  ? 'gap-1 px-1.5 py-0.5 rounded-md border backdrop-blur-sm' 
                  : variant === 'compact'
                  ? 'gap-1.5 px-2 py-1 rounded-lg border backdrop-blur-sm'
                  : 'gap-2 px-3 py-2 rounded-xl border backdrop-blur-sm'
                }
                ${isActive ? badge.accentColor : 'bg-muted/30 border-border/50'}
                ${placement === 'sidebar' ? 'w-full' : ''}
                trust-badge-no-select
              `}
              title={showTooltips ? badge.description : undefined}
            >
              {/* Status Indicator - STATIC */}
              {variant !== 'minimal' && variant !== 'micro' && isActive && (
                <div className="relative">
                  <div className={`
                    ${variant === 'compact' ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full ${badge.pulseColor}
                  `} />
                </div>
              )}
              
              {/* Icon */}
              <Icon className={`
                ${variant === 'minimal' || variant === 'micro' ? 'w-3 h-3' : variant === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'}
                ${isActive ? badge.color : 'text-muted-foreground'}
                trust-badge-no-select
              `} />
              
              {/* Label */}
              {variant !== 'minimal' && variant !== 'micro' && (
                <span className={`
                  font-medium whitespace-nowrap
                  ${isActive ? badge.color : 'text-muted-foreground'}
                  ${variant === 'compact' ? 'text-xs' : placement === 'sidebar' ? 'text-xs' : ''}
                  trust-badge-no-select
                `}>
                  {badge.label}
                </span>
              )}
              
              {/* Verification Check - STATIC */}
              {variant === 'detailed' && isActive && (
                <CheckIcon className={`
                  w-3 h-3 ${badge.color} opacity-80
                  trust-badge-no-select
                `} />
              )}

              {/* Info Icon Indicator */}
              {showTooltips && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                  <InfoIcon className="w-2.5 h-2.5 text-primary/70" />
                </div>
              )}
            </div>

            {/* STATIC Tooltip - NO ANIMATIONS */}
            {showTooltips && hoveredBadge === badge.id && (
              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3">
                <div className="relative">
                  <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl p-3 w-72 max-w-[calc(100vw-2rem)]">
                    <div className="flex items-start gap-2">
                      <div className={`p-1.5 rounded-lg ${badge.accentColor}`}>
                        <Icon className={`w-3.5 h-3.5 ${badge.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm mb-1 flex items-center gap-2">
                          {badge.label}
                          {isActive && (
                            <CheckIcon className={`w-3 h-3 ${badge.color}`} />
                          )}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                          {badge.description}
                        </p>
                        
                        {/* SSL Status */}
                        {badge.id === 'ssl' && (
                          <div className={`
                            flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium
                            ${isSSL 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }
                          `}>
                            {isSSL ? (
                              <>
                                <CheckIcon className="w-3 h-3" />
                                <span>SSL Verificato</span>
                              </>
                            ) : (
                              <>
                                <InfoIcon className="w-3 h-3" />
                                <span>Non Sicuro</span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Trust Indicator */}
                        {badge.id !== 'ssl' && (
                          <div className={`
                            flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium
                            ${badge.accentColor} ${badge.color}
                          `}>
                            <div className={`w-1.5 h-1.5 rounded-full ${badge.pulseColor}`} />
                            <span>
                              {badge.id === 'privacy' ? 'Privacy garantita' : 'Modalità educativa'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Tooltip Arrow - STATIC */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1.5 w-3 h-3 bg-background/95 border-l border-b border-border/50 rotate-45" />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Specialized trust badge components - ALL STATIC
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
      variant="premium"
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

// Enhanced Security Status - STATIC
export function SecurityStatus({ className = '' }: { className?: string }) {
  const isSSL = typeof window !== 'undefined' && window.location.protocol === 'https:'
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className={`
          w-3 h-3 rounded-full
          ${isSSL ? 'bg-emerald-500' : 'bg-amber-500'}
        `} />
      </div>
      <span className={`
        text-sm font-medium
        ${isSSL ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}
      `}>
        {isSSL ? 'Sicuro' : 'Non sicuro'}
      </span>
    </div>
  )
}

// Premium Compliance Footer - STATIC
export function ComplianceFooter({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center space-y-6 ${className}`}>
      <div className="relative">
        <TrustBadges variant="premium" />
      </div>
      
      <div className="space-y-3 text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-2 font-medium">
          <ShieldIcon className="w-3 h-3 text-primary" />
          <span>Conforme GDPR</span>
        </div>
        <div className="flex items-center justify-center gap-2 font-medium">
          <GraduationCapIcon className="w-3 h-3 text-amber-500" />
          <span>Solo Educativo</span>
        </div>
        <p className="opacity-75 max-w-md mx-auto leading-relaxed">
          Nessun consiglio di investimento. Solo contenuti educativi.
        </p>
      </div>
    </div>
  )
}