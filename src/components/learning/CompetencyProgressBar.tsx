'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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
          <div className="flex min-w-0 flex-1 items-center space-x-2 sm:space-x-3">
            {/* Competency Level Indicator */}
            <motion.div
              className="relative shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div
                className="size-3 rounded-md border border-white/20 shadow-md sm:size-4"
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
            className="flex shrink-0 items-center space-x-1 sm:space-x-2"
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
          className={`w-full ${sizeClasses[size]} overflow-hidden rounded-xl border border-border/50 bg-gradient-to-r from-muted via-muted/90 to-muted shadow-inner`}
          onHoverStart={() => interactive && setIsHovered(true)}
          onHoverEnd={() => interactive && setIsHovered(false)}
          whileHover={interactive ? { scale: 1.01 } : undefined}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {/* Progress Fill */}
          <motion.div
            className={`${sizeClasses[size]} relative overflow-hidden rounded-xl shadow-sm`}
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
              {[25, 50, 75].map(milestone => (
                <motion.div
                  key={milestone}
                  className="absolute h-full w-px bg-foreground/40"
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
            className="mt-2 flex justify-between px-1"
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
          className="flex items-center justify-between rounded-xl border border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 p-3 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.01, boxShadow: '0 4px 12px hsl(var(--background) / 0.1)' }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              className="size-2 rounded-sm"
              style={{ backgroundColor: next.color }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className={`text-foreground ${textSizes[size]} font-medium`}>
              {t('next_level')}
              :
              {next.title.it}
            </span>
          </div>
          <motion.span
            className={`text-muted-foreground ${textSizes[size]} font-semibold`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {coinsToNext}
            {' '}
            {t('coins_needed')}
          </motion.span>
        </motion.div>
      )}

      {/* Expert Level Achievement */}
      {!next && showDetails && (
        <motion.div
          className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-600/5 p-4 text-center"
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
              🎓
              {' '}
              {t('expert_level_achieved')}
            </span>
          </motion.div>
          <p className="mt-1 text-xs text-blue-600/80">
            {t('professional_competency_demonstrated')}
          </p>
        </motion.div>
      )}

      {/* Professional Tooltip */}
      <AnimatePresence>
        {showTooltipState && (
          <motion.div
            className="absolute bottom-full left-1/2 z-50 mb-2"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="relative min-w-64 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-xl backdrop-blur-xl">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{t('competency_progress')}</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.ceil(progress)}
                    %
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {next
                    ? `${coinsToNext.toLocaleString()} ${t('coins_to_next_level')}`
                    : t('expert_level_achieved')}
                </div>
                {current.benefits.length > 0 && (
                  <div className="border-t border-border pt-2">
                    <p className="mb-1 text-xs font-medium text-foreground">
                      {t('current_benefits')}
                      :
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {current.benefits.slice(0, 2).map((benefit: string, benefitIndex: number) => (
                        <li key={`benefit-${benefitIndex}`} className="flex items-center gap-1">
                          <span className="text-blue-600">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tooltip Arrow */}
              <div className="absolute left-1/2 top-full size-0 -translate-x-1/2 border-x-4 border-t-4 border-transparent border-t-card" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
