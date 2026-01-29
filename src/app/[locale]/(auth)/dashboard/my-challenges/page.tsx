'use client';

/**
 * MY CHALLENGES PAGE - Challenge Enrollment Flow 2026
 *
 * Displays user's enrolled challenges with status management
 * Follows Tradelia Design System
 */

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { EmptyState } from '@/components/dashboard/challenges/EmptyState';
import { type EnrollmentStatus, EnrollmentStatusCard } from '@/components/dashboard/challenges/EnrollmentStatusCard';
import { MyChallengeDrawer } from '@/components/dashboard/challenges/MyChallengeDrawer';
import { TrendingUpIcon } from '@/components/dashboard/challenges/PremiumIcons';
import { logger } from '@/lib/logger';

type Enrollment = {
  id: string;
  status: EnrollmentStatus;
  program: {
    id: string;
    name: string;
    organizerName?: string;
    officialUrl?: string;
  };
  offer: {
    id: string;
    name?: string;
    accountSize?: number | string | null;
    accountCurrency?: string | null;
    durationDays?: number;
  };
  createdAt?: string;
};

export default function MyChallengesPage() {
  const t = useTranslations('MyChallenges') as any;
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);

  // Fetch user enrollments
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/enrollments');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch enrollments');
        }

        if (data.success) {
          setEnrollments(data.data || []);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        logger.error('Error fetching enrollments:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Handle enrollment confirmation (Start challenge)
  const handleConfirm = async (enrollmentId: string) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm enrollment');
      }

      // Refresh enrollments
      const updatedResponse = await fetch('/api/enrollments');
      const data = await updatedResponse.json();
      if (data.success) {
        const nextEnrollments = data.data || [];
        setEnrollments(nextEnrollments);
        setSelectedEnrollment(prev => (prev
          ? nextEnrollments.find((entry: Enrollment) => entry.id === prev.id) || null
          : prev));
      }
    } catch (err) {
      logger.error('Error confirming enrollment:', err);
    }
  };

  // Handle enrollment removal
  const handleRemove = async (enrollmentId: string) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove enrollment');
      }

      // Remove from local state
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      setSelectedEnrollment(prev => (prev?.id === enrollmentId ? null : prev));
    } catch (err) {
      logger.error('Error removing enrollment:', err);
    }
  };

  // Handle opening challenge drawer
  const handleOpenDrawer = (enrollment: Enrollment) => {
    logger.debug('Open drawer for:', enrollment);
    setSelectedEnrollment(enrollment);
  };

  // Group enrollments by status
  const activeEnrollments = enrollments.filter(e =>
    ['active', 'pending_redirect', 'pending_confirmation'].includes(e.status),
  );

  const completedEnrollments = enrollments.filter(e =>
    ['completed', 'failed', 'abandoned'].includes(e.status),
  );

  // Format account size
  const formatAccountSize = (size: number | string | undefined | null, currency: string | undefined | null) => {
    const numericSize = typeof size === 'number' ? size : Number(size);
    if (!Number.isFinite(numericSize)) {
      return 'N/A';
    }
    const safeCurrency = currency || 'USD';
    return `${numericSize.toLocaleString()} ${safeCurrency}`;
  };

  // Format duration
  const formatDuration = (days?: number) => {
    if (!days) {
 return undefined;
}
    return `${days} days`;
  };

  // Format start date
  const formatStartDate = (dateString?: string) => {
    if (!dateString) {
 return undefined;
}
    return new Date(dateString).toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-96 animate-pulse rounded-lg bg-muted" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-[200px] animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState type="error" onAction={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Active Challenges Section */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">{t('active_challenges_title')}</h2>

          {activeEnrollments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-muted-foreground/30 p-8 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                <TrendingUpIcon size={24} className="text-muted-foreground" />
              </div>
              <p className="mb-2 font-medium text-muted-foreground">
                {t('no_active_challenges')}
              </p>
              <a
                href="/dashboard/challenges"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                {t('browse_challenges')}
              </a>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeEnrollments.map((enrollment, index) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EnrollmentStatusCard
                    status={enrollment.status}
                    programName={enrollment.program.name}
                    offerName={enrollment.offer?.name || 'N/A'}
                    organizerName={enrollment.program.organizerName || 'N/A'}
                    accountSize={formatAccountSize(enrollment.offer?.accountSize, enrollment.offer?.accountCurrency)}
                    duration={formatDuration(enrollment.offer?.durationDays)}
                    startDate={formatStartDate(enrollment.createdAt)}
                    onOpenDrawer={() => handleOpenDrawer(enrollment)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Completed Challenges Section */}
        {completedEnrollments.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold">{t('completed_challenges_title')}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedEnrollments.map((enrollment, index) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EnrollmentStatusCard
                    status={enrollment.status}
                    programName={enrollment.program.name}
                    offerName={enrollment.offer?.name || 'N/A'}
                    organizerName={enrollment.program.organizerName || 'N/A'}
                    accountSize={formatAccountSize(enrollment.offer?.accountSize, enrollment.offer?.accountCurrency)}
                    duration={formatDuration(enrollment.offer?.durationDays)}
                    startDate={formatStartDate(enrollment.createdAt)}
                    onOpenDrawer={() => handleOpenDrawer(enrollment)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Stats Section */}
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Overview</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <div className="text-2xl font-bold text-primary">{activeEnrollments.length}</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Active</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{completedEnrollments.filter(e => e.status === 'completed').length}</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Completed</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{completedEnrollments.filter(e => e.status === 'failed').length}</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Failed</div>
            </div>
          </div>
        </section>
      </div>

      <MyChallengeDrawer
        enrollment={selectedEnrollment}
        isOpen={!!selectedEnrollment}
        onClose={() => setSelectedEnrollment(null)}
        onActivate={handleConfirm}
        onRemove={handleRemove}
      />
    </div>
  );
}
