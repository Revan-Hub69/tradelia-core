'use client';

import React, { useEffect, useState } from 'react';

type CSSCollectorData = {
  selector: string;
  tag: string;
  classes: string[];
  ariaLabel: string | null;
  computedStyles: {
    transition: string;
    transform: string;
    zIndex: string;
    position: string;
    backgroundColor: string;
    backdropFilter: string;
  };
  conflicts: string[];
};

type ProductionCSSCollectorProps = {
  enabled?: boolean;
  autoCollect?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
};

export const ProductionCSSCollector: React.FC<ProductionCSSCollectorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  autoCollect = true,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [collectedData, setCollectedData] = useState<CSSCollectorData[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [conflicts, setConflicts] = useState<string[]>([]);

  // Auto-collect on mount
  useEffect(() => {
    if (enabled && autoCollect) {
      const timer = setTimeout(() => {
        collectHeaderCSS();
      }, 2000); // Wait for components to mount
      
      return () => clearTimeout(timer);
    }
    
    return undefined; // Explicit return for TypeScript
  }, [enabled, autoCollect]);

  // Keyboard shortcut to toggle visibility
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+C to toggle collector
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  const collectHeaderCSS = () => {
    if (isCollecting) return;
    
    setIsCollecting(true);
    
    const headerSelectors = [
      'button[aria-label*="theme"]',
      'button[aria-label*="notification"]', 
      'button[aria-label*="user"]',
      '[class*="ThemeSwitcher"]',
      '[class*="NotificationsBell"]',
      '[class*="UserDropdown"]',
      'header button',
      '.dashboard-header button'
    ];

    const collected: CSSCollectorData[] = [];
    const foundConflicts: string[] = [];

    headerSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
          const htmlEl = el as HTMLElement;
          
          if (htmlEl.offsetWidth > 0 && htmlEl.offsetHeight > 0) {
            const computedStyle = getComputedStyle(htmlEl);
            const classes = Array.from(htmlEl.classList);
            
            // Detect conflicts
            const elementConflicts = detectConflicts(classes, computedStyle);
            if (elementConflicts.length > 0) {
              foundConflicts.push(`${selector}[${index}]: ${elementConflicts.join(', ')}`);
            }
            
            collected.push({
              selector,
              tag: htmlEl.tagName.toLowerCase(),
              classes,
              ariaLabel: htmlEl.getAttribute('aria-label'),
              computedStyles: {
                transition: computedStyle.transition,
                transform: computedStyle.transform,
                zIndex: computedStyle.zIndex,
                position: computedStyle.position,
                backgroundColor: computedStyle.backgroundColor,
                backdropFilter: computedStyle.backdropFilter
              },
              conflicts: elementConflicts
            });
          }
        });
      } catch (error) {
        console.warn('CSS Collector - Selector failed:', selector, error);
      }
    });

    setCollectedData(collected);
    setConflicts(foundConflicts);
    setIsCollecting(false);
    
    // Auto-show results if conflicts found
    if (foundConflicts.length > 0) {
      setIsVisible(true);
    }

    // Log to console for immediate access
    console.group('🔍 PRODUCTION CSS COLLECTOR RESULTS');
    console.log('📊 Elements found:', collected.length);
    console.log('⚡ Conflicts found:', foundConflicts.length);
    console.log('📋 Full data:', collected);
    if (foundConflicts.length > 0) {
      console.warn('🚨 Conflicts:', foundConflicts);
    }
    console.groupEnd();
  };

  const detectConflicts = (classes: string[], computedStyle: CSSStyleDeclaration): string[] => {
    const conflicts: string[] = [];

    // Check for multiple animation classes
    const animationClasses = classes.filter(cls => 
      cls.includes('transition') || cls.includes('hover') || 
      cls.includes('scale') || cls.includes('animate') ||
      cls.includes('glass') || cls.includes('header-icon')
    );

    if (animationClasses.length > 2) {
      conflicts.push(`Multiple animation classes: ${animationClasses.join(', ')}`);
    }

    // Check for transition: all conflicts
    if (computedStyle.transition.includes('all') && 
        classes.some(cls => cls.includes('header-icon'))) {
      conflicts.push('Transform conflict: transition:all + header-icon');
    }

    // Check for z-index issues
    const zIndexClasses = classes.filter(cls => cls.includes('z-[') || cls.includes('layer-'));
    if (zIndexClasses.length > 1) {
      conflicts.push(`Multiple z-index classes: ${zIndexClasses.join(', ')}`);
    }

    // Check for extreme z-index values
    if (computedStyle.zIndex && parseInt(computedStyle.zIndex) > 100) {
      conflicts.push(`High z-index: ${computedStyle.zIndex}`);
    }

    return conflicts;
  };

  const exportData = () => {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      elements: collectedData,
      conflicts: conflicts,
      summary: {
        totalElements: collectedData.length,
        totalConflicts: conflicts.length,
        elementsWithConflicts: collectedData.filter(el => el.conflicts.length > 0).length
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `production-css-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!enabled) return null;

  const positionStyles = {
    'top-right': { top: '10px', right: '10px' },
    'top-left': { top: '10px', left: '10px' },
    'bottom-right': { bottom: '10px', right: '10px' },
    'bottom-left': { bottom: '10px', left: '10px' }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          ...positionStyles[position],
          zIndex: 999998,
          background: 'rgba(0,0,0,0.8)',
          color: '#00ff00',
          border: '1px solid #00ff00',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '10px',
          fontFamily: 'monospace',
          cursor: 'pointer'
        }}
        title="CSS Collector (Ctrl+Shift+C)"
      >
        🔍 CSS
      </button>

      {/* Collector Panel */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: '50px',
            right: '10px',
            width: '400px',
            maxHeight: '80vh',
            background: 'rgba(0,0,0,0.95)',
            color: '#00ff00',
            fontFamily: 'monospace',
            fontSize: '10px',
            border: '2px solid #00ff00',
            borderRadius: '8px',
            padding: '10px',
            zIndex: 999999,
            overflowY: 'auto'
          }}
        >
          <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '10px' }}>
            🔍 PRODUCTION CSS COLLECTOR
          </div>

          <div style={{ marginBottom: '10px' }}>
            <button
              onClick={collectHeaderCSS}
              disabled={isCollecting}
              style={{
                background: '#333',
                color: '#00ff00',
                border: '1px solid #555',
                padding: '4px 8px',
                margin: '2px',
                cursor: 'pointer',
                fontSize: '9px'
              }}
            >
              {isCollecting ? '⏳ Collecting...' : '🎯 Collect Header CSS'}
            </button>
            
            <button
              onClick={exportData}
              disabled={collectedData.length === 0}
              style={{
                background: '#333',
                color: '#00ff00',
                border: '1px solid #555',
                padding: '4px 8px',
                margin: '2px',
                cursor: 'pointer',
                fontSize: '9px'
              }}
            >
              📄 Export JSON
            </button>

            <button
              onClick={() => setIsVisible(false)}
              style={{
                background: '#333',
                color: '#ff6666',
                border: '1px solid #555',
                padding: '4px 8px',
                margin: '2px',
                cursor: 'pointer',
                fontSize: '9px'
              }}
            >
              ❌ Close
            </button>
          </div>

          {/* Stats */}
          <div style={{ 
            background: 'rgba(0,0,0,0.8)', 
            padding: '6px', 
            borderRadius: '4px', 
            marginBottom: '10px' 
          }}>
            <div style={{ color: '#00ffff' }}>
              📊 Elements: {collectedData.length} | ⚡ Conflicts: {conflicts.length}
            </div>
            <div style={{ color: '#ffff00', fontSize: '8px' }}>
              🌐 {window.location.href}
            </div>
          </div>

          {/* Conflicts Summary */}
          {conflicts.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: '#ff6666', fontWeight: 'bold' }}>
                🚨 CONFLICTS DETECTED:
              </div>
              {conflicts.slice(0, 5).map((conflict, index) => (
                <div
                  key={index}
                  style={{
                    color: '#ffa500',
                    fontSize: '8px',
                    marginLeft: '10px',
                    marginBottom: '2px'
                  }}
                >
                  • {conflict}
                </div>
              ))}
              {conflicts.length > 5 && (
                <div style={{ color: '#666', fontSize: '8px', marginLeft: '10px' }}>
                  ... and {conflicts.length - 5} more
                </div>
              )}
            </div>
          )}

          {/* Elements List */}
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {collectedData.slice(0, 10).map((item, index) => (
              <div
                key={index}
                style={{
                  margin: '5px 0',
                  padding: '5px',
                  border: item.conflicts.length > 0 ? '1px solid #ff6666' : '1px solid #333',
                  borderRadius: '3px',
                  fontSize: '8px'
                }}
              >
                <div style={{ color: '#ffff00', fontWeight: 'bold' }}>
                  {item.ariaLabel || `${item.tag} element`}
                </div>
                
                <div style={{ color: '#9999ff', marginTop: '2px' }}>
                  Classes ({item.classes.length}): {item.classes.slice(0, 3).join(', ')}
                  {item.classes.length > 3 && '...'}
                </div>

                {item.conflicts.length > 0 && (
                  <div style={{ color: '#ff6666', marginTop: '2px' }}>
                    ⚡ {item.conflicts[0]}
                  </div>
                )}

                <div style={{ color: '#00ff00', marginTop: '2px' }}>
                  z-index: {item.computedStyles.zIndex} | 
                  transform: {item.computedStyles.transform === 'none' ? 'none' : 'yes'}
                </div>
              </div>
            ))}
            
            {collectedData.length > 10 && (
              <div style={{ color: '#666', textAlign: 'center', padding: '5px' }}>
                ... and {collectedData.length - 10} more elements
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductionCSSCollector;