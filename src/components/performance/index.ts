/**
 * Performance Optimization Components
 *
 * Enterprise-grade performance optimization system for animations
 */

export {
  type AccessibilityPreferences,
  type AnnouncementPriority,
  type FocusTrapOptions,
  useAccessibility,
} from '../../hooks/useAccessibility';
export {
  type BatteryStatus,
  type DeviceCapabilities,
  type NetworkQuality,
  type PerformanceConfig,
  type PerformanceLevel,
  usePerformanceOptimization,
} from '../../hooks/usePerformanceOptimization';
export {
  type AnimationPriority,
  type AnimationType,
  PerformanceOptimizedAnimation,
  type PerformanceOptimizedAnimationProps,
  PerformanceOptimizedButton,
  type PerformanceOptimizedButtonProps,
  PerformanceOptimizedCard,
  type PerformanceOptimizedCardProps,
} from './PerformanceOptimizedAnimation';
export { PerformanceShowcase } from './PerformanceShowcase';
