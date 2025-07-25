import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authAPI } from "../api/auth"
import type { UserData, ApiError } from "../types/auth"

interface AuthState {
  user: UserData | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  hasCheckedAuth: boolean,

  // Actions
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  setLoading: (loading?: boolean) => void
  setError: (error: string) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasCheckedAuth: false,

      setLoading: (loading = true) => set({ isLoading: loading }),

      setError: (error: string) => set({ error }),

      clearError: () => set({ error: null }),

      logout: async () => {
        try {
          await authAPI.logout()
        } catch (error) {
          console.error("Erreur lors de la déconnexion:", error)
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true })
          const { data } = await authAPI.getProfile()
          set({
            hasCheckedAuth: true,
            user: data as unknown as UserData,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            hasCheckedAuth: true,
          })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasCheckedAuth: state.hasCheckedAuth,
      }),
    },
  ),
)
