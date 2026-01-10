/**
 * Navigation Types - Tradelia 2026
 * 
 * Tipi condivisi per la navigazione
 */

import type { ReactNode } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface SubNavItem {
  id: string
  label: string
  icon?: ReactNode
  count?: number
  secondary?: boolean
  disabled?: boolean
}

export interface SubNavItemWithContent extends SubNavItem {
  content: ReactNode
}