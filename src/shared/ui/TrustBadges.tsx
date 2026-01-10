/**
 * TrustBadges - Ultra-Chicca 2026 - SIMPLIFIED VERSION
 * 
 * Trust Badges & SSL Indicators
 * - SSL Secure, Zero Tracking, Educational Only
 * - Simple badges without tooltips or popups
 * - Clean English text for international audience
 */

'use client'

import { useState, useEffect } from 'react'
import { 
  ShieldIcon, 
  CheckIcon,
  GraduationCapIcon
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
  status: 'active' | 'verified' | 'compliant'
  color: string
  accentColor: string
  pulseColor: string
}

export function TrustBadges({ 
  placement = 'footer',
  variant = 'detailed',
  showTooltips = false, // Disabled by default
  className = ''
}: TrustBadgesProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const badges: BadgeConfig[] = [
    {
      id: 'ssl',
      icon: ShieldIcon,
      label: 'SSL Secure',
      status: 'verified',
      color: 'text-emerald-600 dark:text-emerald-400',
      accentColor: 'bg-emerald-500/10 border-emerald-500/20',
      pulseColor: 'bg-emerald-500'
    },
    {
      id: 'privacy',
      icon: ShieldIcon,
      label: 'Zero Tracking',
      status: 'compliant',
      color: 'text-blue-600 dark:text-blue-400',
      accentColor: 'bg-blue-500/10 border-blue-500/20',
      pulseColor: 'bg-blue-500'
    },
    {
      id: 'educational',
      icon: GraduationCapIcon,
      label: 'Educational Only',
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
      className={`flex items-center ${getVariantClasses()} ${getPlacementClasses()} ${className} trust-badges-static`}
    >
      {badges.map((badge) => {
        const Icon = badge.icon
        const isActive = badge.id === 'ssl' ? isSSL : true
        
        return (
          <div
            key={badge.id}
            className="relative trust-badge-container"
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
                transition-all duration-150
              `}
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
            </div>
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
        {isSSL ? 'Secure' : 'Not secure'}
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
          <span>GDPR Compliant</span>
        </div>
        <div className="flex items-center justify-center gap-2 font-medium">
          <GraduationCapIcon className="w-3 h-3 text-amber-500" />
          <span>Educational Only</span>
        </div>
        <p className="opacity-75 max-w-md mx-auto leading-relaxed">
          No investment advice. Educational content only.
        </p>
      </div>
    </div>
  )
}