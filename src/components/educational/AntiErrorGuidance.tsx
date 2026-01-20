/**
 * ANTI-ERROR GUIDANCE SYSTEM - Educational UX 2026
 * 
 * Sistema di prevenzione errori basato su ricerca 2026:
 * - Safe path highlighting con visual cues
 * - Risky action warnings con confirmation patterns
 * - Progressive error prevention (prevent → warn → confirm)
 * - Context-aware guidance per educational interfaces
 * 
 * Basato su:
 * - Loom Design System error patterns
 * - Apple HIG confirmation dialogs
 * - Microsoft Fluent safety patterns
 * - Educational psychology error prevention
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusMode } from './FocusMode';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ActionRiskLevel = 'safe' | 'caution' | 'risky' | 'dangerous';
export type ConfirmationType = 'none' | 'simple' | 'double' | 'typed';
export type GuidanceIntensity = 'subtle' | 'moderate' | 'strong' | 'critical';

export interface ActionGuidance {
  id: string;
  riskLevel: ActionRiskLevel;
  confirmationType: ConfirmationType;
  message: string;
  safePath?: string;
  alternativeAction?: string;
  educationalContext?: string;
  preventionStrategy: 'highlight' | 'warn' | 'block' | 'guide';
}

export interface SafePathConfig {
  elementId: string;
  pathType: 'recommended' | 'safe' | 'optimal';
  visualCue: 'glow' | 'border' | 'background' | 'pulse';
  intensity: GuidanceIntensity;
  message?: string;
}

export interface RiskyActionConfig {
  actionId: string;
  riskLevel: ActionRiskLevel;
  confirmationRequired: boolean;
  warningMessage: string;
  consequences?: string[];
  safeAlternatives?: string[];
  educationalTip?: string;
}

// ============================================================================
// ANTI-ERROR CONTEXT
// ============================================================================

interface AntiErrorContextType {
  registerSafePath: (config: SafePathConfig) => void;
  registerRiskyAction: (config: RiskyActionConfig) => void;
  highlightSafePath: (elementId: string, intensity?: GuidanceIntensity) => void;
  showRiskWarning: (actionId: string) => Promise<boolean>;
  getActionGuidance: (actionId: string) => ActionGuidance | null;
  isPathSafe: (elementId: string) => boolean;
  preventError: (actionId: string, context?: string) => boolean;
}

const AntiErrorContext = createContext<AntiErrorContextType | null>(null);

// ============================================================================
// ANTI-ERROR PROVIDER
// ============================================================================

export const AntiErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { focusState } = useFocusMode();
  const [safePaths, setSafePaths] = useState<Map<string, SafePathConfig>>(new Map());
  const [riskyActions, setRiskyActions] = useState<Map<string, RiskyActionConfig>>(new Map());
  const [activeGuidance, setActiveGuidance] = useState<Map<string, ActionGuidance>>(new Map());
  const [highlightedPaths, setHighlightedPaths] = useState<Set<string>>(new Set());

  // Register safe path
  const registerSafePath = useCallback((config: SafePathConfig) => {
    setSafePaths(prev => new Map(prev.set(config.elementId, config)));
  }, []);

  // Register risky action
  const registerRiskyAction = useCallback((config: RiskyActionConfig) => {
    setRiskyActions(prev => new Map(prev.set(config.actionId, config)));
  }, []);

  // Highlight safe path
  const highlightSafePath = useCallback((elementId: string, intensity: GuidanceIntensity = 'moderate') => {
    const pathConfig = safePaths.get(elementId);
    if (!pathConfig) return;

    setHighlightedPaths(prev => new Set(prev.add(elementId)));
    
    // Apply CSS highlighting
    const element = document.querySelector(`[data-safe-path="${elementId}"]`);
    if (element) {
      element.classList.add('safe-path-highlighted');
      element.setAttribute('data-guidance-intensity', intensity);
    }

    // Auto-remove highlight after delay
    setTimeout(() => {
      setHighlightedPaths(prev => {
        const newSet = new Set(prev);
        newSet.delete(elementId);
        return newSet;
      });
      
      if (element) {
        element.classList.remove('safe-path-highlighted');
        element.removeAttribute('data-guidance-intensity');
      }
    }, 5000);
  }, [safePaths]);

  // Show risk warning
  const showRiskWarning = useCallback(async (actionId: string): Promise<boolean> => {
    const riskConfig = riskyActions.get(actionId);
    if (!riskConfig) return true;

    return new Promise((resolve) => {
      const guidance: ActionGuidance = {
        id: actionId,
        riskLevel: riskConfig.riskLevel,
        confirmationType: riskConfig.confirmationRequired ? 
          (riskConfig.riskLevel === 'dangerous' ? 'double' : 'simple') : 'none',
        message: riskConfig.warningMessage,
        safePath: riskConfig.safeAlternatives?.[0],
        educationalContext: riskConfig.educationalTip,
        preventionStrategy: riskConfig.riskLevel === 'dangerous' ? 'block' : 
                           riskConfig.riskLevel === 'risky' ? 'warn' : 'guide',
      };

      setActiveGuidance(prev => new Map(prev.set(actionId, guidance)));
      
      // Auto-resolve after timeout for non-critical actions
      if (riskConfig.riskLevel === 'safe' || riskConfig.riskLevel === 'caution') {
        setTimeout(() => resolve(true), 100);
      }
    });
  }, [riskyActions]);

  // Get action guidance
  const getActionGuidance = useCallback((actionId: string): ActionGuidance | null => {
    return activeGuidance.get(actionId) || null;
  }, [activeGuidance]);

  // Check if path is safe
  const isPathSafe = useCallback((elementId: string): boolean => {
    const pathConfig = safePaths.get(elementId);
    return pathConfig?.pathType === 'safe' || pathConfig?.pathType === 'recommended';
  }, [safePaths]);

  // Prevent error
  const preventError = useCallback((actionId: string, context?: string): boolean => {
    const riskConfig = riskyActions.get(actionId);
    if (!riskConfig) return true;

    // In focus mode, be more protective
    if (focusState.isActive && focusState.level === 'immersive') {
      if (riskConfig.riskLevel === 'risky' || riskConfig.riskLevel === 'dangerous') {
        return false;
      }
    }

    // Educational context - always guide
    if (context === 'learning' && riskConfig.riskLevel !== 'safe') {
      highlightSafePath(riskConfig.safeAlternatives?.[0] || '', 'strong');
      return false;
    }

    return riskConfig.riskLevel === 'safe';
  }, [riskyActions, focusState, highlightSafePath]);

  // Auto-highlight safe paths in focus mode
  useEffect(() => {
    if (focusState.isActive && focusState.context === 'learning') {
      safePaths.forEach((config, elementId) => {
        if (config.pathType === 'recommended') {
          highlightSafePath(elementId, 'subtle');
        }
      });
    }
  }, [focusState.isActive, focusState.context, safePaths, highlightSafePath]);

  const contextValue: AntiErrorContextType = {
    registerSafePath,
    registerRiskyAction,
    highlightSafePath,
    showRiskWarning,
    getActionGuidance,
    isPathSafe,
    preventError,
  };

  return (
    <AntiErrorContext.Provider value={contextValue}>
      {children}
    </AntiErrorContext.Provider>
  );
};

// ============================================================================
// ANTI-ERROR HOOK
// ============================================================================

export const useAntiError = () => {
  const context = useContext(AntiErrorContext);
  if (!context) {
    throw new Error('useAntiError must be used within an AntiErrorProvider');
  }
  return context;
};

// ============================================================================
// SAFE PATH HIGHLIGHTER COMPONENT
// ============================================================================

interface SafePathHighlighterProps {
  elementId: string;
  pathType?: 'recommended' | 'safe' | 'optimal';
  visualCue?: 'glow' | 'border' | 'background' | 'pulse';
  intensity?: GuidanceIntensity;
  message?: string;
  children: React.ReactNode;
  className?: string;
}

export const SafePathHighlighter: React.FC<SafePathHighlighterProps> = ({
  elementId,
  pathType = 'safe',
  visualCue = 'glow',
  intensity = 'moderate',
  message,
  children,
  className = '',
}) => {
  const { registerSafePath } = useAntiError();
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    registerSafePath({
      elementId,
      pathType,
      visualCue,
      intensity,
      message,
    });
  }, [elementId, pathType, visualCue, intensity, message, registerSafePath]);

  useEffect(() => {
    const element = document.querySelector(`[data-safe-path="${elementId}"]`);
    if (!element) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const hasHighlight = (mutation.target as Element).classList.contains('safe-path-highlighted');
          setIsHighlighted(hasHighlight);
        }
      });
    });

    observer.observe(element, { attributes: true });
    return () => observer.disconnect();
  }, [elementId]);

  const getGlowIntensity = () => {
    switch (intensity) {
      case 'subtle': return 0.3;
      case 'moderate': return 0.5;
      case 'strong': return 0.7;
      case 'critical': return 1;
      default: return 0.5;
    }
  };

  const getVisualStyles = () => {
    if (!isHighlighted) return {};

    const glowIntensity = getGlowIntensity();
    
    switch (visualCue) {
      case 'glow':
        return {
          boxShadow: `0 0 ${20 * glowIntensity}px rgba(34, 197, 94, ${0.4 * glowIntensity})`,
          borderColor: `rgba(34, 197, 94, ${0.6 * glowIntensity})`,
        };
      case 'border':
        return {
          borderColor: `rgba(34, 197, 94, ${0.8 * glowIntensity})`,
          borderWidth: `${1 + glowIntensity}px`,
        };
      case 'background':
        return {
          backgroundColor: `rgba(34, 197, 94, ${0.1 * glowIntensity})`,
        };
      case 'pulse':
        return {
          animation: `safe-path-pulse ${2 / glowIntensity}s infinite`,
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={`safe-path-highlighter ${className}`}
      data-safe-path={elementId}
      data-path-type={pathType}
      data-visual-cue={visualCue}
      animate={getVisualStyles()}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
      
      {isHighlighted && message && (
        <motion.div
          className="safe-path-tooltip"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="tooltip-content">
            <div className="tooltip-icon">✓</div>
            <span className="tooltip-text">{message}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================================================
// RISKY ACTION GUARD COMPONENT
// ============================================================================

interface RiskyActionGuardProps {
  actionId: string;
  riskLevel: ActionRiskLevel;
  warningMessage: string;
  consequences?: string[];
  safeAlternatives?: string[];
  educationalTip?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const RiskyActionGuard: React.FC<RiskyActionGuardProps> = ({
  actionId,
  riskLevel,
  warningMessage,
  consequences = [],
  safeAlternatives = [],
  educationalTip,
  onConfirm,
  onCancel,
  children,
  className = '',
}) => {
  const { registerRiskyAction, showRiskWarning, preventError } = useAntiError();
  const [showWarning, setShowWarning] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(0);
  const [typedConfirmation, setTypedConfirmation] = useState('');

  useEffect(() => {
    registerRiskyAction({
      actionId,
      riskLevel,
      confirmationRequired: riskLevel !== 'safe',
      warningMessage,
      consequences,
      safeAlternatives,
      educationalTip,
    });
  }, [actionId, riskLevel, warningMessage, consequences, safeAlternatives, educationalTip, registerRiskyAction]);

  const handleAction = async () => {
    // Check if action should be prevented
    if (!preventError(actionId, 'learning')) {
      return;
    }

    // Show risk warning if needed
    if (riskLevel !== 'safe') {
      setShowWarning(true);
      await showRiskWarning(actionId);
    } else {
      onConfirm();
    }
  };

  const handleConfirm = () => {
    if (riskLevel === 'dangerous' && confirmationStep === 0) {
      setConfirmationStep(1);
      return;
    }

    if (riskLevel === 'dangerous' && typedConfirmation.toLowerCase() !== 'confirm') {
      return;
    }

    setShowWarning(false);
    setConfirmationStep(0);
    setTypedConfirmation('');
    onConfirm();
  };

  const handleCancel = () => {
    setShowWarning(false);
    setConfirmationStep(0);
    setTypedConfirmation('');
    onCancel?.();
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'safe': return 'rgb(34, 197, 94)';
      case 'caution': return 'rgb(234, 179, 8)';
      case 'risky': return 'rgb(249, 115, 22)';
      case 'dangerous': return 'rgb(239, 68, 68)';
      default: return 'rgb(156, 163, 175)';
    }
  };

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'safe': return '✓';
      case 'caution': return '⚠️';
      case 'risky': return '⚠️';
      case 'dangerous': return '🚨';
      default: return 'ℹ️';
    }
  };

  return (
    <>
      <div
        className={`risky-action-guard ${className}`}
        data-risk-level={riskLevel}
        onClick={handleAction}
      >
        {children}
      </div>

      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="risk-warning-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="risk-warning-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="warning-header">
                <div 
                  className="warning-icon"
                  style={{ color: getRiskColor() }}
                >
                  {getRiskIcon()}
                </div>
                <h3 className="warning-title">
                  {riskLevel === 'dangerous' ? 'Azione Pericolosa' :
                   riskLevel === 'risky' ? 'Azione Rischiosa' :
                   'Attenzione Richiesta'}
                </h3>
              </div>

              <div className="warning-content">
                <p className="warning-message">{warningMessage}</p>

                {consequences.length > 0 && (
                  <div className="warning-consequences">
                    <h4>Possibili conseguenze:</h4>
                    <ul>
                      {consequences.map((consequence, index) => (
                        <li key={index}>{consequence}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {safeAlternatives.length > 0 && (
                  <div className="warning-alternatives">
                    <h4>Alternative sicure:</h4>
                    <ul>
                      {safeAlternatives.map((alternative, index) => (
                        <li key={index}>{alternative}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {educationalTip && (
                  <div className="warning-tip">
                    <div className="tip-icon">💡</div>
                    <p>{educationalTip}</p>
                  </div>
                )}

                {riskLevel === 'dangerous' && confirmationStep === 1 && (
                  <div className="typed-confirmation">
                    <label htmlFor="confirmation-input">
                      Digita "confirm" per procedere:
                    </label>
                    <input
                      id="confirmation-input"
                      type="text"
                      value={typedConfirmation}
                      onChange={(e) => setTypedConfirmation(e.target.value)}
                      placeholder="confirm"
                      className="confirmation-input"
                    />
                  </div>
                )}
              </div>

              <div className="warning-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Annulla
                </button>
                
                {safeAlternatives.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCancel}
                  >
                    Usa Alternativa Sicura
                  </button>
                )}
                
                <button
                  type="button"
                  className={`btn ${riskLevel === 'dangerous' ? 'btn-danger' : 'btn-warning'}`}
                  onClick={handleConfirm}
                  disabled={riskLevel === 'dangerous' && confirmationStep === 1 && 
                           typedConfirmation.toLowerCase() !== 'confirm'}
                >
                  {riskLevel === 'dangerous' && confirmationStep === 0 ? 'Sono Sicuro' :
                   riskLevel === 'dangerous' && confirmationStep === 1 ? 'Conferma Definitivamente' :
                   'Procedi Comunque'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// ERROR PREVENTION GUIDE COMPONENT
// ============================================================================

interface ErrorPreventionGuideProps {
  context: 'learning' | 'trading' | 'settings' | 'general';
  className?: string;
}

export const ErrorPreventionGuide: React.FC<ErrorPreventionGuideProps> = ({
  context,
  className = '',
}) => {
  const { highlightSafePath } = useAntiError();
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  const guides = {
    learning: {
      title: 'Guida Sicura all\'Apprendimento',
      tips: [
        'Segui il percorso consigliato per evitare confusione',
        'Completa una lezione prima di passare alla successiva',
        'Usa la modalità focus per ridurre le distrazioni',
        'Salva i progressi regolarmente',
      ],
      safePaths: ['lesson-content', 'next-lesson', 'save-progress'],
    },
    trading: {
      title: 'Sicurezza nelle Operazioni',
      tips: [
        'Verifica sempre gli indirizzi prima di inviare crypto',
        'Usa importi piccoli per i primi test',
        'Controlla le commissioni prima di confermare',
        'Non condividere mai le chiavi private',
      ],
      safePaths: ['verify-address', 'check-fees', 'test-transaction'],
    },
    settings: {
      title: 'Configurazione Sicura',
      tips: [
        'Fai backup delle impostazioni importanti',
        'Testa le modifiche in ambiente sicuro',
        'Leggi attentamente prima di confermare',
        'Mantieni attiva l\'autenticazione a due fattori',
      ],
      safePaths: ['backup-settings', 'test-changes', 'enable-2fa'],
    },
    general: {
      title: 'Principi Generali di Sicurezza',
      tips: [
        'Quando in dubbio, chiedi aiuto',
        'Verifica sempre le informazioni critiche',
        'Usa percorsi raccomandati quando disponibili',
        'Mantieni aggiornate le conoscenze di sicurezza',
      ],
      safePaths: ['help-center', 'verify-info', 'recommended-path'],
    },
  };

  const currentGuide = guides[context];

  const handleHighlightPath = (pathId: string) => {
    highlightSafePath(pathId, 'strong');
    setActiveGuide(pathId);
    setTimeout(() => setActiveGuide(null), 3000);
  };

  return (
    <div className={`error-prevention-guide ${className}`}>
      <div className="guide-header">
        <div className="guide-icon">🛡️</div>
        <h3 className="guide-title">{currentGuide.title}</h3>
      </div>

      <div className="guide-content">
        <div className="safety-tips">
          <h4>Consigli di Sicurezza:</h4>
          <ul>
            {currentGuide.tips.map((tip, index) => (
              <li key={index} className="safety-tip">
                <span className="tip-icon">✓</span>
                <span className="tip-text">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="safe-paths-section">
          <h4>Percorsi Sicuri:</h4>
          <div className="safe-paths-list">
            {currentGuide.safePaths.map((pathId) => (
              <button
                key={pathId}
                type="button"
                className={`safe-path-button ${activeGuide === pathId ? 'active' : ''}`}
                onClick={() => handleHighlightPath(pathId)}
              >
                <span className="path-icon">🎯</span>
                <span className="path-name">{pathId.replace('-', ' ')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ANTI-ERROR TESTER COMPONENT
// ============================================================================

export const AntiErrorTester: React.FC = () => {
  const { highlightSafePath, showRiskWarning, preventError } = useAntiError();

  const testSafePath = () => {
    highlightSafePath('test-safe-path', 'strong');
  };

  const testRiskWarning = async () => {
    await showRiskWarning('test-risky-action');
  };

  const testErrorPrevention = () => {
    const prevented = preventError('test-dangerous-action', 'learning');
    alert(prevented ? 'Azione consentita' : 'Azione bloccata per sicurezza');
  };

  return (
    <div className="anti-error-tester">
      <h3>Anti-Error System Tester</h3>
      
      <div className="tester-controls">
        <button type="button" className="btn btn-primary" onClick={testSafePath}>
          Test Safe Path Highlighting
        </button>
        
        <button type="button" className="btn btn-warning" onClick={testRiskWarning}>
          Test Risk Warning
        </button>
        
        <button type="button" className="btn btn-danger" onClick={testErrorPrevention}>
          Test Error Prevention
        </button>
      </div>

      <div className="test-elements">
        <SafePathHighlighter
          elementId="test-safe-path"
          pathType="recommended"
          visualCue="glow"
          intensity="moderate"
          message="Questo è un percorso sicuro raccomandato"
        >
          <div className="test-safe-element">
            Elemento Sicuro (clicca "Test Safe Path" per evidenziare)
          </div>
        </SafePathHighlighter>

        <RiskyActionGuard
          actionId="test-risky-action"
          riskLevel="risky"
          warningMessage="Questa azione potrebbe causare problemi"
          consequences={['Perdita di progressi', 'Confusione nell\'apprendimento']}
          safeAlternatives={['Continua con la lezione corrente', 'Chiedi aiuto al tutor']}
          educationalTip="È meglio completare una lezione alla volta per un apprendimento efficace"
          onConfirm={() => alert('Azione rischiosa confermata')}
          onCancel={() => alert('Azione annullata - scelta saggia!')}
        >
          <button type="button" className="btn btn-warning">
            Azione Rischiosa (Test)
          </button>
        </RiskyActionGuard>

        <RiskyActionGuard
          actionId="test-dangerous-action"
          riskLevel="dangerous"
          warningMessage="ATTENZIONE: Questa azione è irreversibile e pericolosa"
          consequences={[
            'Perdita permanente dei dati',
            'Reset completo del progresso',
            'Impossibilità di recupero'
          ]}
          safeAlternatives={[
            'Fai un backup prima di procedere',
            'Contatta il supporto tecnico',
            'Usa la modalità di test'
          ]}
          educationalTip="Le azioni irreversibili richiedono sempre una doppia conferma e una comprensione completa delle conseguenze"
          onConfirm={() => alert('Azione pericolosa confermata - speriamo tu sappia cosa stai facendo!')}
          onCancel={() => alert('Azione annullata - decisione molto saggia!')}
        >
          <button type="button" className="btn btn-danger">
            Azione Pericolosa (Test)
          </button>
        </RiskyActionGuard>
      </div>

      <ErrorPreventionGuide context="learning" className="guide-demo" />
    </div>
  );
};

export default AntiErrorProvider;