/**
 * Preferences Storage - IndexedDB + Auth Sync
 * 
 * Features:
 * - IndexedDB for offline storage
 * - Auto-sync on login
 * - Conflict resolution (server wins)
 * - Type-safe operations
 */

import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { TechnicalLevel } from '@/src/shared/components/TechnicalLevelSelector'

// Database schema
interface TradeliaPreferencesDB extends DBSchema {
  'user-preferences': {
    key: 'current'
    value: UserPreferences
  }
}

export interface UserPreferences {
  country: string
  technicalLevel: TechnicalLevel
  language: string
  lastUpdated: number
  syncedToServer: boolean
}

let dbInstance: IDBPDatabase<TradeliaPreferencesDB> | null = null

// Initialize database
async function getDB(): Promise<IDBPDatabase<TradeliaPreferencesDB>> {
  if (dbInstance) return dbInstance
  
  dbInstance = await openDB<TradeliaPreferencesDB>('tradelia-preferences-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('user-preferences')) {
        db.createObjectStore('user-preferences')
      }
    }
  })
  
  return dbInstance
}

// Save preferences to IndexedDB
export async function savePreferencesToStorage(
  preferences: Omit<UserPreferences, 'lastUpdated' | 'syncedToServer'>
): Promise<void> {
  try {
    const db = await getDB()
    await db.put('user-preferences', {
      ...preferences,
      lastUpdated: Date.now(),
      syncedToServer: false
    }, 'current')
  } catch (error) {
    console.error('Failed to save preferences to IndexedDB:', error)
    throw error
  }
}

// Get preferences from IndexedDB
export async function getPreferencesFromStorage(): Promise<UserPreferences | null> {
  try {
    const db = await getDB()
    const prefs = await db.get('user-preferences', 'current')
    return prefs || null
  } catch (error) {
    console.error('Failed to get preferences from IndexedDB:', error)
    return null
  }
}

// Mark preferences as synced
export async function markPreferencesAsSynced(): Promise<void> {
  try {
    const db = await getDB()
    const prefs = await db.get('user-preferences', 'current')
    
    if (prefs) {
      await db.put('user-preferences', {
        ...prefs,
        syncedToServer: true
      }, 'current')
    }
  } catch (error) {
    console.error('Failed to mark preferences as synced:', error)
  }
}

// Clear preferences (on logout)
export async function clearPreferencesFromStorage(): Promise<void> {
  try {
    const db = await getDB()
    await db.delete('user-preferences', 'current')
  } catch (error) {
    console.error('Failed to clear preferences from IndexedDB:', error)
  }
}

// Sync preferences to server
export async function syncPreferencesToServer(
  userId: string,
  preferences: Omit<UserPreferences, 'lastUpdated' | 'syncedToServer'>
): Promise<boolean> {
  try {
    const response = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        ...preferences
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to sync preferences to server')
    }
    
    await markPreferencesAsSynced()
    return true
  } catch (error) {
    console.error('Failed to sync preferences to server:', error)
    return false
  }
}

// Fetch preferences from server
export async function fetchPreferencesFromServer(
  userId: string
): Promise<Omit<UserPreferences, 'lastUpdated' | 'syncedToServer'> | null> {
  try {
    const response = await fetch(`/api/user/preferences?userId=${userId}`)
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch preferences from server:', error)
    return null
  }
}

// Merge local and server preferences (server wins on conflict)
export async function mergePreferences(
  userId: string
): Promise<UserPreferences | null> {
  try {
    const [localPrefs, serverPrefs] = await Promise.all([
      getPreferencesFromStorage(),
      fetchPreferencesFromServer(userId)
    ])
    
    // If no local prefs, use server prefs
    if (!localPrefs && serverPrefs) {
      await savePreferencesToStorage(serverPrefs)
      await markPreferencesAsSynced()
      return {
        ...serverPrefs,
        lastUpdated: Date.now(),
        syncedToServer: true
      }
    }
    
    // If no server prefs, sync local to server
    if (localPrefs && !serverPrefs) {
      await syncPreferencesToServer(userId, {
        country: localPrefs.country,
        technicalLevel: localPrefs.technicalLevel,
        language: localPrefs.language
      })
      return localPrefs
    }
    
    // Both exist: server wins
    if (localPrefs && serverPrefs) {
      await savePreferencesToStorage(serverPrefs)
      await markPreferencesAsSynced()
      return {
        ...serverPrefs,
        lastUpdated: Date.now(),
        syncedToServer: true
      }
    }
    
    return null
  } catch (error) {
    console.error('Failed to merge preferences:', error)
    return null
  }
}

// Auto-detect country from IP (optional)
export async function detectCountryFromIP(): Promise<string | null> {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    return data.country_code || null
  } catch (error) {
    console.error('Failed to detect country from IP:', error)
    return null
  }
}
