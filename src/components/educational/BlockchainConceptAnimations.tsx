/**
 * BLOCKCHAIN CONCEPT ANIMATIONS - Educational Content 2026
 *
 * Animazioni specifiche per spiegare concetti blockchain e crypto
 * Implementa progressive reveal e process flow per educational UX
 */

import React from 'react';

import type { AnimationType, ConceptAnimation, ConceptComplexity } from './ExplanatoryAnimations';

// ============================================================================
// BLOCKCHAIN CONCEPT ANIMATIONS
// ============================================================================

export const BlockchainConceptAnimations = {
  // Animation 1: What is a Block
  blockStructure: {
    id: 'block-structure',
    title: 'Anatomia di un Blocco',
    concept: 'blockchain-block',
    complexity: 'moderate' as ConceptComplexity,
    type: 'progressive-reveal' as AnimationType,
    educationalGoal: 'Comprendere la struttura interna di un blocco blockchain',
    totalDuration: 8000,
    steps: [
      {
        id: 'block-container',
        title: 'Il Contenitore',
        description: 'Un blocco è come una scatola digitale che contiene informazioni',
        duration: 1500,
        visual: (
          <div className="block-container">
            <div className="block-outline">Blocco #1234</div>
          </div>
        ),
      },
      {
        id: 'block-header',
        title: 'Header del Blocco',
        description: 'L\'header contiene metadati: timestamp, hash precedente, merkle root',
        duration: 2000,
        delay: 500,
        visual: (
          <div className="block-header">
            <div className="header-item">📅 Timestamp: 2026-01-20</div>
            <div className="header-item">🔗 Hash Precedente: 0x1a2b3c...</div>
            <div className="header-item">🌳 Merkle Root: 0x4d5e6f...</div>
          </div>
        ),
      },
      {
        id: 'block-transactions',
        title: 'Transazioni',
        description: 'Il corpo del blocco contiene le transazioni verificate',
        duration: 2000,
        delay: 300,
        visual: (
          <div className="block-transactions">
            <div className="transaction">💸 Alice → Bob: 0.5 BTC</div>
            <div className="transaction">💸 Charlie → Dave: 1.2 BTC</div>
            <div className="transaction">💸 Eve → Frank: 0.8 BTC</div>
          </div>
        ),
      },
      {
        id: 'block-hash',
        title: 'Hash del Blocco',
        description: 'L\'hash unico identifica questo blocco e garantisce l\'integrità',
        duration: 2000,
        delay: 500,
        visual: (
          <div className="block-hash">
            <div className="hash-calculation">
              <span>SHA-256(Header + Transazioni)</span>
              <div className="arrow">↓</div>
              <div className="final-hash">0x7g8h9i...</div>
            </div>
          </div>
        ),
      },
    ],
  },

  // Animation 2: How Blocks Connect
  blockchainConnection: {
    id: 'blockchain-connection',
    title: 'Come si Collegano i Blocchi',
    concept: 'blockchain-chain',
    complexity: 'complex' as ConceptComplexity,
    type: 'process-flow' as AnimationType,
    educationalGoal: 'Visualizzare come i blocchi formano una catena immutabile',
    totalDuration: 10000,
    steps: [
      {
        id: 'genesis-block',
        title: 'Blocco Genesis',
        description: 'Il primo blocco della catena, senza predecessore',
        duration: 1500,
        visual: (
          <div className="genesis-block">
            <div className="genesis-block block">
              <div className="block-number">Blocco #0</div>
              <div className="prev-hash">Prev: 0x000...</div>
              <div className="block-hash">Hash: 0xabc...</div>
            </div>
          </div>
        ),
      },
      {
        id: 'second-block',
        title: 'Secondo Blocco',
        description: 'Il nuovo blocco referenzia l\'hash del blocco precedente',
        duration: 2000,
        delay: 800,
        visual: (
          <div className="second-block">
            <div className="block">
              <div className="block-number">Blocco #1</div>
              <div className="prev-hash highlight">Prev: 0xabc...</div>
              <div className="block-hash">Hash: 0xdef...</div>
            </div>
            <div className="connection-arrow">→</div>
          </div>
        ),
      },
      {
        id: 'chain-formation',
        title: 'Formazione della Catena',
        description: 'Ogni nuovo blocco si collega al precedente, formando una catena',
        duration: 3000,
        delay: 600,
        visual: (
          <div className="chain-formation">
            <div className="block">Blocco #0</div>
            <div className="chain-link">🔗</div>
            <div className="block">Blocco #1</div>
            <div className="chain-link">🔗</div>
            <div className="block">Blocco #2</div>
            <div className="chain-link">🔗</div>
            <div className="new-block block">Blocco #3</div>
          </div>
        ),
      },
      {
        id: 'immutability',
        title: 'Immutabilità',
        description: 'Modificare un blocco romperebbe la catena, rendendo evidente la manomissione',
        duration: 3000,
        delay: 500,
        interactionRequired: true,
        visual: (
          <div className="immutability-demo">
            <div className="original-chain">
              <div className="block">Blocco #1</div>
              <div className="chain-link valid">✓</div>
              <div className="block">Blocco #2</div>
              <div className="chain-link valid">✓</div>
              <div className="block">Blocco #3</div>
            </div>
            <div className="tampered-chain">
              <div className="tampered-block block">Blocco #1*</div>
              <div className="chain-link broken">✗</div>
              <div className="block">Blocco #2</div>
              <div className="chain-link broken">✗</div>
              <div className="block">Blocco #3</div>
            </div>
          </div>
        ),
      },
    ],
  },

  // Animation 3: Transaction Process
  transactionFlow: {
    id: 'transaction-flow',
    title: 'Come Funziona una Transazione',
    concept: 'crypto-transaction',
    complexity: 'complex' as ConceptComplexity,
    type: 'process-flow' as AnimationType,
    educationalGoal: 'Spiegare il processo completo di una transazione crypto',
    totalDuration: 12000,
    steps: [
      {
        id: 'transaction-creation',
        title: 'Creazione Transazione',
        description: 'Alice vuole inviare 1 BTC a Bob',
        duration: 1500,
        visual: (
          <div className="transaction-creation">
            <div className="user alice-user">👩 Alice</div>
            <div className="transaction-intent">
              <span>Invia 1 BTC</span>
              <div className="arrow">→</div>
            </div>
            <div className="user bob-user">👨 Bob</div>
          </div>
        ),
      },
      {
        id: 'digital-signature',
        title: 'Firma Digitale',
        description: 'Alice firma la transazione con la sua chiave privata',
        duration: 2000,
        delay: 500,
        visual: (
          <div className="digital-signature">
            <div className="private-key">🔐 Chiave Privata Alice</div>
            <div className="signing-process">
              <span>Firma Digitale</span>
              <div className="signature">📝 Signature: 0x9a8b7c...</div>
            </div>
          </div>
        ),
      },
      {
        id: 'broadcast-network',
        title: 'Broadcast alla Rete',
        description: 'La transazione viene inviata alla rete peer-to-peer',
        duration: 2500,
        delay: 400,
        visual: (
          <div className="network-broadcast">
            <div className="transaction-packet">📦 Transazione</div>
            <div className="network-nodes">
              <div className="node">🖥️</div>
              <div className="node">🖥️</div>
              <div className="node">🖥️</div>
              <div className="node">🖥️</div>
            </div>
            <div className="broadcast-waves">📡</div>
          </div>
        ),
      },
      {
        id: 'verification',
        title: 'Verifica',
        description: 'I nodi verificano la firma e i fondi disponibili',
        duration: 2500,
        delay: 600,
        visual: (
          <div className="verification-process">
            <div className="verification-checks">
              <div className="check">✅ Firma valida</div>
              <div className="check">✅ Fondi sufficienti</div>
              <div className="check">✅ Formato corretto</div>
            </div>
          </div>
        ),
      },
      {
        id: 'mempool',
        title: 'Mempool',
        description: 'La transazione entra nella mempool in attesa di essere inclusa in un blocco',
        duration: 2000,
        delay: 300,
        visual: (
          <div className="mempool">
            <div className="mempool-container">
              <h4>Mempool</h4>
              <div className="pending-transactions">
                <div className="tx">TX1</div>
                <div className="tx highlight">TX Alice→Bob</div>
                <div className="tx">TX3</div>
                <div className="tx">TX4</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'mining-confirmation',
        title: 'Mining e Conferma',
        description: 'Un miner include la transazione in un nuovo blocco',
        duration: 3000,
        delay: 500,
        visual: (
          <div className="mining-confirmation">
            <div className="miner">⛏️ Miner</div>
            <div className="new-block">
              <h4>Nuovo Blocco</h4>
              <div className="block-transactions">
                <div className="tx confirmed">✅ Alice→Bob: 1 BTC</div>
                <div className="tx">TX2</div>
                <div className="tx">TX3</div>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
} as const satisfies Record<string, ConceptAnimation>;

export default BlockchainConceptAnimations;
