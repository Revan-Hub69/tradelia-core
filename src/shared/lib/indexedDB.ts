/**
 * IndexedDB Wrapper - Tradelia 2026
 * 
 * Storage locale per guest mode (offline-first)
 * Usato per salvare progressi quando l'utente non è registrato
 */

const DB_NAME = 'tradelia-progress'
const DB_VERSION = 1
const STORE_NAME = 'progress'

interface ProgressRecord {
  id: string // pillarId o sectionId
  journeyId: string
  completedItems: string[] // IDs degli item completati
  percentage: number
  lastUpdated: string
}

let dbInstance: IDBDatabase | null = null

/**
 * Gets or creates the IndexedDB database instance
 * 
 * @returns Promise resolving to the IDBDatabase instance
 * @internal
 */
async function getDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    
    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('journeyId', 'journeyId', { unique: false })
      }
    }
  })
}

/**
 * Retrieves a progress record by ID from IndexedDB
 * 
 * @param id - The unique identifier of the progress record (pillarId or sectionId)
 * @returns Promise resolving to the progress record or null if not found
 * 
 * @example
 * const progress = await getProgress('emergency-pillar-1')
 * if (progress) {
 *   console.log('Completed items:', progress.completedItems)
 * }
 */
export async function getProgress(id: string): Promise<ProgressRecord | null> {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  } catch {
    console.warn('IndexedDB not available, using memory fallback')
    return null
  }
}

/**
 * Saves or updates a progress record in IndexedDB
 * 
 * @param record - The progress record to save
 * @returns Promise that resolves when the record is saved
 * 
 * @example
 * await setProgress({
 *   id: 'emergency-pillar-1',
 *   journeyId: 'emergency',
 *   completedItems: ['item-1', 'item-2'],
 *   percentage: 50,
 *   lastUpdated: new Date().toISOString()
 * })
 */
export async function setProgress(record: ProgressRecord): Promise<void> {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(record)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch {
    console.warn('IndexedDB not available')
  }
}

/**
 * Retrieves all progress records for a specific journey
 * 
 * @param journeyId - The journey identifier to filter by
 * @returns Promise resolving to an array of progress records
 * 
 * @example
 * const journeyProgress = await getJourneyProgress('emergency')
 * const totalPercentage = journeyProgress.reduce((sum, p) => sum + p.percentage, 0) / journeyProgress.length
 */
export async function getJourneyProgress(journeyId: string): Promise<ProgressRecord[]> {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const index = store.index('journeyId')
      const request = index.getAll(journeyId)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  } catch {
    console.warn('IndexedDB not available')
    return []
  }
}

/**
 * Clears all progress records from IndexedDB
 * 
 * @returns Promise that resolves when all records are cleared
 * 
 * @example
 * // Reset all user progress
 * await clearAllProgress()
 */
export async function clearAllProgress(): Promise<void> {
  try {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch {
    console.warn('IndexedDB not available')
  }
}

export type { ProgressRecord }
