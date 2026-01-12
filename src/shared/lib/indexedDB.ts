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
