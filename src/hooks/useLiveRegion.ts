'use client';

import { useState } from 'react';

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
