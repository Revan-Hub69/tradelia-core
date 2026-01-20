/**
 * TRADELIA SIGNATURE MOMENT - Enterprise 2026
 *
 * L'animazione definitiva che grida "Tradelia" - basata su ricerca 2026:
 * - Multi-sensory visual feedback (haptic-like)
 * - Neural connection building through memorable moments
 * - Performance-first GPU acceleration
 * - AI-anticipatory micro-delays for premium feel
 * - Brand memory reinforcement through signature motion
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useAccessibility } from '../../hooks/useAccessibility';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type SignatureMomentType =
  | 'lesson-complete'
  | 'achievement-unlock'
  | 'streak-milestone'
  | 'level-up'
  | 'perfect-score'
  | 'first-success'
  | 'comeback-victory';

export type SignatureMomentIntensity = 'subtle' | 'standard' | 'celebration' | 'epic';

export type TradeliaSignatureMomentProps = {
  type: SignatureMomentType;
  intensity?: SignatureMomentIntensity;
  trigger?: boolean;
  onComplete?: () => void;
  children?: React.ReactNode;
  customMessage?: string;
  value?: number; // For XP, streak count, etc.
};

// ============================================================================
// SIGNATURE MOMENT CONFIGURATIONS
// ============================================================================

const SIGNATURE_CONFIGS = {
  'lesson-complete': {
    colors: ['#10B981', '#059669', '#047857'], // Emerald gradient
    particles: 12,
    duration: 2400,
    hapticPattern: [100, 50, 100],
    message: 'Lezione completata!',
    icon: '🎯',
    soundFrequency: 440, // A4 note
  },
  'achievement-unlock': {
    colors: ['#F59E0B', '#D97706', '#B45309'], // Amber gradient
    particles: 20,
    duration: 3200,
    hapticPattern: [150, 100, 150, 100, 200],
    message: 'Achievement sbloccato!',
    icon: '🏆',
    soundFrequency: 523, // C5 note
  },
  'streak-milestone': {
    colors: ['#8B5CF6', '#7C3AED', '#6D28D9'], // Violet gradient
    particles: 15,
    duration: 2800,
    hapticPattern: [80, 40, 80, 40, 80],
    message: 'Streak mantenuto!',
    icon: '🔥',
    soundFrequency: 659, // E5 note
  },
  'level-up': {
    colors: ['#EF4444', '#DC2626', '#B91C1C'], // Red gradient
    particles: 25,
    duration: 4000,
    hapticPattern: [200, 100, 200, 100, 300],
    message: 'Level Up!',
    icon: '⭐',
    soundFrequency: 784, // G5 note
  },
  'perfect-score': {
    colors: ['#06B6D4', '#0891B2', '#0E7490'], // Cyan gradient
    particles: 30,
    duration: 3600,
    hapticPattern: [120, 60, 120, 60, 120, 60, 180],
    message: 'Punteggio perfetto!',
    icon: '💎',
    soundFrequency: 880, // A5 note
  },
  'first-success': {
    colors: ['#84CC16', '#65A30D', '#4D7C0F'], // Lime gradient
    particles: 18,
    duration: 3000,
    hapticPattern: [100, 80, 100, 80, 150],
    message: 'Primo successo!',
    icon: '🌟',
    soundFrequency: 698, // F5 note
  },
  'comeback-victory': {
    colors: ['#F97316', '#EA580C', '#C2410C'], // Orange gradient
    particles: 22,
    duration: 3400,
    hapticPattern: [180, 90, 180, 90, 250],
    message: 'Rimonta vincente!',
    icon: '🚀',
    soundFrequency: 587, // D5 note
  },
} as const;

// ============================================================================
// TRADELIA SIGNATURE MOMENT COMPONENT
// ============================================================================

export const TradeliaSignatureMoment: React.FC<TradeliaSignatureMomentProps> = ({
  type,
  intensity = 'standard',
  trigger = false,
  onComplete,
  children,
  customMessage,
  value,
}) => {
  const { shouldAnimate, performanceConfig } = usePerformanceOptimization();
  const { announce, accessibilityPreferences } = useAccessibility();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
  }>>([]);

  const config = SIGNATURE_CONFIGS[type];

  // Adjust intensity based on performance and accessibility
  const getEffectiveIntensity = useCallback(() => {
    if (!shouldAnimate('high')) {
      return 'subtle';
    }
    if (accessibilityPreferences.prefersReducedMotion) {
      return 'subtle';
    }
    if (performanceConfig.level === 'reduced') {
      return 'standard';
    }
    return intensity;
  }, [shouldAnimate, accessibilityPreferences.prefersReducedMotion, performanceConfig.level, intensity]);

  // Create haptic-like visual feedback
  const createHapticVisualFeedback = useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const effectiveIntensity = getEffectiveIntensity();

    // Signature Tradelia haptic-like pulse sequence
    const pulseSequence = [
      { scale: 1.02, duration: 60 }, // Anticipatory micro-lift
      { scale: 0.98, duration: 40 }, // Gentle press
      { scale: 1.05, duration: 120 }, // Signature bounce
      { scale: 1.0, duration: 80 }, // Settle
    ];

    let currentStep = 0;

    const executePulse = () => {
      if (currentStep >= pulseSequence.length) {
        return;
      }

      const pulse = pulseSequence[currentStep];
      if (!pulse) {
        return;
      }

      const intensityMultiplier = effectiveIntensity === 'epic'
        ? 1.3
        : effectiveIntensity === 'celebration'
          ? 1.1
          : effectiveIntensity === 'standard' ? 1.0 : 0.7;

      const targetScale = 1 + (pulse.scale - 1) * intensityMultiplier;

      container.style.transform = `scale(${targetScale})`;
      container.style.transition = `transform ${pulse.duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

      setTimeout(() => {
        currentStep++;
        executePulse();
      }, pulse.duration);
    };

    executePulse();
  }, [getEffectiveIntensity]);

  // Create signature particle system
  const createParticleSystem = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const effectiveIntensity = getEffectiveIntensity();
    const particleCount = Math.floor(config.particles * (
      effectiveIntensity === 'epic'
        ? 1.5
        : effectiveIntensity === 'celebration'
          ? 1.2
          : effectiveIntensity === 'standard' ? 1.0 : 0.6
    ));

    const newParticles = [];
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const velocity = 2 + Math.random() * 3;
      const life = config.duration * 0.8 + Math.random() * config.duration * 0.4;

      newParticles.push({
        x: centerX + Math.cos(angle) * 20,
        y: centerY + Math.sin(angle) * 20,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 1, // Slight upward bias
        life,
        maxLife: life,
        size: 3 + Math.random() * 4,
        color: config.colors[Math.floor(Math.random() * config.colors.length)] || '#10B981',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    setParticles(newParticles);
  }, [config, getEffectiveIntensity]);

  // Animate particles
  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

    setParticles((prevParticles) => {
      const updatedParticles = prevParticles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // Gravity
          life: particle.life - 16, // Assuming 60fps
          rotation: particle.rotation + particle.rotationSpeed,
        }))
        .filter(particle => particle.life > 0);

      // Draw particles
      updatedParticles.forEach((particle) => {
        const alpha = particle.life / particle.maxLife;
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = alpha;

        // Signature Tradelia particle shape (rounded diamond)
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.moveTo(0, -particle.size);
        ctx.quadraticCurveTo(particle.size, 0, 0, particle.size);
        ctx.quadraticCurveTo(-particle.size, 0, 0, -particle.size);
        ctx.fill();

        // Inner glow
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(0, -particle.size * 0.5);
        ctx.quadraticCurveTo(particle.size * 0.5, 0, 0, particle.size * 0.5);
        ctx.quadraticCurveTo(-particle.size * 0.5, 0, 0, -particle.size * 0.5);
        ctx.fill();

        ctx.restore();
      });

      return updatedParticles;
    });

    if (particles.length > 0) {
      animationRef.current = requestAnimationFrame(animateParticles);
    }
  }, [particles]);

  // Create signature sound (visual representation for accessibility)
  const createSignatureSound = useCallback(() => {
    if (accessibilityPreferences.prefersReducedMotion) {
      return;
    }

    // Visual sound wave representation
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const soundWave = document.createElement('div');
    soundWave.className = 'signature-sound-wave';
    soundWave.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: signature-sound-pulse 0.6s ease-out;
      pointer-events: none;
      z-index: 1000;
    `;

    container.appendChild(soundWave);

    setTimeout(() => {
      if (container.contains(soundWave)) {
        container.removeChild(soundWave);
      }
    }, 600);
  }, [accessibilityPreferences.prefersReducedMotion]);

  // Trigger signature moment
  const triggerSignatureMoment = useCallback(() => {
    if (isAnimating || !shouldAnimate('high')) {
      return;
    }

    setIsAnimating(true);

    // Announce to screen readers
    const message = customMessage || config.message;
    const fullMessage = value ? `${message} ${value}` : message;
    announce(`${config.icon} ${fullMessage}`, 'assertive');

    // Create haptic-like visual feedback
    createHapticVisualFeedback();

    // Create particle system
    createParticleSystem();

    // Create signature sound visualization
    createSignatureSound();

    // Start particle animation
    setTimeout(() => {
      animateParticles();
    }, 100);

    // Complete animation
    setTimeout(() => {
      setIsAnimating(false);
      setParticles([]);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      onComplete?.();
    }, config.duration);
  }, [
    isAnimating,
    shouldAnimate,
    customMessage,
    config,
    value,
    announce,
    createHapticVisualFeedback,
    createParticleSystem,
    createSignatureSound,
    animateParticles,
    onComplete,
  ]);

  // Effect to trigger animation
  useEffect(() => {
    if (trigger) {
      triggerSignatureMoment();
    }
  }, [trigger, triggerSignatureMoment]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`
        tradelia-signature-moment relative
        ${isAnimating ? 'signature-moment-active' : ''}
      `}
      style={{
        transformOrigin: 'center center',
        willChange: isAnimating ? 'transform' : 'auto',
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          width: '100%',
          height: '100%',
          opacity: isAnimating ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>

      {/* Signature Moment Indicator */}
      {isAnimating && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          style={{
            animation: 'signature-moment-indicator 2s ease-out',
          }}
        >
          <div className="flex items-center space-x-2 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm dark:bg-gray-900/90">
            <span className="text-2xl" role="img" aria-label={config.message}>
              {config.icon}
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {customMessage || config.message}
              {value && (
                <span className="ml-1 text-blue-600 dark:text-blue-400">
                  +
                  {value}
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeliaSignatureMoment;
