/*
 * RESPONSIVE DEBUG COMPONENT - Development Tool
 * 
 * Shows current breakpoint and navigation state for testing
 * Only visible in development mode
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/Helpers';

type ResponsiveDebugProps = {
  className?: string;
};

export const ResponsiveDebug: React.FC<ResponsiveDebugProps> = ({ className }) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [breakpoint, setBreakpoint] = useState('');

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowSize({ width, height });

      // Determine breakpoint
      if (width < 640) {
        setBreakpoint('xs (< 640px)');
      } else if (width < 768) {
        setBreakpoint('sm (640px-767px)');
      } else if (width < 1024) {
        setBreakpoint('md (768px-1023px)');
      } else if (width < 1280) {
        setBreakpoint('lg (1024px-1279px)');
      } else if (width < 1536) {
        setBreakpoint('xl (1280px-1535px)');
      } else {
        setBreakpoint('2xl (≥ 1536px)');
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      className={cn(
        'fixed top-4 right-4 z-[9999] p-3 rounded-lg',
        'bg-black/80 text-white text-xs font-mono',
        'backdrop-blur-sm border border-white/20',
        'pointer-events-none select-none',
        className,
      )}
    >
      <div className="space-y-1">
        <div className="font-semibold text-yellow-400">Responsive Debug</div>
        <div>Size: {windowSize.width} × {windowSize.height}</div>
        <div>Breakpoint: <span className="text-green-400">{breakpoint}</span></div>
        <div className="pt-1 border-t border-white/20">
          <div className="text-blue-400">Navigation:</div>
          <div className="ml-2">
            <div className="lg:hidden">• Bottom Nav: <span className="text-green-400">Visible</span></div>
            <div className="hidden lg:block">• Bottom Nav: <span className="text-red-400">Hidden</span></div>
            <div className="hidden md:block lg:hidden">• Header Nav: <span className="text-green-400">Visible</span></div>
            <div className="md:hidden lg:block">• Header Nav: <span className="text-red-400">Hidden</span></div>
            <div className="hidden lg:block">• Sidebar: <span className="text-green-400">Visible</span></div>
            <div className="lg:hidden">• Sidebar: <span className="text-red-400">Hidden</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};