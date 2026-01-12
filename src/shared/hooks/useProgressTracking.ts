/**
 * useProgressTracking - Tradelia 2026
 * 
 * Hook unificato per tracciare i progressi dell'utente
 * - Guest mode: usa IndexedDB (locale, offline-first)
 * - Utente registrato: usa Supabase (sync con DB)
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  getProgress as _getProgress, 
  setProgress, 
  getJourneyProgress,
  type ProgressRecord as _ProgressRecord 
} from '@/src/shared/lib/indexedDB'

interface PillarProgress {
  pillarId: string
  completedSections: string[]
  percentage: number
  lastUpdated: string
}

interface UseProgressTrackingOptions {
  isGuest: boolean
  userId?: string | null | undefined
}

interface UseProgressTrackingReturn {
  // Stato
  isLoading: boolean
  error: string | null
  
  // Dati
  getPillarProgress: (journeyId: string, pillarId: string) => PillarProgress | null
  getJourneyTotalProgress: (journeyId: string) => number
  
  // Azioni
  markSectionComplete: (journeyId: string, pillarId: string, sectionId: string, totalSections: number) => Promise<void>
  markSectionIncomplete: (journeyId: string, pillarId: string, sectionId: string, totalSections: number) => Promise<void>
  resetPillarProgress: (journeyId: string, pillarId: string) => Promise<void>
  
  // Sync (per migrazione guest → registrato)
  syncLocalToRemote: (newUserId: string) => Promise<{ success: boolean; synced: number }>
  
  // Cache locale
  progressCache: Map<string, PillarProgress>
}

export function useProgressTracking(options?: UseProgressTrackingOptions): UseProgressTrackingReturn {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progressCache, setProgressCache] = useState<Map<string, PillarProgress>>(new Map())

  // Default to guest mode if no options provided
  const isGuest = options?.isGuest ?? true
  const userId = options?.userId

  // Carica progressi iniziali
  const loadInitialProgress = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (isGuest) {
        // Carica da IndexedDB per tutti i journey
        const journeys = ['emergency', 'passive', 'longterm', 'speculation']
        const newCache = new Map<string, PillarProgress>()

        for (const journeyId of journeys) {
          const records = await getJourneyProgress(journeyId)
          for (const record of records) {
            newCache.set(`${journeyId}:${record.id}`, {
              pillarId: record.id,
              completedSections: record.completedItems,
              percentage: record.percentage,
              lastUpdated: record.lastUpdated
            })
          }
        }

        setProgressCache(newCache)
      } else if (userId) {
        // Carica da Supabase
        const { data, error: dbError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)

        if (dbError) {
          // Tabella potrebbe non esistere ancora
          console.warn('Progress table not found, using empty state')
        } else if (data) {
          const newCache = new Map<string, PillarProgress>()
          for (const record of data) {
            newCache.set(`${record.journey_id}:${record.pillar_id}`, {
              pillarId: record.pillar_id,
              completedSections: record.completed_sections || [],
              percentage: record.percentage || 0,
              lastUpdated: record.updated_at
            })
          }
          setProgressCache(newCache)
        }
      }
    } catch (err) {
      console.error('Error loading progress:', err)
      setError('Errore nel caricamento dei progressi')
    } finally {
      setIsLoading(false)
    }
  }, [isGuest, userId])

  useEffect(() => {
    loadInitialProgress()
  }, [loadInitialProgress])

  const getPillarProgress = useCallback((journeyId: string, pillarId: string): PillarProgress | null => {
    return progressCache.get(`${journeyId}:${pillarId}`) || null
  }, [progressCache])

  const getJourneyTotalProgress = useCallback((journeyId: string): number => {
    const journeyEntries = Array.from(progressCache.entries())
      .filter(([key]) => key.startsWith(`${journeyId}:`))
    
    if (journeyEntries.length === 0) return 0
    
    const totalPercentage = journeyEntries.reduce((sum, [, progress]) => sum + progress.percentage, 0)
    return Math.round(totalPercentage / journeyEntries.length)
  }, [progressCache])

  const saveProgress = useCallback(async (
    journeyId: string, 
    pillarId: string, 
    completedSections: string[], 
    totalSections: number
  ) => {
    const percentage = totalSections > 0 
      ? Math.round((completedSections.length / totalSections) * 100) 
      : 0
    const now = new Date().toISOString()

    const progress: PillarProgress = {
      pillarId,
      completedSections,
      percentage,
      lastUpdated: now
    }

    // Aggiorna cache locale
    setProgressCache(prev => {
      const newCache = new Map(prev)
      newCache.set(`${journeyId}:${pillarId}`, progress)
      return newCache
    })

    // Salva su storage
    if (isGuest) {
      await setProgress({
        id: pillarId,
        journeyId,
        completedItems: completedSections,
        percentage,
        lastUpdated: now
      })
    } else if (userId) {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          journey_id: journeyId,
          pillar_id: pillarId,
          completed_sections: completedSections,
          percentage,
          updated_at: now
        }, {
          onConflict: 'user_id,journey_id,pillar_id'
        })
    }
  }, [isGuest, userId])

  const markSectionComplete = useCallback(async (
    journeyId: string, 
    pillarId: string, 
    sectionId: string,
    totalSections: number
  ) => {
    const current = getPillarProgress(journeyId, pillarId)
    const completedSections = current?.completedSections || []
    
    if (!completedSections.includes(sectionId)) {
      await saveProgress(journeyId, pillarId, [...completedSections, sectionId], totalSections)
    }
  }, [getPillarProgress, saveProgress])

  const markSectionIncomplete = useCallback(async (
    journeyId: string, 
    pillarId: string, 
    sectionId: string,
    totalSections: number
  ) => {
    const current = getPillarProgress(journeyId, pillarId)
    const completedSections = (current?.completedSections || []).filter(id => id !== sectionId)
    
    await saveProgress(journeyId, pillarId, completedSections, totalSections)
  }, [getPillarProgress, saveProgress])

  const resetPillarProgress = useCallback(async (journeyId: string, pillarId: string) => {
    await saveProgress(journeyId, pillarId, [], 0)
  }, [saveProgress])

  /**
   * Sincronizza progressi locali (IndexedDB) con Supabase
   * Da chiamare dopo la registrazione/login di un utente guest
   */
  const syncLocalToRemote = useCallback(async (newUserId: string): Promise<{ success: boolean; synced: number }> => {
    try {
      const journeys = ['emergency', 'passive', 'longterm', 'speculation']
      let syncedCount = 0

      for (const journeyId of journeys) {
        const localRecords = await getJourneyProgress(journeyId)
        
        for (const record of localRecords) {
          if (record.completedItems.length > 0) {
            // Upsert su Supabase (merge con eventuali dati esistenti)
            const { error: upsertError } = await supabase
              .from('user_progress')
              .upsert({
                user_id: newUserId,
                journey_id: journeyId,
                pillar_id: record.id,
                completed_sections: record.completedItems,
                percentage: record.percentage,
                updated_at: record.lastUpdated
              }, {
                onConflict: 'user_id,journey_id,pillar_id'
              })

            if (!upsertError) {
              syncedCount++
            }
          }
        }
      }

      return { success: true, synced: syncedCount }
    } catch (err) {
      console.error('Error syncing progress:', err)
      return { success: false, synced: 0 }
    }
  }, [])

  return useMemo(() => ({
    isLoading,
    error,
    getPillarProgress,
    getJourneyTotalProgress,
    markSectionComplete,
    markSectionIncomplete,
    resetPillarProgress,
    syncLocalToRemote,
    progressCache
  }), [isLoading, error, getPillarProgress, getJourneyTotalProgress, markSectionComplete, markSectionIncomplete, resetPillarProgress, syncLocalToRemote, progressCache])
}
