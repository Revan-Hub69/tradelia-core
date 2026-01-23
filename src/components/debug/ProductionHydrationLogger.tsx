'use client';

import { useEffect, useRef } from 'react';

interface ElementSnapshot {
  selector: string;
  tagName: string;
  id: string;
  classes: string[];
  inlineStyle: string | null;
  attributes: Record<string, string>;
  computedStyles: {
    // Layout
    display: string;
    position: string;
    width: string;
    height: string;
    top: string;
    left: string;
    right: string;
    bottom: string;
    zIndex: string;
    // Background & Borders
    background: string;
    backgroundColor: string;
    backgroundImage: string;
    backdropFilter: string;
    border: string;
    borderRadius: string;
    boxShadow: string;
    outline: string;
    // Transforms & Animations
    transform: string;
    transition: string;
    animation: string;
    willChange: string;
    // Typography
    color: string;
    fontSize: string;
    fontWeight: string;
    // Opacity & Visibility
    opacity: string;
    visibility: string;
    // Flexbox
    display: string;
    justifyContent: string;
    alignItems: string;
    gap: string;
  };
  outerHTML: string;
  innerHTML: string;
  textContent: string;
  boundingRect: {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

interface HydrationSnapshot {
  timestamp: number;
  snapshotType: 'after-hydration' | 'after-interaction' | 'on-error';
  url: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  theme: 'light' | 'dark';
  // Document state
  documentReady: boolean;
  documentHTML: string; // Full HTML
  // CSS Files loaded
  cssFiles: Array<{
    href: string | null;
    disabled: boolean;
    rulesCount: number;
  }>;
  // Header specific
  headerElements: ElementSnapshot[];
  // All buttons with specific classes
  allGlassButtons: ElementSnapshot[];
  allHeaderIcons: ElementSnapshot[];
  // Runtime flags
  runtimeFlags: {
    ready: boolean;
    theme: string;
  };
  // Performance
  performanceTiming: {
    domContentLoaded: number;
    loadComplete: number;
    timeSincePageLoad: number;
  };
}

function captureElementSnapshot(element: Element): ElementSnapshot {
  const computed = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  
  // Build CSS selector
  let selector = element.tagName.toLowerCase();
  if (element.id) selector += `#${element.id}`;
  if (element.className) {
    const classes = element.className.split(' ').filter(Boolean);
    selector += classes.map(c => `.${c}`).join('');
  }

  // Capture all attributes
  const attributes: Record<string, string> = {};
  Array.from(element.attributes).forEach(attr => {
    attributes[attr.name] = attr.value;
  });

  return {
    selector,
    tagName: element.tagName,
    id: element.id,
    classes: element.className.split(' ').filter(Boolean),
    inlineStyle: element.getAttribute('style'),
    attributes,
    computedStyles: {
      // Layout
      display: computed.display,
      position: computed.position,
      width: computed.width,
      height: computed.height,
      top: computed.top,
      left: computed.left,
      right: computed.right,
      bottom: computed.bottom,
      zIndex: computed.zIndex,
      // Background & Borders
      background: computed.background,
      backgroundColor: computed.backgroundColor,
      backgroundImage: computed.backgroundImage,
      backdropFilter: computed.backdropFilter,
      border: computed.border,
      borderRadius: computed.borderRadius,
      boxShadow: computed.boxShadow,
      outline: computed.outline,
      // Transforms & Animations
      transform: computed.transform,
      transition: computed.transition,
      animation: computed.animation,
      willChange: computed.willChange,
      // Typography
      color: computed.color,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      // Opacity & Visibility
      opacity: computed.opacity,
      visibility: computed.visibility,
      // Flexbox
      justifyContent: computed.justifyContent,
      alignItems: computed.alignItems,
      gap: computed.gap,
    },
    outerHTML: element.outerHTML.substring(0, 1000), // First 1000 chars
    innerHTML: element.innerHTML.substring(0, 500), // First 500 chars
    textContent: element.textContent?.substring(0, 200) || '',
    boundingRect: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
    },
  };
}

function captureFullSnapshot(type: HydrationSnapshot['snapshotType']): HydrationSnapshot {
  // Capture header elements
  const headerElements = Array.from(
    document.querySelectorAll('header, [role="banner"], .dashboard-header, [class*="header"]')
  ).map(captureElementSnapshot);

  // Capture all glass buttons
  const allGlassButtons = Array.from(
    document.querySelectorAll('.glass-button')
  ).map(captureElementSnapshot);

  // Capture all header icons
  const allHeaderIcons = Array.from(
    document.querySelectorAll('.header-icon')
  ).map(captureElementSnapshot);

  // Capture CSS files
  const cssFiles = Array.from(document.styleSheets).map(sheet => {
    try {
      return {
        href: sheet.href,
        disabled: sheet.disabled,
        rulesCount: sheet.cssRules?.length || 0,
      };
    } catch {
      return {
        href: sheet.href || 'inline-or-cors-blocked',
        disabled: sheet.disabled,
        rulesCount: -1, // CORS blocked
      };
    }
  });

  // Capture runtime flags
  const runtimeFlags = {
    ready: (window as any).__TRADELIA_RUNTIME_READY__ || false,
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  };

  // Performance timing
  const perfTiming = performance.timing;
  const now = Date.now();
  
  const snapshot: HydrationSnapshot = {
    timestamp: now,
    snapshotType: type,
    url: window.location.href,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    documentReady: document.readyState === 'complete',
    documentHTML: document.documentElement.outerHTML,
    cssFiles,
    headerElements,
    allGlassButtons,
    allHeaderIcons,
    runtimeFlags,
    performanceTiming: {
      domContentLoaded: perfTiming.domContentLoadedEventEnd - perfTiming.navigationStart,
      loadComplete: perfTiming.loadEventEnd - perfTiming.navigationStart,
      timeSincePageLoad: now - perfTiming.navigationStart,
    },
  };

  return snapshot;
}

async function sendSnapshotToServer(snapshot: HydrationSnapshot) {
  try {
    const response = await fetch('/api/debug/hydration-snapshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(snapshot),
    });

    if (!response.ok) {
      console.error('Failed to send snapshot:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending snapshot:', error);
  }
}

export function ProductionHydrationLogger() {
  const hasLoggedHydration = useRef(false);
  const hasLoggedInteraction = useRef(false);

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 ProductionHydrationLogger: Skipping (not production)');
      return;
    }

