// Microlearning Service
// Handles all microlearning data operations with Supabase

import { createClient } from '@/lib/supabase/client'
import { getSessionId } from '@/lib/utils/session'
import type { 
  MicrolearningData, 
  LessonDetailData, 
  CategoryWithLessons,
  LessonWithProgress,
  UserLessonProgress,
  QuizSubmission,
  ProgressUpdate,
  QuizAttempt,
  Lesson,
  LessonCategory,
  QuizQuestion
} from '@/lib/types/microlearning'

class MicrolearningService {
  private supabase = createClient()

  /**
   * Get all categories with lessons and progress
   */
  async getMicrolearningData(userId?: string): Promise<MicrolearningData> {
    try {
      const sessionId = userId ? null : await getSessionId()
      
      // Get categories
      const { data: categories, error: categoriesError } = await this.supabase
        .from('lesson_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (categoriesError) throw categoriesError

      // Get lessons with progress
      const { data: lessons, error: lessonsError } = await this.supabase
        .from('lessons')
        .select(`
          *,
          category:lesson_categories(*),
          user_progress:user_lesson_progress(*)
        `)
        .eq('is_published', true)
        .order('sort_order')

      if (lessonsError) throw lessonsError

      // Get user progress
      let userProgress: UserLessonProgress[] = []
      if (userId || sessionId) {
        const { data: progress, error: progressError } = await this.supabase
          .from('user_lesson_progress')
          .select('*')
          .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`)

        if (!progressError) {
          userProgress = progress || []
        }
      }

      // Process data
      const categoriesWithLessons: CategoryWithLessons[] = categories.map(category => {
        const categoryLessons = lessons
          .filter(lesson => lesson.category_id === category.id)
          .map(lesson => this.processLessonWithProgress(lesson, userProgress))

        const completedCount = categoryLessons.filter(l => l.progress?.status === 'completed').length
        const totalCount = categoryLessons.length

        return {
          ...category,
          lessons: categoryLessons,
          completed_count: completedCount,
          total_count: totalCount,
          progress_percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
        }
      })

      const totalLessons = lessons.length
      const completedLessons = userProgress.filter(p => p.status === 'completed').length

      return {
        categories: categoriesWithLessons,
        user_progress: userProgress,
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        overall_progress_percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
      }
    } catch (error) {
      console.error('Error fetching microlearning data:', error)
      throw error
    }
  }

  /**
   * Get detailed lesson data with quiz
   */
  async getLessonDetail(lessonSlug: string, userId?: string): Promise<LessonDetailData> {
    try {
      const sessionId = userId ? null : await getSessionId()

      // Get lesson with category
      const { data: lesson, error: lessonError } = await this.supabase
        .from('lessons')
        .select(`
          *,
          category:lesson_categories(*)
        `)
        .eq('slug', lessonSlug)
        .eq('is_published', true)
        .single()

      if (lessonError) throw lessonError

      // Get quiz questions
      const { data: quizQuestions, error: quizError } = await this.supabase
        .from('quiz_questions')
        .select('*')
        .eq('lesson_id', lesson.id)
        .eq('is_active', true)
        .order('sort_order')

      if (quizError) throw quizError

      // Get user progress
      let userProgress: UserLessonProgress | null = null
      if (userId || sessionId) {
        const { data: progress } = await this.supabase
          .from('user_lesson_progress')
          .select('*')
          .eq('lesson_id', lesson.id)
          .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`)
          .single()

        userProgress = progress
      }

      // Get previous quiz attempts
      let previousAttempts: QuizAttempt[] = []
      if (userId || sessionId) {
        const { data: attempts } = await this.supabase
          .from('quiz_attempts')
          .select('*')
          .eq('lesson_id', lesson.id)
          .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`)
          .order('created_at', { ascending: false })

        previousAttempts = attempts || []
      }

      // Check if lesson is accessible (prerequisites)
      const canAccess = await this.checkLessonAccess(lesson, userId)

      const lessonWithProgress: LessonWithProgress = {
        ...lesson,
        progress: userProgress,
        is_locked: !canAccess,
        can_access: canAccess
      }

      return {
        lesson: lessonWithProgress,
        quiz_questions: quizQuestions || [],
        previous_attempts: previousAttempts,
        can_retake_quiz: previousAttempts.length < 3 // Max 3 attempts
      }
    } catch (error) {
      console.error('Error fetching lesson detail:', error)
      throw error
    }
  }

  /**
   * Submit quiz answers
   */
  async submitQuiz(submission: QuizSubmission, userId?: string): Promise<QuizAttempt> {
    try {
      const sessionId = userId ? null : await getSessionId()

      // Get quiz questions to calculate score
      const { data: questions, error: questionsError } = await this.supabase
        .from('quiz_questions')
        .select('*')
        .eq('lesson_id', submission.lesson_id)
        .eq('is_active', true)

      if (questionsError) throw questionsError

      // Calculate score
      let correctAnswers = 0
      const totalQuestions = questions.length

      questions.forEach(question => {
        const userAnswer = submission.answers[question.id]
        if (question.options && Array.isArray(question.options)) {
          const correctOption = question.options.find(opt => opt.is_correct)
          if (correctOption && userAnswer === correctOption.text) {
            correctAnswers++
          }
        }
      })

      const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
      const passed = score >= 70 // 70% passing score

      // Insert quiz attempt
      const { data: attempt, error: attemptError } = await this.supabase
        .from('quiz_attempts')
        .insert({
          user_id: userId || null,
          session_id: sessionId,
          lesson_id: submission.lesson_id,
          answers: submission.answers,
          score,
          passed,
          completed_at: new Date().toISOString(),
          time_taken_seconds: submission.time_taken_seconds
        })
        .select()
        .single()

      if (attemptError) throw attemptError

      // Update user progress
      await this.updateProgress({
        lesson_id: submission.lesson_id,
        status: passed ? 'completed' : 'in_progress'
      }, userId)

      return attempt
    } catch (error) {
      console.error('Error submitting quiz:', error)
      throw error
    }
  }

  /**
   * Update lesson progress
   */
  async updateProgress(update: ProgressUpdate, userId?: string): Promise<UserLessonProgress> {
    try {
      const sessionId = userId ? null : await getSessionId()

      const progressData = {
        user_id: userId || null,
        session_id: sessionId,
        lesson_id: update.lesson_id,
        status: update.status,
        last_accessed_at: new Date().toISOString(),
        ...(update.status === 'in_progress' && !userId && { started_at: new Date().toISOString() }),
        ...(update.status === 'completed' && { completed_at: new Date().toISOString() }),
        ...(update.time_spent_seconds && { time_spent_seconds: update.time_spent_seconds })
      }

      const { data: progress, error } = await this.supabase
        .from('user_lesson_progress')
        .upsert(progressData, {
          onConflict: userId ? 'user_id,lesson_id' : 'session_id,lesson_id'
        })
        .select()
        .single()

      if (error) throw error

      return progress
    } catch (error) {
      console.error('Error updating progress:', error)
      throw error
    }
  }

  /**
   * Check if user can access a lesson (prerequisites)
   */
  private async checkLessonAccess(lesson: Lesson, userId?: string): Promise<boolean> {
    try {
      // If no prerequisites, always accessible
      if (!lesson.prerequisite_lessons || lesson.prerequisite_lessons.length === 0) {
        return true
      }

      const sessionId = userId ? null : await getSessionId()

      // Get user progress for prerequisite lessons
      const { data: progress, error } = await this.supabase
        .from('user_lesson_progress')
        .select('lesson_id, status')
        .in('lesson_id', lesson.prerequisite_lessons)
        .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`)

      if (error) throw error

      // Check if all prerequisites are completed
      const completedPrerequisites = progress?.filter(p => p.status === 'completed').map(p => p.lesson_id) || []
      
      return lesson.prerequisite_lessons.every(prereqId => 
        completedPrerequisites.includes(prereqId)
      )
    } catch (error) {
      console.error('Error checking lesson access:', error)
      return false
    }
  }

