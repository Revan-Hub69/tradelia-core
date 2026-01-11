/**
 * Emergency Journey Introduction Overlay - Tradelia 2026
 * 
 * Single drawer with navigation, consistent with Tradelia design system
 * Uses CSS variables from globals.css, viewport-safe, SOLO SVG
 */

'use client'

import { useState, useEffect } from 'react'
import { useModalFocusTrap } from '@/src/shared/hooks/useFocusTrap'

interface DashboardIntroOverlayProps {
  isOpen: boolean
  onClose: () => void
}

type DrawerStep = 'main' | 'risks'

export function DashboardIntroOverlay({ isOpen, onClose }: DashboardIntroOverlayProps) {
  const [currentStep, setCurrentStep] = useState<DrawerStep>('main')

  // Focus trap for drawer
  const { containerRef: drawerRef } = useModalFocusTrap(isOpen, onClose)

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setCurrentStep('main')
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const goToRisks = () => setCurrentStep('risks')
  const goBack = () => setCurrentStep('main')

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop - Tradelia style */}
      <div 
        className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Single Drawer - VIEWPORT SAFE with Tradelia design */}
      <div 
        ref={drawerRef as React.RefObject<HTMLDivElement>}
        className="fixed inset-4 z-[75] flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
      >
        <div className="w-full max-w-4xl section-frame emergency-intro-overlay overflow-hidden">
          {/* Header with navigation */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="flex items-center gap-4">
              {currentStep === 'risks' && (
                <button
                  onClick={goBack}
                  className="p-2 transition-colors-fast hover:bg-muted/50 rounded-md"
                  aria-label="Torna indietro"
                >
                  <BackIcon />
                </button>
              )}
              <div>
                <h1 id="intro-title" className="text-xl font-normal" style={{ color: 'hsl(var(--foreground))' }}>
                  {currentStep === 'main' ? 'Crypto in situazioni di emergenza' : 'Rischi reali studiati'}
                </h1>
                {currentStep === 'main' && (
                  <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Sistemi alternativi quando quelli normali non funzionano
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 transition-colors-fast hover:bg-muted/50 rounded-md"
              style={{ color: 'hsl(var(--muted-foreground))' }}
              aria-label="Chiudi"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Content - SCROLLABLE with Tradelia spacing */}
          <div className="overflow-y-auto max-h-[70vh]">
            {currentStep === 'main' ? (
              <div className="p-6 space-y-8">
                {/* Blocco 1 - ORIGINE */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                    Perché nascono le criptovalute
                  </h2>
                  <p className="leading-relaxed max-w-[66ch]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Le criptovalute nascono dopo la crisi del 2008, quando il problema non era la mancanza di denaro, 
                    ma l'impossibilità di usarlo liberamente.
                  </p>
                  <div className="section-frame-warning p-4">
                    <p className="text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>Situazioni reali:</p>
                    <ul className="space-y-1 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      <li>• Banche chiuse</li>
                      <li>• Prelievi limitati</li>
                      <li>• Trasferimenti bloccati</li>
                    </ul>
                  </div>
                  <p className="leading-relaxed max-w-[66ch]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    L'obiettivo era creare un sistema di trasferimento che non dipendesse da una singola banca o autorità.
                  </p>
                </div>

                {/* Blocco 2 - EMERGENZE */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                    Di che emergenze parliamo
                  </h2>
                  <p className="leading-relaxed max-w-[66ch]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Situazioni già accadute e studiate:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="card-2026 p-3">
                      <div className="font-medium text-sm" style={{ color: 'hsl(var(--foreground))' }}>Limitazioni ai conti</div>
                      <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Controlli sui capitali</div>
                    </div>
                    <div className="card-2026 p-3">
                      <div className="font-medium text-sm" style={{ color: 'hsl(var(--foreground))' }}>Interruzioni pagamenti</div>
                      <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Guasti sistemici</div>
                    </div>
                    <div className="card-2026 p-3">
                      <div className="font-medium text-sm" style={{ color: 'hsl(var(--foreground))' }}>Crisi sistemiche</div>
                      <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Instabilità finanziaria</div>
                    </div>
                    <div className="card-2026 p-3">
                      <div className="font-medium text-sm" style={{ color: 'hsl(var(--foreground))' }}>Attacchi informatici</div>
                      <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Infrastrutture finanziarie</div>
                    </div>
                  </div>
                  <div className="section-frame-info p-4">
                    <p className="font-medium text-sm" style={{ color: 'hsl(var(--foreground))' }}>
                      In questi casi il problema non è il valore, ma l'accesso e il funzionamento.
                    </p>
                  </div>
                  <button
                    onClick={goToRisks}
                    className="inline-flex items-center gap-2 text-sm transition-colors-fast hover:underline"
                    style={{ color: 'hsl(var(--primary))' }}
                  >
                    Approfondisci i rischi reali
                    <ForwardIcon />
                  </button>
                </div>

                {/* Blocco 3 - APPROCCIO */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                    Cosa significa usarle come riserva di emergenza
                  </h2>
                  <p className="leading-relaxed max-w-[66ch]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Significa considerarle come opzione aggiuntiva, non come sostituzione del sistema tradizionale.
                  </p>
                  <div className="card-2026 p-4">
                    <p className="font-medium text-sm" style={{ color: 'hsl(var(--foreground))' }}>
                      La domanda non è "quanto rendono", ma in quali condizioni continuano a funzionare.
                    </p>
                  </div>
                </div>

                {/* Blocco 4 - SCOPO */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                    Perché esiste questa dashboard
                  </h2>
                  <p className="leading-relaxed max-w-[66ch]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Questa dashboard serve a:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>capire quando questo approccio è rilevante</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>capire da cosa dipende il suo funzionamento</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>evitare di scoprirne i limiti nel momento peggiore</span>
                    </li>
                  </ul>
                  <div className="section-frame-success p-4">
                    <p className="font-medium text-sm" style={{ color: 'hsl(var(--foreground))' }}>
                      Non ti dice cosa comprare. Ti aiuta a valutare consapevolmente.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Risks Detail View */
              <div className="p-6 space-y-8">
                {/* Sezione 1 - Cyber Risk */}
                <div className="space-y-4">
                  <h3 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                    Rischio cyber (futuro ad alta probabilità)
                  </h3>
                  <p className="text-sm leading-relaxed max-w-[66ch]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Le istituzioni finanziarie considerano gli attacchi informatici una delle principali minacce 
                    alla continuità operativa.
                  </p>
                  <ul className="text-sm space-y-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <li>• ENISA segnala un aumento costante di incidenti nel settore finanziario</li>
                    <li>• FMI e BIS riconoscono il cyber-risk come rischio di stabilità sistemica</li>
                  </ul>
                  <div className="card-2026 p-3">
                    <p className="text-xs font-medium mb-1" style={{ color: 'hsl(var(--foreground))' }}>Fonti:</p>
                    <ul className="text-xs space-y-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      <li>• ENISA – Threat Landscape for Finance</li>
                      <li>• IMF – Cyber Risk and Financial Stability</li>
                      <li>• BIS – Operational and cyber risk in finance</li>
                    </ul>
                  </div>
                </div>

                {/* Sezione 2 - Systemic Risk */}
                <div className="space-y-4">
                  <h3 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                    Rischio sistemico
                  </h3>
                  <p className="text-sm leading-relaxed max-w-[66ch]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    I sistemi finanziari sono altamente interconnessi. Un problema in un nodo critico può propagarsi rapidamente.
                  </p>
                  <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Questo è il motivo per cui:
                  </p>
                  <ul className="text-sm space-y-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <li>• esistono stress test</li>
                    <li>• esistono piani di emergenza</li>
                    <li>• esistono controlli sui capitali</li>
                  </ul>
                  <div className="card-2026 p-3">
                    <p className="text-xs font-medium mb-1" style={{ color: 'hsl(var(--foreground))' }}>Fonti:</p>
                    <ul className="text-xs space-y-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      <li>• BIS – Global Liquidity & Systemic Risk</li>
                      <li>• IMF – Global Financial Stability Report</li>
                    </ul>
                  </div>
                </div>

                {/* Sezione 3 - Operational Disruptions */}
                <div className="space-y-4">
                  <h3 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                    Interruzioni operative
                  </h3>
                  <p className="text-sm leading-relaxed max-w-[66ch]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Anche senza crisi finanziarie possono verificarsi:
                  </p>
                  <ul className="text-sm space-y-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <li>• blackout</li>
                    <li>• guasti ai circuiti di pagamento</li>
                    <li>• blocchi temporanei di servizi digitali</li>
                  </ul>
                  <div className="card-2026 p-3">
                    <p className="text-xs font-medium mb-1" style={{ color: 'hsl(var(--foreground))' }}>Fonti:</p>
                    <ul className="text-xs space-y-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      <li>• World Economic Forum – Global Risks Report</li>
                      <li>• Banca Centrale Europea – resilienza operativa</li>
                    </ul>
                  </div>
                </div>

                {/* Conclusione */}
                <div className="section-frame-info p-4">
                  <h4 className="font-medium mb-2 text-sm" style={{ color: 'hsl(var(--foreground))' }}>
                    Questi scenari:
                  </h4>
                  <ul className="text-sm space-y-1 mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <li>• non sono previsioni</li>
                    <li>• non sono catastrofismo</li>
                    <li>• sono rischi studiati da chi gestisce i sistemi</li>
                  </ul>
                  <p className="font-medium text-sm" style={{ color: 'hsl(var(--foreground))' }}>
                    La dashboard serve a capire come ti influenzerebbero, non se accadranno.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer with navigation */}
          <div className="p-6 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
            {currentStep === 'main' ? (
              <button
                onClick={onClose}
                className="w-full py-3 px-6 font-medium rounded-md transition-colors-fast"
                style={{ 
                  backgroundColor: 'hsl(var(--primary))', 
                  color: 'white'
                }}
              >
                Ok, ho capito
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={goBack}
                  className="flex-1 py-3 px-6 font-medium rounded-md transition-colors-fast border"
                  style={{ 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }}
                >
                  Torna all'introduzione
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-6 font-medium rounded-md transition-colors-fast"
                  style={{ 
                    backgroundColor: 'hsl(var(--primary))', 
                    color: 'white'
                  }}
                >
                  Vai alla dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// SVG Icons - Tradelia Design System Compliant
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path 
        d="M12 4L4 12M4 4l8 8" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5" style={{ color: 'hsl(var(--success))' }}>
      <path 
        d="M13 4L6 11L3 8" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path 
        d="M10 12L6 8L10 4" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ForwardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path 
        d="M6 4L10 8L6 12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}