'use client';

import { lazy, Suspense, ComponentType } from 'react';

// Dynamic imports for heavy components
const DynamicComponents = {
  DashboardModal: lazy(() => import('./DashboardModal')),
  AuthModal: lazy(() => import('./AuthModal')),
} as const;

interface DynamicLoaderProps {
  component: keyof typeof DynamicComponents;
  fallback?: React.ReactNode;
  [key: string]: any;
}

export function DynamicLoader({ 
  component, 
  fallback = <div className="h-4 w-16 bg-muted animate-pulse rounded" />,
  ...props 
}: DynamicLoaderProps) {
  const Component = DynamicComponents[component] as ComponentType<any>;
  
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}