'use client';

import React, { useEffect } from 'react';

/**
 * HEADER FIX COLLECTOR - Minimal Version
 * 
 * This component was discovered to fix header overlapping issues through side effects.
 * It's a minimal version that maintains only the necessary side effects without debug UI.
 * 
 * CRITICAL: Removing this component causes header overlapping bugs to return.
 * The exact mechanism is unknown but likely related to:
 * - DOM timing and re-render cycles
 * - CSS cascade effects
 * - React component mounting order
 * - Z-index stacking context creation
 */

type HeaderFixCollectorProps = {
  enabled?: boolean;
};

export const HeaderFixCollector: React.FC<HeaderFixCollectorProps> = ({
  enabled = true
}) => {
  // Auto-trigger effect on mount - this seems to be the critical part
  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      // Minimal DOM query that might trigger the fix
      const headerElements = document.querySelectorAll('header button, .dashboard-header button');
      
      // Force a minimal style recalculation - this might be what fixes the bug
      headerElements.forEach((el) => {
        if (el instanceof HTMLElement && el.offsetWidth > 0) {
          // Trigger style recalculation without visible changes
          const computedStyle = getComputedStyle(el);
          // Reading these properties might force the browser to recalculate layout
          void computedStyle.zIndex;
          void computedStyle.transform;
          void computedStyle.position;
        }
      });
    }, 2000); // Same timing as original collector
    
    return () => clearTimeout(timer);
  }, [enabled]);

  if (!enabled) return null;

  // Invisible element that might create necessary stacking context
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 1,
        height: 1,
        zIndex: 999999, // Same z-index as original collector
        pointerEvents: 'none',
        opacity: 0,
        visibility: 'hidden'
      }}
      aria-hidden="true"
    />
  );
};

export default HeaderFixCollector;