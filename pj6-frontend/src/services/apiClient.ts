import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'

/**
 * Centralized HTTP client.
 * - Attaches JWT automatically
 * - Handles 401 → clears auth + redirect
 * - Normalizes errors to ApiError
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// On these endpoints a 401 means bad credentials, not an expired session:
// the error must render inline in the form (a redirect here loops the login page).
const AUTH_401_EXEMPT = ['/auth/login', '/auth/forgot-password']

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const url = error.config?.url ?? ''
    const isAuthEndpoint = AUTH_401_EXEMPT.some(path => url.includes(path))
    if (error.response?.status === 401 && !isAuthEndpoint) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient