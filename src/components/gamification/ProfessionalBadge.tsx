'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import type { ProfessionalBadge } from '@/libs/gamification';
import { RARITY_COLORS } from '@/libs/gamification';

type ProfessionalBadgeProps = {
  badge: ProfessionalBadge;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDetails?: boolean;
  isNew?: boolean;
  onClick?: () => void;
  showTooltip?: boolean;
  interactive?: boolean;
};

export const ProfessionalBadgeComponent = ({
  badge,
  size = 'md',
  showDetails: _showDetails = false,
  isNew = false,
  onClick,
  showTooltip = true,
  interactive = true,
}: ProfessionalBadgeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const t = useTranslations('Learning');

  // Responsive size classes using Tradelia's 4px spacing scale
  const sizeClasses = {
    sm: 'size-8 sm:size-10', // 32px -> 40px
    md: 'size-12 sm:size-14 md:size-16', // 48px -> 56px -> 64px
    lg: 'size-16 sm:size-18 md:size-20 lg:size-22', // 64px -> 72px -> 80px -> 88px
    xl: 'size-20 sm:size-24 md:size-28 lg:size-32', // 80px -> 96px -> 112px -> 128px
  };

  const rarityColors = RARITY_COLORS[badge.rarity];

  // Premium 2026 animations
  const containerVariants = {
    initial: {
      scale: 0,
      rotate: -180,
      opacity: 0,
      filter: 'blur(10px)',
    },
    animate: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 15,
        duration: 0.8,
      },
    },
    hover: {
      scale: interactive ? 1.1 : 1,
      rotate: interactive ? [0, -5, 5, 0] : 0,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 10,
        rotate: {
          duration: 0.6,
          ease: 'easeInOut' as const,
        },
      },
    },
    tap: {
      scale: interactive ? 0.95 : 1,
      transition: { duration: 0.1 },
    },
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0.3, 0.6, 0.3],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    hover: {
      opacity: [0.6, 1, 0.6],
      scale: [1, 1.4, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  const pulseVariants = {
    animate: {
      boxShadow: [
        `0 0 0 0 ${rarityColors.glow}40`,
        `0 0 0 10px ${rarityColors.glow}00`,
        `0 0 0 0 ${rarityColors.glow}40`,
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Tooltip delay management
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isHovered && showTooltip) {
      timeout = setTimeout(() => setShowTooltipState(true), 500);
    } else {
      setShowTooltipState(false);
    }
    return () => clearTimeout(timeout);
  }, [isHovered, showTooltip]);

  // New badge celebration effect
  useEffect(() => {
    if (isNew && !hasAnimated) {
      setHasAnimated(true);
      // Trigger celebration particles or confetti here
    }
  }, [isNew, hasAnimated]);

  return (
    <div className="relative">
      <motion.div
        className={`relative ${onClick ? 'cursor-pointer' : ''} group`}
        variants={containerVariants}
        initial={isNew ? 'initial' : 'animate'}
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Premium Glow Effect */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full blur-lg`}
          style={{ backgroundColor: rarityColors.glow }}
          variants={glowVariants}
          initial="initial"
          animate={isHovered ? 'hover' : 'animate'}
        />

        {/* Pulse Ring Effect */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full`}
          variants={pulseVariants}
          animate="animate"
        />

        {/* Badge Container with Premium Materials */}
        <motion.div
          className={`relative ${sizeClasses[size]} flex items-center justify-center rounded-full border-2 backdrop-blur-sm`}
          style={{
            background: `linear-gradient(135deg, ${rarityColors.primary}E6, ${rarityColors.secondary}CC)`,
            borderColor: rarityColors.accent,
            boxShadow: `
              0 2px 8px hsl(var(--background) / 0.1),
              0 8px 32px ${rarityColors.glow}30,
              inset 0 1px 0 rgba(255,255,255,0.2),
              inset 0 -1px 0 rgba(0,0,0,0.1)
            `,
          }}
        >
          {/* Badge Icon with Micro-interactions */}
          <motion.div
            className="relative z-10 flex size-3/4 items-center justify-center text-white"
            dangerouslySetInnerHTML={{ __html: badge.icon.content }}
            animate={{
              filter: isHovered ? 'brightness(1.2) saturate(1.1)' : 'brightness(1) saturate(1)',
            }}
            transition={{ duration: 0.2 }}
          />

          {/* Inner Shine Effect */}
          <motion.div
            className="absolute inset-1 rounded-full opacity-20"
            style={{
              background: `linear-gradient(135deg, transparent 30%, white 50%, transparent 70%)`,
            }}
            animate={{
              opacity: isHovered ? 0.4 : 0.2,
              transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* New Badge Indicator with Premium Animation */}
        <AnimatePresence>
          {isNew && (
            <motion.div
              className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-gradient-to-r from-destructive to-pink-500 shadow-lg sm:size-5"
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: 0,
                boxShadow: [
                  '0 0 0 0 hsl(var(--destructive) / 0.7)',
                  '0 0 0 8px hsl(var(--destructive) / 0)',
                  '0 0 0 0 hsl(var(--destructive) / 0.7)',
                ],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                scale: { duration: 1, repeat: Infinity },
                boxShadow: { duration: 1.5, repeat: Infinity },
              }}
            >
              <motion.span
                className="text-xs font-bold text-white"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                !
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rarity Border Animation */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-full border-2"
          style={{ borderColor: rarityColors.accent }}
          animate={{
            borderColor: [rarityColors.accent, rarityColors.primary, rarityColors.accent],
            rotate: [0, 360],
          }}
          transition={{
            borderColor: { duration: 3, repeat: Infinity },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          }}
        />
      </motion.div>

      {/* Premium Tooltip with Micro-interactions */}
      <AnimatePresence>
        {showTooltipState && (
          <motion.div
            className="absolute bottom-full left-1/2 z-50 mb-3"
            initial={{ opacity: 0, y: 10, scale: 0.8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.8, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="relative min-w-64 max-w-80 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-xl"
              style={{
                boxShadow: `
                  0 20px 40px hsl(var(--background) / 0.15),
                  0 0 0 1px hsl(var(--border) / 0.1),
                  inset 0 1px 0 hsl(var(--background) / 0.2)
                `,
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {/* Tooltip Content */}
              <div className="space-y-3 text-center">
                {/* Badge Name with Rarity Color */}
                <motion.h3
                  className="text-sm font-bold leading-tight text-foreground"
                  style={{ color: rarityColors.primary }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {badge.name.it}
                </motion.h3>

                {/* Description */}
                <motion.p
                  className="text-xs leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {badge.description.it}
                </motion.p>

                {/* Badge Stats */}
                <motion.div
                  className="flex items-center justify-between border-t border-border pt-2 text-xs"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.span
                    className="rounded-full px-2 py-1 text-xs font-medium text-white"
                    style={{ backgroundColor: rarityColors.primary }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {t(`rarity_${badge.rarity}` as any).toUpperCase()}
                  </motion.span>
                  <motion.span
                    className="flex items-center gap-1 font-semibold text-warning"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-warning">✦</span>
                    +
                    {badge.xpReward}
                    {' '}
                    {t('xp')}
                  </motion.span>
                </motion.div>
              </div>

              {/* Tooltip Arrow */}
              <div
                className="absolute left-1/2 top-full size-0 -translate-x-1/2 border-x-4 border-t-4 border-transparent border-t-card"
              />

              {/* Subtle Glow */}
              <div
                className="absolute inset-0 rounded-xl opacity-20 blur-xl"
                style={{ backgroundColor: rarityColors.glow }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type BadgeShowcaseProps = {
  badges: ProfessionalBadge[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  showCelebration?: boolean;
};

export const BadgeShowcase = ({
  badges,
  maxDisplay = 5,
  size = 'md',
  showCelebration = false,
}: BadgeShowcaseProps) => {
  const displayBadges = badges.slice(0, maxDisplay);
  const remainingCount = Math.max(0, badges.length - maxDisplay);

  // Responsive gap classes using 4px spacing scale
  const gapClasses = 'flex items-center gap-2 sm:gap-3 md:gap-4';

  // Responsive size classes for overflow indicator
  const overflowSizeClasses = {
    sm: 'size-8 sm:size-10',
    md: 'size-12 sm:size-14 md:size-16',
    lg: 'size-16 sm:size-18 md:size-20 lg:size-22',
  };

  return (
    <div className={gapClasses}>
      <AnimatePresence mode="popLayout">
        {displayBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            layout
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{
              delay: index * 0.1,
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            <ProfessionalBadgeComponent
              badge={badge}
              size={size}
              isNew={showCelebration && index === displayBadges.length - 1}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Overflow Indicator with Premium Design */}
      <AnimatePresence>
        {remainingCount > 0 && (
          <motion.div
            className={`${overflowSizeClasses[size]} flex items-center justify-center rounded-full border-2 border-border bg-gradient-to-br from-muted to-muted/80 backdrop-blur-sm`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.1,
              boxShadow: '0 8px 25px hsl(var(--background) / 0.15)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.span
              className="text-sm font-semibold text-muted-foreground"
              whileHover={{ scale: 1.1 }}
            >
              +
              {remainingCount}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