    // Snapshot 1: After hydration (immediate)
    if (!hasLoggedHydration.current) {
      hasLoggedHydration.current = true;
      
      setTimeout(() => {
        console.log('🔍 Capturing AFTER-HYDRATION snapshot...');
        const snapshot = captureFullSnapshot('after-hydration');
        
        // Log to console for immediate inspection
        console.log('📸 AFTER-HYDRATION SNAPSHOT:', {
          timestamp: new Date(snapshot.timestamp).toISOString(),
          theme: snapshot.theme,
          headerElements: snapshot.headerElements.length,
          glassButtons: snapshot.allGlassButtons.length,
          headerIcons: snapshot.allHeaderIcons.length,
          cssFiles: snapshot.cssFiles.length,
          runtimeReady: snapshot.runtimeFlags.ready,
        });
        
        // Detailed log for glass buttons
        snapshot.allGlassButtons.forEach((btn, idx) => {
          console.log(`  Button #${idx + 1}:`, {
            selector: btn.selector,
            classes: btn.classes,
            backdropFilter: btn.computedStyles.backdropFilter,
            background: btn.computedStyles.background,
            transform: btn.computedStyles.transform,
            transition: btn.computedStyles.transition,
          });
        });

        // Send to server
        sendSnapshotToServer(snapshot);
      }, 100); // Wait 100ms after hydration
    }

    // Snapshot 2: After first user interaction
    const captureAfterInteraction = () => {
      if (hasLoggedInteraction.current) return;
      hasLoggedInteraction.current = true;

      setTimeout(() => {
        console.log('🔍 Capturing AFTER-INTERACTION snapshot...');
        const snapshot = captureFullSnapshot('after-interaction');
        
        console.log('📸 AFTER-INTERACTION SNAPSHOT:', {
          timestamp: new Date(snapshot.timestamp).toISOString(),
          theme: snapshot.theme,
          glassButtons: snapshot.allGlassButtons.length,
        });

        // Send to server
        sendSnapshotToServer(snapshot);
      }, 100);

      // Remove listeners after first capture
      document.removeEventListener('click', captureAfterInteraction);
      document.removeEventListener('keydown', captureAfterInteraction);
    };

    document.addEventListener('click', captureAfterInteraction);
    document.addEventListener('keydown', captureAfterInteraction);

    // Snapshot 3: On React hydration error
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      
      // Detect hydration errors
      if (
        message.includes('Hydration') ||
        message.includes('did not match') ||
        message.includes('Text content does not match') ||
        message.includes('Minified React error #418')
      ) {
        console.log('🔍 Capturing ON-ERROR snapshot...');
        const snapshot = captureFullSnapshot('on-error');
        
        console.log('📸 ON-ERROR SNAPSHOT:', {
          timestamp: new Date(snapshot.timestamp).toISOString(),
          error: message,
        });

        sendSnapshotToServer(snapshot);
      }

      // Call original console.error
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
      document.removeEventListener('click', captureAfterInteraction);
      document.removeEventListener('keydown', captureAfterInteraction);
    };
  }, []);

  return null; // This component renders nothing
}
