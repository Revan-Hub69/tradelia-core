/**
 * Long Term Journey Page - Route-Level Code Splitting
 */

'use client'

import dynamic from 'next/dynamic'
import { SkeletonJourneyPage } from '@/src/shared/ui/SkeletonLayouts'

const LongTermJourneyPage = dynamic(
  () => import('@/src/widgets/journey-page/JourneyPage').then(mod => ({
    default: (props: any) => <mod.default journeyId="longterm" {...props} />
  })),
  {
    loading: () => <SkeletonJourneyPage />,
    ssr: false
  }
)

export default function LongTermPage() {
  return <LongTermJourneyPage />
}