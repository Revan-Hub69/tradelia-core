'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/utils/Helpers';

/**
 * ScrollToTop — iOS 26 Pill Capsule Glass
 *
 * Pattern: appare dopo 300px di scroll, scompare a top.
 * Posizione: bottom-center mobile, bottom-right desktop.
 * Animazione: spring scale + opacity (nessun bounce artificiale).
 */
export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 300 && !visible) {
        setLeaving(false);
        setVisible(true);
      } else if (y < 50 && visible) {
        // Trigger exit animation then unmount
        setLeaving(true);
        const t = setTimeout(() => setVisible(false), 320);
        return () => clearTimeout(t);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [visible]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Torna in cima"
      className={cn(
        'scroll-to-top-pill',
        leaving ? 'scroll-to-top-exit' : 'scroll-to-top-enter',
      )}
    >
      {/* Arrow up icon — inline SVG, nessuna dipendenza */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
      <span className="scroll-to-top-label">Top</span>
    </button>
  );
};
