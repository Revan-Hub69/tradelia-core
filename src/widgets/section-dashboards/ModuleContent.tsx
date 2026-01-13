/**
 * Module Content Renderer
 * 
 * Renderizza il contenuto dei moduli educativi
 * Design: pulito, leggibile, gerarchia visiva chiara
 * Target: persona normale, non universitario
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
    <article className="space-y-6">
      {/* Tempo stimato - discreto */}
      <div className="text-sm text-muted-foreground">
        ~{module.estimatedMinutes} minuti di lettura
      </div>

      {/* Sezioni contenuto */}
      <div className="space-y-8">
        {module.sections.map((section, index) => (
          <SectionRenderer 
            key={`${module.id}-${section.type}-${index}`} 
            section={section} 
          />
        ))}
      </div>

      {/* Completamento */}
      <footer className="border-t border-border/50 pt-6 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-foreground font-medium">
              {isCompleted ? 'Hai completato questo modulo' : 'Hai finito di leggere?'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {isCompleted 
                ? 'Puoi sempre tornare a rileggerlo' 
                : 'Segna come completato per tracciare i tuoi progressi'
              }
            </p>
          </div>
          <button
            onClick={onComplete}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all min-h-[44px] ${
              isCompleted
                ? 'bg-success/10 text-success border border-success/30 hover:bg-success/20'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
            }`}
          >
            {isCompleted ? '✓ Completato' : 'Segna come letto'}
          </button>
        </div>
      </footer>
    </article>
  )
}

function SectionRenderer({ section }: { section: ModuleSection }) {
  switch (section.type) {
    // HOOK - Cattura attenzione, stile quote
    case 'hook':
      return (
        <div className="py-4 px-5 bg-primary/5 border-l-4 border-primary rounded-r-lg">
          <p className="text-lg text-foreground leading-relaxed font-medium">
            {section.content}
          </p>
        </div>
      )

    // HEADING - Titolo sezione
    case 'heading':
      return (
        <h3 className="text-lg font-semibold text-foreground pt-4 first:pt-0">
          {section.title}
        </h3>
      )

    // TEXT - Paragrafo normale
    case 'text':
      return (
        <p className="text-foreground leading-relaxed" style={{ lineHeight: '1.7' }}>
          {section.content}
        </p>
      )

    // EXAMPLE - Esempio concreto
    case 'example':
      return (
        <div className="p-4 bg-muted/40 rounded-lg border border-border/50">
          <p className="text-sm font-medium text-muted-foreground mb-2">Esempio</p>
          <p className="text-foreground leading-relaxed">{section.content}</p>
        </div>
      )

    // COMPARISON - Confronto side by side (semplificato)
    case 'comparison':
      return (
        <div className="space-y-3">
          {section.items?.map((item, i) => (
            <div 
              key={`comparison-${i}`}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {/* Lato sinistro - tradizionale */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.left}
                </p>
              </div>
              {/* Lato destro - crypto */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground leading-relaxed">
                  {item.right}
                </p>
              </div>
            </div>
          ))}
        </div>
      )

    // CALLOUT - Box informativo/warning/insight
    case 'callout':
      const calloutStyles = {
        info: 'bg-primary/10 border-primary/30 text-primary',
        warning: 'bg-warning/10 border-warning/30 text-warning',
        insight: 'bg-muted/50 border-border text-foreground'
      }
      const style = calloutStyles[section.calloutType || 'info']
      
      return (
        <div className={`p-4 rounded-lg border ${style.split(' ').slice(0, 2).join(' ')}`}>
          <p className={`leading-relaxed ${style.split(' ').slice(2).join(' ')}`}>
            {section.content}
          </p>
        </div>
      )

    // TAKEAWAY - Conclusione chiave
    case 'takeaway':
      return (
        <div className="p-5 rounded-lg bg-success/5 border border-success/20">
          <p className="text-sm font-medium text-success mb-2">Da ricordare</p>
          <p className="text-foreground leading-relaxed font-medium">
            {section.content}
          </p>
        </div>
      )

    default:
      return null
  }
}
