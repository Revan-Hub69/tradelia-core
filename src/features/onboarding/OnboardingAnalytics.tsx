'use client';

import { useEffect } from 'react';

/**
 * Onboarding Analytics System
 *
 * Tracks key metrics for optimization:
 * - Step completion rates
 * - Time spent per step
 * - Drop-off points
 * - User behavior patterns
 * - A/B testing data
 */

type OnboardingEvent =
  | 'step_started'
  | 'step_completed'
  | 'step_abandoned'
  | 'answer_selected'
  | 'goal_selected'
  | 'registration_started'
  | 'registration_completed'
  | 'onboarding_completed';

type OnboardingStep = 'trust' | 'assessment' | 'personalization' | 'registration';

type AnalyticsData = {
  event: OnboardingEvent;
  step?: OnboardingStep;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
};

class OnboardingAnalytics {
  private sessionId: string;
  private startTime: number;
  private stepStartTimes: Map<OnboardingStep, number> = new Map();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }

  private generateSessionId(): string {
    return `onb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public track(data: Omit<AnalyticsData, 'timestamp' | 'sessionId'>) {
    const analyticsData: AnalyticsData = {
      ...data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    // In production, send to analytics service
    if (typeof window !== 'undefined') {
      // Store locally for now
      const events = JSON.parse(localStorage.getItem('onboarding_analytics') || '[]');
      events.push(analyticsData);
      localStorage.setItem('onboarding_analytics', JSON.stringify(events));

      // Development logging disabled for commit
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('📊 Onboarding Analytics:', analyticsData);
      // }
    }
  }

  stepStarted(step: OnboardingStep, metadata?: Record<string, any>) {
    this.stepStartTimes.set(step, Date.now());
    this.track({
      event: 'step_started',
      step,
      metadata: {
        ...metadata,
        totalTimeElapsed: Date.now() - this.startTime,
      },
    });
  }

  stepCompleted(step: OnboardingStep, metadata?: Record<string, any>) {
    const startTime = this.stepStartTimes.get(step);
    const timeSpent = startTime ? Date.now() - startTime : 0;

    this.track({
      event: 'step_completed',
      step,
      metadata: {
        ...metadata,
        timeSpent,
        totalTimeElapsed: Date.now() - this.startTime,
      },
    });
  }

  stepAbandoned(step: OnboardingStep, metadata?: Record<string, any>) {
    const startTime = this.stepStartTimes.get(step);
    const timeSpent = startTime ? Date.now() - startTime : 0;

    this.track({
      event: 'step_abandoned',
      step,
      metadata: {
        ...metadata,
        timeSpent,
        totalTimeElapsed: Date.now() - this.startTime,
      },
    });
  }

  answerSelected(step: OnboardingStep, questionIndex: number, answerIndex: number, isCorrect: boolean) {
    this.track({
      event: 'answer_selected',
      step,
      metadata: {
        questionIndex,
        answerIndex,
        isCorrect,
        totalTimeElapsed: Date.now() - this.startTime,
      },
    });
  }

  goalSelected(goal: string, timeCommitment: string) {
    this.track({
      event: 'goal_selected',
      step: 'personalization',
      metadata: {
        goal,
        timeCommitment,
        totalTimeElapsed: Date.now() - this.startTime,
      },
    });
  }

  registrationStarted(method: 'email' | 'google') {
    this.track({
      event: 'registration_started',
      step: 'registration',
      metadata: {
        method,
        totalTimeElapsed: Date.now() - this.startTime,
      },
    });
  }

  registrationCompleted(method: 'email' | 'google', userId?: string) {
    this.track({
      event: 'registration_completed',
      step: 'registration',
      userId,
      metadata: {
        method,
        totalTimeElapsed: Date.now() - this.startTime,
      },
    });
  }

  onboardingCompleted(userData: Record<string, any>) {
    this.track({
      event: 'onboarding_completed',
      metadata: {
        ...userData,
        totalTimeElapsed: Date.now() - this.startTime,
        completionRate: 100,
      },
    });
  }

  // Get analytics summary for debugging
  getAnalyticsSummary() {
    if (typeof window === 'undefined') {
      return null;
    }

    const events = JSON.parse(localStorage.getItem('onboarding_analytics') || '[]');
    const sessionEvents = events.filter((e: AnalyticsData) => e.sessionId === this.sessionId);

    return {
      sessionId: this.sessionId,
      totalEvents: sessionEvents.length,
      events: sessionEvents,
      startTime: this.startTime,
      currentTime: Date.now(),
      totalDuration: Date.now() - this.startTime,
    };
  }
}

// Global analytics instance
let analyticsInstance: OnboardingAnalytics | null = null;

export const useOnboardingAnalytics = (): OnboardingAnalytics | null => {
  useEffect(() => {
    if (!analyticsInstance) {
      analyticsInstance = new OnboardingAnalytics();
    }
  }, []);

  return analyticsInstance || null;
};

// Hook for step tracking
export const useStepTracking = (step: OnboardingStep) => {
  const analytics = useOnboardingAnalytics();

  useEffect(() => {
    if (analytics) {
      analytics.stepStarted(step);

      // Track abandonment on unmount (unless completed)
      return () => {
        // Only track abandonment if the component unmounts without completion
        // This is a simplified approach - in production, you'd want more sophisticated logic
      };
    }
    return undefined;
  }, [analytics, step]);

  const completeStep = (metadata?: Record<string, any>) => {
    if (analytics) {
      analytics.stepCompleted(step, metadata);
    }
  };

  const abandonStep = (metadata?: Record<string, any>) => {
    if (analytics) {
      analytics.stepAbandoned(step, metadata);
    }
  };

  return { completeStep, abandonStep, analytics };
};

// Analytics Dashboard Component (for development/admin)
export const OnboardingAnalyticsDashboard = () => {
  const analytics = useOnboardingAnalytics();

  if (!analytics || typeof window === 'undefined') {
    return null;
  }

  const summary = analytics.getAnalyticsSummary();
  if (!summary) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border bg-background p-4 shadow-lg">
      <h3 className="mb-2 font-semibold">Analytics Dashboard</h3>
      <div className="space-y-1 text-sm">
        <p>
          Session:
          {summary.sessionId.slice(-8)}
        </p>
        <p>
          Events:
          {summary.totalEvents}
        </p>
        <p>
          Duration:
          {Math.round(summary.totalDuration / 1000)}
          s
        </p>
      </div>

      <details className="mt-2">
        <summary className="cursor-pointer text-xs text-muted-foreground">
          View Events
        </summary>
        <div className="mt-2 max-h-40 overflow-y-auto text-xs">
          {summary.events.map((event: AnalyticsData, eventIndex: number) => (
            <div key={`event-${eventIndex}`} className="border-b py-1">
              <div className="font-medium">{event.event}</div>
              {event.step && (
                <div>
                  Step:
                  {event.step}
                </div>
              )}
              {event.metadata && (
                <div className="text-muted-foreground">
                  {JSON.stringify(event.metadata, null, 2)}
                </div>
              )}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

// A/B Testing Hook
export const useOnboardingABTest = (testName: string, variants: string[]) => {
  const analytics = useOnboardingAnalytics();

  const getVariant = () => {
    if (typeof window === 'undefined') {
      return variants[0];
    }

    // Simple hash-based assignment for consistent user experience
    const userId = localStorage.getItem('user_id') || 'anonymous';
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    const variantIndex = Math.abs(hash) % variants.length;
    const variant = variants[variantIndex];

    // Track variant assignment
    if (analytics) {
      analytics.track({
        event: 'ab_test_assigned' as OnboardingEvent,
        metadata: {
          testName,
          variant,
          userId,
        },
      });
    }

    return variant;
  };

  return { variant: getVariant() };
};

// Performance monitoring
export const useOnboardingPerformance = () => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Monitor page load performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          // Development logging disabled for commit
          // const navEntry = entry as PerformanceNavigationTiming;
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('📈 Page Load Performance:', {
          //     loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
          //     domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
          //     firstContentfulPaint: navEntry.responseEnd - navEntry.requestStart,
          //   });
          // }
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });

    return () => observer.disconnect();
  }, []);
};

export default OnboardingAnalytics;
