'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UnifiedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/design-system/unified-card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CheckIcon } from '@/components/icons/check-icon'
import { CrossIcon } from '@/components/icons/cross-icon'
import { WarningIcon } from '@/components/icons/warning-icon'
import { ErrorDotIcon } from '@/components/icons/error-dot-icon'
import { SuccessDotIcon } from '@/components/icons/success-dot-icon'
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll'
import { getFearGreedBand, FEAR_GREED_DEFINITION, TRADELIA_METHOD } from '@/lib/indicators/fear-greed-analysis'

interface FearGreedCompactProps {
  value?: number
  classification?: string
}

// Professional Gauge - Academic Standard 2025
function ProfessionalGauge({ value }: { value: number }) {
  const band = getFearGreedBand(value)
  
  return (
    <div className="relative w-56 h-32 mx-auto">
      <svg
        viewBox="0 0 224 128"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        {/* Background arc */}
        <path
          d="M 24 104 A 88 88 0 0 1 200 104"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="6"
          strokeLinecap="round"
        />
        
        {/* Progress arc with smooth animation */}
        <path
          d="M 24 104 A 88 88 0 0 1 200 104"
          fill="none"
          stroke={`hsl(var(--${band.colorVar}))`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="276.46"
          strokeDashoffset={276.46 - (value / 100) * 276.46}
          className="transition-all duration-1500 ease-out"
        />
        
        {/* Scale markers - Professional spacing */}
        {[0, 25, 50, 75, 100].map((mark) => {
          const angle = (mark / 100) * Math.PI - Math.PI
          const x1 = 112 + 82 * Math.cos(angle)
          const y1 = 104 + 82 * Math.sin(angle)
          const x2 = 112 + 88 * Math.cos(angle)
          const y2 = 104 + 88 * Math.sin(angle)
          
          return (
            <g key={mark}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1.5"
              />
              <text
                x={112 + 95 * Math.cos(angle)}
                y={104 + 95 * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-xs font-medium"
              >
                {mark}
              </text>
            </g>
          )
        })}
      </svg>
      
      {/* Value display - Professional typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
        <div className="text-4xl font-bold tabular-nums tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground font-medium tracking-wide">/ 100</div>
      </div>
    </div>
  )
}

// Drawer Content - Focus on Educational Content
function DrawerContent({ currentValue }: { currentValue: number }) {
  const currentBand = getFearGreedBand(currentValue)

  return (
    <div className="flex flex-col h-full">
      {/* Compact Header - Just Value and Status */}
      <div className="flex-shrink-0 py-4 border-b border-border">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-4">
            <div className={`w-4 h-4 rounded-full ${currentBand.bgClass}`}></div>
            <div>
              <div className="text-3xl font-bold tabular-nums">{currentValue}</div>
              <div className="text-xs text-muted-foreground">/ 100</div>
            </div>
            <Badge 
              variant="outline" 
              className={`${currentBand.textClass} border-2 font-semibold`}
            >
              {currentBand.name}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Fascia {currentBand.range} • Aggiornamento giornaliero
          </p>
        </div>
      </div>

      {/* Scrollable Content - All Educational Material */}
      <div className="flex-1 overflow-y-auto drawer-content py-6 space-y-8">
        
        {/* Primary Analysis */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Analisi Situazione Attuale</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2 text-foreground">Cosa sta accadendo</h3>
              <p className="text-sm text-foreground leading-relaxed">{currentBand.interpretation}</p>
            </div>

            <div className="p-4 bg-warning/10 border-l-4 border-warning rounded-r">
              <h3 className="font-semibold mb-2 text-foreground">Errore più frequente</h3>
              <p className="text-sm text-foreground">{currentBand.commonMistake}</p>
            </div>

            <div className="p-4 bg-primary/10 border-l-4 border-primary rounded-r">
              <h3 className="font-semibold mb-2 text-foreground">Approccio corretto</h3>
              <p className="text-sm text-foreground">{currentBand.correctUse}</p>
            </div>
          </div>
        </section>

        {/* Practical Guidelines */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Linee Guida Pratiche</h2>
          
          <div className="grid gap-4">
            <UnifiedCard className="border-success/30 bg-success/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-success flex items-center gap-2 text-base">
                  <CheckIcon className="w-4 h-4" />
                  Uso Appropriato
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {TRADELIA_METHOD.usage.usedFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <SuccessDotIcon className="mt-1 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </UnifiedCard>
            
            <UnifiedCard className="border-error/30 bg-error/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-error flex items-center gap-2 text-base">
                  <CrossIcon className="w-4 h-4" />
                  Errori da Evitare
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {TRADELIA_METHOD.usage.notUsedFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <ErrorDotIcon className="mt-1 flex-shrink-0" />
                      <span className="text-foreground">Non usare per {item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </UnifiedCard>
          </div>
        </section>

        {/* Key Principle */}
        <section>
          <UnifiedCard className="bg-primary/10 border-primary/30 border-2">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-primary mb-2">Principio Fondamentale</h3>
                  <p className="text-foreground font-medium leading-relaxed">
                    {TRADELIA_METHOD.usage.keyRule}
                  </p>
                </div>
              </div>
            </CardContent>
          </UnifiedCard>
        </section>

        {/* Common Misconceptions */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <WarningIcon className="w-5 h-5" />
            Errori di Interpretazione Comuni
          </h2>
          
          <div className="space-y-3">
            {[
              "Paura estrema = momento perfetto per comprare",
              "Avidità estrema = vendi tutto immediatamente", 
              "L'indicatore prevede i movimenti di prezzo",
              "Correlazione sentiment-prezzo è sempre causale"
            ].map((mistake, index) => (
              <div key={index} className="p-3 bg-muted/20 rounded-lg border-l-2 border-muted">
                <div className="flex items-start gap-3">
                  <ErrorDotIcon className="mt-1 flex-shrink-0" />
                  <span className="text-sm text-foreground font-medium">{mistake}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Academic Foundation */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Fondamento Scientifico</h2>
          
          <UnifiedCard>
            <CardContent className="p-4">
              <p className="text-sm text-foreground leading-relaxed mb-4">
                {FEAR_GREED_DEFINITION.definition}
              </p>
              
              <div className="bg-muted/30 p-4 rounded border-l-4 border-muted">
                <h4 className="font-semibold text-sm mb-2 text-foreground">Base Teorica</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {FEAR_GREED_DEFINITION.theoreticalBase.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  Kahneman & Tversky (1979) - Prospect Theory
                </p>
              </div>
            </CardContent>
          </UnifiedCard>
        </section>

        {/* Guided Reflection */}
        <section>
          <UnifiedCard className="bg-muted/20 border-muted/40">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-3">Riflessione Guidata</h3>
              <blockquote className="text-foreground italic leading-relaxed border-l-4 border-primary pl-4">
                "{currentBand.guidedReflection}"
              </blockquote>
            </CardContent>
          </UnifiedCard>
        </section>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 pt-4 border-t border-border">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
            <span className="text-xs text-muted-foreground font-medium">Contenuto Educativo</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Non costituisce consulenza finanziaria o invito all'investimento
          </p>
        </div>
      </div>
    </div>
  )
}

export function FearGreedCompact({ value: initialValue, classification }: FearGreedCompactProps) {
  const [currentValue, setCurrentValue] = useState(24)
  const [isLive, setIsLive] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Blocca lo scroll del body quando il drawer è aperto
  useLockBodyScroll(isDrawerOpen)

  useEffect(() => {
    if (initialValue) {
      setCurrentValue(initialValue)
      setIsLive(true)
    }
  }, [initialValue])

  const currentBand = getFearGreedBand(currentValue)

  return (
    <UnifiedCard variant="elevated" className="max-w-md mx-auto">
      <CardContent className="text-center space-y-6 p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Indice Paura & Avidità</h3>
          <p className="text-sm text-muted-foreground">Sentiment del mercato crypto</p>
        </div>

        <ProfessionalGauge value={currentValue} />
        
        <div className="space-y-3">
          <Badge 
            variant="outline" 
            className={`text-sm font-semibold px-4 py-2 border-2 ${currentBand.borderClass} ${currentBand.textClass}`}
          >
            {currentBand.name}
          </Badge>
          <div className="text-xs text-muted-foreground">
            <p>Fascia: {currentBand.range}</p>
            {isLive && <p className="text-primary">• Dati in tempo reale</p>}
          </div>
        </div>

        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="default" size="default" className="w-full font-semibold text-primary-foreground">
              Analisi Completa
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
            <div className="h-full flex flex-col">
              <SheetHeader className="px-6 py-4 border-b border-border flex-shrink-0">
                <SheetTitle className="text-xl">Indice Paura & Avidità - Analisi Professionale</SheetTitle>
              </SheetHeader>
              <div className="flex-1 px-6 overflow-hidden">
                <DrawerContent currentValue={currentValue} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </UnifiedCard>
  )
}