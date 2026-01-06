"use client";

import { useEffect, useState } from "react";

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'tradelia-theme';

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;

  // Use class for Tailwind dark mode
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeToggleCompact() {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="w-6 h-6 rounded border border-border/50 bg-muted/30 animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="w-6 h-6 rounded border border-border/50 bg-muted/30 hover:bg-muted/50 flex items-center justify-center transition-subtle"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        // Sun icon (light mode) - homemade SVG
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ) : (
        // Moon icon (dark mode) - homemade SVG
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      )}
    </button>
  );
}