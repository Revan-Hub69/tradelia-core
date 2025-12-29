'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { SectionLayout, SectionHeader } from '@/components/ui/design-system/section-layout'
import { UnifiedCard, CardHeader, CardTitle, CardContent } from '@/components/ui/design-system/unified-card'
import { getFearGreedBand, FEAR_GREED_DEFINITION, TRADELIA_METHOD } from '@/lib/indicators/fear-greed-analysis'

interface FearGreedEducationalProps {
  value?: number
  classification?: string
}

// Professional Gauge Component - Clean, no childish elements
function FearGreedGauge({ value }: { value: number }) {
  const band = getFearGreedBand(value)
  
  return (
    <div className="relative w-64 h-40 mx-auto">
      {/* Clean semicircle gauge */}
      <svg
        viewBox="0 0 200 120"
        className="w-full h-full"
      >
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={`hsl(var(--${band.colorVar}))`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (value / 100) * 251.2}
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Scale markers */}
        {[0, 25, 50, 75, 100].map((mark) => {
          const angle = (mark / 100) * Math.PI - Math.PI
          const x1 = 100 + 75 * Math.cos(angle)
          const y1 = 100 + 75 * Math.sin(angle)
          const x2 = 100 + 85 * Math.cos(angle)
          const y2 = 100 + 85 * Math.sin(angle)
          
          return (
            <line
              key={mark}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="2"
            />
          )
        })}
      </svg>
      
      {/* Value display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <div className="text-4xl font-bold font-mono-numbers">{value}</div>
        <div className="text-sm text-muted-foreground font-medium">/ 100</div>
      </div>
    </div>
  )
}

export function FearGreedEducational({ value: initialValue, classification }: FearGreedEducationalProps) {
  const [currentValue, setCurrentValue] = useState(24) // Default per demo
  const [isLive, setIsLive] = useState(false)

  // Simula aggiornamento giornaliero
  useEffect(() => {
    if (initialValue) {
      setCurrentValue(initialValue)
      setIsLive(true)
    }
  }, [initialValue])

  const currentBand = getFearGreedBand(currentValue)

  return (
    <SectionLayout background="white">
      <div className="mx-auto max-w-4xl">
        <SectionHeader 
          badge="Educazione Finanziaria"
          title="Indice Paura & Avidità"
          subtitle="Comprendi il sentiment del mercato crypto attraverso l'analisi comportamentale"
        />

        {/* Current Value Display */}
        <UnifiedCard variant="elevated" className="mb-8">
          <div className="text-center space-y-6">
            <FearGreedGauge value={currentValue} />
            
            <div className="space-y-3">
              <Badge 
                variant="outline" 
                className={`text-lg font-semibold px-4 py-2 border-2 ${currentBand.borderClass} ${currentBand.textClass}`}
              >
                {currentBand.name}
              </Badge>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Fascia: {currentBand.range}</p>
                {isLive && <p>Aggiornamento giornaliero</p>}
              </div>
            </div>
          </div>
        </UnifiedCard>

        {/* Academic Definition */}
        <UnifiedCard className="mb-8">
          <CardHeader>
            <CardTitle>{FEAR_GREED_DEFINITION.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-foreground leading-relaxed mb-4">
                {FEAR_GREED_DEFINITION.definition}
              </p>
              <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r">
                <p className="text-primary font-medium">
                  {FEAR_GREED_DEFINITION.keyPoint}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-foreground">
                {FEAR_GREED_DEFINITION.methodology.title}
              </h4>
              <p className="text-foreground mb-4">
                {FEAR_GREED_DEFINITION.methodology.description}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {FEAR_GREED_DEFINITION.methodology.factors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-foreground">{factor}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {FEAR_GREED_DEFINITION.methodology.source}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-foreground">
                {FEAR_GREED_DEFINITION.theoreticalBase.title}
              </h4>
              <p className="text-foreground mb-4">
                {FEAR_GREED_DEFINITION.theoreticalBase.description}
              </p>
              <div className="space-y-2">
                {FEAR_GREED_DEFINITION.theoreticalBase.principles.map((principle, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-foreground">{principle}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {FEAR_GREED_DEFINITION.theoreticalBase.reference}
              </p>
            </div>
          </CardContent>
        </UnifiedCard>

        {/* Current Band Analysis */}
        <UnifiedCard className={`mb-8 border-2 ${currentBand.borderClass}`}>
          <CardHeader>
            <CardTitle className={`${currentBand.textClass} flex items-center gap-3`}>
              <div className={`w-3 h-3 rounded-full ${currentBand.bgClass}`}></div>
              Fascia {currentBand.id}: {currentBand.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h5 className="font-semibold mb-2 text-foreground">Interpretazione Tradelia AI</h5>
              <p className="text-foreground leading-relaxed">{currentBand.interpretation}</p>
            </div>

            <div>
              <h5 className="font-semibold mb-2 text-foreground">Rischio cognitivo principale</h5>
              <div className="p-4 bg-warning/10 border-l-4 border-warning rounded-r">
                <p className="text-foreground">{currentBand.cognitiveRisk}</p>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-2 text-foreground">Riflessione guidata</h5>
              <div className="p-4 bg-info/10 border-l-4 border-info rounded-r">
                <p className="text-foreground italic">{currentBand.guidedReflection}</p>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-2 text-foreground">Nota metodologica</h5>
              <p className="text-sm text-muted-foreground">{currentBand.methodologicalNote}</p>
            </div>
          </CardContent>
        </UnifiedCard>

        {/* Tradelia Method */}
        <UnifiedCard className="mb-8">
          <CardHeader>
            <CardTitle>{TRADELIA_METHOD.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {TRADELIA_METHOD.principles.map((principle, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-foreground">{principle}</span>
                </div>
              ))}
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-foreground">{TRADELIA_METHOD.usage.title}</h5>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">NON lo usiamo per:</p>
                  <div className="space-y-2">
                    {TRADELIA_METHOD.usage.notUsedFor.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-error/10 rounded-lg">
                        <div className="w-4 h-4 rounded-full bg-error flex items-center justify-center">
                          <span className="text-white text-xs font-bold">×</span>
                        </div>
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Lo usiamo per:</p>
                  <div className="space-y-2">
                    {TRADELIA_METHOD.usage.usedFor.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                        <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-primary/10 border-l-4 border-primary rounded-r">
                <p className="text-primary font-medium">{TRADELIA_METHOD.usage.keyRule}</p>
              </div>
            </div>
          </CardContent>
        </UnifiedCard>

        {/* Limitations and Warnings */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <UnifiedCard className="border-warning">
            <CardHeader>
              <CardTitle className="text-warning flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                Limitazioni strutturali
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TRADELIA_METHOD.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-foreground">{limitation.replace('❌ ', '')}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </UnifiedCard>

          <UnifiedCard className="border-error">
            <CardHeader>
              <CardTitle className="text-error flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                Avvertenze Tradelia AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TRADELIA_METHOD.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-foreground">{warning}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </UnifiedCard>
        </div>

        {/* Footer */}
        <div className="text-center p-6 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Fondamento teorico: Teoria del Prospetto di Daniel Kahneman & Amos Tversky (1979)
          </p>
          <p className="text-xs text-muted-foreground">
            Contenuto esclusivamente educativo. Non costituisce consulenza finanziaria.
          </p>
        </div>
      </div>
    </SectionLayout>
  )
}