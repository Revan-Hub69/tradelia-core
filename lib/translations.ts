export const translations = {
  it: {
    nav: {
      home: 'Home',
      about: 'Metodologia',
      contact: 'Contatti'
    },
    hero: {
      title: 'TRADELIA',
      subtitle: 'Crypto ti incuriosiscono,',
      subtitleBold: 'ma non vuoi partire facendo errori evitabili?',
      description: 'Dashboard personalizzata per analizzare la coerenza tra obiettivi e strumenti crypto.',
      features: [
        'Nessuna promessa di guadagno',
        'Nessun segnale di trading', 
        'Nessuna pressione ad agire'
      ],
      cta: 'Accedi alla Dashboard',
      disclaimer: 'Configurazione rapida · Nessuna registrazione · Analisi obiettiva'
    },
    problem: {
      title: 'Il problema non è il mercato',
      titleSecond: 'È partire senza un criterio',
      description: 'La maggior parte delle perdite nel mondo crypto non nasce da previsioni sbagliate, ma da errori iniziali ripetuti',
      errors: [
        'Strumenti non coerenti con l\'obiettivo',
        'Confusione tra investimento, trading e speculazione',
        'Uso della leva fuori contesto',
        'Esposizione eccessiva nelle prime fasi',
        'Decisioni emotive (FOMO, panico, overconfidence)'
      ],
      conclusion: 'Questi errori non sono individuali.',
      conclusionSecond: 'Sono pattern documentati.'
    },
    evidence: {
      title: 'Errori tipici documentati',
      subtitle: 'Gli errori più comuni dipendono da bias cognitivi e mismatch obiettivo-strumento ampiamente studiati'
    },
    statistics: {
      title: 'Un dato per orientarsi',
      description: 'I regolatori europei riportano che la maggioranza dei clienti retail perde denaro quando utilizza strumenti speculativi a leva',
      percentage: '70-80%',
      result: 'dei clienti retail finisce in perdita',
      source: 'Fonte: Report ESMA su CFD e prodotti derivati'
    },
    dashboard: {
      title: 'Cosa fa Tradelia',
      subtitle: 'Tradelia non fornisce consigli di investimento e non suggerisce operazioni',
      features: 'La dashboard fornisce analisi:'
    },
    cta: {
      title: 'Dashboard Anti-Errori',
      button: 'Accedi alla Dashboard Anti-Errori',
      benefits: ['Nessuna email', 'Nessuna operazione', 'Solo chiarezza decisionale'],
      disclaimer: 'Completamente gratuito · Basato su evidenze accademiche'
    },
    disclaimer: {
      title: 'Nota metodologica',
      text: 'Tradelia è uno strumento educativo. Non fornisce raccomandazioni personalizzate e non sostituisce consulenza finanziaria professionale.'
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'Methodology',
      contact: 'Contact'
    },
    hero: {
      title: 'TRADELIA',
      subtitle: 'Curious about crypto,',
      subtitleBold: 'but don\'t want to start making avoidable mistakes?',
      description: 'Personalized dashboard to analyze coherence between objectives and crypto tools.',
      features: [
        'No profit promises',
        'No trading signals',
        'No pressure to act'
      ],
      cta: 'Access Dashboard',
      disclaimer: 'Quick setup · No registration · Objective analysis'
    },
    problem: {
      title: 'The problem isn\'t the market',
      titleSecond: 'It\'s starting without criteria',
      description: 'Most losses in crypto don\'t come from wrong predictions, but from repeated initial mistakes',
      errors: [
        'Tools not coherent with objectives',
        'Confusion between investment, trading and speculation',
        'Using leverage out of context',
        'Excessive exposure in early stages',
        'Emotional decisions (FOMO, panic, overconfidence)'
      ],
      conclusion: 'These errors are not individual.',
      conclusionSecond: 'They are documented patterns.'
    },
    evidence: {
      title: 'Documented typical errors',
      subtitle: 'Most common errors depend on cognitive biases and objective-tool mismatches widely studied'
    },
    statistics: {
      title: 'A data point for guidance',
      description: 'European regulators report that the majority of retail clients lose money when using leveraged speculative instruments',
      percentage: '70-80%',
      result: 'of retail clients end up losing',
      source: 'Source: ESMA reports on CFDs and derivatives'
    },
    dashboard: {
      title: 'What Tradelia does',
      subtitle: 'Tradelia does not provide investment advice and does not suggest operations',
      features: 'The dashboard provides analysis:'
    },
    cta: {
      title: 'Anti-Error Dashboard',
      button: 'Access Anti-Error Dashboard',
      benefits: ['No email', 'No operations', 'Just decision clarity'],
      disclaimer: 'Completely free · Based on academic evidence'
    },
    disclaimer: {
      title: 'Methodological note',
      text: 'Tradelia is an educational tool. It does not provide personalized recommendations and does not replace professional financial advice.'
    }
  }
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof translations.it;