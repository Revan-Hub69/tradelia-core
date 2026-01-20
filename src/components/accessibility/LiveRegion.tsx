/*
 * LIVE REGION - Enterprise Screen Reader Support 2026
 *
 * Announcements intelligenti per screen reader
 * Evita spam e gestisce priorità
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';

export type LiveRegionProps = {
  message?: string;
  priority?: 'polite' | 'assertive';
  clearDelay?: number;
  className?: string;
};

export const LiveRegion: React.FC<LiveRegionProps> = ({
  message = '',
  priority = 'polite',
  clearDelay = 1000,
  className = 'sr-only',
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!message) {
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new message
    setCurrentMessage(message);

    // Clear message after delay
    timeoutRef.current = setTimeout(() => {
      setCurrentMessage('');
    }, clearDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearDelay]);

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className={className}
    >
      {currentMessage}
    </div>
  );
};

// Hook per gestire announcements
export const useLiveRegion = () => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite');

  const announce = (text: string, level: 'polite' | 'assertive' = 'polite') => {
    setPriority(level);
    setMessage(text);
  };

  const clear = () => {
    setMessage('');
  };

  return { message, priority, announce, clear };
};
