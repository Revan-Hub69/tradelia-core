/**
 * EDUCATIONAL UX PATTERNS - Integration Example
 *
 * Esempio completo di integrazione dei pattern UX educativi 2026
 * Dimostra l'uso combinato di:
 * - Focus Mode System per riduzione distrazioni
 * - Visual Noise Reduction per concentrazione
 * - Progressive Disclosure per gerarchia informativa
 * - Context-aware adaptation
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalmInterface,
  EssentialHighlighter,
  FocusControl,
  FocusModeProvider,
  FocusWrapper,
  NoiseReductionTester,
  NoiseReductionWrapper,
  ProgressiveDisclosure,
  useFocusMode,
  type VisualElement,
} from './index';
import { BreathingSpace } from './VisualNoiseReduction';

// ============================================================================
// EDUCATIONAL LESSON COMPONENT
// ============================================================================

const EducationalLesson: React.FC = () => {
  const { focusState, activateFocus } = useFocusMode();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Visual elements configuration
  const lessonElements: Record<string, VisualElement> = {
    'lesson-content': { id: 'lesson-content', type: 'essential', priority: 'critical', context: ['learning'] },
    'progress-bar': { id: 'progress-bar', type: 'functional', priority: 'high', context: ['learning'] },
    'lesson-notes': { id: 'lesson-notes', type: 'functional', priority: 'medium', context: ['learning'] },
    'related-topics': { id: 'related-topics', type: 'functional', priority: 'low', context: ['exploring'] },
    'decorative-bg': { id: 'decorative-bg', type: 'decoration', priority: 'low', context: [] },
    'social-share': { id: 'social-share', type: 'functional', priority: 'low', context: ['exploring'] },
  };

  const handleStartLearning = () => {
    activateFocus('moderate', 'learning');
  };

  return (
    <CalmInterface intensity="moderate" className="educational-lesson">
      <div className="lesson-container">
        {/* Header with Progress */}
        <FocusWrapper elementId="progress-bar" className="lesson-header">
          <EssentialHighlighter priority="high" className="progress-section">
            <div className="progress-info">
              <h2>Crypto Fundamentals: Blockchain Basics</h2>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <span className="progress-text">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
          </EssentialHighlighter>
        </FocusWrapper>

        <BreathingSpace size="medium" adaptive />

        {/* Main Lesson Content */}
        <FocusWrapper elementId="lesson-content">
          <EssentialHighlighter priority="critical" className="lesson-main">
            <div className="lesson-content">
              <h3>What is a Blockchain?</h3>
              <p>
                A blockchain is a distributed ledger technology that maintains a continuously
                growing list of records, called blocks, which are linked and secured using cryptography.
              </p>

              <div className="concept-visualization">
                <div className="blockchain-blocks">
                  {[1, 2, 3, 4].map(block => (
                    <motion.div
                      key={block}
                      className="block"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: block * 0.2 }}
                    >
                      Block {block}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="key-points">
                <h4>Key Characteristics:</h4>
                <ul>
                  <li>Decentralized and distributed</li>
                  <li>Immutable and transparent</li>
                  <li>Secured by cryptography</li>
                  <li>Consensus-based validation</li>
                </ul>
              </div>
            </div>
          </EssentialHighlighter>
        </FocusWrapper>

        <BreathingSpace size="large" adaptive />

        {/* Progressive Disclosure Sections */}
        <div className="lesson-sections">
          <ProgressiveDisclosure
            title="Detailed Technical Explanation"
            level="secondary"
            className="technical-details"
          >
            <NoiseReductionWrapper
              element={lessonElements['lesson-notes']!}
              className="technical-content"
            >
              <div className="technical-explanation">
                <h4>How Blockchain Works</h4>
                <p>
                  Each block contains a cryptographic hash of the previous block,
                  a timestamp, and transaction data. This creates an immutable chain
                  where altering any block would require changing all subsequent blocks.
                </p>
                <div className="code-example">
                  <pre>
                    {`Block {
  previousHash: "0x1a2b3c...",
  timestamp: 1640995200,
  data: [...transactions],
  hash: "0x4d5e6f..."
}`}
                  </pre>
                </div>
              </div>
            </NoiseReductionWrapper>
          </ProgressiveDisclosure>

          <ProgressiveDisclosure
            title="Related Topics"
            level="tertiary"
            className="related-content"
          >
            <NoiseReductionWrapper
              element={lessonElements['related-topics']!}
              fallback={<div className="simple-links">Explore: Mining, Consensus, Smart Contracts</div>}
            >
              <div className="related-topics">
                <div className="topic-grid">
                  <div className="topic-card">
                    <h5>Proof of Work</h5>
                    <p>Learn about Bitcoin's consensus mechanism</p>
                  </div>
                  <div className="topic-card">
                    <h5>Smart Contracts</h5>
                    <p>Programmable blockchain applications</p>
                  </div>
                  <div className="topic-card">
                    <h5>DeFi Basics</h5>
                    <p>Decentralized finance fundamentals</p>
                  </div>
                </div>
              </div>
            </NoiseReductionWrapper>
          </ProgressiveDisclosure>
        </div>

        <BreathingSpace size="large" adaptive />

        {/* Action Buttons */}
        <FocusWrapper elementId="lesson-actions" className="lesson-actions">
          <EssentialHighlighter priority="high" className="action-buttons">
            <div className="button-group">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Previous
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                >
                  Next: Hash Functions
                </button>
              ) : (
                <button type="button" className="btn btn-success">
                  Complete Lesson
                </button>
              )}
            </div>
          </EssentialHighlighter>
        </FocusWrapper>

        {/* Decorative Elements (reduced in focus mode) */}
        <NoiseReductionWrapper
          element={lessonElements['decorative-bg']!}
          className="decorative-elements"
        >
          <div className="background-pattern" />
          <div className="floating-icons">
            <div className="icon">🔗</div>
            <div className="icon">⛓️</div>
            <div className="icon">🔐</div>
          </div>
        </NoiseReductionWrapper>

        {/* Social Sharing (hidden in deep focus) */}
        <NoiseReductionWrapper
          element={lessonElements['social-share']!}
          fallback={null}
          className="social-section"
        >
          <div className="social-sharing">
            <h4>Share Your Progress</h4>
            <div className="social-buttons">
              <button type="button" className="social-btn twitter">Twitter</button>
              <button type="button" className="social-btn linkedin">LinkedIn</button>
              <button type="button" className="social-btn copy">Copy Link</button>
            </div>
          </div>
        </NoiseReductionWrapper>
      </div>

      {/* Focus Mode Quick Start */}
      {!focusState.isActive && (
        <motion.div
          className="focus-quick-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="quick-start-content">
            <h4>Ready to focus?</h4>
            <p>Activate focus mode to reduce distractions and improve concentration.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleStartLearning}
            >
              Start Learning Mode
            </button>
          </div>
        </motion.div>
      )}
    </CalmInterface>
  );
};

// ============================================================================
// MAIN EXAMPLE COMPONENT
// ============================================================================

const EducationalUXExample: React.FC = () => {
  const [showTester, setShowTester] = useState(false);

  return (
    <FocusModeProvider>
      <div className="educational-ux-example">
        <div className="example-header">
          <h1>Educational UX Patterns 2026</h1>
          <p>
            Demonstration of cognitive load reduction, focus modes, and progressive disclosure
            for educational interfaces.
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

        {/* Focus Control Panel */}
        <div className="control-panel">
          <FocusControl className="focus-control-demo" />
        </div>

        <BreathingSpace size="large" />

        {/* Main Educational Content */}
        <EducationalLesson />

        <BreathingSpace size="large" />

        {/* Testing Tools */}
        {showTester && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="testing-section"
          >
            <NoiseReductionTester />
          </motion.div>
        )}
      </div>
    </FocusModeProvider>
  );
};

export default EducationalUXExample;