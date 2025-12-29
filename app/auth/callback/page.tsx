'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/loading-skeleton'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!supabase) {
          router.push('/dashboard?error=auth_service_unavailable')
          return
        }

        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/dashboard?error=auth_callback_failed')
          return
        }

        if (data.session) {
          // Successful authentication
          router.push('/dashboard?success=auth_complete')
        } else {
          // No session found
          router.push('/dashboard?error=no_session')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/dashboard?error=auth_callback_failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Completamento Accesso</h1>
          <p className="text-muted-foreground">
            Stiamo completando il tuo accesso a Tradelia...
          </p>
        </div>
      </div>
    </div>
  )
}