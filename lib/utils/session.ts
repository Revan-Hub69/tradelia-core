/**
 * Storage management utilities for dashboard
 * Uses IndexedDB for better performance and larger storage capacity
 * Handles user session tracking without complex authentication
 */

// IndexedDB wrapper for better local storage
class TradeliaDB {
  private dbName = 'tradelia-storage'
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    if (typeof window === 'undefined') return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Store for user sessions and progress
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' })
          sessionStore.createIndex('created_at', 'created_at')
        }
        
        // Store for user preferences
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' })
        }
        
        // Store for temporary data (start flow, progress, etc.)
        if (!db.objectStoreNames.contains('temp_data')) {
          const tempStore = db.createObjectStore('temp_data', { keyPath: 'key' })
          tempStore.createIndex('expires_at', 'expires_at')
        }
      }
    })
  }

  async set(store: string, key: string, value: any, expiresInDays = 30): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) throw new Error('IndexedDB not available')

    const transaction = this.db.transaction([store], 'readwrite')
    const objectStore = transaction.objectStore(store)
    
    const data = {
      key,
      value,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    }
    
    await objectStore.put(data)
  }

  async get(store: string, key: string): Promise<any> {
    if (!this.db) await this.init()
    if (!this.db) return null

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly')
      const objectStore = transaction.objectStore(store)
      const request = objectStore.get(key)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const result = request.result
        if (!result) {
          resolve(null)
          return
        }
        
        // Check if expired
        if (new Date(result.expires_at) < new Date()) {
          this.delete(store, key) // Clean up expired data
          resolve(null)
          return
        }
        
        resolve(result.value)
      }
    })
  }

  async delete(store: string, key: string): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) return

    const transaction = this.db.transaction([store], 'readwrite')
    const objectStore = transaction.objectStore(store)
    await objectStore.delete(key)
  }

  async clear(store: string): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) return

    const transaction = this.db.transaction([store], 'readwrite')
    const objectStore = transaction.objectStore(store)
    await objectStore.clear()
  }

  async cleanup(): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) return

    // Clean up expired data from temp_data store
    const transaction = this.db.transaction(['temp_data'], 'readwrite')
    const objectStore = transaction.objectStore('temp_data')
    const index = objectStore.index('expires_at')
    const range = IDBKeyRange.upperBound(new Date().toISOString())
    
    const request = index.openCursor(range)
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result
      if (cursor) {
        cursor.delete()
        cursor.continue()
      }
    }
  }
}

// Singleton instance
const tradeliaDB = new TradeliaDB()

// Generate a simple session ID based on browser fingerprint and timestamp
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 15)
  const userAgent = typeof window !== 'undefined' 
    ? window.navigator.userAgent.slice(-10).replace(/[^a-zA-Z0-9]/g, '') 
    : 'server'
  
  return `${timestamp}-${random}-${userAgent}`.toLowerCase()
}

// Get or create session ID from IndexedDB
export async function getSessionId(): Promise<string> {
  if (typeof window === 'undefined') {
    return generateSessionId()
  }

  try {
    let sessionId = await tradeliaDB.get('sessions', 'current_session')
    
    if (!sessionId) {
      sessionId = generateSessionId()
      await tradeliaDB.set('sessions', 'current_session', sessionId, 30)
    }
    
    return sessionId
  } catch (error) {
    console.warn('IndexedDB not available, using temporary session:', error)
    return generateSessionId()
  }
}

// Save user progress data
export async function saveProgressData(key: string, data: any): Promise<void> {
  try {
    await tradeliaDB.set('temp_data', key, data, 30)
  } catch (error) {
    console.warn('Failed to save progress data:', error)
  }
}

// Get user progress data
export async function getProgressData(key: string): Promise<any> {
  try {
    return await tradeliaDB.get('temp_data', key)
  } catch (error) {
    console.warn('Failed to get progress data:', error)
    return null
  }
}

// Save user preferences
export async function savePreferences(preferences: any): Promise<void> {
  try {
    await tradeliaDB.set('preferences', 'user_preferences', preferences, 365)
  } catch (error) {
    console.warn('Failed to save preferences:', error)
  }
}

// Get user preferences
export async function getPreferences(): Promise<any> {
  try {
    return await tradeliaDB.get('preferences', 'user_preferences')
  } catch (error) {
    console.warn('Failed to get preferences:', error)
    return null
  }
}

// Clear all temporary data (for account migration)
export async function clearTemporaryData(): Promise<void> {
  try {
    await tradeliaDB.clear('temp_data')
    await tradeliaDB.clear('sessions')
  } catch (error) {
    console.warn('Failed to clear temporary data:', error)
  }
}

// Export all user data (for migration or download)
export async function exportUserData(): Promise<any> {
  try {
    const sessionId = await getSessionId()
    const preferences = await getPreferences()
    
    // Get all temp data
    // Note: This is a simplified version - in production you'd iterate through all keys
    const startFlowData = await getProgressData('start_flow_responses')
    const progressData = await getProgressData('user_progress')
    
    return {
      sessionId,
      preferences,
      startFlowData,
      progressData,
      exportedAt: new Date().toISOString()
    }
  } catch (error) {
    console.warn('Failed to export user data:', error)
    return null
  }
}

// Import user data (for migration)
export async function importUserData(data: any): Promise<boolean> {
  try {
    if (data.preferences) {
      await savePreferences(data.preferences)
    }
    
    if (data.startFlowData) {
      await saveProgressData('start_flow_responses', data.startFlowData)
    }
    
    if (data.progressData) {
      await saveProgressData('user_progress', data.progressData)
    }
    
    return true
  } catch (error) {
    console.warn('Failed to import user data:', error)
    return false
  }
}

// Check if session is valid (not older than 30 days)
export function isSessionValid(sessionId: string): boolean {
  try {
    const timestamp = sessionId.split('-')[0]
    const sessionTime = parseInt(timestamp, 36)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    
    return sessionTime > thirtyDaysAgo
  } catch {
    return false
  }
}

// Initialize cleanup service (call on app start)
export async function initStorageCleanup(): Promise<void> {
  try {
    await tradeliaDB.cleanup()
    
    // Set up periodic cleanup (every 24 hours)
    if (typeof window !== 'undefined') {
      setInterval(() => {
        tradeliaDB.cleanup()
      }, 24 * 60 * 60 * 1000)
    }
  } catch (error) {
    console.warn('Failed to initialize storage cleanup:', error)
  }
}

// Fallback for browsers without IndexedDB support
export function hasIndexedDBSupport(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window
}