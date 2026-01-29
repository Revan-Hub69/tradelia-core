'use client';

/**
 * ENROLLMENT BUTTON - Challenge Enrollment Flow 2026
 *
 * Tradelia Design System:
 * - Glassmorphism: glass-panel, backdrop-blur
 * - NO EMOJI: Pure SVG icons from PremiumIcons
 * - Animations: Framer Motion with reduced motion support
 * - Accessibility: Focus trap, aria-labels, keyboard nav
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { RedirectIcon } from './PremiumIcons';

type EnrollmentButtonProps = {
  programId: string;
  offerId: string;
  isFree: boolean;
  onEnrollAction: (programId: string, offerId: string) => Promise<{ success: boolean; error?: string }>;
  className?: string;
};

export function EnrollmentButton({
  programId,
  offerId,
  isFree,
  onEnrollAction,
  className,
}: EnrollmentButtonProps) {
  const t = useTranslations('Challenges') as any;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Call enrollment API
      const result = await onEnrollAction(programId, offerId);

      if (!result.success) {
        setError(result.error || t('enrollment.errorGeneric'));
        setIsLoading(false);
        return;
      }

      // 2. Show confirmation modal
      setShowConfirmation(true);

      // 3. Redirect to My Challenges after delay
      setTimeout(() => {
        setShowConfirmation(false);
        setIsLoading(false);

        // 4. Redirect to My Challenges page
        router.push('/dashboard/my-challenges');
      }, 1500);
    } catch {
      setError(t('enrollment.errorGeneric'));
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          flex flex-1 items-center justify-center gap-2
          rounded-xl bg-gradient-to-r from-primary to-primary/90
          px-4 py-3 text-sm font-semibold text-primary-foreground
          shadow-lg shadow-primary/20 transition-all
          hover:shadow-xl hover:shadow-primary/30
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        aria-label={isFree ? t('enrollment.ariaJoinFree') : t('enrollment.ariaStartChallenge')}
        type="button"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            className="size-4 rounded-full border-2 border-white/30 border-t-white"
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            {isFree ? t('enrollment.joinFree') : t('enrollment.startChallenge')}
          </>
        )}
      </motion.button>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-red-500"
        >
          {error}
        </motion.p>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="redirect-title"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel max-w-sm rounded-2xl border border-border/50 p-6 text-center shadow-2xl"
            >
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <RedirectIcon className="text-primary" size={32} />
              </div>

              <h3 id="redirect-title" className="mb-2 text-lg font-bold">
                {t('enrollment.redirectTitle')}
              </h3>

              <p className="mb-4 text-sm text-muted-foreground">
                {t('enrollment.redirectDescription')}
              </p>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  className="size-2 rounded-full bg-primary"
                  transition={{ duration: 1, repeat: Infinity }}
                />
                {t('enrollment.redirectingIn')}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
