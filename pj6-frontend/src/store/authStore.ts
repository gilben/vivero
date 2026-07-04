import { create } from 'zustand'
import type { UserDto } from '@/types/api'

interface AuthState {
  token: string | null
  user: UserDto | null
  isAuthenticated: boolean
  setAuth: (token: string, expiresAt: string, user?: UserDto | null) => void
  clearAuth: () => void
}

function readStoredUser(): UserDto | null {
  try {
    const raw = localStorage.getItem('auth_user')
    return raw ? (JSON.parse(raw) as UserDto) : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>(set => ({
  token: localStorage.getItem('access_token'),
  user: readStoredUser(),
  isAuthenticated: !!localStorage.getItem('access_token'),
  setAuth: (token, _expiresAt, user = null) => {
    localStorage.setItem('access_token', token)
    if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    set({ token, user, isAuthenticated: true })
  },
  clearAuth: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('auth_user')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))