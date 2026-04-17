'use client';

import { createPortal } from 'react-dom';

import { cn } from '@/utils/Helpers';

type PortalProps = {
  children: React.ReactNode;
  className?: string;
};

export function Portal({ children, className }: PortalProps) {
  // Only render portal on client side
  if (typeof window === 'undefined') {
    return null;
  }

  const portalRoot = document.getElementById('portal-root') || document.body;

  return createPortal(
    <div className={cn('portal-container', className)}>{children}</div>,
    portalRoot,
  );
}
