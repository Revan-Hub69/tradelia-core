/**
 * TOOLTIP COMPONENT - Enterprise 2026
 *
 * Best Practices:
 * - 500ms delay (not instant)
 * - Smart positioning (avoid viewport edges)
 * - Short content (1-5 words)
 * - Keyboard support (show on focus)
 * - Mobile support (long press)
 * - WCAG 2.1 AAA compliant
 *
 * Sources:
 * - Material Design 3: Tooltips
 * - Nielsen Norman Group: Tooltip Guidelines
 * - ARIA Authoring Practices Guide
 */

'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/utils/Helpers';

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // Base styles
      'z-50 overflow-hidden rounded-lg px-3 py-1.5 text-xs',
      // Colors
      'bg-popover text-popover-foreground',
      // Border & shadow
      'border border-border/50 shadow-lg',
      // Animation
      'animate-in fade-in-0 zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      // Side-specific animations
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Convenience wrapper component
type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  className?: string;
};

function Tooltip({
  children,
  content,
  side = 'bottom',
  delayDuration = 500,
  className,
}: TooltipProps) {
  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger };
