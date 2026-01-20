'use client';

import * as React from 'react';
import { ThemeProvider } from 'next-themes';

export function EnterpriseRuntimeClient(props: { children: React.ReactNode }) {
  React.useEffect(() => {
    document.documentElement.dataset.tradeliaRuntime = 'ready';
    window.dispatchEvent(new CustomEvent('tradelia:runtime:ready'));
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {props.children}
    </ThemeProvider>
  );
}