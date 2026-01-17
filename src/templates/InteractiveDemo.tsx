'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { cn } from '@/utils/Helpers';

type DemoStep = 'level-select' | 'lesson' | 'quiz' | 'result' | 'rewards';
type UserLevel = 'beginner' | 'curious' | 'experienced';

/**
 * Level definitions
 */
const getLevels = (t: any) => ({
  beginner: { label: t('level_beginner'), desc: t('level_beginner_desc') },
  curious: { label: t('level_curious'), desc: t('level_curious_desc') },
  experienced: { label: t('level_experienced'), desc: t('level_experienced_desc') },
});

/**
 * Lesson content based on level
 */
const getLessonContent = (t: any) => ({
  beginner: {
    title: t('lesson_title'),
    explanation: t('lesson_beginner_explanation'),
    question: t('lesson_beginner_question'),
    options: [
      { id: 'a', text: t('lesson_beginner_option_a') },
      { id: 'b', text: t('lesson_beginner_option_b') },
      { id: 'c', text: t('lesson_beginner_option_c') },
    ],
    correct: 'a',
  },
  curious: {
    title: t('lesson_title'),
    explanation: t('lesson_curious_explanation'),
    question: t('lesson_curious_question'),
    options: [
      { id: 'a', text: t('lesson_curious_option_a') },
      { id: 'b', text: t('lesson_curious_option_b') },
      { id: 'c', text: t('lesson_curious_option_c') },
    ],
    correct: 'b',
  },
  experienced: {
    title: t('lesson_title'),
    explanation: t('lesson_experienced_explanation'),
    question: t('lesson_experienced_question'),
    options: [
      { id: 'a', text: t('lesson_experienced_option_a') },
      { id: 'b', text: t('lesson_experienced_option_b') },
      { id: 'c', text: t('lesson_experienced_option_c') },
    ],
    correct: 'a',
  },
});

/**
 * Rewards based on level
 */
const getRewards = (t: any) => ({
  beginner: { xp: 15, unlock: t('reward_wallet_basics'), next: t('reward_wallet_next') },
  curious: { xp: 25, unlock: t('reward_defi'), next: t('reward_defi_next') },
  experienced: { xp: 35, unlock: t('reward_smart_contracts'), next: t('reward_smart_contracts_next') },
});

