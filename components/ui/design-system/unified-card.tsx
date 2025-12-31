import { ReactNode, MouseEventHandler } from 'react'
import { cn } from '@/lib/utils'

interface UnifiedCardProps {
  variant?: 'standard' | 'elevated' | 'hero'
  children: ReactNode
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  onMouseEnter?: MouseEventHandler<HTMLDivElement>
  onMouseLeave?: MouseEventHandler<HTMLDivElement>
}

export function UnifiedCard({ 
  variant = 'standard', 
  children, 
  className,
  onClick,
  onMouseEnter,
  onMouseLeave
}: UnifiedCardProps) {
  const baseStyles = 'bg-card rounded-xl transition-colors duration-150'
  
  const variantStyles = {
    standard: 'border border-border p-3 sm:p-4 md:p-6 hover:border-border-strong',
    elevated: 'border border-border p-4 sm:p-6 md:p-8',
    hero: 'border-2 border-border p-6 sm:p-8 md:p-12'
  }

  return (
    <div 
      className={cn(baseStyles, variantStyles[variant], className)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-xl font-bold text-foreground', className)}>
      {children}
    </h3>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('text-foreground leading-relaxed', className)}>
      {children}
    </div>
  )
}