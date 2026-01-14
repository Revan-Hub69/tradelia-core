/**
 * Invest Section - Learning Path Modules
 * 
 * Percorso dinamico per "Investire nel Tempo"
 */

import type { LearningModule } from './own-learning-path'

export const INVEST_LEARNING_MODULES: LearningModule[] = [
  // ============================================
  // FASE 3: INVEST - INVESTIRE (7 moduli)
  // ============================================

  {
    id: '3.1-invest-vs-buy',
    title: '3.1 - Investire vs comprare',
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
    id: '3.2-taxation',
    title: '3.2 - Tassazione e aspetti legali',
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
    id: '3.3-dca',
    title: '3.3 - Dollar Cost Averaging (DCA)',
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
    id: '3.4-time-horizon',
    title: '3.4 - Orizzonte temporale realistico',
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
    id: '3.5-volatility',
    title: '3.5 - Volatilità storica',
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
    id: '3.6-behavioral-errors',
    title: '3.6 - Errori comportamentali',
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
    id: '3.7-diversification',
    title: '3.7 - Diversificazione',
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

export function getInvestModuleById(moduleId: string): LearningModule | undefined {
  return INVEST_LEARNING_MODULES.find(m => m.id === moduleId)
}

export const INVEST_MODULE_LIST = INVEST_LEARNING_MODULES.map(m => ({
  id: m.id,
  title: m.title,
  estimatedMinutes: m.estimatedMinutes
}))
