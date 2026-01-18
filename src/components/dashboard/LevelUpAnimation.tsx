'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles } from 'lucide-react';

import { cn } from '@/utils/Helpers';

type LevelUpAnimationProps = {
  isVisible: boolean;
  newLevel: number;
  onComplete?: () => void;
  className?: string;
};

/**
 * LevelUpAnimation - Level-up celebration component
 * 
 * Requirements: 3.2
 * - Implementare level-up animations
 * 
 * Features:
 * - Full-screen celebration overlay
 * - Animated trophy and level display
 * - Particle effects and sparkles
 * - Auto-dismiss after animation
 * - Premium micro-interactions
 */
export const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({
  isVisible,
  newLevel,
  onComplete,
  className = '',
}) => {
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'celebrate' | 'exit'>('enter');

  useEffect(() => {
    if (!isVisible) {
      setAnimationPhase('enter');
      return;
    }

    // Animation sequence
    const timer1 = setTimeout(() => setAnimationPhase('celebrate'), 500);
    const timer2 = setTimeout(() => setAnimationPhase('exit'), 2500);
    const timer3 = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm',
      animationPhase === 'enter' && 'animate-in fade-in duration-300',
      animationPhase === 'exit' && 'animate-out fade-out duration-500',
      className
    )}>
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'absolute size-2 rounded-full bg-primary/60',
              animationPhase === 'celebrate' && 'animate-bounce'
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          />
        ))}
      </div>

      {/* Main celebration content */}
      <div className={cn(
        'relative text-center',
        animationPhase === 'enter' && 'animate-in zoom-in-50 duration-500',
        animationPhase === 'celebrate' && 'animate-pulse',
        animationPhase === 'exit' && 'animate-out zoom-out-50 duration-300'
      )}>
        {/* Trophy icon with glow */}
        <div className="relative mb-6">
          <div className={cn(
            'mx-auto flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-2xl',
            animationPhase === 'celebrate' && 'animate-spin-slow shadow-yellow-500/50'
          )}>
            <Trophy className="size-12 text-white" />
          </div>
          
          {/* Sparkles around trophy */}
          {animationPhase === 'celebrate' && (
            <>
              <Sparkles className="absolute -top-2 -right-2 size-6 animate-bounce text-yellow-400" />
              <Sparkles className="absolute -bottom-2 -left-2 size-6 animate-bounce text-yellow-400" style={{ animationDelay: '0.5s' }} />
              <Star className="absolute top-0 left-0 size-4 animate-ping text-orange-400" />
              <Star className="absolute bottom-0 right-0 size-4 animate-ping text-orange-400" style={{ animationDelay: '0.3s' }} />
            </>
          )}
        </div>

        {/* Level up text */}
        <div className="space-y-2">
          <h1 className={cn(
            'text-4xl font-bold text-white md:text-6xl',
            animationPhase === 'celebrate' && 'animate-bounce'
          )}>
            LEVEL UP!
          </h1>
          
          <div className={cn(
            'text-2xl font-semibold text-yellow-400 md:text-3xl',
            animationPhase === 'celebrate' && 'animate-pulse'
          )}>
            Livello
            {' '}
            {newLevel}
          </div>
          
          <p className="text-lg text-white/80 md:text-xl">
            Congratulazioni! Hai raggiunto un nuovo livello!
          </p>
        </div>

        {/* Achievement unlocked indicator */}
        <div className={cn(
          'mt-8 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm',
          animationPhase === 'celebrate' && 'animate-in slide-in-from-bottom duration-700'
        )}>
          <div className="flex items-center justify-center gap-3">
            <Star className="size-5 text-yellow-400" />
            <span className="text-white font-medium">
              Nuove funzionalità sbloccate!
            </span>
            <Star className="size-5 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Floating elements */}
      {animationPhase === 'celebrate' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${10 + (i * 10)}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '3s',
              }}
            >
              {i % 2 === 0 ? (
                <Star className="size-6 text-yellow-400 animate-spin-slow" />
              ) : (
                <Sparkles className="size-5 text-orange-400 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// XP Gain Animation Component
type XPGainAnimationProps = {
  amount: number;
  isVisible: boolean;
  onComplete?: () => void;
  className?: string;
};

export const XPGainAnimation: React.FC<XPGainAnimationProps> = ({
  amount,
  isVisible,
  onComplete,
  className = '',
}) => {
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed right-4 top-20 z-50 animate-in slide-in-from-right duration-300',
      className
    )}>
      <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-2">
          <Star className="size-4 text-primary animate-spin" />
          <span className="font-semibold text-primary">
            +
            {amount}
            {' '}
            XP
          </span>
        </div>
      </div>
    </div>
  );
};