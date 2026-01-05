export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-6xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
            TRADELIA
          </h1>
          <p className="text-2xl lg:text-3xl text-gray-800 mb-6 font-medium leading-tight">
            Crypto ti incuriosiscono,<br />
            <span className="text-gray-900 font-bold">ma non vuoi partire facendo errori evitabili?</span>
          </p>
          
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 mb-12 text-left max-w-2xl mx-auto">
            <p className="text-xl text-gray-800 mb-6 leading-relaxed">
              In <strong className="text-gray-900">60 secondi</strong> chiarisci cosa vuoi davvero fare
              e ottieni un check di coerenza decisionale basato su evidenze accademiche.
            </p>
            <div className="space-y-3 text-gray-700">
              <p>• Nessuna promessa</p>
              <p>• Nessun segnale</p>
              <p>• Nessuna pressione ad agire</p>
            </div>
          </div>
          
          <a href="#check" className="inline-block bg-gray-900 text-white text-xl font-bold px-12 py-4 rounded-xl hover:bg-gray-800 transition-colors mb-6">
            → Inizia dal tuo obiettivo
          </a>
          
          <p className="text-gray-600">
            Nessuna registrazione · Nessuna operazione · Check guidato (60s)
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              Il problema non è il mercato<br />
              È partire senza un criterio
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              La maggior parte delle perdite nel mondo crypto non nasce da previsioni sbagliate,
              ma da errori iniziali ripetuti:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Strumenti non coerenti con l\'obiettivo',
              'Confusione tra investimento, trading e speculazione',
              'Uso della leva fuori contesto',
              'Esposizione eccessiva nelle prime fasi',
              'Decisioni emotive (FOMO, panico, overconfidence)'
            ].map((error, index) => (
              <div key={index} className="bg-red-900/30 border border-red-700/50 rounded-xl p-6">
                <p className="text-white font-medium leading-relaxed">{error}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <p className="text-2xl font-bold">
              Questi errori non sono individuali.<br />
              Sono pattern documentati.
            </p>
          </div>
        </div>
      </section>

      {/* Evidence Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Errori tipici all'inizio
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Gli errori più comuni non dipendono dall'esperienza dell'utente,
              ma da bias cognitivi e mismatch obiettivo–strumento ampiamente studiati.
            </p>
          </div>
          
          {/* Mobile Cards */}
          <div className="lg:hidden space-y-6">
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
              <div key={index} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{row.error}</h3>
                <p className="text-gray-700">{row.evidence}</p>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-8 font-bold text-gray-900 text-xl w-1/2">Errore tipico</th>
                  <th className="text-left p-8 font-bold text-gray-900 text-xl w-1/2">Evidenza accademica</th>
                </tr>
              </thead>
              <tbody>
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
                  <tr key={index} className="border-t-2 border-gray-100">
                    <td className="p-8 font-semibold text-gray-900 text-lg">{row.error}</td>
                    <td className="p-8 text-gray-700 text-lg">{row.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mt-8">
            <p className="text-blue-900 font-bold text-xl text-center">
              Questi non sono errori casuali. Sono comportamenti ricorrenti osservati nel tempo.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            Un dato per orientarsi
          </h2>
          
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-12">
            <p className="text-xl text-gray-800 mb-8 leading-relaxed">
              I regolatori europei riportano che la maggioranza dei clienti retail
              <strong className="text-red-600"> perde denaro</strong> quando utilizza strumenti speculativi a leva
              (CFD e strumenti analoghi).
            </p>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 mb-8">
              <p className="text-4xl font-black text-red-600 mb-2">7–8 persone su 10</p>
              <p className="text-red-800 font-bold text-xl">finiscono in perdita</p>
            </div>
            
            <div className="text-left space-y-4 max-w-2xl mx-auto">
              <p className="text-lg text-gray-800">Questo non significa "mai".</p>
              <p className="text-lg font-bold text-gray-900">Significa che se l'obiettivo è sbagliato, le probabilità peggiorano.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Tradelia Does */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Cosa fa Tradelia
            </h2>
            <p className="text-2xl text-gray-800">
              Tradelia <strong>non decide per te</strong><br />
              e <strong>non suggerisce operazioni</strong>.
            </p>
          </div>
          
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              In 60 secondi ti restituisce:
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                'Il percorso coerente con ciò che vuoi fare',
                'Strumenti adatti e non adatti al tuo obiettivo',
                'Gli errori più probabili nel tuo caso specifico',
                '3 regole anti-autogol (FOMO · sovra-esposizione · leva fuori contesto)'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-lg text-gray-800 font-medium">{item}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-xl font-bold text-gray-900">
                Nient'altro. Zero overload informativo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="check" className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl lg:text-6xl font-bold mb-8">
            Inizia dal tuo obiettivo
          </h2>
          
          <a href="/check" className="inline-block bg-white text-gray-900 text-2xl font-bold px-16 py-6 rounded-2xl hover:bg-gray-100 transition-colors mb-8">
            → Avvia il check di coerenza (60s)
          </a>
          
          <p className="text-gray-400 text-lg">
            Nessuna email · Nessuna operazione · Solo chiarezza decisionale
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Nota metodologica</h3>
          <p className="text-gray-700">
            Tradelia è uno strumento educativo.
            Non fornisce raccomandazioni personalizzate
            e non sostituisce consulenza finanziaria professionale.
          </p>
        </div>
      </section>
    </>
  );
}