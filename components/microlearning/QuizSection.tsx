'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { microlearningService } from '@/lib/services/microlearning'
import { useAuth } from '@/components/providers/AppProviders'
import type { LessonWithProgress, QuizQuestion, QuizAttempt } from '@/lib/types/microlearning'

interface QuizSectionProps {
  lesson: LessonWithProgress
  questions: QuizQuestion[]
  previousAttempts: QuizAttempt[]
  canRetake: boolean
  onComplete: (passed: boolean) => void
  onBack: () => void
}

interface QuizState {
  currentQuestionIndex: number
  answers: Record<string, string>
  isSubmitted: boolean
  score: number | null
  passed: boolean | null
  timeStarted: Date
  showResults: boolean
}

export function QuizSection({ 
  lesson, 
  questions, 
  previousAttempts, 
  canRetake, 
  onComplete, 
  onBack 
}: QuizSectionProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    isSubmitted: false,
    score: null,
    passed: null,
    timeStarted: new Date(),
    showResults: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const currentQuestion = questions[quizState.currentQuestionIndex]
  const isLastQuestion = quizState.currentQuestionIndex === questions.length - 1
  const canProceed = quizState.answers[currentQuestion?.id] !== undefined

  const handleAnswerChange = (questionId: string, answer: string) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      submitQuiz()
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }))
    }
  }

  const handlePrevious = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1)
    }))
  }

  const submitQuiz = async () => {
    try {
      setIsSubmitting(true)
      
      const timeSpent = Math.floor((Date.now() - quizState.timeStarted.getTime()) / 1000)
      
      const result = await microlearningService.submitQuiz({
        lesson_id: lesson.id,
        answers: quizState.answers,
        time_taken_seconds: timeSpent
      }, user?.id)

      setQuizState(prev => ({
        ...prev,
        isSubmitted: true,
        score: result.score,
        passed: result.passed,
        showResults: true
      }))
    } catch (error) {
      console.error('Error submitting quiz:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinish = () => {
    onComplete(quizState.passed || false)
  }

  const getQuestionResult = (question: QuizQuestion) => {
    const userAnswer = quizState.answers[question.id]
    if (!userAnswer || !question.options) return null

    const correctOption = question.options.find(opt => opt.is_correct)
    const isCorrect = correctOption?.text === userAnswer

    return {
      isCorrect,
      userAnswer,
      correctAnswer: correctOption?.text,
      explanation: question.explanation
    }
  }

  const progressPercentage = ((quizState.currentQuestionIndex + 1) / questions.length) * 100

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Nessun quiz disponibile per questa lezione
        </p>
        <Button onClick={onBack} variant="outline">
          Torna alla Lezione
        </Button>
      </div>
    )
  }

  if (quizState.showResults) {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="text-center space-y-4">
          <div className={`p-4 rounded-lg ${
            quizState.passed 
              ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {quizState.passed ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <h3 className={`text-xl font-semibold ${
                quizState.passed ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
              }`}>
                {quizState.passed ? 'Quiz Superato!' : 'Quiz Non Superato'}
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className={`text-3xl font-bold ${
                quizState.passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
              }`}>
                {quizState.score}%
              </div>
              <p className={`text-sm ${
                quizState.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {quizState.passed 
                  ? 'Hai dimostrato una buona comprensione dei concetti!' 
                  : 'Rileggi la lezione e riprova. Serve almeno 70% per superare il quiz.'
                }
              </p>
            </div>
          </div>

          {/* Attempt History */}
          {previousAttempts.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Tentativo {previousAttempts.length + 1} di 3
            </div>
          )}
        </div>

        {/* Question Results */}
        <div className="space-y-4">
          <h4 className="font-semibold">Riepilogo Risposte</h4>
          {questions.map((question, index) => {
            const result = getQuestionResult(question)
            if (!result) return null

            return (
              <div key={question.id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-1 rounded-full ${
                    result.isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {result.isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium mb-2">
                      {index + 1}. {question.question}
                    </h5>
                    
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-muted-foreground">La tua risposta: </span>
                        <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {result.userAnswer}
                        </span>
                      </div>
                      
                      {!result.isCorrect && (
                        <div>
                          <span className="text-muted-foreground">Risposta corretta: </span>
                          <span className="text-green-600">{result.correctAnswer}</span>
                        </div>
                      )}
                      
                      {result.explanation && (
                        <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                          <strong>Spiegazione:</strong> {result.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <Button onClick={onBack} variant="outline">
            Torna alla Lezione
          </Button>
          <Button onClick={handleFinish}>
            Continua
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Torna alla Lezione
          </Button>
          <Badge variant="outline">
            Domanda {quizState.currentQuestionIndex + 1} di {questions.length}
          </Badge>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {currentQuestion.question}
            </h3>

            {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
              <RadioGroup
                value={quizState.answers[currentQuestion.id] || ''}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.text} 
                        id={`option-${index}`}
                      />
                      <Label 
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer p-3 rounded border hover:bg-muted/30 transition-colors"
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {currentQuestion.question_type === 'true_false' && currentQuestion.options && (
              <RadioGroup
                value={quizState.answers[currentQuestion.id] || ''}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.text} 
                        id={`tf-option-${index}`}
                      />
                      <Label 
                        htmlFor={`tf-option-${index}`}
                        className="flex-1 cursor-pointer p-3 rounded border hover:bg-muted/30 transition-colors"
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              onClick={handlePrevious}
              variant="outline"
              disabled={quizState.currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Precedente
            </Button>

            <Button 
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
            >
              {isSubmitting ? (
                'Invio...'
              ) : isLastQuestion ? (
                'Completa Quiz'
              ) : (
                <>
                  Successiva
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}