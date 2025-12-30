// Microlearning System Types

export interface LessonCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  category_id: string
  title: string
  slug: string
  description: string | null
  
  // Tradelia methodology structure
  concept: string
  real_example: string
  common_error: string
  safety_rule: string
  
  // Metadata
  duration_minutes: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  
  // Prerequisites
  is_prerequisite: boolean
  prerequisite_lessons: string[] | null
  
  // Status
  is_published: boolean
  sort_order: number
  
  // SEO
  meta_title: string | null
  meta_description: string | null
  
  created_at: string
  updated_at: string
  
  // Relations (populated by joins)
  category?: LessonCategory
  quiz_questions?: QuizQuestion[]
  user_progress?: UserLessonProgress
}

export interface QuizQuestion {
  id: string
  lesson_id: string
  question: string
  question_type: 'multiple_choice' | 'true_false' | 'open_ended'
  options: QuizOption[] | null
  explanation: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface QuizOption {
  text: string
  is_correct: boolean
}

export interface UserLessonProgress {
  id: string
  user_id: string | null
  session_id: string | null
  lesson_id: string
  status: 'not_started' | 'in_progress' | 'completed' | 'reviewed'
  started_at: string | null
  completed_at: string | null
  last_accessed_at: string
  quiz_attempts: number
  quiz_score: number | null
  quiz_passed: boolean
  time_spent_seconds: number
  created_at: string
  updated_at: string
}

export interface QuizAttempt {
  id: string
  user_id: string | null
  session_id: string | null
  lesson_id: string
  answers: Record<string, string> // question_id -> selected_answer
  score: number
  passed: boolean
  started_at: string
  completed_at: string
  time_taken_seconds: number | null
  created_at: string
}

// UI State Types
export interface LessonWithProgress extends Lesson {
  progress: UserLessonProgress | null
  is_locked: boolean // Based on prerequisites
  can_access: boolean
}

export interface CategoryWithLessons extends LessonCategory {
  lessons: LessonWithProgress[]
  completed_count: number
  total_count: number
  progress_percentage: number
}

// Quiz State Types
export interface QuizState {
  currentQuestionIndex: number
  answers: Record<string, string>
  isSubmitted: boolean
  score: number | null
  passed: boolean | null
  timeStarted: Date | null
  timeCompleted: Date | null
}

// API Response Types
export interface MicrolearningData {
  categories: CategoryWithLessons[]
  user_progress: UserLessonProgress[]
  total_lessons: number
  completed_lessons: number
  overall_progress_percentage: number
}

export interface LessonDetailData {
  lesson: LessonWithProgress
  quiz_questions: QuizQuestion[]
  previous_attempts: QuizAttempt[]
  can_retake_quiz: boolean
}

// Form Types
export interface QuizSubmission {
  lesson_id: string
  answers: Record<string, string>
  time_taken_seconds: number
}

export interface ProgressUpdate {
  lesson_id: string
  status: UserLessonProgress['status']
  time_spent_seconds?: number
}

// Constants
export const DIFFICULTY_LEVELS = {
  beginner: {
    label: 'Principiante',
    color: 'green',
    description: 'Concetti base, nessuna esperienza richiesta'
  },
  intermediate: {
    label: 'Intermedio', 
    color: 'yellow',
    description: 'Richiede conoscenza dei concetti base'
  },
  advanced: {
    label: 'Avanzato',
    color: 'red', 
    description: 'Per chi ha già esperienza nel settore'
  }
} as const

export const LESSON_STATUS = {
  not_started: {
    label: 'Non iniziata',
    color: 'gray',
    icon: 'circle'
  },
  in_progress: {
    label: 'In corso',
    color: 'blue',
    icon: 'clock'
  },
  completed: {
    label: 'Completata',
    color: 'green', 
    icon: 'check-circle'
  },
  reviewed: {
    label: 'Rivista',
    color: 'purple',
    icon: 'refresh'
  }
} as const

export const QUIZ_PASSING_SCORE = 70 // Minimum percentage to pass
export const MAX_QUIZ_ATTEMPTS = 3 // Maximum attempts per lesson