/**
 * Emergency Journey - Tradelia 2026
 * Asset di emergenza: liquidità immediata, protezione
 */

import dynamic from 'next/dynamic'
import { SkeletonJourneyPage } from '@/src/shared/ui/SkeletonLayouts'

const JourneyPageComponent = dynamic(
  () => import('@/src/widgets/journey-page/JourneyPage').then(mod => mod.JourneyPage),
  {
    loading: () => <SkeletonJourneyPage />,
    ssr: true // Keep SSR for SEO
  }
)

export default function EmergencyPage() {
  return <JourneyPageComponent journeyId="emergency" />
}
