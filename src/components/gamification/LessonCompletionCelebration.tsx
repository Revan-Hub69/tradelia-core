'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { ProfessionalBadgeComponent } from './ProfessionalBadge';
import type { ProfessionalBadge } from '@/libs/gamification';

type CompletionData = {
  xpEarned: number;
  bonuses: Array<{ type: string; amount: number; reason: string }>;
  newBadges: ProfessionalBadge[];
  levelUp?: {
    from: number;
    to: number;
    newTitle: string;
  };
  streakMilestone?: {
    days: number;
    title: string;
    bonus: number;
  };
};

type LessonCompletionCelebrationProps = {
  isVisible: boolean;
  completionData: CompletionData;
  onComplete: () => void;
  lessonTitle: string;
};

export const LessonCompletionCelebration = ({
  isVisible,
  completionData,
  onComplete,
  lessonTitle,
}: LessonCompletionCelebrationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const t = useTranslations('Gamification');
  const tLearning = useTranslations('Learning');

  const steps = [
    'lesson_complete',
    'xp_gain',
    ...(completionData.newBadges.length > 0 ? ['badges'] : []),
    ...(completionData.levelUp ? ['level_up'] : []),
    ...(completionData.streakMilestone ? ['streak'] : []),
    'summary',
  ];

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
      setShowConfetti(true);

      // Auto-advance through steps
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        }
      }, currentStep === 0 ? 2000 : 3000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible, currentStep, steps.length]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Confetti Background */}
        {showConfetti && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className="absolute size-2 rounded-full"
                style={{
                  backgroundColor: ['#F59E0B', '#EF4444', '#8B5CF6', '#10B981', '#3B82F6'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: 360,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Main Content */}
        <motion.div
          className="relative mx-4 w-full max-w-sm sm:max-w-lg"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">

            {/* Step: Lesson Complete */}
            {steps[currentStep] === 'lesson_complete' && (
              <motion.div
                className="p-6 text-center sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  className="mb-4 text-4xl sm:text-6xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 1, repeat: 2 }}
                >
                  🎉
                </motion.div>
                <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
                  {tLearning('complete_lesson')}
                  !
                </h2>
                <p className="text-base text-muted-foreground sm:text-lg">
                  {lessonTitle}
                </p>
                <motion.div
                  className="mt-6 font-semibold text-accent"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {t('congratulations')}
                  ! 👏
                </motion.div>
              </motion.div>
            )}

            {/* Step: XP Gain */}
            {steps[currentStep] === 'xp_gain' && (
              <motion.div
                className="p-6 text-center sm:p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-warning/10 to-warning/5 p-4 sm:p-6">
                  <motion.div
                    className="mb-4 text-3xl font-bold text-warning sm:text-4xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.8, repeat: 2 }}
                  >
                    +
                    {completionData.xpEarned}
                    {' '}
                    {t('xp')}
                  </motion.div>

                  {completionData.bonuses.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="mb-3 font-semibold text-warning">
                        {t('achievements')}
                        :
                      </h3>
                      {completionData.bonuses.map((bonus, bonusIndex) => (
                        <motion.div
                          key={`bonus-${bonusIndex}`}
                          className="flex items-center justify-between rounded-lg bg-card/50 px-3 py-2 sm:px-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: bonusIndex * 0.2 }}
                        >
                          <span className="text-sm text-muted-foreground">
                            {bonus.reason}
                          </span>
                          <span className="font-bold text-warning">
                            +
                            {bonus.amount}
                            {' '}
                            {t('xp')}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step: New Badges */}
            {steps[currentStep] === 'badges' && completionData.newBadges.length > 0 && (
              <motion.div
                className="p-6 text-center sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">
                  🏆
                  {' '}
                  {t('new_certification_unlocked')}
                  !
                </h2>
                <div className="mb-6 flex flex-wrap justify-center gap-3 sm:gap-4">
                  {completionData.newBadges.map((badge, badgeIndex) => (
                    <motion.div
                      key={badge.id}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: badgeIndex * 0.3,
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                      }}
                    >
                      <ProfessionalBadgeComponent
                        badge={badge}
                        size="xl"
                        isNew
                        showTooltip={false}
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-2">
                  {completionData.newBadges.map((badge, badgeDescIndex) => (
                    <motion.p
                      key={badge.id}
                      className="text-sm text-muted-foreground sm:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + badgeDescIndex * 0.2 }}
                    >
                      <strong>{badge.name.it}</strong>
                      {' - '}
                      {badge.description.it}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step: Level Up */}
            {steps[currentStep] === 'level_up' && completionData.levelUp && (
              <motion.div
                className="p-6 text-center sm:p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.div
                  className="mb-4 text-4xl sm:text-6xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 1.5 }}
                >
                  ⬆️
                </motion.div>
                <h2 className="mb-4 text-2xl font-bold text-primary sm:text-3xl">
                  {t('level_up')}
                  !
                </h2>
                <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 p-4 sm:p-6">
                  <div className="mb-2 text-base text-muted-foreground sm:text-lg">
                    {t('level')}
                    {' '}
                    {completionData.levelUp.from}
                    {' → '}
                    {t('level')}
                    {' '}
                    {completionData.levelUp.to}
                  </div>
                  <div className="text-lg font-bold text-primary sm:text-xl">
                    {completionData.levelUp.newTitle}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step: Streak Milestone */}
            {steps[currentStep] === 'streak' && completionData.streakMilestone && (
              <motion.div
                className="p-6 text-center sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  className="mb-4 text-4xl sm:text-6xl"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 1, repeat: 2 }}
                >
                  🔥
                </motion.div>
                <h2 className="mb-4 text-xl font-bold text-warning sm:text-2xl">
                  {t('milestone')}
                  {' '}
                  {t('streak')}
                  !
                </h2>
                <div className="rounded-2xl bg-gradient-to-r from-warning/10 to-destructive/5 p-4 sm:p-6">
                  <div className="mb-2 text-2xl font-bold text-warning sm:text-3xl">
                    {completionData.streakMilestone.days}
                    {' '}
                    {t('days')}
                  </div>
                  <div className="mb-3 text-base text-muted-foreground sm:text-lg">
                    {completionData.streakMilestone.title}
                  </div>
                  <div className="font-semibold text-warning">
                    Bonus: +
                    {completionData.streakMilestone.bonus}
                    {' '}
                    {t('xp')}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step: Summary */}
            {steps[currentStep] === 'summary' && (
              <motion.div
                className="p-6 text-center sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">
                  {t('progress')}
                </h2>

                <div className="mb-8 space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="text-muted-foreground">
                      {t('xp')}
                      {' '}
                      {t('achievements')}
                    </span>
                    <span className="font-bold text-warning">
                      +
                      {completionData.xpEarned}
                      {' '}
                      {t('xp')}
                    </span>
                  </div>

                  {completionData.newBadges.length > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <span className="text-muted-foreground">{t('badges')}</span>
                      <span className="font-bold text-primary">
                        {completionData.newBadges.length}
                      </span>
                    </div>
                  )}

                  {completionData.levelUp && (
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <span className="text-muted-foreground">{t('level')}</span>
                      <span className="font-bold text-primary">
                        {completionData.levelUp.to}
                      </span>
                    </div>
                  )}
                </div>

                <motion.button
                  type="button"
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl sm:px-6 sm:py-4"
                  onClick={onComplete}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tLearning('continue')}
                </motion.button>
              </motion.div>
            )}

            {/* Progress Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:bottom-4">
              <div className="flex space-x-1 sm:space-x-2">
                {steps.map((_, stepIndex) => (
                  <motion.div
                    key={`step-${stepIndex}`}
                    className={`size-2 rounded-full ${
                      stepIndex <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                    animate={{ scale: stepIndex === currentStep ? 1.2 : 1 }}
                  />
                ))}
              </div>
            </div>

            {/* Skip/Next Button */}
            {currentStep < steps.length - 1 && (
              <button
                type="button"
                onClick={nextStep}
                className="absolute right-3 top-3 p-1 text-muted-foreground transition-colors hover:text-foreground sm:right-4 sm:top-4"
              >
                <svg className="size-5 sm:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};