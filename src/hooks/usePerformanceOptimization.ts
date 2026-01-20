/**
 * PERFORMANCE OPTIMIZATION HOOK - Enterprise 2026
 *
 * Hook per ottimizzazione intelligente delle performance basato su:
 * - Device capabilities detection
 * - Battery status monitoring
 * - Network conditions
 * - User preferences (prefers-reduced-motion)
 * - Hardware acceleration availability
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type PerformanceLevel = 'minimal' | 'reduced' | 'standard' | 'enhanced';

export type DeviceCapabilities = {
  isLowPowered: boolean;
  isMobile: boolean;
  isHighRefreshRate: boolean;
  supportsHardwareAcceleration: boolean;
  memoryLevel: 'low' | 'medium' | 'high';
};

export type BatteryStatus = {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
};

export type PerformanceConfig = {
  level: PerformanceLevel;
  enableAnimations: boolean;
  enableGPUAcceleration: boolean;
  enableComplexEffects: boolean;
  animationDuration: number;
  maxConcurrentAnimations: number;
};

export type NetworkQuality = 'slow' | 'medium' | 'fast';

// ============================================================================
// PERFORMANCE OPTIMIZATION HOOK
// ============================================================================

export const usePerformanceOptimization = () => {
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    isLowPowered: false,
    isMobile: false,
    isHighRefreshRate: false,
    supportsHardwareAcceleration: true,
    memoryLevel: 'medium',
  });

  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus | null>(null);
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>('medium');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect device capabilities
  const detectDeviceCapabilities = useCallback(() => {
    const capabilities: DeviceCapabilities = {
      isLowPowered: false,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isHighRefreshRate: window.screen?.availWidth > 1920 || window.devicePixelRatio > 2,
      supportsHardwareAcceleration: true,
      memoryLevel: 'medium',
    };

    // Detect low-powered devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      capabilities.isLowPowered = true;
    }

    // Detect memory level
    if ('memory' in navigator) {
      const memory = (navigator as any).memory?.jsHeapSizeLimit || 0;
      if (memory < 1073741824) { // < 1GB
        capabilities.memoryLevel = 'low';
        capabilities.isLowPowered = true;
      } else if (memory > 4294967296) { // > 4GB
        capabilities.memoryLevel = 'high';
      }
    }

    // Test hardware acceleration support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      capabilities.supportsHardwareAcceleration = !!gl;
    } catch {
      capabilities.supportsHardwareAcceleration = false;
    }

    setDeviceCapabilities(capabilities);
  }, []);

  // Monitor battery status
  const monitorBatteryStatus = useCallback(async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        
        const updateBatteryStatus = () => {
          setBatteryStatus({
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          });
        };

        updateBatteryStatus();
        
        battery.addEventListener('chargingchange', updateBatteryStatus);
        battery.addEventListener('levelchange', updateBatteryStatus);
        
        return () => {
          battery.removeEventListener('chargingchange', updateBatteryStatus);
          battery.removeEventListener('levelchange', updateBatteryStatus);
        };
      } catch (error) {
        console.warn('Battery API not available:', error);
        return undefined;
      }
    }
    return undefined;
  }, []);

  // Detect network quality
  const detectNetworkQuality = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateNetworkQuality = () => {
        const effectiveType = connection.effectiveType;
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setNetworkQuality('slow');
        } else if (effectiveType === '3g') {
          setNetworkQuality('medium');
        } else {
          setNetworkQuality('fast');
        }
      };

      updateNetworkQuality();
      connection.addEventListener('change', updateNetworkQuality);
      
      return () => {
        connection.removeEventListener('change', updateNetworkQuality);
      };
    }
    return undefined;
  }, []);

  // Monitor user preferences
  const monitorUserPreferences = useCallback(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const updatePreferences = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreferences();
    mediaQuery.addEventListener('change', updatePreferences);
    
    return () => {
      mediaQuery.removeEventListener('change', updatePreferences);
    };
  }, []);

  // Calculate optimal performance configuration
  const performanceConfig = useMemo((): PerformanceConfig => {
    // Start with standard configuration
    let config: PerformanceConfig = {
      level: 'standard',
      enableAnimations: true,
      enableGPUAcceleration: true,
      enableComplexEffects: true,
      animationDuration: 300,
      maxConcurrentAnimations: 10,
    };

    // Reduce performance for user preferences
    if (prefersReducedMotion) {
      config = {
        level: 'minimal',
        enableAnimations: false,
        enableGPUAcceleration: false,
        enableComplexEffects: false,
        animationDuration: 0,
        maxConcurrentAnimations: 0,
      };
      return config;
    }

    // Reduce performance for low battery
    if (batteryStatus && !batteryStatus.charging && batteryStatus.level < 0.2) {
      config.level = 'reduced';
      config.enableComplexEffects = false;
      config.animationDuration = 150;
      config.maxConcurrentAnimations = 3;
    }

    // Reduce performance for low-powered devices
    if (deviceCapabilities.isLowPowered) {
      config.level = 'reduced';
      config.enableComplexEffects = false;
      config.animationDuration = 200;
      config.maxConcurrentAnimations = 5;
    }

    // Reduce performance for slow network
    if (networkQuality === 'slow') {
      config.enableComplexEffects = false;
      config.maxConcurrentAnimations = 3;
    }

    // Enhance performance for capable devices
    if (deviceCapabilities.memoryLevel === 'high' && 
        deviceCapabilities.isHighRefreshRate && 
        networkQuality === 'fast' &&
        batteryStatus?.charging) {
      config.level = 'enhanced';
      config.animationDuration = 400;
      config.maxConcurrentAnimations = 20;
    }

    // Disable GPU acceleration if not supported
    if (!deviceCapabilities.supportsHardwareAcceleration) {
      config.enableGPUAcceleration = false;
      config.enableComplexEffects = false;
    }

    return config;
  }, [deviceCapabilities, batteryStatus, networkQuality, prefersReducedMotion]);

  // Get CSS classes for performance optimization
  const getPerformanceClasses = useCallback((baseClasses: string = '') => {
    const classes = [baseClasses];

    // Add performance level class
    classes.push(`performance-${performanceConfig.level}`);

    // Add device-specific classes
    if (deviceCapabilities.isMobile) {
      classes.push('device-mobile');
    }
    
    if (deviceCapabilities.isLowPowered) {
      classes.push('low-power-optimized');
    }
    
    if (deviceCapabilities.isHighRefreshRate) {
      classes.push('high-refresh-optimized');
    }

    // Add battery-aware classes
    if (batteryStatus && !batteryStatus.charging && batteryStatus.level < 0.3) {
      classes.push('battery-saving');
    }

    // Add motion preference classes
    if (prefersReducedMotion) {
      classes.push('no-animations');
    } else {
      classes.push('battery-aware-animation');
    }

    // Add GPU acceleration classes
    if (performanceConfig.enableGPUAcceleration) {
      classes.push('gpu-accelerated');
    }

    return classes.filter(Boolean).join(' ');
  }, [performanceConfig, deviceCapabilities, batteryStatus, prefersReducedMotion]);

  // Get optimized animation duration
  const getAnimationDuration = useCallback((baseDuration: number = 300) => {
    if (!performanceConfig.enableAnimations) {
      return 0;
    }

    const multiplier = performanceConfig.animationDuration / 300;
    return Math.round(baseDuration * multiplier);
  }, [performanceConfig]);

  // Check if animation should be enabled
  const shouldAnimate = useCallback((priority: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    if (!performanceConfig.enableAnimations) {
      return false;
    }

    if (performanceConfig.level === 'minimal') {
      return priority === 'critical'; // Only critical animations in minimal mode
    }

    if (performanceConfig.level === 'reduced' && priority === 'low') {
      return false;
    }

    return true;
  }, [performanceConfig]);

  // Initialize monitoring
  useEffect(() => {
    detectDeviceCapabilities();
    monitorUserPreferences();
    
    const cleanupBattery = monitorBatteryStatus();
    const cleanupNetwork = detectNetworkQuality();
    
    return () => {
      cleanupBattery?.then(cleanup => cleanup?.());
      cleanupNetwork?.();
    };
  }, [detectDeviceCapabilities, monitorBatteryStatus, detectNetworkQuality, monitorUserPreferences]);

  return {
    performanceConfig,
    deviceCapabilities,
    batteryStatus,
    networkQuality,
    prefersReducedMotion,
    getPerformanceClasses,
    getAnimationDuration,
    shouldAnimate,
  };
};

export default usePerformanceOptimization;