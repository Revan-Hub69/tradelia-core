/**
 * SectionHeader - Tradelia 2026
 * 
 * Header di contesto per ogni sezione
 * - Breadcrumb (solo desktop)
 * - Active Context Pill (solo mobile)
 * - Titolo grande
 * - Descrizione breve
 * - Azione primaria opzionale
 */

'use client'

import type { ReactNode } from 'react'
import { Breadcrumb } from './Breadcrumb'
import { ActiveContextPill } from './ActiveContextPill'
import type { BreadcrumbItem } from '@/src/shared/types/navigation'

interface SectionHeaderProps {
  breadcrumb?: BreadcrumbItem[]
  title: string
  description?: string
  icon?: ReactNode
  primaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function SectionHeader({ 
  breadcrumb, 
  title, 
  description, 
  icon, 
  primaryAction,
  className = '' 
}: SectionHeaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Breadcrumb - Solo Desktop */}
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb items={breadcrumb} />
      )}

      {/* Active Context Pill - Solo Mobile */}
      <ActiveContextPill />

      {/* Header principale */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        
        {/* Azione primaria */}
        {primaryAction && (
          <button 
            onClick={primaryAction.onClick}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>
  )
}