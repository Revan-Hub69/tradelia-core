/**
 * Dashboard Introduction Overlay - Tradelia 2026
 * 
 * Overlay innovativo che introduce alla dashboard con progressive disclosure:
 * - Overlay principale: orienta il modello mentale in 60-90 secondi
 * - Drawer di approfondimento: dimostra con rigore e fonti
 * 
 * Design: UX istituzionale, contrasti eleganti, SVG homemade
 */

'use client'

import { useState, useEffect } from 'react'
import { useFocusTrap } from '@/src/shared/hooks/useFocusTrap'

interface DashboardIntroOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function DashboardIntroOverlay({ isOpen, onClose }: DashboardIntroOverlayProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Focus trap for overlay
  const { containerRef: overlayRef } = useFocusTrap(isOpen)
  
  // Focus trap for drawer
  const { containerRef: drawerRef } = useFocusTrap(isDrawerOpen)

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setIsDrawerOpen(false)
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const openDrawer = () => {
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-sm overlay-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Overlay */}
      <div 
        ref={overlayRef as React.RefObject<HTMLDivElement>}
        className="fixed inset-0 z-[75] flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
      >
        <div className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl overlay-content">
          {/* Header */}
          <div className="px-8 py-6 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div>
                <h1 id="intro-title" className="text-2xl font-bold text-foreground mb-2">
                  Crypto in situazioni di emergenza
                </h1>
                <p className="text-muted-foreground">
                  Sistemi alternativi quando quelli normali non funzionano
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Chiudi introduzione"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-8">
            {/* Blocco 1 - Origine */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Perché nascono le criptovalute
              </h2>
              <div className="prose prose-tradelia max-w-none">
                <p className="text-foreground leading-relaxed">
                  Le criptovalute nascono dopo la crisi del 2008, quando il problema non era la mancanza di denaro, 
                  ma l'impossibilità di usarlo liberamente.
                </p>
                <div className="my-4 p-4 bg-muted/30 rounded-lg border-l-4 border-warning/50">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Situazioni reali:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Banche chiuse</li>
                    <li>• Prelievi limitati</li>
                    <li>• Trasferimenti bloccati</li>
                  </ul>
                </div>
                <p className="text-foreground leading-relaxed">
                  L'obiettivo era creare un sistema di trasferimento che non dipendesse da una singola banca o autorità.
                </p>
              </div>
            </div>

            {/* Blocco 2 - Tipo di emergenze */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Di che emergenze parliamo
              </h2>
              <div className="prose prose-tradelia max-w-none">
                <p className="text-foreground leading-relaxed mb-4">
                  Situazioni già accadute e studiate:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="text-sm font-medium text-foreground mb-1">Limitazioni ai conti</div>
                    <div className="text-xs text-muted-foreground">Controlli sui capitali</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="text-sm font-medium text-foreground mb-1">Interruzioni dei pagamenti</div>
                    <div className="text-xs text-muted-foreground">Guasti sistemici</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="text-sm font-medium text-foreground mb-1">Crisi sistemiche</div>
                    <div className="text-xs text-muted-foreground">Instabilità finanziaria</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="text-sm font-medium text-foreground mb-1">Attacchi informatici</div>
                    <div className="text-xs text-muted-foreground">Infrastrutture finanziarie</div>
                  </div>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground">
                    <strong>👉 In questi casi il problema non è il valore, ma l'accesso e il funzionamento.</strong>
                  </p>
                </div>
                <button
                  onClick={() => openDrawer()}
                  className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                >
                  🔍 Approfondisci i rischi reali →
                </button>
              </div>
            </div>

            {/* Blocco 3 - Approccio */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Cosa significa usarle come riserva di emergenza
              </h2>
              <div className="prose prose-tradelia max-w-none">
                <p className="text-foreground leading-relaxed">
                  Significa considerarle come opzione aggiuntiva, non come sostituzione del sistema tradizionale.
                </p>
                <div className="my-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-foreground font-medium">
                    La domanda non è "quanto rendono", ma in quali condizioni continuano a funzionare.
                  </p>
                </div>
              </div>
            </div>

            {/* Blocco 4 - Scopo della dashboard */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Perché esiste questa dashboard
              </h2>
              <div className="prose prose-tradelia max-w-none">
                <p className="text-foreground leading-relaxed mb-4">
                  Questa dashboard serve a:
                </p>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-3">
                    <CheckIcon />
                    <span>capire quando questo approccio è rilevante</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon />
                    <span>capire da cosa dipende il suo funzionamento</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon />
                    <span>evitare di scoprirne i limiti nel momento peggiore</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-success/5 rounded-lg border border-success/20">
                  <p className="text-sm text-foreground">
                    <strong>Non ti dice cosa comprare. Ti aiuta a valutare consapevolmente.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-8 py-6 border-t border-border/50">
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              Ok, ho capito → Vai alla dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Drawer di approfondimento */}
      {isDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <div 
            ref={drawerRef as React.RefObject<HTMLDivElement>}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-background border-l border-border z-[85] overflow-y-auto drawer-content"
            role="dialog"
            aria-modal="true"
          >
            <div className="sticky top-0 bg-background border-b border-border/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Rischi reali studiati
                </h2>
                <button
                  onClick={closeDrawer}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Chiudi approfondimento"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 space-y-8">
              {/* Sezione 1 - Rischio cyber */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">
                  Rischio cyber (futuro ad alta probabilità)
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Le istituzioni finanziarie considerano gli attacchi informatici una delle principali minacce 
                    alla continuità operativa.
                  </p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• ENISA segnala un aumento costante di incidenti nel settore finanziario</li>
                    <li>• FMI e BIS riconoscono il cyber-risk come rischio di stabilità sistemica</li>
                  </ul>
                  <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-2">📎 Fonti:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• ENISA – Threat Landscape for Finance</li>
                      <li>• IMF – Cyber Risk and Financial Stability</li>
                      <li>• BIS – Operational and cyber risk in finance</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sezione 2 - Rischio sistemico */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">
                  Rischio sistemico
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    I sistemi finanziari sono altamente interconnessi. Un problema in un nodo critico può propagarsi rapidamente.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Questo è il motivo per cui:
                  </p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• esistono stress test</li>
                    <li>• esistono piani di emergenza</li>
                    <li>• esistono controlli sui capitali</li>
                  </ul>
                  <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-2">📎 Fonti:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• BIS – Global Liquidity & Systemic Risk</li>
                      <li>• IMF – Global Financial Stability Report</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sezione 3 - Interruzioni operative */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">
                  Interruzioni operative
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Anche senza crisi finanziarie possono verificarsi:
                  </p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• blackout</li>
                    <li>• guasti ai circuiti di pagamento</li>
                    <li>• blocchi temporanei di servizi digitali</li>
                  </ul>
                  <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-2">📎 Fonti:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• World Economic Forum – Global Risks Report</li>
                      <li>• Banca Centrale Europea – resilienza operativa</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Chiusura drawer */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Questi scenari:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• non sono previsioni</li>
                  <li>• non sono catastrofismo</li>
                  <li>• sono rischi studiati da chi gestisce i sistemi</li>
                </ul>
                <p className="text-sm text-foreground mt-3 font-medium">
                  La dashboard serve a capire come ti influenzerebbero, non se accadranno.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

// SVG Icons homemade - Tradelia style
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-current">
      <path 
        d="M15 5L5 15M5 5l10 10" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-success flex-shrink-0 mt-0.5">
      <path 
        d="M16.25 6.25L8.125 14.375L3.75 10" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}