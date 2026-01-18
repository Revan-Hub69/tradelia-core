'use client';

import React from 'react';
import { Play, Clock, CheckCircle, Lock, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Lesson } from './types';

type LessonNavigationCardProps = {
  lesson: Lesson;
  isLocked?: boolean;
  isCompleted?: boolean;
  estimatedTime?: number;
  onStartLesson: (lessonId: string) => void;
  onContinueLesson?: (lessonId: string) => void;
  className?: string;
};

/**
 * LessonNavigationCard - Card for navigating to lessons from dashboard
 * 
 * Features:
 * - Consistent with LessonHeader styling
 * - Smooth transitions to lesson view
 * - Progress indicators
 * - Lock states for premium content
 * - Glassmorphism design
 */
export const LessonNavigationCard: React.FC<LessonNavigationCardProps> = ({
  lesson,
  isLocked = false,
  isCompleted = false,
  estimatedTime,
  onStartLesson,
  onContinueLesson,
  className = '',
}) => {
  const handleLessonAction = () => {
    if (isLocked) return;
    
    if (isCompleted && onContinueLesson) {
      onContinueLesson(lesson.id);
    } else {
      onStartLesson(lesson.id);
    }
  };

  const getActionText = () => {
    if (isLocked) return 'Bloccato';
    if (isCompleted) return 'Rivedi';
    if (lesson.progress && lesson.progress > 0) return 'Continua';
    return 'Inizia';
  };

  const getActionIcon = () => {
    if (isLocked) return Lock;
    if (isCompleted) return CheckCircle;
    return Play;
  };

  const ActionIcon = getActionIcon();

  return (
    <div className={`
      group relative overflow-hidden rounded-lg border border-white/20 bg-white/40 backdrop-blur-sm 
      transition-all duration-300 hover:border-white/30 hover:bg-white/50 hover:shadow-lg hover:shadow-black/5
      dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:shadow-black/20
      ${isLocked ? 'opacity-60' : ''}
      ${className}
    `}>
      {/* Progress Bar */}
      {lesson.progress && lesson.progress > 0 && (
        <div className="absolute top-0 left-0 h-1 bg-primary/20">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${lesson.progress}%` }}
          />
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {lesson.title}
            </h3>
            {lesson.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {lesson.description}
              </p>
            )}
          </div>
          
          {/* Status Icon */}
          <div className={`
            ml-3 rounded-full p-2 transition-colors
            ${isCompleted 
              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
              : isLocked
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                : 'bg-primary/10 text-primary'
            }
          `}>
            <ActionIcon className="size-4" />
          </div>
        </div>

        {/* Metadata */}
        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
          {estimatedTime && (
            <div className="flex items-center gap-1">
              <Clock className="size-3" />
              <span>{estimatedTime} min</span>
            </div>
          )}
          
          {lesson.difficulty && (
            <div className="flex items-center gap-1">
              <div className={`
                size-2 rounded-full
                ${lesson.difficulty === 'beginner' ? 'bg-green-500' : ''}
                ${lesson.difficulty === 'intermediate' ? 'bg-yellow-500' : ''}
                ${lesson.difficulty === 'advanced' ? 'bg-red-500' : ''}
              `} />
              <span className="capitalize">{lesson.difficulty}</span>
            </div>
          )}

          {lesson.type && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {lesson.type}
            </span>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={handleLessonAction}
          disabled={isLocked}
          variant={isCompleted ? "outline" : "default"}
          className="w-full group-hover:shadow-md transition-shadow"
        >
          <ActionIcon className="mr-2 size-4" />
          {getActionText()}
          {!isLocked && <ArrowRight className="ml-2 size-4" />}
        </Button>

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <div className="rounded-lg bg-white/90 p-3 text-center dark:bg-slate-900/90">
              <Lock className="mx-auto mb-2 size-6 text-muted-foreground" />
              <p className="text-sm font-medium">Premium Required</p>
              <p className="text-xs text-muted-foreground">
                Upgrade to access this lesson
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};