"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string | string[]
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && user?.rol) {
        // Si requiredRole es un array, verificar si el rol del usuario está incluido
        if (Array.isArray(requiredRole)) {
          if (!requiredRole.includes(user.rol)) {
            return null
          }
        } else {
          // Si requiredRole es un string, verificar igualdad exacta
          if (user.rol !== requiredRole) {
            return null
          }
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && user?.rol) {
    // Si requiredRole es un array, verificar si el rol del usuario está incluido
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(user.rol)) {
        return null
      }
    } else {
      // Si requiredRole es un string, verificar igualdad exacta
      if (user.rol !== requiredRole) {
        return null
      }
    }
  }

  return <>{children}</>
}
