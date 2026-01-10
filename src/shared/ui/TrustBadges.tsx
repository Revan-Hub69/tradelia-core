/**
 * TrustBadges - Ultra-Chicca 2026 - SIMPLIFIED VERSION
 * 
 * Trust Badges & SSL Indicators
 * - SSL Secure, Zero Tracking, Educational Only
 * - Simplified tooltip management with proper click outside handling
 * - Discrete placement with enhanced visual hierarchy
 */

'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!hoveredBadge) return
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (containerRef.current && !containerRef.current.contains(target)) {
        setHoveredBadge(null)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [hoveredBadge])

  // Simplified tooltip handlers
  const handleMouseEnter = (badgeId: string) => {
    if (isMobile || !showTooltips) return
    setHoveredBadge(badgeId)
  }

  const handleMouseLeave = () => {
    if (isMobile) return
    // Small delay to prevent flickering when moving to tooltip
    setTimeout(() => setHoveredBadge(null), 100)
  }

  // Mobile click handler
  const handleClick = (e: React.MouseEvent, badgeId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!showTooltips) return
    
    if (hoveredBadge === badgeId) {
      setHoveredBadge(null)
    } else {
      setHoveredBadge(badgeId)
    }
  }

  const badges: BadgeConfig[] = [
    {
      id: 'ssl',
      icon: ShieldIcon,
      label: 'SSL Sicuro',
      description: 'Connessione crittografata end-to-end per proteggere i tuoi dati',
      status: 'verified',
      color: 'text-emerald-600 dark:text-emerald-400',
      accentColor: 'bg-emerald-500/10 border-emerald-500/20',
      pulseColor: 'bg-emerald-500'
    },
    {
      id: 'privacy',
      icon: ShieldIcon,
      label: 'Privacy Garantita',
      description: 'Niente pixel di tracciamento, niente marketing invasivo, niente vendita dati',
      status: 'compliant',
      color: 'text-blue-600 dark:text-blue-400',
      accentColor: 'bg-blue-500/10 border-blue-500/20',
      pulseColor: 'bg-blue-500'
    },
    {
      id: 'educational',
      icon: GraduationCapIcon,
      label: 'Solo Educativo',
      description: 'Strumento formativo puro, non vendiamo prodotti finanziari',
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
        return 'justify-center flex-wrap gap-2'
    }
  }

  if (!mounted) {
    return (
      <div className={`flex items-center ${getVariantClasses()} ${getPlacementClasses()} ${className}`}>
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
    <div 
      ref={containerRef}
      className={`flex items-center ${getVariantClasses()} ${getPlacementClasses()} ${className} trust-badges-static`}
    >
      {badges.map((badge) => {
        const Icon = badge.icon
        const isActive = badge.id === 'ssl' ? isSSL : true
        
        return (
          <div
            key={badge.id}
            className="relative trust-badge-container"
            onMouseEnter={() => handleMouseEnter(badge.id)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(e, badge.id)}
          >
            <div 
              className={`
                relative flex items-center cursor-pointer
                ${variant === 'micro' 
                  ? 'gap-1 px-1.5 py-0.5 rounded-md border backdrop-blur-sm' 
                  : variant === 'compact'
                  ? 'gap-1.5 px-2 py-1 rounded-lg border backdrop-blur-sm'
                  : 'gap-2 px-3 py-2 rounded-xl border backdrop-blur-sm'
                }
                ${isActive ? badge.accentColor : 'bg-muted/30 border-border/50'}
                ${placement === 'sidebar' ? 'w-full' : ''}
                transition-all duration-150
              `}
              title={!isMobile && showTooltips ? badge.description : undefined}
            >
              {/* Status Indicator */}
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
              `} />
              
              {/* Label */}
              {variant !== 'minimal' && variant !== 'micro' && (
                <span className={`
                  font-medium whitespace-nowrap
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
                `} />
              )}

              {/* Info Icon Indicator */}
              {showTooltips && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                  <InfoIcon className="w-2.5 h-2.5 text-primary/70" />
                </div>
              )}
            </div>

            {/* Tooltip */}
            {showTooltips && hoveredBadge === badge.id && (
              <div 
                className={`
                  ${isMobile 
                    ? 'fixed inset-x-4 bottom-24 z-[9999]' 
                    : `absolute z-[9999]
                       ${placement === 'sidebar' 
                         ? 'left-full top-1/2 -translate-y-1/2 ml-3' 
                         : 'bottom-full left-1/2 -translate-x-1/2 mb-3'
                       }`
                  }
                `}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={() => setHoveredBadge(badge.id)}
                onMouseLeave={() => !isMobile && setHoveredBadge(null)}
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
                        onClick={() => setHoveredBadge(null)}
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
                        <h4 className={`font-semibold text-foreground ${isMobile ? 'text-base' : 'text-sm'} mb-2 flex items-center gap-2`}>
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

// Enhanced Security Status
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

// Premium Compliance Footer
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