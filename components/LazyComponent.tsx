'use client';

import { lazy, Suspense } from 'react';

// Lazy load heavy components
const DashboardModal = lazy(() => import('./DashboardModal'));
const AuthModal = lazy(() => import('./AuthModal'));

interface LazyComponentProps {
  component: 'dashboard' | 'auth';
  [key: string]: any;
}

export function LazyComponent({ component, ...props }: LazyComponentProps) {
  const Component = component === 'dashboard' ? DashboardModal : AuthModal;
  
  return (
    <Suspense fallback={<div className="animate-pulse bg-muted h-8 w-24 rounded" />}>
      <Component {...props} />
    </Suspense>
  );
}