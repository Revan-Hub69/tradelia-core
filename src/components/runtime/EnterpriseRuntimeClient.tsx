'use client';

import { ThemeProvider } from 'next-themes';
import * as React from 'react';

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
