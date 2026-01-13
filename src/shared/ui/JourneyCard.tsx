/**
 * JourneyCard - Tradelia 2026
 * 
 * Componente card unificato per journey e pillar.
 * Design coerente: border-left colorato, icon box, title, description, arrow.
 * Density-aware: responds to compact/comfortable mode (REQ 20.2)
 */

'use client'

import { type ReactNode } from 'react'

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
}

const COLORS = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-l-primary'
  },
  success: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-l-emerald-500'
  },
  warning: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-l-amber-500'
  },
  error: {
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-l-red-500'
  },
  info: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-l-blue-500'
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
  children
}: JourneyCardProps) {
  const colors = COLORS[accentColor]
  
  const cardContent = (
    <>
      {/* Main row - density-aware gaps */}
      <div className="flex items-center density-gap">
        {/* Icon - density-aware sizing with min 24px for WCAG 2.5.8 */}
        <div className={`density-icon-box rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <div className={`${colors.text} density-icon [&>svg]:w-[var(--density-icon-size)] [&>svg]:h-[var(--density-icon-size)]`}>{icon}</div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="density-text-secondary font-semibold text-foreground mb-0.5">
            {title}
          </h3>
          <p className="density-text-tertiary text-muted-foreground line-clamp-2">
            {description}
          </p>
          {subtitle && (
            <p className={`density-text-tertiary font-medium ${colors.text} uppercase tracking-wider mt-1.5`}>
              {subtitle}
            </p>
          )}
          {badge && <div className="mt-2">{badge}</div>}
        </div>
        
        {/* Arrow - min 24px touch target */}
        <div className="flex items-center justify-center min-w-[24px] min-h-[24px]">
          <svg 
            className="density-icon text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
      
      {/* Extra content (focus areas, etc) - density-aware spacing */}
      {children && <div className="mt-[var(--density-item-gap)] pt-[var(--density-item-gap)] border-t border-border/30">{children}</div>}
    </>
  )

  // Density-aware padding with min 24px target size for interactive elements
  const baseClasses = `
    group block w-full text-left
    bg-background rounded-xl density-card
    border border-border/50 border-l-4 ${colors.border}
    shadow-sm card-hover-lift
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    min-h-[24px]
  `

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {cardContent}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {cardContent}
    </button>
  )
}
