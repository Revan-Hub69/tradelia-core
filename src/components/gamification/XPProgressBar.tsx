'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ProfessionalGamificationEngine } from '@/libs/gamification';

type XPProgressBarProps = {
  totalXP: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showTooltip?: boolean;
  interactive?: boolean;
};

export const XPProgressBar = ({ 
  totalXP, 
  showDetails = true, 
  size = 'md',
  animated = true,
  showTooltip = true,
  interactive = true,
}: XPProgressBarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const { current, next, progress } = ProfessionalGamificationEngine.getTierProgress(totalXP);
  const t = useTranslations('Gamification');
  
  // Responsive height classes using 4px spacing scale
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3 sm:h-4',
    lg: 'h-4 sm:h-5 md:h-6',
  };

  // Responsive text sizes
  const textSizes = {
    sm: 'text-xs',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
  };

  // Tooltip management
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isHovered && showTooltip) {
      timeout = setTimeout(() => setShowTooltipState(true), 300);
    } else {
      setShowTooltipState(false);
    }
    return () => clearTimeout(timeout);
  }, [isHovered, showTooltip]);

  // Premium gradient based on tier
  const getProgressGradient = () => {
    const baseColor = current.color;
    return `linear-gradient(90deg, ${baseColor}CC, ${baseColor}, ${baseColor}CC)`;
  };

  return (
    <div className="space-y-3">
      {showDetails && (
        <motion.div 
          className="flex items-center justify-between gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            {/* Tier Indicator with Glow */}
            <motion.div 
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div 
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg border-2 border-white/20"
                style={{ 
                  backgroundColor: current.color,
                  boxShadow: `0 0 12px ${current.color}60, inset 0 1px 0 rgba(255,255,255,0.3)`,
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: current.color }}
                animate={{ 
                  boxShadow: [
                    `0 0 0 0 ${current.color}40`,
                    `0 0 0 6px ${current.color}00`,
                    `0 0 0 0 ${current.color}40`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Tier Title with Premium Typography */}
            <motion.div
              className="min-w-0 flex-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className={`font-bold ${textSizes[size]} text-gradient-primary`}>
                  {t('level')} {current.level}
                </span>
                <span className={`font-semibold ${textSizes[size]} truncate`} style={{ color: current.color }}>
                  {current.title.it}
                </span>
              </div>
            </motion.div>
          </div>

          {/* XP Counter with Animation */}
          <motion.div
            className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span 
              className={`font-mono font-bold ${textSizes[size]} text-warning`}
              key={totalXP} // Re-animate when XP changes
              initial={{ scale: 1.2, color: 'hsl(var(--warning))' }}
              animate={{ scale: 1, color: 'hsl(var(--warning))' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {totalXP.toLocaleString()}
            </motion.span>
            <span className={`text-muted-foreground ${textSizes[size]}`}>{t('xp')}</span>
          </motion.div>
        </motion.div>
      )}
      
      {/* Premium Progress Bar Container */}
      <div className="relative">
        <motion.div
          className={`w-full ${sizeClasses[size]} bg-gradient-to-r from-muted via-muted/80 to-muted rounded-full overflow-hidden shadow-inner border border-border`}
          onHoverStart={() => interactive && setIsHovered(true)}
          onHoverEnd={() => interactive && setIsHovered(false)}
          whileHover={interactive ? { scale: 1.02 } : undefined}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {/* Progress Fill with Premium Effects */}
          <motion.div
            className={`${sizeClasses[size]} rounded-full relative overflow-hidden shadow-lg`}
            style={{ 
              background: getProgressGradient(),
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), 0 0 8px ${current.color}40`,
            }}
            initial={animated ? { width: 0 } : { width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              duration: animated ? 2 : 0, 
              ease: 'easeOut',
              type: 'spring',
              stiffness: 100,
              damping: 15,
            }}
          >
            {/* Animated Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: 'linear',
                repeatDelay: 1,
              }}
            />

            {/* Particle Effect */}
            <motion.div
              className="absolute inset-0 opacity-60"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${current.color}60 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Progress Glow */}
            <div
              className="absolute inset-0 rounded-full blur-sm"
              style={{ backgroundColor: current.color, opacity: 0.3 }}
            />
          </motion.div>

          {/* Milestone Markers */}
          {showDetails && (
            <div className="absolute inset-0 flex items-center">
              {[25, 50, 75].map((milestone) => (
                <motion.div
                  key={milestone}
                  className="absolute w-0.5 h-full bg-white/60 dark:bg-foreground/60"
                  style={{ left: `${milestone}%` }}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: progress > milestone ? 0.8 : 0.3, scaleY: 1 }}
                  transition={{ delay: 0.5 + milestone * 0.01 }}
                />
              ))}
            </div>
          )}
        </motion.div>
        
        {/* XP Range Indicators */}
        {showDetails && next && (
          <motion.div 
            className="flex justify-between mt-2 px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className={`text-muted-foreground ${textSizes[size]} font-mono`}>
              {current.minXP.toLocaleString()}
            </span>
            <span className={`text-muted-foreground ${textSizes[size]} font-mono`}>
              {(current.maxXP + 1).toLocaleString()}
            </span>
          </motion.div>
        )}
      </div>
      
      {/* Next Tier Preview with Premium Design */}
      {showDetails && next && (
        <motion.div 
          className="flex items-center justify-between p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border border-border backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02, boxShadow: '0 8px 25px hsl(var(--background) / 0.1)' }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: next.color }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className={`text-foreground ${textSizes[size]} font-medium`}>
              {t('next_milestone')}: {next.title.it}
            </span>
          </div>
          <motion.span 
            className={`text-muted-foreground ${textSizes[size]} font-semibold`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {Math.ceil(progress)}% {t('progress')}
          </motion.span>
        </motion.div>
      )}
      
      {/* Max Level Achievement */}
      {!next && showDetails && (
        <motion.div 
          className="text-center p-4 bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg border border-warning/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className={`font-bold ${textSizes[size]} text-gradient-primary`}>
              🏆 {t('max_level_reached')}
            </span>
          </motion.div>
          <p className="text-xs text-warning mt-1">
            {t('excellence_demonstrated')}
          </p>
        </motion.div>
      )}

      {/* Premium Tooltip */}
      <AnimatePresence>
        {showTooltipState && (
          <motion.div
            className="absolute bottom-full left-1/2 mb-2 z-50"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="relative px-4 py-3 bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border min-w-64">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">{t('progress')}</span>
                  <span className="text-xs text-muted-foreground">{Math.ceil(progress)}%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {next 
                    ? `${(next.minXP - totalXP).toLocaleString()} ${t('xp')} ${t('next_milestone').toLowerCase()}`
                    : t('max_level_reached')
                  }
                </div>
                {current.benefits.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-foreground mb-1">{t('achievements')}:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {current.benefits.slice(0, 2).map((benefit: string, benefitIndex: number) => (
                        <li key={benefitIndex} className="flex items-center gap-1">
                          <span className="text-accent">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Tooltip Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-card" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type XPGainAnimationProps = {
  amount: number;
  bonuses?: Array<{ type: string; amount: number; reason: string }>;
  onComplete?: () => void;
  celebration?: boolean;
};

const DEFAULT_BONUSES: Array<{ type: string; amount: number; reason: string }> = [];

export const XPGainAnimation = ({ 
  amount, 
  bonuses = DEFAULT_BONUSES, 
  onComplete,
  celebration = false,
}: XPGainAnimationProps) => {
  const t = useTranslations('Gamification');
  
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      {/* Main XP Gain Display */}
      <motion.div
        className="relative"
        initial={{ scale: 0, y: 100, rotate: -10 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0, y: -100, rotate: 10 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* Glow Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-warning to-warning/80 rounded-2xl blur-xl opacity-60"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Main Container */}
        <div className="relative bg-gradient-to-r from-warning to-warning/80 text-warning-foreground px-6 sm:px-8 py-4 sm:py-6 rounded-2xl shadow-2xl border border-warning/30">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* XP Amount */}
            <motion.div
              className="text-3xl sm:text-4xl font-bold mb-2"
              animate={{ 
                scale: [1, 1.1, 1],
                textShadow: [
                  '0 0 0px rgba(255,255,255,0)',
                  '0 0 20px rgba(255,255,255,0.8)',
                  '0 0 0px rgba(255,255,255,0)',
                ],
              }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              +{amount} {t('xp')}
            </motion.div>
            
            {/* Celebration Text */}
            {celebration && (
              <motion.div
                className="text-base sm:text-lg font-semibold mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                🎉 {t('congratulations')}
              </motion.div>
            )}

            {/* Bonuses */}
            {bonuses.length > 0 && (
              <motion.div
                className="text-sm space-y-1 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="font-semibold mb-2">{t('achievements')}:</div>
                {bonuses.map((bonus, index) => (
                  <motion.div 
                    key={index} 
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <span className="text-warning-foreground/90">{bonus.reason}</span>
                    <span className="font-bold text-warning-foreground">+{bonus.amount}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Floating Particles */}
          {celebration && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 2) * 80}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [1, 0.5, 1],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};