/**
 * Yield Section - Learning Path Modules
 * 
 * Percorso dinamico per "Ottenere Rendite"
 * ⚠️ FRAME: "Rendimento = rischio di perdita totale non immediatamente visibile"
 */

import type { LearningModule } from './own-learning-path'

export const YIELD_LEARNING_MODULES: LearningModule[] = [
  // ============================================
  // FASE 2: YIELD - RENDITE (7 moduli)
  // ============================================

  {
    id: '2.1-yield-sources',
    title: '2.1 - Da dove nasce una rendita crypto',
    estimatedMinutes: 6,
    sections: [
      {
        type: 'hook',
        content: '[CONTENUTO DA SVILUPPARE] Le fonti di rendimento'
      },
      {
        type: 'heading',
        title: 'Staking, Lending, Liquidity Providing'
      },
      {
        type: 'text',
        content: '[CONTENUTO DA SVILUPPARE]'
      },
      {
        type: 'takeaway',
        content: '[CONTENUTO DA SVILUPPARE] Capisco da dove nasce il rendimento crypto'
      }
    ]
  },

  {
    id: '2.2-staking',
    title: '2.2 - Staking - Meccanica e rischi',
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
    id: '2.3-lending',
    title: '2.3 - Lending protocols',
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
    id: '2.4-liquidity-providing',
    title: '2.4 - Liquidity providing e AMM',
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
    id: '2.5-counterparty-risk',
    title: '2.5 - Rischio di controparte',
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
    id: '2.6-failure-conditions',
    title: '2.6 - Condizioni di fallimento',
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
    id: '2.7-sustainable-yield',
    title: '2.7 - Yield sostenibile vs insostenibile',
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
  }
]

export function getYieldModuleById(moduleId: string): LearningModule | undefined {
  return YIELD_LEARNING_MODULES.find(m => m.id === moduleId)
}

export const YIELD_MODULE_LIST = YIELD_LEARNING_MODULES.map(m => ({
  id: m.id,
  title: m.title,
  estimatedMinutes: m.estimatedMinutes
}))
