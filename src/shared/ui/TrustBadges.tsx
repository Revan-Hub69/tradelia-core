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
  GraduationCapIcon,
  CloseIcon
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
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [clickedBadge, setClickedBadge] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Cleanup timeout on unmount
    return () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout)
      }
      window.removeEventListener('resize', checkMobile)
    }
  }, [tooltipTimeout])

  // Handle tooltip with delay to prevent flickering
  const handleMouseEnter = (badgeId: string) => {
    if (isMobile) return // Skip hover on mobile
    
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout)
      setTooltipTimeout(null)
    }
    if (showTooltips) {
      setHoveredBadge(badgeId)
    }
  }

  const handleMouseLeave = () => {
    if (isMobile) return // Skip hover on mobile
    
    // Longer delay to allow moving to tooltip
    const timeout = setTimeout(() => {
      setHoveredBadge(null)
    }, 300) // Increased from 150ms to 300ms
    setTooltipTimeout(timeout)
  }

  const handleTooltipEnter = () => {
    if (isMobile) return
    
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout)
      setTooltipTimeout(null)
    }
  }

  const handleTooltipLeave = () => {
    if (isMobile) return
    
    setHoveredBadge(null)
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout)
      setTooltipTimeout(null)
    }
  }

  // Mobile-specific handlers
  const handleMobileClick = (e: React.MouseEvent, badgeId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isMobile || !showTooltips) return
    
    if (clickedBadge === badgeId) {
      // Close if already open
      setClickedBadge(null)
      setHoveredBadge(null)
    } else {
      // Open new tooltip
      setClickedBadge(badgeId)
      setHoveredBadge(badgeId)
    }
  }

  // Close tooltip when clicking outside (mobile)
  useEffect(() => {
    if (!isMobile || !clickedBadge) return
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('.trust-badge-container')) {
        setClickedBadge(null)
        setHoveredBadge(null)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobile, clickedBadge])

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
        return 'justify-center flex-wrap gap-2' // Better mobile layout
    }
  }

  if (!mounted) {
    return (
      <div className={`flex items-center ${getVariantClasses()} ${getPlacementClasses()} ${className}`}>
        {/* Skeleton loading per evitare hydration mismatch */}
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`
              flex items-center
              ${variant === 'compact' ? 'gap-1.5 px-2 py-1 rounded-lg' : 'gap-2 px-3 py-2 rounded-xl'}
              bg-muted/30 border border-border/50 backdrop-blur-sm
            `}
          >
            <div className="w-3.5 h-3.5 bg-muted rounded" />
            {variant !== 'minimal' && variant !== 'micro' && (
              <div className="w-16 h-3 bg-muted rounded" />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex items-center ${getVariantClasses()} ${getPlacementClasses()} ${className} trust-badges-static`}>
      {badges.map((badge) => {
        const Icon = badge.icon
        const isActive = badge.id === 'ssl' ? isSSL : true
        
        return (
          <div
            key={badge.id}
            className="relative trust-badge-no-select trust-badge-container"
            onMouseEnter={() => handleMouseEnter(badge.id)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleMobileClick(e, badge.id)}
            role={isMobile ? "button" : undefined}
            tabIndex={isMobile ? 0 : undefined}
            onKeyDown={isMobile ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                // Create a synthetic mouse event for keyboard activation
                const syntheticEvent = {
                  preventDefault: () => {},
                  stopPropagation: () => {}
                } as React.MouseEvent
                handleMobileClick(syntheticEvent, badge.id)
              }
            } : undefined}
            aria-label={isMobile ? `Mostra informazioni su ${badge.label}` : undefined}
          >
            {/* Invisible hover area to prevent tooltip closing */}
            {showTooltips && hoveredBadge === badge.id && !isMobile && (
              <div className={`
                absolute z-40 
                ${placement === 'sidebar' 
                  ? 'left-0 top-0 w-full h-full' 
                  : placement === 'footer'
                  ? '-inset-2' // Larger hover area for footer
                  : '-inset-1'
                }
              `} />
            )}
            
            <div 
              className={`
                relative flex items-center z-10 cursor-pointer
                ${variant === 'micro' 
                  ? 'gap-1 px-1.5 py-0.5 rounded-md border backdrop-blur-sm' 
                  : variant === 'compact'
                  ? 'gap-1.5 px-2 py-1 rounded-lg border backdrop-blur-sm'
                  : 'gap-2 px-3 py-2 rounded-xl border backdrop-blur-sm'
                }
                ${isActive ? badge.accentColor : 'bg-muted/30 border-border/50'}
                ${placement === 'sidebar' ? 'w-full' : ''}
                ${isMobile ? 'select-none touch-manipulation' : ''}
                trust-badge-no-select
              `}
              title={!isMobile && showTooltips ? badge.description : undefined}
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

            {/* MOBILE-OPTIMIZED Tooltip */}
            {showTooltips && hoveredBadge === badge.id && (
              <div 
                className={`
                  ${isMobile 
                    ? 'fixed inset-x-4 bottom-24 z-[9999] pointer-events-auto' 
                    : `fixed z-[9999] pointer-events-auto
                       ${placement === 'sidebar' 
                         ? 'left-full top-1/2 -translate-y-1/2 ml-3' 
                         : placement === 'footer'
                         ? 'bottom-20 left-1/2 -translate-x-1/2'
                         : 'bottom-full left-1/2 -translate-x-1/2 mb-3'
                       }`
                  }
                `}
                style={!isMobile ? {
                  maxWidth: 'calc(100vw - 1rem)',
                  ...(placement === 'footer' && {
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: '5rem'
                  })
                } : {}}
                onMouseEnter={handleTooltipEnter}
                onMouseLeave={handleTooltipLeave}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby={`tooltip-title-${badge.id}`}
                tabIndex={-1}
              >
                <div className="relative">
                  <div className={`
                    bg-background/98 backdrop-blur-md border border-border/50 rounded-lg shadow-2xl
                    ${isMobile 
                      ? 'p-4 mx-auto max-w-sm' 
                      : `p-3 ${placement === 'sidebar' ? 'w-56' : 'w-64'} max-w-[calc(100vw-1rem)]`
                    }
                  `}>
                    {/* Mobile close button */}
                    {isMobile && (
                      <button
                        onClick={() => {
                          setClickedBadge(null)
                          setHoveredBadge(null)
                        }}
                        className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50"
                        aria-label="Chiudi"
                      >
                        <CloseIcon className="w-4 h-4" />
                      </button>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${badge.accentColor} flex-shrink-0`}>
                        <Icon className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} ${badge.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 id={`tooltip-title-${badge.id}`} className={`font-semibold text-foreground ${isMobile ? 'text-base' : 'text-sm'} mb-2 flex items-center gap-2`}>
                          {badge.label}
                          {isActive && (
                            <CheckIcon className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} ${badge.color} flex-shrink-0`} />
                          )}
                        </h4>
                        <p className={`text-muted-foreground leading-relaxed mb-3 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                          {badge.description}
                        </p>
                        
                        {/* Status indicator */}
                        <div className={`
                          flex items-center gap-2 px-3 py-2 rounded-lg ${isMobile ? 'text-sm' : 'text-xs'} font-medium
                          ${badge.id === 'ssl' && isSSL 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : badge.id === 'ssl' && !isSSL
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : `${badge.accentColor} ${badge.color}`
                          }
                        `}>
                          {badge.id === 'ssl' ? (
                            <>
                              {isSSL ? <CheckIcon className="w-4 h-4 flex-shrink-0" /> : <InfoIcon className="w-4 h-4 flex-shrink-0" />}
                              <span>{isSSL ? 'SSL Verificato' : 'Non Sicuro'}</span>
                            </>
                          ) : (
                            <>
                              <div className={`w-2 h-2 rounded-full ${badge.pulseColor} flex-shrink-0`} />
                              <span>
                                {badge.id === 'privacy' ? 'Privacy garantita' : 'Modalità educativa'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tooltip Arrow - Only for desktop */}
                  {!isMobile && (
                    <div className={`
                      absolute w-2 h-2 bg-background/98 border-l border-b border-border/50 rotate-45
                      ${placement === 'sidebar' 
                        ? 'right-full top-1/2 -translate-y-1/2 -translate-x-1 rotate-[315deg]'
                        : placement === 'footer'
                        ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1'
                        : 'top-full left-1/2 -translate-x-1/2 -translate-y-1'
                      }
                    `} />
                  )}
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