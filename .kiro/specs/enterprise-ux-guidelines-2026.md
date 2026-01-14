# 🏛️ ENTERPRISE UX GUIDELINES 2026
## Tradelia Design System - Google/OpenAI/Binance Level

> **Documento definitivo per raggiungere il vero livello enterprise in TUTTO il progetto**

---

## 📋 INDICE

1. [Chicche Catalog](#chicche-catalog)
2. [Super-Chicche Catalog](#super-chicche-catalog)
3. [Settings Overlay Pattern](#settings-overlay-pattern)
4. [Searchable Country Selector](#searchable-country-selector)
5. [IndexedDB + Auth Sync](#indexeddb-auth-sync)
6. [Drawer Design Improvements](#drawer-design-improvements)
7. [Translation Requirements](#translation-requirements)
8. [Global Application Strategy](#global-application-strategy)

---

## 🎨 CHICCHE CATALOG

### 1. Reading Progress & Time Estimation
**Dove:** ModuleContent.tsx (REFERENCE IMPLEMENTATION)

```tsx
// Dynamic reading time calculation (250 words/min)
const estimatedMinutes = useMemo(() => {
  const wordCount = module.sections.reduce((total, section) => {
    let text = ''
    if (section.content) text += section.content
    if (section.title) text += section.title
    if (section.items) {
      text += section.items.map(item => `${item.left} ${item.right}`).join(' ')
    }
    return total + text.split(/\s+/).filter(word => word.length > 0).length
  }, 0)
  
  return Math.max(1, Math.ceil(wordCount / 250))
}, [module.sections])

// Header with time estimate
<header className="flex items-center gap-2 text-sm text-muted-foreground mb-8 pb-4 border-b border-border/30">
  <ClockIcon className="w-4 h-4" />
  <span>~{estimatedMinutes} {estimatedMinutes === 1 ? 'minuto' : 'minuti'} di lettura</span>
</header>
```

**Applicare a:** Tutti i contenuti lunghi (articoli, guide, documentazione)

### 2. Drop Cap Typography
**Dove:** ModuleContent.tsx

```tsx
// First paragraph gets drop cap
<p className={`
  text-foreground reading-line-height text-base leading-7
  ${isFirstText ? 'first-letter:text-5xl first-letter:font-bold first-letter:text-primary-500 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none' : ''}
`}>
  {formatTextWithEmphasis(section.content || '')}
</p>
```

**Applicare a:** Articoli, blog posts, contenuti editoriali


### 3. Decorative Dividers
**Dove:** ModuleContent.tsx

```tsx
// Between sections
function DecorativeDivider() {
  return (
    <div className="flex items-center gap-4 py-6 mb-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      <div className="flex gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary-500/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
    </div>
  )
}

// Diamond divider at end
<div className="flex items-center justify-center gap-3 my-12">
  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
  <DiamondIcon className="w-4 h-4 text-primary-500/60" />
  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
</div>
```

**Applicare a:** Separazioni tra sezioni, fine contenuti

### 4. Section Numbers on Headings
**Dove:** ModuleContent.tsx

```tsx
// Heading with section number
<div className="flex items-center gap-3">
  {sectionNumber && (
    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/10 text-primary-500 font-bold text-sm border border-primary-500/20">
      {sectionNumber}
    </span>
  )}
  <h3 className="text-xl font-bold text-foreground tracking-tight">
    {section.title}
  </h3>
</div>
```

**Applicare a:** Contenuti strutturati, guide step-by-step

### 5. Animated Checkmark on Completion
**Dove:** ModuleContent.tsx + tailwind.config.ts

```tsx
// Tailwind config
theme: {
  extend: {
    keyframes: {
      'checkmark-pop': {
        '0%': { transform: 'scale(0.8)', opacity: '0' },
        '50%': { transform: 'scale(1.2)' },
        '100%': { transform: 'scale(1)', opacity: '1' }
      }
    },
    animation: {
      'checkmark-pop': 'checkmark-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
  }
}

// Component
{showCheckAnimation && (
  <div className="animate-checkmark-pop">
    <CheckCircleFilledIcon className="w-6 h-6 text-emerald-500" />
  </div>
)}
```

**Applicare a:** Completamenti, successi, conferme

### 6. Custom Text Selection Highlight
**Dove:** ModuleContent.tsx

```tsx
<article className="reading-width selection:bg-primary-500/20 selection:text-foreground">
  {/* content */}
</article>
```

**Applicare a:** Tutti i contenuti testuali

### 7. Viewport-Based Animations
**Dove:** ModuleContent.tsx

```tsx
function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{ transitionDelay: isVisible ? '0ms' : `${delay}ms` }}
    >
      {children}
    </div>
  )
}
```

**Applicare a:** Sezioni, cards, liste

### 8. Decorative Quote Marks
**Dove:** ModuleContent.tsx

```tsx
// Hook/Quote section
<div className="relative py-6 px-6 bg-gradient-to-r from-primary-500/8 to-primary-500/3 border-l-4 border-primary-500 rounded-r-xl">
  {/* Decorative opening quote */}
  <QuoteIcon className="absolute -top-2 -left-1 w-10 h-10 text-primary-500/20 transform -translate-x-1/2" />
  <p className="text-lg text-foreground reading-line-height font-medium italic pl-4">
    {section.content}
  </p>
  {/* Decorative closing quote */}
  <QuoteIcon className="absolute -bottom-2 right-4 w-8 h-8 text-primary-500/15 transform rotate-180" />
</div>
```

**Applicare a:** Citazioni, highlights, hooks


### 9. Semantic Callouts with Icons
**Dove:** ModuleContent.tsx

```tsx
// Callout with semantic styling
case 'callout': {
  const styles = {
    info: {
      bg: 'bg-primary-500/6',
      border: 'border-primary-500/20',
      iconBg: 'bg-primary-500/15',
      icon: <InfoIcon className="w-4 h-4 text-primary-500" />
    },
    warning: {
      bg: 'bg-amber-500/6',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/15',
      icon: <AlertIcon className="w-4 h-4 text-amber-500" />
    },
    insight: {
      bg: 'bg-muted/40',
      border: 'border-border/40',
      iconBg: 'bg-muted-foreground/10',
      icon: <SparkleIcon className="w-4 h-4 text-muted-foreground" />
    }
  }
  const style = styles[section.calloutType || 'info']

  return (
    <div className={`p-5 rounded-xl border ${style.bg} ${style.border}`}>
      <div className="flex gap-4">
        <div className={`w-8 h-8 rounded-lg ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
          {style.icon}
        </div>
        <p className="text-foreground reading-line-height pt-1">{section.content}</p>
      </div>
    </div>
  )
}
```

**Applicare a:** Alerts, notices, tips

### 10. Comparison Cards (Bank vs Crypto)
**Dove:** ModuleContent.tsx

```tsx
// Comparison grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  {/* Traditional */}
  <div className="group p-4 rounded-xl bg-muted/20 border border-border/30 transition-all duration-200 hover:bg-muted/30 hover:border-border/50">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-6 h-6 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
        <BankIcon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Banca</span>
    </div>
    <p className="text-sm text-foreground/70 reading-line-height">{item.left}</p>
  </div>
  {/* Crypto */}
  <div className="group p-4 rounded-xl bg-primary-500/5 border border-primary-500/20 transition-all duration-200 hover:bg-primary-500/8 hover:border-primary-500/30">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-6 h-6 rounded-lg bg-primary-500/15 flex items-center justify-center">
        <CryptoIcon className="w-3.5 h-3.5 text-primary-500" />
      </div>
      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Crypto</span>
    </div>
    <p className="text-sm text-foreground reading-line-height">{item.right}</p>
  </div>
</div>
```

**Applicare a:** Comparazioni, before/after, pro/cons

---

## 🚀 SUPER-CHICCHE CATALOG

### 1. Scroll Shadow on Header
**Dove:** PremiumDrawer.tsx

```tsx
// Hook for scroll detection
const { isScrolled } = useScrollShadow(contentRef)

// Header with dynamic shadow
<header className={`drawer-enterprise-header ${isScrolled ? 'scrolled' : ''}`}>
  {/* content */}
</header>

// CSS
.drawer-enterprise-header {
  flex-shrink: 0;
  z-index: 10;
  background-color: hsl(var(--bg-card));
  border-bottom: 1px solid transparent;
  transition: border-color 150ms ease, box-shadow 150ms ease;
  padding: 1.5rem;
}

.drawer-enterprise-header.scrolled {
  border-bottom-color: hsl(var(--border-soft));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

**Applicare a:** Tutti i drawer, modals, scrollable containers

### 2. Swipe to Close (Mobile)
**Dove:** PremiumDrawer.tsx

```tsx
// Native touch events with preventDefault
useEffect(() => {
  if (!enableSwipeClose || !isOpen) return
  
  const drawer = drawerRef.current
  if (!drawer) return
  
  const handleNativeTouchStart = (e: TouchEvent) => {
    // Only track swipe if content is scrolled to top
    const content = contentRef.current
    if (content && content.scrollTop > 5) return
    
    const touch = e.touches[0]
    if (!touch) return
    
    setTouchStart(touch.clientY)
    setTouchStartX(touch.clientX)
  }
  
  const handleNativeTouchMove = (e: TouchEvent) => {
    // ... swipe logic with preventDefault
    if (diffY > 20 && diffY > diffX * 2) {
      e.preventDefault() // Prevent pull-to-refresh
      setSwipeOffset(Math.min(diffY - 20, 130))
    }
  }
  
  // Add with { passive: false } to allow preventDefault
  drawer.addEventListener('touchmove', handleNativeTouchMove, { passive: false })
  
  return () => {
    drawer.removeEventListener('touchmove', handleNativeTouchMove)
  }
}, [enableSwipeClose, isOpen, onClose])
```

**Applicare a:** Tutti i drawer mobile, bottom sheets


### 3. Focus Management (WAI-ARIA APG)
**Dove:** PremiumDrawer.tsx

```tsx
// Store previous focus
useEffect(() => {
  const mainContent = document.querySelector('#main-content') as HTMLElement | null
  
  if (isOpen) {
    // Store previous focus
    previousActiveElement.current = document.activeElement as HTMLElement
    
    // Make page inert (not focusable)
    if (mainContent) {
      mainContent.setAttribute('inert', '')
    }
    
    // Focus first focusable element
    const focusTimer = setTimeout(() => {
      firstFocusableRef.current?.focus()
    }, 150)
    
    return () => clearTimeout(focusTimer)
  } else {
    // Remove inert from page
    if (mainContent) {
      mainContent.removeAttribute('inert')
    }
    
    // Restore focus
    if (previousActiveElement.current) {
      requestAnimationFrame(() => {
        const restoreTimer = setTimeout(() => {
          if (previousActiveElement.current && document.body.contains(previousActiveElement.current)) {
            previousActiveElement.current.focus()
          }
        }, 100)
        
        return () => clearTimeout(restoreTimer)
      })
    }
  }
}, [isOpen])
```

**Applicare a:** Tutti i modals, drawers, overlays

### 4. Focus Trap
**Dove:** PremiumDrawer.tsx

```tsx
// Focus trap for keyboard navigation
useEffect(() => {
  if (!isOpen || !drawerRef.current) return

  const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  window.addEventListener('keydown', handleTab)
  return () => window.removeEventListener('keydown', handleTab)
}, [isOpen])
```

**Applicare a:** Tutti i modals, drawers con keyboard navigation

### 5. Scroll Lock (iOS Safe)
**Dove:** PremiumDrawer.tsx

```tsx
// Lock scroll on both body AND html (iOS fix)
useEffect(() => {
  if (!isOpen) return
  
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  return () => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }
}, [isOpen])
```

**Applicare a:** Tutti i full-screen overlays

### 6. Scroll to Top on Open/Tab Change
**Dove:** PremiumDrawer.tsx

```tsx
// Scroll to top when drawer opens
useEffect(() => {
  if (isOpen && contentRef.current) {
    contentRef.current.scrollTop = 0
  }
}, [isOpen])

// Scroll to top on tab change
useEffect(() => {
  if (isOpen && contentRef.current && activeTab) {
    contentRef.current.scrollTop = 0
  }
}, [activeTab, isOpen])
```

**Applicare a:** Tutti i drawer, modals con tabs

### 7. Breadcrumb in Header
**Dove:** PremiumDrawer.tsx

```tsx
// Breadcrumb navigation
{breadcrumb && breadcrumb.length > 0 && (
  <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-enterprise-secondary">
    {breadcrumb.map((item, index) => (
      <span key={`breadcrumb-${item.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-center gap-1">
        {index > 0 && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
        <span className={index === breadcrumb.length - 1 ? 'text-enterprise-primary font-medium' : ''}>
          {item}
        </span>
      </span>
    ))}
  </nav>
)}
```

**Applicare a:** Drawer multi-livello, navigation complessa

### 8. Copy Link Button
**Dove:** PremiumDrawer.tsx

```tsx
// Copy link with success feedback
const handleCopyLink = useCallback(async () => {
  if (!panelId) return
  
  try {
    const url = getCurrentUrl()
    await navigator.clipboard.writeText(url)
    setCopySuccess(true)
    onCopyLink?.()
    
    setTimeout(() => setCopySuccess(false), 2000)
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}, [getCurrentUrl, onCopyLink, panelId])

// Button
{showCopyLink && panelId && (
  <button
    onClick={handleCopyLink}
    className="tap-target-icon focus-enterprise-ring p-2 rounded-lg hover:bg-muted/50 transition-colors"
    aria-label={copySuccess ? 'Link copiato!' : 'Copia link sezione'}
  >
    {copySuccess ? (
      <CheckIcon className="w-4 h-4 text-success" />
    ) : (
      <InfoIcon className="w-4 h-4" />
    )}
  </button>
)}
```

**Applicare a:** Contenuti condivisibili, sezioni deep-linkable


### 9. Progress State Badges
**Dove:** PremiumDrawer.tsx

```tsx
// Enterprise progress states
function ProgressStateBadge({ state, timeEstimate }: ProgressStateBadgeProps) {
  const stateConfig = {
    'not-started': {
      label: 'Non iniziato',
      className: 'progress-state-not-started'
    },
    'fundamental': {
      label: 'Fondamentale',
      className: 'progress-state-fundamental'
    },
    'in-progress': {
      label: 'In corso',
      className: 'progress-state-not-started'
    },
    'completed': {
      label: 'Completato',
      className: 'progress-state-completed'
    }
  }
  
  const config = stateConfig[state]
  
  return (
    <span className={config.className}>
      {config.label}
      {timeEstimate && state === 'fundamental' && (
        <span className="text-xs opacity-75"> · {timeEstimate}</span>
      )}
    </span>
  )
}
```

**Applicare a:** Learning paths, onboarding, progress tracking

### 10. Enterprise Alert Components
**Dove:** PremiumDrawer.tsx

```tsx
// Semantic alert with icon
function AlertEnterprise({ type, title, message, className = '' }: AlertEnterpriseProps) {
  const iconMap = {
    info: InfoIcon,
    warning: AlertTriangleIcon,
    danger: AlertTriangleIcon,
    success: CheckIcon
  }
  
  const Icon = iconMap[type]
  
  return (
    <div className={`alert-enterprise-${type} ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold mb-1">{title}</h4>
          <p className="text-sm reading-line-height">{message}</p>
        </div>
      </div>
    </div>
  )
}
```

**Applicare a:** Tutti gli alert, notices, warnings

---

## ⚙️ SETTINGS OVERLAY PATTERN

### Requisito Utente
> "Settings should be hover overlay initially, not fixed page. After first selection, gear icon opens settings overlay (not back button)"

### Implementation Strategy

#### 1. Initial State: Hover Overlay
```tsx
// SetupView.tsx - Initial hover state
const [showSettings, setShowSettings] = useState(false)
const [hasCompletedSetup, setHasCompletedSetup] = useState(false)

// Hover trigger (only if setup not completed)
<div 
  className="relative"
  onMouseEnter={() => !hasCompletedSetup && setShowSettings(true)}
  onMouseLeave={() => !hasCompletedSetup && setShowSettings(false)}
>
  {/* Main content */}
  
  {/* Hover overlay */}
  {showSettings && !hasCompletedSetup && (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 p-6 rounded-xl border border-border/50">
      <SettingsForm onComplete={handleSetupComplete} />
    </div>
  )}
</div>
```

#### 2. After Setup: Gear Icon
```tsx
// After first selection, show gear icon
{hasCompletedSetup && (
  <button
    onClick={() => setShowSettings(true)}
    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
    aria-label="Modifica impostazioni"
  >
    <GearIcon className="w-5 h-5" />
  </button>
)}

// Settings overlay (modal style)
{showSettings && hasCompletedSetup && (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-background rounded-xl p-6 max-w-md w-full border border-border/50 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Impostazioni</h3>
        <button onClick={() => setShowSettings(false)}>
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      <SettingsForm onComplete={() => setShowSettings(false)} />
    </div>
  </div>
)}
```

#### 3. Settings Form Component
```tsx
interface SettingsFormProps {
  onComplete: () => void
}

function SettingsForm({ onComplete }: SettingsFormProps) {
  const [country, setCountry] = useState('')
  const [technicalLevel, setTechnicalLevel] = useState<'noob' | 'informato' | 'smart'>('noob')
  
  const handleSave = async () => {
    // Save to IndexedDB (non-logged users)
    await saveToIndexedDB({ country, technicalLevel })
    
    // If logged in, sync to backend
    if (isAuthenticated) {
      await syncToBackend({ country, technicalLevel })
    }
    
    onComplete()
  }
  
  return (
    <div className="space-y-4">
      {/* Searchable country selector */}
      <SearchableCountrySelector 
        value={country}
        onChange={setCountry}
      />
      
      {/* Technical level selector */}
      <TechnicalLevelSelector
        value={technicalLevel}
        onChange={setTechnicalLevel}
      />
      
      <button
        onClick={handleSave}
        className="w-full cta-enterprise-primary"
      >
        Salva impostazioni
      </button>
    </div>
  )
}
```

**Applicare a:** Onboarding, user preferences, configuration


---

## 🌍 SEARCHABLE COUNTRY SELECTOR

### Requisito Utente
> "Country selection must be searchable dropdown (unified with settings)"

### Implementation

#### 1. Component Structure
```tsx
'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { countries } from '@/src/shared/config/countries'

interface SearchableCountrySelectorProps {
  value: string
  onChange: (countryCode: string) => void
  placeholder?: string
}

export function SearchableCountrySelector({ 
  value, 
  onChange,
  placeholder = 'Seleziona il tuo paese'
}: SearchableCountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Filter countries by search
  const filteredCountries = useMemo(() => {
    if (!search) return countries
    
    const searchLower = search.toLowerCase()
    return countries.filter(country => 
      country.name.toLowerCase().includes(searchLower) ||
      country.code.toLowerCase().includes(searchLower)
    )
  }, [search])
  
  // Selected country display
  const selectedCountry = countries.find(c => c.code === value)
  
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-border/50 bg-background hover:border-border transition-colors min-h-[44px]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {selectedCountry ? (
            <>
              <span className="text-2xl">{selectedCountry.flag}</span>
              <span className="text-sm font-medium">{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/50 rounded-lg shadow-xl z-50 max-h-[300px] overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-border/30">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca paese..."
              className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              autoFocus
            />
          </div>
          
          {/* Countries list */}
          <div className="overflow-y-auto max-h-[240px]" role="listbox">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    onChange(country.code)
                    setIsOpen(false)
                    setSearch('')
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors min-h-[44px]
                    ${value === country.code ? 'bg-primary/10' : ''}
                  `}
                  role="option"
                  aria-selected={value === country.code}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-sm font-medium">{country.name}</span>
                  {value === country.code && (
                    <CheckIcon className="w-4 h-4 ml-auto text-primary" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Nessun paese trovato
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

#### 2. Countries Config
```tsx
// src/shared/config/countries.ts
export interface Country {
  code: string
  name: string
  flag: string
  taxRegime: 'simple' | 'complex'
  regulationLevel: 'strict' | 'moderate' | 'flexible'
}

export const countries: Country[] = [
  { code: 'IT', name: 'Italia', flag: '🇮🇹', taxRegime: 'complex', regulationLevel: 'strict' },
  { code: 'US', name: 'Stati Uniti', flag: '🇺🇸', taxRegime: 'complex', regulationLevel: 'moderate' },
  { code: 'GB', name: 'Regno Unito', flag: '🇬🇧', taxRegime: 'complex', regulationLevel: 'strict' },
  { code: 'DE', name: 'Germania', flag: '🇩🇪', taxRegime: 'complex', regulationLevel: 'strict' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷', taxRegime: 'complex', regulationLevel: 'strict' },
  { code: 'ES', name: 'Spagna', flag: '🇪🇸', taxRegime: 'simple', regulationLevel: 'moderate' },
  { code: 'PT', name: 'Portogallo', flag: '🇵🇹', taxRegime: 'simple', regulationLevel: 'flexible' },
  { code: 'CH', name: 'Svizzera', flag: '🇨🇭', taxRegime: 'complex', regulationLevel: 'moderate' },
  { code: 'NL', name: 'Paesi Bassi', flag: '🇳🇱', taxRegime: 'simple', regulationLevel: 'flexible' },
  { code: 'BE', name: 'Belgio', flag: '🇧🇪', taxRegime: 'complex', regulationLevel: 'strict' },
  // ... add more countries
]
```

**Applicare a:** Country selection, location pickers, region filters


---

## 💾 INDEXEDDB + AUTH SYNC

### Requisito Utente
> "Use IndexedDB for non-logged users, sync when logged in"

### Implementation Strategy

#### 1. IndexedDB Setup
```tsx
// src/shared/lib/storage/indexeddb.ts
import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

interface TradeliaDB extends DBSchema {
  'user-preferences': {
    key: string
    value: {
      country: string
      technicalLevel: 'noob' | 'informato' | 'smart'
      lastUpdated: number
    }
  }
  'learning-progress': {
    key: string
    value: {
      moduleId: string
      completed: boolean
      lastAccessed: number
      progress: number
    }
  }
  'sync-queue': {
    key: string
    value: {
      action: 'create' | 'update' | 'delete'
      entity: string
      data: any
      timestamp: number
    }
  }
}

let dbInstance: IDBPDatabase<TradeliaDB> | null = null

export async function getDB() {
  if (dbInstance) return dbInstance
  
  dbInstance = await openDB<TradeliaDB>('tradelia-db', 1, {
    upgrade(db) {
      // User preferences store
      if (!db.objectStoreNames.contains('user-preferences')) {
        db.createObjectStore('user-preferences')
      }
      
      // Learning progress store
      if (!db.objectStoreNames.contains('learning-progress')) {
        const progressStore = db.createObjectStore('learning-progress', { keyPath: 'moduleId' })
        progressStore.createIndex('lastAccessed', 'lastAccessed')
      }
      
      // Sync queue for offline changes
      if (!db.objectStoreNames.contains('sync-queue')) {
        const syncStore = db.createObjectStore('sync-queue', { autoIncrement: true })
        syncStore.createIndex('timestamp', 'timestamp')
      }
    }
  })
  
  return dbInstance
}

// Save user preferences
export async function saveUserPreferences(prefs: {
  country: string
  technicalLevel: 'noob' | 'informato' | 'smart'
}) {
  const db = await getDB()
  await db.put('user-preferences', {
    ...prefs,
    lastUpdated: Date.now()
  }, 'current')
}

// Get user preferences
export async function getUserPreferences() {
  const db = await getDB()
  return await db.get('user-preferences', 'current')
}

// Save learning progress
export async function saveLearningProgress(moduleId: string, data: {
  completed: boolean
  progress: number
}) {
  const db = await getDB()
  await db.put('learning-progress', {
    moduleId,
    ...data,
    lastAccessed: Date.now()
  })
}

// Get learning progress
export async function getLearningProgress(moduleId: string) {
  const db = await getDB()
  return await db.get('learning-progress', moduleId)
}

// Get all learning progress
export async function getAllLearningProgress() {
  const db = await getDB()
  return await db.getAll('learning-progress')
}

// Add to sync queue
export async function addToSyncQueue(action: 'create' | 'update' | 'delete', entity: string, data: any) {
  const db = await getDB()
  await db.add('sync-queue', {
    action,
    entity,
    data,
    timestamp: Date.now()
  })
}

// Get sync queue
export async function getSyncQueue() {
  const db = await getDB()
  return await db.getAll('sync-queue')
}

// Clear sync queue
export async function clearSyncQueue() {
  const db = await getDB()
  await db.clear('sync-queue')
}
```

#### 2. Sync Hook
```tsx
// src/shared/hooks/useDataSync.ts
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/src/shared/hooks/useAuth'
import { 
  getUserPreferences, 
  getAllLearningProgress, 
  getSyncQueue, 
  clearSyncQueue 
} from '@/src/shared/lib/storage/indexeddb'

export function useDataSync() {
  const { user, isAuthenticated } = useAuth()
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null)
  
  // Sync on login
  useEffect(() => {
    if (!isAuthenticated || !user) return
    
    const syncData = async () => {
      setIsSyncing(true)
      
      try {
        // 1. Get local data
        const [preferences, progress, syncQueue] = await Promise.all([
          getUserPreferences(),
          getAllLearningProgress(),
          getSyncQueue()
        ])
        
        // 2. Sync preferences
        if (preferences) {
          await fetch('/api/user/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(preferences)
          })
        }
        
        // 3. Sync learning progress
        if (progress.length > 0) {
          await fetch('/api/user/learning-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progress })
          })
        }
        
        // 4. Process sync queue
        for (const item of syncQueue) {
          await fetch(`/api/sync/${item.entity}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: item.action,
              data: item.data
            })
          })
        }
        
        // 5. Clear sync queue
        await clearSyncQueue()
        
        setLastSyncTime(Date.now())
      } catch (error) {
        console.error('Sync failed:', error)
      } finally {
        setIsSyncing(false)
      }
    }
    
    syncData()
  }, [isAuthenticated, user])
  
  return { isSyncing, lastSyncTime }
}
```

#### 3. Usage in Components
```tsx
// SetupView.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/src/shared/hooks/useAuth'
import { useDataSync } from '@/src/shared/hooks/useDataSync'
import { saveUserPreferences, getUserPreferences } from '@/src/shared/lib/storage/indexeddb'

