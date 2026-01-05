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
      description: 'In 60 secondi chiarisci cosa vuoi davvero fare e ottieni un check di coerenza decisionale basato su evidenze accademiche.',
      features: [
        'Nessuna promessa di guadagno',
        'Nessun segnale di trading', 
        'Nessuna pressione ad agire'
      ],
      cta: '🎯 Inizia dal tuo obiettivo',
      disclaimer: '⚡ 60 secondi · 🔒 Nessuna registrazione · 📊 Solo chiarezza'
    },
    problem: {
      title: 'Il problema non è il mercato',
      titleSecond: 'È partire senza un criterio',
      description: 'La maggior parte delle perdite nel mondo crypto non nasce da previsioni sbagliate, ma da errori iniziali ripetuti:',
      errors: [
        'Strumenti non coerenti con l\'obiettivo',
        'Confusione tra investimento, trading e speculazione',
        'Uso della leva fuori contesto',
        'Esposizione eccessiva nelle prime fasi',
        'Decisioni emotive (FOMO, panico, overconfidence)'
      ],
      conclusion: 'Questi errori non sono individuali.',
      conclusionSecond: 'Sono pattern documentati.'
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
      description: 'In 60 seconds clarify what you really want to do and get a decision coherence check based on academic evidence.',
      features: [
        'No profit promises',
        'No trading signals',
        'No pressure to act'
      ],
      cta: '🎯 Start from your goal',
      disclaimer: '⚡ 60 seconds · 🔒 No registration · 📊 Just clarity'
    },
    problem: {
      title: 'The problem isn\'t the market',
      titleSecond: 'It\'s starting without criteria',
      description: 'Most losses in the crypto world don\'t come from wrong predictions, but from repeated initial mistakes:',
      errors: [
        'Tools not coherent with the objective',
        'Confusion between investment, trading and speculation',
        'Using leverage out of context',
        'Excessive exposure in early stages',
        'Emotional decisions (FOMO, panic, overconfidence)'
      ],
      conclusion: 'These errors are not individual.',
      conclusionSecond: 'They are documented patterns.'
    }
  }
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof translations.it;