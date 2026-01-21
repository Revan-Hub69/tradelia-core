/**
 * TRADELIA SIGNATURE COMPONENT - Enterprise 2026
 *
 * Il componente signature che è istantaneamente riconoscibile come "Tradelia"
 * Basato su ricerca 2026: Visual Brand Language, signature forms, instant familiarity
 *
 * Caratteristiche distintive:
 * - Forma signature: "Tradelia Notch" (angolo tagliato caratteristico)
 * - Pattern signature: Micro-grain texture con highlight lines
 * - Motion signature: Elastic bounce con controlled imperfection
 * - Color signature: Deep Blue + Emerald gradient system
 */

import React, { useCallback, useState } from 'react';

import { useAccessibility } from '../../hooks/useAccessibility';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';
import { type SignatureMomentType, TradeliaSignatureMoment } from './TradeliaSignatureMoment';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type TradeliaVariant =
  | 'primary' // Deep Blue - Azioni principali
  | 'accent' // Emerald - Successi e completamenti
  | 'secondary' // Gray - Azioni secondarie
  | 'premium' // Gold gradient - Contenuti premium
  | 'danger' // Red - Azioni distruttive
  | 'ghost'; // Trasparente - Azioni sottili

export type TradeliaSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

export type TradeliaShape =
  | 'standard' // Rettangolo con signature notch
  | 'pill' // Pillola con signature curve
  | 'square' // Quadrato con signature cut
  | 'circle' // Cerchio con signature glow
  | 'diamond'; // Diamante signature (per achievements)

export type TradeliaTexture =
  | 'smooth' // Superficie liscia
  | 'grain' // Micro-grain texture signature
  | 'glass' // Glass morphism con signature blur
  | 'metal' // Metallic finish per premium
  | 'fabric'; // Soft fabric texture

export type TradeliaInteraction =
  | 'none' // Nessuna interazione
  | 'hover' // Solo hover effects
  | 'press' // Press feedback signature
  | 'signature' // Full signature interaction con moment
  | 'magnetic'; // Magnetic attraction effect

export type TradeliaSignatureComponentProps = {
  'children': React.ReactNode;
  'variant'?: TradeliaVariant;
  'size'?: TradeliaSize;
  'shape'?: TradeliaShape;
  'texture'?: TradeliaTexture;
  'interaction'?: TradeliaInteraction;
  'className'?: string;
  'onClick'?: () => void;
  'onSignatureMoment'?: SignatureMomentType;
  'disabled'?: boolean;
  'loading'?: boolean;
  'badge'?: string | number;
  'icon'?: React.ReactNode;
  'href'?: string;
  'aria-label'?: string;
};

// ============================================================================
// SIGNATURE CONFIGURATIONS
// ============================================================================

const SIGNATURE_VARIANTS = {
  primary: {
    bg: 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800',
    text: 'text-white',
    border: 'border-blue-500/30',
    shadow: 'shadow-blue-500/25',
    glow: 'shadow-blue-500/40',
    highlight: '#3B82F6',
  },
  accent: {
    bg: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700',
    text: 'text-white',
    border: 'border-emerald-400/30',
    shadow: 'shadow-emerald-500/25',
    glow: 'shadow-emerald-500/40',
    highlight: '#10B981',
  },
  secondary: {
    bg: 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'border-gray-300/50 dark:border-gray-600/50',
    shadow: 'shadow-gray-500/20 dark:shadow-gray-900/40',
    glow: 'shadow-gray-500/30 dark:shadow-gray-400/20',
    highlight: '#6B7280',
  },
  premium: {
    bg: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500',
    text: 'text-gray-900',
    border: 'border-amber-300/40',
    shadow: 'shadow-amber-500/30',
    glow: 'shadow-amber-500/50',
    highlight: '#F59E0B',
  },
  danger: {
    bg: 'bg-gradient-to-br from-red-500 via-red-600 to-red-700',
    text: 'text-white',
    border: 'border-red-400/30',
    shadow: 'shadow-red-500/25',
    glow: 'shadow-red-500/40',
    highlight: '#EF4444',
  },
  ghost: {
    bg: 'bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200/60 dark:border-gray-700/60',
    shadow: 'shadow-transparent',
    glow: 'shadow-gray-500/20',
    highlight: '#9CA3AF',
  },
} as const;

