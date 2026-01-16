import * as React from 'react';

import { cn } from '@/utils/Helpers';

export type LessonStatus = 'not_started' | 'in_progress' | 'completed' | 'locked';

export type LessonCardProps = {
  title: string;
  estimatedMinutes: number;
  xpReward: number;
  status: LessonStatus;
  minutesLabel?: string; // i18n
  onClick?: () => void;
  className?: string;
};

const StatusIcon = ({ status }: { status: LessonStatus }) => {
  switch (status) {
    case 'completed':
      return (
        <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'in_progress':
      return (
        <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    case 'locked':
      return (
        <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="10" cy="10" r="7" />
        </svg>
      );
  }
};

const statusColors: Record<LessonStatus, string> = {
  not_started: 'text-muted-foreground',
  in_progress: 'text-primary',
  completed: 'text-accent',
  locked: 'text-muted-foreground/50',
};

export function LessonCard({
  title,
  estimatedMinutes,
  xpReward,
  status,
  minutesLabel = 'min',
  onClick,
  className,
}: LessonCardProps) {
  const isClickable = status !== 'locked' && onClick;

  return (
    <button
      type="button"
      onClick={isClickable ? onClick : undefined}
      disabled={status === 'locked'}
      className={cn(
        'flex w-full items-center gap-4 rounded-lg border bg-card p-4 text-left transition-all duration-150',
        isClickable && 'cursor-pointer hover:border-primary/50 hover:shadow-sm',
        status === 'locked' && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <span className={cn('shrink-0', statusColors[status])}>
        <StatusIcon status={status} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">
          <span className="tabular-nums">{estimatedMinutes}</span>
          {' '}
          {minutesLabel}
          {' '}
          <span className="text-muted-foreground/50">•</span>
          {' +'}
          <span className="tabular-nums">{xpReward}</span>
          {' '}
          XP
        </p>
      </div>
    </button>
  );
}
