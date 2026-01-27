'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type PasswordStrengthProps = {
  password: string;
  className?: string;
};

type PasswordStrengthResult = {
  score: number; // 0-4
  label: string;
  color: string;
  bgColor: string;
  suggestions: string[];
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
};

const RequirementItem = ({ met, text }: { met: boolean; text: string }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex size-3 items-center justify-center rounded-full ${
        met
          ? 'bg-emerald-500 text-white'
          : 'bg-slate-200 dark:bg-slate-700'
      }`}
      >
        {met && (
          <svg className="size-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-xs ${
        met
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-slate-500 dark:text-slate-400'
      }`}
      >
        {text}
      </span>
    </div>
  );
};

export const PasswordStrength = ({ password, className = '' }: PasswordStrengthProps) => {
  const t = useTranslations('Auth') as any;

  const analysis = useMemo((): PasswordStrengthResult => {
    if (!password) {
      return {
        score: 0,
        label: '',
        color: 'text-slate-400',
        bgColor: 'bg-slate-200',
        suggestions: [],
        checks: {
          length: false,
          lowercase: false,
          uppercase: false,
          number: false,
          special: false,
        },
      };
    }

    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const suggestions: string[] = [];

    // Generate suggestions based on missing requirements
    if (!checks.length) {
      suggestions.push(t('password_suggestion_length'));
    }
    if (!checks.lowercase) {
      suggestions.push(t('password_suggestion_lowercase'));
    }
    if (!checks.uppercase) {
      suggestions.push(t('password_suggestion_uppercase'));
    }
    if (!checks.number) {
      suggestions.push(t('password_suggestion_number'));
    }
    if (!checks.special) {
      suggestions.push(t('password_suggestion_special'));
    }

    // Determine strength score and styling
    let score = 0;
    let label = '';
    let color = '';
    let bgColor = '';

    if (passedChecks <= 1) {
      score = 1;
      label = t('password_strength_very_weak');
      color = 'text-red-600 dark:text-red-400';
      bgColor = 'bg-red-500';
    } else if (passedChecks === 2) {
      score = 2;
      label = t('password_strength_weak');
      color = 'text-orange-600 dark:text-orange-400';
      bgColor = 'bg-orange-500';
    } else if (passedChecks === 3) {
      score = 3;
      label = t('password_strength_medium');
      color = 'text-yellow-600 dark:text-yellow-400';
      bgColor = 'bg-yellow-500';
    } else if (passedChecks === 4) {
      score = 4;
      label = t('password_strength_good');
      color = 'text-blue-600 dark:text-blue-400';
      bgColor = 'bg-blue-500';
    } else if (passedChecks === 5) {
      score = 5;
      label = t('password_strength_strong');
      color = 'text-emerald-600 dark:text-emerald-400';
      bgColor = 'bg-emerald-500';
    }

    return {
      score,
      label,
      color,
      bgColor,
      suggestions: suggestions.slice(0, 2), // Show max 2 suggestions
      checks,
    };
  }, [password, t]);

  if (!password) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {t('password_strength_label')}
          </span>
          <span className={`text-xs font-medium ${analysis.color}`}>
            {analysis.label}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-300 ${analysis.bgColor}`}
            style={{ width: `${(analysis.score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {t('password_requirements')}
        </div>
        <div className="grid grid-cols-1 gap-1 text-xs">
          <RequirementItem
            met={analysis.checks.length}
            text={t('password_req_length')}
          />
          <RequirementItem
            met={analysis.checks.lowercase}
            text={t('password_req_lowercase')}
          />
          <RequirementItem
            met={analysis.checks.uppercase}
            text={t('password_req_uppercase')}
          />
          <RequirementItem
            met={analysis.checks.number}
            text={t('password_req_number')}
          />
          <RequirementItem
            met={analysis.checks.special}
            text={t('password_req_special')}
          />
        </div>
      </div>

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {t('password_suggestions')}
          </div>
          <div className="space-y-1">
            {analysis.suggestions.map((suggestion, index) => (
              <div key={`suggestion-${index}`} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <svg className="size-3 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
