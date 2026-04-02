/*
 * RADAR - Dashboard
 * Clean dashboard with header, navbar, sidebar only
 */

'use client';

import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';

export default function DashboardPage() {
  return (
    <PageTransitionWrapper>
      <div className="mx-auto max-w-screen-xl pb-20">
        {/* Dashboard content will go here */}
      </div>
    </PageTransitionWrapper>
  );
}
