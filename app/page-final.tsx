'use client';

export default function HomePage() {
  return (
    <>
      {/* SEO Meta */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Tradelia",
            "description": "Dashboard guidata per esplorare le crypto senza fare errori costosi",
            "url": "https://tradelia.com",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web"
          })
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="font-semibold text-xl text-gray-900">TRADELIA</div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#metodo" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Metodo</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 text-sm font-medium">FAQ</a>
              <button className="bg-slate-700 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 transition-colors">
                Inizia il percorso guidato
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
                Esplora le crypto senza fare gli errori più costosi
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Una dashboard guidata che ti aiuta a capire il contesto, evitare trappole comuni e scegliere un percorso coerente prima di usare denaro.
              </p>
              
              <button className="bg-slate-700 text-white px-8 py-4 text-base font-medium hover:bg-slate-800 transition-colors mb-4">
                Inizia il percorso guidato
              </button>
              
              <p className="text-sm text-gray-500">
                Nessun account · Nessun deposito · Solo educazione, zero promesse
              </p>
            </div>

            {/* Right Column - Product Preview */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium rounded-full">Market Context</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium rounded-full">Obiettivo</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-2">Errori tipici</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Confondere spot e CFD</li>
                    <li>• Entrare senza contesto</li>
                    <li>• Troppo rischio subito</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
            Perché i principianti sbagliano (anche con buone intenzioni)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Confusione strumenti</h3>
              <p className="text-gray-600">
                Spot, CFD, leva, "earn": sembrano simili, ma cambiano tutto.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Mancanza di contesto</h3>
              <p className="text-gray-600">
                Entrare senza capire volatilità e fase di mercato aumenta gli errori.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Sovra-esposizione precoce</h3>
              <p className="text-gray-600">
                Troppo rischio, troppo presto: è la strada più veloce per farsi male.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Outcome Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                In pochi step ottieni chiarezza, non hype
              </h2>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-700 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    Contesto mercato spiegato in modo semplice (senza tecnicismi inutili)
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-700 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    Percorso coerente con il tuo obiettivo: capire, primo acquisto, approfondire
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-700 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    Guardrail anti-errore: avvisi e vincoli prima di qualsiasi scelta
                  </p>
                </li>
              </ul>
            </div>

            {/* Guardrail Panel */}
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium text-amber-800">Guardrail attivo</span>
              </div>
              <p className="text-sm text-amber-700">
                Prima di procedere, assicurati di aver compreso la differenza tra acquisto spot e trading con leva.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
            Come funziona
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Scegli l'obiettivo</h3>
              <p className="text-gray-600">
                Cosa vuoi fare davvero: esplorare, capire, acquistare con prudenza.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Leggi il contesto</h3>
              <p className="text-gray-600">
                Ti mostriamo "dove sei" nel mercato e cosa significa per un principiante.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Ricevi un percorso guidato</h3>
              <p className="text-gray-600">
                Pochi strumenti, spiegati bene, con errori tipici evidenziati prima.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiator Section */}
      <section className="py-16 bg-slate-700">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            La maggior parte delle piattaforme spinge all'azione. Noi rallentiamo.
          </h2>
          <p className="text-lg text-slate-300">
            Perché chi inizia non ha bisogno di più funzioni. Ha bisogno di meno errori.
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
            Seri per design
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-gray-100 text-gray-800 px-4 py-2 text-sm font-medium rounded-full">
              Educational · non consulenza
            </span>
            <span className="bg-gray-100 text-gray-800 px-4 py-2 text-sm font-medium rounded-full">
              Nessun segnale
            </span>
            <span className="bg-gray-100 text-gray-800 px-4 py-2 text-sm font-medium rounded-full">
              Nessuna leva
            </span>
            <span className="bg-gray-100 text-gray-800 px-4 py-2 text-sm font-medium rounded-full">
              Nessuna esecuzione / custodia
            </span>
            <span className="bg-gray-100 text-gray-800 px-4 py-2 text-sm font-medium rounded-full">
              Focus: prevenzione errori
            </span>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            Inizia dal tuo obiettivo
          </h2>
          
          <button className="bg-slate-700 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors mb-4">
            Inizia il percorso guidato
          </button>
          
          <p className="text-sm text-gray-500">
            Gratis · 60–90 secondi · Senza usare denaro
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-semibold text-lg text-gray-900">TRADELIA</div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="/privacy" className="hover:text-gray-900">Privacy</a>
              <a href="/terms" className="hover:text-gray-900">Termini</a>
              <a href="/contact" className="hover:text-gray-900">Contatti</a>
              <a href="/disclaimer" className="hover:text-gray-900">Disclaimer educational</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}