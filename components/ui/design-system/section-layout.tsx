import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionLayoutProps {
  children: ReactNode
  className?: string
  background?: 'white' | 'muted'
}

export function SectionLayout({ children, className, background = 'white' }: SectionLayoutProps) {
  const bgStyles = {
    white: 'bg-background',
    muted: 'bg-muted'
  }

  return (
    <section className={cn('py-16 lg:py-24', bgStyles[background], className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {children}
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  className?: string
}

export function SectionHeader({ title, subtitle, badge, className }: SectionHeaderProps) {
  return (
    <div className={cn('text-center mb-12', className)}>
      {badge && (
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          {badge}
        </div>
      )}
      <h2 className="text-4xl font-bold text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}