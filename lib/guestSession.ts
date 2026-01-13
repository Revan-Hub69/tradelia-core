'use client'

import { supabase } from './supabase'
import type { UserSession, DashboardConfig } from './supabase'

// Re-export types for consumers
export type { UserSession, DashboardConfig }

// Generate a secure session token
export function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Encrypt data using Web Crypto API
export async function encryptData(data: unknown, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(JSON.stringify(data))
  
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  )
  
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  
  return btoa(String.fromCharCode(...combined))
}

// Decrypt data using Web Crypto API
export async function decryptData<T = unknown>(encryptedData: string, key: CryptoKey): Promise<T> {
  const combined = new Uint8Array(
    atob(encryptedData).split('').map(char => char.charCodeAt(0))
  )
  
  const iv = combined.slice(0, 12)
  const encrypted = combined.slice(12)
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  )
  
  const decoder = new TextDecoder()
  return JSON.parse(decoder.decode(decrypted)) as T
}

// Generate encryption key from session token
export async function generateEncryptionKey(sessionToken: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(sessionToken),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('tradelia-2026'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

// Profile data type
interface ProfileData {
  objective?: string | null;
  experience?: string | null;
  otherTools?: string | null;
  completedAt?: string;
}

// Dashboard config type
interface DashboardConfigData {
  objective_config?: Record<string, unknown>;
  risk_warnings?: Record<string, unknown>;
  recommended_tools?: Record<string, unknown>;
}

export class GuestSessionManager {
  private sessionToken: string | null = null
  private encryptionKey: CryptoKey | null = null

  constructor() {
    // Try to restore session from sessionStorage
    if (typeof window !== 'undefined') {
      this.sessionToken = sessionStorage.getItem('tradelia_session_token')
    }
  }

  async initializeSession(): Promise<string> {
    if (!this.sessionToken) {
      this.sessionToken = generateSessionToken()
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tradelia_session_token', this.sessionToken)
      }
    }

    this.encryptionKey = await generateEncryptionKey(this.sessionToken)
    return this.sessionToken
  }

  async saveProfile(profileData: ProfileData): Promise<void> {
    if (!this.sessionToken || !this.encryptionKey) {
      await this.initializeSession()
    }

    const encryptedData = await encryptData(profileData, this.encryptionKey!)
    
    // Save to Supabase
    const { error } = await supabase
      .from('user_sessions')
      .upsert({
        session_token: this.sessionToken!,
        encrypted_data: { profile: encryptedData },
        user_agent: navigator.userAgent,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        last_active: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving guest session:', error)
      throw error
    }
  }

  async loadProfile(): Promise<ProfileData | null> {
    if (!this.sessionToken) {
      return null
    }

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('encrypted_data')
        .eq('session_token', this.sessionToken)
        .single()

      if (error || !data?.encrypted_data?.profile) {
        return null
      }

      if (!this.encryptionKey) {
        this.encryptionKey = await generateEncryptionKey(this.sessionToken)
      }

      return await decryptData<ProfileData>(data.encrypted_data.profile, this.encryptionKey)
    } catch (error) {
      console.error('Error loading guest profile:', error)
      return null
    }
  }

  async saveDashboardConfig(config: DashboardConfigData): Promise<void> {
    if (!this.sessionToken) {
      await this.initializeSession()
    }

    const { error } = await supabase
      .from('dashboard_configs')
      .upsert({
        session_token: this.sessionToken!,
        objective_config: config.objective_config || {},
        risk_warnings: config.risk_warnings || {},
        recommended_tools: config.recommended_tools || {},
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving dashboard config:', error)
      throw error
    }
  }

  async loadDashboardConfig(): Promise<DashboardConfigData | null> {
    if (!this.sessionToken) {
      return null
    }

    try {
      const { data, error } = await supabase
        .from('dashboard_configs')
        .select('*')
        .eq('session_token', this.sessionToken)
        .single()

      if (error) {
        return null
      }

      return data as DashboardConfigData
    } catch (error) {
      console.error('Error loading dashboard config:', error)
      return null
    }
  }

  clearSession(): void {
    this.sessionToken = null
    this.encryptionKey = null
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('tradelia_session_token')
    }
  }
}