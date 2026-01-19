'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ProfessionalLearningEngine } from '@/libs/learningAnalytics';

type CompetencyProgressBarProps = {
  competencyScore: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showTooltip?: boolean;
  interactive?: boolean;
};

export const CompetencyProgressBar = ({ 
  competencyScore, 
  showDetails = true, 
  size = 'md',
  animated = true,
  showTooltip = true,
  interactive = true,
}: CompetencyProgressBarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const { current, next, progress, coinsToNext } = ProfessionalLearningEngine.getCompetencyProgress(competencyScore);
  const t = useTranslations('Learning');
  
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

  // Professional gradient based on competency level
  const getProgressGradient = () => {
    const baseColor = current.color;
    return `linear-gradient(90deg, ${baseColor}E0, ${baseColor}, ${baseColor}E0)`;
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
            {/* Competency Level Indicator */}
            <motion.div 
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div 
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-md shadow-md border border-white/20"
                style={{ 
                  backgroundColor: current.color,
                  boxShadow: `0 0 8px ${current.color}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-md"
                style={{ backgroundColor: current.color }}
                animate={{ 
                  boxShadow: [
                    `0 0 0 0 ${current.color}30`,
                    `0 0 0 4px ${current.color}00`,
                    `0 0 0 0 ${current.color}30`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Competency Title */}
            <motion.div
              className="min-w-0 flex-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className={`font-semibold ${textSizes[size]} text-foreground`}>
                  {current.title.it}
                </span>
                <span className={`text-muted-foreground ${textSizes[size]} truncate`}>
                  {current.description.it}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Competency Score */}
          <motion.div
            className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span 
              className={`font-mono font-bold ${textSizes[size]} text-blue-600`}
              key={competencyScore}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {competencyScore.toLocaleString()}
            </motion.span>
            <span className={`text-muted-foreground ${textSizes[size]}`}>{t('competency_points')}</span>
          </motion.div>
        </motion.div>
      )}
      
      {/* Professional Progress Bar Container */}
      <div className="relative">
        <motion.div
          className={`w-full ${sizeClasses[size]} bg-gradient-to-r from-muted via-muted/90 to-muted rounded-md overflow-hidden shadow-inner border border-border/50`}
          onHoverStart={() => interactive && setIsHovered(true)}
          onHoverEnd={() => interactive && setIsHovered(false)}
          whileHover={interactive ? { scale: 1.01 } : undefined}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {/* Progress Fill */}
          <motion.div
            className={`${sizeClasses[size]} rounded-md relative overflow-hidden shadow-sm`}
            style={{ 
              background: getProgressGradient(),
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 0 4px ${current.color}30`,
            }}
            initial={animated ? { width: 0 } : { width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              duration: animated ? 1.5 : 0, 
              ease: 'easeOut',
              type: 'spring',
              stiffness: 120,
              damping: 20,
            }}
          >
            {/* Subtle shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: 'linear',
                repeatDelay: 2,
              }}
            />

            {/* Progress highlight */}
            <div
              className="absolute inset-0 rounded-md opacity-30"
              style={{
                background: `radial-gradient(ellipse at center, ${current.color}60 0%, transparent 70%)`,
              }}
            />
          </motion.div>

          {/* Milestone Markers */}
          {showDetails && (
            <div className="absolute inset-0 flex items-center">
              {[25, 50, 75].map((milestone) => (
                <motion.div
                  key={milestone}
                  className="absolute w-px h-full bg-foreground/40"
                  style={{ left: `${milestone}%` }}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: progress > milestone ? 0.6 : 0.3, scaleY: 1 }}
                  transition={{ delay: 0.5 + milestone * 0.01 }}
                />
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Score Range Indicators */}
        {showDetails && next && (
          <motion.div 
            className="flex justify-between mt-2 px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className={`text-muted-foreground ${textSizes[size]} font-mono`}>
              {current.minCompetencyScore.toLocaleString()}
            </span>
            <span className={`text-muted-foreground ${textSizes[size]} font-mono`}>
              {(current.maxCompetencyScore + 1).toLocaleString()}
            </span>
          </motion.div>
        )}
      </div>
      
      {/* Next Level Preview */}
      {showDetails && next && (
        <motion.div 
          className="flex items-center justify-between p-3 bg-gradient-to-r from-muted/40 to-muted/20 rounded-lg border border-border/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.01, boxShadow: '0 4px 12px hsl(var(--background) / 0.1)' }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: next.color }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className={`text-foreground ${textSizes[size]} font-medium`}>
              {t('next_level')}: {next.title.it}
            </span>
          </div>
          <motion.span 
            className={`text-muted-foreground ${textSizes[size]} font-semibold`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {coinsToNext} {t('coins_needed')}
          </motion.span>
        </motion.div>
      )}
      
      {/* Expert Level Achievement */}
      {!next && showDetails && (
        <motion.div 
          className="text-center p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/5 rounded-lg border border-blue-500/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className={`font-semibold ${textSizes[size]} text-blue-600`}>
              🎓 {t('expert_level_achieved')}
            </span>
          </motion.div>
          <p className="text-xs text-blue-600/80 mt-1">
            {t('professional_competency_demonstrated')}
          </p>
        </motion.div>
      )}

      {/* Professional Tooltip */}
      <AnimatePresence>
        {showTooltipState && (
          <motion.div
            className="absolute bottom-full left-1/2 mb-2 z-50"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="relative px-4 py-3 bg-card/95 backdrop-blur-xl rounded-lg shadow-xl border border-border min-w-64">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">{t('competency_progress')}</span>
                  <span className="text-xs text-muted-foreground">{Math.ceil(progress)}%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {next 
                    ? `${coinsToNext.toLocaleString()} ${t('coins_to_next_level')}`
                    : t('expert_level_achieved')
                  }
                </div>
                {current.benefits.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-foreground mb-1">{t('current_benefits')}:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {current.benefits.slice(0, 2).map((benefit: string, benefitIndex: number) => (
                        <li key={benefitIndex} className="flex items-center gap-1">
                          <span className="text-blue-600">✓</span>
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