'use client'

import { useState, useEffect } from 'react'
import { CheckIcon } from "@/components/icons/check-icon"

interface AIAnalysisProps {
  fearGreedValue: number
  fearGreedClass: string
  fearGreedClassification: string
}

interface AIResponse {
  success: boolean
  explanation?: string
  error?: string
}

export function AIFearGreedAnalysis({ fearGreedValue, fearGreedClass, fearGreedClassification }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAIAnalysis = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/ai/explain-fear-greed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            value: fearGreedValue,
            classification: fearGreedClass, // Usa value_class invece di value_classification
            context: {
              timestamp: new Date().toISOString(),
              source: 'alternative.me'
            }
          })
        })
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }
        
        const result: AIResponse = await response.json()
        
        if (result.success && result.explanation) {
          setAnalysis(result.explanation)
        } else {
          throw new Error(result.error || 'Invalid AI response')
        }
        
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMsg)
        console.error('AI Analysis error:', err)
      } finally {
        setLoading(false)
      }
    }

    // Solo se abbiamo tutti i dati necessari
    if (fearGreedValue !== undefined && fearGreedClass && fearGreedClassification) {
      fetchAIAnalysis()
    }
  }, [fearGreedValue, fearGreedClass, fearGreedClassification])

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
        <div className="text-sm text-muted-foreground">
          Tradelia AI sta analizzando il valore corrente...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-base leading-relaxed italic text-foreground">
          "Con un valore di <strong>{fearGreedValue}</strong>, siamo in territorio di <strong>{fearGreedClassification}</strong>. 
          L'analisi AI dettagliata non è al momento disponibile, ma possiamo comunque fornire il contesto base."
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {fearGreedValue <= 25 && "Valori così bassi indicano spesso capitolazione degli investitori retail e forte pessimismo di mercato."}
          {fearGreedValue > 25 && fearGreedValue <= 45 && "Il mercato mostra segni di cautela e incertezza, con sentiment prevalentemente negativo."}
          {fearGreedValue > 45 && fearGreedValue <= 55 && "Il sentiment è relativamente equilibrato, senza emozioni estreme dominanti."}
          {fearGreedValue > 55 && fearGreedValue <= 75 && "Il mercato mostra ottimismo crescente, ma ancora controllato."}
          {fearGreedValue > 75 && "Livelli di avidità elevati possono indicare euforia di mercato e potenziale surriscaldamento."}
          {" "}Ricorda: <strong className="text-foreground">questo non è un segnale di timing</strong>, ma solo un termometro delle emozioni collettive.
        </p>
        <div className="text-xs text-muted-foreground">
          Errore AI: {error}
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="text-base leading-relaxed italic text-muted-foreground">
        Analisi AI non disponibile al momento.
      </div>
    )
  }

  return (
    <div 
      className="text-base leading-relaxed text-foreground prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: analysis }}
    />
  )
}

// Fallback component for when no data is available
export function AIAnalysisPlaceholder() {
  return (
    <div className="space-y-3">
      <p className="text-base leading-relaxed italic text-foreground">
        "L'analisi AI apparirà qui una volta caricati i dati del Fear & Greed Index. 
        Tradelia AI fornirà un'interpretazione contestuale del valore corrente."
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        L'analisi includerà il significato del valore attuale, i fattori che potrebbero influenzare 
        il mercato, e come interpretare l'indicatore senza cadere in semplificazioni pericolose.
      </p>
    </div>
  )
}