export function SetupView() {
  const { isAuthenticated } = useAuth()
  const { isSyncing } = useDataSync()
  const [country, setCountry] = useState('')
  const [technicalLevel, setTechnicalLevel] = useState<'noob' | 'informato' | 'smart'>('noob')
  
  // Load saved preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await getUserPreferences()
      if (prefs) {
        setCountry(prefs.country)
        setTechnicalLevel(prefs.technicalLevel)
      }
    }
    
    loadPreferences()
  }, [])
  
  const handleSave = async () => {
    const prefs = { country, technicalLevel }
    
    // Always save to IndexedDB first
    await saveUserPreferences(prefs)
    
    // If authenticated, also save to backend
    if (isAuthenticated) {
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      })
    }
  }
  
  return (
    <div>
      {isSyncing && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm">
          Sincronizzazione in corso...
        </div>
      )}
      
      {/* Settings form */}
    </div>
  )
}
```

**Applicare a:** User preferences, learning progress, offline-first features


---

## 🎨 DRAWER DESIGN IMPROVEMENTS

### Requisito Utente
> "Translate ALL existing drawers and improve design"

### Current Drawers to Improve

1. **Learning Path Drawer** ✅ (Already enterprise-level)
2. **Emergency Drawer** (Needs improvement)
3. **Longterm Drawer** (Needs improvement)
4. **Speculation Drawer** (Needs improvement)
5. **Passive Drawer** (Needs improvement)
6. **Settings Drawer** (Needs improvement)
7. **Profile Drawer** (Needs improvement)

### Improvement Checklist

#### Visual Design
- [ ] Apply `drawer-enterprise` class
- [ ] Add scroll shadow on header
- [ ] Use enterprise typography classes
- [ ] Add proper spacing with density system
- [ ] Implement card-hover-lift for interactive elements
- [ ] Add decorative dividers between sections
- [ ] Use semantic colors for alerts/badges

#### Interaction Design
- [ ] Enable swipe-to-close on mobile
- [ ] Implement focus management (inert + focus trap)
- [ ] Add scroll-to-top on open/tab change
- [ ] Implement proper keyboard navigation
- [ ] Add ESC to close
- [ ] Add backdrop click to close

#### Content Structure
- [ ] Add breadcrumb navigation (if multi-level)
- [ ] Use AlertEnterprise for notices
- [ ] Use ProgressStateBadge for states
- [ ] Use CTAEnterprise for actions
- [ ] Use FocusChip for tags/categories
- [ ] Add copy link button (if shareable)

#### Accessibility
- [ ] Add proper ARIA labels
- [ ] Ensure min 44px touch targets
- [ ] Add focus-visible styles
- [ ] Implement scroll-margin for focused elements
- [ ] Add loading states with proper announcements
- [ ] Test with screen reader

#### Performance
- [ ] Lazy load drawer content
- [ ] Optimize animations (prefers-reduced-motion)
- [ ] Use React.memo for heavy components
- [ ] Implement virtual scrolling for long lists

### Example: Emergency Drawer Improvement

**Before:**
```tsx
// Basic drawer without enterprise features
<div className="fixed inset-0 z-50">
  <div className="bg-white p-4">
    <h2>Emergency</h2>
    <div>Content...</div>
  </div>
