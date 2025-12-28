import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface UnifiedCardProps {
  variant?: 'standard' | 'elevated' | 'hero'
  children: ReactNode
  className?: string
}

export function UnifiedCard({ variant = 'standard', children, className }: UnifiedCardProps) {
  const baseStyles = 'bg-card rounded-2xl transition-all duration-200'
  
  const variantStyles = {
    standard: 'border border-border p-6 shadow-sm hover:shadow-md',
    elevated: 'border border-border p-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    hero: 'border-2 border-border p-12 shadow-xl'
  }

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
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
    <h3 className={cn('text-2xl font-bold text-foreground', className)}>
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
    <div className={cn('text-muted-foreground leading-relaxed', className)}>
      {children}
    </div>
  )
}