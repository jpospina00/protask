import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import * as authService from '@/services/api/auth'

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  loading: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string; role: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    currentUser: null,
    isAuthenticated: false,
    loading: true,
  })

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      setState({ currentUser: user, isAuthenticated: !!user, loading: false })
    })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const user = await authService.login(email, password)
    setState({ currentUser: user, isAuthenticated: true, loading: false })
  }, [])

  const register = useCallback(async (data: { name: string; email: string; password: string; role: string }) => {
    const user = await authService.register(data)
    setState({ currentUser: user, isAuthenticated: true, loading: false })
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setState({ currentUser: null, isAuthenticated: false, loading: false })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
