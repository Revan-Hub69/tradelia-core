'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Completamento accesso...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase gestisce automaticamente il token dal hash fragment
        // quando viene chiamato getSession() o onAuthStateChange()
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('Errore di autenticazione')
          setTimeout(() => router.push('/?error=auth_failed'), 1500)
          return
        }

        if (session?.user) {
          setStatus('Accesso completato, reindirizzamento...')
          
          // Verifica/crea profilo utente
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', session.user.id)
            .single()

          if (!existingProfile) {
            await supabase.from('user_profiles').insert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
              avatar_url: session.user.user_metadata?.avatar_url,
              storage_preference: 'register',
              created_at: new Date().toISOString()
            })
          }

          router.push('/dashboard')
        } else {
          // Nessuna sessione, prova a recuperare dal hash
          setStatus('Verifica credenziali...')
          
          // Attendi che Supabase processi il token
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (event === 'SIGNED_IN' && newSession?.user) {
              subscription.unsubscribe()
              
              // Crea profilo se non esiste
              const { data: profile } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('id', newSession.user.id)
                .single()

              if (!profile) {
                await supabase.from('user_profiles').insert({
                  id: newSession.user.id,
                  email: newSession.user.email,
                  full_name: newSession.user.user_metadata?.full_name || newSession.user.user_metadata?.name,
                  avatar_url: newSession.user.user_metadata?.avatar_url,
                  storage_preference: 'register',
                  created_at: new Date().toISOString()
                })
              }

              router.push('/dashboard')
            }
          })

          // Timeout fallback
          setTimeout(() => {
            subscription.unsubscribe()
            router.push('/')
          }, 5000)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        router.push('/?error=unexpected')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">{status}</p>
      </div>
    </div>
  )
}
