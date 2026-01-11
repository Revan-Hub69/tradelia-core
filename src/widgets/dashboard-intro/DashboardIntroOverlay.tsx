/**
 * Dashboard Introduction Overlay - Tradelia 2026
 * 
 * Overlay per introduzione al percorso EMERGENZA:
 * - Overlay principale: orienta il modello mentale in 60-90 secondi
 * - Drawer di approfondimento: dimostra con rigore e fonti
 * 
 * Design: UX istituzionale, contrasti eleganti, SOLO SVG homemade
 */

'use client'

import { useState, useEffect } from 'react'
import { useModalFocusTrap } from '@/src/shared/hooks/useFocusTrap'

interface DashboardIntroOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function DashboardIntroOverlay({ isOpen, onClose }: DashboardIntroOverlayProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  const openDrawer = () => {
    setIsDrawerOpen(true)
  }

  // Focus trap for overlay
  const { containerRef: overlayRef } = useModalFocusTrap(isOpen, onClose)
  
  // Focus trap for drawer
  const { containerRef: drawerRef } = useModalFocusTrap(isDrawerOpen, closeDrawer)

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

  if (!isOpen) return null

  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 z-[70] bg-white/95 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Overlay - Design Tradelia */}
      <div 
        ref={overlayRef as React.RefObject<HTMLDivElement>}
        className="fixed inset-0 z-[75] flex items-center justify-center p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
      >
        <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-none shadow-lg">
          {/* Header - Design Tradelia */}
          <div className="px-12 py-8 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="max-w-lg">
                <h1 id="intro-title" className="text-3xl font-normal text-gray-900 mb-4 leading-tight">
                  Crypto in situazioni di emergenza
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Sistemi alternativi quando quelli normali non funzionano
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 text-gray-400 hover:text-gray-600 transition-colors rounded-none border border-gray-200 hover:border-gray-300"
                aria-label="Chiudi introduzione"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Content - Design Tradelia */}
          <div className="px-12 py-10 space-y-12">
            {/* Blocco 1 - Origine */}
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900">
                Perché nascono le criptovalute
              </h2>
              <div className="max-w-2xl">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Le criptovalute nascono dopo la crisi del 2008, quando il problema non era la mancanza di denaro, 
                  ma l'impossibilità di usarlo liberamente.
                </p>
                <div className="border-l-4 border-amber-400 bg-amber-50 p-6 mb-6">
                  <p className="text-sm font-medium text-gray-900 mb-3">Situazioni reali:</p>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start gap-3">
                      <BulletIcon />
                      <span>Banche chiuse</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <BulletIcon />
                      <span>Prelievi limitati</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <BulletIcon />
                      <span>Trasferimenti bloccati</span>
                    </li>
                  </ul>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  L'obiettivo era creare un sistema di trasferimento che non dipendesse da una singola banca o autorità.
                </p>
              </div>
            </div>

            {/* Blocco 2 - Tipo di emergenze */}
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900">
                Di che emergenze parliamo
              </h2>
              <div className="max-w-2xl">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Situazioni già accadute e studiate:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="border border-gray-200 p-4">
                    <div className="text-base font-medium text-gray-900 mb-2">Limitazioni ai conti</div>
                    <div className="text-sm text-gray-600">Controlli sui capitali</div>
                  </div>
                  <div className="border border-gray-200 p-4">
                    <div className="text-base font-medium text-gray-900 mb-2">Interruzioni dei pagamenti</div>
                    <div className="text-sm text-gray-600">Guasti sistemici</div>
                  </div>
                  <div className="border border-gray-200 p-4">
                    <div className="text-base font-medium text-gray-900 mb-2">Crisi sistemiche</div>
                    <div className="text-sm text-gray-600">Instabilità finanziaria</div>
                  </div>
                  <div className="border border-gray-200 p-4">
                    <div className="text-base font-medium text-gray-900 mb-2">Attacchi informatici</div>
                    <div className="text-sm text-gray-600">Infrastrutture finanziarie</div>
                  </div>
                </div>
                <div className="border border-blue-200 bg-blue-50 p-6 mb-6">
                  <p className="text-gray-900 font-medium">
                    In questi casi il problema non è il valore, ma l'accesso e il funzionamento.
                  </p>
                </div>
                <button
                  onClick={() => openDrawer()}
                  className="text-blue-600 hover:text-blue-800 transition-colors underline underline-offset-2 font-medium"
                >
                  Approfondisci i rischi reali
                </button>
              </div>
            </div>

            {/* Blocco 3 - Approccio */}
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900">
                Cosa significa usarle come riserva di emergenza
              </h2>
              <div className="max-w-2xl">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Significa considerarle come opzione aggiuntiva, non come sostituzione del sistema tradizionale.
                </p>
                <div className="border border-gray-200 bg-gray-50 p-6">
                  <p className="text-gray-900 font-medium">
                    La domanda non è "quanto rendono", ma in quali condizioni continuano a funzionare.
                  </p>
                </div>
              </div>
            </div>

            {/* Blocco 4 - Scopo della dashboard */}
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900">
                Perché esiste questa dashboard
              </h2>
              <div className="max-w-2xl">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Questa dashboard serve a:
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-4">
                    <CheckIcon />
                    <span className="text-gray-700">capire quando questo approccio è rilevante</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckIcon />
                    <span className="text-gray-700">capire da cosa dipende il suo funzionamento</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckIcon />
                    <span className="text-gray-700">evitare di scoprirne i limiti nel momento peggiore</span>
                  </li>
                </ul>
                <div className="border border-green-200 bg-green-50 p-6">
                  <p className="text-gray-900 font-medium">
                    Non ti dice cosa comprare. Ti aiuta a valutare consapevolmente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA - Design Tradelia */}
          <div className="px-12 py-8 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-4 px-8 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors border border-blue-600 hover:border-blue-700"
            >
              Ok, ho capito → Vai alla dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Drawer di approfondimento - Design Tradelia */}
      {isDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 z-[80] bg-black/50"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <div 
            ref={drawerRef as React.RefObject<HTMLDivElement>}
            className="fixed right-0 top-0 bottom-0 w-full max-w-3xl bg-white border-l border-gray-200 z-[85] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-gray-900">
                  Rischi reali studiati
                </h2>
                <button
                  onClick={closeDrawer}
                  className="p-3 text-gray-400 hover:text-gray-600 transition-colors border border-gray-200 hover:border-gray-300"
                  aria-label="Chiudi approfondimento"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="px-8 py-8 space-y-12">
              {/* Sezione 1 - Rischio cyber */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Rischio cyber (futuro ad alta probabilità)
                </h3>
                <div className="max-w-2xl">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Le istituzioni finanziarie considerano gli attacchi informatici una delle principali minacce 
                    alla continuità operativa.
                  </p>
                  <ul className="text-gray-700 space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <BulletIcon />
                      <span>ENISA segnala un aumento costante di incidenti nel settore finanziario</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <BulletIcon />
                      <span>FMI e BIS riconoscono il cyber-risk come rischio di stabilità sistemica</span>
                    </li>
                  </ul>
                  <div className="border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Fonti:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>ENISA – Threat Landscape for Finance</li>
                      <li>IMF – Cyber Risk and Financial Stability</li>
                      <li>BIS – Operational and cyber risk in finance</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sezione 2 - Rischio sistemico */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Rischio sistemico
                </h3>
                <div className="max-w-2xl">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    I sistemi finanziari sono altamente interconnessi. Un problema in un nodo critico può propagarsi rapidamente.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Questo è il motivo per cui:
                  </p>
                  <ul className="text-gray-700 space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <BulletIcon />
                      <span>esistono stress test</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <BulletIcon />
                      <span>esistono piani di emergenza</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <BulletIcon />
                      <span>esistono controlli sui capitali</span>
                    </li>
                  </ul>
                  <div className="border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Fonti:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>BIS – Global Liquidity & Systemic Risk</li>
                      <li>IMF – Global Financial Stability Report</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sezione 3 - Interruzioni operative */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Interruzioni operative
                </h3>
                <div className="max-w-2xl">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Anche senza crisi finanziarie possono verificarsi:
                  </p>
                  <ul className="text-gray-700 space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <BulletIcon />
                      <span>blackout</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <BulletIcon />
                      <span>guasti ai circuiti di pagamento</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <BulletIcon />
                      <span>blocchi temporanei di servizi digitali</span>
                    </li>
                  </ul>
                  <div className="border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Fonti:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>World Economic Forum – Global Risks Report</li>
                      <li>Banca Centrale Europea – resilienza operativa</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Chiusura drawer */}
              <div className="border border-blue-200 bg-blue-50 p-6">
                <h4 className="text-base font-medium text-gray-900 mb-3">
                  Questi scenari:
                </h4>
                <ul className="text-gray-700 space-y-2 mb-4">
                  <li className="flex items-start gap-3">
                    <BulletIcon />
                    <span>non sono previsioni</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BulletIcon />
                    <span>non sono catastrofismo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BulletIcon />
                    <span>sono rischi studiati da chi gestisce i sistemi</span>
                  </li>
                </ul>
                <p className="text-gray-900 font-medium">
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

// SVG Icons homemade - Tradelia style - NIENTE EMOJI
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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green-600 flex-shrink-0 mt-0.5">
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

function BulletIcon() {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none" className="text-gray-400 flex-shrink-0 mt-2">
      <circle cx="3" cy="3" r="3" fill="currentColor" />
    </svg>
  )
}