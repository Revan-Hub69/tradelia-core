/**
 * Long Term Journey Page - Route-Level Code Splitting
 */

'use client'

import dynamic from 'next/dynamic'
import { SkeletonJourneyPage } from '@/src/shared/ui/SkeletonLayouts'
import { type JourneyId } from '@/src/shared/config/journeys'

// Props type for JourneyPage
interface JourneyPageProps {
  journeyId?: JourneyId;
}

const LongTermJourneyPage = dynamic(
  () => import('@/src/widgets/journey-page/JourneyPage').then(mod => ({
    default: (props: JourneyPageProps) => <mod.JourneyPage journeyId="longterm" {...props} />
  })),
  {
    loading: () => <SkeletonJourneyPage />,
    ssr: false
  }
)

export default function LongTermPage() {
  return <LongTermJourneyPage />
}