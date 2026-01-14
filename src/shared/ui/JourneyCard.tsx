/**
 * JourneyCard - Tradelia 2026 - PREMIUM EDITION
 * 
 * Premium features matching ModuleContent.tsx:
 * - Gradient backgrounds with depth
 * - Icon backgrounds with gradients + glow
 * - Hover effects with lift + shine
 * - Professional shadows and transitions
 * - Density-aware (REQ 20.2)
 * - Help button contextual (REQ 23.1)
 */

'use client'

import { type ReactNode } from 'react'
import { HelpButton } from './HelpButton'
import type { HelpModuleId } from '@/src/shared/lib/help-content'

export interface JourneyCardProps {
  title: string
  description: string
  icon: ReactNode
  accentColor: 'primary' | 'success' | 'warning' | 'error' | 'info'
  onClick?: () => void
  href?: string
  subtitle?: string
  badge?: ReactNode
  children?: ReactNode
  /** Module ID for contextual help (shows "?" button if provided) */
  helpModuleId?: HelpModuleId | string
}

const COLORS = {
  primary: {
    bgGradient: 'bg-gradient-to-br from-primary-500/8 to-primary-500/4',
    border: 'border-l-primary-500',
    text: 'text-primary-600 dark:text-primary-400',
    iconBg: 'bg-gradient-to-br from-primary-500 to-primary-600',
    iconText: 'text-white',
    glow: 'shadow-lg shadow-primary-500/25'
  },
  success: {
    bgGradient: 'bg-gradient-to-br from-emerald-500/8 to-emerald-500/4',
    border: 'border-l-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    iconText: 'text-white',
    glow: 'shadow-lg shadow-emerald-500/25'
  },
  warning: {
    bgGradient: 'bg-gradient-to-br from-amber-500/8 to-amber-500/4',
    border: 'border-l-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    iconText: 'text-white',
    glow: 'shadow-lg shadow-amber-500/25'
  },
  error: {
    bgGradient: 'bg-gradient-to-br from-red-500/8 to-red-500/4',
    border: 'border-l-red-500',
    text: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
    iconText: 'text-white',
    glow: 'shadow-lg shadow-red-500/25'
  },
  info: {
    bgGradient: 'bg-gradient-to-br from-blue-500/8 to-blue-500/4',
    border: 'border-l-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    iconText: 'text-white',
    glow: 'shadow-lg shadow-blue-500/25'
  }
}

export function JourneyCard({
  title,
  description,
  icon,
  accentColor,
  onClick,
  href,
  subtitle,
  badge,
  children,
  helpModuleId
}: JourneyCardProps) {
  const colors = COLORS[accentColor]
  
  const cardContent = (
    <>
      {/* Main row - density-aware gaps */}
      <div className="relative z-10 flex items-center density-gap">
        {/* Icon with gradient background and glow - matching ModuleContent */}
        <div className={`
          density-icon-box rounded-xl flex items-center justify-center flex-shrink-0
          transition-all duration-200
          ${colors.iconBg} ${colors.glow}
          group-hover:scale-110 group-hover:shadow-xl
        `}>
          <div className={`${colors.iconText} density-icon [&>svg]:w-[var(--density-icon-size)] [&>svg]:h-[var(--density-icon-size)]`}>
            {icon}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="density-text-secondary font-semibold text-foreground mb-0.5 tracking-tight">
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
          <p className="density-text-tertiary text-muted-foreground line-clamp-2 reading-line-height">
            {description}
          </p>
          {subtitle && (
            <p className={`density-text-tertiary font-medium ${colors.text} uppercase tracking-wider mt-1.5`}>
              {subtitle}
            </p>
          )}
          {badge && <div className="mt-2">{badge}</div>}
        </div>
        
        {/* Arrow with enhanced animation - matching ModuleContent */}
        <div className="flex items-center justify-center min-w-[24px] min-h-[24px]">
          <svg 
            className={`
              density-icon flex-shrink-0
              text-muted-foreground
              transition-all duration-200
              group-hover:text-primary group-hover:translate-x-1
            `}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      {/* Extra content (focus areas, etc) - density-aware spacing */}
      {children && <div className="relative z-10 mt-[var(--density-item-gap)] pt-[var(--density-item-gap)] border-t border-border/30">{children}</div>}
    </>
  )

  // Premium card with gradient background, hover effects - matching ModuleContent
  const baseClasses = `
    group relative block w-full text-left
    rounded-xl density-card border border-l-4
    ${colors.border} ${colors.bgGradient}
    border-border/50
    transition-all duration-200 ease-out
    hover:border-primary-300 dark:hover:border-primary-700
    hover:shadow-lg hover:translate-y-[-2px]
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    min-h-[24px] overflow-hidden
  `

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {/* Gradient overlay on hover - matching ModuleContent */}
        <div className={`
          absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
          transition-opacity duration-200 pointer-events-none
          ${colors.bgGradient}
        `} />
        
        {/* Shine effect on hover - matching ModuleContent */}
        <div className="
          absolute inset-0 rounded-xl
          bg-gradient-to-r from-transparent via-white/10 to-transparent
          translate-x-[-100%] group-hover:translate-x-[100%]
          transition-transform duration-1000
          pointer-events-none
        " />
        
        {cardContent}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {/* Gradient overlay on hover - matching ModuleContent */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
        transition-opacity duration-200 pointer-events-none
        ${colors.bgGradient}
      `} />
      
      {/* Shine effect on hover - matching ModuleContent */}
      <div className="
        absolute inset-0 rounded-xl
        bg-gradient-to-r from-transparent via-white/10 to-transparent
        translate-x-[-100%] group-hover:translate-x-[100%]
        transition-transform duration-1000
        pointer-events-none
      " />
      
      {cardContent}
    </button>
  )
}
