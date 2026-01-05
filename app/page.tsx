import { dictionary } from '@/lib/i18n';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-xl relative overflow-hidden">
        {/* Geometric pattern background */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full opacity-40" 
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        </div>
        
        {/* Floating geometric elements */}
        <div className="absolute top-20 left-10 w-4 h-4 border border-primary-300/30 rotate-45 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-32 right-20 w-3 h-3 bg-primary-400/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-primary-500/30 rotate-12 animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="container-xs text-center relative z-10">
          <div className="animate-in">
            <h1 className="mb-4 text-5xl lg:text-6xl font-bold tracking-tight">
              TRADELIA
            </h1>
            <p className="mb-8 text-xl lg:text-2xl text-muted-foreground font-medium">
              Crypto ti incuriosiscono,<br />
              <span className="text-foreground">ma non vuoi partire facendo errori evitabili?</span>
            </p>
          </div>
          
          <div className="animate-up" style={{ animationDelay: '200ms' }}>
            <div className="card p-8 mb-8 text-left max-w-2xl mx-auto">
              <p className="text-lg mb-4">
                In <span className="font-semibold text-primary-600">60 secondi</span> chiarisci cosa vuoi davvero fare
                e ottieni un check di coerenza decisionale basato su evidenze accademiche.
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>• Nessuna promessa</p>
                <p>• Nessun segnale</p>
                <p>• Nessuna pressione ad agire</p>
              </div>
            </div>
            
            <a href="#check" className="btn-primary btn-lg mb-4">
              → Inizia dal tuo obiettivo
            </a>
            
            <p className="text-sm text-muted-foreground">
              Nessuna registrazione · Nessuna operazione · Check guidato (60s)
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section bg-muted/50">
        <div className="container-xs">
          <div className="text-center mb-12">
            <h2 className="mb-6 text-3xl lg:text-4xl font-semibold">
              Il problema non è il mercato<br />
              <span className="text-primary-600">È partire senza un criterio</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              La maggior parte delle perdite nel mondo crypto non nasce da previsioni sbagliate,
              ma da errori iniziali ripetuti:
            </p>
          </div>
          
          <div className="grid gap-4 max-w-2xl mx-auto">
            {[
              'strumenti non coerenti con l\'obiettivo',
              'confusione tra investimento, trading e speculazione',
              'uso della leva fuori contesto',
              'esposizione eccessiva nelle prime fasi',
              'decisioni emotive (FOMO, panico, overconfidence)'
            ].map((error, index) => (
              <div key={index} className="card p-4 interactive">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-error-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-lg font-medium">
              Questi errori non sono individuali.<br />
              <span className="text-primary-600">Sono pattern documentati.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Evidence Table Section */}
      <section className="section">
        <div className="container-xs">
          <div className="text-center mb-12">
            <h2 className="mb-6">
              Errori tipici all'inizio<br />
              <span className="text-muted-foreground">(e perché non sono opinioni)</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Gli errori più comuni non dipendono dall'esperienza dell'utente,
              ma da bias cognitivi e mismatch obiettivo–strumento ampiamente studiati.
            </p>
          </div>
          
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Errore tipico</th>
                    <th className="text-left p-4 font-semibold">Evidenza accademica / regolatoria</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {
                      error: 'Usare leva o derivati pensando di fare "lungo periodo"',
                      evidence: 'Report su clienti retail in perdita – ESMA · SEC · FINRA'
                    },
                    {
                      error: 'Confondere investimento, trading e speculazione',
                      evidence: 'Barber & Odean (2000–2001): overconfidence e overtrading'
                    },
                    {
                      error: 'Seguire segnali o bot non verificabili',
                      evidence: 'Consumer & scam warnings – FCA'
                    },
                    {
                      error: 'Cambiare approccio ogni volta che il mercato si muove',
                      evidence: 'Regret aversion · Noise trading (De Bondt, Thaler; Shiller)'
                    },
                    {
                      error: 'Sovra-esporsi troppo presto (capitale o rischio)',
                      evidence: 'Overconfidence bias · Illusione di controllo (Kahneman & Tversky)'
                    }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{row.error}</td>
                      <td className="p-4 text-muted-foreground">{row.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-primary-50 border-t">
              <p className="text-primary-800 font-medium">
                👉 Questi non sono errori casuali. Sono comportamenti ricorrenti osservati nel tempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Check Section */}
      <section className="section bg-muted/50">
        <div className="container-xs">
          <div className="text-center mb-12">
            <h2 className="mb-6">
              Perché un check di coerenza <span className="text-muted-foreground">(prima di tutto)</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">La ricerca mostra che:</h3>
              <p className="text-lg mb-4">
                <span className="font-semibold text-primary-600">prevenire errori prima di agire</span><br />
                è più efficace che cercare performance dopo
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Un check iniziale riduce:</h3>
              <ul className="space-y-2">
                {[
                  'errori di framing',
                  'uso improprio degli strumenti',
                  'cambi di strategia impulsivi',
                  'decisioni prese sotto stress emotivo'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-lg font-medium">
              Tradelia interviene <span className="text-primary-600">prima</span> di qualsiasi operazione.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section">
        <div className="container-xs text-center">
          <h2 className="mb-6">
            Un dato per orientarsi <span className="text-muted-foreground">(non per spaventare)</span>
          </h2>
          
          <div className="card p-8 max-w-2xl mx-auto">
            <p className="text-lg mb-6">
              I regolatori europei riportano che la maggioranza dei clienti retail
              <span className="font-semibold text-error-600"> perde denaro</span> quando utilizza strumenti speculativi a leva
              (CFD e strumenti analoghi).
            </p>
            
            <div className="bg-error-50 p-6 rounded-lg mb-6">
              <p className="text-2xl font-bold text-error-600 mb-2">7–8 persone su 10</p>
              <p className="text-error-700">finiscono in perdita</p>
            </div>
            
            <div className="text-left space-y-2">
              <p>Questo non significa "mai".</p>
              <p className="font-medium">Significa che se l'obiettivo è sbagliato, le probabilità peggiorano.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Tradelia Does */}
      <section className="section bg-muted/50">
        <div className="container-xs">
          <div className="text-center mb-12">
            <h2 className="mb-6">
              Cosa fa Tradelia <span className="text-muted-foreground">(in concreto)</span>
            </h2>
            <p className="text-lg">
              Tradelia <span className="font-semibold">non decide per te</span><br />
              e <span className="font-semibold">non suggerisce operazioni</span>.
            </p>
          </div>
          
          <div className="card p-8 mb-8">
            <h3 className="text-xl font-semibold mb-6 text-center">
              In 60 secondi ti restituisce:
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'il percorso coerente con ciò che vuoi fare',
                'strumenti adatti e non adatti al tuo obiettivo',
                'gli errori più probabili nel tuo caso specifico',
                '3 regole anti-autogol (FOMO · sovra-esposizione · leva fuori contesto)'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-lg font-medium">
                Nient'altro.<br />
                <span className="text-muted-foreground">Zero overload informativo.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="section">
        <div className="container-xs">
          <h2 className="text-center mb-12">Per chi è Tradelia</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6 border-success-200 bg-success-50">
              <h3 className="text-xl font-semibold mb-4 text-success-800">✔️ Tradelia è per te se:</h3>
              <ul className="space-y-3">
                {[
                  'Vuoi capire prima di agire',
                  'Vuoi evitare errori strutturali comuni',
                  'Non cerchi segnali o scorciatoie',
                  'Vuoi coerenza, non hype'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-success-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card p-6 border-error-200 bg-error-50">
              <h3 className="text-xl font-semibold mb-4 text-error-800">❌ Tradelia NON è:</h3>
              <ul className="space-y-3">
                {[
                  'Una piattaforma di trading',
                  'Consulenza finanziaria',
                  'Non promette rendimenti'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-error-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="check" className="section-xl bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container-xs text-center">
          <h2 className="mb-8 text-primary-900">
            Inizia dal tuo obiettivo
          </h2>
          
          <a href="/check" className="btn-primary btn-lg mb-6">
            → Avvia il check di coerenza (60s)
          </a>
          
          <p className="text-sm text-primary-700">
            Nessuna email · Nessuna operazione · Solo chiarezza decisionale
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section-sm bg-muted">
        <div className="container-xs text-center">
          <h3 className="text-lg font-semibold mb-4">Nota metodologica</h3>
          <p className="text-muted-foreground">
            Tradelia è uno strumento educativo.
            Non fornisce raccomandazioni personalizzate
            e non sostituisce consulenza finanziaria professionale.
          </p>
        </div>
      </section>
    </>
  );
}