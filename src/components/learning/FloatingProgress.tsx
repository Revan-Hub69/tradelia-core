'use client';

import React, { useState } from 'react';

import { Check, Circle, Clock } from 'lucide-react';

type FloatingProgressProps = {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    id: string;
    title: string;
    duration?: string;
    completed?: boolean;
  }>;
  onStepClick?: (stepIndex: number) => void;
  estimatedTimeRemaining?: string;
  showTimeEstimate?: boolean;
};

/**
 * FloatingProgress - Desktop Sidebar Progress Indicator
 *
 * Features:
 * - Circular progress indicator
 * - Step-by-step navigation dots
 * - Time estimation
 * - Click-to-jump navigation
 * - Auto-hide on mobile
 * - Glassmorphism styling
 */
export const FloatingProgress: React.FC<FloatingProgressProps> = ({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
  estimatedTimeRemaining = '2 min',
  showTimeEstimate = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  // Calculate circumference for circular progress
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed right-6 top-1/2 z-60 hidden -translate-y-1/2 lg:block">
      <div
        className="group relative rounded-2xl border border-white/20 bg-white/90 p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:bg-white/95 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/90 dark:shadow-black/30 dark:hover:bg-slate-900/95"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Circular Progress Indicator */}
        <div className="relative flex items-center justify-center">
          <svg className="size-12 -rotate-90 transform" viewBox="0 0 50 50">
            {/* Background Circle */}
            <circle
              cx="25"
              cy="25"
              r={radius}
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-slate-200 dark:text-slate-700"
            />
            
            {/* Progress Circle */}
            <circle
              cx="25"
              cy="25"
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
            
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Progress Percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        
        {/* Expanded Content */}
        <div
          className={`mt-4 overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {/* Time Estimate */}
          {showTimeEstimate && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50/80 px-3 py-2 dark:bg-blue-900/20">
              <Clock className="size-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                {estimatedTimeRemaining} rimasti
              </span>
            </div>
          )}
          
          {/* Step Navigation */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Passi della Lezione
            </div>
            
            <div className="space-y-1">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = step.completed || index < currentStep;
                const isClickable = onStepClick && (isCompleted || isActive);
                
                return (
                  <button
                    key={step.id}
                    onClick={() => isClickable && onStepClick(index)}
                    disabled={!isClickable}
                    className={`group/step flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all duration-200 ${
                      isClickable
                        ? 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'cursor-default'
                    } ${
                      isActive
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : isCompleted
                          ? 'text-slate-600 dark:text-slate-300'
                          : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {/* Step Icon */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="flex size-5 items-center justify-center rounded-full bg-green-500 text-white">
                          <Check className="size-3" />
                        </div>
                      ) : isActive ? (
                        <div className="flex size-5 items-center justify-center rounded-full bg-primary text-white">
                          <Circle className="size-2 fill-current" />
                        </div>
                      ) : (
                        <div className="size-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                      )}
                    </div>
                    
                    {/* Step Info */}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium">
                        {step.title}
                      </div>
                      {step.duration && (
                        <div className="text-xs text-slate-400 dark:text-slate-500">
                          {step.duration}
                        </div>
                      )}
                    </div>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="size-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Progress Summary */}
          <div className="mt-4 rounded-lg bg-slate-50/80 px-3 py-2 dark:bg-slate-800/50">
            <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Progresso: {currentStep + 1} di {totalSteps}
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Hover Indicator */}
        <div className="absolute -left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-primary to-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </div>
  );
};