export const InteractiveDemo = () => {
  const t = useTranslations('InteractiveDemo' as any) as (key: string) => string;
  const [step, setStep] = useState<DemoStep>('level-select');
  const [userLevel, setUserLevel] = useState<UserLevel>('beginner');
  const [answer, setAnswer] = useState<string | null>(null);

  const levels = getLevels(t);
  const rewards = getRewards(t);
  const lessonContent = getLessonContent(t);

  const currentLesson = lessonContent[userLevel];
  const currentReward = rewards[userLevel];
  const isCorrect = answer === currentLesson.correct;

  const handleLevelSelect = (level: UserLevel) => {
    setUserLevel(level);
    setStep('lesson');
  };

  const handleAnswer = (selectedAnswer: string) => {
    setAnswer(selectedAnswer);
    setStep('result');
  };

  const showRewards = () => {
    setStep('rewards');
  };

  const restart = () => {
    setStep('level-select');
    setAnswer(null);
  };

  return (
    <section id="demo" className="border-y border-border bg-muted/40 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-10 grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Phone Mockup */}
          <div className="order-2 flex justify-center lg:order-1">
            <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[320px]">
              <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-foreground/10 bg-card shadow-2xl">
                {/* Notch */}
                <div className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-foreground/10" />

                {/* Screen */}
                <div className="aspect-[9/19] bg-background p-4 pt-10">
                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                        <span className="text-sm font-bold text-primary-foreground">T</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {step === 'level-select' ? t('welcome') : `${t('quiz')} ${userLevel === 'beginner' ? '1' : userLevel === 'curious' ? '5' : '12'}`}
                      </span>
                    </div>
                    {step !== 'level-select' && (
                      <div className="rounded-full bg-accent/20 px-2 py-1">
                        <span className="text-xs font-medium text-accent">
                          +
                          {currentReward.xp}
                          {' '}
                          XP
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {step !== 'level-select' && (
                    <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={cn(
                          'h-full rounded-full bg-primary transition-all duration-500',
                          step === 'lesson' && 'w-1/4',
                          step === 'quiz' && 'w-2/4',
                          step === 'result' && 'w-3/4',
                          step === 'rewards' && 'w-full',
                        )}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    {step === 'level-select' && (
                      <div className="space-y-3">
                        <h3 className="text-base font-semibold">{t('level_question')}</h3>
                        <p className="text-xs text-muted-foreground">
                          {t('level_subtitle')}
                        </p>
                        {Object.entries(levels).map(([key, level]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleLevelSelect(key as UserLevel)}
                            className="w-full rounded-lg border border-border bg-background p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
                          >
                            <div className="text-sm font-medium">{level.label}</div>
                            <div className="text-xs text-muted-foreground">{level.desc}</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {step === 'lesson' && (
                      <div>
                        <h3 className="mb-3 text-base font-semibold">{currentLesson.title}</h3>
                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                          {currentLesson.explanation}
                        </p>
                        <button
                          type="button"
                          onClick={() => setStep('quiz')}
                          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                        >
                          {t('continue')}
                        </button>
                      </div>
                    )}

                    {step === 'quiz' && (
                      <div>
                        <h3 className="mb-4 text-base font-semibold">{currentLesson.question}</h3>
                        <div className="space-y-2">
                          {currentLesson.options.map(option => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleAnswer(option.id)}
                              className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
                            >
                              <span className="flex size-6 shrink-0 items-center justify-center rounded border border-border text-xs font-bold uppercase">
                                {option.id}
                              </span>
                              <span>{option.text}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 'result' && (
                      <div>
                        <div className={cn(
                          'mb-4 flex items-start gap-2 rounded-lg p-3',
                          isCorrect ? 'bg-emerald-500/10' : 'bg-red-500/10',
                        )}
                        >
                          <div className={cn(
                            'mt-0.5 size-4 rounded-full flex items-center justify-center',
                            isCorrect ? 'bg-emerald-500' : 'bg-red-500',
                          )}
                          >
                            {isCorrect
                              ? (
                                  <svg className="size-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )
                              : (
                                  <svg className="size-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                )}
                          </div>
                          <div>
                            <p className={cn('text-sm font-semibold', isCorrect ? 'text-emerald-600' : 'text-red-600')}>
                              {isCorrect ? t('correct') : t('almost')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isCorrect ? t('correct_desc') : t('almost_desc')}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={showRewards}
                          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                        >
                          {t('rewards')}
                        </button>
                      </div>
                    )}

                    {step === 'rewards' && (
                      <div className="text-center">
                        <div className="mb-4 rounded-lg bg-accent/10 p-4">
                          <div className="mb-2 text-2xl font-bold text-accent">
                            +
                            {currentReward.xp}
                            {' '}
                            XP
                          </div>
                          <div className="text-sm font-medium">{t('module_unlocked')}</div>
                          <div className="text-sm font-semibold text-accent">{currentReward.unlock}</div>
                        </div>
                        <p className="mb-4 text-xs text-muted-foreground">
                          {currentReward.next}
                        </p>
                        <div className="space-y-2">
                          <Link
                            href="/sign-up"
                            className="block w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                          >
                            {t('continue_free')}
                          </Link>
                          <button
                            type="button"
                            onClick={restart}
                            className="w-full py-2 text-xs text-muted-foreground"
                          >
                            {t('try_other')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-b from-primary/20 to-accent/20 opacity-50 blur-2xl" />
            </div>
          </div>

          {/* Description */}
          <div className="order-1 lg:order-2">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold">{t('adaptive_title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('adaptive_desc')}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">{t('rewards_title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('rewards_desc')}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">{t('microlearning_title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('microlearning_desc')}
                </p>
              </div>

              <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                <p className="text-sm">
                  <span className="font-semibold text-accent">{t('try_now')}</span>
                  {' '}
                  {t('try_now_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
