/**
 * Speculation Journey - Tradelia 2026
 * Speculazione: trading attivo, opportunità
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

export default function SpeculationPage() {
  return <JourneyPageComponent journeyId="speculation" />
}
