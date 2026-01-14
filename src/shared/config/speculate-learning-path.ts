/**
 * Speculate Section - Learning Path Modules
 * 
 * Percorso dinamico per "Speculare / Trading Attivo"
 */

import type { LearningModule } from './own-learning-path'

export const SPECULATE_LEARNING_MODULES: LearningModule[] = [
  // ============================================
  // FASE 4: SPECULATE - TRADING (7 moduli)
  // ============================================

  {
    id: '4.1-why-most-lose',
    title: '4.1 - Perché la maggioranza perde',
    estimatedMinutes: 5,
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
    id: '4.2-required-skills',
    title: '4.2 - Competenze richieste',
    estimatedMinutes: 6,
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
    id: '4.3-leverage-liquidation',
    title: '4.3 - Leverage e liquidation',
    estimatedMinutes: 7,
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
    id: '4.4-mev-frontrunning',
    title: '4.4 - MEV e front-running',
    estimatedMinutes: 7,
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
    id: '4.5-common-errors',
    title: '4.5 - Errori ricorrenti',
    estimatedMinutes: 5,
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
    id: '4.6-stress-psychology',
    title: '4.6 - Stress e rischio psicologico',
    estimatedMinutes: 6,
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
    id: '4.7-alternatives',
    title: '4.7 - Alternative al trading',
    estimatedMinutes: 5,
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

export function getSpeculateModuleById(moduleId: string): LearningModule | undefined {
  return SPECULATE_LEARNING_MODULES.find(m => m.id === moduleId)
}

export const SPECULATE_MODULE_LIST = SPECULATE_LEARNING_MODULES.map(m => ({
  id: m.id,
  title: m.title,
  estimatedMinutes: m.estimatedMinutes
}))
