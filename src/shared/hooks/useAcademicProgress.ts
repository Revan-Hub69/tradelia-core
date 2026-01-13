/**
 * Academic Progress Hook - Tradelia 2026
 * 
 * Gestisce la persistenza del progresso per i moduli "Basi Accademiche".
 * - Guest: localStorage
 * - Logged: pronto per Supabase (da implementare)
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ModuleId } from '@/src/shared/config/academic-foundations'

const STORAGE_KEY = 'tradelia_academic_progress'

interface AcademicProgressState {
  completedModules: ModuleId[]
  lastUpdated: string
}

interface UseAcademicProgressOptions {
  isGuest: boolean
  userId?: string
}

interface UseAcademicProgressReturn {
  completedModules: ModuleId[]
  isLoading: boolean
  markModuleComplete: (moduleId: ModuleId) => Promise<void>
  markModuleIncomplete: (moduleId: ModuleId) => Promise<void>
  resetProgress: () => Promise<void>
}

export function useAcademicProgress({
  isGuest,
  userId
}: UseAcademicProgressOptions): UseAcademicProgressReturn {
  const [completedModules, setCompletedModules] = useState<ModuleId[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true)
      
      try {
        if (isGuest || !userId) {
          // Guest mode: load from localStorage
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            const parsed: AcademicProgressState = JSON.parse(stored)
            setCompletedModules(parsed.completedModules || [])
          }
        } else {
          // Logged mode: load from Supabase (TODO)
          // For now, fall back to localStorage
          const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
          if (stored) {
            const parsed: AcademicProgressState = JSON.parse(stored)
            setCompletedModules(parsed.completedModules || [])
          }
        }
      } catch (error) {
        console.error('Failed to load academic progress:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()
  }, [isGuest, userId])

  // Save progress helper
  const saveProgress = useCallback(async (modules: ModuleId[]) => {
    const state: AcademicProgressState = {
      completedModules: modules,
      lastUpdated: new Date().toISOString()
    }

    try {
      if (isGuest || !userId) {
        // Guest mode: save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } else {
        // Logged mode: save to Supabase (TODO)
        // For now, save to localStorage with userId prefix
        localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(state))
        
        // TODO: Sync to Supabase
        // await supabase.from('academic_progress').upsert({
        //   user_id: userId,
        //   completed_modules: modules,
        //   updated_at: state.lastUpdated
        // })
      }
    } catch (error) {
      console.error('Failed to save academic progress:', error)
    }
  }, [isGuest, userId])

  // Mark module as complete
  const markModuleComplete = useCallback(async (moduleId: ModuleId) => {
    setCompletedModules(prev => {
      if (prev.includes(moduleId)) return prev
      const updated = [...prev, moduleId]
      saveProgress(updated)
      return updated
    })
  }, [saveProgress])

  // Mark module as incomplete
  const markModuleIncomplete = useCallback(async (moduleId: ModuleId) => {
    setCompletedModules(prev => {
      const updated = prev.filter(id => id !== moduleId)
      saveProgress(updated)
      return updated
    })
  }, [saveProgress])

  // Reset all progress
  const resetProgress = useCallback(async () => {
    setCompletedModules([])
    
    try {
      if (isGuest || !userId) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.removeItem(`${STORAGE_KEY}_${userId}`)
        // TODO: Delete from Supabase
      }
    } catch (error) {
      console.error('Failed to reset academic progress:', error)
    }
  }, [isGuest, userId])

  return {
    completedModules,
    isLoading,
    markModuleComplete,
    markModuleIncomplete,
    resetProgress
  }
}
