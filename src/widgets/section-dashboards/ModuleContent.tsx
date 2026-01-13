/**
 * Module Content Renderer
 * 
 * Renderizza il contenuto dei moduli educativi
 * Segue le regole enterprise: typography, contrast, spacing
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
    <div className="space-y-8">
      {/* Tempo stimato */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Tempo di lettura stimato:</span>
        <span className="font-medium">{module.estimatedMinutes} min</span>
      </div>

      {/* Sezioni contenuto */}
      {module.sections.map((section, index) => (
        <SectionRenderer key={`section-${index}`} section={section} />
      ))}

      {/* Completamento */}
      <section className="border-t border-border/50 pt-6 mt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h4 className="text-foreground font-semibold mb-1">
              Completamento modulo
            </h4>
            <p className="text-muted-foreground text-sm">
              {isCompleted ? 'Modulo completato' : 'Segna come completato quando hai finito di leggere'}
            </p>
          </div>
          <button
            onClick={onComplete}
            className={`px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] ${
              isCompleted
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {isCompleted ? 'Completato' : 'Segna completato'}
          </button>
        </div>
      </section>
    </div>
  )
}

function SectionRenderer({ section }: { section: ModuleSection }) {
  switch (section.type) {
    case 'text':
      return (
        <p className="text-foreground leading-relaxed reading-line-height">
          {section.content}
        </p>
      )

    case 'list':
      return (
        <div>
          {section.title && (
            <h3 className="text-foreground font-semibold mb-3">{section.title}</h3>
          )}
          <ul className="space-y-2">
            {section.items?.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'glossary':
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-foreground font-semibold mb-1">{section.title}</h3>
            <p className="text-sm text-muted-foreground">
              Questa sezione chiarisce i termini usati sopra. Non è necessario memorizzarli: serve a evitare fraintendimenti.
            </p>
          </div>
          <div className="space-y-4 pl-4 border-l-2 border-border/50">
            {section.glossaryItems?.map((item, i) => (
              <div key={i}>
                <dt className="font-semibold text-foreground">{item.term}</dt>
                <dd className="text-muted-foreground mt-1 leading-relaxed">
                  {item.definition}
                </dd>
              </div>
            ))}
          </div>
        </div>
      )

    case 'comparison':
      return (
        <div className="space-y-4">
          <h3 className="text-foreground font-semibold">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sistemi tradizionali */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-medium text-foreground mb-3 text-sm uppercase tracking-wider">
                Sistemi bancari tradizionali
              </h4>
              <ul className="space-y-2">
                {section.comparisonData?.traditional.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Criptovalute */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-medium text-foreground mb-3 text-sm uppercase tracking-wider">
                Criptovalute
              </h4>
              <ul className="space-y-2">
                {section.comparisonData?.crypto.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )

    case 'alert':
      return (
        <div className={`p-4 rounded-lg ${
          section.alertType === 'warning' 
            ? 'bg-warning/10 border border-warning/20' 
            : 'bg-primary/10 border border-primary/20'
        }`}>
          <h4 className={`font-semibold mb-3 ${
            section.alertType === 'warning' ? 'text-warning' : 'text-primary'
          }`}>
            {section.title}
          </h4>
          <ul className="space-y-2">
            {section.items?.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                  section.alertType === 'warning' ? 'bg-warning' : 'bg-primary'
                }`} />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'takeaway':
      return (
        <div className="p-4 rounded-lg bg-primary/5 border-l-4 border-primary">
          <p className="text-foreground font-medium leading-relaxed">
            {section.content}
          </p>
        </div>
      )

    default:
      return null
  }
}
