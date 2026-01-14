/**
 * User Preferences Hook
 * 
 * Features:
 * - Load preferences from IndexedDB on mount
 * - Auto-sync on login
 * - Real-time updates
 * - Type-safe
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { TechnicalLevel } from '@/src/shared/components/TechnicalLevelSelector'
import {
  getPreferencesFromStorage,
  savePreferencesToStorage,
  syncPreferencesToServer,
  mergePreferences,
  type UserPreferences
} from '@/src/shared/lib/storage/preferences-storage'

interface UseUserPreferencesReturn {
  country: string
  technicalLevel: TechnicalLevel
  language: string
  isLoading: boolean
  isSyncing: boolean
  updateCountry: (country: string) => Promise<void>
  updateTechnicalLevel: (level: TechnicalLevel) => Promise<void>
  updateLanguage: (language: string) => Promise<void>
  updatePreferences: (prefs: Partial<Pick<UserPreferences, 'country' | 'technicalLevel' | 'language'>>) => Promise<void>
}

export function useUserPreferences(userId?: string): UseUserPreferencesReturn {
  const [country, setCountry] = useState<string>('')
  const [technicalLevel, setTechnicalLevel] = useState<TechnicalLevel>('informato')
  const [language, setLanguage] = useState<string>('it')
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  
  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true)
        
        // If user is logged in, merge with server
        if (userId) {
          const merged = await mergePreferences(userId)
          if (merged) {
            setCountry(merged.country)
            setTechnicalLevel(merged.technicalLevel)
            setLanguage(merged.language)
          }
        } else {
          // Guest user: load from IndexedDB only
          const prefs = await getPreferencesFromStorage()
          if (prefs) {
            setCountry(prefs.country)
            setTechnicalLevel(prefs.technicalLevel)
            setLanguage(prefs.language)
          }
        }
      } catch (error) {
        console.error('Failed to load preferences:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPreferences()
  }, [userId])
  
  // Update country
  const updateCountry = useCallback(async (newCountry: string) => {
    try {
      setCountry(newCountry)
      
      // Save to IndexedDB
      await savePreferencesToStorage({
        country: newCountry,
        technicalLevel,
        language
      })
      
      // Sync to server if logged in
      if (userId) {
        setIsSyncing(true)
        await syncPreferencesToServer(userId, {
          country: newCountry,
          technicalLevel,
          language
        })
        setIsSyncing(false)
      }
    } catch (error) {
      console.error('Failed to update country:', error)
    }
  }, [userId, technicalLevel, language])
  
  // Update technical level
  const updateTechnicalLevel = useCallback(async (newLevel: TechnicalLevel) => {
    try {
      setTechnicalLevel(newLevel)
      
      // Save to IndexedDB
      await savePreferencesToStorage({
        country,
        technicalLevel: newLevel,
        language
      })
      
      // Sync to server if logged in
      if (userId) {
        setIsSyncing(true)
        await syncPreferencesToServer(userId, {
          country,
          technicalLevel: newLevel,
          language
        })
        setIsSyncing(false)
      }
    } catch (error) {
      console.error('Failed to update technical level:', error)
    }
  }, [userId, country, language])
  
  // Update language
  const updateLanguage = useCallback(async (newLanguage: string) => {
    try {
      setLanguage(newLanguage)
      
      // Save to IndexedDB
      await savePreferencesToStorage({
        country,
        technicalLevel,
        language: newLanguage
      })
      
      // Sync to server if logged in
      if (userId) {
        setIsSyncing(true)
        await syncPreferencesToServer(userId, {
          country,
          technicalLevel,
          language: newLanguage
        })
        setIsSyncing(false)
      }
    } catch (error) {
      console.error('Failed to update language:', error)
    }
  }, [userId, country, technicalLevel])
  
  // Update multiple preferences at once
  const updatePreferences = useCallback(async (
    prefs: Partial<Pick<UserPreferences, 'country' | 'technicalLevel' | 'language'>>
  ) => {
    try {
      const newPrefs = {
        country: prefs.country ?? country,
        technicalLevel: prefs.technicalLevel ?? technicalLevel,
        language: prefs.language ?? language
      }
      
      setCountry(newPrefs.country)
      setTechnicalLevel(newPrefs.technicalLevel)
      setLanguage(newPrefs.language)
      
      // Save to IndexedDB
      await savePreferencesToStorage(newPrefs)
      
      // Sync to server if logged in
      if (userId) {
        setIsSyncing(true)
        await syncPreferencesToServer(userId, newPrefs)
        setIsSyncing(false)
      }
    } catch (error) {
      console.error('Failed to update preferences:', error)
    }
  }, [userId, country, technicalLevel, language])
  
  return {
    country,
    technicalLevel,
    language,
    isLoading,
    isSyncing,
    updateCountry,
    updateTechnicalLevel,
    updateLanguage,
    updatePreferences
  }
}
