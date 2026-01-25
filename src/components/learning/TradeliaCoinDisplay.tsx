'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type TradeliaCoinDisplayProps = {
  totalCoins: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  recentEarnings?: Array<{ amount: number; reason: string; timestamp: Date }>;
};

// ✅ CRITICAL FIX: Stable default reference (prevents React.memo breaks)
// Research: Qodo AI 2026 - "Array literals create new references on every render"
const DEFAULT_RECENT_EARNINGS: Array<{ amount: number; reason: string; timestamp: Date }> = [];

export const TradeliaCoinDisplay = ({
  totalCoins,
  showDetails = true,
  size = 'md',
  animated = true,
  recentEarnings = DEFAULT_RECENT_EARNINGS,
}: TradeliaCoinDisplayProps) => {
  const [showEarnings, setShowEarnings] = useState(false);
  const t = useTranslations('Learning');

  // Responsive classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl md:text-2xl',
  };

  const iconSizes = {
    sm: 'size-4',
    md: 'size-5 sm:size-6',
    lg: 'size-6 sm:size-7 md:size-8',
  };

  // Professional coin icon
  const CoinIcon = ({ className }: { className?: string }) => (
    <motion.div
      className={`${className} flex items-center justify-center`}
      animate={{
        rotateY: [0, 360],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'linear',
        repeatDelay: 2,
      }}
    >
      <svg viewBox="0 0 24 24" className="size-full text-blue-600" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <circle cx="12" cy="12" r="8" fill="white" />
        <text x="12" y="16" textAnchor="middle" className="fill-blue-600 text-xs font-bold">T</text>
      </svg>
    </motion.div>
  );

  return (
    <div className="space-y-3">
      {/* Main Coin Display */}
      <motion.div
        className="flex items-center justify-center gap-2 sm:gap-3"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <CoinIcon className={iconSizes[size]} />

        <motion.div
          className="flex items-baseline gap-1"
          key={totalCoins} // Re-animate when coins change
          initial={animated ? { scale: 1.1, color: 'hsl(213 94% 68%)' } : undefined}
          animate={{ scale: 1, color: 'hsl(213 94% 68%)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <span className={`font-bold ${sizeClasses[size]} text-blue-600`}>
            {totalCoins.toLocaleString()}
          </span>
          <span className={`text-muted-foreground ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            {t('tradelia_coins')}
          </span>
        </motion.div>
      </motion.div>

      {/* Coin Value Information */}
      {showDetails && (
        <motion.div
          className="space-y-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-muted-foreground">
            {t('coins_redeemable_for_discounts')}
          </p>

          {/* Redemption Examples */}
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <motion.span
              className="rounded-md bg-blue-50 px-2 py-1 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
              whileHover={{ scale: 1.05 }}
            >
              100
              {' '}
              {t('coins')}
              {' '}
              = 10%
              {' '}
              {t('discount')}
            </motion.span>
            <motion.span
              className="rounded-md bg-green-50 px-2 py-1 text-green-700 dark:bg-green-950/30 dark:text-green-300"
              whileHover={{ scale: 1.05 }}
            >
              500
              {' '}
              {t('coins')}
              {' '}
              =
              {' '}
              {t('premium_tool_access')}
            </motion.span>
          </div>
        </motion.div>
      )}

      {/* Recent Earnings */}
      {recentEarnings.length > 0 && (
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            type="button"
            onClick={() => setShowEarnings(!showEarnings)}
            className="flex w-full items-center justify-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('recent_earnings')}
            <motion.span
              animate={{ rotate: showEarnings ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </button>

          <AnimatePresence>
            {showEarnings && (
              <motion.div
                className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {recentEarnings.slice(0, 3).map((earning, index) => (
                  <motion.div
                    key={`earning-${earning.timestamp.getTime()}-${index}`}
                    className="flex items-center justify-between text-xs"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-muted-foreground">{earning.reason}</span>
                    <span className="flex items-center gap-1 font-semibold text-blue-600">
                      <CoinIcon className="size-3" />
                      +
                      {earning.amount}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

type CoinEarningAnimationProps = {
  amount: number;
  bonuses?: Array<{ type: string; amount: number; reason: string }>;
  onComplete?: () => void;
  celebration?: boolean;
};

// ✅ CRITICAL FIX: Stable default reference (prevents React.memo breaks)
const DEFAULT_BONUSES: Array<{ type: string; amount: number; reason: string }> = [];

export const CoinEarningAnimation = ({
  amount,
  bonuses = DEFAULT_BONUSES,
  onComplete,
  celebration = false,
}: CoinEarningAnimationProps) => {
  const t = useTranslations('Learning');

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      {/* Main Coin Earning Display */}
      <motion.div
        className="relative"
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: -50 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* Professional glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 opacity-40 blur-xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Main Container */}
        <div className="relative rounded-2xl border border-blue-400/30 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white shadow-2xl sm:px-8 sm:py-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Coin Amount */}
            <motion.div
              className="mb-2 flex items-center justify-center gap-3"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                className="size-8 sm:size-10"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <svg viewBox="0 0 24 24" className="size-full text-white" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="currentColor" />
                  <circle cx="12" cy="12" r="8" fill="rgba(59, 130, 246, 0.8)" />
                  <text x="12" y="16" textAnchor="middle" className="fill-white text-xs font-bold">T</text>
                </svg>
              </motion.div>

              <div className="text-2xl font-bold sm:text-3xl">
                +
                {amount}
                {' '}
                {t('tradelia_coins')}
              </div>
            </motion.div>

            {/* Professional message */}
            {celebration && (
              <motion.div
                className="mb-3 text-base font-semibold sm:text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {t('coins_earned')}
                !
              </motion.div>
            )}

            {/* Bonuses */}
            {bonuses.length > 0 && (
              <motion.div
                className="space-y-1 rounded-lg bg-white/10 p-3 text-sm backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="mb-2 font-semibold">
                  {t('earning_breakdown')}
                  :
                </div>
                {bonuses.map((bonus, index) => (
                  <motion.div
                    key={`bonus-${bonus.type}-${bonus.amount}-${index}`}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <span className="text-white/90">{bonus.reason}</span>
                    <span className="flex items-center gap-1 font-bold text-white">
                      <svg viewBox="0 0 24 24" className="size-3 text-white" fill="currentColor">
                        <circle cx="12" cy="12" r="10" fill="currentColor" />
                        <circle cx="12" cy="12" r="8" fill="rgba(59, 130, 246, 0.8)" />
                        <text x="12" y="16" textAnchor="middle" className="fill-white text-xs font-bold">T</text>
                      </svg>
                      +
                      {bonus.amount}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Professional particles */}
          {celebration && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute size-2 rounded-full bg-white"
                  style={{
                    left: `${25 + i * 20}%`,
                    top: `${20 + (i % 2) * 60}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [1, 0.7, 1],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
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
