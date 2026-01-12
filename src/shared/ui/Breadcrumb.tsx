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
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.label} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="w-4 h-4 mx-2 text-muted-foreground/50" aria-hidden="true" />
              )}
              {item.href && !isLast ? (
                <Link 
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  className={isLast ? 'text-foreground font-medium' : ''}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}