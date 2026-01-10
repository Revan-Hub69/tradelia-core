/**
 * TrustBadges - Ultra-Chicca 2026
 * 
 * Trust Badges & SSL Indicators
 * - SSL Secure, Zero Tracking, Educational Only
 * - Premium design with subtle animations and effects
 * - Discrete placement with enhanced visual hierarchy
 * - Hover explanations with smooth transitions
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
  animated = true,
  className = ''
}: TrustBadgesProps) {
  // Use hardcoded strings for now to avoid translation issues
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Smart tooltip positioning to avoid viewport overflow
  const handleTooltipPosition = (element: HTMLElement) => {
    if (!element) return

    const rect = element.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Check if tooltip would overflow
    const tooltipWidth = 320 // max-w-xs ≈ 320px
    const tooltipHeight = 200 // estimated height
    
    let position: 'top' | 'bottom' | 'left' | 'right' = 'top'
    
    if (placement === 'sidebar') {
      // For sidebar, prefer right if space available, otherwise left
      if (rect.right + tooltipWidth < viewportWidth) {
        position = 'right'
      } else {
        position = 'left'
      }
    } else {
      // For footer/header, prefer top if space available
      if (rect.top - tooltipHeight > 0) {
        position = 'top'
      } else if (rect.bottom + tooltipHeight < viewportHeight) {
        position = 'bottom'
      } else if (rect.left - tooltipWidth > 0) {
        position = 'left'
      } else {
        position = 'right'
      }
    }
    
    setTooltipPosition(position)
  }

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
    <div className={`flex items-center ${getVariantClasses()} ${getPlacementClasses()} ${className}`}>
      {badges.map((badge, index) => {
        const Icon = badge.icon
        const isActive = badge.id === 'ssl' ? isSSL : true
        const isHovered = hoveredBadge === badge.id
        
        return (
          <div
            key={badge.id}
            className="relative group"
            onMouseEnter={(e) => {
              if (showTooltips) {
                setHoveredBadge(badge.id)
                handleTooltipPosition(e.currentTarget)
              }
            }}
            onMouseLeave={() => setHoveredBadge(null)}
            style={{
              animationDelay: animated ? `${index * 150}ms` : '0ms'
            }}
          >
            <div 
              className={`
                relative flex items-center transition-all duration-300 cursor-help group-hover:scale-105
                ${variant === 'micro' 
                  ? 'gap-1 px-1.5 py-0.5 rounded-md border backdrop-blur-sm' 
                  : variant === 'compact'
                  ? 'gap-1.5 px-2 py-1 rounded-lg border backdrop-blur-sm'
                  : 'gap-2 px-3 py-2 rounded-xl border backdrop-blur-sm'
                }
                ${isActive ? badge.accentColor : 'bg-muted/30 border-border/50'}
                ${variant === 'premium' ? 'trust-badge-premium shadow-sm hover:shadow-md' : ''}
                ${placement === 'sidebar' ? 'w-full' : ''}
                ${animated ? `animate-in fade-in slide-in-from-bottom-2 trust-badge-stagger-${index + 1}` : ''}
                ${isHovered ? 'ring-2 ring-offset-2 ring-offset-background' : ''}
                ${isActive && isHovered ? `ring-${badge.color.split('-')[1]}-500/30` : ''}
              `}
              title={showTooltips ? badge.description : undefined}
            >
              {/* Status Indicator */}
              {variant !== 'minimal' && variant !== 'micro' && isActive && (
                <div className="relative">
                  <div className={`
                    ${variant === 'compact' ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full ${badge.pulseColor}
                    ${animated ? 'animate-pulse' : ''}
                  `} />
                  {animated && (
                    <div className={`
                      absolute inset-0 ${variant === 'compact' ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full ${badge.pulseColor} opacity-75
                      trust-badge-pulse-indicator
                    `} />
                  )}
                </div>
              )}
              
              {/* Icon */}
              <Icon className={`
                ${variant === 'minimal' || variant === 'micro' ? 'w-3 h-3' : variant === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'}
                ${isActive ? badge.color : 'text-muted-foreground'}
                transition-all duration-300
                ${isHovered ? 'scale-110' : ''}
              `} />
              
              {/* Label */}
              {variant !== 'minimal' && variant !== 'micro' && (
                <span className={`
                  font-medium whitespace-nowrap transition-all duration-300
                  ${isActive ? badge.color : 'text-muted-foreground'}
                  ${variant === 'compact' ? 'text-xs' : placement === 'sidebar' ? 'text-xs' : ''}
                `}>
                  {badge.label}
                </span>
              )}
              
              {/* Verification Check */}
              {variant === 'detailed' && isActive && (
                <CheckIcon className={`
                  w-3 h-3 ${badge.color} opacity-80
                  transition-all duration-300
                  ${isHovered ? 'scale-110 opacity-100' : ''}
                `} />
              )}

              {/* Premium Gradient Overlay */}
              {variant === 'premium' && isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}

              {/* Info Icon Indicator */}
              {showTooltips && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                  <InfoIcon className="w-2.5 h-2.5 text-primary/70" />
                </div>
              )}
            </div>

            {/* Enhanced Tooltip with Smart Positioning */}
            {showTooltips && hoveredBadge === badge.id && (
              <div className={`
                absolute z-50 transition-all duration-300
                ${tooltipPosition === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-3' : ''}
                ${tooltipPosition === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 mt-3' : ''}
                ${tooltipPosition === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-3' : ''}
                ${tooltipPosition === 'right' ? 'left-full top-1/2 transform -translate-y-1/2 ml-3' : ''}
                md:relative md:z-50
              `}>
                <div className="relative">
                  <div className={`
                    bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl p-3 w-72 max-w-[calc(100vw-2rem)]
                    ${tooltipPosition === 'left' || tooltipPosition === 'right' ? 'trust-badge-tooltip-left' : 'trust-badge-tooltip-up'}
                    ${variant === 'premium' ? 'shadow-2xl' : ''}
                    md:trust-badge-tooltip-mobile
                  `}>
                    <div className="flex items-start gap-2">
                      <div className={`
                        p-1.5 rounded-lg ${badge.accentColor}
                        ${animated ? 'animate-pulse' : ''}
                      `}>
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
                  
                  {/* Tooltip Arrow with Smart Positioning */}
                  <div className={`
                    absolute w-3 h-3 bg-background/95 border-l border-b border-border/50 rotate-45
                    ${tooltipPosition === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1.5' : ''}
                    ${tooltipPosition === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1.5 rotate-[225deg]' : ''}
                    ${tooltipPosition === 'left' ? 'left-full top-1/2 -translate-y-1/2 translate-x-1.5 rotate-[135deg]' : ''}
                    ${tooltipPosition === 'right' ? 'right-full top-1/2 -translate-y-1/2 -translate-x-1.5 rotate-[315deg]' : ''}
                  `} />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Specialized trust badge components with enhanced designs
export function HeaderTrustBadges(props: Omit<TrustBadgesProps, 'placement'>) {
  return (
    <TrustBadges 
      placement="header" 
      variant="minimal"
      animated={true}
      {...props} 
    />
  )
}

export function FooterTrustBadges(props: Omit<TrustBadgesProps, 'placement'>) {
  return (
    <TrustBadges 
      placement="footer" 
      variant="premium"
      animated={true}
      {...props} 
    />
  )
}

export function SidebarTrustBadges(props: Omit<TrustBadgesProps, 'placement'>) {
  return (
    <TrustBadges 
      placement="sidebar" 
      variant="compact"
      animated={true}
      {...props} 
    />
  )
}

// Enhanced Security Status with animations
export function SecurityStatus({ className = '' }: { className?: string }) {
  const isSSL = typeof window !== 'undefined' && window.location.protocol === 'https:'
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className={`
          w-3 h-3 rounded-full transition-all duration-300
          ${isSSL ? 'bg-emerald-500' : 'bg-amber-500'}
        `} />
        <div className={`
          absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-75
          ${isSSL ? 'bg-emerald-500' : 'bg-amber-500'}
        `} />
      </div>
      <span className={`
        text-sm font-medium transition-all duration-300
        ${isSSL ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}
      `}>
        {isSSL ? 'Sicuro' : 'Non sicuro'}
      </span>
    </div>
  )
}

// Premium Compliance Footer with enhanced design
export function ComplianceFooter({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center space-y-6 ${className}`}>
      <div className="relative">
        <TrustBadges variant="premium" animated={true} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-xl" />
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