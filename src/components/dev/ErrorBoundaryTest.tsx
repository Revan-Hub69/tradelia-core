'use client';

import { Bug } from 'lucide-react';
import { useState } from 'react';

/**
 * Error Boundary Test Component
 *
 * Only visible in development mode.
 * Allows testing error boundaries by throwing errors on demand.
 */
export function ErrorBoundaryTest() {
  const [shouldThrow, setShouldThrow] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (shouldThrow) {
    throw new Error('Test error from ErrorBoundaryTest component');
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 lg:bottom-4">
      <button
        onClick={() => setShouldThrow(true)}
        className="flex items-center gap-2 rounded-lg border-2 border-dashed border-destructive bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive shadow-lg transition-all hover:bg-destructive/20"
        title="Test Error Boundary (dev only)"
      >
        <Bug className="size-4" />
        Test Error
      </button>
    </div>
  );
}
