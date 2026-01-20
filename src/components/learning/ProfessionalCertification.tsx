'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import type { ProfessionalCertification } from '@/libs/learningAnalytics';

type ProfessionalCertificationProps = {
  certification: ProfessionalCertification;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isNew?: boolean;
  onClick?: () => void;
  showTooltip?: boolean;
  interactive?: boolean;
};

export const ProfessionalCertificationComponent = ({
  certification,
  size = 'md',
  isNew = false,
  onClick,
  showTooltip = true,
  interactive = true,
}: ProfessionalCertificationProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const t = useTranslations('Learning');

  // Responsive size classes using Tradelia's 4px spacing scale
  const sizeClasses = {
    sm: 'size-8 sm:size-10',
    md: 'size-12 sm:size-14 md:size-16',
    lg: 'size-16 sm:size-18 md:size-20 lg:size-22',
    xl: 'size-20 sm:size-24 md:size-28 lg:size-32',
  };

  // Professional color scheme based on certification type
  const typeColors = {
    foundation: {
      primary: 'hsl(215 16% 47%)',
      secondary: 'hsl(215 16% 35%)',
      accent: 'hsl(215 16% 55%)',
      glow: 'hsl(215 16% 47%)',
    },
    intermediate: {
      primary: 'hsl(213 94% 68%)',
      secondary: 'hsl(224 76% 48%)',
      accent: 'hsl(213 94% 78%)',
      glow: 'hsl(213 94% 68%)',
    },
    advanced: {
      primary: 'hsl(160 84% 39%)',
      secondary: 'hsl(160 84% 29%)',
      accent: 'hsl(160 84% 49%)',
      glow: 'hsl(160 84% 39%)',
    },
    professional: {
      primary: 'hsl(38 92% 50%)',
      secondary: 'hsl(38 92% 40%)',
      accent: 'hsl(38 92% 60%)',
      glow: 'hsl(38 92% 50%)',
    },
    expert: {
      primary: 'hsl(222 47% 11%)',
      secondary: 'hsl(217 33% 17%)',
      accent: 'hsl(217 33% 25%)',
      glow: 'hsl(222 47% 11%)',
    },
  };

  const colors = typeColors[certification.type];

  // Professional animations (subtle, not gaming-style)
  const containerVariants = {
    initial: {
      scale: 0.9,
      opacity: 0,
      filter: 'blur(4px)',
    },
    animate: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
        duration: 0.6,
      },
    },
    hover: {
      scale: interactive ? 1.05 : 1,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 20,
      },
    },
    tap: {
      scale: interactive ? 0.98 : 1,
      transition: { duration: 0.1 },
    },
  };

  // Tooltip management
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isHovered && showTooltip) {
      timeout = setTimeout(() => setShowTooltipState(true), 500);
    } else {
      setShowTooltipState(false);
    }
    return () => clearTimeout(timeout);
  }, [isHovered, showTooltip]);

  // Professional certification icon (diploma/certificate style)
  const CertificationIcon = () => (
    <svg viewBox="0 0 24 24" className="size-3/4 text-white" fill="currentColor">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
      <circle cx="12" cy="15" r="2" fill="white" />
      <path d="M10,17L12,19L14,17" stroke="white" strokeWidth="1" fill="none" />
    </svg>
  );

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
        {/* Professional subtle glow */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-lg opacity-20 blur-sm`}
          style={{ backgroundColor: colors.glow }}
          animate={{
            opacity: isHovered ? 0.3 : 0.2,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Certification Container with consistent design */}
        <motion.div
          className={`relative ${sizeClasses[size]} flex items-center justify-center rounded-xl border-2 shadow-lg backdrop-blur-sm`}
          style={{
            background: `linear-gradient(135deg, ${colors.primary}F5, ${colors.secondary}E8)`,
            borderColor: colors.accent,
            boxShadow: `
              0 4px 12px hsl(var(--background) / 0.1),
              0 8px 24px ${colors.glow}25,
              inset 0 1px 0 rgba(255,255,255,0.15)
            `,
          }}
        >
          {/* Certification Icon */}
          <motion.div
            className="relative z-10"
            animate={{
              filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
            }}
            transition={{ duration: 0.2 }}
          >
            <CertificationIcon />
          </motion.div>

          {/* Professional shine effect */}
          <motion.div
            className="absolute inset-1 rounded-md opacity-10"
            style={{
              background: `linear-gradient(135deg, transparent 40%, white 50%, transparent 60%)`,
            }}
            animate={{
              opacity: isHovered ? 0.2 : 0.1,
              transform: isHovered ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* New certification indicator */}
        <AnimatePresence>
          {isNew && (
            <motion.div
              className="absolute -right-1 -top-1 flex size-3 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg sm:size-4"
              initial={{ scale: 0 }}
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 0 0 hsl(213 94% 68% / 0.7)',
                  '0 0 0 6px hsl(213 94% 68% / 0)',
                  '0 0 0 0 hsl(213 94% 68% / 0.7)',
                ],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                scale: { duration: 1, repeat: Infinity },
                boxShadow: { duration: 1.5, repeat: Infinity },
              }}
            >
              <motion.div
                className="size-1 rounded-full bg-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Professional Tooltip */}
      <AnimatePresence>
        {showTooltipState && (
          <motion.div
            className="absolute bottom-full left-1/2 z-50 mb-3"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              className="relative min-w-64 max-w-80 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-xl backdrop-blur-xl"
              style={{
                boxShadow: `
                  0 20px 40px hsl(var(--background) / 0.15),
                  0 0 0 1px hsl(var(--border) / 0.1)
                `,
              }}
            >
              {/* Tooltip Content */}
              <div className="space-y-3 text-center">
                {/* Certification Name */}
                <h3
                  className="text-sm font-semibold leading-tight"
                  style={{ color: colors.primary }}
                >
                  {certification.name.it}
                </h3>

                {/* Description */}
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {certification.description.it}
                </p>

                {/* Credential Value */}
                <p className="text-xs font-medium text-foreground">
                  {certification.credentialValue.it}
                </p>

                {/* Certification Stats */}
                <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
                  <span
                    className="rounded-md px-2 py-1 text-xs font-medium text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {t(`certification_${certification.type}`)}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-blue-600">
                    <span className="text-blue-600">🪙</span>
                    +
                    {certification.tradeliaCoinsReward}
                    {' '}
                    {t('tradelia_coins')}
                  </span>
                </div>
              </div>

              {/* Tooltip Arrow */}
              <div className="absolute left-1/2 top-full size-0 -translate-x-1/2 border-x-4 border-t-4 border-transparent border-t-card" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type CertificationShowcaseProps = {
  certifications: ProfessionalCertification[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  showNew?: boolean;
};

export const CertificationShowcase = ({
  certifications,
  maxDisplay = 5,
  size = 'md',
  showNew = false,
}: CertificationShowcaseProps) => {
  const displayCertifications = certifications.slice(0, maxDisplay);
  const remainingCount = Math.max(0, certifications.length - maxDisplay);

  const gapClasses = 'flex items-center gap-2 sm:gap-3 md:gap-4';

  const overflowSizeClasses = {
    sm: 'size-8 sm:size-10',
    md: 'size-12 sm:size-14 md:size-16',
    lg: 'size-16 sm:size-18 md:size-20 lg:size-22',
  };

  return (
    <div className={gapClasses}>
      <AnimatePresence mode="popLayout">
        {displayCertifications.map((certification, index) => (
          <motion.div
            key={certification.id}
            layout
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{
              delay: index * 0.1,
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            <ProfessionalCertificationComponent
              certification={certification}
              size={size}
              isNew={showNew && index === displayCertifications.length - 1}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Overflow Indicator */}
      <AnimatePresence>
        {remainingCount > 0 && (
          <motion.div
            className={`${overflowSizeClasses[size]} flex items-center justify-center rounded-xl border border-border bg-gradient-to-br from-muted to-muted/80 shadow-sm backdrop-blur-sm`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 8px 25px hsl(var(--background) / 0.15)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <span className="text-sm font-medium text-muted-foreground">
              +
              {remainingCount}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
