/**
 * Module Content Renderer
 * 
 * Design basato su best practice:
 * - Duolingo (learning path)
 * - Khan Academy (educational content)
 * - Typography hierarchy (contrast + spacing)
 */

'use client'

import { type LearningModule, type ModuleSection } from '@/src/shared/config/own-learning-path'

interface ModuleContentProps {
  module: LearningModule
  onComplete: () => void
  isCompleted: boolean
}

export function ModuleContent({ module, onComplete, isCompleted }: ModuleContentProps) {
  return (
    <article className="reading-width">
      {/* Header con tempo stimato */}
      <header className="flex items-center gap-2 text-sm text-muted-foreground mb-8 pb-4 border-b border-border/30">
        <ClockIcon className="w-4 h-4" />
        <span>~{module.estimatedMinutes} minuti di lettura</span>
      </header>

      {/* Sezioni contenuto con spacing variabile */}
      <div className="space-y-10">
        {module.sections.map((section, index) => (
          <SectionRenderer 
            key={`${module.id}-${section.type}-${index}`} 
            section={section}
            isFirst={index === 0}
          />
        ))}
      </div>

      {/* Footer con CTA - sticky su mobile */}
      <footer className="mt-12 pt-6 border-t border-border/50 sticky bottom-0 bg-background/95 backdrop-blur-sm pb-4 -mx-4 px-4 sm:static sm:bg-transparent sm:backdrop-blur-none sm:mx-0 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-foreground font-semibold">
              {isCompleted ? '✓ Modulo completato' : 'Hai finito di leggere?'}
            </p>
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
              px-6 py-3 rounded-xl font-semibold transition-all duration-200
              min-h-[48px] min-w-[160px]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              ${isCompleted
                ? 'bg-success/10 text-success border-2 border-success/30 hover:bg-success/20'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5'
              }
            `}
          >
            {isCompleted ? 'Completato' : 'Segna come letto'}
          </button>
        </div>
      </footer>
    </article>
  )
}

function SectionRenderer({ section, isFirst }: { section: ModuleSection; isFirst: boolean }) {
  switch (section.type) {
    // HOOK - Quote style con icona
    case 'hook':
      return (
        <div className="relative py-5 px-6 bg-gradient-to-r from-primary/8 to-primary/3 border-l-4 border-primary rounded-r-xl animate-fade-in">
          <QuoteIcon className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
          <p className="text-lg text-foreground reading-line-height font-medium pr-8">
            {section.content}
          </p>
        </div>
      )

    // HEADING - Con icona e più contrasto
    case 'heading':
      return (
        <div className={`flex items-center gap-3 ${isFirst ? '' : 'pt-6 mt-6 border-t border-border/30'}`}>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <SectionIcon className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            {section.title}
          </h3>
        </div>
      )

    // TEXT - Con grassetto per termini chiave
    case 'text':
      return (
        <p className="text-foreground reading-line-height text-base leading-7">
          {formatTextWithEmphasis(section.content || '')}
        </p>
      )

    // EXAMPLE - Box con icona
    case 'example':
      return (
        <div className="p-5 bg-muted/40 rounded-xl border border-border/50 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <LightbulbIcon className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-warning">Esempio</span>
          </div>
          <p className="text-foreground reading-line-height">{section.content}</p>
        </div>
      )

    // COMPARISON - Cards con hover effect
    case 'comparison':
      return (
        <div className="space-y-4">
          {section.items?.map((item, i) => (
            <div 
              key={`comparison-${i}`}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Tradizionale */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 transition-all duration-200 hover:bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">🏦</span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Banca</span>
                </div>
                <p className="text-sm text-muted-foreground reading-line-height">
                  {item.left}
                </p>
              </div>
              {/* Crypto */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 transition-all duration-200 hover:bg-primary/10 hover:border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs">₿</span>
                  </div>
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">Crypto</span>
                </div>
                <p className="text-sm text-foreground reading-line-height font-medium">
                  {item.right}
                </p>
              </div>
            </div>
          ))}
        </div>
      )

    // CALLOUT - Con icona semantica
    case 'callout': {
      const styles = {
        info: {
          bg: 'bg-primary/8',
          border: 'border-primary/25',
          icon: <InfoIcon className="w-5 h-5 text-primary" />,
          text: 'text-foreground'
        },
        warning: {
          bg: 'bg-warning/8',
          border: 'border-warning/25',
          icon: <AlertIcon className="w-5 h-5 text-warning" />,
          text: 'text-foreground'
        },
        insight: {
          bg: 'bg-muted/60',
          border: 'border-border',
          icon: <SparkleIcon className="w-5 h-5 text-muted-foreground" />,
          text: 'text-foreground'
        }
      }
      const style = styles[section.calloutType || 'info']
      
      return (
        <div className={`p-5 rounded-xl border ${style.bg} ${style.border} animate-fade-in`}>
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
            <p className={`reading-line-height ${style.text}`}>
              {section.content}
            </p>
          </div>
        </div>
      )
    }

    // TAKEAWAY - Highlight finale
    case 'takeaway':
      return (
        <div className="p-6 rounded-xl bg-gradient-to-r from-success/10 to-success/5 border border-success/25 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircleIcon className="w-5 h-5 text-success" />
            <span className="text-sm font-bold text-success uppercase tracking-wide">Da ricordare</span>
          </div>
          <p className="text-foreground reading-line-height font-semibold text-lg">
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
  // Pattern per termini da evidenziare (tra asterischi o termini chiave noti)
  const keyTerms = [
    'soldi digitali',
    'senza banche',
    'sei tu la banca',
    'controllo totale',
    'responsabilità totale'
  ]
  
  let result = text
  keyTerms.forEach(term => {
    if (result.toLowerCase().includes(term.toLowerCase())) {
      const regex = new RegExp(`(${term})`, 'gi')
      result = result.replace(regex, '**$1**')
    }
  })
  
  // Converti **testo** in <strong>
  const parts = result.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    }
    return part
  })
}

// Icons - minimal, consistent stroke
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
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

function SectionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  )
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
    </svg>
  )
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}
