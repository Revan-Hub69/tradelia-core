'use client'

import { useAuth } from '@/components/providers/AppProviders'
import { Badge } from '@/components/ui/badge'

export function AuthDebug() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 p-3 bg-background border rounded-lg shadow-lg text-xs space-y-1 max-w-xs z-50">
      <div className="font-semibold">Auth Debug</div>
      <div className="flex items-center gap-2">
        <span>Status:</span>
        {isLoading ? (
          <Badge variant="outline">Loading...</Badge>
        ) : isAuthenticated ? (
          <Badge variant="default">Authenticated</Badge>
        ) : (
          <Badge variant="outline">Guest</Badge>
        )}
      </div>
      {user && (
        <>
          <div className="truncate">
            <span className="font-medium">Email:</span> {user.email}
          </div>
          {user.displayName && (
            <div className="truncate">
              <span className="font-medium">Name:</span> {user.displayName}
            </div>
          )}
        </>
      )}
    </div>
  )
}