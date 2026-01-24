/*
 * USE TOOLTIP HOOK - Best Practices 2026
 *
 * Based on tier-1 research:
 * - Flook: Mobile Tooltip Best Practices (2026)
 * - Aleph Accessibility: Accessible Tooltips (2025)
 * - Red Hat Design System
 *
 * Features:
 * - Auto-disable on mobile (< 768px)
 * - Auto-dismiss on button click
 * - ESC key support
 * - Hover capability detection
 */

'use client';

import { useEffect, useState } from 'react';

export type UseTooltipOptions = {
  /**
   * Disable tooltip on mobile devices
   * @default true
   */
  disableOnMobile?: boolean;

  /**
   * Auto-dismiss tooltip after action
   * @default true
   */
  autoDismissOnClick?: boolean;
};

export function useTooltip(options: UseTooltipOptions = {}) {
  const {
    disableOnMobile = true,
    autoDismissOnClick = true,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [shouldShowTooltip, setShouldShowTooltip] = useState(true);

  // Detect hover capability (desktop vs mobile)
  useEffect(() => {
    if (!disableOnMobile) {
      setShouldShowTooltip(true);
      return;
    }

    const checkHoverCapability = () => {
      // Check if device supports hover
      const hasHover = window.matchMedia('(hover: hover)').matches;
      // Check screen width (< 768px = mobile)
      const isMobile = window.innerWidth < 768;

      setShouldShowTooltip(hasHover && !isMobile);
    };

    checkHoverCapability();
    window.addEventListener('resize', checkHoverCapability);

    return () => window.removeEventListener('resize', checkHoverCapability);
  }, [disableOnMobile]);

  // ESC key to dismiss
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Handle button click (auto-dismiss)
  const handleClick = () => {
    if (autoDismissOnClick) {
      setIsOpen(false);
    }
  };

  return {
    /**
     * Whether tooltip should be shown (false on mobile)
     */
    shouldShowTooltip,

    /**
     * Whether tooltip is currently open
     */
    isOpen,

    /**
     * Set tooltip open state
     */
    setIsOpen,

    /**
     * Handle button click (auto-dismiss tooltip)
     */
    handleClick,

    /**
     * Props to spread on TooltipProvider
     */
    tooltipProps: {
      open: shouldShowTooltip ? isOpen : false,
      onOpenChange: setIsOpen,
    },
  };
}
