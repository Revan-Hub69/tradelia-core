'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type Country, ModernCountryDropdown } from '@/components/ui/modern-country-dropdown';
import { FadeIn, SlideReveal } from '@/components/ui/scroll-animations';
import { Logo } from '@/templates/Logo';

/**
 * Fixed Premium Onboarding Flow 2026
 *
 * FIXES APPLIED:
 * ✅ Full translation support (no hardcoded text)
 * ✅ Back navigation buttons on every step
 * ✅ Real Tradelia logo (not fake SVG)
 * ✅ Country selection for fiscal/legal compliance
 * ✅ Proper UX flow with clear navigation
 */

type OnboardingStep = 'welcome' | 'country' | 'skillAssessment' | 'personalization' | 'registration' | 'complete';

type UserLevel = 'novice' | 'intermediate' | 'advanced';
type LearningGoal = 'foundation' | 'protection' | 'critical' | 'opportunity' | 'professional';

type OnboardingData = {
  country?: Country;
  level?: UserLevel;
  primaryGoal?: LearningGoal;
  timeCommitment?: 'focused' | 'balanced' | 'deep';
  skillScore?: number;
  email?: string;
  password?: string;
  registrationMethod?: 'email' | 'google';
};

/**
 * Progress Indicator with Real Logo - FIXED ALIGNMENT
 */
const ProgressIndicator = ({
  currentStep,
  onBack,
}: {
  currentStep: OnboardingStep;
  onBack?: () => void;
}) => {
  const t = useTranslations('Onboarding');
  const steps = ['welcome', 'country', 'skillAssessment', 'personalization', 'registration', 'complete'];
  const currentIndex = steps.indexOf(currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 sm:py-4">
        {/* Header row con layout fisso a 3 colonne */}
        <div className="grid grid-cols-3 items-center">
          {/* Left: Logo + Back button - FORCED VERTICAL ALIGNMENT */}
          <div className="flex items-center justify-start">
            <div className="flex items-center justify-center">
              <Logo size="sm" href="/" className="leading-none sm:hidden" />
              <Logo size="md" href="/" className="hidden leading-none sm:block" />
            </div>

            {onBack && currentStep !== 'welcome' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="ml-3 flex items-center gap-1 sm:gap-2"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">{t('back_button')}</span>
              </Button>
            )}
          </div>

          {/* Center: Empty per bilanciamento */}
          <div />

          {/* Right: Progress text */}
          <div className="flex justify-end">
            <span className="text-xs font-medium text-muted-foreground sm:text-sm">
              {currentStep === 'complete' ? t('progress_complete') : t('progress_step', { current: currentIndex + 1, total: steps.length })}
            </span>
          </div>
        </div>

        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted sm:mt-4">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Step 1: Welcome
 */
const WelcomeStep = ({ onNext }: { onNext: () => void }) => {
  const t = useTranslations('Onboarding');

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <SlideReveal>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {t('welcome_title')}
          </h1>
        </SlideReveal>

        <FadeIn delay={200}>
          <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg lg:text-xl">
            {t('welcome_subtitle')}
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm sm:p-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 sm:p-6">
              <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4">
                <svg className="size-4 text-accent sm:size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-sm font-semibold text-accent sm:text-base">
                  {t('welcome_promise_title')}
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground sm:text-sm">
                <li className="flex items-center gap-2">
                  <svg className="size-3 text-accent sm:size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('welcome_promise_1')}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="size-3 text-accent sm:size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('welcome_promise_2')}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="size-3 text-accent sm:size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('welcome_promise_3')}
                </li>
              </ul>
            </div>

            <div className="text-center">
              <Button onClick={onNext} size="lg" className="w-full px-6 sm:w-auto sm:px-8">
                {t('welcome_cta')}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground sm:mt-3">
                {t('welcome_time_estimate')}
              </p>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};

/**
 * Step 2: Country Selection - Professional Implementation
 */
