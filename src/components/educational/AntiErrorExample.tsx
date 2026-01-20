/**
 * ANTI-ERROR GUIDANCE - Integration Example
 *
 * Esempio completo del sistema di prevenzione errori per interfacce educative
 * Dimostra l'integrazione con Focus Mode e Visual Noise Reduction
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AntiErrorProvider,
  BreathingSpace,
  CalmInterface,
  ErrorPreventionGuide,
  FocusModeProvider,
  FocusWrapper,
  RiskyActionGuard,
  SafePathHighlighter,
} from './index';
import { AntiErrorTester } from './AntiErrorGuidance';

// ============================================================================
// CRYPTO LEARNING SCENARIO
// ============================================================================

const CryptoLearningScenario: React.FC = () => {
  const [walletBalance, setWalletBalance] = useState(1000);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const handleSafeTransaction = () => {
    const amount = Number.parseFloat(transactionAmount);
    if (amount <= 10) {
      setWalletBalance(prev => prev - amount);
      setTransactionAmount('');
      setRecipientAddress('');
      // eslint-disable-next-line no-alert
      alert(`Transazione sicura completata: ${amount} USDT inviati`);
    }
  };

  const handleRiskyTransaction = () => {
    const amount = Number.parseFloat(transactionAmount);
    setWalletBalance(prev => prev - amount);
    setTransactionAmount('');
    setRecipientAddress('');
    // eslint-disable-next-line no-alert
    alert(`Transazione rischiosa completata: ${amount} USDT inviati`);
  };

  const handleDangerousAction = () => {
    setWalletBalance(0);
    // eslint-disable-next-line no-alert
    alert('ATTENZIONE: Tutti i fondi sono stati persi!');
  };

  return (
    <CalmInterface intensity="moderate" className="crypto-learning-scenario">
      <div className="scenario-container">
        <div className="scenario-header">
          <h2>Scenario: Prima Transazione Crypto</h2>
          <p>Impara a inviare crypto in sicurezza con guidance anti-errore</p>
          <div className="wallet-balance">
            Saldo Wallet: <strong>{walletBalance} USDT</strong>
          </div>
        </div>

        <BreathingSpace size="large" adaptive />

        {/* Step 1: Safe Path - Small Test Transaction */}
        <FocusWrapper elementId="safe-transaction" className="learning-step">
          <SafePathHighlighter
            elementId="test-transaction"
            pathType="recommended"
            visualCue="glow"
            intensity="moderate"
            message="Inizia sempre con una transazione di test piccola"
          >
            <div className="transaction-form safe-form">
              <h3>✅ Transazione di Test Sicura</h3>
              <p>Inizia con un importo piccolo per testare il processo</p>

              <div className="form-group">
                <label htmlFor="safe-amount">Importo (max 10 USDT):</label>
                <input
                  id="safe-amount"
                  type="number"
                  max="10"
                  value={transactionAmount}
                  onChange={e => setTransactionAmount(e.target.value)}
                  placeholder="5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="safe-address">Indirizzo destinatario:</label>
                <input
                  id="safe-address"
                  type="text"
                  value={recipientAddress}
                  onChange={e => setRecipientAddress(e.target.value)}
                  placeholder="0x742d35Cc6634C0532925a3b8D404fddF4f"
                />
              </div>

              <button
                type="button"
                className="btn btn-success"
                onClick={handleSafeTransaction}
                disabled={!transactionAmount || Number.parseFloat(transactionAmount) > 10}
              >
                Invia Transazione di Test
              </button>
            </div>
          </SafePathHighlighter>
        </FocusWrapper>

        <BreathingSpace size="medium" adaptive />

        {/* Step 2: Risky Action - Large Transaction */}
        <div className="learning-step">
          <RiskyActionGuard
            actionId="large-transaction"
            riskLevel="risky"
            warningMessage="Stai per inviare un importo significativo senza aver testato prima"
            consequences={[
              'Possibile perdita di fondi se l\'indirizzo è sbagliato',
              'Commissioni elevate per transazioni grandi',
              'Difficoltà nel recuperare fondi in caso di errore',
            ]}
            safeAlternatives={[
              'Inizia con una transazione di test da 1-5 USDT',
              'Verifica l\'indirizzo con il destinatario',
              'Controlla le commissioni di rete',
            ]}
            educationalTip="Le transazioni blockchain sono irreversibili. È sempre meglio testare con importi piccoli prima di inviare somme significative."
            onConfirm={handleRiskyTransaction}
            onCancel={() => {
              // eslint-disable-next-line no-alert
              alert('Saggia decisione! Prova prima con un importo piccolo.');
            }}
          >
            <div className="transaction-form risky-form">
              <h3>⚠️ Transazione Grande</h3>
              <p>Transazione di importo significativo - richiede attenzione</p>

              <div className="form-group">
                <label htmlFor="risky-amount">Importo:</label>
                <input
                  id="risky-amount"
                  type="number"
                  value={transactionAmount}
                  onChange={e => setTransactionAmount(e.target.value)}
                  placeholder="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="risky-address">Indirizzo destinatario:</label>
                <input
                  id="risky-address"
                  type="text"
                  value={recipientAddress}
                  onChange={e => setRecipientAddress(e.target.value)}
                  placeholder="0x742d35Cc6634C0532925a3b8D404fddF4f"
                />
              </div>

              <button
                type="button"
                className="btn btn-warning"
                disabled={!transactionAmount || Number.parseFloat(transactionAmount) <= 10}
              >
                Invia Transazione Grande
              </button>
            </div>
          </RiskyActionGuard>
        </div>

        <BreathingSpace size="medium" adaptive />

        {/* Step 3: Dangerous Action - Send All Funds */}
        <div className="learning-step">
          <RiskyActionGuard
            actionId="send-all-funds"
            riskLevel="dangerous"
            warningMessage="ATTENZIONE: Stai per inviare TUTTI i tuoi fondi!"
            consequences={[
              'Perdita completa di tutti i fondi nel wallet',
              'Impossibilità di recuperare i fondi se l\'indirizzo è sbagliato',
              'Nessun fondo rimanente per commissioni future',
              'Rischio di perdita permanente',
            ]}
            safeAlternatives={[
              'Invia solo l\'importo necessario',
              'Mantieni sempre una riserva per le commissioni',
              'Fai un backup del wallet prima di transazioni grandi',
              'Contatta il supporto per assistenza',
            ]}
            educationalTip="Non inviare mai tutti i tuoi fondi in una sola transazione. Mantieni sempre una riserva per commissioni e imprevisti. Le transazioni crypto sono irreversibili!"
            onConfirm={handleDangerousAction}
            onCancel={() => {
              // eslint-disable-next-line no-alert
              alert('Ottima scelta! Hai evitato un rischio molto alto.');
            }}
          >
            <div className="transaction-form dangerous-form">
              <h3>🚨 PERICOLO: Invia Tutti i Fondi</h3>
              <p className="danger-warning">
                Questa azione invierà TUTTI i tuoi fondi e non può essere annullata!
              </p>

              <div className="danger-stats">
                <div className="stat">
                  <span className="stat-label">Fondi da inviare:</span>
                  <span className="stat-value">{walletBalance} USDT</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Fondi rimanenti:</span>
                  <span className="stat-value danger">0 USDT</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-danger"
                disabled={walletBalance === 0}
              >
                🚨 INVIA TUTTI I FONDI
              </button>
            </div>
          </RiskyActionGuard>
        </div>

        <BreathingSpace size="large" adaptive />

        {/* Educational Guide */}
        <ErrorPreventionGuide context="trading" />
      </div>
    </CalmInterface>
  );
};

// ============================================================================
// MAIN EXAMPLE COMPONENT
// ============================================================================

const AntiErrorExample: React.FC = () => {
  const [showTester, setShowTester] = useState(false);

  return (
    <FocusModeProvider>
      <AntiErrorProvider>
        <div className="anti-error-example">
          <div className="example-header">
            <h1>Anti-Error Guidance System 2026</h1>
            <p>
              Sistema di prevenzione errori con safe path highlighting,
              risk warnings e confirmation patterns per interfacce educative.
            </p>

            <div className="example-controls">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowTester(!showTester)}
              >
                {showTester ? 'Hide' : 'Show'} Testing Tools
              </button>
            </div>
          </div>

          <BreathingSpace size="large" />

          {/* Main Scenario */}
          <CryptoLearningScenario />

          <BreathingSpace size="large" />

          {/* Testing Tools */}
          {showTester && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="testing-section"
            >
              <AntiErrorTester />
            </motion.div>
          )}
        </div>
      </AntiErrorProvider>
    </FocusModeProvider>
  );
};

export default AntiErrorExample;