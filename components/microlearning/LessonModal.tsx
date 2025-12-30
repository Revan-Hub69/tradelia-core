'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { Clock, CheckCircle, X } from "lucide-react"
import { BrainIcon } from "@/components/icons/brain-icon"
import { QuizSection } from './QuizSection'
import { microlearningService } from '@/lib/services/microlearning'
import { useAuth } from '@/components/providers/AppProviders'
import { DIFFICULTY_LEVELS } from '@/lib/types/microlearning'
import type { LessonDetailData } from '@/lib/types/microlearning'

interface LessonModalProps {
  isOpen: boolean
  onClose: () => void
  lessonSlug: string
  onUpdate: () => void
}

export function LessonModal({ isOpen, onClose, lessonSlug, onUpdate }: LessonModalProps) {
  const [data, setData] = useState<LessonDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && lessonSlug) {
      loadLessonData()
    }
  }, [isOpen, lessonSlug])

  useEffect(() => {
    if (isOpen && !startTime) {
      setStartTime(new Date())
      // Mark lesson as in progress
      if (data?.lesson && data.lesson.progress?.status === 'not_started') {
        updateProgress('in_progress')
      }
    }
  }, [isOpen, data])

  const loadLessonData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const lessonData = await microlearningService.getLessonDetail(lessonSlug, user?.id)
      setData(lessonData)
    } catch (err) {
      console.error('Error loading lesson:', err)
      setError('Errore nel caricamento della lezione')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProgress = async (status: 'in_progress' | 'completed') => {
    if (!data?.lesson) return

    try {
      const timeSpent = startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0
      
      await microlearningService.updateProgress({
        lesson_id: data.lesson.id,
        status,
        time_spent_seconds: timeSpent
      }, user?.id)
      
      onUpdate()
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleClose = () => {
    if (data?.lesson && startTime) {
      // Update time spent when closing
      const timeSpent = Math.floor((Date.now() - startTime.getTime()) / 1000)
      if (timeSpent > 30) { // Only update if spent more than 30 seconds
        updateProgress(data.lesson.progress?.status === 'completed' ? 'completed' : 'in_progress')
      }
    }
    
    setStartTime(null)
    setShowQuiz(false)
    onClose()
  }

  const handleStartQuiz = () => {
    setShowQuiz(true)
  }

  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      updateProgress('completed')
    }
    setShowQuiz(false)
    onUpdate()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadLessonData} variant="outline">
              Riprova
            </Button>
          </div>
        ) : data ? (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <BrainIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-xl mb-2">
                      {data.lesson.title}
                    </DialogTitle>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {data.lesson.duration_minutes} minuti
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {DIFFICULTY_LEVELS[data.lesson.difficulty_level].label}
                      </Badge>
                      
                      {data.lesson.progress?.status === 'completed' && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completata
                        </Badge>
                      )}
                    </div>

                    {data.lesson.description && (
                      <p className="text-muted-foreground">
                        {data.lesson.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>

            {showQuiz ? (
              <QuizSection
                lesson={data.lesson}
                questions={data.quiz_questions}
                previousAttempts={data.previous_attempts}
                canRetake={data.can_retake_quiz}
                onComplete={handleQuizComplete}
                onBack={() => setShowQuiz(false)}
              />
            ) : (
              <div className="space-y-6">
                {/* Lesson Content */}
                <div className="space-y-6">
                  {/* Concept */}
                  <div className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">💡</span>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        Il Concetto
                      </h3>
                    </div>
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                      {data.lesson.concept}
                    </p>
                  </div>

                  {/* Real Example */}
                  <div className="p-6 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📊</span>
                      <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                        Esempio Reale
                      </h3>
                    </div>
                    <p className="text-green-800 dark:text-green-200 leading-relaxed">
                      {data.lesson.real_example}
                    </p>
                  </div>

                  {/* Common Error */}
                  <div className="p-6 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">❌</span>
                      <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                        Errore Comune
                      </h3>
                    </div>
                    <p className="text-orange-800 dark:text-orange-200 leading-relaxed">
                      {data.lesson.common_error}
                    </p>
                  </div>

                  {/* Safety Rule */}
                  <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🛡️</span>
                      <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                        Regola di Sicurezza
                      </h3>
                    </div>
                    <p className="text-red-800 dark:text-red-200 leading-relaxed">
                      {data.lesson.safety_rule}
                    </p>
                  </div>
                </div>

                {/* Quiz Section */}
                {data.quiz_questions.length > 0 && (
                  <div className="border-t pt-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-lg font-semibold">Verifica la Comprensione</h3>
                      <p className="text-muted-foreground">
                        Completa il quiz per verificare di aver capito i concetti chiave
                      </p>
                      
                      {data.previous_attempts.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Tentativi precedenti: {data.previous_attempts.length}/3
                          {data.previous_attempts[0] && (
                            <span className="ml-2">
                              (Ultimo punteggio: {data.previous_attempts[0].score}%)
                            </span>
                          )}
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleStartQuiz}
                        disabled={!data.can_retake_quiz}
                        className="px-8"
                      >
                        {data.previous_attempts.length > 0 ? 'Riprova Quiz' : 'Inizia Quiz'}
                      </Button>
                      
                      {!data.can_retake_quiz && (
                        <p className="text-xs text-muted-foreground">
                          Hai raggiunto il limite massimo di tentativi (3)
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}