import type { UserData, ApiError } from "../types/auth"

class AuthAPI {
  private baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL || "/api"

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        throw {
          response: {
            data: data as ApiError,
          },
        }
      }

      return { data }
    } catch (error) {
      throw error
    }
  }
  async getProfile(): Promise<{ data: { user: UserData } }> {
    return this.request<{ user: UserData }>("/me")
  }

    async logout(): Promise<void> {
    await this.request("/logout", {
      method: "POST",
    })
  }

}

export const authAPI = new AuthAPI()
