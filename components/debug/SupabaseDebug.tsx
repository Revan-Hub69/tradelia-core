'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/browser-client'

export function SupabaseDebug() {
  const [status, setStatus] = useState<{
    clientExists: boolean
    url?: string
    anonKey?: string
    error?: string
  }>({
    clientExists: false
  })

  useEffect(() => {
    const checkClient = async () => {
      const clientExists = !!supabase
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setStatus({
        clientExists,
        url,
        anonKey: anonKey ? `${anonKey.substring(0, 20)}...` : undefined
      })

      if (clientExists && supabase) {
        try {
          // Try a simple query
          const { data, error } = await supabase
            .from('cookie_preferences')
            .select('count()', { count: 'exact', head: true })

          if (error) {
            setStatus(prev => ({
              ...prev,
              error: `Query error: ${error.message}`
            }))
          } else {
            console.log('✅ Supabase client working')
          }
        } catch (err) {
          setStatus(prev => ({
            ...prev,
            error: `Connection error: ${err instanceof Error ? err.message : 'Unknown'}`
          }))
        }
      }
    }

    checkClient()
  }, [])

  if (!status.clientExists) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
        ❌ Supabase client not initialized
      </div>
    )
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
      <div>✅ Supabase client initialized</div>
      <div>URL: {status.url}</div>
      <div>Key: {status.anonKey}</div>
      {status.error && <div className="text-red-600 mt-2">Error: {status.error}</div>}
    </div>
  )
}
