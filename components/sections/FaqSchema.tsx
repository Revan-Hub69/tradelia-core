'use client';

export default function FaqSchema() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Le crypto sono sicure per i principianti?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le crypto hanno rischi specifici che i principianti spesso sottovalutano. Tradelia ti aiuta a identificare questi rischi prima di investire, basandosi su ricerca accademica sui comportamenti più comuni che portano a perdite."
        }
      },
      {
        "@type": "Question", 
        "name": "Come evitare le truffe crypto?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tradelia identifica i pattern comportamentali che rendono vulnerabili alle truffe, come l'eccesso di fiducia e l'imitazione sociale. Ti mostra come riconoscere questi bias prima che ti costino denaro."
        }
      },
      {
        "@type": "Question",
        "name": "Quanto devo investire in Bitcoin?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "Tradelia non fornisce consigli di investimento, ma ti aiuta a capire se i tuoi obiettivi sono coerenti con gli strumenti che stai considerando. L'importo dipende dalla tua situazione personale."
        }
      },
      {
        "@type": "Question",
        "name": "Tradelia è gratuito?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sì, Tradelia è completamente gratuito. Non richiede registrazione o depositi. Può ricevere commissioni da partner raccomandati, con piena trasparenza."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}