'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/browser-client'

export function useSupabase() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      setError('Supabase client not initialized')
      return
    }

    // Test the connection
    const testConnection = async () => {
      try {
        const { data, error: err } = await supabase
          .from('cookie_preferences')
          .select('count()', { count: 'exact', head: true })

        if (err) {
          console.error('Supabase connection error:', err)
          setError(err.message)
        } else {
          console.log('✅ Supabase client is ready')
          setIsReady(true)
        }
      } catch (err) {
        console.error('Supabase test error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    testConnection()
  }, [])

  return {
    supabase,
    isReady,
    error
  }
}
