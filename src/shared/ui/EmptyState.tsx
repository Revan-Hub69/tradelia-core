/**
 * Empty State Component - Tradelia 2026
 * 
 * Seguendo ux-contract.md:
 * - Icona + titolo + descrizione
 * - Azione opzionale (CTA)
 * - Guidato ("cosa fare ora")
 */

import type { ReactNode } from 'react'
import { Button } from './Button'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
        <div className="w-8 h-8 text-muted-foreground">
          {icon}
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      
      {/* Action */}
      {action && (
        <Button onClick={action.onClick} size="default">
          {action.label}
        </Button>
      )}
    </div>
  )
}
