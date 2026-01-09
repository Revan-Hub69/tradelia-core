/**
 * Long Term Journey - Tradelia 2026
 * Investimenti lungo termine: crescita stabile, DCA
 */

import dynamic from 'next/dynamic'
import { SkeletonJourneyPage } from '@/src/shared/ui/SkeletonLayouts'

const JourneyPageComponent = dynamic(
  () => import('@/src/widgets/journey-page/JourneyPage').then(mod => mod.JourneyPage),
  {
    loading: () => <SkeletonJourneyPage />,
    ssr: true
  }
)

export default function LongtermPage() {
  return <JourneyPageComponent journeyId="longterm" />
}
