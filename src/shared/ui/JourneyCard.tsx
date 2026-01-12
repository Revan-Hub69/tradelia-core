/**
 * JourneyCard - Tradelia 2026
 * 
 * Componente card unificato per journey e pillar.
 * Design coerente: border-left colorato, icon box, title, description, arrow.
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
      {/* Main row - più compatto su mobile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Icon - più piccolo su mobile */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <div className={`${colors.text} [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6`}>{icon}</div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-0.5 sm:mb-1">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          {subtitle && (
            <p className={`text-[10px] sm:text-xs font-medium ${colors.text} uppercase tracking-wider mt-1.5 sm:mt-2`}>
              {subtitle}
            </p>
          )}
          {badge && <div className="mt-2 sm:mt-3">{badge}</div>}
        </div>
        
        {/* Arrow */}
        <svg 
          className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
      
      {/* Extra content (focus areas, etc) */}
      {children && <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/30">{children}</div>}
    </>
  )

  const baseClasses = `
    group block w-full text-left
    bg-background rounded-xl p-3.5 sm:p-5
    border border-border/50 border-l-4 ${colors.border}
    shadow-sm hover:shadow-md
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
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
