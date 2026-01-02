'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'tradelia-theme'

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return

  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  window.localStorage.setItem(STORAGE_KEY, theme)
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const handleThemeChange = (next: Theme) => {
    setTheme(next)
  }

  const options: { label: string; value: Theme }[] = [
    { label: 'Chiaro', value: 'light' },
    { label: 'Scuro', value: 'dark' }
  ]

  return (
    <div className="inline-flex items-center rounded-full border border-border/70 bg-background p-1 shadow-sm" role="group" aria-label="Seleziona tema">
      {options.map((option) => {
        const isActive = theme === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold transition-subtle rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground hover:bg-muted/70'
            )}
            onClick={() => handleThemeChange(option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
