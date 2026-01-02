'use client'

export default function MethodSection() {
  const steps = [
    {
      num: '01',
      title: 'Disambiguazione',
      desc: 'Blocca l\'automatismo interpretativo e riduce le aspettative errate.'
    },
    {
      num: '02',
      title: 'Frizione cognitiva',
      desc: 'Introduce dubbio produttivo senza colpevolizzare.'
    },
    {
      num: '03',
      title: 'Ristrutturazione mentale',
      desc: 'Sposta il focus: non "ho sbagliato previsione", ma "ho scelto uno strumento incompatibile".'
    },
    {
      num: '04',
      title: 'Strumento di verifica',
      desc: 'Checklist tecnica, non gratificazione immediata.'
    },
    {
      num: '05',
      title: 'Controllo dell\'interpretazione',
      desc: 'Spiega come leggere il risultato per evitare sovrainterpretazioni.'
    },
    {
      num: '06',
      title: 'Chiusura dei confini',
      desc: 'Definisce chiaramente cosa Tradelia fa e cosa non fa.'
    }
  ]

  return (
    <section id="metodo" className="border-t border-border/50 py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Metodo cognitivo
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Sei passaggi verso la chiarezza.
            </h2>
            <p className="text-base text-muted-foreground">
              Un processo strutturato per interrompere l'automatismo e attivare il pensiero analitico.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {steps.map((step) => (
              <div key={step.num} className="space-y-3 rounded-lg border border-border/50 bg-muted/20 p-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-primary">{step.num}</span>
                  <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
