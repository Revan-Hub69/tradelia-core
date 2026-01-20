/**
 * BRAND MEMORY SYSTEM - Enterprise 2026
 *
 * Sistema che assicura che ogni interazione rinforzi il brand Tradelia
 * e crei momenti memorabili che costruiscono la fedeltà dell'utente
 * 
 * Basato su ricerca 2026: Brand Loyalty through UX, Memorable Moments, 
 * Emotional Connections, Affective Design
 * 
 * Principi chiave:
 * - Emotional UX Design: creare connessioni emotive durature
 * - Brand Consistency: identità coerente in ogni touchpoint
 * - Memorable Moments: momenti che rimangono impressi
 * - Loyalty Building: costruire fedeltà attraverso l'esperienza
 * - Affective Design: design che evoca risposte emotive intenzionali
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useAccessibility } from '../../hooks/useAccessibility';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type BrandMomentType = 
  | 'first-impression'    // Primo contatto con Tradelia
  | 'learning-milestone'  // Traguardo di apprendimento
  | 'achievement-unlock'  // Sblocco achievement
  | 'skill-mastery'       // Padronanza di una skill
  | 'community-connect'   // Connessione con la community
  | 'premium-upgrade'     // Upgrade a premium
  | 'knowledge-share'     // Condivisione conoscenza
  | 'problem-solved'      // Risoluzione di un problema
  | 'trust-building'      // Costruzione di fiducia
  | 'loyalty-reward';     // Ricompensa per fedeltà

export type EmotionalTone = 
  | 'confident'           // Fiducia e sicurezza
  | 'encouraging'         // Incoraggiamento e supporto
  | 'celebratory'         // Celebrazione e gioia
  | 'reassuring'          // Rassicurazione e calma
  | 'inspiring'           // Ispirazione e motivazione
  | 'professional'        // Professionalità e competenza
  | 'warm'                // Calore e accoglienza
  | 'empowering';         // Empowerment e crescita

export type BrandTouchpoint = 
  | 'navigation'          // Navigazione e menu
  | 'content'             // Contenuti e lezioni
  | 'interactions'        // Interazioni e feedback
  | 'notifications'       // Notifiche e messaggi
  | 'achievements'        // Achievement e badge
  | 'community'           // Community e social
  | 'support'             // Supporto e help
  | 'onboarding';         // Onboarding e welcome

export interface BrandMemoryConfig {
  brandPersonality: {
    primary: string[];      // Tratti principali (es. "professionale", "affidabile")
    secondary: string[];    // Tratti secondari (es. "innovativo", "accessibile")
    voice: string;          // Tono di voce (es. "esperto ma amichevole")
    values: string[];       // Valori core (es. "educazione di qualità", "crescita")
  };
  emotionalGoals: {
    primary: EmotionalTone;     // Emozione primaria da evocare
    secondary: EmotionalTone;   // Emozione secondaria
    avoid: EmotionalTone[];     // Emozioni da evitare
  };
  memoryTriggers: {
    visual: string[];       // Elementi visivi distintivi
    interaction: string[];  // Interazioni memorabili
    content: string[];      // Contenuti che rimangono impressi
    timing: string[];       // Momenti temporali chiave
  };
  loyaltyBuilders: {
    consistency: boolean;   // Coerenza dell'esperienza
    personalization: boolean; // Personalizzazione
    recognition: boolean;   // Riconoscimento dell'utente
    rewards: boolean;       // Sistema di ricompense
    community: boolean;     // Senso di appartenenza
  };
}

export interface BrandMemoryContextType {
  config: BrandMemoryConfig;
  recordBrandMoment: (type: BrandMomentType, touchpoint: BrandTouchpoint, metadata?: any) => void;
  getBrandConsistencyScore: () => number;
  getEmotionalResonanceScore: () => number;
  getLoyaltyIndicators: () => {
    engagement: number;
    retention: number;
    advocacy: number;
    satisfaction: number;
  };
  generateBrandMoment: (type: BrandMomentType, customization?: Partial<BrandMomentCustomization>) => BrandMomentData;
  shouldShowBrandElement: (touchpoint: BrandTouchpoint) => boolean;
  getBrandStyles: (touchpoint: BrandTouchpoint) => React.CSSProperties;
}

export interface BrandMomentCustomization {
  tone: EmotionalTone;
  intensity: 'subtle' | 'medium' | 'strong' | 'memorable';
  duration: number;
  personalMessage?: string;
  visualElements?: string[];
  soundCues?: boolean;
}

export interface BrandMomentData {
  id: string;
  type: BrandMomentType;
  touchpoint: BrandTouchpoint;
  tone: EmotionalTone;
  intensity: 'subtle' | 'medium' | 'strong' | 'memorable';
  timestamp: number;
  message: string;
  visualElements: string[];
  interactionCues: string[];
  memoryScore: number; // 0-1, quanto è memorabile questo momento
}

export interface BrandMemorySystemProps {
  children: React.ReactNode;
  config?: Partial<BrandMemoryConfig>;
  onBrandMoment?: (moment: BrandMomentData) => void;
  onLoyaltyChange?: (indicators: any) => void;
}

// ============================================================================
// BRAND MEMORY CONTEXT
// ============================================================================

const BrandMemoryContext = createContext<BrandMemoryContextType | null>(null);

export const useBrandMemory = (): BrandMemoryContextType => {
  const context = useContext(BrandMemoryContext);
  if (!context) {
    throw new Error('useBrandMemory must be used within BrandMemorySystem provider');
  }
  return context;
};

// ============================================================================
// DEFAULT BRAND CONFIGURATION
// ============================================================================

const DEFAULT_BRAND_CONFIG: BrandMemoryConfig = {
  brandPersonality: {
    primary: ['professionale', 'affidabile', 'competente', 'innovativo'],
    secondary: ['accessibile', 'supportivo', 'ispirante', 'trasparente'],
    voice: 'esperto ma amichevole, serio ma non intimidatorio',
    values: ['educazione di qualità', 'crescita personale', 'trasparenza', 'innovazione responsabile'],
  },
  emotionalGoals: {
    primary: 'confident',
    secondary: 'empowering',
    avoid: ['professional'], // Use valid EmotionalTone values
  },
  memoryTriggers: {
    visual: ['signature-blue', 'emerald-accent', 'glass-surfaces', 'signature-notch'],
    interaction: ['elastic-feedback', 'breathing-animations', 'signature-moments', 'haptic-visual'],
    content: ['clear-explanations', 'practical-examples', 'progress-celebration', 'expert-insights'],
    timing: ['lesson-completion', 'skill-unlock', 'milestone-reached', 'problem-solved'],
  },
  loyaltyBuilders: {
    consistency: true,
    personalization: true,
    recognition: true,
    rewards: true,
    community: true,
  },
};

// ============================================================================
// BRAND MOMENT TEMPLATES
// ============================================================================

const BRAND_MOMENT_TEMPLATES: Record<BrandMomentType, Partial<BrandMomentData>> = {
  'first-impression': {
    tone: 'warm',
    intensity: 'memorable',
    message: 'Benvenuto in Tradelia - dove l\'educazione crypto diventa chiara e accessibile',
    visualElements: ['welcome-animation', 'brand-logo', 'signature-colors'],
    interactionCues: ['gentle-fade-in', 'breathing-welcome'],
    memoryScore: 0.9,
  },
  'learning-milestone': {
    tone: 'celebratory',
    intensity: 'strong',
    message: 'Fantastico! Hai completato un altro passo nel tuo percorso di apprendimento',
    visualElements: ['progress-celebration', 'achievement-glow', 'signature-moment'],
    interactionCues: ['success-animation', 'haptic-celebration'],
    memoryScore: 0.8,
  },
  'achievement-unlock': {
    tone: 'celebratory',
    intensity: 'memorable',
    message: 'Achievement sbloccato! La tua dedizione sta dando i suoi frutti',
    visualElements: ['badge-reveal', 'particle-explosion', 'signature-diamond'],
    interactionCues: ['unlock-animation', 'signature-moment'],
    memoryScore: 0.95,
  },
  'skill-mastery': {
    tone: 'empowering',
    intensity: 'strong',
    message: 'Hai padroneggiato questa competenza! Sei pronto per la prossima sfida',
    visualElements: ['mastery-badge', 'skill-tree-update', 'confidence-boost'],
    interactionCues: ['mastery-animation', 'empowering-feedback'],
    memoryScore: 0.85,
  },
  'community-connect': {
    tone: 'warm',
    intensity: 'medium',
    message: 'Benvenuto nella community Tradelia - insieme cresciamo più forti',
    visualElements: ['community-welcome', 'connection-lines', 'warm-colors'],
    interactionCues: ['connection-animation', 'community-pulse'],
    memoryScore: 0.7,
  },
  'premium-upgrade': {
    tone: 'professional',
    intensity: 'strong',
    message: 'Benvenuto in Tradelia Premium - sblocca tutto il potenziale del tuo apprendimento',
    visualElements: ['premium-badge', 'gold-accents', 'exclusive-content'],
    interactionCues: ['premium-reveal', 'luxury-feedback'],
    memoryScore: 0.9,
  },
  'knowledge-share': {
    tone: 'inspiring',
    intensity: 'medium',
    message: 'Grazie per aver condiviso la tua conoscenza con la community',
    visualElements: ['sharing-icon', 'knowledge-flow', 'community-appreciation'],
    interactionCues: ['sharing-animation', 'gratitude-feedback'],
    memoryScore: 0.75,
  },
  'problem-solved': {
    tone: 'reassuring',
    intensity: 'medium',
    message: 'Problema risolto! Siamo qui per supportarti in ogni passo',
    visualElements: ['solution-check', 'support-icon', 'reassuring-colors'],
    interactionCues: ['solution-animation', 'reassuring-feedback'],
    memoryScore: 0.8,
  },
  'trust-building': {
    tone: 'professional',
    intensity: 'subtle',
    message: 'La tua fiducia è importante per noi - continuiamo a meritarcela ogni giorno',
    visualElements: ['trust-indicators', 'security-badges', 'transparency-elements'],
    interactionCues: ['trust-animation', 'confidence-building'],
    memoryScore: 0.85,
  },
  'loyalty-reward': {
    tone: 'encouraging',
    intensity: 'strong',
    message: 'Grazie per essere parte della famiglia Tradelia - ecco un piccolo riconoscimento',
    visualElements: ['loyalty-badge', 'reward-animation', 'appreciation-glow'],
    interactionCues: ['reward-reveal', 'loyalty-celebration'],
    memoryScore: 0.9,
  },
};

// ============================================================================
// BRAND MEMORY SYSTEM PROVIDER
// ============================================================================

export const BrandMemorySystem: React.FC<BrandMemorySystemProps> = ({
  children,
  config: customConfig,
  onBrandMoment,
  onLoyaltyChange,
}) => {
  const { shouldAnimate } = usePerformanceOptimization();
  const { announce } = useAccessibility();

  // Merge custom config with defaults
  const config: BrandMemoryConfig = {
    ...DEFAULT_BRAND_CONFIG,
    ...customConfig,
    brandPersonality: { ...DEFAULT_BRAND_CONFIG.brandPersonality, ...customConfig?.brandPersonality },
    emotionalGoals: { ...DEFAULT_BRAND_CONFIG.emotionalGoals, ...customConfig?.emotionalGoals },
    memoryTriggers: { ...DEFAULT_BRAND_CONFIG.memoryTriggers, ...customConfig?.memoryTriggers },
    loyaltyBuilders: { ...DEFAULT_BRAND_CONFIG.loyaltyBuilders, ...customConfig?.loyaltyBuilders },
  };

  // State management
  const [brandMoments, setBrandMoments] = useState<BrandMomentData[]>([]);
  const [loyaltyMetrics, setLoyaltyMetrics] = useState({
    engagement: 0.8,
    retention: 0.75,
    advocacy: 0.7,
    satisfaction: 0.85,
  });

  // Record a brand moment
  const recordBrandMoment = useCallback((
    type: BrandMomentType, 
    touchpoint: BrandTouchpoint, 
    metadata?: any
  ) => {
    const moment = generateBrandMoment(type, { ...metadata, touchpoint });
    setBrandMoments(prev => [...prev.slice(-49), moment]); // Keep last 50 moments
    onBrandMoment?.(moment);
    
    // Announce for accessibility
    if (moment.intensity === 'memorable' || moment.intensity === 'strong') {
      announce(moment.message, 'polite');
    }
  }, [onBrandMoment, announce]);

  // Generate a brand moment
  const generateBrandMoment = useCallback((
    type: BrandMomentType, 
    customization?: Partial<BrandMomentCustomization> & { touchpoint?: BrandTouchpoint }
  ): BrandMomentData => {
    const template = BRAND_MOMENT_TEMPLATES[type];
    const id = `brand-moment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id,
      type,
      touchpoint: customization?.touchpoint || 'content', // Use provided touchpoint or default
      timestamp: Date.now(),
      tone: customization?.tone || template.tone || config.emotionalGoals.primary,
      intensity: customization?.intensity || template.intensity || 'medium',
      message: customization?.personalMessage || template.message || 'Momento speciale Tradelia',
      visualElements: customization?.visualElements || template.visualElements || [],
      interactionCues: template.interactionCues || [],
      memoryScore: template.memoryScore || 0.5,
    };
  }, [config]);

  // Calculate brand consistency score
  const getBrandConsistencyScore = useCallback((): number => {
    // Analyze recent brand moments for consistency
    const recentMoments = brandMoments.slice(-10);
    if (recentMoments.length === 0) return 1.0;

    const toneConsistency = recentMoments.filter(m => 
      m.tone === config.emotionalGoals.primary || 
      m.tone === config.emotionalGoals.secondary
    ).length / recentMoments.length;

    const visualConsistency = recentMoments.filter(m =>
      m.visualElements.some(el => config.memoryTriggers.visual.includes(el))
    ).length / recentMoments.length;

    return (toneConsistency + visualConsistency) / 2;
  }, [brandMoments, config]);

  // Calculate emotional resonance score
  const getEmotionalResonanceScore = useCallback((): number => {
    const recentMoments = brandMoments.slice(-20);
    if (recentMoments.length === 0) return 0.8;

    const avgMemoryScore = recentMoments.reduce((sum, m) => sum + m.memoryScore, 0) / recentMoments.length;
    const intensityScore = recentMoments.filter(m => 
      m.intensity === 'strong' || m.intensity === 'memorable'
    ).length / recentMoments.length;

    return (avgMemoryScore + intensityScore) / 2;
  }, [brandMoments]);

  // Get loyalty indicators
  const getLoyaltyIndicators = useCallback(() => {
    return loyaltyMetrics;
  }, [loyaltyMetrics]);

  // Determine if brand element should be shown
  const shouldShowBrandElement = useCallback((touchpoint: BrandTouchpoint): boolean => {
    // Use touchpoint for future conditional logic, for now return consistent behavior
    return config.loyaltyBuilders.consistency && shouldAnimate('low') && !!touchpoint;
  }, [config, shouldAnimate]);

  // Get brand-specific styles
  const getBrandStyles = useCallback((touchpoint: BrandTouchpoint): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    switch (touchpoint) {
      case 'navigation':
        return {
          ...baseStyles,
          borderLeft: '3px solid #3B82F6', // Signature blue
        };
      case 'content':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(16, 185, 129, 0.02) 100%)',
        };
      case 'achievements':
        return {
          ...baseStyles,
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
        };
      default:
        return baseStyles;
    }
  }, []);

  // Update loyalty metrics based on brand moments
  useEffect(() => {
    const consistencyScore = getBrandConsistencyScore();
    const resonanceScore = getEmotionalResonanceScore();
    
    setLoyaltyMetrics(prev => {
      const newMetrics = {
        engagement: Math.min(1, prev.engagement + (resonanceScore - 0.5) * 0.1),
        retention: Math.min(1, prev.retention + (consistencyScore - 0.5) * 0.1),
        advocacy: Math.min(1, prev.advocacy + (resonanceScore * consistencyScore - 0.5) * 0.1),
        satisfaction: Math.min(1, (consistencyScore + resonanceScore) / 2),
      };
      
      onLoyaltyChange?.(newMetrics);
      return newMetrics;
    });
  }, [brandMoments, getBrandConsistencyScore, getEmotionalResonanceScore, onLoyaltyChange]);

  // Context value
  const contextValue: BrandMemoryContextType = {
    config,
    recordBrandMoment,
    getBrandConsistencyScore,
    getEmotionalResonanceScore,
    getLoyaltyIndicators,
    generateBrandMoment,
    shouldShowBrandElement,
    getBrandStyles,
  };

  return (
    <BrandMemoryContext.Provider value={contextValue}>
      <div 
        className="brand-memory-system"
        data-brand-personality={config.brandPersonality.primary.join(',')}
        data-emotional-tone={config.emotionalGoals.primary}
        style={getBrandStyles('content')}
      >
        {children}
      </div>
    </BrandMemoryContext.Provider>
  );
};

// ============================================================================
// BRAND MEMORY COMPONENTS
// ============================================================================

export interface BrandMomentProps {
  type: BrandMomentType;
  touchpoint?: BrandTouchpoint;
  customization?: Partial<BrandMomentCustomization>;
  trigger?: boolean;
  children?: React.ReactNode;
}

export const BrandMoment: React.FC<BrandMomentProps> = ({
  type,
  touchpoint = 'content',
  customization,
  trigger = false,
  children,
}) => {
  const { recordBrandMoment, generateBrandMoment, shouldShowBrandElement } = useBrandMemory();
  const [isActive, setIsActive] = useState(false);

  // Trigger brand moment
  useEffect(() => {
    if (trigger) {
      recordBrandMoment(type, touchpoint, customization);
      setIsActive(true);
      
      const moment = generateBrandMoment(type, customization);
      const duration = customization?.duration || (moment.intensity === 'memorable' ? 3000 : 1500);
      
      setTimeout(() => setIsActive(false), duration);
    }
  }, [trigger, type, touchpoint, customization, recordBrandMoment, generateBrandMoment]);

  if (!shouldShowBrandElement(touchpoint)) {
    return <>{children}</>;
  }

  return (
    <div 
      className={`brand-moment ${isActive ? 'active' : ''}`}
      data-moment-type={type}
      data-touchpoint={touchpoint}
    >
      {children}
    </div>
  );
};

export interface BrandConsistencyIndicatorProps {
  className?: string;
}

export const BrandConsistencyIndicator: React.FC<BrandConsistencyIndicatorProps> = ({
  className = '',
}) => {
  const { getBrandConsistencyScore, getEmotionalResonanceScore } = useBrandMemory();
  
  const consistencyScore = getBrandConsistencyScore();
  const resonanceScore = getEmotionalResonanceScore();
  const overallScore = (consistencyScore + resonanceScore) / 2;

  return (
    <div className={`brand-consistency-indicator ${className}`}>
      <div className="score-display">
        <div className="score-label">Brand Consistency</div>
        <div className="score-value">{Math.round(overallScore * 100)}%</div>
      </div>
      <div className="score-breakdown">
        <div className="metric">
          <span>Consistency: {Math.round(consistencyScore * 100)}%</span>
        </div>
        <div className="metric">
          <span>Resonance: {Math.round(resonanceScore * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default BrandMemorySystem;