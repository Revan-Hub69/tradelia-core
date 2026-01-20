'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type ToastType = 'success' | 'achievement' | 'milestone' | 'warning' | 'info';

type ToastData = {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  icon?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type PremiumToastProps = {
  toast: ToastData;
  onDismiss: (id: string) => void;
};

const toastStyles = {
  success: {
    bg: 'from-accent to-accent/80',
    border: 'border-accent/50',
    icon: '✓',
    glow: 'hsl(var(--accent))',
  },
  achievement: {
    bg: 'from-warning to-warning/80',
    border: 'border-warning/50',
    icon: '🏆',
    glow: 'hsl(var(--warning))',
  },
  milestone: {
    bg: 'from-primary to-primary/80',
    border: 'border-primary/50',
    icon: '🎯',
    glow: 'hsl(var(--primary))',
  },
  warning: {
    bg: 'from-destructive to-destructive/80',
    border: 'border-destructive/50',
    icon: '⚠️',
    glow: 'hsl(var(--destructive))',
  },
  info: {
    bg: 'from-info to-info/80',
    border: 'border-info/50',
    icon: 'ℹ️',
    glow: 'hsl(var(--info))',
  },
};

export const PremiumToast = ({ toast, onDismiss }: PremiumToastProps) => {
  const [progress, setProgress] = useState(100);
  const style = toastStyles[toast.type];
  const duration = toast.duration || 5000;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          onDismiss(toast.id);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="group relative"
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-30 blur-lg"
        style={{ backgroundColor: style.glow }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Main Toast */}
      <motion.div
        className={`relative overflow-hidden rounded-2xl border bg-gradient-to-r shadow-2xl backdrop-blur-sm ${style.bg} ${style.border} min-w-72 max-w-sm sm:min-w-80 sm:max-w-md`}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Content */}
        <div className="flex items-start space-x-2 p-3 text-white sm:space-x-3 sm:p-4">
          {/* Icon */}
          <motion.div
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-base sm:size-8 sm:text-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {toast.icon || style.icon}
          </motion.div>

          {/* Text Content */}
          <div className="min-w-0 flex-1">
            <motion.h4
              className="mb-1 text-sm font-semibold"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {toast.title}
            </motion.h4>
            <motion.p
              className="text-xs leading-relaxed text-white/90"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {toast.message}
            </motion.p>

            {/* Action Button */}
            {toast.action && (
              <motion.button
                className="mt-2 rounded-lg bg-white/20 px-2 py-1 text-xs font-medium transition-colors hover:bg-white/30 sm:mt-3 sm:px-3"
                onClick={toast.action.onClick}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {toast.action.label}
              </motion.button>
            )}
          </div>

          {/* Dismiss Button */}
          <motion.button
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white/80 transition-colors hover:bg-white/30 hover:text-white sm:size-6"
            onClick={() => onDismiss(toast.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-white/60"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'linear',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

type ToastContainerProps = {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
};

export const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => {
  return (
    <div className="fixed right-4 top-4 z-50 max-w-sm space-y-2 sm:max-w-md sm:space-y-3">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <PremiumToast
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (title: string, message: string, action?: ToastData['action']) => {
    addToast({ type: 'success', title, message, action });
  };

  const showAchievement = (title: string, message: string, action?: ToastData['action']) => {
    addToast({ type: 'achievement', title, message, action, duration: 7000 });
  };

  const showMilestone = (title: string, message: string, action?: ToastData['action']) => {
    addToast({ type: 'milestone', title, message, action, duration: 8000 });
  };

  const showWarning = (title: string, message: string, action?: ToastData['action']) => {
    addToast({ type: 'warning', title, message, action });
  };

  const showInfo = (title: string, message: string, action?: ToastData['action']) => {
    addToast({ type: 'info', title, message, action });
  };

  return {
    toasts,
    dismissToast,
    showSuccess,
    showAchievement,
    showMilestone,
    showWarning,
    showInfo,
  };
};
