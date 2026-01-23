'use client';

import React, { useEffect, useState } from 'react';

/**
 * HOVER CSS TRACKER - Semplice e Diretto
 *
 * Mostra SOLO quali CSS gestiscono gli hover degli elementi header
 * Niente conflitti, niente complicazioni - solo i CSS REALI caricati
 */

type HoverCSSData = {
  element: string;
  hoverCSS: string[];
  transitionCSS: string[];
  transformCSS: string[];
  allClasses: string[];
};

export const HoverCSSTracker: React.FC = () => {
  const [hoverData, setHoverData] = useState<HoverCSSData[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const trackHoverCSS = () => {
    const headerButtons = document.querySelectorAll('header button, .dashboard-header button');
    const data: HoverCSSData[] = [];

    headerButtons.forEach((button, index) => {
      if (button instanceof HTMLElement) {
        const classes = Array.from(button.classList);

        // Trova SOLO le classi che gestiscono hover
        const hoverClasses = classes.filter(cls =>
          cls.includes('hover:')
          || cls.includes('glass-')
          || cls.includes('header-icon'),
        );

        // Trova SOLO le classi di transizione
        const transitionClasses = classes.filter(cls =>
          cls.includes('transition')
          || cls.includes('duration')
          || cls.includes('ease'),
        );

        // Trova SOLO le classi di transform
        const transformClasses = classes.filter(cls =>
          cls.includes('scale')
          || cls.includes('transform')
          || cls.includes('rotate'),
        );

        const ariaLabel = button.getAttribute('aria-label') || `Button ${index + 1}`;

        data.push({
          element: ariaLabel,
          hoverCSS: hoverClasses,
          transitionCSS: transitionClasses,
          transformCSS: transformClasses,
          allClasses: classes,
        });
      }
    });

    setHoverData(data);
    setIsVisible(true);

    // Log SEMPLICE nella console
    // eslint-disable-next-line no-console
    console.group('🎯 HOVER CSS TRACKER - CHI GESTISCE GLI HOVER?');
    data.forEach((item) => {
      // eslint-disable-next-line no-console
      console.log(`\n📍 ${item.element}:`);
      // eslint-disable-next-line no-console
      console.log('  🎨 Hover CSS:', item.hoverCSS);
      // eslint-disable-next-line no-console
      console.log('  ⚡ Transition CSS:', item.transitionCSS);
      // eslint-disable-next-line no-console
      console.log('  🔄 Transform CSS:', item.transformCSS);
      // eslint-disable-next-line no-console
      console.log('  📋 Tutte le classi:', item.allClasses);
    });
    // eslint-disable-next-line no-console
    console.groupEnd();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      trackHoverCSS();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || hoverData.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        width: '500px',
        maxHeight: '80vh',
        background: 'rgba(0,0,0,0.95)',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: '11px',
        border: '2px solid #00ff00',
        borderRadius: '8px',
        padding: '15px',
        zIndex: 999999,
        overflowY: 'auto',
      }}
    >
      <div style={{
        color: '#00ffff',
        fontWeight: 'bold',
        marginBottom: '15px',
        textAlign: 'center',
      }}
      >
        🎯 HOVER CSS TRACKER - CHI GESTISCE GLI HOVER?
      </div>

      <button
        type="button"
        onClick={() => setIsVisible(false)}
        style={{
          position: 'absolute',
          top: '5px',
          right: '10px',
          background: 'transparent',
          color: '#ff6666',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        ❌
      </button>

      {hoverData.map((item, index) => (
        <div
          key={`hover-${item.element}-${index}`}
          style={{
            margin: '10px 0',
            padding: '10px',
            border: '1px solid #333',
            borderRadius: '5px',
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}
        >
          <div style={{
            color: '#ffff00',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}
          >
            📍
            {' '}
            {item.element}
          </div>

          <div style={{ marginBottom: '5px' }}>
            <span style={{ color: '#ff9999' }}>🎨 Hover CSS:</span>
            <div style={{ color: '#ffffff', marginLeft: '20px' }}>
              {item.hoverCSS.length > 0 ? item.hoverCSS.join(', ') : 'NESSUNO'}
            </div>
          </div>

          <div style={{ marginBottom: '5px' }}>
            <span style={{ color: '#99ff99' }}>⚡ Transition CSS:</span>
            <div style={{ color: '#ffffff', marginLeft: '20px' }}>
              {item.transitionCSS.length > 0 ? item.transitionCSS.join(', ') : 'NESSUNO'}
            </div>
          </div>

          <div style={{ marginBottom: '5px' }}>
            <span style={{ color: '#9999ff' }}>🔄 Transform CSS:</span>
            <div style={{ color: '#ffffff', marginLeft: '20px' }}>
              {item.transformCSS.length > 0 ? item.transformCSS.join(', ') : 'NESSUNO'}
            </div>
          </div>

          <details style={{ marginTop: '8px' }}>
            <summary style={{
              color: '#cccccc',
              cursor: 'pointer',
              fontSize: '10px',
            }}
            >
              📋 Tutte le classi (
              {item.allClasses.length}
              )
            </summary>
            <div style={{
              color: '#888888',
              fontSize: '9px',
              marginTop: '5px',
              marginLeft: '15px',
              wordBreak: 'break-all',
            }}
            >
              {item.allClasses.join(', ')}
            </div>
          </details>
        </div>
      ))}

      <div style={{
        textAlign: 'center',
        marginTop: '15px',
        color: '#888888',
        fontSize: '9px',
      }}
      >
        Controlla la console per i dettagli completi
      </div>
    </div>
  );
};

export default HoverCSSTracker;