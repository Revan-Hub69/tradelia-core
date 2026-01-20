/**
 * Performance Optimization Components
 * 
 * Enterprise-grade performance optimization system for animations
 */

export {
  PerformanceOptimizedAnimation,
  PerformanceOptimizedButton,
  PerformanceOptimizedCard,
  type PerformanceOptimizedAnimationProps,
  type PerformanceOptimizedButtonProps,
  type PerformanceOptimizedCardProps,
  type AnimationPriority,
  type AnimationType,
} from './PerformanceOptimizedAnimation';

export { PerformanceShowcase } from './PerformanceShowcase';

export {
  usePerformanceOptimization,
  type PerformanceLevel,
  type DeviceCapabilities,
  type BatteryStatus,
  type PerformanceConfig,
  type NetworkQuality,
} from '../../hooks/usePerformanceOptimization';

export {
  useAccessibility,
  type AnnouncementPriority,
  type FocusTrapOptions,
  type AccessibilityPreferences,
} from '../../hooks/useAccessibility';