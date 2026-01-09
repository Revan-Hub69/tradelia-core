/**
 * Language Toggle - Tradelia 2026
 * 
 * Toggle premium per lingua (IT/EN) seguendo le spec Tradelia
 * Design minimalista e professionale con transizioni smooth
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface LanguageOption {
  value: string
  label: string
  flag: string
}

const languageOptions: LanguageOption[] = [
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'en', label: 'English', flag: '🇺🇸' }
]

interface LanguageToggleProps {
  variant?: 'compact' | 'full'
  className?: string
  currentLocale?: string
  labelText?: string
}

export function LanguageToggle({ variant = 'compact', className = '', currentLocale, labelText = 'Lingua' }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  // Detect locale from pathname if not provided
  const locale = currentLocale || pathname.split('/')[1] || 'it'

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return
    
    // Replace the locale in the current pathname
    const segments = pathname.split('/')
    if (segments[1] === 'it' || segments[1] === 'en') {
      segments[1] = newLocale
    } else {
      segments.splice(1, 0, newLocale)
    }
    const newPath = segments.join('/') || '/'
    
    // Preserve current query parameters
    const currentUrl = new URL(window.location.href)
    const searchParams = currentUrl.searchParams.toString()
    const finalUrl = searchParams ? `${newPath}?${searchParams}` : newPath
    
    router.push(finalUrl)
  }

  if (!mounted) {
    return (
      <div className={`h-10 w-24 bg-muted/50 rounded-lg animate-pulse ${className}`} />
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
          {languageOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleLanguageChange(option.value)}
              className={`
                relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150
                ${locale === option.value 
                  ? 'bg-background text-foreground shadow-sm border border-border/50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }
              `}
              title={option.label}
            >
              <span className="text-sm">{option.flag}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {labelText}
      </p>
      <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
        {languageOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleLanguageChange(option.value)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-150 flex-1
              ${locale === option.value 
                ? 'bg-background text-foreground shadow-sm border border-border/50' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }
            `}
          >
            <span className="text-sm">{option.flag}</span>
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}