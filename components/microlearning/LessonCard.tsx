'use client'

import { useState } from 'react'
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  CheckCircle, 
  Circle, 
  Lock, 
  Play, 
  RotateCcw,
  ArrowRight 
} from "lucide-react"
import { BrainIcon } from "@/components/icons/brain-icon"
import { LessonModal } from './LessonModal'
import { DIFFICULTY_LEVELS, LESSON_STATUS } from '@/lib/types/microlearning'
import type { LessonWithProgress } from '@/lib/types/microlearning'

interface LessonCardProps {
  lesson: LessonWithProgress
  onUpdate: () => void
}

export function LessonCard({ lesson, onUpdate }: LessonCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const status = lesson.progress?.status || 'not_started'
  const statusConfig = LESSON_STATUS[status]
  const difficultyConfig = DIFFICULTY_LEVELS[lesson.difficulty_level]
  
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getActionButton = () => {
    if (lesson.is_locked) {
      return (
        <Button variant="ghost" size="sm" disabled className="text-xs">
          <Lock className="w-3 h-3 mr-1" />
          Bloccata
        </Button>
      )
    }

    switch (status) {
      case 'completed':
        return (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => setIsModalOpen(true)}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Rivedi
          </Button>
        )
      case 'in_progress':
        return (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => setIsModalOpen(true)}
          >
            <ArrowRight className="w-3 h-3 mr-1" />
            Continua
          </Button>
        )
      default:
        return (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => setIsModalOpen(true)}
          >
            <Play className="w-3 h-3 mr-1" />
            Inizia
          </Button>
        )
    }
  }

  const getProgressBar = () => {
    if (status === 'completed') {
      return <Progress value={100} className="h-1" />
    }
    if (status === 'in_progress') {
      return <Progress value={50} className="h-1" />
    }
    return <Progress value={0} className="h-1" />
  }

  return (
    <>
      <UnifiedCard 
        className={`hover:border-primary/30 transition-all duration-200 hover:shadow-lg ${
          lesson.is_locked ? 'opacity-60' : ''
        }`}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <BrainIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold truncate">{lesson.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {lesson.duration_minutes} min
                  </div>
                </div>
                
                {lesson.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {lesson.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs bg-${difficultyConfig.color}-50 text-${difficultyConfig.color}-700 border-${difficultyConfig.color}-200`}
                  >
                    {difficultyConfig.label}
                  </Badge>
                  
                  {lesson.is_prerequisite && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      Prerequisito
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              {getStatusIcon()}
            </div>
          </div>

          {/* Content Preview */}
          <div className="space-y-3 text-sm mb-4">
            <div>
              <div className="font-medium text-primary mb-1">💡 Il Concetto</div>
              <p className="text-muted-foreground line-clamp-2">{lesson.concept}</p>
            </div>

            <div>
              <div className="font-medium text-green-700 dark:text-green-400 mb-1">📊 Esempio Reale</div>
              <p className="text-muted-foreground line-clamp-2">{lesson.real_example}</p>
            </div>
          </div>

          {/* Progress and Action */}
          <div className="space-y-3">
            {getProgressBar()}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs bg-${statusConfig.color}-50 text-${statusConfig.color}-700 border-${statusConfig.color}-200`}
                >
                  {statusConfig.label}
                </Badge>
                
                {lesson.progress?.quiz_score && (
                  <Badge variant="outline" className="text-xs">
                    Quiz: {lesson.progress.quiz_score}%
                  </Badge>
                )}
              </div>
              
              {getActionButton()}
            </div>
          </div>
        </CardContent>
      </UnifiedCard>

      {/* Lesson Modal */}
      <LessonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lessonSlug={lesson.slug}
        onUpdate={onUpdate}
      />
    </>
  )
}