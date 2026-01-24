'use client';

import { ThemeProvider } from 'next-themes';
import * as React from 'react';

export function EnterpriseRuntimeClient(props: { children: React.ReactNode }) {
  // Use useLayoutEffect to set runtime flag BEFORE first paint
  React.useLayoutEffect(() => {
    document.documentElement.dataset.tradeliaRuntime = 'ready';
    window.dispatchEvent(new CustomEvent('tradelia:runtime:ready'));
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {props.children}
    </ThemeProvider>
  );
}