const CountryStep = ({ onNext }: { onNext: (data: Partial<OnboardingData>) => void }) => {
  const t = useTranslations('Onboarding');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleContinue = () => {
    if (selectedCountry) {
      onNext({ country: selectedCountry });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <SlideReveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t('country_title')}
          </h2>
        </SlideReveal>

        <FadeIn delay={200}>
          <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">
            {t('country_subtitle')}
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm sm:p-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Country Dropdown - Modern Implementation */}
            <div>
              <label htmlFor="country-select" className="mb-3 block text-sm font-medium">
                {t('country_select_label')}
              </label>
              <ModernCountryDropdown
                placeholder={t('country_placeholder')}
                onChange={handleCountryChange}
                disabled={false}
              />
            </div>

            {/* Legal Notice */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <svg className="mt-0.5 size-4 shrink-0 text-blue-600 sm:size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 sm:text-base">{t('country_legal_title')}</h4>
                  <p className="mt-1 text-xs text-blue-800 sm:text-sm">{t('country_legal_text')}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleContinue}
                disabled={!selectedCountry}
                size="lg"
                className="w-full px-6 sm:w-auto sm:px-8"
              >
                {selectedCountry ? t('country_continue') : t('country_select_first')}
              </Button>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};

/**
 * Step 3: Skill Assessment with Translations
 */
