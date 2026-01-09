/**
 * Theme Toggle - Tradelia 2026
 * 
 * Toggle premium per tema (light/dark/auto) seguendo le spec Tradelia
 * Design minimalista e professionale con transizioni smooth
 */

'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/src/shared/config/theme-provider'
import type { Theme } from '@/src/shared/ui/types'

interface ThemeOption {
  value: Theme
  label: string
  icon: React.ReactNode
}

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const MoonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const MonitorIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// Default labels (used when not in next-intl context)
const defaultLabels = {
  theme: 'Tema',
  light: 'Chiaro',
  dark: 'Scuro',
  system: 'Sistema'
}

interface ThemeToggleProps {
  variant?: 'compact' | 'full'
  className?: string
  labels?: {
    theme?: string
    light?: string
    dark?: string
    system?: string
  }
}

export function ThemeToggle({ variant = 'compact', className = '', labels }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const l = { ...defaultLabels, ...labels }

  const themeOptions: ThemeOption[] = [
    { value: 'light', label: l.light, icon: <SunIcon className="w-4 h-4" /> },
    { value: 'dark', label: l.dark, icon: <MoonIcon className="w-4 h-4" /> },
    { value: 'auto', label: l.system, icon: <MonitorIcon className="w-4 h-4" /> }
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`h-10 w-32 bg-muted/50 rounded-lg animate-pulse ${className}`} />
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`
                relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150
                ${theme === option.value 
                  ? 'bg-background text-foreground shadow-sm border border-border/50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }
              `}
              title={option.label}
            >
              {option.icon}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {l.theme}
      </p>
      <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-150 flex-1
              ${theme === option.value 
                ? 'bg-background text-foreground shadow-sm border border-border/50' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }
            `}
          >
            {option.icon}
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}