</div>
```

**After:**
```tsx
// Enterprise-level drawer
<PremiumDrawer
  isOpen={isOpen}
  onClose={onClose}
  title="Asset Rifugio"
  subtitle="Emergency"
  icon={<ShieldIcon />}
  accentColor="warning"
  size="lg"
  showCopyLink={true}
  panelId="emergency"
  activeTab={activeTab}
  breadcrumb={['Dashboard', 'Emergency', 'Introduzione']}
  enableSwipeClose={true}
>
  {/* Header with scroll shadow */}
  <div className="drawer-enterprise-header">
    <AlertEnterprise
      type="warning"
      title="Attenzione"
      message="Questa sezione contiene informazioni critiche per la protezione del tuo capitale."
    />
  </div>
  
  {/* Content with enterprise styling */}
  <div className="space-y-6">
    {sections.map((section, index) => (
      <AnimatedSection key={section.id} delay={index * 80}>
        <div className="card-2026 p-6 card-hover-lift">
          <h3 className="text-enterprise-primary mb-2">{section.title}</h3>
          <p className="text-enterprise-body reading-line-height">{section.description}</p>
        </div>
      </AnimatedSection>
    ))}
  </div>
  
  {/* Footer with CTA */}
  <div className="mt-8 pt-6 border-t border-enterprise-soft">
    <CTAEnterprise variant="primary" onClick={handleContinue}>
      Continua con gli Errori da Evitare
    </CTAEnterprise>
  </div>
