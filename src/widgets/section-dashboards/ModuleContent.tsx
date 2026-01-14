/**
 * Module Content Renderer - Premium Edition with ALL Chicche
 * 
 * Premium features:
 * - Reading progress bar (scroll-based)
 * - Drop cap for first paragraph
 * - Decorative quote marks in hooks
 * - Section numbers on headings (1, 2, 3)
 * - Decorative dividers between sections
 * - Animated checkmark on completion
 * - Custom text selection highlight
 * - Diamond divider at end
 */

'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { type LearningModule, type ModuleSection } from '@/src/shared/config/own-learning-path'

interface ModuleContentProps {
  module: LearningModule
  onComplete: () => void
  isCompleted: boolean
}

export function ModuleContent({ module, onComplete, isCompleted }: ModuleContentProps) {
  const [showCheckAnimation, setShowCheckAnimation] = useState(false)
  const articleRef = useRef<HTMLElement>(null)

  // Pre-calculate section numbers and first text detection
  const processedSections = useMemo(() => {
    let headingCount = 0
    let foundFirstText = false
    
    return module.sections.map((section) => {
      const isHeading = section.type === 'heading'
      const isText = section.type === 'text'
      
      if (isHeading) {
        headingCount++
      }
      
      const isFirstText = isText && !foundFirstText
      if (isText) {
        foundFirstText = true
      }
      
      return {
        ...section,
        sectionNumber: isHeading ? headingCount : undefined,
        isFirstText,
        showDivider: isHeading && headingCount > 1
      }
    })
  }, [module.sections])

  // Trigger checkmark animation on completion
  useEffect(() => {
    if (isCompleted) {
      setShowCheckAnimation(true)
      const timer = setTimeout(() => setShowCheckAnimation(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [isCompleted])

  return (<><article 
        ref={articleRef}
        className="reading-width selection:bg-primary-500/20 selection:text-foreground"
      >
        {/* Header con tempo stimato */}
        <header className="flex items-center gap-2 text-sm text-muted-foreground mb-8 pb-4 border-b border-border/30">
          <ClockIcon className="w-4 h-4" />
          <span>~{module.estimatedMinutes} minuti di lettura</span>
        </header>

        {/* Sezioni contenuto con animazioni viewport */}
        <div className="space-y-10">
          {processedSections.map((section, index) => (
            <AnimatedSection
              key={`${module.id}-${section.type}-${index}`}
              delay={index * 80}
            >
              {/* Decorative divider before non-first headings */}
              {section.showDivider && <DecorativeDivider />}
              
              <SectionRenderer
                section={section as ProcessedSection}
                sectionNumber={section.sectionNumber}
                isFirstText={section.isFirstText}
              />
            </AnimatedSection>
          ))}
        </div>

        {/* Diamond Divider at end */}
        <div className="flex items-center justify-center gap-3 my-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
          <DiamondIcon className="w-4 h-4 text-primary-500/60" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
        </div>

        {/* Footer CTA with animated checkmark */}
        <footer className="mt-8 pt-6 border-t border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {showCheckAnimation && (
                  <div className="animate-checkmark-pop">
                    <CheckCircleFilledIcon className="w-6 h-6 text-emerald-500" />
                  </div>
                )}
                <p className="text-foreground font-semibold text-base">
                  {isCompleted ? 'Modulo completato' : 'Hai finito di leggere?'}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isCompleted 
                  ? 'Puoi sempre tornare a rileggerlo' 
                  : 'Traccia i tuoi progressi'
                }
              </p>
            </div>
            <button
              onClick={onComplete}
              aria-label={isCompleted ? 'Rimuovi completamento' : 'Segna come letto'}
              className={`
                group relative px-6 py-3 rounded-xl font-semibold
                min-h-[48px] min-w-[140px] sm:min-w-[160px]
                transition-all duration-300 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                ${isCompleted
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/15 focus-visible:ring-emerald-500'
                  : 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg focus-visible:ring-primary-500'
                }
              `}
            >
              <span className={`
                inline-flex items-center gap-2 transition-transform duration-300
                ${!isCompleted ? 'group-hover:translate-x-0.5' : ''}
              `}>
                {isCompleted ? 'Completato' : 'Segna come letto'}
                {!isCompleted && <ArrowRightIcon className="w-4 h-4" />}
              </span>
            </button>
          </div>
        </footer>
      </article>
    </>
  )
}

// Decorative divider between sections
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

// Componente per animazione viewport-based
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

interface ProcessedSection extends ModuleSection {
  sectionNumber: number | undefined
  isFirstText: boolean
  showDivider: boolean
}

function SectionRenderer({ 
  section, 
  sectionNumber,
  isFirstText 
}: { 
  section: ProcessedSection
  sectionNumber: number | undefined
  isFirstText: boolean
}) {
  switch (section.type) {
    // HOOK - Quote elegante con virgolette decorative
    case 'hook':
      return (
        <div className="relative py-6 px-6 bg-gradient-to-r from-primary-500/8 to-primary-500/3 border-l-4 border-primary-500 rounded-r-xl">
          {/* Decorative opening quote */}
          <QuoteIcon className="absolute -top-2 -left-1 w-10 h-10 text-primary-500/20 transform -translate-x-1/2" />
          <p className="text-lg text-foreground reading-line-height font-medium italic pl-4">
            {section.content}
          </p>
          {/* Decorative closing quote */}
          <QuoteIcon className="absolute -bottom-2 right-4 w-8 h-8 text-primary-500/15 transform rotate-180" />
        </div>
      )

    // HEADING - Con numero sezione
    case 'heading':
      return (
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
      )

    // TEXT - Con drop cap per il primo paragrafo
    case 'text':
      return (
        <p className={`
          text-foreground reading-line-height text-base leading-7
          ${isFirstText ? 'first-letter:text-5xl first-letter:font-bold first-letter:text-primary-500 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none' : ''}
        `}>
          {formatTextWithEmphasis(section.content || '')}
        </p>
      )

    // EXAMPLE - Box sottile
    case 'example':
      return (
        <div className="p-5 bg-muted/30 rounded-xl border border-border/40">
          <div className="flex items-center gap-2 mb-3">
            <LightbulbIcon className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Esempio</span>
          </div>
          <p className="text-foreground reading-line-height">{section.content}</p>
        </div>
      )

    // COMPARISON - Cards raffinate
    case 'comparison':
      return (
        <div className="space-y-3">
          {section.items?.map((item, i) => (
            <div key={`comparison-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Tradizionale */}
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
          ))}
        </div>
      )

    // CALLOUT - Semantico e raffinato
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

    // TAKEAWAY - Finale memorabile
    case 'takeaway':
      return (
        <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/8 to-emerald-500/4 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Da ricordare</span>
          </div>
          <p className="text-foreground reading-line-height font-medium text-lg leading-relaxed">
            {section.content}
          </p>
        </div>
      )

    default:
      return null
  }
}

// Formatta testo con grassetto per termini chiave
function formatTextWithEmphasis(text: string): React.ReactNode {
  const keyTerms = [
    'soldi digitali',
    'senza banche',
    'sei tu la banca',
    'controllo totale',
    'responsabilita totale'
  ]
  
  let result = text
  keyTerms.forEach(term => {
    if (result.toLowerCase().includes(term.toLowerCase())) {
      const regex = new RegExp(`(${term})`, 'gi')
      result = result.replace(regex, '**$1**')
    }
  })

  const parts = result.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    }
    return part
  })
}

// ============ SVG ICONS ============

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  )
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
    </svg>
  )
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function CheckCircleFilledIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 8.707a1 1 0 0 0-1.414-1.414L11 13.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l5-5z" />
    </svg>
  )
}

function BankIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
    </svg>
  )
}

function CryptoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <circle cx="4" cy="6" r="2" />
      <circle cx="20" cy="6" r="2" />
      <circle cx="4" cy="18" r="2" />
      <circle cx="20" cy="18" r="2" />
      <path d="M6 7l4 4M14 11l4-4M6 17l4-4M14 13l4 4" />
    </svg>
  )
}

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 12l10 10 10-10L12 2z" />
    </svg>
  )
}


