"use client"

import { useState, useEffect, createContext, useContext } from 'react'
import { ApiClient } from '@/lib/api'

interface User {
  cedula: string
  rol: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (cedula: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la página
    const token = localStorage.getItem('access_token')
    const rol = localStorage.getItem('user_rol')
    const cedula = localStorage.getItem('user_cedula')

    if (token && rol && cedula) {
      setUser({ cedula, rol })
    }
    
    setIsLoading(false)
  }, [])

  const login = async (cedula: string, password: string) => {
    try {
      const response = await ApiClient.login({ cedula, password })
      
      if (response.status === 'success' && response.data) {
        setUser({ cedula, rol: response.data.rol })
        localStorage.setItem('user_cedula', cedula)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.error || 'Error en la autenticación' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Error de conexión' 
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_rol')
    localStorage.removeItem('user_cedula')
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
