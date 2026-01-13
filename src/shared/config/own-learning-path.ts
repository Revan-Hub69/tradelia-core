/**
 * Own Section - Learning Path Modules
 * 
 * Percorso dinamico per "Possedere criptovalute"
 * Moduli educativi sequenziali
 */

export interface ModuleSection {
  type: 'text' | 'list' | 'glossary' | 'comparison' | 'alert' | 'takeaway'
  content?: string
  title?: string
  items?: string[]
  glossaryItems?: { term: string; definition: string }[]
  comparisonData?: { traditional: string[]; crypto: string[] }
  alertType?: 'info' | 'warning'
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
    estimatedMinutes: 4,
    sections: [
      {
        type: 'text',
        content: 'Prima di capire come possedere criptovalute, serve chiarire cosa sono realmente — al di là delle semplificazioni comuni.'
      },
      {
        type: 'text',
        content: 'Le criptovalute sono asset digitali che funzionano su reti decentralizzate. Permettono di registrare e trasferire valore senza un intermediario centrale.'
      },
      {
        type: 'text',
        content: 'Non rappresentano un deposito presso una banca. Non costituiscono un credito verso uno Stato o un\'istituzione. Non sono garantite da nessun ente.'
      },
      {
        type: 'text',
        content: 'Ogni criptovaluta opera secondo regole tecniche pubbliche che definiscono come il valore viene creato, trasferito e verificato. Queste regole sono le stesse per tutti e non prevedono eccezioni.'
      },
      {
        type: 'text',
        content: 'Il sistema non identifica le persone: verifica solo il controllo degli strumenti di accesso associati agli asset. Questo si chiama sistema pseudonimo — l\'identità non conta, conta il possesso delle credenziali.'
      },
      {
        type: 'glossary',
        title: 'Glossario essenziale',
        glossaryItems: [
          {
            term: 'Asset digitale',
            definition: 'Un bene che esiste solo in forma elettronica. Il suo valore non dipende da un supporto fisico, ma dal fatto che un sistema informatico lo riconosca come valido e trasferibile.'
          },
          {
            term: 'Rete decentralizzata',
            definition: 'Un sistema in cui il controllo non è concentrato in un unico soggetto. Più partecipanti applicano le stesse regole per verificare e registrare le operazioni.'
          },
          {
            term: 'Regole tecniche pubbliche',
            definition: 'Le regole che definiscono come funziona una criptovaluta. Stabiliscono cosa è valido e cosa no, senza interpretazioni o decisioni discrezionali.'
          },
          {
            term: 'Strumenti di accesso',
            definition: 'Credenziali tecniche (chiavi o codici) che permettono di utilizzare gli asset. Il sistema verifica solo se questi strumenti sono corretti, non chi li utilizza.'
          },
          {
            term: 'Sistema pseudonimo',
            definition: 'Un sistema che non richiede identità per operare. Le transazioni sono pubbliche, ma collegate a indirizzi, non a nomi.'
          }
        ]
      },
      {
        type: 'comparison',
        title: 'Confronto: sistemi tradizionali vs criptovalute',
        comparisonData: {
          traditional: [
            'Un intermediario tiene i registri',
            'Le operazioni possono essere bloccate, corrette o annullate',
            'Le transazioni possono essere contestate per giorni',
            'L\'identità è verificata',
            'Esiste un intervento discrezionale'
          ],
          crypto: [
            'I registri sono condivisi tra i partecipanti',
            'Le operazioni valide non vengono modificate',
            'Una transazione confermata è definitiva',
            'Solo il possesso delle credenziali è verificato',
            'Non esiste intervento discrezionale'
          ]
        }
      },
      {
        type: 'text',
        content: 'Questa differenza riduce l\'intermediazione, ma cambia profondamente le responsabilità di chi le utilizza.'
      },
      {
        type: 'alert',
        alertType: 'warning',
        title: 'Riepilogo operativo — la realtà del possesso',
        items: [
          'Il possesso è legato a codici digitali, non a un nome',
          'Chi controlla i codici controlla gli asset',
          'Non esiste una procedura standard di recupero',
          'Un pagamento valido non può essere annullato',
          'Il sistema non valuta errori, intenzioni o contesto',
          'Le regole sono uguali per tutti, sempre'
        ]
      },
      {
        type: 'text',
        content: 'Questo non è né un vantaggio né uno svantaggio. È il funzionamento del sistema.'
      },
      {
        type: 'takeaway',
        content: 'Le criptovalute non offrono garanzie che il sistema non prevede. Capirlo prima è l\'unica protezione.'
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
