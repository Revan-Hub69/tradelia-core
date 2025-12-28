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
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-amber-200/30 shadow-lg mb-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-amber-200 rounded w-3/4"></div>
          <div className="h-4 bg-amber-200 rounded w-full"></div>
          <div className="h-4 bg-amber-200 rounded w-5/6"></div>
          <div className="h-4 bg-amber-200 rounded w-2/3"></div>
        </div>
        <div className="mt-4 text-sm text-amber-700">
          Tradelia AI sta analizzando il valore corrente...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-amber-200/30 shadow-lg mb-6">
        <div className="text-amber-800">
          <p className="text-lg leading-relaxed mb-4 italic">
            "Con un valore di <strong>{fearGreedValue}</strong>, siamo in territorio di <strong>{fearGreedClassification}</strong>. 
            L'analisi AI dettagliata non è al momento disponibile, ma possiamo comunque fornire il contesto base."
          </p>
          <p className="text-amber-700 leading-relaxed">
            {fearGreedValue <= 25 && "Valori così bassi indicano spesso capitolazione degli investitori retail e forte pessimismo di mercato."}
            {fearGreedValue > 25 && fearGreedValue <= 45 && "Il mercato mostra segni di cautela e incertezza, con sentiment prevalentemente negativo."}
            {fearGreedValue > 45 && fearGreedValue <= 55 && "Il sentiment è relativamente equilibrato, senza emozioni estreme dominanti."}
            {fearGreedValue > 55 && fearGreedValue <= 75 && "Il mercato mostra ottimismo crescente, ma ancora controllato."}
            {fearGreedValue > 75 && "Livelli di avidità elevati possono indicare euforia di mercato e potenziale surriscaldamento."}
            {" "}Ricorda: <strong>questo non è un segnale di timing</strong>, ma solo un termometro delle emozioni collettive.
          </p>
        </div>
        <div className="mt-3 text-xs text-amber-600">
          Errore AI: {error}
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-amber-200/30 shadow-lg mb-6">
        <div className="text-amber-800">
          <p className="text-lg leading-relaxed italic">
            Analisi AI non disponibile al momento.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-amber-200/30 shadow-lg mb-6">
      <div className="prose prose-amber max-w-none">
        <div 
          className="text-lg text-amber-900 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: analysis }}
        />
      </div>
    </div>
  )
}

// Fallback component for when no data is available
export function AIAnalysisPlaceholder() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-amber-200/30 shadow-lg mb-6">
      <div className="text-amber-800">
        <p className="text-lg leading-relaxed mb-4 italic">
          "L'analisi AI apparirà qui una volta caricati i dati del Fear & Greed Index. 
          Tradelia AI fornirà un'interpretazione contestuale del valore corrente."
        </p>
        <p className="text-amber-700 leading-relaxed">
          L'analisi includerà il significato del valore attuale, i fattori che potrebbero influenzare 
          il mercato, e come interpretare l'indicatore senza cadere in semplificazioni pericolose.
        </p>
      </div>
    </div>
  )
}