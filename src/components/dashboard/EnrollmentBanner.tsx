'use client';

/**
 * ENROLLMENT BANNER - Challenge Enrollment Flow 2026
 *
 * Client component that fetches and displays pending enrollments
 * Uses PostRedirectBanner for the UI
 */

import { useEffect, useState } from 'react';

import { PostRedirectBanner } from '@/components/dashboard/challenges/PostRedirectBanner';

type PendingEnrollment = {
  id: string;
  programName: string;
};

export function EnrollmentBanner() {
  const [pendingEnrollments, setPendingEnrollments] = useState<PendingEnrollment[]>([]);

  // Fetch pending enrollments on mount
  useEffect(() => {
    const fetchPendingEnrollments = async () => {
      try {
        const response = await fetch('/api/enrollments/pending');
        const data = await response.json();

        if (data.success && data.data) {
          setPendingEnrollments(data.data.map((e: any) => ({
            id: e.id,
            programName: e.program?.name || 'Challenge',
          })));
        }
      } catch (err) {
        console.error('Error fetching pending enrollments:', err);
      }
    };

    fetchPendingEnrollments();

    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingEnrollments, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = async (enrollmentId: string) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });

      if (response.ok) {
        // Remove from pending list
        setPendingEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      }
    } catch (err) {
      console.error('Error confirming enrollment:', err);
    }
  };

  const handleDismiss = async (enrollmentId: string) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'abandoned' }),
      });

      if (response.ok) {
        // Remove from pending list
        setPendingEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      }
    } catch (err) {
      console.error('Error dismissing enrollment:', err);
    }
  };

  return (
    <PostRedirectBanner
      pendingEnrollments={pendingEnrollments}
      onConfirm={handleConfirm}
      onDismiss={handleDismiss}
    />
  );
}
