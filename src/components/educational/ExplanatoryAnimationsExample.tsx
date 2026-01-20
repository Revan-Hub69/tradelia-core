/**
 * EXPLANATORY ANIMATIONS EXAMPLE - Integration Demo
 *
 * Esempio di integrazione delle animazioni educative nel sistema Tradelia
 * Dimostra come utilizzare le animazioni per spiegare concetti blockchain
 */

import React from 'react';
import { ExplanatoryAnimationsShowcase } from './ExplanatoryAnimationsShowcase';

export const ExplanatoryAnimationsExample: React.FC = () => {
  return (
    <div className="explanatory-animations-example">
      <div className="example-header">
        <h1>Sistema di Animazioni Educative</h1>
        <p className="example-description">
          Animazioni che spiegano concetti blockchain attraverso progressive reveal
          e visualizzazioni interattive. Implementa i principi di educational UX 2026.
        </p>
      </div>

      <div className="example-features">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🎬 Progressive Reveal</h3>
            <p>
              Animazioni che costruiscono la comprensione step-by-step,
              rispettando il cognitive load dell'utente.
            </p>
          </div>
          <div className="feature-card">
            <h3>🧠 Adaptive Speed</h3>
            <p>
              Velocità che si adatta alla complessità del concetto
              e al livello di focus dell'utente.
            </p>
          </div>
          <div className="feature-card">
            <h3>🎯 Educational Goals</h3>
            <p>
              Ogni animazione ha un obiettivo educativo specifico
              e misurabile per l'apprendimento.
            </p>
          </div>
          <div className="feature-card">
            <h3>⚡ Interactive Control</h3>
            <p>
              L'utente può controllare il ritmo, mettere in pausa,
              e rivedere i passaggi complessi.
            </p>
          </div>
        </div>
      </div>

      <div className="example-showcase">
        <ExplanatoryAnimationsShowcase />
      </div>

      <div className="example-implementation">
        <h2>Implementazione nel Sistema</h2>
        <div className="implementation-notes">
          <div className="note">
            <h4>🎨 Design System Integration</h4>
            <p>
              Le animazioni utilizzano i motion tokens Tradelia per mantenere
              coerenza con il resto dell'interfaccia.
            </p>
          </div>
          <div className="note">
            <h4>📱 Responsive & Accessible</h4>
            <p>
              Supporto completo per prefers-reduced-motion e adattamento
              automatico per dispositivi mobili.
            </p>
          </div>
          <div className="note">
            <h4>🔧 Developer Experience</h4>
            <p>
              API semplice per creare nuove animazioni educative
              con TypeScript completo e testing utilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanatoryAnimationsExample;