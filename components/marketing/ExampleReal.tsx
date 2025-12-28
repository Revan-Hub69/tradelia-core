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

      {/* Main Content: Widget + AI */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        
        {/* Widget - 1 colonna */}
        <div className="lg:col-span-1">
          <UnifiedCard variant="elevated">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Dati Live</span>
              <span className="text-xs text-muted-foreground">Alternative.me</span>
            </div>
            <FearGreedWidget />
          </UnifiedCard>
        </div>

        {/* AI Analysis - 2 colonne */}
        <div className="lg:col-span-2">
          <UnifiedCard variant="elevated" className="bg-gradient-to-br from-warning/10 to-background border-warning/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-warning rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 bg-background rounded-lg"></div>
                </div>
                <div>
                  <CardTitle className="text-warning-foreground">Tradelia AI Analysis</CardTitle>
                  <p className="text-sm text-muted-foreground">Interpretazione contestuale</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {fearGreedData ? (
                <AIFearGreedAnalysis 
                  fearGreedValue={fearGreedData.value}
                  fearGreedClass={fearGreedData.value_class}
                  fearGreedClassification={fearGreedData.value_classification}
                />
              ) : (
                <AIAnalysisPlaceholder />
              )}

              {/* AI Principles */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <CheckIcon className="h-5 w-5 text-success mx-auto mb-1" />
                  <div className="text-xs font-medium text-foreground">Nessuna Previsione</div>
                </div>
                <div className="text-center">
                  <CheckIcon className="h-5 w-5 text-success mx-auto mb-1" />
                  <div className="text-xs font-medium text-foreground">Zero Raccomandazioni</div>
                </div>
                <div className="text-center">
                  <CheckIcon className="h-5 w-5 text-success mx-auto mb-1" />
                  <div className="text-xs font-medium text-foreground">Solo Educazione</div>
                </div>
              </div>
            </CardContent>
          </UnifiedCard>
        </div>
      </div>

      {/* Educational Content - 3 colonne uguali */}
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

        {/* 3. Errori */}
        <UnifiedCard variant="standard">
          <CardHeader>
            <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center mb-3">
              <CrossIcon className="h-4 w-4 text-destructive-foreground" />
            </div>
            <CardTitle className="text-xl">Errori da Evitare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-3">
              <div className="flex items-start gap-2 text-sm">
                <CrossIcon className="h-3 w-3 text-destructive mt-1 flex-shrink-0" />
                <span>Usarlo per prevedere</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CrossIcon className="h-3 w-3 text-destructive mt-1 flex-shrink-0" />
                <span>Segnale di trading</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CrossIcon className="h-3 w-3 text-destructive mt-1 flex-shrink-0" />
                <span>Unico fattore decisionale</span>
              </div>
            </div>
            <div className="bg-success/10 border border-success/30 rounded-lg p-3">
              <p className="text-xs text-success-foreground font-medium">
                ✓ Uso corretto: termometro del sentiment
              </p>
            </div>
          </CardContent>
        </UnifiedCard>
      </div>
    </SectionLayout>
  )
}
