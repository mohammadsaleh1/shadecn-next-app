import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isAuthModalOpen: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  openAuthModal: () => void
  closeAuthModal: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isAuthModalOpen: false,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to login')
      }

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        isAuthModalOpen: false,
        error: null
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        isAuthenticated: false,
        user: null
      })
      // Rethrow to let the component handle it (e.g. stop redirect)
      throw error
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, error: null })
  },

  openAuthModal: () => set({ isAuthModalOpen: true, error: null }),
  closeAuthModal: () => set({ isAuthModalOpen: false, error: null }),
}))
