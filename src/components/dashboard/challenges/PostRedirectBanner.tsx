'use client';

/**
 * POST REDIRECT BANNER - Challenge Enrollment Flow 2026
 *
 * Shows confirmation prompt when user returns from external site
 * Follows Tradelia Design System
 */

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircleIcon, CheckCircleIcon, XCircleIcon } from './PremiumIcons';

interface PendingEnrollment {
  id: string;
  programName: string;
}

interface PostRedirectBannerProps {
  pendingEnrollments: PendingEnrollment[];
  onConfirm: (enrollmentId: string) => void;
  onDismiss: (enrollmentId: string) => void;
}

export function PostRedirectBanner({
  pendingEnrollments,
  onConfirm,
  onDismiss,
}: PostRedirectBannerProps) {
  const t = useTranslations('Challenges') as any;
  const [isVisible, setIsVisible] = useState(false);
  const [currentEnrollment, setCurrentEnrollment] = useState<PendingEnrollment | null>(null);

  useEffect(() => {
    // Show banner after 2 seconds from page load
    const timer = setTimeout(() => {
      if (pendingEnrollments.length > 0) {
        setCurrentEnrollment(pendingEnrollments[0] ?? null);
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [pendingEnrollments]);

  // Update current enrollment when list changes
  useEffect(() => {
    if (pendingEnrollments.length > 0) {
      // If current enrollment is no longer in list, show next one
      if (!currentEnrollment || !pendingEnrollments.find(e => e.id === currentEnrollment.id)) {
        setCurrentEnrollment(pendingEnrollments[0] ?? null);
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
      setCurrentEnrollment(null);
    }
  }, [pendingEnrollments, currentEnrollment]);

  if (!currentEnrollment) return null;

  const handleConfirm = () => {
    onConfirm(currentEnrollment.id);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    onDismiss(currentEnrollment.id);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed left-0 right-0 top-0 z-50 border-b border-orange-500/20 bg-orange-500/10 backdrop-blur-xl"
          role="alert"
          aria-live="polite"
        >
          <div className="container mx-auto flex items-center gap-4 px-4 py-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
              <HelpCircleIcon size={20} className="text-orange-600" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-orange-900 dark:text-orange-100">
                {t('enrollment.bannerTitle', { programName: currentEnrollment.programName })}
              </p>
              <p className="text-sm text-orange-800/80 dark:text-orange-200/80">
                {t('enrollment.bannerDescription')}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                onClick={handleConfirm}
                className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-green-600"
                type="button"
              >
                <CheckCircleIcon size={14} />
                {t('enrollment.yesStarted')}
              </button>
              <button
                onClick={handleDismiss}
                className="flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-white/50 px-3 py-1.5 text-sm font-semibold text-orange-800 transition-all hover:bg-white/80 dark:bg-black/50 dark:text-orange-200"
                type="button"
              >
                <XCircleIcon size={14} />
                {t('enrollment.notYet')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