const SIGNATURE_SIZES = {
  xs: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    notch: '4px',
    minHeight: '24px',
    iconSize: '12px',
  },
  sm: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    notch: '6px',
    minHeight: '32px',
    iconSize: '14px',
  },
  md: {
    padding: 'px-4 py-2',
    text: 'text-base',
    notch: '8px',
    minHeight: '40px',
    iconSize: '16px',
  },
  lg: {
    padding: 'px-6 py-3',
    text: 'text-lg',
    notch: '10px',
    minHeight: '48px',
    iconSize: '20px',
  },
  xl: {
    padding: 'px-8 py-4',
    text: 'text-xl',
    notch: '12px',
    minHeight: '56px',
    iconSize: '24px',
  },
  hero: {
    padding: 'px-12 py-6',
    text: 'text-2xl',
    notch: '16px',
    minHeight: '72px',
    iconSize: '32px',
  },
} as const;

// ============================================================================
// TRADELIA SIGNATURE COMPONENT
// ============================================================================

export const TradeliaSignatureComponent: React.FC<TradeliaSignatureComponentProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'standard',
  texture = 'grain',
  interaction = 'hover',
  className = '',
  onClick,
  onSignatureMoment,
  disabled = false,
  loading = false,
  badge,
  icon,
  href,
  'aria-label': ariaLabel,
}) => {
  const { shouldAnimate } = usePerformanceOptimization();
  const { announce, generateId } = useAccessibility();

  const [isHovered, setIsHovered] = useState(false);
  const [triggerMoment, setTriggerMoment] = useState(false);

  const variantConfig = SIGNATURE_VARIANTS[variant];
  const sizeConfig = SIGNATURE_SIZES[size];

  // Handle signature moment trigger
  const handleSignatureMoment = useCallback(() => {
    if (onSignatureMoment && shouldAnimate('high')) {
      setTriggerMoment(true);
      setTimeout(() => setTriggerMoment(false), 100);
    }
  }, [onSignatureMoment, shouldAnimate]);

  // Handle click with signature moment
  const handleClick = useCallback(() => {
    if (disabled || loading) {
      return;
    }

    handleSignatureMoment();
    onClick?.();

    if (onSignatureMoment) {
      announce(`Action completed with ${onSignatureMoment} celebration`, 'polite');
    }
  }, [disabled, loading, handleSignatureMoment, onClick, onSignatureMoment, announce]);

  // Generate signature shape styles
  const getShapeStyles = useCallback(() => {
    const notchSize = sizeConfig.notch;

    switch (shape) {
      case 'standard':
        return {
          clipPath: `polygon(0 0, calc(100% - ${notchSize}) 0, 100% ${notchSize}, 100% 100%, 0 100%)`,
          borderRadius: '0.375rem',
        };
      case 'pill':
        return {
          borderRadius: '9999px',
          clipPath: 'none',
        };
      case 'square':
        return {
          clipPath: `polygon(0 0, calc(100% - ${notchSize}) 0, 100% ${notchSize}, 100% 100%, ${notchSize} 100%, 0 calc(100% - ${notchSize}))`,
          borderRadius: '0.25rem',
          aspectRatio: '1',
        };
      case 'circle':
        return {
          borderRadius: '50%',
          clipPath: 'none',
          aspectRatio: '1',
        };
      case 'diamond':
        return {
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          borderRadius: '0',
          aspectRatio: '1',
        };
      default:
        return {
          borderRadius: '0.375rem',
          clipPath: 'none',
        };
    }
  }, [shape, sizeConfig.notch]);

  // Generate texture classes
  const getTextureClasses = useCallback(() => {
    const baseTexture = 'relative overflow-hidden';

    switch (texture) {
      case 'smooth':
        return baseTexture;
      case 'grain':
        return `${baseTexture} signature-grain-texture`;
      case 'glass':
        return `${baseTexture} signature-glass-texture backdrop-blur-sm`;
      case 'metal':
        return `${baseTexture} signature-metal-texture`;
      case 'fabric':
        return `${baseTexture} signature-fabric-texture`;
      default:
        return baseTexture;
    }
  }, [texture]);

  // Generate interaction classes
  const getInteractionClasses = useCallback(() => {
    if (disabled) {
      return 'cursor-not-allowed opacity-50';
    }
    if (loading) {
      return 'cursor-wait opacity-75';
    }

    const baseInteraction = 'transition-all duration-300 ease-out';

    switch (interaction) {
      case 'none':
        return baseInteraction;
      case 'hover':
        return `${baseInteraction} hover:scale-105 hover:shadow-lg`;
      case 'press':
        return `${baseInteraction} hover:scale-105 active:scale-95 hover:shadow-lg`;
      case 'signature':
        return `${baseInteraction} signature-interaction hover:scale-105 active:scale-95 hover:shadow-xl`;
      case 'magnetic':
        return `${baseInteraction} magnetic-interaction hover:scale-110 hover:shadow-2xl`;
      default:
        return baseInteraction;
    }
  }, [disabled, loading, interaction]);

  // Combine all classes
  const finalClasses = [
    // Base classes
    'inline-flex items-center justify-center font-medium',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'will-change-transform',

    // Variant classes
    variantConfig.bg,
    variantConfig.text,
    variantConfig.border,

    // Size classes
    sizeConfig.padding,
    sizeConfig.text,

    // Texture classes
    getTextureClasses(),

    // Interaction classes
    getInteractionClasses(),

    // Shadow classes
    isHovered && !disabled ? variantConfig.glow : variantConfig.shadow,

    // Custom classes
    className,
  ].filter(Boolean).join(' ');

  // Component element (button, link, or div)
  const Component = href ? 'a' : onClick ? 'button' : 'div';
  const componentProps = {
    'className': finalClasses,
    'style': {
      ...getShapeStyles(),
      minHeight: sizeConfig.minHeight,
    },
    'onClick': handleClick,
    'onMouseEnter': () => setIsHovered(true),
    'onMouseLeave': () => setIsHovered(false),
    'onMouseDown': () => setIsHovered(true),
    'onMouseUp': () => setIsHovered(false),
    'disabled': disabled || loading,
    'aria-label': ariaLabel,
    'aria-describedby': badge ? generateId('badge') : undefined,
    ...(href && { href }),
  };

  return (
    <TradeliaSignatureMoment
      type={onSignatureMoment || 'lesson-complete'}
      trigger={triggerMoment}
      intensity="standard"
    >
      <Component {...componentProps}>
        {/* Signature Texture Overlay */}
        {texture === 'grain' && (
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, ${variantConfig.highlight} 1px, transparent 0),
                radial-gradient(circle at 3px 3px, ${variantConfig.highlight} 0.5px, transparent 0)
              `,
              backgroundSize: '8px 8px, 12px 12px',
            }}
          />
        )}

        {/* Signature Highlight Lines */}
        {(texture === 'grain' || texture === 'glass') && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40"
            style={{
              background: `linear-gradient(90deg, transparent, ${variantConfig.highlight}, transparent)`,
            }}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="rounded-inherit absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {icon && (
            <span
              className="shrink-0"
              style={{ fontSize: sizeConfig.iconSize }}
            >
              {icon}
            </span>
          )}

          <span className="flex-1 text-center">
            {children}
          </span>

          {badge && (
            <span
              id={generateId('badge')}
              className="min-w-[20px] shrink-0 rounded-full bg-white/20 px-1.5 py-0.5 text-center text-xs font-bold"
            >
              {badge}
            </span>
          )}
        </div>

        {/* Signature Glow Effect */}
        {isHovered && shouldAnimate('medium') && (
          <div
            className="rounded-inherit pointer-events-none absolute inset-0 animate-pulse opacity-50"
            style={{
              boxShadow: `0 0 20px ${variantConfig.highlight}40, inset 0 1px 0 ${variantConfig.highlight}20`,
            }}
          />
        )}
      </Component>
    </TradeliaSignatureMoment>
  );
};

// ============================================================================
// PRESET SIGNATURE COMPONENTS
// ============================================================================

export const TradeliaPrimaryButton: React.FC<Omit<TradeliaSignatureComponentProps, 'variant'>> = props => (
  <TradeliaSignatureComponent variant="primary" interaction="signature" {...props} />
);

export const TradeliaAccentButton: React.FC<Omit<TradeliaSignatureComponentProps, 'variant'>> = props => (
  <TradeliaSignatureComponent variant="accent" interaction="signature" {...props} />
);

export const TradeliaPremiumCard: React.FC<Omit<TradeliaSignatureComponentProps, 'variant' | 'shape' | 'texture'>> = props => (
  <TradeliaSignatureComponent
    variant="premium"
    shape="standard"
    texture="metal"
    interaction="hover"
    {...props}
  />
);

export const TradeliaAchievementBadge: React.FC<Omit<TradeliaSignatureComponentProps, 'variant' | 'shape' | 'size'>> = props => (
  <TradeliaSignatureComponent
    variant="accent"
    shape="diamond"
    size="sm"
    texture="glass"
    interaction="signature"
    onSignatureMoment="achievement-unlock"
    {...props}
  />
);

export const TradeliaGhostAction: React.FC<Omit<TradeliaSignatureComponentProps, 'variant' | 'interaction'>> = props => (
  <TradeliaSignatureComponent variant="ghost" interaction="press" {...props} />
);

export default TradeliaSignatureComponent;
