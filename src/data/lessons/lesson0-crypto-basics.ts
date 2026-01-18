// Lezione 0: Cosa sono le Criptovalute
// Contenuto ottimizzato per noob completi con 3 approcci cognitivi

import { LessonContent } from '@/types/learning';

export const lesson0CryptoBasics: LessonContent = {
  id: 'lesson-0-crypto-basics',
  title: 'Cosa sono le Criptovalute',
  subtitle: 'La stessa verità, tre modi di capirla. Esplorarli tutti sblocca la flessibilità cognitiva.',
  estimatedTime: 5,
  xpReward: 50,
  
  approaches: {
    analogical: {
      id: 'analogical-crypto',
      title: 'Approccio Analogico',
      description: 'Comprendi attraverso metafore familiari',
      icon: '🎭',
      content: {
        sections: [
          {
            id: 'metaphor-intro',
            type: 'highlight',
            content: 'Immagina un **quaderno magico condiviso** tra migliaia di persone in tutto il mondo.',
            metadata: { bgColor: 'bg-blue-50', icon: '📔' }
          },
          {
            id: 'how-it-works',
            type: 'text',
            content: 'Ogni volta che qualcuno vuole scrivere qualcosa (fare una transazione), deve prima convincere la maggioranza delle persone che quello che vuole scrivere è corretto.'
          },
          {
            id: 'mapping-title',
            type: 'highlight',
            content: '🔗 Come funziona l\'analogia:',
            metadata: { emphasis: true }
          },
          {
            id: 'mapping-list',
            type: 'example',
            content: '• **Quaderno** = Blockchain (registro delle transazioni)\n• **Pagine** = Blocchi (gruppi di transazioni)\n• **Persone** = Computer della rete\n• **Scrivere** = Fare transazioni\n• **Convincere tutti** = Consenso della rete'
          },
          {
            id: 'magic-aspect',
            type: 'highlight',
            content: '✨ Perché è "magico":',
            metadata: { bgColor: 'bg-yellow-50' }
          },
          {
            id: 'magic-features',
            type: 'text',
            content: '• Una volta scritto, **nessuno può cancellare** o modificare\n• Tutti hanno sempre la **stessa copia aggiornata**\n• Non serve un "capo quaderno" che controlli tutto'
          },
          {
            id: 'limitations',
            type: 'warning',
            content: '⚠️ **Dove l\'analogia si rompe:**\n• Il quaderno vero ha pagine limitate, la blockchain può crescere infinitamente\n• Nel quaderno vero puoi vedere chi scrive, nelle crypto c\'è pseudonimato',
            metadata: { bgColor: 'bg-amber-50' }
          }
        ],
        keyTakeaways: [
          'Le crypto sono come un quaderno condiviso che nessuno può falsificare',
          'Tutti possono verificare, nessuno può imbrogliare',
          'Non serve fidarsi di una banca o governo'
        ]
      }
    },

    procedural: {
      id: 'procedural-crypto',
      title: 'Approccio Procedurale',
      description: 'Impara attraverso scenari pratici step-by-step',
      icon: '🔧',
      content: {
        sections: [
          {
            id: 'scenario-intro',
            type: 'highlight',
            content: '🎯 **Scenario:** Alice vuole mandare 1 Bitcoin a Bob senza usare una banca',
            metadata: { bgColor: 'bg-green-50' }
          },
          {
            id: 'step-1',
            type: 'example',
            content: '**Step 1:** Alice apre il suo wallet digitale\n→ ✅ *Checkpoint:* Wallet mostra il saldo disponibile'
          },
          {
            id: 'step-2',
            type: 'example',
            content: '**Step 2:** Alice inserisce l\'indirizzo di Bob e l\'importo (1 BTC)\n→ ✅ *Checkpoint:* Sistema verifica che Alice abbia abbastanza Bitcoin'
          },
          {
            id: 'step-3',
            type: 'example',
            content: '**Step 3:** Alice firma la transazione con la sua chiave privata\n→ ✅ *Checkpoint:* Firma crittografica conferma che Alice è proprietaria'
          },
          {
            id: 'step-4',
            type: 'example',
            content: '**Step 4:** La transazione viene trasmessa alla rete Bitcoin\n→ ✅ *Checkpoint:* Migliaia di computer ricevono e validano'
          },
          {
            id: 'step-5',
            type: 'example',
            content: '**Step 5:** I miner includono la transazione in un nuovo blocco\n→ ✅ *Checkpoint:* Transazione entra nella "lista d\'attesa"'
          },
          {
            id: 'step-6',
            type: 'example',
            content: '**Step 6:** Il blocco viene aggiunto alla blockchain\n→ ✅ *Checkpoint:* Proof-of-Work completato, blocco accettato'
          },
          {
            id: 'step-7',
            type: 'highlight',
            content: '**Step 7:** Bob vede il Bitcoin nel suo wallet! 🎉\n→ ✅ *Checkpoint:* Transazione confermata, processo completato',
            metadata: { bgColor: 'bg-green-100' }
          },
          {
            id: 'timing-info',
            type: 'text',
            content: '⏱️ **Tempo totale:** ~10 minuti (tempo medio blocco Bitcoin)\n💰 **Costo:** Fee di transazione (variabile in base al traffico di rete)'
          }
        ],
        keyTakeaways: [
          'Il processo elimina la necessità di fiducia in un intermediario',
          'La sicurezza viene dalla verifica matematica, non dalla fiducia',
          'Ogni step è verificabile e trasparente'
        ]
      }
    },

    conceptual: {
      id: 'conceptual-crypto',
      title: 'Approccio Concettuale',
      description: 'Comprendi attraverso definizioni formali e proprietà tecniche',
      icon: '📚',
      content: {
        sections: [
          {
            id: 'formal-definition',
            type: 'highlight',
            content: '📖 **Definizione Formale:**\n\nUna criptovaluta è un **asset digitale programmabile** il cui possesso e trasferimento sono regolati da **protocolli crittografici** e da un **ledger distribuito**, eliminando la necessità di un\'autorità centrale.',
            metadata: { bgColor: 'bg-purple-50' }
          },
          {
            id: 'components-title',
            type: 'highlight',
            content: '🔧 **Componenti Tecnici Fondamentali:**',
            metadata: { emphasis: true }
          },
          {
            id: 'components-list',
            type: 'example',
            content: '• **Crittografia a chiave pubblica** - Sistema di firme digitali\n• **Funzioni hash crittografiche** - Integrità e collegamento dei dati\n• **Consenso distribuito** - Meccanismo di accordo tra nodi\n• **Merkle trees** - Struttura dati per verifiche efficienti\n• **Proof-of-Work/Stake** - Algoritmi di sicurezza economica'
          },
          {
            id: 'properties-title',
            type: 'highlight',
            content: '⚡ **Proprietà Emergenti:**',
            metadata: { emphasis: true }
          },
          {
            id: 'properties-list',
            type: 'text',
            content: '• **Verificabilità:** Chiunque può controllare lo stato del sistema\n• **Resistenza alla censura:** Dipende dal grado di decentralizzazione\n• **Irreversibilità pratica:** Modifiche retroattive computazionalmente impossibili\n• **Pseudonimato:** Indirizzi pubblici, identità potenzialmente private'
          },
          {
            id: 'implications-title',
            type: 'highlight',
            content: '🌐 **Implicazioni Sistemiche:**',
            metadata: { emphasis: true }
          },
          {
            id: 'implications-list',
            type: 'text',
            content: '• Eliminazione del **single point of failure** centralizzato\n• Trade-off tra **efficienza energetica** e **sicurezza bizantina**\n• Necessità di **gestione sicura delle chiavi private**\n• Tensione tra **immutabilità** e **correzione di errori**'
          }
        ],
        keyTakeaways: [
          'Le crypto sono sistemi crittografici distribuiti, non solo "monete digitali"',
          'La sicurezza deriva da matematica e consenso, non da autorità',
          'Ogni proprietà ha trade-off che vanno compresi'
        ]
      }
    }
  },

  quiz: [
    {
      id: 'q1-analogical',
      question: 'Nell\'analogia del "quaderno magico", cosa rappresenta il fatto che "tutti devono essere d\'accordo prima di scrivere"?',
      options: [
        'Il governo che approva le transazioni',
        'Il consenso distribuito della rete',
        'La banca che verifica i pagamenti',
        'Il CEO di Bitcoin che decide'
      ],
      correctAnswer: 1,
      explanation: 'Esatto! Il consenso distribuito significa che la maggioranza dei computer della rete deve essere d\'accordo prima che una transazione sia accettata.',
      approach: 'analogical'
    },
    {
      id: 'q2-procedural',
      question: 'Nel processo step-by-step, cosa succede PRIMA che Bob veda il Bitcoin nel suo wallet?',
      options: [
        'Alice firma con la sua chiave privata',
        'Il blocco viene aggiunto alla blockchain',
        'Bob conferma di aver ricevuto',
        'La banca approva il trasferimento'
      ],
      correctAnswer: 1,
      explanation: 'Corretto! Il blocco deve essere aggiunto alla blockchain e confermato prima che Bob possa vedere i Bitcoin nel suo wallet.',
      approach: 'procedural'
    },
    {
      id: 'q3-conceptual',
      question: 'Quale proprietà tecnica rende le transazioni crypto "irreversibili praticamente"?',
      options: [
        'La velocità della rete',
        'Il costo delle commissioni',
        'La crittografia e il consenso distribuito',
        'La regolamentazione governativa'
      ],
      correctAnswer: 2,
      explanation: 'Esatto! La combinazione di crittografia forte e consenso distribuito rende computazionalmente impossibile modificare transazioni passate.',
      approach: 'conceptual'
    }
  ]
};