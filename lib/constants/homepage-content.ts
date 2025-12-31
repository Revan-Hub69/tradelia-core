// Homepage Content Constants - Dashboard Dinamica 2025

export const HOMEPAGE_CONTENT = {
  // HERO SECTION - Dashboard Dinamica 2025
  hero: {
    headline: "Una dashboard dinamica che ti aiuta a non commettere errori nel mondo crypto",
    subHeadline: "Tradelia parte da ciò che stai cercando di fare (investire, accumulare, speculare, capire) e ti mostra cosa ha senso guardare e cosa è fuorviante, con spiegazioni chiare e micro-approfondimenti basati su metodi riconosciuti.",
    disclaimer: "Contenuti informativi ed educativi. Nessun consiglio di investimento. Nessun segnale operativo.",
    cta: {
      primary: "Accedi alla dashboard (percorso guidato)",
      reassurance: "Non ti chiediamo cosa comprare. Non ti chiediamo quanto investire."
    }
  },

  // COSA SUCCEDE QUANDO ENTRI
  dashboardPreview: {
    title: "Cosa trovi nella dashboard",
    description: "Quando accedi a Tradelia, la dashboard si configura in base a te. Vedrai subito:",
    features: [
      "cosa stai cercando di fare",
      "quali informazioni sono rilevanti per quell'obiettivo", 
      "avvisi quando qualcosa non è coerente o è rischioso"
    ],
    conclusion: "La dashboard non ti spinge ad agire. Ti aiuta a non guardare le cose sbagliate."
  },

  // PRINCIPIO INTENTION-DRIVEN
  intentionDriven: {
    title: "Non partiamo dai grafici. Partiamo dall'obiettivo.",
    question: "Cosa stai cercando di fare nel mondo crypto?",
    objectives: [
      {
        id: "passive",
        emoji: "🟦",
        label: "Investimenti passivi / lungo periodo"
      },
      {
        id: "accumulation", 
        emoji: "🟩",
        label: "Accumulo graduale"
      },
      {
        id: "speculation-moderate",
        emoji: "🟨", 
        label: "Speculazione moderata"
      },
      {
        id: "speculation-high",
        emoji: "🟥",
        label: "Speculazione ad alto rischio"
      },
      {
        id: "automation",
        emoji: "🟪",
        label: "Automazioni / strategie sistematiche"
      },
      {
        id: "learning",
        emoji: "⚪",
        label: "Sto solo cercando di capire"
      }
    ],
    disclaimer: "Questa scelta non è una raccomandazione finanziaria. Serve solo a configurare correttamente la dashboard."
  },

  // DASHBOARD DINAMICA
  dynamicDashboard: {
    title: "La dashboard si adatta a ciò che stai cercando di fare",
    description: "In base all'obiettivo scelto, Tradelia:",
    actions: [
      {
        icon: "✅",
        text: "mostra ciò che è utile"
      },
      {
        icon: "⚠️", 
        text: "mette in guardia su ciò che può trarre in inganno"
      },
      {
        icon: "❌",
        text: "sconsiglia ciò che non ha senso guardare"
      }
    ],
    examples: [
      "investimento passivo ≠ indicatori intraday",
      "speculazione ≠ ignorare rischio e liquidità"
    ],
    conclusion: "La dashboard non giudica. Filtra e mette contesto."
  },

  // MICRO-LEARNING CONTESTUALE
  microLearning: {
    title: "Spiegazioni solo quando servono",
    description: "Ogni dato o sezione della dashboard include:",
    features: [
      "perché è rilevante in questo contesto",
      "quando diventa fuorviante", 
      "l'errore tipico di chi lo interpreta male"
    ],
    philosophy: "Niente corsi lunghi. Niente teoria astratta. Chiarimenti brevi, nel momento giusto."
  },

  // PERCHÉ RIDUCE GLI ERRORI
  errorReduction: {
    title: "La maggior parte degli errori nasce dal contesto sbagliato",
    description: "Nel mondo crypto gli errori più comuni non derivano dalla mancanza di dati, ma da:",
    commonErrors: [
      "guardare indicatori sbagliati per l'obiettivo scelto",
      "cambiare approccio continuamente",
      "confondere rumore di breve periodo con segnali reali"
    ],
    solution: "Tradelia serve a interrompere questi meccanismi."
  },

  // COSA FA E COSA NON FA
  whatTradeliaDoes: {
    title: "Cosa Tradelia fa (e cosa no)",
    does: {
      title: "Cosa fa",
      items: [
        "Ti aiuta a chiarire cosa stai cercando di fare",
        "Filtra informazioni in base a quell'obiettivo", 
        "Evidenzia incoerenze e rischi evitabili",
        "Fornisce spiegazioni educative e contestuali",
        "In alcuni casi la dashboard può suggerirti di fermarti o di rivedere l'approccio"
      ]
    },
    doesNot: {
      title: "Cosa NON fa",
      items: [
        "❌ Non fornisce segnali di acquisto o vendita",
        "❌ Non suggerisce asset specifici",
        "❌ Non promette risultati", 
        "❌ Non gestisce capitali"
      ]
    }
  },

  // PERCHÉ TRADELIA ESISTE
  whyExists: {
    title: "Perché Tradelia esiste",
    subtitle: "Il problema che stiamo cercando di risolvere",
    message: "Nel mondo crypto, la maggior parte degli errori non nasce dalla mancanza di informazioni, ma dal guardare le informazioni sbagliate per l'obiettivo che si ha. Tradelia esiste per interrompere questo meccanismo: prima di mostrarti qualsiasi dato, ti aiuta a chiarire cosa stai cercando di fare."
  },

  // METODO E TRASPARENZA
  methodology: {
    title: "Su cosa si basa Tradelia",
    description: "Le logiche della dashboard si basano su:",
    foundations: [
      "errori ricorrenti osservati nel comportamento degli utenti",
      "principi di gestione del rischio",
      "studi sul processo decisionale e sui bias cognitivi"
    ],
    philosophy: "Nessuna previsione. Nessuna promessa. Solo riduzione del rumore e maggiore consapevolezza."
  },

  // CTA FINALE
  finalCta: {
    title: "Prima di guardare i grafici, assicurati di guardare le cose giuste.",
    cta: "Accedi alla dashboard",
    disclaimer: "Contenuti informativi ed educativi. Nessuna sollecitazione all'investimento."
  },

  // Footer - Aggiornato per dashboard dinamica
  footer: {
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/metodo", label: "Metodo e fonti" },
      { href: "/about", label: "Il progetto" },
      { href: "/privacy", label: "Privacy" }
    ],
    disclaimer: "Tradelia è un progetto educativo. Non fornisce consulenza finanziaria né raccomandazioni operative. Il suo scopo è migliorare la comprensione e ridurre errori comuni nel mondo crypto.",
    copyright: "© 2025 Tradelia. Dashboard dinamica per decisioni consapevoli."
  }
} as const;

// Navigation Constants - Aggiornati per dashboard dinamica
export const NAVIGATION = {
  dashboard: "/dashboard",
  mainCta: "/dashboard"
} as const;