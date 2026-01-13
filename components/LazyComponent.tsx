'use client';

import { lazy, Suspense } from 'react';

// Lazy load heavy components
const AuthModal = lazy(() => import('./AuthModal'));
const DashboardRegistrationModal = lazy(() => import('./DashboardRegistrationModal'));

interface LazyComponentProps {
  component: 'dashboard' | 'auth';
}

export function LazyComponent({ component }: LazyComponentProps) {
  if (component === 'auth') {
    return (
      <Suspense fallback={<div className="animate-pulse bg-muted h-8 w-24 rounded" />}>
        <AuthModal />
      </Suspense>
    );
  }
  
  return (
    <Suspense fallback={<div className="animate-pulse bg-muted h-8 w-24 rounded" />}>
      <DashboardRegistrationModal />
    </Suspense>
  );
}