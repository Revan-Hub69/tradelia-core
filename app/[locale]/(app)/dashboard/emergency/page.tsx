/**
 * Emergency Journey Page - Route-Level Code Splitting
 * 
 * Implementa lazy loading per ottimizzare le performance
 */

'use client'

import dynamic from 'next/dynamic'
import { SkeletonJourneyPage } from '@/src/shared/ui/SkeletonLayouts'

// Dynamic import with proper loading state
const EmergencyJourneyPage = dynamic(
  () => import('@/src/widgets/journey-page/JourneyPage').then(mod => ({
    default: (props: any) => <mod.default journeyId="emergency" {...props} />
  })),
  {
    loading: () => <SkeletonJourneyPage />,
    ssr: false // Client-side rendering for better performance
  }
)

export default function EmergencyPage() {
  return <EmergencyJourneyPage />
}