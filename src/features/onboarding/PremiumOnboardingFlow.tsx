'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FadeIn, SlideReveal } from '@/components/ui/scroll-animations';

/**
 * Premium Onboarding Flow 2026 - Research-Based
 *
 * Based on 2026 fintech + edtech research:
 * - Progressive profiling (Descope, LoginRadius)
 * - Value-first demonstration (not trivial questions)
 * - Skill-based adaptive content (StudyFetch approach)
 * - Integrated registration (reduces drop-off by 60%)
 * - Premium SVG icons (no emoji)
 * - Cognitive load reduction (Onething Design)
 */

type OnboardingStep = 'valueDemo' | 'skillAssessment' | 'personalization' | 'registration' | 'preview';

type UserLevel = 'novice' | 'intermediate' | 'advanced';

type LearningGoal = 'understand' | 'invest' | 'career' | 'curiosity';

type OnboardingData = {
  level?: UserLevel;
  primaryGoal?: LearningGoal;
  timeCommitment?: '5min' | '10min' | '15min';
  skillScore?: number;
  email?: string;
  password?: string;
  registrationMethod?: 'email' | 'google';
};

/**
 * Premium Progress Indicator - Minimal & Elegant
 */
const ProgressIndicator = ({ currentStep }: { currentStep: OnboardingStep }) => {
  const steps = ['valueDemo', 'skillAssessment', 'personalization', 'registration', 'preview'];
  const currentIndex = steps.indexOf(currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-4xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-accent p-2">
              <svg viewBox="0 0 24 24" fill="none" className="size-full text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5z" className="fill-current" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" className="stroke-current" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <span className="text-lg font-semibold">Tradelia</span>
          </div>

          <div className="text-sm font-medium text-muted-foreground">
            {currentStep === 'preview' ? 'Completato!' : `${currentIndex + 1} di ${steps.length}`}
          </div>
        </div>

        {/* Elegant progress bar */}
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
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
 * Step 1: Value Demonstration - Show Don't Tell
 * Research: Users need to see value within 30 seconds
 */
const ValueDemoStep = ({ onNext }: { onNext: () => void }) => {
  const [currentExample, setCurrentExample] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real crypto scenarios that demonstrate value
  const examples = [
    {
      scenario: 'Il tuo amico ti dice: \'Ho comprato Ethereum a 2000€, ora vale 3000€!\'',
      question: 'Cosa significa veramente?',
      insight: 'Ha fatto +50% in valore, ma non sappiamo: quando ha comprato, quanto ha investito, se ha venduto, le tasse da pagare...',
      lesson: 'Tradelia ti insegna a fare le domande giuste prima di prendere decisioni.',
    },
    {
      scenario: 'Leggi: \'Bitcoin consuma troppa energia, è un disastro ambientale\'',
      question: 'È vero o falso?',
      insight: 'Dipende dal confronto. Bitcoin usa 0.5% dell\'energia globale, meno di YouTube. Ma usa più energia di alcuni paesi.',
      lesson: 'Tradelia ti dà il contesto per capire le notizie senza farti manipolare.',
    },
    {
      scenario: 'Vedi un annuncio: \'Investi in questa crypto, +1000% garantito!\'',
      question: 'Red flag o opportunità?',
      insight: '🚩 TRUFFA. Nessun investimento può garantire rendimenti. Chi promette guadagni certi sta mentendo.',
      lesson: 'Tradelia ti insegna a riconoscere le truffe prima di perdere soldi.',
    },
  ];

  const currentEx = examples[currentExample];

  if (!currentEx) {
    return null;
  }

  const handleNext = () => {
    if (currentExample < examples.length - 1) {
      setCurrentExample(currentExample + 1);
    } else {
      onNext();
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <SlideReveal>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ecco cosa impari con Tradelia
          </h1>
        </SlideReveal>

        <FadeIn delay={200}>
          <p className="mt-4 text-lg text-muted-foreground">
            Situazioni reali, risposte chiare. Niente teoria astratta.
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Scenario */}
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
              <div className="flex items-start gap-3">
                <div className="size-8 shrink-0 rounded-lg bg-orange-100 p-1.5">
                  <svg className="size-full text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-orange-900">Situazione reale:</h3>
                  <p className="text-orange-800">{currentEx.scenario}</p>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="text-center">
              <h4 className="mb-4 text-xl font-semibold">{currentEx.question}</h4>
            </div>

            {/* Insight */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <div className="flex items-start gap-3">
                <div className="size-8 shrink-0 rounded-lg bg-blue-100 p-1.5">
                  <svg className="size-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-blue-900">La risposta:</h3>
                  <p className="text-blue-800">{currentEx.insight}</p>
                </div>
              </div>
            </div>

            {/* Lesson */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-6">
              <div className="flex items-start gap-3">
                <div className="size-8 shrink-0 rounded-lg bg-green-100 p-1.5">
                  <svg className="size-full text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-green-900">Cosa impari:</h3>
                  <p className="text-green-800">{currentEx.lesson}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {examples.map((_, exampleIndex) => (
                <div
                  key={`example-${exampleIndex}`}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    exampleIndex === currentExample ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button onClick={handleNext} size="lg" className="px-8">
              {currentExample < examples.length - 1 ? 'Prossimo esempio' : 'Iniziamo!'}
            </Button>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};
/**
 * Step 2: Intelligent Skill Assessment
 * Research: Adaptive content based on actual knowledge, not self-reported level
 */
const SkillAssessmentStep = ({ onNext }: { onNext: (data: Partial<OnboardingData>) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Progressive difficulty questions that actually assess understanding
  const questions = [
    {
      question: 'Cosa succede quando \'compri\' Bitcoin su un exchange come Binance?',
      options: [
        'Ricevi Bitcoin fisici nel tuo portafoglio',
        'L\'exchange tiene i Bitcoin per te (custodia)',
        'I Bitcoin vengono stampati apposta per te',
        'Diventi proprietario di una parte di Binance',
      ],
      correct: 1,
      explanation: 'Quando compri su un exchange, loro tengono i Bitcoin per te. Tu hai solo un credito. \'Not your keys, not your coins\' - se l\'exchange fallisce, rischi di perdere tutto.',
      difficulty: 1,
    },
    {
      question: 'Perché Bitcoin ha un limite di 21 milioni di monete?',
      options: [
        'È un numero magico scelto da Satoshi',
        'Per creare scarsità artificiale e far salire il prezzo',
        'Per evitare l\'inflazione e mantenere il valore nel tempo',
        'Perché 21 milioni è il massimo che la tecnologia può gestire',
      ],
      correct: 2,
      explanation: 'Il limite serve a prevenire l\'inflazione. A differenza delle valute tradizionali che possono essere stampate all\'infinito, Bitcoin ha una politica monetaria fissa e prevedibile.',
      difficulty: 2,
    },
    {
      question: 'Cosa significa \'DeFi\' e perché è diverso dalle banche tradizionali?',
      options: [
        'Finanza Decentralizzata - usa smart contract invece di banche',
        'Finanza Digitale - è solo la versione online delle banche',
        'Finanza Definitiva - è l\'evoluzione finale del denaro',
        'Finanza Democratica - tutti possono votare sui tassi di interesse',
      ],
      correct: 0,
      explanation: 'DeFi usa smart contract su blockchain per creare servizi finanziari senza intermediari. Invece di fidarti di una banca, ti fidi del codice (che è pubblico e verificabile).',
      difficulty: 3,
    },
  ];

  const currentQ = questions[currentQuestion];

  if (!currentQ) {
    return null;
  }

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    // Store answer
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    // Auto-advance after explanation
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        // Calculate skill level based on answers
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <SlideReveal>
          <h2 className="text-3xl font-bold tracking-tight">
            Valutiamo il tuo livello attuale
          </h2>
        </SlideReveal>

        <FadeIn delay={200}>
          <p className="mt-4 text-lg text-muted-foreground">
            3 domande per personalizzare il tuo percorso. Non è un esame!
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Domanda
              {' '}
              {currentQuestion + 1}
              {' '}
              di
              {' '}
              {questions.length}
            </span>
            <div className="flex gap-2">
              {questions.map((_, questionIndex) => (
                <div
                  key={`question-${questionIndex}`}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    questionIndex < currentQuestion
                      ? 'bg-green-500'
                      : questionIndex === currentQuestion ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold leading-relaxed">
              {currentQ.question}
            </h3>

            <div className="space-y-3">
              {currentQ.options.map((option, optionIndex) => (
                <button
                  key={`option-${optionIndex}`}
                  type="button"
                  onClick={() => handleAnswer(optionIndex)}
                  disabled={showExplanation}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    showExplanation
                      ? optionIndex === currentQ.correct
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : selectedAnswer === optionIndex
                          ? 'border-red-300 bg-red-50 text-red-600'
                          : 'border-muted bg-muted/50 text-muted-foreground'
                      : 'border-border bg-background hover:border-primary hover:bg-primary/5 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-muted font-mono text-sm font-semibold">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span className="font-medium">{option}</span>
                    {showExplanation && optionIndex === currentQ.correct && (
                      <svg className="ml-auto size-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showExplanation && (
              <FadeIn>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                  <div className="flex items-start gap-3">
                    <div className="size-8 shrink-0 rounded-lg bg-blue-100 p-1.5">
                      <svg className="size-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold text-blue-900">Spiegazione:</h4>
                      <p className="text-blue-800">{currentQ.explanation}</p>
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
 * Step 3: Goal-Based Personalization
 * Research: Personalization increases engagement by 137%
 */
const PersonalizationStep = ({ onNext }: { onNext: (data: Partial<OnboardingData>) => void }) => {
  const [selections, setSelections] = useState<{
    goal?: LearningGoal;
    time?: '5min' | '10min' | '15min';
  }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goals = [
    {
      id: 'understand' as LearningGoal,
      title: 'Capire le crypto',
      description: 'Voglio sapere come funzionano, senza necessariamente investire',
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: 'invest' as LearningGoal,
      title: 'Investire consapevolmente',
      description: 'Voglio investire, ma prima capire i rischi e le opportunità',
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: 'career' as LearningGoal,
      title: 'Opportunità di carriera',
      description: 'Voglio lavorare nel settore crypto/blockchain',
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v2a2 2 0 002 2h4a2 2 0 002-2V6" />
        </svg>
      ),
    },
    {
      id: 'curiosity' as LearningGoal,
      title: 'Semplice curiosità',
      description: 'Voglio capire di cosa parlano tutti, senza impegni',
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
  ];

  const timeOptions = [
    {
      id: '5min' as const,
      title: '5 min/giorno',
      description: 'Veloce e costante',
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: '10min' as const,
      title: '10 min/giorno',
      description: 'Ritmo equilibrato',
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: '15min' as const,
      title: '15 min/giorno',
      description: 'Approfondimento',
      icon: (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <SlideReveal>
          <h2 className="text-3xl font-bold tracking-tight">
            Personalizziamo il tuo percorso
          </h2>
        </SlideReveal>

        <FadeIn delay={200}>
          <p className="mt-4 text-lg text-muted-foreground">
            Dimmi i tuoi obiettivi e creeremo un piano su misura
          </p>
        </FadeIn>
      </div>

      <div className="space-y-8">
        {/* Goal Selection */}
        <div>
          <h3 className="mb-6 text-xl font-semibold">Qual è il tuo obiettivo principale?</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {goals.map(goal => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelections(prev => ({ ...prev, goal: goal.id }))}
                className={`group rounded-xl border p-6 text-left transition-all hover:shadow-lg ${
                  selections.goal === goal.id
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`size-12 rounded-xl p-2.5 transition-colors ${
                    selections.goal === goal.id
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  }`}
                  >
                    {goal.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Commitment */}
        <div>
          <h3 className="mb-6 text-xl font-semibold">Quanto tempo hai a disposizione?</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {timeOptions.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelections(prev => ({ ...prev, time: option.id }))}
                className={`group rounded-xl border p-6 text-center transition-all hover:shadow-lg ${
                  selections.time === option.id
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <div className={`mx-auto mb-3 size-12 rounded-xl p-2.5 transition-colors ${
                  selections.time === option.id
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }`}
                >
                  {option.icon}
                </div>
                <h4 className="mb-1 font-semibold">{option.title}</h4>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          size="lg"
          className="px-8"
        >
          {canContinue ? 'Continua' : 'Completa le selezioni'}
        </Button>
      </div>
    </div>
  );
};
/**
 * Step 4: Integrated Registration Form
 * Research: Integrated registration reduces drop-off by 60%
 */
const RegistrationStep = ({ onNext, data }: { onNext: (data: Partial<OnboardingData>) => void; data: OnboardingData }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      console.error('Le password non coincidono');
      return;
    }

    setIsLoading(true);

    try {
      // Here you would integrate with your auth system
      // For now, we'll simulate the registration
      await new Promise(resolve => setTimeout(resolve, 2000));

      onNext({
        email: formData.email,
        registrationMethod: 'email',
      });
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);

    try {
      // Here you would integrate with Google OAuth
      // For now, we'll simulate the registration
      await new Promise(resolve => setTimeout(resolve, 1500));

      onNext({
        email: 'user@gmail.com', // This would come from Google
        registrationMethod: 'google',
      });
    } catch (error) {
      console.error('Google signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <SlideReveal>
          <h2 className="text-3xl font-bold tracking-tight">
            Crea il tuo account Tradelia
          </h2>
        </SlideReveal>

        <FadeIn delay={200}>
          <p className="mt-4 text-lg text-muted-foreground">
            Il tuo percorso personalizzato ti aspetta
          </p>
        </FadeIn>
      </div>

      {/* Personalization Summary */}
      <FadeIn delay={300}>
        <Card className="border-accent/20 bg-accent/5 p-6">
          <h3 className="mb-4 font-semibold text-accent">Il tuo percorso personalizzato:</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-accent/10 p-1.5">
                <svg className="size-full text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium">Livello</div>
                <div className="text-xs text-muted-foreground">
                  {data.level === 'novice'
                    ? 'Principiante'
                    : data.level === 'intermediate' ? 'Intermedio' : 'Avanzato'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-accent/10 p-1.5">
                <svg className="size-full text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium">Obiettivo</div>
                <div className="text-xs text-muted-foreground">
                  {data.primaryGoal === 'understand'
                    ? 'Capire'
                    : data.primaryGoal === 'invest'
                      ? 'Investire'
                      : data.primaryGoal === 'career' ? 'Carriera' : 'Curiosità'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-accent/10 p-1.5">
                <svg className="size-full text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium">Tempo</div>
                <div className="text-xs text-muted-foreground">
                  {data.timeCommitment}
                  /giorno
                </div>
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={400}>
        <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Google Signup */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 w-full"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              <svg className="mr-3 size-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isLoading ? 'Creazione account...' : 'Continua con Google'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">oppure</span>
              </div>
            </div>

            {/* Email Signup Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="La tua email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="h-12"
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password (min. 8 caratteri)"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={8}
                  className="h-12"
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Conferma password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full"
                disabled={isLoading || !formData.email || !formData.password || !formData.confirmPassword}
              >
                {isLoading ? 'Creazione account...' : 'Crea account gratuito'}
              </Button>
            </form>

            {/* Trust signals */}
            <div className="space-y-2 text-center">
              <p className="text-xs text-muted-foreground">
                Creando un account accetti i nostri
                {' '}
                <a href="/terms" className="underline hover:text-primary">Termini di Servizio</a>
                {' '}
                e la
                {' '}
                <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>
              </p>

              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <svg className="size-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Dati sicuri
                </div>
                <div className="flex items-center gap-1">
                  <svg className="size-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sempre gratuito
                </div>
                <div className="flex items-center gap-1">
                  <svg className="size-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Niente spam
                </div>
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};

/**
 * Step 5: Personalized Dashboard Preview
 * Research: Showing immediate value reduces churn
 */
const PreviewStep = ({ data }: { data: OnboardingData }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <SlideReveal>
          <div className="mx-auto mb-6 size-20 rounded-full bg-gradient-to-br from-primary to-accent p-4">
            <svg className="size-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </SlideReveal>

        <SlideReveal delay={200}>
          <h2 className="text-3xl font-bold tracking-tight">
            Benvenuto in Tradelia!
          </h2>
        </SlideReveal>

        <FadeIn delay={400}>
          <p className="mt-4 text-lg text-muted-foreground">
            Il tuo percorso personalizzato è pronto. Ecco cosa ti aspetta:
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={600}>
        <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">La tua dashboard personalizzata</h3>

            {/* Mock dashboard preview */}
            <div className="space-y-4 rounded-xl border bg-background p-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Il tuo progresso</h4>
                <span className="text-sm text-muted-foreground">
                  Livello
                  {data.level === 'novice' ? 'Principiante' : data.level === 'intermediate' ? 'Intermedio' : 'Avanzato'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Modulo 1: Fondamenti Bitcoin</span>
                  <span className="text-sm text-green-600">Completato ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Modulo 2: Wallet e Sicurezza</span>
                  <span className="text-sm text-primary">In corso...</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Modulo 3: DeFi Basics</span>
                  <span className="text-sm text-muted-foreground">Bloccato</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-background p-4">
                <h5 className="mb-2 font-medium">Prossima lezione</h5>
                <p className="text-sm text-muted-foreground">Come scegliere un wallet sicuro</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {data.timeCommitment}
                  {' '}
                  • Oggi
                </p>
              </div>

              <div className="rounded-xl border bg-background p-4">
                <h5 className="mb-2 font-medium">Streak attuale</h5>
                <p className="text-2xl font-bold text-primary">1 giorno</p>
                <p className="text-xs text-muted-foreground">Continua così!</p>
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>

      <div className="text-center">
        <Button size="lg" className="px-8" onClick={() => window.location.href = '/dashboard'}>
          Vai alla dashboard
        </Button>
        <p className="mt-3 text-sm text-muted-foreground">
          Il tuo percorso di apprendimento inizia ora
        </p>
      </div>
    </div>
  );
};

/**
 * Main Onboarding Flow Component
 */
export const PremiumOnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('valueDemo');
  const [data, setData] = useState<OnboardingData>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = (stepData?: Partial<OnboardingData>) => {
    if (stepData) {
      setData(prev => ({ ...prev, ...stepData }));
    }

    const steps: OnboardingStep[] = ['valueDemo', 'skillAssessment', 'personalization', 'registration', 'preview'];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    }
  };

  const renderStep = () => {
    if (!mounted) {
      return null;
    }

    switch (currentStep) {
      case 'valueDemo':
        return <ValueDemoStep onNext={handleNext} />;
      case 'skillAssessment':
        return <SkillAssessmentStep onNext={handleNext} />;
      case 'personalization':
        return <PersonalizationStep onNext={handleNext} />;
      case 'registration':
        return <RegistrationStep onNext={handleNext} data={data} />;
      case 'preview':
        return <PreviewStep data={data} />;
      default:
        return <ValueDemoStep onNext={handleNext} />;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="flex min-h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <ProgressIndicator currentStep={currentStep} />

      <div className="px-4 pb-12 pt-24">
        <div className="mx-auto max-w-4xl">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};
