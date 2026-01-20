/**
 * EXPLANATORY ANIMATIONS SHOWCASE - Educational UX Demo
 *
 * Showcase component per dimostrare le animazioni educative
 * Permette di selezionare e visualizzare diverse animazioni blockchain
 */

import React, { useState } from 'react';
import { ConceptAnimationPlayer } from './ExplanatoryAnimations';
import { BlockchainConceptAnimations } from './BlockchainConceptAnimations';

export const ExplanatoryAnimationsShowcase: React.FC = () => {
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);

  const animations = Object.values(BlockchainConceptAnimations);

  return (
    <div className="explanatory-animations-showcase">
      <div className="showcase-header">
        <h2>Animazioni Educative Crypto</h2>
        <p>Animazioni che spiegano concetti complessi attraverso visualizzazioni progressive</p>
      </div>

      {!selectedAnimation
        ? (
          <div className="animation-grid">
            {animations.map(animation => (
              <div key={animation.id} className="animation-card">
                <div className="card-header">
                  <h3>{animation.title}</h3>
                  <span className={`complexity-badge ${animation.complexity}`}>
                    {animation.complexity}
                  </span>
                </div>
                <p className="card-description">{animation.educationalGoal}</p>
                <div className="card-meta">
                  <span>
                    🎬
                    {' '}
                    {animation.type}
                  </span>
                  <span>
                    ⏱️
                    {' '}
                    {Math.round(animation.totalDuration / 1000)}
                    s
                  </span>
                  <span>
                    📚
                    {' '}
                    {animation.steps.length}
                    {' '}
                    steps
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSelectedAnimation(animation.id)}
                >
                  Guarda Animazione
                </button>
              </div>
            ))}
          </div>
        )
        : (
          <div className="animation-player-container">
            <button
              type="button"
              className="btn btn-outline back-button"
              onClick={() => setSelectedAnimation(null)}
            >
              ← Torna alla Lista
            </button>

            <ConceptAnimationPlayer
              animation={animations.find(a => a.id === selectedAnimation)!}
              config={{
                showControls: true,
                autoPlay: false,
                respectCognitiveLoad: true,
              }}
              onComplete={() => {
                setTimeout(() => setSelectedAnimation(null), 2000);
              }}
            />
          </div>
        )}
    </div>
  );
};

export default ExplanatoryAnimationsShowcase;