</PremiumDrawer>
```

**Applicare a:** Tutti i drawer esistenti

---

## 🌐 TRANSLATION REQUIREMENTS

### Requisito Utente
> "Translate ALL drawers - Not just Learning Path, all existing drawers"

### Translation Strategy

#### 1. Translation Files Structure
```
messages/
├── it/
│   ├── common.json          # Shared translations
│   ├── drawers.json         # All drawer translations
│   ├── learning-path.json   # Learning path specific
│   ├── emergency.json       # Emergency drawer
│   ├── longterm.json        # Longterm drawer
│   ├── speculation.json     # Speculation drawer
│   └── passive.json         # Passive drawer
└── en/
    ├── common.json
    ├── drawers.json
    ├── learning-path.json
    ├── emergency.json
    ├── longterm.json
    ├── speculation.json
    └── passive.json
```

#### 2. Drawer Translations Template
```json
// messages/it/drawers.json
{
  "drawer": {
    "close": "Chiudi",
    "back": "Torna indietro",
    "backAndClose": "Torna indietro e chiudi pannello",
    "copyLink": "Copia link sezione",
    "linkCopied": "Link copiato!",
    "loading": "Caricamento...",
    "error": "Si è verificato un errore",
    "retry": "Riprova"
  },
  "emergency": {
    "title": "Asset Rifugio",
    "subtitle": "Emergency",
    "description": "Proteggi il tuo capitale con strategie di sicurezza",
    "tabs": {
      "intro": "Introduzione",
      "errors": "Errori",
      "education": "Educativo",
      "tools": "Tool",
      "platforms": "Piattaforme"
    }
  },
  "longterm": {
    "title": "Investimento Lungo Termine",
    "subtitle": "Longterm",
    "description": "Costruisci ricchezza nel tempo con strategie sostenibili",
    "tabs": {
      "intro": "Introduzione",
      "errors": "Errori",
      "education": "Educativo",
      "tools": "Tool",
      "platforms": "Piattaforme"
    }
  },
  "speculation": {
    "title": "Trading Speculativo",
    "subtitle": "Speculation",
    "description": "Strategie avanzate per trader esperti",
    "tabs": {
      "intro": "Introduzione",
      "errors": "Errori",
      "education": "Educativo",
      "tools": "Tool",
      "platforms": "Piattaforme"
    }
  },
  "passive": {
    "title": "Rendita Passiva",
    "subtitle": "Passive",
    "description": "Genera reddito passivo con le crypto",
    "tabs": {
      "intro": "Introduzione",
      "errors": "Errori",
      "education": "Educativo",
      "tools": "Tool",
      "platforms": "Piattaforme"
    }
  }
}
```

#### 3. Usage in Components
```tsx
'use client'

import { useTranslations } from 'next-intl'

export function EmergencyDrawer() {
  const t = useTranslations('emergency')
  const tDrawer = useTranslations('drawer')
  
  return (
    <PremiumDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={t('title')}
      subtitle={t('subtitle')}
      showCopyLink={true}
    >
      <p>{t('description')}</p>
      
      {/* Tabs */}
      <div className="flex gap-2">
        {['intro', 'errors', 'education', 'tools', 'platforms'].map(tab => (
          <button key={tab}>
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </div>
    </PremiumDrawer>
  )
}
```

**Applicare a:** Tutti i drawer, modals, overlays


---

## 🌍 GLOBAL APPLICATION STRATEGY

### Requisito Utente
> "dovremmo portare allo stesso livello tutte le pagine, ma proprio tutte, senza stravolgere ne codice ne sistema di traduzione, impostazioni, footer, header, homepage"

### Pages to Upgrade

#### 1. Authentication Pages
- [ ] `/auth/login`
- [ ] `/auth/signup`
- [ ] `/auth/forgot-password`
- [ ] `/auth/reset-password`
- [ ] `/auth/verify-email`
- [ ] `/auth/complete-profile`

**Improvements:**
- Apply enterprise typography
- Use AlertEnterprise for errors
- Add viewport animations
- Implement proper focus management
- Add loading states with skeleton
- Use CTAEnterprise for buttons

#### 2. Marketing Pages
- [ ] `/` (Homepage)
- [ ] `/about`
- [ ] `/pricing`
- [ ] `/features`
- [ ] `/blog`
- [ ] `/contact`

**Improvements:**
- Apply section-frame pattern
- Use card-2026 for features
- Add decorative dividers
- Implement scroll animations
- Use enterprise color system
- Add proper meta tags for SEO

#### 3. Dashboard Pages
- [ ] `/dashboard` (Home)
- [ ] `/dashboard/emergency`
- [ ] `/dashboard/longterm`
- [ ] `/dashboard/speculation`
- [ ] `/dashboard/passive`
- [ ] `/dashboard/own`
- [ ] `/dashboard/yield`
- [ ] `/dashboard/invest`
- [ ] `/dashboard/speculate`
- [ ] `/dashboard/settings`

**Improvements:**
- Apply drawer-enterprise to all drawers
- Use JourneyCard for navigation
- Add progress indicators
- Implement proper loading states
- Use enterprise alerts
- Add breadcrumb navigation

#### 4. Layout Components
- [ ] Header
- [ ] Footer
- [ ] Sidebar (if any)
- [ ] Navigation
- [ ] Mobile menu

**Improvements:**
- Apply enterprise styling
- Add scroll shadow on header
- Use proper z-index hierarchy
- Implement mobile-first design
- Add proper ARIA labels
- Use semantic HTML

### Implementation Phases

#### Phase 1: Core Components (Week 1)
1. Update PremiumDrawer with all super-chicche ✅
2. Create SearchableCountrySelector component
3. Implement IndexedDB + sync system
4. Create SettingsOverlay component
5. Update all SVG icons to homemade style

#### Phase 2: Drawer Improvements (Week 2)
1. Upgrade Emergency drawer
2. Upgrade Longterm drawer
3. Upgrade Speculation drawer
4. Upgrade Passive drawer
5. Add translations for all drawers

#### Phase 3: Authentication Pages (Week 3)
1. Upgrade login page
2. Upgrade signup page
3. Upgrade password reset flow
4. Add proper error handling
5. Implement loading states

#### Phase 4: Marketing Pages (Week 4)
1. Upgrade homepage
2. Upgrade about page
3. Upgrade pricing page
4. Add proper animations
5. Optimize for SEO

#### Phase 5: Dashboard Pages (Week 5)
1. Upgrade dashboard home
2. Upgrade all journey pages
3. Add progress tracking
4. Implement proper navigation
5. Add help system

#### Phase 6: Layout & Polish (Week 6)
1. Upgrade header/footer
2. Improve mobile navigation
3. Add loading states everywhere
4. Implement error boundaries
5. Final accessibility audit

### Quality Checklist (Per Page)

#### Visual Design
- [ ] Uses enterprise color system
- [ ] Applies proper typography hierarchy
- [ ] Has consistent spacing (density system)
- [ ] Uses decorative elements appropriately
- [ ] Has proper hover/focus states

#### Interaction Design
- [ ] Smooth animations (150-300ms)
- [ ] Proper loading states
- [ ] Clear error messages
- [ ] Intuitive navigation
- [ ] Mobile-optimized interactions

#### Accessibility
- [ ] WCAG 2.2 AA compliant
- [ ] Proper ARIA labels
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Min 44px touch targets

#### Performance
- [ ] First Paint < 1.0s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] FID < 100ms
- [ ] Lighthouse score > 90

#### Content
- [ ] All text translated
- [ ] Proper meta tags
- [ ] SEO optimized
- [ ] Clear CTAs
- [ ] Helpful error messages

---

## 🎯 MULTINATIONAL CONTENT STRATEGY

### Requisito Utente
> "ci possiamo riuscire o ci rallenta troppo creare contenuti per 20-30 nazioni?"

### Analysis

#### Feasibility Assessment

**Pros:**
- Country-specific taxation content is CRITICAL for user trust
- Regulation differences are significant (MiCA EU vs US SEC)
- Local examples increase comprehension
- Competitive advantage (most platforms are US-centric)

**Cons:**
- 20-30 countries = massive content multiplication
- Tax laws change frequently (maintenance burden)
- Legal review needed per country
- Translation costs multiply

### Recommended Strategy: Tiered Approach

#### Tier 1: Full Localization (5 countries)
**Countries:** Italy, USA, UK, Germany, France

**Content:**
- Full taxation guides
- Country-specific regulation explanations
- Local platform recommendations
- Localized examples and case studies
- Native language translations

**Effort:** High (100% custom content per country)

#### Tier 2: Partial Localization (10 countries)
**Countries:** Spain, Portugal, Switzerland, Netherlands, Belgium, Austria, Canada, Australia, Japan, South Korea

**Content:**
- General taxation principles
- EU/regional regulation overview
- International platform recommendations
- Translated core content
- Generic examples

**Effort:** Medium (60% shared, 40% custom)

#### Tier 3: Minimal Localization (15+ countries)
**Countries:** All others

**Content:**
- Universal crypto principles
- International best practices
- Global platform recommendations
- English content only
- No country-specific taxation

**Effort:** Low (90% shared, 10% custom)


### Implementation Plan

#### 1. Content Architecture
```tsx
// src/shared/config/content-localization.ts
export interface LocalizedContent {
  country: string
  tier: 1 | 2 | 3
  modules: {
    taxation: 'full' | 'partial' | 'generic'
    regulation: 'full' | 'partial' | 'generic'
    platforms: 'local' | 'regional' | 'global'
    examples: 'localized' | 'generic'
  }
}

export const contentLocalization: Record<string, LocalizedContent> = {
  'IT': {
    country: 'Italy',
    tier: 1,
    modules: {
      taxation: 'full',      // Complete Italian tax guide
      regulation: 'full',    // MiCA + Italian specifics
      platforms: 'local',    // Italian exchanges
      examples: 'localized'  // EUR, Italian scenarios
    }
  },
  'US': {
    country: 'United States',
    tier: 1,
    modules: {
      taxation: 'full',      // IRS guidelines
      regulation: 'full',    // SEC + state laws
      platforms: 'local',    // US exchanges
      examples: 'localized'  // USD, US scenarios
    }
  },
  'ES': {
    country: 'Spain',
    tier: 2,
    modules: {
      taxation: 'partial',   // EU + Spanish basics
      regulation: 'partial', // MiCA focus
      platforms: 'regional', // EU exchanges
      examples: 'generic'    // EUR, generic scenarios
    }
  },
  'BR': {
    country: 'Brazil',
    tier: 3,
    modules: {
      taxation: 'generic',   // Universal principles
      regulation: 'generic', // International standards
      platforms: 'global',   // Global exchanges
      examples: 'generic'    // Generic scenarios
    }
  }
}
```

#### 2. Dynamic Content Loading
```tsx
// src/shared/hooks/useLocalizedContent.ts
'use client'

import { useMemo } from 'react'
import { useUserPreferences } from './useUserPreferences'
import { contentLocalization } from '@/src/shared/config/content-localization'

export function useLocalizedContent(moduleType: 'taxation' | 'regulation' | 'platforms' | 'examples') {
  const { country } = useUserPreferences()
  
  const contentLevel = useMemo(() => {
    const config = contentLocalization[country]
    if (!config) return 'generic'
    
    return config.modules[moduleType]
  }, [country, moduleType])
  
  const contentPath = useMemo(() => {
    switch (contentLevel) {
      case 'full':
      case 'localized':
        return `content/${country.toLowerCase()}/${moduleType}`
      case 'partial':
      case 'regional':
        return `content/regional/${getRegion(country)}/${moduleType}`
      case 'generic':
      case 'global':
      default:
        return `content/global/${moduleType}`
    }
  }, [contentLevel, country, moduleType])
  
  return { contentLevel, contentPath }
}

function getRegion(country: string): string {
  const euCountries = ['IT', 'ES', 'FR', 'DE', 'PT', 'NL', 'BE', 'AT']
  if (euCountries.includes(country)) return 'eu'
  
  const americasCountries = ['US', 'CA', 'BR', 'MX', 'AR']
  if (americasCountries.includes(country)) return 'americas'
  
  const asiaCountries = ['JP', 'KR', 'SG', 'HK']
  if (asiaCountries.includes(country)) return 'asia'
  
  return 'global'
}
```

#### 3. Content Fallback System
```tsx
// src/shared/components/LocalizedModule.tsx
'use client'

import { useLocalizedContent } from '@/src/shared/hooks/useLocalizedContent'
import { Suspense, lazy } from 'react'

interface LocalizedModuleProps {
  moduleType: 'taxation' | 'regulation' | 'platforms' | 'examples'
  fallback?: React.ReactNode
}

export function LocalizedModule({ moduleType, fallback }: LocalizedModuleProps) {
  const { contentPath, contentLevel } = useLocalizedContent(moduleType)
  
  // Dynamically import content component
  const ContentComponent = lazy(() => 
    import(`@/src/content/${contentPath}`)
      .catch(() => import(`@/src/content/global/${moduleType}`)) // Fallback to global
  )
  
  return (
    <div>
      {/* Content level indicator */}
      {contentLevel !== 'full' && contentLevel !== 'localized' && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm">
          <p className="text-amber-600 dark:text-amber-400">
            {contentLevel === 'partial' || contentLevel === 'regional' 
              ? 'Contenuto regionale: informazioni generali per la tua area'
              : 'Contenuto globale: principi universali applicabili ovunque'
            }
          </p>
        </div>
      )}
      
      {/* Content */}
      <Suspense fallback={fallback || <ContentSkeleton />}>
        <ContentComponent />
      </Suspense>
    </div>
  )
}

function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded" />
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
    </div>
  )
}
```

#### 4. Content Creation Workflow

**Phase 1: Core Content (Tier 1)**
1. Create full Italian content (reference implementation)
2. Create full US content
3. Create full UK content
4. Create full German content
5. Create full French content

**Phase 2: Regional Content (Tier 2)**
1. Create EU regional content (shared by 10 countries)
2. Create Americas regional content
3. Create Asia regional content
4. Translate to local languages

**Phase 3: Global Content (Tier 3)**
1. Create universal principles content
2. Create international best practices
3. Keep in English only

### Content Maintenance Strategy

#### 1. Update Frequency
- **Tier 1:** Monthly review, quarterly updates
- **Tier 2:** Quarterly review, bi-annual updates
- **Tier 3:** Annual review

#### 2. Legal Review
- **Tier 1:** Full legal review per country
- **Tier 2:** Regional legal review
- **Tier 3:** General disclaimer only

#### 3. Translation Management
- **Tier 1:** Professional translation + native review
- **Tier 2:** Professional translation
- **Tier 3:** English only

### Cost-Benefit Analysis

#### Tier 1 (5 countries)
- **Effort:** 500 hours per country = 2,500 hours
- **Cost:** €50,000 - €75,000
- **Benefit:** High trust, high conversion, competitive advantage
- **ROI:** High (these are main markets)

#### Tier 2 (10 countries)
- **Effort:** 200 hours per country = 2,000 hours
- **Cost:** €30,000 - €40,000
- **Benefit:** Medium trust, medium conversion
- **ROI:** Medium (secondary markets)

#### Tier 3 (15+ countries)
- **Effort:** 50 hours total = 50 hours
- **Cost:** €5,000 - €10,000
- **Benefit:** Low trust, low conversion
- **ROI:** Low (long-tail markets)

**Total Investment:** €85,000 - €125,000
**Total Time:** 4,550 hours (~2.5 FTE for 1 year)

### Recommendation

**START WITH TIER 1 ONLY**

1. Focus on 5 main markets (IT, US, UK, DE, FR)
2. Create exceptional, fully localized content
3. Build reputation and trust in these markets
4. Measure conversion and engagement
5. Expand to Tier 2 only if Tier 1 proves successful

**Why:**
- 80/20 rule: 5 countries = 80% of potential users
- Quality over quantity: Better to excel in 5 than be mediocre in 30
- Maintenance burden: 5 countries is manageable, 30 is not
- Legal risk: Full review for 5 is feasible, for 30 is prohibitive

---

## 📝 NEXT STEPS

### Immediate Actions (This Week)
1. ✅ Complete ModuleContentView.tsx with ALL chicche
2. ⏳ Implement Settings Overlay pattern
3. ⏳ Create SearchableCountrySelector component
4. ⏳ Setup IndexedDB + sync system
5. ⏳ Start Emergency drawer upgrade

### Short Term (Next 2 Weeks)
1. Complete all drawer upgrades
2. Add translations for all drawers
3. Implement country selector in onboarding
4. Test IndexedDB sync flow
5. Audit all authentication pages

### Medium Term (Next Month)
1. Upgrade all marketing pages
2. Upgrade all dashboard pages
3. Complete accessibility audit
4. Performance optimization
5. Create Tier 1 content for Italy

### Long Term (Next Quarter)
1. Complete Tier 1 content for all 5 countries
2. Evaluate Tier 2 expansion
3. Implement advanced features
4. Scale infrastructure
5. Launch marketing campaign

---

## 🎯 SUCCESS METRICS

### User Experience
- [ ] Lighthouse score > 95
- [ ] WCAG 2.2 AA compliance 100%
- [ ] Mobile usability score > 95
- [ ] User satisfaction > 4.5/5

### Performance
- [ ] First Paint < 1.0s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] FID < 100ms

### Business
- [ ] Conversion rate > 5%
- [ ] User retention > 60%
- [ ] NPS score > 50
- [ ] Support tickets < 2% of users

---

*Enterprise UX Guidelines 2026 - Tradelia*  
*Version: 1.0*  
*Last Updated: January 2026*  
*Status: ACTIVE*
