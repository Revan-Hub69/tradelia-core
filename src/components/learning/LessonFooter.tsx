'use client';

import { ArrowRight, HelpCircle, MessageCircle } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

type LessonFooterProps = {
  canGoForward?: boolean;
  onNext?: () => void;
  onHelp?: () => void;
  onFeedback?: () => void;
  nextLabel?: string;
  isCompleting?: boolean;
  showHelp?: boolean;
  showFeedback?: boolean;
};

/**
 * LessonFooter - Research-Based Action-Focused Design
 *
 * Based on analysis of top educational apps:
 * - NO step counter (redundant with header)
 * - NO back button (redundant with header)
 * - NO progress summary (redundant with header)
 * - Focus on PRIMARY ACTION only
 * - Secondary actions (Help/Feedback) on desktop only
 */
export const LessonFooter: React.FC<LessonFooterProps> = ({
  canGoForward = true,
  onNext,
  onHelp,
  onFeedback,
  nextLabel,
  isCompleting = false,
  showHelp = true,
  showFeedback = true,
}) => {
  const defaultNextLabel = isCompleting ? 'Completa Lezione' : 'Continua';

  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background">
      <div className="mx-auto max-w-4xl p-4 sm:px-6">

        {/* Mobile Layout - Single Primary Action */}
        <div className="md:hidden">
          <Button
            onClick={onNext}
            disabled={!canGoForward}
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {nextLabel || defaultNextLabel}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>

        {/* Desktop Layout - Actions Distributed */}
        <div className="hidden items-center justify-between md:flex">
          {/* Left: Secondary Actions */}
          <div className="flex items-center gap-3">
            {showHelp && onHelp && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onHelp}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="size-4" />
                Aiuto
              </Button>
            )}

            {showFeedback && onFeedback && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onFeedback}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="size-4" />
                Feedback
              </Button>
            )}
          </div>

          {/* Right: Primary Action */}
          <Button
            onClick={onNext}
            disabled={!canGoForward}
            size="lg"
            className="bg-primary px-8 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {nextLabel || defaultNextLabel}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};
