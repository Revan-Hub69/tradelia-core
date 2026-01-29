'use client';

import { useCallback, useEffect, useState } from 'react';

import { cn } from '../../utils/Helpers';
import type { AnimationContext, SemanticType } from './SemanticAnimations';

export const useSemanticAnimations = () => {
  const [currentAnimation, setCurrentAnimation] = useState<SemanticType | null>(null);
  const [animationQueue, setAnimationQueue] = useState<SemanticType[]>([]);

  const triggerAnimation = useCallback((type: SemanticType) => {
    setCurrentAnimation(type);

    const durations: Record<SemanticType, number> = {
      enter: 300,
      exit: 200,
      success: 600,
      error: 400,
      warning: 350,
      info: 250,
      loading: 1200,
      focus: 200,
      hover: 180,
      press: 120,
      complete: 800,
      progress: 400,
    };

    const duration = durations[type];

    setTimeout(() => {
      setCurrentAnimation(null);
    }, duration);
  }, []);

  const queueAnimation = useCallback((type: SemanticType) => {
    setAnimationQueue(prev => [...prev, type]);
  }, []);

  useEffect(() => {
    if (animationQueue.length > 0 && !currentAnimation) {
      const nextAnimation = animationQueue[0];
      if (nextAnimation) {
        setAnimationQueue(prev => prev.slice(1));
        triggerAnimation(nextAnimation);
      }
    }
  }, [animationQueue, currentAnimation, triggerAnimation]);

  return {
    currentAnimation,
    triggerAnimation,
    queueAnimation,
    isAnimating: currentAnimation !== null,
  };
};

export const semanticAnimationDefinitions = {
  enter: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },

  exit: {
    exit: {
      opacity: 0,
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: [0.55, 0.055, 0.675, 0.19],
      },
    },
  },

  success: {
    animate: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, 0],
      transition: {
        duration: 0.6,
        times: [0, 0.3, 1],
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  },

  error: {
    animate: {
      x: [0, -4, 4, -2, 2, 0],
      transition: {
        duration: 0.4,
        ease: [0.68, -0.55, 0.265, 1.55],
      },
    },
  },

  warning: {
    animate: {
      scale: [1, 1.02, 1],
      y: [0, -2, 0],
      transition: {
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },

  loading: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },

  complete: {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, 0],
      y: [0, -5, 0],
      transition: {
        duration: 0.8,
        times: [0, 0.4, 1],
        ease: [0.175, 0.885, 0.32, 1.275],
      },
    },
  },

  progress: {
    animate: {
      x: [0, 10, 0],
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
} as const;

export const getSemanticAnimation = (type: SemanticType, context?: AnimationContext) => {
  const baseClass = `semantic-${type}`;
  const contextClass = context ? `semantic-context-${context}` : '';

  return cn(baseClass, contextClass);
};
