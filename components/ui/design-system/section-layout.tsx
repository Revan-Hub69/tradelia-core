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
    <section className={cn('section-spacing', bgStyles[background], className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
    <div className={cn('text-center mb-8 sm:mb-12 px-4 sm:px-0', className)}>
      {badge && (
        <div className="badge-primary mb-3 sm:mb-4">
          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          {badge}
        </div>
      )}
      <h2 className="heading-section mb-3 sm:mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}