'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

import { cn } from '@/utils/Helpers';

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = 'Si è verificato un errore',
  message = 'Non è stato possibile completare l\'operazione. Riprova più tardi.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-[#ef4444]/10 p-4">
        <AlertTriangle className="size-8 text-[#ef4444]" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-[#fafafa]">{title}</h3>
      <p className="mb-6 max-w-xs text-sm text-[#a1a1aa]">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-[#27272a] hover:bg-[#3f3f46]',
            'text-[#fafafa] text-sm font-medium',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981]',
          )}
        >
          <RefreshCw className="size-4" />
          Riprova
        </button>
      )}
    </motion.div>
  );
}
