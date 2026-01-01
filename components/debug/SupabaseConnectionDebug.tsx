'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/browser-client'

export function SupabaseConnectionDebug() {
  const [status, setStatus] = useState<{
    clientExists: boolean
    url?: string
    anonKey?: string
    canConnect: boolean
    error?: string
    errorCode?: string
    tables?: string[]
  }>({
    clientExists: false,
    canConnect: false
  })

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if client exists
        const clientExists = !!supabase
        
        // Get env vars
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        setStatus(prev => ({
          ...prev,
          clientExists,
          url: url ? '✓ Set' : '✗ Missing',
          anonKey: anonKey ? '✓ Set' : '✗ Missing'
        }))

        if (!supabase) {
          setStatus(prev => ({
            ...prev,
            error: 'Supabase client is null'
          }))
          return
        }

        // Try to connect
        const { data, error } = await supabase
          .from('cookie_preferences')
          .select('count()', { count: 'exact', head: true })

        if (error) {
          setStatus(prev => ({
            ...prev,
            canConnect: false,
            errorCode: error.code,
            error: error.message
          }))
        } else {
          setStatus(prev => ({
            ...prev,
            canConnect: true
          }))
        }
      } catch (err) {
        setStatus(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Unknown error'
        }))
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50 font-mono max-h-96 overflow-y-auto">
      <div className="font-bold mb-2">Supabase Debug</div>
      <div>Client: {status.clientExists ? '✓' : '✗'}</div>
      <div>URL: {status.url}</div>
      <div>Key: {status.anonKey}</div>
      <div>Connected: {status.canConnect ? '✓' : '✗'}</div>
      {status.errorCode && (
        <div className="text-yellow-400 mt-2">Code: {status.errorCode}</div>
      )}
      {status.error && (
        <div className="text-red-400 mt-2 break-words whitespace-pre-wrap">{status.error}</div>
      )}
      {status.canConnect && (
        <div className="text-green-400 mt-2">✅ Ready to use</div>
      )}
    </div>
  )
}
