/**
 * FOCUS MODE SYSTEM - Educational UX Patterns 2026
 * 
 * Sistema di riduzione del carico cognitivo basato su ricerca 2026:
 * - Neuro-adaptive design patterns (Microsoft, Apple)
 * - Progressive disclosure per gerarchia informativa
 * - Cognitive Load Theory applicata alle interfacce educative
 * - Anti-distraction patterns per learning flow
 * 
 * Implementa:
 * - Visual noise reduction durante l'apprendimento
 * - Progressive disclosure per gerarchia informativa
 * - Context-aware focus states
 * - Adaptive interface density
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type FocusLevel = 'minimal' | 'moderate' | 'deep' | 'immersive';
export type FocusContext = 'learning' | 'reading' | 'practicing' | 'testing' | 'exploring';
export type DistractionLevel = 'none' | 'low' | 'medium' | 'high';

export interface FocusState {
  level: FocusLevel;
  context: FocusContext;
  isActive: boolean;
  distractionLevel: DistractionLevel;
  adaptiveSettings: {
    reduceAnimations: boolean;
    dimSecondary: boolean;
    hideNonEssential: boolean;
    simplifyNavigation: boolean;
    enableProgressiveDisclosure: boolean;
  };
}

export interface FocusSettings {
  autoActivate: boolean;
  learningSessionThreshold: number; // minutes
  adaptToTimeOfDay: boolean;
  respectSystemPreferences: boolean;
  cognitiveLoadAwareness: boolean;
}

export interface ProgressiveDisclosureConfig {
  primary: string[];    // Always visible
  secondary: string[];  // Visible on hover/focus
  tertiary: string[];   // Visible on explicit request
}

// ============================================================================
// FOCUS MODE CONTEXT
// ============================================================================

interface FocusContextType {
  focusState: FocusState;
  settings: FocusSettings;
  activateFocus: (level: FocusLevel, context: FocusContext) => void;
  deactivateFocus: () => void;
  updateSettings: (settings: Partial<FocusSettings>) => void;
  getDisclosureLevel: (elementId: string) => 'primary' | 'secondary' | 'tertiary';
  isElementVisible: (elementId: string) => boolean;
}

const FocusContext = createContext<FocusContextType | null>(null);

// ============================================================================
// FOCUS MODE PROVIDER
// ============================================================================

export const FocusModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [focusState, setFocusState] = useState<FocusState>({
    level: 'minimal',
    context: 'exploring',
    isActive: false,
    distractionLevel: 'none',
    adaptiveSettings: {
      reduceAnimations: false,
      dimSecondary: false,
      hideNonEssential: false,
      simplifyNavigation: false,
      enableProgressiveDisclosure: false,
    },
  });

  const [settings, setSettings] = useState<FocusSettings>({
    autoActivate: true,
    learningSessionThreshold: 5,
    adaptToTimeOfDay: true,
    respectSystemPreferences: true,
    cognitiveLoadAwareness: true,
  });

  // Progressive disclosure configuration per context
  const disclosureConfig: Record<FocusContext, ProgressiveDisclosureConfig> = {
    learning: {
      primary: ['lesson-content', 'progress-indicator', 'next-button'],
      secondary: ['lesson-notes', 'difficulty-selector', 'bookmark'],
      tertiary: ['lesson-history', 'related-topics', 'advanced-settings'],
    },
    reading: {
      primary: ['main-content', 'reading-progress'],
      secondary: ['table-of-contents', 'highlights', 'font-settings'],
      tertiary: ['comments', 'sharing-options', 'metadata'],
    },
    practicing: {
      primary: ['exercise-content', 'submit-button', 'hint-button'],
      secondary: ['progress-bar', 'timer', 'difficulty-indicator'],
      tertiary: ['statistics', 'leaderboard', 'practice-history'],
    },
    testing: {
      primary: ['question-content', 'answer-options', 'submit-button'],
      secondary: ['question-counter', 'time-remaining'],
      tertiary: ['review-mode', 'flagged-questions', 'test-settings'],
    },
    exploring: {
      primary: ['main-navigation', 'featured-content', 'search'],
      secondary: ['categories', 'filters', 'user-menu'],
      tertiary: ['advanced-search', 'preferences', 'help'],
    },
  };

  // Activate focus mode
  const activateFocus = useCallback((level: FocusLevel, context: FocusContext) => {
    const adaptiveSettings = {
      reduceAnimations: level === 'deep' || level === 'immersive',
      dimSecondary: level === 'moderate' || level === 'deep' || level === 'immersive',
      hideNonEssential: level === 'deep' || level === 'immersive',
      simplifyNavigation: level === 'immersive',
      enableProgressiveDisclosure: level !== 'minimal',
    };

    setFocusState({
      level,
      context,
      isActive: true,
      distractionLevel: level === 'immersive' ? 'none' : level === 'deep' ? 'low' : 'medium',
      adaptiveSettings,
    });

    // Apply CSS custom properties for global styling
    document.documentElement.style.setProperty('--focus-active', '1');
    document.documentElement.style.setProperty('--focus-level', level);
    document.documentElement.style.setProperty('--focus-context', context);
  }, []);

  // Deactivate focus mode
  const deactivateFocus = useCallback(() => {
    setFocusState(prev => ({
      ...prev,
      isActive: false,
      distractionLevel: 'none',
      adaptiveSettings: {
        reduceAnimations: false,
        dimSecondary: false,
        hideNonEssential: false,
        simplifyNavigation: false,
        enableProgressiveDisclosure: false,
      },
    }));

    // Remove CSS custom properties
    document.documentElement.style.removeProperty('--focus-active');
    document.documentElement.style.removeProperty('--focus-level');
    document.documentElement.style.removeProperty('--focus-context');
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<FocusSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Get disclosure level for element
  const getDisclosureLevel = useCallback((elementId: string): 'primary' | 'secondary' | 'tertiary' => {
    const config = disclosureConfig[focusState.context];
    
    if (config.primary.includes(elementId)) return 'primary';
    if (config.secondary.includes(elementId)) return 'secondary';
    return 'tertiary';
  }, [focusState.context]);

  // Check if element should be visible
  const isElementVisible = useCallback((elementId: string): boolean => {
    if (!focusState.isActive) return true;
    
    const level = getDisclosureLevel(elementId);
    
    switch (focusState.level) {
      case 'minimal':
        return true;
      case 'moderate':
        return level === 'primary' || level === 'secondary';
      case 'deep':
        return level === 'primary';
      case 'immersive':
        return level === 'primary';
      default:
        return true;
    }
  }, [focusState.isActive, focusState.level, getDisclosureLevel]);

  // Auto-activate based on context and time
  useEffect(() => {
    if (!settings.autoActivate) return;

    const handleLearningSession = () => {
      // Auto-activate moderate focus for learning sessions
      if (focusState.context === 'learning' && !focusState.isActive) {
        activateFocus('moderate', 'learning');
      }
    };

    const timer = setTimeout(handleLearningSession, settings.learningSessionThreshold * 60 * 1000);
    return () => clearTimeout(timer);
  }, [settings.autoActivate, settings.learningSessionThreshold, focusState.context, focusState.isActive, activateFocus]);

  // Respect system preferences
  useEffect(() => {
    if (!settings.respectSystemPreferences) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      if (mediaQuery.matches && focusState.isActive) {
        setFocusState(prev => ({
          ...prev,
          adaptiveSettings: {
            ...prev.adaptiveSettings,
            reduceAnimations: true,
          },
        }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange(); // Initial check

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.respectSystemPreferences, focusState.isActive]);

  const contextValue: FocusContextType = {
    focusState,
    settings,
    activateFocus,
    deactivateFocus,
    updateSettings,
    getDisclosureLevel,
    isElementVisible,
  };

  return (
    <FocusContext.Provider value={contextValue}>
      {children}
    </FocusContext.Provider>
  );
};

// ============================================================================
// FOCUS MODE HOOK
// ============================================================================

export const useFocusMode = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocusMode must be used within a FocusModeProvider');
  }
  return context;
};

// ============================================================================
// FOCUS WRAPPER COMPONENT
// ============================================================================

interface FocusWrapperProps {
  elementId: string;
  disclosureLevel?: 'primary' | 'secondary' | 'tertiary';
  children: React.ReactNode;
  className?: string;
}

export const FocusWrapper: React.FC<FocusWrapperProps> = ({
  elementId,
  disclosureLevel,
  children,
  className = '',
}) => {
  const { focusState, isElementVisible, getDisclosureLevel } = useFocusMode();
  
  const actualLevel = disclosureLevel || getDisclosureLevel(elementId);
  const isVisible = isElementVisible(elementId);
  
  const getOpacity = () => {
    if (!focusState.isActive) return 1;
    
    switch (actualLevel) {
      case 'primary':
        return 1;
      case 'secondary':
        return focusState.adaptiveSettings.dimSecondary ? 0.6 : 1;
      case 'tertiary':
        return focusState.adaptiveSettings.hideNonEssential ? 0 : 0.4;
      default:
        return 1;
    }
  };

  const getScale = () => {
    if (!focusState.isActive) return 1;
    return actualLevel === 'primary' ? 1 : 0.98;
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={elementId}
          className={`focus-wrapper focus-level-${actualLevel} ${className}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: getOpacity(), 
            scale: getScale(),
            transition: {
              duration: focusState.adaptiveSettings.reduceAnimations ? 0.1 : 0.3,
              ease: 'easeOut',
            },
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.95,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          }}
          data-focus-level={actualLevel}
          data-focus-active={focusState.isActive}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// FOCUS CONTROL COMPONENT
// ============================================================================

export const FocusControl: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { focusState, activateFocus, deactivateFocus } = useFocusMode();

  const focusLevels: { level: FocusLevel; label: string; description: string }[] = [
    { level: 'minimal', label: 'Normale', description: 'Interfaccia completa' },
    { level: 'moderate', label: 'Focus', description: 'Riduce distrazioni' },
    { level: 'deep', label: 'Deep Focus', description: 'Solo elementi essenziali' },
    { level: 'immersive', label: 'Immersivo', description: 'Massima concentrazione' },
  ];

  return (
    <div className={`focus-control ${className}`}>
      <div className="focus-control-header">
        <h3>Modalità Focus</h3>
        <p>Riduci le distrazioni per concentrarti meglio</p>
      </div>
      
      <div className="focus-levels">
        {focusLevels.map(({ level, label, description }) => (
          <button
            key={level}
            className={`focus-level-button ${focusState.level === level && focusState.isActive ? 'active' : ''}`}
            onClick={() => {
              if (focusState.isActive && focusState.level === level) {
                deactivateFocus();
              } else {
                activateFocus(level, focusState.context);
              }
            }}
          >
            <div className="focus-level-info">
              <span className="focus-level-label">{label}</span>
              <span className="focus-level-description">{description}</span>
            </div>
          </button>
        ))}
      </div>

      {focusState.isActive && (
        <motion.div
          className="focus-status"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="focus-status-indicator">
            <div className="focus-pulse" />
            <span>Focus attivo: {focusLevels.find(l => l.level === focusState.level)?.label}</span>
          </div>
          <button
            className="focus-deactivate"
            onClick={deactivateFocus}
          >
            Disattiva
          </button>
        </motion.div>
      )}
    </div>
  );
};

// ============================================================================
// PROGRESSIVE DISCLOSURE COMPONENT
// ============================================================================

interface ProgressiveDisclosureProps {
  title: string;
  level: 'secondary' | 'tertiary';
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({
  title,
  level,
  children,
  defaultExpanded = false,
  className = '',
}) => {
  const { focusState } = useFocusMode();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Auto-collapse in deep focus modes
  useEffect(() => {
    if (focusState.isActive && (focusState.level === 'deep' || focusState.level === 'immersive')) {
      setIsExpanded(false);
    }
  }, [focusState.isActive, focusState.level]);

  const shouldShowToggle = focusState.adaptiveSettings.enableProgressiveDisclosure || !focusState.isActive;

  return (
    <div className={`progressive-disclosure progressive-disclosure-${level} ${className}`}>
      {shouldShowToggle && (
        <button
          className="progressive-disclosure-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <span className="progressive-disclosure-title">{title}</span>
          <motion.div
            className="progressive-disclosure-icon"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.div>
        </button>
      )}
      
      <AnimatePresence>
        {(isExpanded || !shouldShowToggle) && (
          <motion.div
            className="progressive-disclosure-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: focusState.adaptiveSettings.reduceAnimations ? 0.1 : 0.3,
              ease: 'easeInOut',
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FocusModeProvider;