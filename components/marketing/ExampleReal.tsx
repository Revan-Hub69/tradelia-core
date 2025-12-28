'use client'

import { useState, useEffect } from 'react'
import { UnifiedCard, CardHeader, CardTitle, CardContent } from "@/components/ui/design-system/unified-card"
import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { CheckIcon } from "@/components/icons/check-icon"
import { CrossIcon } from "@/components/icons/cross-icon"
import { FearGreedWidget } from "@/components/indicators/fear-greed-widget"
import { AIFearGreedAnalysis, AIAnalysisPlaceholder } from "@/components/indicators/ai-fear-greed-analysis"

interface FearGreedData {
  value: number
  value_class: string
  value_classification: string
  timestamp: string
  time_until_update: string
  source: string
  last_updated: string
  database_id: string
}

export default function ExampleReal() {
  const [fearGreedData, setFearGreedData] = useState<FearGreedData | null>(null)

  useEffect(() => {
    const fetchFearGreedData = async () => {
      try {
        const response = await fetch('/api/indicators/fear-greed')
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setFearGreedData(result.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch Fear & Greed data:', error)
      }
    }

    fetchFearGreedData()
  }, [])

  return (
    <SectionLayout background="muted">
      <SectionHeader 
        badge="Esempio Pratico"
        title="Fear & Greed Index"
        subtitle="Un indicatore spiegato dalle basi accademiche alla lettura pratica, senza semplificazioni pericolose."
      />

      {/* Main Content: Widget + AI side by side on desktop, stacked on mobile */}
      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        
        {/* Widget */}
        <UnifiedCard variant="standard">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Dati Live</span>
            <span className="text-xs text-muted-foreground">Alternative.me</span>
          </div>
          <FearGreedWidget />
        </UnifiedCard>

        {/* AI Analysis - NO nested cards, just content */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <div className="w-5 h-5 bg-background rounded-lg"></div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Tradelia AI Analysis</h3>
              <p className="text-sm text-muted-foreground">Interpretazione contestuale</p>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            {fearGreedData ? (
              <AIFearGreedAnalysis 
                fearGreedValue={fearGreedData.value}
                fearGreedClass={fearGreedData.value_class}
                fearGreedClassification={fearGreedData.value_classification}
              />
            ) : (
              <AIAnalysisPlaceholder />
            )}
          </div>

          {/* AI Principles - Simple badges */}
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1.5 rounded-full text-xs font-medium">
              <CheckIcon className="h-3 w-3" />
              Nessuna Previsione
            </div>
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1.5 rounded-full text-xs font-medium">
              <CheckIcon className="h-3 w-3" />
              Zero Raccomandazioni
            </div>
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1.5 rounded-full text-xs font-medium">
              <CheckIcon className="h-3 w-3" />
              Solo Educazione
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content - 3 colonne */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* 1. Fondamento */}
        <UnifiedCard variant="standard">
          <CardHeader>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mb-3">
              <span className="text-primary-foreground font-bold text-sm">1</span>
            </div>
            <CardTitle className="text-xl">Fondamento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">
              Nasce dalla <strong className="text-foreground">finanza comportamentale</strong> (Kahneman, Tversky). 
              Paura e avidità influenzano le decisioni.
            </p>
            <div className="bg-muted rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground italic">
                "Quantifica le emozioni collettive del mercato"
              </p>
            </div>
          </CardContent>
        </UnifiedCard>

        {/* 2. Meccanismo */}
        <UnifiedCard variant="standard">
          <CardHeader>
            <div className="w-8 h-8 bg-info rounded-lg flex items-center justify-center mb-3">
              <span className="text-info-foreground font-bold text-sm">2</span>
            </div>
            <CardTitle className="text-xl">Meccanismo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">
              Combina fattori di mercato con pesi specifici:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm bg-muted rounded p-2">
                <span className="font-medium text-foreground">Volatilità</span>
                <span className="text-muted-foreground">25%</span>
              </div>
              <div className="flex justify-between text-sm bg-muted rounded p-2">
                <span className="font-medium text-foreground">Volume</span>
                <span className="text-muted-foreground">25%</span>
              </div>
              <div className="flex justify-between text-sm bg-muted rounded p-2">
                <span className="font-medium text-foreground">Altri</span>
                <span className="text-muted-foreground">50%</span>
              </div>
            </div>
          </CardContent>
        </UnifiedCard>

        {/* 3. Uso Corretto - REDESIGNED */}
        <UnifiedCard variant="standard">
          <CardHeader>
            <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center mb-3">
              <CheckIcon className="h-4 w-4 text-success-foreground" />
            </div>
            <CardTitle className="text-xl">Uso Corretto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4 text-success-foreground">
              <strong>Termometro del sentiment</strong> - Non uno strumento predittivo
            </p>
            
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground font-medium mb-2">❌ Non usare per:</div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground">•</span>
                <span>Prevedere movimenti</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground">•</span>
                <span>Segnali di trading</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground">•</span>
                <span>Decisioni isolate</span>
              </div>
            </div>
          </CardContent>
        </UnifiedCard>
      </div>
    </SectionLayout>
  )
}
