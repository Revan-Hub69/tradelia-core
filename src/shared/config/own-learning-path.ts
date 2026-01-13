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
  {
    id: 'what-are-crypto',
    title: 'Cosa sono le criptovalute',
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
