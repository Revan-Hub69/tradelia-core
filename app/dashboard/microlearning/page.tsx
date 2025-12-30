'use client'

import { useState, useEffect } from 'react'
import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { microlearningService } from '@/lib/services/microlearning'
import { useAuth } from '@/components/providers/AppProviders'
import type { MicrolearningData } from '@/lib/types/microlearning'

// Components
import { MicrolearningHeader } from '@/components/microlearning/MicrolearningHeader'
import { MicrolearningStats } from '@/components/microlearning/MicrolearningStats'
import { CategorySection } from '@/components/microlearning/CategorySection'
import { MicrolearningFooter } from '@/components/microlearning/MicrolearningFooter'

export default function MicrolearningPage() {
  const [data, setData] = useState<MicrolearningData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    loadMicrolearningData()
  }, [user])

  const loadMicrolearningData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const microlearningData = await microlearningService.getMicrolearningData(user?.id)
      setData(microlearningData)
    } catch (err) {
      console.error('Error loading microlearning data:', err)
      setError('Errore nel caricamento delle lezioni. Riprova più tardi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <SectionLayout className="py-20">
            <div className="mx-auto max-w-6xl">
              <Skeleton className="h-32 mb-8" />
              <Skeleton className="h-24 mb-8" />
              <div className="grid gap-6">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            </div>
          </SectionLayout>
        </div>
      </ErrorBoundary>
    )
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <SectionLayout className="py-20">
            <div className="mx-auto max-w-4xl text-center">
              <div className="p-8 border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20 rounded-lg">
                <h2 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
                  Errore di Caricamento
                </h2>
                <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                <button 
                  onClick={loadMicrolearningData}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Riprova
                </button>
              </div>
            </div>
          </SectionLayout>
        </div>
      </ErrorBoundary>
    )
  }

  if (!data) {
    return null
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <SectionLayout className="py-12 sm:py-20">
          <div className="mx-auto max-w-6xl space-y-12">
            
            {/* Header */}
            <MicrolearningHeader 
              totalLessons={data.total_lessons}
              completedLessons={data.completed_lessons}
              progressPercentage={data.overall_progress_percentage}
            />
            
            {/* Stats Overview */}
            <MicrolearningStats 
              data={data}
              userId={user?.id}
            />
            
            {/* Categories */}
            <div className="space-y-8">
              {data.categories.map((category) => (
                <CategorySection 
                  key={category.id}
                  category={category}
                  onLessonUpdate={loadMicrolearningData}
                />
              ))}
            </div>
            
            {/* Footer */}
            <MicrolearningFooter />
            
          </div>
        </SectionLayout>
      </div>
    </ErrorBoundary>
  )
}