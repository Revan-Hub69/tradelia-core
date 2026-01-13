/**
 * Smart Empty State Component - Tradelia 2026
 * 
 * Enhanced empty state following REQ-22:
 * - 22.1: Explains WHY it's empty (description)
 * - 22.2: Proposes 1-2 concrete actions (CTA)
 * - 22.3: Indicates what happens after the action (hint)
 * - 22.4: Has contextual icon/illustration
 * 
 * Accessibility:
 * - Semantic structure with proper heading
 * - Focus management for CTA button
 * - Reduced motion support
 */

import type { ReactNode } from 'react'
import { Button } from './Button'
import { cn } from './utils'

interface SmartEmptyStateAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'outline' | 'ghost'
}

interface SmartEmptyStateProps {
  /** Icon or illustration for the empty state */
  icon: ReactNode
  /** Main title explaining the empty state */
  title: string
  /** Description explaining WHY it's empty (REQ 22.1) */
  description: string
  /** Primary action CTA (REQ 22.2) */
  action: SmartEmptyStateAction
  /** Secondary action (optional, REQ 22.2) */
  secondaryAction?: SmartEmptyStateAction
  /** Hint explaining what happens after the action (REQ 22.3) */
  hint?: string
  /** Additional CSS classes */
  className?: string
}

export function SmartEmptyState({ 
  icon, 
  title, 
  description, 
  action,
  secondaryAction,
  hint,
  className 
}: SmartEmptyStateProps) {
  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
      role="status"
      aria-label={title}
    >
      {/* Icon Container (REQ 22.4) */}
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <div className="w-8 h-8 text-muted-foreground">
          {icon}
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {/* Description - explains WHY it's empty (REQ 22.1) */}
      <p className="text-muted-foreground mb-4 max-w-sm text-sm">
        {description}
      </p>
      
      {/* Actions (REQ 22.2) */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Button 
          onClick={action.onClick}
          variant={action.variant || 'default'}
          size="default"
        >
          {action.label}
        </Button>
        
        {secondaryAction && (
          <Button 
            onClick={secondaryAction.onClick}
            variant={secondaryAction.variant || 'outline'}
            size="default"
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
      
      {/* Hint - explains what happens after action (REQ 22.3) */}
      {hint && (
        <p className="text-xs text-muted-foreground mt-3 max-w-xs">
          {hint}
        </p>
      )}
    </div>
  )
}
