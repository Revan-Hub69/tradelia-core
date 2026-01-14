/**
 * Own Section - Learning Path Modules
 * 
 * Percorso dinamico per "Possedere criptovalute"
 * Target: persona normale 2026 che non sa cosa sono le crypto
 * Tono: conversazionale, esempi concreti, zero gergo inutile
 */

export interface ModuleSection {
  type: 'hook' | 'text' | 'heading' | 'example' | 'comparison' | 'callout' | 'takeaway'
  content?: string
  title?: string
  items?: { left: string; right: string }[]
  calloutType?: 'info' | 'warning' | 'insight'
}

export interface LearningModule {
  id: string
  title: string
  estimatedMinutes: number
  sections: ModuleSection[]
}

export const OWN_LEARNING_MODULES: LearningModule[] = [
  // ============================================
  // FASE 0A: ALFABETIZZAZIONE (4 moduli)
  // ============================================
  
  {
    id: '0.1-what-are-crypto',
    title: '0.1 - Cosa sono le criptovalute',
    estimatedMinutes: 3,
    sections: [
      // HOOK - Cattura attenzione con scenario reale
      {
        type: 'hook',
        content: 'Immagina di avere dei soldi che nessuna banca può bloccarti, ma che nessuno può recuperare se li perdi. Questo è il punto di partenza per capire le criptovalute.'
      },

      // SEZIONE 1: Cosa sono davvero
      {
        type: 'heading',
        title: 'In pratica'
      },
      {
        type: 'text',
        content: 'Le criptovalute sono soldi digitali che funzionano senza banche. Puoi mandarli a chiunque nel mondo, in qualsiasi momento, senza chiedere permesso a nessuno.'
      },
      {
        type: 'text',
        content: 'Non esistono fisicamente — niente monete, niente banconote. Esistono solo come numeri in un registro condiviso tra migliaia di computer.'
      },

      // SEZIONE 2: Cosa cambia rispetto ai soldi normali
      {
        type: 'heading',
        title: 'Cosa cambia rispetto ai soldi normali'
      },
      {
        type: 'comparison',
        title: 'Differenze pratiche',
        items: [
          { 
            left: 'Dimentichi la password del conto? La banca te la resetta.', 
            right: 'Perdi le chiavi crypto? Nessuno può aiutarti.' 
          },
          { 
            left: 'Mandi soldi per errore? Puoi contestare il bonifico.', 
            right: 'Mandi crypto per errore? Sono andati.' 
          },
          { 
            left: 'La banca può bloccarti il conto.', 
            right: 'Nessuno può bloccarti le crypto.' 
          }
        ]
      },

      // SEZIONE 3: Il punto chiave
      {
        type: 'heading',
        title: 'Il punto chiave'
      },
      {
        type: 'text',
        content: 'Con le crypto, sei tu la banca. Questo significa più libertà, ma anche più responsabilità. Se fai un errore, non c\'è un numero verde da chiamare.'
      },
      {
        type: 'callout',
        calloutType: 'insight',
        content: 'Non è né meglio né peggio dei soldi normali. È diverso. E capire questa differenza è il primo passo per non fare errori costosi.'
      },

      // TAKEAWAY
      {
        type: 'takeaway',
        content: 'Le criptovalute ti danno controllo totale sui tuoi soldi. Ma controllo totale significa anche responsabilità totale. Prima di comprarne, assicurati di capire cosa comporta.'
      }
    ]
  },

  {
    id: '0.2-how-blockchain-works',
    title: '0.2 - Come funziona la blockchain',
    estimatedMinutes: 5,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Introduzione al concetto di registro distribuito'
      },
      {
        type: 'heading',
        title: 'Cos\'è un registro distribuito'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco come funziona una blockchain a livello concettuale'
      }
    ]
  },

  {
    id: '0.3-bitcoin-ethereum',
    title: '0.3 - Bitcoin ed Ethereum - I due pilastri',
    estimatedMinutes: 7,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Perché esistono due architetture diverse'
      },
      {
        type: 'heading',
        title: 'Bitcoin: oro digitale'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'heading',
        title: 'Ethereum: computer mondiale'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco la differenza tra Bitcoin ed Ethereum'
      }
    ]
  },

  {
    id: '0.4-altcoins-ecosystem',
    title: '0.4 - Altcoin ed ecosistema',
    estimatedMinutes: 5,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Perché esistono migliaia di criptovalute'
      },
      {
        type: 'heading',
        title: 'Cosa sono le altcoin'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco l\'ecosistema crypto e le diverse categorie'
      }
    ]
  },

  // ============================================
  // FASE 0B: MECCANICA & SICUREZZA (3 moduli)
  // ============================================

  {
    id: '0.5-cryptography-basics',
    title: '0.5 - Crittografia base (senza matematica)',
    estimatedMinutes: 6,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Come funziona la sicurezza crypto'
      },
      {
        type: 'heading',
        title: 'Chiave pubblica vs chiave privata'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco come funziona la sicurezza crypto'
      }
    ]
  },

  {
    id: '0.6-consensus-mechanisms',
    title: '0.6 - Consensus mechanisms',
    estimatedMinutes: 7,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Come si raggiunge accordo senza autorità centrale'
      },
      {
        type: 'heading',
        title: 'Proof of Work vs Proof of Stake'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco come le blockchain raggiungono consenso'
      }
    ]
  },

  {
    id: '0.7-transactions-fees',
    title: '0.7 - Transazioni e fee',
    estimatedMinutes: 5,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Come funzionano le transazioni'
      },
      {
        type: 'heading',
        title: 'Anatomia di una transazione'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco come funzionano le transazioni'
      }
    ]
  },

  // ============================================
  // FASE 1: OWN - POSSEDERE (7 moduli)
  // ============================================

  {
    id: '1.1-what-means-owning',
    title: '1.1 - Cosa significa "possedere" crypto',
    estimatedMinutes: 4,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Differenza tra possedere crypto e soldi in banca'
      },
      {
        type: 'heading',
        title: 'Possesso vs custodia'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco cosa significa davvero possedere crypto'
      }
    ]
  },

  {
    id: '1.2-wallet-types',
    title: '1.2 - Wallet - Tipi e funzionamento',
    estimatedMinutes: 6,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Tutti i tipi di wallet'
      },
      {
        type: 'heading',
        title: 'Hot wallet vs cold wallet'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco tutti i tipi di wallet e i trade-off'
      }
    ]
  },

  {
    id: '1.3-irreversible-errors',
    title: '1.3 - Errori irreversibili',
    estimatedMinutes: 5,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Cosa può andare storto e PERCHÉ'
      },
      {
        type: 'heading',
        title: 'Errori che costano tutto'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'callout',
        calloutType: 'warning',
        content: '[CONTENUTO DA SVILUPPARE] Perdita seed phrase = perdita fondi per sempre'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco i rischi irreversibili'
      }
    ]
  },

  {
    id: '1.4-private-keys-seed',
    title: '1.4 - Chiavi private e seed phrase',
    estimatedMinutes: 6,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Il cuore della sicurezza crypto'
      },
      {
        type: 'heading',
        title: 'Seed phrase: 12/24 parole = accesso totale'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco come proteggere le mie chiavi private'
      }
    ]
  },

  {
    id: '1.5-self-custody-vs-exchange',
    title: '1.5 - Self-custody vs Exchange custody',
    estimatedMinutes: 5,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Trade-off tra controllo e comodità'
      },
      {
        type: 'heading',
        title: 'Exchange custody: pro e contro'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'heading',
        title: 'Self-custody: pro e contro'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco quando usare exchange e quando self-custody'
      }
    ]
  },

  {
    id: '1.6-addresses-networks',
    title: '1.6 - Indirizzi e network',
    estimatedMinutes: 5,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Come funzionano gli indirizzi'
      },
      {
        type: 'heading',
        title: 'Formato indirizzi'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco come funzionano indirizzi e network'
      }
    ]
  },

  {
    id: '1.7-practical-limits',
    title: '1.7 - Limiti pratici e normativi',
    estimatedMinutes: 5,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] I limiti del possedere crypto'
      },
      {
        type: 'heading',
        title: 'Limiti tecnici e pratici'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco i limiti pratici del possedere crypto'
      }
    ]
  }
]

// Helper per ottenere un modulo per ID
export function getModuleById(moduleId: string): LearningModule | undefined {
  return OWN_LEARNING_MODULES.find(m => m.id === moduleId)
}

// Lista moduli per il drawer
export const OWN_MODULE_LIST = OWN_LEARNING_MODULES.map(m => ({
  id: m.id,
  title: m.title,
  estimatedMinutes: m.estimatedMinutes
}))
