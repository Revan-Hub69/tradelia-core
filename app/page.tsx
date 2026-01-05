'use client';

import { useLanguage } from '@/components/LanguageSelector';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Tradelia",
            "description": "Check di coerenza crypto in 60 secondi",
            "url": "https://tradelia.com",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            }
          })
        }}
      />

      {/* Hero Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-6xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-2xl lg:text-3xl text-gray-800 mb-6 font-medium leading-tight">
            {t('hero.subtitle')}<br />
            <span className="text-gray-900 font-bold">{t('hero.subtitleBold')}</span>
          </p>
          
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 mb-12 text-left max-w-2xl mx-auto">
            <p className="text-xl text-gray-800 mb-6 leading-relaxed">
              In <strong className="text-gray-900">60 secondi</strong> chiarisci cosa vuoi davvero fare
              e ottieni un <strong className="text-gray-900">check di coerenza decisionale</strong> basato su evidenze accademiche.
            </p>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Nessuna promessa di guadagno
              </p>
              <p className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Nessun segnale di trading
              </p>
              <p className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Nessuna pressione ad agire
              </p>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <a 
              href="#check" 
              className="inline-block bg-gray-900 text-white text-xl font-bold px-12 py-4 rounded-xl hover:bg-gray-800 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Inizia il check di coerenza crypto"
            >
              🎯 Inizia dal tuo obiettivo
            </a>
            <p className="text-sm text-gray-500">
              ⚡ 60 secondi · 🔒 Nessuna registrazione · 📊 Solo chiarezza
            </p>
          </div>
          
          {/* Social Proof */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-blue-900 font-medium">
              <span className="font-bold">Metodologia verificabile:</span> Basato su ricerche di Kahneman, Tversky, 
              Barber & Odean e report regolatori ESMA, SEC, FCA
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              Il problema non è il mercato<br />
              <span className="text-red-400">È partire senza un criterio</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              La maggior parte delle perdite nel mondo crypto non nasce da previsioni sbagliate,
              ma da <strong className="text-white">errori iniziali ripetuti</strong>:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              'Strumenti non coerenti con l\'obiettivo',
              'Confusione tra investimento, trading e speculazione',
              'Uso della leva fuori contesto',
              'Esposizione eccessiva nelle prime fasi',
              'Decisioni emotive (FOMO, panico, overconfidence)'
            ].map((error, index) => (
              <div key={index} className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 hover:bg-red-900/40 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">⚠️</span>
                  <p className="text-white font-medium leading-relaxed">{error}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center bg-gray-800 rounded-2xl p-8">
            <p className="text-2xl font-bold mb-4">
              Questi errori non sono individuali.<br />
              <span className="text-yellow-400">Sono pattern documentati.</span>
            </p>
            <p className="text-gray-300">
              Studiati da decenni in finanza comportamentale e confermati dai regolatori
            </p>
          </div>
        </div>
      </section>

      {/* Evidence Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Errori tipici documentati
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Gli errori più comuni non dipendono dall'esperienza dell'utente,
              ma da <strong>bias cognitivi</strong> e <strong>mismatch obiettivo–strumento</strong> ampiamente studiati.
            </p>
          </div>
          
          {/* Mobile Cards */}
          <div className="lg:hidden space-y-6">
            {[
              {
                error: 'Usare leva o derivati pensando di fare "lungo periodo"',
                evidence: 'Report su clienti retail in perdita – ESMA · SEC · FINRA',
                icon: '📈'
              },
              {
                error: 'Confondere investimento, trading e speculazione',
                evidence: 'Barber & Odean (2000–2001): overconfidence e overtrading',
                icon: '🎯'
              },
              {
                error: 'Seguire segnali o bot non verificabili',
                evidence: 'Consumer & scam warnings – FCA',
                icon: '🤖'
              },
              {
                error: 'Cambiare approccio ogni volta che il mercato si muove',
                evidence: 'Regret aversion · Noise trading (De Bondt, Thaler; Shiller)',
                icon: '🔄'
              },
              {
                error: 'Sovra-esporsi troppo presto (capitale o rischio)',
                evidence: 'Overconfidence bias · Illusione di controllo (Kahneman & Tversky)',
                icon: '⚖️'
              }
            ].map((row, index) => (
              <div key={index} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-3">
                  <span className="text-2xl">{row.icon}</span>
                  <h3 className="font-bold text-gray-900 text-lg">{row.error}</h3>
                </div>
                <p className="text-gray-700 pl-12">
                  <strong>Fonte:</strong> {row.evidence}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm">
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
                    error: '📈 Usare leva o derivati pensando di fare "lungo periodo"',
                    evidence: 'Report su clienti retail in perdita – ESMA · SEC · FINRA'
                  },
                  {
                    error: '🎯 Confondere investimento, trading e speculazione',
                    evidence: 'Barber & Odean (2000–2001): overconfidence e overtrading'
                  },
                  {
                    error: '🤖 Seguire segnali o bot non verificabili',
                    evidence: 'Consumer & scam warnings – FCA'
                  },
                  {
                    error: '🔄 Cambiare approccio ogni volta che il mercato si muove',
                    evidence: 'Regret aversion · Noise trading (De Bondt, Thaler; Shiller)'
                  },
                  {
                    error: '⚖️ Sovra-esporsi troppo presto (capitale o rischio)',
                    evidence: 'Overconfidence bias · Illusione di controllo (Kahneman & Tversky)'
                  }
                ].map((row, index) => (
                  <tr key={index} className="border-t-2 border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-8 font-semibold text-gray-900 text-lg">{row.error}</td>
                    <td className="p-8 text-gray-700 text-lg">{row.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mt-8">
            <p className="text-blue-900 font-bold text-xl text-center">
              💡 Questi non sono errori casuali. Sono comportamenti ricorrenti osservati nel tempo.
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
          
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-12 shadow-sm">
            <p className="text-xl text-gray-800 mb-8 leading-relaxed">
              I regolatori europei riportano che la maggioranza dei clienti retail
              <strong className="text-red-600"> perde denaro</strong> quando utilizza strumenti speculativi a leva
              (CFD e strumenti analoghi).
            </p>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 mb-8">
              <p className="text-5xl font-black text-red-600 mb-2">70-80%</p>
              <p className="text-red-800 font-bold text-xl">dei clienti retail finisce in perdita</p>
              <p className="text-red-700 text-sm mt-2">Fonte: Report ESMA su CFD e prodotti derivati</p>
            </div>
            
            <div className="text-left space-y-4 max-w-2xl mx-auto">
              <p className="text-lg text-gray-800">
                ✅ Questo non significa <strong>"mai usarli"</strong>
              </p>
              <p className="text-lg font-bold text-gray-900">
                ⚠️ Significa che <strong>se l'obiettivo è sbagliato, le probabilità peggiorano</strong>
              </p>
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
              Tradelia <strong className="text-red-600">non decide per te</strong><br />
              e <strong className="text-red-600">non suggerisce operazioni</strong>.
            </p>
          </div>
          
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              ⏱️ In 60 secondi ti restituisce:
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { text: 'Il percorso coerente con ciò che vuoi fare', icon: '🎯' },
                { text: 'Strumenti adatti e non adatti al tuo obiettivo', icon: '🛠️' },
                { text: 'Gli errori più probabili nel tuo caso specifico', icon: '⚠️' },
                { text: '3 regole anti-autogol (FOMO · sovra-esposizione · leva fuori contesto)', icon: '🛡️' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-lg text-gray-800 font-medium pt-2">{item.text}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-xl font-bold text-gray-900">
                🎯 Nient'altro. Zero overload informativo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="check" className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl lg:text-6xl font-bold mb-8">
            🚀 Inizia dal tuo obiettivo
          </h2>
          
          <div className="mb-8">
            <a 
              href="/check" 
              className="inline-block bg-white text-gray-900 text-2xl font-bold px-16 py-6 rounded-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
              aria-label="Avvia il check di coerenza crypto"
            >
              ⚡ Avvia il check di coerenza (60s)
            </a>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-400 text-lg">
              🔒 Nessuna email · 💰 Nessuna operazione · 🎯 Solo chiarezza decisionale
            </p>
            <p className="text-gray-500 text-sm">
              Completamente gratuito · Basato su evidenze accademiche
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Nota metodologica</h3>
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