  /**
   * Process lesson with progress data
   */
  private processLessonWithProgress(lesson: any, userProgress: UserLessonProgress[]): LessonWithProgress {
    const progress = userProgress.find(p => p.lesson_id === lesson.id) || null
    
    return {
      ...lesson,
      progress,
      is_locked: false, // Will be calculated when needed
      can_access: true  // Will be calculated when needed
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId?: string): Promise<{
    total_lessons: number
    completed_lessons: number
    in_progress_lessons: number
    total_time_spent: number
    average_quiz_score: number
    streak_days: number
  }> {
    try {
      const sessionId = userId ? null : await getSessionId()

      const { data: progress, error } = await this.supabase
        .from('user_lesson_progress')
        .select('*')
        .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`)

      if (error) throw error

      const totalLessons = progress?.length || 0
      const completedLessons = progress?.filter(p => p.status === 'completed').length || 0
      const inProgressLessons = progress?.filter(p => p.status === 'in_progress').length || 0
      const totalTimeSpent = progress?.reduce((sum, p) => sum + (p.time_spent_seconds || 0), 0) || 0

      // Get quiz attempts for average score
      const { data: attempts } = await this.supabase
        .from('quiz_attempts')
        .select('score')
        .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`)

      const averageQuizScore = attempts && attempts.length > 0 
        ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
        : 0

      return {
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        in_progress_lessons: inProgressLessons,
        total_time_spent: totalTimeSpent,
        average_quiz_score: averageQuizScore,
        streak_days: 0 // TODO: Calculate streak based on completion dates
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return {
        total_lessons: 0,
        completed_lessons: 0,
        in_progress_lessons: 0,
        total_time_spent: 0,
        average_quiz_score: 0,
        streak_days: 0
      }
    }
  }
}

export const microlearningService = new MicrolearningService()