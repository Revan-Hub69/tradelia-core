'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { cn } from '@/utils/Helpers';

type DemoStep = 'cognitive-select' | 'lesson' | 'quiz' | 'result' | 'rewards';
type CognitiveStyle = 'analogical' | 'procedural' | 'conceptual';

/**
 * Interactive Demo 2026 - Research-Based Cognitive Approaches
 *
 * Based on Adaptive Communication Styles Research 2026:
 * - Shows same crypto concept (Bitcoin) in 3 cognitive approaches
 * - Demonstrates cognitive flexibility and style switching
 * - Implements research findings on multiple representations
 */

/**
 * Cognitive Style definitions based on research
 */
const getCognitiveStyles = (t: any) => ({
  analogical: {
    label: t('cognitive_analogical'),
    desc: t('cognitive_analogical_desc'),
    icon: '🎭',
    process: 'Analogical mapping',
  },
  procedural: {
    label: t('cognitive_procedural'),
    desc: t('cognitive_procedural_desc'),
    icon: '🔧',
    process: 'Sequential learning',
  },
  conceptual: {
    label: t('cognitive_conceptual'),
    desc: t('cognitive_conceptual_desc'),
    icon: '📚',
    process: 'Structured understanding',
  },
});

/**
 * Lesson content based on cognitive style - same concept, different approaches
 */
const getLessonContent = (t: any) => ({
  analogical: {
    title: t('lesson_title'),
    explanation: t('lesson_analogical_explanation'),
    question: t('lesson_analogical_question'),
    options: [
      { id: 'a', text: t('lesson_analogical_option_a') },
      { id: 'b', text: t('lesson_analogical_option_b') },
      { id: 'c', text: t('lesson_analogical_option_c') },
    ],
    correct: 'a',
    visual: '🪙 → 💻 → 🌐',
  },
  procedural: {
    title: t('lesson_title'),
    explanation: t('lesson_procedural_explanation'),
    question: t('lesson_procedural_question'),
    options: [
      { id: 'a', text: t('lesson_procedural_option_a') },
      { id: 'b', text: t('lesson_procedural_option_b') },
      { id: 'c', text: t('lesson_procedural_option_c') },
    ],
    correct: 'b',
    visual: '👤 → 🌐 → 👤',
  },
  conceptual: {
    title: t('lesson_title'),
    explanation: t('lesson_conceptual_explanation'),
    question: t('lesson_conceptual_question'),
    options: [
      { id: 'a', text: t('lesson_conceptual_option_a') },
      { id: 'b', text: t('lesson_conceptual_option_b') },
      { id: 'c', text: t('lesson_conceptual_option_c') },
    ],
    correct: 'a',
    visual: '⛓️ → 🔐 → ✅',
  },
});

/**
 * Rewards based on cognitive exploration
 */
const getRewards = (t: any) => ({
  analogical: { xp: 15, unlock: t('reward_metaphorical_thinking'), next: t('reward_try_procedural') },
  procedural: { xp: 20, unlock: t('reward_practical_skills'), next: t('reward_try_conceptual') },
  conceptual: { xp: 25, unlock: t('reward_theoretical_foundation'), next: t('reward_cognitive_flexibility') },
});

