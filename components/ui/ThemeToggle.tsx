/**
 * Theme Toggle - Tradelia 2026
 * 
 * Toggle premium per tema (light/dark/auto) seguendo le spec Tradelia
 * Design minimalista e professionale con transizioni smooth
 */

'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/src/shared/config/theme-provider'
import { SunIcon, MoonIcon, MonitorIcon } from '@/components/icons/TradeliaIcons'
import type { Theme } from '@/src/shared/ui/types'

interface ThemeOption {
  value: Theme
  label: string
  icon: React.ReactNode
}

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

  // Filter out labels that look like raw translation keys (contain dots)
  // This handles cases where t('settings.light') returns 'settings.light' when key is missing
  const sanitizedLabels = labels ? Object.fromEntries(
    Object.entries(labels).filter(([, value]) => value && !value.includes('.'))
  ) : {}
  
  const l = { ...defaultLabels, ...sanitizedLabels }

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
              aria-label={option.label}
              aria-pressed={theme === option.value}
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