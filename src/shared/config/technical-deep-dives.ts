/**
 * Technical Deep Dives - Approfondimenti Tecnici
 * 
 * Moduli opzionali per chi vuole andare più a fondo
 */

import type { LearningModule } from './own-learning-path'

export const TECHNICAL_MODULES: LearningModule[] = [
  // ============================================
  // APPROFONDIMENTI TECNICI (10 moduli)
  // ============================================

  {
    id: 't.0-reading-papers',
    title: 'T.0 - Come leggere paper e documentazione',
    estimatedMinutes: 8,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE]'
      }
    ]
  },

  {
    id: 't.1-smart-contracts',
    title: 'T.1 - Smart Contracts',
    estimatedMinutes: 10,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE]'
      }
    ]
  },

  {
    id: 't.2-defi',
    title: 'T.2 - DeFi (Decentralized Finance)',
    estimatedMinutes: 12,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE]'
      }
    ]
  },

  {
    id: 't.3-nft',
    title: 'T.3 - NFT',
    estimatedMinutes: 8,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE]'
      }
    ]
  },

  {
    id: 't.4-dao',
    title: 'T.4 - DAO',
    estimatedMinutes: 8,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE]'
      }
    ]
  },

  {
    id: 't.5-privacy',
    title: 'T.5 - Privacy e Anonimato',
    estimatedMinutes: 10,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE]'
      }
    ]
  },

  {
    id: 't.6-scaling',
    title: 'T.6 - Scaling Solutions',
    estimatedMinutes: 10,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE]'
      }
    ]
  },

  {
    id: 't.7-regulation',
    title: 'T.7 - Regolamentazione Globale (MiCA + CBDC)',
    estimatedMinutes: 12,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE]'
      }
    ]
  },

  {
    id: 't.8-money-token-economics',
    title: 'T.8 - Money, Banking & Token Economics',
    estimatedMinutes: 12,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE]'
      }
    ]
  },

  {
    id: 't.9-security-threat-modeling',
    title: 'T.9 - Security & Threat Modeling',
    estimatedMinutes: 10,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE]'
      }
    ]
  }
]

export function getTechnicalModuleById(moduleId: string): LearningModule | undefined {
  return TECHNICAL_MODULES.find(m => m.id === moduleId)
}

export const TECHNICAL_MODULE_LIST = TECHNICAL_MODULES.map(m => ({
  id: m.id,
  title: m.title,
  estimatedMinutes: m.estimatedMinutes
}))
