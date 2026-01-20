/**
 * PERFORMANCE & ACCESSIBILITY SHOWCASE - Enterprise 2026
 *
 * Showcase completo delle ottimizzazioni implementate:
 * - Performance optimization system
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Battery-aware motion reduction
 * - GPU acceleration
 * - Screen reader support
 */

import React, { useState, useCallback } from 'react';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';
import { useAccessibility } from '../../hooks/useAccessibility';
import {
  PerformanceOptimizedAnimation,
  PerformanceOptimizedButton,
  PerformanceOptimizedCard,
} from './PerformanceOptimizedAnimation';

// ============================================================================
// PERFORMANCE SHOWCASE COMPONENT
// ============================================================================

export const PerformanceShowcase: React.FC = () => {
  const {
    performanceConfig,
    deviceCapabilities,
    batteryStatus,
    networkQuality,
    getAnimationDuration,
    shouldAnimate,
  } = usePerformanceOptimization();

  const {
    isKeyboardNavigation,
    accessibilityPreferences,
    announce,
    generateId,
  } = useAccessibility();

  const [demoState, setDemoState] = useState({
    animationCount: 0,
    lastAction: '',
  });

  const handleDemoAction = useCallback((action: string) => {
    setDemoState(prev => ({
      animationCount: prev.animationCount + 1,
      lastAction: action,
    }));
    
    announce(`${action} executed. Animation ${shouldAnimate() ? 'enabled' : 'disabled'} based on performance settings.`);
  }, [announce, shouldAnimate]);

  const performanceLevel = performanceConfig.level;
  const animationsEnabled = performanceConfig.enableAnimations;

  return (
    <div className="performance-showcase p-8 space-y-8">
      {/* Header */}
      <div className="showcase-header">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Performance & Accessibility System v2.0
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Sistema completo di ottimizzazione performance e accessibilità WCAG 2.1 AA
        </p>
      </div>

      {/* Skip Links for Accessibility */}
      <div className="skip-links">
        <a href="#performance-status" className="sr-only-focusable">
          Skip to Performance Status
        </a>
        <a href="#demo-controls" className="sr-only-focusable">
          Skip to Demo Controls
        </a>
        <a href="#technical-details" className="sr-only-focusable">
          Skip to Technical Details
        </a>
      </div>

      {/* Performance Status */}
      <section id="performance-status" className="performance-status">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Current Performance Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PerformanceOptimizedCard
            animationPriority="low"
            enableHover={shouldAnimate('low')}
            className="text-center"
          >
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${
                performanceLevel === 'enhanced' ? 'text-green-600' :
                performanceLevel === 'standard' ? 'text-blue-600' :
                performanceLevel === 'reduced' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {performanceLevel.toUpperCase()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Performance Level
              </div>
            </div>
          </PerformanceOptimizedCard>

          <PerformanceOptimizedCard
            animationPriority="low"
            enableHover={shouldAnimate('low')}
            className="text-center"
          >
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${animationsEnabled ? 'text-green-600' : 'text-red-600'}`}>
                {animationsEnabled ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Animations
              </div>
            </div>
          </PerformanceOptimizedCard>

          <PerformanceOptimizedCard
            animationPriority="low"
            enableHover={shouldAnimate('low')}
            className="text-center"
          >
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${
                deviceCapabilities.supportsHardwareAcceleration ? 'text-green-600' : 'text-red-600'
              }`}>
                {deviceCapabilities.supportsHardwareAcceleration ? 'GPU' : 'CPU'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Acceleration
              </div>
            </div>
          </PerformanceOptimizedCard>

          <PerformanceOptimizedCard
            animationPriority="low"
            enableHover={shouldAnimate('low')}
            className="text-center"
          >
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {getAnimationDuration(300)}ms
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Animation Duration
              </div>
            </div>
          </PerformanceOptimizedCard>
        </div>
      </section>

      {/* Demo Controls */}
      <section id="demo-controls" className="demo-controls">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Interactive Demo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <PerformanceOptimizedButton
            variant="primary"
            animationPriority="high"
            onClick={() => handleDemoAction('Primary Action')}
            aria-describedby={generateId('primary-desc')}
          >
            Primary Action
          </PerformanceOptimizedButton>
          
          <PerformanceOptimizedButton
            variant="secondary"
            animationPriority="medium"
            onClick={() => handleDemoAction('Secondary Action')}
            aria-describedby={generateId('secondary-desc')}
          >
            Secondary Action
          </PerformanceOptimizedButton>
          
          <PerformanceOptimizedButton
            variant="ghost"
            animationPriority="low"
            onClick={() => handleDemoAction('Ghost Action')}
            aria-describedby={generateId('ghost-desc')}
          >
            Ghost Action
          </PerformanceOptimizedButton>
        </div>

        {/* Demo State Display */}
        <div className="demo-state bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Actions Performed:</strong> {demoState.animationCount}
            </div>
            <div>
              <strong>Last Action:</strong> {demoState.lastAction || 'None'}
            </div>
          </div>
        </div>
      </section>

      {/* Animation Examples */}
      <section className="animation-examples">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Animation Examples
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PerformanceOptimizedAnimation
            type="signature-press"
            priority="high"
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
            fallbackClassName="bg-gray-100 dark:bg-gray-700"
          >
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Signature Press</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Click to see press feedback
              </div>
            </div>
          </PerformanceOptimizedAnimation>

          <PerformanceOptimizedAnimation
            type="signature-hover"
            priority="medium"
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            fallbackClassName="bg-gray-100 dark:bg-gray-700"
          >
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Signature Hover</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hover to see lift effect
              </div>
            </div>
          </PerformanceOptimizedAnimation>

          <PerformanceOptimizedAnimation
            type="signature-shimmer"
            priority="low"
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            fallbackClassName="bg-gray-100 dark:bg-gray-700"
          >
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Signature Shimmer</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Shimmer loading effect
              </div>
            </div>
          </PerformanceOptimizedAnimation>
        </div>
      </section>

      {/* Technical Details */}
      <section id="technical-details" className="technical-details">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Technical Details
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Capabilities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="text-lg font-semibold mb-4">Device Capabilities</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Mobile Device:</span>
                <span className={deviceCapabilities.isMobile ? 'text-green-600' : 'text-gray-600'}>
                  {deviceCapabilities.isMobile ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Low Powered:</span>
                <span className={deviceCapabilities.isLowPowered ? 'text-red-600' : 'text-green-600'}>
                  {deviceCapabilities.isLowPowered ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>High Refresh Rate:</span>
                <span className={deviceCapabilities.isHighRefreshRate ? 'text-green-600' : 'text-gray-600'}>
                  {deviceCapabilities.isHighRefreshRate ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Memory Level:</span>
                <span className={`${
                  deviceCapabilities.memoryLevel === 'high' ? 'text-green-600' :
                  deviceCapabilities.memoryLevel === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {deviceCapabilities.memoryLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Accessibility Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="text-lg font-semibold mb-4">Accessibility Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Keyboard Navigation:</span>
                <span className={isKeyboardNavigation ? 'text-green-600' : 'text-gray-600'}>
                  {isKeyboardNavigation ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Reduced Motion:</span>
                <span className={accessibilityPreferences.prefersReducedMotion ? 'text-yellow-600' : 'text-green-600'}>
                  {accessibilityPreferences.prefersReducedMotion ? 'Preferred' : 'Normal'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>High Contrast:</span>
                <span className={accessibilityPreferences.prefersHighContrast ? 'text-yellow-600' : 'text-green-600'}>
                  {accessibilityPreferences.prefersHighContrast ? 'Preferred' : 'Normal'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Color Scheme:</span>
                <span className="text-blue-600">
                  {accessibilityPreferences.colorScheme}
                </span>
              </div>
            </div>
          </div>

          {/* Battery Status */}
          {batteryStatus && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold mb-4">Battery Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className={`${
                    batteryStatus.level > 0.5 ? 'text-green-600' :
                    batteryStatus.level > 0.2 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {Math.round(batteryStatus.level * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Charging:</span>
                  <span className={batteryStatus.charging ? 'text-green-600' : 'text-gray-600'}>
                    {batteryStatus.charging ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Network Quality */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="text-lg font-semibold mb-4">Network Quality</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Connection:</span>
                <span className={`${
                  networkQuality === 'fast' ? 'text-green-600' :
                  networkQuality === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {networkQuality}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Region for Screen Reader Announcements */}
      <div
        id="accessibility-live-region"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  );
};

export default PerformanceShowcase;