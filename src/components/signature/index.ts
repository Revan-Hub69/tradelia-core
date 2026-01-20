/**
 * Tradelia Signature Design System
 * 
 * Enterprise-grade components with signature visual fingerprint
 * Based on 2026 design trends: Liquid Glass, Anti-AI Crafting, Signature Branding
 */

export { TradelliaGlass, type TradelliaGlassProps } from './TradelliaGlass';
export { GlassCard, type GlassCardProps } from './GlassCard';
export { GlassSurface, type GlassSurfaceProps } from './GlassSurface';
export { GlassModal, type GlassModalProps } from './GlassModal';
export { SignatureShape, type SignatureShapeProps } from './SignatureShapes';
export { 
  VisualWeight, 
  HeroBanner, 
  ContentCard, 
  SupportingElement,
  type VisualWeightProps 
} from './VisualHierarchy';

// Signature Micro-Interactions System
export {
  useSignaturePressFeeback,
  HapticVisualFeedback,
  SignatureButton,
  SignatureCard,
  SignatureMicroInteractionsShowcase,
  type PressDepth,
  type InteractionContext,
  type DeviceType,
  type HapticIntensity,
  type SignaturePressConfig,
  type MicroInteractionState,
} from './SignatureMicroInteractions';

export { SignatureMicroInteractionsExample } from './SignatureMicroInteractionsExample';

// Adaptive Micro-Copy System
export {
  MicroCopyProvider,
  useMicroCopyContext,
  useAdaptiveMicroCopy,
  AdaptiveButton,
  AdaptiveStatus,
  AdaptiveMicroCopyShowcase,
  type UserState,
  type EmotionalState,
  type TaskContext,
  type ActionType,
  type ToneStyle,
  type MicroCopyContext,
  type AdaptiveMicroCopyConfig,
} from './AdaptiveMicroCopy';

export { AdaptiveMicroCopyExample } from './AdaptiveMicroCopyExample';