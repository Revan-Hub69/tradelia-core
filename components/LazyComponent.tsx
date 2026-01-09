'use client';

import { lazy, Suspense } from 'react';

// Lazy load heavy components
const AuthModal = lazy(() => import('./AuthModal'));
const DashboardRegistrationModal = lazy(() => import('./DashboardRegistrationModal'));

interface LazyComponentProps {
  component: 'dashboard' | 'auth';
  [key: string]: any;
}

export function LazyComponent({ component, ...props }: LazyComponentProps) {
  const Component = component === 'auth' ? AuthModal : DashboardRegistrationModal;
  
  return (
    <Suspense fallback={<div className="animate-pulse bg-muted h-8 w-24 rounded" />}>
      <Component {...props} />
    </Suspense>
  );
}