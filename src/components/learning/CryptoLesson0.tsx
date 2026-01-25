'use client';

import { BookOpen, Target, Theater, Wrench } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { lesson0CryptoBasics } from '@/data/lessons/lesson0-crypto-basics';
import type { ApproachType, UserProgress } from '@/types/learning';

// Professional icons replacing emojis
const APPROACH_ICONS = {
  analogical: Theater,
  procedural: Wrench,
  conceptual: BookOpen,
} as const;

const APPROACH_COLORS = {
  analogical: {
    primary: 'border-blue-200 bg-blue-50',
    text: 'text-blue-800',
    button: 'bg-blue-600 hover:bg-blue-700',
  },
  procedural: {
    primary: 'border-green-200 bg-green-50',
    text: 'text-green-800',
    button: 'bg-green-600 hover:bg-green-700',
  },
  conceptual: {
    primary: 'border-purple-200 bg-purple-50',
    text: 'text-purple-800',
    button: 'bg-purple-600 hover:bg-purple-700',
  },
} as const;

type CryptoLesson0Props = {
  onComplete?: (progress: UserProgress) => void;
  className?: string;
};

export const CryptoLesson0: React.FC<CryptoLesson0Props> = ({
  onComplete,
  className = '',
}) => {
  const [activeApproach, setActiveApproach] = useState<ApproachType>('analogical');
  const [exploredApproaches, setExploredApproaches] = useState<Set<ApproachType>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const lesson = lesson0CryptoBasics;
  const progress = (exploredApproaches.size / 3) * 100;
  const isFirstIntegration = exploredApproaches.size === 2;
  const isMasteryAchieved = exploredApproaches.size === 3;

  // Track approach exploration
  useEffect(() => {
    setExploredApproaches(prev => new Set([...prev, activeApproach]));
  }, [activeApproach]);

  const handleApproachChange = (approach: ApproachType) => {
    setActiveApproach(approach);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }));

    if (currentQuestionIndex < lesson.quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateQuizScore = () => {
    const correctAnswers = lesson.quiz.filter(q =>
      quizAnswers[q.id] === q.correctAnswer,
    ).length;
    return Math.round((correctAnswers / lesson.quiz.length) * 100);
  };

  const handleLessonComplete = () => {
    // const score = calculateQuizScore();
    const newProgress: UserProgress = {
      currentStreak: 1, // This would come from existing progress
      longestStreak: 1,
      totalXP: lesson.xpReward,
      level: 1,
      completedLessons: [lesson.id],
      approachesExplored: exploredApproaches,
      lastActivity: new Date(),
      badges: [],
    };

    onComplete?.(newProgress);
  };

  if (showQuiz) {
    return (
      <div className={`mx-auto max-w-4xl p-6 ${className}`}>
        {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
        <QuizView
          lesson={lesson}
          currentQuestionIndex={currentQuestionIndex}
          answers={quizAnswers}
          showResults={showResults}
          onAnswer={handleQuizAnswer}
          onComplete={handleLessonComplete}
          score={showResults ? calculateQuizScore() : 0}
        />
      </div>
    );
  }

  return (
    <div className={`mx-auto max-w-4xl space-y-6 p-6 ${className}`}>
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="text-sm">
            Lezione 0 •
            {' '}
            {lesson.estimatedTime}
            {' '}
            min •
            {' '}
            {lesson.xpReward}
            {' '}
            XP
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {lesson.title}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          {lesson.subtitle}
        </p>

        {/* Progress Bar */}
        <div className="mx-auto max-w-md space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500">
            {exploredApproaches.size}
            /3 approcci esplorati
          </p>
        </div>
      </div>

      {/* Feedback Cards */}
      {isFirstIntegration && !isMasteryAchieved && (
        <Card className="border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧠</span>
            <div>
              <h3 className="font-semibold text-blue-800">
                Ottimo! Stai sviluppando flessibilità cognitiva
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                Integrare rappresentazioni multiple costruisce comprensione robusta e trasferibile
              </p>
            </div>
          </div>
        </Card>
      )}

      {isMasteryAchieved && (
        <Card className="border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <h3 className="font-semibold text-green-800">
                Rappresentazioni Integrate!
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Hai costruito un modello mentale completo attraverso prospettive complementari
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Approach Tabs */}
      <div className="flex flex-col gap-2 rounded-lg bg-gray-100 p-1 sm:flex-row">
        {(Object.keys(lesson.approaches) as ApproachType[]).map((approach) => {
          const approachData = lesson.approaches[approach];
          const isActive = activeApproach === approach;
          const isExplored = exploredApproaches.has(approach);

          return (
            <button
              type="button"
              key={approach}
              onClick={() => handleApproachChange(approach)}
              className={`
                flex flex-1 items-center gap-3 rounded-md p-4 transition-all duration-200
                ${isActive
              ? `${APPROACH_COLORS[approach].primary} ${APPROACH_COLORS[approach].text} shadow-sm`
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }
              `}
            >
              <span className="flex items-center justify-center text-2xl">
                {React.createElement(APPROACH_ICONS[approach], { className: 'size-6' })}
              </span>
              <div className="text-left">
                <div className="flex items-center gap-2 font-medium">
                  {approachData.title}
                  {isExplored && <span className="text-green-600">✓</span>}
                </div>
                <div className="text-sm opacity-80">
                  {approachData.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <Card className="p-6">
        {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
        <ApproachContent
          approach={lesson.approaches[activeApproach]}
          colors={APPROACH_COLORS[activeApproach]}
        />
      </Card>

      {/* Action Button */}
      <div className="text-center">
        {isMasteryAchieved
          ? (
              <Button
                onClick={handleStartQuiz}
                size="lg"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Target className="size-4" />
                Inizia il Quiz Finale
              </Button>
            )
          : (
              <p className="text-gray-600">
                Esplora tutti e 3 gli approcci per sbloccare il quiz finale
              </p>
            )}
      </div>
    </div>
  );
};

// Approach Content Component
type ApproachContentProps = {
  approach: typeof lesson0CryptoBasics.approaches.analogical;
  colors: {
    readonly primary: string;
    readonly text: string;
    readonly button: string;
  };
};

const ApproachContent: React.FC<ApproachContentProps> = ({ approach, colors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {approach.title}
        </h2>
        <p className="text-gray-600">
          {approach.description}
        </p>
      </div>

      <div className="space-y-4">
        {approach.content.sections.map(section => (
          <ContentSection
            key={section.id}
            section={section}
            colors={colors}
          />
        ))}
      </div>

      {/* Key Takeaways */}
      <Card className={`${colors.primary} p-4`}>
        <h3 className={`font-semibold ${colors.text} mb-3`}>
          🎯 Punti Chiave:
        </h3>
        <ul className={`space-y-2 ${colors.text}`}>
          {approach.content.keyTakeaways.map((takeaway, index) => (
            <li key={`takeaway-${approach.id}-${index}`} className="flex items-start gap-2">
              <span className="mt-1 text-green-600">•</span>
              <span className="text-sm">{takeaway}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

// Content Section Component
type ContentSectionProps = {
  section: typeof lesson0CryptoBasics.approaches.analogical.content.sections[0];
  colors: {
    readonly primary: string;
    readonly text: string;
    readonly button: string;
  };
};

const ContentSection: React.FC<ContentSectionProps> = ({ section, colors }) => {
  const getClassName = () => {
    switch (section.type) {
      case 'highlight':
        return `${section.metadata?.bgColor || colors.primary} p-4 rounded-lg border`;
      case 'warning':
        return `${section.metadata?.bgColor || 'bg-amber-50'} p-4 rounded-lg border border-amber-200`;
      case 'example':
        return 'bg-gray-50 p-4 rounded-lg border border-gray-200';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className={getClassName()}>
      {section.metadata?.icon && (
        <span className="mr-2 text-xl">{section.metadata.icon}</span>
      )}
      <div
        className={`
          ${section.metadata?.emphasis ? 'font-semibold' : ''}
          ${section.type === 'highlight' ? colors.text : 'text-gray-700'}
        `}
        dangerouslySetInnerHTML={{
          __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>'),
        }}
      />
    </div>
  );
};

// Quiz Component
type QuizViewProps = {
  lesson: typeof lesson0CryptoBasics;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  showResults: boolean;
  onAnswer: (questionId: string, answerIndex: number) => void;
  onComplete: () => void;
  score: number;
};

const QuizView: React.FC<QuizViewProps> = ({
  lesson,
  currentQuestionIndex,
  answers,
  showResults,
  onAnswer,
  onComplete,
  score,
}) => {
  if (showResults) {
    return (
      <Card className="space-y-6 p-8 text-center">
        <div className="space-y-4">
          <div className="text-6xl">
            {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
          </div>
          <h2 className="text-3xl font-bold">
            Quiz Completato!
          </h2>
          <div className="text-xl">
            Punteggio:
            {' '}
            <span className="font-bold text-blue-600">
              {score}
              %
            </span>
          </div>
          <p className="mx-auto max-w-md text-gray-600">
            {score >= 80
              ? 'Eccellente! Hai dimostrato una comprensione solida delle criptovalute.'
              : score >= 60
                ? 'Buon lavoro! Potresti rivedere alcuni concetti per consolidare la comprensione.'
                : 'Continua a studiare! La comprensione arriva con la pratica.'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-800">🏆 Hai guadagnato:</h3>
            <div className="flex justify-center gap-4 text-sm">
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-800">
                +
                {lesson.xpReward}
                {' '}
                XP
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                Lezione 0 Completata
              </span>
            </div>
          </div>

          <Button
            onClick={onComplete}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Continua il Percorso 🚀
          </Button>
        </div>
      </Card>
    );
  }

  const currentQuestion = lesson.quiz[currentQuestionIndex];
  if (!currentQuestion) {
    return <div>Errore: Domanda non trovata</div>;
  }

  const hasAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <Card className="space-y-6 p-8">
      <div className="space-y-2 text-center">
        <Badge variant="secondary">
          Domanda
          {' '}
          {currentQuestionIndex + 1}
          {' '}
          di
          {' '}
          {lesson.quiz.length}
        </Badge>
        <Progress value={((currentQuestionIndex + (hasAnswered ? 1 : 0)) / lesson.quiz.length) * 100} />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = answers[currentQuestion.id] === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showFeedback = hasAnswered;

            return (
              <button
                type="button"
                key={`answer-${currentQuestion.id}-${index}`}
                onClick={() => !hasAnswered && onAnswer(currentQuestion.id, index)}
                disabled={hasAnswered}
                className={`
                  w-full rounded-lg border-2 p-4 text-left transition-all duration-200
                  ${!hasAnswered
                ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                : isSelected
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : isCorrect && showFeedback
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
              }
                  ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    flex size-6 items-center justify-center rounded-full border-2 text-sm font-medium
                    ${!hasAnswered
                ? 'border-gray-300'
                : isSelected
                  ? isCorrect
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-red-500 bg-red-500 text-white'
                  : isCorrect && showFeedback
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300'
              }
                  `}
                  >
                    {showFeedback && ((isSelected && isCorrect) || (!isSelected && isCorrect))
                      ? '✓'
                      : showFeedback && isSelected && !isCorrect
                        ? '✗'
                        : String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <Card className="border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Spiegazione:</strong>
              {' '}
              {currentQuestion.explanation}
            </p>
          </Card>
        )}
      </div>
    </Card>
  );
};
