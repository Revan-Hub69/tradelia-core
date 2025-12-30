// Microlearning Service
// Handles all microlearning data operations with Supabase

import { supabase } from '@/lib/supabase/client'
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
  /**
   * Get all categories with lessons and progress
   */
  async getMicrolearningData(userId?: string): Promise<MicrolearningData> {
    try {
      // Fallback data if Supabase is not available
      if (!supabase) {
        return this.getFallbackData()
      }

      const sessionId = userId ? null : await getSessionId()
      
      // Get categories - using any to bypass type checking for new tables
      const { data: categories, error: categoriesError } = await (supabase as any)
        .from('lesson_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (categoriesError) throw categoriesError

      // Get lessons with progress
      const { data: lessons, error: lessonsError } = await (supabase as any)
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
        const { data: progress, error: progressError } = await (supabase as any)
          .from('user_lesson_progress')
          .select('*')
          .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`)

        if (!progressError) {
          userProgress = progress || []
        }
      }

      // Process data
      const categoriesWithLessons: CategoryWithLessons[] = categories.map((category: any) => {
        const categoryLessons = lessons
          .filter((lesson: any) => lesson.category_id === category.id)
          .map((lesson: any) => this.processLessonWithProgress(lesson, userProgress))

        const completedCount = categoryLessons.filter((l: LessonWithProgress) => l.progress?.status === 'completed').length
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
      const completedLessons = userProgress.filter((p: UserLessonProgress) => p.status === 'completed').length

      return {
        categories: categoriesWithLessons,
        user_progress: userProgress,
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        overall_progress_percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
      }
    } catch (error) {
      console.error('Error fetching microlearning data:', error)
      return this.getFallbackData()
    }
  }

  /**
   * Get detailed lesson data with quiz
   */
  async getLessonDetail(lessonSlug: string, userId?: string): Promise<LessonDetailData> {
    try {
      if (!supabase) {
        return this.getFallbackLessonDetail(lessonSlug)
      }

      const sessionId = userId ? null : await getSessionId()

      // Get lesson with category
      const { data: lesson, error: lessonError } = await (supabase as any)
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
      const { data: quizQuestions, error: quizError } = await (supabase as any)
        .from('quiz_questions')
        .select('*')
        .eq('lesson_id', lesson.id)
        .eq('is_active', true)
        .order('sort_order')

      if (quizError) throw quizError

      // Get user progress
      let userProgress: UserLessonProgress | null = null
      if (userId || sessionId) {
        const { data: progress } = await (supabase as any)
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
        const { data: attempts } = await (supabase as any)
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
      return this.getFallbackLessonDetail(lessonSlug)
    }
  }

  /**
   * Submit quiz answers
   */
  async submitQuiz(submission: QuizSubmission, userId?: string): Promise<QuizAttempt> {
    try {
      if (!supabase) {
        throw new Error('Database not available')
      }

      const sessionId = userId ? null : await getSessionId()

      // Get quiz questions to calculate score
      const { data: questions, error: questionsError } = await (supabase as any)
        .from('quiz_questions')
        .select('*')
        .eq('lesson_id', submission.lesson_id)
        .eq('is_active', true)

      if (questionsError) throw questionsError

      // Calculate score
      let correctAnswers = 0
      const totalQuestions = questions.length

      questions.forEach((question: any) => {
        const userAnswer = submission.answers[question.id]
        if (question.options && Array.isArray(question.options)) {
          const correctOption = question.options.find((opt: any) => opt.is_correct)
          if (correctOption && userAnswer === correctOption.text) {
            correctAnswers++
          }
        }
      })

      const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
      const passed = score >= 70 // 70% passing score

      // Insert quiz attempt
      const { data: attempt, error: attemptError } = await (supabase as any)
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
      if (!supabase) {
        throw new Error('Database not available')
      }

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

      const { data: progress, error } = await (supabase as any)
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
      if (!supabase) return true

      // If no prerequisites, always accessible
      if (!lesson.prerequisite_lessons || lesson.prerequisite_lessons.length === 0) {
        return true
      }

      const sessionId = userId ? null : await getSessionId()

      // Get user progress for prerequisite lessons
      const { data: progress, error } = await (supabase as any)
        .from('user_lesson_progress')
        .select('lesson_id, status')
        .in('lesson_id', lesson.prerequisite_lessons)
        .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`)

      if (error) throw error

      // Check if all prerequisites are completed
      const completedPrerequisites = progress?.filter((p: any) => p.status === 'completed').map((p: any) => p.lesson_id) || []
      
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
      if (!supabase) {
        return {
          total_lessons: 0,
          completed_lessons: 0,
          in_progress_lessons: 0,
          total_time_spent: 0,
          average_quiz_score: 0,
          streak_days: 0
        }
      }

      const sessionId = userId ? null : await getSessionId()

      const { data: progress, error } = await (supabase as any)
        .from('user_lesson_progress')
        .select('*')
        .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`)

      if (error) throw error

      const totalLessons = progress?.length || 0
      const completedLessons = progress?.filter((p: any) => p.status === 'completed').length || 0
      const inProgressLessons = progress?.filter((p: any) => p.status === 'in_progress').length || 0
      const totalTimeSpent = progress?.reduce((sum: number, p: any) => sum + (p.time_spent_seconds || 0), 0) || 0

      // Get quiz attempts for average score
      const { data: attempts } = await (supabase as any)
        .from('quiz_attempts')
        .select('score')
        .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`)

      const averageQuizScore = attempts && attempts.length > 0 
        ? Math.round(attempts.reduce((sum: number, a: any) => sum + a.score, 0) / attempts.length)
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

  /**
   * Fallback data when Supabase is not available
   */
  private getFallbackData(): MicrolearningData {
    const fallbackCategories: CategoryWithLessons[] = [
      {
        id: '1',
        name: 'Basi',
        slug: 'basi',
        description: 'Concetti fondamentali delle criptovalute',
        icon: 'book',
        color: '#3B82F6',
        sort_order: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        lessons: [
          {
            id: '1',
            category_id: '1',
            title: 'Cos\'è una criptovaluta',
            slug: 'cose-una-criptovaluta',
            description: 'Introduzione alle criptovalute e alla blockchain',
            concept: 'Le criptovalute sono valute digitali che utilizzano la crittografia per la sicurezza e il controllo delle transazioni.',
            real_example: 'Bitcoin è la prima e più conosciuta criptovaluta, creata nel 2009 da Satoshi Nakamoto.',
            common_error: 'Molti pensano che le crypto siano solo per speculare, ma sono tecnologie con applicazioni reali.',
            safety_rule: 'Non investire mai più di quello che puoi permetterti di perdere',
            duration_minutes: 5,
            difficulty_level: 'beginner',
            is_prerequisite: true,
            prerequisite_lessons: null,
            is_published: true,
            sort_order: 1,
            meta_title: null,
            meta_description: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            progress: null,
            is_locked: false,
            can_access: true
          }
        ],
        completed_count: 0,
        total_count: 1,
        progress_percentage: 0
      }
    ]

    return {
      categories: fallbackCategories,
      user_progress: [],
      total_lessons: 1,
      completed_lessons: 0,
      overall_progress_percentage: 0
    }
  }

  /**
   * Fallback lesson detail when Supabase is not available
   */
  private getFallbackLessonDetail(lessonSlug: string): LessonDetailData {
    const fallbackLesson: LessonWithProgress = {
      id: '1',
      category_id: '1',
      title: 'Cos\'è una criptovaluta',
      slug: 'cose-una-criptovaluta',
      description: 'Introduzione alle criptovalute e alla blockchain',
      concept: 'Le criptovalute sono valute digitali che utilizzano la crittografia per la sicurezza e il controllo delle transazioni.',
      real_example: 'Bitcoin è la prima e più conosciuta criptovaluta, creata nel 2009 da Satoshi Nakamoto.',
      common_error: 'Molti pensano che le crypto siano solo per speculare, ma sono tecnologie con applicazioni reali.',
      safety_rule: 'Non investire mai più di quello che puoi permetterti di perdere',
      duration_minutes: 5,
      difficulty_level: 'beginner',
      is_prerequisite: true,
      prerequisite_lessons: null,
      is_published: true,
      sort_order: 1,
      meta_title: null,
      meta_description: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      progress: null,
      is_locked: false,
      can_access: true
    }

    const fallbackQuestions: QuizQuestion[] = [
      {
        id: '1',
        lesson_id: '1',
        question: 'Cosa significa "criptovaluta"?',
        question_type: 'multiple_choice',
        options: [
          { text: 'Una valuta segreta', is_correct: false },
          { text: 'Una valuta digitale protetta da crittografia', is_correct: true },
          { text: 'Una valuta fisica nascosta', is_correct: false }
        ],
        explanation: 'Le criptovalute sono valute digitali che utilizzano tecniche crittografiche per garantire sicurezza e controllo.',
        sort_order: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    return {
      lesson: fallbackLesson,
      quiz_questions: fallbackQuestions,
      previous_attempts: [],
      can_retake_quiz: true
    }
  }
}

export const microlearningService = new MicrolearningService()