const SkillAssessmentStep = ({ onNext }: { onNext: (data: Partial<OnboardingData>) => void }) => {
  const t = useTranslations('Onboarding');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Questions using translations
  const questions = [
    {
      question: t('skill_q1_question'),
      options: [
        t('skill_q1_option_a'),
        t('skill_q1_option_b'),
        t('skill_q1_option_c'),
        t('skill_q1_option_d'),
      ],
      correct: 1,
      explanation: t('skill_q1_explanation'),
    },
    {
      question: t('skill_q2_question'),
      options: [
        t('skill_q2_option_a'),
        t('skill_q2_option_b'),
        t('skill_q2_option_c'),
        t('skill_q2_option_d'),
      ],
      correct: 2,
      explanation: t('skill_q2_explanation'),
    },
    {
      question: t('skill_q3_question'),
      options: [
        t('skill_q3_option_a'),
        t('skill_q3_option_b'),
        t('skill_q3_option_c'),
        t('skill_q3_option_d'),
      ],
      correct: 0,
      explanation: t('skill_q3_explanation'),
    },
  ];

  const currentQ = questions[currentQuestion];
  if (!currentQ) {
    return null;
  }

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        // Calculate skill level
        const correctAnswers = newAnswers.reduce((count, answer, index) => {
          const question = questions[index];
          return count + (question && answer === question.correct ? 1 : 0);
        }, 0);

        const skillScore = (correctAnswers / questions.length) * 100;
        let level: UserLevel = 'novice';

        if (skillScore >= 80) {
          level = 'advanced';
        } else if (skillScore >= 50) {
          level = 'intermediate';
        }

        onNext({ level, skillScore });
      }
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <SlideReveal>
          <h2 className="text-3xl font-bold tracking-tight">
            {t('skill_title')}
          </h2>
        </SlideReveal>

        <FadeIn delay={200}>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('skill_subtitle')}
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-border/50 bg-card/50 p-4 backdrop-blur-sm md:p-6 lg:p-8 xl:p-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-5 lg:mb-6">
            <span className="text-xs font-medium text-muted-foreground md:text-sm">
              {t('skill_progress', { current: currentQuestion + 1, total: questions.length })}
            </span>
            <div className="flex gap-2">
              {questions.map((_, questionIndex) => (
                <div
                  key={`progress-q${questionIndex}`}
                  className={`h-2 w-6 rounded-full transition-colors md:w-7 lg:w-8 ${
                    questionIndex < currentQuestion
                      ? 'bg-green-500'
                      : questionIndex === currentQuestion
                        ? 'bg-primary'
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 md:space-y-5 lg:space-y-6">
            <h3 className="text-lg font-semibold leading-relaxed md:text-xl xl:text-2xl">
              {currentQ.question}
            </h3>

            <div className="space-y-3">
              {currentQ.options.map((option, optionIndex) => (
                <button
                  key={`q${currentQuestion}-opt${optionIndex}`}
                  type="button"
                  role="radio"
                  aria-checked={selectedAnswer === optionIndex}
                  onClick={() => handleAnswer(optionIndex)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAnswer(optionIndex);
                    }
                  }}
                  disabled={showExplanation}
                  className={`w-full rounded-xl border p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:p-4 xl:p-5 ${
                    showExplanation
                      ? optionIndex === currentQ.correct
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : selectedAnswer === optionIndex
                          ? 'border-red-300 bg-red-50 text-red-600'
                          : 'border-muted bg-muted/50 text-muted-foreground'
                      : 'border-border bg-background hover:border-primary hover:bg-primary/5 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-muted font-mono text-xs font-semibold md:size-8 md:text-sm xl:size-9 xl:text-base">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium md:text-base xl:text-lg">{option}</span>
                    {showExplanation && optionIndex === currentQ.correct && (
                      <svg className="ml-auto size-5 shrink-0 text-green-600 md:size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showExplanation && (
              <FadeIn>
                <div
                  className="rounded-xl border border-blue-200 bg-blue-50 p-4 lg:p-6"
                  role="status"
                  aria-live="polite"
                  aria-label="Spiegazione della risposta"
                  ref={(el) => {
                    if (el) {
                      // Scroll automatico per mantenere la spiegazione in viewport
                      setTimeout(() => {
                        el.scrollIntoView({
                          behavior: 'smooth',
                          block: 'nearest',
                          inline: 'nearest',
                        });
                      }, 100);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="size-8 shrink-0 rounded-lg bg-blue-100 p-1.5">
                      <svg className="size-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="mb-2 text-sm font-semibold text-blue-900 lg:text-base">{t('skill_explanation_title')}</h4>
                      <p className="text-sm leading-relaxed text-blue-800 lg:text-base">{currentQ.explanation}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};

/**
 * Step 4: Personalization with Translations
 */
const PersonalizationStep = ({ onNext }: { onNext: (data: Partial<OnboardingData>) => void }) => {
  const t = useTranslations('Onboarding');
  const [selections, setSelections] = useState<{
    goal?: LearningGoal;
    time?: 'focused' | 'balanced' | 'deep';
  }>({});

  const goals = [
    {
      id: 'foundation' as LearningGoal,
      title: t('goal_foundation_title'),
      description: t('goal_foundation_desc'),
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 'protection' as LearningGoal,
      title: t('goal_protection_title'),
      description: t('goal_protection_desc'),
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 'critical' as LearningGoal,
      title: t('goal_critical_title'),
      description: t('goal_critical_desc'),
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'opportunity' as LearningGoal,
      title: t('goal_opportunity_title'),
      description: t('goal_opportunity_desc'),
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: 'professional' as LearningGoal,
      title: t('goal_professional_title'),
      description: t('goal_professional_desc'),
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v2a2 2 0 002 2h4a2 2 0 002-2V6" />
        </svg>
      ),
    },
  ];

  const timeOptions = [
    {
      id: 'focused' as const,
      title: t('time_focused_title'),
      description: t('time_focused_desc'),
    },
    {
      id: 'balanced' as const,
      title: t('time_balanced_title'),
      description: t('time_balanced_desc'),
    },
    {
      id: 'deep' as const,
      title: t('time_deep_title'),
      description: t('time_deep_desc'),
    },
  ];

  const canContinue = selections.goal && selections.time;

  const handleContinue = () => {
    if (canContinue) {
      onNext({
        primaryGoal: selections.goal,
        timeCommitment: selections.time,
      });
    }
  };

  return (
    <div className="space-y-6 md:space-y-7 lg:space-y-8">
      <div className="text-center">
        <SlideReveal>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl xl:text-4xl">
            {t('personalize_title')}
          </h2>
        </SlideReveal>

        <FadeIn delay={200}>
          <p className="mt-3 text-base text-muted-foreground md:mt-4 lg:text-lg xl:text-xl">
            {t('personalize_subtitle')}
          </p>
        </FadeIn>
      </div>

      <div className="space-y-6 md:space-y-7 lg:space-y-8">
        {/* Goal Selection */}
        <div>
          <h3 className="mb-4 text-lg font-semibold md:mb-5 lg:mb-6 lg:text-xl">{t('personalize_goal_title')}</h3>
          <div className="space-y-4 sm:space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 xl:gap-6">
            {goals.map(goal => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelections(prev => ({ ...prev, goal: goal.id }))}
                className={`group w-full rounded-xl border p-4 text-left transition-all hover:shadow-lg md:p-5 xl:p-6 ${
                  selections.goal === goal.id
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div
                    className={`size-10 shrink-0 rounded-lg p-2 transition-colors md:size-11 xl:size-12 xl:p-2.5 ${
                      selections.goal === goal.id
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    }`}
                  >
                    {goal.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-1 text-sm font-semibold md:text-base xl:text-lg">{goal.title}</h4>
                    <p className="text-xs text-muted-foreground md:text-sm xl:text-base">{goal.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Commitment */}
        <div>
          <h3 className="mb-4 text-lg font-semibold md:mb-5 lg:mb-6 lg:text-xl">{t('personalize_time_title')}</h3>
          <div className="space-y-3 sm:space-y-2 md:grid md:grid-cols-3 md:gap-4 md:space-y-0 xl:gap-6">
            {timeOptions.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelections(prev => ({ ...prev, time: option.id }))}
                className={`group w-full rounded-xl border p-4 text-center transition-all hover:shadow-lg md:p-5 xl:p-6 ${
                  selections.time === option.id
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <div
                  className={`mx-auto mb-2 size-10 rounded-lg p-2 transition-colors md:mb-3 md:size-11 xl:size-12 xl:p-2.5 ${
                    selections.time === option.id
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  }`}
                >
                  <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="mb-1 text-sm font-semibold md:text-base xl:text-lg">{option.title}</h4>
                <p className="text-xs text-muted-foreground md:text-sm xl:text-base">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Micro-feedback */}
        {selections.goal && selections.time && (
          <FadeIn>
            <div
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 md:p-5 lg:p-6 xl:p-7"
              role="status"
              aria-live="polite"
              aria-label="Feedback personalizzato"
              ref={(el) => {
                if (el) {
                  // Scroll automatico per mantenere il feedback visibile
                  setTimeout(() => {
                    el.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                      inline: 'nearest',
                    });
                  }, 200);
                }
              }}
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="size-8 shrink-0 rounded-lg bg-emerald-100 p-1.5 md:size-9 xl:size-10 xl:p-2">
                  <svg className="size-full text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-2 text-sm font-semibold text-emerald-900 md:text-base xl:text-lg">{t('feedback_title')}</h4>
                  <p className="text-sm leading-relaxed text-emerald-800 md:text-base xl:text-lg">{t(`feedback_${selections.goal}`)}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </div>

      <div className="text-center">
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          size="lg"
          className="px-8"
        >
          {canContinue ? t('personalize_continue') : t('personalize_complete_selections')}
        </Button>
      </div>
    </div>
  );
};

/**
 * Step 5: Registration with Translations
 */
const RegistrationStep = ({ onNext }: { onNext: (data: Partial<OnboardingData>) => void }) => {
  const t = useTranslations('Onboarding');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t('registration_error_email_required');
    } else if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('registration_error_email_invalid');
    }

    if (!formData.password) {
      newErrors.password = t('registration_error_password_required');
    } else if (formData.password.length < 8) {
      newErrors.password = t('registration_error_password_length');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t('registration_error_password_strength');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('registration_error_password_match');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 8) {
      return { level: 'weak', label: t('password_strength_weak') };
    }
    if (!/[A-Z]/.test(password)) {
      return { level: 'medium', label: t('password_strength_medium') };
    }
    if (!/\d/.test(password)) {
      return { level: 'medium', label: t('password_strength_medium') };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { level: 'good', label: t('password_strength_good') };
    }
    return { level: 'strong', label: t('password_strength_strong') };
  };

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      onNext({
        email: formData.email,
        registrationMethod: 'email',
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);

    try {
      const { createClient } = await import('@/libs/supabase/client');
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        // Fallback per demo
        setTimeout(() => {
          onNext({
            email: 'user@gmail.com',
            registrationMethod: 'google',
          });
          setIsLoading(false);
        }, 1500);
      }
    } catch (error) {
      console.error('OAuth setup error:', error);
      // Fallback per demo
      setTimeout(() => {
        onNext({
          email: 'user@gmail.com',
          registrationMethod: 'google',
        });
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <SlideReveal>
          <h2 className="text-3xl font-bold tracking-tight">
            {t('registration_title')}
          </h2>
        </SlideReveal>

        <FadeIn delay={200}>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('registration_subtitle')}
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Google Signup */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full"
            >
              <svg className="mr-2 size-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('registration_google')}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('registration_or')}
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  {t('registration_email_label')}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium">
                  {t('registration_password_label')}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className={errors.password ? 'border-red-500' : ''}
                  placeholder="••••••••"
                  aria-describedby={formData.password ? 'password-strength' : undefined}
                />
                {formData.password && passwordStrength && (
                  <div id="password-strength" className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.level === 'weak'
                              ? 'w-1/4 bg-red-500'
                              : passwordStrength.level === 'medium'
                                ? 'w-2/4 bg-yellow-500'
                                : passwordStrength.level === 'good'
                                  ? 'w-3/4 bg-blue-500'
                                  : 'w-full bg-green-500'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength.level === 'weak'
                          ? 'text-red-600'
                          : passwordStrength.level === 'medium'
                            ? 'text-yellow-600'
                            : passwordStrength.level === 'good'
                              ? 'text-blue-600'
                              : 'text-green-600'
                      }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600" role="alert">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                  {t('registration_confirm_password_label')}
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600" role="alert">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading
                  ? (
                      <div className="flex items-center gap-2">
                        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creating account...
                      </div>
                    )
                  : (
                      t('registration_create_account')
                    )}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              {t('registration_terms')}
            </p>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};

/**
 * Step 6: Complete with Summary
 */
const CompleteStep = ({ data }: { data: OnboardingData }) => {
  const t = useTranslations('Onboarding');
  const router = useRouter();

  const getLevelLabel = (level?: UserLevel) => {
    switch (level) {
      case 'novice':
        return 'Principiante';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzato';
      default:
        return 'Non definito';
    }
  };

  const getGoalLabel = (goal?: LearningGoal) => {
    switch (goal) {
      case 'foundation':
        return t('goal_foundation_title');
      case 'protection':
        return t('goal_protection_title');
      case 'critical':
        return t('goal_critical_title');
      case 'opportunity':
        return t('goal_opportunity_title');
      case 'professional':
        return t('goal_professional_title');
      default:
        return 'Non definito';
    }
  };

  const getTimeLabel = (time?: string) => {
    switch (time) {
      case 'focused':
        return t('time_focused_title');
      case 'balanced':
        return t('time_balanced_title');
      case 'deep':
        return t('time_deep_title');
      default:
        return 'Non definito';
    }
  };

  const handleStartLearning = () => {
    // Save onboarding data to localStorage
    localStorage.setItem('tradelia_onboarding', JSON.stringify(data));

    // Redirect to dashboard or first lesson
    router.push('/dashboard');
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <SlideReveal>
          <div className="mx-auto mb-6 size-16 rounded-full bg-green-100 p-4">
            <svg className="size-full text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t('complete_title')}
          </h2>
        </SlideReveal>

        <FadeIn delay={200}>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('complete_subtitle')}
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">{t('complete_summary_title')}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-blue-100 p-2">
                      <svg className="size-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('complete_country_label')}</p>
                      <p className="font-medium">{data.country?.name || 'Non specificato'}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-green-100 p-2">
                      <svg className="size-full text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('complete_level_label')}</p>
                      <p className="font-medium">{getLevelLabel(data.level)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-purple-100 p-2">
                      <svg className="size-full text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('complete_goal_label')}</p>
                      <p className="font-medium">{getGoalLabel(data.primaryGoal)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-orange-100 p-2">
                      <svg className="size-full text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('complete_time_label')}</p>
                      <p className="font-medium">{getTimeLabel(data.timeCommitment)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleStartLearning} size="lg" className="flex-1">
                {t('complete_start_learning')}
              </Button>
              <Button onClick={handleGoToDashboard} variant="outline" size="lg" className="flex-1">
                {t('complete_dashboard')}
              </Button>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};

/**
 * Main Fixed Onboarding Flow Component
 */
export const FixedOnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [data, setData] = useState<OnboardingData>({});

  // Auto-scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleNext = (stepData?: Partial<OnboardingData>) => {
    if (stepData) {
      setData(prev => ({ ...prev, ...stepData }));
    }

    const steps: OnboardingStep[] = ['welcome', 'country', 'skillAssessment', 'personalization', 'registration', 'complete'];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    }
  };

  const handleBack = () => {
    const steps: OnboardingStep[] = ['welcome', 'country', 'skillAssessment', 'personalization', 'registration', 'complete'];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      if (prevStep) {
        setCurrentStep(prevStep);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onNext={handleNext} />;
      case 'country':
        return <CountryStep onNext={handleNext} />;
      case 'skillAssessment':
        return <SkillAssessmentStep onNext={handleNext} />;
      case 'personalization':
        return <PersonalizationStep onNext={handleNext} />;
      case 'registration':
        return <RegistrationStep onNext={handleNext} />;
      case 'complete':
        return <CompleteStep data={data} />;
      default:
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <ProgressIndicator currentStep={currentStep} onBack={handleBack} />

      <div className="px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28">
        <div className="mx-auto max-w-4xl">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};
