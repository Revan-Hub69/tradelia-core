/**
 * Emergency Journey Page - New Emergency Dashboard
 * 
 * Implementa la nuova dashboard emergenza con hero alert e 4 pilastri
 */

'use client'

import dynamic from 'next/dynamic'
import { SkeletonJourneyPage } from '@/src/shared/ui/SkeletonLayouts'

// Dynamic import with proper loading state
const EmergencyDashboard = dynamic(
  () => import('@/src/widgets/emergency-dashboard/EmergencyDashboard').then(mod => ({
    default: mod.EmergencyDashboard
  })),
  {
    loading: () => <SkeletonJourneyPage />,
    ssr: false // Client-side rendering for better performance
  }
)

export default function EmergencyPage() {
  return <EmergencyDashboard />
}