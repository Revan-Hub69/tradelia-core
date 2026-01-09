/**
 * Breadcrumb - Tradelia 2026
 * 
 * Breadcrumb semplice per orientamento cognitivo
 * - Solo desktop (nascosto su mobile)
 * - Max 3 livelli
 * - Non cliccabile a 10 livelli
 */

'use client'

import Link from 'next/link'
import { ChevronRightIcon } from '@/components/icons/TradeliaIcons'
import type { BreadcrumbItem } from '@/src/shared/types/navigation'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // Nascondi su mobile
  return (
    <nav className={`hidden md:flex items-center space-x-2 text-sm text-muted-foreground ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 && (
            <ChevronRightIcon className="w-4 h-4 mx-2 text-muted-foreground/50" />
          )}
          {item.href && index < items.length - 1 ? (
            <Link 
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? 'text-foreground font-medium' : ''}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}