export const InteractiveDemo = () => {
  const t = useTranslations('InteractiveDemo');
  const [step, setStep] = useState<DemoStep>('cognitive-select');
  const [cognitiveStyle, setCognitiveStyle] = useState<CognitiveStyle>('analogical');
  const [answer, setAnswer] = useState<string | null>(null);
  const [exploredStyles, setExploredStyles] = useState<Set<CognitiveStyle>>(new Set());

  const cognitiveStyles = getCognitiveStyles(t);
  const rewards = getRewards(t);
  const lessonContent = getLessonContent(t);

  const currentLesson = lessonContent[cognitiveStyle];
  const currentReward = rewards[cognitiveStyle];
  const isCorrect = answer === currentLesson.correct;

  const handleCognitiveSelect = (style: CognitiveStyle) => {
    setCognitiveStyle(style);
    setStep('lesson');
  };

  const handleAnswer = (selectedAnswer: string) => {
    setAnswer(selectedAnswer);
    setStep('result');

    // Track explored style
    const newExploredStyles = new Set(exploredStyles);
    newExploredStyles.add(cognitiveStyle);
    setExploredStyles(newExploredStyles);
  };

  const showRewards = () => {
    setStep('rewards');
  };

  const restart = () => {
    setStep('cognitive-select');
    setAnswer(null);
  };

  const tryAnotherStyle = () => {
    const unexploredStyles = (['analogical', 'procedural', 'conceptual'] as CognitiveStyle[])
      .filter(style => !exploredStyles.has(style));

    if (unexploredStyles.length > 0) {
      setCognitiveStyle(unexploredStyles[0]!);
      setStep('lesson');
      setAnswer(null);
    } else {
      restart();
    }
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
                        {step === 'cognitive-select'
                          ? t('welcome')
                          : `${cognitiveStyles[cognitiveStyle].icon} ${cognitiveStyles[cognitiveStyle].label}`}
                      </span>
                    </div>
                    {step !== 'cognitive-select' && (
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
                  {step !== 'cognitive-select' && (
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

                  {/* Cognitive Flexibility Indicator */}
                  {exploredStyles.size > 0 && step !== 'cognitive-select' && (
                    <div className="mb-3 flex items-center justify-center gap-1">
                      {(['analogical', 'procedural', 'conceptual'] as CognitiveStyle[]).map(style => (
                        <div
                          key={style}
                          className={cn(
                            'size-2 rounded-full transition-colors',
                            exploredStyles.has(style) ? 'bg-accent' : 'bg-muted',
                          )}
                        />
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {exploredStyles.size}
                        /3 approcci
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    {step === 'cognitive-select' && (
                      <div className="space-y-3">
                        <h3 className="text-base font-semibold">{t('cognitive_question')}</h3>
                        <p className="text-xs text-muted-foreground">
                          {t('cognitive_subtitle')}
                        </p>
                        {Object.entries(cognitiveStyles).map(([key, style]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleCognitiveSelect(key as CognitiveStyle)}
                            className="w-full rounded-lg border border-border bg-background p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
                          >
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-lg">{style.icon}</span>
                              <span className="text-sm font-medium">{style.label}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{style.desc}</div>
                            <div className="mt-1 text-xs text-muted-foreground/70">
                              {style.process}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {step === 'lesson' && (
                      <div>
                        <div className="mb-3 text-center">
                          <div className="mb-2 text-2xl">{currentLesson.visual}</div>
                          <h3 className="text-base font-semibold">{currentLesson.title}</h3>
                        </div>
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
                          isCorrect ? 'bg-emerald-500/10' : 'bg-blue-500/10',
                        )}
                        >
                          <div className={cn(
                            'mt-0.5 size-4 rounded-full flex items-center justify-center',
                            isCorrect ? 'bg-emerald-500' : 'bg-blue-500',
                          )}
                          >
                            <svg className="size-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className={cn('text-sm font-semibold', isCorrect ? 'text-emerald-600' : 'text-blue-600')}>
                              {isCorrect ? t('correct') : t('good_try')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isCorrect ? t('correct_desc') : t('learning_desc')}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={showRewards}
                          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                        >
                          {t('see_progress')}
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
                          <div className="text-sm font-medium">{t('approach_unlocked')}</div>
                          <div className="text-sm font-semibold text-accent">{currentReward.unlock}</div>
                        </div>

                        {/* Cognitive Flexibility Achievement */}
                        {exploredStyles.size === 3 && (
                          <div className="mb-4 rounded-lg border border-green-200 bg-green-500/10 p-3">
                            <div className="mb-1 text-lg">🧠✨</div>
                            <div className="text-sm font-semibold text-green-700">
                              Flessibilità Cognitiva Raggiunta!
                            </div>
                            <div className="text-xs text-green-600">
                              Hai esplorato tutti e 3 gli approcci cognitivi
                            </div>
                          </div>
                        )}

                        <p className="mb-4 text-xs text-muted-foreground">
                          {exploredStyles.size < 3 ? currentReward.next : t('cognitive_mastery_desc')}
                        </p>

                        <div className="space-y-2">
                          <Link
                            href="/sign-up"
                            className="block w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                          >
                            {t('continue_free')}
                          </Link>

                          {exploredStyles.size < 3
                            ? (
                                <button
                                  type="button"
                                  onClick={tryAnotherStyle}
                                  className="w-full py-2 text-xs text-primary hover:underline"
                                >
                                  {t('try_another_approach')}
                                </button>
                              )
                            : (
                                <button
                                  type="button"
                                  onClick={restart}
                                  className="w-full py-2 text-xs text-muted-foreground"
                                >
                                  {t('restart_demo')}
                                </button>
                              )}
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
                <h3 className="mb-2 text-lg font-semibold">{t('cognitive_flexibility_title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('cognitive_flexibility_desc')}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">{t('research_based_title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('research_based_desc')}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">{t('same_content_title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('same_content_desc')}
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
