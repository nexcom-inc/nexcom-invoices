import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  userId: string
  organizationId: string
  role: "Owner" | "Admin" | "User"
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: string
  name: string
  users: User[]
  userRole: "Owner" | "Admin" | "User"
}

// ! To delete
interface CreateOrgRequest {
  name: string
  domain: string
  address: string
  language: string
  currency: string
}

interface CreateOrgResponse {
  statusCode: number
  message: string
  data?: {
    org: {
      id: string
      name: string
      createdAt: string
      updatedAt: string
    }
    userRole: "Owner" | "Admin" | "User"
  }
  details?: {
    message: string[]
    error: string
    statusCode: number
  }
}

interface CreateOrgRequest {
  name: string
  domain: string
  address: string
  language: string
  currency: string
}

interface CreateOrgResponse {
  statusCode: number
  message: string
  data?: {
    org: {
      id: string
      name: string
      createdAt: string
      updatedAt: string
    }
    userRole: "Owner" | "Admin" | "User"
  }
  details?: {
    message: string[]
    error: string
    statusCode: number
  }
}

interface OrganizationState {
  currentOrganization: Organization | null
  isLoading: boolean
  error: string | null
  hasCheckedOrganization: boolean

  // Actions
  setCurrentOrganization: (org: Organization) => void
  clearCurrentOrganization: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  checkAndSetOrganization: () => Promise<void>
}

// !API functions to delete
export const organizationAPI = {
  getDefault: async (): Promise<{ data: Organization }> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_INVOICE_URL}/organization/default`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data }
  },
    createOrganization: async (data: CreateOrgRequest): Promise<CreateOrgResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_INVOICE_URL}/organizations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
    const result = await response.json()

    if (!response.ok) {
      throw result
    }

    return result
  }
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set, get) => ({
      currentOrganization: null,
      isLoading: false,
      error: null,
      hasCheckedOrganization: false,

      setCurrentOrganization: (org: Organization) => {
        set({ 
          currentOrganization: org, 
          error: null,
          hasCheckedOrganization: true 
        })
      },

      clearCurrentOrganization: () => {
        set({ 
          currentOrganization: null,
          hasCheckedOrganization: false 
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false })
      },

      checkAndSetOrganization: async () => {
        const { currentOrganization, hasCheckedOrganization } = get()

        // Si on a déjà une organisation et qu'on a déjà vérifié, ne pas refaire
        if (currentOrganization && hasCheckedOrganization) {
          return
        }

        try {
          set({ isLoading: true, error: null })

          const { data } = await organizationAPI.getDefault()

          set({
            currentOrganization: data,
            isLoading: false,
            hasCheckedOrganization: true,
            error: null
          })

        } catch (error) {
          console.error('Erreur lors de la récupération de l\'organisation:', error)
          set({
            currentOrganization: null,
            isLoading: false,
            hasCheckedOrganization: true,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
          })
        }
      }
    }),
    {
      name: "organization-storage",
      partialize: (state) => ({
        currentOrganization: state.currentOrganization,
        hasCheckedOrganization: state.hasCheckedOrganization,
      }),
    }
  )
)